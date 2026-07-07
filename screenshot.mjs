import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'sp',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
// Code Snippets REST: sukuriam probe kuris outputina shipping options kaip JSON i transiienta, tada skaitom
// Pirma paziurim ar code-snippets REST veikia
function wp(path,method,data){
  let cmd='curl -sk -u "$WPU:$WPP" ';
  if(method==='POST'){ cmd+='-X POST -H "Content-Type: application/json" -d \''+JSON.stringify(data).replace(/'/g,"'\\''")+'\' '; }
  else if(method) cmd+='-X '+method+' ';
  cmd+='"'+DEV+path+'"';
  try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC:'+String(e).slice(0,60); }
}
const out={};
// 1. ar code-snippets REST prieinamas
out.cs_list=wp('/wp-json/code-snippets/v1/snippets?_fields=id,name,active').slice(0,600);
putFile('shipprobe.json',JSON.stringify(out));
console.log('done');
