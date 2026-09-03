process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTAgcnVuIGUxMnMg4oCUIHJlY29uIDI6IFdDIFZlcmlmaWNhdGlvbkNvbnRyb2xsZXIga2FibGl1a2FpL2ZpbHRyYWk7IExQIGxwc2V0dGluZ3NfKiByZWlrxaFtxJdzICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX2UxMnMnXSkpIHJldHVybjsKICAkbz1hcnJheSgndic9PidydW4gZTEycycpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDI4MCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogIHRyeXsKICAgJGY9V1BfUExVR0lOX0RJUi4nL3dvb2NvbW1lcmNlL3NyYy9JbnRlcm5hbC9DdXN0b21lckVtYWlsVmVyaWZpY2F0aW9uL1ZlcmlmaWNhdGlvbkNvbnRyb2xsZXIucGhwJzsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGYpOwogICBpZihwcmVnX21hdGNoX2FsbCgnL2FkZF8oPzphY3Rpb258ZmlsdGVyKVxzKlwoW147XXswLDE2MH07LycsJHMsJG0pKSAkb1sndmNfaG9va3MnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiB0cmltKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJywkeCkpO30sJG1bMF0pOwogICBpZihwcmVnX21hdGNoX2FsbCgnL2FwcGx5X2ZpbHRlcnNccypcKFxzKltcJyJdKFteXCciXSspW1wnIl0vJywkcywkbSkpICRvWyd2Y19maWx0ZXJzJ109JG1bMV07CiAgIGlmKHByZWdfbWF0Y2goJy9mdW5jdGlvbiBzaG91bGRfc2hvd19wcm9tcHRccypcKFwpW157XSpceyguezAsMTIwMH0pL3MnLCRzLCRtKSkgJG9bJ3Nob3VsZF9zaG93J109dHJpbShwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsJG1bMV0pKTsKICAgaWYocHJlZ19tYXRjaF9hbGwoJy9jb25zdFxzKyhcdyspXHMqPVxzKihbXjtdKyk7LycsJHMsJG0pKXsgZm9yZWFjaCgkbVsxXSBhcyAkaT0+JGspICRvWyd2Y19jb25zdCddWyRrXT0kbVsyXVskaV07IH0KICAgJGQ9ZGlybmFtZSgkZik7IGZvcmVhY2goc2NhbmRpcigkZCkgYXMgJHgpeyBpZihzdWJzdHIoJHgsLTQpIT09Jy5waHAnKSBjb250aW51ZTsgJHNzPWZpbGVfZ2V0X2NvbnRlbnRzKCRkLicvJy4keCk7IGlmKHByZWdfbWF0Y2hfYWxsKCcvYXBwbHlfZmlsdGVyc1xzKlwoXHMqW1wnIl0oW15cJyJdKylbXCciXS8nLCRzcywkbSkpICRvWydkaXJfZmlsdGVycyddWyR4XT0kbVsxXTsgaWYocHJlZ19tYXRjaF9hbGwoJy9nZXRfb3B0aW9uXHMqXChccypbXCciXShbXlwnIl0rKVtcJyJdLycsJHNzLCRtKSkgJG9bJ2Rpcl9vcHRpb25zJ11bJHhdPSRtWzFdOyB9CiAgIGdsb2JhbCAkd3BfZmlsdGVyOyBmb3JlYWNoKGFycmF5KCd3b29jb21tZXJjZV9iZWZvcmVfYWNjb3VudF9vcmRlcnMnLCd3b29jb21tZXJjZV9hY2NvdW50X29yZGVyc19lbmRwb2ludCcsJ3dvb2NvbW1lcmNlX2JlZm9yZV9hY2NvdW50X29yZGVyc19wYWdpbmF0aW9uJykgYXMgJGgpeyAkb1snZ3l2aSddWyRoXT1hcnJheSgpOyBpZighZW1wdHkoJHdwX2ZpbHRlclskaF0pKXsgZm9yZWFjaCgkd3BfZmlsdGVyWyRoXS0+Y2FsbGJhY2tzIGFzICRwcj0+JGNicyl7IGZvcmVhY2goJGNicyBhcyAkY2IpeyAkZm49JGNiWydmdW5jdGlvbiddOyAkb1snZ3l2aSddWyRoXVtdPSRwci4nOiAnLihpc19hcnJheSgkZm4pPyhpc19vYmplY3QoJGZuWzBdKT9nZXRfY2xhc3MoJGZuWzBdKTokZm5bMF0pLic6OicuJGZuWzFdOihpc19zdHJpbmcoJGZuKT8kZm46J2Nsb3N1cmUnKSk7IH0gfSB9IH0KICAgJG9bJ2xwc2V0dGluZ3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSxvcHRpb25fdmFsdWUgRlJPTSB7JHB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdscHNldHRpbmdzJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJWxpdGh1YW5pYXBvc3Qlc2V0dGluZ3MlJyIsQVJSQVlfQSk7CiAgIGlmKGNsYXNzX2V4aXN0cygnV29vX0xpdGh1YW5pYXBvc3RfQWRtaW5fU2V0dGluZ3MnKSl7IGZvcmVhY2goYXJyYXkoJ2V2ZW50X3RvX3NlbmRfdHJhY2tpbmdfZW1haWwnLCdldmVudF90b19jaGFuZ2Vfc3RhdHVzX3RvX2NvbXBsZXRlZCcsJ3RyYWNraW5nX2RhdGFfc3luY19jb21wbGV0ZWQnKSBhcyAkayl7ICRvWydscF9nZXRfb3B0aW9uJ11bJGtdPVdvb19MaXRodWFuaWFwb3N0X0FkbWluX1NldHRpbmdzOjpnZXRfb3B0aW9uKCRrKTsgfSAkcj1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnV29vX0xpdGh1YW5pYXBvc3RfQWRtaW5fU2V0dGluZ3MnLCdnZXRfb3B0aW9uJyk7ICRvWydscF9nZXRfb3B0aW9uX3NyYyddPXRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLGltcGxvZGUoJycsYXJyYXlfc2xpY2UoZmlsZSgkci0+Z2V0RmlsZU5hbWUoKSksJHItPmdldFN0YXJ0TGluZSgpLTEsJHItPmdldEVuZExpbmUoKS0kci0+Z2V0U3RhcnRMaW5lKCkrMSkpKSk7IH0KICAgJGZzPVdQX1BMVUdJTl9ESVIuJy93b28tbGl0aHVhbmlhcG9zdC1tYWluJzsgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZnMpKTsgZm9yZWFjaCgkaXQgYXMgJGZsKXsgaWYoYmFzZW5hbWUoJGZsKSE9PSdjbGFzcy13b28tbGl0aHVhbmlhcG9zdC1hZG1pbi1zZXR0aW5ncy5waHAnKSBjb250aW51ZTsgJHNzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmbCk7IGlmKHByZWdfbWF0Y2hfYWxsKCcvLnswLDYwfSg/OmV2ZW50X3RvX3NlbmRfdHJhY2tpbmdfZW1haWx8ZXZlbnRfdG9fY2hhbmdlX3N0YXR1c190b19jb21wbGV0ZWQpLnswLDQwMH0vcycsJHNzLCRtKSkgJG9bJ2xwX3NldHRpbmdzX2N0eCddPWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIHRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCR4KSk7fSwkbVswXSk7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-203840';
const GKEY='ps_e12s';
const PHASES=["S"];
const OUT='analize/e12_run2s.json';
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
