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
const TS="1782141627";
const out={};
function cs(method,p){ const cmd=`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`; return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
// istrinti temp snippetus 504, 505
for(const id of [504,505]){ try{ const r=cs('DELETE','snippets/'+id); out['del_'+id]=r&&(r.id||r.deleted||'ok'); }catch(e){ out['del_'+id]='err'; } }
// patvirtinti DRY rodo triusiukas
const html=execSync(`curl -sk --max-time 50 "https://dev.avesa.lt/?petshop_attr_grauzrusis=dry&k=ps2026"`,{encoding:'utf8',maxBuffer:10000000});
const m=html.match(/Viso:\s*<b>(\d+)<\/b>.*?PARSED:\s*<b>(\d+)<\/b>.*?REVIEW:\s*<b>(\d+)<\/b>/s);
out.dry=m?{viso:+m[1],parsed:+m[2],review:+m[3]}:'no match';
out.has_triusiukas = /Dekoratyvinis triu\u0161iukas/.test(html);
out.fin=putResult('cleanup_'+TS+'.txt', out);
