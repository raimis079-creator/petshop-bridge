process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3N2J10pPyRfR0VUWydwc19zdiddOicnKSE9PSdSRUNFJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1JFQ0UnLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aTpzJykpOwogJHM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJyk7ICRMPWV4cGxvZGUoIlxuIiwkcyk7CiAkb1snbWQ1J109bWQ1KCRzKTsKICRmaW5kPWZ1bmN0aW9uKCRyZSkgdXNlKCRMKXsgZm9yZWFjaCgkTCBhcyAkaT0+JGxuKXsgaWYocHJlZ19tYXRjaCgkcmUsJGxuKSkgcmV0dXJuICRpKzE7IH0gcmV0dXJuIDA7IH07CiAkYmxrPWZ1bmN0aW9uKCRhLCRsZW4pIHVzZSgkTCl7ICRyPWFycmF5KCk7IGlmKCEkYSkgcmV0dXJuICRyOyBmb3IoJGk9JGEtMTskaTxtaW4oJGEtMSskbGVuLGNvdW50KCRMKSk7JGkrKykgJHJbXT0oJGkrMSkuJzogJy5ydHJpbSgkTFskaV0pOyByZXR1cm4gJHI7IH07CiAkbmY9JGZpbmQoJy9mdW5jdGlvblxzK2ZpbHRydW90aVxzKlwoLycpOwogJG5rPSRmaW5kKCcvZnVuY3Rpb25ccytrcnV2b2plXHMqXCgvJyk7CiAkbnM9JGZpbmQoJy9mdW5jdGlvblxzK3N1dmVzdGluZVxzKlwoLycpOwogJG9bJ2ZpbHRydW90aV9laWwnXT0kbmY7ICRvWydmaWx0cnVvdGknXT0kYmxrKCRuZiw4MCk7CiAkb1sna3J1dm9qZV9laWwnXT0kbms7ICAgJG9bJ2tydXZvamUnXT0kYmxrKCRuaywyNik7CiAkb1snc3V2ZXN0aW5lX2VpbCddPSRuczsgJG9bJ3N1dmVzdGluZSddPSRibGsoJG5zLDQ0KTsKIC8qIHNhdmlrYWlub3Mga2VsaWFzIHN1cmlua3RpKCkgdmlkdWplICovCiAkaD1hcnJheSgpOwogZm9yZWFjaCgkTCBhcyAkaT0+JGxuKXsKICAgaWYoJGk+PTM3OTkgJiYgJGk8NDAwMCAmJiBwcmVnX21hdGNoKCIvY29zdHx6Yl9jb3N0fHZmX2Nvc3R8c2F2aWthaW58bWFyemF8Z3JpbmQvaSIsJGxuKSl7CiAgICAgJHQ9dHJpbSgkbG4pOyBpZigkdCE9PScnJiZzdHJsZW4oJHQpPDIwMCkgJGhbXT1hcnJheSgkaSsxLCR0KTsKICAgfQogfQogJG9bJ3N1cmlua3RpX2Nvc3QnXT1hcnJheV9zbGljZSgkaCwwLDQ1KTsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'RECE'};
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
  const s=await snip('TEMP RECE',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_sv=RECE')).text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('rece.json', Buffer.from(JSON.stringify(out)), 'rece');
console.log('ok');
