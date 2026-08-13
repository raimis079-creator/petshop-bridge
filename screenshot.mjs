process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'APPLY VISOS', ts:new Date().toISOString(), porcijos:[]};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
let viso=0;
for (let i=1;i<=4;i++){
  try{
    const raw=execSync('curl -sk "'+B+'/?ps_ms=Ms8tD3&rezimas=apply&grupe=saugu&riba=70" --max-time 420',{encoding:'utf8',maxBuffer:60*1024*1024});
    const j=js(raw);
    if(!j){ out.porcijos.push({i:i, klaida: raw.slice(0,200)}); break; }
    viso += (j.pakeista||0);
    out.porcijos.push({i:i, pakeista:j.pakeista, liko_saugu:j.saugu, rizikinga:j.rizikinga, nepavyko:j.nepavyko});
    if(!j.pakeista) break;
  }catch(e){ out.porcijos.push({i:i, err:String(e).slice(0,180)}); break; }
  await new Promise(r=>setTimeout(r,2000));
}
out.viso_pakeista=viso;
/* galutinis DRY — kiek liko */
try{
  const raw=execSync('curl -sk "'+B+'/?ps_ms=Ms8tD3&rezimas=dry" --max-time 420',{encoding:'utf8',maxBuffer:60*1024*1024});
  const j=js(raw)||{}; delete j.sarasas;
  out.galutinis=j;
}catch(e){ out.dry_err=String(e).slice(0,180); }
const body={message:'res visos',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/visos.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/visos.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
