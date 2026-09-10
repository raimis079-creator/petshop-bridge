process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NjggYXEg4oCUIDE2NjM5IGF2IHJlZ2lzdHJhcyBhdGdhbCDEryA2OyBzbmlwcGV0IDI1MTUgZ3LEhcW+aW5hbWFzIGnFoSBiYWNrdXAgKHBha2VpdGltYXMgbmVzdXZlaWvElyk7ICsgc2luY2hyb25penVvdGkoKSBrb2RhcyBza2FpdHltdWkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjY4YXEnXSkpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCd2Jz0+J1MxNjY4IGFxJyk7ICR0PSR3cGRiLT5wcmVmaXguJ3NuaXBwZXRzJzsKICAkb3duPShpbnQpZ2V0X3Bvc3RfbWV0YSgxNjYzOSwnX293bl9zdG9ja19xdHknLHRydWUpOwogICR3cGRiLT51cGRhdGUoJHdwZGItPnByZWZpeC4ncHNfc291cmNlcycsYXJyYXkoJ3N0b2NrX3F0eSc9PiRvd24sJ3VwZGF0ZWRfYXQnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpLGFycmF5KCdwcm9kdWN0X2lkJz0+MTY2MzksJ3NvdXJjZSc9PidhdicpKTsKICAkb1snMTY2MzknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzb3VyY2Usc3RvY2tfcXR5IEZST00geyR3cGRiLT5wcmVmaXh9cHNfc291cmNlcyBXSEVSRSBwcm9kdWN0X2lkPTE2NjM5IixBUlJBWV9BKTsKICAkYmFrPWdldF9vcHRpb24oJ3BzX3MxNjY4X3NuaXAyNTE1X2JhaycpOwogIGlmKCRiYWsgJiYgbWQ1KCRiYWspPT09JzY4MWJlZjdlYzUwYTE0M2ZmZGNmNzAzNWRmYTBlNTI0Jyl7ICR3cGRiLT51cGRhdGUoJHQsYXJyYXkoJ2NvZGUnPT4kYmFrLCdtb2RpZmllZCc9PmN1cnJlbnRfdGltZSgnbXlzcWwnLHRydWUpKSxhcnJheSgnaWQnPT4yNTE1KSk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnXFxDb2RlX1NuaXBwZXRzXFxjbGVhbl9zbmlwcGV0c19jYWNoZScpKSBcQ29kZV9TbmlwcGV0c1xjbGVhbl9zbmlwcGV0c19jYWNoZSgkdCk7IH0KICAkb1snc25pcF9tZDUnXT1tZDUoKHN0cmluZykkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIGNvZGUgRlJPTSAkdCBXSEVSRSBpZD0yNTE1IikpOwogIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9Tb3VyY2VzJykpeyAkcm09bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfU291cmNlcycsJ3NpbmNocm9uaXp1b3RpJyk7ICRmbD1maWxlKCRybS0+Z2V0RmlsZU5hbWUoKSk7ICRvWydzaW5jaF9mYWlsYXMnXT1zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRybS0+Z2V0RmlsZU5hbWUoKSk7ICRvWydzaW5jaCddPWltcGxvZGUoJycsYXJyYXlfc2xpY2UoJGZsLCRybS0+Z2V0U3RhcnRMaW5lKCktMSxtaW4oNzAsJHJtLT5nZXRFbmRMaW5lKCktJHJtLT5nZXRTdGFydExpbmUoKSsxKSkpOwogICAgaWYobWV0aG9kX2V4aXN0cygnUGV0c2hvcF9Tb3VyY2VzJywnc3Vza2FpY2l1b3RpJykpeyAkcm0yPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX1NvdXJjZXMnLCdzdXNrYWljaXVvdGknKTsgJG9bJ3N1c2snXT1pbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRmbCwkcm0yLT5nZXRTdGFydExpbmUoKS0xLG1pbig2MCwkcm0yLT5nZXRFbmRMaW5lKCktJHJtMi0+Z2V0U3RhcnRMaW5lKCkrMSkpKTsgfSB9CiAgd3Bfc2VuZF9qc29uKCRvKTsKfSk7Cg==';
const VER='dep-095910';
const GKEY='ps_s1668aq';
const PHASES=["1"];
const OUT='analize/s1668_aq.json';
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
