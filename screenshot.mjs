process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
const REPO='raimis079-creator/petshop-bridge';
const out={marker:'MNM KAINOS 0814',ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX21ubTInXSA/PyAnJykgIT09ICdNbm0wODE0cCcpIHJldHVybjsKCUBzZXRfdGltZV9saW1pdCgyNDApOwoJJG89YXJyYXkoJ21hcmtlcic9PidNTk0gS0FJTk9EQVJBIHYxJywndHMnPT5kYXRlKCdZLW0tZCBIOmk6cycpKTsKCSRkaXIgPSBXUF9QTFVHSU5fRElSLicvd29vY29tbWVyY2UtbWl4LWFuZC1tYXRjaC1wcm9kdWN0cyc7CgkkaW1rID0gZnVuY3Rpb24oJHJlbCwgJG51bywgJGtpZWspIHVzZSAoJGRpcikgewoJCSRwPSRkaXIuJy8nLiRyZWw7IGlmKCFmaWxlX2V4aXN0cygkcCkpIHJldHVybiAnbmVyYTogJy4kcmVsOwoJCSRlPWZpbGUoJHAsIEZJTEVfSUdOT1JFX05FV19MSU5FUyk7CgkJcmV0dXJuIGFycmF5X3NsaWNlKCRlLCBtYXgoMCwkbnVvLTEpLCAka2llayk7Cgl9OwoJLyogMS4ga2FpcCBza2FpY2l1b2phbWEgbnVvbGFpZGEgKi8KCSRvWydwcmljZXNfNjgnXSA9ICRpbWsoJ2luY2x1ZGVzL2NsYXNzLXdjLW1ubS1wcm9kdWN0LXByaWNlcy5waHAnLCA0NSwgNTUpOwoJLyogMi4gdmFpa28ga2FpbmEgKi8KCSRvWydjaGlsZF8yNjAnXSA9ICRpbWsoJ2luY2x1ZGVzL2NsYXNzLXdjLW1ubS1jaGlsZC1pdGVtLnBocCcsIDI1NSwgNDUpOwoJLyogMy4gYXIgeXJhIG51b2xhaWRhICovCgkkb1snaGFzX2Rpc2NvdW50J10gPSAkaW1rKCdpbmNsdWRlcy9jbGFzcy13Yy1wcm9kdWN0LW1peC1hbmQtbWF0Y2gucGhwJywgOTE1LCAzMCk7CgoJLyogNC4ga3VyIG51c3RhdG9tYSBrb250ZWluZXJpbyBrYWluYSBrcmVwc2VseWplICovCgkkZ3JlcCA9IGFycmF5KCk7CgkkaXQgPSBuZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGRpcikpOwoJZm9yZWFjaCAoJGl0IGFzICRmKSB7CgkJaWYgKCRmLT5nZXRFeHRlbnNpb24oKSE9PSdwaHAnKSBjb250aW51ZTsKCQkkcmVsID0gc3RyX3JlcGxhY2UoJGRpci4nLycsJycsJGYtPmdldFBhdGhuYW1lKCkpOwoJCWZvcmVhY2ggKGZpbGUoJGYtPmdldFBhdGhuYW1lKCksIEZJTEVfSUdOT1JFX05FV19MSU5FUykgYXMgJGk9PiRsKSB7CgkJCWlmIChwcmVnX21hdGNoKCcvc2V0X3ByaWNlXCh8LT5wcmljZVxzKj18Y2FsY3VsYXRlX3ByaWNlfGdldF9jb250YWluZXJfcHJpY2V8cHJpY2VkX3Blcl9wcm9kdWN0L2knLCAkbCkpIHsKCQkJCSRncmVwW10gPSAkcmVsLic6Jy4oJGkrMSkuJyAgJy50cmltKG1iX3N1YnN0cigkbCwwLDExMCkpOwoJCQl9CgkJfQoJfQoJJG9bJ2thaW5vc19laWx1dGVzJ10gPSBhcnJheV9zbGljZSgkZ3JlcCwgMCwgNDUpOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMCk7Cg==','base64').toString('utf8');
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP MNM KAINOS 0814',code:php,scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_mnm2=Mnm0814p" --max-time 200`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const path='screenshots/mnm2_0814.json';
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200){sha=(await g.json()).sha;}}catch(e){}
const body={message:'mnm kainos 0814',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
if(sha) body.sha=sha;
const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',r.status);
