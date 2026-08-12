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
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfbXUnXSA/PyAnJykhPT0nTXU5OVRyNScpIHJldHVybjsKCUBzZXRfdGltZV9saW1pdCgxODApOwoJJG89YXJyYXkoJ21hcmtlcic9PidNVSBSRUNPTiB2MScpOwoJJGRpcj1XUE1VX1BMVUdJTl9ESVI7Cgkkb1snZGlyJ109JGRpcjsKCSRmaWxlcz1hcnJheSgpOwoJZm9yZWFjaChnbG9iKCRkaXIuJy8qLnBocCcpIGFzICRmKXsKCQkkZmlsZXNbXT1hcnJheSgnZic9PmJhc2VuYW1lKCRmKSwnc2l6ZSc9PmZpbGVzaXplKCRmKSwnbXRpbWUnPT5kYXRlKCdZLW0tZCBIOmknLGZpbGVtdGltZSgkZikpKTsKCX0KCSRvWydtdV9maWxlcyddPSRmaWxlczsKCS8vIG5hdmlnYWNpam9zIGp1b3N0YSAtIGlzIGthdGFsb2dvCgkkaz1AZmlsZV9nZXRfY29udGVudHMoJGRpci4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCcpOwoJJG9bJ2thdGFsb2dhc19sZW4nXT1zdHJsZW4oJGspOwoJLy8gaXNyZW5rYW0gbmF2IGZ1bmtjaWphCglpZigkayl7CgkJJHBvcz1zdHJpcG9zKCRrLCdmdW5jdGlvbiBwZXRzaG9wX25hdicpOwoJCWlmKCRwb3M9PT1mYWxzZSkgJHBvcz1zdHJpcG9zKCRrLCdwc25hdicpOwoJCSRvWyduYXZfc25pcHBldCddPSRwb3MhPT1mYWxzZT9zdWJzdHIoJGssbWF4KDAsJHBvcy0zMDApLDM1MDApOicobmVyYXN0YSknOwoJCS8vIG1lbml1IHJlZ2lzdHJhY2lqYQoJCSRtcD1zdHJpcG9zKCRrLCdhZGRfbWVudV9wYWdlJyk7CgkJJHNwPXN0cmlwb3MoJGssJ2FkZF9zdWJtZW51X3BhZ2UnKTsKCQkkb1snbWVudV9yZWcnXT1zdWJzdHIoJGssbWF4KDAsbWluKCRtcD09PWZhbHNlP1BIUF9JTlRfTUFYOiRtcCwkc3A9PT1mYWxzZT9QSFBfSU5UX01BWDokc3ApLTQwMCksMjIwMCk7CgkJJG9bJ2thdGFsb2dhc19oZWFkJ109c3Vic3RyKCRrLDAsMTIwMCk7Cgl9CgkvLyBhciByYXNvbWFzIG11IGthdGFsb2dhcwoJJG9bJ3dyaXRhYmxlJ109aXNfd3JpdGFibGUoJGRpcik7CgkvLyB0ZWlzZXMgbW9kdWxpcwoJJHQ9QGZpbGVfZ2V0X2NvbnRlbnRzKCRkaXIuJy9wZXRzaG9wLXRlaXNlcy5waHAnKTsKCSRvWyd0ZWlzZXMnXT0kdD9zdWJzdHIoJHQsMCwyNTAwKTonKG5lcmEpJzsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCA5OSk7Cg==`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP ZZ MU Recon v1', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_mu=Mu99Tr5&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
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
