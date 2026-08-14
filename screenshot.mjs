process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
const REPO='raimis079-creator/petshop-bridge';
const out={marker:'POOL 0814',ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX3Bvb2wnXSA/PyAnJykgIT09ICdQb29sMDgxNHUnKSByZXR1cm47CglAc2V0X3RpbWVfbGltaXQoMjQwKTsKCWdsb2JhbCAkd3BkYjsKCSRvID0gYXJyYXkoJ21hcmtlcic9PidQT09MIHYxJywndHMnPT5kYXRlKCdZLW0tZCBIOmk6cycpKTsKCSR0YmwgPSAkd3BkYi0+cHJlZml4Lid3Y19tbm1fY2hpbGRfaXRlbXMnOwoJJHNhdiA9IGZ1bmN0aW9uKCRwaWQpewoJCWZvcmVhY2ggKGFycmF5KCdfY29zdF9wcmljZScsJ192Zl9jb3N0JywnX3piX2Nvc3QnKSBhcyAkaykgewoJCQkkdiA9IGdldF9wb3N0X21ldGEoJHBpZCwkayx0cnVlKTsKCQkJaWYgKCR2ICE9PSAnJyAmJiAkdiAhPT0gZmFsc2UgJiYgJHYgIT09IG51bGwpIHJldHVybiAoZmxvYXQpJHY7CgkJfQoJCXJldHVybiBudWxsOwoJfTsKCWZvcmVhY2ggKGFycmF5KDM0MjA3LCAzNDIzMikgYXMgJHBhcikgewoJCSRjZmcgPSBqc29uX2RlY29kZShnZXRfcG9zdF9tZXRhKCRwYXIsJ19wZXRzaG9wX2Nob2ljZV9jb25maWcnLHRydWUpLCB0cnVlKTsKCQkkZiA9IGFycmF5KAoJCQkncGF2Jz0+Z2V0X3RoZV90aXRsZSgkcGFyKSwKCQkJJ3RydW1wYXMnPT53cF9zdHJpcF9hbGxfdGFncygoc3RyaW5nKWdldF9wb3N0X21ldGEoJHBhciwnX3Nob3J0X2Rlc2NyaXB0aW9uJyx0cnVlKSksCgkJCSdub19ncmFtJz0+Z2V0X3Bvc3RfbWV0YSgkcGFyLCdfcGV0c2hvcF9jaG9pY2Vfbm9fZ3JhbScsdHJ1ZSksCgkJCSdncm91cF9sYWJlbCc9PmdldF9wb3N0X21ldGEoJHBhciwnX3BldHNob3BfY2hvaWNlX2dyb3VwX2xhYmVsJyx0cnVlKSwKCQkJJ2thaW5hJz0+Z2V0X3Bvc3RfbWV0YSgkcGFyLCdfcHJpY2UnLHRydWUpLAoJCQknY29uZmlnJz0+YXJyYXkoKSwKCQkpOwoJCSRwID0gd2NfZ2V0X3Byb2R1Y3QoJHBhcik7CgkJaWYgKCRwKSB7ICRmWyd0cnVtcGFzJ10gPSB3cF9zdHJpcF9hbGxfdGFncygkcC0+Z2V0X3Nob3J0X2Rlc2NyaXB0aW9uKCkpOyB9CgkJJG1hdHl0aSA9IGFycmF5KCk7CgkJaWYgKGlzX2FycmF5KCRjZmcpKSBmb3JlYWNoICgkY2ZnIGFzICRnaz0+JGdkKSB7CgkJCSRnID0gYXJyYXkoJ2xhYmVsJz0+JGdkWydsYWJlbCddID8/ICRnaywgJ2dyYW1hdHVyb3MnPT5hcnJheSgpKTsKCQkJZm9yZWFjaCAoKCRnZFsnZ3JhbWF0dXJvcyddID8/IGFycmF5KCkpIGFzICRncmFtPT4kc2l6ZXMpIHsKCQkJCWZvcmVhY2ggKCRzaXplcyBhcyAkc3o9PiRzaSkgewoJCQkJCSRoaWQgPSAoaW50KSRzaVsncHJvZHVjdF9pZCddOwoJCQkJCSRnWydncmFtYXR1cm9zJ11bJGdyYW1dWyRzel0gPSBhcnJheSgnaGlkJz0+JGhpZCwgJ3ByaWNlJz0+JHNpWydwcmljZSddLCAneXJhJz0+KGdldF9wb3N0X3N0YXR1cygkaGlkKSAhPT0gZmFsc2UpKTsKCQkJCQlpZiAoIWlzc2V0KCRtYXR5dGlbJGdrLid8Jy4kZ3JhbV0pKSB7CgkJCQkJCSRyb3dzID0gJHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwcm9kdWN0X2lkIEZST00geyR0Ymx9IFdIRVJFIGNvbnRhaW5lcl9pZD0lZCBPUkRFUiBCWSBtZW51X29yZGVyIiwkaGlkKSk7CgkJCQkJCSRwb29sID0gYXJyYXkoKTsKCQkJCQkJZm9yZWFjaCAoJHJvd3MgYXMgJGNpZCkgewoJCQkJCQkJJGNpZD0oaW50KSRjaWQ7ICRjcD13Y19nZXRfcHJvZHVjdCgkY2lkKTsKCQkJCQkJCWlmKCEkY3ApIHsgJHBvb2xbXT1hcnJheSgnaWQnPT4kY2lkLCdwYXYnPT4nUFJFS0VTIE5FUkEnKTsgY29udGludWU7IH0KCQkJCQkJCSRwb29sW10gPSBhcnJheSgnaWQnPT4kY2lkLCdwYXYnPT4kY3AtPmdldF9uYW1lKCksJ3NrdSc9PiRjcC0+Z2V0X3NrdSgpLAoJCQkJCQkJCSdrYWluYSc9PihmbG9hdCkkY3AtPmdldF9wcmljZSgpLCdzYXYnPT4kc2F2KCRjaWQpLAoJCQkJCQkJCSd5cmEnPT4kY3AtPmlzX2luX3N0b2NrKCksJ2xpa3V0aXMnPT4kY3AtPmdldF9zdG9ja19xdWFudGl0eSgpLAoJCQkJCQkJCSdrZyc9PihmbG9hdCkkY3AtPmdldF93ZWlnaHQoKSwKCQkJCQkJCQknc2FuZGVsaXMnPT5nZXRfcG9zdF9tZXRhKCRjaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSksCgkJCQkJCQkJJ2ltZyc9PndwX2dldF9hdHRhY2htZW50X2ltYWdlX3VybCgkY3AtPmdldF9pbWFnZV9pZCgpLCd0aHVtYm5haWwnKSk7CgkJCQkJCX0KCQkJCQkJJG1hdHl0aVskZ2suJ3wnLiRncmFtXSA9ICRwb29sOwoJCQkJCX0KCQkJCX0KCQkJfQoJCQkkZlsnY29uZmlnJ11bJGdrXSA9ICRnOwoJCX0KCQkkZlsncG9vbCddID0gJG1hdHl0aTsKCQkkb1snc2VpbW9zJ11bJHBhcl0gPSAkZjsKCX0KCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzApOwo=','base64').toString('utf8');
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP POOL 0814',code:php,scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_pool=Pool0814u" --max-time 200`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const path='screenshots/pool_0814.json';
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200){sha=(await g.json()).sha;}}catch(e){}
const body={message:'pool 0814',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
if(sha) body.sha=sha;
const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',r.status);
