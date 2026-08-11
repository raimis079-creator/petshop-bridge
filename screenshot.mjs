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
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfbW5tc3RvY2syJ10gPz8gJycpIT09J1NrOTFaeDQnKSByZXR1cm47CglAc2V0X3RpbWVfbGltaXQoMzAwKTsKCSRvPWFycmF5KCdtYXJrZXInPT4nTU5NLVNUT0NLLVRFU1QgdjIgKHBlciBrcmVwc2VsaSknKTsKCSRDSUQ9MzQxNzI7CgoJaWYoaXNfbnVsbChXQygpLT5jYXJ0KSl7IHdjX2xvYWRfY2FydCgpOyB9CglpZihpc19udWxsKFdDKCktPnNlc3Npb24pfHwhV0MoKS0+c2Vzc2lvbi0+aGFzX3Nlc3Npb24oKSl7IFdDKCktPnNlc3Npb24tPnNldF9jdXN0b21lcl9zZXNzaW9uX2Nvb2tpZSh0cnVlKTsgfQoJJG9bJ2NhcnRfcmVhZHknXT0haXNfbnVsbChXQygpLT5jYXJ0KTsKCgkkY29udD13Y19nZXRfcHJvZHVjdCgkQ0lEKTsKCSRmaXhlZD1qc29uX2RlY29kZShnZXRfcG9zdF9tZXRhKCRDSUQsJ19wZXRzaG9wX2NvbXBvbmVudF9xdWFudGl0aWVzJyx0cnVlKSx0cnVlKTsKCSRraWRJZHM9YXJyYXkoKTsKCWZvcmVhY2goKGFycmF5KSRjb250LT5nZXRfY2hpbGRfaXRlbXMoKSBhcyAkY2kpeyAkcD0kY2ktPmdldF9wcm9kdWN0KCk7IGlmKCRwKSAka2lkSWRzW109JHAtPmdldF9pZCgpOyB9CgkkYmVmb3JlPWFycmF5KCk7IGZvcmVhY2goJGtpZElkcyBhcyAkaWQpeyAkcD13Y19nZXRfcHJvZHVjdCgkaWQpOyAkYmVmb3JlWyRpZF09JHAtPmdldF9zdG9ja19xdWFudGl0eSgpOyB9Cgkkb1snYmVmb3JlJ109JGJlZm9yZTsKCglXQygpLT5jYXJ0LT5lbXB0eV9jYXJ0KCk7CgkkY29uZj1hcnJheSgpOwoJZm9yZWFjaCgoYXJyYXkpJGNvbnQtPmdldF9jaGlsZF9pdGVtcygpIGFzICRjaSl7CgkJJHA9JGNpLT5nZXRfcHJvZHVjdCgpOyBpZighJHApIGNvbnRpbnVlOwoJCSRxPWlzc2V0KCRmaXhlZFskcC0+Z2V0X2lkKCldKT8oaW50KSRmaXhlZFskcC0+Z2V0X2lkKCldOjA7CgkJaWYoJHE+MCkgJGNvbmZbJGNpLT5nZXRfY2hpbGRfaXRlbV9pZCgpXT1hcnJheSgncHJvZHVjdF9pZCc9PiRwLT5nZXRfaWQoKSwncXVhbnRpdHknPT4kcSk7Cgl9Cgkkb1snY29uZmlnJ109JGNvbmY7CgoJLy8gYmFuZG9tIGtlbGlzIGZvcm1hdHVzCgkkYWRkZWQ9ZmFsc2U7ICR0cmllZD1hcnJheSgpOwoJJGZvcm1hdHM9YXJyYXkoCgkJJ21ubV9jb25maWdfY2lfYXNzb2MnPT5hcnJheSgnbW5tX2NvbmZpZyc9PiRjb25mKSwKCQknbW5tX2NvbmZpZ19waWRfcXR5Jz0+YXJyYXkoJ21ubV9jb25maWcnPT5hcnJheV9yZWR1Y2UoYXJyYXlfa2V5cygkZml4ZWQpLGZ1bmN0aW9uKCRjLCRrKXVzZSgkZml4ZWQpeyRjWyRrXT0oaW50KSRmaXhlZFska107cmV0dXJuICRjO30sYXJyYXkoKSkpLAoJKTsKCWZvcmVhY2goJGZvcm1hdHMgYXMgJG5tPT4kYXJncyl7CgkJV0MoKS0+Y2FydC0+ZW1wdHlfY2FydCgpOwoJCSRyPW51bGw7CgkJdHJ5eyAkcj1XQygpLT5jYXJ0LT5hZGRfdG9fY2FydCgkQ0lELDEsMCxhcnJheSgpLCRhcmdzKTsgfWNhdGNoKEV4Y2VwdGlvbiAkZSl7ICRyPSdFWDonLiRlLT5nZXRNZXNzYWdlKCk7IH0KCQkkY250PWNvdW50KFdDKCktPmNhcnQtPmdldF9jYXJ0KCkpOwoJCSR0cmllZFskbm1dPWFycmF5KCdyZXQnPT5pc19zdHJpbmcoJHIpP3N1YnN0cigkciwwLDIwKTooJHI/J2tleSc6J2ZhbHNlJyksJ2NhcnRfaXRlbXMnPT4kY250KTsKCQlpZigkY250PjEpeyAkYWRkZWQ9dHJ1ZTsgJG9bJ3VzZWRfZm9ybWF0J109JG5tOyBicmVhazsgfQoJCWlmKCRjbnQ9PT0xICYmICEkYWRkZWQpeyAkb1sndXNlZF9mb3JtYXQnXT0kbm07ICRhZGRlZD10cnVlOyBicmVhazsgfQoJfQoJJG9bJ3RyaWVkJ109JHRyaWVkOwoKCSRjYXJ0PWFycmF5KCk7Cglmb3JlYWNoKFdDKCktPmNhcnQtPmdldF9jYXJ0KCkgYXMgJGs9PiRjaSl7CgkJJGNhcnRbXT1hcnJheSgncGlkJz0+JGNpWydwcm9kdWN0X2lkJ10sJ3F0eSc9PiRjaVsncXVhbnRpdHknXSwKCQkJJ2tleXMnPT5hcnJheV92YWx1ZXMoYXJyYXlfZGlmZihhcnJheV9rZXlzKCRjaSksYXJyYXkoJ2tleScsJ3Byb2R1Y3RfaWQnLCd2YXJpYXRpb25faWQnLCd2YXJpYXRpb24nLCdxdWFudGl0eScsJ2RhdGEnLCdsaW5lX3RheF9kYXRhJywnbGluZV9zdWJ0b3RhbCcsJ2xpbmVfc3VidG90YWxfdGF4JywnbGluZV90b3RhbCcsJ2xpbmVfdGF4JywnZGF0YV9oYXNoJykpKSwKCQkJJ21ubV9jaGlsZCc9Pmlzc2V0KCRjaVsnbW5tX2NoaWxkX2lkJ10pPyRjaVsnbW5tX2NoaWxkX2lkJ106bnVsbCwKCQkJJ21ubV9jb250YWluZXInPT5pc3NldCgkY2lbJ21ubV9jb250YWluZXInXSk/JGNpWydtbm1fY29udGFpbmVyJ106bnVsbCwKCQkJJ21ubV9jb25maWcnPT5pc3NldCgkY2lbJ21ubV9jb25maWcnXSk/JGNpWydtbm1fY29uZmlnJ106bnVsbCk7Cgl9Cgkkb1snY2FydCddPSRjYXJ0OwoKCS8vIHN1a3VyaWFtIHV6c2FreW1hIGlzIGtyZXBzZWxpbwoJJG9yZGVyPW51bGw7Cgl0cnl7CgkJJGNrPVdDX0NoZWNrb3V0OjppbnN0YW5jZSgpOwoJCSRvcmRlcl9pZD0kY2stPmNyZWF0ZV9vcmRlcihhcnJheSgnYmlsbGluZ19lbWFpbCc9Pid0ZXN0YXNAcGV0c2hvcC5sdCcsJ3BheW1lbnRfbWV0aG9kJz0+J2JhY3MnKSk7CgkJJG9bJ2NyZWF0ZV9vcmRlciddPSRvcmRlcl9pZDsKCQlpZighaXNfd3BfZXJyb3IoJG9yZGVyX2lkKSkgJG9yZGVyPXdjX2dldF9vcmRlcigkb3JkZXJfaWQpOwoJCWVsc2UgJG9bJ2NyZWF0ZV9vcmRlcl9lcnInXT0kb3JkZXJfaWQtPmdldF9lcnJvcl9tZXNzYWdlKCk7Cgl9Y2F0Y2goRXhjZXB0aW9uICRlKXsgJG9bJ2NyZWF0ZV9vcmRlcl9leCddPSRlLT5nZXRNZXNzYWdlKCk7IH0KCglpZigkb3JkZXIpewoJCSRpdGVtcz1hcnJheSgpOwoJCWZvcmVhY2goJG9yZGVyLT5nZXRfaXRlbXMoKSBhcyAkaWlkPT4kaXQpewoJCQkkbWQ9YXJyYXkoKTsgZm9yZWFjaCgkaXQtPmdldF9tZXRhX2RhdGEoKSBhcyAkbSl7ICRtZFtdPSRtLT5rZXk7IH0KCQkJJGl0ZW1zW109YXJyYXkoJ3BpZCc9PiRpdC0+Z2V0X3Byb2R1Y3RfaWQoKSwncXR5Jz0+JGl0LT5nZXRfcXVhbnRpdHkoKSwnbmFtZSc9Pm1iX3N1YnN0cigkaXQtPmdldF9uYW1lKCksMCw0MCksJ21ldGFfa2V5cyc9PiRtZCk7CgkJfQoJCSRvWydvcmRlcl9pdGVtcyddPSRpdGVtczsKCQkkb3JkZXItPnNldF9zdGF0dXMoJ3Byb2Nlc3NpbmcnKTsgJG9yZGVyLT5zYXZlKCk7CgkJd2NfcmVkdWNlX3N0b2NrX2xldmVscygkb3JkZXItPmdldF9pZCgpKTsKCgkJJGFmdGVyPWFycmF5KCk7IGZvcmVhY2goJGtpZElkcyBhcyAkaWQpeyB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRpZCk7ICRwPXdjX2dldF9wcm9kdWN0KCRpZCk7ICRhZnRlclskaWRdPSRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKTsgfQoJCSRvWydhZnRlciddPSRhZnRlcjsKCQkkZGlmZj1hcnJheSgpOyAkc3VtPTA7CgkJZm9yZWFjaCgkYmVmb3JlIGFzICRpZD0+JGIpeyAkZD0kYWZ0ZXJbJGlkXS0kYjsgJHN1bSs9YWJzKCRkKTsgJGRpZmZbJGlkXT1hcnJheSgncHJpZXMnPT4kYiwncG8nPT4kYWZ0ZXJbJGlkXSwnc2snPT4kZCwndGlrZXRhc2knPT4tKGludCkoJGZpeGVkWyRpZF0gPz8gMCkpOyB9CgkJJG9bJ0RJRkYnXT0kZGlmZjsKCQkkb1snVkVSRElLVEFTJ109JHN1bT4wPydOVVJBU08nOidORU5VUkFTTyc7CgoJCS8vIGF0c3RhdHltYXMKCQl3Y19pbmNyZWFzZV9zdG9ja19sZXZlbHMoJG9yZGVyLT5nZXRfaWQoKSk7CgkJJHJlc3Q9YXJyYXkoKTsKCQlmb3JlYWNoKCRraWRJZHMgYXMgJGlkKXsgJHA9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoJHAtPmdldF9zdG9ja19xdWFudGl0eSgpIT0kYmVmb3JlWyRpZF0peyAkcC0+c2V0X3N0b2NrX3F1YW50aXR5KCRiZWZvcmVbJGlkXSk7ICRwLT5zYXZlKCk7ICRyZXN0WyRpZF09J1JBTktBJzsgfSBlbHNlICRyZXN0WyRpZF09J29rJzsgfQoJCSRvWydyZXN0b3JlZCddPSRyZXN0OwoJCSRvcmRlci0+ZGVsZXRlKHRydWUpOyAkb1snb3JkZXJfZGVsZXRlZCddPXRydWU7Cgl9CglXQygpLT5jYXJ0LT5lbXB0eV9jYXJ0KCk7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgOTkpOwo=`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP MnM Stock Test v2', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_mnmstock2=Sk91Zx4&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
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
