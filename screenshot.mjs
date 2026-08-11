// RINK-RECON3-0811
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

const out = {marker:'RINK-RECON3-0811', ts:new Date().toISOString()};

// 1. TEMP snippet: DB recon for MnM bundles
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcmluazMnXSl8fCRfR0VUWydwc19yaW5rMyddIT09J1JrODhRejInKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDI0MCk7CglnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgnbWFya2VyJz0+J1JJTktSRUMzIHYxJyk7CgoJJHBhcmVudHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBwb3N0X2lkIEZST00geyRwZn1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3BldHNob3BfaXNfY2hvaWNlX2J1bmRsZScgQU5EIG1ldGFfdmFsdWU9J3llcyciKTsKCSRvWydwYXJlbnRfY291bnQnXT1jb3VudCgkcGFyZW50cyk7CgkkUD1hcnJheSgpOwoJZm9yZWFjaCgkcGFyZW50cyBhcyAkcGlkKXsKCQkkcGlkPShpbnQpJHBpZDsgJHA9Z2V0X3Bvc3QoJHBpZCk7CgkJJGNmZz1nZXRfcG9zdF9tZXRhKCRwaWQsJ19wZXRzaG9wX2Nob2ljZV9jb25maWcnLHRydWUpOwoJCSR2aXM9d3BfZ2V0X29iamVjdF90ZXJtcygkcGlkLCdwcm9kdWN0X3Zpc2liaWxpdHknLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSk7CgkJJGNhdHM9d3BfZ2V0X29iamVjdF90ZXJtcygkcGlkLCdwcm9kdWN0X2NhdCcsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKTsKCQkkdHQ9d3BfZ2V0X29iamVjdF90ZXJtcygkcGlkLCdwcm9kdWN0X3R5cGUnLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSk7CgkJJFBbXT1hcnJheSgnaWQnPT4kcGlkLCd0Jz0+aHRtbF9lbnRpdHlfZGVjb2RlKCRwLT5wb3N0X3RpdGxlKSwnc3QnPT4kcC0+cG9zdF9zdGF0dXMsCgkJCSd0eXBlJz0+aXNfd3BfZXJyb3IoJHR0KT8nJzppbXBsb2RlKCcsJywkdHQpLAoJCQknY2F0cyc9PmlzX3dwX2Vycm9yKCRjYXRzKT9hcnJheSgpOiRjYXRzLAoJCQkndmlzJz0+aXNfd3BfZXJyb3IoJHZpcyk/YXJyYXkoKTokdmlzLAoJCQknc2t1Jz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfc2t1Jyx0cnVlKSwKCQkJJ25vX2dyYW0nPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19wZXRzaG9wX2Nob2ljZV9ub19ncmFtJyx0cnVlKSwKCQkJJ2dsYWJlbCc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3BldHNob3BfY2hvaWNlX2dyb3VwX2xhYmVsJyx0cnVlKSwKCQkJJ2NmZyc9Pmpzb25fZGVjb2RlKCRjZmcsdHJ1ZSksCgkJCSdjZmdfbGVuJz0+c3RybGVuKCRjZmcpKTsKCX0KCSRvWydwYXJlbnRzJ109JFA7CgoJLy8gdmlzaSBwYXNsZXB0aSBzdSBfcGV0c2hvcF9jaG9pY2VfcGFyZW50Cgkka2lkcz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwb3N0X2lkLG1ldGFfdmFsdWUgcGFyZW50IEZST00geyRwZn1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3BldHNob3BfY2hvaWNlX3BhcmVudCciLEFSUkFZX0EpOwoJJG9bJ2Nob2ljZV9raWRzJ109Y291bnQoJGtpZHMpOwoJJG1hcD1hcnJheSgpOyBmb3JlYWNoKCRraWRzIGFzICRrKXsgJG1hcFtdPWFycmF5KCdpZCc9PihpbnQpJGtbJ3Bvc3RfaWQnXSwncCc9PihpbnQpJGtbJ3BhcmVudCddKTsgfQoJJG9bJ2tpZF9tYXAnXT0kbWFwOwoKCS8vIGtva2llIG1ldGEgcmFrdGFpIHRldnUgKF9wZXRzaG9wXyopCgkkb1sncGFyZW50X21ldGFfa2V5cyddPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgbWV0YV9rZXkgRlJPTSB7JHBmfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5IExJS0UgJ19wZXRzaG9wX2Nob2ljZSUnIE9SIG1ldGFfa2V5IExJS0UgJ19wZXRzaG9wX2J1bmRsZSUnIE9SIG1ldGFfa2V5IExJS0UgJ19wZXRzaG9wX3JpbmslJyIpOwoKCS8vIGt1ciB0ZXZhaSByb2RvbWk6IGthdGVnb3Jpam9zIC8gcHVzbGFwaWFpIC8gYm9keSBjbGFzcwoJJG9bJ3M1NDdfdGFpbCddPXN1YnN0cigkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIGNvZGUgRlJPTSB7JHBmfXNuaXBwZXRzIFdIRVJFIGlkPTU0NyIpLC02MDAwKTsKCgkvLyBraXRpIHN1IHJpbmtpbmlhaXMgc3VzaWplIHNuaXBwZXRhaQoJJG9bJ3NuaXBzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUgRlJPTSB7JHBmfXNuaXBwZXRzIFdIRVJFIChuYW1lIExJS0UgJyVpbmtpbiUnIE9SIG5hbWUgTElLRSAnJWhvaWNlJScgT1IgbmFtZSBMSUtFICcldXNpZMSXJScgT1IgbmFtZSBMSUtFICcldXNpZGVkJScgT1IgbmFtZSBMSUtFICclTW5NJScgT1IgbmFtZSBMSUtFICclTWl4JScpIEFORCBhY3RpdmU8Pi0xIE9SREVSIEJZIGlkIixBUlJBWV9BKTsKCgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwoJZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP Rink Recon v3', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_rink3=Rk88Qz2&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
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
