process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjY0IGxvZ2FpIGlyIHRpdHVsaW5pcyAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2JrMyddKT8kX0dFVFsncHNfYmszJ106JycpIT09J0UnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTY2NEUnLCd3cCc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSk7CiAgZ2xvYmFsICR3cGRiOwogIHRyeXsKICAgICRkPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy93Yy1sb2dzJzsKICAgIGZvcmVhY2goYXJyYXkoJ3djX2xvZ2dlci0yMDI2LTA5LTA5JywndHJhbnNhY3Rpb25hbC1lbWFpbHMtMjAyNi0wOS0wOScsJ3RyYW5zYWN0aW9uYWwtZW1haWxzLTIwMjYtMDktMDgnKSBhcyAkcHJlKXsKICAgICAgZm9yZWFjaChzY2FuZGlyKCRkKSBhcyAkZil7IGlmKHN0cnBvcygkZiwkcHJlKT09PTApeyAkYz1maWxlX2dldF9jb250ZW50cygkZC4nLycuJGYpOyAkb1snTF8nLiRwcmVdPXN1YnN0cigkYywtMjIwMCk7IH0gfSB9CiAgICAvLyBMYWlza2FpIGVpbGUKICAgIGZvcmVhY2goJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsTEVGVChvcHRpb25fdmFsdWUsMTUwKSB2IEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdwc19sYWlzayUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX2VzcCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX2VtYWlsJScgTElNSVQgMTAiLEFSUkFZX0EpIGFzICRyKSAkb1snbGFpc2t1X29wY2lqb3MnXVskclsnb3B0aW9uX25hbWUnXV09JHJbJ3YnXTsKICAgICR0Yj0kd3BkYi0+cHJlZml4Lidwc19sYWlza2FpX2VpbGUnOyBpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJHRiJyIpKSAkb1snbGFpc2t1X2VpbGUnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzdGF0dXMsQ09VTlQoKikgayBGUk9NICR0YiBHUk9VUCBCWSBzdGF0dXMiLEFSUkFZX0EpOwogICAgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNIT1cgVEFCTEVTIExJS0UgJ3skd3BkYi0+cHJlZml4fXBzXyUnIixBUlJBWV9OKSBhcyAkcikgJG9bJ3BzX2xlbnRlbGVzJ11bXT0kclswXTsKICAgIC8vIFRpdHVsaW5pczogbnVvdHJhdWtvcywgV2FybmluZy9Ob3RpY2UsIGxhaWthcwogICAgJHQwPW1pY3JvdGltZSh0cnVlKTsKICAgICRyPXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSxhcnJheSgndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSwnaGVhZGVycyc9PmFycmF5KCdVc2VyLUFnZW50Jz0+J01vemlsbGEvNS4wIFBTJykpKTsKICAgICRib2R5PWlzX3dwX2Vycm9yKCRyKT8nJzp3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcik7CiAgICAkb1sndGl0dWxpbmlzJ109YXJyYXkoJ2tvZGFzJz0+aXNfd3BfZXJyb3IoJHIpPyRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSwKICAgICAgJ3Nlayc9PnJvdW5kKG1pY3JvdGltZSh0cnVlKS0kdDAsMiksJ2lsZ2lzJz0+c3RybGVuKCRib2R5KSwKICAgICAgJ2ltZyc9PnN1YnN0cl9jb3VudCgkYm9keSwnPGltZycpLCd3YXJuaW5nJz0+c3Vic3RyX2NvdW50KCRib2R5LCdXYXJuaW5nOicpLCdub3RpY2UnPT5zdWJzdHJfY291bnQoJGJvZHksJ05vdGljZTonKSwKICAgICAgJ2ZhdGFsJz0+c3Vic3RyX2NvdW50KCRib2R5LCdGYXRhbCBlcnJvcicpLCdkZXZfYXZlc2EnPT5zdWJzdHJfY291bnQoJGJvZHksJ2Rldi5hdmVzYS5sdCcpLAogICAgICAnZ3RtJz0+c3Vic3RyX2NvdW50KCRib2R5LCdHVE0tTUYzR1pHVCcpLCdub2luZGV4Jz0+c3Vic3RyX2NvdW50KCRib2R5LCdub2luZGV4JykpOwogICAgLy8gNDA0IC8gMzAxIHBhdnl6ZHppYWkKICAgICR0c3Q9YXJyYXkoJ3NlbmFfa2F0ZWdvcmlqYSc9PmhvbWVfdXJsKCcvc3VudS1tYWlzdGFzLycpLCduZXNhbW9uZSc9PmhvbWVfdXJsKCcvbmVyYS10b2tpby1wdXNsYXBpby14eXovJyksJ3ByZWtlJz0+aG9tZV91cmwoJy9wcmVrZS9uZXJhLXh5ei8nKSk7CiAgICBmb3JlYWNoKCR0c3QgYXMgJGs9PiR1KXsgJHg9d3BfcmVtb3RlX2dldCgkdSxhcnJheSgndGltZW91dCc9PjE1LCdzc2x2ZXJpZnknPT5mYWxzZSwncmVkaXJlY3Rpb24nPT4wKSk7ICRvWyd1cmwnXVska109aXNfd3BfZXJyb3IoJHgpPydFUlInOmFycmF5KHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCR4KSxzdWJzdHIoKHN0cmluZyl3cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVyKCR4LCdsb2NhdGlvbicpLDAsNzApKTsgfQogICAgLy8gd3AtanNvbgogICAgJHg9d3BfcmVtb3RlX2dldChob21lX3VybCgnL3dwLWpzb24vJyksYXJyYXkoJ3RpbWVvdXQnPT4xNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsgJG9bJ3dwX2pzb24nXT1pc193cF9lcnJvcigkeCk/J0VSUic6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpOwogICAgLy8gVXpzYWt5bXUgaXZ5a2lhaSAvIGRhcmJhbGF1a2lvIGVpbGUKICAgICRldj0kd3BkYi0+cHJlZml4Lidwc191enNha3ltdV9pdnlraWFpJzsgaWYoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyRldiciKSkgJG9bJ2l2eWtpYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00gJGV2IE9SREVSIEJZIGlkIERFU0MgTElNSVQgNSIsQVJSQVlfQSk7CiAgICAvLyBBdG1pbnRpcwogICAgJG9bJ3BocCddPWFycmF5KCdtZW1fbGltaXQnPT5pbmlfZ2V0KCdtZW1vcnlfbGltaXQnKSwndmVyJz0+UEhQX1ZFUlNJT04sJ21heF9leGVjJz0+aW5pX2dldCgnbWF4X2V4ZWN1dGlvbl90aW1lJykpOwogICAgLy8gTmF1amkga2xpZW50YWkgLyByZWdpc3RyYWNpam9zIHNpYW5kaWVuCiAgICAkb1snbmF1amlfdmFydG90b2phaSddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnVzZXJzfSBXSEVSRSB1c2VyX3JlZ2lzdGVyZWQ+JzIwMjYtMDktMDggMjE6MDA6MDAnIik7CiAgICAvLyBBcGxlaXN0aSBrcmVwc2VsaWFpIHNpYW5kaWVuCiAgICBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0hPVyBUQUJMRVMgTElLRSAnJWFwbGVpc3QlJyIsQVJSQVlfTikgYXMgJHIpICRvWydhcGxlaXN0aV9sZW50ZWxlJ11bXT0kclswXTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-061232';
const GKEY='ps_bk3';
const PHASES=["E"];
const OUT='analize/s1664_e.json';
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
