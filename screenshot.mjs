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
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfbW5tMyddID8/ICcnKSE9PSdTazkxWng0JykgcmV0dXJuOwoJQHNldF90aW1lX2xpbWl0KDMwMCk7CglnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OwoJJG89YXJyYXkoJ21hcmtlcic9PidNTk0tWkVSTy1URVNUIHYxJyk7CgoJZnVuY3Rpb24gcHNfc25hcCgkY2lkKXsKCQkkYz13Y19nZXRfcHJvZHVjdCgkY2lkKTsgaWYoISRjKSByZXR1cm4gbnVsbDsKCQkka2lkcz1hcnJheSgpOwoJCWZvcmVhY2goKGFycmF5KSRjLT5nZXRfY2hpbGRfaXRlbXMoKSBhcyAkY2kpewoJCQkkcD0kY2ktPmdldF9wcm9kdWN0KCk7IGlmKCEkcCkgY29udGludWU7CgkJCSRraWRzW109YXJyYXkoJ2lkJz0+JHAtPmdldF9pZCgpLCdxdHknPT4kcC0+Z2V0X3N0b2NrX3F1YW50aXR5KCksJ3NzJz0+JHAtPmdldF9zdG9ja19zdGF0dXMoKSwKCQkJCSdjaV9pbl9zdG9jayc9Pm1ldGhvZF9leGlzdHMoJGNpLCdpc19pbl9zdG9jaycpPyRjaS0+aXNfaW5fc3RvY2soKTonbi9hJywKCQkJCSdjaV92aXNpYmxlJz0+bWV0aG9kX2V4aXN0cygkY2ksJ2lzX3Zpc2libGUnKT8kY2ktPmlzX3Zpc2libGUoKTonbi9hJywKCQkJCSdjaV9wdXJjaGFzYWJsZSc9Pm1ldGhvZF9leGlzdHMoJGNpLCdpc19wdXJjaGFzYWJsZScpPyRjaS0+aXNfcHVyY2hhc2FibGUoKTonbi9hJywKCQkJCSdtYXgnPT5tZXRob2RfZXhpc3RzKCRjaSwnZ2V0X21heF9xdWFudGl0eScpPyRjaS0+Z2V0X21heF9xdWFudGl0eSgpOiduL2EnKTsKCQl9CgkJcmV0dXJuIGFycmF5KCdjb250X2luX3N0b2NrJz0+JGMtPmlzX2luX3N0b2NrKCksJ2NvbnRfc3RhdHVzJz0+JGMtPmdldF9zdG9ja19zdGF0dXMoKSwKCQkJJ2NvbnRfcHVyY2hhc2FibGUnPT4kYy0+aXNfcHVyY2hhc2FibGUoKSwKCQkJJ21pbic9PmdldF9wb3N0X21ldGEoJGNpZCwnX21ubV9taW5fY29udGFpbmVyX3NpemUnLHRydWUpLAoJCQkna2lkcyc9PiRraWRzKTsKCX0KCglmb3JlYWNoKGFycmF5KCdmaWtzdW90YXMnPT4zNDE3Miwnc3VzaWRlayc9PjM0MjQyKSBhcyAkdmFyZD0+JENJRCl7CgkJJHJlcz1hcnJheSgnaWQnPT4kQ0lELCdwcmllcyc9PnBzX3NuYXAoJENJRCkpOwoJCSRrPSRyZXNbJ3ByaWVzJ11bJ2tpZHMnXVswXTsKCQkkdGlkPSRrWydpZCddOyAkb3JpZz0ka1sncXR5J107ICRvcmlnc3M9JGtbJ3NzJ107CgkJJHA9d2NfZ2V0X3Byb2R1Y3QoJHRpZCk7CgkJJHAtPnNldF9zdG9ja19xdWFudGl0eSgwKTsgJHAtPnNldF9zdG9ja19zdGF0dXMoJ291dG9mc3RvY2snKTsgJHAtPnNhdmUoKTsKCQl3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCR0aWQpOyB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRDSUQpOwoJCSRyZXNbJ251bGludGFzJ109YXJyYXkoJ2lkJz0+JHRpZCwnYnV2byc9PiRvcmlnKTsKCQkkcmVzWydwb19udWxpbmltbyddPXBzX3NuYXAoJENJRCk7CgkJLy8gYXRzdGF0b20KCQkkcDI9d2NfZ2V0X3Byb2R1Y3QoJHRpZCk7ICRwMi0+c2V0X3N0b2NrX3F1YW50aXR5KCRvcmlnKTsgJHAyLT5zZXRfc3RvY2tfc3RhdHVzKCRvcmlnc3MpOyAkcDItPnNhdmUoKTsKCQl3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCR0aWQpOyB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRDSUQpOwoJCSRyZXNbJ2F0c3RhdHl0YSddPXdjX2dldF9wcm9kdWN0KCR0aWQpLT5nZXRfc3RvY2tfcXVhbnRpdHkoKTsKCQkkb1skdmFyZF09JHJlczsKCX0KCgkvLyAjNTM5IGZvcm1vcyBmaWx0cmFjaWpvcyBpciBudW90cmF1a29zIGtvZGFzCgkkYz0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIGNvZGUgRlJPTSB7JHBmfXNuaXBwZXRzIFdIRVJFIGlkPTUzOSIpOwoJJG9bJ3M1MzlfbGVuJ109c3RybGVuKCRjKTsKCSRpZHg9YXJyYXkoKTsKCWZvcmVhY2goYXJyYXkoJ2thdGVnb3JpaicsJ2F0cmlidXQnLCdwYV8nLCdzYXZpa2FpbicsJ2Nvc3QnLCdpbWFnZWNyZWF0ZScsJ2NvbXBvc2l0ZScsJ251b3RyYXVrJywndGh1bWJuYWlsJywnd3BfYWpheCcsJ3NhbmRlbCcsJ19wcmljZScpIGFzICR3KXsKCQkkaWR4WyR3XT1zdWJzdHJfY291bnQoc3RydG9sb3dlcigkYyksc3RydG9sb3dlcigkdykpOwoJfQoJJG9bJ3M1Mzlfem9kemlhaSddPSRpZHg7CgkvLyBhamF4IHBhaWVza29zIGZ1bmtjaWphCgkkcG9zPXN0cnBvcygkYywnd3BfYWpheCcpOwoJJG9bJ3M1MzlfYWpheCddPSRwb3M/c3Vic3RyKCRjLG1heCgwLCRwb3MtMjAwKSw1MDAwKTonJzsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCA5OSk7Cg==`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP MnM Zero Test v1', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_mnm3=Sk91Zx4&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
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
