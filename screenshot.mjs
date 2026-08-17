process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3N2J10pPyRfR0VUWydwc19zdiddOicnKSE9PSdLQVQ0JykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidLQVQ0JywndHMnPT5kYXRlKCdZLW0tZCBIOmk6cycpKTsKICRzPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCcpOyAkTD1leHBsb2RlKCJcbiIsJHMpOwogJGZpbmQ9ZnVuY3Rpb24oJHJlKSB1c2UoJEwpeyBmb3JlYWNoKCRMIGFzICRpPT4kbG4peyBpZihwcmVnX21hdGNoKCRyZSwkbG4pKSByZXR1cm4gJGkrMTsgfSByZXR1cm4gMDsgfTsKICRuMT0kZmluZCgnL2Z1bmN0aW9uXHMrdXJsXHMqXCgvJyk7CiAkbjI9JGZpbmQoJy9mdW5jdGlvblxzK2ZpbHRyYWlccypcKC8nKTsKICRibGs9ZnVuY3Rpb24oJGEsJGxlbikgdXNlKCRMKXsgJHI9YXJyYXkoKTsgaWYoISRhKSByZXR1cm4gJHI7IGZvcigkaT0kYS0xOyRpPG1pbigkYS0xKyRsZW4sY291bnQoJEwpKTskaSsrKSAkcltdPSgkaSsxKS4nOiAnLnJ0cmltKCRMWyRpXSk7IHJldHVybiAkcjsgfTsKICRvWyd1cmxfZWlsJ109JG4xOyAkb1sndXJsJ109JGJsaygkbjEsMzApOwogJG9bJ2ZpbHRyYWlfZWlsJ109JG4yOyAkb1snZmlsdHJhaSddPSRibGsoJG4yLDQyKTsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'KAT4'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s=await snip('TEMP KAT4',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_sv=KAT4')).text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('kat4.json', Buffer.from(JSON.stringify(out)), 'kat4');
console.log('ok');
