process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODQgbW4g4oCUIGJhY2tmaWxsIHBzX2Zha3RfdXpzYWt5bWFpL2VpbHV0ZXMga2xpZW50YXNfbmF1amFzL2tsaWVudGFzX3V6c2FreW1vX25yL2RpZW5vc19udW9fYW5rc3Rlc25pbyBwYWdhbCBwc19pc3QgKHBvIHMxNjg0X21tKS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODRtbiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjg0IG1uJyk7CiAgLy8gYmFja2ZpbGw6IGVzYW1vcyBmYWt0IGVpbHV0xJdzIHN1IGlzdG9yaWphCiAgJFU9InskcH1wc19mYWt0X3V6c2FreW1haSI7ICRFPSJ7JHB9cHNfZmFrdF9laWx1dGVzIjsgJEk9InskcH1wc19pc3RfZmFrdF91enNha3ltYWkiOwogICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHUudXpzYWt5bWFzX2lkIGlkLCB1LmtsaWVudGFzX2VtYWlsX2hhc2ggaCwgdS5hcG1va2V0YV9hdCBhLCB1LmtsaWVudGFzX3V6c2FreW1vX25yIG5yLCB1LmtsaWVudGFzX25hdWphcyBrbiwgKFNFTEVDVCBDT1VOVCgqKSBGUk9NICRJIGkgV0hFUkUgaS5rbGllbnRhc19lbWFpbF9oYXNoPXUua2xpZW50YXNfZW1haWxfaGFzaCBBTkQgaS5hcG1va2V0YV9hdCBJUyBOT1QgTlVMTCBBTkQgaS5hcG1va2V0YV9hdDw9dS5hcG1va2V0YV9hdCkgbmksIChTRUxFQ1QgTUFYKGkuYXBtb2tldGFfYXQpIEZST00gJEkgaSBXSEVSRSBpLmtsaWVudGFzX2VtYWlsX2hhc2g9dS5rbGllbnRhc19lbWFpbF9oYXNoIEFORCBpLmFwbW9rZXRhX2F0PD11LmFwbW9rZXRhX2F0KSBwaSwgKFNFTEVDVCBNQVgoeC5hcG1va2V0YV9hdCkgRlJPTSAkVSB4IFdIRVJFIHgua2xpZW50YXNfZW1haWxfaGFzaD11LmtsaWVudGFzX2VtYWlsX2hhc2ggQU5EIHguYXBtb2tldGFfYXQ8dS5hcG1va2V0YV9hdCBBTkQgeC50ZXN0aW5pcz0wKSBwdyBGUk9NICRVIHUgV0hFUkUgdS5rbGllbnRhc19lbWFpbF9oYXNoPD4nJyBBTkQgdS5hcG1va2V0YV9hdCBJUyBOT1QgTlVMTCIsQVJSQVlfQSk7CiAgJG9bJ2JhY2tmaWxsJ109YXJyYXkoJ3Rpa3JpbnRhJz0+Y291bnQoJHJvd3MpLCdrZWlzdGEnPT4wLCdlcnInPT4kd3BkYi0+bGFzdF9lcnJvcik7CiAgZm9yZWFjaCgkcm93cyBhcyAkcil7IGlmKChpbnQpJHJbJ25pJ108PTApIGNvbnRpbnVlOyAkcGFzaz0kclsncHcnXTsgaWYoJHJbJ3BpJ10mJighJHBhc2t8fCRyWydwaSddPiRwYXNrKSkgJHBhc2s9JHJbJ3BpJ107ICRkaWVub3M9JHBhc2s/KGludClmbG9vcigoc3RydG90aW1lKCRyWydhJ10pLXN0cnRvdGltZSgkcGFzaykpL0RBWV9JTl9TRUNPTkRTKTpudWxsOwogICAgJG5yPShpbnQpJHJbJ25yJ10rKGludCkkclsnbmknXTsgJHdwZGItPnVwZGF0ZSgkVSxhcnJheSgna2xpZW50YXNfbmF1amFzJz0+MCwna2xpZW50YXNfdXpzYWt5bW9fbnInPT4kbnIsJ2RpZW5vc19udW9fYW5rc3Rlc25pbyc9PiRkaWVub3MpLGFycmF5KCd1enNha3ltYXNfaWQnPT4kclsnaWQnXSkpOyAkd3BkYi0+dXBkYXRlKCRFLGFycmF5KCdrbGllbnRhc19uYXVqYXMnPT4wKSxhcnJheSgndXpzYWt5bWFzX2lkJz0+JHJbJ2lkJ10pKTsgJG9bJ2JhY2tmaWxsJ11bJ2tlaXN0YSddKys7IH0KICAkb1sncG8nXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIENPVU5UKCopIG4sIFNVTShrbGllbnRhc19uYXVqYXM9MSkgbmF1amksIFNVTShrbGllbnRhc19uYXVqYXM9MCkgZ3JpenQsIFJPVU5EKEFWRyhDQVNFIFdIRU4ga2xpZW50YXNfbmF1amFzPTAgVEhFTiBkaWVub3NfbnVvX2Fua3N0ZXNuaW8gRU5EKSkgdmlkX2QgRlJPTSAkVSBXSEVSRSB0ZXN0aW5pcz0wIEFORCBhcG1va2V0YV9hdCBJUyBOT1QgTlVMTCIsQVJSQVlfQSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-191628';
const GKEY='ps_s1684mn';
const PHASES=["GO"];
const OUT='analize/s1684_mn.json';
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
