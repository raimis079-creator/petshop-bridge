process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODlzIHQg4oCUIERJQUdOT1rEljogxaFpYW5kaWVub3MgdcW+c2FreW1haSwgcGlsdHV2YXMgcGVyIHZhbGFuZGFzLCBrbGFpZG9zLCBtb2vEl2ppbWFpLiBSZWFkLW9ubHkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjg5c3QnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOyAkd3BkYi0+c3VwcHJlc3NfZXJyb3JzKHRydWUpOwogICRvWydkYWJhciddPWN1cnJlbnRfdGltZSgnbXlzcWwnKTsKICAkb1sndXpzX3NpYW5kaWVuJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsIHN0YXR1cywgcGF5bWVudF9tZXRob2QgcG0sIFJPVU5EKHRvdGFsX2Ftb3VudCwyKSB0LCBkYXRlX2NyZWF0ZWRfZ210IGMgRlJPTSB7JHB9d2Nfb3JkZXJzIFdIRVJFIHR5cGU9J3Nob3Bfb3JkZXInIEFORCBkYXRlX2NyZWF0ZWRfZ210Pj1VVENfREFURSgpIC0gSU5URVJWQUwgMyBIT1VSIE9SREVSIEJZIGlkIixBUlJBWV9BKTsKICAkb1sndXpzXzdkJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgREFURShDT05WRVJUX1RaKGRhdGVfY3JlYXRlZF9nbXQsJyswMDowMCcsJyswMzowMCcpKSBkLCBDT1VOVCgqKSBuLCBTVU0oc3RhdHVzIElOICgnd2MtcHJvY2Vzc2luZycsJ3djLWNvbXBsZXRlZCcsJ3djLW9uLWhvbGQnKSkgb2sgRlJPTSB7JHB9d2Nfb3JkZXJzIFdIRVJFIHR5cGU9J3Nob3Bfb3JkZXInIEFORCBkYXRlX2NyZWF0ZWRfZ210Pj1OT1coKS1JTlRFUlZBTCA4IERBWSBHUk9VUCBCWSBkIixBUlJBWV9BKTsKICAkb1sncGFza3V0aW5pc19vayddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgaWQsIHN0YXR1cywgZGF0ZV9jcmVhdGVkX2dtdCBGUk9NIHskcH13Y19vcmRlcnMgV0hFUkUgdHlwZT0nc2hvcF9vcmRlcicgQU5EIHN0YXR1cyBJTiAoJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnLCd3Yy1vbi1ob2xkJykgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIixBUlJBWV9BKTsKICAkVz0ieyRwfXBzX3dlYl9pdnlraWFpIjsKICAkb1snaXZ5a2lhaV92YWwnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBIT1VSKGxhaWthcykgaCwgQ09VTlQoRElTVElOQ1Qgc2VzaWphKSBzZXMsIFNVTSh0aXBhcz0nYWRkX3RvX2NhcnQnKSBjYXJ0LCBTVU0odGlwYXM9J2JlZ2luX2NoZWNrb3V0JykgY2hrLCBTVU0odGlwYXM9J3ZpZXdfaXRlbScpIHZpIEZST00gJFcgV0hFUkUgdGVzdGluaXM9MCBBTkQgZGllbmE9Q1VSREFURSgpIEdST1VQIEJZIGggT1JERVIgQlkgaCIsQVJSQVlfQSk7CiAgJG9bJ2l2eWtpYWlfdmFrYXJfaWtpX2RhYmFyJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBDT1VOVChESVNUSU5DVCBzZXNpamEpIHNlcywgU1VNKHRpcGFzPSdhZGRfdG9fY2FydCcpIGNhcnQsIFNVTSh0aXBhcz0nYmVnaW5fY2hlY2tvdXQnKSBjaGsgRlJPTSAkVyBXSEVSRSB0ZXN0aW5pcz0wIEFORCBkaWVuYT1DVVJEQVRFKCktSU5URVJWQUwgMSBEQVkgQU5EIFRJTUUobGFpa2FzKTw9Q1VSVElNRSgpIixBUlJBWV9BKTsKICAkb1snaXZ5a2lhaV9zaWFuZGllbiddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoRElTVElOQ1Qgc2VzaWphKSBzZXMsIFNVTSh0aXBhcz0nYWRkX3RvX2NhcnQnKSBjYXJ0LCBTVU0odGlwYXM9J2JlZ2luX2NoZWNrb3V0JykgY2hrIEZST00gJFcgV0hFUkUgdGVzdGluaXM9MCBBTkQgZGllbmE9Q1VSREFURSgpIixBUlJBWV9BKTsKICAkb1sna2FuYWxhaV9zaWFuZGllbiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGthbmFsYXMsIENPVU5UKERJU1RJTkNUIHNlc2lqYSkgc2VzIEZST00gJFcgV0hFUkUgdGVzdGluaXM9MCBBTkQgZGllbmE9Q1VSREFURSgpIEdST1VQIEJZIGthbmFsYXMgT1JERVIgQlkgc2VzIERFU0MiLEFSUkFZX0EpOwogICRvWydzYXJnYXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBsYWlrYXMsIGx5Z2lzLCBMRUZUKHppbnV0ZSwxNjApIHosIGtpZWsgRlJPTSB7JHB9cHNfc2FyZ2FzX2tsYWlkb3MgV0hFUkUgbGFpa2FzPj1DVVJEQVRFKCkgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxMCIsQVJSQVlfQSk7CiAgJGxvZz1kaXJuYW1lKEFCU1BBVEgpLicvbG9ncy9waHBfZXJyb3IubG9nJzsgaWYoaXNfcmVhZGFibGUoJGxvZykpeyAkZj1mb3BlbigkbG9nLCdyJyk7IGZzZWVrKCRmLC1taW4oZmlsZXNpemUoJGxvZyksMzAwMDAwKSxTRUVLX0VORCk7ICR0PWZyZWFkKCRmLDMwMDAwMCk7IGZjbG9zZSgkZik7ICRkPWRhdGUoJ2QtTS1ZJyk7ICRMPWFycmF5X2ZpbHRlcihleHBsb2RlKCJcbiIsJHQpLGZ1bmN0aW9uKCRsKXVzZSgkZCl7cmV0dXJuIHN0cnBvcygkbCwkZCkhPT1mYWxzZSAmJiBwcmVnX21hdGNoKCcvRmF0YWx8UGFyc2V8VW5jYXVnaHR8cGF5c2VyYXxjaGVja291dC9pJywkbCk7fSk7ICRvWydsb2dfc3ZhcmJ1J109YXJyYXlfc2xpY2UoYXJyYXlfbWFwKGZ1bmN0aW9uKCRsKXtyZXR1cm4gc3Vic3RyKCRsLDAsMjIwKTt9LGFycmF5X3ZhbHVlcygkTCkpLC04KTsgfQogICRvWyd3Y19sb2dfcGF5c2VyYSddPWFycmF5KCk7IGZvcmVhY2goZ2xvYihXUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvd2MtbG9ncy8qJy5kYXRlKCdZLW0tZCcpLicqJyk/OmFycmF5KCkgYXMgJGYpeyAkb1snd2NfbG9ncyddW2Jhc2VuYW1lKCRmKV09ZmlsZXNpemUoJGYpOyBpZihwcmVnX21hdGNoKCcvZmF0YWx8cGF5c2VyYS9pJywkZikpICRvWyd3Y19sb2dfcGF5c2VyYSddW2Jhc2VuYW1lKCRmKV09c3Vic3RyKGZpbGVfZ2V0X2NvbnRlbnRzKCRmKSwtNjAwKTsgfQogICRvWydndyddPWFycmF5KCk7IGZvcmVhY2goV0MoKS0+cGF5bWVudF9nYXRld2F5cygpLT5nZXRfYXZhaWxhYmxlX3BheW1lbnRfZ2F0ZXdheXMoKSBhcyAkaWQ9PiRnKSRvWydndyddW109JGlkOyAkb1snc2hpcHBpbmdfem9uZXMnXT1jb3VudChXQ19TaGlwcGluZ19ab25lczo6Z2V0X3pvbmVzKCkpOwogICRvWydhZHNfdmFrYXInXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBkaWVuYSwgUk9VTkQoU1VNKGlzbGFpZG9zX2N0KS8xMDAsMikgaXNsLCBTVU0ocGFzcGF1ZGltYWkpIGNsIEZST00geyRwfXBzX2Zha3RfcmVrbGFtYSBXSEVSRSBkaWVuYT49Q1VSREFURSgpLUlOVEVSVkFMIDMgREFZIEdST1VQIEJZIGRpZW5hIixBUlJBWV9BKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-150756';
const GKEY='ps_s1689st';
const PHASES=["GO"];
const OUT='analize/s1689s_t.json';
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
