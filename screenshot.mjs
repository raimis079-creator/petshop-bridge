import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const b64=Buffer.from((typeof obj==='string')?obj:JSON.stringify(obj,null,1),'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/p.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/p.json "'+url+'"',{encoding:'utf8'}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS="1782123825";
function patch(id,order){ fs.writeFileSync('/tmp/m.json',JSON.stringify({menu_order:order})); return JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X PATCH -d @/tmp/m.json "https://dev.avesa.lt/wp-json/wp/v2/menu-items/${id}"`,{encoding:'utf8',env})); }
const out={};
// unikalus sekos orderiai: Guoliai17, Vesinantys18, Baseinai19, Transportavimo20, Keliones21, Narvai22, Apranga23
const plan=[[34110,18],[34111,19],[34089,20],[3168,21],[3169,22],[34106,23]];
out.patched=[];
for(const [id,o] of plan){ try{ const r=patch(id,o); out.patched.push(id+' -> '+r.menu_order); }catch(e){ out.patched.push(id+' ERR'); } }
out.fin=putResult('menufix_'+TS+'.txt', out);
