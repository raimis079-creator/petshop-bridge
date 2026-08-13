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
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfbmF2MyddID8/ICcnKSE9PSdOdjMzS3A3JykgcmV0dXJuOwoJQHNldF90aW1lX2xpbWl0KDE4MCk7Cgkkbz1hcnJheSgnbWFya2VyJz0+J05BVjMgdjEnKTsKCSRkaXI9V1BNVV9QTFVHSU5fRElSOwoJLy8gMS4gS29raWEgcmlua2luaXUgdmVyc2lqYSBkZXYnZQoJJGY9JGRpci4nL3BldHNob3Atcmlua2luaWFpLnBocCc7Cgkkb1sncmlua2luaWFpJ109ZmlsZV9leGlzdHMoJGYpP2FycmF5KCdzaXplJz0+ZmlsZXNpemUoJGYpLCdtZDUnPT5tZDVfZmlsZSgkZiksJ210aW1lJz0+ZGF0ZSgnWS1tLWQgSDppJyxmaWxlbXRpbWUoJGYpKSk6J05FUkEnOwoJaWYoZmlsZV9leGlzdHMoJGYpKXsKCQkkYz1maWxlX2dldF9jb250ZW50cygkZik7CgkJcHJlZ19tYXRjaCgiL2NvbnN0IFZFUlNJSkFccyo9XHMqJyhbXiddKyknLyIsJGMsJG0pOyAkb1sndmVyc2lqYSddPSRtWzFdPz8nPyc7CgkJJG9bJ3R1cmlfa2FibGVsaSddPXN0cnBvcygkYywnaW5wdXRtb2RlPSJkZWNpbWFsIicpIT09ZmFsc2U7CgkJJG9bJ3R1cmlfZHAnXT1zdHJwb3MoJGMsJ2lzc2F1Z290aV9kcCcpIT09ZmFsc2U7Cgl9CgkkZz0kZGlyLicvcGV0c2hvcC1yaW5raW5pdS1saWt1Y2lhaS5waHAnOwoJJG9bJ2xpa3VjaWFpJ109ZmlsZV9leGlzdHMoJGcpP2FycmF5KCdzaXplJz0+ZmlsZXNpemUoJGcpLCdtZDUnPT5tZDVfZmlsZSgkZykpOidORVJBJzsKCgkvLyAyLiBOYXZpZ2FjaWpvcyBtZXRvZGFzIGlzIGthdGFsb2dvCgkkaz1AZmlsZV9nZXRfY29udGVudHMoJGRpci4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCcpOwoJJG9bJ2thdF9zaXplJ109c3RybGVuKCRrKTsKCSRwb3M9c3RycG9zKCRrLCdmdW5jdGlvbiBuYXZpZ2FjaWphJyk7Cgkkb1snbmF2X2tvZGFzJ109JHBvcyE9PWZhbHNlP2Jhc2U2NF9lbmNvZGUoc3Vic3RyKCRrLG1heCgwLCRwb3MtNjAwKSw2MDAwKSk6JyhuZXJhc3RhKSc7CgkvLyBrdXIgbmF2aWdhY2lqYSBrdmllY2lhbWEga2l0dW9zZQoJZm9yZWFjaChhcnJheSgncGV0c2hvcC1ha2Npam9zLnBocCcsJ3BldHNob3AtZ2F2aW1hcy5waHAnLCdwZXRzaG9wLWF2LXRpZWtpbWFzLnBocCcsJ3BldHNob3AtZGVzay5waHAnKSBhcyAkeCl7CgkJJGMyPUBmaWxlX2dldF9jb250ZW50cygkZGlyLicvJy4keCk7IGlmKCEkYzIpIGNvbnRpbnVlOwoJCSRwMj1zdHJwb3MoJGMyLCduYXZpZ2FjaWphJyk7CgkJJG9bJ2t2aWV0aW1hc18nLiR4XT0kcDIhPT1mYWxzZT9zdWJzdHIoJGMyLG1heCgwLCRwMi0yMDApLDQwMCk6JyhuZWt2aWVjaWEpJzsKCX0KCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCA5OSk7Cg==`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP ZZ Nav3 v1', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_nav3=Nv33Kp7&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
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
