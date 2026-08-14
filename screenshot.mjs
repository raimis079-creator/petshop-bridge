process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
const REPO='raimis079-creator/petshop-bridge';
const out={marker:'KAT 0814',ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php=Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmICgoJF9HRVRbJ3BzX2thdCddID8/ICcnKSAhPT0gJ0thdDA4MTRtJykgcmV0dXJuOwoJQHNldF90aW1lX2xpbWl0KDE4MCk7Cgkkbz1hcnJheSgnbWFya2VyJz0+J0tBVEVHT1JJSlUgRFlEWklBSScsJ3RzJz0+ZGF0ZSgnWS1tLWQgSDppOnMnKSk7CgkkdCA9IGdldF90ZXJtcyhhcnJheSgndGF4b25vbXknPT4ncHJvZHVjdF9jYXQnLCdoaWRlX2VtcHR5Jz0+ZmFsc2UpKTsKCSRzYXI9YXJyYXkoKTsKCWZvcmVhY2ggKCR0IGFzICR4KSB7CgkJaWYgKCFwcmVnX21hdGNoKCcva29uc2Vydnxza2FuZXN0fGtyYW10L2l1JywgJHgtPm5hbWUpKSBjb250aW51ZTsKCQkkcSA9IG5ldyBXUF9RdWVyeShhcnJheSgncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywncG9zdHNfcGVyX3BhZ2UnPT4tMSwnZmllbGRzJz0+J2lkcycsCgkJCSd0YXhfcXVlcnknPT5hcnJheShhcnJheSgndGF4b25vbXknPT4ncHJvZHVjdF9jYXQnLCdmaWVsZCc9Pid0ZXJtX2lkJywndGVybXMnPT4keC0+dGVybV9pZCwnaW5jbHVkZV9jaGlsZHJlbic9PnRydWUpKSkpOwoJCSRzYW5kPWFycmF5KCk7ICRrYWlub3M9YXJyYXkoKTsgJHNhdnM9YXJyYXkoKTsKCQlmb3JlYWNoICgkcS0+cG9zdHMgYXMgJHBpZCkgewoJCQkkcz1zdHJ0b2xvd2VyKChzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpKTsgaWYoJHM9PT0nJykkcz0nYXYnOwoJCQkkc2FuZFskc109KCRzYW5kWyRzXT8/MCkrMTsKCQkJJHA9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7IGlmKCRwICYmICRwLT5nZXRfcHJpY2UoKT4wKSAka2Fpbm9zW109KGZsb2F0KSRwLT5nZXRfcHJpY2UoKTsKCQkJZm9yZWFjaCAoYXJyYXkoJ19jb3N0X3ByaWNlJywnX3ZmX2Nvc3QnLCdfemJfY29zdCcpIGFzICRrKXskdj1nZXRfcG9zdF9tZXRhKCRwaWQsJGssdHJ1ZSk7CgkJCQlpZigkdiE9PScnJiYkdiE9PWZhbHNlJiYoZmxvYXQpJHY+MCl7JHNhdnNbXT0oZmxvYXQpJHY7YnJlYWs7fX0KCQl9CgkJaWYgKCFjb3VudCgkcS0+cG9zdHMpKSBjb250aW51ZTsKCQlzb3J0KCRrYWlub3MpOwoJCSRzYXJbXT1hcnJheSgnaWQnPT4keC0+dGVybV9pZCwncGF2Jz0+JHgtPm5hbWUsJ3RldmFzJz0+JHgtPnBhcmVudCwncHJla2l1Jz0+Y291bnQoJHEtPnBvc3RzKSwKCQkJJ3NhbmRlbGlhaSc9PiRzYW5kLCdrYWluYV9udW8nPT4ka2Fpbm9zP3JvdW5kKG1pbigka2Fpbm9zKSwyKTpudWxsLCdrYWluYV9pa2knPT4ka2Fpbm9zP3JvdW5kKG1heCgka2Fpbm9zKSwyKTpudWxsLAoJCQknc3Vfc2F2aWthaW5hJz0+Y291bnQoJHNhdnMpLCdzYXZfbnVvJz0+JHNhdnM/cm91bmQobWluKCRzYXZzKSwzKTpudWxsLCdzYXZfaWtpJz0+JHNhdnM/cm91bmQobWF4KCRzYXZzKSwzKTpudWxsKTsKCX0KCXVzb3J0KCRzYXIsZnVuY3Rpb24oJGEsJGIpe3JldHVybiAkYlsncHJla2l1J108PT4kYVsncHJla2l1J107fSk7Cgkkb1sna2F0ZWdvcmlqb3MnXT0kc2FyOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMCk7Cg==','base64').toString('utf8');
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP KAT 0814',code:php,scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_kat=Kat0814m" --max-time 200`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const path='screenshots/kat_0814.json';
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200){sha=(await g.json()).sha;}}catch(e){}
const body={message:'kat 0814',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
if(sha) body.sha=sha;
const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',r.status);
