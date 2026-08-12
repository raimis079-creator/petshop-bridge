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
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfbmF2MiddID8/ICcnKSE9PSdOdjIyQnE2JykgcmV0dXJuOwoJQHNldF90aW1lX2xpbWl0KDE4MCk7Cgkkbz1hcnJheSgnbWFya2VyJz0+J05BVjInKTsKCSRkaXI9V1BNVV9QTFVHSU5fRElSOwoJJGs9QGZpbGVfZ2V0X2NvbnRlbnRzKCRkaXIuJy9wZXRzaG9wLWthdGFsb2dhcy5waHAnKTsKCS8vIG5hdmlnYWNpam9zIGp1b3N0b3MgSFRNTDogaWVza28gIm5hdmlnYWNpamEiIHBvemljaWpvamUgNzY5NAoJJG9bJ2thdF9uYXYnXT1zdWJzdHIoJGssNzIwMCw0MjAwKTsKCS8vIGFrY2lqb3Mgc3VibWVudSBpciBuYXYKCSRhPUBmaWxlX2dldF9jb250ZW50cygkZGlyLicvcGV0c2hvcC1ha2Npam9zLnBocCcpOwoJJG9bJ2FrY19uYXYnXT1zdWJzdHIoJGEsMzg5MDAsMjYwMCk7CgkvLyB0ZWlzZXMgbW9kdWxpcyAtIHdoaXRlbGlzdAoJJHQ9QGZpbGVfZ2V0X2NvbnRlbnRzKCRkaXIuJy9wZXRzaG9wLXRlaXNlcy5waHAnKTsKCSRvWyd0ZWlzZXNfbmF2J109c3Vic3RyKCR0LDE4MDAsMjYwMCk7CgkvLyBpdnlraWFpIEFQSQoJJGl2PUBmaWxlX2dldF9jb250ZW50cygkZGlyLicvcGV0c2hvcC1pdnlraWFpLnBocCcpOwoJcHJlZ19tYXRjaF9hbGwoJy8oPzpwdWJsaWNccyspP3N0YXRpY1xzK2Z1bmN0aW9uXHMrKFthLXpBLVpfXSspXHMqXCgoW14pXSopXCkvJywkaXYsJG0pOwoJJG9bJ2l2eWtpYWknXT1hcnJheSgpOwoJZm9yKCRpPTA7JGk8Y291bnQoJG1bMV0pOyRpKyspICRvWydpdnlraWFpJ11bXT0kbVsxXVskaV0uJygnLnByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJywkbVsyXVskaV0pLicpJzsKCSRvWydpdnlraWFpX2hlYWQnXT1zdWJzdHIoJGl2LDAsMTQwMCk7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgOTkpOwo=`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP ZZ Nav Recon v2', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_nav2=Nv22Bq6&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
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
