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
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP RINK MNMTXT 0813',code:Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfbW5tdHh0J10gPz8gJycpIT09J010MzNMbDcnKSByZXR1cm47CglAc2V0X3RpbWVfbGltaXQoMTgwKTsKCSRvPWFycmF5KCdtYXJrZXInPT4nTU5NIFRFS1NUQUknKTsKCSRkaXI9V1BfUExVR0lOX0RJUi4nL3dvb2NvbW1lcmNlLW1peC1hbmQtbWF0Y2gtcHJvZHVjdHMnOwoJJG9bJ2Rpcl95cmEnXT1pc19kaXIoJGRpcik7CgkkcmFzdGE9YXJyYXkoKTsKCSRpZXNrb209YXJyYXkoJ1lvdSBoYXZlIHNlbGVjdGVkJywnQ2xlYXIgc2VsZWN0aW9uJywnUGxlYXNlIHNlbGVjdCcsJ2l0ZW0nLCdQcm9kdWN0JywnUXVhbnRpdHknLCdpdGVtcyB0byBjb250aW51ZScsJ0FkZCB0byBjYXJ0IHRvIGNvbnRpbnVlJyk7Cgkkcml0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZGlyKSk7Cgkkbj0wOwoJZm9yZWFjaCgkcml0IGFzICRmKXsKCQlpZigkbj40MDApIGJyZWFrOwoJCWlmKCEkZi0+aXNGaWxlKCkpIGNvbnRpbnVlOwoJCSRleHQ9c3RydG9sb3dlcigkZi0+Z2V0RXh0ZW5zaW9uKCkpOwoJCWlmKCFpbl9hcnJheSgkZXh0LGFycmF5KCdwaHAnLCdqcycpKSkgY29udGludWU7CgkJJG4rKzsKCQkkYz1AZmlsZV9nZXRfY29udGVudHMoJGYtPmdldFBhdGhuYW1lKCkpOwoJCWlmKCEkYykgY29udGludWU7CgkJZm9yZWFjaCgkaWVza29tIGFzICR6KXsKCQkJaWYoc3RycG9zKCRjLCR6KT09PWZhbHNlKSBjb250aW51ZTsKCQkJaWYocHJlZ19tYXRjaF9hbGwoIi9bJ1wiXShbXidcIl0qIi5wcmVnX3F1b3RlKCR6LCcvJykuIlteJ1wiXSopWydcIl0vIiwkYywkbSkpewoJCQkJZm9yZWFjaCgkbVsxXSBhcyAkeCl7CgkJCQkJJHg9dHJpbSgkeCk7CgkJCQkJaWYoc3RybGVuKCR4KT4zICYmIHN0cmxlbigkeCk8MTYwKSAkcmFzdGFbJHhdPWJhc2VuYW1lKCRmLT5nZXRQYXRobmFtZSgpKTsKCQkJCX0KCQkJfQoJCX0KCX0KCSRvWydlaWx1dGVzJ109JHJhc3RhOwoJJG9bJ2ZhaWx1J109JG47CgkvKiB0ZXh0IGRvbWFpbiAqLwoJJHBsdWc9QGZpbGVfZ2V0X2NvbnRlbnRzKCRkaXIuJy93b29jb21tZXJjZS1taXgtYW5kLW1hdGNoLXByb2R1Y3RzLnBocCcpOwoJaWYoJHBsdWcgJiYgcHJlZ19tYXRjaCgnL1RleHQgRG9tYWluOlxzKihcUyspLycsJHBsdWcsJG0pKSAkb1sndGV4dF9kb21haW4nXT0kbVsxXTsKCS8qIHNhYmxvbmFpICovCgkkb1snc2FibG9uYWknXT1hcnJheSgpOwoJZm9yZWFjaChnbG9iKCRkaXIuJy90ZW1wbGF0ZXMvKiovKi5waHAnKSBhcyAkdCl7ICRvWydzYWJsb25haSddW109c3RyX3JlcGxhY2UoJGRpci4nL3RlbXBsYXRlcy8nLCcnLCR0KTsgfQoJZm9yZWFjaChnbG9iKCRkaXIuJy90ZW1wbGF0ZXMvKi5waHAnKSBhcyAkdCl7ICRvWydzYWJsb25haSddW109YmFzZW5hbWUoJHQpOyB9CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMwKTsK','base64').toString('utf8'),scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_mnmtxt=Mt33Ll7" --max-time 120`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,600);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const r=await fetch('https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/mnmtxt.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify({message:'mnmtxt rez',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')})});
console.log('put',r.status);
