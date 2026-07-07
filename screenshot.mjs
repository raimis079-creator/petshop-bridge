import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'catlinks',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
let all=[];
for(let p=1;p<=3;p++){
  const r=wp('/wp-json/wp/v2/product_cat?per_page=100&page='+p+'&_fields=slug,link,count');
  let a; try{ a=JSON.parse(r); }catch(e){ break; }
  if(!Array.isArray(a)||!a.length) break;
  a.forEach(c=>all.push({slug:c.slug,link:(c.link||'').replace(DEV,''),count:c.count}));
  if(a.length<100) break;
}
let csv='slug,link,count\n';
all.forEach(c=>csv+='"'+c.slug+'","'+c.link+'",'+c.count+'\n');
putFile('category_links.csv',csv);
putFile('catlinks_meta.json',JSON.stringify({n:all.length}));
