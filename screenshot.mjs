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

// Tiksli josera.de Kids lentele (svoris x amzius)
const newTable='<table>\n<tr><th>Suaugusio svoris</th><th>2 m\u0117n.</th><th>3 m\u0117n.</th><th>4 m\u0117n.</th><th>5\u20136 m\u0117n.</th><th>7\u201312 m\u0117n.</th></tr>\n<tr><td>10 kg</td><td>90\u2013120 g</td><td>140\u2013160 g</td><td>170\u2013180 g</td><td>165\u2013190 g</td><td>160\u2013180 g</td></tr>\n<tr><td>20 kg</td><td>140\u2013170 g</td><td>240\u2013295 g</td><td>310\u2013375 g</td><td>320\u2013390 g</td><td>300\u2013360 g</td></tr>\n<tr><td>30 kg</td><td>190\u2013230 g</td><td>290\u2013350 g</td><td>370\u2013450 g</td><td>410\u2013480 g</td><td>400\u2013450 g</td></tr>\n<tr><td>40 kg</td><td>255\u2013310 g</td><td>400\u2013440 g</td><td>410\u2013530 g</td><td>490\u2013570 g</td><td>480\u2013540 g</td></tr>\n<tr><td>60 kg</td><td>290\u2013355 g</td><td>490\u2013560 g</td><td>580\u2013720 g</td><td>660\u2013800 g</td><td>800\u2013900 g</td></tr>\n<tr><td>80 kg</td><td>390\u2013475 g</td><td>550\u2013650 g</td><td>690\u2013900 g</td><td>820\u20131000 g</td><td>930\u20131000 g</td></tr>\n</table>';

// pakeiciu ESAMA lentele nauja
let m=orig;
out.had_table=/<table[\s\S]*?<\/table>/i.test(m);
if(out.had_table){
  m=m.replace(/<table[\s\S]*?<\/table>/i, newTable);
  out.method='replaced';
} else { out.method='NO_TABLE_FOUND'; }
out.changed=(orig!==m); out.len_diff=m.length-orig.length;
// saugiklis: tik 1 lentele pakeista, analitines/sudetis nepaliesta
out.tables_before=(orig.match(/<table/gi)||[]).length;
out.tables_after=(m.match(/<table/gi)||[]).length;
out.anal_intact=/analitin/i.test(m);
out.sud_intact=((orig.match(/Sud\u0117tis\s*:/gi)||[]).length===(m.match(/Sud\u0117tis\s*:/gi)||[]).length);

if(out.changed && out.method==='replaced' && out.tables_before===out.tables_after && out.sud_intact){
  fs.writeFileSync('/tmp/upd.json', JSON.stringify({content:m}));
  const w=execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/upd.json "https://dev.avesa.lt/wp-json/wp/v2/product/${ID}"`,{encoding:'utf8',env,maxBuffer:20000000});
  try{ out.write_ok=!!JSON.parse(w).id; }catch(e){ out.write_ok=false; }
  const after=readRaw(ID); out.lossless=(md5(m)===md5(after));
  out.after_has_90120=/90\u2013120 g|90.120 g/.test(after);
}
putResult('kidsfix_'+TS+'.json', JSON.stringify(out,null,2));
console.log(JSON.stringify({method:out.method,write:out.write_ok,lossless:out.lossless,t_before:out.tables_before,t_after:out.tables_after}));
