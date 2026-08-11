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
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcmluazUnXSl8fCRfR0VUWydwc19yaW5rNSddIT09J1JrODhRejInKXtyZXR1cm47fQoJZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ21hcmtlcic9PidSSU5LUkVDNScpOwoJJHI9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG9zdF9pZCxtZXRhX3ZhbHVlIEZST00geyRwZn1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3BldHNob3BfY29tcG9uZW50X3F1YW50aXRpZXMnIixBUlJBWV9BKTsKCSRvWydmaXhlZF9xdHknXT0kcjsKCS8vIHRldnUga2F0ZWdvcmlqb3MgaXIga2FpcCBwYXJkdW90dXZlamUgcmFuZGFtaQoJJG9bJ3JpbmtfY2F0X3Byb2R1Y3RzJ109JHdwZGItPmdldF9yZXN1bHRzKCIKCQlTRUxFQ1QgdHQudGVybV9pZCx0Lm5hbWUsQ09VTlQoKikgYyBGUk9NIHskcGZ9dGVybV9yZWxhdGlvbnNoaXBzIHRyCgkJSk9JTiB7JHBmfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkCgkJSk9JTiB7JHBmfXRlcm1zIHQgT04gdC50ZXJtX2lkPXR0LnRlcm1faWQKCQlKT0lOIHskcGZ9cG9zdHMgcCBPTiBwLklEPXRyLm9iamVjdF9pZCBBTkQgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJwoJCVdIRVJFIHR0LnRheG9ub215PSdwcm9kdWN0X2NhdCcgQU5EIHQuc2x1ZyBJTiAoJ3JpbmtpbmlhaScsJ2tvbnNlcnZ1LXJpbmtpbmlhaScsJ3NrYW5lc3R1LXJpbmtpbmlhaScsJ2tyYW10YWx1LXJpbmtpbmlhaScsJ2RhdWdpYXUtcGlnaWF1JykKCQlHUk9VUCBCWSB0dC50ZXJtX2lkIixBUlJBWV9BKTsKCS8vIERQIHBha2FpIGRldGFsaWFpCgkkb1snZHAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELHAucG9zdF90aXRsZSxwLnBvc3Rfc3RhdHVzLAoJCShTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskcGZ9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wLklEIEFORCBtZXRhX2tleT0nX2RwX2Jhc2VfcHJvZHVjdF9pZCcpIGJhc2UsCgkJKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwZn1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXAuSUQgQU5EIG1ldGFfa2V5PSdfZHBfcGFja19xdHknKSBxdHksCgkJKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwZn1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXAuSUQgQU5EIG1ldGFfa2V5PSdfcHJpY2UnKSBwcgoJCUZST00geyRwZn1wb3N0cyBwIFdIRVJFIEVYSVNUUyhTRUxFQ1QgMSBGUk9NIHskcGZ9cG9zdG1ldGEgbSBXSEVSRSBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0nX2RwX2Jhc2VfcHJvZHVjdF9pZCcpIixBUlJBWV9BKTsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP Rink Recon v5', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_rink5=Rk88Qz2&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
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
