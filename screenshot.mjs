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
// pirma deaktyvuoti visus senus TEMP Venipak Struct snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Venipak Struct/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgVmVuaXBhayBTdHJ1Y3R1cmUgdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3ZzJ10pIHx8ICRfR0VUWydwc192cyddICE9PSAnVnM4bicgKSByZXR1cm47CiAgICAkcj1hcnJheSgpOwogICAgJGY9V1BfUExVR0lOX0RJUi4nL3djLXZlbmlwYWstc2hpcHBpbmcvYWRtaW4vY2xhc3Mtd29vY29tbWVyY2Utc2hvcHVwLXZlbmlwYWstc2hpcHBpbmctYWRtaW4tZGlzcGF0Y2gucGhwJzsKICAgIGlmIChmaWxlX2V4aXN0cygkZikpIHsKICAgICAgICAkbGluZXM9ZmlsZSgkZik7CiAgICAgICAgLy8ga29udGVrc3RvIGJsb2thaSBhcGllICR2ZW5pcGFrX3NoaXBwaW5nX29yZGVyX2RhdGEKICAgICAgICAkbWFya3M9YXJyYXkoKTsKICAgICAgICBmb3JlYWNoICgkbGluZXMgYXMgJGk9PiRsbikgaWYgKHN0cnBvcygkbG4sJ3ZlbmlwYWtfc2hpcHBpbmdfb3JkZXJfZGF0YScpIT09ZmFsc2UpICRtYXJrc1tdPSRpOwogICAgICAgICRvdXQ9YXJyYXkoKTsKICAgICAgICBmb3JlYWNoIChhcnJheV9zbGljZSgkbWFya3MsMCw2KSBhcyAkbSkgewogICAgICAgICAgICAkZnJvbT1tYXgoMCwkbS0yMik7ICR0bz1taW4oY291bnQoJGxpbmVzKS0xLCRtKzQpOwogICAgICAgICAgICAkc25pcD1hcnJheSgpOwogICAgICAgICAgICBmb3IoJGk9JGZyb207JGk8PSR0bzskaSsrKSAkc25pcFtdPSgkaSsxKS4nOiAnLnJ0cmltKCRsaW5lc1skaV0pOwogICAgICAgICAgICAkb3V0W109aW1wbG9kZSgiXG4iLCRzbmlwKTsKICAgICAgICB9CiAgICAgICAgJHJbJ2Rpc3BhdGNoX2Jsb2NrcyddPSRvdXQ7CiAgICB9IGVsc2UgJHJbJ2Rpc3BhdGNoX21pc3NpbmcnXT0xOwoKICAgIC8vIG9yZGVyLWVkaXQgdmFyaWFudGFzCiAgICAkZjI9V1BfUExVR0lOX0RJUi4nL3djLXZlbmlwYWstc2hpcHBpbmcvYWRtaW4vY2xhc3Mtd29vY29tbWVyY2Utc2hvcHVwLXZlbmlwYWstc2hpcHBpbmctYWRtaW4tb3JkZXItZWRpdC5waHAnOwogICAgaWYgKGZpbGVfZXhpc3RzKCRmMikpIHsKICAgICAgICAkbDI9ZmlsZSgkZjIpOyAkc25pcD1hcnJheSgpOwogICAgICAgIGZvcmVhY2ggKCRsMiBhcyAkaT0+JGxuKSBpZiAoc3RycG9zKCRsbiwnJG9yZGVyX21ldGEnKSE9PWZhbHNlICYmICRpPDQyMCAmJiAkaT4zNjApICRzbmlwW109KCRpKzEpLic6ICcucnRyaW0oJGxuKTsKICAgICAgICAkclsnb3JkZXJfZWRpdCddPWltcGxvZGUoIlxuIixhcnJheV9zbGljZSgkc25pcCwwLDI1KSk7CiAgICB9CiAgICAvLyBwYWNrX251bWJlciBwYWllc2thIHZpc2FtZSBwbHVnaW4nZQogICAgJGhpdHM9YXJyYXkoKTsKICAgICRyaWk9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKFdQX1BMVUdJTl9ESVIuJy93Yy12ZW5pcGFrLXNoaXBwaW5nJywgRmlsZXN5c3RlbUl0ZXJhdG9yOjpTS0lQX0RPVFMpKTsKICAgIGZvcmVhY2ggKCRyaWkgYXMgJHgpIHsgaWYoISR4LT5pc0ZpbGUoKXx8c3Vic3RyKCR4LT5nZXRGaWxlbmFtZSgpLC00KSE9PScucGhwJyljb250aW51ZTsKICAgICAgICAkYz1AZmlsZV9nZXRfY29udGVudHMoJHgtPmdldFBhdGhuYW1lKCkpOyBpZighJGMpY29udGludWU7CiAgICAgICAgZm9yZWFjaCAoZXhwbG9kZSgiXG4iLCRjKSBhcyAkaT0+JGxuKQogICAgICAgICAgICBpZiAocHJlZ19tYXRjaCgnI3BhY2tfbnVtYmVyI2knLCRsbikpICRoaXRzW109YmFzZW5hbWUoJHgtPmdldFBhdGhuYW1lKCkpLic6Jy4oJGkrMSkuJyAgJy50cmltKG1iX3N1YnN0cigkbG4sMCwxNTApKTsgfQogICAgJHJbJ3BhY2tfbnVtYmVyX2hpdHMnXT1hcnJheV9zbGljZSgkaGl0cywwLDIwKTsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Venipak Struct Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_vs=Vs8n"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_vs=Vs8n"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('vst.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
