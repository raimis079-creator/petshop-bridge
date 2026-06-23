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
const TS="1782201757";
const out={};
// wc/v3 description (filtruota?) ir wp/v2 raw post_content
try{
  const wc=JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products/19751?_fields=id,description"`,{encoding:'utf8',env,maxBuffer:20000000}));
  const d=wc.description||'';
  out.wc_len=d.length;
  out.wc_has_sudetis=/Sud\u0117tis|sudet/i.test(d);
  out.wc_has_analitines=/Analitin/i.test(d);
  out.wc_has_feeding_table=/131|440|Paros norma/i.test(d);
  out.wc_tail=d.slice(-400);
}catch(e){ out.wc_err=e.message.slice(0,80); }
// wp/v2 raw
try{
  const wp=JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/19751?context=edit&_fields=id,content"`,{encoding:'utf8',env,maxBuffer:20000000}));
  if(wp.content){ out.wp_raw_len=(wp.content.raw||'').length; out.wp_rendered_len=(wp.content.rendered||'').length; }
  else out.wp_note=JSON.stringify(wp).slice(0,150);
}catch(e){ out.wp_err=e.message.slice(0,80); }
putResult('chk_'+TS+'.json', JSON.stringify(out));
