process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzYzYiBrYWNpdSBwcmVraXUgbnVvdHJhdWtvcyBQTWF4IGnFoXRla2xpYW1zIChyZWFkLW9ubHksIGdyYXppbmEgc3VtYXppbnRhcyBrb3BpamFzIGJhc2U2NCkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzYzYiddKSkgcmV0dXJuOyAkRj0oc3RyaW5nKSRfR0VUWydwc19zMTc2M2InXTsgQHNldF90aW1lX2xpbWl0KDE1MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzYzYicsJ2YnPT4kRl07CiAgdHJ5ewogIGlmKCRGPT09JzEnKXsKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGUucHJla2VfaWQgcGlkLCBMRUZUKE1BWChlLnBhdmFkaW5pbWFzX3R1b19tZXR1KSw2MCkgcGF2LCBlLmJyZW5kYXNfc2x1ZyBiciwgU1VNKGUua2FpbmFfY3QpIGssIENPVU5UKCopIG4gRlJPTSB7JFB9cHNfZmFrdF9laWx1dGVzIGUgV0hFUkUgZS50ZXN0aW5pcz0wIEFORCBlLmthdGVnb3JpanVfa2VsaWFzIExJS0UgJyVrYXRlbXMlJyBHUk9VUCBCWSBlLnByZWtlX2lkIE9SREVSIEJZIGsgREVTQyBMSU1JVCA0MCIsQVJSQVlfQSk7CiAgICBmb3JlYWNoKCRyb3dzIGFzICYkeCl7ICRwPXdjX2dldF9wcm9kdWN0KCR4WydwaWQnXSk7ICRpaWQ9JHA/JHAtPmdldF9pbWFnZV9pZCgpOjA7IGlmKCEkaWlkICYmICRwICYmICRwLT5nZXRfcGFyZW50X2lkKCkpeyAkcHA9d2NfZ2V0X3Byb2R1Y3QoJHAtPmdldF9wYXJlbnRfaWQoKSk7ICRpaWQ9JHBwPyRwcC0+Z2V0X2ltYWdlX2lkKCk6MDsgfSAkbT0kaWlkP3dwX2dldF9hdHRhY2htZW50X21ldGFkYXRhKCRpaWQpOltdOyAkeFsnaW1nJ109JGlpZDsgJHhbJ3doJ109JG0/KCRtWyd3aWR0aCddLid4Jy4kbVsnaGVpZ2h0J10pOicnOyAkeFsnc3QnXT0kcD8kcC0+Z2V0X3N0YXR1cygpLicvJy4kcC0+Z2V0X3N0b2NrX3N0YXR1cygpOicnOyB9CiAgICAkclsncHJla2VzJ109JHJvd3M7ICRsaWQ9Z2V0X3RoZW1lX21vZCgnY3VzdG9tX2xvZ28nKTsgJHJbJ2xvZ28nXT0kbGlkPzpnZXRfdGhlbWVfbW9kKCdzaXRlX2xvZ28nKTsgJHJbJ2ZsX2xvZ28nXT1nZXRfdGhlbWVfbW9kKCdzaXRlX2xvZ28nKTsgCiAgfQogIGlmKChpbnQpJEY+PTEwKXsKICAgICRBTEw9WzE4MTEwLDE5NDAwLDI3MTI3LDE5MzU5LDE5NjEyLDE4MzY3LDI1NzU2LDE5Njk1LDE4NDU5LDE4NTQzLDE5MTQxLDE3OTcwLDE4MDg1LDMwOF07ICRpZHM9WyRBTExbKGludCkkRi0xMF0/PzBdOyAkb3V0PVtdOwogICAgZm9yZWFjaCgkaWRzIGFzICRpaWQpeyAkZj1nZXRfYXR0YWNoZWRfZmlsZSgkaWlkKTsgaWYoISRmfHwhZmlsZV9leGlzdHMoJGYpKXsgJG91dFskaWlkXT0nbmVyYSc7IGNvbnRpbnVlOyB9ICRlZD13cF9nZXRfaW1hZ2VfZWRpdG9yKCRmKTsgaWYoaXNfd3BfZXJyb3IoJGVkKSl7ICRvdXRbJGlpZF09J2VkOicuJGVkLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyBjb250aW51ZTsgfSAkZWQtPnJlc2l6ZSg2MDAsNjAwLGZhbHNlKTsgJGV4dD1zdHJ0b2xvd2VyKHBhdGhpbmZvKCRmLFBBVEhJTkZPX0VYVEVOU0lPTikpOyAkbWltZT0kZXh0PT09J3BuZyc/J2ltYWdlL3BuZyc6J2ltYWdlL2pwZWcnOyBpZigkbWltZT09PSdpbWFnZS9qcGVnJykgJGVkLT5zZXRfcXVhbGl0eSg3OCk7ICR0bXA9d3BfdGVtcG5hbSgncHMxNzYzJykuJy4nLigkZXh0PT09J3BuZyc/J3BuZyc6J2pwZycpOyAkcz0kZWQtPnNhdmUoJHRtcCwkbWltZSk7IGlmKGlzX3dwX2Vycm9yKCRzKSl7ICRvdXRbJGlpZF09J3NhdmU6Jy4kcy0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsgY29udGludWU7IH0gJG91dFskaWlkXT1bJ21pbWUnPT4kbWltZSwnYjY0Jz0+YmFzZTY0X2VuY29kZShmaWxlX2dldF9jb250ZW50cygkc1sncGF0aCddKSksJ3cnPT4kc1snd2lkdGgnXSwnaCc9PiRzWydoZWlnaHQnXV07IEB1bmxpbmsoJHNbJ3BhdGgnXSk7IEB1bmxpbmsoJHRtcCk7IH0KICAgICRyWydpbWcnXT0kb3V0OwogIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9KTsK';
const VER='dep-085508';
const GKEY='ps_s1763b';
const PHASES=["18", "19", "20", "21", "22", "23"];
const OUT='out/s1763_bC.json';
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
