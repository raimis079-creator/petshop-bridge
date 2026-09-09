process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjYyIHNhcmdhcyArIGF2cG4gcmVjb24gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9aXNzZXQoJF9HRVRbJ3BzX3MxNjYyYSddKT8kX0dFVFsncHNfczE2NjJhJ106Jyc7IGlmKCRmIT09J0dPJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2NjJBJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOwogICAgLy8gMS4gU0FSR0FTIOKAlCBudW9sYXRpbmlzIHNuaXBwZXRhcwogICAgJGtvZGFzID0gPDw8J0tPREFTJwovKioKICogUGV0c2hvcCBTYXJnYXMgTGlrdWNpbyBncmF6aW5pbWFzIHYxLjAgKGF0c2F1a2ltbyBwYXRpa3JhKQogKgogKiBMQUlLSU5BUyBTQVJHQVMgKFMxNjYxL1MxNjYyKTogcGF5LXBhZ2Uga2VsaWFzIGlzdHJpbmEgX3JlZHVjZWRfc3RvY2ssCiAqIHRvZGVsIGF0c2F1a2ltYXMgZ2FsaSB0eWxpYWkgbmVncmF6aW50aSBsaWt1Y2lvLiBTaXMgc2FyZ2FzIG5pZWtvIG5la2VpY2lhIOKAlAogKiB0aWsgcGF6eW1pIHV6c2FreW1hIGlzcGVqaW1vIHBhc3RhYmEsIGplaSBtYXppbmltYXMgYnV2bywgbyBncmF6aW5pbW8gbmVyYS4KICogU2FsaW50aSwga2FpIGJ1cyByYXN0YSBpciBzdXR2YXJreXRhIHRpa3JvamkgdHJ5bmltbyB2aWV0YS4KICovCmFkZF9hY3Rpb24oJ3dvb2NvbW1lcmNlX29yZGVyX3N0YXR1c19jYW5jZWxsZWQnLCBmdW5jdGlvbigkb2lkKXsKCSRvID0gd2NfZ2V0X29yZGVyKCRvaWQpOyBpZiAoISRvKSByZXR1cm47CglnbG9iYWwgJHdwZGI7CgkkbWF6ID0gKGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5jb21tZW50c30gV0hFUkUgY29tbWVudF9wb3N0X0lEPSVkIEFORCBjb21tZW50X3R5cGU9J29yZGVyX25vdGUnIEFORCAoY29tbWVudF9jb250ZW50IExJS0UgJ0xpa3V0aXMgc3VtYcW+aW50YXMlJScgT1IgY29tbWVudF9jb250ZW50IExJS0UgJ1N0b2NrIGxldmVscyByZWR1Y2VkJSUnKSIsICRvaWQpKTsKCWlmICghJG1heikgcmV0dXJuOwoJJGdyeiA9IChpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+Y29tbWVudHN9IFdIRVJFIGNvbW1lbnRfcG9zdF9JRD0lZCBBTkQgY29tbWVudF90eXBlPSdvcmRlcl9ub3RlJyBBTkQgKGNvbW1lbnRfY29udGVudCBMSUtFICdMaWt1dGlzIHBhZGlkaW50YXMlJScgT1IgY29tbWVudF9jb250ZW50IExJS0UgJyUlQVYgZ3LEhcW+aW5pbWFzJSUnIE9SIGNvbW1lbnRfY29udGVudCBMSUtFICdTdG9jayBsZXZlbHMgaW5jcmVhc2VkJSUnIE9SIGNvbW1lbnRfY29udGVudCBMSUtFICclJXJhbmtpbml1IGLFq2R1IFMxNiUlJykiLCAkb2lkKSk7CglpZiAoJGdyeikgcmV0dXJuOwoJJG8tPmFkZF9vcmRlcl9ub3RlKCfimqAgU0FSR0FTOiBsaWt1dGlzIGJ1dm8gc3VtYcW+aW50YXMsIGJldCBhdMWhYXVraWFudCBORUdSxK7FvU8g4oCUIGdyxIXFvmluayByYW5raW5pdSBpciBwYXRpa3JpbmsgZWlsdXTEl3MgX3JlZHVjZWRfc3RvY2suIChQZXRzaG9wIFNhcmdhcyB2MS4wKScpOwp9LCA5OSk7CktPREFTOwogICAgdG9rZW5fZ2V0X2FsbCgnPD9waHAgJy4ka29kYXMsIFRPS0VOX1BBUlNFKTsKICAgICRwYXY9J1BldHNob3AgU2FyZ2FzIExpa3VjaW8gZ3JhemluaW1hcyB2MS4wIChhdHNhdWtpbW8gcGF0aWtyYSknOwogICAgJGVzPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBuYW1lPSVzIiwkcGF2KSxBUlJBWV9BKTsKICAgIGlmKGNsYXNzX2V4aXN0cygnXENvZGVfU25pcHBldHNcU25pcHBldCcpKXsKICAgICAgJHM9bmV3IFxDb2RlX1NuaXBwZXRzXFNuaXBwZXQoKTsKICAgICAgaWYoJGVzKSAkcy0+aWQ9KGludCkkZXNbJ2lkJ107CiAgICAgICRzLT5uYW1lPSRwYXY7ICRzLT5jb2RlPSRrb2RhczsgJHMtPnNjb3BlPSdnbG9iYWwnOyAkcy0+YWN0aXZlPXRydWU7ICRzLT5wcmlvcml0eT0xMDsKICAgICAgJHMtPmRlc2M9J0xhaWtpbmFzIHNhcmdhczogaXNwZWphIGplaSBhdHNhdWt1cyBsaWt1dGlzIG5lZ3Jpem8uIFMxNjYyLic7CiAgICAgICRyPVxDb2RlX1NuaXBwZXRzXHNhdmVfc25pcHBldCgkcyk7CiAgICAgICRvWydzYXJnYXNfaWQnXT1pc19vYmplY3QoJHIpPyRyLT5pZDokcjsKICAgIH0gZWxzZSAkb1snc2FyZ2FzJ109J2tsYXNlcyBuZXJhJzsKICAgIC8vIDIuIEFWUE4gcmVjb246IHZpc2kgdXpzYWt5bWFpIHN1IG51bWVyaXUgKyBzdGF0dXNhaSArIGFwbW9rZWppbWFzCiAgICAkb1sndXpzYWt5bWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgby5pZCwgby5zdGF0dXMsIG8udG90YWxfYW1vdW50IHRvdCwgby5kYXRlX3BhaWRfZ210IHBhaWQsIG0ubWV0YV92YWx1ZSBhdnBuIEZST00geyR3cGRiLT5wcmVmaXh9d2Nfb3JkZXJzIG8gTEVGVCBKT0lOIHskd3BkYi0+cHJlZml4fXdjX29yZGVyc19tZXRhIG0gT04gbS5vcmRlcl9pZD1vLmlkIEFORCBtLm1ldGFfa2V5PSdfcGV0c2hvcF9hdnBuX251bWJlcicgV0hFUkUgby50eXBlPSdzaG9wX29yZGVyJyBPUkRFUiBCWSBvLmlkIixBUlJBWV9BKTsKICAgIC8vIDMuIGNvdW50ZXIgb3BjaWphCiAgICAkb1snb3BjaWpvcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLG9wdGlvbl92YWx1ZSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJWF2cG4lJyBPUiBvcHRpb25fbmFtZSBMSUtFICclZmFrdHVyJSciLEFSUkFZX0EpOwogICAgLy8gNC4ga3VyIHByaXNraXJpYW1hCiAgICBmb3JlYWNoKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSBhcyAkZmwpewogICAgICAkYz1maWxlKCRmbCk7CiAgICAgIGZvcmVhY2goJGMgYXMgJGk9PiRsbikgaWYoc3RycG9zKCRsbiwnX3BldHNob3BfYXZwbl9udW1iZXInKSE9PWZhbHNlKSAkb1sna29kYXMnXVtdPWJhc2VuYW1lKCRmbCkuJzonLigkaSsxKS4nICcudHJpbShtYl9zdWJzdHIoJGxuLDAsMTIwKSk7CiAgICB9CiAgICAkczI9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBjb2RlIExJS0UgJyVfcGV0c2hvcF9hdnBuX251bWJlciUnIEFORCBuYW1lIE5PVCBMSUtFICdURU1QJSciLEFSUkFZX0EpOwogICAgZm9yZWFjaCgkczIgYXMgJHgpICRvWydzbmlwJ11bXT0keFsnaWQnXS4nICcuJHhbJ25hbWUnXS4nIGFjdD0nLiR4WydhY3RpdmUnXTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-121211';
const GKEY='ps_s1662a';
const PHASES=["GO"];
const OUT='analize/s1662_a.json';
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

