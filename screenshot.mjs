import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
function putResult(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/pp.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/pp.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS=String(Date.now());
const ID=18154;
function readRaw(id){const r=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));return (r.content&&r.content.raw)||'';}

const NEWTABLE='<table>\n<tr><th>\u0160uns svoris</th><th>Neaktyvus / senyvas</th><th>Normaliai aktyvus</th><th>Aktyvus</th></tr>\n<tr><td>5 kg</td><td>45 g</td><td>60 g</td><td>75 g</td></tr>\n<tr><td>10 kg</td><td>80 g</td><td>110 g</td><td>135 g</td></tr>\n<tr><td>20 kg</td><td>135 g</td><td>180 g</td><td>230 g</td></tr>\n<tr><td>30 kg</td><td>180 g</td><td>250 g</td><td>315 g</td></tr>\n<tr><td>40 kg</td><td>225 g</td><td>310 g</td><td>390 g</td></tr>\n<tr><td>60 kg</td><td>305 g</td><td>420 g</td><td>530 g</td></tr>\n<tr><td>80 kg</td><td>380 g</td><td>520 g</td><td>655 g</td></tr>\n</table>';

const out={id:ID, ts:TS};
const before=readRaw(ID);
out.before_len=before.length;
out.before_md5=md5(before);
out.table_count_before=(before.match(/<table>/g)||[]).length;

// Sudetis guard
const sm=before.match(/Sud\u0117tis:[\s\S]*?<\/p>/);
out.sudetis_found=!!sm;
const sudetis_before = sm?sm[0]:"";
out.sudetis_md5_before = md5(sudetis_before);

// Analitiniu guard
const am=before.match(/Analitin[\s\S]*?<\/p>\s*<p>[\s\S]*?<\/p>/);
const anal_before = am?am[0]:"";
out.anal_md5_before = md5(anal_before);

if(out.table_count_before!==1){ out.ABORT="Ne lygiai 1 lentele - "+out.table_count_before; putResult("fest_apply_"+TS+".json",JSON.stringify(out,null,2)); console.log("ABORT"); process.exit(0); }

const after = before.replace(/<table>[\s\S]*?<\/table>/, NEWTABLE);
out.after_len=after.length;
// pre-write checks
out.new_table_ok = after.indexOf("<td>45 g</td><td>60 g</td><td>75 g</td>")>-1;
const sm2=after.match(/Sud\u0117tis:[\s\S]*?<\/p>/);
out.sudetis_intact_prewrite = sm2 && md5(sm2[0])===out.sudetis_md5_before;
const am2=after.match(/Analitin[\s\S]*?<\/p>\s*<p>[\s\S]*?<\/p>/);
out.anal_intact_prewrite = am2 && md5(am2[0])===out.anal_md5_before;

if(!out.new_table_ok || !out.sudetis_intact_prewrite || !out.anal_intact_prewrite){
  out.ABORT="Pre-write guard failed"; putResult("fest_apply_"+TS+".json",JSON.stringify(out,null,2)); console.log("ABORT guard"); process.exit(0);
}

// WRITE via wp/v2 raw
fs.writeFileSync('/tmp/body.json', JSON.stringify({content: after}));
const wc=execSync(`curl -sk --max-time 40 -o /tmp/wresp.json -w "%{http_code}" -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/body.json "https://dev.avesa.lt/wp-json/wp/v2/product/${ID}"`,{encoding:'utf8',env,maxBuffer:50000000}).trim();
out.write_http=wc;

// RE-READ verify
execSync('sleep 2');
const after2=readRaw(ID);
out.after2_len=after2.length;
out.after2_md5=md5(after2);
out.lossless_match = md5(after)===out.after2_md5;
out.new_table_live = after2.indexOf("<td>45 g</td><td>60 g</td><td>75 g</td>")>-1;
out.old_anomaly_gone = after2.indexOf("<td>75 g</td><td>85 g</td>")===-1;
const sm3=after2.match(/Sud\u0117tis:[\s\S]*?<\/p>/);
out.sudetis_intact_live = sm3 && md5(sm3[0])===out.sudetis_md5_before;
const am3=after2.match(/Analitin[\s\S]*?<\/p>\s*<p>[\s\S]*?<\/p>/);
out.anal_intact_live = am3 && md5(am3[0])===out.anal_md5_before;

putResult("fest_apply_"+TS+".json", JSON.stringify(out,null,2));
console.log("DONE "+TS);
