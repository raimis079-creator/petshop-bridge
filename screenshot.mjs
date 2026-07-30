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
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgV2V0IFByb2R1Y3QgRmxvdyBSZWNvbiB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfd3AnXSkgfHwgJF9HRVRbJ3BzX3dwJ10gIT09ICdXcDdyJyApIHJldHVybjsKICAgICRvdXQgPSBhcnJheSgpOwogICAgJGluYyA9IFdQX1BMVUdJTl9ESVIgLiAnL3BldHNob3AtY29yZS9pbmNsdWRlcy8nOwogICAgJGFzdCA9IFdQX1BMVUdJTl9ESVIgLiAnL3BldHNob3AtY29yZS9hc3NldHMvJzsKICAgICRtdSAgPSBXUE1VX1BMVUdJTl9ESVIgLiAnLyc7CgogICAgLy8gMSkga3VyIGtvZGUgbWluaW1hcyB3ZXRfcHJvZHVjdF9pZAogICAgJGhpdHMgPSBhcnJheSgpOwogICAgZm9yZWFjaCAoYXJyYXkoJGluYywkYXN0LCRtdSkgYXMgJGRpcikgewogICAgICAgIGZvcmVhY2ggKChhcnJheSlnbG9iKCRkaXIuJyoue3BocCxqc30nLCBHTE9CX0JSQUNFKSBhcyAkZikgewogICAgICAgICAgICAkYyA9IGZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICAgICAgICAgICAgJG4gPSBzdWJzdHJfY291bnQoJGMsJ3dldF9wcm9kdWN0X2lkJyk7CiAgICAgICAgICAgICRuMiA9IHN1YnN0cl9jb3VudCgkYywnd2V0X3Byb2R1Y3QnKTsKICAgICAgICAgICAgaWYgKCRuIHx8ICRuMikgewogICAgICAgICAgICAgICAgJGxpbmVzPWFycmF5KCk7CiAgICAgICAgICAgICAgICBmb3JlYWNoIChleHBsb2RlKCJcbiIsJGMpIGFzICRpPT4kbG4pIHsKICAgICAgICAgICAgICAgICAgICBpZiAoc3RycG9zKCRsbiwnd2V0X3Byb2R1Y3QnKSE9PWZhbHNlKSAkbGluZXNbXSA9ICgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsbiwwLDE1MCkpOwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgJGhpdHNbYmFzZW5hbWUoJGYpXSA9IGFycmF5KCdjb3VudCc9PiRuMiwnbGluZXMnPT5hcnJheV9zbGljZSgkbGluZXMsMCwxNCkpOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfQogICAgJG91dFsnY29kZV9oaXRzJ10gPSAkaGl0czsKCiAgICAvLyAyKSBSRVNUIG1hcsWhcnV0YWkgc3UgZm9vZC9wZXQKICAgICRyb3V0ZXMgPSBhcnJheSgpOwogICAgZm9yZWFjaCAoIHJlc3RfZ2V0X3NlcnZlcigpLT5nZXRfcm91dGVzKCkgYXMgJHIgPT4gJGggKSB7CiAgICAgICAgaWYgKHByZWdfbWF0Y2goJyNwZXQtZm9vZHxwZXQtcHJvZmlsZXxwZXRzIycsJHIpKSAkcm91dGVzW109JHI7CiAgICB9CiAgICAkb3V0Wydyb3V0ZXMnXSA9ICRyb3V0ZXM7CgogICAgLy8gMykgcHNfcGV0cyBzdHVscGVsaWFpCiAgICBnbG9iYWwgJHdwZGI7CiAgICAkb3V0WydwZXRzX2NvbHMnXSA9ICR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHdwZGItPnByZWZpeH1wc19wZXRzIik7CgogICAgbm9jYWNoZV9oZWFkZXJzKCk7CiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0LCBKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOwogICAgZXhpdDsKfSwgMSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Wet Product Flow Recon v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_wp=Wp7r"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_wp=Wp7r"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('wp1.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
