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
const TS=String(Date.now());
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const ID=12459;
function readRaw(id){const r=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));return (r.content&&r.content.raw)||'';}

const orig=readRaw(ID);
const out={ts:TS, id:ID, orig_len:orig.length, orig_md5:md5(orig)};

// Tik lentele (be antrastes "Serimo instrukcija" - ji jau yra tekste)
// Prikabinu turinio gale svariu HTML
const tableBlock='\n<p><strong>\u0160\u0117rimo normos:</strong></p>\n<table>\n<tr><th>\u0160uns svoris</th><th>Paros norma (g)</th></tr>\n<tr><td>25 kg</td><td>285\u2013330 g</td></tr>\n<tr><td>30 kg</td><td>325\u2013380 g</td></tr>\n<tr><td>35 kg</td><td>365\u2013425 g</td></tr>\n<tr><td>40 kg</td><td>405\u2013470 g</td></tr>\n<tr><td>50 kg</td><td>480\u2013555 g</td></tr>\n<tr><td>70 kg</td><td>615\u2013715 g</td></tr>\n<tr><td>90 kg</td><td>745\u2013860 g</td></tr>\n</table>';

// SAUGIKLIS: ar jau yra lentele?
if(/<table/i.test(orig)){
  out.skipped=true; out.reason='jau turi lentele';
} else {
  const m=orig + tableBlock;
  out.changed=true; out.len_diff=m.length-orig.length;
  fs.writeFileSync('/tmp/upd.json', JSON.stringify({content:m}));
  const w=execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/upd.json "https://dev.avesa.lt/wp-json/wp/v2/product/${ID}"`,{encoding:'utf8',env,maxBuffer:20000000});
  try{ out.write_ok=!!JSON.parse(w).id; }catch(e){ out.write_ok=false; }
  const after=readRaw(ID);
  out.lossless=(md5(m)===md5(after));
  out.after_has_table=/<table[\s\S]*?25\s*kg/i.test(after);
}
putResult('euk1b_'+TS+'.json', JSON.stringify(out,null,2));
console.log(JSON.stringify({changed:out.changed,write:out.write_ok,lossless:out.lossless,table:out.after_has_table}));
