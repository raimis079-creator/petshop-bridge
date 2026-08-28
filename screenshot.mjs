process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const VER='KURTI-HTML-v1.0'; const out={v:VER,p:{}};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const UA={'User-Agent':'Mozilla/5.0 Chrome/126','Cache-Control':'no-cache'};
const URLS=["https://petshop.lt/coockoo-guminis-kamuoliukas-bumpies-melynas-giant-l", "https://petshop.lt/ebi-guminis-kaulas-melsvos-spalvos-kvepiantis-metomis-didelis-l-2025-cm", "https://petshop.lt/ebi-guminis-kaulas-rozines-spalvos-kvepiantis-braskemis", "https://petshop.lt/katrinex-maistas-koi-karpiams-ir-kitoms-tvenkiniu-zuvims", "https://petshop.lt/naturalus-skanestai-sunims-elnio-rago-kramtukas-kietas", "https://petshop.lt/naturalus-skanestai-sunims-elnio-rago-kramtukas-minkstas", "https://petshop.lt/zolux-anah-sepetys-katems", "https://petshop.lt/zolux-anah-sepetys-minkstas-sunims", "https://petshop.lt/zolux-anah-sepetys-sunims-plieniniais-sereliais", "https://petshop.lt/zolux-anah-zirklutes-nagams-sunims"];
const paketas={};
for(const u of URLS){
  let t='';
  for(let i=0;i<3;i++){ try{ const r=await fetch(u,{headers:UA,redirect:'follow'}); t=await r.text(); out.p[u]={http:r.status,len:t.length}; break; }catch(e){ await miegok(4000);} }
  if(t) paketas[u]=t.slice(0,400000);
  await miegok(900);
}
await put('analize/senas/kurti_html.json', Buffer.from(JSON.stringify(paketas)), VER);
await put('analize/kurti_html_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log(JSON.stringify(out).slice(0,900));
