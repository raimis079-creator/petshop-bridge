process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const out={versija:'H106'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
function audit(h){
  const r={};
  /* 1. lang */
  r.lang = (h.match(/<html[^>]*\slang="([^"]*)"/i)||[null,'NĖRA'])[1];
  /* 2. paveikslėliai be alt */
  const img=[...h.matchAll(/<img\b[^>]*>/gi)].map(m=>m[0]);
  r.img_viso=img.length;
  r.img_be_alt=img.filter(t=>!/\salt\s*=/i.test(t)).length;
  r.img_tuscias_alt=img.filter(t=>/\salt\s*=\s*(""|'')/i.test(t)).length;
  r.img_be_alt_pvz=img.filter(t=>!/\salt\s*=/i.test(t)).slice(0,3).map(t=>t.slice(0,110));
  /* 3. antraščių tvarka */
  const hs=[...h.matchAll(/<h([1-6])\b[^>]*>([\s\S]{0,80}?)<\/h\1>/gi)].map(m=>({l:+m[1], t:m[2].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim().slice(0,45)}));
  r.h1_kiek=hs.filter(x=>x.l===1).length;
  r.antrasciu_seka=hs.map(x=>'h'+x.l).join(' ');
  const sokiai=[];
  for(let i=1;i<hs.length;i++) if(hs[i].l - hs[i-1].l > 1) sokiai.push(`h${hs[i-1].l}→h${hs[i].l} („${hs[i].t}")`);
  r.lygiu_sokiai=sokiai;
  /* 4. formų laukai be label / aria-label */
  const inp=[...h.matchAll(/<(input|select|textarea)\b[^>]*>/gi)].map(m=>m[0])
    .filter(t=>!/type\s*=\s*["'](hidden|submit|button|image)["']/i.test(t));
  const ids=[...h.matchAll(/<label\b[^>]*\sfor="([^"]+)"/gi)].map(m=>m[1]);
  r.laukai_viso=inp.length;
  r.laukai_be_vardo=inp.filter(t=>{
    const id=(t.match(/\sid="([^"]+)"/i)||[])[1];
    if(id && ids.includes(id)) return false;
    return !/aria-label\s*=|aria-labelledby\s*=|title\s*=/i.test(t);
  }).length;
  r.laukai_be_vardo_pvz=inp.filter(t=>{
    const id=(t.match(/\sid="([^"]+)"/i)||[])[1];
    if(id && ids.includes(id)) return false;
    return !/aria-label\s*=|aria-labelledby\s*=|title\s*=/i.test(t);
  }).slice(0,3).map(t=>t.slice(0,110));
  /* 5. nuorodos be teksto */
  const a=[...h.matchAll(/<a\b[^>]*>([\s\S]{0,200}?)<\/a>/gi)];
  r.nuorodu_viso=a.length;
  r.nuorodos_be_teksto=a.filter(m=>{
    const vid=m[1].replace(/<[^>]+>/g,'').trim();
    if(vid) return false;
    return !/aria-label\s*=|title\s*=/i.test(m[0]);
  }).length;
  const bendri=a.map(m=>m[1].replace(/<[^>]+>/g,'').trim().toLowerCase())
    .filter(t=>['skaityti daugiau','daugiau','čia','spausti','read more','click here'].includes(t));
  r.nuorodos_bendriniu_tekstu=bendri.length;
  /* 6. praleisti prie turinio */
  r.skip_link = /skip-link|skip to content|pereiti prie turinio/i.test(h) ? 'yra' : 'nėra';
  /* 7. viewport ir mastelio uzrakinimas */
  const vp=(h.match(/<meta[^>]*name="viewport"[^>]*>/i)||['nėra'])[0];
  r.viewport = vp.slice(0,120);
  r.mastelis_uzrakintas = /user-scalable\s*=\s*no|maximum-scale\s*=\s*1/i.test(vp) ? 'TAIP — WCAG pažeidimas' : 'ne';
  /* 8. lentelės be antraščių */
  r.lenteliu = (h.match(/<table\b/gi)||[]).length;
  return r;
}
async function tirk(v,u){
  try{ const r=await fetch(u); const h=await r.text(); out[v]={url:String(u).replace(WP,''),http:r.status,...audit(h)}; }
  catch(e){ out[v]={klaida:String(e).slice(0,110)}; }
}
try{
  const idx=await (await fetch(WP+'/sitemap_index.xml')).text();
  const failai=[...idx.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(m=>m[1]);
  const imk=async(z,n)=>{ const f=failai.find(x=>x.includes(z)); if(!f) return null;
    const x=await (await fetch(f)).text(); const u=[...x.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(m=>m[1]); return u[n]||u[0]||null; };
  await tirk('PRADINIS', WP+'/');
  const p=await imk('product-sitemap',5); if(p) await tirk('PREKE', p);
  const k=await imk('product_cat-sitemap',1); if(k) await tirk('KATEGORIJA', k);
  await tirk('KREPSELIS', WP+'/krepselis/');
  const s=await imk('post-sitemap',1); if(s) await tirk('STRAIPSNIS', s);
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h106.json', Buffer.from(JSON.stringify(out,null,1)), 'h106 WCAG bazine patikra NF19');
