process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
const REPO='raimis079-creator/petshop-bridge';
const out={marker:'DEPLOY 126',ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX2RlcDEyNiddID8/ICcnKSAhPT0gJ0RlcDA4MTR2JykgcmV0dXJuOwoJQHNldF90aW1lX2xpbWl0KDE4MCk7Cgkkbz1hcnJheSgnbWFya2VyJz0+J0RFUExPWSB2MS4yNicsJ3RzJz0+ZGF0ZSgnWS1tLWQgSDppOnMnKSk7CgkkdXJsPSdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vcmFpbWlzMDc5LWNyZWF0b3IvcGV0c2hvcC1icmlkZ2UvYmFkOTg5MWJiMDBlMGJjMzMyYWQ0NzVkMjRlNDJiNzAyMWUxYmQ5OC9kZXBsb3kvcGV0c2hvcC1yaW5raW5pYWkucGhwJzsKCSRyPXdwX3JlbW90ZV9nZXQoJHVybCxhcnJheSgndGltZW91dCc9PjYwKSk7CglpZihpc193cF9lcnJvcigkcikpeyAkb1snZXJyJ109JHItPmdldF9lcnJvcl9tZXNzYWdlKCk7IH0KCWVsc2UgewoJCSRrPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKCQkkb1snYnl0ZXMnXT1zdHJsZW4oJGspOyAkb1snbWQ1X29rJ109KG1kNSgkayk9PT0nY2Q3ZWUwNmRkYjE3ZGU3Nzg2OTJhZGIyMGYxYmYyYjAnKTsKCQlpZigkb1snbWQ1X29rJ10pewoJCQkkdD1zdHJfcmVwbGFjZShhcnJheSgnY2xhc3MgUGV0c2hvcF9SaW5raW5pYWknLCdQZXRzaG9wX1JpbmtpbmlhaTo6aW5pdCgpOycsJ1BldHNob3BfUmlua2luaWFpOjpWRVJTSUpBJyksCgkJCQlhcnJheSgnY2xhc3MgUGV0c2hvcF9SaW5raW5pYWlfU2ludGFrc2UnLCcnLCdQZXRzaG9wX1JpbmtpbmlhaV9TaW50YWtzZTo6VkVSU0lKQScpLCRrKTsKCQkJJHRtcD1zeXNfZ2V0X3RlbXBfZGlyKCkuJy9yMTI2LScudGltZSgpLicucGhwJzsgZmlsZV9wdXRfY29udGVudHMoJHRtcCwkdCk7CgkJCSRvaz1udWxsOwoJCQl0cnl7IGluY2x1ZGUgJHRtcDsgJG9rPXRydWU7ICRvWydsaW50J109J3N2YXJ1JzsgfQoJCQljYXRjaChQYXJzZUVycm9yICRlKXsgJG9rPWZhbHNlOyAkb1snbGludCddPSdQYXJzZUVycm9yOiAnLiRlLT5nZXRNZXNzYWdlKCkuJyBlaWwuJy4kZS0+Z2V0TGluZSgpOyB9CgkJCWNhdGNoKFRocm93YWJsZSAkZSl7ICRvaz10cnVlOyAkb1snbGludCddPSdydW50aW1lOiAnLiRlLT5nZXRNZXNzYWdlKCk7IH0KCQkJQHVubGluaygkdG1wKTsKCQkJaWYoJG9rKXsKCQkJCSRkPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Atcmlua2luaWFpLnBocCc7CgkJCQkkYj1XUE1VX1BMVUdJTl9ESVIuJy8uYmFrLXJpbmtpbmlhaS0nLmRhdGUoJ1ltZC1IaXMnKS4nLnR4dCc7CgkJCQlAY29weSgkZCwkYik7ICRvWydrb3BpamEnXT1iYXNlbmFtZSgkYik7CgkJCQkkb1snaXJhc3l0YSddPWZpbGVfcHV0X2NvbnRlbnRzKCRkLCRrKTsKCQkJCSRvWydkZXN0X21kNV9vayddPShtZDVfZmlsZSgkZCk9PT0nY2Q3ZWUwNmRkYjE3ZGU3Nzg2OTJhZGIyMGYxYmYyYjAnKTsKCQkJfQoJCX0KCX0KCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzApOwo=','base64').toString('utf8');
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP DEPLOY 126',code:php,scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_dep126=Dep0814v" --max-time 200`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const path='screenshots/dep126_0814.json';
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200){sha=(await g.json()).sha;}}catch(e){}
const body={message:'deploy 126',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
if(sha) body.sha=sha;
const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',r.status);
