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
const ID=19751;
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const out={ts:TS, id:ID};

// 1. Skaitau raw (lossless)
const r=JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${ID}?context=edit&_fields=id,content"`,{encoding:'utf8',env,maxBuffer:20000000}));
const orig=(r.content&&r.content.raw)||'';
out.orig_len=orig.length;
out.orig_md5=md5(orig);

// 2. Du tikslus zymekliu pakeitimai (tik antrastes, ne turinys)
// a) "Sudedamosios dalys:" (analitines) -> "Analitines sudedamosios dalys:"
//    SVARBU: keiciu tik kur antraste yra <h3>...Sudedamosios dalys:... (analitiniu blokas)
//    "Sudetis:" lieka nepaliesta
let modified=orig;
// Tikslus: <h3>...>Sudedamosios dalys:</...></h3> -> Analitines variantas
modified=modified.replace(/(<h3[^>]*>(?:<[^>]+>)*\s*)(Sudedamosios\s+dalys\s*:)/giu,
  '$1Analitin\u0117s sudedamosios dalys:');
// b) "Maitinimo norma:" -> "Serimo instrukcija:" (su LT raidemis)
modified=modified.replace(/Maitinimo\s+norma\s*:/giu, '\u0160\u0117rimo instrukcija:');

out.mod_len=modified.length;
out.mod_md5=md5(modified);
out.changed = (orig!==modified);
out.len_diff = modified.length - orig.length;

// 3. SAUGIKLIS: patikrinu, kad pakeista TIK tai, ka norejom.
// Suskaiciuoju, kiek kartu pasikeite kiekvienas zymeklis
out.replaced_analitines = (orig.match(/Sudedamosios\s+dalys\s*:/giu)||[]).length;
out.replaced_serimas = (orig.match(/Maitinimo\s+norma\s*:/giu)||[]).length;
// Patikrinu kad "Sudetis:" liko nepaliesta
out.sudetis_intact = (orig.match(/(?<!sudedamosios\s)Sud\u0117tis\s*:/giu)||[]).length === (modified.match(/(?<!sudedamosios\s)Sud\u0117tis\s*:/giu)||[]).length;

// 4. RASAU per wp/v2 raw (lossless PUT)
fs.writeFileSync('/tmp/upd.json', JSON.stringify({content: modified}));
const w=execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/upd.json "https://dev.avesa.lt/wp-json/wp/v2/product/${ID}"`,{encoding:'utf8',env,maxBuffer:20000000});
try{ const wj=JSON.parse(w); out.write_ok=!!wj.id; out.write_raw_len=(wj.content&&wj.content.raw||'').length; }
catch(e){ out.write_ok=false; out.write_err=w.slice(0,150); }

// 5. Perskaitau atgal ir patikrinu MD5 (ar issaugojo lossless)
const r2=JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${ID}?context=edit&_fields=id,content"`,{encoding:'utf8',env,maxBuffer:20000000}));
const after=(r2.content&&r2.content.raw)||'';
out.after_len=after.length;
out.after_md5=md5(after);
out.lossless_match = (md5(modified)===md5(after)); // ar issaugota tiksliai ka rasem

putResult('amb1_'+TS+'.json', JSON.stringify(out,null,2));
console.log(JSON.stringify(out));
