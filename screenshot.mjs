import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
// reps: dog matrix, cat 2-row, dog+storage, age-matrix(fixhead)
const CHK={17299:'375 g',16210:'117 g',17296:'Laikyti v\u0117sioje',17216:'b2b-black'};
const out={};
for(const id of Object.keys(CHK)){
  let h="";try{execSync(`curl -skL -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?p=${id}&ps_desc=1" -o /tmp/fe.html`,{env,maxBuffer:200000000});h=fs.readFileSync('/tmp/fe.html','utf8');}catch(e){}
  out[id]={panel: h.includes('\u0160\u0117rimo')||h.includes('rekomendacij'), b2b: h.includes('b2b-black'), table: h.includes('<table'), check: h.includes(CHK[id]), len:h.length};
}
commit("ont_B_fe_"+Date.now()+".json",JSON.stringify(out,null,1));
console.log(JSON.stringify(out,null,1));
