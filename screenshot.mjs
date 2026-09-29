process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzM5aCBJbmRleE5vdyArIGZlZWQgbnVvdHJhdWtvcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MzloJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgyMDApOyAkcj1bJ3YnPT4nUzE3MzloJ107CiAgJG09Z2V0X29wdGlvbigncmFua19tYXRoX21vZHVsZXMnKTsgJHJbJ3JtX21vZHVsaWFpJ109JG07ICRyWydybV9pbmRleG5vdyddPWdldF9vcHRpb24oJ3JhbmstbWF0aC1vcHRpb25zLWluc3RhbnQtaW5kZXhpbmcnKTsKICAkclsncm1fdmVyc2lqYSddPWRlZmluZWQoJ1JBTktfTUFUSF9WRVJTSU9OJyk/UkFOS19NQVRIX1ZFUlNJT046bnVsbDsKICAvLyBnb29nbGUgZmVlZCBudW90cmF1a3UgZHlkemlhaSAoaW10aXMpCiAgJGZwPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wZXRzaG9wLWZlZWRzL2dvb2dsZS54bWwnOyAkclsnZmVlZCddPWZpbGVfZXhpc3RzKCRmcCk/cm91bmQoZmlsZXNpemUoJGZwKS8xMDI0KS4nayAnLmRhdGUoJ1ktbS1kIEg6aScsZmlsZW10aW1lKCRmcCkpOiduZXJhJzsKICBpZihmaWxlX2V4aXN0cygkZnApKXsgJHg9QHNpbXBsZXhtbF9sb2FkX2ZpbGUoJGZwKTsgJGltZ3M9W107IGlmKCR4KXsgJHgtPnJlZ2lzdGVyWFBhdGhOYW1lc3BhY2UoJ2cnLCdodHRwOi8vYmFzZS5nb29nbGUuY29tL25zLzEuMCcpOyBmb3JlYWNoKCR4LT54cGF0aCgnLy9pdGVtJykgYXMgJGl0KXsgJGc9JGl0LT5jaGlsZHJlbignaHR0cDovL2Jhc2UuZ29vZ2xlLmNvbS9ucy8xLjAnKTsgJGltZ3NbXT0oc3RyaW5nKSRnLT5pbWFnZV9saW5rOyB9IH0KICAgICRyWydmZWVkX3ByZWtpdSddPWNvdW50KCRpbWdzKTsgJG1hemk9MDskbmVyYT0wOyRleHQ9W107JGRpbXM9Wyc8MjIwJz0+MCwnMjIwLTQ5OSc9PjAsJzUwMC03OTknPT4wLCc4MDArJz0+MF07ICR1cD13cF9nZXRfdXBsb2FkX2RpcigpOwogICAgZm9yZWFjaCgkaW1ncyBhcyAkaT0+JHUpeyBpZighJHUpeyRuZXJhKys7Y29udGludWU7fSAkZT1zdHJ0b2xvd2VyKHBhdGhpbmZvKHBhcnNlX3VybCgkdSxQSFBfVVJMX1BBVEgpLFBBVEhJTkZPX0VYVEVOU0lPTikpOyAkZXh0WyRlXT0oJGV4dFskZV0/PzApKzE7CiAgICAgICRwYXRoPXN0cl9yZXBsYWNlKCR1cFsnYmFzZXVybCddLCR1cFsnYmFzZWRpciddLHByZWdfcmVwbGFjZSgnL15odHRwcz86XC9cLyh3d3dcLik/cGV0c2hvcFwubHQvJywnaHR0cHM6Ly9wZXRzaG9wLmx0JywkdSkpOyAkcGF0aD1wcmVnX3JlcGxhY2UoJy9cPy4qJC8nLCcnLCRwYXRoKTsKICAgICAgaWYoZmlsZV9leGlzdHMoJHBhdGgpKXsgJHM9QGdldGltYWdlc2l6ZSgkcGF0aCk7ICRtbj0kcz9taW4oJHNbMF0sJHNbMV0pOjA7ICRrPSRtbjwyMjA/JzwyMjAnOigkbW48NTAwPycyMjAtNDk5JzooJG1uPDgwMD8nNTAwLTc5OSc6JzgwMCsnKSk7ICRkaW1zWyRrXSsrOyB9IGVsc2UgJG1hemkrKzsgfQogICAgJHJbJ251b3RyX21pbl9rcmFzdGluZSddPSRkaW1zOyAkclsnbnVvdHJfZmFpbG9fbmVyYSddPSRtYXppOyAkclsnYmVfbnVvdHInXT0kbmVyYTsgJHJbJ3BsZXRpbmlhaSddPSRleHQ7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-170021';
const GKEY='ps_s1739h';
const PHASES=["1"];
const OUT='analize/s1739_h.json';
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
