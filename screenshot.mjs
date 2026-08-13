process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
const out={marker:'GETKAT RUN'};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP GetKat v1',code:Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfZ2V0a2F0J10gPz8gJycpIT09J0drODhMbDQnKSByZXR1cm47CglAc2V0X3RpbWVfbGltaXQoMTgwKTsKCSRmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCc7CgkkYz1maWxlX2dldF9jb250ZW50cygkZik7CgkkZGFsaXM9KGludCkoJF9HRVRbJ2RhbGlzJ10gPz8gMCk7CgkkZ2FiYWxhcz05MDAwMDsKCSRvPWFycmF5KCdtYXJrZXInPT4nR0VUS0FUJywnc2l6ZSc9PnN0cmxlbigkYyksJ21kNSc9Pm1kNSgkYyksCgkJJ2RhbGl1Jz0+KGludCljZWlsKHN0cmxlbigkYykvJGdhYmFsYXMpLCdkYWxpcyc9PiRkYWxpcywKCQkndHVyaW55cyc9PmJhc2U2NF9lbmNvZGUoc3Vic3RyKCRjLCRkYWxpcyokZ2FiYWxhcywkZ2FiYWxhcykpKTsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCA5OSk7Cg==','base64').toString('utf8'),scope:'global',active:true,priority:5})});
out.snip=js(s1.text)?.id||null;
await new Promise(r=>setTimeout(r,3000));
let dalys=[],n=1;
for(let i=0;i<n;i++){
  const res=execSync(`curl -sk "${B}/?ps_getkat=Gk88Ll4&dalis=${i}" --max-time 90`,{encoding:'utf8',maxBuffer:30*1024*1024});
  const j=js(res);
  if(!j){ out.err='dalis '+i+' nepavyko'; break; }
  n=j.daliu; out.size=j.size; out.md5=j.md5; out.daliu=j.daliu;
  dalys.push(j.turinys);
}
out.dalys=dalys.length;
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
async function put(p,buf,m){const r=await fetch('https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/'+p,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify({message:m,content:buf.toString('base64')})});return r.status}
console.log('failas',await put('screenshots/katalogas_b64.txt',Buffer.from(dalys.join('')),'rinkrec result katalogas'));
console.log('info',await put('screenshots/getkat.json',Buffer.from(JSON.stringify(out,null,1)),'rinkrec result getkat'));
