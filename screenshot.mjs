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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzAgVUkgTG9rYWxpemFjaWpvcyBBdWRpdGFzIOKAlCBUSUsgU0tBSVRZTUFTCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19pMTgnXSkgfHwgJF9HRVRbJ3BzX2kxOCddICE9PSAnSTE4bjYnICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICAkciA9IGFycmF5KCdWRVJTSUpBJz0+J2kxOG4tYXVkaXQtdjEnKTsKCiAgICAvLyBhbmdsaXNraSBVSSB0ZWtzdGFpLCBrdXJpdSBORVRVUkVUVSBidXRpCiAgICAkaWVza29tID0gYXJyYXkoCiAgICAgICAgJ1Nob3cgbW9yZScsJ1Nob3cgbGVzcycsJ0NsZWFyIGZpbHRlcnMnLCdDbGVhciBhbGwnLCdSZXN1bHRzJywnTm8gcHJvZHVjdHMgZm91bmQnLAogICAgICAgICdGaWx0ZXInLCdTb3J0IGJ5JywnQWRkIHRvIGNhcnQnLCdSZWFkIG1vcmUnLCdTZWxlY3Qgb3B0aW9ucycsJ1ZpZXcgY2FydCcsCiAgICAgICAgJ1lvdXIgY2FydCBpcyBjdXJyZW50bHkgZW1wdHknLCdSZXR1cm4gdG8gc2hvcCcsJ0NvbnRpbnVlIHNob3BwaW5nJywnVXBkYXRlIGNhcnQnLAogICAgICAgICdQcm9jZWVkIHRvIGNoZWNrb3V0JywnQXBwbHkgY291cG9uJywnQ291cG9uIGNvZGUnLCdIYXZlIGEgY291cG9uJywKICAgICAgICAnVXNlcm5hbWUgb3IgZW1haWwnLCdSZW1lbWJlciBtZScsJ0xvc3QgeW91ciBwYXNzd29yZCcsJ1JlZ2lzdGVyJywnTG9nIGluJywnTG9naW4nLAogICAgICAgICdTaWduIHVwIGZvciBOZXdzbGV0dGVyJywnRm9sbG93IG9uIEZhY2Vib29rJywnRm9sbG93IG9uIEluc3RhZ3JhbScsJ0ZvbGxvdyBvbiBUd2l0dGVyJywKICAgICAgICAnUGFnZSBub3QgZm91bmQnLCdOb3RoaW5nIGZvdW5kJywnU2VhcmNoIHJlc3VsdHMnLCdSZWFkIE1vcmUnLCdTYWxlIScsJ091dCBvZiBzdG9jaycsCiAgICAgICAgJ0luIHN0b2NrJywnUmVsYXRlZCBwcm9kdWN0cycsJ1lvdSBtYXkgYWxzbyBsaWtlJywnRGVzY3JpcHRpb24nLCdSZXZpZXdzJywKICAgICAgICAnQWRkaXRpb25hbCBpbmZvcm1hdGlvbicsJ1JlcXVpcmVkJywnT3B0aW9uYWwnLCdTdWJtaXQnLCdDYW5jZWwnLCdTYXZlJywnQ2xvc2UnLAogICAgICAgICdQcmV2aW91cycsJ05leHQnLCdIb21lJywnU2hvcCcsJ0NhcnQnLCdDaGVja291dCcsJ015IGFjY291bnQnLCdTZWFyY2gnLAogICAgICAgICdTb3JyeScsJ1BsZWFzZScsJ3JlcXVpcmVkIGZpZWxkJywnTm8gaXRlbXMnLCdMb2FkaW5nJywKICAgICk7CgogICAgJHB1c2xhcGlhaSA9IGFycmF5KAogICAgICAgICdwYWdyaW5kaW5pcycgID0+IGhvbWVfdXJsKCcvJyksCiAgICAgICAgJ3BhcmR1b3R1dmUnICAgPT4gaG9tZV91cmwoJy9wYXJkdW90dXZlLycpLAogICAgICAgICdzdW5pbXMnICAgICAgID0+IGhvbWVfdXJsKCcvc3VuaW1zLycpLAogICAgICAgICdrcmVwc2VsaXMnICAgID0+IHdjX2dldF9jYXJ0X3VybCgpLAogICAgICAgICdhdHNpc2thaXR5bWFzJz0+IHdjX2dldF9jaGVja291dF91cmwoKSwKICAgICAgICAncGFza3lyYScgICAgICA9PiB3Y19nZXRfcGFnZV9wZXJtYWxpbmsoJ215YWNjb3VudCcpLAogICAgICAgICdhbmtldGEnICAgICAgID0+IGhvbWVfdXJsKCcvYXVnaW50aW5pby1wcm9maWxpcy8nKSwKICAgICAgICAnNDA0JyAgICAgICAgICA9PiBob21lX3VybCgnL3Rva3MtcHVzbGFwaXMtbmVlZ3ppc3R1b2phLXh5ei8nKSwKICAgICk7CgogICAgZm9yZWFjaCAoJHB1c2xhcGlhaSBhcyAkdmFyZGFzID0+ICR1cmwpIHsKICAgICAgICAkcmVzcCA9IHdwX3JlbW90ZV9nZXQoJHVybCwgYXJyYXkoJ3RpbWVvdXQnPT4zNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsKICAgICAgICBpZiAoaXNfd3BfZXJyb3IoJHJlc3ApKSB7ICRyWydwdXNsYXBpYWknXVskdmFyZGFzXSA9ICdFUlIgJy4kcmVzcC0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsgY29udGludWU7IH0KICAgICAgICAkaCA9IHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyZXNwKTsKICAgICAgICAka29kYXMgPSB3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcmVzcCk7CgogICAgICAgIC8vIHNhbGluYW0gPHNjcmlwdD4sIDxzdHlsZT4gaXIgSFRNTCB6eW1lcyDigJQgdGlrcmluYW0gVElLIG1hdG9tYSB0ZWtzdGEKICAgICAgICAkaDIgPSBwcmVnX3JlcGxhY2UoJyM8c2NyaXB0W14+XSo+Lio/PC9zY3JpcHQ+I2lzJywgJyAnLCAkaCk7CiAgICAgICAgJGgyID0gcHJlZ19yZXBsYWNlKCcjPHN0eWxlW14+XSo+Lio/PC9zdHlsZT4jaXMnLCAnICcsICRoMik7CiAgICAgICAgLy8gYXJpYS1sYWJlbCAvIHRpdGxlIC8gcGxhY2Vob2xkZXIgdGFpcCBwYXQgbWF0b21pIHZhcnRvdG9qdWkKICAgICAgICBwcmVnX21hdGNoX2FsbCgnLyg/OmFyaWEtbGFiZWx8dGl0bGV8cGxhY2Vob2xkZXJ8YWx0KT1bIlwnXShbXiJcJ117Myw2MH0pWyJcJ10vJywgJGgyLCAkYXR0cik7CiAgICAgICAgJHRla3N0YXMgPSB3cF9zdHJpcF9hbGxfdGFncygkaDIpIC4gJyAnIC4gaW1wbG9kZSgnIHwgJywgJGF0dHJbMV0pOwoKICAgICAgICAkcmFzdGEgPSBhcnJheSgpOwogICAgICAgIGZvcmVhY2ggKCRpZXNrb20gYXMgJGZyKSB7CiAgICAgICAgICAgICRuID0gc3Vic3RyX2NvdW50KCR0ZWtzdGFzLCAkZnIpOwogICAgICAgICAgICBpZiAoJG4gPiAwKSB7CiAgICAgICAgICAgICAgICAkaSA9IHN0cnBvcygkdGVrc3RhcywgJGZyKTsKICAgICAgICAgICAgICAgICRyYXN0YVskZnJdID0gYXJyYXkoJ2tpZWsnPT4kbiwgJ2tvbnRla3N0YXMnPT50cmltKHByZWdfcmVwbGFjZSgnL1xzKy91JywnICcsIHN1YnN0cigkdGVrc3RhcywgbWF4KDAsJGktNzApLCAxNzApKSkpOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgICRyWydwdXNsYXBpYWknXVskdmFyZGFzXSA9IGFycmF5KCd1cmwnPT4kdXJsLCAna29kYXMnPT4ka29kYXMsICdyYXN0YSc9PiRyYXN0YSwgJ2tpZWsnPT5jb3VudCgkcmFzdGEpKTsKICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S330 i18n Auditas',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('i18n.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_i18=I18n6"');
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
putB64('i18n.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
