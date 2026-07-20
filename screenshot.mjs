import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
const GUARD_B='YWRkX2ZpbHRlcigncmVzdF9wcmVfZGlzcGF0Y2gnLCBmdW5jdGlvbigkcmVzdWx0LCAkc2VydmVyLCAkcmVxdWVzdCl7CglpZiAoZ2V0X29wdGlvbigncGV0c2hvcF9wc19wZXRzX3dyaXRlX2ZyZWV6ZScpICE9PSAnMScpIHJldHVybiAkcmVzdWx0OwoJJHJvdXRlID0gJHJlcXVlc3QtPmdldF9yb3V0ZSgpOwoJJG1ldGhvZCA9ICRyZXF1ZXN0LT5nZXRfbWV0aG9kKCk7CglpZiAoIWluX2FycmF5KCRtZXRob2QsIGFycmF5KCdQT1NUJywnUFVUJywnUEFUQ0gnLCdERUxFVEUnKSwgdHJ1ZSkpIHJldHVybiAkcmVzdWx0OwoJaWYgKHByZWdfbWF0Y2goJyNeL3BldHNob3AvdjEvcGV0LXByb2ZpbGUjJywgJHJvdXRlKSB8fCBwcmVnX21hdGNoKCcjXi9wZXRzaG9wL3YxL3BldC1waG90byMnLCAkcm91dGUpKSB7CgkJcmV0dXJuIG5ldyBXUF9FcnJvcigncHNfcGV0c193cml0ZV9mcm96ZW4nLCAncHNfcGV0cyB3cml0ZSBmcmVlemUgYWt0eXZ1cyAobWlncmFjaWphKScsIGFycmF5KCdzdGF0dXMnPT41MDMpKTsKCX0KCXJldHVybiAkcmVzdWx0Owp9LCA1LCAzKTsKYWRkX2ZpbHRlcigncXVlcnknLCBmdW5jdGlvbigkcSl7CglpZiAoZ2V0X29wdGlvbigncGV0c2hvcF9wc19wZXRzX3dyaXRlX2ZyZWV6ZScpICE9PSAnMScpIHJldHVybiAkcTsKCWlmIChwcmVnX21hdGNoKCcvXlxzKihJTlNFUlR8VVBEQVRFfERFTEVURXxSRVBMQUNFKVxiL2knLCAkcSkKCQkmJiBwcmVnX21hdGNoKCcvXGJnYWo2X3BzX3BldHNcYi9pJywgJHEpCgkJJiYgIXByZWdfbWF0Y2goJy9nYWo2X3BzX3BldHNfKGJha3xmYWlsZWQpL2knLCAkcSkpIHsKCQlyZXR1cm4gJ0RPIDAnOwoJfQoJcmV0dXJuICRxOwp9KTsK', HELP_B='YWRkX2FjdGlvbignd3BfbG9hZGVkJyxmdW5jdGlvbigpewoJaWYoKCRfR0VUWydwc19obHAnXT8/JycpIT09J0hscEt3OE54JylyZXR1cm47CglnbG9iYWwgJHdwZGI7JHBmPSR3cGRiLT5wcmVmaXg7JGE9JF9HRVRbJ2EnXT8/Jyc7JG91dD1hcnJheSgpOwoJaWYoJGE9PT0nZmxhZ19vbicpeyB1cGRhdGVfb3B0aW9uKCdwZXRzaG9wX3BzX3BldHNfd3JpdGVfZnJlZXplJywnMScpOyAkb3V0WydmbGFnJ109Z2V0X29wdGlvbigncGV0c2hvcF9wc19wZXRzX3dyaXRlX2ZyZWV6ZScpOyB9CgllbHNlaWYoJGE9PT0nZmxhZ19vZmYnKXsgZGVsZXRlX29wdGlvbigncGV0c2hvcF9wc19wZXRzX3dyaXRlX2ZyZWV6ZScpOyAkb3V0WydmbGFnJ109Z2V0X29wdGlvbigncGV0c2hvcF9wc19wZXRzX3dyaXRlX2ZyZWV6ZScsJ05FREVGSU5FRCcpOyB9CgllbHNlaWYoJGE9PT0nY291bnQnKXsKCQkkY29scz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIENPTFVNTl9OQU1FIEZST00gaW5mb3JtYXRpb25fc2NoZW1hLkNPTFVNTlMgV0hFUkUgVEFCTEVfU0NIRU1BPURBVEFCQVNFKCkgQU5EIFRBQkxFX05BTUU9J3skcGZ9cHNfcGV0cycgT1JERVIgQlkgT1JESU5BTF9QT1NJVElPTiIpOwoJCSRjbD1pbXBsb2RlKCcsJyxhcnJheV9tYXAoZnVuY3Rpb24oJGMpe3JldHVybiAnYCcuJGMuJ2AnO30sJGNvbHMpKTsKCQkkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB7JGNsfSBGUk9NIHskcGZ9cHNfcGV0cyBPUkRFUiBCWSBpZCIsQVJSQVlfQSk7CgkJJGNhbm9uPWFycmF5KCk7Zm9yZWFjaCgkcm93cyBhcyAkcil7JHA9YXJyYXkoKTtmb3JlYWNoKCRjb2xzIGFzICRjKXskcFtdPSRjLic9Jy4oJHJbJGNdPT09bnVsbD8nTlVMTCc6JHJbJGNdKTt9JGNhbm9uW109aW1wbG9kZSgnfCcsJHApO30KCQkkb3V0Wydjb3VudCddPWNvdW50KCRyb3dzKTskb3V0WydoYXNoJ109aGFzaCgnc2hhMjU2JyxpbXBsb2RlKCJcbiIsJGNhbm9uKSk7JG91dFsncmVhZGVyX29rJ109dHJ1ZTsKCX0KCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7ZWNobyBqc29uX2VuY29kZSgkb3V0KTtleGl0Owp9KTsK';
function wj(m,path,body){const b=Buffer.from(JSON.stringify(body)).toString('base64');
  return execSync('echo '+b+'|base64 -d|curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" -d @- "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024}).toString();}
function hlp(a){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_hlp=HlpKw8Nx&a='+a+'"',{maxBuffer:20*1024*1024}).toString();const i=r.indexOf('{"');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,150)};}}
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'fp2',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const o={};
try{
  const mkG=wj('POST','code-snippets/v1/snippets',{name:'PS Freeze Guard (temp)',code:Buffer.from(GUARD_B,'base64').toString('utf8'),scope:'front-end',active:true,priority:1});
  o.guard_id=JSON.parse(mkG).id;
  const mkH=wj('POST','code-snippets/v1/snippets',{name:'PS Freeze Helper (temp)',code:Buffer.from(HELP_B,'base64').toString('utf8'),scope:'front-end',active:true,priority:2});
  o.help_id=JSON.parse(mkH).id;
  o.before=hlp('count');
  o.flag_on=hlp('flag_on');
  // POST pet-profile -> laukiam 503
  o.post_status=execSync('curl -sk -o /tmp/pr -w "%{http_code}" '+AUTH+' -X POST -H "Content-Type: application/json" -d "{\\"species\\":\\"cat\\",\\"pet_name\\":\\"FREEZE_TEST\\"}" "https://dev.avesa.lt/wp-json/petshop/v1/pet-profile"',{maxBuffer:10*1024*1024}).toString().trim();
  o.post_body=fs.readFileSync('/tmp/pr','utf8').slice(0,150);
  // GET namespace -> ne 503
  o.get_status=execSync('curl -sk -o /dev/null -w "%{http_code}" '+AUTH+' "https://dev.avesa.lt/wp-json/petshop/v1/"',{maxBuffer:10*1024*1024}).toString().trim();
  o.after=hlp('count');
  o.write_blocked=(o.before&&o.after&&o.before.count===o.after.count);
  const h1=hlp('count'); execSync('sleep 3'); const h2=hlp('count');
  o.double={c1:h1.count,c2:h2.count,h1:h1.hash,h2:h2.hash,LYGUS:(h1.hash===h2.hash&&h1.count===h2.count)};
  o.flag_off=hlp('flag_off');
}catch(e){o.error=String(e).slice(0,300);}
// cleanup visada
try{ if(o.guard_id) wj('POST','code-snippets/v1/snippets/'+o.guard_id,{active:false}); }catch(e){}
try{ if(o.help_id) wj('POST','code-snippets/v1/snippets/'+o.help_id,{active:false}); }catch(e){}
try{ hlp('flag_off'); }catch(e){}
o.cleaned=true;
console.log('PUT:',pr('fp2.json',o));
