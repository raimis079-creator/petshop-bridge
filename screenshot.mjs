process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzIxdiByZWFkLW9ubHk6IGtyYW10YWx1LXJpbmtpbmlhaSBwc2wuIGtvcnRlbGVzIGlkLT5pbWc7IGxhdWthaSBmaWx0cm8ga29udGVrc3RhcyAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MjF2J10pKSByZXR1cm47ICRyPVsndic9PidTMTcyMXYnXTsgQHNldF90aW1lX2xpbWl0KDEyMCk7CiAgJHVhPVsndGltZW91dCc9PjI1LCdzc2x2ZXJpZnknPT5mYWxzZSwndXNlci1hZ2VudCc9PidNb3ppbGxhLzUuMCBwcy1zMTcyMScsJ2Nvb2tpZXMnPT5bJ3BzX2pzJz0+JzEnXV07CiAgdHJ5ewogICAgZm9yZWFjaChbJ2tyYW10YWx1Jz0+Jy9rYXRlZ29yaWphL3JpbmtpbmlhaS9rcmFtdGFsdS1yaW5raW5pYWkvJywncmlua2luaWFpJz0+Jy9rYXRlZ29yaWphL3JpbmtpbmlhaS8nXSBhcyAkaz0+JHUpewogICAgICAkdD1nZXRfdGVybV9ieSgnc2x1ZycsJGs9PT0na3JhbXRhbHUnPydrcmFtdGFsdS1yaW5raW5pYWknOidyaW5raW5pYWknLCdwcm9kdWN0X2NhdCcpOyAkbGluaz1nZXRfdGVybV9saW5rKCR0KTsKICAgICAgJHJzPXdwX3JlbW90ZV9nZXQoJGxpbmsuJz9wc192PScudGltZSgpLCR1YSk7ICRoPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRycyk7CiAgICAgICRyWyRrXVsnbGluayddPSRsaW5rOyAkclska11bJ2NvZGUnXT13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcnMpOyAkclska11bJ2NhY2hlX2hkciddPWFycmF5X2ludGVyc2VjdF9rZXkoKGFycmF5KXdwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXJzKCRycyktPmdldEFsbCgpLGFycmF5X2ZsaXAoWyd4LWNhY2hlJywnY2FjaGUtY29udHJvbCcsJ3gtc3VwZXItY2FjaGUnLCdjZi1jYWNoZS1zdGF0dXMnLCdhZ2UnXSkpOwogICAgICBwcmVnX21hdGNoX2FsbCgnL2NsYXNzPSJwcm9kdWN0LXNtYWxsIGNvbFteIl0qXGJwb3N0LShcZCspXGIuKj88ZGl2IGNsYXNzPSJib3gtaW1hZ2UiPi4qPzxpbWdbXj5dKlxzc3JjPSIoW14iXSspIi9zJywkaCwkbSxQUkVHX1NFVF9PUkRFUik7CiAgICAgIGZvcmVhY2goJG0gYXMgJHgpeyAkclska11bJ2NhcmRzJ11bKGludCkkeFsxXV09YmFzZW5hbWUoJHhbMl0pOyB9CiAgICAgICRyWyRrXVsnc3VwZXJjYWNoZV9rb21lbnRhcmFzJ109cHJlZ19tYXRjaCgnLzwhLS1ccyooRHluYW1pYyBwYWdlIGdlbmVyYXRlZHxDYWNoZWQgcGFnZSBnZW5lcmF0ZWQpW14+XSotLT4vaScsJGgsJGMpPyRjWzBdOiduZXJhJzsKICAgIH0KICAgIC8vIGxhdWthaTogYWRkX2ZpbHRlciBrb250ZWtzdGFzCiAgICAkcz1maWxlX2dldF9jb250ZW50cyhXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWxhdWthaS5waHAnKTsgJHBvcz1zdHJwb3MoJHMsImFkZF9maWx0ZXIoICd3b29jb21tZXJjZV9wcm9kdWN0X2dldF9pbWFnZV9pZCciKTsgJHJbJ2ZpbHRlcl9jdHgnXT1wcmVnX3JlcGxhY2UoJy9ccysvJywnICcsc3Vic3RyKCRzLG1heCgwLCRwb3MtOTAwKSwxMTAwKSk7CiAgICAkclsnaGFzX2ZpbHRlcl9ub3cnXT1oYXNfZmlsdGVyKCd3b29jb21tZXJjZV9wcm9kdWN0X2dldF9pbWFnZV9pZCcpOwogICAgJHJbJ3lyYV9sYXVrYXNfc3JjJ109cHJlZ19tYXRjaCgnL2Z1bmN0aW9uXHMreXJhX2xhdWthc1xzKlwoW14pXSpcKVxzKlx7LnswLDMwMH0vcycsJHMsJG1tKT9wcmVnX3JlcGxhY2UoJy9ccysvJywnICcsJG1tWzBdKTonJzsKICAgICRyWydncnVwZV9zcmMnXT1wcmVnX21hdGNoKCcvZnVuY3Rpb25ccytncnVwZVxzKlwoW14pXSpcKVxzKlx7LnswLDQwMH0vcycsJHMsJG1tKT9wcmVnX3JlcGxhY2UoJy9ccysvJywnICcsJG1tWzBdKTonJzsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-163651';
const GKEY='ps_s1721v';
const PHASES=["1"];
const OUT='analize/s1721v.json';
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
