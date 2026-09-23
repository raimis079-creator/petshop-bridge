process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzA2bSddKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJHI9W107CiAgJHE9ZnVuY3Rpb24oJGssJHNxbCkgdXNlKCYkciwkd3BkYil7ICRyWyRrXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHNxbCxBUlJBWV9BKTsgaWYoJHdwZGItPmxhc3RfZXJyb3IpICRyWyRrLidfZXJyJ109JHdwZGItPmxhc3RfZXJyb3I7IH07CiAgJHEoJ3Bvc3RzJywiU0VMRUNUIElELHBvc3RfbmFtZSxwb3N0X3RpdGxlLExFTkdUSChwb3N0X2NvbnRlbnQpIGxlbixwb3N0X2RhdGUgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwb3N0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIik7CiAgZm9yZWFjaChhcnJheSgnamF1dHJ1cy12aXJza2luaW1hcycsJ3N0ZXJpbGl6dW90YXMtYXVnaW50aW5pcycsJ3N1by1udW9sYXQta2Fzb3NpLTctcHJpZXphc3R5cy1pci0zLW1pbnVjaXUtcGxhbmFzLWthLWRhcnl0aS1zaWFuZGllbicsJ2hpcG9hbGVyZ2luaXMtbWFpc3RhcycsJ29kYWktaXIta2FpbGl1aScpIGFzICRzKXsgJHBnPWdldF9wYWdlX2J5X3BhdGgoJHMpOyBpZigkcGcpICRyWydwZyddWyRzXT1tYl9zdWJzdHIodHJpbShwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsd3Bfc3RyaXBfYWxsX3RhZ3Moc3RyaXBfc2hvcnRjb2RlcygkcGctPnBvc3RfY29udGVudCkpKSksMCw3MDApLicgfHxTQzogJy5pbXBsb2RlKCcsJyxhcnJheV91bmlxdWUoKHByZWdfbWF0Y2hfYWxsKCcvXFsoXHcrKS8nLCRwZy0+cG9zdF9jb250ZW50LCRtKT8kbVsxXTphcnJheSgpKSkpOyB9CiAgJHEoJ2dzYycsIlNFTEVDVCBTVUJTVFJJTkdfSU5ERVgoVFJJTShUUkFJTElORyAnLycgRlJPTSBTVUJTVFJJTkdfSU5ERVgodXJsLCdwZXRzaG9wLmx0LycsLTEpKSwnPycsMSkgcywgU1VNKGNsaWNrcykgY2wsIFNVTShpbXByKSBpbSwgUk9VTkQoU1VNKHBvcyppbXByKS9OVUxMSUYoU1VNKGltcHIpLDApLDEpIHBvcyBGUk9NIHskcH1wc19mYWt0X2dzY191cmxfZCBXSEVSRSBkaWVuYT49Q1VSREFURSgpLUlOVEVSVkFMIDEyMCBEQVkgQU5EICh1cmwgTElLRSAnJWthc29zaSUnIE9SIHVybCBMSUtFICcldmlyc2tpbiUnIE9SIHVybCBMSUtFICclc3RlcmlsaSUnIE9SIHVybCBMSUtFICclaGlwb2FsZXIlJyBPUiB1cmwgTElLRSAnJXNwcmVuZGltYWklJyBPUiB1cmwgTElLRSAnJWJsb2clJyBPUiB1cmwgTElLRSAnJXZpZHVyaWF2JScgT1IgdXJsIExJS0UgJyVhbGVyZ2lqJScgT1IgdXJsIExJS0UgJyVvZGFpJScgT1IgdXJsIExJS0UgJyVnZXJpYXVzaWFzJScpIEdST1VQIEJZIDEgT1JERVIgQlkgaW0gREVTQyBMSU1JVCAzMCIpOwogICRxKCdwYWllc2thJywiU0VMRUNUIExPV0VSKHJha3RhcykgaywgQ09VTlQoKikgbiBGUk9NIHskcH1wc193ZWJfaXZ5a2lhaSBXSEVSRSB0aXBhcz0nc2VhcmNoJyBBTkQgZGllbmE+PScyMDI2LTA5LTAxJyBBTkQgTE9XRVIocmFrdGFzKSBSRUdFWFAgJ2FsZXJnfGhpcG98dmlyc2t8dmlyxaFraW58dmlkdXJpfGphdXRyfGthc3xvZGF8a2FpbHxzdGVyaWx8c3ZvcnxsaWdodHxndW11bHxoYWlyYmFsbHxpbnRlc3RpbnxnYXN0cm98dXJpbnxpbmtzdCcgR1JPVVAgQlkgMSBPUkRFUiBCWSAyIERFU0MgTElNSVQgNDAiKTsKICAkcSgncHJvZCcsIlNFTEVDVCB0Lm5hbWUgYiwgU1VCU1RSSU5HX0lOREVYKHBvLnBvc3RfdGl0bGUsJyAnLDYpIHBhdiwgQ09VTlQoKikgbiBGUk9NIHskcH1wb3N0cyBwbyBKT0lOIHskcH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgT04gdHIub2JqZWN0X2lkPXBvLklEIEpPSU4geyRwfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teT0ncHJvZHVjdF9icmFuZCcgSk9JTiB7JHB9dGVybXMgdCBPTiB0LnRlcm1faWQ9dHQudGVybV9pZCBKT0lOIHskcH1wb3N0bWV0YSBzIE9OIHMucG9zdF9pZD1wby5JRCBBTkQgcy5tZXRhX2tleT0nX3N0b2NrX3N0YXR1cycgQU5EIHMubWV0YV92YWx1ZT0naW5zdG9jaycgV0hFUkUgcG8ucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG8ucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCB0LnNsdWcgSU4gKCdleGNsdXNpb24nLCdhbmltb25kYScpIEdST1VQIEJZIDEsMiBPUkRFUiBCWSAxLDMgREVTQyBMSU1JVCA4MCIpOwogIHdwX3NlbmRfanNvbigkcik7Cn0sIDk5KTsK';
const VER='dep-133057';
const GKEY='ps_s1706m';
const PHASES=["GO"];
const OUT='analize/s1706_mn.json';
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
