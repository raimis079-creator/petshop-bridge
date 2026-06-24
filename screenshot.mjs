import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/pp.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/pp.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS=String(Date.now()); const out={ts:TS,checks:{}};
try{const p=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products/19751?_fields=id,name,status"`,{encoding:'utf8',env,maxBuffer:20000000}));out.checks.wc_v3_read={ok:!!p.id,id:p.id,status:p.status};}catch(e){out.checks.wc_v3_read={ok:false};}
try{const s=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/512?k=ps2026"`,{encoding:'utf8',env,maxBuffer:20000000}));out.checks.snippet_512={ok:!!s.id,id:s.id,active:s.active,name:(s.name||"").slice(0,40)};}catch(e){out.checks.snippet_512={ok:false};}
try{const r=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/18154?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));const raw=(r.content&&r.content.raw)||"";out.checks.wp_v2_raw={ok:raw.length>0,len:raw.length,md5:crypto.createHash('md5').update(raw,'utf8').digest('hex'),festival_table_ok:raw.indexOf("45 g")>-1};}catch(e){out.checks.wp_v2_raw={ok:false};}
// snippet rasymo galimybe - tik patikrinu ar galiu skaityti snippet sarasa (rasymo teise)
try{const list=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets?k=ps2026&_fields=id,name,active"`,{encoding:'utf8',env,maxBuffer:20000000}));out.checks.snippets_list={ok:Array.isArray(list),count:Array.isArray(list)?list.length:0};}catch(e){out.checks.snippets_list={ok:false};}
putResult("sanity2_"+TS+".json", JSON.stringify(out,null,2));
console.log("DONE "+TS);
