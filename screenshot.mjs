process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
const REPO='raimis079-creator/petshop-bridge';
const out={marker:'VF PIG 0814',ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX2RvdjMnXSA/PyAnJykgIT09ICdEb3YwODE0eicpIHJldHVybjsKCUBzZXRfdGltZV9saW1pdCgyNDApOwoJZ2xvYmFsICR3cGRiOwoJJG8gPSBhcnJheSgnbWFya2VyJz0+J1ZGIFBJR0lBVVNJT1MgdjMnLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aTpzJykpOwoJJGlkcyA9ICR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IHBtCgkJSk9JTiB7JHdwZGItPnBvc3RzfSBwIE9OIHAuSUQ9cG0ucG9zdF9pZCBBTkQgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJwoJCVdIRVJFIHBtLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIEFORCBMT1dFUihwbS5tZXRhX3ZhbHVlKT0ndmYnIik7Cgkkb1sndmZfcHVibGlzaCddID0gY291bnQoJGlkcyk7Cgkkc2F2ID0gZnVuY3Rpb24oJHBpZCl7CgkJZm9yZWFjaCAoYXJyYXkoJ19jb3N0X3ByaWNlJywnX3ZmX2Nvc3QnLCdfemJfY29zdCcpIGFzICRrKSB7CgkJCSR2PWdldF9wb3N0X21ldGEoJHBpZCwkayx0cnVlKTsKCQkJaWYgKCR2IT09JycmJiR2IT09ZmFsc2UmJiR2IT09bnVsbCYmKGZsb2F0KSR2PjApIHJldHVybiBhcnJheSgoZmxvYXQpJHYsJGspOwoJCX0KCQlyZXR1cm4gYXJyYXkobnVsbCwnJyk7Cgl9OwoJJHNhcj1hcnJheSgpOyAkYmU9MDsKCWZvcmVhY2ggKCRpZHMgYXMgJHBpZCkgewoJCSRwaWQ9KGludCkkcGlkOyAkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsgaWYoISRwKSBjb250aW51ZTsKCQlsaXN0KCRzLCRyayk9JHNhdigkcGlkKTsKCQlpZiAoJHM9PT1udWxsKSB7ICRiZSsrOyBjb250aW51ZTsgfQoJCSRzYXJbXT1hcnJheSgnaWQnPT4kcGlkLCdwYXYnPT5tYl9zdWJzdHIoJHAtPmdldF9uYW1lKCksMCw2MiksJ2snPT4oZmxvYXQpJHAtPmdldF9wcmljZSgpLAoJCQkncyc9PnJvdW5kKCRzLDMpLCdyayc9PiRyaywneXJhJz0+JHAtPmlzX2luX3N0b2NrKCksJ2xpayc9PiRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSwKCQkJJ3J1c2lzJz0+aW1wbG9kZSgnLCcsIChhcnJheSl3cF9nZXRfcG9zdF90ZXJtcygkcGlkLCdwYV9neXZ1bm9fcnVzaXMnLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSkpLAoJCQkna2F0Jz0+bWJfc3Vic3RyKGltcGxvZGUoJyDCtyAnLCAoYXJyYXkpd3BfZ2V0X3Bvc3RfdGVybXMoJHBpZCwncHJvZHVjdF9jYXQnLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSkpLDAsNDYpKTsKCX0KCXVzb3J0KCRzYXIsZnVuY3Rpb24oJGEsJGIpe3JldHVybiAkYVsncyddPD0+JGJbJ3MnXTt9KTsKCSRvWydzdV9zYXZpa2FpbmEnXT1jb3VudCgkc2FyKTsgJG9bJ2JlX3NhdmlrYWlub3MnXT0kYmU7Cgkkb1sncGlnaWF1c2lvcyddPWFycmF5X3NsaWNlKCRzYXIsMCw0NSk7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMwKTsK','base64').toString('utf8');
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP VF PIG 0814',code:php,scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_dov3=Dov0814z" --max-time 200`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const path='screenshots/dov3_0814.json';
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200){sha=(await g.json()).sha;}}catch(e){}
const body={message:'vf pig 0814',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
if(sha) body.sha=sha;
const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',r.status);
