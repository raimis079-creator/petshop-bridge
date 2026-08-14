process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
const REPO='raimis079-creator/petshop-bridge';
const out={marker:'LAUKAI 0814',ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX2xhdWthaSddID8/ICcnKSAhPT0gJ0xhdWswODE0JykgcmV0dXJuOwoJQHNldF90aW1lX2xpbWl0KDI0MCk7CglnbG9iYWwgJHdwZGI7Cgkkbz1hcnJheSgnbWFya2VyJz0+J0xBVUtVIERVT01FTllTJywndHMnPT5kYXRlKCdZLW0tZCBIOmk6cycpKTsKCgkkcmFzdGkgPSBnZXRfdGVybXMoYXJyYXkoJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnaGlkZV9lbXB0eSc9PmZhbHNlKSk7Cgkka2F0PWFycmF5KCk7Cglmb3JlYWNoICgkcmFzdGkgYXMgJHQpIHsgaWYgKHByZWdfbWF0Y2goJy9za2FuZXN0fGtyYW10L2l1JywgJHQtPm5hbWUpKSAka2F0WyR0LT50ZXJtX2lkXT0kdC0+bmFtZTsgfQoJJG9bJ2thdGVnb3Jpam9zJ109JGthdDsKCWlmKCEka2F0KXsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KCgkkcSA9IG5ldyBXUF9RdWVyeShhcnJheSgncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywncG9zdHNfcGVyX3BhZ2UnPT4tMSwnZmllbGRzJz0+J2lkcycsCgkJJ3RheF9xdWVyeSc9PmFycmF5KGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2ZpZWxkJz0+J3Rlcm1faWQnLCd0ZXJtcyc9PmFycmF5X2tleXMoJGthdCksJ2luY2x1ZGVfY2hpbGRyZW4nPT50cnVlKSkpKTsKCSRzYXY9ZnVuY3Rpb24oJHBpZCl7Zm9yZWFjaChhcnJheSgnX2Nvc3RfcHJpY2UnLCdfdmZfY29zdCcsJ196Yl9jb3N0JykgYXMgJGspeyR2PWdldF9wb3N0X21ldGEoJHBpZCwkayx0cnVlKTsKCQlpZigkdiE9PScnJiYkdiE9PWZhbHNlJiYoZmxvYXQpJHY+MCkgcmV0dXJuIChmbG9hdCkkdjt9IHJldHVybiBudWxsO307CgoJJGF0cj1hcnJheSgncGFfZ3l2dW5vX3J1c2lzJywncGFfYmFsdHltdV9zYWx0aW5pcycsJ3BhX2JlX2dydWR1JywncGFfbW9ub3Byb3RlaW4nLCdwYV9zcGVjaWFsaV9taXR5YmEnLCdwYV9hbXppdXMnLCdwYV92ZWlzbGVzX2R5ZGlzJyk7Cgkkc3RhdD1hcnJheSgpOyAkdmlzbz0wOyAkc3Vfc2F2PTA7Cglmb3JlYWNoICgkcS0+cG9zdHMgYXMgJHBpZCkgewoJCSRwPXdjX2dldF9wcm9kdWN0KCRwaWQpOyBpZighJHB8fCRwLT5nZXRfcHJpY2UoKTw9MCkgY29udGludWU7CgkJJHZpc28rKzsKCQkkcz0kc2F2KCRwaWQpOyBpZigkcyE9PW51bGwpICRzdV9zYXYrKzsKCQkkbSA9ICRzIT09bnVsbCA/IHJvdW5kKCgoJHAtPmdldF9wcmljZSgpLzEuMjEpLSRzKS8oJHAtPmdldF9wcmljZSgpLzEuMjEpKjEwMCkgOiBudWxsOwoJCSRydXN5cyA9IHdwX2dldF9wb3N0X3Rlcm1zKCRwaWQsJ3BhX2d5dnVub19ydXNpcycsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKTsKCQkkcnVzaXMgPSAkcnVzeXMgPyAkcnVzeXNbMF0gOiAn4oCUJzsKCQlmb3JlYWNoICgkYXRyIGFzICRhKSB7CgkJCSR0PXdwX2dldF9wb3N0X3Rlcm1zKCRwaWQsJGEsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKTsKCQkJZm9yZWFjaCAoKGFycmF5KSR0IGFzICR2KSB7CgkJCQkkcmFrdGFzPSRydXNpcy4nIHwgJy4kYS4nIHwgJy4kdjsKCQkJCWlmKCFpc3NldCgkc3RhdFskcmFrdGFzXSkpICRzdGF0WyRyYWt0YXNdPWFycmF5KCduJz0+MCwnc2F2Jz0+MCwnbSc9PmFycmF5KCksJ2snPT5hcnJheSgpKTsKCQkJCSRzdGF0WyRyYWt0YXNdWyduJ10rKzsKCQkJCWlmKCRzIT09bnVsbCl7JHN0YXRbJHJha3Rhc11bJ3NhdiddKys7ICRzdGF0WyRyYWt0YXNdWydtJ11bXT0kbTt9CgkJCQkkc3RhdFskcmFrdGFzXVsnayddW109KGZsb2F0KSRwLT5nZXRfcHJpY2UoKTsKCQkJfQoJCX0KCX0KCSRvWydwcmVraXUnXT0kdmlzbzsgJG9bJ3N1X3NhdmlrYWluYSddPSRzdV9zYXY7CgkkaXN2PWFycmF5KCk7Cglmb3JlYWNoICgkc3RhdCBhcyAkaz0+JHYpIHsKCQlpZiAoJHZbJ24nXTw0KSBjb250aW51ZTsKCQkkaXN2W109YXJyYXkoJ3Jha3Rhcyc9PiRrLCduJz0+JHZbJ24nXSwnc3Vfc2F2Jz0+JHZbJ3NhdiddLAoJCQknbWFyemFfbWluJz0+JHZbJ20nXT9taW4oJHZbJ20nXSk6bnVsbCwnbWFyemFfdmlkJz0+JHZbJ20nXT9yb3VuZChhcnJheV9zdW0oJHZbJ20nXSkvY291bnQoJHZbJ20nXSkpOm51bGwsCgkJCSdrYWluYV9taW4nPT5yb3VuZChtaW4oJHZbJ2snXSksMiksJ2thaW5hX21heCc9PnJvdW5kKG1heCgkdlsnayddKSwyKSk7Cgl9Cgl1c29ydCgkaXN2LGZ1bmN0aW9uKCRhLCRiKXtyZXR1cm4gJGJbJ24nXTw9PiRhWyduJ107fSk7Cgkkb1snbGF1a2FpJ109YXJyYXlfc2xpY2UoJGlzdiwwLDQ1KTsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzApOwo=','base64').toString('utf8');
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP LAUKAI 0814',code:php,scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_laukai=Lauk0814" --max-time 200`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const path='screenshots/laukai_0814.json';
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200){sha=(await g.json()).sha;}}catch(e){}
const body={message:'laukai 0814',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
if(sha) body.sha=sha;
const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',r.status);
