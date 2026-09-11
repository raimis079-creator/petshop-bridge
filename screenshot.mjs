process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjcyIG1jIG5vb3AgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7IGlmKGlzc2V0KCRfR0VUWydwc19zMTY3Mm0nXSkpeyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKGFycmF5KCd2Jz0+J1MxNjcybWMnLCdvayc9PjEpKTsgZXhpdDsgfSB9KTsK';
const VER='dep-182011';
const GKEY='ps_s1672m';
const PHASES=["GO"];
const OUT='analize/s1672_img2.json';
const DATA=[];
const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  try{ const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){ out.list_praleistas=String(e).slice(0,80); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  let dq='';
  if(DATA.length){ out.data={}; for(const p of DATA){ const name=p.split('/').pop();
      const g=await fx('https://api.github.com/repos/'+REPO+'/contents/'+p,{headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github.raw+json'}},'gh_'+name);
      const buf=Buffer.from(await g.arrayBuffer());
      const m=await fx(WP+'/wp-json/wp/v2/media',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain','Content-Disposition':'attachment; filename="'+name+'"'},body:buf},'media_'+name);
      const mt=await m.text(); try{ const j=JSON.parse(mt); out.data[name]={id:j.id,status:m.status}; dq+='&d_'+name.replace(/\W/g,'_')+'='+j.id; }catch(e){ out.data[name]={status:m.status,err:mt.slice(0,200)}; } } }
  await miegok(9000);
  if(process.env.GTM_SA_JSON){ try{ const sr=await fx(WP+'/wp-json/ps-seo-temp/v1/sa',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain'},body:process.env.GTM_SA_JSON},'sa'); out.sa_push={status:sr.status,body:(await sr.text()).slice(0,200)}; }catch(e){ out.sa_push=String(e).slice(0,200);} }

  try{ const U=["https://petshop.lt/wp-content/uploads/2026/06/ontario-monoprotein-antiena-su-moliugais-konservai-sunims-200-2_1773940171.jpg", "https://petshop.lt/wp-content/uploads/2026/06/ontario-monoprotein-jautiena-ir-morkos-200-_1773941446.jpg", "https://petshop.lt/wp-content/uploads/2026/06/ontario-monoprotein-antiena-su-moliugais-konservai-sunims_1773919054.jpg", "https://petshop.lt/wp-content/uploads/2026/06/on-ontario-troskinys-sunims-is-lasisos-ir-darzoviu-sultinyje-300-g-pouch-salmon-with-vegetables-in-broth-2-1.jpg", "https://petshop.lt/wp-content/uploads/2026/06/ontario-monoprotein-kalakutiena-saldz-bulves-200_1773943453.jpg", "https://petshop.lt/wp-content/uploads/2026/06/pa-pasta-kaciukams-su-tunu-ontario-kitten-tuna-fresh-meat-paste-90-g-1.png", "https://petshop.lt/wp-content/uploads/2026/06/pa-pasta-katems-su-antiena-ontario-duck-fresh-meat-paste-90-g-1.png", "https://petshop.lt/wp-content/uploads/2026/06/pa-pasta-katems-su-eriena-ontario-lamb-fresh-meat-paste-90-g-1.png", "https://petshop.lt/wp-content/uploads/2026/06/mi-miamor-super-premium-konservai-katems-su-tunu-ir-suriu-100-g-1-1.png", "https://petshop.lt/wp-content/uploads/2026/06/ge-gerimas-katems-miamor-trinkfein-vitaldrink-su-antiena-135-ml-1.jpg", "https://petshop.lt/wp-content/uploads/2026/06/ge-gerimas-katems-miamor-trinkfein-vitaldrink-su-tunu-135-ml-1.jpg", "https://petshop.lt/wp-content/uploads/2026/06/ge-gerimas-katems-miamor-trinkfein-vitaldrink-su-vistiena-135-ml-1.jpg", "https://petshop.lt/wp-content/uploads/2026/06/josera-optiness-4032254786429sunimsmedimaxiadult_1762337969.png", "https://petshop.lt/wp-content/uploads/2026/06/fa853aa0-e7d2-426d-9d38-0647bb30fb13.png", "https://petshop.lt/wp-content/uploads/2026/06/c8ad1fd6-ebc8-49e7-96b6-f72265229c28.png", "https://petshop.lt/wp-content/uploads/2026/06/josera-leger-2-kg_1710422467.png", "https://petshop.lt/wp-content/uploads/2026/06/josera-catelux-sausas-maistas-katems-plauku-gumuliuakai-2.png", "https://petshop.lt/wp-content/uploads/2026/06/josera-culinesse-sausas-maistas-katems-2.png", "https://petshop.lt/wp-content/uploads/2026/06/josera-dailycat-begrudis-sausas-maistas-katems.png", "https://petshop.lt/wp-content/uploads/2026/06/exclusion-mono-protein-mediterraneo-noble-grain-sausas-pasaras-sterilizuotoms-katems-su-tunu-12-kg_1_0.png", "https://petshop.lt/wp-content/uploads/2026/06/exclusion-hydrolysed-hypoallergenic-sausas-sunu-maistas-su-zuvimi-ir-kukuruzu-krakmolu-ml.png", "https://petshop.lt/wp-content/uploads/2026/06/exclusion-sausas-edalas-mazu-veisliu-sunims-su-kiauliena-ir-zirniais-2.png", "https://petshop.lt/wp-content/uploads/2026/06/exclusion-sausas-edalas-jauniems-sunims-su-kiauliena-ir-zirniais.png", "https://petshop.lt/wp-content/uploads/2026/06/exlusion-hypoallergenic-sausas-edalas-su-arkliena-suaugusiems-sunims.png", "https://petshop.lt/wp-content/uploads/2026/09/09f8087e-da07-469e-80ee-9f697e2dfa31.octet-stream", "https://petshop.lt/wp-content/uploads/2026/09/6f738148-b6f4-4499-b04b-0c5a160af11f.octet-stream", "https://petshop.lt/wp-content/uploads/2026/09/87d84d5e-aad4-49a4-8331-b317d43670d9.octet-stream", "https://petshop.lt/wp-content/uploads/2026/06/josera-sensiplus-pasaras-sunims_1762339418-1.png", "https://petshop.lt/wp-content/uploads/2026/06/josera-seniplus-4032254785989pasaras-sunims_1762339413.png", "https://petshop.lt/wp-content/uploads/2026/06/josera-sensiplus-maistas-sunims.jpg"]; out.img={n:U.length,ok:0,err:[]}; const m={};
    for(const u of U){ try{ const r=await fetch(u,{headers:{'User-Agent':'Mozilla/5.0'}}); const buf=Buffer.from(await r.arrayBuffer()); const ct=r.headers.get('content-type')||''; if(r.status===200&&buf.length>500){ m[u]={ct,b:buf.toString('base64'),len:buf.length}; out.img.ok++; } else out.img.err.push(u+' '+r.status+' '+buf.length); }catch(e){ out.img.err.push(u+' '+String(e).slice(0,80)); } }
    await put('analize/pmax_prekiu_img_s1672.json', Buffer.from(JSON.stringify(m)), VER+' img'); }catch(e){ out.img_klaida=String(e).slice(0,300); }
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f)+dq,{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
  // EKRANO NUOTRAUKOS (browser=1): fazė grąžina shots:[{n,u,w}], cookies:[{name,value}]
  const SH=(()=>{ for(const f of PHASES){ if(out[f]&&out[f].shots) return out[f]; } return null; })();
  if(SH){ try{ const {chromium}=await import('playwright'); const br=await chromium.launch(); const ctx=await br.newContext({viewport:{width:1440,height:900},ignoreHTTPSErrors:true});
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:new URL(WP).hostname,path:'/',secure:true}))); }
      out.shots={};
      for(const s of SH.shots){ try{ const pg=await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push('pageerror: '+String(e).slice(0,300))); pg.on('console',m=>{ if(m.type()==='error'||m.type()==='warning') errs.push(m.type()+': '+m.text().slice(0,300)); }); pg.on('response',r=>{ if(r.status()>=400) errs.push('http '+r.status()+' '+r.url().slice(0,120)); });
          if(s.w) await pg.setViewportSize({width:s.w,height:s.h||900}); await pg.goto(s.u,{waitUntil:'networkidle',timeout:60000}); await pg.waitForTimeout(800);
          const res={}; if(s.click){ try{ await pg.click(s.click,{timeout:5000}); await pg.waitForTimeout(600); res.clicked=s.click; }catch(e){ res.click_err=String(e).slice(0,200); } }
          if(s.eval){ try{ res.eval=await pg.evaluate(s.eval); }catch(e){ res.eval_err=String(e).slice(0,200); } }
          const buf=await pg.screenshot({fullPage:!!s.full}); const st=await put('screenshots/'+s.n+'.png',buf,VER+' '+s.n); out.shots[s.n]=Object.assign({status:st,url:pg.url(),title:await pg.title(),errors:errs.slice(0,12)},res); await pg.close(); }catch(e){ out.shots[s.n]=String(e).slice(0,200); } }
      await br.close(); }catch(e){ out.shots_klaida=String(e).slice(0,300); } }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
