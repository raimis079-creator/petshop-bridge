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
const php=Buffer.from('PD9waHAKLyoqCiAqIFVJIExvY2FsaXphdGlvbiBSdW50aW1lIEF1ZGl0IHYyCiAqIEtldHVyaSBmaWx0cmFpLiBSZW5rYSBUSUsgdGlrc2xpbmVzIGZyYXplcy4gSm9raXUgdmFydG90b2pvIGR1b21lbnUuCiAqLwppZiAoICEgZnVuY3Rpb25fZXhpc3RzKCdwczMzMV90YWlraW5pYWknKSApIHsKICAgIGZ1bmN0aW9uIHBzMzMxX3RhaWtpbmlhaSgpIHsKICAgICAgICByZXR1cm4gYXJyYXkoCiAgICAgICAgICAgICdTaG93IG1vcmUnLCdTaG93IGxlc3MnLCdTdWJtaXQnLCdNZW51JywnU2lnbiB1cCBmb3IgTmV3c2xldHRlcicsCiAgICAgICAgICAgICdGb2xsb3cgb24gRmFjZWJvb2snLCdGb2xsb3cgb24gSW5zdGFncmFtJywnRm9sbG93IG9uIFR3aXR0ZXInLAogICAgICAgICAgICAnU2VuZCB1cyBhbiBlbWFpbCcsJ0dvIHRvIHRvcCcsJ1BheW1lbnQgaWNvbnMnLCdQcm9kdWN0IFBhZ2luYXRpb24nLAogICAgICAgICAgICAnTmV4dCcsJ1ByZXZpb3VzJywnQ2hlY2tvdXQgc3RlcHMnLCdDaGVja291dCcsJ0Nsb3NlIGRpYWxvZycsCiAgICAgICAgICAgICdBZGQgdG8gY2FydCcsJ1JlYWQgbW9yZScsJ0NsZWFyIGZpbHRlcnMnLCdGaWx0ZXInLCdSZXN1bHRzJywKICAgICAgICApOwogICAgfQogICAgZnVuY3Rpb24gcHMzMzFfenltZWsoJHRla3N0YXMsICRkb21haW4sICRjdHgsICR2ZXJ0aW1hcywgJHNhbHRpbmlzKSB7CiAgICAgICAgJHRhaWsgPSBwczMzMV90YWlraW5pYWkoKTsKICAgICAgICAkc3V0YW1wYSA9IGluX2FycmF5KCR0ZWtzdGFzLCAkdGFpaywgdHJ1ZSk7CiAgICAgICAgaWYgKCEkc3V0YW1wYSAmJiBzdHJwb3MoJHRla3N0YXMsICdBZGQgdG8gY2FydCcpICE9PSBmYWxzZSkgeyAkc3V0YW1wYSA9IHRydWU7IH0KICAgICAgICBpZiAoISRzdXRhbXBhKSB7IHJldHVybjsgfQogICAgICAgICRHTE9CQUxTWydwczMzMSddW10gPSBhcnJheSgndCc9PiR0ZWtzdGFzLCdkJz0+JGRvbWFpbiwnYyc9PiRjdHgsJ3YnPT4kdmVydGltYXMsJ3MnPT4kc2FsdGluaXMpOwogICAgfQp9CmFkZF9maWx0ZXIoJ2dldHRleHQnLCBmdW5jdGlvbigkdiwkdCwkZCl7IHBzMzMxX3p5bWVrKCR0LCRkLG51bGwsJHYsJ2dldHRleHQnKTsgcmV0dXJuICR2OyB9LCA5OTksIDMpOwphZGRfZmlsdGVyKCdnZXR0ZXh0X3dpdGhfY29udGV4dCcsIGZ1bmN0aW9uKCR2LCR0LCRjLCRkKXsgcHMzMzFfenltZWsoJHQsJGQsJGMsJHYsJ2dldHRleHRfd2l0aF9jb250ZXh0Jyk7IHJldHVybiAkdjsgfSwgOTk5LCA0KTsKYWRkX2ZpbHRlcignbmdldHRleHQnLCBmdW5jdGlvbigkdiwkcywkcCwkbiwkZCl7IHBzMzMxX3p5bWVrKCRzLCRkLG51bGwsJHYsJ25nZXR0ZXh0Jyk7IHJldHVybiAkdjsgfSwgOTk5LCA1KTsKYWRkX2ZpbHRlcignbmdldHRleHRfd2l0aF9jb250ZXh0JywgZnVuY3Rpb24oJHYsJHMsJHAsJG4sJGMsJGQpeyBwczMzMV96eW1laygkcywkZCwkYywkdiwnbmdldHRleHRfd2l0aF9jb250ZXh0Jyk7IHJldHVybiAkdjsgfSwgOTk5LCA2KTsKCmFkZF9hY3Rpb24oJ3NodXRkb3duJywgZnVuY3Rpb24oKXsKICAgIGlmIChlbXB0eSgkR0xPQkFMU1sncHMzMzEnXSkpIHJldHVybjsKICAgICRzZW5hID0gZ2V0X29wdGlvbigncHMzMzFfbG9nJywgYXJyYXkoKSk7CiAgICBpZiAoIWlzX2FycmF5KCRzZW5hKSkgJHNlbmEgPSBhcnJheSgpOwogICAgZm9yZWFjaCAoJEdMT0JBTFNbJ3BzMzMxJ10gYXMgJGUpIHsKICAgICAgICAkayA9ICRlWyd0J10uJ3x8Jy4kZVsnZCddLid8fCcuKHN0cmluZykkZVsnYyddLid8fCcuJGVbJ3MnXTsKICAgICAgICBpZiAoIWlzc2V0KCRzZW5hWyRrXSkpIHsgJHNlbmFbJGtdID0gJGU7ICRzZW5hWyRrXVsna2llayddID0gMDsgfQogICAgICAgICRzZW5hWyRrXVsna2llayddKys7CiAgICB9CiAgICB1cGRhdGVfb3B0aW9uKCdwczMzMV9sb2cnLCAkc2VuYSwgZmFsc2UpOwp9LCA5OTkpOwoKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfY29sJ10pICkgcmV0dXJuOwogICAgJHYgPSAkX0dFVFsncHNfY29sJ107CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGlmICgkdiA9PT0gJ3Jlc2V0JykgeyBkZWxldGVfb3B0aW9uKCdwczMzMV9sb2cnKTsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnb2snPT4xKSk7IGV4aXQ7IH0KICAgIGlmICgkdiA9PT0gJ3VybHMnKSB7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgKICAgICAgICAgICAgJ2tyZXBzZWxpcycgICAgPT4gd2NfZ2V0X2NhcnRfdXJsKCksCiAgICAgICAgICAgICdhdHNpc2thaXR5bWFzJz0+IHdjX2dldF9jaGVja291dF91cmwoKSwKICAgICAgICAgICAgJ3Bhc2t5cmEnICAgICAgPT4gd2NfZ2V0X3BhZ2VfcGVybWFsaW5rKCdteWFjY291bnQnKSwKICAgICAgICAgICAgJ3BhcmR1b3R1dmUnICAgPT4gd2NfZ2V0X3BhZ2VfcGVybWFsaW5rKCdzaG9wJyksCiAgICAgICAgKSwgSlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7CiAgICB9CiAgICBpZiAoJHYgPT09ICduZXJhc3RpJykgewogICAgICAgIC8vIGt1ciBneXZlbmEgdGVrc3RhaSwga3VyaXUgZ2V0dGV4dCdlIE5FUkEKICAgICAgICAkciA9IGFycmF5KCk7CiAgICAgICAgJHRpa3NsYWkgPSBhcnJheSgnU2lnbiB1cCBmb3IgTmV3c2xldHRlcicsJ0NoZWNrb3V0IHN0ZXBzJywnU2hvdyBsZXNzJywnUmVzdWx0cycsJ1JlYWQgbW9yZScpOwogICAgICAgIGZvcmVhY2ggKGFycmF5KCdmbGF0c29tZSc9PmdldF90ZW1wbGF0ZV9kaXJlY3RvcnkoKSwgJ2NoaWxkJz0+Z2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkpIGFzICRrPT4kZCkgewogICAgICAgICAgICBpZiAoIWlzX2RpcigkZCkpIGNvbnRpbnVlOwogICAgICAgICAgICAkaXQgPSBuZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGQsIFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yOjpTS0lQX0RPVFMpKTsKICAgICAgICAgICAgZm9yZWFjaCAoJGl0IGFzICRmKSB7CiAgICAgICAgICAgICAgICBpZiAoISRmLT5pc0ZpbGUoKSkgY29udGludWU7CiAgICAgICAgICAgICAgICAkZSA9IHN0cnRvbG93ZXIoJGYtPmdldEV4dGVuc2lvbigpKTsKICAgICAgICAgICAgICAgIGlmICghaW5fYXJyYXkoJGUsIGFycmF5KCdwaHAnLCdqcycpLCB0cnVlKSkgY29udGludWU7CiAgICAgICAgICAgICAgICAkYyA9IEBmaWxlX2dldF9jb250ZW50cygkZi0+Z2V0UGF0aG5hbWUoKSk7CiAgICAgICAgICAgICAgICBpZiAoJGMgPT09IGZhbHNlKSBjb250aW51ZTsKICAgICAgICAgICAgICAgIGZvcmVhY2ggKCR0aWtzbGFpIGFzICR0KSB7CiAgICAgICAgICAgICAgICAgICAgaWYgKHN0cnBvcygkYywgJHQpICE9PSBmYWxzZSkgewogICAgICAgICAgICAgICAgICAgICAgICAkaSA9IHN0cnBvcygkYywgJHQpOwogICAgICAgICAgICAgICAgICAgICAgICAkclskdF1bXSA9IGFycmF5KCdmYWlsYXMnPT4kay4nLycuc3RyX3JlcGxhY2UoJGQuJy8nLCcnLCRmLT5nZXRQYXRobmFtZSgpKSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndGlwYXMnPT4kZSwgJ2ZyYWdtZW50YXMnPT50cmltKHN1YnN0cigkYywgbWF4KDAsJGktMTIwKSwgMjQwKSkpOwogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgIH0KICAgICAgICAvLyBhciB0ZW1hIHNhdWdvIG51c3RhdHltdW9zZQogICAgICAgIGZvcmVhY2ggKGFycmF5KCduZXdzbGV0dGVyX3RpdGxlJywnZm9vdGVyX25ld3NsZXR0ZXInLCduZXdzbGV0dGVyX3RleHQnKSBhcyAkdG0pIHsKICAgICAgICAgICAgJHYyID0gZ2V0X3RoZW1lX21vZCgkdG0pOyBpZiAoJHYyKSB7ICRyWyd0aGVtZV9tb2RzJ11bJHRtXSA9ICR2MjsgfQogICAgICAgIH0KICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0OwogICAgfQogICAgaWYgKCR2ID09PSAncmVhZCcpIHsKICAgICAgICAkbG9nID0gZ2V0X29wdGlvbigncHMzMzFfbG9nJywgYXJyYXkoKSk7CiAgICAgICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9Pidjb2xsZWN0b3ItdjInLCdpcmFzdSc9PmNvdW50KCRsb2cpKTsKICAgICAgICBmb3JlYWNoICgkbG9nIGFzICRlKSB7CiAgICAgICAgICAgICRyWydrdmlldGltYWknXVtdID0gYXJyYXkoJ3Rla3N0YXMnPT4kZVsndCddLCdkb21haW4nPT4kZVsnZCddLCdjb250ZXh0Jz0+JGVbJ2MnXSwKICAgICAgICAgICAgICAgICdzYWx0aW5pcyc9PiRlWydzJ10sJ3ZlcnRpbWFzJz0+JGVbJ3YnXSwnaXN2ZXJzdGFzJz0+KCRlWyd2J10gIT09ICRlWyd0J10pLCdraWVrJz0+JGVbJ2tpZWsnXSk7CiAgICAgICAgfQogICAgICAgICRyYXN0aSA9IGFycmF5KCk7CiAgICAgICAgZm9yZWFjaCAoJGxvZyBhcyAkZSkgeyAkcmFzdGlbJGVbJ3QnXV0gPSB0cnVlOyB9CiAgICAgICAgJHJbJ05FUkFTVEknXSA9IGFycmF5X3ZhbHVlcyhhcnJheV9kaWZmKHBzMzMxX3RhaWtpbmlhaSgpLCBhcnJheV9rZXlzKCRyYXN0aSkpKTsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0OwogICAgfQogICAgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnZXJyJz0+MSkpOyBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('collector2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_col=read"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
// TIKRI WC URL'ai — nespejam
const uu=sh('curl -sSk -m 30 "'+SITE+'/?ps_col=urls"');
try{ O.urls=JSON.parse(uu.out); }catch(e){ O.urls_raw=uu.out.slice(0,300); }
sh('curl -sSk -m 30 -o /dev/null "'+SITE+'/?ps_col=reset"');
sh('sleep 2');
const pusl = [SITE+'/', SITE+'/parduotuve/', SITE+'/kategorija/sunims/',
              (O.urls&&O.urls.krepselis)||SITE+'/cart/', (O.urls&&O.urls.atsiskaitymas)||SITE+'/checkout/',
              SITE+'/paskyra/', SITE+'/augintinio-profilis/', SITE+'/kontaktai/', SITE+'/nera-xyz/'];
O.apkrauta=[];
for (const u of pusl) {
  const sep = u.indexOf('?')>=0 ? '&' : '?';
  const c = sh('curl -sSk -m 45 -H "Cache-Control: no-cache" -o /dev/null -w "%{http_code}" "'+u+sep+'nc='+Date.now()+'"').out.trim();
  O.apkrauta.push(u.replace(SITE,'')+' '+c);
  sh('sleep 1');
}
sh('sleep 2');
O.rez=uzk(1);
const nn=sh('curl -sSk -m 40 "'+SITE+'/?ps_col=nerasti"');
try{ O.nerasti=JSON.parse(nn.out); }catch(e){ O.nerasti_raw=nn.out.slice(0,400); }
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
putB64('collector2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
