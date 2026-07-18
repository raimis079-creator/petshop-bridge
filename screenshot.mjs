const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZ2MnXSl8fCRfR0VUWydwc19nYyddIT09J0djOEt3M054Jyl7cmV0dXJuO30KCWdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCdyZWFkb25seSc9PnRydWUpOwoJJGNvZGU9JHdwZGItPmdldF92YXIoIlNFTEVDVCBjb2RlIEZST00geyRwZn1zbmlwcGV0cyBXSEVSRSBpZD0xMTA1Iik7CgkvLyBpc3RyYXVraWFtIGNhbm9uX2hhc2ggZnVua2NpamEgLSBudW8gIiRjYW5vbl9oYXNoIiBpa2kgc3ViYWxhbnN1b3R1IHNrbGlhdXN0dQoJJHN0YXJ0PXN0cnBvcygkY29kZSwnJGNhbm9uX2hhc2gnKTsKCWlmKCRzdGFydCE9PWZhbHNlKXsKCQkvLyBwYWltYW0gbnVvIGVpbHV0ZXMgcHJhZHppb3MKCQkkbHM9c3RycnBvcyhzdWJzdHIoJGNvZGUsMCwkc3RhcnQpLCJcbiIpOwoJCSRjaHVuaz1zdWJzdHIoJGNvZGUsJGxzLDI1MDApOwoJCSRvWydjYW5vbl9oYXNoXzExMDUnXT0kY2h1bms7Cgl9CgkvLyAjMTEwNiAtIEFQUExZIHZlcnNpamEgKGdhbHV0aW5lKQoJJGNvZGUyPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgY29kZSBGUk9NIHskcGZ9c25pcHBldHMgV0hFUkUgaWQ9MTEwNiIpOwoJJHN0YXJ0Mj1zdHJwb3MoJGNvZGUyLCckY2Fub25faGFzaCcpOwoJaWYoJHN0YXJ0MiE9PWZhbHNlKXsKCQkkbHMyPXN0cnJwb3Moc3Vic3RyKCRjb2RlMiwwLCRzdGFydDIpLCJcbiIpOwoJCSRvWydjYW5vbl9oYXNoXzExMDYnXT1zdWJzdHIoJGNvZGUyLCRsczIsMjUwMCk7Cgl9CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'gc',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212-C Get Canon (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_gc=Gc8Kw3Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('gc.json',o));
