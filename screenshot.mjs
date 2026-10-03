process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQ5aiBTZW5kZXIgd2ViaG9vayBkaWFnbm9zdGlrYSAocmVhZC1vbmx5KS4gRmF6ZXM6IDEga29kYXMrREIsIDIgYWNjZXNzIGxvZyAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NDlqJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNzUpOyBAaW5pX3NldCgnbWVtb3J5X2xpbWl0JywnNTEyTScpOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRwaD0oc3RyaW5nKSRfR0VUWydwc19zMTc0OWonXTsgJHI9Wyd2Jz0+J1MxNzQ5aicsJ2ZhemUnPT4kcGgsJ2RhYmFyX3V0Yyc9PmdtZGF0ZSgnWS1tLWQgSDppOnMnKV07CiAgaWYoJHBoPT09JzEnKXsKICAgICRkaXJzPVtXUF9DT05URU5UX0RJUi4nL3BsdWdpbnMvcGV0c2hvcC1lc3AnLFdQX0NPTlRFTlRfRElSLicvcGx1Z2lucy9wZXRzaG9wLWNvcmUnLFdQTVVfUExVR0lOX0RJUl07ICRoaXRzPVtdOwogICAgZm9yZWFjaCgkZGlycyBhcyAkZCl7IGlmKCFpc19kaXIoJGQpKSBjb250aW51ZTsgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZCxGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICAgICBmb3JlYWNoKCRpdCBhcyAkZil7IGlmKHN1YnN0cigkZiwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOyAkbHM9QGZpbGUoKHN0cmluZykkZik7IGlmKCEkbHMpIGNvbnRpbnVlOyBmb3JlYWNoKCRscyBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvcmVnaXN0ZXJfcmVzdF9yb3V0ZXx2ZXJpZnlfd2ViaG9va3xsb2dfd2ViaG9va3xwc19lc3BfcHJvY2Vzc19ldmVudHx3ZWJob29rX3NlY3JldHxzZW5kZXJfd2ViaG9va3xcL3dlYmhvb2svaScsJGwpKSAkaGl0c1tdPXN0cl9yZXBsYWNlKFdQX0NPTlRFTlRfRElSLCcnLChzdHJpbmcpJGYpLic6Jy4oJGkrMSkuJyAnLnN1YnN0cih0cmltKCRsKSwwLDE1MCk7IH0gfSB9CiAgICAkclsna29kYXMnXT0kaGl0czsKICAgICRyWyd3ZWJob29rX2xvZ19jb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskUH1wc193ZWJob29rX2xvZyIpOwogICAgJHJbJ3dlYmhvb2tfbG9nJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskUH1wc193ZWJob29rX2xvZyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEwIixBUlJBWV9BKTsKICAgIGZvcmVhY2goJHJbJ3dlYmhvb2tfbG9nJ10gYXMgJiR4KXsgZm9yZWFjaCgkeCBhcyAkaz0+JHYpeyBpZihpc19zdHJpbmcoJHYpJiZzdHJsZW4oJHYpPjIwMCkgJHhbJGtdPXN1YnN0cigkdiwwLDIwMCkuJ+KApic7IH0gfSB1bnNldCgkeCk7CiAgICAkclsnd2ViaG9va19sb2dfbiddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cHNfd2ViaG9va19sb2ciKTsKICAgICRyWydvcHRpb25zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsIExFTkdUSChvcHRpb25fdmFsdWUpIGlsZ2lzLCBhdXRvbG9hZCBGUk9NIHskUH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyV3ZWJob29rJScgT1Igb3B0aW9uX25hbWUgTElLRSAncGV0c2hvcF9lc3AlJyIsQVJSQVlfQSk7CiAgICAkclsnc2VjcmV0X2tvbnN0YW50YSddPWRlZmluZWQoJ1BFVFNIT1BfU0VOREVSX1dFQkhPT0tfU0VDUkVUJyk7CiAgICAkclsnbGVudGVsZXMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyRQfXBzXF8lJyIpOwogICAgJHJbJ2FzX2VzcCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGFjdGlvbl9pZCwgc3RhdHVzLCBzY2hlZHVsZWRfZGF0ZV9nbXQsIExFRlQoYXJncywxNjApIGFyZ3MgRlJPTSB7JFB9YWN0aW9uc2NoZWR1bGVyX2FjdGlvbnMgV0hFUkUgaG9vaz0ncHNfZXNwX3Byb2Nlc3NfZXZlbnQnIE9SREVSIEJZIGFjdGlvbl9pZCBERVNDIExJTUlUIDgiLEFSUkFZX0EpOwogICAgJHJbJ2FzX2VzcF9uJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc3RhdHVzLCBDT1VOVCgqKSBuLCBNSU4oc2NoZWR1bGVkX2RhdGVfZ210KSBudW8sIE1BWChzY2hlZHVsZWRfZGF0ZV9nbXQpIGlraSBGUk9NIHskUH1hY3Rpb25zY2hlZHVsZXJfYWN0aW9ucyBXSEVSRSBob29rPSdwc19lc3BfcHJvY2Vzc19ldmVudCcgR1JPVVAgQlkgc3RhdHVzIixBUlJBWV9BKTsKICAgICRycz1yZXN0X2dldF9zZXJ2ZXIoKS0+Z2V0X3JvdXRlcygpOyAkclsncmVzdF9yb3V0ZXMnXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKGFycmF5X2tleXMoJHJzKSxmdW5jdGlvbigkayl7IHJldHVybiBzdHJpcG9zKCRrLCdwZXRzaG9wJykhPT1mYWxzZXx8c3RyaXBvcygkaywnZXNwJykhPT1mYWxzZXx8c3RyaXBvcygkaywnd2ViaG9vaycpIT09ZmFsc2V8fHN0cmlwb3MoJGssJ3NlbmRlcicpIT09ZmFsc2U7IH0pKTsKICB9CiAgaWYoJHBoPT09JzInKXsKICAgICRkaXI9Jy9ob21lL2d5dnVuYWkyL2RvbWFpbnMvcGV0c2hvcC5sdC9sb2dzJzsgJGFnZz1bXTsgJHB2ej1bXTsgJHQwPXRpbWUoKTsKICAgIGZvcmVhY2goZ2xvYigkZGlyLicve1NlcCxPY3R9LTIwMjYudGFyLmd6KicsR0xPQl9CUkFDRSkgYXMgJGYpeyBpZih0aW1lKCktJHQwPjE1MCl7ICRyWydsYWlrYXNfYmFpZ2VzaSddPWJhc2VuYW1lKCRmKTsgYnJlYWs7IH0KICAgICAgJGc9Z3pvcGVuKCRmLCdyJyk7IGlmKCEkZykgY29udGludWU7IHdoaWxlKCFnemVvZigkZykpeyAkbD1nemdldHMoJGcsODE5Mik7IGlmKCRsPT09ZmFsc2UpIGJyZWFrOyBpZihzdHJpcG9zKCRsLCd3ZWJob29rJyk9PT1mYWxzZSAmJiBzdHJpcG9zKCRsLCcvZXNwJyk9PT1mYWxzZSAmJiBzdHJpcG9zKCRsLCdzZW5kZXInKT09PWZhbHNlKSBjb250aW51ZTsKICAgICAgICBpZihwcmVnX21hdGNoKCcjXihcUyspIC4qP1xbKFteXF1dKylcXSAiKFxTKykgKFxTKylbXiJdKiIgKFxkezN9KSBcUysgIlteIl0qIiAiKFteIl0qKSIjJywkbCwkbSkpeyAkaz0kbVszXS4nICcuc3Vic3RyKHByZWdfcmVwbGFjZSgnL1w/LiovJywnJywkbVs0XSksMCw3MCkuJyAnLiRtWzVdLicgJy5zdWJzdHIoJG1bNl0sMCw0MCk7ICRhZ2dbJGtdPSgkYWdnWyRrXT8/MCkrMTsgaWYoY291bnQoJHB2eik8MTUpICRwdnpbXT0kbVsyXS4nICcuJG1bMV0uJyAnLiRtWzNdLicgJy5zdWJzdHIoJG1bNF0sMCw4MCkuJyAnLiRtWzVdLicgJy5zdWJzdHIoJG1bNl0sMCw1MCk7IH0gfSBnemNsb3NlKCRnKTsgfQogICAgYXJzb3J0KCRhZ2cpOyAkclsnYWdnJ109YXJyYXlfc2xpY2UoJGFnZywwLDQwLHRydWUpOyAkclsncHZ6J109JHB2ejsKICB9CiAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==';
const VER='dep-181928';
const GKEY='ps_s1749j';
const PHASES=["1", "2"];
const OUT='s1749j.json';
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
