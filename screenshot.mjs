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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjkgQXZhdGFyL1NpZGViYXIgUmVjb24KICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2F2OSddKSB8fCAkX0dFVFsncHNfYXY5J10gIT09ICdBdjlyNicgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nYXZhdGFyLXJlY29uLXYxJyk7CiAgICAkY29yZSA9IFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvJzsKCiAgICAvLyAxKSBhdmF0YXJvIGtsYXNlIOKAlCBrb2tpYSBTQUxZR0EKICAgICRwID0gJGNvcmUuJ2luY2x1ZGVzL2NsYXNzLWFjY291bnQtYXZhdGFyLnBocCc7CiAgICAkclsnYXZhdGFyX3lyYSddID0gaXNfcmVhZGFibGUoJHApOwogICAgaWYgKCRyWydhdmF0YXJfeXJhJ10pIHsgJHJbJ2F2YXRhcl9rb2RhcyddID0gZmlsZV9nZXRfY29udGVudHMoJHApOyB9CgogICAgLy8gMikgYXIga3VyIG5vcnMgbGlrZXMgJ215LWFjY291bnQnIFBBTFlHSU5JTUFTICh2aXNvc2UgdGVtb3NlIGlyIHBsdWdpbnVvc2UpCiAgICAkZGlycyA9IGFycmF5KAogICAgICAnZmxhdHNvbWUnID0+IGdldF90ZW1wbGF0ZV9kaXJlY3RvcnkoKSwKICAgICAgJ2NoaWxkJyAgICA9PiBnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKSwKICAgICAgJ2NvcmUnICAgICA9PiBydHJpbSgkY29yZSwnLycpLAogICAgKTsKICAgIGZvcmVhY2ggKCRkaXJzIGFzICRrPT4kZCkgewogICAgICAgIGlmICghaXNfZGlyKCRkKSkgY29udGludWU7CiAgICAgICAgJGl0ID0gbmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRkLCBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcjo6U0tJUF9ET1RTKSk7CiAgICAgICAgZm9yZWFjaCAoJGl0IGFzICRmKSB7CiAgICAgICAgICAgIGlmICghJGYtPmlzRmlsZSgpIHx8IHN0cnRvbG93ZXIoJGYtPmdldEV4dGVuc2lvbigpKSE9PSdwaHAnKSBjb250aW51ZTsKICAgICAgICAgICAgJGMgPSBAZmlsZV9nZXRfY29udGVudHMoJGYtPmdldFBhdGhuYW1lKCkpOwogICAgICAgICAgICBpZiAoJGM9PT1mYWxzZSB8fCBzdHJwb3MoJGMsJ215LWFjY291bnQnKT09PWZhbHNlKSBjb250aW51ZTsKICAgICAgICAgICAgLy8gdGlrIFJFQUxVUyBwYWx5Z2luaW1haSwgbmUga29tZW50YXJhaQogICAgICAgICAgICAkZWlsID0gYXJyYXkoKTsKICAgICAgICAgICAgZm9yZWFjaCAoZXhwbG9kZSgiXG4iLCRjKSBhcyAkbj0+JGwpIHsKICAgICAgICAgICAgICAgIGlmIChzdHJwb3MoJGwsJ215LWFjY291bnQnKT09PWZhbHNlKSBjb250aW51ZTsKICAgICAgICAgICAgICAgICR0ID0gbHRyaW0oJGwpOwogICAgICAgICAgICAgICAgaWYgKHN0cnBvcygkdCwnKicpPT09MCB8fCBzdHJwb3MoJHQsJy8vJyk9PT0wIHx8IHN0cnBvcygkdCwnIycpPT09MCkgY29udGludWU7CiAgICAgICAgICAgICAgICAkZWlsW10gPSAoJG4rMSkuJzogJy50cmltKHN1YnN0cigkbCwwLDE0MCkpOwogICAgICAgICAgICB9CiAgICAgICAgICAgIGlmICgkZWlsKSB7ICRyWydwYWx5Z2luaW1haSddWyRrLicvJy5zdHJfcmVwbGFjZSgkZC4nLycsJycsJGYtPmdldFBhdGhuYW1lKCkpXSA9ICRlaWw7IH0KICAgICAgICB9CiAgICB9CgogICAgLy8gMykgdGlrcmFzIEhUTUwg4oCUIE15QWNjb3VudC1jb250ZW50IHNyaXRpcwogICAgJHUgPSBnZXRfdXNlcl9ieSgnbG9naW4nLCdwc19zMzI5X3Rlc3QnKTsKICAgICRjayA9IHdwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1LT5JRCwgdGltZSgpKzMwMCwgJ2xvZ2dlZF9pbicpOwogICAgJHJlc3AgPSB3cF9yZW1vdGVfZ2V0KHdjX2dldF9wYWdlX3Blcm1hbGluaygnbXlhY2NvdW50JyksIGFycmF5KAogICAgICAgICd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdoZWFkZXJzJz0+YXJyYXkoJ0Nvb2tpZSc9PkxPR0dFRF9JTl9DT09LSUUuJz0nLiRjaykpKTsKICAgICRodG1sID0gaXNfd3BfZXJyb3IoJHJlc3ApID8gJycgOiB3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcmVzcCk7CiAgICAkaSA9IHN0cnBvcygkaHRtbCwgJ3dvb2NvbW1lcmNlLU15QWNjb3VudC1jb250ZW50Jyk7CiAgICAkclsnY29udGVudF9zcml0aXMnXSA9ICRpIT09ZmFsc2UgPyBzdWJzdHIoJGh0bWwsIG1heCgwLCRpLTI1MDApLCAzNTAwKSA6ICduZXJhc3RhJzsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S329 Avatar Recon',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('avrecon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_av9=Av9r6"');
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
putB64('avrecon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
