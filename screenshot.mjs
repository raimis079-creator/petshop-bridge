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
// pirma deaktyvuoti visus senus TEMP Venipak URL Src snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Venipak URL Src/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgVmVuaXBhayBUcmFja2luZyBVUkwgU291cmNlIHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc192dSddKSB8fCAkX0dFVFsncHNfdnUnXSAhPT0gJ1Z1M2snICkgcmV0dXJuOwogICAgJHI9YXJyYXkoKTsgJGhpdHM9YXJyYXkoKTsKICAgIGZvcmVhY2ggKGFycmF5KCd3Yy12ZW5pcGFrLXNoaXBwaW5nJywnd29vLWxpdGh1YW5pYXBvc3QtbWFpbicpIGFzICRwbHVnKSB7CiAgICAgICAgJGRpcj1XUF9QTFVHSU5fRElSLicvJy4kcGx1ZzsgaWYoIWlzX2RpcigkZGlyKSkgY29udGludWU7CiAgICAgICAgJHJpaT1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGRpciwgRmlsZXN5c3RlbUl0ZXJhdG9yOjpTS0lQX0RPVFMpKTsKICAgICAgICBmb3JlYWNoICgkcmlpIGFzICRmKSB7CiAgICAgICAgICAgIGlmICghJGYtPmlzRmlsZSgpKSBjb250aW51ZTsKICAgICAgICAgICAgJGV4dD1zdHJ0b2xvd2VyKHBhdGhpbmZvKCRmLT5nZXRGaWxlbmFtZSgpLFBBVEhJTkZPX0VYVEVOU0lPTikpOwogICAgICAgICAgICBpZiAoIWluX2FycmF5KCRleHQsYXJyYXkoJ3BocCcsJ2pzJyksdHJ1ZSkpIGNvbnRpbnVlOwogICAgICAgICAgICAkYz1AZmlsZV9nZXRfY29udGVudHMoJGYtPmdldFBhdGhuYW1lKCkpOyBpZighJGMpIGNvbnRpbnVlOwogICAgICAgICAgICBmb3JlYWNoIChleHBsb2RlKCJcbiIsJGMpIGFzICRpPT4kbG4pIHsKICAgICAgICAgICAgICAgIGlmIChwcmVnX21hdGNoKCcjaHR0cHM/Oi8vW15ccyJcJ10qKD86dmVuaXBha3xwb3N0XC5sdHxscGV4cHJlc3MpW15ccyJcJ10qI2knLCRsbiwkbSkpIHsKICAgICAgICAgICAgICAgICAgICAkaGl0c1tdPWFycmF5KCdmJz0+JHBsdWcuJy8nLmJhc2VuYW1lKCRmLT5nZXRQYXRobmFtZSgpKSwnbCc9PiRpKzEsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndXJsJz0+bWJfc3Vic3RyKCRtWzBdLDAsMTQwKSwnY3R4Jz0+dHJpbShtYl9zdWJzdHIoJGxuLDAsMTcwKSkpOwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfQogICAgLy8gdW5pa2FsdXMgVVJMCiAgICAkdT1hcnJheSgpOwogICAgZm9yZWFjaCAoJGhpdHMgYXMgJGgpIHsgJHVbJGhbJ3VybCddXT1pc3NldCgkdVskaFsndXJsJ11dKT8kdVskaFsndXJsJ11dKzE6MTsgfQogICAgYXJzb3J0KCR1KTsKICAgICRyWyd1bmlxdWVfdXJscyddPWFycmF5X3NsaWNlKCR1LDAsMjUsdHJ1ZSk7CiAgICAkclsndHJhY2tpbmdfY3R4J109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigkaGl0cyxmdW5jdGlvbigkaCl7CiAgICAgICAgcmV0dXJuIHByZWdfbWF0Y2goJyN0cmFja3xzZWtpbXxwYWllc2thfGJhcmNvZGV8Y29kZT0jaScsJGhbJ3VybCddLicgJy4kaFsnY3R4J10pOyB9KSk7CiAgICAkclsndHJhY2tpbmdfY3R4J109YXJyYXlfc2xpY2UoJHJbJ3RyYWNraW5nX2N0eCddLDAsMTUpOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Venipak URL Src Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_vu=Vu3k"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_vu=Vu3k"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('vurl.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
