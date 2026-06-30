import { execSync } from "child_process";
import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putBin(name,buf){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }catch(e){}
}
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,200); } }
(async()=>{
  // parsisiunčiu kompozicijos JPG nuotrauką ir įkeliu į GitHub
  exec('curl -sk "https://dev.avesa.lt/wp-content/uploads/2026/06/rink-vandenynas-cat-11.jpg" -o /tmp/compo.jpg');
  const stat = fs.existsSync('/tmp/compo.jpg') ? fs.statSync('/tmp/compo.jpg').size : 0;
  console.log("size:", stat);
  if(stat > 1000){
    putBin('vand_compo_only.jpg', fs.readFileSync('/tmp/compo.jpg'));
  }
})();
