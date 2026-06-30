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
  exec('curl -sk "https://dev.avesa.lt/wp-content/uploads/2026/06/ontario-chicken-salmon-95g-v2.jpg" -o /tmp/c17057.jpg');
  if(fs.existsSync('/tmp/c17057.jpg') && fs.statSync('/tmp/c17057.jpg').size > 1000){
    console.log("size:", fs.statSync('/tmp/c17057.jpg').size);
    putBin('verify_17057_image.jpg', fs.readFileSync('/tmp/c17057.jpg'));
  }
})();
