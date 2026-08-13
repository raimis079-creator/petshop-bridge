process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'APPLY DIAG', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
/* 1. ka realiai turi snippetas 2868 */
const g1=await wp('/wp-json/code-snippets/v1/snippets/2868');
const j=js(g1.text)||{};
out.snip={status:g1.status, pav:j.name, aktyvus:j.active, kodo_ilgis:(j.code||'').length,
          turi_break:(j.code||'').includes("break; }"), turi_pakeistos:(j.code||'').includes('$pakeistos')};
/* 2. maza apply porcija su RAW atsakymu */
try{
  const raw=execSync('curl -sk -w "\\nHTTP:%{http_code} T:%{time_total}" "'+B+'/?ps_ms=Ms8tD3&rezimas=apply&grupe=saugu&riba=5" --max-time 240',{encoding:'utf8',maxBuffer:60*1024*1024});
  out.raw=raw.slice(0,1500);
  out.apply=js(raw);
}catch(e){ out.err=String(e).slice(0,300); }
const body={message:'res diag',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/adiag.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/adiag.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
