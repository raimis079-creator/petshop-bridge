process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const out={versija:'H025'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
try{
  /* 1. senas sitemap -> kategoriju URL */
  const sm=await fetch('https://petshop.lt/index.php?route=feed/google_sitemap/generate');
  const xml=await sm.text();
  out.sitemap_http=sm.status; out.sitemap_ilgis=xml.length;
  const vaikai=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  out.sitemap_indekso_irasai=vaikai.slice(0,10);
  out.sitemap_viso=vaikai.length;

  /* 2. jei tai indeksas — paimam kategoriju sub-sitemap */
  let katUrl=vaikai.find(u=>/categor/i.test(u));
  out.kategoriju_sitemap=katUrl||null;
  if(katUrl){
    const r2=await fetch(katUrl); const x2=await r2.text();
    const kat=[...x2.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
    out.kategoriju_kiekis=kat.length;
    out.kategoriju_pavyzdziai=kat.slice(0,60);
  }

  /* 3. ZALIAS HTML aplink zinoma teksta — kad matytume, kaip pazymeta */
  const r3=await fetch('https://petshop.lt/sunims/maistas-sunims/konservai-sunims');
  const h=await r3.text();
  out.puslapio_ilgis=h.length;
  const idx=h.indexOf('Kada verta rinktis');
  out.marker_rastas=idx;
  if(idx>0){ out.kontekstas=h.slice(Math.max(0,idx-2600), idx+300); }
  /* visi div/section su klase, kurioje yra desc */
  out.desc_klases=[...new Set([...h.matchAll(/<(div|section|article)[^>]*class="([^"]*desc[^"]*)"/gi)].map(m=>m[1]+'.'+m[2]))].slice(0,15);
  out.id_su_desc=[...new Set([...h.matchAll(/<(div|section)[^>]*id="([^"]*desc[^"]*)"/gi)].map(m=>m[1]+'#'+m[2]))].slice(0,10);
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h025.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h025 senas katalogas');
