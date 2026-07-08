import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ha',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 30 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:60000000,timeout:32000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
let out='';
// 1. Visi pages (published), context=edit → content.raw
let all = [];
for(let page=1; page<=4; page++){
  const r = api('/wp-json/wp/v2/pages?per_page=100&status=publish&context=edit&_fields=id,slug,title,content&page='+page);
  if(!r || r[0] !== '[') break;
  let arr; try{ arr = JSON.parse(r); }catch(e){ break; }
  if(!arr.length) break;
  all = all.concat(arr);
  if(arr.length < 100) break;
}
out += 'TOTAL PAGES: '+all.length+'\n\n';
const noH1 = [], withH1 = [], multiH1 = [];
for(const p of all){
  const raw = (p.content && p.content.raw) || '';
  const count = (raw.match(/<h1[\s>]/gi)||[]).length;
  const title = (p.title && p.title.raw) || '';
  if(count === 0) noH1.push(p.slug+' (id '+p.id+') | title: '+title.slice(0,50));
  else if(count === 1) withH1.push(p.slug);
  else multiH1.push(p.slug+' ('+count+' h1)');
}
out += '--- PAGES BE H1 ('+noH1.length+') ---\n';
noH1.forEach(s=>out += '  '+s+'\n');
out += '\n--- PAGES SU 1 H1 ('+withH1.length+') ---\n  '+withH1.join(', ')+'\n';
out += '\n--- PAGES SU >1 H1 ('+multiH1.length+') ---\n  '+multiH1.join(', ')+'\n\n';

// 2. Post types sarasas (ar veisles yra CPT?)
const types = api('/wp-json/wp/v2/types');
try{
  const t = JSON.parse(types);
  out += '--- POST TYPES ---\n  '+Object.keys(t).join(', ')+'\n\n';
}catch(e){ out += 'types ERR\n\n'; }

// 3. Veisliu puslapiai - kur jie? patikrinu ar yra CPT 'veisle' arba pages
const breedTest = api('/wp-json/wp/v2/pages?search=veisl&per_page=5&_fields=id,slug,title');
out += '--- pages su "veisl" ---\n'+breedTest.slice(0,400)+'\n\n';

// 4. Posts (blog) - ar visi turi entry-title h1 (theme lygiu)?
const posts = api('/wp-json/wp/v2/posts?per_page=100&status=publish&_fields=id,slug&context=edit');
try{
  const pa = JSON.parse(posts);
  out += '--- POSTS count: '+pa.length+' (theme deda h1.entry-title, tikrinta 1 pavyzdyje)\n';
}catch(e){ out += 'posts ERR\n'; }
putFile('h1audit.txt', out);
