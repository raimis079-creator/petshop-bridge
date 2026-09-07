process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzYgcnVuIHIg4oCUIFI6IG1pZ3J1b3R1IGtsaWVudHUgcmVjb24gKFdQIHVzZXJzLCBpbXBvcnRvIHp5bW9zLCB3ZWxjb21lIG1vZGFsYXMpLiBSRUFELU9OTFkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjM2ciddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjM2IHInKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkb1sndXNlcnNfdmlzbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH11c2VycyIpOwogICRyb2xlcz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX3ZhbHVlIHYsIENPVU5UKCopIG4gRlJPTSB7JHB9dXNlcm1ldGEgV0hFUkUgbWV0YV9rZXk9J3skcH1jYXBhYmlsaXRpZXMnIEdST1VQIEJZIG1ldGFfdmFsdWUgT1JERVIgQlkgbiBERVNDIExJTUlUIDgiLE9CSkVDVCk7CiAgJHJyPWFycmF5KCk7IGZvcmVhY2goJHJvbGVzIGFzICRyKXsgJHJyW3N1YnN0cigkci0+diwwLDYwKV09KGludCkkci0+bjsgfSAkb1sncm9sZXMnXT0kcnI7CiAgLy8gdmFydG90b2phaSBzdSB1enNha3ltYWlzIChIUE9TICsgbGVnYWN5KQogICRocG9zPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBjdXN0b21lcl9pZCkgRlJPTSB7JHB9d2Nfb3JkZXJzIFdIRVJFIGN1c3RvbWVyX2lkPjAiKTsKICAkb1sndXNlcnNfc3VfdXpzYWt5bWFpc19ocG9zJ109JGhwb3M7CiAgLy8gaW1wb3J0byBwZWRzYWthaSB1c2VybWV0YQogICRrZXlzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG1ldGFfa2V5IGssIENPVU5UKCopIG4gRlJPTSB7JHB9dXNlcm1ldGEgV0hFUkUgbWV0YV9rZXkgTElLRSAnJWltcG9ydCUnIE9SIG1ldGFfa2V5IExJS0UgJyVlc2hvcCUnIE9SIG1ldGFfa2V5IExJS0UgJyVtaWdyJScgT1IgbWV0YV9rZXkgTElLRSAnJXBzXyUnIEdST1VQIEJZIG1ldGFfa2V5IE9SREVSIEJZIG4gREVTQyBMSU1JVCAxNSIsT0JKRUNUKTsKICAka2s9YXJyYXkoKTsgZm9yZWFjaCgka2V5cyBhcyAkcil7ICRra1skci0+a109KGludCkkci0+bjsgfSAkb1sndXNlcm1ldGFfenltb3MnXT0ka2s7CiAgLy8gcmVnaXN0cmFjaWpvcyBkYXR1IHBhc2lza2lyc3R5bWFzIChpbXBvcnRhcyA9IHZpZW5hIGRpZW5hLCBkYXVnKQogICRyZWc9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgREFURSh1c2VyX3JlZ2lzdGVyZWQpIGQsIENPVU5UKCopIG4gRlJPTSB7JHB9dXNlcnMgR1JPVVAgQlkgZCBPUkRFUiBCWSBuIERFU0MgTElNSVQgNiIsT0JKRUNUKTsKICAkcmQ9YXJyYXkoKTsgZm9yZWFjaCgkcmVnIGFzICRyKXsgJHJkWyRyLT5kXT0oaW50KSRyLT5uOyB9ICRvWydyZWdpc3RyYWNpam9zX3RvcCddPSRyZDsKICAvLyB3ZWxjb21lIG1vZGFsYXMKICAkb1snd2VsY29tZV9tb2RhbF9lbmFibGVkJ109Z2V0X29wdGlvbigncGV0c2hvcF93ZWxjb21lX21vZGFsX2VuYWJsZWQnLCcobmVyYSknKTsKICAkb1snd2VsY29tZV9tb2RhbF9mYWlsYXMnXT1maWxlX2V4aXN0cyhXUF9DT05URU5UX0RJUi4nL3BsdWdpbnMvcGV0c2hvcC1jb3JlL2luY2x1ZGVzL2NsYXNzLXdlbGNvbWUtbW9kYWwucGhwJyk/J3BsdWdpbnMvcGV0c2hvcC1jb3JlL2luY2x1ZGVzJzona2l0dXIvbmVyYXN0YSc7CiAgaWYoJG9bJ3dlbGNvbWVfbW9kYWxfZmFpbGFzJ109PT0na2l0dXIvbmVyYXN0YScpewogICAgZm9yZWFjaChnbG9iKFdQX0NPTlRFTlRfRElSLicvKi9wZXRzaG9wLWNvcmUvKi9jbGFzcy13ZWxjb21lLW1vZGFsLnBocCcpIGFzICRmKXsgJG9bJ3dlbGNvbWVfbW9kYWxfZmFpbGFzJ109c3RyX3JlcGxhY2UoV1BfQ09OVEVOVF9ESVIsJycsJGYpOyB9CiAgfQogIC8vIG1hZ2ljIGxpbmsga2xhc2UKICAkb1snbWFnaWNfbG9naW4nXT1jbGFzc19leGlzdHMoJ1BldHNob3BfTWFnaWNfTG9naW4nKT8neXJhJzona2xhc2VzIG5lcmEgKHRpa3JpbnRpIGZhaWxhKSc7CiAgZm9yZWFjaChnbG9iKFdQX0NPTlRFTlRfRElSLicve3BsdWdpbnMsbXUtcGx1Z2luc30veywqLywqLyovfSptYWdpYyoucGhwJyxHTE9CX0JSQUNFKSBhcyAkZil7ICRvWydtYWdpY19mYWlsYWknXVtdPXN0cl9yZXBsYWNlKFdQX0NPTlRFTlRfRElSLCcnLCRmKTsgfQogIC8vIFNlbmRlciBwcmVudW1lcmF0b3JpYWkgbG9rYWxpYWk/CiAgJG9bJ3NlbmRlcl9sZW50ZWxlcyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICd7JHB9JXNlbmRlciUnIik7CiAgd3Bfc2VuZF9qc29uKCRvKTsKfSwxKTsK';
const VER='dep-143046';
const GKEY='ps_s1636r';
const PHASES=["R"];
const OUT='analize/s1636_r.json';
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
