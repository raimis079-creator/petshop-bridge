import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/pp.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/pp.json "'+url+'"',{encoding:'utf8',maxBuffer:200000000}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS="1782165213";
const out={};
try{
  // sukurti snippeta
  let php=fs.readFileSync('psaudit.php','utf8').replace(/^\uFEFF?<\?php\s*/,'');
  fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'Petshop Katalogo Auditas v1 (read-only)',scope:'global',active:true,code:php}));
  const cr=execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/sn.json "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets"`,{encoding:'utf8',env,maxBuffer:20000000});
  let snid=0; try{ snid=JSON.parse(cr).id; }catch(e){ out.create_raw=cr.slice(0,200); }
  out.snippet_id=snid;
  execSync('sleep 3');
  // paleisti audita (visas katalogas)
  const json=execSync(`curl -sk --max-time 290 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?ps_audit=1&k=ps2026"`,{encoding:'utf8',env,maxBuffer:200000000});
  out.audit_len=json.length;
  putResult('psaudit_'+TS+'.json', json);
  out.ok=true;
}catch(e){ out.fatal=e.message.slice(0,200); }
putResult('psaudit_meta_'+TS+'.json', JSON.stringify(out));
