process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzU2YiAxMC0wNiBkaWVuYTogcm9ib3RhaSBwcmllcy9wbyBDRiB0YWlzeWtsZXMgMDMgKDExOjEwKSwgc3RhdHVzYWksICsgZmF0YWwgbnVvIDEwLTA2LCBsYWlza2FpLCBBSSwgYXR2aXJpIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc1NmInXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE3MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzU2YiddOwogIHRyeXsKICAkZG9tPWRpcm5hbWUoQUJTUEFUSCkuJy9sb2dzJzsgJGZsPVtdOyBmb3JlYWNoKChhcnJheSlnbG9iKCRkb20uJy8qLnRhci5neionKSBhcyAkZil7ICRtPWZpbGVtdGltZSgkZik7IGlmKCRtPj1zdHJ0b3RpbWUoJzIwMjYtMTAtMDYgMDA6MDAgVVRDJykgJiYgJG08PXN0cnRvdGltZSgnMjAyNi0xMC0wNyAwNjowMCBVVEMnKSkgJGZsW109JGY7IH0gJHJbJ2ZhaWxhaSddPWFycmF5X21hcCgnYmFzZW5hbWUnLCRmbCk7CiAgJEJMSz1bJ21ldGEtZXh0ZXJuYWxhZ2VudCcsJ01ldGEtRXh0ZXJuYWxBZ2VudCcsJ0JhaWR1c3BpZGVyJywnQW1hem9uYm90JywnUGV0YWxCb3QnLCd0cGhvdG9ib3QnLCdSZWZsZWN0aW9uYm90JywnRXhhU2VhcmNoQm90JywnS2VlbmFibGVCb3QnLCd3ZWJhcHAtbWFwcGVyJywnQnl0ZXNwaWRlcicsJ1NlbXJ1c2hCb3QnLCdTRVJhbmtpbmcnLCdEb3RCb3QnLCdBaHJlZnNCb3QnLCdEYXRhRm9yU2VvQm90JywnTUoxMmJvdCddOwogICRHT09EPVsnR29vZ2xlYm90Jz0+J0dvb2dsZWJvdCcsJ0Fkc0JvdC1Hb29nbGUnPT4nQWRzQm90JywnR29vZ2xlT3RoZXInPT4nR29vZ2xlT3RoZXInLCdiaW5nYm90Jz0+J0JpbmcnLCdBcHBsZWJvdCc9PidBcHBsZScsJ0NoYXRHUFQtVXNlcic9PidDaGF0R1BUJywnR1BUQm90Jz0+J0NoYXRHUFQnLCdPQUktU2VhcmNoQm90Jz0+J0NoYXRHUFQnLCdQZXJwbGV4aXR5Qm90Jz0+J1BlcnBsZXhpdHknLCdQZXJwbGV4aXR5LVVzZXInPT4nUGVycGxleGl0eScsJ0NsYXVkZUJvdCc9PidDbGF1ZGUnLCdDbGF1ZGUtVXNlcic9PidDbGF1ZGUnLCdmYWNlYm9va2V4dGVybmFsaGl0Jz0+J0ZCIHBlcnppdXJvcycsJ0R1Y2tEdWNrQm90Jz0+J0R1Y2tEdWNrR28nLCdZYW5kZXhCb3QnPT4nWWFuZGV4J107CiAgJG49MDsgJHBvPTA7ICRibGtfcHJpZXM9MDsgJGJsa19wbz0wOyAkYmxrX3BvX3VhPVtdOyAkZ29vZD1bXTsgJHN0PVtdOyAkc3RfcG89W107CiAgZm9yZWFjaCgkZmwgYXMgJGYpeyAkaD1AZ3pvcGVuKCRmLCdyYicpOyBpZighJGgpIGNvbnRpbnVlOyBnenJlYWQoJGgsNTEyKTsKICAgIHdoaWxlKCgkbG49Z3pnZXRzKCRoLDE2Mzg0KSkhPT1mYWxzZSl7IGlmKHN0cnBvcygkbG4sJ1swNi9PY3QvMjAyNjonKT09PWZhbHNlKSBjb250aW51ZTsgaWYoIXByZWdfbWF0Y2goJy9cWzA2XC9PY3RcLzIwMjY6KFxkXGQpOihcZFxkKVteXF1dKlxdICJbXiJdKiIgKFxkezN9KSBcUysgIlteIl0qIiAiKFteIl0qKSIvJywkbG4sJG0pKSBjb250aW51ZTsgJG4rKzsKICAgICAgJHBvX2Y9KChpbnQpJG1bMV0qNjArKGludCkkbVsyXSk+PSgxMSo2MCsxMCk7IGlmKCRwb19mKSAkcG8rKzsKICAgICAgJHM9JG1bM107ICRzdFskc109KCRzdFskc10/PzApKzE7IGlmKCRwb19mKSAkc3RfcG9bJHNdPSgkc3RfcG9bJHNdPz8wKSsxOwogICAgICAkdT0kbVs0XTsgJGI9bnVsbDsgZm9yZWFjaCgkQkxLIGFzICR6KXsgaWYoc3RycG9zKCR1LCR6KSE9PWZhbHNlKXsgJGI9JHo7IGJyZWFrOyB9IH0KICAgICAgaWYoJGIpeyBpZigkcG9fZil7ICRibGtfcG8rKzsgJGJsa19wb191YVskYl09KCRibGtfcG9fdWFbJGJdPz8wKSsxOyB9IGVsc2UgJGJsa19wcmllcysrOyBjb250aW51ZTsgfQogICAgICBmb3JlYWNoKCRHT09EIGFzICR6PT4kayl7IGlmKHN0cnBvcygkdSwkeikhPT1mYWxzZSl7ICRnb29kWyRrXT0oJGdvb2RbJGtdPz8wKSsxOyBicmVhazsgfSB9IH0gZ3pjbG9zZSgkaCk7IH0KICBhcnNvcnQoJGdvb2QpOyBmb3JlYWNoKFsnNDAzJywnNTAwJywnMzAyJywnNDA0JywnMjAwJ10gYXMgJGspeyAkclsnc3RhdHVzYWknXVska109WyRzdFska10/PzAsJHN0X3BvWyRrXT8/MF07IH0KICAkcis9WydlaWwnPT4kbiwncG9fMTExMCc9PiRwbywnYmxrX2lraV8xMTEwJz0+JGJsa19wcmllcywnYmxrX3BvXzExMTAnPT4kYmxrX3BvLCdibGtfcG9fa2FzJz0+JGJsa19wb191YSwnZ2VyaV9yb2JvdGFpJz0+JGdvb2RdOwogIC8vIGZhdGFsIG51byAxMC0wNgogICRsb2c9ZGlybmFtZShBQlNQQVRIKS4nL2xvZ3MvcGhwX2Vycm9yLmxvZyc7ICRmaD1AZm9wZW4oJGxvZywncicpOyBpZigkZmgpeyBmc2VlaygkZmgsLTMwMDAwMDAsU0VFS19FTkQpOyAkdD1mcmVhZCgkZmgsMzAwMDAwMCk7IGZjbG9zZSgkZmgpOyAkZng9W107IGZvcmVhY2goZXhwbG9kZSgiXG4iLCR0KSBhcyAkbCl7IGlmKHByZWdfbWF0Y2goJy9eXFsoMFs2LTddLU9jdC0yMDI2W15cXV0qKVxdIFBIUCAoRmF0YWx8UGFyc2UpLycsJGwsJG1tKSkgJGZ4W109bWJfc3Vic3RyKCRsLDAsMjAwKTsgfSAkclsnZmF0YWxfbnVvXzEwMDYnXT1jb3VudCgkZngpOyAkclsnZmF0YWxfcHZ6J109YXJyYXlfc2xpY2UoJGZ4LC0zKTsgfQogIC8vIGxhaXNrYWkgbnVvIDEwLTA2CiAgJFQ9JFAuJ3BzX2VtYWlsX2pvYnMnOyAkRDA9JzIwMjYtMTAtMDUgMjE6MDA6MDAnOwogICRyWydsYWlza2FpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgREFURShzZW50X2F0K0lOVEVSVkFMIDMgSE9VUikgZCwgQ09VTlQoKikgbiBGUk9NICRUIFdIRVJFIHN0YXR1cz0nc2VudCcgQU5EIHNlbnRfYXQ+PSckRDAnIEdST1VQIEJZIDEiLEFSUkFZX0EpOwogICRyWydsYWlza2FpX3Byb2JsZW0nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkVCBXSEVSRSBzdGF0dXMgSU4oJ3VuY2VydGFpbicsJ3NlbmRpbmcnLCdmYWlsZWQnKSBPUiAodXBkYXRlZF9hdD49JyREMCcgQU5EIENPQUxFU0NFKGxhc3RfZXJyb3IsJycpPD4nJyBBTkQgZmxvdzw+J3BzX3MxNzQ5X3Rlc3RhcycpIik7CiAgJHJbJ2xhaXNrYWlfZHVibCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIChTRUxFQ1QgcmVjaXBpZW50X2VtYWlsLGpvYl9rZXksQ09VTlQoKikgYyBGUk9NICRUIFdIRVJFIHN0YXR1cz0nc2VudCcgQU5EIHNlbnRfYXQ+PSckRDAnIEdST1VQIEJZIDEsMiBIQVZJTkcgYz4xKSB4Iik7CiAgJFU9JFAuJ3BzX2Zha3RfdXpzYWt5bWFpJzsKICAkclsna2FuYWxhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEUoc3VrdXJ0YV9hdCtJTlRFUlZBTCAzIEhPVVIpIGQsIGthbmFsYXNfcGFza3V0aW5pcyBrLCBDT1VOVCgqKSBuLCBST1VORChTVU0odmlzb19jdCkvMTAwKSBldXIgRlJPTSAkVSBXSEVSRSB0ZXN0aW5pcz0wIEFORCBzdWt1cnRhX2F0Pj0nJEQwJyBBTkQgc3RhdHVzYXNfZ2FsdXRpbmlzIE5PVCBJTignY2FuY2VsbGVkJywnZmFpbGVkJywncmVmdW5kZWQnLCdwZW5kaW5nJykgR1JPVVAgQlkgMSwyIE9SREVSIEJZIDEsMyBERVNDIixBUlJBWV9BKTsKICAvLyBtacWhcsWrcyAxMC0wMy8wNAogIGZvcmVhY2god2NfZ2V0X29yZGVycyhbJ2xpbWl0Jz0+NDAsJ3R5cGUnPT4nc2hvcF9vcmRlcicsJ2RhdGVfY3JlYXRlZCc9PnN0cnRvdGltZSgnMjAyNi0xMC0wMyAwNjowMCBVVEMnKS4nLi4uJy5zdHJ0b3RpbWUoJzIwMjYtMTAtMDQgMDg6MDAgVVRDJyldKSBhcyAkbyl7IGlmKCFpbl9hcnJheSgkby0+Z2V0X29yZGVyX251bWJlcigpLFsnMTI2MicsJzEyNjUnLCcxMjY5JywnMTI3MCddLHRydWUpKSBjb250aW51ZTsgJG50PScnOyBmb3JlYWNoKHdjX2dldF9vcmRlcl9ub3RlcyhbJ29yZGVyX2lkJz0+JG8tPmdldF9pZCgpLCdsaW1pdCc9PjFdKSBhcyAkeCkgJG50PSR4LT5kYXRlX2NyZWF0ZWQtPmRhdGUoJ20tZCBIOmknKS4nICcubWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCR4LT5jb250ZW50KSwwLDkwKTsgJHJbJ21pc3J1cyddWyRvLT5nZXRfb3JkZXJfbnVtYmVyKCldPVskby0+Z2V0X3N0YXR1cygpLCRudF07IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9KTsK';
const VER='dep-171147';
const GKEY='ps_s1756b';
const PHASES=["1"];
const OUT='out/s1756_b.json';
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
