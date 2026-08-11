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
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfbW5tNCddID8/ICcnKSE9PSdTazkxWng0JykgcmV0dXJuOwoJQHNldF90aW1lX2xpbWl0KDMwMCk7Cgkkbz1hcnJheSgnbWFya2VyJz0+J01OTS1aRVJPLVRFU1QgdjInKTsKCgkvLyBBLiBQaXJtYSBwYXRpa3JpbmFtIGFyIDM0MTcyIGtvbXBvbmVudGFpIG5lcGFsaWVzdGkKCSR0aWtyaT1hcnJheSgyNjA3Nz0+Mzg4LDIxNjA5PT4xNjgwLDI2MDY0PT4yODksMjQwMDk9PjEwNCwyMTU5OT0+NjQzKTsKCSRzdj1hcnJheSgpOwoJZm9yZWFjaCgkdGlrcmkgYXMgJGlkPT4kdHVyaSl7ICRwPXdjX2dldF9wcm9kdWN0KCRpZCk7ICRzdlskaWRdPWFycmF5KCdkYWJhcic9PiRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSwndHVyaSc9PiR0dXJpLCdzcyc9PiRwLT5nZXRfc3RvY2tfc3RhdHVzKCksJ29rJz0+KChpbnQpJHAtPmdldF9zdG9ja19xdWFudGl0eSgpPT09JHR1cmkpKTsgfQoJJG9bJ3N2ZWlrYXRhXzM0MTcyJ109JHN2OwoKCWZ1bmN0aW9uIHBzX3NuYXAyKCRjaWQpewoJCSRjPXdjX2dldF9wcm9kdWN0KCRjaWQpOyBpZighJGMpIHJldHVybiBhcnJheSgnZXJyJz0+J25lcmEnKTsKCQlpZighbWV0aG9kX2V4aXN0cygkYywnZ2V0X2NoaWxkX2l0ZW1zJykpIHJldHVybiBhcnJheSgnZXJyJz0+J25lIE1uTTogJy5nZXRfY2xhc3MoJGMpKTsKCQkka2lkcz1hcnJheSgpOwoJCWZvcmVhY2goKGFycmF5KSRjLT5nZXRfY2hpbGRfaXRlbXMoKSBhcyAkY2kpewoJCQkkcD0kY2ktPmdldF9wcm9kdWN0KCk7IGlmKCEkcCkgY29udGludWU7CgkJCSRraWRzW109YXJyYXkoJ2lkJz0+JHAtPmdldF9pZCgpLCd0Jz0+bWJfc3Vic3RyKCRwLT5nZXRfbmFtZSgpLDAsMzQpLCdxdHknPT4kcC0+Z2V0X3N0b2NrX3F1YW50aXR5KCksJ3NzJz0+JHAtPmdldF9zdG9ja19zdGF0dXMoKSwKCQkJCSdjaV9pbl9zdG9jayc9Pm1ldGhvZF9leGlzdHMoJGNpLCdpc19pbl9zdG9jaycpPygkY2ktPmlzX2luX3N0b2NrKCk/MTowKTonbi9hJywKCQkJCSdjaV92aXNpYmxlJz0+bWV0aG9kX2V4aXN0cygkY2ksJ2lzX3Zpc2libGUnKT8oJGNpLT5pc192aXNpYmxlKCk/MTowKTonbi9hJywKCQkJCSdjaV9wdXJjaCc9Pm1ldGhvZF9leGlzdHMoJGNpLCdpc19wdXJjaGFzYWJsZScpPygkY2ktPmlzX3B1cmNoYXNhYmxlKCk/MTowKTonbi9hJyk7CgkJfQoJCXJldHVybiBhcnJheSgnaW5fc3RvY2snPT4kYy0+aXNfaW5fc3RvY2soKT8xOjAsJ3N0YXR1cyc9PiRjLT5nZXRfc3RvY2tfc3RhdHVzKCksJ3B1cmNoJz0+JGMtPmlzX3B1cmNoYXNhYmxlKCk/MTowLAoJCQknbWluJz0+Z2V0X3Bvc3RfbWV0YSgkY2lkLCdfbW5tX21pbl9jb250YWluZXJfc2l6ZScsdHJ1ZSksJ2tpZHMnPT4ka2lkcyk7Cgl9CgoJLy8gQi4gdGVzdGFzOiBmaWtzdW90YXMgMzQxNzIgaXIgc3VzaWRlamltbyBrb250ZWluZXJpcwoJJFNVUz0oaW50KSgkX0dFVFsnc3VzJ10gPz8gMzQyNDMpOwoJZm9yZWFjaChhcnJheSgnZmlrc3VvdGFzJz0+MzQxNzIsJ3N1c2lkZWsnPT4kU1VTKSBhcyAkdmFyZD0+JENJRCl7CgkJJHByPXBzX3NuYXAyKCRDSUQpOwoJCWlmKGlzc2V0KCRwclsnZXJyJ10pKXsgJG9bJHZhcmRdPWFycmF5KCdpZCc9PiRDSUQsJ2Vycic9PiRwclsnZXJyJ10pOyBjb250aW51ZTsgfQoJCSRrPSRwclsna2lkcyddWzBdOyAkdGlkPSRrWydpZCddOyAkb3JpZz0ka1sncXR5J107ICRvcmlnc3M9JGtbJ3NzJ107CgkJJHA9d2NfZ2V0X3Byb2R1Y3QoJHRpZCk7ICRwLT5zZXRfc3RvY2tfcXVhbnRpdHkoMCk7ICRwLT5zZXRfc3RvY2tfc3RhdHVzKCdvdXRvZnN0b2NrJyk7ICRwLT5zYXZlKCk7CgkJd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkdGlkKTsgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkQ0lEKTsKCQkkcG89cHNfc25hcDIoJENJRCk7CgkJJHAyPXdjX2dldF9wcm9kdWN0KCR0aWQpOyAkcDItPnNldF9zdG9ja19xdWFudGl0eSgkb3JpZyk7ICRwMi0+c2V0X3N0b2NrX3N0YXR1cygkb3JpZ3NzKTsgJHAyLT5zYXZlKCk7CgkJd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkdGlkKTsgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkQ0lEKTsKCQkkb1skdmFyZF09YXJyYXkoJ2lkJz0+JENJRCwnbnVsaW50YXMnPT5hcnJheSgnaWQnPT4kdGlkLCdidXZvJz0+JG9yaWcpLCdwcmllcyc9PiRwciwncG8nPT4kcG8sCgkJCSdhdHN0YXR5dGEnPT53Y19nZXRfcHJvZHVjdCgkdGlkKS0+Z2V0X3N0b2NrX3F1YW50aXR5KCksJ2F0c3RhdHl0YV9zcyc9PndjX2dldF9wcm9kdWN0KCR0aWQpLT5nZXRfc3RvY2tfc3RhdHVzKCkpOwoJfQoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDk5KTsK`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP MnM Zero Test v2', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_mnm4=Sk91Zx4&sus=34243&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
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
