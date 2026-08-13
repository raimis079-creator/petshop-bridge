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
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP RINK PULL3 0813',code:Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfcHVsbDMnXSA/PyAnJykhPT0nUGwzM1l5NycpIHJldHVybjsKCUBzZXRfdGltZV9saW1pdCgxODApOwoJJG8gPSBhcnJheSgnbWFya2VyJz0+J1BVTEwgREVQTE9ZIHYyJyk7CgkkdXJsID0gJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS8yMWI3MzNhMjE0YTBkYTg5MDY4ZThiNGQwNjQ3ZDEwNmMxYzUyNjdlL2RlcGxveS9wZXRzaG9wLXJpbmtpbmlhaS5waHAnOwoJJHIgPSB3cF9yZW1vdGVfZ2V0KCR1cmwsIGFycmF5KCd0aW1lb3V0Jz0+NjApKTsKCWlmIChpc193cF9lcnJvcigkcikpIHsgJG9bJ2VyciddID0gJHItPmdldF9lcnJvcl9tZXNzYWdlKCk7IH0KCWVsc2UgewoJCSRrb2RhcyA9IHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKCQkkb1snaHR0cCddID0gd3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpOwoJCSRvWydieXRlcyddID0gc3RybGVuKCRrb2Rhcyk7CgkJJG9bJ21kNSddID0gbWQ1KCRrb2Rhcyk7CgkJJG9bJ3N1dGFtcGEnXSA9IChtZDUoJGtvZGFzKSA9PT0gJzk5ODM5OTMyM2RiNzI4ZWI1NjVhNDJjOTAxMTMzNDRiJyk7CgkJaWYgKCRvWydzdXRhbXBhJ10gJiYgc3RybGVuKCRrb2RhcykgPiA1MDAwMCkgewoJCQkkdG1wID0gc3lzX2dldF90ZW1wX2RpcigpLicvcmluay0nLnRpbWUoKS4nLnBocCc7CgkJCWZpbGVfcHV0X2NvbnRlbnRzKCR0bXAsICRrb2Rhcyk7CgkJCSRvayA9IG51bGw7CgkJCXRyeSB7IGluY2x1ZGUgJHRtcDsgJG9rID0gdHJ1ZTsgJG9bJ2xpbnQnXSA9ICdPSyc7IH0KCQkJY2F0Y2ggKFBhcnNlRXJyb3IgJGUpIHsgJG9rID0gZmFsc2U7ICRvWydsaW50J10gPSAnUGFyc2VFcnJvcjogJy4kZS0+Z2V0TWVzc2FnZSgpLicgZWlsLicuJGUtPmdldExpbmUoKTsgfQoJCQljYXRjaCAoVGhyb3dhYmxlICRlKSB7ICRvayA9IHRydWU7ICRvWydsaW50J10gPSAnUnVudGltZSAoc2ludGFrc2UgT0spJzsgfQoJCQlAdW5saW5rKCR0bXApOwoJCQkkb1snc2ludGFrc2UnXSA9ICRvazsKCQkJaWYgKCRvaykgewoJCQkJJGRlc3QgPSBXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXJpbmtpbmlhaS5waHAnOwoJCQkJQGNvcHkoJGRlc3QsIFdQTVVfUExVR0lOX0RJUi4nLy5iYWstcmlua2luaWFpLScuZGF0ZSgnWW1kLUhpcycpLicudHh0Jyk7CgkJCQkkb1snaXJhc3l0YSddID0gZmlsZV9wdXRfY29udGVudHMoJGRlc3QsICRrb2Rhcyk7CgkJCQkkb1snZGVzdF9tZDUnXSA9IG1kNV9maWxlKCRkZXN0KTsKCQkJCWRlbGV0ZV90cmFuc2llbnQoJ3BzX3JpbmtfbWVkaXMnKTsKCQkJCWRlbGV0ZV90cmFuc2llbnQoJ3BzX3JpbmtfcnVzeXMnKTsKCQkJfQoJCX0KCX0KCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7CgllY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsKCWV4aXQ7Cn0sIDEzMCk7Cg==','base64').toString('utf8'),scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_pull3=Pl33Yy7" --max-time 120`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,600);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const r=await fetch('https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/pull3.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify({message:'pull3 rez',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')})});
console.log('put',r.status);
