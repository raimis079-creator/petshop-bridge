process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODEwYyBwYWthcnRvdGluaWFpIHV6c2FreW1haSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MTBjJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNTApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRGPSRQLidwc19mYWt0X3V6c2FreW1haSc7ICRyPVsndic9PidTMTgxMGMnXTsKICAkb2s9IihmLnRlc3RpbmlzPTAgT1IgZi50ZXN0aW5pcyBJUyBOVUxMKSBBTkQgZi5zdGF0dXNhc19nYWx1dGluaXMgTk9UIElOICgnY2FuY2VsbGVkJywnZmFpbGVkJywncmVmdW5kZWQnLCdwZW5kaW5nJywndHJhc2gnLCdjaGVja291dC1kcmFmdCcpIjsKICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBmLnV6c2FreW1hc19pZCBpZCwgZi5kaWVuYSwgTE9XRVIoby5iaWxsaW5nX2VtYWlsKSBlbSwgZi52aXNvX2N0LCBmLmtvbnRyaWJ1Y2lqYV9jdCBrLCBmLmthbmFsYXNfcGFza3V0aW5pcyBrYW4sIGYudXRtX3NvdXJjZSB1cywgZi51dG1fY2FtcGFpZ24gdWMsIGYuZ2NsaWQgZyBGUk9NICRGIGYgSk9JTiB7JFB9d2Nfb3JkZXJzIG8gT04gby5pZD1mLnV6c2FreW1hc19pZCBXSEVSRSAkb2sgQU5EIGYuZGllbmE+PScyMDI2LTA5LTA5JyBPUkRFUiBCWSBvLmRhdGVfY3JlYXRlZF9nbXQiLEFSUkFZX0EpOwogICRzZWVuPVtdOyAkYnllbT1bXTsgJHJlcD1bXTsKICBmb3JlYWNoKCRyb3dzIGFzICR4KXsgJGVtPSR4WydlbSddOyAkbj1pc3NldCgkYnllbVskZW1dKT9jb3VudCgkYnllbVskZW1dKTowOyAkYnllbVskZW1dW109JHg7IGlmKCRuPj0xKXsgJGNoPSgkeFsnZyddfHwoJHhbJ3VzJ109PT0nZ29vZ2xlJykpPydnb29nbGU6Jy4keFsndWMnXTooJHhbJ3VzJ109PT0ncGV0c2hvcF9sYWlza2FpJz8nbGFpc2thczonLiR4Wyd1YyddOiR4WydrYW4nXSk7ICR3bz13Y19nZXRfb3JkZXIoJHhbJ2lkJ10pOyAkcmVwW109Wyducic9PiR3bz8kd28tPmdldF9vcmRlcl9udW1iZXIoKTokeFsnaWQnXSwnZCc9PiR4WydkaWVuYSddLCdlaWwnPT4kbisxLCdldXInPT4keFsndmlzb19jdCddLzEwMCwnayc9PiR4WydrJ10vMTAwLCdrYW4nPT4kY2hdOyB9IH0KICAkclsna2xpZW50YWknXT1jb3VudCgkYnllbSk7ICRkaXN0PVtdOyBmb3JlYWNoKCRieWVtIGFzICRsKXsgJGM9Y291bnQoJGwpOyAkZGlzdFskY109KCRkaXN0WyRjXT8/MCkrMTsgfSBrc29ydCgkZGlzdCk7ICRyWydwYXNpc2tpcnN0eW1hcyddPSRkaXN0OwogICRyWydwYWthcnRvam8nXT1jb3VudChhcnJheV9maWx0ZXIoJGJ5ZW0sZm4oJGwpPT5jb3VudCgkbCk+MSkpOyAkclsncmVwX24nXT1jb3VudCgkcmVwKTsgJHJbJ3JlcF9ldXInXT1yb3VuZChhcnJheV9zdW0oYXJyYXlfY29sdW1uKCRyZXAsJ2V1cicpKSwyKTsgJHJbJ3JlcF9rJ109cm91bmQoYXJyYXlfc3VtKGFycmF5X2NvbHVtbigkcmVwLCdrJykpLDIpOwogICRrYW49W107IGZvcmVhY2goJHJlcCBhcyAkeCl7ICRjPXByZWdfcmVwbGFjZSgnLzouKi8nLCcnLCR4WydrYW4nXSk7IGlmKHN0cnBvcygkeFsna2FuJ10sJ2dvb2dsZTonKT09PTApICRjPSdnb29nbGU6Jy5zdWJzdHIoJHhbJ2thbiddLDcpOyAka2FuWyRjXT0oJGthblskY10/PzApKzE7IH0gYXJzb3J0KCRrYW4pOyAkclsna2FuYWxhaSddPSRrYW47CiAgJHdrPVtdOyBmb3JlYWNoKCRyZXAgYXMgJHgpeyAkdz1kYXRlKCdtLWQnLHN0cnRvdGltZSgnbW9uZGF5IHRoaXMgd2Vlaycsc3RydG90aW1lKCR4WydkJ10pKSk7ICR3a1skd109KCR3a1skd10/PzApKzE7IH0ga3NvcnQoJHdrKTsgJHJbJ3NhdmFpdGVzJ109JHdrOwogICR3YT1bXTsgZm9yZWFjaCgkcm93cyBhcyAkeCl7ICR3PWRhdGUoJ20tZCcsc3RydG90aW1lKCdtb25kYXkgdGhpcyB3ZWVrJyxzdHJ0b3RpbWUoJHhbJ2RpZW5hJ10pKSk7ICR3YVskd109KCR3YVskd10/PzApKzE7IH0ga3NvcnQoJHdhKTsgJHJbJ3Zpc2lfc2F2J109JHdhOwogICRyWydwYXNrXzdkJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigkcmVwLGZuKCR4KT0+JHhbJ2QnXT49JzIwMjYtMTAtMjMnKSk7CiAgLy8gbmF1amkga2xpZW50YWkgbnVvIDA5LTA5IChwaXJtYXMgcGlya2ltYXMgaWtpIDEwLTA0KSDigJQga2llayBncnl6bwogICRicj0wOyRicnA9MDsgZm9yZWFjaCgkYnllbSBhcyAkbCl7IGlmKCRsWzBdWydkaWVuYSddPD0nMjAyNi0xMC0wNCcpeyAkYnIrKzsgaWYoY291bnQoJGwpPjEpICRicnArKzsgfSB9ICRyWydicmFuZHVzJ109WyRiciwkYnJwXTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7IH0pOwo=';
const VER='dep-063053';
const GKEY='ps_s1810c';
const PHASES=["1"];
const OUT='analize/s1810_c.json';
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
