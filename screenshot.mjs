process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={versija:'H053'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
function tekstas(x){ return x.replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim(); }
try{
  const r=await fetch(WP+'/wp-json/wp/v2/posts?per_page=100&_fields=id,slug,title,content,link,date,modified',
    {headers:{Authorization:AUTH}});
  const posts=await r.json();
  out.viso_irasu=Array.isArray(posts)?posts.length:0;
  out.puslapiu=r.headers.get('x-wp-totalpages'); out.viso=r.headers.get('x-wp-total');
  const sum={be_vidiniu:0,su_vidinemis:0}; const det=[];
  for(const p of (Array.isArray(posts)?posts:[])){
    const c=(p.content&&p.content.rendered)||'';
    const nuor=[...c.matchAll(/<a[^>]+href="([^"]+)"/gi)].map(m=>m[1]);
    const kat=nuor.filter(u=>u.includes('/kategorija/'));
    const pr =nuor.filter(u=>u.includes('/product/'));
    const gam=nuor.filter(u=>u.includes('/gamintojas/'));
    const sena=nuor.filter(u=>/(^|\/\/)(www\.)?petshop\.lt/i.test(u));
    const vid=nuor.filter(u=>u.startsWith('/')||u.includes('dev.avesa.lt'));
    const t=tekstas(c);
    const rec={slug:p.slug, zodziu:t.split(' ').filter(Boolean).length,
      nuoru:nuor.length, vidiniu:vid.length, i_kat:kat.length, i_prekes:pr.length,
      i_gam:gam.length, i_sena_petshop:sena.length,
      h2:(c.match(/<h2/gi)||[]).length, h3:(c.match(/<h3/gi)||[]).length,
      img:(c.match(/<img/gi)||[]).length,
      mojibake:/Ã.|Å¡|Å¾/.test(c)?1:0};
    if(kat.length+pr.length+gam.length===0) sum.be_vidiniu++; else sum.su_vidinemis++;
    det.push(rec);
  }
  out.suvestine=sum;
  det.sort((a,b)=>b.zodziu-a.zodziu);
  out.straipsniai=det;
  out.pvz_nuorodos=[];
  for(const p of (Array.isArray(posts)?posts:[]).slice(0,3)){
    const c=(p.content&&p.content.rendered)||'';
    out.pvz_nuorodos.push({slug:p.slug, nuor:[...c.matchAll(/<a[^>]+href="([^"]+)"/gi)].map(m=>m[1]).slice(0,8)});
  }
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h053.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h053 straipsniai per API');
