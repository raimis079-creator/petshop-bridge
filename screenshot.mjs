process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const out={versija:'G980'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
const S='https://petshop.lt';
const keliai=['/robots.txt','/sitemap.xml','/index.php?route=feed/google_base','/index.php?route=extension/feed/google_base',
  '/google.xml','/feed/google','/googlebase.xml','/merchant.xml','/index.php?route=feed/google_sitemap','/feed/kaina24','/feed/kainos'];
out.keliai={};
for(const k of keliai){
  try{
    const r=await fetch(S+k,{redirect:'follow'});
    const t=await r.text();
    out.keliai[k]={status:r.status, ct:(r.headers.get('content-type')||'').slice(0,40), baitai:t.length,
      g_lauku:(t.match(/<g:[a-z_]+>/gi)||[]).length,
      google_kat:(t.match(/google_product_category/gi)||[]).length,
      pradzia:t.slice(0,180).replace(/\s+/g,' ')};
  }catch(e){ out.keliai[k]={klaida:String(e).slice(0,100)}; }
}
const zlib=await import('zlib');
await put('screenshots/g980.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g980 petshop.lt feedai');
