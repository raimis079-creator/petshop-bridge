process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODMgYyDigJQgUkVBRC1PTkxZOiBWMTIgcGFnYWwgYW50cm8gcGlya2ltbyBsYWlrxIUgKGQxMiBncnVwxJdzKSwgUjYwIHBhZ2FsIGJyZW5kxIUvZ3l2xatuxIUsIG3El24uIGRpbmFtaWthICgx4oaSMuKGkjPihpI0IGtvbnZlcnNpam9zLCBpbnRlcnZhbGFpLCBBT1YgcGFnYWwgZXRhcMSFLCDFoXVvL2thdMSXLCBicmVuZGFzKSwgZ3LEr8W+aW1vIGhhemFyZCBrcmVpdsSXLCB0b3Aga2xpZW50YWkgdnMgcG9wdWxpYWNpamEsIGJyZW5kxbMgbWFyxb5hIHN1IGRhYmFydGluZSBzYXZpa2FpbmEuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjgzYyddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjgzIGMnKTsgJHdwZGItPnN1cHByZXNzX2Vycm9ycyh0cnVlKTsKICAkVT0ieyRwfXBzX2lzdF9mYWt0X3V6c2FreW1haSI7ICRFPSJ7JHB9cHNfaXN0X2Zha3RfZWlsdXRlcyI7CiAgJG9bJ2VfY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkRSIpOwogICRGT09EPSIoTE9XRVIoZS5rYXRlZ29yaWp1X2tlbGlhcykgTElLRSAnJW1haXN0JScgT1IgTE9XRVIoZS5rYXRlZ29yaWp1X2tlbGlhcykgTElLRSAnJXNrYW4lJyBPUiBMT1dFUihlLmthdGVnb3JpanVfa2VsaWFzKSBMSUtFICcla29uc2VydiUnKSI7CiAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdS51enNha3ltYXNfaWQgaWQsIENPQUxFU0NFKE5VTExJRih1LmtsaWVudGFzX2VtYWlsX2hhc2gsJycpLENPTkNBVCgnaWQnLHUua2xpZW50YXNfaWQpKSBrbCwgREFURSh1LmFwbW9rZXRhX2F0KSBkLCB1LnZpc29fY3QsIHUuc2FuZGVsaWFpLCB1LnZlemVqYWksIHUubWlzcnVzLCBTVU0oQ0FTRSBXSEVOICRGT09EIFRIRU4gZS5rYWluYV9jdCBFTFNFIDAgRU5EKSBtYWlzdF9jdCwgQ09VTlQoRElTVElOQ1QgZS5za3UpIHNrdV9uLCBTVUJTVFJJTkdfSU5ERVgoR1JPVVBfQ09OQ0FUKENBU0UgV0hFTiAkRk9PRCBUSEVOIGUuYnJlbmRhc19zbHVnIEVORCBPUkRFUiBCWSBlLmthaW5hX2N0IERFU0MpLCcsJywxKSBicmVuZGFzLCBTVUJTVFJJTkdfSU5ERVgoR1JPVVBfQ09OQ0FUKENBU0UgV0hFTiAkRk9PRCBUSEVOIGUuZ3l2dW5hcyBFTkQgT1JERVIgQlkgZS5rYWluYV9jdCBERVNDKSwnLCcsMSkgZ3l2LCBTVUJTVFJJTkdfSU5ERVgoR1JPVVBfQ09OQ0FUKENBU0UgV0hFTiAkRk9PRCBUSEVOIGUuc2t1IEVORCBPUkRFUiBCWSBlLmthaW5hX2N0IERFU0MpLCcsJywxKSBza3UsIFNVQlNUUklOR19JTkRFWChHUk9VUF9DT05DQVQoQ0FTRSBXSEVOICRGT09EIFRIRU4gZS5wYXZhZGluaW1hc190dW9fbWV0dSBFTkQgT1JERVIgQlkgZS5rYWluYV9jdCBERVNDKSwnLCcsMSkgcGF2LCBTVU0oTE9XRVIoZS5rYXRlZ29yaWp1X2tlbGlhcykgTElLRSAnJWtvbnNlcnYlJyBPUiBMT1dFUihlLnBhdmFkaW5pbWFzX3R1b19tZXR1KSBMSUtFICcla29uc2VydiUnIE9SIGUucGF2YWRpbmltYXNfdHVvX21ldHUgTElLRSAnJSBnJyBPUiBlLnBhdmFkaW5pbWFzX3R1b19tZXR1IExJS0UgJyU0MDBnJScgT1IgZS5wYXZhZGluaW1hc190dW9fbWV0dSBMSUtFICclODAwZyUnKSBzbGFwX24gRlJPTSAkVSB1IEpPSU4gJEUgZSBPTiBlLnV6c2FreW1hc19pZD11LnV6c2FreW1hc19pZCBXSEVSRSB1LmFwbW9rZXRhX2F0IElTIE5PVCBOVUxMIEFORCB1LnRlc3RpbmlzPTAgR1JPVVAgQlkgdS51enNha3ltYXNfaWQgSEFWSU5HIG1haXN0X2N0PjAgT1JERVIgQlkga2wsIGQiLEFSUkFZX0EpOwogICRLPWFycmF5KCk7IGZvcmVhY2goJHJvd3MgYXMgJHIpICRLWyRyWydrbCddXVtdPSRyOwogICRMSU09JzIwMjUtMDgtMzEnOyAkRz1hcnJheSgpOyAkQlI9YXJyYXkoKTsgJE1FTj1hcnJheSgpOwogICRiaz1mdW5jdGlvbigkZCl7IHJldHVybiAkZD09PW51bGw/J25lJzooJGQ8PTMwPyfiiaQzMCc6KCRkPD02MD8nMzEtNjAnOigkZDw9OTA/JzYxLTkwJzooJGQ8PTE4MD8nOTEtMTgwJzonPjE4MCcpKSkpOyB9OwogIGZvcmVhY2goJEsgYXMgJGtsPT4kTCl7ICRmPSRMWzBdOyBpZigkZlsnZCddPCcyMDI0LTAxLTAxJykgY29udGludWU7ICRmZD1zdHJ0b3RpbWUoJGZbJ2QnXSk7ICRuPWNvdW50KCRMKTsKICAgICRkMTI9JG4+PTI/KHN0cnRvdGltZSgkTFsxXVsnZCddKS0kZmQpLzg2NDAwOm51bGw7ICRnPSRmWydneXYnXT09J3N1byc/J3N1byc6KCRmWydneXYnXT09J2thdGUnPydrYXRlJzonLScpOyAkYj0kZlsnYnJlbmRhcyddPzonLSc7CiAgICAvLyBtxJduZXNpbyBSNjAgZGluYW1pa2EgKHBpcm1hcyBpa2kgMjAyNi0wNikKICAgIGlmKCRmWydkJ108PScyMDI2LTA2LTMwJyl7ICRtPXN1YnN0cigkZlsnZCddLDAsNyk7IGlmKCFpc3NldCgkTUVOWyRtXSkpJE1FTlskbV09YXJyYXkoJ2tsJz0+MCwncjYwJz0+MCk7ICRNRU5bJG1dWydrbCddKys7IGlmKCRkMTIhPT1udWxsJiYkZDEyPD02MCkkTUVOWyRtXVsncjYwJ10rKzsgfQogICAgaWYoJGZbJ2QnXT4kTElNKSBjb250aW51ZTsKICAgICRpbjEyPWFycmF5KCk7IGZvcmVhY2goJEwgYXMgJHgpeyBpZigoc3RydG90aW1lKCR4WydkJ10pLSRmZCkvODY0MDA8PTM2NSkgJGluMTJbXT0keDsgfSAkbT1jb3VudCgkaW4xMik7ICR2MTI9MDsgZm9yZWFjaCgkaW4xMiBhcyAkeCkkdjEyKz0keFsndmlzb19jdCddOwogICAgJGluMjQ9MDsgJHYyND0wOyBmb3JlYWNoKCRMIGFzICR4KXsgaWYoKHN0cnRvdGltZSgkeFsnZCddKS0kZmQpLzg2NDAwPD03MzApeyRpbjI0Kys7JHYyNCs9JHhbJ3Zpc29fY3QnXTt9IH0KICAgIGZvcmVhY2goYXJyYXkoJ3Zpc2knLCRnKSBhcyAkdCl7ICRrPSRiaygkZDEyKTsgaWYoIWlzc2V0KCRHWyR0XVska10pKSRHWyR0XVska109YXJyYXkoJ2tsJz0+MCwndXpzMTInPT4wLCd2MTInPT4wLCd0b3AnPT4wLCd2MjQnPT4wLCd1enMyNCc9PjApOyAkeD0mJEdbJHRdWyRrXTsgJHhbJ2tsJ10rKzsgJHhbJ3V6czEyJ10rPSRtOyAkeFsndjEyJ10rPSR2MTI7IGlmKCRtPj01KSR4Wyd0b3AnXSsrOyAkeFsndjI0J10rPSR2MjQ7ICR4Wyd1enMyNCddKz0kaW4yNDsgdW5zZXQoJHgpOyB9CiAgICBpZighaXNzZXQoJEJSWyRiXSkpJEJSWyRiXT1hcnJheSgna2wnPT4wLCdyNjAnPT4wLCdyMzAnPT4wLCd2MTJfNjAnPT4wLCduNjAnPT4wLCd2MTJfbmUnPT4wLCdubmUnPT4wKTsgJHg9JiRCUlskYl07ICR4WydrbCddKys7IGlmKCRkMTIhPT1udWxsJiYkZDEyPD02MCl7JHhbJ3I2MCddKys7ICR4Wyd2MTJfNjAnXSs9JHYxMjsgJHhbJ242MCddKys7fSBpZigkZDEyIT09bnVsbCYmJGQxMjw9MzApJHhbJ3IzMCddKys7IGlmKCRkMTI9PT1udWxsKXskeFsndjEyX25lJ10rPSR2MTI7JHhbJ25uZSddKys7fSB1bnNldCgkeCk7CiAgfQogIGZvcmVhY2goJEcgYXMgJHQ9PiRCKXsgZm9yZWFjaCgkQiBhcyAkaz0+JHgpICRvWydkMTJfZ3J1cGVzJ11bJHRdWyRrXT1hcnJheSgna2wnPT4keFsna2wnXSwncGN0Jz0+MCwndXpzMTInPT5yb3VuZCgkeFsndXpzMTInXS8keFsna2wnXSwyKSwndjEyJz0+cm91bmQoJHhbJ3YxMiddLyR4WydrbCddLzEwMCksJ3RvcF9wY3QnPT5yb3VuZCgkeFsndG9wJ10vJHhbJ2tsJ10qMTAwKSwndXpzMjQnPT5yb3VuZCgkeFsndXpzMjQnXS8keFsna2wnXSwyKSwndjI0Jz0+cm91bmQoJHhbJ3YyNCddLyR4WydrbCddLzEwMCkpOyAkdG90PTA7IGZvcmVhY2goJEIgYXMgJHgpJHRvdCs9JHhbJ2tsJ107IGZvcmVhY2goJEIgYXMgJGs9PiR4KSRvWydkMTJfZ3J1cGVzJ11bJHRdWyRrXVsncGN0J109cm91bmQoJHhbJ2tsJ10vJHRvdCoxMDAsMSk7IH0KICB1YXNvcnQoJEJSLGZ1bmN0aW9uKCRhLCRiKXtyZXR1cm4gJGJbJ2tsJ10tJGFbJ2tsJ107fSk7IGZvcmVhY2goYXJyYXlfc2xpY2UoJEJSLDAsMTIsdHJ1ZSkgYXMgJGI9PiR4KSAkb1sncjYwX2JyZW5kYXMnXVtdPWFycmF5KCdiJz0+JGIsJ2tsJz0+JHhbJ2tsJ10sJ3IzMCc9PnJvdW5kKCR4WydyMzAnXS8keFsna2wnXSoxMDApLCdyNjAnPT5yb3VuZCgkeFsncjYwJ10vJHhbJ2tsJ10qMTAwKSwndjEyX2plaTYwJz0+JHhbJ242MCddP3JvdW5kKCR4Wyd2MTJfNjAnXS8keFsnbjYwJ10vMTAwKTpudWxsLCd2MTJfamVpX25lJz0+JHhbJ25uZSddP3JvdW5kKCR4Wyd2MTJfbmUnXS8keFsnbm5lJ10vMTAwKTpudWxsKTsKICBrc29ydCgkTUVOKTsgZm9yZWFjaCgkTUVOIGFzICRtPT4keCkgJG9bJ3I2MF9tZW4nXVtdPWFycmF5KCdtJz0+JG0sJ2tsJz0+JHhbJ2tsJ10sJ3I2MCc9PnJvdW5kKCR4WydyNjAnXS8keFsna2wnXSoxMDApKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-165033';
const GKEY='ps_s1683c';
const PHASES=["GO"];
const OUT='analize/s1683_c.json';
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
