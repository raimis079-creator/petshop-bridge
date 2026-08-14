process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
const REPO='raimis079-creator/petshop-bridge';
const out={marker:'APSKAITA 0814',ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX2Fwc2snXSA/PyAnJykgIT09ICdBcHNrMDgxNG4nKSByZXR1cm47CglAc2V0X3RpbWVfbGltaXQoMjQwKTsKCWdsb2JhbCAkd3BkYjsKCSRvPWFycmF5KCdtYXJrZXInPT4nQVBTS0FJVEEgdjEnLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aTpzJykpOwoKCS8qIDEuIEthcyB5cmEgbXUtcGx1Z2lucyBpciBhciB5cmEgcGFyZGF2aW11L3ByYWdtYSBtb2R1bGlhaSAqLwoJJG11PWFycmF5KCk7Cglmb3JlYWNoICgoYXJyYXkpZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpIGFzICRwKSB7ICRtdVtiYXNlbmFtZSgkcCldID0gZmlsZXNpemUoJHApOyB9Cgkkb1snbXVfcGFyZGF2aW1haSddID0gaXNzZXQoJG11WydwZXRzaG9wLXBhcmRhdmltYWkucGhwJ10pID8gJG11WydwZXRzaG9wLXBhcmRhdmltYWkucGhwJ10gOiAnbmVyYSc7Cgkkb1snbXVfcHJhZ21hJ10gPSBpc3NldCgkbXVbJ3BldHNob3AtcHJhZ21hLnBocCddKSA/ICRtdVsncGV0c2hvcC1wcmFnbWEucGhwJ10gOiAnbmVyYSc7CgoJLyogMi4gcGV0c2hvcC1wYXJkYXZpbWFpIOKAlCBrYSBqaXMgc2VrYSAqLwoJJGYgPSBXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXBhcmRhdmltYWkucGhwJzsKCWlmIChmaWxlX2V4aXN0cygkZikpIHsKCQkkc3JjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKCQkkb1sncGFyZGF2aW1haSddPWFycmF5KCdkeWRpcyc9PnN0cmxlbigkc3JjKSk7CgkJJGVpbD1hcnJheSgpOwoJCWZvcmVhY2ggKGV4cGxvZGUoIlxuIiwkc3JjKSBhcyAkaT0+JGwpIHsKCQkJaWYgKHByZWdfbWF0Y2goJy9eXHMqKFwqfFwvXCpcKnxmdW5jdGlvbiB8cHVibGljIHN0YXRpYyBmdW5jdGlvbiB8YWRkX2FjdGlvbnxhZGRfZmlsdGVyfENSRUFURSBUQUJMRXxfcHNfKS8nLCRsKSkgewoJCQkJJHQ9dHJpbShtYl9zdWJzdHIoJGwsMCwxMzApKTsgaWYoJHQhPT0nKicmJiR0IT09JycpICRlaWxbXT0oJGkrMSkuJzogJy4kdDsKCQkJfQoJCX0KCQkkb1sncGFyZGF2aW1haSddWydzdHJ1a3R1cmEnXT1hcnJheV9zbGljZSgkZWlsLDAsNTUpOwoJfQoKCS8qIDMuIFByYWdtYSDigJQgc25pcHBldHVvc2U/ICovCgkkc249JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUsTEVOR1RIKGNvZGUpIGxlbiBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzCgkJV0hFUkUgbmFtZSBMSUtFICclcmFnbWElJyBPUiBjb2RlIExJS0UgJyVQcmFnbWElJyBMSU1JVCA4IiwgQVJSQVlfQSk7Cgkkb1sncHJhZ21hX3NuaXBwZXRhaSddPSRzbjsKCgkvKiA0LiBNbk06IGthaXAgdmFpa2FpIHBhdGVua2EgaSB1enNha3ltYSDigJQgdGlrcmluYW0gcGx1Z2lubyBrb2RvIHJha3R1cyAqLwoJJG1ubT1XUF9QTFVHSU5fRElSLicvd29vY29tbWVyY2UtbWl4LWFuZC1tYXRjaC1wcm9kdWN0cyc7CgkkcmFrdGFpPWFycmF5KCk7CglpZiAoaXNfZGlyKCRtbm0pKSB7CgkJZm9yZWFjaCAoYXJyYXkoJ2luY2x1ZGVzL2NsYXNzLXdjLW1ubS1vcmRlci5waHAnLCdpbmNsdWRlcy9jbGFzcy13Yy1tbm0tY2FydC5waHAnKSBhcyAkcmVsKSB7CgkJCSRwPSRtbm0uJy8nLiRyZWw7CgkJCWlmICghZmlsZV9leGlzdHMoJHApKSBjb250aW51ZTsKCQkJJHNyYz1maWxlX2dldF9jb250ZW50cygkcCk7CgkJCXByZWdfbWF0Y2hfYWxsKCIvYWRkX21ldGFfZGF0YVwoXHMqJyhbXiddKyknfHVwZGF0ZV9tZXRhX2RhdGFcKFxzKicoW14nXSspJ3wnKF9tbm1bYS16X10qKScvIiwgJHNyYywgJG0pOwoJCQlmb3JlYWNoIChhcnJheV9tZXJnZSgkbVsxXSwkbVsyXSwkbVszXSkgYXMgJHgpIHsgaWYoJHghPT0nJykgJHJha3RhaVskeF09KCRyYWt0YWlbJHhdPz8wKSsxOyB9CgkJCSRvWydtbm1fZmFpbGFpJ11bJHJlbF09c3RybGVuKCRzcmMpOwoJCX0KCX0KCSRvWydtbm1fdXpzYWt5bW9fcmFrdGFpJ109JHJha3RhaTsKCgkvKiA1LiBBciB5cmEgbGVudGVsZSBwYXJkYXZpbXUgaXN0b3JpamFpICovCgkkbGVudD0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyR3cGRiLT5wcmVmaXh9cHNfJSciKTsKCSRvWydwc19sZW50ZWxlcyddPSRsZW50OwoKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzApOwo=','base64').toString('utf8');
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP APSKAITA 0814',code:php,scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_apsk=Apsk0814n" --max-time 200`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const path='screenshots/apsk_0814.json';
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200){sha=(await g.json()).sha;}}catch(e){}
const body={message:'apskaita 0814',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
if(sha) body.sha=sha;
const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',r.status);
