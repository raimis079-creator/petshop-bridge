import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function meta(id){for(let i=0;i<3;i++){try{execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=id,link,slug,status" -o /tmp/m.json`,{encoding:'utf8',env,maxBuffer:9000000});return JSON.parse(fs.readFileSync('/tmp/m.json','utf8'));}catch(e){execSync('sleep 2');}}return {id,ERR:1};}
const groups=[
 ["Pure Beef",[20475,20455]],["Pure Lamb",[20481,20461]],["Pure Chicken",[20478,20458]],["Pure Turkey",[20484,20463]],
 ["Menu Chicken+Carrot",[20493,20469]],["Menu Duck+Pumpkin",[20490,20472]],["Menu Beef+Potato",[20487,20466]],
 ["Junior Pure Beef",[21659]],["Junior Menu Turkey",[21663]],["Junior Menu Chicken",[21661]]
];
const out=[];
for(const [n,ids] of groups){for(const id of ids){const m=meta(id);out.push({recipe:n,id,status:m.status,link:m.link});}}
commit("konsde_links_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
