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
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfbmF2J10gPz8gJycpIT09J052MTFCcTYnKSByZXR1cm47CglAc2V0X3RpbWVfbGltaXQoMTgwKTsKCSRvPWFycmF5KCdtYXJrZXInPT4nTkFWIFJFQ09OIHYxJyk7CgkkZGlyPVdQTVVfUExVR0lOX0RJUjsKCS8vIGt1ciBuYXZpZ2FjaWpvcyBqdW9zdGEKCWZvcmVhY2goYXJyYXkoJ3BldHNob3Ata2F0YWxvZ2FzLnBocCcsJ3BldHNob3AtYWtjaWpvcy5waHAnLCdwZXRzaG9wLWdhdmltYXMucGhwJywncGV0c2hvcC1wYXJ0aWpvcy5waHAnLCdwZXRzaG9wLXRlaXNlcy5waHAnKSBhcyAkZil7CgkJJGM9QGZpbGVfZ2V0X2NvbnRlbnRzKCRkaXIuJy8nLiRmKTsgaWYoISRjKSBjb250aW51ZTsKCQkkaGl0cz1hcnJheSgpOwoJCWZvcmVhY2goYXJyYXkoJ3BzLW5hdicsJ3BzbmF2JywnbmF2X2p1b3N0YScsJ25hdmlnYWNpamEnLCdwc19uYXYnLCdQZXRzaG9wX05hdicsJ2p1b3N0YScpIGFzICR3KXsKCQkJJHA9c3RyaXBvcygkYywkdyk7IGlmKCRwIT09ZmFsc2UpICRoaXRzWyR3XT0kcDsKCQl9CgkJJG9bJ2hpdHNfJy4kZl09JGhpdHM7CgkJLy8gbWVuaXUgcmVnaXN0cmFjaWpvcwoJCXByZWdfbWF0Y2hfYWxsKCcvYWRkXyhzdWIpP21lbnVfcGFnZVwoKC57MCwyNjB9PylcKTsvcycsJGMsJG0pOwoJCSRvWydtZW51XycuJGZdPWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJywkeCk7fSwkbVsyXSk7CgkJLy8gdmVyc2lqb3MgaXIga2xhc2VzCgkJcHJlZ19tYXRjaCgnL2NsYXNzXHMrKFtBLVphLXpfXSspLycsJGMsJGNtKTsgJG9bJ2NsYXNzXycuJGZdPSRjbVsxXSA/PyAnJzsKCQlwcmVnX21hdGNoKCcvVkVSU0lKQVxzKj1ccypcJyhbXlwnXSspXCcvJywkYywkdm0pOyAkb1sndmVyXycuJGZdPSR2bVsxXSA/PyAnJzsKCX0KCS8vIG5hdmlnYWNpam9zIEhUTUwgcGF2eXpkeXMgaXMgYWtjaWrFswoJJGE9QGZpbGVfZ2V0X2NvbnRlbnRzKCRkaXIuJy9wZXRzaG9wLWFrY2lqb3MucGhwJyk7CglpZigkYSl7ICRwPXN0cmlwb3MoJGEsJ2p1b3N0YScpOyBpZigkcD09PWZhbHNlKSRwPXN0cmlwb3MoJGEsJ0thdGFsb2dhczwvYT4nKTsgJG9bJ2FrY19uYXYnXT0kcCE9PWZhbHNlP3N1YnN0cigkYSxtYXgoMCwkcC0xNTAwKSwzMDAwKTonKG5lcmFzdGEpJzsgfQoJLy8gSXZ5a2lhaSBBUEkKCSRpdj1AZmlsZV9nZXRfY29udGVudHMoJGRpci4nL3BldHNob3AtaXZ5a2lhaS5waHAnKTsKCWlmKCRpdil7IHByZWdfbWF0Y2hfYWxsKCcvcHVibGljIHN0YXRpYyBmdW5jdGlvbiAoW2Etel9dKylcKChbXildKilcKS8nLCRpdiwkbTIpOwoJCSRvWydpdnlraWFpX2FwaSddPWFycmF5X21hcChmdW5jdGlvbigkbiwkYSl7cmV0dXJuICRuLicoJy5wcmVnX3JlcGxhY2UoJy9ccysvJywnICcsJGEpLicpJzt9LCRtMlsxXSwkbTJbMl0pOwoJCSRvWydpdnlraWFpX2hlYWQnXT1zdWJzdHIoJGl2LDAsMTUwMCk7IH0KCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCA5OSk7Cg==`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP ZZ Nav Recon v1', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_nav=Nv11Bq6&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
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
