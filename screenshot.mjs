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
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfZHAyJ10gPz8gJycpIT09J0RwNjZObjknKSByZXR1cm47CglAc2V0X3RpbWVfbGltaXQoMjQwKTsKCWdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7Cgkkbz1hcnJheSgnbWFya2VyJz0+J0RQIE1FQ0hBTklLQSB2MScpOwoJZm9yZWFjaChhcnJheSg1NjcsNTY4LDU3MCw1NzIsNTczKSBhcyAkaWQpewoJCSRjPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgY29kZSBGUk9NIHskcGZ9c25pcHBldHMgV0hFUkUgaWQ9JWQiLCRpZCkpOwoJCSRvWydzJy4kaWRdPWJhc2U2NF9lbmNvZGUoKHN0cmluZykkYyk7Cgl9CgkvLyBhciB5cmEgaG9va2FpLCBudXJhc2FudHlzIGJhemluZSBwcmVrZQoJZ2xvYmFsICR3cF9maWx0ZXI7Cglmb3JlYWNoKGFycmF5KCd3b29jb21tZXJjZV9yZWR1Y2Vfb3JkZXJfc3RvY2snLCd3b29jb21tZXJjZV9wYXltZW50X2NvbXBsZXRlX3JlZHVjZV9vcmRlcl9zdG9jaycsJ3dvb2NvbW1lcmNlX29yZGVyX3N0YXR1c19wcm9jZXNzaW5nJywnd29vY29tbWVyY2VfcHJvZHVjdF9nZXRfc3RvY2tfc3RhdHVzJywnd29vY29tbWVyY2VfcHJvZHVjdF9pc19pbl9zdG9jaycsJ3dvb2NvbW1lcmNlX2FkZF90b19jYXJ0X3ZhbGlkYXRpb24nKSBhcyAkaCl7CgkJJGw9YXJyYXkoKTsKCQlpZihpc3NldCgkd3BfZmlsdGVyWyRoXSkpIGZvcmVhY2goJHdwX2ZpbHRlclskaF0tPmNhbGxiYWNrcyBhcyAkcHI9PiRjYnMpIGZvcmVhY2goJGNicyBhcyAkaz0+JGNiKXsKCQkJJG49aXNfYXJyYXkoJGNiWydmdW5jdGlvbiddKT8oaXNfb2JqZWN0KCRjYlsnZnVuY3Rpb24nXVswXSk/Z2V0X2NsYXNzKCRjYlsnZnVuY3Rpb24nXVswXSk6JGNiWydmdW5jdGlvbiddWzBdKS4nOjonLiRjYlsnZnVuY3Rpb24nXVsxXTooaXNfc3RyaW5nKCRjYlsnZnVuY3Rpb24nXSk/JGNiWydmdW5jdGlvbiddOidjbG9zdXJlJyk7CgkJCSRsW109JHByLic6Jy4kbjsKCQl9CgkJJG9bJ2hvb2tfJy4kaF09JGw7Cgl9CgkvLyBiYXppbmVzIHByZWtlcyBsaWt1dGlzIHZzIHBha28gYnVzZW5hCgkkcGFrYWk9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG9zdF9pZCBwaWQsbWV0YV92YWx1ZSBiYXplIEZST00geyRwZn1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX2RwX2Jhc2VfcHJvZHVjdF9pZCciLEFSUkFZX0EpOwoJJG9bJ2J1a2xlJ109YXJyYXkoKTsKCWZvcmVhY2goJHBha2FpIGFzICR4KXsKCQkkcGlkPShpbnQpJHhbJ3BpZCddOyAkYmlkPShpbnQpJHhbJ2JhemUnXTsKCQkkYj13Y19nZXRfcHJvZHVjdCgkYmlkKTsgJHA9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7CgkJJHF0eT0oaW50KWdldF9wb3N0X21ldGEoJHBpZCwnX2RwX3BhY2tfcXR5Jyx0cnVlKTsKCQkkb1snYnVrbGUnXVtdPWFycmF5KCdwYWsnPT4kcGlkLCdiYXplJz0+JGJpZCwncXR5Jz0+JHF0eSwKCQkJJ2JhemVfbGlrJz0+JGI/JGItPmdldF9zdG9ja19xdWFudGl0eSgpOm51bGwsJ2JhemVfc3MnPT4kYj8kYi0+Z2V0X3N0b2NrX3N0YXR1cygpOm51bGwsCgkJCSdiYXplX2thaW5hJz0+JGI/KGZsb2F0KSRiLT5nZXRfcHJpY2UoKTpudWxsLCdwYWtfa2FpbmEnPT4kcD8oZmxvYXQpJHAtPmdldF9wcmljZSgpOm51bGwsCgkJCSdwYWtfc3MnPT4kcD8kcC0+Z2V0X3N0b2NrX3N0YXR1cygpOm51bGwsJ3Bha19tYW5hZ2UnPT4kcD8kcC0+Z2V0X21hbmFnZV9zdG9jaygpOm51bGwpOwoJfQoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDk5KTsK`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP ZZ DP Mechanika v1', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_dp2=Dp66Nn9&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
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
