import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
// ★ Senu TEMP snippet'u valymas — kitaip senas atsako i ta pati rakta.
try{
  const ls=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"');
  const arr=JSON.parse(ls.out); const off=[];
  for(const s0 of arr){ if(s0.name && s0.name.indexOf('TEMP')===0 && s0.active){
    fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
    sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+s0.id+'"');
    off.push(s0.id+':'+s0.name); } }
  O.deaktyvuota_TEMP=off;
}catch(e){ O.valymo_klaida=String(e).slice(0,200); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzEg4oCUIGVtYWlsIHNsdW9rc25pbyBwaWxuYXMgaW52ZW50b3JpdXMuIFRJSyBTS0FJVFlNQVMuCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19lbTcnXSkgfHwgJF9HRVRbJ3BzX2VtNyddICE9PSAnRW03eDInICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBnbG9iYWwgJHdwZGI7ICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nZW1haWwtaW52ZW50b3J5LXYxJyk7CgogICAgLy8gMSkgVklTSSByZWdpc3RydW90aSBzcmF1dGFpCiAgICBpZiAoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0VtYWlsX0Rpc3BhdGNoJykpIHsKICAgICAgICAkcmVmID0gbmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9FbWFpbF9EaXNwYXRjaCcpOwogICAgICAgIGlmICgkcmVmLT5oYXNNZXRob2QoJ2Zsb3dzJykpIHsKICAgICAgICAgICAgJG0gPSAkcmVmLT5nZXRNZXRob2QoJ2Zsb3dzJyk7ICRtLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogICAgICAgICAgICAkclsnc3JhdXRhaSddID0gJG0tPmludm9rZShudWxsKTsKICAgICAgICB9CiAgICB9CiAgICAvLyAyKSBWSVNJIGVzYW1pIHNhYmxvbmFpCiAgICAkZGlyID0gUEVUU0hPUF9DT1JFX0RJUi4ndGVtcGxhdGVzL2VtYWlscy8nOwogICAgJHJbJ3NhYmxvbnVfa2F0YWxvZ2FzJ10gPSAkZGlyOwogICAgZm9yZWFjaCAoKGFycmF5KSBnbG9iKCRkaXIuJyoucGhwJykgYXMgJGYpIHsKICAgICAgICAkclsnc2FibG9uYWknXVtiYXNlbmFtZSgkZiwgJy5waHAnKV0gPSBmaWxlc2l6ZSgkZik7CiAgICB9CiAgICAvLyAzKSBzdWdyZXRpbmltYXMKICAgICRzYWIgPSBhcnJheV9rZXlzKCRyWydzYWJsb25haSddID8/IGFycmF5KCkpOwogICAgZm9yZWFjaCAoKCRyWydzcmF1dGFpJ10gPz8gYXJyYXkoKSkgYXMgJGtleSA9PiAkY2ZnKSB7CiAgICAgICAgJHRwbCA9IGlzX2FycmF5KCRjZmcpID8gKCRjZmdbJ3RlbXBsYXRlJ10gPz8gJGtleSkgOiAka2V5OwogICAgICAgICRrbGFzZSA9IGlzX2FycmF5KCRjZmcpID8gKCRjZmdbJ2NsYXNzJ10gPz8gJz8nKSA6ICc/JzsKICAgICAgICAkclsnc3VncmV0aW5pbWFzJ11bJGtleV0gPSBhcnJheSgKICAgICAgICAgICAgJ2tsYXNlJyAgID0+ICRrbGFzZSwKICAgICAgICAgICAgJ3NhYmxvbmFzJz0+ICR0cGwsCiAgICAgICAgICAgICdZUkEnICAgICA9PiBpbl9hcnJheSgkdHBsLCAkc2FiLCB0cnVlKSwKICAgICAgICApOwogICAgfQogICAgLy8gNCkgam9iJ3Ugc3RhdGlzdGlrYSDigJQga2FzIHJlYWxpYWkgc2l1c3RhCiAgICAkdCA9ICR3cGRiLT5wcmVmaXguJ3BzX2VtYWlsX2pvYnMnOwogICAgaWYgKCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckdCciKSA9PT0gJHQpIHsKICAgICAgICAkclsnam9icyddID0gJHdwZGItPmdldF9yZXN1bHRzKAogICAgICAgICAgICAiU0VMRUNUIGZsb3csIGZsb3dfY2xhc3MsIHN0YXR1cywgQ09VTlQoKikgYywgTUFYKGNyZWF0ZWRfYXQpIG5hdWphdXNpYXMKICAgICAgICAgICAgICAgRlJPTSAkdCBHUk9VUCBCWSBmbG93LCBmbG93X2NsYXNzLCBzdGF0dXMgT1JERVIgQlkgZmxvdyIsIEFSUkFZX0EpOwogICAgICAgICRyWydqb2JzX3Zpc28nXSA9IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCIpOwogICAgICAgICRyWydza2lwX3ByaWV6YXN0eXMnXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygKICAgICAgICAgICAgIlNFTEVDVCBza2lwX3JlYXNvbiwgQ09VTlQoKikgYyBGUk9NICR0IFdIRVJFIHNraXBfcmVhc29uIElTIE5PVCBOVUxMCiAgICAgICAgICAgICAgR1JPVVAgQlkgc2tpcF9yZWFzb24gT1JERVIgQlkgYyBERVNDIiwgQVJSQVlfQSk7CiAgICB9CiAgICAvLyA1KSBXb29Db21tZXJjZSBzYXZpIGxhaXNrYWkgKGtpdGkgc2F2aW5pbmthaSkKICAgIGlmIChmdW5jdGlvbl9leGlzdHMoJ1dDJykpIHsKICAgICAgICAkd2MgPSBXQygpLT5tYWlsZXIoKS0+Z2V0X2VtYWlscygpOwogICAgICAgIGZvcmVhY2ggKCR3YyBhcyAkaWQgPT4gJGUpIHsKICAgICAgICAgICAgJHJbJ3dvb19sYWlza2FpJ11bJGlkXSA9IGFycmF5KCdlbmFibGVkJz0+JGUtPmlzX2VuYWJsZWQoKSwgJ3RpdGxlJz0+JGUtPmdldF90aXRsZSgpKTsKICAgICAgICB9CiAgICB9CiAgICAvLyA2KSBldmVudCBsb2cKICAgICRlbCA9ICR3cGRiLT5wcmVmaXguJ3BzX2V2ZW50X2xvZyc7CiAgICBpZiAoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyRlbCciKSA9PT0gJGVsKSB7CiAgICAgICAgJHJbJ2V2ZW50YWknXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygKICAgICAgICAgICAgIlNFTEVDVCBldmVudF9uYW1lLCBDT1VOVCgqKSBjLCBNQVgoZW1pdHRlZF9hdCkgbmF1amF1c2lhcwogICAgICAgICAgICAgICBGUk9NICRlbCBHUk9VUCBCWSBldmVudF9uYW1lIE9SREVSIEJZIGMgREVTQyBMSU1JVCAyMCIsIEFSUkFZX0EpOwogICAgfQogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('emailinv.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_em7=Em7x2"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.rez=uzk(1);
sh('sleep 4');
function code(u){ return sh('curl -sSkI -m 30 -o /dev/null -w "%{http_code}|%{redirect_url}" "'+u+'"').out.trim(); }
O.t_naujas       = code(SITE+'/paskyra/');
O.t_atsijungti   = code(SITE+'/paskyra/atsijungti/');
O.t_senas_logout = code(SITE+'/my-account/customer-logout/');
O.t_adresai      = code(SITE+'/paskyra/adresai/');
O.t_slaptazodis  = code(SITE+'/paskyra/pamirstas-slaptazodis/');
O.t_augintinis   = code(SITE+'/paskyra/augintinis/');
O.t_uzsakymai    = code(SITE+'/paskyra/uzsakymai/');
O.t_senas        = code(SITE+'/my-account/');
O.t_senas_uzsak  = code(SITE+'/my-account/orders/');
O.t_senas_augint = code(SITE+'/my-account/augintinis/');
O.t_landing      = code(SITE+'/augintinio-profilis/');
O.t_home         = code(SITE+'/');
O.t_shop         = code(SITE+'/parduotuve/');

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('emailinv.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
