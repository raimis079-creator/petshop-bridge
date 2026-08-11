// RINK-RECON2-0811
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

const out = {marker:'RINK-RECON2-0811', ts:new Date().toISOString()};

// 1. TEMP snippet: DB recon for MnM bundles
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcmluazInXSl8fCRfR0VUWydwc19yaW5rMiddIT09J1JrODhRejInKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDI0MCk7CglnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgnbWFya2VyJz0+J1JJTktSRUMyIHYxJyk7CgoJJGNvbnRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgY29udGFpbmVyX2lkIEZST00geyRwZn13Y19tbm1fY2hpbGRfaXRlbXMiKTsKCSRkYXRhPWFycmF5KCk7Cglmb3JlYWNoKCRjb250cyBhcyAkY2lkKXsKCQkkY2lkPShpbnQpJGNpZDsKCQkka2lkcz0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwcm9kdWN0X2lkLG1lbnVfb3JkZXIgRlJPTSB7JHBmfXdjX21ubV9jaGlsZF9pdGVtcyBXSEVSRSBjb250YWluZXJfaWQ9JWQgT1JERVIgQlkgbWVudV9vcmRlciIsJGNpZCksQVJSQVlfQSk7CgkJJGxpc3Q9YXJyYXkoKTsKCQlmb3JlYWNoKCRraWRzIGFzICRrKXsKCQkJJGtpZD0oaW50KSRrWydwcm9kdWN0X2lkJ107CgkJCSRwPWdldF9wb3N0KCRraWQpOwoJCQlpZighJHApeyAkbGlzdFtdPWFycmF5KCdpZCc9PiRraWQsJ3QnPT4nKE5FUkFTVEEpJywnZXJyJz0+MSk7IGNvbnRpbnVlOyB9CgkJCSRjb3N0PScnOwoJCQlmb3JlYWNoKGFycmF5KCdfemJfY29zdCcsJ192Zl9jb3N0JywnX3BzX3NhdmlrYWluYScsJ19jb3N0X3ByaWNlJywnX3B1cmNoYXNlX3ByaWNlJywnX2F2X2Nvc3QnKSBhcyAkY2spewoJCQkJJHY9Z2V0X3Bvc3RfbWV0YSgka2lkLCRjayx0cnVlKTsgaWYoJHYhPT0nJyYmJHYhPT1udWxsKXsgJGNvc3Q9JGNrLic9Jy4kdjsgYnJlYWs7IH0KCQkJfQoJCQkkbGlzdFtdPWFycmF5KAoJCQkJJ2lkJz0+JGtpZCwndCc9Pmh0bWxfZW50aXR5X2RlY29kZSgkcC0+cG9zdF90aXRsZSksJ3N0Jz0+JHAtPnBvc3Rfc3RhdHVzLAoJCQkJJ3NrdSc9PmdldF9wb3N0X21ldGEoJGtpZCwnX3NrdScsdHJ1ZSksCgkJCQkncHInPT5nZXRfcG9zdF9tZXRhKCRraWQsJ19wcmljZScsdHJ1ZSksCgkJCQknY29zdCc9PiRjb3N0LAoJCQkJJ3F0eSc9PmdldF9wb3N0X21ldGEoJGtpZCwnX3N0b2NrJyx0cnVlKSwKCQkJCSdzcyc9PmdldF9wb3N0X21ldGEoJGtpZCwnX3N0b2NrX3N0YXR1cycsdHJ1ZSksCgkJCQknc3JjJz0+Z2V0X3Bvc3RfbWV0YSgka2lkLCdfYWN0aXZlX2Z1bGZpbGxtZW50X3NvdXJjZScsdHJ1ZSksCgkJCQknc2FuZCc9PmdldF9wb3N0X21ldGEoJGtpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKQoJCQkpOwoJCX0KCQkkZGF0YVskY2lkXT0kbGlzdDsKCX0KCSRvWydwb29scyddPSRkYXRhOwoKCS8vICM1NDcgdml0cmluYSBzbmlwcGV0IGtvZGFzICsga2l0aSBzdSAncmlua2luJwoJJHNuPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlLExFTkdUSChjb2RlKSBsZW4gRlJPTSB7JHBmfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnJWlua2luJScgT1IgbmFtZSBMSUtFICcldXNpZGVkJScgT1IgbmFtZSBMSUtFICclU3VzaWRlaiUnIE9SIGNvZGUgTElLRSAnJW1ubSUnIE9SREVSIEJZIGlkIixBUlJBWV9BKTsKCSRvWydzbmlwcGV0cyddPSRzbjsKCSRzNTQ3PSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgY29kZSBGUk9NIHskcGZ9c25pcHBldHMgV0hFUkUgaWQ9NTQ3Iik7Cgkkb1snczU0N19sZW4nXT1zdHJsZW4oJHM1NDcpOwoJJG9bJ3M1NDdfaGVhZCddPXN1YnN0cigkczU0NywwLDQwMDApOwoJLy8ga2FpcCB2aXRyaW5hIHJhbmRhIHJpbmtpbml1cz8KCSRvWydzNTQ3X2lkcyddPWFycmF5KCk7CglpZihwcmVnX21hdGNoX2FsbCgnL1xiKDM0XGR7M30pXGIvJywkczU0NywkbW0pKSAkb1snczU0N19pZHMnXT1hcnJheV9zbGljZShhcnJheV91bmlxdWUoJG1tWzFdKSwwLDYwKTsKCSRvWydzNTQ3X2hhc19xdWVyeSddPWFycmF5KAoJCSdnZXRfcG9zdHMnPT5zdWJzdHJfY291bnQoJHM1NDcsJ2dldF9wb3N0cycpLCdXUF9RdWVyeSc9PnN1YnN0cl9jb3VudCgkczU0NywnV1BfUXVlcnknKSwKCQknbWV0YV9rZXknPT5zdWJzdHJfY291bnQoJHM1NDcsJ21ldGFfa2V5JyksJ2hhcmRjb2RlX2Fycic9PnN1YnN0cl9jb3VudCgkczU0NywnMzQyJykpOwoKCS8vIHB1c2xhcGlhaSBrdXIgdml0cmluYSBneXZlbmEKCSRwZz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxwb3N0X3RpdGxlLHBvc3RfbmFtZSxwb3N0X3N0YXR1cyBGUk9NIHskcGZ9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwYWdlJyBBTkQgKHBvc3RfY29udGVudCBMSUtFICclcHNjJScgT1IgcG9zdF9jb250ZW50IExJS0UgJyVzdXNpZGVrJScgT1IgcG9zdF9jb250ZW50IExJS0UgJyVyaW5raW4lJykiLEFSUkFZX0EpOwoJJG9bJ3BhZ2VzJ109JHBnOwoKCS8vIERQIHBha2FpCgkkZHA9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG0ucG9zdF9pZCxwbS5tZXRhX3ZhbHVlIGJhc2UscC5wb3N0X3RpdGxlLChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskcGZ9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wbS5wb3N0X2lkIEFORCBtZXRhX2tleT0nX2RwX3BhY2tfcXR5JyBMSU1JVCAxKSBxdHkgRlJPTSB7JHBmfXBvc3RtZXRhIHBtIEpPSU4geyRwZn1wb3N0cyBwIE9OIHAuSUQ9cG0ucG9zdF9pZCBXSEVSRSBwbS5tZXRhX2tleT0nX2RwX2Jhc2VfcHJvZHVjdF9pZCciLEFSUkFZX0EpOwoJJG9bJ2RwJ109JGRwOwoKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CgllY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP Rink Recon v2', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_rink2=Rk88Qz2&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
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
