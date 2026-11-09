process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODQwdi1lIEtQVCBwcmVrZXMgKHRyaXVzaWFpLCBWaXRhcGxhc3RpbikgLT4gZHJhZnQgaWtpIHJlZ2lzdHJhY2lqb3MgKDEgZHJ5LCAyIGFwcGx5LCAzIHBhdGlrcmEgKyBmZWVkJ2FpLCA5IGF0c3RhdHl0aSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODQwdmUnXSkpIHJldHVybjsKICAkZj0kX0dFVFsncHNfczE4NDB2ZSddOyBAc2V0X3RpbWVfbGltaXQoMjgwKTsgQGluaV9zZXQoJ21lbW9yeV9saW1pdCcsJzc2OE0nKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4NDB2ZScsJ2ZhemUnPT4kZl07ICR0ej1uZXcgRGF0ZVRpbWVab25lKCdFdXJvcGUvVmlsbml1cycpOwogICRJRFM9WzEyOTM2LDE0NDQ3LDIwNjQ4LDIwNjU0LDM4MjcwLDIzNTkzLDIzNTk1XTsKICAkc3RhdGU9ZnVuY3Rpb24oJHBpZCl7ICRwPWdldF9wb3N0KCRwaWQpOyByZXR1cm4gWydpZCc9PiRwaWQsJ3RpdGxlJz0+JHA/JHAtPnBvc3RfdGl0bGU6bnVsbCwnc3RhdHVzJz0+JHA/JHAtPnBvc3Rfc3RhdHVzOm51bGwsJ3JhbmthJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHNfcmFua2FfaXNpbXRhJyx0cnVlKSwnc3RvY2tfc3RhdHVzJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfc3RvY2tfc3RhdHVzJyx0cnVlKSwnc2FuZCc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKSwndXJsJz0+Z2V0X3Blcm1hbGluaygkcGlkKV07IH07CiAgdHJ5ewogIGlmKCRmPT09JzEnKXsgZm9yZWFjaCgkSURTIGFzICRpZCkgJHJbJ2RhYmFyJ11bXT0kc3RhdGUoJGlkKTsgJHJbJ2Jha195cmEnXT1nZXRfb3B0aW9uKCdwc19zMTg0MHZfa3B0X2JhaycpPzE6MDsgJHJbJ2RwX3Bha2FpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG9zdF9pZCBwaWQsIG1ldGFfdmFsdWUgYmFzZSBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX2RwX2Jhc2VfcHJvZHVjdF9pZCcgQU5EIG1ldGFfdmFsdWUgSU4gKCIuaW1wbG9kZSgnLCcsJElEUykuIikiLEFSUkFZX0EpOyB9CiAgaWYoJGY9PT0nMicpewogICAgJGJlZm9yZT1bXTsgZm9yZWFjaCgkSURTIGFzICRpZCkgJGJlZm9yZVtdPSRzdGF0ZSgkaWQpOwogICAgaWYoIWdldF9vcHRpb24oJ3BzX3MxODQwdl9rcHRfYmFrJykpIGFkZF9vcHRpb24oJ3BzX3MxODQwdl9rcHRfYmFrJyxbJ2xhaWthcyc9PihuZXcgRGF0ZVRpbWUoJ25vdycsJHR6KSktPmZvcm1hdCgnWS1tLWQgSDppOnMnKSwnc3RhdGUnPT4kYmVmb3JlXSwnJywnbm8nKTsKICAgIGZvcmVhY2goJElEUyBhcyAkaWQpeyAkcD1nZXRfcG9zdCgkaWQpOyBpZighJHApeyAkclsnbmVyYSddW109JGlkOyBjb250aW51ZTsgfSBpZigkcC0+cG9zdF9zdGF0dXMhPT0nZHJhZnQnKXsgJHJlcz13cF91cGRhdGVfcG9zdChbJ0lEJz0+JGlkLCdwb3N0X3N0YXR1cyc9PidkcmFmdCddLHRydWUpOyAkclsndXBkYXRlJ11bJGlkXT1pc193cF9lcnJvcigkcmVzKT8kcmVzLT5nZXRfZXJyb3JfbWVzc2FnZSgpOidvayc7IH0gdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJ19wc19yYW5rYV9pc2ltdGEnLCd0YWlwJyk7IHVwZGF0ZV9wb3N0X21ldGEoJGlkLCdfcHNfdm12dF9pc2ltdGEnLCcyMDI2LTExLTA5IFZNVlQgYWt0YXMgSU5TLTI2LTAwMDc4IChLUFQpIOKAkyBpa2kgcmVnaXN0cmFjaWpvcywgUmFpbWlvIG51cm9keW1hcyAxMjo0MCcpOyBpZihmdW5jdGlvbl9leGlzdHMoJ3djX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMnKSkgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkaWQpOyBjbGVhbl9wb3N0X2NhY2hlKCRpZCk7IH0KICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfY2xlYXJfY2FjaGUnKSkgd3BfY2FjaGVfY2xlYXJfY2FjaGUoKTsKICAgIGZvcmVhY2goJElEUyBhcyAkaWQpICRyWydwbyddW109JHN0YXRlKCRpZCk7CiAgfQogIGlmKCRmPT09JzMnKXsKICAgIGZvcmVhY2goJElEUyBhcyAkaWQpeyAkcz0kc3RhdGUoJGlkKTsgJHU9Z2V0X29wdGlvbigncHNfczE4NDB2X2twdF9iYWsnKVsnc3RhdGUnXT8/W107ICRvbGQ9Jyc7IGZvcmVhY2goJHUgYXMgJHgpIGlmKCR4WydpZCddPT0kaWQpICRvbGQ9JHhbJ3VybCddOyAkaD0kb2xkP3dwX3JlbW90ZV9nZXQoJG9sZCxbJ3RpbWVvdXQnPT4yMCwncmVkaXJlY3Rpb24nPT4wXSk6bnVsbDsgJHNbJ2h0dHAnXT0kaD8oaXNfd3BfZXJyb3IoJGgpPyRoLT5nZXRfZXJyb3JfbWVzc2FnZSgpOndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRoKS4nIOKGkiAnLndwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXIoJGgsJ2xvY2F0aW9uJykpOictJzsgJHJbJ3BhdGlrcmEnXVtdPSRzOyB9CiAgICBkb19hY3Rpb24oJ3BzX2ZlZWRzX25ha3RpbmlzJyk7CiAgICBmb3JlYWNoKFsnZ29vZ2xlJywna2FpbmEyNCcsJ2thaW5vcyddIGFzICRmbil7ICRmeD13cF91cGxvYWRfZGlyKClbJ2Jhc2VkaXInXS4iL3BldHNob3AtZmVlZHMvJGZuLnhtbCI7ICR0PWlzX2ZpbGUoJGZ4KT9maWxlX2dldF9jb250ZW50cygkZngpOicnOyAkaGl0PTA7IGZvcmVhY2goJElEUyBhcyAkaWQpeyBpZihwcmVnX21hdGNoKCcvPGc6aWQ+XHMqJy4kaWQuJ1xzKjxcL2c6aWQ+fDxpZD5ccyonLiRpZC4nXHMqPFwvaWQ+fHByb2R1Y3RfaWQ9IicuJGlkLicifFw/cD0nLiRpZC4nXGJ8XC8nLiRpZC4nXC8vJywkdCkpICRoaXQrKzsgfSAkclsnZmVlZCddWyRmbl09WydtdGltZSc9PmlzX2ZpbGUoJGZ4KT9kYXRlKCdIOmk6cycsZmlsZW10aW1lKCRmeCkpOm51bGwsJ3RyaXVzaWFtc19taW5pbWEnPT5zdWJzdHJfY291bnQobWJfc3RydG9sb3dlcigkdCksJ3RyaXXFoWlhbXMnKSwndml0YXBsYXN0aW5fbWluaW1hJz0+c3Vic3RyX2NvdW50KG1iX3N0cnRvbG93ZXIoJHQpLCd2aXRhcGxhc3RpbicpLCdpZF9oaXRzJz0+JGhpdF07IH0KICAgICRyWydsYWlrYXMnXT0obmV3IERhdGVUaW1lKCdub3cnLCR0eikpLT5mb3JtYXQoJ1ktbS1kIEg6aTpzJyk7CiAgfQogIGlmKCRmPT09JzknKXsgJGI9Z2V0X29wdGlvbigncHNfczE4NDB2X2twdF9iYWsnKTsgaWYoJGIpeyBmb3JlYWNoKCRiWydzdGF0ZSddIGFzICR4KXsgd3BfdXBkYXRlX3Bvc3QoWydJRCc9PiR4WydpZCddLCdwb3N0X3N0YXR1cyc9PiR4WydzdGF0dXMnXV0pOyBkZWxldGVfcG9zdF9tZXRhKCR4WydpZCddLCdfcHNfcmFua2FfaXNpbXRhJyk7IGRlbGV0ZV9wb3N0X21ldGEoJHhbJ2lkJ10sJ19wc192bXZ0X2lzaW10YScpOyAkclsnYXRzdGF0eXRhJ11bXT0kc3RhdGUoJHhbJ2lkJ10pOyB9IH0gZWxzZSAkclsnRVJSJ109J27El3JhIGJhayc7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-104107';
const GKEY='ps_s1840ve';
const PHASES=["1", "2", "3"];
const OUT='analize/s1840v_e.json';
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
