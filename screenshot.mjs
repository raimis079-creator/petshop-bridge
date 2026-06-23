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
const TS=String(Date.now());
const out={ts:TS, checks:{}};

// A. WC write galimybe - sukuriu DRAFT testine kategorija (nesusijes su prekemis), pasitikrinu, istrinu
try{
  // sukuriu test kategorija
  fs.writeFileSync('/tmp/cat.json',JSON.stringify({name:"_bridge_test_"+TS}));
  const c=JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/cat.json "https://dev.avesa.lt/wp-json/wc/v3/products/categories"`,{encoding:'utf8',env,maxBuffer:20000000}));
  if(c.id){
    out.checks.wc_write={ok:true, created_cat_id:c.id};
    // istrinu iskart (cleanup)
    const d=execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -X DELETE "https://dev.avesa.lt/wp-json/wc/v3/products/categories/${c.id}?force=true"`,{encoding:'utf8',env,maxBuffer:20000000});
    out.checks.wc_write.deleted=true;
  } else { out.checks.wc_write={ok:false, raw:JSON.stringify(c).slice(0,150)}; }
}catch(e){ out.checks.wc_write={ok:false, err:e.message.slice(0,120)}; }

// B. code-snippets CREATE galimybe - sukuriu INACTIVE test snippeta, pasitikrinu, deaktyvuoju (DELETE=deaktyvina)
try{
  const snip={name:"_bridge_test_"+TS, code:"// bridge sanity test - safe, does nothing", scope:"global", active:false};
  fs.writeFileSync('/tmp/snip.json',JSON.stringify(snip));
  const s=JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/snip.json "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets"`,{encoding:'utf8',env,maxBuffer:20000000}));
  if(s.id){
    out.checks.snippet_create={ok:true, created_snippet_id:s.id, active:s.active};
    // cleanup: DELETE (pagal runbook DELETE=deaktyvina, force=true->500, tad be force)
    const d=execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -o /dev/null -w "%{http_code}" -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/${s.id}"`,{encoding:'utf8',env,maxBuffer:20000000});
    out.checks.snippet_create.delete_http=d.trim();
  } else { out.checks.snippet_create={ok:false, raw:JSON.stringify(s).slice(0,150)}; }
}catch(e){ out.checks.snippet_create={ok:false, err:e.message.slice(0,120)}; }

putResult('wccheck_'+TS+'.json', JSON.stringify(out,null,2));
console.log(JSON.stringify(out));
