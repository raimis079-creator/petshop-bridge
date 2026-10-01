process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQ1cSBhbmFsaXplcyBpc3RvcmlqYSArIHBlcmp1bmdpbW8gZGF0YTogMSBkcnkgLyAyIGJhaytwZXJzdGF0eXRpK3JpYmEgLyAzIHBhdGlrcmEgLyA5IGF0c3RhdHl0aSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NDVxJ10pKSByZXR1cm47ICRmPSRfR0VUWydwc19zMTc0NXEnXTsgQHNldF90aW1lX2xpbWl0KDI4MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzQ1cScsJ2ZhemUnPT4kZl07CiAgJEE9J1BldHNob3BfSXN0b3Jpam9zX0FkYXB0ZXJpcyc7IGlmKCFjbGFzc19leGlzdHMoJEEpKXsgZm9yZWFjaChnZXRfZGVjbGFyZWRfY2xhc3NlcygpIGFzICRjKXsgaWYoc3RyaXBvcygkYywnSXN0JykhPT1mYWxzZSAmJiBzdHJpcG9zKCRjLCdBZGFwdGVyJykhPT1mYWxzZSkgJEE9JGM7IH0gfSAkclsna2xhc2UnXT0kQTsKICAkSVU9JFAuJ3BzX2lzdF9mYWt0X3V6c2FreW1haSc7ICRJRT0kUC4ncHNfaXN0X2Zha3RfZWlsdXRlcyc7CiAgJGNudD1mdW5jdGlvbigpIHVzZSgkd3BkYiwkSVUsJElFKXsgcmV0dXJuIFsndSc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRJVSIpLCdlJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJElFIiksJ21heCc9PiR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgTUFYKGRpZW5hKSBGUk9NICRJVSIpLCdzdW1hJz0+cm91bmQoJHdwZGItPmdldF92YXIoIlNFTEVDVCBTVU0odmlzb19jdCkgRlJPTSAkSVUiKS8xMDAsMildOyB9OwogIGlmKCRmPT09JzEnKXsgJHJbJ2RhYmFyJ109JGNudCgpOyAkclsnZHJ5J109Y2FsbF91c2VyX2Z1bmMoWyRBLCdwZXJzdGF0eXRpJ10sdHJ1ZSk7IHVuc2V0KCRyWydkcnknXVsnZmFrdF9jcmVhdGUnXSk7CiAgICAkdD1maWxlX2dldF9jb250ZW50cygobmV3IFJlZmxlY3Rpb25DbGFzcygkQSkpLT5nZXRGaWxlTmFtZSgpKTsgJHA9c3RycG9zKCR0LCdwdWJsaWMgc3RhdGljIGZ1bmN0aW9uIHBlcnN0YXR5dGknKTsgJHE9c3RycG9zKCR0LCdwdWJsaWMgc3RhdGljIGZ1bmN0aW9uJywkcCs0MCk7ICRib2R5PXN1YnN0cigkdCwkcCwkcS0kcCk7ICRyWydwZXJzdGF0eXRpX2t2aWVjaWFfcHJhdHVydGludGknXT1zdHJwb3MoJGJvZHksJ3ByYXR1cnRpbnRpJykhPT1mYWxzZTsgJHAyPXN0cnBvcygkdCwnZnVuY3Rpb24gcHJhdHVydGludGknKTsgJHJbJ3ByYXR1cnRpbnRpJ109c3Vic3RyKCR0LG1heCgwLCRwMi00MDApLDcwMCk7IH0KICBpZigkZj09PScyJyl7CiAgICAkclsncHJpZXMnXT0kY250KCk7CiAgICBmb3JlYWNoKFskSVUsJElFXSBhcyAkdCl7ICRiPSR0LidfYmFrX3MxNzQ1JzsgJHdwZGItPnF1ZXJ5KCJEUk9QIFRBQkxFIElGIEVYSVNUUyAkYiIpOyAkd3BkYi0+cXVlcnkoIkNSRUFURSBUQUJMRSAkYiBMSUtFICR0Iik7ICR3cGRiLT5xdWVyeSgiSU5TRVJUIElOVE8gJGIgU0VMRUNUICogRlJPTSAkdCIpOyAkclsnYmFrJ11bJGJdPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRiIik7IH0KICAgIGlmKCRyWydiYWsnXVskSVUuJ19iYWtfczE3NDUnXSE9PSRyWydwcmllcyddWyd1J10peyAkclsnU1RPUCddPSdiYWsgbmVzdXRhbXBhJzsgfQogICAgZWxzZSB7ICRyWydwZXJzdGF0eXRpJ109Y2FsbF91c2VyX2Z1bmMoWyRBLCdwZXJzdGF0eXRpJ10sZmFsc2UpOyBpZihtZXRob2RfZXhpc3RzKCRBLCdwcmF0dXJ0aW50aScpICYmICFlbXB0eSgkX0dFVFsncHInXSkpICRyWydwcmF0dXJ0aW50aSddPWNhbGxfdXNlcl9mdW5jKFskQSwncHJhdHVydGludGknXSk7CiAgICAgICRyWydwbyddPSRjbnQoKTsgJHJbJ3JpYmEnXT1jYWxsX3VzZXJfZnVuYyhbJEEsJ251c3RhdHl0aV9yaWJhJ10sJzIwMjYtMDktMDknKTsgJHJbJ3JpYmFfb3BjJ109Z2V0X29wdGlvbigncHNfcGVyanVuZ2ltb19kYXRhJyk7IH0KICB9CiAgaWYoJGY9PT0nMycpewogICAgJHJbJ2lzdCddPSRjbnQoKTsgJHJbJ3JpYmEnXT1nZXRfb3B0aW9uKCdwc19wZXJqdW5naW1vX2RhdGEnKTsgJHZ1PWNhbGxfdXNlcl9mdW5jKFskQSwndnUnXSk7CiAgICAkclsncm9kaW55cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElGKHV6c2FreW1hc19pZD49OTAwMDAwMDAwLCdlU2hvcHJlbnQnLCdwZXRzaG9wLmx0JykgcywgTUlOKGRpZW5hKSBudW8sIE1BWChkaWVuYSkgaWtpLCBDT1VOVCgqKSBuIEZST00gJHZ1IFdIRVJFIHRlc3RpbmlzPTAgR1JPVVAgQlkgMSIsQVJSQVlfQSk7CiAgICAkclsnZHZpZ3Vib3NfZGllbm9zJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIChTRUxFQ1QgZGllbmEgRlJPTSAkdnUgR1JPVVAgQlkgZGllbmEgSEFWSU5HIFNVTSh1enNha3ltYXNfaWQ+PTkwMDAwMDAwMCk+MCBBTkQgU1VNKHV6c2FreW1hc19pZDw5MDAwMDAwMDApPjApIHgiKTsKICAgIHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy9hZG1pbi5waHAnOyAkYWRtPWdldF91c2VycyhbJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEsJ2ZpZWxkcyc9PidJRCddKTsgd3Bfc2V0X2N1cnJlbnRfdXNlcigoaW50KSRhZG1bMF0pOwogICAgJF9HRVRbJ3BhZ2UnXT0ncHMta2xpZW50YWknOyAkX0dFVFsnc2FsdGluaXMnXT0nYWJ1Jzsgb2Jfc3RhcnQoKTsgdHJ5eyBjYWxsX3VzZXJfZnVuYyhbJ1BldHNob3BfQXRhc2thaXRhX0tsaWVudGFpJywncHVzbGFwaXMnXSk7ICRlPScnOyB9Y2F0Y2goVGhyb3dhYmxlICR0KXsgJGU9JHQtPmdldE1lc3NhZ2UoKTsgfSAkaD1vYl9nZXRfY2xlYW4oKTsgJHR4PXRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrL3UnLCcgJyx3cF9zdHJpcF9hbGxfdGFncygkaCkpKTsKICAgICRyWydwdXNsYXBpcyddPVsna2xhaWRhJz0+JGUsJ3Rla3N0YXMnPT5tYl9zdWJzdHIoJHR4LDAsNTAwKV07ICRwPW1iX3N0cnBvcygkdHgsJ8WgYWx0aW5pcycpOyAkclsnc2FsdGluaW9fZWlsdXRlJ109JHAhPT1mYWxzZT9tYl9zdWJzdHIoJHR4LCRwLDE0MCk6Jyc7CiAgfQogIGlmKCRmPT09JzknKXsKICAgIGZvcmVhY2goWyRJVSwkSUVdIGFzICR0KXsgJGI9JHQuJ19iYWtfczE3NDUnOyBpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJGInIikpeyAkd3BkYi0+cXVlcnkoIkRST1AgVEFCTEUgSUYgRVhJU1RTICR0Iik7ICR3cGRiLT5xdWVyeSgiUkVOQU1FIFRBQkxFICRiIFRPICR0Iik7ICRyWydhdHN0YXR5dGEnXVtdPSR0OyB9IH0KICAgIGRlbGV0ZV9vcHRpb24oJ3BzX3Blcmp1bmdpbW9fZGF0YScpOyBjYWxsX3VzZXJfZnVuYyhbJEEsJ2F0bmF1amludGlfcm9kaW5pdXMnXSk7ICRyWydwbyddPSRjbnQoKTsKICB9CiAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==';
const VER='dep-194023';
const GKEY='ps_s1745q';
const PHASES=["1"];
const OUT='out/s1745_q.json';
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
