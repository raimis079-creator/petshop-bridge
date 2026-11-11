process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODQ2YSBBZHMgcGlsbmEgYW5hbGl6ZSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NDZhJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgyNTApOyBAaW5pX3NldCgnbWVtb3J5X2xpbWl0JywnNTEyTScpOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTg0NmEnXTsgCiAgJHE9ZnVuY3Rpb24oJHMpIHVzZSgkd3BkYiwmJHIpeyAkeD0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHMsQVJSQVlfTik7IGlmKCR3cGRiLT5sYXN0X2Vycm9yKSAkclsnU1FMX0VSUiddW109bWJfc3Vic3RyKCR3cGRiLT5sYXN0X2Vycm9yLDAsMzAwKTsgcmV0dXJuICR4OyB9OwogICRGPSJ7JFB9cHNfZmFrdF91enNha3ltYWkiOyAkUj0ieyRQfXBzX2Zha3RfcmVrbGFtYSI7ICRmPSRfR0VUWydwc19zMTg0NmEnXTsKICAkb2s9InUudGVzdGluaXM9MCBBTkQgdS5zdGF0dXNhc19nYWx1dGluaXMgTk9UIElOKCdjYW5jZWxsZWQnLCdmYWlsZWQnLCdyZWZ1bmRlZCcsJ3BlbmRpbmcnLCd0cmFzaCcsJ2NoZWNrb3V0LWRyYWZ0JykiOwogIGlmKCRmPT09JzEnKXsKICAgICRyWydhZHNfY29scyddPVsnZCcsJ2NpZCcsJ2snLCdwYXInLCdwYXNwJywnY3QnLCdrb252Jywna3ZfY3QnLCdzZW5vamknXTsKICAgICRyWydhZHMnXT0kcSgiU0VMRUNUIGRpZW5hLCBrYW1wYW5pamFfaWQsIExFRlQoa2FtcGFuaWphLDMyKSwgcGFyb2R5bWFpLCBwYXNwYXVkaW1haSwgaXNsYWlkb3NfY3QsIGtvbnZlcnNpam9zLCBrb252X3ZlcnRlX2N0LCBzZW5vamlfc3ZldGFpbmUgRlJPTSAkUiBXSEVSRSBrYW5hbGFzPSdnb29nbGVfYWRzJyBPUkRFUiBCWSBkaWVuYSwga2FtcGFuaWphX2lkIik7CiAgICAkclsna2l0aSddPSRxKCJTRUxFQ1QgREFURV9GT1JNQVQoZGllbmEsJyVZLSVtJykgbSwga2FuYWxhcywgUk9VTkQoU1VNKGlzbGFpZG9zX2N0KS8xMDAsMiksIFNVTShwYXNwYXVkaW1haSkgRlJPTSAkUiBXSEVSRSBrYW5hbGFzPD4nZ29vZ2xlX2FkcycgR1JPVVAgQlkgMSwyIik7CiAgICAkclsndXpzX2NvbHMnXT1bJ2lkJywnbGFpa2FzJywnZWgnLCd2aXNvX2N0Jywna29udHJfY3QnLCdtYXJ6YV9jdCcsJ3Zlel9jdCcsJ2sxJywnazInLCd1cycsJ3VtJywndWMnLCdnYycsJ25hdWphcycsJ25yJywnc2VuYXMnLCdpcicsJ3JlZmlsbCcsJ2xhbmRpbmcnXTsKICAgICRyWyd1enMnXT0kcSgiU0VMRUNUIHUudXpzYWt5bWFzX2lkLCB1LnN1a3VydGFfYXQsIExFRlQoTUQ1KExPV0VSKG8uYmlsbGluZ19lbWFpbCkpLDEwKSwgdS52aXNvX2N0LCB1LmtvbnRyaWJ1Y2lqYV9jdCwgdS5tYXJ6YV9jdCwKICAgICAgQ09BTEVTQ0UoKFNFTEVDVCBTVU0ocy5rYWluYV92ZXplam9fY3QpIEZST00geyRQfXBzX2Zha3Rfc2l1bnRvcyBzIFdIRVJFIHMudXpzYWt5bWFzX2lkPXUudXpzYWt5bWFzX2lkIEFORCAocy50ZXN0aW5pcz0wIE9SIHMudGVzdGluaXMgSVMgTlVMTCkgQU5EIENPQUxFU0NFKHMuc3RhdHVzYXMsJycpPD4nYXRzYXVrdGEnKSwwKSwKICAgICAgdS5rYW5hbGFzX3Bpcm1hcywgdS5rYW5hbGFzX3Bhc2t1dGluaXMsIHUudXRtX3NvdXJjZSwgdS51dG1fbWVkaXVtLCB1LnV0bV9jYW1wYWlnbiwgKHUuZ2NsaWQ8PicnKSwgdS5rbGllbnRhc19uYXVqYXMsIHUua2xpZW50YXNfdXpzYWt5bW9fbnIsCiAgICAgIEVYSVNUUyhTRUxFQ1QgMSBGUk9NIHskUH1wc19pc3RfdXpzYWt5bWFpIGkgV0hFUkUgTE9XRVIoaS5lbWFpbCk9TE9XRVIoby5iaWxsaW5nX2VtYWlsKSBBTkQgaS5pdnlrZHl0YXM9MSksIHUuaXJlbmdpbnlzLCB1LmlzX3JlZmlsbCwgTEVGVChTVUJTVFJJTkdfSU5ERVgodS5sYW5kaW5nX3VybCwnPycsMSksNjApCiAgICAgIEZST00gJEYgdSBKT0lOIHskUH13Y19vcmRlcnMgbyBPTiBvLmlkPXUudXpzYWt5bWFzX2lkIFdIRVJFICRvayBBTkQgdS5zdWt1cnRhX2F0Pj0nMjAyNi0wOS0wOScgT1JERVIgQlkgdS5zdWt1cnRhX2F0Iik7CiAgfQogIGlmKCRmPT09JzInKXsKICAgICRyWydlaWxfY29scyddPVsnaWQnLCdicmVuZGFzJywnZ3l2dW5hcycsJ2thaW5hX2N0Jywnc2F2aWtfY3QnLCdraWVraXMnLCdrYXQnXTsKICAgICRyWydlaWwnXT0kcSgiU0VMRUNUIGUudXpzYWt5bWFzX2lkLCBlLmJyZW5kYXNfc2x1ZywgZS5neXZ1bmFzLCBTVU0oZS5rYWluYV9jdCksIFNVTShlLnNhdmlrYWluYV9jdCksIFNVTShlLmtpZWtpcyksIExFRlQoU1VCU1RSSU5HX0lOREVYKE1BWChlLmthdGVnb3JpanVfa2VsaWFzKSwnPicsMiksNDApIEZST00geyRQfXBzX2Zha3RfZWlsdXRlcyBlIEpPSU4gJEYgdSBPTiB1LnV6c2FreW1hc19pZD1lLnV6c2FreW1hc19pZCBXSEVSRSAkb2sgQU5EIHUuc3VrdXJ0YV9hdD49JzIwMjYtMDktMDknIEFORCAoZS50ZXN0aW5pcz0wIE9SIGUudGVzdGluaXMgSVMgTlVMTCkgQU5EIENPQUxFU0NFKGUuZG92YW5hLDApPTAgR1JPVVAgQlkgMSwyLDMiKTsKICAgICRyWyd3ZWJfcGonXT0kcSgiU0VMRUNUIHBqdXZpcywgQ09VTlQoKiksIE1JTihkYXRhKSwgTUFYKGRhdGEpIEZST00geyRQfXBzX3dlYl9kaWVub3MgR1JPVVAgQlkgMSIpOwogICAgJHJbJ3dlYl9rYW4nXT0kcSgiU0VMRUNUIGRhdGEsIHJha3RhcywgcmFrdGFzMiwgYXBzaWxhbmt5bWFpLCBsYW5reXRvamFpLCBhZGRfdG9fY2FydCwgYmVnaW5fY2hlY2tvdXQsIHV6c2FreW1haSBGUk9NIHskUH1wc193ZWJfZGllbm9zIFdIRVJFIHBqdXZpcyBJTigna2FuYWxhcycsJ3NhbHRpbmlzJywna2FtcGFuaWphJykgQU5EIGRhdGE+PScyMDI2LTEwLTAxJyBBTkQgKHJha3RhcyBMSUtFICclbW9rYW0lJyBPUiByYWt0YXMgTElLRSAnJWdvb2dsZSUnIE9SIHJha3RhcyBSRUdFWFAgJ15bMC05XSskJykgT1JERVIgQlkgZGF0YSBMSU1JVCA4MDAiKTsKICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsgfSk7Cg==';
const VER='dep-091309';
const GKEY='ps_s1846a';
const PHASES=["1", "2"];
const OUT='analize/s1846_a.json';
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
