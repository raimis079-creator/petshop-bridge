process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODlzIHgg4oCUIERJQUdOT1rEliA1OiBrYXMgcHJpdmVyxI1pYSBrdXJ0aSBwYXNreXLEhSBrYXNvamUgKGNyZWF0ZWFjY291bnQpLiBSZWFkLW9ubHkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjg5c3gnXSkpIHJldHVybjsgJG89YXJyYXkoKTsKICAkb1snZGVmYXVsdF9jaGVja2VkJ109YXBwbHlfZmlsdGVycygnd29vY29tbWVyY2VfY3JlYXRlX2FjY291bnRfZGVmYXVsdF9jaGVja2VkJyxmYWxzZSk7CiAgJG9bJ3JlZ2lzdHJhdGlvbl9yZXF1aXJlZCddPVdDKCktPmNoZWNrb3V0KCkgPyBXQygpLT5jaGVja291dCgpLT5pc19yZWdpc3RyYXRpb25fcmVxdWlyZWQoKSA6IG51bGw7CiAgJG9bJ3JlZ2lzdHJhdGlvbl9lbmFibGVkJ109V0MoKS0+Y2hlY2tvdXQoKSA/IFdDKCktPmNoZWNrb3V0KCktPmlzX3JlZ2lzdHJhdGlvbl9lbmFibGVkKCkgOiBudWxsOwogICRoaXRzPWFycmF5KCk7ICRkaXJzPWFycmF5KFdQTVVfUExVR0lOX0RJUiwgV1BfQ09OVEVOVF9ESVIuJy90aGVtZXMvZmxhdHNvbWUtY2hpbGQnLCBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlJywgV1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sJyk7CiAgJGl0PWZ1bmN0aW9uKCRkKSB1c2UgKCYkaXQsJiRoaXRzKXsgZm9yZWFjaChnbG9iKCRkLicvKicpPzphcnJheSgpIGFzICRmKXsgaWYoaXNfZGlyKCRmKSl7IGlmKGNvdW50KCRoaXRzKTw0MCkgJGl0KCRmKTsgY29udGludWU7fSBpZihzdWJzdHIoJGYsLTQpIT09Jy5waHAnKWNvbnRpbnVlOyAkdD1maWxlX2dldF9jb250ZW50cygkZik7CiAgICBpZihwcmVnX21hdGNoX2FsbCgnLy57MCw5MH0oY3JlYXRlYWNjb3VudHxjcmVhdGVfYWNjb3VudF9kZWZhdWx0X2NoZWNrZWR8cmVnaXN0cmF0aW9uX3JlcXVpcmVkfGVuYWJsZV9ndWVzdF9jaGVja291dHxtdXN0X2NyZWF0ZV9hY2NvdW50fHdvb2NvbW1lcmNlX2NoZWNrb3V0X3JlZ2lzdHJhdGlvbikuezAsOTB9LycsJHQsJG0pKSBmb3JlYWNoKCRtWzBdIGFzICRsKSAkaGl0c1tdPXN0cl9yZXBsYWNlKFdQX0NPTlRFTlRfRElSLCcnLCRmKS4nOiAnLnRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCRsKSk7IH0gfTsKICBmb3JlYWNoKCRkaXJzIGFzICRkKSRpdCgkZCk7IGdsb2JhbCAkd3BkYjsgJHNuPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBhY3RpdmU9MSBBTkQgKGNvZGUgTElLRSAnJWNyZWF0ZWFjY291bnQlJyBPUiBjb2RlIExJS0UgJyVjcmVhdGVfYWNjb3VudCUnIE9SIGNvZGUgTElLRSAnJXJlZ2lzdHJhdGlvbl9yZXF1aXJlZCUnIE9SIGNvZGUgTElLRSAnJWd1ZXN0X2NoZWNrb3V0JScpIixBUlJBWV9BKTsKICAkb1snaGl0cyddPWFycmF5X3NsaWNlKCRoaXRzLDAsMjUpOyAkb1snc25pcHBldHMnXT0kc247CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-152027';
const GKEY='ps_s1689sx';
const PHASES=["GO"];
const OUT='analize/s1689s_x.json';
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
