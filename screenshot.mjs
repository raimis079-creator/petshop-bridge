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
const IDS=[19715,19720,19725,19730,19735,19740,19756,19760,19765,19770,19775];
const out={ts:TS, items:[]};
function readRaw(id){const r=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));return (r.content&&r.content.raw)||'';}

for(const ID of IDS){
  const rec={id:ID};
  try{
    const orig=readRaw(ID);
    rec.orig_len=orig.length; rec.orig_md5=md5(orig);
    let m=orig;
    // base64 fix (jei staiga butu - saugiklis)
    m=m.replace(/src="image\/((?:png|jpe?g|gif|webp);base64)/gi, 'src="data:image/$1');
    // zymekliai (be lookbehind)
    if(!/Analitin\u0117s\s+sudedamosios\s+dalys/i.test(m)){
      m=m.replace(/(<h3[^>]*>(?:<[^>]+>)*\s*)Sudedamosios(\s+dalys\s*:)/giu, '$1Analitin\u0117s sudedamosios$2');
    }
    m=m.replace(/Maitinimo\s+norma\s*:/giu, '\u0160\u0117rimo instrukcija:');
    rec.changed=(orig!==m); rec.len_diff=m.length-orig.length;
    // saugiklis: Sudetis: nepakito
    rec.sud_before=(orig.match(/Sud\u0117tis\s*:/gi)||[]).length;
    rec.sud_after=(m.match(/Sud\u0117tis\s*:/gi)||[]).length;
    rec.sud_intact=(rec.sud_before===rec.sud_after);
    rec.has_analitines=/Analitin\u0117s\s+sudedamosios/i.test(m);
    rec.has_serimo=/\u0160\u0117rimo\s+instrukcija/i.test(m);
    if(rec.changed && rec.sud_intact){
      fs.writeFileSync('/tmp/upd.json', JSON.stringify({content:m}));
      const w=execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/upd.json "https://dev.avesa.lt/wp-json/wp/v2/product/${ID}"`,{encoding:'utf8',env,maxBuffer:20000000});
      try{ rec.write_ok=!!JSON.parse(w).id; }catch(e){ rec.write_ok=false; }
      const after=readRaw(ID);
      rec.lossless=(md5(m)===md5(after));
    } else { rec.skipped=true; rec.reason=rec.sud_intact?'no change':'SUDETIS GUARD FAILED'; }
  }catch(e){ rec.err=e.message.slice(0,80); }
  out.items.push(rec);
  execSync('sleep 0.4');
}
out.summary={
  total:out.items.length,
  written:out.items.filter(i=>i.write_ok).length,
  lossless_ok:out.items.filter(i=>i.lossless).length,
  guard_fail:out.items.filter(i=>i.reason==='SUDETIS GUARD FAILED').length
};
putResult('amb11_'+TS+'.json', JSON.stringify(out,null,2));
console.log(JSON.stringify(out.summary));
