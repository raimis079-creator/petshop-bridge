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
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfZHAnXSA/PyAnJykhPT0nRHA1NU5uOScpIHJldHVybjsKCUBzZXRfdGltZV9saW1pdCgyNDApOwoJZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsKCSRvPWFycmF5KCdtYXJrZXInPT4nRFAgUkVDT04gdjEnKTsKCgkvLyAxLiBEUCBwYWthaSBzdSB2aXNhaXMgbWV0YQoJJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHBvc3RfaWQgRlJPTSB7JHBmfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJyIpOwoJJG9bJ2RwX2NvdW50J109Y291bnQoJGlkcyk7CgkkUD1hcnJheSgpOwoJZm9yZWFjaCgkaWRzIGFzICRwaWQpewoJCSRwaWQ9KGludCkkcGlkOyAkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsKCQkkbWV0YT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBtZXRhX2tleSxMRUZUKG1ldGFfdmFsdWUsOTApIHYgRlJPTSB7JHBmfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9JWQgQU5EIChtZXRhX2tleSBMSUtFICdfZHAlJScgT1IgbWV0YV9rZXkgSU4gKCdfcHJpY2UnLCdfcmVndWxhcl9wcmljZScsJ19za3UnLCdfdGh1bWJuYWlsX2lkJywnX3N0b2NrX3N0YXR1cycsJ19tYW5hZ2Vfc3RvY2snLCdfd2VpZ2h0JykpIE9SREVSIEJZIG1ldGFfa2V5IiwkcGlkKSxBUlJBWV9BKTsKCQkkUFtdPWFycmF5KCdpZCc9PiRwaWQsJ3QnPT4kcD8kcC0+Z2V0X25hbWUoKTonPycsJ3RpcGFzJz0+JHA/JHAtPmdldF90eXBlKCk6Jz8nLCdzdCc9PmdldF9wb3N0X3N0YXR1cygkcGlkKSwKCQkJJ2thdCc9PndwX2dldF9wb3N0X3Rlcm1zKCRwaWQsJ3Byb2R1Y3RfY2F0JyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpLAoJCQknbWV0YSc9PiRtZXRhLCd0aHVtYic9PmdldF9wb3N0X3RodW1ibmFpbF9pZCgkcGlkKSk7Cgl9Cgkkb1snZHAnXT0kUDsKCgkvLyAyLiBLYXMgdmFsZG8gRFA6IHNuaXBwZXRhaQoJJHNuPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlLExFTkdUSChjb2RlKSBsZW4gRlJPTSB7JHBmfXNuaXBwZXRzIFdIRVJFIGNvZGUgTElLRSAnJV9kcF9iYXNlX3Byb2R1Y3RfaWQlJyBPUiBjb2RlIExJS0UgJyVkcF9wYWNrJScgT1IgbmFtZSBMSUtFICclYXVnaWF1JScgT1IgbmFtZSBMSUtFICclUGFjayUnIE9SIG5hbWUgTElLRSAnJURQJScgT1JERVIgQlkgaWQiLEFSUkFZX0EpOwoJJG9bJ3NuaXBwZXRzJ109JHNuOwoKCS8vIDMuIG11LXBsdWdpbnMgc3UgRFAKCSRtdT1hcnJheSgpOwoJZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJGYpewoJCSRjPUBmaWxlX2dldF9jb250ZW50cygkZik7CgkJaWYoJGMgJiYgKHN0cnBvcygkYywnX2RwX2Jhc2VfcHJvZHVjdF9pZCcpIT09ZmFsc2UgfHwgc3RycG9zKCRjLCdkcF9wYWNrJykhPT1mYWxzZSkpewoJCQkkbXVbXT1hcnJheSgnZic9PmJhc2VuYW1lKCRmKSwnc2l6ZSc9PmZpbGVzaXplKCRmKSwKCQkJCSdoaXRzJz0+c3Vic3RyX2NvdW50KCRjLCdfZHBfYmFzZV9wcm9kdWN0X2lkJykrc3Vic3RyX2NvdW50KCRjLCdkcF9wYWNrJykpOwoJCX0KCX0KCSRvWydtdSddPSRtdTsKCgkvLyA0LiBWaXRyaW5vcyBrb2RhcyAoa3VyaXMgc25pcHBldGFzIHJvZG8gIkVLT05PTUlTS0EgUEFLVU9URSIpCglmb3JlYWNoKCRzbiBhcyAkcyl7CgkJJGM9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBjb2RlIEZST00geyRwZn1zbmlwcGV0cyBXSEVSRSBpZD0lZCIsJHNbJ2lkJ10pKTsKCQlpZigkYyAmJiAoc3RyaXBvcygkYywnRUtPTk9NSScpIT09ZmFsc2UgfHwgc3RyaXBvcygkYywnUGFrdW90xJdqZScpIT09ZmFsc2UgfHwgc3RyaXBvcygkYywnQmVuZHJhcyBraWVraXMnKSE9PWZhbHNlKSl7CgkJCSRvWyd2aXRyaW5hX2lkJ109JHNbJ2lkJ107ICRvWyd2aXRyaW5hX25hbWUnXT0kc1snbmFtZSddOyAkb1sndml0cmluYSddPWJhc2U2NF9lbmNvZGUoJGMpOwoJCX0KCQlpZigkYyAmJiAoc3RyaXBvcygkYywnd3BfYWpheCcpIT09ZmFsc2UgJiYgc3RyaXBvcygkYywnZHAnKSE9PWZhbHNlICYmIHN0cmlwb3MoJGMsJ2NyZWF0ZScpIT09ZmFsc2UpKXsKCQkJJG9bJ2t1cmltYXNfaWQnXT0kc1snaWQnXTsKCQl9Cgl9CgkvLyBwYWllc2thIHBsYWNpYXUKCWlmKGVtcHR5KCRvWyd2aXRyaW5hX2lkJ10pKXsKCQkkdj0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIGlkLG5hbWUsY29kZSBGUk9NIHskcGZ9c25pcHBldHMgV0hFUkUgY29kZSBMSUtFICclRUtPTk9NSSUnIE9SIGNvZGUgTElLRSAnJUJlbmRyYXMga2lla2lzJScgTElNSVQgMSIsQVJSQVlfQSk7CgkJaWYoJHYpeyAkb1sndml0cmluYV9pZCddPSR2WydpZCddOyAkb1sndml0cmluYV9uYW1lJ109JHZbJ25hbWUnXTsgJG9bJ3ZpdHJpbmEnXT1iYXNlNjRfZW5jb2RlKCR2Wydjb2RlJ10pOyB9Cgl9CgkvLyBrdXIga3VyaWFtaSBEUCBwYWthaQoJJGs9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxMRU5HVEgoY29kZSkgbGVuIEZST00geyRwZn1zbmlwcGV0cyBXSEVSRSBjb2RlIExJS0UgJyVfZHBfYmFzZV9wcm9kdWN0X2lkJScgQU5EIChjb2RlIExJS0UgJyVpbnNlcnQlJyBPUiBjb2RlIExJS0UgJyVuZXcgV0NfUHJvZHVjdCUnIE9SIGNvZGUgTElLRSAnJXNhdmUoKSUnKSIsQVJSQVlfQSk7Cgkkb1sna3VyaW1vX3NuaXBwZXRhaSddPSRrOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDk5KTsK`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP ZZ DP Recon v1', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_dp=Dp55Nn9&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
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
