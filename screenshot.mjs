process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA3YzMgTDMgcGF0aWtyYSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MDdjMyddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTYwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkSz0kUC4ncHNfcmVsYXVuY2hfa29udGFrdGFpJzsgJHI9Wyd2Jz0+J2MzJywnZGFiYXInPT5jdXJyZW50X3RpbWUoJ215c3FsJyldOwogICR0b2s9UGV0c2hvcF9TZW5kZXJfQWRhcHRlcjo6Z2V0X3N0b3JlZF90b2tlbignbWFya2V0aW5nJyk7ICRhcGk9ZnVuY3Rpb24oJHApIHVzZSgkdG9rKXsgJHg9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9hcGkuc2VuZGVyLm5ldC92MicuJHAsWyd0aW1lb3V0Jz0+MjUsJ2hlYWRlcnMnPT5bJ0F1dGhvcml6YXRpb24nPT4nQmVhcmVyICcuJHRvaywnQWNjZXB0Jz0+J2FwcGxpY2F0aW9uL2pzb24nXV0pOyByZXR1cm4ganNvbl9kZWNvZGUod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHgpLHRydWUpOyB9OwogICRvPWdldF9vcHRpb24oJ3BzX3JlbGF1bmNoX2wzJyk7IGZvcmVhY2goWydzdW8nLCdrYXRlJ10gYXMgJGspeyAkZD0kYXBpKCcvY2FtcGFpZ25zLycuJG9bJGtdKVsnZGF0YSddPz9bXTsgJHJbJ2thbXAnXVska109WydzZW50Jz0+JGRbJ3NlbnRfY291bnQnXT8/bnVsbCwnb3BlbnMnPT4kZFsnb3BlbnMnXT8/bnVsbCwnY2xpY2tzJz0+JGRbJ2NsaWNrcyddPz9udWxsLCdib3VuY2VzJz0+JGRbJ2JvdW5jZXNfY291bnQnXT8/bnVsbF07IH0KICAkZW09JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgTE9XRVIoZW1haWwpIGUscnVzaXMgRlJPTSAkSyBXSEVSRSBiYW5nYT0nMyciLE9CSkVDVF9LKTsgJHN0PVtdOyAkcGc9MTsgZG97ICRiPSRhcGkoJy9zdWJzY3JpYmVycz9saW1pdD0xMDAmcGFnZT0nLiRwZyk7IGZvcmVhY2goKGFycmF5KSgkYlsnZGF0YSddPz9bXSkgYXMgJHMpeyAkZT1zdHJ0b2xvd2VyKCRzWydlbWFpbCddPz8nJyk7IGlmKCFpc3NldCgkZW1bJGVdKSkgY29udGludWU7ICRrPSRlbVskZV0tPnJ1c2lzLid8Jy4oJHNbJ3N0YXR1cyddWydlbWFpbCddPz8nPycpOyAkc3RbJGtdPSgkc3RbJGtdPz8wKSsxOyB9ICRsYXN0PSRiWydtZXRhJ11bJ2xhc3RfcGFnZSddPz8xOyAkcGcrKzsgfSB3aGlsZSgkcGc8PSRsYXN0JiYkcGc8ODApOyBrc29ydCgkc3QpOyAkclsnYnVzZW5vcyddPSRzdDsKICBmb3JlYWNoKFsnMycsJ0gzJ10gYXMgJGIpeyAkclsnYiddWyRiXT0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIChTRUxFQ1QgQ09VTlQoKikgRlJPTSAkSyBXSEVSRSBiYW5nYT0lcykgbiwoU0VMRUNUIFNVTShhdGlkYXJlX24+MCkgRlJPTSAkSyBXSEVSRSBiYW5nYT0lcykgYXRpZCwoU0VMRUNUIFNVTShrbGlrX24+MCkgRlJPTSAkSyBXSEVSRSBiYW5nYT0lcykga2xpaywgQ09VTlQoRElTVElOQ1Qgby5pZCkgdXpzLCBST1VORChTVU0oby50b3RhbF9hbW91bnQpLDIpIGV1ciBGUk9NICRLIGsgSk9JTiB7JFB9d2Nfb3JkZXJzIG8gT04gTE9XRVIoby5iaWxsaW5nX2VtYWlsKT1MT1dFUihrLmVtYWlsKSBXSEVSRSBrLmJhbmdhPSVzIEFORCBvLnR5cGU9J3Nob3Bfb3JkZXInIEFORCBvLnN0YXR1cyBJTignd2MtcHJvY2Vzc2luZycsJ3djLWNvbXBsZXRlZCcsJ3djLW9uLWhvbGQnKSBBTkQgby5kYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0xMS0wMyAwNzozMTowMCciLCRiLCRiLCRiLCRiKSxBUlJBWV9BKTsgfQogICRyWydrbGlrX3V0bSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBhc2tfdXRtLENPVU5UKCopIG4gRlJPTSAkSyBXSEVSRSBiYW5nYT0nMycgQU5EIGtsaWtfbj4wIEdST1VQIEJZIHBhc2tfdXRtIixBUlJBWV9BKTsKICAkclsnTDJfdXpzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgay5iYW5nYSxDT1VOVChESVNUSU5DVCBvLmlkKSB1enMsUk9VTkQoU1VNKG8udG90YWxfYW1vdW50KSwyKSBldXIgRlJPTSAkSyBrIEpPSU4geyRQfXdjX29yZGVycyBvIE9OIExPV0VSKG8uYmlsbGluZ19lbWFpbCk9TE9XRVIoay5lbWFpbCkgV0hFUkUgay5iYW5nYSBJTignMmEnLCcyYicsJzJjJywnSDJhJywnSDJiJywnSDJjJykgQU5EIG8udHlwZT0nc2hvcF9vcmRlcicgQU5EIG8uc3RhdHVzIElOKCd3Yy1wcm9jZXNzaW5nJywnd2MtY29tcGxldGVkJywnd2Mtb24taG9sZCcpIEFORCBvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTEwLTI4IDE2OjI1OjAwJyBHUk9VUCBCWSBrLmJhbmdhIixBUlJBWV9BKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDEpOwo=';
const VER='dep-150159';
const GKEY='ps_s1807c3';
const PHASES=["1"];
const OUT='analize/s1807_c3.json';
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
