import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'b2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 40 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:30000000,timeout:45000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" "'+DEV+u+'"',{encoding:'utf8',timeout:20000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
// SUNU veisliu ID (be kaciu, be maisto)
const dogBreeds=[3223,3220,3222,3210,3224,3225,3216,3208,3212,3214,3221,3213,3209,3219,3206,3217,3211,3218,3205];
const out={breeds:[]};
// gaunam kiekvieno link+title+status
const raw=get('/wp-json/wp/v2/pages?include='+dogBreeds.join(',')+'&per_page=30&_fields=id,title,slug,link,status');
let arr=[]; try{ arr=JSON.parse(raw); }catch(e){ out.err=raw.slice(0,200); }
for(const b of arr){
  const path=b.link.replace(DEV,'');
  out.breeds.push({id:b.id, title:(b.title&&b.title.rendered)||'', slug:b.slug, path, status:b.status, http:code(path)});
}
putFile('breeds2.json',JSON.stringify(out));
