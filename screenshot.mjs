const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZGV2ciddKXx8JF9HRVRbJ3BzX2RldnInXSE9PSdTMkt3OE54Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCg2MCk7CglnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOwoJZm9yZWFjaChhcnJheSgyNDEsMjQyLDI0MykgYXMgJHRpZCl7CgkJJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgd2VpZ2h0X2Zyb21fa2csd2VpZ2h0X3RvX2tnLGFtb3VudF9mcm9tX2csYW1vdW50X3RvX2csY29uZGl0aW9ucyxjZWxsX3R5cGUgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfcm93cyBXSEVSRSBmZWVkaW5nX3RhYmxlX2lkPSVkIE9SREVSIEJZIENBU1Qod2VpZ2h0X2Zyb21fa2cgQVMgREVDSU1BTCg2LDIpKSIsJHRpZCksQVJSQVlfQSk7CgkJJHQ9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBsaW5lLHNwZWNpZXMgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfdGFibGVzIFdIRVJFIGlkPSVkIiwkdGlkKSxBUlJBWV9BKTsKCQkkb1skdGlkXT1hcnJheSgnbGluZSc9PiR0WydsaW5lJ10sJ3Jvd3MnPT4kcm93cyk7Cgl9CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'DEVR (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
o.d=(function(){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_devr=S2Kw8Nx"',{maxBuffer:20*1024*1024}).toString();const i=r.indexOf('{');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,300)};}})();
if(sid) wj('POST','code-snippets/v1/snippets/'+sid,{active:false});
console.log('PUT:',pr('devrows.json',o));
