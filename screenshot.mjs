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
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfbWVkaXMnXSA/PyAnJykhPT0nTWQyMlh5NycpIHJldHVybjsKCUBzZXRfdGltZV9saW1pdCgyNDApOwoJZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsKCSRvPWFycmF5KCdtYXJrZXInPT4nTUVESVMgdjEnKTsKCS8vIFZJU09TIGthdGVnb3Jpam9zIChpciBzdSBjb3VudD0wKQoJJG9bJ2NhdHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0LnRlcm1faWQgaWQsdC5uYW1lIG4sdC5zbHVnIHMsdHQucGFyZW50IHAsdHQuY291bnQgYwoJCUZST00geyRwZn10ZXJtcyB0IEpPSU4geyRwZn10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1faWQ9dC50ZXJtX2lkCgkJV0hFUkUgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JyBPUkRFUiBCWSB0dC5wYXJlbnQsdC5uYW1lIixBUlJBWV9BKTsKCS8vIE1lbml1IHN0cnVrdMWrcmEgKGthcyByZWFsaWFpIHJvZG9tYSBrbGllbnR1aSkKCSRtbT1hcnJheSgpOwoJZm9yZWFjaCh3cF9nZXRfbmF2X21lbnVzKCkgYXMgJG1lbnUpewoJCSRpdGVtcz13cF9nZXRfbmF2X21lbnVfaXRlbXMoJG1lbnUtPnRlcm1faWQpOwoJCSRyb3dzPWFycmF5KCk7CgkJaWYoJGl0ZW1zKSBmb3JlYWNoKCRpdGVtcyBhcyAkaXQpewoJCQkkcm93c1tdPWFycmF5KCd0Jz0+JGl0LT50aXRsZSwncGFyZW50Jz0+KGludCkkaXQtPm1lbnVfaXRlbV9wYXJlbnQsJ2lkJz0+KGludCkkaXQtPklELAoJCQkJJ29iaic9PiRpdC0+b2JqZWN0LCdvaWQnPT4oaW50KSRpdC0+b2JqZWN0X2lkLCd1cmwnPT4kaXQtPnVybCk7CgkJfQoJCSRtbVtdPWFycmF5KCdtZW51Jz0+JG1lbnUtPm5hbWUsJ24nPT5jb3VudCgkcm93cyksJ2l0ZW1zJz0+JHJvd3MpOwoJfQoJJG9bJ21lbnVzJ109JG1tOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDk5KTsK`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP ZZ Medis v1', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_medis=Md22Xy7&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
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
