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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzAgR2V0dGV4dCBDYWxsLVNpdGUgS29sZWt0b3JpdXMg4oCUIFRJSyBTS0FJVFlNQVMKICogVXpyYXNpbsSXamEgVElLUlVTIGdldHRleHQga3ZpZXRpbXVzIChkb21haW4gKyBjb250ZXh0KSwgbyBuZSBzcGVsaW9qYSBpcyBrb2RvLgogKi8KaWYgKCAhIGZ1bmN0aW9uX2V4aXN0cygncHMzMzBfdGFpa2luaWFpJykgKSB7CiAgICBmdW5jdGlvbiBwczMzMF90YWlraW5pYWkoKSB7CiAgICAgICAgcmV0dXJuIGFycmF5KAogICAgICAgICAgICAnU2hvdyBtb3JlJywnU3VibWl0JywnTWVudScsJ1NpZ24gdXAgZm9yIE5ld3NsZXR0ZXInLAogICAgICAgICAgICAnRm9sbG93IG9uIEZhY2Vib29rJywnRm9sbG93IG9uIEluc3RhZ3JhbScsJ0ZvbGxvdyBvbiBUd2l0dGVyJywKICAgICAgICAgICAgJ1NlbmQgdXMgYW4gZW1haWwnLCdHbyB0byB0b3AnLCdQYXltZW50IGljb25zJywnUHJvZHVjdCBQYWdpbmF0aW9uJywKICAgICAgICAgICAgJ05leHQnLCdDaGVja291dCBzdGVwcycsJ0NoZWNrb3V0JywnQ2xvc2UgZGlhbG9nJywKICAgICAgICApOwogICAgfQp9Ci8vIEtPTEVLVE9SSVVTIOKAlCB2ZWlraWEgVklTT1NFIHV6a2xhdXNvc2UsIGtvbCBzbmlwcGV0J2FzIGFrdHl2dXMKYWRkX2ZpbHRlcignZ2V0dGV4dCcsIGZ1bmN0aW9uKCR2ZXJ0aW1hcywgJHRla3N0YXMsICRkb21haW4pewogICAgaWYgKGluX2FycmF5KCR0ZWtzdGFzLCBwczMzMF90YWlraW5pYWkoKSwgdHJ1ZSkpIHsKICAgICAgICAkR0xPQkFMU1sncHMzMzAnXVtdID0gYXJyYXkoJ3QnPT4kdGVrc3RhcywgJ2QnPT4kZG9tYWluLCAnYyc9Pm51bGwsICd2Jz0+JHZlcnRpbWFzKTsKICAgIH0KICAgIHJldHVybiAkdmVydGltYXM7Cn0sIDk5OSwgMyk7CmFkZF9maWx0ZXIoJ2dldHRleHRfd2l0aF9jb250ZXh0JywgZnVuY3Rpb24oJHZlcnRpbWFzLCAkdGVrc3RhcywgJGN0eCwgJGRvbWFpbil7CiAgICBpZiAoaW5fYXJyYXkoJHRla3N0YXMsIHBzMzMwX3RhaWtpbmlhaSgpLCB0cnVlKSkgewogICAgICAgICRHTE9CQUxTWydwczMzMCddW10gPSBhcnJheSgndCc9PiR0ZWtzdGFzLCAnZCc9PiRkb21haW4sICdjJz0+JGN0eCwgJ3YnPT4kdmVydGltYXMpOwogICAgfQogICAgcmV0dXJuICR2ZXJ0aW1hczsKfSwgOTk5LCA0KTsKLy8g4oCeQWRkIHRvIGNhcnQ6ICVzIiBpciBwYW5hc3VzIHN1IHBsYWNlaG9sZGVyJ2l1CmFkZF9maWx0ZXIoJ2dldHRleHQnLCBmdW5jdGlvbigkdmVydGltYXMsICR0ZWtzdGFzLCAkZG9tYWluKXsKICAgIGlmIChzdHJwb3MoJHRla3N0YXMsJ0FkZCB0byBjYXJ0JykgIT09IGZhbHNlIHx8IHN0cnBvcygkdGVrc3RhcywnJXMnKSAhPT0gZmFsc2UpIHsKICAgICAgICBpZiAoc3RycG9zKCR0ZWtzdGFzLCdBZGQgdG8gY2FydCcpICE9PSBmYWxzZSkgewogICAgICAgICAgICAkR0xPQkFMU1sncHMzMzAnXVtdID0gYXJyYXkoJ3QnPT4kdGVrc3RhcywgJ2QnPT4kZG9tYWluLCAnYyc9PicocGxhY2Vob2xkZXIpJywgJ3YnPT4kdmVydGltYXMpOwogICAgICAgIH0KICAgIH0KICAgIHJldHVybiAkdmVydGltYXM7Cn0sIDk5OCwgMyk7CgphZGRfYWN0aW9uKCdzaHV0ZG93bicsIGZ1bmN0aW9uKCl7CiAgICBpZiAoZW1wdHkoJEdMT0JBTFNbJ3BzMzMwJ10pKSByZXR1cm47CiAgICAkc2VuYSA9IGdldF9vcHRpb24oJ3BzMzMwX2xvZycsIGFycmF5KCkpOwogICAgaWYgKCFpc19hcnJheSgkc2VuYSkpICRzZW5hID0gYXJyYXkoKTsKICAgIGZvcmVhY2ggKCRHTE9CQUxTWydwczMzMCddIGFzICRlKSB7CiAgICAgICAgJHJha3RhcyA9ICRlWyd0J10uJ3wnLiRlWydkJ10uJ3wnLihzdHJpbmcpJGVbJ2MnXTsKICAgICAgICBpZiAoIWlzc2V0KCRzZW5hWyRyYWt0YXNdKSkgeyAkc2VuYVskcmFrdGFzXSA9ICRlOyAkc2VuYVskcmFrdGFzXVsna2llayddID0gMDsgfQogICAgICAgICRzZW5hWyRyYWt0YXNdWydraWVrJ10rKzsKICAgIH0KICAgIHVwZGF0ZV9vcHRpb24oJ3BzMzMwX2xvZycsICRzZW5hLCBmYWxzZSk7Cn0sIDk5OSk7CgphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19ndDUnXSkgKSByZXR1cm47CiAgICAkdmVpa3NtYXMgPSAkX0dFVFsncHNfZ3Q1J107CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKCiAgICBpZiAoJHZlaWtzbWFzID09PSAnR3Q1cmVzZXQnKSB7IGRlbGV0ZV9vcHRpb24oJ3BzMzMwX2xvZycpOyBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdvayc9Pidpc3ZhbHl0YScpKTsgZXhpdDsgfQoKICAgIGlmICgkdmVpa3NtYXMgPT09ICdHdDVyZWFkJykgewogICAgICAgICRsb2cgPSBnZXRfb3B0aW9uKCdwczMzMF9sb2cnLCBhcnJheSgpKTsKICAgICAgICAkciA9IGFycmF5KCdWRVJTSUpBJz0+J2dldHRleHQtY29sbGVjdG9yLXYxJywgJ2lyYXN1Jz0+Y291bnQoJGxvZykpOwogICAgICAgIGZvcmVhY2ggKCRsb2cgYXMgJHJha3RhcyA9PiAkZSkgewogICAgICAgICAgICAkclsna3ZpZXRpbWFpJ11bXSA9IGFycmF5KAogICAgICAgICAgICAgICAgJ3Rla3N0YXMnID0+ICRlWyd0J10sICdkb21haW4nID0+ICRlWydkJ10sICdjb250ZXh0JyA9PiAkZVsnYyddLAogICAgICAgICAgICAgICAgJ2RhYmFydGluaXNfdmVydGltYXMnID0+ICRlWyd2J10sICdraWVrJyA9PiAkZVsna2llayddLAogICAgICAgICAgICAgICAgJ2FyX2lzdmVyc3RhcycgPT4gKCRlWyd2J10gIT09ICRlWyd0J10pLAogICAgICAgICAgICApOwogICAgICAgIH0KICAgICAgICAvLyBrdXJpZSB0YWlraW5pYWkgTkVQQVNJUk9ERSBnZXR0ZXh0J2UgLT4gSlMgc2FsdGluaXMKICAgICAgICAkcmFzdGkgPSBhcnJheSgpOwogICAgICAgIGZvcmVhY2ggKCRsb2cgYXMgJGUpIHsgJHJhc3RpWyRlWyd0J11dID0gdHJ1ZTsgfQogICAgICAgICRyWydORVJBU1RJX2dldHRleHQnXSA9IGFycmF5X3ZhbHVlcyhhcnJheV9kaWZmKHBzMzMwX3RhaWtpbmlhaSgpLCBhcnJheV9rZXlzKCRyYXN0aSkpKTsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogICAgICAgIGV4aXQ7CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdlcnInPT4nbmV6aW5vbWFzIHZlaWtzbWFzJykpOyBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S330 Gettext Kolektorius',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('gettext.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_gt5=Gt5read"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
// 1) isvalom, 2) apkraunam 8 puslapius (kolektorius veikia ju uzklausose), 3) skaitom
sh('curl -sSk -m 30 -o /dev/null "'+SITE+'/?ps_gt5=Gt5reset"');
sh('sleep 2');
const pusl = ['/','/parduotuve/','/kategorija/sunims/','/krepselis/','/atsiskaitymas/',
              '/paskyra/','/augintinio-profilis/','/toks-puslapis-nera-xyz/'];
O.apkrauta = [];
for (const p of pusl) {
  const c = sh('curl -sSk -m 40 -o /dev/null -w "%{http_code}" "'+SITE+p+'"').out.trim();
  O.apkrauta.push(p+' '+c);
  sh('sleep 1');
}
sh('sleep 2');
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
putB64('gettext.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
