import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
// pirma deaktyvuoti visus senus TEMP Body Check snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Body Check/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgU2hpcHBlZCBFbWFpbCBCb2R5IENoZWNrIHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19iZCddKSB8fCAkX0dFVFsncHNfYmQnXSAhPT0gJ0JkMmsnICkgcmV0dXJuOwogICAgZ2xvYmFsICRQU19DQVA7ICRQU19DQVA9YXJyYXkoKTsgJHI9YXJyYXkoKTsKICAgIGFkZF9maWx0ZXIoJ3ByZV93cF9tYWlsJywgZnVuY3Rpb24oJG51bGwsJGF0dHMpewogICAgICAgIGdsb2JhbCAkUFNfQ0FQOwogICAgICAgICRQU19DQVBbXT1hcnJheSgnc3ViamVjdCc9PiRhdHRzWydzdWJqZWN0J10sJ2JvZHknPT4oc3RyaW5nKSRhdHRzWydtZXNzYWdlJ10pOwogICAgICAgIHJldHVybiB0cnVlOwogICAgfSwxLDIpOwoKICAgICRwcm9kID0gd2NfZ2V0X3Byb2R1Y3RzKGFycmF5KCdsaW1pdCc9PjEsJ3N0YXR1cyc9PidwdWJsaXNoJywncmV0dXJuJz0+J2lkcycpKTsKICAgICRvcmRlciA9IHdjX2NyZWF0ZV9vcmRlcigpOwogICAgaWYgKCRwcm9kKSAkb3JkZXItPmFkZF9wcm9kdWN0KHdjX2dldF9wcm9kdWN0KCRwcm9kWzBdKSwxKTsKICAgICRvcmRlci0+c2V0X2JpbGxpbmdfZW1haWwoJ3JhaW11bmRhc0BneXZ1bmFpLmx0Jyk7CiAgICAkb3JkZXItPnNldF9iaWxsaW5nX2ZpcnN0X25hbWUoJ1JhaW1pcycpOwogICAgJG9yZGVyLT5zZXRfcGF5bWVudF9tZXRob2QoJ2JhY3MnKTsKICAgICRvcmRlci0+Y2FsY3VsYXRlX3RvdGFscygpOyAkb3JkZXItPnNhdmUoKTsKICAgICRvaWQ9JG9yZGVyLT5nZXRfaWQoKTsKICAgICRvcmRlci0+cGF5bWVudF9jb21wbGV0ZSgnQk9EWS0nLiRvaWQpOwogICAgJFBTX0NBUD1hcnJheSgpOwogICAgJG89d2NfZ2V0X29yZGVyKCRvaWQpOwogICAgJG8tPnVwZGF0ZV9tZXRhX2RhdGEoJ3ZlbmlwYWtfc2hpcHBpbmdfb3JkZXJfZGF0YScsIHdwX2pzb25fZW5jb2RlKGFycmF5KCdwYWNrX251bWJlcnMnPT5hcnJheSgnUFNUUkFDSzEyMzQ1Njc4OScpKSkpOwogICAgJG8tPnNhdmUoKTsKICAgICRvPXdjX2dldF9vcmRlcigkb2lkKTsKICAgICRvLT51cGRhdGVfc3RhdHVzKCdjb21wbGV0ZWQnLCdib2R5IHRlc3QnKTsKCiAgICBmb3JlYWNoICgkUFNfQ0FQIGFzICRtKSB7CiAgICAgICAgJGI9JG1bJ2JvZHknXTsKICAgICAgICAkdHh0PXRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCB3cF9zdHJpcF9hbGxfdGFncygkYikpKTsKICAgICAgICAkaGl0PWFycmF5KCk7CiAgICAgICAgZm9yZWFjaCAoYXJyYXkoJ1BTVFJBQ0sxMjM0NTY3ODknLCd2ZW5pcGFrJywnVmVuaXBhaycsJ3Nla2ltJywnc2VraW1vJywndHJhY2snLCdzaXVudG9zIG51bWVyJywnYmFyY29kZScsJ3Bvc3QubHQnKSBhcyAkaykgewogICAgICAgICAgICAkcG9zPXN0cmlwb3MoJHR4dCwkayk7CiAgICAgICAgICAgIGlmICgkcG9zIT09ZmFsc2UpICRoaXRbJGtdPW1iX3N1YnN0cigkdHh0LG1heCgwLCRwb3MtNzApLDE2MCk7CiAgICAgICAgfQogICAgICAgIC8vIGxpbmthaQogICAgICAgIHByZWdfbWF0Y2hfYWxsKCcjaHR0cHM/Oi8vW15ccyJcJzw+XSsjJywkYiwkbG0pOwogICAgICAgICRsaW5rcz1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRsbVswXSkpOwogICAgICAgICRyWydlbWFpbHMnXVtdPWFycmF5KAogICAgICAgICAgICAnc3ViamVjdCc9PiRtWydzdWJqZWN0J10sCiAgICAgICAgICAgICdsZW4nPT5zdHJsZW4oJGIpLAogICAgICAgICAgICAnaGl0cyc9PiRoaXQsCiAgICAgICAgICAgICdsaW5rcyc9PmFycmF5X3NsaWNlKCRsaW5rcywwLDEyKSwKICAgICAgICAgICAgJ2V4Y2VycHQnPT5tYl9zdWJzdHIoJHR4dCwwLDUwMCksCiAgICAgICAgKTsKICAgIH0KICAgIHdjX2dldF9vcmRlcigkb2lkKS0+ZGVsZXRlKHRydWUpOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Body Check Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_bd=Bd2k"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_bd=Bd2k"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('body.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
