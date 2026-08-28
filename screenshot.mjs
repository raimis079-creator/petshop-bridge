process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt'; const VER='MONO2';
const out={v:VER};
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u){ for(let i=0;i<5;i++){ try{ return await fetch(u,{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}}); }catch(e){ await new Promise(r=>setTimeout(r,6000)); } } throw new Error('fx'); }
const u1=WP+'/kategorija/sunims/maistas-sunims/?filter_monoprotein=taip';
try{
  const h=await (await fx(u1)).text();
  const nav=h.match(/<nav class="woocommerce-pagination[\s\S]*?<\/nav>/);
  out.pagination_hrefs = nav ? (nav[0].match(/href="[^"]+"/g)||[]).slice(0,8) : null;
  // YITH filtro checkbox busena
  const mono = h.match(/[^>]*monoprotein[^<]{0,400}/gi) || [];
  out.mono_fragmentai = mono.slice(0,6).map(s=>s.replace(/\s+/g,' ').slice(0,250));
  out.yra_active_filters_blokas = /yith-wcan-active-filters/.test(h);
  out.yra_filters_container = /yith-wcan-filters/.test(h);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('deploy/mono_recon2.json', Buffer.from(JSON.stringify(out,null,1)), VER);
