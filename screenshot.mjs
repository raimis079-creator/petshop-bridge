process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzExYSddKSkgcmV0dXJuOwogICRyPVtdOwogICRyZj1BQlNQQVRILidyb2JvdHMudHh0JzsgJHJbJ3JvYm90c19maWxlJ109ZmlsZV9leGlzdHMoJHJmKT9maWxlX2dldF9jb250ZW50cygkcmYpOm51bGw7CiAgJHJtPWdldF9vcHRpb24oJ3JhbmstbWF0aC1vcHRpb25zLWdlbmVyYWwnKTsgJHJbJ3JtX3JvYm90cyddPWlzX2FycmF5KCRybSkmJmlzc2V0KCRybVsncm9ib3RzX3R4dF9jb250ZW50J10pPyRybVsncm9ib3RzX3R4dF9jb250ZW50J106JyhuZXJhKSc7CiAgJHJbJ3JtX21vZHVsZXMnXT1nZXRfb3B0aW9uKCdyYW5rX21hdGhfbW9kdWxlcycpOwogIC8vIDQwNCBwbHVnaW4KICAkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLTQwNC1hdGl0aWttdW8ucGhwJzsgJGM9ZmlsZV9leGlzdHMoJGYpP2ZpbGVfZ2V0X2NvbnRlbnRzKCRmKTonJzsgJHJbJzQwNF9tZDUnXT1tZDUoJGMpOyAkclsnNDA0X2xlbiddPXN0cmxlbigkYyk7CiAgcHJlZ19tYXRjaF9hbGwoJy8oY29uc3QgW0EtWl9dK3xmdW5jdGlvbiBbYS16X10rKS8nLCRjLCRtKTsgJHJbJzQwNF9zdHJ1Y3QnXT0kbVswXTsKICAkaT1zdHJwb3MoJGMsJ0FMSUFTJyk7ICRyWyc0MDRfYWxpYXNfc25pcCddPSRpIT09ZmFsc2U/c3Vic3RyKCRjLCRpLDE1MDApOnN1YnN0cigkYywwLDE1MDApOwogIC8vIGxlZ2FjeSBtYXAKICAkbG09Z2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qbGVnYWN5KicpOyAkclsnbGVnYWN5X2ZpbGVzJ109JGxtOwogIGZvcmVhY2goJGxtIGFzICR4KXsgaWYoc3Vic3RyKCR4LC01KT09PScuanNvbicpeyAkaj1qc29uX2RlY29kZShmaWxlX2dldF9jb250ZW50cygkeCksdHJ1ZSk7ICRyWydsZWdhY3lfbiddWyR4XT1pc19hcnJheSgkaik/Y291bnQoJGopOjA7ICRrcz1hcnJheV9maWx0ZXIoYXJyYXlfa2V5cygoYXJyYXkpJGopLGZ1bmN0aW9uKCRrKXtyZXR1cm4gc3RyaXBvcygkaywnYmxvZycpIT09ZmFsc2V8fHN0cmlwb3MoJGssJ3JvdXRlJykhPT1mYWxzZTt9KTsgJHJbJ2xlZ2FjeV9ibG9nJ11bJHhdPWFycmF5X3NsaWNlKGFycmF5X21hcChmdW5jdGlvbigkayl1c2UoJGope3JldHVybiBbJGssJGpbJGtdXTt9LGFycmF5X3ZhbHVlcygka3MpKSwwLDE1KTt9IH0KICAvLyBibG9nIHByaW50IC0+IGhvdyBoYW5kbGVkIG5vdwogIGZvcmVhY2goWycvaW5kZXgucGhwP3JvdXRlPWJsb2cvYXJ0aWNsZS9wcmludHMmYmxvZ2lkPTIxJnZpZXc9cHJpbnQnLCcvaW5kZXgucGhwP3JvdXRlPWJsb2cvYXJ0aWNsZSZibG9naWQ9MjEnLCcvP3JvdXRlPWJsb2cvYXJ0aWNsZSZibG9naWQ9MjEnXSBhcyAkdSl7ICRoPXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJHUpLFsndGltZW91dCc9PjIwLCdzc2x2ZXJpZnknPT5mYWxzZSwncmVkaXJlY3Rpb24nPT4wXSk7ICRyWydibG9nJ11bJHVdPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRoKS4nICcud3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkaCwnbG9jYXRpb24nKS4nICcud3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkaCwneC1yZWRpcmVjdC1ieScpOyB9CiAgLy8gcG9zdHMKICAkclsncG9zdHMnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHApe3JldHVybiBbJHAtPklELCRwLT5wb3N0X25hbWUsJHAtPnBvc3RfdHlwZV07fSwgZ2V0X3Bvc3RzKFsncG9zdF90eXBlJz0+Wydwb3N0JywncGFnZSddLCdwb3N0c19wZXJfcGFnZSc9PjIwMCwncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcsJ21ldGFfa2V5Jz0+J19sZWdhY3lfYmxvZ2lkJ10pKTsKICBnbG9iYWwgJHdwZGI7ICRyWydtZXRhX2tleXNfbGVnYWN5J109JHdwZGItPmdldF9jb2woIlNFTEVDVCBESVNUSU5DVCBtZXRhX2tleSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIG1ldGFfa2V5IExJS0UgJyVsZWdhY3klJyBPUiBtZXRhX2tleSBMSUtFICclYmxvZyUnIExJTUlUIDMwIik7CiAgLy8gYnJhbmQgYXJjaGl2ZSBzY2hlbWEgc291cmNlCiAgJHJbJ3djX3NkX2hvb2tzJ109W107IGdsb2JhbCAkd3BfZmlsdGVyOyBmb3JlYWNoKFsnd29vY29tbWVyY2Vfc2hvcF9sb29wJywncmFua19tYXRoL2pzb25fbGQnLCd3cF9mb290ZXInXSBhcyAkaGspeyBpZihpc3NldCgkd3BfZmlsdGVyWyRoa10pKSBmb3JlYWNoKCR3cF9maWx0ZXJbJGhrXS0+Y2FsbGJhY2tzIGFzICRwcj0+JGNicykgZm9yZWFjaCgkY2JzIGFzICRrPT4kY2IpeyAkZm49JGNiWydmdW5jdGlvbiddOyAkbj1pc19hcnJheSgkZm4pPyhpc19vYmplY3QoJGZuWzBdKT9nZXRfY2xhc3MoJGZuWzBdKTokZm5bMF0pLic6OicuJGZuWzFdOihpc19zdHJpbmcoJGZuKT8kZm46J2Nsb3N1cmUnKTsgJHJbJ3djX3NkX2hvb2tzJ11bJGhrXVtdPSRwci4nICcuJG47IH0gfQogICRiPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy9nYW1pbnRvamFzL2V4Y2x1c2lvbi8/bmM9Jy50aW1lKCkpLFsndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZV0pKTsKICBwcmVnX21hdGNoX2FsbCgnIzxzY3JpcHRbXj5dKmxkXCtqc29uW14+XSo+KC4qPyk8L3NjcmlwdD4jcycsJGIsJG1tKTsgJHJbJ2JyYW5kX2xkJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gc3Vic3RyKCR4LDAsMzAwKS4nIC4uLiAnLnN1YnN0cigkeCwtNjAwKTt9LCRtbVsxXSk7CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSwgMSk7Cg==';
const VER='dep-132653';
const GKEY='ps_s1711a';
const PHASES=["1"];
const OUT='analize/s1711_a.json';
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
