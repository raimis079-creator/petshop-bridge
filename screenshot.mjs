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
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfbW5tNSddID8/ICcnKSE9PSdTazkxWng0JykgcmV0dXJuOwoJQHNldF90aW1lX2xpbWl0KDMwMCk7CglnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OwoJJG89YXJyYXkoJ21hcmtlcic9PidNTk0tQ0FSVC1aRVJPIHYxJyk7CglpZihpc19udWxsKFdDKCktPmNhcnQpKXsgd2NfbG9hZF9jYXJ0KCk7IH0KCSRDSUQ9MzQxNzI7ICRUSUQ9MjYwNzc7IC8vIGZpa3N1b3RhcyByaW5raW55cywga29tcG9uZW50YXMga3VyaW8ga2lla2lzIDIKCSRwPXdjX2dldF9wcm9kdWN0KCRUSUQpOyAkb3JpZz0kcC0+Z2V0X3N0b2NrX3F1YW50aXR5KCk7ICRvcmlnc3M9JHAtPmdldF9zdG9ja19zdGF0dXMoKTsKCSRvWydvcmlnJ109YXJyYXkoJ2lkJz0+JFRJRCwncXR5Jz0+JG9yaWcsJ3NzJz0+JG9yaWdzcyk7CgoJJGNvbnQ9d2NfZ2V0X3Byb2R1Y3QoJENJRCk7CgkkZml4ZWQ9anNvbl9kZWNvZGUoZ2V0X3Bvc3RfbWV0YSgkQ0lELCdfcGV0c2hvcF9jb21wb25lbnRfcXVhbnRpdGllcycsdHJ1ZSksdHJ1ZSk7CgkkY29uZj1hcnJheSgpOwoJZm9yZWFjaCgoYXJyYXkpJGNvbnQtPmdldF9jaGlsZF9pdGVtcygpIGFzICRjaSl7CgkJJGNwPSRjaS0+Z2V0X3Byb2R1Y3QoKTsgaWYoISRjcCkgY29udGludWU7CgkJJHE9aXNzZXQoJGZpeGVkWyRjcC0+Z2V0X2lkKCldKT8oaW50KSRmaXhlZFskY3AtPmdldF9pZCgpXTowOwoJCWlmKCRxPjApICRjb25mWyRjaS0+Z2V0X2NoaWxkX2l0ZW1faWQoKV09YXJyYXkoJ3Byb2R1Y3RfaWQnPT4kY3AtPmdldF9pZCgpLCdxdWFudGl0eSc9PiRxKTsKCX0KCgkvLyAxKSBOVUxJTkFNCgkkcC0+c2V0X3N0b2NrX3F1YW50aXR5KDApOyAkcC0+c2V0X3N0b2NrX3N0YXR1cygnb3V0b2ZzdG9jaycpOyAkcC0+c2F2ZSgpOwoJd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkVElEKTsgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkQ0lEKTsKCglXQygpLT5jYXJ0LT5lbXB0eV9jYXJ0KCk7Cgl3Y19jbGVhcl9ub3RpY2VzKCk7Cgkkcj1udWxsOyAkZXg9bnVsbDsKCXRyeXsgJHI9V0MoKS0+Y2FydC0+YWRkX3RvX2NhcnQoJENJRCwxLDAsYXJyYXkoKSxhcnJheSgnbW5tX2NvbmZpZyc9PiRjb25mKSk7IH1jYXRjaChFeGNlcHRpb24gJGUpeyAkZXg9JGUtPmdldE1lc3NhZ2UoKTsgfQoJJG5vdGljZXM9YXJyYXkoKTsKCWZvcmVhY2god2NfZ2V0X25vdGljZXMoKSBhcyAkdGlwYXM9PiRhcnIpeyBmb3JlYWNoKCRhcnIgYXMgJG4peyAkbm90aWNlc1tdPSR0aXBhcy4nOiAnLndwX3N0cmlwX2FsbF90YWdzKGlzX2FycmF5KCRuKT8oJG5bJ25vdGljZSddID8/ICcnKTokbik7IH0gfQoJJG9bJ05VTElOSVNfS09NUE9ORU5UQVMnXT1hcnJheSgKCQknYWRkX3RvX2NhcnQnPT5pc19zdHJpbmcoJHIpPydQUklERVRBJzonQVRNRVNUQScsCgkJJ2NhcnRfaXRlbXMnPT5jb3VudChXQygpLT5jYXJ0LT5nZXRfY2FydCgpKSwKCQknbm90aWNlcyc9PiRub3RpY2VzLCdleCc9PiRleCwKCQknY29udF9pbl9zdG9jayc9PndjX2dldF9wcm9kdWN0KCRDSUQpLT5pc19pbl9zdG9jaygpPzE6MCwKCQknY29udF9wdXJjaGFzYWJsZSc9PndjX2dldF9wcm9kdWN0KCRDSUQpLT5pc19wdXJjaGFzYWJsZSgpPzE6MCk7Cgl3Y19jbGVhcl9ub3RpY2VzKCk7IFdDKCktPmNhcnQtPmVtcHR5X2NhcnQoKTsKCgkvLyAyKSBNQVpBUyBMSUtVVElTICgxIHZudCwgbyByZWlraWEgMikKCSRwMj13Y19nZXRfcHJvZHVjdCgkVElEKTsgJHAyLT5zZXRfc3RvY2tfcXVhbnRpdHkoMSk7ICRwMi0+c2V0X3N0b2NrX3N0YXR1cygnaW5zdG9jaycpOyAkcDItPnNhdmUoKTsKCXdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJFRJRCk7IHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJENJRCk7CgkkcjI9bnVsbDsKCXRyeXsgJHIyPVdDKCktPmNhcnQtPmFkZF90b19jYXJ0KCRDSUQsMSwwLGFycmF5KCksYXJyYXkoJ21ubV9jb25maWcnPT4kY29uZikpOyB9Y2F0Y2goRXhjZXB0aW9uICRlKXt9CgkkbjI9YXJyYXkoKTsgZm9yZWFjaCh3Y19nZXRfbm90aWNlcygpIGFzICR0PT4kYXJyKXsgZm9yZWFjaCgkYXJyIGFzICRuKXsgJG4yW109JHQuJzogJy53cF9zdHJpcF9hbGxfdGFncyhpc19hcnJheSgkbik/KCRuWydub3RpY2UnXSA/PyAnJyk6JG4pOyB9IH0KCSRvWydMSUtVVElTXzFfUkVJS0lBXzInXT1hcnJheSgnYWRkX3RvX2NhcnQnPT5pc19zdHJpbmcoJHIyKT8nUFJJREVUQSc6J0FUTUVTVEEnLCdjYXJ0X2l0ZW1zJz0+Y291bnQoV0MoKS0+Y2FydC0+Z2V0X2NhcnQoKSksJ25vdGljZXMnPT4kbjIpOwoJd2NfY2xlYXJfbm90aWNlcygpOyBXQygpLT5jYXJ0LT5lbXB0eV9jYXJ0KCk7CgoJLy8gQVRTVEFUT00KCSRwMz13Y19nZXRfcHJvZHVjdCgkVElEKTsgJHAzLT5zZXRfc3RvY2tfcXVhbnRpdHkoJG9yaWcpOyAkcDMtPnNldF9zdG9ja19zdGF0dXMoJG9yaWdzcyk7ICRwMy0+c2F2ZSgpOwoJd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkVElEKTsgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkQ0lEKTsKCSRvWydhdHN0YXR5dGEnXT1hcnJheSgncXR5Jz0+d2NfZ2V0X3Byb2R1Y3QoJFRJRCktPmdldF9zdG9ja19xdWFudGl0eSgpLCdzcyc9PndjX2dldF9wcm9kdWN0KCRUSUQpLT5nZXRfc3RvY2tfc3RhdHVzKCkpOwoKCS8vIDMpIE1uTSBmaWx0cmFpIGt1cml1b3MgZ2FsaW1hIG5hdWRvdGkgc2FyZ3VpCglnbG9iYWwgJHdwX2ZpbHRlcjsKCSRvWydtbm1fZmlsdHJhaSddPWFycmF5KCk7Cglmb3JlYWNoKCR3cF9maWx0ZXIgYXMgJGg9PiRvYmopeyBpZihzdHJwb3MoJGgsJ21ubScpIT09ZmFsc2UgJiYgKHN0cnBvcygkaCwnc3RvY2snKSE9PWZhbHNlIHx8IHN0cnBvcygkaCwndmlzaWInKSE9PWZhbHNlIHx8IHN0cnBvcygkaCwncHVyY2hhcycpIT09ZmFsc2UgfHwgc3RycG9zKCRoLCdjaGlsZF9pdGVtJykhPT1mYWxzZSkpICRvWydtbm1fZmlsdHJhaSddW109JGg7IH0KCS8vIE1uTSBudXN0YXR5bWFpCgkkb1snbW5tX29wdHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSxvcHRpb25fdmFsdWUgRlJPTSB7JHBmfW9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJW1ubSUnIixBUlJBWV9BKTsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCA5OSk7Cg==`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP MnM Cart Zero v1', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_mnm5=Sk91Zx4&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
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
