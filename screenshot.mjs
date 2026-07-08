import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fa2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
let h=execSync('curl -s -L "https://petshop.lt/apie-mus" 2>/dev/null',{encoding:'utf8',maxBuffer:30000000,timeout:60000});
putFile('full_apie.html', h);
console.log('len', h.length);
