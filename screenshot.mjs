import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fe',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbfe.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbfe.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2ZlJ10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsKICAkcHJvZHVjdHMgPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIgogICAgU0VMRUNUIHAuSUQsIHAucG9zdF90aXRsZSwgcC5wb3N0X3N0YXR1cywKICAgICAgICAgICAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBwb3N0X2lkPXAuSUQgQU5EIG1ldGFfa2V5PSdfc2t1JyBMSU1JVCAxKSBhcyBza3UsCiAgICAgICAgICAgKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgcG9zdF9pZD1wLklEIEFORCBtZXRhX2tleT0nX3N0b2NrJyBMSU1JVCAxKSBhcyBzdG9jaywKICAgICAgICAgICAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBwb3N0X2lkPXAuSUQgQU5EIG1ldGFfa2V5PSdfcmVndWxhcl9wcmljZScgTElNSVQgMSkgYXMgcmVnX3ByaWNlLAogICAgICAgICAgIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIHBvc3RfaWQ9cC5JRCBBTkQgbWV0YV9rZXk9J19wcmljZScgTElNSVQgMSkgYXMgcHJpY2UsCiAgICAgICAgICAgKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgcG9zdF9pZD1wLklEIEFORCBtZXRhX2tleT0nX3dlaWdodCcgTElNSVQgMSkgYXMgd2VpZ2h0CiAgICBGUk9NIHskd3BkYi0+cG9zdHN9IHAKICAgIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcKICAgIEFORCBwLnBvc3RfdGl0bGUgTElLRSAnJUV4Y2x1c2lvbiUnIEFORCBwLnBvc3RfdGl0bGUgTElLRSAnJWtpYXVsaWVuYSUnCiAgICBPUkRFUiBCWSBwLnBvc3RfdGl0bGUiLCBBUlJBWV9BKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRwcm9kdWN0cyk7IGV4aXQ7Cn0pOwo=",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC FE', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_fe=1&k=ps2026"');
  var m=r.match(/(\[.*\])/s); commit('find_excl.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
