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
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfa2F0J10gPz8gJycpIT09J0t0NDRXejgnKSByZXR1cm47CglAc2V0X3RpbWVfbGltaXQoMzAwKTsKCWdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7Cgkkbz1hcnJheSgnbWFya2VyJz0+J0tBVEFMT0dBUyB2MScpOwoKCS8vIDEuIEthdGVnb3JpanUgbWVkaXMgKHN1IGNvdW50KQoJJGNhdHM9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdC50ZXJtX2lkIGlkLHQubmFtZSx0LnNsdWcsdHQucGFyZW50LHR0LmNvdW50IEZST00geyRwZn10ZXJtcyB0CgkJSk9JTiB7JHBmfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV9pZD10LnRlcm1faWQgV0hFUkUgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JyBBTkQgdHQuY291bnQ+MAoJCU9SREVSIEJZIHR0LnBhcmVudCx0Lm5hbWUiLEFSUkFZX0EpOwoJJG9bJ2NhdHMnXT0kY2F0czsKCgkvLyAyLiBwYV9wYWt1b3Rlc19keWRpcyB2aXNpIHRlcm1pbmFpIHN1IGNvdW50Cglmb3JlYWNoKGFycmF5KCdwYV9wYWt1b3Rlc19keWRpcycsJ3BhX2tpZWtpc19wYWt1b3RlamUnLCdwYV9keWRpcycsJ3BhX2lsZ2lzJykgYXMgJHR4KXsKCQkkdD1nZXRfdGVybXMoYXJyYXkoJ3RheG9ub215Jz0+JHR4LCdoaWRlX2VtcHR5Jz0+dHJ1ZSkpOwoJCSRvWyd0YXhfJy4kdHhdPWlzX3dwX2Vycm9yKCR0KT9hcnJheSgpOmFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIGFycmF5KCdpZCc9PiR4LT50ZXJtX2lkLCduJz0+JHgtPm5hbWUsJ3MnPT4keC0+c2x1ZywnYyc9PiR4LT5jb3VudCk7fSwkdCk7Cgl9CgoJLy8gMy4gUHJla2VzOiB2aXNvcyBwdWJsaXNoIHNpbXBsZSwgc3Ugc2F2aWthaW5hL3N2b3JpdS9rYXRlZ29yaWphL251b3RyYXVrYQoJJHE9bmV3IFdQX1F1ZXJ5KGFycmF5KCdwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnLCdwb3N0c19wZXJfcGFnZSc9Pi0xLCdmaWVsZHMnPT4naWRzJywKCQkndGF4X3F1ZXJ5Jz0+YXJyYXkoYXJyYXkoJ3RheG9ub215Jz0+J3Byb2R1Y3RfdHlwZScsJ2ZpZWxkJz0+J3NsdWcnLCd0ZXJtcyc9PmFycmF5KCdzaW1wbGUnKSkpKSk7CgkkaWRzPSRxLT5wb3N0czsKCSRvWyd2aXNvX3NpbXBsZSddPWNvdW50KCRpZHMpOwoJJGl0ZW1zPWFycmF5KCk7Cglmb3JlYWNoKCRpZHMgYXMgJHBpZCl7CgkJJHA9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7IGlmKCEkcCkgY29udGludWU7CgkJJGNvc3Q9Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfY29zdF9wcmljZScsdHJ1ZSk7CgkJaWYoJGNvc3Q9PT0nJ3x8JGNvc3Q9PT1mYWxzZXx8JGNvc3Q9PT1udWxsKSAkY29zdD1nZXRfcG9zdF9tZXRhKCRwaWQsJ192Zl9jb3N0Jyx0cnVlKTsKCQlpZigkY29zdD09PScnfHwkY29zdD09PWZhbHNlfHwkY29zdD09PW51bGwpICRjb3N0PWdldF9wb3N0X21ldGEoJHBpZCwnX3piX2Nvc3QnLHRydWUpOwoJCSRncmFtPXdjX2dldF9wcm9kdWN0X3Rlcm1zKCRwaWQsJ3BhX3Bha3VvdGVzX2R5ZGlzJyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpOwoJCSR2Zj1nZXRfcG9zdF9tZXRhKCRwaWQsJ192Zl9lbmFibGVkJyx0cnVlKT09PSd5ZXMnOwoJCSR6Yj1nZXRfcG9zdF9tZXRhKCRwaWQsJ196Yl9lbmFibGVkJyx0cnVlKT09PSd5ZXMnOwoJCSRpdGVtc1tdPWFycmF5KAoJCQknaSc9PiRwaWQsJ3QnPT4kcC0+Z2V0X25hbWUoKSwncyc9PiRwLT5nZXRfc2t1KCksCgkJCSdwJz0+KGZsb2F0KSRwLT5nZXRfcHJpY2UoKSwnYyc9PigkY29zdCE9PScnJiYkY29zdCE9PW51bGwpPyhmbG9hdCkkY29zdDpudWxsLAoJCQkncSc9PiRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSwnc3MnPT4kcC0+Z2V0X3N0b2NrX3N0YXR1cygpPT09J2luc3RvY2snPzE6MCwKCQkJJ3cnPT4oaXNfd3BfZXJyb3IoJGdyYW0pfHxlbXB0eSgkZ3JhbSkpPycnOiRncmFtWzBdLAoJCQknd2gnPT4kdmY/J3ZmJzooJHpiPyd6Yic6J2F2JyksCgkJCSdrJz0+d2NfZ2V0X3Byb2R1Y3RfdGVybXMoJHBpZCwncHJvZHVjdF9jYXQnLGFycmF5KCdmaWVsZHMnPT4naWRzJykpLAoJCQknZyc9PndwX2dldF9hdHRhY2htZW50X2ltYWdlX3VybCgkcC0+Z2V0X2ltYWdlX2lkKCksJ3RodW1ibmFpbCcpID86ICcnCgkJKTsKCX0KCSRvWydpdGVtcyddPSRpdGVtczsKCSRvWyduJ109Y291bnQoJGl0ZW1zKTsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCA5OSk7Cg==`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP ZZ Katalogas v1', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_kat=Kt44Wz8&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
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
