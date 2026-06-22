import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){ const content=(typeof obj==='string')?obj:JSON.stringify(obj,null,1); const b64=Buffer.from(content,'utf8').toString('base64'); const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN; const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'res '+name,content:b64,branch:'main'}; if(sha)body.sha=sha; fs.writeFileSync('/tmp/put.json',JSON.stringify(body)); return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/put.json "'+url+'"',{encoding:'utf8'}).trim(); }
function gc(id){ try{ return JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products/categories/${id}?_fields=id,name,slug,count"`,{encoding:'utf8',env})); }catch(e){ return {error:1}; } }
const out={};
out.c82=gc(82);
// papildai sunims, dubeneliai sunims paieska
function find(q,re){ try{ const r=JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products/categories?per_page=100&search=${q}&_fields=id,name,slug"`,{encoding:'utf8',env,maxBuffer:10000000})); return Array.isArray(r)?r.filter(c=>re.test(c.slug)).map(c=>c.id+':'+c.slug):[]; }catch(e){ return ['err']; } }
out.papildai=find('papild',/papild|vitamin/);
out.dubeneliai=find('dubenel',/dubenel/);
out.vasara=find('vesinam',/vesin|vasar/);
out.pagalba=find('pagalb',/pagalb|pirmoj/);
out.put=putResult('hstate.txt', out);
