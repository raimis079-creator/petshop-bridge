// RINK-RECON4-0811
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B = 'https://dev.avesa.lt';
const U = process.env.WP_USER, P = (process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH = 'Basic ' + Buffer.from(U+':'+P).toString('base64');
const TOK = process.env.GH_TOKEN || '';
fs.mkdirSync('screenshots',{recursive:true});

async function wp(path, opts={}){
  try{
    const r = await fetch(B+path, {...opts, headers:{'Authorization':AUTH,'Content-Type':'application/json',...(opts.headers||{})}});
    const t = await r.text();
    return {status:r.status, text:t};
  }catch(e){ return {status:0, text:String(e)}; }
}
function jsonSafe(t){ const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x;})); try{return JSON.parse(t.slice(i));}catch(e){return null;} }

const out = {marker:'RINK-RECON4-0811', ts:new Date().toISOString()};

// 1. TEMP snippet: DB recon for MnM bundles
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfYXR0cnMnXSA/PyAnJykhPT0nQXQ2NlFwMScpIHJldHVybjsKCUBzZXRfdGltZV9saW1pdCgyNDApOwoJJGlkcz1hcnJheV9tYXAoJ2ludHZhbCcsZXhwbG9kZSgnLCcsICRfR0VUWydpZHMnXSA/PyAnJykpOwoJJG89YXJyYXkoJ21hcmtlcic9PidBVFRSUyB2MScsJ24nPT5jb3VudCgkaWRzKSwnaXRlbXMnPT5hcnJheSgpKTsKCWZvcmVhY2goJGlkcyBhcyAkaWQpewoJCSRwPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcCkgY29udGludWU7CgkJJGc9ZnVuY3Rpb24oJHR4KXVzZSgkaWQpeyAkdD13Y19nZXRfcHJvZHVjdF90ZXJtcygkaWQsJHR4LGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSk7IHJldHVybiBpc193cF9lcnJvcigkdCk/YXJyYXkoKTokdDsgfTsKCQkkaW1nPXdwX2dldF9hdHRhY2htZW50X2ltYWdlX3VybCgkcC0+Z2V0X2ltYWdlX2lkKCksJ3RodW1ibmFpbCcpID86ICcnOwoJCSRvWydpdGVtcyddW109YXJyYXkoJ2lkJz0+JGlkLAoJCQknY2F0cyc9PndjX2dldF9wcm9kdWN0X3Rlcm1zKCRpZCwncHJvZHVjdF9jYXQnLGFycmF5KCdmaWVsZHMnPT4nc2x1Z3MnKSksCgkJCSdtb25vJz0+JGcoJ3BhX21vbm9wcm90ZWluJyksJ2dydWRhaSc9PiRnKCdwYV9iZV9ncnVkdScpLCdzcGVjJz0+JGcoJ3BhX3NwZWNpYWxpX21pdHliYScpLAoJCQknZ3JhbSc9PiRnKCdwYV9wYWt1b3Rlc19keWRpcycpLCdpbWcnPT4kaW1nKTsKCX0KCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCA5OSk7Cg==`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP ZZ Attrs Pull v1', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_attrs=At66Qp1&ids=15864,15867,15964,16072,16075,16078,16292,16295,16298,16302,16305,16311,16317,16942,17048,17051,17057,17060,17156,17159,17179,17232,17250,17309,17312,17386,17421,17493,17499,17529,17538,17541,17544,17547,17550,17609,17615,17618,17621,17641,17644,17647,17808,17814,18369,18468,18512,18515,18518,18521,18605,18608,18611,19045,19086,19089,19092,19095,19098,19104,19309,19387,19399,19405,19408,19417,19440,19452,19475,19483,19488,19492,19500,19504,19530,19545,19549,19557,19562,19566,19570,19574,19578,19582,19586,19590,19594,19598,19602,19685,19692,19708,21139,21141,21577,21583,21589,21599,21609,21613,21615,21617,22297,22299,22302,22983,23464,23468,23472,23474,23476,23478,23480,23488,23796,23801,23807,23810,23825,23831,23858,24009,24368,24614,24626,25267,26064,26066,26074,26077,26080,26083,26461&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
  out.recon = jsonSafe(res);
  if(!out.recon) out.recon_raw = res.slice(0,3000);
} catch(e){ out.recon_err = String(e).slice(0,500); }

// 3. Deactivate temp snippet
if(out.snip_id){
  const d = await wp('/wp-json/code-snippets/v1/snippets/'+out.snip_id, {method:'POST', body:JSON.stringify({active:false})});
  out.snip_deact = d.status;
}

// 4. Write result via Contents API
const fn = 'screenshots/rinkrec_'+Date.now()+'.json';
const body = {message:'rinkrec result', content: Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const pr = await fetch('https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/'+fn, {method:'PUT', headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'bridge'}, body:JSON.stringify(body)});
console.log('putResult', pr.status, fn);
fs.writeFileSync(fn.replace('screenshots/','screenshots/local_'), JSON.stringify(out).slice(0,500));
