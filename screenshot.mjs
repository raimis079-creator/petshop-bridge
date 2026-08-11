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
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcmluazQnXSl8fCRfR0VUWydwc19yaW5rNCddIT09J1JrODhRejInKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDI0MCk7CglnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgnbWFya2VyJz0+J1JJTktSRUM0IHYxJyk7CgoJLy8gMzQxOTYgYnVzZW5hCgkkcD1nZXRfcG9zdCgzNDE5Nik7Cgkkb1sncDM0MTk2J109JHA/YXJyYXkoJ3QnPT5odG1sX2VudGl0eV9kZWNvZGUoJHAtPnBvc3RfdGl0bGUpLCdzdCc9PiRwLT5wb3N0X3N0YXR1cywndHlwZSc9PmltcGxvZGUoJywnLChhcnJheSl3cF9nZXRfb2JqZWN0X3Rlcm1zKDM0MTk2LCdwcm9kdWN0X3R5cGUnLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSkpLCdpc19jaG9pY2UnPT5nZXRfcG9zdF9tZXRhKDM0MTk2LCdfcGV0c2hvcF9pc19jaG9pY2VfYnVuZGxlJyx0cnVlKSwnY2ZnJz0+Z2V0X3Bvc3RfbWV0YSgzNDE5NiwnX3BldHNob3BfY2hvaWNlX2NvbmZpZycsdHJ1ZSkpOidORVJBJzsKCgkvLyBrdXJpYW1vcyBmb3Jtb3Mgc25pcHBldGFpCglmb3JlYWNoKGFycmF5KDUzOSw1NTAsNTMyLDUyNCw1NjksNTYwLDU2MSw1NTgsNTM1KSBhcyAkc2lkKXsKCQkkY29kZT0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGNvZGUgRlJPTSB7JHBmfXNuaXBwZXRzIFdIRVJFIGlkPSVkIiwkc2lkKSk7CgkJJG9bJ3MnLiRzaWRdPWFycmF5KCdsZW4nPT5zdHJsZW4oJGNvZGUpLCdoZWFkJz0+c3Vic3RyKCRjb2RlLDAsMTUwMCkpOwoJfQoJLy8gNTUwIHBpbG5hcyAoa3VyaW1vIGZvcm1hKSAtIHN2YXJiaWF1c2lhcwoJJGM1NTA9JHdwZGItPmdldF92YXIoIlNFTEVDVCBjb2RlIEZST00geyRwZn1zbmlwcGV0cyBXSEVSRSBpZD01NTAiKTsKCSRvWydzNTUwX2Z1bGwnXT0kYzU1MDsKCSRjNTM5PSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgY29kZSBGUk9NIHskcGZ9c25pcHBldHMgV0hFUkUgaWQ9NTM5Iik7Cgkkb1snczUzOV9mdWxsJ109c3Vic3RyKCRjNTM5LDAsMTIwMDApOwoKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CgllY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP Rink Recon v4', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_rink4=Rk88Qz2&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
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
