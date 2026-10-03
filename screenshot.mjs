process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQ5aCBrYWJsaWFpIFNNVFAgYmUgZ2F2ZWpvICsga29kZWwgd3AtY3JvbiBzdWthc2kgbnVvbGF0IChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc0OWgnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDEyMCk7IGdsb2JhbCAkd3BkYiwkd3BfZmlsdGVyOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3NDloJywnZGFiYXJfdXRjJz0+Z21kYXRlKCdZLW0tZCBIOmk6cycpXTsKICAkY2I9ZnVuY3Rpb24oJGgpIHVzZSAoJHdwX2ZpbHRlcil7ICRvPVtdOyBpZihlbXB0eSgkd3BfZmlsdGVyWyRoXSkpIHJldHVybiBbXTsgZm9yZWFjaCgkd3BfZmlsdGVyWyRoXS0+Y2FsbGJhY2tzIGFzICRwcj0+JGFycil7IGZvcmVhY2goJGFyciBhcyAkaWQ9PiR4KXsgJGY9JHhbJ2Z1bmN0aW9uJ107ICRuPWlzX3N0cmluZygkZik/JGY6KGlzX2FycmF5KCRmKT8oaXNfb2JqZWN0KCRmWzBdKT9nZXRfY2xhc3MoJGZbMF0pOiRmWzBdKS4nOjonLiRmWzFdOidjbG9zdXJlJyk7CiAgICAgIGlmKCRmIGluc3RhbmNlb2YgQ2xvc3VyZSl7ICRyZj1uZXcgUmVmbGVjdGlvbkZ1bmN0aW9uKCRmKTsgJG49J2Nsb3N1cmUgJy5zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRyZi0+Z2V0RmlsZU5hbWUoKSkuJzonLiRyZi0+Z2V0U3RhcnRMaW5lKCk7IH0KICAgICAgZWxzZWlmKGlzX2FycmF5KCRmKSl7IHRyeXsgJHJtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCRmWzBdLCRmWzFdKTsgJG4uPScgJy5zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRybS0+Z2V0RmlsZU5hbWUoKSkuJzonLiRybS0+Z2V0U3RhcnRMaW5lKCk7IH1jYXRjaChFeGNlcHRpb24gJGUpe30gfQogICAgICBlbHNlaWYoaXNfc3RyaW5nKCRmKSYmZnVuY3Rpb25fZXhpc3RzKCRmKSl7ICRyZj1uZXcgUmVmbGVjdGlvbkZ1bmN0aW9uKCRmKTsgJG4uPScgJy5zdHJfcmVwbGFjZShBQlNQQVRILCcnLChzdHJpbmcpJHJmLT5nZXRGaWxlTmFtZSgpKS4nOicuJHJmLT5nZXRTdGFydExpbmUoKTsgfQogICAgICAkb1tdPSRwci4nICcuJG47IH0gfSByZXR1cm4gJG87IH07CiAgZm9yZWFjaChbJ3dwX3Bhc3N3b3JkX2NoYW5nZV9ub3RpZmljYXRpb25fZW1haWwnLCdwcmVfb3B0aW9uX2FkbWluX2VtYWlsJywnb3B0aW9uX2FkbWluX2VtYWlsJywnd3BfbWFpbCcsJ3ByZV93cF9tYWlsJywnYWZ0ZXJfcGFzc3dvcmRfcmVzZXQnLCdwYXNzd29yZF9yZXNldCcsJ3dwX21haWxfZmFpbGVkJ10gYXMgJGgpICRyWydrYWJsaWFpJ11bJGhdPSRjYigkaCk7CiAgJHJbJ3NuaXBwZXRzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUsTEVGVChSRVBMQUNFKGNvZGUsJ1xuJywnICcpLDIyMCkgYyBGUk9NIHskUH1zbmlwcGV0cyBXSEVSRSBjb2RlIExJS0UgJyVwYXNzd29yZCUnIE9SIGNvZGUgTElLRSAnJWFkbWluX2VtYWlsJScgT1IgY29kZSBMSUtFICcld3BfbWFpbCUnIixBUlJBWV9BKTsKICAvLyBjcm9uOiBrYXMgcHJhZGVsc3RhIGRhYmFyCiAgJGNyPV9nZXRfY3Jvbl9hcnJheSgpOyAkbm93PXRpbWUoKTsgJHByYWQ9W107ICRpbnQ9W107ICR2aXNvPTA7CiAgZm9yZWFjaCgkY3IgYXMgJHRzPT4kaG9va3MpeyBmb3JlYWNoKCRob29rcyBhcyAkaD0+JGV2cyl7IGZvcmVhY2goJGV2cyBhcyAkaz0+JGUpeyAkdmlzbysrOyAkaXY9aXNzZXQoJGVbJ2ludGVydmFsJ10pPyRlWydpbnRlcnZhbCddOjA7ICRpbnRbJGl2XT0oJGludFskaXZdPz8wKSsxOyBpZigkdHM8PSRub3cpICRwcmFkW109Z21kYXRlKCdtLWQgSDppOnMnLCR0cykuJ1ogJy4kaC4nICgnLihpc3NldCgkZVsnc2NoZWR1bGUnXSkmJiRlWydzY2hlZHVsZSddPyRlWydzY2hlZHVsZSddOid2aWVua2FydCcpLicpIC0nLnJvdW5kKCgkbm93LSR0cykvNjApLidtaW4nOyB9IH0gfQogIGtzb3J0KCRpbnQpOyAkclsnY3Jvbl92aXNvJ109JHZpc287ICRyWydjcm9uX2ludGVydmFsYWknXT0kaW50OyAkclsnY3Jvbl9wcmFkZWxzdGEnXT1hcnJheV9zbGljZSgkcHJhZCwwLDQwKTsgJHJbJ2Nyb25fcHJhZGVsc3RhX24nXT1jb3VudCgkcHJhZCk7CiAgJHJbJ2FzX3BlbmRpbmdfZHVlJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1hY3Rpb25zY2hlZHVsZXJfYWN0aW9ucyBXSEVSRSBzdGF0dXM9J3BlbmRpbmcnIEFORCBzY2hlZHVsZWRfZGF0ZV9nbXQ8PVVUQ19USU1FU1RBTVAoKSIpOwogICRyWydhc19wZW5kaW5nX2R1ZV9ob29rcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGhvb2ssIENPVU5UKCopIG4sIE1JTihzY2hlZHVsZWRfZGF0ZV9nbXQpIG51byBGUk9NIHskUH1hY3Rpb25zY2hlZHVsZXJfYWN0aW9ucyBXSEVSRSBzdGF0dXM9J3BlbmRpbmcnIEFORCBzY2hlZHVsZWRfZGF0ZV9nbXQ8PVVUQ19USU1FU1RBTVAoKSBHUk9VUCBCWSBob29rIE9SREVSIEJZIG4gREVTQyBMSU1JVCA4IixBUlJBWV9BKTsKICAkclsnYXNfY29tcGxldGVfMjRoJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaG9vaywgQ09VTlQoKikgbiBGUk9NIHskUH1hY3Rpb25zY2hlZHVsZXJfYWN0aW9ucyBXSEVSRSBzdGF0dXM9J2NvbXBsZXRlJyBBTkQgbGFzdF9hdHRlbXB0X2dtdD49REFURV9TVUIoVVRDX1RJTUVTVEFNUCgpLElOVEVSVkFMIDI0IEhPVVIpIEdST1VQIEJZIGhvb2sgT1JERVIgQlkgbiBERVNDIExJTUlUIDgiLEFSUkFZX0EpOwogIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0pOwo=';
const VER='dep-175402';
const GKEY='ps_s1749h';
const PHASES=["1"];
const OUT='s1749h.json';
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
