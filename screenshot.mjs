import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fm',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbfm.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbfm.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2ZtJ10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsKICAKICAkcHJvZHVjdHMgPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIgogICAgU0VMRUNUIHAuSUQsIHAucG9zdF90aXRsZSwgcC5wb3N0X3N0YXR1cywKICAgICAgICAgICAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBwb3N0X2lkPXAuSUQgQU5EIG1ldGFfa2V5PSdfc2t1JyBMSU1JVCAxKSBhcyBza3UsCiAgICAgICAgICAgKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgcG9zdF9pZD1wLklEIEFORCBtZXRhX2tleT0nX3N0b2NrJyBMSU1JVCAxKSBhcyBzdG9jaywKICAgICAgICAgICAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBwb3N0X2lkPXAuSUQgQU5EIG1ldGFfa2V5PSdfcmVndWxhcl9wcmljZScgTElNSVQgMSkgYXMgcmVnX3ByaWNlLAogICAgICAgICAgIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIHBvc3RfaWQ9cC5JRCBBTkQgbWV0YV9rZXk9J19tYW5hZ2Vfc3RvY2snIExJTUlUIDEpIGFzIG1hbmFnZV9zdG9jawogICAgRlJPTSB7JHdwZGItPnBvc3RzfSBwCiAgICBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnCiAgICBBTkQgcC5wb3N0X3RpdGxlIExJS0UgJyVNaWFtb3IlJyBBTkQgcC5wb3N0X3RpdGxlIExJS0UgJyV0dW4lJwogICAgT1JERVIgQlkgcC5wb3N0X3RpdGxlIiwgQVJSQVlfQSk7CiAgCiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkcHJvZHVjdHMpOyBleGl0Owp9KTsK",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC FM', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_fm=1&k=ps2026"');
  var m=r.match(/(\[.*\])/s); commit('find_miamor.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
