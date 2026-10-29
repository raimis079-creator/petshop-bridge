process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA3ZGc1IDQwMyDFoWlhbmRpZW4gKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODA3ZGc1J10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNjApOyAkcj1bJ3YnPT4nZGc1J107ICRkb209ZGlybmFtZShBQlNQQVRIKTsKICAkZmlsZXM9Z2xvYigkZG9tLicvbG9ncy8qJyk7IHVzb3J0KCRmaWxlcyxmdW5jdGlvbigkYSwkYil7cmV0dXJuIGZpbGVtdGltZSgkYiktZmlsZW10aW1lKCRhKTt9KTsgJHJbJ25hdWphdXNpJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCRmKXtyZXR1cm4gYmFzZW5hbWUoJGYpLicgJy5kYXRlKCdtLWQgSDppJyxmaWxlbXRpbWUoJGYpKzcyMDApO30sYXJyYXlfc2xpY2UoJGZpbGVzLDAsNCkpOwogICRoPVtdOyAkdWE0MDM9W107ICRrNDAzPVtdOyAkaXA0MDM9W107CiAgZm9yZWFjaChhcnJheV9zbGljZSgkZmlsZXMsMCwzKSBhcyAkZil7IGlmKHN0cnBvcygkZiwncGhwX2Vycm9yJykhPT1mYWxzZSkgY29udGludWU7ICRyYXc9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgaWYoJHJhdz09PWZhbHNlKSBjb250aW51ZTsgJHR4dD1AZ3pkZWNvZGUoJHJhdyk7IGlmKCR0eHQ9PT1mYWxzZSkgJHR4dD0kcmF3OyBpZihzdWJzdHIoJHR4dCwyNTcsNSk9PT0ndXN0YXInKXsgJHQ9Jyc7ICRvPTA7IHdoaWxlKCRvKzUxMjw9c3RybGVuKCR0eHQpKXsgJGhkPXN1YnN0cigkdHh0LCRvLDUxMik7ICRubT10cmltKHN1YnN0cigkaGQsMCwxMDApKTsgaWYoJG5tPT09JycpIGJyZWFrOyAkc3o9b2N0ZGVjKHRyaW0oc3Vic3RyKCRoZCwxMjQsMTIpKSk7IGlmKHN0cnBvcygkbm0sJ3BldHNob3AubHQnKSE9PWZhbHNlICYmIHN0cnBvcygkbm0sJ2Vycm9yJyk9PT1mYWxzZSkgJHQuPXN1YnN0cigkdHh0LCRvKzUxMiwkc3opLiJcbiI7ICRvKz01MTIrKGludCljZWlsKCRzei81MTIpKjUxMjsgfSAkdHh0PSR0OyB9CiAgICBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkdHh0KSBhcyAkbCl7IGlmKCFwcmVnX21hdGNoKCcvXihcUyspIC4qXFsoMls4OV0pXC9PY3RcLzIwMjY6KFxkXGQpOi4qPyIoPzpHRVR8UE9TVCkgKFxTKylbXiJdKiIgKFxkezN9KSAuKiIoW14iXSopIiQvJywkbCwkbSkpIGNvbnRpbnVlOyBpZihwcmVnX21hdGNoKCcvXC4oY3NzfGpzfHBuZ3xqcGU/Z3x3ZWJwfHN2Z3x3b2ZmMj98aWNvfGdpZikoXD98JCkvaScsJG1bNF0pKSBjb250aW51ZTsgJGs9JG1bMl0uJy0nLiRtWzNdOyAkaFska109JGhbJGtdPz9bJ24nPT4wLCc0MDMnPT4wLCc1eHgnPT4wLCdicm93c2VyNDAzJz0+MF07ICRoWyRrXVsnbiddKys7IGlmKCRtWzVdPT09JzQwMycpeyAkaFska11bJzQwMyddKys7ICRpc2I9IXByZWdfbWF0Y2goJy9ib3R8Y3Jhd2x8c3BpZGVyfHB5dGhvbnxjdXJsfGdvLWh0dHB8amF2YXxodHRwY2xpZW50fGhlYWRsZXNzfHNjcmFweS9pJywkbVs2XSk7IGlmKCRpc2IpeyAkaFska11bJ2Jyb3dzZXI0MDMnXSsrOyBpZigkbVsyXT09PScyOScpeyAkdWE9bWJfc3Vic3RyKCRtWzZdLDAsOTApOyAkdWE0MDNbJHVhXT0oJHVhNDAzWyR1YV0/PzApKzE7ICRraz1tYl9zdWJzdHIocHJlZ19yZXBsYWNlKCcvXD8uKi8nLCc/JywkbVs0XSksMCw2MCk7ICRrNDAzWyRra109KCRrNDAzWyRra10/PzApKzE7ICRpcDQwM1skbVsxXV09MTsgfSB9IH0gaWYoJG1bNV1bMF09PT0nNScpICRoWyRrXVsnNXh4J10rKzsgfSB9CiAga3NvcnQoJGgpOyAkclsndmFsJ109YXJyYXlfc2xpY2UoJGgsLTMwLDMwLHRydWUpOyBhcnNvcnQoJHVhNDAzKTsgYXJzb3J0KCRrNDAzKTsgJHJbJ3VhNDAzJ109YXJyYXlfc2xpY2UoJHVhNDAzLDAsOCx0cnVlKTsgJHJbJ2s0MDMnXT1hcnJheV9zbGljZSgkazQwMywwLDEwLHRydWUpOyAkclsnaXA0MDNfbiddPWNvdW50KCRpcDQwMyk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LDEpOwo=';
const VER='dep-162144';
const GKEY='ps_s1807dg5';
const PHASES=["1"];
const OUT='analize/s1807_dg5.json';
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
