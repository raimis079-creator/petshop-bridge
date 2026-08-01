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
const php=Buffer.from('PD9waHAKLyoqCiAqIFVJIExvY2FsaXphdGlvbiBSdW50aW1lIEF1ZGl0IOKAlCBwb3Jhc3RlcyBrb250YWt0dSBrZWl0aW1hcwogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfZnQ5J10pICkgcmV0dXJuOwogICAgJHYgPSAkX0dFVFsncHNfZnQ5J107CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nZm9vdGVyLWZpeC12MScpOwoKICAgICRvcHQgPSBnZXRfb3B0aW9uKCd3aWRnZXRfY3VzdG9tX2h0bWwnKTsKICAgIGlmICghaXNzZXQoJG9wdFs1XSkpIHsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnZXJyJz0+J25lcmEgd2lkZ2V0IDUnKSk7IGV4aXQ7IH0KICAgICRzZW5hID0gJG9wdFs1XVsnY29udGVudCddOwogICAgJHJbJ3ByaWVzJ10gPSAkc2VuYTsKCiAgICAvLyBUSUtTTEkgZWlsdXRlIHN1IGVsLiBwYXN0dSAtPiBudW9yb2RhIGkga29udGFrdHVzCiAgICAkc2VuYXNfYmxva2FzID0gIjxwIHN0eWxlPVwibWFyZ2luLWJvdHRvbTo4cHg7XCI+XHJcbiAgPGEgaHJlZj1cIm1haWx0bzp0ZXJyYUBwZXRzaG9wLmx0XCIgc3R5bGU9XCJjb2xvcjojZmZmY2VjO1wiPnRlcnJhQHBldHNob3AubHQ8L2E+XHJcbjwvcD4iOwogICAgJG5hdWphc19ibG9rYXMgPSAiPHAgc3R5bGU9XCJtYXJnaW4tYm90dG9tOjhweDtcIj5cclxuICA8YSBocmVmPVwiL2tvbnRha3RhaS9cIiBzdHlsZT1cImNvbG9yOiNmZmZjZWM7XCI+UGFyYcWheXRpIG11bXM8L2E+XHJcbjwvcD4iOwogICAgJHJbJ2lua2FyYXNfcmFzdGFzJ10gPSAoc3RycG9zKCRzZW5hLCAkc2VuYXNfYmxva2FzKSAhPT0gZmFsc2UpOwoKICAgIGlmICgkdiA9PT0gJ0Z0OWRyeScpIHsKICAgICAgICAvLyBhdHNhcmdpbmUgcGFpZXNrYSwgamVpIHRpa3NsdXMgaW5rYXJhcyBuZXN1dGFtcGEgKFxyXG4gc2tpcnR1bWFpKQogICAgICAgICRyWydtYWlsdG9fa2FydGFpJ10gPSBzdWJzdHJfY291bnQoJHNlbmEsICdtYWlsdG86dGVycmFAcGV0c2hvcC5sdCcpOwogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7CiAgICB9CgogICAgaWYgKCR2ID09PSAnRnQ5YXBwbHknKSB7CiAgICAgICAgaWYgKCEkclsnaW5rYXJhc19yYXN0YXMnXSkgewogICAgICAgICAgICAvLyBsYW5rc3Rlc25pcyBrZWxpYXM6IGtlaWNpYW0gVElLIDxhPiBzdSBtYWlsdG8KICAgICAgICAgICAgJG5hdWphcyA9IHByZWdfcmVwbGFjZSgKICAgICAgICAgICAgICAgICcjPGEgaHJlZj0ibWFpbHRvOnRlcnJhQHBldHNob3BcLmx0IihbXj5dKik+dGVycmFAcGV0c2hvcFwubHQ8L2E+IycsCiAgICAgICAgICAgICAgICAnPGEgaHJlZj0iL2tvbnRha3RhaS8iJDE+UGFyYcWheXRpIG11bXM8L2E+JywKICAgICAgICAgICAgICAgICRzZW5hLCAtMSwgJGtpZWspOwogICAgICAgICAgICAkclsncmVnZXhfcGFrZWlzdGEnXSA9ICRraWVrOwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgICRuYXVqYXMgPSBzdHJfcmVwbGFjZSgkc2VuYXNfYmxva2FzLCAkbmF1amFzX2Jsb2thcywgJHNlbmEpOwogICAgICAgICAgICAkclsncmVnZXhfcGFrZWlzdGEnXSA9IDE7CiAgICAgICAgfQogICAgICAgIGlmICgkbmF1amFzID09PSAkc2VuYSkgeyAkclsnVkVSRElLVEFTJ109J05JRUtPIE5FUEFLRUlTVEEg4oCUIHN1c3RhYmR5dGEnOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsgfQoKICAgICAgICAvLyBCQUNLVVAgcHJpZXMgcmFzYW50CiAgICAgICAgdXBkYXRlX29wdGlvbigncHNfZm9vdGVyX3dpZGdldDVfYmFrXzIwMjYwODAxJywgJHNlbmEsIGZhbHNlKTsKICAgICAgICAkb3B0WzVdWydjb250ZW50J10gPSAkbmF1amFzOwogICAgICAgIHVwZGF0ZV9vcHRpb24oJ3dpZGdldF9jdXN0b21faHRtbCcsICRvcHQpOwogICAgICAgICRyWydwbyddID0gJG5hdWphczsKCiAgICAgICAgLy8gc29jaWFsaW5pdSBpa29udSBzbGVwaW1hcyDigJQgdmlzb3Mga2V0dXJpb3MgcGxhY2Vob2xkZXInaWFpCiAgICAgICAgZm9yZWFjaCAoYXJyYXkoJ2ZvbGxvd19mYWNlYm9vaycsJ2ZvbGxvd19pbnN0YWdyYW0nLCdmb2xsb3dfdHdpdHRlcicsJ2ZvbGxvd19lbWFpbCcpIGFzICRrKSB7CiAgICAgICAgICAgICRyWyd0aGVtZV9tb2RfcHJpZXMnXVska10gPSBnZXRfdGhlbWVfbW9kKCRrKTsKICAgICAgICAgICAgcmVtb3ZlX3RoZW1lX21vZCgkayk7CiAgICAgICAgICAgIHNldF90aGVtZV9tb2QoJGssICcnKTsKICAgICAgICAgICAgJHJbJ3RoZW1lX21vZF9wbyddWyRrXSA9IGdldF90aGVtZV9tb2QoJGspOwogICAgICAgIH0KICAgICAgICB3cF9jYWNoZV9mbHVzaCgpOwoKICAgICAgICAvLyBQQVRJS1JBIOKAlCB0aWtyYXMgSFRNTAogICAgICAgICRyZXNwID0gd3BfcmVtb3RlX2dldChob21lX3VybCgnLycpLCBhcnJheSgndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSwKICAgICAgICAgICAgJ2hlYWRlcnMnPT5hcnJheSgnQ2FjaGUtQ29udHJvbCc9Piduby1jYWNoZScpKSk7CiAgICAgICAgJGggPSBpc193cF9lcnJvcigkcmVzcCkgPyAnJyA6IHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyZXNwKTsKICAgICAgICAkclsncGF0aWtyYSddID0gYXJyYXkoCiAgICAgICAgICAgICd0ZXJyYV9wYXN0YXNfcG9yYXN0ZWplJyA9PiBzdWJzdHJfY291bnQoJGgsJ3RlcnJhQHBldHNob3AubHQnKSwKICAgICAgICAgICAgJ21haWx0b195b3VyX2VtYWlsJyAgICAgID0+IHN1YnN0cl9jb3VudCgkaCwneW91ckBlbWFpbCcpLAogICAgICAgICAgICAnaHJlZl9odHRwX3VybCcgICAgICAgICAgPT4gc3Vic3RyX2NvdW50KCRoLCdocmVmPSJodHRwOi8vdXJsIicpLAogICAgICAgICAgICAna29udGFrdHVfbnVvcm9kYScgICAgICAgPT4gc3Vic3RyX2NvdW50KCRoLCc+UGFyYcWheXRpIG11bXM8JyksCiAgICAgICAgICAgICd0ZWxlZm9uYXMnICAgICAgICAgICAgICA9PiBzdWJzdHJfY291bnQoJGgsJzg3Nzg3JyksCiAgICAgICAgICAgICdGb2xsb3dfb25fRmFjZWJvb2snICAgICA9PiBzdWJzdHJfY291bnQoJGgsJ0ZvbGxvdyBvbiBGYWNlYm9vaycpLAogICAgICAgICAgICAnZmFjZWJvb2tfY29tX2JlbmRyYXMnICAgPT4gc3Vic3RyX2NvdW50KCRoLCdocmVmPSJodHRwczovL3d3dy5mYWNlYm9vay5jb20iJyksCiAgICAgICAgKTsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQogICAgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnZXJyJz0+J25lemlub21hcycpKTsgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('footerfix.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_ft9=Ft9dry"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.dry=uzk(1);
sh('sleep 3');
const a=sh('curl -sSk -m 40 "'+SITE+'/?ps_ft9=Ft9apply"');
try{ O.apply=JSON.parse(a.out); }catch(e){ O.apply_raw=a.out.slice(0,700); }
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
putB64('footerfix.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
