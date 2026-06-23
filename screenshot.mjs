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

function tbl(title, rows){
  let t='\n<p><strong>'+title+':</strong></p>\n<table>\n<tr><th>\u0160uns svoris</th><th>Paros norma (g)</th></tr>\n';
  for(const r of rows){ t+='<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>\n'; }
  t+='</table>';
  return t;
}
// EU lenteles (is eukanuba.eu)
const SN='\u0160\u0117rimo normos';
const T_ADULT_LARGE = tbl(SN,[['25 kg','285\u2013330 g'],['30 kg','325\u2013380 g'],['35 kg','365\u2013425 g'],['40 kg','405\u2013470 g'],['50 kg','480\u2013555 g'],['70 kg','615\u2013715 g'],['90 kg','745\u2013860 g']]);
const T_ADULT_MEDIUM = tbl(SN,[['10 kg','140\u2013160 g'],['12 kg','160\u2013185 g'],['15 kg','190\u2013220 g'],['18 kg','215\u2013250 g'],['20 kg','235\u2013270 g'],['25 kg','280\u2013320 g']]);
const T_ADULT_SM_LAMB = tbl(SN,[['2 kg','45\u201350 g'],['4 kg','70\u201375 g'],['6 kg','90\u2013100 g'],['8 kg','110\u2013120 g'],['10 kg','125\u2013140 g'],['15 kg','165\u2013185 g'],['20 kg','200\u2013225 g'],['25 kg','235\u2013260 g'],['30 kg','265\u2013290 g']]);
// Puppy - paprastesnis (orientacinis, jauniausias amzius)
const T_PUPPY_LARGE = tbl(SN+' (1\u20133 m\u0117n.)',[['2\u20134 kg','150\u2013235 g'],['6\u20138 kg','310\u2013375 g'],['10\u201315 kg','435\u2013570 g'],['20\u201330 kg','610\u2013800 g'],['40\u201350 kg','645\u2013970 g']]);
const T_PUPPY_MEDIUM = tbl(SN+' (1\u20133 m\u0117n.)',[['1\u20132 kg','100\u2013155 g'],['3\u20134 kg','205\u2013250 g'],['5\u20136 kg','290\u2013325 g'],['8\u201310 kg','370\u2013430 g'],['15\u201320 kg','360\u2013565 g']]);
const T_PUPPY_SMALL = tbl(SN+' (1\u20133 m\u0117n.)',[['1\u20132 kg','100\u2013155 g'],['3\u20134 kg','205\u2013250 g'],['5\u20136 kg','270\u2013325 g'],['8\u201310 kg','240\u2013395 g']]);
const T_SENIOR_LARGE = tbl(SN,[['25 kg','260\u2013300 g'],['30 kg','300\u2013345 g'],['35 kg','335\u2013390 g'],['40 kg','370\u2013430 g'],['50 kg','440\u2013510 g'],['70 kg','565\u2013655 g']]);

// priskyrimas: ID -> lentele
const MAP={
  14793:T_PUPPY_LARGE, 14768:T_PUPPY_LARGE, 12462:T_PUPPY_LARGE,
  14791:T_PUPPY_SMALL, // Puppy S/M Lamb -> small
  14478:T_ADULT_SM_LAMB, 12463:T_ADULT_SM_LAMB, // Adult Small
  14477:T_SENIOR_LARGE, // Senior L/XL
  12915:T_ADULT_LARGE, // Adult L/XL Lamb
  12464:T_ADULT_MEDIUM, // Adult Medium
  12461:T_PUPPY_MEDIUM, // Puppy Medium
  12460:T_PUPPY_SMALL  // Puppy Small
};
function readRaw(id){const r=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));return (r.content&&r.content.raw)||'';}

const out={ts:TS, items:[]};
for(const ID of Object.keys(MAP)){
  const rec={id:ID};
  try{
    const orig=readRaw(ID); rec.orig_md5=md5(orig); rec.orig_len=orig.length;
    // saugiklis: ar jau yra lentele?
    if(/<table/i.test(orig)){ rec.skipped=true; rec.reason='jau turi lentele'; out.items.push(rec); continue; }
    const m=orig + MAP[ID];
    rec.len_diff=m.length-orig.length;
    fs.writeFileSync('/tmp/upd.json', JSON.stringify({content:m}));
    const w=execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/upd.json "https://dev.avesa.lt/wp-json/wp/v2/product/${ID}"`,{encoding:'utf8',env,maxBuffer:20000000});
    try{ rec.write_ok=!!JSON.parse(w).id; }catch(e){ rec.write_ok=false; }
    const after=readRaw(ID);
    rec.lossless=(md5(m)===md5(after));
    rec.after_table=/<table[\s\S]*?kg/i.test(after);
  }catch(e){ rec.err=e.message.slice(0,70); }
  out.items.push(rec);
  execSync('sleep 0.4');
}
out.summary={total:out.items.length, written:out.items.filter(i=>i.write_ok).length, lossless:out.items.filter(i=>i.lossless).length, skipped:out.items.filter(i=>i.skipped).length};
putResult('euk11_'+TS+'.json', JSON.stringify(out,null,2));
console.log(JSON.stringify(out.summary));
