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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjggUmVkaXJlY3QgKyBGb3JtIFRhaWwgUmVjb24KICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3JkNCddKSB8fCAkX0dFVFsncHNfcmQ0J10gIT09ICdSZDRtNycgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4ncmVkaXJlY3QtcmVjb24tdjEnKTsKICAgICRjaGlsZCA9IGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpOwogICAgJGNvcmUgID0gV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZSc7CgogICAgLy8gMSkgS1VSIGphdSBneXZlbmEgMzAxIHRhaXN5a2xlcwogICAgZm9yZWFjaCAoYXJyYXkoJ2NoaWxkJz0+JGNoaWxkLCAnY29yZSc9PiRjb3JlKSBhcyAkaz0+JGRpcikgewogICAgICAgIGlmICghaXNfZGlyKCRkaXIpKSBjb250aW51ZTsKICAgICAgICAkaXQgPSBuZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGRpciwgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICAgICAgIGZvcmVhY2ggKCRpdCBhcyAkZikgewogICAgICAgICAgICBpZiAoISRmLT5pc0ZpbGUoKSB8fCBzdHJ0b2xvd2VyKCRmLT5nZXRFeHRlbnNpb24oKSkhPT0ncGhwJykgY29udGludWU7CiAgICAgICAgICAgICRjID0gQGZpbGVfZ2V0X2NvbnRlbnRzKCRmLT5nZXRQYXRobmFtZSgpKTsKICAgICAgICAgICAgaWYgKCRjID09PSBmYWxzZSkgY29udGludWU7CiAgICAgICAgICAgIGlmIChzdHJwb3MoJGMsJ3dwX3JlZGlyZWN0JykhPT1mYWxzZSB8fCBzdHJwb3MoJGMsJ3dwX3NhZmVfcmVkaXJlY3QnKSE9PWZhbHNlIHx8IHN0cnBvcygkYywnMzAxJykhPT1mYWxzZSkgewogICAgICAgICAgICAgICAgJHJlbCA9ICRrLicvJy5zdHJfcmVwbGFjZSgkZGlyLicvJywnJywkZi0+Z2V0UGF0aG5hbWUoKSk7CiAgICAgICAgICAgICAgICAkclsncmVkaXJlY3RfZmFpbGFpJ11bJHJlbF0gPSBhcnJheSgKICAgICAgICAgICAgICAgICAgICAnd3BfcmVkaXJlY3QnID0+IHN1YnN0cl9jb3VudCgkYywnd3BfcmVkaXJlY3QnKSwKICAgICAgICAgICAgICAgICAgICAnc2FmZScgICAgICAgID0+IHN1YnN0cl9jb3VudCgkYywnd3Bfc2FmZV9yZWRpcmVjdCcpLAogICAgICAgICAgICAgICAgICAgICczMDEnICAgICAgICAgPT4gc3Vic3RyX2NvdW50KCRjLCczMDEnKSwKICAgICAgICAgICAgICAgICk7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9CiAgICAvLyBlc2FtaSAzMDEgc25pcHBldGFpIChpcyBhdG1pbnRpZXM6IGJyYW5kX3NsdWcsIHNsYXB1a3VfZXMpCiAgICBnbG9iYWwgJHdwZGI7ICRzdD0kd3BkYi0+cHJlZml4LidzbmlwcGV0cyc7CiAgICAkclsnMzAxX3NuaXBwZXRhaSddID0gJHdwZGItPmdldF9yZXN1bHRzKAogICAgICAgICJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUgRlJPTSAkc3QgV0hFUkUgKG5hbWUgTElLRSAnJTMwMSUnIE9SIG5hbWUgTElLRSAnJWVkaXJlY3QlJykgT1JERVIgQlkgaWQiLCBBUlJBWV9BKTsKCiAgICAvLyAyKSBjaGlsZCB0aGVtZSBmdW5jdGlvbnMucGhwIOKAlCBhciB5cmEgaXIga2FpcCBhdHJvZG8gZ2FsYXMKICAgICRmcCA9ICRjaGlsZC4nL2Z1bmN0aW9ucy5waHAnOwogICAgJHJbJ2Z1bmN0aW9uc195cmEnXSA9IGlzX3JlYWRhYmxlKCRmcCk7CiAgICAkclsnZnVuY3Rpb25zX2R5ZGlzJ10gPSAkclsnZnVuY3Rpb25zX3lyYSddID8gZmlsZXNpemUoJGZwKSA6IDA7CiAgICBpZiAoJHJbJ2Z1bmN0aW9uc195cmEnXSkgewogICAgICAgICRmYyA9IGZpbGVfZ2V0X2NvbnRlbnRzKCRmcCk7CiAgICAgICAgJHJbJ2Z1bmN0aW9uc19nYWxhcyddID0gc3Vic3RyKCRmYywgLTEyMDApOwogICAgICAgICRyWydmdW5jdGlvbnNfaW5jbHVkZSddID0gKHN0cnBvcygkZmMsJ3JlcXVpcmUnKSE9PWZhbHNlIHx8IHN0cnBvcygkZmMsJ2luY2x1ZGUnKSE9PWZhbHNlKTsKICAgIH0KCiAgICAvLyAzKSBzaG9ydGNvZGVfZm9ybSDigJQga3VyIGJhaWdpYXNpIEhUTUwsIGthZCBuYXVkb3MgZGV0aSBQTyBmb3JtYQogICAgJGMgPSBmaWxlX2dldF9jb250ZW50cygkY29yZS4nL2luY2x1ZGVzL2NsYXNzLXBldC11aS5waHAnKTsKICAgICRpID0gc3RycG9zKCRjLCdmdW5jdGlvbiBzaG9ydGNvZGVfZm9ybScpOwogICAgJHJbJ3Nob3J0Y29kZV9mb3JtJ10gPSAkaSE9PWZhbHNlID8gc3Vic3RyKCRjLCRpLDE4MDApIDogJ25lcmFzdGEnOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S328 Redirect Recon',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('redirrecon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_rd4=Rd4m7"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.rez=uzk(1);

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('redirrecon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
