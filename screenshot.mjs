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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjkgTmF2aWdhdGlvbiBSZWNvbgogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfbnY1J10pIHx8ICRfR0VUWydwc19udjUnXSAhPT0gJ052NWM3JyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZ2xvYmFsICR3cGRiOyAkciA9IGFycmF5KCdWRVJTSUpBJz0+J25hdi1yZWNvbi12MScpOwoKICAgIC8vIDEpIEt1ciBneXZlbmEgbmF2aWdhdGlvbiBzYWJsb25hcwogICAgJHZpZXRvcyA9IGFycmF5KAogICAgICAgICdjaGlsZCcgPT4gZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy93b29jb21tZXJjZS9teWFjY291bnQvbmF2aWdhdGlvbi5waHAnLAogICAgICAgICdwYXJlbnQnPT4gZ2V0X3RlbXBsYXRlX2RpcmVjdG9yeSgpLicvd29vY29tbWVyY2UvbXlhY2NvdW50L25hdmlnYXRpb24ucGhwJywKICAgICAgICAnd2MnICAgID0+IFdQX1BMVUdJTl9ESVIuJy93b29jb21tZXJjZS90ZW1wbGF0ZXMvbXlhY2NvdW50L25hdmlnYXRpb24ucGhwJywKICAgICk7CiAgICBmb3JlYWNoICgkdmlldG9zIGFzICRrPT4kcCkgewogICAgICAgICRyWydzYWJsb25haSddWyRrXSA9IGlzX3JlYWRhYmxlKCRwKSA/IGZpbGVzaXplKCRwKSA6ICdORVJBJzsKICAgICAgICBpZiAoaXNfcmVhZGFibGUoJHApICYmICRrICE9PSAnd2MnKSB7ICRyWydzYWJsb25vX3R1cmlueXMnXVska10gPSBmaWxlX2dldF9jb250ZW50cygkcCk7IH0KICAgIH0KICAgIC8vIGthIFdvb0NvbW1lcmNlIHJlYWxpYWkgbmF1ZG9zCiAgICAkclsnbG9jYXRlJ10gPSB3Y19sb2NhdGVfdGVtcGxhdGUoJ215YWNjb3VudC9uYXZpZ2F0aW9uLnBocCcpOwoKICAgIC8vIDIpIEthcyBrYWJpbmFzaSBhbnQgbmF2aWdhY2lqb3MgaG9vayd1CiAgICBnbG9iYWwgJHdwX2ZpbHRlcjsKICAgIGZvcmVhY2ggKGFycmF5KCd3b29jb21tZXJjZV9hY2NvdW50X25hdmlnYXRpb24nLCd3b29jb21tZXJjZV9iZWZvcmVfYWNjb3VudF9uYXZpZ2F0aW9uJywKICAgICAgICAgICAgICAgICAgICd3b29jb21tZXJjZV9hY2NvdW50X21lbnVfaXRlbXMnLCd3b29jb21tZXJjZV9iZWZvcmVfYWNjb3VudF9jb250ZW50JykgYXMgJGgpIHsKICAgICAgICAkclsnaG9va2FpJ11bJGhdID0gYXJyYXkoKTsKICAgICAgICBpZiAoaXNzZXQoJHdwX2ZpbHRlclskaF0pKSB7CiAgICAgICAgICAgIGZvcmVhY2ggKCR3cF9maWx0ZXJbJGhdLT5jYWxsYmFja3MgYXMgJHByaW89PiRjYnMpIHsKICAgICAgICAgICAgICAgIGZvcmVhY2ggKCRjYnMgYXMgJGlkPT4kY2IpIHsKICAgICAgICAgICAgICAgICAgICAkZiA9ICRjYlsnZnVuY3Rpb24nXTsKICAgICAgICAgICAgICAgICAgICAkdmFyZGFzID0gaXNfc3RyaW5nKCRmKSA/ICRmIDogKGlzX2FycmF5KCRmKSA/IChpc19vYmplY3QoJGZbMF0pP2dldF9jbGFzcygkZlswXSk6JGZbMF0pLic6OicuJGZbMV0gOiAnQ2xvc3VyZScpOwogICAgICAgICAgICAgICAgICAgICRyWydob29rYWknXVskaF1bXSA9ICRwcmlvLicgJy4kdmFyZGFzOwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfQoKICAgIC8vIDMpIEtlc2FpIChtZW5pdSBwdW5rdHUga2VzYXMgcGFyYWkg4oCUIGlzIGF0bWludGllcykKICAgICRyWyd0cmFuc2llbnRhaSddID0gJHdwZGItPmdldF9jb2woCiAgICAgICAgIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NICR3cGRiLT5vcHRpb25zCiAgICAgICAgICBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICcldHJhbnNpZW50JScKICAgICAgICAgICAgQU5EIChvcHRpb25fbmFtZSBMSUtFICclYWNjb3VudCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVtZW51JScKICAgICAgICAgICAgICAgICBPUiBvcHRpb25fbmFtZSBMSUtFICclcGV0c2hvcCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVkb3dubG9hZHMlJykgTElNSVQgMzAiKTsKCiAgICAvLyA0KSBLdXIga29kYXMgbWluaSBuYXZpZ2F0aW9uIC8gbWVudSBpdGVtcwogICAgJGNvcmUgPSBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlJzsgJGNoaWxkID0gZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCk7CiAgICBmb3JlYWNoIChhcnJheSgnY29yZSc9PiRjb3JlLCdjaGlsZCc9PiRjaGlsZCkgYXMgJGs9PiRkKSB7CiAgICAgICAgaWYgKCFpc19kaXIoJGQpKSBjb250aW51ZTsKICAgICAgICAkaXQgPSBuZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGQsIFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yOjpTS0lQX0RPVFMpKTsKICAgICAgICBmb3JlYWNoICgkaXQgYXMgJGYpIHsKICAgICAgICAgICAgaWYgKCEkZi0+aXNGaWxlKCkgfHwgc3RydG9sb3dlcigkZi0+Z2V0RXh0ZW5zaW9uKCkpIT09J3BocCcpIGNvbnRpbnVlOwogICAgICAgICAgICAkYyA9IEBmaWxlX2dldF9jb250ZW50cygkZi0+Z2V0UGF0aG5hbWUoKSk7CiAgICAgICAgICAgIGlmICgkYz09PWZhbHNlKSBjb250aW51ZTsKICAgICAgICAgICAgJG4gPSBzdWJzdHJfY291bnQoJGMsJ2FjY291bnRfbWVudV9pdGVtcycpICsgc3Vic3RyX2NvdW50KCRjLCdhY2NvdW50X25hdmlnYXRpb24nKTsKICAgICAgICAgICAgaWYgKCRuKSB7ICRyWydtaW5pX25hdmlnYWNpamEnXVskay4nLycuc3RyX3JlcGxhY2UoJGQuJy8nLCcnLCRmLT5nZXRQYXRobmFtZSgpKV0gPSAkbjsgfQogICAgICAgIH0KICAgIH0KICAgIC8vIGFrdHl2dXMgc25pcHBldGFpCiAgICAkclsnc25pcF9uYXYnXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygKICAgICAgICAiU0VMRUNUIGlkLG5hbWUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cwogICAgICAgICAgV0hFUkUgYWN0aXZlPTEgQU5EIChjb2RlIExJS0UgJyVhY2NvdW50X21lbnVfaXRlbXMlJyBPUiBjb2RlIExJS0UgJyVhY2NvdW50X25hdmlnYXRpb24lJykiLCBBUlJBWV9BKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S329 Navigation Recon',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('navrecon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_nv5=Nv5c7"');
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
putB64('navrecon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
