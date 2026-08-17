process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2Y5MjQnXSk/JF9HRVRbJ3BzX2Y5MjQnXTonJykhPT0nRjkyNCcpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCg2MDApOwogJG89YXJyYXkoJ3YnPT4nRjkyNCcpOwogJHA9QUJTUEFUSC4nd3AtY29udGVudC90aGVtZXMvZmxhdHNvbWUtY2hpbGQvZnVuY3Rpb25zLnBocCc7CiAkbD1maWxlKCRwKTsKICRvWydlaWx1Y2l1J109Y291bnQoJGwpOwogLyogZ2FiYWxhaSBhcGllIHByaXN0YXR5bW8gcmlib2ppbWEgKi8KIGZvcmVhY2goYXJyYXkoJ2EnPT5hcnJheSg2MCwxNDApLCdiJz0+YXJyYXkoMTA5MCwxMjAwKSkgYXMgJGs9PiRyKXsKICAgJG9bJ2dhYl8nLiRrXT1pbXBsb2RlKCcnLCBhcnJheV9zbGljZSgkbCwkclswXS0xLCRyWzFdLSRyWzBdKzEpKTsKIH0KIC8qIGt1ciBkYXIgbGllc2lhbWkgc2hpcHBpbmcgbWV0b2RhaSAqLwogJGg9YXJyYXkoKTsKIGZvcmVhY2goJGwgYXMgJGk9PiR4KXsKICAgaWYocHJlZ19tYXRjaCgnL3dvb2NvbW1lcmNlX3BhY2thZ2VfcmF0ZXN8c2hpcHBpbmdfbWV0aG9kc3x2ZW5pcGFrfGxwZXhwcmVzc3xscF9leHByZXNzL2knLCR4KSkgJGhbXT1hcnJheSgkaSsxLCB0cmltKG1iX3N1YnN0cigkeCwwLDEzMCkpKTsKIH0KICRvWydzaGlwcGluZ19laWx1dGVzJ109YXJyYXlfc2xpY2UoJGgsMCw0MCk7CiAvKiBNaXggYW5kIE1hdGNoOiBrYXMgcGF0ZW5rYSBpIGtyZXBzZWxpICovCiAkb1snbW5tX3lyYSddPWNsYXNzX2V4aXN0cygnV0NfTWl4X2FuZF9NYXRjaCcpOwogJG9bJ2xhdWthaV9rbGFzZSddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9MYXVrYWknKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'F924'};
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
  const s=await snip('TEMP F924',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_f924=F924')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,900); }
  await off(s);
  await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('f924.json', Buffer.from(JSON.stringify(out)), 'f924 shipping');
