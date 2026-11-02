process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODE2ZyBrb2RlbCBuZWdyaXp0YSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MTZnJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgyNTApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTgxNmcnXTsgJHE9Zm4oJHMpPT4kd3BkYi0+Z2V0X3Jlc3VsdHMoJHMsQVJSQVlfQSk7CiAgJEY9InskUH1wc19mYWt0X3V6c2FreW1haSI7ICRFPSJ7JFB9cHNfZmFrdF9laWx1dGVzIjsgJG9rPSJ0ZXN0aW5pcz0wIEFORCBzdGF0dXNhc19nYWx1dGluaXMgTk9UIElOKCdjYW5jZWxsZWQnLCdmYWlsZWQnLCdyZWZ1bmRlZCcsJ3BlbmRpbmcnKSI7CiAgLy8ga29ob3J0YTogbmF1amkga2xpZW50YWkgMDktMDkuLjEwLTAzICh0dXJlam8gPj0zMCBkLikKICAkYmFzZT0iU0VMRUNUIGYxLmtsaWVudGFzX2VtYWlsX2hhc2ggaCwgZjEudXpzYWt5bWFzX2lkIGlkMSwgZjEuc3VrdXJ0YV9hdCBkMSwgZjEua2FuYWxhc19wYXNrdXRpbmlzIGthbiwgUk9VTkQoZjEudmlzb19jdC8xMDApIGV1cjEsIGYxLmVpbHVjaXVfc2ssIGYxLmtsaWVudGFzX2lkIHVpZCwKICAgICAoU0VMRUNUIENPVU5UKCopIEZST00gJEYgZjIgV0hFUkUgZjIua2xpZW50YXNfZW1haWxfaGFzaD1mMS5rbGllbnRhc19lbWFpbF9oYXNoIEFORCBmMi51enNha3ltYXNfaWQ+ZjEudXpzYWt5bWFzX2lkIEFORCBmMi50ZXN0aW5pcz0wIEFORCBmMi5zdGF0dXNhc19nYWx1dGluaXMgTk9UIElOKCdjYW5jZWxsZWQnLCdmYWlsZWQnLCdyZWZ1bmRlZCcsJ3BlbmRpbmcnKSkgcGFrLAogICAgIChTRUxFQ1QgTUlOKGYyLnN1a3VydGFfYXQpIEZST00gJEYgZjIgV0hFUkUgZjIua2xpZW50YXNfZW1haWxfaGFzaD1mMS5rbGllbnRhc19lbWFpbF9oYXNoIEFORCBmMi51enNha3ltYXNfaWQ+ZjEudXpzYWt5bWFzX2lkIEFORCBmMi50ZXN0aW5pcz0wKSBkMiwKICAgICAoU0VMRUNUIEdST1VQX0NPTkNBVChESVNUSU5DVCBlLmd5dnVuYXMpIEZST00gJEUgZSBXSEVSRSBlLnV6c2FreW1hc19pZD1mMS51enNha3ltYXNfaWQpIGd5diwKICAgICAoU0VMRUNUIEdST1VQX0NPTkNBVChESVNUSU5DVCBTVUJTVFJJTkdfSU5ERVgoZS5rYXRlZ29yaWp1X2tlbGlhcywnPicsMikpIEZST00gJEUgZSBXSEVSRSBlLnV6c2FreW1hc19pZD1mMS51enNha3ltYXNfaWQpIGthdCwKICAgICAoU0VMRUNUIE1BWChlLmthdGVnb3JpanVfa2VsaWFzIExJS0UgJyVhaXN0JScgT1IgZS5rYXRlZ29yaWp1X2tlbGlhcyBMSUtFICclTWFpc3QlJykgRlJPTSAkRSBlIFdIRVJFIGUudXpzYWt5bWFzX2lkPWYxLnV6c2FreW1hc19pZCkgbWFpc3RhcywKICAgICAoU0VMRUNUIE1BWChlLnN2b3Jpc19nKSBGUk9NICRFIGUgV0hFUkUgZS51enNha3ltYXNfaWQ9ZjEudXpzYWt5bWFzX2lkKSBzdm9yaXMsCiAgICAgKFNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wc19yZWZpbGxfdHJhY2tpbmcgdCBXSEVSRSB0LnVzZXJfaWQ9ZjEua2xpZW50YXNfaWQgQU5EIGYxLmtsaWVudGFzX2lkPjApIHJlZmlsbCwKICAgICAoU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBzX2VtYWlsX2pvYnMgaiBXSEVSRSBqLnJlY2lwaWVudF91c2VyX2lkPWYxLmtsaWVudGFzX2lkIEFORCBmMS5rbGllbnRhc19pZD4wIEFORCBqLnN0YXR1cz0nc2VudCcpIGxhaXNrdSwKICAgICAoU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBzX2VtYWlsX2pvYnMgaiBXSEVSRSBqLnJlY2lwaWVudF91c2VyX2lkPWYxLmtsaWVudGFzX2lkIEFORCBmMS5rbGllbnRhc19pZD4wIEFORCBqLmNsaWNrZWRfYXQgSVMgTk9UIE5VTEwpIHBhc3BhdWRlCiAgIEZST00gJEYgZjEgV0hFUkUgZjEuJG9rIEFORCBmMS5rbGllbnRhc19uYXVqYXM9MSBBTkQgZjEuc3VrdXJ0YV9hdD49JzIwMjYtMDktMDknIEFORCBmMS5zdWt1cnRhX2F0PCcyMDI2LTEwLTAzJyI7CiAgJHJbJ2NvbHNfam9icyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JFB9cHNfZW1haWxfam9icyIpOwogICRyb3dzPSRxKCRiYXNlKTsgJHJbJ2VyciddPSR3cGRiLT5sYXN0X2Vycm9yOyAkclsnbiddPWNvdW50KCRyb3dzKTsKICAkYWdnPWZ1bmN0aW9uKCRyb3dzLCRrZXkpeyAkbz1bXTsgZm9yZWFjaCgkcm93cyBhcyAkeCl7ICRrPSRrZXkoJHgpOyBpZighaXNzZXQoJG9bJGtdKSkgJG9bJGtdPVsnbic9PjAsJ3Bhayc9PjBdOyAkb1ska11bJ24nXSsrOyBpZigkeFsncGFrJ10+MCkgJG9bJGtdWydwYWsnXSsrOyB9IGZvcmVhY2goJG8gYXMgJGs9PiYkdil7ICR2Wydwcm9jJ109cm91bmQoMTAwKiR2WydwYWsnXS8kdlsnbiddKTsgfSBhcnNvcnQoJG8pOyByZXR1cm4gJG87IH07CiAgJHJbJ3Zpc28nXT1bJ24nPT5jb3VudCgkcm93cyksJ3Bhayc9PmNvdW50KGFycmF5X2ZpbHRlcigkcm93cyxmbigkeCk9PiR4WydwYWsnXT4wKSldOwogICRyWydwYWdhbF9rYW5hbGEnXT0kYWdnKCRyb3dzLGZuKCR4KT0+JHhbJ2thbiddKTsKICAkclsncGFnYWxfbWFpc3RhJ109JGFnZygkcm93cyxmbigkeCk9PiR4WydtYWlzdGFzJ10/J3N1X21haXN0dSc6J2JlX21haXN0bycpOwogICRyWydwYWdhbF9neXZ1bmEnXT0kYWdnKCRyb3dzLGZuKCR4KT0+JHhbJ2d5diddPzonPycpOwogICRyWydwYWdhbF9zdW1hJ109JGFnZygkcm93cyxmbigkeCk9PiR4WydldXIxJ108MzA/JzwzMCc6KCR4WydldXIxJ108NjA/JzMwLTYwJzonNjArJykpOwogICRyWydwYWdhbF9wYXNreXJhJ109JGFnZygkcm93cyxmbigkeCk9PiR4Wyd1aWQnXT4wPydwYXNreXJhJzonc3ZlY2lhcycpOwogICRyWydwYWdhbF9yZWZpbGwnXT0kYWdnKCRyb3dzLGZuKCR4KT0+JHhbJ3JlZmlsbCddPjA/J3R1cmlfcmVmaWxsJzonYmVfcmVmaWxsJyk7CiAgJHJbJ3BhZ2FsX2xhaXNrdXMnXT0kYWdnKCRyb3dzLGZuKCR4KT0+JHhbJ2xhaXNrdSddPT0wPycwIGxhaXNrdSc6KCR4WydwYXNwYXVkZSddPjA/J3Bhc3BhdWRlJzonZ2F2b19uZXBhc3BhdWRlJykpOwogICRyWydrYXRlZ29yaWpvc190b3AnXT1hcnJheV9zbGljZSgkYWdnKCRyb3dzLGZuKCR4KT0+bWJfc3Vic3RyKChzdHJpbmcpJHhbJ2thdCddLDAsNTApKSwwLDEyLHRydWUpOwogIC8vIGRpZW5vcyBpa2kgcGFrYXJ0b2ppbW8KICAkZD1bXTsgZm9yZWFjaCgkcm93cyBhcyAkeCl7IGlmKCR4WydkMiddKSAkZFtdPXJvdW5kKChzdHJ0b3RpbWUoJHhbJ2QyJ10pLXN0cnRvdGltZSgkeFsnZDEnXSkpLzg2NDAwKTsgfSBzb3J0KCRkKTsgJHJbJ2RpZW5vc19pa2lfcGFrJ109JGQ7CiAgLy8gaXN0b3JpbmUgYmF6ZTogZVNob3ByZW50IG5hdWppIGtsaWVudGFpIDIwMjUtMDkuLjEwLCBraWVrIHBha2FydG9qbyBwZXIgNjAgZC4KICAkclsnaXN0X2JhemUnXT0kcSgiU0VMRUNUIENPVU5UKCopIG4sIFNVTShFWElTVFMoU0VMRUNUIDEgRlJPTSB7JFB9cHNfaXN0X3V6c2FreW1haSBiIFdIRVJFIExPV0VSKGIuZW1haWwpPUxPV0VSKGEuZW1haWwpIEFORCBiLmRhdGE+YS5kYXRhIEFORCBiLmRhdGE8PWEuZGF0YStJTlRFUlZBTCAzMCBEQVkgQU5EIGIuaXZ5a2R5dGFzPTEpKSBwYWszMCwgU1VNKEVYSVNUUyhTRUxFQ1QgMSBGUk9NIHskUH1wc19pc3RfdXpzYWt5bWFpIGIgV0hFUkUgTE9XRVIoYi5lbWFpbCk9TE9XRVIoYS5lbWFpbCkgQU5EIGIuZGF0YT5hLmRhdGEgQU5EIGIuZGF0YTw9YS5kYXRhK0lOVEVSVkFMIDYwIERBWSBBTkQgYi5pdnlrZHl0YXM9MSkpIHBhazYwIEZST00geyRQfXBzX2lzdF91enNha3ltYWkgYSBXSEVSRSBhLml2eWtkeXRhcz0xIEFORCBhLmRhdGEgQkVUV0VFTiAnMjAyNS0wOS0wOScgQU5EICcyMDI1LTEwLTAzJyBBTkQgTk9UIEVYSVNUUyhTRUxFQ1QgMSBGUk9NIHskUH1wc19pc3RfdXpzYWt5bWFpIGMgV0hFUkUgTE9XRVIoYy5lbWFpbCk9TE9XRVIoYS5lbWFpbCkgQU5EIGMuZGF0YTxhLmRhdGEpIik7ICRyWydpc3RfZXJyJ109JHdwZGItPmxhc3RfZXJyb3I7ICRyWydpc3RfY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JFB9cHNfaXN0X3V6c2FreW1haSIpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsgfSk7Cg==';
const VER='dep-125126';
const GKEY='ps_s1816g';
const PHASES=["1"];
const OUT='analize/s1816_g.json';
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
