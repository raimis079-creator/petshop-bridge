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
const php=Buffer.from('PD9waHAKLyoqCiAqIFVJIExvY2FsaXphdGlvbiBSdW50aW1lIEF1ZGl0IOKAlCBTdWJ0b3RhbC9RdWFudGl0eSBrb250ZWtzdGFzIGtyZXBzZWx5amUKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2N4OCddKSB8fCAkX0dFVFsncHNfY3g4J10gIT09ICdDeDhyNScgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nY3R4LWNoZWNrLXYxJyk7CgogICAgLy8gS3JlcHNlbGlzIHJlaWthbGF1amEgc2VzaWpvcyDigJQgZGVkYW0gcHJla2UgdGllc2lvZ2lhaQogICAgaWYgKGZ1bmN0aW9uX2V4aXN0cygnV0MnKSAmJiBXQygpLT5jYXJ0KSB7CiAgICAgICAgV0MoKS0+Y2FydC0+ZW1wdHlfY2FydCgpOwogICAgICAgIFdDKCktPmNhcnQtPmFkZF90b19jYXJ0KDM0Nzg2LCAxKTsKICAgICAgICAkclsna3JlcHNlbHlqZSddID0gV0MoKS0+Y2FydC0+Z2V0X2NhcnRfY29udGVudHNfY291bnQoKTsKICAgIH0KICAgIG9iX3N0YXJ0KCk7CiAgICBlY2hvIGRvX3Nob3J0Y29kZSgnW3dvb2NvbW1lcmNlX2NhcnRdJyk7CiAgICAkaCA9IG9iX2dldF9jbGVhbigpOwogICAgJHJbJ2h0bWxfaWxnaXMnXSA9IHN0cmxlbigkaCk7CgogICAgZm9yZWFjaCAoYXJyYXkoJ1N1YnRvdGFsJywnUXVhbnRpdHknLCdQcm9kdWN0JywnU2hpcHBpbmcnLCdUb3RhbCcpIGFzICR0KSB7CiAgICAgICAgJHBveiA9IDA7ICRyYXN0YSA9IGFycmF5KCk7CiAgICAgICAgd2hpbGUgKCgkaSA9IHN0cnBvcygkaCwgJHQsICRwb3opKSAhPT0gZmFsc2UpIHsKICAgICAgICAgICAgJGZyYWcgPSBzdWJzdHIoJGgsIG1heCgwLCRpLTkwKSwgMTkwKTsKICAgICAgICAgICAgLy8gYXIgdGFpIG1hdG9tYXMgdGVrc3RhcywgYXIga2xhc2UvYXRyaWJ1dGFzCiAgICAgICAgICAgICR0aXBhcyA9ICdNQVRPTUFTIFRFS1NUQVMnOwogICAgICAgICAgICBpZiAocHJlZ19tYXRjaCgnL2NsYXNzPSJbXiJdKiQvJywgc3Vic3RyKCRoLCBtYXgoMCwkaS05MCksIDkwKSkpIHsgJHRpcGFzID0gJ0NTUyBrbGFzZSc7IH0KICAgICAgICAgICAgZWxzZWlmIChwcmVnX21hdGNoKCcvKGRhdGEtW2Etei1dK3xhcmlhLWxhYmVsfHRpdGxlfGFsdHxpZHxuYW1lKT0iW14iXSokLycsIHN1YnN0cigkaCwgbWF4KDAsJGktOTApLCA5MCkpKSB7ICR0aXBhcyA9ICdBVFJJQlVUQVMnOyB9CiAgICAgICAgICAgICRyYXN0YVtdID0gYXJyYXkoJ3RpcGFzJz0+JHRpcGFzLCAnZnJhZyc9PnByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJywkZnJhZykpOwogICAgICAgICAgICAkcG96ID0gJGkgKyBzdHJsZW4oJHQpOwogICAgICAgIH0KICAgICAgICBpZiAoJHJhc3RhKSB7ICRyWydyYWRpbmlhaSddWyR0XSA9ICRyYXN0YTsgfQogICAgfQogICAgLy8gbWF0b21hcyB0ZWtzdGFzIGJlIHp5bWl1CiAgICAkdGVrc3RhcyA9IHdwX3N0cmlwX2FsbF90YWdzKCRoKTsKICAgIGZvcmVhY2ggKGFycmF5KCdTdWJ0b3RhbCcsJ1F1YW50aXR5JywnUHJvZHVjdCcsJ1NoaXBwaW5nJykgYXMgJHQpIHsKICAgICAgICAkclsnTUFUT01BTUVfVEVLU1RFJ11bJHRdID0gc3Vic3RyX2NvdW50KCR0ZWtzdGFzLCAkdCk7CiAgICB9CiAgICAvLyBsaWV0dXZpc2tpIGF0aXRpa21lbnlzIG1hdG9tYW1lIHRla3N0ZQogICAgZm9yZWFjaCAoYXJyYXkoJ1N1bWEnLCdLaWVraXMnLCdQcm9kdWt0YXMnLCdQcmlzdGF0eW1hcycsJ1ByZWvElycpIGFzICR0KSB7CiAgICAgICAgJHJbJ0xUX21hdG9tYW1lJ11bJHRdID0gc3Vic3RyX2NvdW50KCR0ZWtzdGFzLCAkdCk7CiAgICB9CiAgICBpZiAoZnVuY3Rpb25fZXhpc3RzKCdXQycpICYmIFdDKCktPmNhcnQpIHsgV0MoKS0+Y2FydC0+ZW1wdHlfY2FydCgpOyB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('ctxcheck.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_cx8=Cx8r5"');
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
putB64('ctxcheck.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
