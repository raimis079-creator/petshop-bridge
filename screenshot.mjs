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
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfdmFseW1hcyddID8/ICcnKSE9PSdWbDc3Q3gzJykgcmV0dXJuOwoJQHNldF90aW1lX2xpbWl0KDE4MCk7CglnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgnbWFya2VyJz0+J1NFU0lKT1MgVkFMWU1BUyAyMDI2LTA4LTExJyk7CgoJLy8gMS4gVmlzaSBURU1QIHNuaXBwZXRhaQoJJHNuPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlIEZST00geyRwZn1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDQwIixBUlJBWV9BKTsKCSRha3Q9YXJyYXkoKTsKCWZvcmVhY2goJHNuIGFzICRzKXsgaWYoKGludCkkc1snYWN0aXZlJ109PT0xKSAkYWt0W109JHM7IH0KCSRvWyd0ZW1wX3Zpc2knXT1jb3VudCgkc24pOyAkb1sndGVtcF9ha3R5dnVzX3ByaWVzJ109JGFrdDsKCWZvcmVhY2goJGFrdCBhcyAkcyl7ICR3cGRiLT51cGRhdGUoJHBmLidzbmlwcGV0cycsYXJyYXkoJ2FjdGl2ZSc9PjApLGFycmF5KCdpZCc9PiRzWydpZCddKSk7IH0KCWlmKCRha3QpIHsgaWYoZnVuY3Rpb25fZXhpc3RzKCdjbGVhbl9zbmlwcGV0c19jYWNoZScpKSBjbGVhbl9zbmlwcGV0c19jYWNoZSgpOyB3cF9jYWNoZV9mbHVzaCgpOyB9Cgkkb1sndGVtcF9ha3R5dnVzX3BvJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSBGUk9NIHskcGZ9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0xIixBUlJBWV9BKTsKCgkvLyAyLiBMaWt1Y2l1IHN2ZWlrYXRhICh2aXNpIGxpZXN0aSBrb21wb25lbnRhaSkKCSR0aWtyaT1hcnJheSgyNjA3Nz0+Mzg4LDIxNjA5PT4xNjgwLDI2MDY0PT4yODksMjQwMDk9PjEwNCwyMTU5OT0+NjQzKTsKCSRzdj1hcnJheSgpOyAkYmxvZ2FpPTA7Cglmb3JlYWNoKCR0aWtyaSBhcyAkaWQ9PiR0dXJpKXsKCQkkcD13Y19nZXRfcHJvZHVjdCgkaWQpOwoJCSRkYWJhcj0oaW50KSRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKTsKCQkkb2s9KCRkYWJhcj09PSR0dXJpICYmICRwLT5nZXRfc3RvY2tfc3RhdHVzKCk9PT0naW5zdG9jaycpOwoJCWlmKCEkb2spICRibG9nYWkrKzsKCQkkc3ZbJGlkXT1hcnJheSgnZGFiYXInPT4kZGFiYXIsJ3R1cmknPT4kdHVyaSwnc3MnPT4kcC0+Z2V0X3N0b2NrX3N0YXR1cygpLCdvayc9PiRvayk7Cgl9Cgkkb1snbGlrdWNpYWknXT0kc3Y7ICRvWydsaWt1Y2lhaV9ibG9nYWknXT0kYmxvZ2FpOwoKCS8vIDMuIFRlc3RpbmlhaSB1enNha3ltYWkKCSRvcmQ9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQscG9zdF9zdGF0dXMscG9zdF9kYXRlIEZST00geyRwZn1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Nob3Bfb3JkZXInIEFORCBJRCBJTiAoMzQ4OTcsMzQ4OTgpIixBUlJBWV9BKTsKCSRvWyd0ZXN0X29yZGVyc19wb3N0cyddPSRvcmQ7CglpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAneyRwZn13Y19vcmRlcnMnIikpewoJCSRvWyd0ZXN0X29yZGVyc19ocG9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsc3RhdHVzLGJpbGxpbmdfZW1haWwgRlJPTSB7JHBmfXdjX29yZGVycyBXSEVSRSBpZCBJTiAoMzQ4OTcsMzQ4OTgpIixBUlJBWV9BKTsKCQkkb1snb3JkZXJzX3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXdjX29yZGVycyIpOwoJfQoJLy8gNC4gTGFpa2lub3Mgb3B0aW9ucwoJJG9bJ3RtcF9vcHRpb25zJ109JHdwZGItPmdldF9jb2woIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NIHskcGZ9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdwc190bXBfJSciKTsKCWZvcmVhY2goJG9bJ3RtcF9vcHRpb25zJ10gYXMgJG9uKSBkZWxldGVfb3B0aW9uKCRvbik7Cgkkb1sndG1wX29wdGlvbnNfcG8nXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIG9wdGlvbl9uYW1lIEZST00geyRwZn1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ3BzX3RtcF8lJyIpOwoKCS8vIDUuIFJpbmtpbml1IGJ1a2xlIChnYWx1dGluZSkKCSRvWydtbm1fdmlzbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBjb250YWluZXJfaWQpIEZST00geyRwZn13Y19tbm1fY2hpbGRfaXRlbXMiKTsKCSRvWydtbm1fcHVibGlzaCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcGZ9cG9zdHMgcCBKT0lOIHskcGZ9dGVybV9yZWxhdGlvbnNoaXBzIHRyIE9OIHRyLm9iamVjdF9pZD1wLklEIEpPSU4geyRwZn10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBKT0lOIHskcGZ9dGVybXMgdCBPTiB0LnRlcm1faWQ9dHQudGVybV9pZCBXSEVSRSB0dC50YXhvbm9teT0ncHJvZHVjdF90eXBlJyBBTkQgdC5zbHVnPSdtaXgtYW5kLW1hdGNoJyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCciKTsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCA5OSk7Cg==`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP ZZ Valymas v1', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_valymas=Vl77Cx3&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
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
