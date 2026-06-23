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

// LEGER (kateems)
const leger_anal='\n<p><strong>Analitin\u0117s sudedamosios dalys:</strong></p>\n<p>Baltymai 35,0 %, riebal\u0173 kiekis 10,0 %, \u017dalia l\u0105stelien\u0105 5,8 %, \u017dali pelenai 6,8 %, kalcis 1,30 %, fosforas 1,05 %, magnis 0,09 %, natris 0,40 %, kalis 0,60 %, taurinas 1 500 mg. Metabolizuojama energija: 14,5 MJ/kg (3 468 kcal/kg).</p>';
const leger_ser='\n<p><strong>\u0160\u0117rimo instrukcija:</strong></p>\n<table>\n<tr><th>Kat\u0117s svoris</th><th>Paros norma (g)</th></tr>\n<tr><td>2\u20133 kg</td><td>30\u201345 g</td></tr>\n<tr><td>3\u20134 kg</td><td>45\u201360 g</td></tr>\n<tr><td>4\u20135 kg</td><td>60\u201380 g</td></tr>\n<tr><td>5\u20137 kg</td><td>80\u2013110 g</td></tr>\n<tr><td>7\u201310 kg</td><td>110\u2013140 g</td></tr>\n</table>\n<p>Nurodyti kiekiai \u2014 vienam gyv\u016bnui per par\u0105. Ma\u017eiau aktyvioms ar nutuk\u0119s linkusioms kat\u0117ms galima duoti 25 % ma\u017eiau. Visada turi b\u016bti \u0161vie\u017eio geriamojo vandens.</p>';
// KITTEN
const kitten_anal='\n<p><strong>Analitin\u0117s sudedamosios dalys:</strong></p>\n<p>Baltymai 35,0 %, riebal\u0173 kiekis 22,0 %, \u017dalia l\u0105stelien\u0105 2,0 %, \u017dali pelenai 7,0 %, kalcis 1,40 %, fosforas 1,10 %, magnis 0,09 %, taurinas 1 600 mg.</p>';
const kitten_ser='\n<p><strong>\u0160\u0117rimo instrukcija:</strong></p>\n<table>\n<tr><th>Ka\u010diuko am\u017eius</th><th>Paros norma (g)</th></tr>\n<tr><td>2 m\u0117n.</td><td>50 g</td></tr>\n<tr><td>3 m\u0117n.</td><td>45 g</td></tr>\n<tr><td>4 m\u0117n.</td><td>40 g</td></tr>\n<tr><td>5 m\u0117n.</td><td>35 g</td></tr>\n<tr><td>6 m\u0117n.</td><td>30 g</td></tr>\n<tr><td>7 m\u0117n.+</td><td>20\u201330 g</td></tr>\n</table>\n<p>Nurodyti kiekiai \u2014 vienam ka\u010diukui per par\u0105. Visada turi b\u016bti \u0161vie\u017eio geriamojo vandens.</p>';

const MAP={
  18058:{a:leger_anal,s:leger_ser}, 18054:{a:leger_anal,s:leger_ser}, 18051:{a:leger_anal,s:leger_ser},
  27132:{a:kitten_anal,s:kitten_ser}
};
const out={ts:TS, items:[]};
for(const ID of Object.keys(MAP)){
  const rec={id:ID};
  const orig=readRaw(ID); rec.orig_md5=md5(orig);
  let m=orig;
  rec.had_anal=/analitin/i.test(m); rec.had_table=/<table/i.test(m);
  if(!rec.had_anal) m=m+MAP[ID].a;
  if(!rec.had_table) m=m+MAP[ID].s;
  rec.changed=(orig!==m); rec.len_diff=m.length-orig.length;
  rec.sud_intact=((orig.match(/Sud\u0117tis\s*:/gi)||[]).length===(m.match(/Sud\u0117tis\s*:/gi)||[]).length);
  if(rec.changed && rec.sud_intact){
    fs.writeFileSync('/tmp/upd.json', JSON.stringify({content:m}));
    const w=execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/upd.json "https://dev.avesa.lt/wp-json/wp/v2/product/${ID}"`,{encoding:'utf8',env,maxBuffer:20000000});
    try{ rec.write_ok=!!JSON.parse(w).id; }catch(e){ rec.write_ok=false; }
    const after=readRaw(ID); rec.lossless=(md5(m)===md5(after));
    rec.after_anal=/analitin/i.test(after); rec.after_table=/<table[\s\S]*?kg|m\u0117n/i.test(after);
  } else { rec.skipped=true; }
  out.items.push(rec);
  execSync('sleep 0.4');
}
out.summary={written:out.items.filter(i=>i.write_ok).length, lossless:out.items.filter(i=>i.lossless).length};
putResult('legerkitten_'+TS+'.json', JSON.stringify(out,null,2));
console.log(JSON.stringify(out.summary));
