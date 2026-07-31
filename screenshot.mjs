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
// pirma deaktyvuoti visus senus TEMP Refill REST snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Refill REST/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUmVmaWxsIEZlZWRiYWNrIFJFU1QgUmVhZCB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfcnInXSkgfHwgJF9HRVRbJ3BzX3JyJ10gIT09ICdScjdkJyApIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHI9YXJyYXkoKTsKICAgIC8vIGt1ciByZWdpc3RydW90YXMgbWFyc3J1dGFzCiAgICAkaGl0cz1hcnJheSgpOwogICAgZm9yZWFjaCAoZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2luY2x1ZGVzLyoucGhwJykgYXMgJGYpIHsKICAgICAgICAkYz1maWxlX2dldF9jb250ZW50cygkZik7CiAgICAgICAgaWYgKHN0cnBvcygkYywncmVmaWxsLWZlZWRiYWNrJykhPT1mYWxzZSkgewogICAgICAgICAgICAkbGluZXM9YXJyYXkoKTsKICAgICAgICAgICAgZm9yZWFjaChleHBsb2RlKCJcbiIsJGMpIGFzICRpPT4kbG4pIGlmKHN0cmlwb3MoJGxuLCdyZWZpbGwtZmVlZGJhY2snKSE9PWZhbHNlfHxzdHJpcG9zKCRsbiwnZmVlZGJhY2snKSE9PWZhbHNlKQogICAgICAgICAgICAgICAgJGxpbmVzW109KCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGxuLDAsMTUwKSk7CiAgICAgICAgICAgICRoaXRzW2Jhc2VuYW1lKCRmKV09YXJyYXlfc2xpY2UoJGxpbmVzLDAsMjUpOwogICAgICAgIH0KICAgIH0KICAgICRyWydmaWxlcyddPSRoaXRzOwogICAgLy8gY2FsbGJhY2sga29kYXMKICAgICRwPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtcmVmaWxsLWVuZ2luZS5waHAnOwogICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJHApOwogICAgJHJbJ3JlZmlsbF9zaXplJ109c3RybGVuKCRjKTsKICAgIC8vIG1ldG9kYWkKICAgIHByZWdfbWF0Y2hfYWxsKCcjZnVuY3Rpb25ccysoXHcrKVxzKlwoIycsJGMsJG0pOwogICAgJHJbJ3JlZmlsbF9tZXRob2RzJ109JG1bMV07CiAgICAvLyBmZWVkYmFjayBzdXNpamVzIGJsb2thcwogICAgJGk9c3RyaXBvcygkYywnZmVlZGJhY2snKTsKICAgIGlmKCRpIT09ZmFsc2UpewogICAgICAgICRsaW5lcz1leHBsb2RlKCJcbiIsJGMpOyAkb3V0PWFycmF5KCk7CiAgICAgICAgZm9yZWFjaCgkbGluZXMgYXMgJG49PiRsbikgaWYoc3RyaXBvcygkbG4sJ2ZlZWRiYWNrJykhPT1mYWxzZSkgJG91dFtdPSgkbisxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsbiwwLDE2MCkpOwogICAgICAgICRyWydmZWVkYmFja19saW5lcyddPWFycmF5X3NsaWNlKCRvdXQsMCwzMCk7CiAgICB9CiAgICAvLyBwc19yZWZpbGxfdHJhY2tpbmcgc3R1bHBlbGlhaQogICAgJHJ0PSR3cGRiLT5wcmVmaXguJ3BzX3JlZmlsbF90cmFja2luZyc7CiAgICAkclsndHJhY2tpbmdfY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkcnQiKTsKICAgICRyWyd0cmFja2luZ19zYW1wbGUnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00gJHJ0IExJTUlUIDIiLCBBUlJBWV9BKTsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Refill REST Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_rr=Rr7d"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_rr=Rr7d"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('rfr.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
