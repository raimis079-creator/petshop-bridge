import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/pp.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/pp.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS="1782197442";
const out={};
// 1) ar snippetas aktyvus?
try{ const ls=execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets?per_page=100"`,{encoding:'utf8',env,maxBuffer:20000000});
  const arr=JSON.parse(ls); out.imprisk_snippets=arr.filter(s=>/Import-Risk/i.test(s.name)).map(s=>({id:s.id,active:s.active}));
}catch(e){ out.ls_err=e.message.slice(0,80); }
// 2) be ids - http kodas + body pradzia
try{ const r=execSync(`curl -sk --max-time 60 -w "\nHTTP:%{http_code}" -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?ps_imprisk=1&k=ps2026"`,{encoding:'utf8',env,maxBuffer:50000000});
  out.noids_resp=r.slice(0,2500);
}catch(e){ out.noids_err=e.message.slice(0,120); }
putResult('imprisk3_'+TS+'.json', JSON.stringify(out));
