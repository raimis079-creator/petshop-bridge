process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzYgcnVuIGsg4oCUIFNLVUJVUyBSRUFELU9OTFk6IGthdGVnb3JpanUgcGF2ZWlrc2x1IGRpYWdub3N0aWthIChpbWcgc3JjLCBIVFRQLCB0aHVtYm5haWwgbWV0YSwgZGVidWcubG9nLCBjYWNoZSwgbW9kYWxvIGJ1a2xlKS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2MzZrJ10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4nUzE2MzYgaycpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDEyMCk7CiAgJEo9ZnVuY3Rpb24oJG8peyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7IH07CiAgdHJ5ewogICRvWyd3bV9tZDUnXT1tZDVfZmlsZShXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2luY2x1ZGVzL2NsYXNzLXdlbGNvbWUtbW9kYWwucGhwJyk7CiAgJG9bJ3dtX29wdCddPWdldF9vcHRpb24oJ3BldHNob3Bfd2VsY29tZV9tb2RhbF9lbmFibGVkJyk7CiAgJGg9KHN0cmluZyl3cF9yZW1vdGVfcmV0cmlldmVfYm9keSh3cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvP3BzX25vY2FjaGU9Jy50aW1lKCkpLGFycmF5KCd0aW1lb3V0Jz0+NDAsJ3NzbHZlcmlmeSc9PmZhbHNlKSkpOwogICRvWydodG1sX2lsZ2lzJ109c3RybGVuKCRoKTsgJG9bJ3Bzd195cmEnXT0oaW50KShzdHJwb3MoJGgsJ2lkPSJwc3ciJykhPT1mYWxzZSk7CiAgLy8ga2F0ZWdvcmlqdSBibG9rYXMKICBpZihwcmVnX21hdGNoKCcvUGFncmluZGluxJdzIGthdGVnb3Jpam9zKC57MCw0MDAwfSkvc3UnLCRoLCRtKT09PWZhbHNlKXt9CiAgJGJsaz0nJzsgJHBvcz1tYl9zdHJwb3MoJGgsJ1BhZ3JpbmRpbicpOyBpZigkcG9zIT09ZmFsc2UpICRibGs9bWJfc3Vic3RyKCRoLCRwb3MsNTAwMCk7CiAgcHJlZ19tYXRjaF9hbGwoJy88aW1nW14+XSs+L2knLCRibGssJGltZ3MpOwogICRvWydrYXRfaW1nX24nXT1jb3VudCgkaW1nc1swXSk7ICRvWydrYXRfaW1nX3B2eiddPWFycmF5X3NsaWNlKGFycmF5X21hcChmdW5jdGlvbigkdCl7cmV0dXJuIG1iX3N1YnN0cigkdCwwLDMwMCk7fSwkaW1nc1swXSksMCwzKTsKICAvLyBwaXJtbyBpbWcgc3JjIEhUVFAKICBpZihwcmVnX21hdGNoKCcvc3JjPSIoW14iXSspIi8nLCRpbWdzWzBdWzBdPz8nJywkbW0pKXsKICAgICRyPXdwX3JlbW90ZV9oZWFkKCRtbVsxXSxhcnJheSgndGltZW91dCc9PjIwLCdzc2x2ZXJpZnknPT5mYWxzZSkpOwogICAgJG9bJ2ltZzFfc3JjJ109JG1tWzFdOyAkb1snaW1nMV9odHRwJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpOwogIH0KICAvLyBhciBsYXp5IChkYXRhLXNyYyk/CiAgJG9bJ2RhdGFfc3JjX2Jsb2tlJ109KGludClwcmVnX21hdGNoKCcvZGF0YS1zcmM9LycsJGJsayk7CiAgLy8gSlMga2xhaWR1IHNhbHRpbmlzPyBwYXppdXJpbSBhciBwc3cgc2NyaXB0IHlyYSBzdmVjaXVpIChuZXR1cmkgYnV0aSwgb3B0PTApCiAgJG9bJ3Bzd19zY3JpcHQnXT0oaW50KShzdHJwb3MoJGgsJ3Bzdy1vdicpIT09ZmFsc2UpOwogIC8vIGRlYnVnLmxvZyB1b2RlZ2EKICAkZGw9V1BfQ09OVEVOVF9ESVIuJy9kZWJ1Zy5sb2cnOyAkb1snZGVidWdfbG9nJ109ZmlsZV9leGlzdHMoJGRsKT9hcnJheSgnZHlkaXMnPT5maWxlc2l6ZSgkZGwpLCd1b2RlZ2EnPT5hcnJheV9zbGljZShhcnJheV9maWx0ZXIoZXhwbG9kZSgiXG4iLChzdHJpbmcpZmlsZV9nZXRfY29udGVudHMoJGRsKSkpLCAtNikpOiduZXJhJzsKICAvLyBzdXBlci1jYWNoZQogICRvWyd3cF9jYWNoZSddPWRlZmluZWQoJ1dQX0NBQ0hFJyk/V1BfQ0FDSEU6Jz8nOwogICRjZD1XUF9DT05URU5UX0RJUi4nL2NhY2hlL3N1cGVyY2FjaGUvJzsgJG9bJ3N1cGVyY2FjaGVfZGlycyddPWlzX2RpcigkY2QpP2FycmF5X3NsaWNlKHNjYW5kaXIoJGNkKSwyLDYpOiduZXJhJzsKICAvLyBrYXRlZ29yaWp1IHRlcm1pbnUgdGh1bWJuYWlsIG1ldGEKICAkdHM9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdC50ZXJtX2lkLHQubmFtZSx0bS5tZXRhX3ZhbHVlIHRodW1iIEZST00geyRwfXRlcm1zIHQgSk9JTiB7JHB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX2lkPXQudGVybV9pZCBBTkQgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JyBBTkQgdHQucGFyZW50PTAgTEVGVCBKT0lOIHskcH10ZXJtbWV0YSB0bSBPTiB0bS50ZXJtX2lkPXQudGVybV9pZCBBTkQgdG0ubWV0YV9rZXk9J3RodW1ibmFpbF9pZCcgT1JERVIgQlkgdC5uYW1lIExJTUlUIDEyIixPQkpFQ1QpOwogIGZvcmVhY2goJHRzIGFzICRyKXsgJGF0dD0oaW50KSRyLT50aHVtYjsgJHVybD0kYXR0P3dwX2dldF9hdHRhY2htZW50X3VybCgkYXR0KTonJzsgJGZ4PSRhdHQ/KGludClmaWxlX2V4aXN0cyhnZXRfYXR0YWNoZWRfZmlsZSgkYXR0KSk6LTE7ICRvWydrYXRfdGVybWluYWknXVtdPSRyLT5uYW1lLicgfCB0aHVtYj0nLiRhdHQuJyB8IGZhaWxfeXJhPScuJGZ4LicgfCAnLm1iX3N1YnN0cigoc3RyaW5nKSR1cmwsLTYwKTsgfQogIC8vIHBhc2t1dGluaWFpIHBha2Vpc3RpIGZhaWxhaSB1cGxvYWRzIChhciBrYXMgdHJpbmE/KQogICRvWydzbmlwcGV0c19ha3R5dnVzJ109JHdwZGItPmdldF9jb2woIlNFTEVDVCBuYW1lIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0xIEFORCBuYW1lIExJS0UgJ1RFTVAlJyIpOwogICRKKCRvKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLmJhc2VuYW1lKCRlLT5nZXRGaWxlKCkpLic6Jy4kZS0+Z2V0TGluZSgpOyAkSigkbyk7IH0KfSw5OSk7Cg==';
const VER='dep-155548';
const GKEY='ps_s1636k';
const PHASES=["K"];
const OUT='analize/s1636_k.json';
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
