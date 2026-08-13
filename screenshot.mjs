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
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP RINK NAV4 0813',code:Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfbmF2NCddID8/ICcnKSE9PSdOdjQ0UnI3JykgcmV0dXJuOwoJQHNldF90aW1lX2xpbWl0KDE4MCk7Cgkkbz1hcnJheSgnbWFya2VyJz0+J05BVjQnKTsKCSRmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCc7CgkkYz1AZmlsZV9nZXRfY29udGVudHMoJGYpOwoJJG9bJ2R5ZGlzJ109c3RybGVuKCRjKTsKCSRvWydtZDUnXT1tZDUoJGMpOwoJLyoga3VyIGp1b3N0YSAqLwoJJHZpZXRvcz1hcnJheSgpOwoJZm9yZWFjaChhcnJheSgnVcW+c2FreW1haScsJ1V6c2FreW1haScsJ1RpZWtpbWFzJywncHMtZGVzaycsJ3BzLWFrY2lqb3MnLCdwcy1nYXZpbWFzJywncHMtYXYtdGlla2ltYXMnLCdQRVRTSE9QJykgYXMgJHcpewoJCSRwPTA7ICRuPTA7CgkJd2hpbGUoKCRwPXN0cnBvcygkYywkdywkcCkpIT09ZmFsc2UgJiYgJG48Nil7ICR2aWV0b3NbJHddW109JHA7ICRwKz1zdHJsZW4oJHcpOyAkbisrOyB9Cgl9Cgkkb1sndmlldG9zJ109JHZpZXRvczsKCS8qIGlzdHJhdWtpYW0gbmF2IGZ1bmtjaWphICovCgkkcD1zdHJwb3MoJGMsJ2Z1bmN0aW9uIG5hdmlnYWNpamEnKTsKCSRvWyduYXZfcG9zJ109JHA7CglpZigkcCE9PWZhbHNlKXsgJG9bJ25hdiddPWJhc2U2NF9lbmNvZGUoc3Vic3RyKCRjLCRwLTIwMCw0NTAwKSk7IH0KCS8qIGFyIHlyYSBmaWx0cmFzL2hvb2sganVvc3RhaSAqLwoJJG9bJ2hvb2thaSddPWFycmF5KCk7Cglmb3JlYWNoKGFycmF5KCdwZXRzaG9wX25hdicsJ3BzX25hdl9pdGVtcycsJ3BldHNob3BfbmF2aWdhY2lqYScsJ2FwcGx5X2ZpbHRlcnMnKSBhcyAkdyl7CgkJJG9bJ2hvb2thaSddWyR3XT1zdWJzdHJfY291bnQoJGMsJHcpOwoJfQoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMCk7Cg==','base64').toString('utf8'),scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_nav4=Nv44Rr7" --max-time 120`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,600);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const r=await fetch('https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/nav4_0813.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify({message:'nav4 rez',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')})});
console.log('put',r.status);
