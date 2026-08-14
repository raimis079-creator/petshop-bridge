process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
const REPO='raimis079-creator/petshop-bridge';
const out={marker:'VF SKAN 0814',ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX2RvdjInXSA/PyAnJykgIT09ICdEb3YwODE0eCcpIHJldHVybjsKCUBzZXRfdGltZV9saW1pdCgyNDApOwoJZ2xvYmFsICR3cGRiOwoJJG8gPSBhcnJheSgnbWFya2VyJz0+J1ZGIFNLQU5FU1RBSSB2MicsJ3RzJz0+ZGF0ZSgnWS1tLWQgSDppOnMnKSk7CgoJLyogVklTT1Mgc2thbmVzdHUva3JhbXR1a3Uga2F0ZWdvcmlqb3Mgc3UgcGFsaWt1b25pbWlzICovCgkkdmlzb3MgPSBnZXRfdGVybXMoYXJyYXkoJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnaGlkZV9lbXB0eSc9PmZhbHNlKSk7CgkkaWRzID0gYXJyYXkoKTsKCWZvcmVhY2ggKCR2aXNvcyBhcyAkdCkgewoJCWlmIChwcmVnX21hdGNoKCcvc2thbmVzdHxrcmFtdHxkZWxpa2F0fGxhemRlbHxhdXN5c3xhdXNpcy9pdScsICR0LT5uYW1lKSkgeyAkaWRzW10gPSAkdC0+dGVybV9pZDsgfQoJfQoJJG9bJ2thdGVnb3JpanUnXSA9IGNvdW50KCRpZHMpOwoKCSRxID0gbmV3IFdQX1F1ZXJ5KGFycmF5KCdwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnLCdwb3N0c19wZXJfcGFnZSc9Pi0xLAoJCSdmaWVsZHMnPT4naWRzJywnbWV0YV9xdWVyeSc9PmFycmF5KGFycmF5KCdrZXknPT4nX3BzX3NhbmRlbGlzJywndmFsdWUnPT4ndmYnLCdjb21wYXJlJz0+Jz0nKSkgKSk7Cgkkb1sndmZfcHJla2l1X2lzX3Zpc28nXSA9IGNvdW50KCRxLT5wb3N0cyk7CgoJJHNhdiA9IGZ1bmN0aW9uKCRwaWQpewoJCWZvcmVhY2ggKGFycmF5KCdfY29zdF9wcmljZScsJ192Zl9jb3N0JywnX3piX2Nvc3QnKSBhcyAkaykgewoJCQkkdj1nZXRfcG9zdF9tZXRhKCRwaWQsJGssdHJ1ZSk7CgkJCWlmICgkdiE9PScnJiYkdiE9PWZhbHNlJiYkdiE9PW51bGwpIHJldHVybiBhcnJheSgoZmxvYXQpJHYsJGspOwoJCX0KCQlyZXR1cm4gYXJyYXkobnVsbCwnJyk7Cgl9OwoJJHNhciA9IGFycmF5KCk7ICRiZV9zYXYgPSAwOwoJZm9yZWFjaCAoJHEtPnBvc3RzIGFzICRwaWQpIHsKCQkka2F0cyA9IHdwX2dldF9wb3N0X3Rlcm1zKCRwaWQsJ3Byb2R1Y3RfY2F0JyxhcnJheSgnZmllbGRzJz0+J2lkcycpKTsKCQkkeXJhID0gZmFsc2U7CgkJZm9yZWFjaCAoKGFycmF5KSRrYXRzIGFzICRraWQpIHsgaWYgKGluX2FycmF5KCRraWQsJGlkcyx0cnVlKSkgeyAkeXJhPXRydWU7IGJyZWFrOyB9IH0KCQlpZiAoISR5cmEpIGNvbnRpbnVlOwoJCSRwID0gd2NfZ2V0X3Byb2R1Y3QoJHBpZCk7IGlmKCEkcCkgY29udGludWU7CgkJbGlzdCgkcywkcmFrdGFzKSA9ICRzYXYoJHBpZCk7CgkJaWYgKCRzPT09bnVsbCkgeyAkYmVfc2F2Kys7IGNvbnRpbnVlOyB9CgkJJHJ1c3lzID0gd3BfZ2V0X3Bvc3RfdGVybXMoJHBpZCwncGFfZ3l2dW5vX3J1c2lzJyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpOwoJCSRzYXJbXSA9IGFycmF5KCdpZCc9PiRwaWQsJ3Bhdic9Pm1iX3N1YnN0cigkcC0+Z2V0X25hbWUoKSwwLDYwKSwKCQkJJ2snPT4oZmxvYXQpJHAtPmdldF9wcmljZSgpLCdzJz0+cm91bmQoJHMsMyksJ3Jha3Rhcyc9PiRyYWt0YXMsCgkJCSdydXNpcyc9PmltcGxvZGUoJywnLCAoYXJyYXkpJHJ1c3lzKSwKCQkJJ3lyYSc9PiRwLT5pc19pbl9zdG9jaygpLCdsaWsnPT4kcC0+Z2V0X3N0b2NrX3F1YW50aXR5KCksCgkJCSdrYXRzJz0+aW1wbG9kZSgnIMK3ICcsIHdwX2dldF9wb3N0X3Rlcm1zKCRwaWQsJ3Byb2R1Y3RfY2F0JyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpKSk7Cgl9Cgl1c29ydCgkc2FyLCBmdW5jdGlvbigkYSwkYil7IHJldHVybiAkYVsncyddIDw9PiAkYlsncyddOyB9KTsKCSRvWydyYXN0YSddID0gY291bnQoJHNhcik7ICRvWydiZV9zYXZpa2Fpbm9zJ10gPSAkYmVfc2F2OwoJJG9bJ3NhcmFzYXMnXSA9IGFycmF5X3NsaWNlKCRzYXIsIDAsIDQwKTsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzApOwo=','base64').toString('utf8');
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP VF SKAN 0814',code:php,scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_dov2=Dov0814x" --max-time 200`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const path='screenshots/dov2_0814.json';
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200){sha=(await g.json()).sha;}}catch(e){}
const body={message:'vf skan 0814',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
if(sha) body.sha=sha;
const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',r.status);
