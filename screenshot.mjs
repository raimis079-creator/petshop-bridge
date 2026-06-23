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
// Imu rendered HTML su ps_desc=1
const html=execSync(`curl -sk --max-time 50 "https://dev.avesa.lt/product/ambrosia-begrudis-su-eriena-ir-sviezia-lasisa-sausas-maistas-sunims/?ps_desc=1"`,{encoding:'utf8',maxBuffer:50000000});
// Istraukiu accordion sekciju pavadinimus
const sections=[];
const re=/class="[^"]*psdp-acc-head[^"]*"[^>]*>([^<]+)</gi;
let m; while((m=re.exec(html))){ sections.push(m[1].trim()); }
// alternatyvus - ieskau pagal psdp struktura
const out={ts:TS, found_psdp: html.includes('psdp'), sections};
// bandau kitus selektorius jei tuscia
if(sections.length===0){
  const re2=/<(?:button|div|h[2-4])[^>]*psdp[^>]*>([^<]{3,50})</gi;
  let m2; while((m2=re2.exec(html))){ out.sections.push(m2[1].trim()); }
}
out.html_snippet = html.slice(html.indexOf('psdp')>0?html.indexOf('psdp')-50:0, html.indexOf('psdp')+800);
putResult('ambdom_'+TS+'.json', JSON.stringify(out,null,2));
console.log('sections:'+JSON.stringify(out.sections));
