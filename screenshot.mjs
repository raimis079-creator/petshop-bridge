process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const VER='SENAS-RECON-v1.0'; const out={v:VER, puslapiai:{}};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36','Cache-Control':'no-cache'};
async function imk(u){ for(let i=0;i<4;i++){ try{ const r=await fetch(u,{headers:UA,redirect:'follow'}); const t=await r.text(); return {http:r.status,url:r.url,len:t.length,t}; }catch(e){ await miegok(5000);} } return {http:0,url:u,len:0,t:''}; }

const TAIKINIAI={
 'sitemap.xml'                 :'https://petshop.lt/sitemap.xml',
 'p_katrinex_koi.html'         :'https://petshop.lt/katrinex-maistas-koi-karpiams-ir-kitoms-tvenkiniu-zuvims',
 'p_cactus_dubenelis.html'     :'https://petshop.lt/leto-valgymo-dubenelis-cactus-32-x-32-x-7-cm',
 'p_semtuvelis.html'           :'https://petshop.lt/semtuvelis-sausam-edalui-semti',
 'p_skudo_deze.html'           :'https://petshop.lt/transportavimo-deze-boksas-gyvunams-skudo-1-iata',
 'k_tualetai.html'             :'https://petshop.lt/katems/tualetai-kraiku-semtuveliai-kilimeliai',
 'k_dubeneliai.html'           :'https://petshop.lt/sunims/dubeneliai-sunims',
 'k_transportavimas.html'      :'https://petshop.lt/katems/transportavimo-dezes',
 'k_tvenkiniu_zuvu.html'       :'https://petshop.lt/zuvims-2007550667/tvenkiniu-zuvu-maistas',
 'k_akvariuminiu_zuvu.html'    :'https://petshop.lt/zuvims-2007550667/akvariuminiu-zuvu-maistas'
};
for(const [f,u] of Object.entries(TAIKINIAI)){
  const r=await imk(u);
  out.puslapiai[f]={http:r.http, galutinis_url:r.url, baitu:r.len};
  if(r.len>0) await put('analize/senas/'+f, Buffer.from(r.t.slice(0,600000)), VER+' '+f);
  await miegok(1200);
}
await put('analize/senas_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log(JSON.stringify(out).slice(0,2000));
