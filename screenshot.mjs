process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
const REPO='raimis079-creator/petshop-bridge';
const out={marker:'PATIKRA 126',ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX3ZmJ10gPz8gJycpICE9PSAnVmYwODE0bScpIHJldHVybjsKCUBzZXRfdGltZV9saW1pdCgyNDApOwoJJG89YXJyYXkoJ21hcmtlcic9PidWRiBMQVVLVSBQUkVLRVMnLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aTpzJykpOwoJJHJhc3RpPWdldF90ZXJtcyhhcnJheSgndGF4b25vbXknPT4ncHJvZHVjdF9jYXQnLCdoaWRlX2VtcHR5Jz0+ZmFsc2UpKTsKCSRrYXQ9YXJyYXkoKTsKCWZvcmVhY2ggKCRyYXN0aSBhcyAkdCkgeyBpZiAocHJlZ19tYXRjaCgnL3NrYW58a3JhbXR8ZGVsaWthdC9pdScsJHQtPm5hbWUpKSAka2F0W109JHQtPnRlcm1faWQ7IH0KCSRxPW5ldyBXUF9RdWVyeShhcnJheSgncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywncG9zdHNfcGVyX3BhZ2UnPT4tMSwnZmllbGRzJz0+J2lkcycsCgkJJ3RheF9xdWVyeSc9PmFycmF5KGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2ZpZWxkJz0+J3Rlcm1faWQnLCd0ZXJtcyc9PiRrYXQsJ2luY2x1ZGVfY2hpbGRyZW4nPT50cnVlKSksCgkJJ21ldGFfcXVlcnknPT5hcnJheShhcnJheSgna2V5Jz0+J19wc19zYW5kZWxpcycsJ3ZhbHVlJz0+J3ZmJywnY29tcGFyZSc9Pic9JykpKSk7Cgkkc2F2PWZ1bmN0aW9uKCRwaWQpe2ZvcmVhY2goYXJyYXkoJ19jb3N0X3ByaWNlJywnX3ZmX2Nvc3QnLCdfemJfY29zdCcpIGFzICRrKXskdj1nZXRfcG9zdF9tZXRhKCRwaWQsJGssdHJ1ZSk7CgkJaWYoJHYhPT0nJyYmJHYhPT1mYWxzZSYmKGZsb2F0KSR2PjApIHJldHVybiAoZmxvYXQpJHY7fSByZXR1cm4gbnVsbDt9OwoJJGxhdWthaT1hcnJheSgpOwoJZm9yZWFjaCAoJHEtPnBvc3RzIGFzICRwaWQpIHsKCQkkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsgaWYoISRwfHwkcC0+Z2V0X3ByaWNlKCk8PTB8fCEkcC0+aXNfaW5fc3RvY2soKSkgY29udGludWU7CgkJJHM9JHNhdigkcGlkKTsgaWYoJHM9PT1udWxsKSBjb250aW51ZTsKCQkkcnVzPXdwX2dldF9wb3N0X3Rlcm1zKCRwaWQsJ3BhX2d5dnVub19ydXNpcycsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKTsgJHJ1cz0kcnVzPyRydXNbMF06Jyc7CgkJJGJhbHQ9d3BfZ2V0X3Bvc3RfdGVybXMoJHBpZCwncGFfYmFsdHltdV9zYWx0aW5pcycsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKTsKCQkkc3BlYz13cF9nZXRfcG9zdF90ZXJtcygkcGlkLCdwYV9zcGVjaWFsaV9taXR5YmEnLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSk7CgkJJG1vbm89d3BfZ2V0X3Bvc3RfdGVybXMoJHBpZCwncGFfbW9ub3Byb3RlaW4nLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSk7CgkJJGs9KGZsb2F0KSRwLT5nZXRfcHJpY2UoKTsKCQkkZWlsPWFycmF5KCdpZCc9PiRwaWQsJ3Bhdic9PiRwLT5nZXRfbmFtZSgpLCdrJz0+cm91bmQoJGssMiksJ3MnPT5yb3VuZCgkcywzKSwKCQkJJ20nPT5yb3VuZCgoKCRrLzEuMjEpLSRzKS8oJGsvMS4yMSkqMTAwKSwnbGlrJz0+JHAtPmdldF9zdG9ja19xdWFudGl0eSgpLAoJCQknYmFsdCc9PmltcGxvZGUoJywgJywoYXJyYXkpJGJhbHQpLAoJCQknZm90byc9PndwX2dldF9hdHRhY2htZW50X2ltYWdlX3VybCgkcC0+Z2V0X2ltYWdlX2lkKCksJ3RodW1ibmFpbCcpKTsKCQkkdGlrdD1hcnJheSgpOwoJCWlmICgkcnVzPT09J8WgdW5pbXMnKSB7CgkJCWlmICgkYmFsdCAmJiAhaW5fYXJyYXkoJ1ZpxaF0aWVuYScsJGJhbHQsdHJ1ZSkpICR0aWt0W109J3N1bnlzX2JlX3Zpc3RpZW5vcyc7CgkJCWlmICgkbW9ubykgJHRpa3RbXT0nc3VueXNfbW9ubyc7CgkJCWlmIChpbl9hcnJheSgnSmF1dHJpYW0gdmlyxaFraW5pbXVpJywoYXJyYXkpJHNwZWMsdHJ1ZSkpICR0aWt0W109J3N1bnlzX2phdXRydXMnOwoJCQlpZiAoaW5fYXJyYXkoJ0hpcG9hbGVyZ2luaXMnLChhcnJheSkkc3BlYyx0cnVlKSkgJHRpa3RbXT0nc3VueXNfaGlwbyc7CgkJfSBlbHNlaWYgKCRydXM9PT0nS2F0xJdtcycpIHsKCQkJaWYgKCRiYWx0ICYmICFpbl9hcnJheSgnVmnFoXRpZW5hJywkYmFsdCx0cnVlKSkgJHRpa3RbXT0na2F0ZXNfYmVfdmlzdGllbm9zJzsKCQkJaWYgKCRtb25vKSAkdGlrdFtdPSdrYXRlc19tb25vJzsKCQl9CgkJZm9yZWFjaCAoJHRpa3QgYXMgJGwpIHsgJGxhdWthaVskbF1bXT0kZWlsOyB9Cgl9Cglmb3JlYWNoICgkbGF1a2FpIGFzICRsPT4mJHNhcikgewoJCXVzb3J0KCRzYXIsZnVuY3Rpb24oJGEsJGIpe3JldHVybiAkYlsnbSddPD0+JGFbJ20nXTt9KTsKCQkkc2FyPWFycmF5X3NsaWNlKCRzYXIsMCwxMik7Cgl9Cgkkb1snbGF1a2FpJ109JGxhdWthaTsKCSRvWydraWVraWFpJ109YXJyYXlfbWFwKCdjb3VudCcsJGxhdWthaSk7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMwKTsK','base64').toString('utf8');
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP PATIKRA 126',code:php,scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_vf=Vf0814m" --max-time 200`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const path='screenshots/vf_0814.json';
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200){sha=(await g.json()).sha;}}catch(e){}
const body={message:'patikra 126',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
if(sha) body.sha=sha;
const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',r.status);
