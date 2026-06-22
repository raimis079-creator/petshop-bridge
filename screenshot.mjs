import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const content=(typeof obj==='string')?obj:JSON.stringify(obj,null,1);
  const b64=Buffer.from(content,'utf8').toString('base64');
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){ try{ return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){ return ''; } }
  function doPut(sha){ const body={message:'res '+name,content:b64,branch:'main'}; if(sha)body.sha=sha; fs.writeFileSync('/tmp/put.json',JSON.stringify(body)); return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/put.json "'+url+'"',{encoding:'utf8'}).trim(); }
  let code=''; for(let i=0;i<5;i++){ const sha=getSha(); code=doPut(sha); if(code==='200'||code==='201') return code; execSync('sleep 2'); } return 'FAIL:'+code;
}
function api(method,p,bodyObj){ let cmd; if(bodyObj){ fs.writeFileSync('/tmp/b.json',JSON.stringify(bodyObj)); cmd=`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`; } else { cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/${p}"`; } try{ return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }catch(e){ return {error:String(e).slice(0,80)}; } }
const out={};
const code=fs.readFileSync('modules/kontekstas_v12.txt','utf8');
const resp=api('PUT','code-snippets/v1/snippets/332',{ name:'Petshop Filtru Kontekstas v12 [VISADA AKTYVUS]', code:code, active:true });
out.id=resp&&resp.id?resp.id:null;
out.active=resp&&typeof resp.active!=='undefined'?resp.active:'?';
out.name=resp&&resp.name?resp.name:'?';
out.has_higiena = (resp&&resp.code)? resp.code.includes('higienos-priemon') : false;
putResult('kontekstas_deploy_1782119757.txt', out);
