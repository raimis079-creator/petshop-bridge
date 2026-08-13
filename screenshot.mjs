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
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP RINK GET 0813',code:Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfZ2V0J10gPz8gJycpIT09J0d0NTVMbDInKSByZXR1cm47CgkkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXJpbmtpbmlhaS5waHAnOwoJJGM9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7CgllY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdtYXJrZXInPT4nR0VUJywnYnl0ZXMnPT5zdHJsZW4oJGMpLCdtZDUnPT5tZDUoJGMpLCdiNjQnPT5iYXNlNjRfZW5jb2RlKCRjKSkpOwoJZXhpdDsKfSwgMTMwKTsK','base64').toString('utf8'),scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_get=Gt55Ll2" --max-time 120`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,600);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const r=await fetch('https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/rink_get.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify({message:'rink get rez',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')})});
console.log('put',r.status);
