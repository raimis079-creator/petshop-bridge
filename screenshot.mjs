process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODEgciDigJQgcmVhZC1vbmx5OiBwcmlzdGF0eW1vIHpvbm9zL21ldG9kYWksIFZlbmlwYWsgcGx1Z2lubyBtZXRvZGFpIGlyIMWhYWx5cywgbGVpZMW+aWFtb3MgxaFhbHlzLCBuZW1va2FtbyBzaXVudGltbyB0YWlzeWtsxJdzLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY4MXInXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTY4MSByJyk7CiAgJG9bJ3NhbHlzJ109YXJyYXkoJ2FsbG93ZWQnPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9hbGxvd2VkX2NvdW50cmllcycpLCdzcGVjaWZpYyc9PmdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX3NwZWNpZmljX2FsbG93ZWRfY291bnRyaWVzJyksJ3NoaXBfdG8nPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9zaGlwX3RvX2NvdW50cmllcycpLCdzaGlwX3NwZWNpZmljJz0+Z2V0X29wdGlvbignd29vY29tbWVyY2Vfc3BlY2lmaWNfc2hpcF90b19jb3VudHJpZXMnKSwnYmFzZSc9PmdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2RlZmF1bHRfY291bnRyeScpLCd0YXhfYmFzZWQnPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV90YXhfYmFzZWRfb24nKSk7CiAgZm9yZWFjaChXQ19TaGlwcGluZ19ab25lczo6Z2V0X3pvbmVzKCkgYXMgJHopeyAkeno9YXJyYXkoJ2lkJz0+JHpbJ2lkJ10sJ3Bhdic9PiR6Wyd6b25lX25hbWUnXSwnbG9jJz0+YXJyYXlfbWFwKGZ1bmN0aW9uKCRsKXtyZXR1cm4gJGwtPnR5cGUuJzonLiRsLT5jb2RlO30sJHpbJ3pvbmVfbG9jYXRpb25zJ10pLCdtZXQnPT5hcnJheSgpKTsgZm9yZWFjaCgkelsnc2hpcHBpbmdfbWV0aG9kcyddIGFzICRtKXsgJHp6WydtZXQnXVtdPWFycmF5KCdpbnN0Jz0+JG0tPmluc3RhbmNlX2lkLCdpZCc9PiRtLT5pZCwncGF2Jz0+JG0tPnRpdGxlLCdvbic9PiRtLT5lbmFibGVkLCdzZXQnPT5hcnJheV9pbnRlcnNlY3Rfa2V5KCRtLT5pbnN0YW5jZV9zZXR0aW5ncyxhcnJheV9mbGlwKGFycmF5KCdjb3N0JywnbWluX2Ftb3VudCcsJ3JlcXVpcmVzJywndHlwZScsJ3ByaWNlJywnZnJlZV9zaGlwcGluZ19hbW91bnQnLCdlbmFibGVfZnJlZV9zaGlwcGluZycsJ2lnbm9yZV9kaXNjb3VudHMnLCd2ZW5pcGFrX3ByaWNlJywnZnJlZV9mcm9tJywndGF4X3N0YXR1cycpKSkpOyB9ICRvWyd6b25vcyddW109JHp6OyB9CiAgJHowPW5ldyBXQ19TaGlwcGluZ19ab25lKDApOyAkb1snem9uYTAnXT1hcnJheV9tYXAoZnVuY3Rpb24oJG0pe3JldHVybiAkbS0+aWQuJyMnLiRtLT5pbnN0YW5jZV9pZC4nICcuJG0tPnRpdGxlLicgb249Jy4kbS0+ZW5hYmxlZDt9LCR6MC0+Z2V0X3NoaXBwaW5nX21ldGhvZHMoKSk7CiAgJG9bJ21ldG9kYWknXT1hcnJheV9rZXlzKFdDKCktPnNoaXBwaW5nKCktPmdldF9zaGlwcGluZ19tZXRob2RzKCkpOwogIGZvcmVhY2goYXJyYXlfa2V5cyhXQygpLT5zaGlwcGluZygpLT5nZXRfc2hpcHBpbmdfbWV0aG9kcygpKSBhcyAkbWlkKSBpZihzdHJpcG9zKCRtaWQsJ3ZlbmlwYWsnKSE9PWZhbHNlKXsgJG09V0MoKS0+c2hpcHBpbmcoKS0+Z2V0X3NoaXBwaW5nX21ldGhvZHMoKVskbWlkXTsgJG9bJ3ZlbmlwYWsnXVskbWlkXT1hcnJheSgnY2xzJz0+Z2V0X2NsYXNzKCRtKSwnc3VwcG9ydHMnPT4kbS0+c3VwcG9ydHMsJ2Zvcm0nPT5hcnJheV9rZXlzKChhcnJheSkkbS0+Z2V0X2luc3RhbmNlX2Zvcm1fZmllbGRzKCkpKTsgfQogICRvWyd2ZW5pcGFrX29wdCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lIG4sTEVGVChvcHRpb25fdmFsdWUsMzAwKSB2IEZST00geyRwfW9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJXZlbmlwYWslJyBBTkQgb3B0aW9uX25hbWUgTk9UIExJS0UgJ190cmFuc2llbnQlJyBMSU1JVCAyMCIsQVJSQVlfQSk7CiAgZm9yZWFjaChnbG9iKFdQX1BMVUdJTl9ESVIuJy8qdmVuaXBhayovKi5waHAnKSBhcyAkZil7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgaWYocHJlZ19tYXRjaCgnL1BsdWdpbiBOYW1lOlxzKiguKykvJywkcywkbSkpICRvWyd2ZW5pcGFrX3BsdWcnXVtdPXRyaW0oJG1bMV0pLicgJy5iYXNlbmFtZShkaXJuYW1lKCRmKSkuJyB2Jy4ocHJlZ19tYXRjaCgnL1ZlcnNpb246XHMqKFtcZC5dKykvJywkcywkbXYpPyRtdlsxXTonPycpOyB9CiAgZm9yZWFjaChnbG9iKFdQX1BMVUdJTl9ESVIuJy8qdmVuaXBhayoveywqLywqLyovfSoucGhwJyxHTE9CX0JSQUNFKSBhcyAkZil7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgaWYocHJlZ19tYXRjaF9hbGwoJy9eLiooXCdMVlwnfCJMViJ8XCdFRVwnfCJFRSJ8Y291bnRyaWVzfHBpY2t1cHx0ZXJtaW5hbHxsb2NrZXIpLiokL21pJywkcywkbSkpICRvWyd2ZW5pcGFrX3NhbHlzJ11bYmFzZW5hbWUoJGYpXT1hcnJheV9zbGljZShhcnJheV91bmlxdWUoYXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gc3Vic3RyKHRyaW0oJHgpLDAsMTYwKTt9LCRtWzBdKSksMCw4KTsgfQogICRvWydlJ109JHdwZGItPmxhc3RfZXJyb3I7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-114628';
const GKEY='ps_s1681r';
const PHASES=["A"];
const OUT='analize/s1681_r.json';
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
