process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODUyayDigJQgQW5pbW9uZGEgbnVvdHJhdWtvczogYXBraXJwdGksIGJhbHRhcyBmb25hcywga3ZhZHJhdGFzIChSIGFuYWxpesSXIC8gVyByYcWheW1hcykgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX3MxODUyJ10pPyRfR0VUWydwc19zMTg1MiddOicnKTsgaWYoIWluX2FycmF5KCRmLGFycmF5KCdSJywnVycpLHRydWUpKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgQHNldF90aW1lX2xpbWl0KDI4MCk7IEBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCcxMDI0TScpOwogIHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy9pbWFnZS5waHAnOwogICRvPWFycmF5KCd2Jz0+J1MxODUyaycsJ2YnPT4kZiwnZ2QnPT5mdW5jdGlvbl9leGlzdHMoJ2ltYWdlY3JlYXRlZnJvbWpwZWcnKSk7CiAgJEFUVD1hcnJheSgzODQzMSwzODQzMywzODQzNSwzODQzNywzODQzOSwzODQ0MSk7CiAgZm9yZWFjaCgkQVRUIGFzICRhaWQpeyAkcj1hcnJheSgpOwogICAgdHJ5ewogICAgICAkZmlsZT1nZXRfYXR0YWNoZWRfZmlsZSgkYWlkKTsgJG9yaWc9JGZpbGUuJy5vcmlnX3MxODUyJzsKICAgICAgJHNyYz1maWxlX2V4aXN0cygkb3JpZyk/JG9yaWc6JGZpbGU7CiAgICAgICRpbT1AaW1hZ2VjcmVhdGVmcm9tanBlZygkc3JjKTsgaWYoISRpbSkgdGhyb3cgbmV3IEV4Y2VwdGlvbignbmVhdHNpZGFybyAnLiRzcmMpOwogICAgICAkdz1pbWFnZXN4KCRpbSk7ICRoPWltYWdlc3koJGltKTsKICAgICAgJGM9aW1hZ2Vjb2xvcmF0KCRpbSw1LDUpOyAkYmc9YXJyYXkoKCRjPj4xNikmMjU1LCgkYz4+OCkmMjU1LCRjJjI1NSk7ICRyWydiZyddPWltcGxvZGUoJywnLCRiZyk7CiAgICAgICRpc2JnPWZ1bmN0aW9uKCR4LCR5KSB1c2UoJGltLCRiZyl7ICRjPWltYWdlY29sb3JhdCgkaW0sJHgsJHkpOyByZXR1cm4gYWJzKCgoJGM+PjE2KSYyNTUpLSRiZ1swXSk8MTQgJiYgYWJzKCgoJGM+PjgpJjI1NSktJGJnWzFdKTwxNCAmJiBhYnMoKCRjJjI1NSktJGJnWzJdKTwxNDsgfTsKICAgICAgJG1pbng9JHc7JG1pbnk9JGg7JG1heHg9MDskbWF4eT0wOwogICAgICBmb3IoJHk9MDskeTwkaDskeSs9Mil7IGZvcigkeD0wOyR4PCR3OyR4Kz0yKXsgaWYoISRpc2JnKCR4LCR5KSl7IGlmKCR4PCRtaW54KSRtaW54PSR4OyBpZigkeD4kbWF4eCkkbWF4eD0keDsgaWYoJHk8JG1pbnkpJG1pbnk9JHk7IGlmKCR5PiRtYXh5KSRtYXh5PSR5OyB9IH0gfQogICAgICAkYnc9JG1heHgtJG1pbngrMTsgJGJoPSRtYXh5LSRtaW55KzE7ICRyWydiYm94J109IiRtaW54LCRtaW55IHskYnd9eHskYmh9IjsgJHJbJ3V6aW1hJ109cm91bmQobWF4KCRidywkYmgpLyR3KjEwMCkuJyUnOwogICAgICBpZigkZj09PSdXJyl7CiAgICAgICAgaWYoIWZpbGVfZXhpc3RzKCRvcmlnKSkgY29weSgkZmlsZSwkb3JpZyk7CiAgICAgICAgJHNpZGU9KGludClyb3VuZChtYXgoJGJ3LCRiaCkqMS4xMCk7ICRvdXQ9aW1hZ2VjcmVhdGV0cnVlY29sb3IoJHNpZGUsJHNpZGUpOyAkd2hpdGU9aW1hZ2Vjb2xvcmFsbG9jYXRlKCRvdXQsMjU1LDI1NSwyNTUpOyBpbWFnZWZpbGwoJG91dCwwLDAsJHdoaXRlKTsKICAgICAgICAkZHg9KGludCkoKCRzaWRlLSRidykvMik7ICRkeT0oaW50KSgoJHNpZGUtJGJoKS8yKTsKICAgICAgICBpbWFnZWNvcHkoJG91dCwkaW0sJGR4LCRkeSwkbWlueCwkbWlueSwkYncsJGJoKTsKICAgICAgICAvLyBmb25vIHNwYWx2b3MgcGlrc2VsaWFpIC0+IGJhbHRhCiAgICAgICAgZm9yKCR5PTA7JHk8JHNpZGU7JHkrKyl7IGZvcigkeD0wOyR4PCRzaWRlOyR4KyspeyAkYz1pbWFnZWNvbG9yYXQoJG91dCwkeCwkeSk7ICRSPSgkYz4+MTYpJjI1NTskRz0oJGM+PjgpJjI1NTskQj0kYyYyNTU7CiAgICAgICAgICBpZihhYnMoJFItJGJnWzBdKTwxMCYmYWJzKCRHLSRiZ1sxXSk8MTAmJmFicygkQi0kYmdbMl0pPDEwKSBpbWFnZXNldHBpeGVsKCRvdXQsJHgsJHksJHdoaXRlKTsgfSB9CiAgICAgICAgJGZpbj1pbWFnZWNyZWF0ZXRydWVjb2xvcigxMjAwLDEyMDApOyBpbWFnZWNvcHlyZXNhbXBsZWQoJGZpbiwkb3V0LDAsMCwwLDAsMTIwMCwxMjAwLCRzaWRlLCRzaWRlKTsKICAgICAgICBpbWFnZWpwZWcoJGZpbiwkZmlsZSw4OCk7IGltYWdlZGVzdHJveSgkb3V0KTsgaW1hZ2VkZXN0cm95KCRmaW4pOwogICAgICAgICRtZXRhPXdwX2dlbmVyYXRlX2F0dGFjaG1lbnRfbWV0YWRhdGEoJGFpZCwkZmlsZSk7IHdwX3VwZGF0ZV9hdHRhY2htZW50X21ldGFkYXRhKCRhaWQsJG1ldGEpOwogICAgICAgICRyWyduYXVqYXMnXT1maWxlc2l6ZSgkZmlsZSkuJyBCLCAnLmNvdW50KCRtZXRhWydzaXplcyddPz9hcnJheSgpKS4nIGR5ZMW+acWzJzsKICAgICAgICAkclsndXJsJ109d3BfZ2V0X2F0dGFjaG1lbnRfdXJsKCRhaWQpOwogICAgICB9CiAgICAgIGltYWdlZGVzdHJveSgkaW0pOwogICAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydFUlInXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgICAkb1snaW1nJ11bJGFpZF09JHI7IH0KICBpZigkZj09PSdXJyl7IGZvcmVhY2goYXJyYXkoMzg0MzAsMzg0MzIsMzg0MzQsMzg0MzYsMzg0MzgsMzg0NDAsMzg0NDIsMzg0NDMsMzg0NDQsMzg0NDUsMzg0NDYsMzg0NDcsMzg0NDgsMzg0NDkpIGFzICRwaWQpeyBjbGVhbl9wb3N0X2NhY2hlKCRwaWQpOyBpZihmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX3Bvc3RfY2hhbmdlJykpIHdwX2NhY2hlX3Bvc3RfY2hhbmdlKCRwaWQpOyB9IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-123245';
const GKEY='ps_s1852';
const PHASES=["W"];
const OUT='analize/s1852_k_W.json';
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
