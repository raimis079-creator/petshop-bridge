process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzIxayByZWFkLW9ubHk6IHNrYWljaXVva2xlcyBwcmltaW5pbWFpIChwc19yZWZpbGxfdHJhY2tpbmcsIHJlZmlsbF9kdWUgbGFpc2thaSkgbnVvIFQtMCAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MjFrJ10pKSByZXR1cm47ICRyPVsndic9PidTMTcyMWsnXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogICRxPWZ1bmN0aW9uKCRzcWwpIHVzZSAoJHdwZGIsJiRyKXsgJHg9JHdwZGItPmdldF9yZXN1bHRzKCRzcWwsQVJSQVlfQSk7IGlmKCR3cGRiLT5sYXN0X2Vycm9yKSAkclsnU1FMX0VSUiddW109bWJfc3Vic3RyKCR3cGRiLT5sYXN0X2Vycm9yLDAsMjAwKTsgcmV0dXJuICR4OyB9OwogIHRyeXsKICAgICRyWydjb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskUH1wc19yZWZpbGxfdHJhY2tpbmciKTsKICAgICRyWydwdnonXT0kcSgiU0VMRUNUICogRlJPTSB7JFB9cHNfcmVmaWxsX3RyYWNraW5nIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMiIpOwogICAgJHJbJ3Zpc28nXT0kcSgiU0VMRUNUIENPVU5UKCopIG4sIE1JTihjcmVhdGVkX2F0KSBudW8sIE1BWChjcmVhdGVkX2F0KSBpa2kgRlJPTSB7JFB9cHNfcmVmaWxsX3RyYWNraW5nIik7CiAgICAkY29scz0kclsnY29scyddOyAkc3JjPWluX2FycmF5KCdzb3VyY2UnLCRjb2xzKT8nc291cmNlJzooaW5fYXJyYXkoJ3NhbHRpbmlzJywkY29scyk/J3NhbHRpbmlzJzooaW5fYXJyYXkoJ29yaWdpbicsJGNvbHMpPydvcmlnaW4nOm51bGwpKTsKICAgIGlmKCRzcmMpICRyWydwYWdhbF9zYWx0aW5pJ109JHEoIlNFTEVDVCAkc3JjIHMsIHN0YXR1cywgQ09VTlQoKikgbiwgU1VNKGNyZWF0ZWRfYXQ+PScyMDI2LTA5LTA5JykgcG9fdDAgRlJPTSB7JFB9cHNfcmVmaWxsX3RyYWNraW5nIEdST1VQIEJZIDEsMiBPUkRFUiBCWSAxLDIiKTsKICAgIGVsc2UgJHJbJ3BhZ2FsX3N0YXR1c2EnXT0kcSgiU0VMRUNUIHN0YXR1cywgQ09VTlQoKikgbiwgU1VNKGNyZWF0ZWRfYXQ+PScyMDI2LTA5LTA5JykgcG9fdDAgRlJPTSB7JFB9cHNfcmVmaWxsX3RyYWNraW5nIEdST1VQIEJZIDEiKTsKICAgIC8vIHNrYWljaXVva2xlcyBvcHQtaW4gaXZ5a2lhaQogICAgJHJbJ3dlYl9pdnlraWFpJ109JHEoIlNFTEVDVCB0aXBhcywgQ09VTlQoKikgbiwgQ09VTlQoRElTVElOQ1Qgc2VzaWphKSBzZXMsIE1JTihkaWVuYSkgbnVvLCBNQVgoZGllbmEpIGlraSBGUk9NIHskUH1wc193ZWJfaXZ5a2lhaSBXSEVSRSB0aXBhcyBMSUtFICclY2FsYyUnIE9SIHRpcGFzIExJS0UgJyVyZW1pbmQlJyBPUiB0aXBhcyBMSUtFICclcHJpbWluJScgT1IgdGlwYXMgTElLRSAnJXJlZmlsbCUnIEdST1VQIEJZIHRpcGFzIE9SREVSIEJZIG4gREVTQyBMSU1JVCAyMCIpOwogICAgJHJbJ2NhbGNfb3B0aW5fbGVudGVsZSddPSR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICd7JFB9cHNfcmVmaWxsX2ZlZWRiYWNrJyIpOwogICAgZm9yZWFjaChbJ3BzX3JlZmlsbF9vcHRpbicsJ3BzX2NhbGNfcmVtaW5kZXJzJywncHNfcmVmaWxsX3JlcXVlc3RzJywncHNfcmVtaW5kZXJzJ10gYXMgJHQpeyBpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAneyRQfSR0JyIpKSAkclsnbGVudGVsZXMnXVskdF09JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH0kdCIpOyB9CiAgICAkclsndGFibGVzX3JlZmlsbCddPSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICd7JFB9cHNfcmUlJyIpOwogICAgLy8gbGFpc2thaQogICAgJGNvbHMyPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JFB9cHNfZW1haWxfam9icyIpOyAkZGM9bnVsbDsgZm9yZWFjaCgkY29sczIgYXMgJGMpeyBpZihwcmVnX21hdGNoKCcjXihjcmVhdGVkfGNyZWF0ZWRfYXR8c3VrdXJ0YXxzdWt1cnRhX2F0fHNjaGVkdWxlZF9hdHxsYWlrYXMpJCMnLCRjKSl7ICRkYz0kYzsgYnJlYWs7IH0gfQogICAgJHJbJ2xhaXNrYWknXT0kcSgiU0VMRUNUIGZsb3csIHN0YXR1cywgQ09BTEVTQ0Uoc2tpcF9yZWFzb24sJycpIHNyLCBDT1VOVCgqKSBuLCBNSU4oJGRjKSBudW8sIE1BWCgkZGMpIGlraSBGUk9NIHskUH1wc19lbWFpbF9qb2JzIFdIRVJFIGZsb3cgSU4oJ3JlZmlsbF9kdWUnLCd3aW5fYmFjaycsJ2NhbGNfcmVtaW5kZXInLCdyZWZpbGxfcmVtaW5kZXInKSBHUk9VUCBCWSAxLDIsMyBPUkRFUiBCWSAxLDIiKTsKICAgICRyWydlbWFpbF9jb2xzJ109JGNvbHMyOwogICAgLy8gYXRpZGFyeW1haS9wYXNwYXVkaW1haSBqZWkgeXJhCiAgICBpZihpbl9hcnJheSgnb3BlbmVkX2F0JywkY29sczIpfHxpbl9hcnJheSgnY2xpY2tlZF9hdCcsJGNvbHMyKSkgJHJbJ2F0aWRhcnl0YSddPSRxKCJTRUxFQ1QgZmxvdywgU1VNKG9wZW5lZF9hdCBJUyBOT1QgTlVMTCkgYXRpZCwgU1VNKGNsaWNrZWRfYXQgSVMgTk9UIE5VTEwpIHBhc3AsIENPVU5UKCopIG4gRlJPTSB7JFB9cHNfZW1haWxfam9icyBXSEVSRSBzdGF0dXM9J3NlbnQnIEFORCBmbG93IElOKCdyZWZpbGxfZHVlJywnd2luX2JhY2snKSBHUk9VUCBCWSBmbG93Iik7CiAgICAkclsncGFrYXJ0b3RpX3V6cyddPSRxKCJTRUxFQ1QgQ09VTlQoKikgbiBGUk9NIHskUH13Y19vcmRlcnNfbWV0YSBXSEVSRSBtZXRhX2tleT0nX3BzX3Bha2FydG90aV9pcyciKTsKICAgIC8vIGFydGltaWF1c2kgdGVybWluYWkKICAgIGlmKGluX2FycmF5KCdwcmVkaWN0ZWRfZW1wdHlfZGF0ZScsJGNvbHMpKSAkclsnYXJ0aW1pYXVzaSddPSRxKCJTRUxFQ1QgcHJlZGljdGVkX2VtcHR5X2RhdGUgZCwgc3RhdHVzLCBDT1VOVCgqKSBuIEZST00geyRQfXBzX3JlZmlsbF90cmFja2luZyBXSEVSRSBwcmVkaWN0ZWRfZW1wdHlfZGF0ZT49Q1VSREFURSgpIEdST1VQIEJZIDEsMiBPUkRFUiBCWSAxIExJTUlUIDE1Iik7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-133511';
const GKEY='ps_s1721k';
const PHASES=["1"];
const OUT='analize/s1721_k.json';
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
