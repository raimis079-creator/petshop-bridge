import { execSync } from "child_process";
import fs from "fs";
function putBinary(n,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'img '+n,branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));const r=execSync('curl -s --max-time 50 -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'log',branch:'main',content:Buffer.from(s).toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pt.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pt.json "'+url+'"');}catch(e){}}
let log='';
(async()=>{
  const imgs=['sunims','katems','maistas-sunims'];
  for(const nm of ['upl_cat-sunims-v2.webp','upl_cat-katems-v2.webp']){
    try{
      const b=execSync('curl -s -k --max-time 30 "https://dev.avesa.lt/wp-content/uploads/2026/07/'+nm+'"',{encoding:'buffer',maxBuffer:20000000});
      log+=nm+' bytes '+b.length+'\n';
      putBinary('cat_'+nm.replace(/[^a-z0-9]/gi,'_')+'.png', b);
    }catch(e){log+=nm+' ERR '+e+'\n';}
  }
  putText('_run74.txt',log);
})();
