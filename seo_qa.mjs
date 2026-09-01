// seo_qa.mjs — pilnas 301 žemėlapio QA iš runner'io (savaitę). old→301→200, be grandinių, ne home, adresas gali būti 200 (egzistuoja).
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const R=WP+'/wp-json/ps-seo/v1'; const UA={'User-Agent':'PetshopSEO-QA-runner'};
const m=await (await fetch(R+'/map',{headers:{Authorization:AUTH}})).json();
const keys=Object.keys(m.map||{}); const home=(m.home||WP).replace(/\/$/,''); const homeK=new URL(home+'/').pathname.replace(/^\/|\/$/g,'').toLowerCase();
const kel=u=>{ try{ return decodeURIComponent(new URL(u,home).pathname).replace(/^\/|\/$/g,'').toLowerCase(); }catch(e){ return ''; } };
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const head1=async u=>{ const c=new AbortController(); const t=setTimeout(()=>c.abort(),15000); try{ const r=await fetch(u,{method:'HEAD',redirect:'manual',headers:UA,signal:c.signal}); return {s:r.status,l:r.headers.get('location')||''}; }catch(e){ return {s:0,l:String(e).slice(0,60)}; } finally{ clearTimeout(t);} };
const head=async u=>{ let r=await head1(u); for(let i=0;i<3&&(r.s===429||r.s===0);i++){ await sleep(4000*(i+1)); r=await head1(u); } await sleep(250); return r; };
let ok=0; const kl=[]; let i=0; const t0=Date.now();
async function worker(){ while(i<keys.length){ const k=keys[i++];
  const a=await head(home+'/'+k);
  if(a.s===200){ ok++; continue; }
  if(a.s!==301){ kl.push({k,p:'HTTP '+a.s+' (laukta 301)'}); continue; }
  const lk=kel(a.l); if(!lk||lk===homeK){ kl.push({k,p:'301 → home'}); continue; }
  const b=await head(a.l);
  if(b.s===200) ok++; else if(b.s===301||b.s===302) kl.push({k,p:'grandinė 301→'+b.s+' '+lk}); else kl.push({k,p:'301→'+b.s+' '+lk}); } }
await Promise.all(Array.from({length:2},worker));
const sek=Math.round((Date.now()-t0)/1000);
const santrauka=`runner: visas žemėlapis ${keys.length} · ok ${ok} · klaidų ${kl.length} · ${sek}s`;
const p=await fetch(R+'/qa',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({tipas:'redirect',tikrinta:keys.length,ok,klaidos:kl,santrauka})});
console.log(santrauka,'POST',p.status); console.log(JSON.stringify(kl.slice(0,40)));
