process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
const REPO='raimis079-creator/petshop-bridge';
const out={marker:'DOVANOS 0814',ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX2RvdiddID8/ICcnKSAhPT0gJ0RvdjA4MTRzJykgcmV0dXJuOwoJQHNldF90aW1lX2xpbWl0KDI0MCk7CglnbG9iYWwgJHdwZGI7CgkkbyA9IGFycmF5KCdtYXJrZXInPT4nRE9WQU5VIEtBTkRJREFUQUkgdjEnLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aTpzJykpOwoKCS8qIHNrYW5lc3R1L2tyYW10dWt1IGthdGVnb3Jpam9zICovCgkka2F0ID0gZ2V0X3Rlcm1zKGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2hpZGVfZW1wdHknPT5mYWxzZSwKCQknc2VhcmNoJz0+J3NrYW5lc3QnLCdmaWVsZHMnPT4naWQ9Pm5hbWUnKSk7Cgkka2F0MiA9IGdldF90ZXJtcyhhcnJheSgndGF4b25vbXknPT4ncHJvZHVjdF9jYXQnLCdoaWRlX2VtcHR5Jz0+ZmFsc2UsCgkJJ3NlYXJjaCc9PidrcmFtdCcsJ2ZpZWxkcyc9PidpZD0+bmFtZScpKTsKCSRvWydrYXRlZ29yaWpvcyddID0gYXJyYXkoJ3NrYW5lc3RhaSc9PiRrYXQsICdrcmFtdHVrYWknPT4ka2F0Mik7CgkkaWRzID0gYXJyYXlfbWVyZ2UoYXJyYXlfa2V5cygoYXJyYXkpJGthdCksIGFycmF5X2tleXMoKGFycmF5KSRrYXQyKSk7CglpZiAoISRpZHMpIHsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KCgkkcSA9IG5ldyBXUF9RdWVyeShhcnJheSgncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywncG9zdHNfcGVyX3BhZ2UnPT4tMSwKCQknZmllbGRzJz0+J2lkcycsJ3RheF9xdWVyeSc9PmFycmF5KGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2ZpZWxkJz0+J3Rlcm1faWQnLAoJCSd0ZXJtcyc9PiRpZHMsJ2luY2x1ZGVfY2hpbGRyZW4nPT50cnVlKSkpKTsKCSRzYXYgPSBmdW5jdGlvbigkcGlkKXsKCQlmb3JlYWNoIChhcnJheSgnX2Nvc3RfcHJpY2UnLCdfdmZfY29zdCcsJ196Yl9jb3N0JykgYXMgJGspIHsKCQkJJHY9Z2V0X3Bvc3RfbWV0YSgkcGlkLCRrLHRydWUpOwoJCQlpZiAoJHYhPT0nJyYmJHYhPT1mYWxzZSYmJHYhPT1udWxsKSByZXR1cm4gKGZsb2F0KSR2OwoJCX0KCQlyZXR1cm4gbnVsbDsKCX07CgkkcGFnYWwgPSBhcnJheSgpOwoJZm9yZWFjaCAoJHEtPnBvc3RzIGFzICRwaWQpIHsKCQkkcCA9IHdjX2dldF9wcm9kdWN0KCRwaWQpOyBpZighJHApIGNvbnRpbnVlOwoJCSRrID0gKGZsb2F0KSRwLT5nZXRfcHJpY2UoKTsgaWYgKCRrPD0wIHx8ICRrPjQuNSkgY29udGludWU7ICAgLyogZG92YW5haSB0aW5rYW1hcyByxJfFvmlzICovCgkJJHMgPSAkc2F2KCRwaWQpOyBpZiAoJHM9PT1udWxsKSBjb250aW51ZTsKCQlpZiAoISRwLT5pc19pbl9zdG9jaygpKSBjb250aW51ZTsKCQkkc2FuZCA9IHN0cnRvbG93ZXIoKHN0cmluZylnZXRfcG9zdF9tZXRhKCRwaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSkpOyBpZigkc2FuZD09PScnKSAkc2FuZD0nYXYnOwoJCSRwYWdhbFskc2FuZF1bXSA9IGFycmF5KCdpZCc9PiRwaWQsJ3Bhdic9Pm1iX3N1YnN0cigkcC0+Z2V0X25hbWUoKSwwLDU4KSwKCQkJJ2snPT4kaywncyc9PnJvdW5kKCRzLDMpLCdtJz0+cm91bmQoKCRrLzEuMjEtJHMpLygkay8xLjIxKSoxMDApLAoJCQkna2cnPT4oZmxvYXQpJHAtPmdldF93ZWlnaHQoKSwnbGlrJz0+JHAtPmdldF9zdG9ja19xdWFudGl0eSgpKTsKCX0KCWZvcmVhY2ggKCRwYWdhbCBhcyAkc2Q9PiYkc2FyKSB7IHVzb3J0KCRzYXIsIGZ1bmN0aW9uKCRhLCRiKXsgcmV0dXJuICRiWydtJ10gPD0+ICRhWydtJ107IH0pOyAkc2FyPWFycmF5X3NsaWNlKCRzYXIsMCwxMik7IH0KCSRvWydrYW5kaWRhdGFpJ10gPSAkcGFnYWw7Cgkkb1sna2lla19zYW5kZWx5amUnXSA9IGFycmF5X21hcCgnY291bnQnLCAkcGFnYWwpOwoKCS8qIGtpZWsgaXMgdmlzbyBwcmVraXUga2lla3ZpZW5hbWUgc2FuZGVseWplIHN1IHNhdmlrYWluYSBpciA8NC41IEVVUiAqLwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMCk7Cg==','base64').toString('utf8');
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP DOVANOS 0814',code:php,scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_dov=Dov0814s" --max-time 200`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const path='screenshots/dov_0814.json';
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200){sha=(await g.json()).sha;}}catch(e){}
const body={message:'dovanos 0814',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
if(sha) body.sha=sha;
const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',r.status);
