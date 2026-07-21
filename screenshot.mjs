const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZXhjbDMnXSl8fCRfR0VUWydwc19leGNsMyddIT09J1MyS3c4TngnKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDEyMCk7CglnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOwoJLy8gMyBuZWVkc19yZXZpZXcgbGVudGVsaXUgdHVyaW55cyAoMjQxLDI0MiwyNDMpIC0gYXIgZWlsdXRlcyBnZXJvcwoJZm9yZWFjaChhcnJheSgyNDEsMjQyLDI0Myw4NikgYXMgJHRpZCl7CgkJJHQ9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCxicmFuZCxsaW5lLHNwZWNpZXMsc3RhdHVzLGlzX2FjdGl2ZSxyb3dfY291bnQsd2VpZ2h0X2Jhc2lzLHJlYXNvbix2ZXJpZmljYXRpb25fbm90ZSBGUk9NIHskcGZ9cHNfZmVlZGluZ190YWJsZXMgV0hFUkUgaWQ9JWQiLCR0aWQpLEFSUkFZX0EpOwoJCSRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSB7JHBmfXBzX2ZlZWRpbmdfcm93cyBXSEVSRSBmZWVkaW5nX3RhYmxlX2lkPSVkIE9SREVSIEJZIGlkIExJTUlUIDEyIiwkdGlkKSxBUlJBWV9BKTsKCQkvLyBrb2tpZSBtYXAgaXJhc2FpIHJvZG8gaSBzaWEgbGVudGVsZQoJCSRtYXBzPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHByb2R1Y3RfaWQsaXNfYWN0aXZlIEZST00geyRwZn1wc19mZWVkaW5nX21hcCBXSEVSRSBmZWVkaW5nX3RhYmxlX2lkPSVkIiwkdGlkKSxBUlJBWV9BKTsKCQkkb1sndGFibGVzJ11bJHRpZF09YXJyYXkoJ21ldGEnPT4kdCwncm93X2NvdW50X3JlYWwnPT5jb3VudCgkcm93cyksJ3Jvd3Nfc2FtcGxlJz0+JHJvd3MsJ21hcHMnPT4kbWFwcyk7Cgl9CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){const b=Buffer.from(JSON.stringify(body)).toString('base64');
  return execSync('echo '+b+'|base64 -d|curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" -d @- "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024}).toString();}
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'EXCL3 (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
o.e=(function(){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_excl3=S2Kw8Nx"',{maxBuffer:20*1024*1024}).toString();const i=r.indexOf('{');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,300)};}})();
if(sid) wj('POST','code-snippets/v1/snippets/'+sid,{active:false});
console.log('PUT:',pr('excl3.json',o));
