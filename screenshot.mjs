process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
const REPO='raimis079-creator/petshop-bridge';
const out={marker:'RINK RECON5 0814',ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX3JpbmtfcmVjb241J10gPz8gJycpICE9PSAnUmNOMDgxNHYnKSByZXR1cm47CglAc2V0X3RpbWVfbGltaXQoMjQwKTsKCWdsb2JhbCAkd3BkYjsKCSRvID0gYXJyYXkoJ21hcmtlcic9PidSSU5LIFJFQ09OIHY1JywgJ3RzJz0+ZGF0ZSgnWS1tLWQgSDppOnMnKSk7CgoJJGlkcyA9ICR3cGRiLT5nZXRfY29sKCIKCQlTRUxFQ1QgcC5JRCBGUk9NIHskd3BkYi0+cG9zdHN9IHAKCQlKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHBtIE9OIHBtLnBvc3RfaWQ9cC5JRCBBTkQgcG0ubWV0YV9rZXk9J19wZXRzaG9wX2Nob2ljZV9wYXJlbnQnCgkJV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIE9SREVSIEJZIHAuSUQKCSIpOwoJJHRibCA9ICR3cGRiLT5wcmVmaXggLiAnd2NfbW5tX2NoaWxkX2l0ZW1zJzsKCSRlaWwgPSBhcnJheSgpOwoJZm9yZWFjaCAoJGlkcyBhcyAkcGlkKSB7CgkJJHBpZCA9IChpbnQpJHBpZDsKCQkkdGV2ID0gZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfcGV0c2hvcF9jaG9pY2VfcGFyZW50Jyx0cnVlKTsKCQkkZWlsW10gPSBhcnJheSgKCQkJJ2lkJz0+JHBpZCwKCQkJJ3Bhdic9PmdldF90aGVfdGl0bGUoJHBpZCksCgkJCSdidWtsZSc9PmdldF9wb3N0X3N0YXR1cygkcGlkKSwKCQkJJ3RldmFzJz0+JHRldiwKCQkJJ2dydXBlJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcGV0c2hvcF9jaG9pY2VfZ3JvdXAnLHRydWUpLAoJCQknZHlkaXMnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19wZXRzaG9wX2Nob2ljZV9zaXplJyx0cnVlKSwKCQkJJ2dyYW1haSc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3BldHNob3BfY2hvaWNlX2dyYW0nLHRydWUpLAoJCQknbWluJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfbW5tX21pbl9jb250YWluZXJfc2l6ZScsdHJ1ZSksCgkJCSdtYXgnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19tbm1fbWF4X2NvbnRhaW5lcl9zaXplJyx0cnVlKSwKCQkJJ2thaW5hJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHJpY2UnLHRydWUpLAoJCQkndmFpa3UnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHRibH0gV0hFUkUgY29udGFpbmVyX2lkPSVkIiwkcGlkKSksCgkJCSdjdW11bGF0aXZlJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfbW5tX3dlaWdodF9jdW11bGF0aXZlJyx0cnVlKSwKCQkJJ3N2b3Jpcyc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3dlaWdodCcsdHJ1ZSksCgkJCSdrYXRhbG9nb19tYXRvbXVtYXMnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19wc19wdWJsaWt1b3RhJyx0cnVlKSwKCQkJJ3Zpcyc9PndwX2dldF9vYmplY3RfdGVybXMoJHBpZCwncHJvZHVjdF92aXNpYmlsaXR5JyxhcnJheSgnZmllbGRzJz0+J3NsdWdzJykpLAoJCSk7Cgl9Cgkkb1snc3VyZW5rYW1pJ10gPSAkZWlsOwoKCS8qIHRldmluZXMgcHJla2VzIOKAlCBhciBqb3MgYXBza3JpdGFpIHlyYSAqLwoJJHRldmFpID0gYXJyYXkoKTsKCWZvcmVhY2ggKCRlaWwgYXMgJGUpIHsgJHRldmFpWyhzdHJpbmcpJGVbJ3RldmFzJ11dID0gdHJ1ZTsgfQoJJG9bJ3RldmFpJ10gPSBhcnJheSgpOwoJZm9yZWFjaCAoYXJyYXlfa2V5cygkdGV2YWkpIGFzICR0KSB7CgkJaWYgKCFpc19udW1lcmljKCR0KSkgeyAkb1sndGV2YWknXVskdF0gPSAnbmUgSUQ6ICcgLiAkdDsgY29udGludWU7IH0KCQkkcCA9IGdldF9wb3N0KChpbnQpJHQpOwoJCSRvWyd0ZXZhaSddWyR0XSA9ICRwID8gYXJyYXkoJ3Bhdic9PiRwLT5wb3N0X3RpdGxlLCdidWtsZSc9PiRwLT5wb3N0X3N0YXR1cywndGlwYXMnPT4kcC0+cG9zdF90eXBlKSA6ICdQT1NUTyBORVJBJzsKCX0KCgkvKiBNbk0gY3VtdWxhdGl2ZSByZWlrc21lcyB2aXNpZW1zICovCgkkb1snY3VtdWxhdGl2ZV9wYXNpc2tpcnN0eW1hcyddID0gJHdwZGItPmdldF9yZXN1bHRzKCIKCQlTRUxFQ1QgbWV0YV92YWx1ZSwgQ09VTlQoKikgYyBGUk9NIHskd3BkYi0+cG9zdG1ldGF9CgkJV0hFUkUgbWV0YV9rZXk9J19tbm1fd2VpZ2h0X2N1bXVsYXRpdmUnIEdST1VQIEJZIG1ldGFfdmFsdWUiLCBBUlJBWV9BKTsKCgkvKiBhciBsaWtvIGFrdHl2aXUgVEVNUCBzbmlwcGV0dSAqLwoJJG9bJ2FrdHl2dXNfdGVtcCddID0gJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0xIEFORCBuYW1lIExJS0UgJ1RFTVAlJyIsIEFSUkFZX0EpOwoKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7CgllY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsKCWV4aXQ7Cn0sIDEzMCk7Cg==','base64').toString('utf8');
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP RINK RECON 0814 v5',code:php,scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_rink_recon5=RcN0814v" --max-time 200`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const path='screenshots/rink_recon5_0814.json';
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200){sha=(await g.json()).sha;}}catch(e){}
const body={message:'rink recon5 0814',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
if(sha) body.sha=sha;
const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',r.status);
