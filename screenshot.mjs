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
const ID=18159;
function readRaw(id){const r=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));return (r.content&&r.content.raw)||'';}

const orig=readRaw(ID);
const out={ts:TS, id:ID, orig_len:orig.length, orig_md5:md5(orig)};

const analitines='\n<p><strong>Analitin\u0117s sudedamosios dalys:</strong></p>\n<p>Baltymai 20,0 %, riebal\u0173 kiekis 8,0 %, \u017dalia l\u0105stelien\u0105 2,7 %, \u017dali pelenai 5,8 %, kalcis 1,10 %, fosforas 0,80 %, natris 0,50 %, magnis 0,10 %. Metabolizuojama energija: 14,5 MJ/kg (3477 kcal/kg).</p>';
const serimas='\n<p><strong>\u0160\u0117rimo instrukcija:</strong></p>\n<table>\n<tr><th>\u0160uns svoris</th><th>Neaktyvus / senyvas</th><th>Normaliai aktyvus</th><th>Aktyvus</th></tr>\n<tr><td>5 kg</td><td>50 g</td><td>65 g</td><td>70 g</td></tr>\n<tr><td>10 kg</td><td>90 g</td><td>120 g</td><td>150 g</td></tr>\n<tr><td>20 kg</td><td>150 g</td><td>200 g</td><td>255 g</td></tr>\n<tr><td>30 kg</td><td>200 g</td><td>270 g</td><td>345 g</td></tr>\n<tr><td>40 kg</td><td>250 g</td><td>335 g</td><td>425 g</td></tr>\n<tr><td>60 kg</td><td>335 g</td><td>455 g</td><td>580 g</td></tr>\n<tr><td>80 kg</td><td>415 g</td><td>570 g</td><td>725 g</td></tr>\n</table>\n<p>Nurodyti kiekiai \u2014 vienam gyv\u016bnui per par\u0105, pagal suaugusio \u0161uns svor\u012f. Pritaikykite pagal \u0161uns b\u016bkl\u0119 ir aktyvum\u0105. Visada turi b\u016bti \u0161vie\u017eio geriamojo vandens.</p>';

let m=orig;
out.had_anal=/analitin/i.test(m); out.had_table=/<table/i.test(m);
if(!out.had_anal) m=m+analitines;
if(!out.had_table) m=m+serimas;
out.changed=(orig!==m); out.len_diff=m.length-orig.length;
out.sud_intact=((orig.match(/Sud\u0117tis\s*:/gi)||[]).length===(m.match(/Sud\u0117tis\s*:/gi)||[]).length);
if(out.changed && out.sud_intact){
  fs.writeFileSync('/tmp/upd.json', JSON.stringify({content:m}));
  const w=execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/upd.json "https://dev.avesa.lt/wp-json/wp/v2/product/${ID}"`,{encoding:'utf8',env,maxBuffer:20000000});
  try{ out.write_ok=!!JSON.parse(w).id; }catch(e){ out.write_ok=false; }
  const after=readRaw(ID); out.lossless=(md5(m)===md5(after));
  out.after_anal=/analitin/i.test(after); out.after_table=/<table[\s\S]*?kg/i.test(after);
}
putResult('balance1_'+TS+'.json', JSON.stringify(out,null,2));
console.log(JSON.stringify({changed:out.changed,write:out.write_ok,lossless:out.lossless,anal:out.after_anal,table:out.after_table}));
