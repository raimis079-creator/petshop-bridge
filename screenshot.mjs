process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTEgaiDigJQgNTA4IHB1Ymxpa3VvdMWzIOKAnm7El3JhIHNhbmTEl2x5amUiIHByZWtpxbMgcGrFq3ZpcyBwYWdhbCDFoWFsdGluxK8gKHBzX3NvdXJjZXMgLyBfcHNfc2FuZGVsaXMgLyBWRi1aQiBtZXRhKSwgcGFyZGF2aW1haSAzNjUgZC4sIGRyb3BzaGlwIHF0eT0wIGxhaWt5bW8gbG9naWthIHBldHNob3AteG1sLiBSZWFkLW9ubHkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjkxaiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7ICR3cGRiLT5zdXBwcmVzc19lcnJvcnModHJ1ZSk7CiAgJG9bJ3NvdXJjZXNfY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHB9cHNfc291cmNlcyIpOwogICRvWydzb3VyY2VzX3RpcGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc291cmNlLCBDT1VOVCgqKSBuIEZST00geyRwfXBzX3NvdXJjZXMgR1JPVVAgQlkgc291cmNlIixBUlJBWV9BKTsKICAkc3FsPSJTRUxFQ1QgcHMuSUQsIHBzLnBvc3RfdGl0bGUsIHBzLnBvc3RfZGF0ZSwKICAgICAgKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9cHMuSUQgQU5EIG1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIExJTUlUIDEpIHNhbmRlbGlzLAogICAgICAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wcy5JRCBBTkQgbWV0YV9rZXk9J19zdG9jaycgTElNSVQgMSkgc3RvY2ssCiAgICAgIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXBzLklEIEFORCBtZXRhX2tleT0nX293bl9zdG9ja19xdHknIExJTUlUIDEpIGF2LAogICAgICAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wcy5JRCBBTkQgbWV0YV9rZXk9J19tYW5hZ2Vfc3RvY2snIExJTUlUIDEpIG1zLAogICAgICAoU0VMRUNUIENPVU5UKCopIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9cHMuSUQgQU5EIG1ldGFfa2V5PSdfdmZfc3VwcGxpZXJfc2t1JykgdmYsCiAgICAgIChTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wcy5JRCBBTkQgbWV0YV9rZXkgSU4gKCdfemJfY29zdCcsJ196Yl9za3UnLCdfemJfc3VwcGxpZXJfc2t1JykpIHpiLAogICAgICAoU0VMRUNUIEdST1VQX0NPTkNBVChESVNUSU5DVCBzb3VyY2UpIEZST00geyRwfXBzX3NvdXJjZXMgcyBXSEVSRSBzLnByb2R1Y3RfaWQ9cHMuSUQpIHNyYywKICAgICAgKFNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1wc19pc3RfZWlsdXRlcyBlIEpPSU4geyRwfXBzX2lzdF91enNha3ltYWkgdSBPTiB1LmlkPWUudXpzYWt5bW9faWQgV0hFUkUgZS53Y19wcm9kdWN0X2lkPXBzLklEIEFORCB1Lml2eWtkeXRhcz0xIEFORCB1LmRhdGE+PU5PVygpLUlOVEVSVkFMIDM2NSBEQVkpIGlzdDM2NSwKICAgICAgKFNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH13Y19vcmRlcl9wcm9kdWN0X2xvb2t1cCBsIEpPSU4geyRwfXdjX29yZGVycyB3byBPTiB3by5pZD1sLm9yZGVyX2lkIFdIRVJFIGwucHJvZHVjdF9pZD1wcy5JRCBBTkQgd28uc3RhdHVzIElOICgnd2MtcHJvY2Vzc2luZycsJ3djLWNvbXBsZXRlZCcpKSB3Y191enMKICAgIEZST00geyRwfXBvc3RzIHBzIEpPSU4geyRwfXBvc3RtZXRhIHN0IE9OIHN0LnBvc3RfaWQ9cHMuSUQgQU5EIHN0Lm1ldGFfa2V5PSdfc3RvY2tfc3RhdHVzJyBBTkQgc3QubWV0YV92YWx1ZT0nb3V0b2ZzdG9jaycKICAgIFdIRVJFIHBzLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBzLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyI7CiAgJHI9JHdwZGItPmdldF9yZXN1bHRzKCRzcWwsQVJSQVlfQSk7ICRvWyd2aXNvJ109Y291bnQoJHIpOyAkb1snZGJfZXJyJ109JHdwZGItPmxhc3RfZXJyb3I7CiAgJGdycD1hcnJheSgpOyAkcHZ6PWFycmF5KCk7CiAgZm9yZWFjaCAoJHIgYXMgJHgpeyAkaz0oJHhbJ3ZmJ10/J1ZGJzonJykuKCR4Wyd6YiddPydaQic6JycpLighJHhbJ3ZmJ10mJiEkeFsnemInXT8nYmUteG1sJzonJykuJyB8IHNhbmRlbGlzPScuKCR4WydzYW5kZWxpcyddPzonLScpLicgfCBzcmM9Jy4oJHhbJ3NyYyddPzonLScpOwogICAgaWYgKCFpc3NldCgkZ3JwWyRrXSkpICRncnBbJGtdPWFycmF5KCduJz0+MCwncGFyZDM2NSc9PjAsJ3djX3V6cyc9PjAsJ2F2PjAnPT4wKTsgJGdycFska11bJ24nXSsrOyBpZiAoKGludCkkeFsnaXN0MzY1J10+MCkgJGdycFska11bJ3BhcmQzNjUnXSsrOyBpZiAoKGludCkkeFsnd2NfdXpzJ10+MCkgJGdycFska11bJ3djX3V6cyddKys7IGlmICgoaW50KSR4WydhdiddPjApICRncnBbJGtdWydhdj4wJ10rKzsKICAgIGlmIChjb3VudCgkcHZ6WyRrXT8/YXJyYXkoKSk8MykgJHB2elska11bXT0keFsnSUQnXS4nICcubWJfc3Vic3RyKCR4Wydwb3N0X3RpdGxlJ10sMCw0NSkuJyBzdG9jaz0nLiR4WydzdG9jayddLicgYXY9Jy4keFsnYXYnXS4nIG1zPScuJHhbJ21zJ10uJyBpc3QzNjU9Jy4keFsnaXN0MzY1J107CiAgfQogIGFyc29ydCgkZ3JwKTsgJG9bJ2dydXBlcyddPSRncnA7ICRvWydwdnonXT0kcHZ6OwogIC8vIHBldHNob3AteG1sIGxvZ2lrYTogcXR5PTAgZXNhbW9zIHB1Ymxpc2ggcHJla8SXcwogICRmPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXhtbC9wZXRzaG9wLXhtbC5waHAnOyAkbD1maWxlKCRmKTsgZm9yZWFjaCAoJGwgYXMgJGk9PiRsbil7IGlmIChwcmVnX21hdGNoKCcvcXR5XHMqPD1ccyowfHF0eV96ZXJvfG91dG9mc3RvY2t8YnV2dXNpIHB1Ymxpc2h8bGlla2EgbWF0b21hfDMwIGR8Y2xlYW51cC9pJywkbG4pKSAkb1sneG1sX3F0eTAnXVskaSsxXT10cmltKG1iX3N1YnN0cigkbG4sMCwxNzApKTsgfQogIGZvcmVhY2ggKChhcnJheSlnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXhtbC9pbmNsdWRlcy8qLnBocCcpIGFzICRpbmMpeyAkbD1maWxlKCRpbmMpOyBmb3JlYWNoICgkbCBhcyAkaT0+JGxuKXsgaWYgKHByZWdfbWF0Y2goJy9vdXRvZnN0b2NrfHF0eV96ZXJvfGxpZWthIG1hdG9tYXxkcmFmdC4qcXR5fHF0eS4qZHJhZnQvaScsJGxuKSkgJG9bJ2luY19xdHkwJ11bYmFzZW5hbWUoJGluYyldWyRpKzFdPXRyaW0obWJfc3Vic3RyKCRsbiwwLDE3MCkpOyB9IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-175255';
const GKEY='ps_s1691j';
const PHASES=["1"];
const OUT='analize/s1691_j.json';
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
