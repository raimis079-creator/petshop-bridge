process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQ3biBsYXVraWFtb3MgcHJla2VzIChwc19zdG9ja193YXRjaCkgcmVhZC1vbmx5ICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc0N24nXSkpIHJldHVybjsKICAkZj0kX0dFVFsncHNfczE3NDduJ107IEBzZXRfdGltZV9saW1pdCgyMDApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTc0N24nLCdmYXplJz0+JGZdOwogICR0ej1uZXcgRGF0ZVRpbWVab25lKCdFdXJvcGUvVmlsbml1cycpOwogIHRyeXsKICAkdD0kUC4ncHNfc3RvY2tfd2F0Y2gnOwogICRyWydsZW50ZWxlJ109JHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyR0JyIpOwogIGlmKCEkclsnbGVudGVsZSddKXsgJHJbJ2tpdG9zJ109JHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJyV3YXRjaCUnIik7ICRyWydraXRvczInXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAnJXN0b2NrJSciKTsgd3Bfc2VuZF9qc29uKCRyKTsgfQogICRjb2xzPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkdCIpOyAkclsnc3R1bHBlbGlhaSddPSRjb2xzOwogICRyWydzdGF0dXNhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1cywgQ09VTlQoKikgbiwgQ09VTlQoRElTVElOQ1QgcHJvZHVjdF9pZCkgcHJla2l1LCBDT1VOVChESVNUSU5DVCBlbWFpbCkga2xpZW50dSBGUk9NICR0IEdST1VQIEJZIHN0YXR1cyIsQVJSQVlfQSk7CiAgJGRjPWluX2FycmF5KCdjcmVhdGVkX2F0JywkY29scyk/J2NyZWF0ZWRfYXQnOihpbl9hcnJheSgnc3VrdXJ0YScsJGNvbHMpPydzdWt1cnRhJzpudWxsKTsKICAkbmM9aW5fYXJyYXkoJ25vdGlmaWVkX2F0JywkY29scyk/J25vdGlmaWVkX2F0JzpudWxsOwogIGlmKCRkYyl7ICRyWydwZXJfbWVuJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgREFURV9GT1JNQVQoJGRjLCclWS0lbScpIG0sIENPVU5UKCopIG4sIFNVTShzdGF0dXM9J3dhaXRpbmcnKSBsYXVraWEgRlJPTSAkdCBHUk9VUCBCWSAxIE9SREVSIEJZIDEiLEFSUkFZX0EpOyAkclsnbnVvX2lraSddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgTUlOKCRkYykgbnVvLCBNQVgoJGRjKSBpa2kgRlJPTSAkdCIsQVJSQVlfQSk7IH0KICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwcm9kdWN0X2lkLCBDT1VOVCgqKSBuIi4oJGRjPyIsIE1JTigkZGMpIHBpcm0sIE1BWCgkZGMpIHBhc2siOiIiKS4iIEZST00gJHQgV0hFUkUgc3RhdHVzPSd3YWl0aW5nJyBHUk9VUCBCWSBwcm9kdWN0X2lkIE9SREVSIEJZIG4gREVTQywgcHJvZHVjdF9pZCIsQVJSQVlfQSk7CiAgJEw9W107ICRzdW09WydsYXVraWFfZWlsJz0+MCwncHJla2l1Jz0+MCwnamF1X2luc3RvY2snPT4wLCdkcmFmdCc9PjBdOwogIGZvcmVhY2goJHJvd3MgYXMgJHgpeyAkcGlkPShpbnQpJHhbJ3Byb2R1Y3RfaWQnXTsgJHA9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7ICRzdW1bJ2xhdWtpYV9laWwnXSs9KGludCkkeFsnbiddOyAkc3VtWydwcmVraXUnXSsrOwogICAgaWYoISRwKXsgJExbXT1bJHBpZCwoaW50KSR4WyduJ10sJ05FUkFfUFJFS0VTJ107IGNvbnRpbnVlOyB9CiAgICAkcGFyPSRwLT5nZXRfcGFyZW50X2lkKCk/d2NfZ2V0X3Byb2R1Y3QoJHAtPmdldF9wYXJlbnRfaWQoKSk6bnVsbDsKICAgICRzdD0kcC0+Z2V0X3N0b2NrX3N0YXR1cygpOyAkcHM9Z2V0X3Bvc3Rfc3RhdHVzKCRwaWQpOyBpZigkc3Q9PT0naW5zdG9jaycpICRzdW1bJ2phdV9pbnN0b2NrJ10rKzsgaWYoJHBzIT09J3B1Ymxpc2gnKSAkc3VtWydkcmFmdCddKys7CiAgICAkc3JjPSR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgc291cmNlIEZST00geyRQfXBzX3NvdXJjZXMgV0hFUkUgcHJvZHVjdF9pZD0lZCIsJHBpZCkpOwogICAgJHNvbGQ9KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPQUxFU0NFKFNVTShsLnByb2R1Y3RfcXR5KSwwKSBGUk9NIHskUH13Y19vcmRlcl9wcm9kdWN0X2xvb2t1cCBsIEpPSU4geyRQfXdjX29yZGVyX3N0YXRzIHMgT04gcy5vcmRlcl9pZD1sLm9yZGVyX2lkIFdIRVJFIGwucHJvZHVjdF9pZD0lZCBBTkQgcy5zdGF0dXMgSU4oJ3djLWNvbXBsZXRlZCcsJ3djLXByb2Nlc3NpbmcnKSBBTkQgcy5kYXRlX2NyZWF0ZWQ+PURBVEVfU1VCKE5PVygpLElOVEVSVkFMIDM2NSBEQVkpIiwkcGlkKSk7CiAgICAkTFtdPVskcGlkLChpbnQpJHhbJ24nXSxtYl9zdWJzdHIoaHRtbF9lbnRpdHlfZGVjb2RlKCRwLT5nZXRfbmFtZSgpKSwwLDcwKSwkcC0+Z2V0X3NrdSgpLCRzdCwkcC0+bWFuYWdpbmdfc3RvY2soKT8oaW50KSRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKTonLScsJHBzLGltcGxvZGUoJy8nLCRzcmMpLHJvdW5kKChmbG9hdCkkcC0+Z2V0X3ByaWNlKCksMiksJHNvbGQsJGRjP3N1YnN0cigkeFsncGlybSddLDAsMTApOicnLCRkYz9zdWJzdHIoJHhbJ3Bhc2snXSwwLDEwKTonJ107CiAgfQogICRyWydzdXZlc3RpbmUnXT0kc3VtOwogICRyWydsYXVraWFfY29scyddPVsncGlkJywna2xpZW50dScsJ3BhdmFkaW5pbWFzJywnc2t1Jywnc3RvY2snLCdraWVraXMnLCdwb3N0Jywnc2FsdGluaXMnLCdrYWluYScsJ3BhcmR1b3RhXzM2NWQnLCdwaXJtYXMnLCdwYXNrdXRpbmlzJ107CiAgJHJbJ2xhdWtpYSddPSRMOwogIGlmKCRuYyl7ICRyWydwcmFuZXN0YSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEVfRk9STUFUKCRuYywnJVktJW0nKSBtLCBDT1VOVCgqKSBuIEZST00gJHQgV0hFUkUgJG5jIElTIE5PVCBOVUxMIEdST1VQIEJZIDEgT1JERVIgQlkgMSIsQVJSQVlfQSk7IH0KICAkclsnbGFpc2thaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1cywgc2tpcF9yZWFzb24sIENPVU5UKCopIG4sIE1BWChjcmVhdGVkX2F0KSBwYXNrIEZST00geyRQfXBzX2VtYWlsX2pvYnMgV0hFUkUgZmxvd19rZXkgTElLRSAnJXN0b2NrJScgR1JPVVAgQlkgc3RhdHVzLCBza2lwX3JlYXNvbiIsQVJSQVlfQSk7CiAgaWYoJHdwZGItPmxhc3RfZXJyb3IpICRyWydTUUxfRVJSJ11bXT0kd3BkYi0+bGFzdF9lcnJvcjsKICAkclsnbGFpa2FzJ109KG5ldyBEYXRlVGltZSgnbm93JywkdHopKS0+Zm9ybWF0KCdZLW0tZCBIOmk6cycpOwogIH1jYXRjaChcVGhyb3dhYmxlICRlKXsgJHJbJ0tMQUlEQSddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSk7Cg==';
const VER='dep-140140';
const GKEY='ps_s1747n';
const PHASES=["1"];
const OUT='analize/s1747n_a.json';
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
