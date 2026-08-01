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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjkgSGFyZGNvZGUgRGV0YWlsCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19oYzcnXSkgfHwgJF9HRVRbJ3BzX2hjNyddICE9PSAnSGM3cDInICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBnbG9iYWwgJHdwZGI7ICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4naGFyZGNvZGUtZGV0YWlsLXYxJyk7CiAgICAkY29yZSA9IFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvJzsKICAgICRmYWlsYWkgPSBhcnJheSgKICAgICAgICAnYXNzZXRzL3BldC1wcm9maWxlLmpzJywKICAgICAgICAnYXNzZXRzL3Byb2R1Y3QtY2FsYy5qcycsCiAgICAgICAgJ3RlbXBsYXRlcy9lbWFpbHMvb3JkZXItcGFpZC5waHAnLAogICAgICAgICdpbmNsdWRlcy9jbGFzcy1wZXQtdWkucGhwJywKICAgICAgICAnaW5jbHVkZXMvY2xhc3MtbWFnaWMtbG9naW4ucGhwJywKICAgICAgICAnaW5jbHVkZXMvY2xhc3MtYWNjb3VudC1kYXNoYm9hcmQucGhwJywKICAgICAgICAnaW5jbHVkZXMvY2xhc3MtdW5zdWJzY3JpYmUucGhwJywKICAgICk7CiAgICBmb3JlYWNoICgkZmFpbGFpIGFzICRyZWwpIHsKICAgICAgICAkcCA9ICRjb3JlLiRyZWw7CiAgICAgICAgaWYgKCFpc19yZWFkYWJsZSgkcCkpIHsgJHJbJ2VpbHV0ZXMnXVskcmVsXSA9ICdORVJBJzsgY29udGludWU7IH0KICAgICAgICAkbGluZXMgPSBmaWxlKCRwKTsKICAgICAgICBmb3JlYWNoICgkbGluZXMgYXMgJG49PiRsKSB7CiAgICAgICAgICAgIGlmIChzdHJwb3MoJGwsJ215LWFjY291bnQnKSAhPT0gZmFsc2UpIHsKICAgICAgICAgICAgICAgICRyWydlaWx1dGVzJ11bJHJlbF1bXSA9IGFycmF5KCducic9PiRuKzEsICdrb2Rhcyc9PnRyaW0oJGwpKTsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgIH0KICAgIC8vIHNuaXBwZXQgNjA5CiAgICAkcyA9ICR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgaWQsbmFtZSxjb2RlIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgaWQ9NjA5Iik7CiAgICBpZiAoJHMpIHsKICAgICAgICBmb3JlYWNoIChleHBsb2RlKCJcbiIsICRzLT5jb2RlKSBhcyAkbj0+JGwpIHsKICAgICAgICAgICAgaWYgKHN0cnBvcygkbCwnbXktYWNjb3VudCcpIT09ZmFsc2UpICRyWydzbmlwcGV0XzYwOSddW10gPSBhcnJheSgnbnInPT4kbisxLCdrb2Rhcyc9PnRyaW0oJGwpKTsKICAgICAgICB9CiAgICB9CiAgICAvLyBwdWJsaXNoIGlyYXNhcwogICAgJHJbJ2lyYXNhaSddID0gJHdwZGItPmdldF9yZXN1bHRzKAogICAgICAgICJTRUxFQ1QgSUQsIHBvc3RfdGl0bGUsIHBvc3RfdHlwZSBGUk9NICR3cGRiLT5wb3N0cwogICAgICAgICAgV0hFUkUgcG9zdF9jb250ZW50IExJS0UgJyVteS1hY2NvdW50JScgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIsIEFSUkFZX0EpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S329 Hardcode Detail',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('hardcode.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_hc7=Hc7p2"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.rez=uzk(1);

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('hardcode.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
