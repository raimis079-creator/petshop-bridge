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
const php=Buffer.from('PD9waHAKLyoqCiAqIFVJIExvY2FsaXphdGlvbiBSdW50aW1lIEF1ZGl0IHY0IOKAlCBXUEZvcm1zIHZhbGlkYWNpam9zIHRla3N0YWkgKyBtYXRvbWFzIHRla3N0YXMKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2E0J10pIHx8ICRfR0VUWydwc19hNCddICE9PSAnQTRrOHcnICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICAkciA9IGFycmF5KCdWRVJTSUpBJz0+J2F1ZGl0NC12MScpOwoKICAgIC8vIDEpIFdQRm9ybXMgdmFsaWRhY2lqb3MgcHJhbmVzaW1haSDigJQgYXIgTlVTVEFUWU1VT1NFLCBhciBwZXIgZ2V0dGV4dAogICAgJHdzID0gZ2V0X29wdGlvbignd3Bmb3Jtc19zZXR0aW5ncycsIGFycmF5KCkpOwogICAgJHJbJ3dwZm9ybXNfdmFsaWRhY2lqYSddID0gYXJyYXkoKTsKICAgIGZvcmVhY2ggKChhcnJheSkkd3MgYXMgJGs9PiR2KSB7CiAgICAgICAgaWYgKHN0cnBvcygkaywndmFsaWRhdGlvbicpICE9PSBmYWxzZSkgeyAkclsnd3Bmb3Jtc192YWxpZGFjaWphJ11bJGtdID0gJHY7IH0KICAgIH0KICAgICRyWyd3cGZvcm1zX3Zpc29zX29wY2lqb3MnXSA9IGFycmF5X2tleXMoKGFycmF5KSR3cyk7CgogICAgLy8gMikgZm9ybW9zIGxhdWthaSDigJQga2FkIGtpdGFzIHRlc3RhcyB6aW5vdHUgc2VsZWt0b3JpdXMKICAgICRmID0gZ2V0X3Bvc3RzKGFycmF5KCdwb3N0X3R5cGUnPT4nd3Bmb3JtcycsJ3Bvc3RzX3Blcl9wYWdlJz0+MSwncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcpKTsKICAgIGlmICgkZikgewogICAgICAgICRyWydmb3Jtb3NfaWQnXSA9ICRmWzBdLT5JRDsKICAgICAgICAkZCA9IGpzb25fZGVjb2RlKCRmWzBdLT5wb3N0X2NvbnRlbnQsIHRydWUpOwogICAgICAgIGZvcmVhY2ggKCgkZFsnZmllbGRzJ10gPz8gYXJyYXkoKSkgYXMgJGlkPT4kZmxkKSB7CiAgICAgICAgICAgICRyWydsYXVrYWknXVtdID0gYXJyYXkoJ2lkJz0+JGlkLCd0aXBhcyc9PiRmbGRbJ3R5cGUnXSA/PyAnPycsCiAgICAgICAgICAgICAgICAnbGFiZWwnPT4kZmxkWydsYWJlbCddID8/ICcnLCAncmVxdWlyZWQnPT4hZW1wdHkoJGZsZFsncmVxdWlyZWQnXSkpOwogICAgICAgIH0KICAgICAgICAkclsnbm90aWZpY2F0aW9ucyddID0gYXJyYXlfbWFwKGZ1bmN0aW9uKCRuKXsKICAgICAgICAgICAgcmV0dXJuIGFycmF5KCdlbWFpbCc9PiRuWydlbWFpbCddID8/ICcnLCAnc3ViamVjdCc9PiRuWydzdWJqZWN0J10gPz8gJycpOwogICAgICAgIH0sICgkZFsnc2V0dGluZ3MnXVsnbm90aWZpY2F0aW9ucyddID8/IGFycmF5KCkpKTsKICAgIH0KCiAgICAvLyAzKSBNQVRPTUFTIHRla3N0YXMga3JlcHNlbHlqZS9jaGVja291dCDigJQgYmUgYXRyaWJ1dHUgaXIga2xhc2l1CiAgICAvLyAobmF1ZG9qYW0gZXNhbWEgc2VzaWphPyBuZSDigJQgaW1hbSB0aWsgc3RydWt0dXJhIGlzIHNhYmxvbnUgbmVyYSBwcmFzbWVzOwogICAgLy8gIHRpa3JpbmFtIFRJSyBrYSByYW5kYSBnZXR0ZXh0LCBsaWt1c2lhIGRhbGkgdGlrcmlucyBuYXJzeWtsZSkKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('audit4.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_a4=A4k8w"');
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
putB64('audit4.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
