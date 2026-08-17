process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3N2J10pPyRfR0VUWydwc19zdiddOicnKSE9PSdLQVQzJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDMwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0tBVDMnLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aTpzJykpOwogJHM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJyk7CiAkTD1leHBsb2RlKCJcbiIsJHMpOwogJGJsaz1mdW5jdGlvbigkYSwkYikgdXNlKCRMKXsgJHI9YXJyYXkoKTsgZm9yKCRpPSRhLTE7JGk8bWluKCRiLGNvdW50KCRMKSk7JGkrKyl7ICRyW109KCRpKzEpLic6ICcucnRyaW0oJExbJGldKTsgfSByZXR1cm4gJHI7IH07CiAkb1snZm9ybWFfNDgwMF80ODYwJ109JGJsayg0ODAwLDQ4NjIpOwogJG9bJ2ZpbHRydV9tYXN5dmFzXzQ2OTBfNDcyMCddPSRibGsoNDY5MCw0NzIyKTsKIC8qIEpTLCBrdXJpcyBrdXJpYSBVUkwgLyBzdWJtaXQgKi8KICRoPWFycmF5KCk7CiBmb3JlYWNoKCRMIGFzICRpPT4kbG4pewogICBpZiAocHJlZ19tYXRjaCgnL3N1Ym1pdFwofFVSTFNlYXJjaFBhcmFtc3xsb2NhdGlvblwuaHJlZnxsb2NhdGlvblwuc2VhcmNofFwudmFsdWVccyo9XHMqLnswLDR9O3xkZWxldGVccytwYXJ8cGFyYW1zXC4oc2V0fGRlbGV0ZSl8Zm9ybVwucXxuYW1lPS5xLi9pJywkbG4pKXsKICAgICAkdD10cmltKCRsbik7IGlmKCR0IT09JycmJnN0cmxlbigkdCk8MjQwKSAkaFtdPWFycmF5KCRpKzEsJHQpOwogICB9CiB9CiAkb1snanNfdXJsX24nXT1jb3VudCgkaCk7ICRvWydqc191cmwnXT1hcnJheV9zbGljZSgkaCwwLDQwKTsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'KAT3'};
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
  const s=await snip('TEMP KAT3',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_sv=KAT3')).text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('kat3.json', Buffer.from(JSON.stringify(out)), 'kat3');
console.log('ok');
