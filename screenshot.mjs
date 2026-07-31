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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjggUmVjb3ZlcnkgQXNzZXNzbWVudCDigJQgVElLIFNLQUlUWU1BUywgam9raW8gcmFzeW1vCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19yYzknXSkgfHwgJF9HRVRbJ3BzX3JjOSddICE9PSAnUmM5ajQnICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBnbG9iYWwgJHdwZGI7ICRQRVRTPSR3cGRiLT5wcmVmaXguJ3BzX3BldHMnOwogICAgJHI9YXJyYXkoJ1ZFUlNJSkEnPT4ncmVjb3ZlcnktdjEnKTsKICAgICRyWydkYWJhcl9wZXRzJ10gPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJFBFVFMiKTsKICAgICRyWydkYWJhcl9pZHMnXSAgPSAkd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00gJFBFVFMgT1JERVIgQlkgaWQiKTsKCiAgICAvLyB2aXNvcyBwc19wZXRzIGJhY2t1cCBsZW50ZWxlcwogICAgJGJha3MgPSAkd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyR3cGRiLT5wcmVmaXh9cHNfcGV0c19iYWslJyIpOwogICAgJHJbJ2JhY2t1cF9sZW50ZWxlcyddID0gYXJyYXkoKTsKICAgIGZvcmVhY2ggKCRiYWtzIGFzICRiKSB7CiAgICAgICAgJHJbJ2JhY2t1cF9sZW50ZWxlcyddWyRiXSA9IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBgJGJgIik7CiAgICB9CiAgICAvLyBuYXVqYXVzaWFzIGJhY2t1cCBwYWdhbCBlaWx1Y2l1IHNrYWljaXUgaXIgdmFyZG8gZGF0YQogICAgc29ydCgkYmFrcyk7CiAgICAkbmF1amF1c2lhcyA9IGVuZCgkYmFrcyk7CiAgICAkclsnbmF1ZG9qYW1hc19iYWNrdXAnXSA9ICRuYXVqYXVzaWFzOwogICAgaWYgKCRuYXVqYXVzaWFzKSB7CiAgICAgICAgJGN1ciA9ICR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgaWQgRlJPTSAkUEVUUyIpOwogICAgICAgICRjdXJfbGlzdCA9ICRjdXIgPyBpbXBsb2RlKCcsJywgYXJyYXlfbWFwKCdpbnR2YWwnLCRjdXIpKSA6ICcwJzsKICAgICAgICAvLyBlaWx1dGVzLCBrdXJpb3MgQlVWTyBiYWNrdXAnZSBiZXQgREFCQVIganUgTkVSQQogICAgICAgICR0cnVrc3QgPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoCiAgICAgICAgICAgICJTRUxFQ1QgaWQsIHVzZXJfaWQsIHBldF9uYW1lLCBzcGVjaWVzLCBzdGF0dXMsIGNsaWVudF9yZWYsIGNyZWF0ZWRfYXQKICAgICAgICAgICAgICAgRlJPTSBgJG5hdWphdXNpYXNgIFdIRVJFIGlkIE5PVCBJTiAoJGN1cl9saXN0KSBPUkRFUiBCWSBpZCIsIEFSUkFZX0EpOwogICAgICAgICRyWyd0cnVrc3RhbXVfa2lla2lzJ10gPSBjb3VudCgkdHJ1a3N0KTsKICAgICAgICAkclsndHJ1a3N0YW1vcyddID0gJHRydWtzdDsKICAgICAgICAkclsnaXNfanVfdHVzY2lhc192YXJkYXMnXSA9IGNvdW50KGFycmF5X2ZpbHRlcigkdHJ1a3N0LCBmdW5jdGlvbigkeCl7CiAgICAgICAgICAgIHJldHVybiAkeFsncGV0X25hbWUnXSA9PT0gbnVsbCB8fCAkeFsncGV0X25hbWUnXSA9PT0gJyc7IH0pKTsKICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1BSRVRUWV9QUklOVCk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S328 Recovery Assessment',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('recovery.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_rc9=Rc9j4"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.rez=uzk(1);

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('recovery.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
