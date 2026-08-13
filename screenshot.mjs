process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'PATIKRA 0813',ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP RINK PULL2 0813',code:Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKChbJ3BzX3B1bGwyJ10gPz8gJycpIT09J1BsOTlYeDMnKSByZXR1cm47CglAc2V0X3RpbWVfbGltaXQoMTgwKTsKCT1hcnJheSgnbWFya2VyJz0+J1BVTEwgREVQTE9ZJyk7Cgk9J2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS8yMWI3MzNhMjE0YTBkYTg5MDY4ZThiNGQwNjQ3ZDEwNmMxYzUyNjdlL2RlcGxveS9wZXRzaG9wLXJpbmtpbmlhaS5waHAnOwoJPXdwX3JlbW90ZV9nZXQoLCBhcnJheSgndGltZW91dCc9PjYwKSk7CglpZihpc193cF9lcnJvcigpKXsgWydlcnInXT0tPmdldF9lcnJvcl9tZXNzYWdlKCk7IH0KCWVsc2V7CgkJPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCk7CgkJWydieXRlcyddPXN0cmxlbigpOwoJCVsnbWQ1J109bWQ1KCk7CgkJWydzdXRhbXBhJ109KG1kNSgpPT09Jzk5ODM5OTMyM2RiNzI4ZWI1NjVhNDJjOTAxMTMzNDRiJyk7CgkJaWYoWydzdXRhbXBhJ10gJiYgc3RybGVuKCk+NTAwMDApewoJCQk9c3lzX2dldF90ZW1wX2RpcigpLicvcmluay0nLnRpbWUoKS4nLnBocCc7CgkJCWZpbGVfcHV0X2NvbnRlbnRzKCwpOwoJCQk9bnVsbDsKCQkJdHJ5eyBpbmNsdWRlIDsgPXRydWU7IFsnbGludCddPSdPSyc7IH0KCQkJY2F0Y2goXFBhcnNlRXJyb3IgKXsgPWZhbHNlOyBbJ2xpbnQnXT0nUGFyc2VFcnJvcjogJy4tPmdldE1lc3NhZ2UoKS4nIGVpbC4nLi0+Z2V0TGluZSgpOyB9CgkJCWNhdGNoKFxUaHJvd2FibGUgKXsgPXRydWU7IFsnbGludCddPSdSdW50aW1lIChzaW50YWtzZSBPSyknOyB9CgkJCUB1bmxpbmsoKTsKCQkJWydzaW50YWtzZSddPTsKCQkJaWYoKXsKCQkJCT1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXJpbmtpbmlhaS5waHAnOwoJCQkJQGNvcHkoLCBXUE1VX1BMVUdJTl9ESVIuJy8uYmFrLXJpbmtpbmlhaS0nLmRhdGUoJ1ltZC1IaXMnKS4nLnR4dCcpOwoJCQkJWydpcmFzeXRhJ109ZmlsZV9wdXRfY29udGVudHMoLCk7CgkJCQlbJ2Rlc3RfbWQ1J109bWQ1X2ZpbGUoKTsKCQkJCWRlbGV0ZV90cmFuc2llbnQoJ3BzX3JpbmtfbWVkaXMnKTsgZGVsZXRlX3RyYW5zaWVudCgncHNfcmlua19ydXN5cycpOwoJCQl9CgkJfQoJfQoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgpOyBleGl0Owp9LCAxMzApOwo=','base64').toString('utf8'),scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_pull2=Pl99Xx3" --max-time 120`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,600);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const r=await fetch('https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/pull2.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify({message:'pull2 rez',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')})});
console.log('put',r.status);
