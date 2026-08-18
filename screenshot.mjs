process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDAxNyddKT8kX0dFVFsncHNfaDAxNyddOicnKSE9PSdIMDE3JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwMTcnKTsKCiAkb1snaXNfY29uZmlndXJlZCddPWNsYXNzX2V4aXN0cygnUmFua01hdGhcXEhlbHBlcicpPyhSYW5rTWF0aFxIZWxwZXI6OmlzX2NvbmZpZ3VyZWQoKT8xOjApOm51bGw7CiAkb1snbW9kdWxpYWknXT1nZXRfb3B0aW9uKCdyYW5rX21hdGhfbW9kdWxlcycpOwoKIC8qIDEuIHBlcmtyYXV0aSByZXdyaXRlIHRhaXN5a2xlcyDigJQgZGFiYXIgUk0gamF1IHBha3JhdXRhcyAqLwogZmx1c2hfcmV3cml0ZV9ydWxlcyhmYWxzZSk7CiAkcnI9Z2V0X29wdGlvbigncmV3cml0ZV9ydWxlcycpOyAkc209YXJyYXkoKTsKIGlmKGlzX2FycmF5KCRycikpIGZvcmVhY2goJHJyIGFzICRrPT4kdil7IGlmKHN0cmlwb3MoJGssJ3NpdGVtYXAnKSE9PWZhbHNlKSAkc21bJGtdPSR2OyB9CiAkb1sncmV3cml0ZV9zaXRlbWFwJ109JHNtOwoKIC8qIDIuIGtva3Mgc2l0ZW1hcCBpbmRla3NvIHNsdWcgKi8KIGlmKGNsYXNzX2V4aXN0cygnUmFua01hdGhcXFNpdGVtYXBcXFNpdGVtYXAnKSl7CiAgIHRyeXsgJG9bJ2luZGV4X3NsdWcnXT1SYW5rTWF0aFxTaXRlbWFwXFNpdGVtYXA6OmdldF9zaXRlbWFwX2luZGV4X3NsdWcoKTsgfWNhdGNoKEV4Y2VwdGlvbiAkZSl7ICRvWydpbmRleF9zbHVnJ109Jz8nOyB9CiB9CgogLyogMy4gQ0FOT05JQ0FMIGxvZ2lrYSDigJQgaXMgc2FsdGluaW8gKi8KICRkaXI9V1BfUExVR0lOX0RJUi4nL3Nlby1ieS1yYW5rLW1hdGgnOwogJGhpdHM9YXJyYXkoKTsKIGZvcmVhY2goYXJyYXkoJy9pbmNsdWRlcy9mcm9udGVuZC9jbGFzcy1oZWFkLnBocCcsJy9pbmNsdWRlcy9mcm9udGVuZC9jbGFzcy1jYW5vbmljYWwucGhwJywKICAgICAgICAgICAgICAgJy9pbmNsdWRlcy9mcm9udGVuZC9jbGFzcy1mcm9udGVuZC5waHAnKSBhcyAkcmVsKXsKICAgJHg9JGRpci4kcmVsOyBpZighaXNfcmVhZGFibGUoJHgpKSBjb250aW51ZTsKICAgZm9yZWFjaChmaWxlKCR4KSBhcyAkaT0+JGwpewogICAgIGlmKHByZWdfbWF0Y2goJy9jYW5vbmljYWx8bm9pbmRleHxpc19zaW1wbGVfcGFnZXxibG9nX3B1YmxpYy9pJywkbCkpICRoaXRzW109YmFzZW5hbWUoJHJlbCkuJzonLigkaSsxKS4nICcudHJpbSgkbCk7CiAgIH0KIH0KICRvWydjYW5vbmljYWxfc2FsdGluaXMnXT1hcnJheV9zbGljZSgkaGl0cywwLDM1KTsKICRvWydmcm9udGVuZF9mYWlsYWknXT1pc19kaXIoJGRpci4nL2luY2x1ZGVzL2Zyb250ZW5kJyk/YXJyYXlfdmFsdWVzKGFycmF5X2RpZmYoc2NhbmRpcigkZGlyLicvaW5jbHVkZXMvZnJvbnRlbmQnKSxhcnJheSgnLicsJy4uJykpKTpudWxsOwoKIC8qIDQuIGFyIFJNIHByaXNpa2FiaW5vIHByaWUgd3BfaGVhZCBkYWJhciAqLwogZ2xvYmFsICR3cF9maWx0ZXI7ICRoZWFkPWFycmF5KCk7CiBpZihpc3NldCgkd3BfZmlsdGVyWyd3cF9oZWFkJ10pKSBmb3JlYWNoKCR3cF9maWx0ZXJbJ3dwX2hlYWQnXS0+Y2FsbGJhY2tzIGFzICRwcj0+JGNicykKICAgZm9yZWFjaCgkY2JzIGFzICRpZD0+JGNiKXsgaWYoc3RyaXBvcygkaWQsJ3JhbmsnKSE9PWZhbHNlKSAkaGVhZFtdPSRwci4nICcuJGlkOyB9CiAkb1snd3BfaGVhZF9ybSddPSRoZWFkOwoKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H017'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
function galva(h){
  const g=(re)=>{const m=h.match(re);return m?m[1]:''};
  return {
    title:g(/<title>([\s\S]*?)<\/title>/i).slice(0,180),
    t_ilg:(g(/<title>([\s\S]*?)<\/title>/i)||'').length,
    description:g(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i).slice(0,260),
    d_ilg:(g(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)||'').length,
    og_title:g(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i).slice(0,100),
    robots:g(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i),
    canonical:g(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i),
    ldjson:(h.match(/application\/ld\+json/gi)||[]).length,
    rm_zyme:/Rank Math/i.test(h)?1:0
  };
}
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const code=Buffer.from(B64,'base64').toString('utf8');
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H017 RM sitemap',code,scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:('KLAIDA '+cr.s+' '+cr.t.slice(0,200));
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h017=H017'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.http=r.status; out.zalias=t.slice(0,600); }
  out.galvos={};
  const U=(out.d&&out.d.url)?out.d.url:{};
  U.preke_su_meta='https://dev.avesa.lt/product/ambrosia-junior-begrudis-su-sviezia-vistiena-ir-lasisa-sausas-maistas-dideliu-veisliu-jauniems-suniukams-fresh-chicken-salmon-12-kg/';
  for(const [k,u] of Object.entries(U)){
    if(!u) continue;
    try{ const x=await fetch(u); const h=await x.text(); out.galvos[k]={http:x.status,...galva(h)}; }
    catch(e){ out.galvos[k]={klaida:String(e).slice(0,120)}; }
  }
  out.sitemapai={};
  for(const u of ['/sitemap_index.xml','/product-sitemap.xml','/product_cat-sitemap.xml','/product_brand-sitemap.xml','/page-sitemap.xml']){
    try{ const x=await fetch(WP+u); const b=await x.text();
      out.sitemapai[u]={http:x.status,xml:/<\?xml|<urlset|<sitemapindex/i.test(b)?1:0,eil:(b.match(/<loc>/g)||[]).length,pr:b.replace(/\s+/g,' ').slice(0,120)}; }
    catch(e){ out.sitemapai[u]={klaida:String(e).slice(0,80)}; }
  }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h017.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h017 rm patikra');
