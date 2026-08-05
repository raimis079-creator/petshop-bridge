import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:20e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s498',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:20e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run498-v1'}; let sid=null;
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzQ5NyBkYXVnaWFwYWt1b3RlcyDigJQgVElLU0xJTklTIHBhdGlrcmluaW1hcwogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczQ5NyddKSB8fCAkX0dFVFsncHNfczQ5NyddICE9PSAnSzQ5N3BrJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgQHNldF90aW1lX2xpbWl0KDEyMCk7CiAgICBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OwogICAgJHI9YXJyYXkoJ1ZFUlNJSkEnPT4nczQ5Ny12MScpOwogICAgJFZQPVdQX1BMVUdJTl9ESVIuJy93Yy12ZW5pcGFrLXNoaXBwaW5nLyc7CiAgICAkTFA9V1BfUExVR0lOX0RJUi4nL3dvby1saXRodWFuaWFwb3N0LW1haW4vJzsKCiAgICAkZmFpbGFpPWFycmF5KAogICAgICAnVlBfZGlzcGF0Y2gnPT4kVlAuJ2FkbWluL2NsYXNzLXdvb2NvbW1lcmNlLXNob3B1cC12ZW5pcGFrLXNoaXBwaW5nLWFkbWluLWRpc3BhdGNoLnBocCcsCiAgICAgICdWUF9vcmRlcicgICA9PiRWUC4nYWRtaW4vcGFydGlhbHMvd29vY29tbWVyY2Utc2hvcHVwLXZlbmlwYWstc2hpcHBpbmctYWRtaW4tb3JkZXItZGlzcGxheS5waHAnLAogICAgICAnTFBfc2l6ZScgICAgPT4kTFAuJ2FkbWluL2NsYXNzLXdvby1saXRodWFuaWFwb3N0LWFkbWluLXNpemUtc2VydmljZS5waHAnLAogICAgICAnTFBfc2VydmljZScgPT4kTFAuJ2FkbWluL2NsYXNzLXdvby1saXRodWFuaWFwb3N0LWFkbWluLW9yZGVyLXNlcnZpY2UucGhwJywKICAgICk7CiAgICBmb3JlYWNoKCRmYWlsYWkgYXMgJHZhcmRhcz0+JGYpewogICAgICAgIGlmKCFpc19maWxlKCRmKSl7CiAgICAgICAgICAgIC8vIGllc2tvbSBwYW5hc2l1CiAgICAgICAgICAgICRkaXI9ZGlybmFtZSgkZik7CiAgICAgICAgICAgICRyYXN0aT1hcnJheSgpOwogICAgICAgICAgICBpZihpc19kaXIoJGRpcikpIGZvcmVhY2goc2NhbmRpcigkZGlyKSBhcyAkeCkKICAgICAgICAgICAgICAgIGlmKHN1YnN0cigkeCwtNCk9PT0nLnBocCcpICRyYXN0aVtdPSR4OwogICAgICAgICAgICAkclskdmFyZGFzXT1hcnJheSgnTkVSQSc9PmJhc2VuYW1lKCRmKSwna2F0YWxvZ2UnPT5hcnJheV9zbGljZSgkcmFzdGksMCwyMCkpOwogICAgICAgICAgICBjb250aW51ZTsKICAgICAgICB9CiAgICAgICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJGYpOwogICAgICAgICRlaWw9YXJyYXkoKTsKICAgICAgICBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkYykgYXMgJGk9PiRsbil7CiAgICAgICAgICAgIGlmKHByZWdfbWF0Y2goJy8ocGFja3xwYXJjZWx8d2VpZ2h0fGNyZWF0ZUVsZW1lbnR8cXVhbnRpdHl8bnVtYmVyT2Z8aW5wdXQgfG5hbWU9KS9pJywkbG4pKQogICAgICAgICAgICAgICAgJGVpbFtdPSgkaSsxKS4nOiAnLnRyaW0oc3Vic3RyKCRsbiwwLDEyNSkpOwogICAgICAgIH0KICAgICAgICAkclskdmFyZGFzXT1hcnJheSgnQic9PnN0cmxlbigkYyksJ2VpbCc9PmFycmF5X3NsaWNlKCRlaWwsMCwyMikpOwogICAgfQogICAgJHJbJ21ldGFfcmFrdGFpJ109JHdwZGItPmdldF9jb2woIlNFTEVDVCBESVNUSU5DVCBtZXRhX2tleSBGUk9NIHskcGZ9d2Nfb3JkZXJzX21ldGEKICAgICAgICBXSEVSRSBtZXRhX2tleSBMSUtFICclcGFjayUnIE9SIG1ldGFfa2V5IExJS0UgJyVwYXJjZWwlJyBPUiBtZXRhX2tleSBMSUtFICcldmVuaXBhayUnIE9SIG1ldGFfa2V5IExJS0UgJyVscCUnIik7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSwgMSk7Cg==','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S498 Valymas',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
function q(a){const x=sh('curl -sSk --max-time 100 "'+SITE+'/?ps_s497=K497pk&act='+a+'&z='+Math.random()+'"');
 try{return JSON.parse(x);}catch(e){return {raw:String(x).slice(0,500)};}}
O.valymas=sh('curl -sSk --max-time 150 "'+SITE+'/?ps_s494=K494sh&act=valyti&z='+Math.random()+'"');
O.svetaine=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 30 "'+SITE+'/"').trim();
O.svetaine=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 30 "'+SITE+'/"').trim();
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putResult('s498.json', JSON.stringify(O,null,1));
console.log('OK');
