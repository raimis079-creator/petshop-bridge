import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'lu',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 30 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:5000000,timeout:35000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={};
// site logo (id 308 pagal memory) + id3257 (logo mark)
for(const id of [308,3257,14923]){
  out['m'+id]=get('/wp-json/wp/v2/media/'+id+'?_fields=id,source_url,media_details').slice(0,600);
}
putFile('logourl.json',JSON.stringify(out));
