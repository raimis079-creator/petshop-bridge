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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjkgRkFRIExpbmsgRml4CiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19mcTcnXSkgfHwgJF9HRVRbJ3BzX2ZxNyddICE9PSAnRnE3ZDMnICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBnbG9iYWwgJHdwZGI7ICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nZmFxLWZpeC12MScpOwogICAgJHBpZCA9IDM0NTk1OwogICAgJHAgPSBnZXRfcG9zdCgkcGlkKTsKICAgIGlmICghJHApIHsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnZXJyJz0+J25lcmEnKSk7IGV4aXQ7IH0KICAgICRyWydwYXZhZGluaW1hcyddID0gJHAtPnBvc3RfdGl0bGU7CiAgICAkYyA9ICRwLT5wb3N0X2NvbnRlbnQ7CiAgICAkclsnaWxnaXNfcHJpZXMnXSA9IHN0cmxlbigkYyk7CgogICAgLy8gS09OVEVLU1RBUyBwcmllcyBrZWljaWFudCDigJQga8SFIHRpa3NsaWFpIGtlaXNpdQogICAgJGVpbCA9IGFycmF5KCk7CiAgICAkcG96ID0gMDsKICAgIHdoaWxlICgoJGkgPSBzdHJwb3MoJGMsICdteS1hY2NvdW50JywgJHBveikpICE9PSBmYWxzZSkgewogICAgICAgICRlaWxbXSA9IHN1YnN0cigkYywgbWF4KDAsJGktMTIwKSwgMjYwKTsKICAgICAgICAkcG96ID0gJGkgKyAxMDsKICAgIH0KICAgICRyWydrb250ZWtzdGFzJ10gPSAkZWlsOwogICAgJHJbJ3Jhc3RhJ10gPSBjb3VudCgkZWlsKTsKCiAgICBpZiAoaXNzZXQoJF9HRVRbJ2FwcGx5J10pICYmICRfR0VUWydhcHBseSddID09PSAnMScpIHsKICAgICAgICAvLyB0aWtzbHVzIHBha2VpdGltYWksIG5lIGJlbmRyYXMgc3RyX3JlcGxhY2UgcGVyIHZpc2EgdHVyaW5pCiAgICAgICAgJHBvcm9zID0gYXJyYXkoCiAgICAgICAgICAgICcvbXktYWNjb3VudC9vcmRlcnMvJyAgICAgICAgICA9PiAnL3Bhc2t5cmEvdXpzYWt5bWFpLycsCiAgICAgICAgICAgICcvbXktYWNjb3VudC9lZGl0LWFkZHJlc3MvJyAgICA9PiAnL3Bhc2t5cmEvYWRyZXNhaS8nLAogICAgICAgICAgICAnL215LWFjY291bnQvZWRpdC1hY2NvdW50LycgICAgPT4gJy9wYXNreXJhL3Bhc2t5cm9zLWR1b21lbnlzLycsCiAgICAgICAgICAgICcvbXktYWNjb3VudC9sb3N0LXBhc3N3b3JkLycgICA9PiAnL3Bhc2t5cmEvcGFtaXJzdGFzLXNsYXB0YXpvZGlzLycsCiAgICAgICAgICAgICcvbXktYWNjb3VudC8nICAgICAgICAgICAgICAgICA9PiAnL3Bhc2t5cmEvJywKICAgICAgICApOwogICAgICAgICRuYXVqYXMgPSAkYzsgJHBhayA9IGFycmF5KCk7CiAgICAgICAgZm9yZWFjaCAoJHBvcm9zIGFzICRzZW4gPT4gJG5hdSkgewogICAgICAgICAgICAkbiA9IHN1YnN0cl9jb3VudCgkbmF1amFzLCAkc2VuKTsKICAgICAgICAgICAgaWYgKCRuID4gMCkgeyAkbmF1amFzID0gc3RyX3JlcGxhY2UoJHNlbiwgJG5hdSwgJG5hdWphcyk7ICRwYWtbJHNlbl0gPSAkbjsgfQogICAgICAgIH0KICAgICAgICAkclsncGFrZWlzdGEnXSA9ICRwYWs7CiAgICAgICAgaWYgKCRuYXVqYXMgIT09ICRjKSB7CiAgICAgICAgICAgICR3cGRiLT51cGRhdGUoJHdwZGItPnBvc3RzLCBhcnJheSgncG9zdF9jb250ZW50Jz0+JG5hdWphcyksIGFycmF5KCdJRCc9PiRwaWQpKTsKICAgICAgICAgICAgY2xlYW5fcG9zdF9jYWNoZSgkcGlkKTsKICAgICAgICAgICAgJHBvID0gZ2V0X3Bvc3QoJHBpZCk7CiAgICAgICAgICAgICRyWydpbGdpc19wbyddID0gc3RybGVuKCRwby0+cG9zdF9jb250ZW50KTsKICAgICAgICAgICAgJHJbJ2xpa29fbXlfYWNjb3VudCddID0gc3Vic3RyX2NvdW50KCRwby0+cG9zdF9jb250ZW50LCAnbXktYWNjb3VudCcpOwogICAgICAgIH0KICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S329 FAQ Fix',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('faqfix.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_fq7=Fq7d3"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.dry=uzk(1);
sh('sleep 3');
function uzk2(){ const x=sh('curl -sSk -m 40 "'+SITE+'/?ps_fq7=Fq7d3&apply=1"'); try{return JSON.parse(x.out);}catch(e){O.raw2=x.out.slice(0,600); return null;} }
O.apply=uzk2();
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
putB64('faqfix.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
