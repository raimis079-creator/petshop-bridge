process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
const REPO='raimis079-creator/petshop-bridge';
const out={marker:'MNM 0814',ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX21ubSddID8/ICcnKSAhPT0gJ01ubTA4MTRrJykgcmV0dXJuOwoJQHNldF90aW1lX2xpbWl0KDI0MCk7CgkkbyA9IGFycmF5KCdtYXJrZXInPT4nTU5NIEdBTElNWUJFUyB2MScsJ3RzJz0+ZGF0ZSgnWS1tLWQgSDppOnMnKSk7CgoJLyogcGx1Z2lubyB2ZXJzaWphIGlyIGtlbGlhcyAqLwoJaWYgKCFmdW5jdGlvbl9leGlzdHMoJ2dldF9wbHVnaW5zJykpIHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy9wbHVnaW4ucGhwJzsKCWZvcmVhY2ggKGdldF9wbHVnaW5zKCkgYXMgJGtlbGlhcz0+JGQpIHsKCQlpZiAoc3RyaXBvcygka2VsaWFzLCdtaXgtYW5kLW1hdGNoJykhPT1mYWxzZSB8fCBzdHJpcG9zKCRkWydOYW1lJ10sJ01peCBhbmQgTWF0Y2gnKSE9PWZhbHNlKSB7CgkJCSRvWydwbHVnaW5hcyddID0gYXJyYXkoJ2tlbGlhcyc9PiRrZWxpYXMsJ3ZhcmRhcyc9PiRkWydOYW1lJ10sJ3ZlcnNpamEnPT4kZFsnVmVyc2lvbiddLAoJCQkJJ2FrdHl2dXMnPT5pc19wbHVnaW5fYWN0aXZlKCRrZWxpYXMpKTsKCQkJJG9bJ2RpciddID0gV1BfUExVR0lOX0RJUi4nLycuZGlybmFtZSgka2VsaWFzKTsKCQl9Cgl9CglpZiAoZW1wdHkoJG9bJ2RpciddKSB8fCAhaXNfZGlyKCRvWydkaXInXSkpIHsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KCgkvKiBpZXNrb206IGthdGVnb3Jpam9zIHNhbHRpbmlzICsgZmlsdHJhaSwga3VyaXVvcyBnYWxpbSB1emthYmludGkgKi8KCSRyYWRpbmlhaSA9IGFycmF5KCk7ICRmYWlsYWkgPSBhcnJheSgpOwoJJGl0ID0gbmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRvWydkaXInXSkpOwoJZm9yZWFjaCAoJGl0IGFzICRmKSB7CgkJaWYgKCRmLT5nZXRFeHRlbnNpb24oKSAhPT0gJ3BocCcpIGNvbnRpbnVlOwoJCSRmYWlsYWlbXSA9IHN0cl9yZXBsYWNlKCRvWydkaXInXS4nLycsICcnLCAkZi0+Z2V0UGF0aG5hbWUoKSk7CgkJJHNyYyA9IGZpbGVfZ2V0X2NvbnRlbnRzKCRmLT5nZXRQYXRobmFtZSgpKTsKCQlmb3JlYWNoIChleHBsb2RlKCJcbiIsICRzcmMpIGFzICRpPT4kbCkgewoJCQlpZiAocHJlZ19tYXRjaCgiL2FwcGx5X2ZpbHRlcnNcKFxzKicoW2EtejAtOV9dKm1ubVthLXowLTlfXSopJy9pIiwgJGwsICRtKSkgewoJCQkJJHJhZGluaWFpWydmaWx0cmFpJ11bJG1bMV1dID0gc3RyX3JlcGxhY2UoJG9bJ2RpciddLicvJywnJywkZi0+Z2V0UGF0aG5hbWUoKSkuJzonLigkaSsxKTsKCQkJfQoJCQlpZiAocHJlZ19tYXRjaCgnL2NvbnRlbnRfc291cmNlfGNhdGVnb3IvaScsICRsKSAmJiBwcmVnX21hdGNoKCcvZnVuY3Rpb24gfGFwcGx5X2ZpbHRlcnN8XCRjYXRlZ29yfGNoaWxkX2NhdGVnb3IvaScsICRsKSkgewoJCQkJJHJhZGluaWFpWydrYXRlZ29yaWpvcyddW10gPSBzdHJfcmVwbGFjZSgkb1snZGlyJ10uJy8nLCcnLCRmLT5nZXRQYXRobmFtZSgpKS4nOicuKCRpKzEpLicgJy50cmltKG1iX3N1YnN0cigkbCwwLDEyMCkpOwoJCQl9CgkJfQoJfQoJJG9bJ2ZhaWx1J10gPSBjb3VudCgkZmFpbGFpKTsKCSRvWydmaWx0cmFpJ10gPSBpc3NldCgkcmFkaW5pYWlbJ2ZpbHRyYWknXSkgPyAkcmFkaW5pYWlbJ2ZpbHRyYWknXSA6IGFycmF5KCk7Cgkkb1snZmlsdHJ1X2tpZWtpcyddID0gY291bnQoJG9bJ2ZpbHRyYWknXSk7Cgkkb1sna2F0ZWdvcmlqdV9laWx1dGVzJ10gPSBhcnJheV9zbGljZSgkcmFkaW5pYWlbJ2thdGVnb3Jpam9zJ10gPz8gYXJyYXkoKSwgMCwgNDApOwoKCS8qIGtvbmtyZWNpYWk6IGFyIHlyYSBmaWx0cmFzIHZhaWt1IHNhcmFzdWkgKi8KCSRzdmFyYnVzID0gYXJyYXkoKTsKCWZvcmVhY2ggKCRvWydmaWx0cmFpJ10gYXMgJGY9PiR2aWV0YSkgewoJCWlmIChwcmVnX21hdGNoKCcvY2hpbGRfaXRlbXN8Y2hpbGRfcHJvZHVjdHN8Z2V0X2NoaWxkcmVufGNhdGVnb3J8Y29udGVudHN8YXZhaWxhYmxlL2knLCAkZikpIHsgJHN2YXJidXNbJGZdPSR2aWV0YTsgfQoJfQoJJG9bJ3N2YXJidXNfZmlsdHJhaSddID0gJHN2YXJidXM7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMwKTsK','base64').toString('utf8');
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP MNM 0814',code:php,scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_mnm=Mnm0814k" --max-time 200`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const path='screenshots/mnm_0814.json';
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200){sha=(await g.json()).sha;}}catch(e){}
const body={message:'mnm 0814',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
if(sha) body.sha=sha;
const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',r.status);
