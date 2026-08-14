process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
const REPO='raimis079-creator/petshop-bridge';
const out={marker:'LAUKAI 0814',ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX2xhdWthaSddID8/ICcnKSAhPT0gJ0xhdWswODE0JykgcmV0dXJuOwoJQHNldF90aW1lX2xpbWl0KDI0MCk7CglnbG9iYWwgJHdwZGI7Cgkkbz1hcnJheSgnbWFya2VyJz0+J0xBVUtVIERVT01FTllTJywndHMnPT5kYXRlKCdZLW0tZCBIOmk6cycpKTsKCgkkcmFzdGkgPSBnZXRfdGVybXMoYXJyYXkoJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnaGlkZV9lbXB0eSc9PmZhbHNlKSk7Cgkka2F0PWFycmF5KCk7Cglmb3JlYWNoICgkcmFzdGkgYXMgJHQpIHsgaWYgKHByZWdfbWF0Y2goJy9za2FufGtyYW10fGRlbGlrYXQvaXUnLCAkdC0+bmFtZSkpICRrYXRbJHQtPnRlcm1faWRdPSR0LT5uYW1lOyB9Cgkkb1sna2F0ZWdvcmlqb3MnXT0ka2F0OwoJaWYoISRrYXQpeyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQoKCSRxID0gbmV3IFdQX1F1ZXJ5KGFycmF5KCdwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnLCdwb3N0c19wZXJfcGFnZSc9Pi0xLCdmaWVsZHMnPT4naWRzJywKCQkndGF4X3F1ZXJ5Jz0+YXJyYXkoYXJyYXkoJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnZmllbGQnPT4ndGVybV9pZCcsJ3Rlcm1zJz0+YXJyYXlfa2V5cygka2F0KSwnaW5jbHVkZV9jaGlsZHJlbic9PnRydWUpKSkpOwoJJHNhdj1mdW5jdGlvbigkcGlkKXtmb3JlYWNoKGFycmF5KCdfY29zdF9wcmljZScsJ192Zl9jb3N0JywnX3piX2Nvc3QnKSBhcyAkayl7JHY9Z2V0X3Bvc3RfbWV0YSgkcGlkLCRrLHRydWUpOwoJCWlmKCR2IT09JycmJiR2IT09ZmFsc2UmJihmbG9hdCkkdj4wKSByZXR1cm4gKGZsb2F0KSR2O30gcmV0dXJuIG51bGw7fTsKCgkkYXRyPWFycmF5KCdwYV9neXZ1bm9fcnVzaXMnLCdwYV9iYWx0eW11X3NhbHRpbmlzJywncGFfYmVfZ3J1ZHUnLCdwYV9tb25vcHJvdGVpbicsJ3BhX3NwZWNpYWxpX21pdHliYScsJ3BhX2Fteml1cycsJ3BhX3ZlaXNsZXNfZHlkaXMnKTsKCSRzdGF0PWFycmF5KCk7ICR2aXNvPTA7ICRzdV9zYXY9MDsKCWZvcmVhY2ggKCRxLT5wb3N0cyBhcyAkcGlkKSB7CgkJJHA9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7IGlmKCEkcHx8JHAtPmdldF9wcmljZSgpPD0wKSBjb250aW51ZTsKCQkkdmlzbysrOwoJCSRzPSRzYXYoJHBpZCk7IGlmKCRzIT09bnVsbCkgJHN1X3NhdisrOwoJCSRtID0gJHMhPT1udWxsID8gcm91bmQoKCgkcC0+Z2V0X3ByaWNlKCkvMS4yMSktJHMpLygkcC0+Z2V0X3ByaWNlKCkvMS4yMSkqMTAwKSA6IG51bGw7CgkJJHJ1c3lzID0gd3BfZ2V0X3Bvc3RfdGVybXMoJHBpZCwncGFfZ3l2dW5vX3J1c2lzJyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpOwoJCSRydXNpcyA9ICRydXN5cyA/ICRydXN5c1swXSA6ICfigJQnOwoJCWZvcmVhY2ggKCRhdHIgYXMgJGEpIHsKCQkJJHQ9d3BfZ2V0X3Bvc3RfdGVybXMoJHBpZCwkYSxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpOwoJCQlmb3JlYWNoICgoYXJyYXkpJHQgYXMgJHYpIHsKCQkJCSRyYWt0YXM9JHJ1c2lzLicgfCAnLiRhLicgfCAnLiR2OwoJCQkJaWYoIWlzc2V0KCRzdGF0WyRyYWt0YXNdKSkgJHN0YXRbJHJha3Rhc109YXJyYXkoJ24nPT4wLCdzYXYnPT4wLCdtJz0+YXJyYXkoKSwnayc9PmFycmF5KCkpOwoJCQkJJHN0YXRbJHJha3Rhc11bJ24nXSsrOwoJCQkJaWYoJHMhPT1udWxsKXskc3RhdFskcmFrdGFzXVsnc2F2J10rKzsgJHN0YXRbJHJha3Rhc11bJ20nXVtdPSRtO30KCQkJCSRzdGF0WyRyYWt0YXNdWydrJ11bXT0oZmxvYXQpJHAtPmdldF9wcmljZSgpOwoJCQl9CgkJfQoJfQoJJG9bJ3ByZWtpdSddPSR2aXNvOyAkb1snc3Vfc2F2aWthaW5hJ109JHN1X3NhdjsKCSRpc3Y9YXJyYXkoKTsKCWZvcmVhY2ggKCRzdGF0IGFzICRrPT4kdikgewoJCWlmICgkdlsnbiddPDQpIGNvbnRpbnVlOwoJCSRpc3ZbXT1hcnJheSgncmFrdGFzJz0+JGssJ24nPT4kdlsnbiddLCdzdV9zYXYnPT4kdlsnc2F2J10sCgkJCSdtYXJ6YV9taW4nPT4kdlsnbSddP21pbigkdlsnbSddKTpudWxsLCdtYXJ6YV92aWQnPT4kdlsnbSddP3JvdW5kKGFycmF5X3N1bSgkdlsnbSddKS9jb3VudCgkdlsnbSddKSk6bnVsbCwKCQkJJ2thaW5hX21pbic9PnJvdW5kKG1pbigkdlsnayddKSwyKSwna2FpbmFfbWF4Jz0+cm91bmQobWF4KCR2WydrJ10pLDIpKTsKCX0KCXVzb3J0KCRpc3YsZnVuY3Rpb24oJGEsJGIpe3JldHVybiAkYlsnbiddPD0+JGFbJ24nXTt9KTsKCSRvWydsYXVrYWknXT1hcnJheV9zbGljZSgkaXN2LDAsNDUpOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMCk7Cg==','base64').toString('utf8');
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP LAUKAI 0814',code:php,scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_laukai=Lauk0814" --max-time 200`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const path='screenshots/laukai_0814.json';
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200){sha=(await g.json()).sha;}}catch(e){}
const body={message:'laukai 0814',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
if(sha) body.sha=sha;
const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',r.status);
