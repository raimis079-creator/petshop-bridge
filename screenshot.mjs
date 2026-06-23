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
function readRaw(id){const r=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));return (r.content&&r.content.raw)||'';}

// Festival 18154 + 26449 + 25415 (visi Festival, ta pati linija)
const analitines='\n<p><strong>Analitin\u0117s sudedamosios dalys:</strong></p>\n<p>Baltymai 26,0 %, riebal\u0173 kiekis 16,0 %, \u017dalia l\u0105stelien\u0105 2,5 %, \u017dali pelenai 6,7 %, kalcis 1,40 %, fosforas 0,95 %, natris 0,40 %, magnis 0,10 %. Metabolizuojama energija: 16,1 MJ/kg.</p>';
// Festival - aktyvus pasaras, Josera standartine adult aktyvaus lentele
const serimas='\n<p><strong>\u0160\u0117rimo instrukcija:</strong></p>\n<table>\n<tr><th>\u0160uns svoris</th><th>Normaliai aktyvus</th><th>Aktyvus</th></tr>\n<tr><td>5 kg</td><td>75 g</td><td>85 g</td></tr>\n<tr><td>10 kg</td><td>125 g</td><td>145 g</td></tr>\n<tr><td>20 kg</td><td>210 g</td><td>245 g</td></tr>\n<tr><td>30 kg</td><td>285 g</td><td>330 g</td></tr>\n<tr><td>40 kg</td><td>350 g</td><td>410 g</td></tr>\n<tr><td>60 kg</td><td>475 g</td><td>555 g</td></tr>\n<tr><td>80 kg</td><td>595 g</td><td>695 g</td></tr>\n</table>\n<p>Nurodyti kiekiai \u2014 vienam gyv\u016bnui per par\u0105, pagal suaugusio \u0161uns svor\u012f. Pritaikykite pagal \u0161uns b\u016bkl\u0119 ir aktyvum\u0105. Visada turi b\u016bti \u0161vie\u017eio geriamojo vandens.</p>';

const out={ts:TS, items:[]};
for(const ID of [18154, 26449, 25415]){
  const rec={id:ID};
  const orig=readRaw(ID); rec.orig_md5=md5(orig);
  let m=orig;
  rec.had_anal=/analitin/i.test(m); rec.had_table=/<table/i.test(m);
  if(!rec.had_anal) m=m+analitines;
  if(!rec.had_table) m=m+serimas;
  rec.changed=(orig!==m); rec.len_diff=m.length-orig.length;
  rec.sud_intact=((orig.match(/Sud\u0117tis\s*:/gi)||[]).length===(m.match(/Sud\u0117tis\s*:/gi)||[]).length);
  if(rec.changed && rec.sud_intact){
    fs.writeFileSync('/tmp/upd.json', JSON.stringify({content:m}));
    const w=execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/upd.json "https://dev.avesa.lt/wp-json/wp/v2/product/${ID}"`,{encoding:'utf8',env,maxBuffer:20000000});
    try{ rec.write_ok=!!JSON.parse(w).id; }catch(e){ rec.write_ok=false; }
    const after=readRaw(ID); rec.lossless=(md5(m)===md5(after));
    rec.after_anal=/analitin/i.test(after); rec.after_table=/<table[\s\S]*?kg/i.test(after);
  } else { rec.skipped=true; rec.reason=rec.had_table?'jau turi lentele':(rec.had_anal?'jau turi anal':'no change'); }
  out.items.push(rec);
  execSync('sleep 0.4');
}
putResult('festival_'+TS+'.json', JSON.stringify(out,null,2));
console.log('done');
