const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfc3InXSl8fCRfR0VUWydwc19zciddIT09J1NyOEt3M054Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCgyMDApOyBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgncmVhZG9ubHknPT50cnVlKTsKCSRUPSRwZi4ncHNfZmVlZGluZ190YWJsZXMnOwoJLy8gcGlsbmEgcHNfZmVlZGluZ190YWJsZXMgc2NoZW1hCgkkb1sndGFibGVzX3NjaGVtYSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0hPVyBDT0xVTU5TIEZST00geyRUfSIsIEFSUkFZX0EpOwoJLy8gYXIgeXJhIGJhdGNoL2xvZyBsZW50ZWxlcz8KCSRvWydmZWVkaW5nX2xlbnRlbGVzJ109JHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJ3skcGZ9cHNfZmVlZGluZyUnIik7Cgkkb1snaW1wb3J0X2xlbnRlbGVzJ109JHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJ3skcGZ9JWltcG9ydCUnIik7CgkvLyBlc2FtaSBzb3VyY2VfdXJsL3NvdXJjZV92ZXJzaW9uIHBhdnl6ZHppYWkgKGthaXAgYXRyb2RvIGRhYmFyIDIxOSBsZW50ZWxlc2UpCgkkb1snc291cmNlX3B2eiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERJU1RJTkNUIHNvdXJjZV91cmwsc291cmNlX3ZlcnNpb24sQ09VTlQoKikgbiBGUk9NIHskVH0KCQlXSEVSRSBjYW5vbmljYWxfaGFzaF92ZXJzaW9uPSdjaGFzaF92MScgR1JPVVAgQlkgc291cmNlX3VybCxzb3VyY2VfdmVyc2lvbiBPUkRFUiBCWSBuIERFU0MgTElNSVQgMTUiLCBBUlJBWV9BKTsKCS8vIGFyIHlyYSBwcm92ZW5hbmNlL3NvdXJjZV90eXBlL2F1dGhvcml0eSBzdHVscGVsaXUgamF1IGt1ciBub3JzCgkkY29scz1hcnJheV9jb2x1bW4oJG9bJ3RhYmxlc19zY2hlbWEnXSwnRmllbGQnKTsKCSRvWydwcm92ZW5hbmNlX3N0dWxwZWxpYWknXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKCRjb2xzLGZ1bmN0aW9uKCRjKXtyZXR1cm4gc3RyaXBvcygkYywnc291cmNlJykhPT1mYWxzZXx8c3RyaXBvcygkYywnYXV0aG9yJykhPT1mYWxzZXx8c3RyaXBvcygkYywncHJvdmVuYW5jZScpIT09ZmFsc2V8fHN0cmlwb3MoJGMsJ3ZlcmlmJykhPT1mYWxzZTt9KSk7CgkvLyB2ZXJzaW9uX25vIC8gc3VwZXJzZWRlcyAvIHRhYmxlX2tleSBsb2dpa2EKCSRvWyd2ZXJzaWphdmltb19zdHVscGVsaWFpJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigkY29scyxmdW5jdGlvbigkYyl7cmV0dXJuIHN0cmlwb3MoJGMsJ3ZlcnNpb24nKSE9PWZhbHNlfHxzdHJpcG9zKCRjLCdzdXBlcnNlZGUnKSE9PWZhbHNlfHxzdHJpcG9zKCRjLCd0YWJsZV9rZXknKSE9PWZhbHNlO30pKTsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'sr',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212-C Schema Recon (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_sr=Sr8Kw3Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('sr.json',o));
