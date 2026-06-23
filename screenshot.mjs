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
const out={ts:TS, items:[]};

function readRaw(id){
  const r=JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=id,content"`,{encoding:'utf8',env,maxBuffer:20000000}));
  return (r.content&&r.content.raw)||'';
}

// 19751: jau turi zymeklius, reikia TIK base64 fix
// 19747: reikia base64 fix + zymekliai
for(const ID of [19751, 19747]){
  const rec={id:ID};
  const orig=readRaw(ID);
  rec.orig_md5=md5(orig); rec.orig_len=orig.length;
  let m=orig;

  // FIX 1: base64 paveiksliukai (visada bandom)
  const beforeBroken=(m.match(/src="image\/(?:png|jpe?g|gif|webp);base64/gi)||[]).length;
  m=m.replace(/src="image\/((?:png|jpe?g|gif|webp);base64)/gi, 'src="data:image/$1');
  rec.img_fixed=beforeBroken-(m.match(/src="image\/(?:png|jpe?g|gif|webp);base64/gi)||[]).length;

  // FIX 2: zymekliai - tik jei dar nera (be lookbehind, paprasta)
  if(!/Analitin\u0117s\s+sudedamosios\s+dalys/i.test(m)){
    m=m.replace(/(<h3[^>]*>(?:<[^>]+>)*\s*)Sudedamosios(\s+dalys\s*:)/giu, '$1Analitin\u0117s sudedamosios$2');
    rec.analitines_added=true;
  } else { rec.analitines_added=false; }
  if(/Maitinimo\s+norma\s*:/i.test(m)){
    m=m.replace(/Maitinimo\s+norma\s*:/giu, '\u0160\u0117rimo instrukcija:');
    rec.serimas_added=true;
  } else { rec.serimas_added=false; }

  rec.mod_len=m.length; rec.len_diff=m.length-orig.length; rec.changed=(orig!==m);
  // saugiklis: Sudetis: kiekis nepakito
  rec.sudetis_before=(orig.match(/Sud\u0117tis\s*:/gi)||[]).length;
  rec.sudetis_after=(m.match(/Sud\u0117tis\s*:/gi)||[]).length;

  if(rec.changed){
    fs.writeFileSync('/tmp/upd.json', JSON.stringify({content:m}));
    const w=execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/upd.json "https://dev.avesa.lt/wp-json/wp/v2/product/${ID}"`,{encoding:'utf8',env,maxBuffer:20000000});
    try{ rec.write_ok=!!JSON.parse(w).id; }catch(e){ rec.write_ok=false; rec.werr=w.slice(0,80); }
    const after=readRaw(ID);
    rec.lossless_match=(md5(m)===md5(after));
    rec.after_broken=(after.match(/src="image\/(?:png|jpe?g|gif|webp);base64/gi)||[]).length;
    rec.after_good=(after.match(/src="data:image\//gi)||[]).length;
  }
  out.items.push(rec);
  execSync('sleep 0.5');
}
putResult('ambfix2b_'+TS+'.json', JSON.stringify(out,null,2));
console.log('done');
