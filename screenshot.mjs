process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODIwYSByZWNvbjogWkIga29uc2VydsWzIERQIHBha28gYmFuZHltYXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODIwYSddKSkgcmV0dXJuOyAkZj0oc3RyaW5nKSRfR0VUWydwc19zMTgyMGEnXTsgJHI9Wyd2Jz0+J1MxODIwYScsJ2ZhemUnPT4kZl07IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsKICB0cnl7CiAgICBpZigkZj09PScxJyl7CiAgICAgICRza3VzPVsnMDFPUkRXMDQxJywnMDFNVktEMTAyJywnMDFNMjEwMjA1J107CiAgICAgIGZvcmVhY2goJHNrdXMgYXMgJHMpeyAkaWQ9d2NfZ2V0X3Byb2R1Y3RfaWRfYnlfc2t1KCRzKTsgJHA9JGlkP3djX2dldF9wcm9kdWN0KCRpZCk6bnVsbDsgaWYoISRwKXskclsnYmFzZSddWyRzXT1udWxsOyBjb250aW51ZTt9CiAgICAgICAgJG09W107IGZvcmVhY2goZ2V0X3Bvc3RfbWV0YSgkaWQpIGFzICRrPT4kdil7IGlmKHByZWdfbWF0Y2goJy9eKF96YnxfcHNffF9kcHxfc3RvY2t8X21hbmFnZXxfcHJpY2V8X3JlZ3VsYXJ8X3NhbGV8X3dlaWdodHxfZ2xvYmFsfF9jb3N0fF92aXNpYnxyYW5rX21hdGhfcm9ib3RzfF9wcm9kdWN0X2F0dHJpYnV0ZXMpLycsJGspKSAkbVska109bWJfc3Vic3RyKCR2WzBdLDAsMTIwKTsgfQogICAgICAgICRyWydiYXNlJ11bJHNdPVsnaWQnPT4kaWQsJ3QnPT4kcC0+Z2V0X25hbWUoKSwnc3QnPT4kcC0+Z2V0X3N0YXR1cygpLCd2aXMnPT4kcC0+Z2V0X2NhdGFsb2dfdmlzaWJpbGl0eSgpLCdzcyc9PiRwLT5nZXRfc3RvY2tfc3RhdHVzKCksJ3B1cmNoJz0+JHAtPmlzX3B1cmNoYXNhYmxlKCksJ3JlZyc9PiRwLT5nZXRfcmVndWxhcl9wcmljZSgnZWRpdCcpLCdpbWcnPT4oaW50KSRwLT5nZXRfaW1hZ2VfaWQoKSwna2F0Jz0+d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwcm9kdWN0X2NhdCcsWydmaWVsZHMnPT4nbmFtZXMnXSksJ2R5ZGlzJz0+d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwYV9wYWt1b3Rlc19keWRpcycsWydmaWVsZHMnPT4nbmFtZXMnXSksJ21ldGEnPT4kbSwKICAgICAgICAgICdzcmMnPT5jbGFzc19leGlzdHMoJ1BldHNob3BfQVZfU291cmNlJyk/UGV0c2hvcF9BVl9Tb3VyY2U6OnJlc29sdmUoJGlkKTpudWxsLCdzYW5kJz0+Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX1JpbmtpbmlhaScpP1BldHNob3BfUmlua2luaWFpOjpzYW5kZWxpcygkaWQpOm51bGwsJ2RwX3Byb2NfZGVmJz0+Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0RQX0thaW5vcycpP1BldHNob3BfRFBfS2Fpbm9zOjpudW1hdHl0b2ppX3Byb2MoJGlkKTpudWxsXTsKICAgICAgfQogICAgICAvLyBlc2FtaSBaQiBEUCBwYWthaSBpciBiYXppbmnFsyBixatzZW5vcwogICAgICAkclsnZHBfemInXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBway5JRCwgcGsucG9zdF90aXRsZSwgcGsucG9zdF9zdGF0dXMsIGIubWV0YV92YWx1ZSBiYXNlLCBicC5wb3N0X3N0YXR1cyBiYXNlX3N0LCBxLm1ldGFfdmFsdWUgcXR5IEZST00geyRQfXBvc3RzIHBrIEpPSU4geyRQfXBvc3RtZXRhIGIgT04gYi5wb3N0X2lkPXBrLklEIEFORCBiLm1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJyBKT0lOIHskUH1wb3N0cyBicCBPTiBicC5JRD1iLm1ldGFfdmFsdWUgTEVGVCBKT0lOIHskUH1wb3N0bWV0YSBxIE9OIHEucG9zdF9pZD1way5JRCBBTkQgcS5tZXRhX2tleT0nX2RwX3BhY2tfcXR5JyBKT0lOIHskUH1wb3N0bWV0YSBzIE9OIHMucG9zdF9pZD1iLm1ldGFfdmFsdWUgQU5EIHMubWV0YV9rZXk9J19wc19zYW5kZWxpcycgQU5EIHMubWV0YV92YWx1ZT0nemInIFdIRVJFIHBrLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBrLnBvc3Rfc3RhdHVzPD4ndHJhc2gnIExJTUlUIDE1IixBUlJBWV9BKTsKICAgICAgJHJbJ2RwX3F0eV9kaXN0J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcS5tZXRhX3ZhbHVlIHF0eSwgQ09VTlQoKikgbiBGUk9NIHskUH1wb3N0bWV0YSBxIEpPSU4geyRQfXBvc3RzIHAgT04gcC5JRD1xLnBvc3RfaWQgQU5EIHAucG9zdF9zdGF0dXM8Pid0cmFzaCcgV0hFUkUgcS5tZXRhX2tleT0nX2RwX3BhY2tfcXR5JyBHUk9VUCBCWSBxLm1ldGFfdmFsdWUiLEFSUkFZX0EpOwogICAgICAkclsnZHBfYmFzZV9ub3RfcHVibGlzaCddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdHMgcGsgSk9JTiB7JFB9cG9zdG1ldGEgYiBPTiBiLnBvc3RfaWQ9cGsuSUQgQU5EIGIubWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnIEpPSU4geyRQfXBvc3RzIGJwIE9OIGJwLklEPWIubWV0YV92YWx1ZSBXSEVSRSBway5wb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIGJwLnBvc3Rfc3RhdHVzPD4ncHVibGlzaCciKTsKICAgICAgJHJbJ251b2xhaWRvc19vcHQnXT1nZXRfb3B0aW9uKCdwc19kcF9udW9sYWlkb3MnKTsKICAgIH0KICAgIGlmKCRmPT09JzInKXsgLy8ga29kYXM6IHNuaXBwZXRhaSBzdSBfZHBfYmFzZV9wcm9kdWN0X2lkCiAgICAgICR0PSRQLidzbmlwcGV0cyc7ICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlLExFTkdUSChjb2RlKSBsIEZST00gJHQgV0hFUkUgY29kZSBMSUtFICclX2RwX2Jhc2VfcHJvZHVjdF9pZCUnIE9SIGNvZGUgTElLRSAnJV9kcF9wYWNrX3F0eSUnIixBUlJBWV9BKTsgJHJbJ3NuaXAnXT0kcm93czsKICAgICAgZm9yZWFjaCgkcm93cyBhcyAkcyl7ICRjPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgY29kZSBGUk9NICR0IFdIRVJFIGlkPSVkIiwkc1snaWQnXSkpOyAkbGluZXM9ZXhwbG9kZSgiXG4iLCRjKTsgJGhpdD1bXTsKICAgICAgICBmb3JlYWNoKCRsaW5lcyBhcyAkaT0+JEwpeyBpZihwcmVnX21hdGNoKCcvcG9zdF9zdGF0dXN8Z2V0X3N0YXR1c3xpc19wdXJjaGFzYWJsZXxwdWJsaXNofFwva2d8a2d8dm50XC58dmllbmV0b3x1bml0L2knLCRMKSkgJGhpdFtdPSgkaSsxKS4nOiAnLm1iX3N1YnN0cih0cmltKCRMKSwwLDE3MCk7IH0KICAgICAgICAkclsnaGl0cyddWyRzWydpZCddXT1hcnJheV9zbGljZSgkaGl0LDAsNDApOyB9CiAgICAgICRmaWxlcz1nbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJyk7ICRyWydtdSddPVtdOwogICAgICBmb3JlYWNoKCRmaWxlcyBhcyAkZmwpeyAkYz1maWxlX2dldF9jb250ZW50cygkZmwpOyBpZihzdHJwb3MoJGMsJ19kcF9iYXNlX3Byb2R1Y3RfaWQnKT09PWZhbHNlKSBjb250aW51ZTsgJGhpdD1bXTsgZm9yZWFjaChleHBsb2RlKCJcbiIsJGMpIGFzICRpPT4kTCl7IGlmKHByZWdfbWF0Y2goJy9wb3N0X3N0YXR1c3xnZXRfc3RhdHVzXCh8aXNfcHVyY2hhc2FibGV8XC9rZ3zigqxcL3ZudHx2aWVuZXRvfHBlcl92bnR8a2FpbmFfa2d8a2dfa2FpbmEvaScsJEwpKSAkaGl0W109KCRpKzEpLic6ICcubWJfc3Vic3RyKHRyaW0oJEwpLDAsMTcwKTt9ICRyWydtdSddW2Jhc2VuYW1lKCRmbCldPWFycmF5X3NsaWNlKCRoaXQsMCwzMCk7IH0KICAgIH0KICAgIGlmKCRmPT09JzMnKXsgLy8gUmlua2luacWzIGxhbmdhczogaXNzYXVnb3RpIGRwIMWhYWthCiAgICAgICRyZj1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX1JpbmtpbmlhaScpOyAkZm49JHJmLT5nZXRGaWxlTmFtZSgpOyAkc3JjPWZpbGUoJGZuKTsgJHJbJ2ZpbGUnXT1iYXNlbmFtZSgkZm4pOyAkclsnbWV0b2RhaSddPWFycmF5X21hcChmdW5jdGlvbigkbSl7cmV0dXJuICRtLT5uYW1lO30sJHJmLT5nZXRNZXRob2RzKCkpOwogICAgICBmb3JlYWNoKFsnaXNzYXVnb3RpX2RwJywnYWpheF9pc3NhdWdvdGknLCdpc3NhdWdvdGknXSBhcyAkbW4peyBpZighJHJmLT5oYXNNZXRob2QoJG1uKSkgY29udGludWU7ICRtPSRyZi0+Z2V0TWV0aG9kKCRtbik7ICRyWydzcmMnXVskbW5dPWltcGxvZGUoJycsYXJyYXlfc2xpY2UoJHNyYywkbS0+Z2V0U3RhcnRMaW5lKCktMSxtaW4oMTQwLCRtLT5nZXRFbmRMaW5lKCktJG0tPmdldFN0YXJ0TGluZSgpKzEpKSk7IH0KICAgIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-143803';
const GKEY='ps_s1820a';
const PHASES=["1", "2", "3"];
const OUT='analize/s1820_a.json';
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
