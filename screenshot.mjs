import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const b64=Buffer.from((typeof obj==='string')?obj:JSON.stringify(obj,null,1),'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/p.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/p.json "'+url+'"',{encoding:'utf8'}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS="1782155663";
function wc(p){ return JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/${p}"`,{encoding:'utf8',env,maxBuffer:40000000})); }
const MARK=[
 ['Sudetis',/sud[eė]t(is|ies)/i],
 ['Analitines',/analitin/i],
 ['Priedai',/pried(ai|ų|u)/i],
 ['Serimas',/([sš][eė]rim|paros norm|rekomenduojam[a-z]* (kiek|dozes|paros))/i],
 ['Ispejimai',/[iį]sp[eė]jim/i],
 ['Pagaminta',/pagaminta|gamintojas/i],
 ['Medziagos',/(med[zž]iag|pagamintas i[sš])/i],
];
function strip(h){ return (h||'').replace(/<[^>]+>/g,' ').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').trim(); }
function analyze(id, src, cat, p){
  const desc=p.description||''; const sd=p.short_description||'';
  const both=desc+' \n '+sd;
  const found=MARK.filter(([n,re])=>re.test(both)).map(([n])=>n);
  return { id, src, cat, name:(p.name||'').slice(0,40), desc_len:strip(desc).length, sd_len:strip(sd).length, markers:found, snippet:strip(desc).slice(0,420) };
}
const ids=[
 [18014,'Legacy','maistas'],[33452,'ZB','maistas'],[17333,'Legacy','higiena'],
 [33900,'ZB','narvas'],[31874,'VF','dubenelis'],[27879,'VF','tualetas']
];
const out=[];
for(const [id,src,cat] of ids){ try{ out.push(analyze(id,src,cat, wc('products/'+id+'?_fields=id,name,description,short_description'))); }catch(e){ out.push({id,err:e.message.slice(0,50)}); } }
// papildomai keli maistai is paieskos (Exclusion/Monge/Farmina)
for(const q of ['Exclusion','Monge','Farmina']){
  try{ const r=wc('products?search='+q+'&per_page=2&status=publish&_fields=id,name,description,short_description'); for(const p of (r||[])){ out.push(analyze(p.id,'paieska:'+q,'maistas',p)); } }catch(e){}
}
putResult('desc_markers_'+TS+'.txt', out);
