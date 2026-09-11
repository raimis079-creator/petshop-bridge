process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjcyIHBtYXggaW1nIHJlY2VpdmVyICovCmFkZF9hY3Rpb24oJ3Jlc3RfYXBpX2luaXQnLCBmdW5jdGlvbigpewogIHJlZ2lzdGVyX3Jlc3Rfcm91dGUoJ3BzLXdlYi92MScsJy9wbWF4LWltZycsYXJyYXkoJ21ldGhvZHMnPT4nUE9TVCcsJ3Blcm1pc3Npb25fY2FsbGJhY2snPT4nX19yZXR1cm5fdHJ1ZScsJ2NhbGxiYWNrJz0+ZnVuY3Rpb24oJHIpewogICAgaWYoKCRyLT5nZXRfaGVhZGVyKCd4LXBzLWtleScpPz8nJykhPT1nZXRfb3B0aW9uKCdwc19hZHNfcmFrdGFzJykpIHJldHVybiBuZXcgV1BfRXJyb3IoJ2snLCdrZXknLGFycmF5KCdzdGF0dXMnPT40MDMpKTsKICAgICRuPXByZWdfcmVwbGFjZSgnL1teYS16MC05Xy5dLycsJycsKHN0cmluZykkci0+Z2V0X3BhcmFtKCduJykpOyBpZighJG58fCFwcmVnX21hdGNoKCcvXC4oanBnfGpzb24pJC8nLCRuKSkgcmV0dXJuIG5ldyBXUF9FcnJvcignbicsJ25hbWUnLGFycmF5KCdzdGF0dXMnPT40MDApKTsKICAgICRkaXI9d3BfdXBsb2FkX2RpcigpWydiYXNlZGlyJ10uJy9wbWF4LXMxNjcyJzsgaWYoIWlzX2RpcigkZGlyKSkgd3BfbWtkaXJfcCgkZGlyKTsKICAgICRiPSRyLT5nZXRfYm9keSgpOyBpZihzdHJsZW4oJGIpPDEwMCkgcmV0dXJuIG5ldyBXUF9FcnJvcignYicsJ2JvZHknLGFycmF5KCdzdGF0dXMnPT40MDApKTsKICAgIGlmKHN1YnN0cigkbiwtNCk9PT0nLmpwZycgJiYgc3Vic3RyKCRiLDAsMykhPT0iXHhGRlx4RDhceEZGIikgcmV0dXJuIG5ldyBXUF9FcnJvcignaicsJ25vdCBqcGVnJyxhcnJheSgnc3RhdHVzJz0+NDAwKSk7CiAgICAkdz1maWxlX3B1dF9jb250ZW50cygkZGlyLicvJy4kbiwkYik7IHJldHVybiBhcnJheSgnbic9PiRuLCdieXRlcyc9PiR3LCdtZDUnPT5tZDUoJGIpKTsgfSkpOwp9KTsKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7IGlmKCFpc3NldCgkX0dFVFsncHNfczE2NzJwJ10pKSByZXR1cm47IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7ICRvPWFycmF5KCd2Jz0+J1MxNjcycCcpOwogICRkaXI9d3BfdXBsb2FkX2RpcigpWydiYXNlZGlyJ10uJy9wbWF4LXMxNjcyJzsgJHVybD13cF91cGxvYWRfZGlyKClbJ2Jhc2V1cmwnXS4nL3BtYXgtczE2NzInOyAkZj1pc19kaXIoJGRpcik/YXJyYXlfdmFsdWVzKGFycmF5X2RpZmYoc2NhbmRpcigkZGlyKSxhcnJheSgnLicsJy4uJykpKTphcnJheSgpOwogICRvWydmYWlsdSddPWNvdW50KCRmKTsgJG9bJ2JhaXRhaSddPWFycmF5X3N1bShhcnJheV9tYXAoZnVuY3Rpb24oJHgpdXNlKCRkaXIpe3JldHVybiBmaWxlc2l6ZSgkZGlyLicvJy4keCk7fSwkZikpOyAkb1sndXJsJ109JHVybDsgJG9bJ3Jha3Rhc195cmEnXT0oYm9vbClnZXRfb3B0aW9uKCdwc19hZHNfcmFrdGFzJyk7CiAgJHQ9YXJyYXkoKTsgZm9yZWFjaChhcnJheV9zbGljZSgkZiwwLDMpIGFzICR4KXsgJGg9d3BfcmVtb3RlX2hlYWQoJHVybC4nLycuJHgsYXJyYXkoJ3RpbWVvdXQnPT4xNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsgJHRbJHhdPWlzX3dwX2Vycm9yKCRoKT8nZXJyJzp3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkaCk7IH0gJG9bJ2h0dHAnXT0kdDsKICBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfSk7Cg==';
const VER='dep-184213';
const GKEY='ps_s1672p';
const PHASES=["GO"];
const OUT='analize/s1672_p.json';
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

  try{ const F=["01_konservai_sunims_ontario_mono_ls.jpg", "01_konservai_sunims_ontario_mono_pt.jpg", "01_konservai_sunims_ontario_mono_sq.jpg", "02_konservai_sunims_ontario_mono_ls.jpg", "02_konservai_sunims_ontario_mono_pt.jpg", "02_konservai_sunims_ontario_mono_sq.jpg", "03_konservai_sunims_ontario_mono_ls.jpg", "03_konservai_sunims_ontario_mono_pt.jpg", "03_konservai_sunims_ontario_mono_sq.jpg", "04_konservai_sunims_ontario_mono_ls.jpg", "04_konservai_sunims_ontario_mono_pt.jpg", "04_konservai_sunims_ontario_mono_sq.jpg", "05_konservai_sunims_ontario_mono_ls.jpg", "05_konservai_sunims_ontario_mono_pt.jpg", "05_konservai_sunims_ontario_mono_sq.jpg", "06_konservai_katems_ontario_ls.jpg", "06_konservai_katems_ontario_pt.jpg", "06_konservai_katems_ontario_sq.jpg", "07_konservai_katems_ontario_ls.jpg", "07_konservai_katems_ontario_pt.jpg", "07_konservai_katems_ontario_sq.jpg", "08_konservai_katems_ontario_ls.jpg", "08_konservai_katems_ontario_pt.jpg", "08_konservai_katems_ontario_sq.jpg", "09_konservai_katems_miamor_ls.jpg", "09_konservai_katems_miamor_pt.jpg", "09_konservai_katems_miamor_sq.jpg", "10_konservai_katems_miamor_ls.jpg", "10_konservai_katems_miamor_pt.jpg", "10_konservai_katems_miamor_sq.jpg", "11_konservai_katems_miamor_ls.jpg", "11_konservai_katems_miamor_pt.jpg", "11_konservai_katems_miamor_sq.jpg", "12_konservai_katems_miamor_ls.jpg", "12_konservai_katems_miamor_pt.jpg", "12_konservai_katems_miamor_sq.jpg", "13_josera_sunims_sausas_ls.jpg", "13_josera_sunims_sausas_pt.jpg", "13_josera_sunims_sausas_sq.jpg", "14_josera_sunims_sausas_ls.jpg", "14_josera_sunims_sausas_pt.jpg", "14_josera_sunims_sausas_sq.jpg", "15_josera_sunims_sausas_ls.jpg", "15_josera_sunims_sausas_pt.jpg", "15_josera_sunims_sausas_sq.jpg", "16_josera_sunims_sausas_ls.jpg", "16_josera_sunims_sausas_pt.jpg", "16_josera_sunims_sausas_sq.jpg", "17_josera_katems_ls.jpg", "17_josera_katems_pt.jpg", "17_josera_katems_sq.jpg", "18_josera_katems_ls.jpg", "18_josera_katems_pt.jpg", "18_josera_katems_sq.jpg", "19_josera_katems_ls.jpg", "19_josera_katems_pt.jpg", "19_josera_katems_sq.jpg", "20_josera_katems_ls.jpg", "20_josera_katems_pt.jpg", "20_josera_katems_sq.jpg", "21_exclusion_ltv_7_12_kg_ls.jpg", "21_exclusion_ltv_7_12_kg_pt.jpg", "21_exclusion_ltv_7_12_kg_sq.jpg", "22_exclusion_ltv_7_12_kg_ls.jpg", "22_exclusion_ltv_7_12_kg_pt.jpg", "22_exclusion_ltv_7_12_kg_sq.jpg", "23_exclusion_ltv_7_12_kg_ls.jpg", "23_exclusion_ltv_7_12_kg_pt.jpg", "23_exclusion_ltv_7_12_kg_sq.jpg", "24_exclusion_ltv_7_12_kg_ls.jpg", "24_exclusion_ltv_7_12_kg_pt.jpg", "24_exclusion_ltv_7_12_kg_sq.jpg", "25_exclusion_ltv_7_12_kg_ls.jpg", "25_exclusion_ltv_7_12_kg_pt.jpg", "25_exclusion_ltv_7_12_kg_sq.jpg", "26_exclusion_konservai_ls.jpg", "26_exclusion_konservai_pt.jpg", "26_exclusion_konservai_sq.jpg", "27_exclusion_konservai_ls.jpg", "27_exclusion_konservai_pt.jpg", "27_exclusion_konservai_sq.jpg", "28_exclusion_konservai_ls.jpg", "28_exclusion_konservai_pt.jpg", "28_exclusion_konservai_sq.jpg", "manifest.json"]; out.up={n:F.length,ok:0,err:[]}; const KEY=process.env.PS_ADS_KEY||'FDPFp74rq8G8ceoglCn5sA7YrR1IA8lo';
    for(const n of F){ try{ const g=await fx('https://api.github.com/repos/'+REPO+'/contents/pmax_s1672/'+n,{headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github.raw+json'}},'gh_'+n); const buf=Buffer.from(await g.arrayBuffer());
      const r=await fx(WP+'/?rest_route=/ps-web/v1/pmax-img&n='+n,{method:'POST',headers:{'x-ps-key':KEY,'Content-Type':'application/octet-stream'},body:buf},'up_'+n); const tx=await r.text(); if(r.status===200) out.up.ok++; else out.up.err.push(n+' '+r.status+' '+tx.slice(0,120)); }catch(e){ out.up.err.push(n+' '+String(e).slice(0,80)); } }
  }catch(e){ out.up_klaida=String(e).slice(0,300); }
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
