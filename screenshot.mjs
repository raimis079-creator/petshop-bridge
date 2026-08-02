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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzUg4oCUIDQgc3ZvcmlvIHRlc3RhaQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfd3Q5J10pIHx8ICRfR0VUWydwc193dDknXSAhPT0gJ1d0OXI1JyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZ2xvYmFsICR3cGRiOyAkUEVUUz0kd3BkYi0+cHJlZml4Lidwc19wZXRzJzsgJEVMPSR3cGRiLT5wcmVmaXguJ3BzX2V2ZW50X2xvZyc7CiAgICAkUj1hcnJheSgnVkVSU0lKQSc9Pid3ZWlnaHQtdGVzdHMtdjEnKTsKICAgIGFkZF9maWx0ZXIoJ3ByZV9odHRwX3JlcXVlc3QnLCBmdW5jdGlvbigkcCwkYSwkdSl7IHJldHVybiBzdHJpcG9zKCR1LCdzZW5kZXInKSE9PWZhbHNlID8gbmV3IFdQX0Vycm9yKCdiJywndCcpIDogJHA7IH0sMSwzKTsKCiAgICAkbG49J3BzX3dfdTEnOyAkdT1nZXRfdXNlcl9ieSgnbG9naW4nLCRsbik7CiAgICBpZighJHUpeyAkaWQ9d3BfaW5zZXJ0X3VzZXIoYXJyYXkoJ3VzZXJfbG9naW4nPT4kbG4sJ3VzZXJfZW1haWwnPT4kbG4uJ0BkZXYuYXZlc2EubHQnLCd1c2VyX3Bhc3MnPT53cF9nZW5lcmF0ZV9wYXNzd29yZCgyNCksJ3JvbGUnPT4nY3VzdG9tZXInKSk7ICR1PWlzX3dwX2Vycm9yKCRpZCk/bnVsbDpnZXRfdXNlcl9ieSgnaWQnLCRpZCk7IH0KICAgICRVSUQ9KGludCkkdS0+SUQ7ICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00gJFBFVFMgV0hFUkUgdXNlcl9pZD0lZCIsJFVJRCkpOwogICAgJE09J1c1LScuc3Vic3RyKG1kNShtaWNyb3RpbWUodHJ1ZSkpLDAsNik7CiAgICAkUlsndXNlciddPSRVSUQ7CiAgICAkcGM9ZnVuY3Rpb24oKSB1c2UoJHdwZGIsJFBFVFMpeyByZXR1cm4gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJFBFVFMiKTsgfTsKICAgICRldj1mdW5jdGlvbigpIHVzZSgkd3BkYiwkRUwpeyByZXR1cm4gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJEVMIFdIRVJFIGV2ZW50X25hbWU9J3BldF9wcm9maWxlX2NyZWF0ZWQnIik7IH07CgogICAgJHBvc3Q9ZnVuY3Rpb24oJHBheWxvYWQpIHVzZSgkVUlELCR3cGRiLCRQRVRTLCRwYywkZXYpewogICAgICAgIHdwX3NldF9jdXJyZW50X3VzZXIoJFVJRCk7CiAgICAgICAgJHAwPSRwYygpOyAkZTA9JGV2KCk7CiAgICAgICAgJHJlcT1uZXcgV1BfUkVTVF9SZXF1ZXN0KCdQT1NUJywnL3BldHNob3AvdjEvcGV0LXByb2ZpbGUnKTsKICAgICAgICAkcmVxLT5zZXRfaGVhZGVyKCdDb250ZW50LVR5cGUnLCdhcHBsaWNhdGlvbi9qc29uJyk7CiAgICAgICAgJHJlcS0+c2V0X2JvZHkod3BfanNvbl9lbmNvZGUoJHBheWxvYWQpKTsKICAgICAgICAkcmVzPXJlc3RfZG9fcmVxdWVzdCgkcmVxKTsgJGQ9JHJlcy0+Z2V0X2RhdGEoKTsKICAgICAgICAkcGlkID0gaXNfYXJyYXkoJGQpJiZpc3NldCgkZFsncGV0X2lkJ10pID8gKGludCkkZFsncGV0X2lkJ10gOiAwOwogICAgICAgICRyb3cgPSAkcGlkID8gJHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBjdXJyZW50X3dlaWdodF9rZywgd2VpZ2h0X3VwZGF0ZWRfYXQgRlJPTSAkUEVUUyBXSEVSRSBpZD0lZCIsJHBpZCksIEFSUkFZX0EpIDogbnVsbDsKICAgICAgICByZXR1cm4gYXJyYXkoJ2h0dHAnPT4kcmVzLT5nZXRfc3RhdHVzKCksJ3BldF9pZCc9PiRwaWQsJ3BldHMnPT4kcGMoKS0kcDAsJ2V2Jz0+JGV2KCktJGUwLCdkYic9PiRyb3cpOwogICAgfTsKCiAgICAvLyBUMTogcHJpc2lqdW5nZXMgQkUgc3ZvcmlvIOKAlCBlbGdzZW5hIG5lcGFraXRvCiAgICAkYT0kcG9zdChhcnJheSgncGV0X25hbWUnPT4kTS4nLUJlU3ZvcmlvJywnc3BlY2llcyc9Pidkb2cnLCdmb3JjZV9uZXcnPT50cnVlKSk7CiAgICAkUlsnVDFfYmVfc3ZvcmlvJ109YXJyYXkoJ3InPT4kYSwnTEFVS1RBJz0+J2NyZWF0ZWQsIHdlaWdodCBOVUxMJywKICAgICAgICAnT0snPT4oJGFbJ2h0dHAnXT09PTIwMCAmJiAkYVsncGV0cyddPT09MSAmJiAkYVsnZGInXVsnY3VycmVudF93ZWlnaHRfa2cnXT09PW51bGwgJiYgJGFbJ2RiJ11bJ3dlaWdodF91cGRhdGVkX2F0J109PT1udWxsKSk7CgogICAgLy8gVDI6IHByaXNpanVuZ2VzIFNVIHN2b3JpdSDigJQgaXNzYXVnb3RhcyArIHNlcnZlcmlzIHV6ZGVkYSBkYXRhCiAgICAkYj0kcG9zdChhcnJheSgncGV0X25hbWUnPT4kTS4nLVN1U3Zvcml1Jywnc3BlY2llcyc9Pidkb2cnLCdjdXJyZW50X3dlaWdodF9rZyc9PjEyLjUsJ2ZvcmNlX25ldyc9PnRydWUpKTsKICAgICRSWydUMl9zdV9zdm9yaXUnXT1hcnJheSgncic9PiRiLCdMQVVLVEEnPT4nMTIuNTAgKyB3ZWlnaHRfdXBkYXRlZF9hdCBudXN0YXR5dGFzJywKICAgICAgICAnT0snPT4oJGJbJ2h0dHAnXT09PTIwMCAmJiAoZmxvYXQpJGJbJ2RiJ11bJ2N1cnJlbnRfd2VpZ2h0X2tnJ109PT0xMi41ICYmICFlbXB0eSgkYlsnZGInXVsnd2VpZ2h0X3VwZGF0ZWRfYXQnXSkpKTsKCiAgICAvLyBUMzogd2VpZ2h0X3VwZGF0ZWRfYXQgSVMgUEFZTE9BRCDigJQgaWdub3J1b2phbWFzCiAgICAka2xhc3RvdGU9JzIwMDEtMDEtMDEgMDA6MDA6MDAnOwogICAgJGM9JHBvc3QoYXJyYXkoJ3BldF9uYW1lJz0+JE0uJy1LbGFzdG90ZScsJ3NwZWNpZXMnPT4nY2F0JywnY3VycmVudF93ZWlnaHRfa2cnPT40LCd3ZWlnaHRfdXBkYXRlZF9hdCc9PiRrbGFzdG90ZSwnZm9yY2VfbmV3Jz0+dHJ1ZSkpOwogICAgJFJbJ1QzX2tsYXN0b3RlJ109YXJyYXkoJ3InPT4kYywnc2l1c3RhJz0+JGtsYXN0b3RlLCdMQVVLVEEnPT4nc2VydmVyaW8gZGF0YSwgTkUgMjAwMScsCiAgICAgICAgJ09LJz0+KCRjWydodHRwJ109PT0yMDAgJiYgIWVtcHR5KCRjWydkYiddWyd3ZWlnaHRfdXBkYXRlZF9hdCddKSAmJiBzdHJwb3MoKHN0cmluZykkY1snZGInXVsnd2VpZ2h0X3VwZGF0ZWRfYXQnXSwnMjAwMScpPT09ZmFsc2UpKTsKCiAgICAvLyBUNDogc2FuaXRpemUgVElFU0lPR0lBSSAoYW5vbmltaW5pcyBrZWxpYXMpIOKAlCBzdm9yaXMgTkVJU01FVEFNQVMKICAgICRyZWY9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfUGV0X1Byb2ZpbGUnLCdzYW5pdGl6ZV9pbnB1dCcpOyAkcmVmLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogICAgJHJlcT1uZXcgV1BfUkVTVF9SZXF1ZXN0KCdQT1NUJywnL3gnKTsKICAgICRyZXEtPnNldF9ib2R5X3BhcmFtcyhhcnJheSgnc3BlY2llcyc9Pidkb2cnLCdwZXRfbmFtZSc9PidYJywnY3VycmVudF93ZWlnaHRfa2cnPT4nNyw1Jywnd2VpZ2h0X3VwZGF0ZWRfYXQnPT4ka2xhc3RvdGUpKTsKICAgICRvdXQ9JHJlZi0+aW52b2tlKG51bGwsJHJlcSxmYWxzZSk7CiAgICAkUlsnVDRfc2FuaXRpemUnXT1hcnJheSgnZ2F2byc9PmFycmF5KCdjdXJyZW50X3dlaWdodF9rZyc9PiRvdXRbJ2N1cnJlbnRfd2VpZ2h0X2tnJ10/PydORVJBJywnd2VpZ2h0X3VwZGF0ZWRfYXQnPT4kb3V0Wyd3ZWlnaHRfdXBkYXRlZF9hdCddPz8nTkVSQScpLAogICAgICAgICdMQVVLVEEnPT4nNy41IChrYWJsZWxpcy0+dGFza2FzKSwgc2VydmVyaW8gZGF0YScsCiAgICAgICAgJ09LJz0+KGlzc2V0KCRvdXRbJ2N1cnJlbnRfd2VpZ2h0X2tnJ10pICYmIChmbG9hdCkkb3V0WydjdXJyZW50X3dlaWdodF9rZyddPT09Ny41ICYmICFlbXB0eSgkb3V0Wyd3ZWlnaHRfdXBkYXRlZF9hdCddKSAmJiBzdHJwb3MoKHN0cmluZykkb3V0Wyd3ZWlnaHRfdXBkYXRlZF9hdCddLCcyMDAxJyk9PT1mYWxzZSkpOwoKICAgIC8vIFQ1OiByaWJvcwogICAgJHJpYm9zPWFycmF5KCk7CiAgICBmb3JlYWNoIChhcnJheSgnMCc9Pm51bGwsJyc9Pm51bGwsJy01Jz0+bnVsbCwnMjAwJz0+bnVsbCwnMC4wNSc9PjAuMDUsJzEyMCc9PjEyMC4wKSBhcyAkaW49PiRsYXVrdGEpIHsKICAgICAgICAkcnE9bmV3IFdQX1JFU1RfUmVxdWVzdCgnUE9TVCcsJy94Jyk7ICRycS0+c2V0X2JvZHlfcGFyYW1zKGFycmF5KCdzcGVjaWVzJz0+J2RvZycsJ2N1cnJlbnRfd2VpZ2h0X2tnJz0+JGluKSk7CiAgICAgICAgJG89JHJlZi0+aW52b2tlKG51bGwsJHJxLGZhbHNlKTsKICAgICAgICAkcmlib3NbKHN0cmluZykkaW5dPSRvWydjdXJyZW50X3dlaWdodF9rZyddID8/ICdORVJBJzsKICAgIH0KICAgICRSWydUNV9yaWJvcyddPWFycmF5KCdyJz0+JHJpYm9zLCdMQVVLVEEnPT4nMC90dXNjaWFzLy01LzIwMCAtPiBudWxsOyAwLjA1IGlyIDEyMCAtPiBwcmlpbXRhJywKICAgICAgICAnT0snPT4oJHJpYm9zWycwJ109PT1udWxsICYmICRyaWJvc1snJ109PT1udWxsICYmICRyaWJvc1snLTUnXT09PW51bGwgJiYgJHJpYm9zWycyMDAnXT09PW51bGwKICAgICAgICAgICAgICAgJiYgKGZsb2F0KSRyaWJvc1snMC4wNSddPT09MC4wNSAmJiAoZmxvYXQpJHJpYm9zWycxMjAnXT09PTEyMC4wKSk7CgogICAgJHByYWVqbz0wOyBmb3JlYWNoKGFycmF5KCdUMV9iZV9zdm9yaW8nLCdUMl9zdV9zdm9yaXUnLCdUM19rbGFzdG90ZScsJ1Q0X3Nhbml0aXplJywnVDVfcmlib3MnKSBhcyAkdCl7IGlmKCFlbXB0eSgkUlskdF1bJ09LJ10pKSAkcHJhZWpvKys7IH0KICAgICRSWydTVVZFU1RJTkUnXT0iJHByYWVqby81IjsKICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00gJFBFVFMgV0hFUkUgdXNlcl9pZD0lZCIsJFVJRCkpOwogICAgcmVxdWlyZV9vbmNlIEFCU1BBVEguJ3dwLWFkbWluL2luY2x1ZGVzL3VzZXIucGhwJzsgd3BfZGVsZXRlX3VzZXIoJFVJRCk7CiAgICAkUlsncGV0c19wbyddPSRwYygpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkUiwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('weighttest.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_wt9=Wt9r5"');
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
putB64('weighttest.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
