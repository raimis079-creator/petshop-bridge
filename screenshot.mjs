import { execSync } from "child_process";
import fs from "fs";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

const stages={};
try{
  stages.s1='fetch start';
  const shResp=execSync(`curl -s -H "Authorization: Bearer ${tok}" "https://api.github.com/repos/${repo}/contents/screenshots/monge_sku_html.json?ref=main&t=${Date.now()}"`,{encoding:'utf8',maxBuffer:500000000});
  stages.s2='fetched len='+shResp.length;
  const shJson=JSON.parse(shResp);
  stages.s3='parsed keys='+Object.keys(shJson).join(',').slice(0,100);
  stages.s3b='size='+shJson.size+' encoding='+shJson.encoding;
  const sh=JSON.parse(Buffer.from(shJson.content,'base64').toString('utf-8'));
  stages.s4='decoded SKU count='+Object.keys(sh).length;
}catch(e){
  stages.error=String(e).slice(0,500);
}
commit("diag_fetch.json",JSON.stringify(stages,null,1));
console.log("done");
