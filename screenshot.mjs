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
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfcHVsbCddID8/ICcnKSE9PSdQbDMzS205JykgcmV0dXJuOwoJQHNldF90aW1lX2xpbWl0KDI0MCk7CglnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OwoJJG89YXJyYXkoJ21hcmtlcic9PidTTklQUEVULVBVTEwgdjEnKTsKCgkvLyAxLiBWaXNpIHNuaXBwZXRhaSBzdXNpamUgc3Ugcmlua2luaWFpcyAtIHBpbG5hcyBzYXJhc2FzCgkkb1snc2FyYXNhcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlLHByaW9yaXR5LExFTkdUSChjb2RlKSBsZW4gRlJPTSB7JHBmfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnJWlua2luJScgT1IgbmFtZSBMSUtFICcldXNpZCUnIE9SIG5hbWUgTElLRSAnJWhvaWNlJScgT1IgbmFtZSBMSUtFICclTW5NJScgT1IgbmFtZSBMSUtFICclTWl4JScgT1IgbmFtZSBMSUtFICclb21wb25lbnQlJyBPUiBuYW1lIExJS0UgJyVvbXBvemljJScgT1JERVIgQlkgaWQiLEFSUkFZX0EpOwoKCS8vIDIuIFBpbG5pIGtvZGFpCgkkaWRzPWFycmF5KDUzOSw1NTAsNTQ3LDUzMiw1NjksNzA1LDcwOSk7Cglmb3JlYWNoKCRpZHMgYXMgJGlkKXsKCQkkYz0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGNvZGUgRlJPTSB7JHBmfXNuaXBwZXRzIFdIRVJFIGlkPSVkIiwkaWQpKTsKCQkkb1sna29kYXNfJy4kaWRdPWJhc2U2NF9lbmNvZGUoJGM9PT1udWxsPycoTkVSQSknOiRjKTsKCX0KCgkvLyAzLiBNbk0ga29udGVpbmVyaW8gZ2FsaW15YmVzIC0gdmlzaSBtZXRhIGFudCB2aWVubyBwYXZ5emR6aW8gKyBrbGFzZXMgbWV0b2RhaQoJJHA9d2NfZ2V0X3Byb2R1Y3QoMzQxNzIpOwoJJG9bJ21ubV9tZXRvZGFpJ109YXJyYXkoKTsKCWZvcmVhY2goZ2V0X2NsYXNzX21ldGhvZHMoJHApIGFzICRtKXsgaWYocHJlZ19tYXRjaCgnL2NoaWxkfGNvbnRhaW5lcnxjb250ZW50fHByaWN8ZGlzY291bnR8bGF5b3V0fHBhY2svaScsJG0pKSAkb1snbW5tX21ldG9kYWknXVtdPSRtOyB9Cgkkb1snbW5tX21ldGFfMzQxNzInXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBtZXRhX2tleSxMRUZUKG1ldGFfdmFsdWUsMTIwKSB2IEZST00geyRwZn1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPSVkIEFORCAobWV0YV9rZXkgTElLRSAnJSVtbm0lJScgT1IgbWV0YV9rZXkgTElLRSAnX3BldHNob3AlJScgT1IgbWV0YV9rZXkgSU4gKCdfcHJpY2UnLCdfcmVndWxhcl9wcmljZScsJ19zYWxlX3ByaWNlJywnX21hbmFnZV9zdG9jaycsJ19zdG9ja19zdGF0dXMnLCdfc2t1JywnX3RodW1ibmFpbF9pZCcpKSIsMzQxNzIpLEFSUkFZX0EpOwoJLy8gc3VzaWRlamltbyBwYXNsZXB0b3MgbWV0YQoJJG9bJ21ubV9tZXRhXzM0MjQzJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgbWV0YV9rZXksTEVGVChtZXRhX3ZhbHVlLDEyMCkgdiBGUk9NIHskcGZ9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD0lZCBBTkQgKG1ldGFfa2V5IExJS0UgJyUlbW5tJSUnIE9SIG1ldGFfa2V5IExJS0UgJ19wZXRzaG9wJSUnIE9SIG1ldGFfa2V5IElOICgnX3ByaWNlJywnX3NrdScpKSIsMzQyNDMpLEFSUkFZX0EpOwoJLy8gdGV2aWluZXMgbWV0YQoJJG9bJ3Rldl9tZXRhXzM0MjQyJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgbWV0YV9rZXksTEVGVChtZXRhX3ZhbHVlLDIwMCkgdiBGUk9NIHskcGZ9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD0lZCBBTkQgbWV0YV9rZXkgTElLRSAnX3BldHNob3AlJSciLDM0MjQyKSxBUlJBWV9BKTsKCgkvLyA0LiBNbk0gY2hpbGQgaXRlbSBrbGFzZXMgbWV0b2RhaQoJJGNpcz0kcC0+Z2V0X2NoaWxkX2l0ZW1zKCk7ICRjaT1yZXNldCgkY2lzKTsKCSRvWydjaV9tZXRvZGFpJ109JGNpP2dldF9jbGFzc19tZXRob2RzKCRjaSk6YXJyYXkoKTsKCgkvLyA1LiBBdHJpYnV0dSB0YWtzb25vbWlqb3Mgc3UgcmVpa3NtZW1pcyAoZmlsdHJhY2lqYWkpCgkkb1snYXRyaWJ1dGFpJ109YXJyYXkoKTsKCWZvcmVhY2god2NfZ2V0X2F0dHJpYnV0ZV90YXhvbm9taWVzKCkgYXMgJGEpewoJCSR0eD0ncGFfJy4kYS0+YXR0cmlidXRlX25hbWU7CgkJJHRlcm1zPWdldF90ZXJtcyhhcnJheSgndGF4b25vbXknPT4kdHgsJ2hpZGVfZW1wdHknPT50cnVlLCdudW1iZXInPT4yNSwnZmllbGRzJz0+J2lkPT5uYW1lJykpOwoJCSRvWydhdHJpYnV0YWknXVtdPWFycmF5KCd0eCc9PiR0eCwnbGFiZWwnPT4kYS0+YXR0cmlidXRlX2xhYmVsLCd0ZXJtcyc9PmlzX3dwX2Vycm9yKCR0ZXJtcyk/YXJyYXkoKTokdGVybXMsJ3Zpc28nPT5pc193cF9lcnJvcigkdGVybXMpPzA6d3BfY291bnRfdGVybXMoYXJyYXkoJ3RheG9ub215Jz0+JHR4LCdoaWRlX2VtcHR5Jz0+dHJ1ZSkpKTsKCX0KCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCA5OSk7Cg==`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP ZZ Snippet Pull v1', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_pull=Pl33Km9&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
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
