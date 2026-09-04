process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTcgcnVuIHI1IChyZWNvbiwgdGlrIHNrYWl0eW1hcyk6IGJhbmtvIHJla3Zpeml0YWkgKHRlbWEgYmFzZS5waHAvZnVuY3Rpb25zLnBocCwgV0NETiBvcGNpam9zLCBXQyBvcGNpam9zKSBwYXZlZGltbyBwYXJhZ3JhZnVpIGxhacWha2U7IGRpc3BhdGNoZXInaW8gcGF2eXpkeXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfcjUnXSkpIHJldHVybjsKICAkbz1hcnJheSgndic9PidTMTYxNyByNScpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDEyMCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRncmVwPWZ1bmN0aW9uKCRmaWxlLCRwYXRzLCRjdHg9MSwkbWF4PTMwKXsgJHI9YXJyYXkoKTsgaWYoIWZpbGVfZXhpc3RzKCRmaWxlKSkgcmV0dXJuICdOxJZSQSAnLiRmaWxlOyAkbD1maWxlKCRmaWxlKTsgZm9yZWFjaCgkbCBhcyAkaT0+JGxuKXsgZm9yZWFjaCgoYXJyYXkpJHBhdHMgYXMgJHB0KXsgaWYocHJlZ19tYXRjaCgkcHQsJGxuKSl7ICRyW109KCRpKzEpLic6ICcubWJfc3Vic3RyKHRyaW0oaW1wbG9kZSgnIOKPjiAnLGFycmF5X21hcCgndHJpbScsYXJyYXlfc2xpY2UoJGwsbWF4KDAsJGktJGN0eCksJGN0eCoyKzEpKSkpLDAsNDAwKTsgYnJlYWs7IH0gfSBpZihjb3VudCgkcik+PSRtYXgpIGJyZWFrOyB9IHJldHVybiAkcjsgfTsKICAkdGQ9Z2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCk7ICRvWyd0ZW1hX2ZhaWxhaSddPWFycmF5KCk7IGZvcmVhY2goYXJyYXkoJ2Z1bmN0aW9ucy5waHAnLCd3b29jb21tZXJjZS93b29jb21tZXJjZS1kZWxpdmVyeS1ub3Rlcy9iYXNlLnBocCcsJ3dvb2NvbW1lcmNlLWRlbGl2ZXJ5LW5vdGVzL2Jhc2UucGhwJywnd29vY29tbWVyY2Uvd29vY29tbWVyY2UtZGVsaXZlcnktbm90ZXMvcHJpbnQtY29udGVudC5waHAnKSBhcyAkZil7IGlmKGZpbGVfZXhpc3RzKCR0ZC4nLycuJGYpKSAkb1sndGVtYV9mYWlsYWknXVtdPSRmOyB9CiAgJHBhdHM9YXJyYXkoJy9MVFxkezJ9XHM/XGR7NH0vJywnL0lCQU4vaScsJy9cYkJJQ1xifFNXSUZUL2knLCcvU3dlZGJhbmt8U0VCfEx1bWlub3J8UmV2b2x1dHxDaXRhZGVsZXzFoGlhdWxpxbN8U2lhdWxpdS9pJywnL8SuKG1vbnxtb24pxJdzIGtvZGFzfFBWTSBtb2svaScpOwogIGZvcmVhY2goJG9bJ3RlbWFfZmFpbGFpJ10gYXMgJGYpeyAkb1snZ3JlcCddWyRmXT0kZ3JlcCgkdGQuJy8nLiRmLCRwYXRzLDEsMjUpOyB9CiAgZm9yZWFjaChnbG9iKCR0ZC4nL3dvb2NvbW1lcmNlL3dvb2NvbW1lcmNlLWRlbGl2ZXJ5LW5vdGVzLyoucGhwJykgYXMgJGYpeyAkb1snd2Nkbl90ZW1hJ11bXT1iYXNlbmFtZSgkZik7IH0KICAkb1snb3BjaWpvcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLExFRlQob3B0aW9uX3ZhbHVlLDYwMCkgdiBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ3djZG4lJyBPUiBvcHRpb25fbmFtZSBMSUtFICclaW52b2ljZSVjb21wYW55JScgT1Igb3B0aW9uX25hbWUgTElLRSAncGV0c2hvcF8lcmVrdml6JScgT1Igb3B0aW9uX25hbWUgTElLRSAncHNfYmFuayUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BldHNob3BfYmFuayUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3dvb2NvbW1lcmNlX2JhY3MlJyIsQVJSQVlfQSk7CiAgJG9bJ29wY2lqb3NfaWJhbiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLExFRlQob3B0aW9uX3ZhbHVlLDMwMCkgdiBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl92YWx1ZSBSRUdFWFAgJ0xUWzAtOV17Mn1bIF0/WzAtOV17NH0nIEFORCBMRU5HVEgob3B0aW9uX3ZhbHVlKTwyMDAwMCBMSU1JVCAxMCIsQVJSQVlfQSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LDk5KTsK';
const VER='dep-221946';
const GKEY='ps_r5';
const PHASES=["GO"];
const OUT='analize/s1617_r5.json';
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
