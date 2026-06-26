import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function readRaw(id){for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});return (JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw||'';}catch(e){execSync('sleep 3');}}return null;}
const MARK='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>';
const groups=[["Pure Beef",[20475,20455]],["Pure Lamb",[20481,20461]],["Pure Chicken",[20478,20458]],["Pure Turkey",[20484,20463]],["Menu Chicken+Carrot",[20493,20469]],["Menu Duck+Pumpkin",[20490,20472]],["Menu Beef+Potato",[20487,20466]],["Junior Pure Beef",[21659]],["Junior Menu Turkey",[21663]],["Junior Menu Chicken",[21661]]];
const JUN=[21659,21663,21661];
const out=[];
for(const [n,ids] of groups){for(const id of ids){
  const T=readRaw(id); if(T===null){out.push({id,n,ERR:1});continue;}
  const styledA=T.indexOf('padding: 7px;"><b>\u0160uns svoris</b>')>-1;
  const styledJ=T.indexOf('padding: 7px;"><b>Am\u017eius')>-1;
  const plainOldA=T.indexOf('<th>\u0160uns svoris</th>')>-1;
  const plainOldJ=T.indexOf('<th>Am\u017eius (m\u0117n.)</th>')>-1;
  out.push({id,n,rekom:T.indexOf("Rekomenduojamas kiekis per par")>-1,nMark:T.split(MARK).length-1,nTab:T.split("<table").length-1,styled:(JUN.includes(id)?styledJ:styledA),plain_old:(JUN.includes(id)?plainOldJ:plainOldA)});
}}
commit("verify_state_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
