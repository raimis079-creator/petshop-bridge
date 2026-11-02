process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODIwbiByZWNvbjI6IMWhxJdyaW1vIGxlbnRlbGnFsyBmb3Jtb3MsIGhhc2gsIHBha2V0xbMgcmVzb2x2ZXJpcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MjBuJ10pKSByZXR1cm47ICRyPVsndic9PidTMTgyMG4nXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogIHRyeXsKICAgICRyWydjb21ib3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzaGFwZSxzb3VyY2Vfc3RydWN0dXJlLGxvb2t1cF9tZXRob2QscmVzb2x1dGlvbl9wb2xpY3kscm93X2RpbWVuc2lvbix3ZWlnaHRfYmFzaXMsQ09VTlQoKikgbiBGUk9NIHskUH1wc19mZWVkaW5nX3RhYmxlcyBXSEVSRSBpc19hY3RpdmU9MSBHUk9VUCBCWSAxLDIsMyw0LDUsNiBPUkRFUiBCWSBuIERFU0MiLEFSUkFZX0EpOwogICAgJHJbJ2NvbmRfdGJsJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCAqIEZST00geyRQfXBzX2ZlZWRpbmdfdGFibGVzIFdIRVJFIGlzX2FjdGl2ZT0xIEFORCBpZCBJTiAoU0VMRUNUIGZlZWRpbmdfdGFibGVfaWQgRlJPTSB7JFB9cHNfZmVlZGluZ19yb3dzIFdIRVJFIGNvbmRpdGlvbl9kaW1lbnNpb25zIElTIE5PVCBOVUxMKSBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEiLEFSUkFZX0EpOwogICAgaWYoJHJbJ2NvbmRfdGJsJ10pICRyWydjb25kX3Jvd3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCAqIEZST00geyRQfXBzX2ZlZWRpbmdfcm93cyBXSEVSRSBmZWVkaW5nX3RhYmxlX2lkPSVkIE9SREVSIEJZIHJvd19vcmRlciBMSU1JVCAxMiIsJHJbJ2NvbmRfdGJsJ11bJ2lkJ10pLEFSUkFZX0EpOwogICAgJHJbJ3BvaW50X3RibCddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgKiBGUk9NIHskUH1wc19mZWVkaW5nX3RhYmxlcyBXSEVSRSBpc19hY3RpdmU9MSBBTkQgc291cmNlX3N0cnVjdHVyZTw+J3JhbmdlJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEiLEFSUkFZX0EpOwogICAgaWYoJHJbJ3BvaW50X3RibCddKSAkclsncG9pbnRfcm93cyddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSB7JFB9cHNfZmVlZGluZ19yb3dzIFdIRVJFIGZlZWRpbmdfdGFibGVfaWQ9JWQgT1JERVIgQlkgcm93X29yZGVyIExJTUlUIDgiLCRyWydwb2ludF90YmwnXVsnaWQnXSksQVJSQVlfQSk7CiAgICAkZ3JlcD1mdW5jdGlvbigkZGlyLCRwYXQpeyAkbz1bXTsgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZGlyLEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSk7IGZvcmVhY2goJGl0IGFzICRmKXsgaWYoc3Vic3RyKCRmLC00KSE9PScucGhwJykgY29udGludWU7IGlmKHByZWdfbWF0Y2goJy9iYWt8YXJjaHl2L2knLCRmKSkgY29udGludWU7ICRjPUBmaWxlKCRmKTsgaWYoISRjKSBjb250aW51ZTsgZm9yZWFjaCgkYyBhcyAkaT0+JEwpeyBpZihwcmVnX21hdGNoKCRwYXQsJEwpKSAkb1tdPXN0cl9yZXBsYWNlKFdQX0NPTlRFTlRfRElSLCcnLCRmKS4nOicuKCRpKzEpLic6ICcubWJfc3Vic3RyKHRyaW0oJEwpLDAsMTgwKTt9IH0gcmV0dXJuIGFycmF5X3NsaWNlKCRvLDAsMzApOyB9OwogICAgJHJbJ2NoYXNoJ109JGdyZXAoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZScsJy9jaGFzaF92MXxjYW5vbmljYWxfdGFibGVfaGFzaFxzKj18ZnVuY3Rpb25ccytjYW5vbmljYWwvaScpOwogICAgJHJbJ2NoYXNoX211J109JGdyZXAoV1BNVV9QTFVHSU5fRElSLCcvY2hhc2hfdjF8ZnVuY3Rpb25ccytjYW5vbmljYWxfaGFzaC9pJyk7CiAgICBmb3JlYWNoKFsnUGV0c2hvcF9GZWVkaW5nX1BhY2thZ2VfUmVzb2x2ZXInLCdQZXRzaG9wX0ZlZWRpbmdfQ2FsY3VsYXRvciddIGFzICRjbCl7IGlmKCFjbGFzc19leGlzdHMoJGNsKSkgY29udGludWU7ICRyZj1uZXcgUmVmbGVjdGlvbkNsYXNzKCRjbCk7ICRyWydjbHMnXVskY2xdPVsnZmlsZSc9PnN0cl9yZXBsYWNlKFdQX0NPTlRFTlRfRElSLCcnLCRyZi0+Z2V0RmlsZU5hbWUoKSksJ20nPT5hcnJheV9tYXAoZnVuY3Rpb24oJG0pe3JldHVybiAkbS0+bmFtZTt9LCRyZi0+Z2V0TWV0aG9kcygpKV07IH0KICAgICRyZj1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0ZlZWRpbmdfUGFja2FnZV9SZXNvbHZlcicpOyAkc3JjPWZpbGUoJHJmLT5nZXRGaWxlTmFtZSgpKTsgJHJbJ3Jlc29sdmVyJ109aW1wbG9kZSgnJyxhcnJheV9zbGljZSgkc3JjLCRyZi0+Z2V0U3RhcnRMaW5lKCktMSxtaW4oMTYwLCRyZi0+Z2V0RW5kTGluZSgpLSRyZi0+Z2V0U3RhcnRMaW5lKCkrMSkpKTsKICAgICRyZj1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0ZlZWRpbmdfUmVwb3NpdG9yeScpOyAkc3JjPWZpbGUoJHJmLT5nZXRGaWxlTmFtZSgpKTsgJG09JHJmLT5nZXRNZXRob2QoJ2J1aWxkX3RhYmxlX3BheWxvYWQnKTsgJHJbJ3BheWxvYWQnXT1pbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRzcmMsJG0tPmdldFN0YXJ0TGluZSgpLTEsbWluKDExMCwkbS0+Z2V0RW5kTGluZSgpLSRtLT5nZXRTdGFydExpbmUoKSsxKSkpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-170844';
const GKEY='ps_s1820n';
const PHASES=["1"];
const OUT='analize/s1820_n.json';
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
