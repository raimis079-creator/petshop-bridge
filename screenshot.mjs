process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzkxYSAxMCBBVlBOIHNhc2thaXR1IFBERiBwYWllc2thIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc5MWEnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE1MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzkxYSddOwogICRMPVsnQVZQTjAxMTE5NycsJ0FWUE4wMTExNzcnLCdBVlBOMDExMTc2JywnQVZQTjAxMTIwNScsJ0FWUE4wMTExODInLCdBVlBOMDExMTQ1JywnQVZQTjAxMTE2MicsJ0FWUE4wMTExNzAnLCdBVlBOMDExMDUyJywnQVZQTjAxMTA0OCddOwogIHRyeXsKICAgICRpbj0iJyIuaW1wbG9kZSgiJywnIiwkTCkuIiciOwogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3JkZXJfaWQsIG1ldGFfdmFsdWUgYXZwbiBGUk9NIHskUH13Y19vcmRlcnNfbWV0YSBXSEVSRSBtZXRhX2tleT0nX3BldHNob3BfYXZwbl9udW1iZXInIEFORCBtZXRhX3ZhbHVlIElOKCRpbikiLEFSUkFZX0EpOwogICAgZm9yZWFjaCgkcm93cyBhcyAmJHgpeyAkbz13Y19nZXRfb3JkZXIoJHhbJ29yZGVyX2lkJ10pOyAkeFsnbnInXT0kby0+Z2V0X29yZGVyX251bWJlcigpOyAkeFsnc3RhdHVzJ109JG8tPmdldF9zdGF0dXMoKTsgJG09W107CiAgICAgIGZvcmVhY2goJG8tPmdldF9tZXRhX2RhdGEoKSBhcyAkbWQpeyBpZihwcmVnX21hdGNoKCcvcGRmfGludm9pY2V8c2Fza2FpdHx3Y2RufGF2cG58ZG9jdW1lbnQvaScsJG1kLT5rZXkpKXsgJHY9JG1kLT52YWx1ZTsgJG1bJG1kLT5rZXldPWlzX3NjYWxhcigkdik/bWJfc3Vic3RyKChzdHJpbmcpJHYsMCwyMDApOmpzb25fZW5jb2RlKCR2KTsgfSB9ICR4WydtZXRhJ109JG07IH0gdW5zZXQoJHgpOwogICAgJHJbJ3V6c2FreW1haSddPSRyb3dzOwogICAgLy8gZmFpbGFpIHVwbG9hZHMgc3UgQVZQTiBwYXZhZGluaW11CiAgICAkZj1bXTsgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcihXUF9DT05URU5UX0RJUi4nL3VwbG9hZHMnLEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSk7ICRuPTA7CiAgICBmb3JlYWNoKCRpdCBhcyAkZmlsZSl7ICRiPSRmaWxlLT5nZXRGaWxlbmFtZSgpOyBpZihzdHJpcG9zKCRiLCcucGRmJyk9PT1mYWxzZSkgY29udGludWU7ICRuKys7IGlmKHN0cmlwb3MoJGIsJ0FWUE4wMTExOScpIT09ZmFsc2V8fHN0cmlwb3MoJGIsJ0FWUE4wMTEnKSE9PWZhbHNlKXsgJGZbXT1zdHJfcmVwbGFjZShXUF9DT05URU5UX0RJUiwnJywkZmlsZS0+Z2V0UGF0aG5hbWUoKSkuJyAnLiRmaWxlLT5nZXRTaXplKCk7IH0gaWYoY291bnQoJGYpPjMwKSBicmVhazsgfQogICAgJHJbJ3BkZl92aXNvJ109JG47ICRyWydwZGZfYXZwbiddPSRmOwogICAgJHJbJ2Z1bmtjaWpvcyddPVsncGV0c2hvcF9nZW5lcmF0ZV9pbnZvaWNlX3BkZic9PmZ1bmN0aW9uX2V4aXN0cygncGV0c2hvcF9nZW5lcmF0ZV9pbnZvaWNlX3BkZicpXTsKICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygncGV0c2hvcF9nZW5lcmF0ZV9pbnZvaWNlX3BkZicpKXsgJHJmPW5ldyBSZWZsZWN0aW9uRnVuY3Rpb24oJ3BldHNob3BfZ2VuZXJhdGVfaW52b2ljZV9wZGYnKTsgJHJbJ2dlbl9mYWlsYXMnXT1zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRyZi0+Z2V0RmlsZU5hbWUoKSkuJzonLiRyZi0+Z2V0U3RhcnRMaW5lKCkuJy0nLiRyZi0+Z2V0RW5kTGluZSgpOyAkbHM9ZmlsZSgkcmYtPmdldEZpbGVOYW1lKCkpOyAkbz1bXTsgZm9yKCRpPSRyZi0+Z2V0U3RhcnRMaW5lKCk7JGk8PW1pbigkcmYtPmdldEVuZExpbmUoKSwkcmYtPmdldFN0YXJ0TGluZSgpKzcwKTskaSsrKSAkb1tdPSRpLic6ICcucnRyaW0obWJfc3Vic3RyKCRsc1skaS0xXSwwLDIwMCkpOyAkclsnZ2VuX2tvZGFzJ109JG87IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-204438';
const GKEY='ps_s1791a';
const PHASES=["1"];
const OUT='analize/s1791p_a.json';
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
