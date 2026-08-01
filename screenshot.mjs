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
const php=Buffer.from('PD9waHAKLyoqCiAqIFVJIExvY2FsaXphdGlvbiBSdW50aW1lIEF1ZGl0IHYyCiAqIEtldHVyaSBmaWx0cmFpLiBSZW5rYSBUSUsgdGlrc2xpbmVzIGZyYXplcy4gSm9raXUgdmFydG90b2pvIGR1b21lbnUuCiAqLwppZiAoICEgZnVuY3Rpb25fZXhpc3RzKCdwczMzMV90YWlraW5pYWknKSApIHsKICAgIGZ1bmN0aW9uIHBzMzMxX3RhaWtpbmlhaSgpIHsKICAgICAgICByZXR1cm4gYXJyYXkoCiAgICAgICAgICAgICdTaG93IG1vcmUnLCdTaG93IGxlc3MnLCdTdWJtaXQnLCdNZW51JywnU2lnbiB1cCBmb3IgTmV3c2xldHRlcicsCiAgICAgICAgICAgICdGb2xsb3cgb24gRmFjZWJvb2snLCdGb2xsb3cgb24gSW5zdGFncmFtJywnRm9sbG93IG9uIFR3aXR0ZXInLAogICAgICAgICAgICAnU2VuZCB1cyBhbiBlbWFpbCcsJ0dvIHRvIHRvcCcsJ1BheW1lbnQgaWNvbnMnLCdQcm9kdWN0IFBhZ2luYXRpb24nLAogICAgICAgICAgICAnTmV4dCcsJ1ByZXZpb3VzJywnQ2hlY2tvdXQgc3RlcHMnLCdDaGVja291dCcsJ0Nsb3NlIGRpYWxvZycsCiAgICAgICAgICAgICdBZGQgdG8gY2FydCcsJ1JlYWQgbW9yZScsJ0NsZWFyIGZpbHRlcnMnLCdGaWx0ZXInLCdSZXN1bHRzJywKICAgICAgICApOwogICAgfQogICAgZnVuY3Rpb24gcHMzMzFfenltZWsoJHRla3N0YXMsICRkb21haW4sICRjdHgsICR2ZXJ0aW1hcywgJHNhbHRpbmlzKSB7CiAgICAgICAgJHRhaWsgPSBwczMzMV90YWlraW5pYWkoKTsKICAgICAgICAkc3V0YW1wYSA9IGluX2FycmF5KCR0ZWtzdGFzLCAkdGFpaywgdHJ1ZSk7CiAgICAgICAgaWYgKCEkc3V0YW1wYSAmJiBzdHJwb3MoJHRla3N0YXMsICdBZGQgdG8gY2FydCcpICE9PSBmYWxzZSkgeyAkc3V0YW1wYSA9IHRydWU7IH0KICAgICAgICBpZiAoISRzdXRhbXBhKSB7IHJldHVybjsgfQogICAgICAgICRHTE9CQUxTWydwczMzMSddW10gPSBhcnJheSgndCc9PiR0ZWtzdGFzLCdkJz0+JGRvbWFpbiwnYyc9PiRjdHgsJ3YnPT4kdmVydGltYXMsJ3MnPT4kc2FsdGluaXMpOwogICAgfQp9CmFkZF9maWx0ZXIoJ2dldHRleHQnLCBmdW5jdGlvbigkdiwkdCwkZCl7IHBzMzMxX3p5bWVrKCR0LCRkLG51bGwsJHYsJ2dldHRleHQnKTsgcmV0dXJuICR2OyB9LCA5OTksIDMpOwphZGRfZmlsdGVyKCdnZXR0ZXh0X3dpdGhfY29udGV4dCcsIGZ1bmN0aW9uKCR2LCR0LCRjLCRkKXsgcHMzMzFfenltZWsoJHQsJGQsJGMsJHYsJ2dldHRleHRfd2l0aF9jb250ZXh0Jyk7IHJldHVybiAkdjsgfSwgOTk5LCA0KTsKYWRkX2ZpbHRlcignbmdldHRleHQnLCBmdW5jdGlvbigkdiwkcywkcCwkbiwkZCl7IHBzMzMxX3p5bWVrKCRzLCRkLG51bGwsJHYsJ25nZXR0ZXh0Jyk7IHJldHVybiAkdjsgfSwgOTk5LCA1KTsKYWRkX2ZpbHRlcignbmdldHRleHRfd2l0aF9jb250ZXh0JywgZnVuY3Rpb24oJHYsJHMsJHAsJG4sJGMsJGQpeyBwczMzMV96eW1laygkcywkZCwkYywkdiwnbmdldHRleHRfd2l0aF9jb250ZXh0Jyk7IHJldHVybiAkdjsgfSwgOTk5LCA2KTsKCmFkZF9hY3Rpb24oJ3NodXRkb3duJywgZnVuY3Rpb24oKXsKICAgIGlmIChlbXB0eSgkR0xPQkFMU1sncHMzMzEnXSkpIHJldHVybjsKICAgICRzZW5hID0gZ2V0X29wdGlvbigncHMzMzFfbG9nJywgYXJyYXkoKSk7CiAgICBpZiAoIWlzX2FycmF5KCRzZW5hKSkgJHNlbmEgPSBhcnJheSgpOwogICAgZm9yZWFjaCAoJEdMT0JBTFNbJ3BzMzMxJ10gYXMgJGUpIHsKICAgICAgICAkayA9ICRlWyd0J10uJ3x8Jy4kZVsnZCddLid8fCcuKHN0cmluZykkZVsnYyddLid8fCcuJGVbJ3MnXTsKICAgICAgICBpZiAoIWlzc2V0KCRzZW5hWyRrXSkpIHsgJHNlbmFbJGtdID0gJGU7ICRzZW5hWyRrXVsna2llayddID0gMDsgfQogICAgICAgICRzZW5hWyRrXVsna2llayddKys7CiAgICB9CiAgICB1cGRhdGVfb3B0aW9uKCdwczMzMV9sb2cnLCAkc2VuYSwgZmFsc2UpOwp9LCA5OTkpOwoKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfY29sJ10pICkgcmV0dXJuOwogICAgJHYgPSAkX0dFVFsncHNfY29sJ107CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGlmICgkdiA9PT0gJ3Jlc2V0JykgeyBkZWxldGVfb3B0aW9uKCdwczMzMV9sb2cnKTsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnb2snPT4xKSk7IGV4aXQ7IH0KICAgIGlmICgkdiA9PT0gJ3JlYWQnKSB7CiAgICAgICAgJGxvZyA9IGdldF9vcHRpb24oJ3BzMzMxX2xvZycsIGFycmF5KCkpOwogICAgICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nY29sbGVjdG9yLXYyJywnaXJhc3UnPT5jb3VudCgkbG9nKSk7CiAgICAgICAgZm9yZWFjaCAoJGxvZyBhcyAkZSkgewogICAgICAgICAgICAkclsna3ZpZXRpbWFpJ11bXSA9IGFycmF5KCd0ZWtzdGFzJz0+JGVbJ3QnXSwnZG9tYWluJz0+JGVbJ2QnXSwnY29udGV4dCc9PiRlWydjJ10sCiAgICAgICAgICAgICAgICAnc2FsdGluaXMnPT4kZVsncyddLCd2ZXJ0aW1hcyc9PiRlWyd2J10sJ2lzdmVyc3Rhcyc9PigkZVsndiddICE9PSAkZVsndCddKSwna2llayc9PiRlWydraWVrJ10pOwogICAgICAgIH0KICAgICAgICAkcmFzdGkgPSBhcnJheSgpOwogICAgICAgIGZvcmVhY2ggKCRsb2cgYXMgJGUpIHsgJHJhc3RpWyRlWyd0J11dID0gdHJ1ZTsgfQogICAgICAgICRyWydORVJBU1RJJ10gPSBhcnJheV92YWx1ZXMoYXJyYXlfZGlmZihwczMzMV90YWlraW5pYWkoKSwgYXJyYXlfa2V5cygkcmFzdGkpKSk7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9PjEpKTsgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('collector.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_col=read"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
sh('curl -sSk -m 30 -o /dev/null "'+SITE+'/?ps_col=reset"');
sh('sleep 2');
// cache apejimas — unikalus parametras kiekvienam puslapiui
const pusl = ['/','/parduotuve/','/kategorija/sunims/','/krepselis/','/atsiskaitymas/',
              '/paskyra/','/augintinio-profilis/','/kontaktai/','/nera-tokio-puslapio-xyz/'];
O.apkrauta=[];
for (const p of pusl) {
  const sep = p.indexOf('?')>=0 ? '&' : '?';
  const c = sh('curl -sSk -m 45 -H "Cache-Control: no-cache" -o /dev/null -w "%{http_code}" "'+SITE+p+sep+'nocache='+Date.now()+Math.random()+'"').out.trim();
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
putB64('collector.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
