import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'du',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 30 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:60000000,timeout:32000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
const NEEDLES = ['naujas-augintinis-2','naujas-augintinis-3','34574','34576'];
let out='';

// 1. Ar identiski? (content.raw hash palyginimas)
const c = {};
for(const id of [34574,34576]){
  const r = api('/wp-json/wp/v2/pages/'+id+'?context=edit&_fields=id,slug,content,parent,menu_order');
  try{ const j=JSON.parse(r); c[id] = (j.content&&j.content.raw)||''; out += 'id '+id+' slug='+j.slug+' parent='+j.parent+' len='+c[id].length+'\n'; }
  catch(e){ out += 'id '+id+' READ ERR\n'; }
}
out += 'identiski (34574 === 34576): '+(c[34574] && c[34574] === c[34576])+'\n\n';

// 2. Ar turi vaiku (parent = 34574/34576)?
for(const id of [34574,34576]){
  const r = api('/wp-json/wp/v2/pages?parent='+id+'&_fields=id,slug&per_page=20');
  out += 'vaikai '+id+': '+(r.trim()==='[]'?'nera':r.slice(0,200))+'\n';
}
out += '\n';

// 3. Nav meniu - ar yra menu item i siuos ID?
const menus = api('/wp-json/wp/v2/menu-items?per_page=100&_fields=id,title,url,object,object_id');
let menuHit = 'nera';
if(menus && menus[0]==='['){
  try{
    const arr = JSON.parse(menus);
    const hits = arr.filter(m => [34574,34576].includes(m.object_id) || (m.url||'').includes('naujas-augintinis-'));
    menuHit = hits.length ? JSON.stringify(hits) : 'nera (is '+arr.length+' menu item)';
  }catch(e){ menuHit='parse err'; }
} else menuHit = 'menu-items endpoint neprieinamas: '+menus.slice(0,80);
out += 'MENIU: '+menuHit+'\n\n';

// 4. Vidines nuorodos: visu pages + posts content paieska
let pages = [];
for(let p=1;p<=3;p++){
  const r = api('/wp-json/wp/v2/pages?per_page=100&status=publish&context=edit&_fields=id,slug,content&page='+p);
  if(!r || r[0]!=='[') break;
  let a; try{ a=JSON.parse(r); }catch(e){ break; }
  if(!a.length) break;
  pages = pages.concat(a); if(a.length<100) break;
}
const posts = api('/wp-json/wp/v2/posts?per_page=100&status=publish&context=edit&_fields=id,slug,content');
let postArr=[]; try{ postArr=JSON.parse(posts); }catch(e){}
out += 'skenuota: '+pages.length+' pages + '+postArr.length+' posts\n';
const found = [];
for(const item of pages.concat(postArr)){
  if(item.id===34574||item.id===34576) continue;
  const raw = (item.content&&item.content.raw)||'';
  for(const n of NEEDLES){
    if(raw.includes(n)) found.push(item.slug+' (id '+item.id+') mini "'+n+'"');
  }
}
out += 'VIDINES NUORODOS: '+(found.length?found.join('\n  '):'NERA')+'\n\n';

// 5. Snippetai 587, 594
for(const sid of [587,594]){
  const r = api('/wp-json/code-snippets/v1/snippets/'+sid);
  try{
    const j=JSON.parse(r);
    const code=j.code||'';
    const hits = NEEDLES.filter(n=>code.includes(n));
    out += 'snippet '+sid+': '+(hits.length?('MINI '+hits.join(',')):'svarus')+'\n';
  }catch(e){ out += 'snippet '+sid+': read err\n'; }
}
out += '\n';

// 6. Homepage 34543 - ar baneris veda i teisinga slug'a
const hp = api('/wp-json/wp/v2/pages/34543?context=edit&_fields=content');
try{
  const raw = JSON.parse(hp).content.raw||'';
  out += 'homepage baneris href /naujas-augintinis/: '+(raw.includes('"/naujas-augintinis/"')||raw.includes("'/naujas-augintinis/'"))+'\n';
  out += 'homepage mini -2 arba -3: '+(raw.includes('naujas-augintinis-2')||raw.includes('naujas-augintinis-3'))+'\n';
}catch(e){ out += 'homepage read err\n'; }

// 7. HTTP statusai
for(const u of ['/naujas-augintinis/','/naujas-augintinis-2/','/naujas-augintinis-3/']){
  try{
    const cd = execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" -L --max-time 15 "'+DEV+u+'"',{encoding:'utf8',timeout:17000,env:{...process.env,WPU,WPP}}).trim();
    out += cd+'  '+u+'\n';
  }catch(e){}
}
putFile('dupusage.txt', out);
