process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTUgZSDigJQgKDEpIGNsYXNzLXBsYW4tYXR0cmlidXRpb24ucGhwOiBhdHJpYnVjaWpvcyByYWt0YXMgX3BzX3NvdXJjZSDihpIgX3BzX3BsYW5fc291cmNlICgyIHZpZXRvcyksIGJhayArIHRva2VuX2dldF9hbGwgKyBoZWFydGJlYXQvcm9sbGJhY2s7ICMxMTIwICgzNjA5NCkgZWlsdXTEl3MgbWV0YSBwZXJ2YWRpbnRhOyAjMTEyMCB2aWRpbsSXIHBhc3RhYmEgTEFVS1RJLiAoMikgcGF0aWtyYS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2OTVlJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoKTsgJGY9JF9HRVRbJ3BzX3MxNjk1ZSddOwogICR1PXdwX3VwbG9hZF9kaXIoKTsgJGJha2Rpcj0kdVsnYmFzZWRpciddLicvcHMtYmFja3Vwcyc7IGlmICghaXNfZGlyKCRiYWtkaXIpKSBAbWtkaXIoJGJha2RpciwwNzU1LHRydWUpOwogICRwYXRoPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtcGxhbi1hdHRyaWJ1dGlvbi5waHAnOwogIGlmICgkZj09PScxJyl7CiAgICAkYz1maWxlX2dldF9jb250ZW50cygkcGF0aCk7ICRvWydtZDVfcHJpZXMnXT1tZDUoJGMpOyBpZiAoJG9bJ21kNV9wcmllcyddIT09J2QyOWI0NmEwZGY0YjE2YTFkYmZjM2JhNWM2NTA4MTIzJyl7ICRvWydTVE9QJ109J21kNSBuZXN1dGFtcGEnOyBnb3RvIG91dDsgfQogICAgJHBhaXJzPWFycmF5KAogICAgICAiXHRcdFwkaXRlbS0+YWRkX21ldGFfZGF0YSggJ19wc19zb3VyY2UnLCBcJHZhbHVlc1sncHNfc291cmNlJ10sIHRydWUgKTsiID0+ICJcdFx0Ly8gUzE2OTUgKDIwMjYtMDktMjApOiByYWt0YXMgYF9wc19wbGFuX3NvdXJjZWAg4oCUIGFua3PEjWlhdSBgX3BzX3NvdXJjZWAsIGt1cmlzIHN1dGFwbyBzdSBBViB2YXJpa2xpbyB0aWVraW1vIGtlbGlvIHJha3R1IChhdi92Zi96YuKApikgaXIgbmVhcG1va8SXdHVvc2UgdcW+c2FreW11b3NlIGRhcmJhbGF1a2lzIHJvZMSXIOKAnkNBTENfUFJPRFVDVCBzaXVuxI1pYSBrbGllbnR1aeKAnC5cblx0XHRcJGl0ZW0tPmFkZF9tZXRhX2RhdGEoICdfcHNfcGxhbl9zb3VyY2UnLCBcJHZhbHVlc1sncHNfc291cmNlJ10sIHRydWUgKTsiLAogICAgICAiXHRcdFx0aWYgKCAhIFwkaXRlbS0+Z2V0X21ldGEoICdfcHNfc291cmNlJyApICkgeyBjb250aW51ZTsgfSIgPT4gIlx0XHRcdGlmICggISBcJGl0ZW0tPmdldF9tZXRhKCAnX3BzX3BsYW5fc291cmNlJyApICkgeyBjb250aW51ZTsgfSAvLyBTMTY5NSIsCiAgICApOwogICAgJGNybGY9c3RycG9zKCRjLCJcclxuIikhPT1mYWxzZTsgaWYgKCRjcmxmKXsgJHBwPWFycmF5KCk7IGZvcmVhY2ggKCRwYWlycyBhcyAkYT0+JGIpICRwcFtzdHJfcmVwbGFjZSgiXG4iLCJcclxuIiwkYSldPXN0cl9yZXBsYWNlKCJcbiIsIlxyXG4iLCRiKTsgJHBhaXJzPSRwcDsgfQogICAgJG49MDsgZm9yZWFjaCAoJHBhaXJzIGFzICRhPT4kYil7ICRjbnQ9c3Vic3RyX2NvdW50KCRjLCRhKTsgaWYgKCRjbnQhPT0xKXsgJG9bJ1NUT1AnXT0icGFrZWl0aW1hcyBuZXJhc3RhcyB2aWVuxIUga2FydMSFICgkY250KTogIi5tYl9zdWJzdHIoJGEsMCw2MCk7IGdvdG8gb3V0OyB9ICRjPXN0cl9yZXBsYWNlKCRhLCRiLCRjKTsgJG4rKzsgfQogICAgdHJ5IHsgdG9rZW5fZ2V0X2FsbCgkYywgVE9LRU5fUEFSU0UpOyB9IGNhdGNoIChUaHJvd2FibGUgJGUpIHsgJG9bJ1NUT1AnXT0nUEFSU0U6ICcuJGUtPmdldE1lc3NhZ2UoKTsgZ290byBvdXQ7IH0KICAgICRiYWs9JGJha2Rpci4nL2NsYXNzLXBsYW4tYXR0cmlidXRpb24ucGhwLmJha19zMTY5NSc7IGlmICghY29weSgkcGF0aCwkYmFrKSl7ICRvWydTVE9QJ109J2JhayBuZXBhdnlrbyc7IGdvdG8gb3V0OyB9CiAgICBpZiAoZmlsZV9wdXRfY29udGVudHMoJHBhdGgsJGMpPT09ZmFsc2UpeyBjb3B5KCRiYWssJHBhdGgpOyAkb1snU1RPUCddPSdyYcWheW1hcyBuZXBhdnlrbyc7IGdvdG8gb3V0OyB9CiAgICAkb1sncGFrZWl0aW11J109JG47ICRvWydtZDVfcG8nXT1tZDVfZmlsZSgkcGF0aCk7CiAgICAkcj13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvJyksYXJyYXkoJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsgJGNvZGU9aXNfd3BfZXJyb3IoJHIpPzA6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpOyAkb1snaGVhcnRiZWF0J109JGNvZGU7CiAgICBpZiAoJGNvZGU+PTUwMHx8JGNvZGU9PT0wKXsgY29weSgkYmFrLCRwYXRoKTsgJG9bJ1JPTExCQUNLJ109dHJ1ZTsgZ290byBvdXQ7IH0KICAgIC8vICMxMTIwIGVpbHV0xJcgKyBwYXN0YWJhCiAgICAkdz13Y19nZXRfb3JkZXIoMzYwOTQpOyBpZiAoJHcgJiYgJHctPmdldF9vcmRlcl9udW1iZXIoKT09PScxMTIwJyl7CiAgICAgIGZvcmVhY2ggKCR3LT5nZXRfaXRlbXMoKSBhcyAkaXQpeyBpZiAoJGl0LT5nZXRfbWV0YSgnX3BzX3NvdXJjZScpPT09J2NhbGNfcHJvZHVjdCcpeyAkaXQtPmRlbGV0ZV9tZXRhX2RhdGEoJ19wc19zb3VyY2UnKTsgJGl0LT5hZGRfbWV0YV9kYXRhKCdfcHNfcGxhbl9zb3VyY2UnLCdjYWxjX3Byb2R1Y3QnLHRydWUpOyAkaXQtPnNhdmUoKTsgJG9bJ2VpbHV0ZV9wZXJ2YWRpbnRhJ109JGl0LT5nZXRfaWQoKTsgfSB9CiAgICAgICR3LT5hZGRfb3JkZXJfbm90ZSgnTEFVS1RJIOKAlCBkdWJsaWthdGFzOiB0xIUgcGHEjWnEhSBwcmVrxJkgdMSFIHBhxI1pxIUgZGllbsSFIGFwbW9rxJdqbyAjMTEyMSAodnkuYmllbGlhdXNrYXNAKS4gUHJpbWluaW3FsyBrbGllbnRlaSBuZXNpxbNzdGkuIOKAnkNBTENfUFJPRFVDVCBzaXVuxI1pYSBrbGllbnR1aeKAnCBidXZvIHNrYWnEjWl1b2tsxJdzIGF0cmlidWNpam9zIHJha3RhcywgbmUgdGlla8SXamFzIOKAlCBzdXR2YXJreXRhIFMxNjk1LicsZmFsc2UsdHJ1ZSk7ICRvWydwYXN0YWJhJ109J29rJzsgfQogIH0KICBpZiAoJGY9PT0nMicpewogICAgJG9bJ21kNSddPW1kNV9maWxlKCRwYXRoKTsgJHM9ZmlsZV9nZXRfY29udGVudHMoJHBhdGgpOyAkb1snX3BzX3NvdXJjZV9saWtvJ109c3Vic3RyX2NvdW50KCRzLCInX3BzX3NvdXJjZSciKTsgJG9bJ19wc19wbGFuX3NvdXJjZSddPXN1YnN0cl9jb3VudCgkcywiJ19wc19wbGFuX3NvdXJjZSciKTsKICAgICRvWydlMTEyMCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9pbS5tZXRhX2tleSxMRUZUKG9pbS5tZXRhX3ZhbHVlLDQwKSB2IEZST00geyR3cGRiLT5wcmVmaXh9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgb2ltIEpPSU4geyR3cGRiLT5wcmVmaXh9d29vY29tbWVyY2Vfb3JkZXJfaXRlbXMgb2kgT04gb2kub3JkZXJfaXRlbV9pZD1vaW0ub3JkZXJfaXRlbV9pZCBXSEVSRSBvaS5vcmRlcl9pZD0zNjA5NCBBTkQgb2ltLm1ldGFfa2V5IElOICgnX3BzX3NvdXJjZScsJ19wc19wbGFuX3NvdXJjZScsJ19wc19wZXRfaWQnKSIsQVJSQVlfQSk7CiAgICAkb1sncGFzdGFib3MnXT1hcnJheV9tYXAoZnVuY3Rpb24oJG4pe3JldHVybiAkbi0+ZGF0ZV9jcmVhdGVkLT5kYXRlKCdIOmknKS4nICcubWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCRuLT5jb250ZW50KSwwLDkwKTt9LGFycmF5X3NsaWNlKHdjX2dldF9vcmRlcl9ub3RlcyhhcnJheSgnb3JkZXJfaWQnPT4zNjA5NCwnbGltaXQnPT4zKSksMCwzKSk7CiAgICAkb1snc3RhdHVzYXNfMTEyMCddPWdldF9wb3N0X3N0YXR1cygzNjA5NCk/OiR3cGRiLT5nZXRfdmFyKCJTRUxFQ1Qgc3RhdHVzIEZST00geyR3cGRiLT5wcmVmaXh9d2Nfb3JkZXJzIFdIRVJFIGlkPTM2MDk0Iik7CiAgfQogIG91dDoKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-074643';
const GKEY='ps_s1695e';
const PHASES=["1", "2"];
const OUT='analize/s1695_e.json';
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
