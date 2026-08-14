process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
const REPO='raimis079-creator/petshop-bridge';
const out={marker:'SNIP GET 0814',ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX3NuaXBfZ2V0J10gPz8gJycpICE9PSAnU25HMDgxNHQnKSByZXR1cm47CglAc2V0X3RpbWVfbGltaXQoMTgwKTsKCWdsb2JhbCAkd3BkYjsKCSRvID0gYXJyYXkoJ21hcmtlcic9PidTTklQIEdFVCB2MScsICd0cyc9PmRhdGUoJ1ktbS1kIEg6aTpzJykpOwoJJGlkcyA9IGFycmF5KDUyNCwgNTQ3LCA1NTAsIDU2MCwgNTYxLCA1NjgsIDU3MCwgNTczKTsKCSR0ID0gJHdwZGItPnByZWZpeCAuICdzbmlwcGV0cyc7Cglmb3JlYWNoICgkaWRzIGFzICRpZCkgewoJCSRyID0gJHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSxwcmlvcml0eSxzY29wZSxMRU5HVEgoY29kZSkgbGVuLGNvZGUgRlJPTSB7JHR9IFdIRVJFIGlkPSVkIiwgJGlkKSwgQVJSQVlfQSk7CgkJaWYgKCEkcikgeyAkb1snc25pcCddWyRpZF0gPSAnbmVyYXN0YXMnOyBjb250aW51ZTsgfQoJCSRvWydzbmlwJ11bJGlkXSA9IGFycmF5KCduYW1lJz0+JHJbJ25hbWUnXSwgJ2FjdGl2ZSc9PiRyWydhY3RpdmUnXSwgJ3ByaW8nPT4kclsncHJpb3JpdHknXSwgJ3Njb3BlJz0+JHJbJ3Njb3BlJ10sICdsZW4nPT4kclsnbGVuJ10sICdiNjQnPT5iYXNlNjRfZW5jb2RlKCRyWydjb2RlJ10pKTsKCX0KCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzApOwo=','base64').toString('utf8');
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP SNIP GET 0814',code:php,scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_snip_get=SnG0814t" --max-time 200`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const path='screenshots/snip_get_0814.json';
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200){sha=(await g.json()).sha;}}catch(e){}
const body={message:'snip get 0814',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
if(sha) body.sha=sha;
const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',r.status);
