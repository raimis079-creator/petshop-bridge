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
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfZGlhZzInXSA/PyAnJykhPT0nRGcyMld3MScpIHJldHVybjsKCUBzZXRfdGltZV9saW1pdCgyNDApOwoJJG89YXJyYXkoJ21hcmtlcic9PidTQVJHTyBESUFHMicpOwoJaWYoaXNfbnVsbChXQygpLT5jYXJ0KSkgd2NfbG9hZF9jYXJ0KCk7CgkkQ0lEPTM0MTcyOyAkVElEPTI2MDc3OwoJJHA9d2NfZ2V0X3Byb2R1Y3QoJFRJRCk7ICRvcmlnPSRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKTsgJG9yaWdzcz0kcC0+Z2V0X3N0b2NrX3N0YXR1cygpOwoKCS8qIHNla2x5czogZmlrc3VvamEsIHN1IGtva2lhaXMgYXJndW1lbnRhaXMga3ZpZWNpYW1hcyB2YWxpZGF0aW9uICovCgkkR0xPQkFMU1sncHNfc2VrbHlzJ109YXJyYXkoKTsKCWFkZF9maWx0ZXIoJ3dvb2NvbW1lcmNlX2FkZF90b19jYXJ0X3ZhbGlkYXRpb24nLCBmdW5jdGlvbigkb2ssJHBpZCwkcXR5LCR2aWQ9MCwkdmFyPWFycmF5KCkpewoJCSRHTE9CQUxTWydwc19zZWtseXMnXVtdPWFycmF5KCdwaWQnPT4kcGlkLCdxdHknPT4kcXR5LCdva19hdGVpbmFudCc9PiRvaz8xOjAsCgkJCSdnYWxpbWEnPT5jbGFzc19leGlzdHMoJ1BldHNob3BfUmlua2luaXVfTGlrdWNpYWknKT9QZXRzaG9wX1Jpbmtpbml1X0xpa3VjaWFpOjpnYWxpbWFfdmllc2FpKCRwaWQpOm51bGwpOwoJCXJldHVybiAkb2s7Cgl9LCA1LCA1KTsKCWFkZF9maWx0ZXIoJ3dvb2NvbW1lcmNlX2FkZF90b19jYXJ0X3ZhbGlkYXRpb24nLCBmdW5jdGlvbigkb2ssJHBpZCwkcXR5LCR2aWQ9MCwkdmFyPWFycmF5KCkpewoJCSRHTE9CQUxTWydwc19zZWtseXMnXVtdPWFycmF5KCdwb19zYXJnbyc9PjEsJ3BpZCc9PiRwaWQsJ3F0eSc9PiRxdHksJ3Jleic9PiRvaz8xOjApOwoJCXJldHVybiAkb2s7Cgl9LCAyNSwgNSk7CgoJJGNvbnQ9d2NfZ2V0X3Byb2R1Y3QoJENJRCk7CgkkZml4ZWQ9anNvbl9kZWNvZGUoZ2V0X3Bvc3RfbWV0YSgkQ0lELCdfcGV0c2hvcF9jb21wb25lbnRfcXVhbnRpdGllcycsdHJ1ZSksdHJ1ZSk7CgkkY29uZj1hcnJheSgpOwoJZm9yZWFjaCgoYXJyYXkpJGNvbnQtPmdldF9jaGlsZF9pdGVtcygpIGFzICRjaSl7CgkJJGNwPSRjaS0+Z2V0X3Byb2R1Y3QoKTsgaWYoISRjcCkgY29udGludWU7CgkJJHE9aXNzZXQoJGZpeGVkWyRjcC0+Z2V0X2lkKCldKT8oaW50KSRmaXhlZFskY3AtPmdldF9pZCgpXTowOwoJCWlmKCRxPjApICRjb25mWyRjaS0+Z2V0X2NoaWxkX2l0ZW1faWQoKV09YXJyYXkoJ3Byb2R1Y3RfaWQnPT4kY3AtPmdldF9pZCgpLCdxdWFudGl0eSc9PiRxKTsKCX0KCSRvWydmaXhlZCddPSRmaXhlZDsKCgkvKiBsaWt1dGlzIDQgLT4gZ2FsaW1hIDI7IGJhbmRvbSBpbXRpIDMgKi8KCSRwLT5zZXRfc3RvY2tfcXVhbnRpdHkoNCk7ICRwLT5zZXRfc3RvY2tfc3RhdHVzKCdpbnN0b2NrJyk7ICRwLT5zYXZlKCk7Cgl3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRUSUQpOyB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRDSUQpOwoJaWYoZnVuY3Rpb25fZXhpc3RzKCd3Y19nZXRfcHJvZHVjdCcpKSB7IHdwX2NhY2hlX2ZsdXNoKCk7IH0KCVdDKCktPmNhcnQtPmVtcHR5X2NhcnQoKTsgd2NfY2xlYXJfbm90aWNlcygpOwoJJEdMT0JBTFNbJ3BzX3Nla2x5cyddPWFycmF5KCk7Cgkkb1snZ2FsaW1hX3ByaWVzJ109UGV0c2hvcF9SaW5raW5pdV9MaWt1Y2lhaTo6Z2FsaW1hX3ZpZXNhaSgkQ0lEKTsKCSRyPVdDKCktPmNhcnQtPmFkZF90b19jYXJ0KCRDSUQsMywwLGFycmF5KCksYXJyYXkoJ21ubV9jb25maWcnPT4kY29uZikpOwoJJG9bJ3JlenVsdGF0YXMnXT1pc19zdHJpbmcoJHIpPydQUklFTUUnOidBVE1FVEUnOwoJJG9bJ2tyZXBzZWx5amUnXT1hcnJheSgpOwoJZm9yZWFjaChXQygpLT5jYXJ0LT5nZXRfY2FydCgpIGFzICRrPT4kY2kpeyAkb1sna3JlcHNlbHlqZSddW109YXJyYXkoJ3BpZCc9PiRjaVsncHJvZHVjdF9pZCddLCdxdHknPT4kY2lbJ3F1YW50aXR5J10sJ3ZhaWthcyc9Pmlzc2V0KCRjaVsnbW5tX2NoaWxkX2lkJ10pPzE6MCk7IH0KCSRvWydzZWtseXMnXT0kR0xPQkFMU1sncHNfc2VrbHlzJ107CgkkcHI9YXJyYXkoKTsgZm9yZWFjaCh3Y19nZXRfbm90aWNlcygpIGFzICR0PT4kYSl7IGZvcmVhY2goJGEgYXMgJG4peyAkcHJbXT0kdC4nOiAnLndwX3N0cmlwX2FsbF90YWdzKGlzX2FycmF5KCRuKT8oJG5bJ25vdGljZSddPz8nJyk6JG4pOyB9IH0KCSRvWydwcmFuZXNpbWFpJ109JHByOwoKCS8qIGFyIGNoZWNrX2NhcnRfaXRlbXMgc3VnYXVuYSAqLwoJd2NfY2xlYXJfbm90aWNlcygpOwoJZG9fYWN0aW9uKCd3b29jb21tZXJjZV9jaGVja19jYXJ0X2l0ZW1zJyk7CgkkcHIyPWFycmF5KCk7IGZvcmVhY2god2NfZ2V0X25vdGljZXMoKSBhcyAkdD0+JGEpeyBmb3JlYWNoKCRhIGFzICRuKXsgJHByMltdPSR0Lic6ICcud3Bfc3RyaXBfYWxsX3RhZ3MoaXNfYXJyYXkoJG4pPygkblsnbm90aWNlJ10/PycnKTokbik7IH0gfQoJJG9bJ3BlcnppdXJhX3ByYW5lc2ltYWknXT0kcHIyOwoKCXdjX2NsZWFyX25vdGljZXMoKTsgV0MoKS0+Y2FydC0+ZW1wdHlfY2FydCgpOwoJJHAyPXdjX2dldF9wcm9kdWN0KCRUSUQpOyAkcDItPnNldF9zdG9ja19xdWFudGl0eSgkb3JpZyk7ICRwMi0+c2V0X3N0b2NrX3N0YXR1cygkb3JpZ3NzKTsgJHAyLT5zYXZlKCk7Cgl3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRUSUQpOyB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRDSUQpOwoJJG9bJ2F0c3RhdHl0YSddPXdjX2dldF9wcm9kdWN0KCRUSUQpLT5nZXRfc3RvY2tfcXVhbnRpdHkoKTsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzApOwo=`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP ZZ Sargo Diag v2', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_diag2=Dg22Ww1&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
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
