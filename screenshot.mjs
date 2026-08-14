process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
const REPO='raimis079-creator/petshop-bridge';
const out={marker:'RINK APPLY 0814',ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX3JpbmtfYXBwbHknXSA/PyAnJykgIT09ICdBcGx5MDgxNHInKSByZXR1cm47CglAc2V0X3RpbWVfbGltaXQoMTIwKTsKCWdsb2JhbCAkd3BkYjsKCSRvID0gYXJyYXkoJ21hcmtlcic9PidBIEFQUExZIHYxJywgJ3RzJz0+ZGF0ZSgnWS1tLWQgSDppOnMnKSk7CgoJLyogMS4gQXIgdjEuMjUgZ3l2YXMgbm9ybWFsaWFtZSByZXF1ZXN0ZSAqLwoJJG9bJ2tsYXNlJ10gPSBjbGFzc19leGlzdHMoJ1BldHNob3BfUmlua2luaWFpJyk7Cgkkb1sndmVyc2lqYSddID0gJG9bJ2tsYXNlJ10gPyBQZXRzaG9wX1JpbmtpbmlhaTo6VkVSU0lKQSA6IG51bGw7Cgkkb1snZmlsdHJhc191cGRhdGUnXSA9IGhhc19maWx0ZXIoJ3VwZGF0ZV9wb3N0X21ldGFkYXRhJywgYXJyYXkoJ1BldHNob3BfUmlua2luaWFpJywnbGlrdWNpb191enJha3Rhc19tZXRhJykpOwoJJG9bJ2ZpbHRyYXNfYWRkJ10gPSBoYXNfZmlsdGVyKCdhZGRfcG9zdF9tZXRhZGF0YScsIGFycmF5KCdQZXRzaG9wX1JpbmtpbmlhaScsJ2xpa3VjaW9fdXpyYWt0YXNfbWV0YScpKTsKCSRvWydjcnVkX2hvb2snXSA9IGhhc19hY3Rpb24oJ3dvb2NvbW1lcmNlX2JlZm9yZV9wcm9kdWN0X29iamVjdF9zYXZlJywgYXJyYXkoJ1BldHNob3BfUmlua2luaWFpJywnbGlrdWNpb191enJha3Rhc19jcnVkJykpOwoJaWYgKCRvWyd2ZXJzaWphJ10gIT09ICcxLjI1JykgeyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQoKCS8qIDIuIEFQUExZOiBjdW11bGF0aXZlPXllcyB2aXNpZW1zIHN1cmVua2FtdSBkeWR6aWFtcyAqLwoJJGNoID0gJHdwZGItPmdldF9jb2woIlNFTEVDVCBwb3N0X2lkIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgbWV0YV9rZXk9J19wZXRzaG9wX2Nob2ljZV9wYXJlbnQnIik7CgkkYnV2byA9IGFycmF5KCk7CgkkcGFrZWlzdGEgPSAwOwoJZm9yZWFjaCAoJGNoIGFzICRwaWQpIHsKCQkkcGlkID0gKGludCkkcGlkOwoJCSR2ID0gZ2V0X3Bvc3RfbWV0YSgkcGlkLCAnX21ubV93ZWlnaHRfY3VtdWxhdGl2ZScsIHRydWUpOwoJCSRidXZvWyRwaWRdID0gJHY7CgkJaWYgKCR2ICE9PSAneWVzJykgewoJCQl1cGRhdGVfcG9zdF9tZXRhKCRwaWQsICdfbW5tX3dlaWdodF9jdW11bGF0aXZlJywgJ3llcycpOwoJCQkkcGFrZWlzdGErKzsKCQl9CgkJaWYgKGZ1bmN0aW9uX2V4aXN0cygnd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cycpKSB7IHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJHBpZCk7IH0KCX0KCXVwZGF0ZV9vcHRpb24oJ3BzX3JpbmtfY3VtdWxhdGl2ZV9iYWtfMDgxNCcsICRidXZvLCBmYWxzZSk7Cgkkb1snYXBwbHknXSA9IGFycmF5KCd2aXNvJz0+Y291bnQoJGNoKSwgJ3Bha2Vpc3RhJz0+JHBha2Vpc3RhLCAnYXRzYXJnaW5lJz0+J3BzX3JpbmtfY3VtdWxhdGl2ZV9iYWtfMDgxNCcpOwoKCS8qIDMuIE5FUFJJS0xBVVNPTUEgUEFUSUtSQTogc2thaXRvbSBpcyBuYXVqbyB0aWVzaWFpIGlzIERCICovCgkkeWVzID0gKGludCkkd3BkYi0+Z2V0X3ZhcigiCgkJU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0bWV0YX0gYwoJCUpPSU4geyR3cGRiLT5wb3N0bWV0YX0gdyBPTiB3LnBvc3RfaWQ9Yy5wb3N0X2lkIEFORCB3Lm1ldGFfa2V5PSdfbW5tX3dlaWdodF9jdW11bGF0aXZlJyBBTkQgdy5tZXRhX3ZhbHVlPSd5ZXMnCgkJV0hFUkUgYy5tZXRhX2tleT0nX3BldHNob3BfY2hvaWNlX3BhcmVudCciKTsKCSRvWydwYXRpa3JhJ10gPSBhcnJheSgneWVzX2RiJz0+JHllcywgJ2xhdWtpYW0nPT5jb3VudCgkY2gpLCAnZ2VyYWknPT4oJHllcyA9PT0gY291bnQoJGNoKSkpOwoKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzApOwo=','base64').toString('utf8');
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP RINK A APPLY 0814',code:php,scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_rink_apply=Aply0814r" --max-time 200`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const path='screenshots/rink_apply_0814.json';
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200){sha=(await g.json()).sha;}}catch(e){}
const body={message:'rink apply 0814',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
if(sha) body.sha=sha;
const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',r.status);
