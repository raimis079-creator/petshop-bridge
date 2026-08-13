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
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP RINK DIAGT 0813',code:Buffer.from('YWRkX2FjdGlvbignd3AnLCBmdW5jdGlvbigpewoJaWYoKCRfR0VUWydwc19kaWFndCddID8/ICcnKSE9PSdEdDY2R2c4JykgcmV0dXJuOwoJQHNldF90aW1lX2xpbWl0KDEyMCk7CglnbG9iYWwgJHdwX2ZpbHRlciwkcHJvZHVjdCwkcG9zdDsKCSRvPWFycmF5KCdtYXJrZXInPT4nVEFCVSBESUFHJyk7CgkkcGlkPShpbnQpKCRfR0VUWydwaWQnXSA/PyAzNDg5OSk7CgkkcHJvZHVjdD13Y19nZXRfcHJvZHVjdCgkcGlkKTsgJHBvc3Q9Z2V0X3Bvc3QoJHBpZCk7Cgkkb1sncGlkJ109JHBpZDsKCSRvWydrbGFzZV95cmEnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfUmlua2luaWFpJyk7Cgkkb1sndmVyc2lqYSddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9SaW5raW5pYWknKT9QZXRzaG9wX1JpbmtpbmlhaTo6VkVSU0lKQTonLSc7Cgkkb1snbWV0YV9raWVraWFpJ109Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcGV0c2hvcF9jb21wb25lbnRfcXVhbnRpdGllcycsdHJ1ZSk7CgkkbD1hcnJheSgpOwoJaWYoaXNzZXQoJHdwX2ZpbHRlclsnd29vY29tbWVyY2VfcHJvZHVjdF90YWJzJ10pKSBmb3JlYWNoKCR3cF9maWx0ZXJbJ3dvb2NvbW1lcmNlX3Byb2R1Y3RfdGFicyddLT5jYWxsYmFja3MgYXMgJHByPT4kY2JzKSBmb3JlYWNoKCRjYnMgYXMgJGNiKXsKCQkkbj1pc19hcnJheSgkY2JbJ2Z1bmN0aW9uJ10pPyhpc19vYmplY3QoJGNiWydmdW5jdGlvbiddWzBdKT9nZXRfY2xhc3MoJGNiWydmdW5jdGlvbiddWzBdKTokY2JbJ2Z1bmN0aW9uJ11bMF0pLic6OicuJGNiWydmdW5jdGlvbiddWzFdOihpc19zdHJpbmcoJGNiWydmdW5jdGlvbiddKT8kY2JbJ2Z1bmN0aW9uJ106J2Nsb3N1cmUnKTsKCQkkbFtdPSRwci4nOicuJG47Cgl9Cgkkb1sndGFidV9maWx0cmFpJ109JGw7CgkkdGFicz1hcHBseV9maWx0ZXJzKCd3b29jb21tZXJjZV9wcm9kdWN0X3RhYnMnLGFycmF5KCkpOwoJJG9bJ2dhbHV0aW5pYWlfdGFiYWknXT1hcnJheSgpOwoJZm9yZWFjaCgkdGFicyBhcyAkaz0+JHQpewoJCSRjYj0kdFsnY2FsbGJhY2snXSA/PyBudWxsOwoJCSRuPWlzX2FycmF5KCRjYik/KGlzX29iamVjdCgkY2JbMF0pP2dldF9jbGFzcygkY2JbMF0pOiRjYlswXSkuJzo6Jy4kY2JbMV06KGlzX3N0cmluZygkY2IpPyRjYjonY2xvc3VyZScpOwoJCSRvWydnYWx1dGluaWFpX3RhYmFpJ11bJGtdPWFycmF5KCd0aXRsZSc9PiR0Wyd0aXRsZSddID8/ICcnLCdwcmlvJz0+JHRbJ3ByaW9yaXR5J10gPz8gJycsJ2NiJz0+JG4pOwoJfQoJJG9bJ2NvbnRlbnRfaWxnaXMnXT1zdHJsZW4oJHBvc3QtPnBvc3RfY29udGVudCk7Cgkkb1snY29udGVudF9oZWFkJ109bWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCRwb3N0LT5wb3N0X2NvbnRlbnQpLDAsMjAwKTsKCSRvWyd0dXJpX3Nla2NpanVfem9keml1J109YXJyYXkoKTsKCWZvcmVhY2goYXJyYXkoJ1N1ZMSXdGlzJywnQW5hbGl0aW7El3MnLCfFoMSXcmltbycsJ1BsYcSNaWF1IGFwaWUnKSBhcyAkeil7CgkJaWYobWJfc3RyaXBvcygkcG9zdC0+cG9zdF9jb250ZW50LCR6KSE9PWZhbHNlKSAkb1sndHVyaV9zZWtjaWp1X3pvZHppdSddW109JHo7Cgl9CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgOTk5KTsK','base64').toString('utf8'),scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_diagt=Dt66Gg8&pid=34899" --max-time 120`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,600);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const r=await fetch('https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/diagt.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify({message:'diagt rez',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')})});
console.log('put',r.status);
