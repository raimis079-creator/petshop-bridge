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
const ID=27130;
function readRaw(id){const r=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));return (r.content&&r.content.raw)||'';}

const orig=readRaw(ID);
const out={ts:TS, id:ID, orig_len:orig.length, orig_md5:md5(orig)};

// Kids analitines (is josera.com) - LT
const analitines='\n<p><strong>Analitin\u0117s sudedamosios dalys:</strong></p>\n<p>Baltymai 25,0 %, riebal\u0173 kiekis 12,0 %, \u017dalia l\u0105stelien\u0105 2,3 %, \u017dali pelenai 6,7 %, kalcis 1,30 %, magnis 0,10 %, fosforas 1,00 %, natris 0,40 %.</p>';
// Kids serimo lentele (josera.com, svoris x amzius)
const serimas='\n<p><strong>\u0160\u0117rimo instrukcija:</strong></p>\n<table>\n<tr><th>Suaugusio svoris</th><th>1,5\u20132 m\u0117n.</th><th>3 m\u0117n.</th><th>4 m\u0117n.</th><th>5\u20136 m\u0117n.</th><th>7\u201312 m\u0117n.</th></tr>\n<tr><td>10 kg</td><td>105\u2013130 g</td><td>140\u2013165 g</td><td>150\u2013175 g</td><td>160\u2013185 g</td><td>160\u2013185 g</td></tr>\n<tr><td>20 kg</td><td>160\u2013185 g</td><td>225\u2013265 g</td><td>245\u2013290 g</td><td>265\u2013310 g</td><td>270\u2013310 g</td></tr>\n<tr><td>30 kg</td><td>205\u2013240 g</td><td>295\u2013345 g</td><td>325\u2013380 g</td><td>355\u2013415 g</td><td>360\u2013425 g</td></tr>\n<tr><td>40 kg</td><td>255\u2013300 g</td><td>365\u2013430 g</td><td>405\u2013475 g</td><td>440\u2013515 g</td><td>450\u2013530 g</td></tr>\n<tr><td>60 kg</td><td>265\u2013310 g</td><td>445\u2013520 g</td><td>510\u2013600 g</td><td>575\u2013675 g</td><td>595\u2013725 g</td></tr>\n</table>\n<p>Nurodyti kiekiai \u2014 vienam gyv\u016bnui per par\u0105, pagal suaugusio \u0161uns svor\u012f. Visada turi b\u016bti \u0161vie\u017eio geriamojo vandens.</p>';

let m=orig;
out.has_analitines_before=/analitin/i.test(m);
out.has_table_before=/<table/i.test(m);
// prikabinu (tik jei dar nera)
if(!out.has_analitines_before) m=m+analitines;
if(!out.has_table_before) m=m+serimas;
out.changed=(orig!==m); out.len_diff=m.length-orig.length;
// saugiklis: sudetis nepakito
out.sud_intact=((orig.match(/Sud\u0117tis\s*:/gi)||[]).length===(m.match(/Sud\u0117tis\s*:/gi)||[]).length);

if(out.changed && out.sud_intact){
  fs.writeFileSync('/tmp/upd.json', JSON.stringify({content:m}));
  const w=execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/upd.json "https://dev.avesa.lt/wp-json/wp/v2/product/${ID}"`,{encoding:'utf8',env,maxBuffer:20000000});
  try{ out.write_ok=!!JSON.parse(w).id; }catch(e){ out.write_ok=false; }
  const after=readRaw(ID);
  out.lossless=(md5(m)===md5(after));
  out.after_analitines=/analitin/i.test(after);
  out.after_table=/<table[\s\S]*?kg/i.test(after);
}
putResult('kids1_'+TS+'.json', JSON.stringify(out,null,2));
console.log(JSON.stringify({changed:out.changed,write:out.write_ok,lossless:out.lossless,anal:out.after_analitines,table:out.after_table}));
