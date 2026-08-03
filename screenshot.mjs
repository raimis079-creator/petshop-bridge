import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r346',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run346-v1'}; let sid=null;
// TEMP valymas
try{
  const ls=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"');
  const arr=JSON.parse(ls.out); const off=[];
  for(const s0 of arr){ if(s0.name && s0.name.indexOf('TEMP')===0 && s0.active){
    fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
    sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+s0.id+'"');
    off.push(s0.id+':'+s0.name); } }
  O.deaktyvuota_TEMP=off;
}catch(e){ O.valymo_klaida=String(e).slice(0,200); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzM0NiByZWNvbiDigJQga3VyIERBUiBudXN0YXRvbWFzIHdlaWdodF91cGRhdGVkX2F0CiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19yMzQ2J10pIHx8ICRfR0VUWydwc19yMzQ2J10gIT09ICdSMzQ2eDknICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICAkciA9IGFycmF5KCdWRVJTSUpBJz0+J3MzNDYtcmVjb24tdjEnKTsKCiAgICAkZGlycyA9IGFycmF5KAogICAgICAgICdwbHVnaW5zLycgICAgPT4gV1BfUExVR0lOX0RJUiAuICcvJywKICAgICAgICAnbXUtcGx1Z2lucy8nID0+IFdQTVVfUExVR0lOX0RJUiAuICcvJywKICAgICk7CiAgICAkaGl0cyA9IGFycmF5KCk7CiAgICBmb3JlYWNoICgkZGlycyBhcyAkenltYSA9PiAkYmFzZSkgewogICAgICAgIGlmICggISBpc19kaXIoJGJhc2UpICkgY29udGludWU7CiAgICAgICAgdHJ5IHsKICAgICAgICAgICAgJGl0ID0gbmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRiYXNlLCBGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICAgICAgIH0gY2F0Y2ggKEV4Y2VwdGlvbiAkZSkgeyBjb250aW51ZTsgfQogICAgICAgIGZvcmVhY2ggKCRpdCBhcyAkZikgewogICAgICAgICAgICBpZiAoICEgJGYtPmlzRmlsZSgpICkgY29udGludWU7CiAgICAgICAgICAgICRwID0gJGYtPmdldFBhdGhuYW1lKCk7CiAgICAgICAgICAgIGlmICggISBwcmVnX21hdGNoKCcvXC4ocGhwfGpzKSQvJywgJHApICkgY29udGludWU7CiAgICAgICAgICAgIGlmICggc3RycG9zKCRwLCAnLmJhaycpICE9PSBmYWxzZSB8fCBzdHJwb3MoJHAsICdxdWFyYW50aW5lJykgIT09IGZhbHNlICkgY29udGludWU7CiAgICAgICAgICAgICRjID0gQGZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsKICAgICAgICAgICAgaWYgKCRjID09PSBmYWxzZSB8fCBzdHJwb3MoJGMsICd3ZWlnaHRfdXBkYXRlZF9hdCcpID09PSBmYWxzZSkgY29udGludWU7CiAgICAgICAgICAgICRsaW5lcyA9IGV4cGxvZGUoIlxuIiwgJGMpOwogICAgICAgICAgICBmb3JlYWNoICgkbGluZXMgYXMgJGkgPT4gJGwpIHsKICAgICAgICAgICAgICAgIGlmIChzdHJwb3MoJGwsICd3ZWlnaHRfdXBkYXRlZF9hdCcpICE9PSBmYWxzZSkgewogICAgICAgICAgICAgICAgICAgICRoaXRzW10gPSBhcnJheSgKICAgICAgICAgICAgICAgICAgICAgICAgJ2YnICAgPT4gJHp5bWEgLiBzdHJfcmVwbGFjZSgkYmFzZSwgJycsICRwKSwKICAgICAgICAgICAgICAgICAgICAgICAgJ2wnICAgPT4gJGkgKyAxLAogICAgICAgICAgICAgICAgICAgICAgICAndHh0JyA9PiB0cmltKHN1YnN0cigkbCwgMCwgMjIwKSksCiAgICAgICAgICAgICAgICAgICAgKTsKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgIH0KICAgIH0KICAgICRyWyd3ZWlnaHRfdXBkYXRlZF9hdF9oaXRzJ10gPSAkaGl0czsKICAgICRyWydoaXRzX3Zpc28nXSA9IGNvdW50KCRoaXRzKTsKCiAgICAvLyBEQiBzbmlwcGV0dW9zZQogICAgZ2xvYmFsICR3cGRiOwogICAgJHNuID0gJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBjb2RlIExJS0UgJyV3ZWlnaHRfdXBkYXRlZF9hdCUnIiwgQVJSQVlfQSk7CiAgICAkclsnc25pcHBldGFpX3N1X2xhdWt1J10gPSAkc247CgogICAgLy8gTWV0b2R1IGlzdHJhdWthCiAgICAkZmlsZSA9IFdQX1BMVUdJTl9ESVIgLiAnL3BldHNob3AtY29yZS9pbmNsdWRlcy9jbGFzcy1wZXQtcHJvZmlsZS5waHAnOwogICAgJGMgPSBmaWxlX2dldF9jb250ZW50cygkZmlsZSk7CiAgICAkclsnZmFpbGFzJ10gPSBhcnJheSgnZHlkaXMnPT5zdHJsZW4oJGMpLCAnc2hhMjU2Jz0+c3Vic3RyKGhhc2goJ3NoYTI1NicsJGMpLDAsMTYpKTsKCiAgICAkbWV0b2RhaSA9IGFycmF5KCdoYW5kbGVfc2F2ZScsJ3Nhbml0aXplX2lucHV0Jyk7CiAgICBmb3JlYWNoICgkbWV0b2RhaSBhcyAkbSkgewogICAgICAgICRwb3ogPSBzdHJwb3MoJGMsICdmdW5jdGlvbiAnIC4gJG0gLiAnKCcpOwogICAgICAgIGlmICgkcG96ID09PSBmYWxzZSkgeyAkclsnbWV0b2RhaSddWyRtXSA9ICdORVJBU1RBJzsgY29udGludWU7IH0KICAgICAgICAkZWlsX251byA9IHN1YnN0cl9jb3VudChzdWJzdHIoJGMsIDAsICRwb3opLCAiXG4iKSArIDE7CiAgICAgICAgJGIgPSBzdHJwb3MoJGMsICd7JywgJHBveik7CiAgICAgICAgJGx5ZyA9IDA7ICRlbmQgPSAkYjsKICAgICAgICBmb3IgKCRpID0gJGI7ICRpIDwgc3RybGVuKCRjKTsgJGkrKykgewogICAgICAgICAgICBpZiAoJGNbJGldID09PSAneycpICRseWcrKzsKICAgICAgICAgICAgZWxzZWlmICgkY1skaV0gPT09ICd9JykgeyAkbHlnLS07IGlmICgkbHlnID09PSAwKSB7ICRlbmQgPSAkaTsgYnJlYWs7IH0gfQogICAgICAgIH0KICAgICAgICAvLyBhdGdhbCBpa2kgZG9jLWJsb2tvCiAgICAgICAgJHByID0gc3RycnBvcyhzdWJzdHIoJGMsIDAsICRwb3opLCAiXG5cdCIpOwogICAgICAgICRyWydtZXRvZGFpJ11bJG1dID0gYXJyYXkoCiAgICAgICAgICAgICdlaWx1dGVfbnVvJyA9PiAkZWlsX251bywKICAgICAgICAgICAgJ2lsZ2lzX0InICAgID0+ICRlbmQgLSAkcG96LAogICAgICAgICAgICAna29kYXMnICAgICAgPT4gc3Vic3RyKCRjLCAkcG96LCAkZW5kIC0gJHBveiArIDEpLAogICAgICAgICk7CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S346 recon',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 5');
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_r346=R346x9"');
  try{ O.rez=JSON.parse(x.out); }catch(e){ O.raw=x.out.slice(0,1500); }
  fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');
}
putB64('r346.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done sid='+sid);
