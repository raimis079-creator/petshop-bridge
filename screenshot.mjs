process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODMxdHggVHJpeGllIGlyIFpCIG5lLW1haXN0byBqdW9kcmFzY2lhaSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MzF0eCddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMjAwKTsgQGluaV9zZXQoJ21lbW9yeV9saW1pdCcsJzUxMk0nKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4MzF0eCddOwogIHRyeXsKICAkclsndHJpeGllX24nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwb3N0X3N0YXR1cyBzdCwgQ09VTlQoKikgbiBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3RpdGxlIExJS0UgJyVUcml4aWUlJyBHUk9VUCBCWSAxIixBUlJBWV9BKTsKICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgSUQgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF90aXRsZSBMSUtFICclVHJpeGllJScgTElNSVQgNDAwIik7CiAgJGtleXM9W107ICRyb3dzPVtdOwogIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkbT1nZXRfcG9zdF9tZXRhKCRpZCk7IGZvcmVhY2goJG0gYXMgJGs9PiR2KXsgaWYocHJlZ19tYXRjaCgnL2Nvc3R8emJ8dmZ8c2FuZGVsfHN0b2NrfHN1cHBsaWVyfHRpZWsvaScsJGspKSAka2V5c1ska109KCRrZXlzWyRrXT8/MCkrMTsgfQogICAgJHJvd3NbXT1bJGlkLG1iX3N1YnN0cihnZXRfdGhlX3RpdGxlKCRpZCksMCw3MCksZ2V0X3Bvc3Rfc3RhdHVzKCRpZCksJG1bJ196Yl9jb3N0J11bMF0/PycnLCRtWydfc3RvY2snXVswXT8/JycsJG1bJ19wcmljZSddWzBdPz8nJywkbVsnX3BzX3NhbmRlbGlzJ11bMF0/PycnLGltcGxvZGUoJy8nLHdwX2dldF9wb3N0X3Rlcm1zKCRpZCwncHJvZHVjdF9jYXQnLFsnZmllbGRzJz0+J25hbWVzJ10pKV07IH0KICBhcnNvcnQoJGtleXMpOyAkclsnbWV0YV9rZXlzJ109YXJyYXlfc2xpY2UoJGtleXMsMCwyNSx0cnVlKTsKICB1c29ydCgkcm93cyxmbigkYSwkYik9PihpbnQpJGJbNF0tKGludCkkYVs0XSk7ICRyWyd0cml4aWUnXT1hcnJheV9zbGljZSgkcm93cywwLDEyMCk7CiAgLy8gWkIgbmUgbWFpc3Rhczoga2F0ZWdvcmlqYSBuZSBrb25zZXJ2YWkvc2F1c2FzLCBzdSBfemJfY29zdAogICR6PSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQgaWQsIHAucG9zdF90aXRsZSBubSwgcC5wb3N0X3N0YXR1cyBzdCwgYy5tZXRhX3ZhbHVlIGNvc3QsIHMubWV0YV92YWx1ZSBzdG9jaywgcHIubWV0YV92YWx1ZSBwcmljZSBGUk9NIHskUH1wb3N0cyBwIEpPSU4geyRQfXBvc3RtZXRhIGMgT04gYy5wb3N0X2lkPXAuSUQgQU5EIGMubWV0YV9rZXk9J196Yl9jb3N0JyBMRUZUIEpPSU4geyRQfXBvc3RtZXRhIHMgT04gcy5wb3N0X2lkPXAuSUQgQU5EIHMubWV0YV9rZXk9J19zdG9jaycgTEVGVCBKT0lOIHskUH1wb3N0bWV0YSBwciBPTiBwci5wb3N0X2lkPXAuSUQgQU5EIHByLm1ldGFfa2V5PSdfcHJpY2UnIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cyBJTigncHVibGlzaCcsJ2RyYWZ0JykiLEFSUkFZX0EpOwogICRrYXQ9W107ICRuZW09W107CiAgZm9yZWFjaCgkeiBhcyAkeCl7ICRjPWltcGxvZGUoJy8nLHdwX2dldF9wb3N0X3Rlcm1zKCR4WydpZCddLCdwcm9kdWN0X2NhdCcsWydmaWVsZHMnPT4nbmFtZXMnXSkpOyAkazA9ZXhwbG9kZSgnLycsJGMpWzBdOyAka2F0WyRrMF09KCRrYXRbJGswXT8/MCkrMTsgaWYoIXByZWdfbWF0Y2goJy9rb25zZXJ2fHNhdXNhc3xtYWlzdC9pdScsJGMpICYmIChpbnQpJHhbJ3N0b2NrJ10+PTMpICRuZW1bXT1bJHhbJ2lkJ10sbWJfc3Vic3RyKCR4WydubSddLDAsNzApLCR4WydzdCddLChmbG9hdCkkeFsnY29zdCddLChpbnQpJHhbJ3N0b2NrJ10sJHhbJ3ByaWNlJ10sbWJfc3Vic3RyKCRjLDAsMzApXTsgfQogIGFyc29ydCgka2F0KTsgJHJbJ3piX2thdCddPSRrYXQ7ICRyWyd6Yl92aXNvJ109Y291bnQoJHopOyB1c29ydCgkbmVtLGZuKCRhLCRiKT0+JGFbM108PT4kYlszXSk7ICRyWyd6Yl9uZW1haXN0YXMnXT1hcnJheV9zbGljZSgkbmVtLDAsMTUwKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0VSUiddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0OyB9KTsK';
const VER='dep-120244';
const GKEY='ps_s1831tx';
const PHASES=["1"];
const OUT='analize/s1831_tx.json';
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
