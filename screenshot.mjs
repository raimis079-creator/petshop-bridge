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
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP RINK S512 0813',code:Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfczUxMiddID8/ICcnKSE9PSdTNUxsMTInKSByZXR1cm47CglAc2V0X3RpbWVfbGltaXQoMTgwKTsKCWdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7Cgkkbz1hcnJheSgnbWFya2VyJz0+J1M1MTInKTsKCSRzbj0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlLGNvZGUgRlJPTSB7JHBmfXNuaXBwZXRzIFdIRVJFIGlkPTUxMiIsQVJSQVlfQSk7CglpZigkc24pewoJCSRvWyduYW1lJ109JHNuWyduYW1lJ107ICRvWydhY3RpdmUnXT0kc25bJ2FjdGl2ZSddOyAkb1snbGVuJ109c3RybGVuKCRzblsnY29kZSddKTsKCQkkYz0kc25bJ2NvZGUnXTsKCQlwcmVnX21hdGNoX2FsbCgiL2FkZF8oZmlsdGVyfGFjdGlvbilcKFxzKicoW14nXSspJ1xzKixccyooW14sXCldKykoPzosXHMqKFxkKykpPy8iLCRjLCRtLFBSRUdfU0VUX09SREVSKTsKCQkkb1snaG9va3MnXT1hcnJheSgpOwoJCWZvcmVhY2goJG0gYXMgJHgpeyAkb1snaG9va3MnXVtdPWFycmF5KCd0aXBhcyc9PiR4WzFdLCdob29rJz0+JHhbMl0sJ2NiJz0+dHJpbSgkeFszXSksJ3ByaW8nPT4keFs0XT8/JzEwJyk7IH0KCQlwcmVnX21hdGNoX2FsbCgiL2Z1bmN0aW9uIChbYS16MC05X10rKVxzKlwoL2kiLCRjLCRmbSk7CgkJJG9bJ2Z1bmtjaWpvcyddPWFycmF5X3NsaWNlKCRmbVsxXSwwLDIwKTsKCQkkb1snaGVhZCddPXN1YnN0cigkYywwLDEyMDApOwoJfQoJLyoga2FzIHJlYWxpYWkga2FibyBhbnQgdGhlX2NvbnRlbnQgKi8KCWdsb2JhbCAkd3BfZmlsdGVyOwoJJGw9YXJyYXkoKTsKCWlmKGlzc2V0KCR3cF9maWx0ZXJbJ3RoZV9jb250ZW50J10pKSBmb3JlYWNoKCR3cF9maWx0ZXJbJ3RoZV9jb250ZW50J10tPmNhbGxiYWNrcyBhcyAkcHI9PiRjYnMpIGZvcmVhY2goJGNicyBhcyAkY2IpewoJCSRuPWlzX2FycmF5KCRjYlsnZnVuY3Rpb24nXSk/KGlzX29iamVjdCgkY2JbJ2Z1bmN0aW9uJ11bMF0pP2dldF9jbGFzcygkY2JbJ2Z1bmN0aW9uJ11bMF0pOiRjYlsnZnVuY3Rpb24nXVswXSkuJzo6Jy4kY2JbJ2Z1bmN0aW9uJ11bMV06KGlzX3N0cmluZygkY2JbJ2Z1bmN0aW9uJ10pPyRjYlsnZnVuY3Rpb24nXTonY2xvc3VyZScpOwoJCSRsW109JHByLic6Jy4kbjsKCX0KCSRvWyd0aGVfY29udGVudCddPSRsOwoJaWYoaXNzZXQoJHdwX2ZpbHRlclsnd29vY29tbWVyY2VfcHJvZHVjdF9kZXNjcmlwdGlvbl9oZWFkaW5nJ10pKSAkb1sndHVyaV9kZXNjX2hlYWRpbmcnXT0xOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMCk7Cg==','base64').toString('utf8'),scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_s512=S5Ll12" --max-time 120`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,600);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const r=await fetch('https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/s512.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify({message:'s512 rez',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')})});
console.log('put',r.status);
