process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzAzIG1mIOKAlCBub2luZGV4IG51xJdtaW1hcyAyNiBwdXNsYXBpYW1zICgxID0gZGFyeXRpIHN1IGJhayBvcGNpamEsIDIgPSBwYXRpa3JhIEhUTUwsIDkgPSBhdHN0YXR5dGkgacWhIGJhaykgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX3MxNzAzbWYnXSk/JF9HRVRbJ3BzX3MxNzAzbWYnXTonJyk7IGlmKCFpbl9hcnJheSgkZixhcnJheSgnMScsJzInLCc5JyksdHJ1ZSkpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNzAzIG1mJywnZmF6ZSc9PiRmKTsKICB0cnl7CiAgICBpZigkZj09PScxJyl7CiAgICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQscC5wb3N0X25hbWUsbS5tZXRhX3ZhbHVlIEZST00geyRwfXBvc3RzIHAgSk9JTiB7JHB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0ncmFua19tYXRoX3JvYm90cycgQU5EIG0ubWV0YV92YWx1ZSBMSUtFICclbm9pbmRleCUnIFdIRVJFIHAucG9zdF90eXBlPSdwYWdlJyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCciLEFSUkFZX0EpOwogICAgICAkYmFrPWdldF9vcHRpb24oJ3BzX3MxNzAzX25vaW5kZXhfYmFrJyk7IGlmKCFpc19hcnJheSgkYmFrKSkgJGJhaz1hcnJheSgpOwogICAgICBmb3JlYWNoKCRyb3dzIGFzICRyKXsKICAgICAgICAkaWQ9KGludCkkclsnSUQnXTsgJGJha1skaWRdPWFycmF5KCdzbHVnJz0+JHJbJ3Bvc3RfbmFtZSddLCdyYW5rX21hdGhfcm9ib3RzJz0+JHJbJ21ldGFfdmFsdWUnXSwneW9hc3QnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3lvYXN0X3dwc2VvX21ldGEtcm9ib3RzLW5vaW5kZXgnLHRydWUpLCd5b2FzdF9uZic9PmdldF9wb3N0X21ldGEoJGlkLCdfeW9hc3Rfd3BzZW9fbWV0YS1yb2JvdHMtbm9mb2xsb3cnLHRydWUpKTsKICAgICAgICAkdj1tYXliZV91bnNlcmlhbGl6ZSgkclsnbWV0YV92YWx1ZSddKTsgJHY9aXNfYXJyYXkoJHYpP2FycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoJHYsZnVuY3Rpb24oJHgpe3JldHVybiAkeCE9PSdub2luZGV4JyYmJHghPT0nbm9mb2xsb3cnO30pKTphcnJheSgpOwogICAgICAgIGlmKCFpbl9hcnJheSgnaW5kZXgnLCR2LHRydWUpKSAkdltdPSdpbmRleCc7CiAgICAgICAgdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJ3JhbmtfbWF0aF9yb2JvdHMnLCR2KTsKICAgICAgICBkZWxldGVfcG9zdF9tZXRhKCRpZCwnX3lvYXN0X3dwc2VvX21ldGEtcm9ib3RzLW5vaW5kZXgnKTsgZGVsZXRlX3Bvc3RfbWV0YSgkaWQsJ195b2FzdF93cHNlb19tZXRhLXJvYm90cy1ub2ZvbGxvdycpOwogICAgICAgICRvWydwYWtlaXN0YSddW109JHJbJ3Bvc3RfbmFtZSddLicg4oaSICcuaW1wbG9kZSgnLCcsJHYpOwogICAgICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfcG9zdF9jaGFuZ2UnKSkgd3BfY2FjaGVfcG9zdF9jaGFuZ2UoJGlkKTsKICAgICAgfQogICAgICB1cGRhdGVfb3B0aW9uKCdwc19zMTcwM19ub2luZGV4X2JhaycsJGJhayxmYWxzZSk7ICRvWydiYWtfbiddPWNvdW50KCRiYWspOwogICAgICBpZihmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX2NsZWFyX2NhY2hlJykpIHsgd3BfY2FjaGVfY2xlYXJfY2FjaGUoKTsgJG9bJ3N1cGVyX2NhY2hlJ109J2lzdmFseXRhcyc7IH0KICAgICAgJG9bJ2xpa29fbm9pbmRleCddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cG9zdHMgcCBKT0lOIHskcH1wb3N0bWV0YSBtIE9OIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdyYW5rX21hdGhfcm9ib3RzJyBBTkQgbS5tZXRhX3ZhbHVlIExJS0UgJyVub2luZGV4JScgV0hFUkUgcC5wb3N0X3R5cGU9J3BhZ2UnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIpOwogICAgICAkb1sneW9hc3RfbGlrbyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J195b2FzdF93cHNlb19tZXRhLXJvYm90cy1ub2luZGV4JyBBTkQgbWV0YV92YWx1ZT0nMSciKTsKICAgIH0gZWxzZWlmKCRmPT09JzknKXsKICAgICAgJGJhaz1nZXRfb3B0aW9uKCdwc19zMTcwM19ub2luZGV4X2JhaycpOyAkbj0wOyBmb3JlYWNoKChhcnJheSkkYmFrIGFzICRpZD0+JGIpeyB1cGRhdGVfcG9zdF9tZXRhKChpbnQpJGlkLCdyYW5rX21hdGhfcm9ib3RzJyxtYXliZV91bnNlcmlhbGl6ZSgkYlsncmFua19tYXRoX3JvYm90cyddKSk7IGlmKCRiWyd5b2FzdCddIT09JycpIHVwZGF0ZV9wb3N0X21ldGEoKGludCkkaWQsJ195b2FzdF93cHNlb19tZXRhLXJvYm90cy1ub2luZGV4JywkYlsneW9hc3QnXSk7ICRuKys7IH0gJG9bJ2F0c3RhdHl0YSddPSRuOwogICAgfSBlbHNlIHsKICAgICAgZm9yZWFjaChhcnJheSgnL3Rha3Nhcy8nLCcvcnVzdS1tZWx5bm9qaS8nLCcvc3VvLW51b2xhdC1rYXNvc2ktNy1wcmllemFzdHlzLWlyLTMtbWludWNpdS1wbGFuYXMta2EtZGFyeXRpLXNpYW5kaWVuLycsJy9qb3NlcmEtc3VudS1tYWlzdGFzLycsJy9wcmlzdGF0eW1hcy8nLCcvc2thaWNpdW9rbGUvJykgYXMgJHUpewogICAgICAgICRyPXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJHUuJz9ub2NhY2hlPScudGltZSgpKSxhcnJheSgndGltZW91dCc9PjI1LCd1c2VyLWFnZW50Jz0+J01vemlsbGEvNS4wIHBzLXMxNzAzJykpOyAkaD13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcik7CiAgICAgICAgJG9bJ2h0bWwnXVskdV09YXJyYXkod3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpLHByZWdfbWF0Y2goJyM8bWV0YSBuYW1lPSJyb2JvdHMiIGNvbnRlbnQ9IihbXiJdKikiIycsJGgsJG0pPyRtWzFdOidOxJZSQSByb2JvdHMgbWV0YScsc3Vic3RyX2NvdW50KCRoLCdub2luZGV4JykpOwogICAgICB9CiAgICAgIC8vIFJhbmsgTWF0aCBzaXRlbWFwIOKAlCBhciBwdXNsYXBpYWkgeXJhIHBhZ2Utc2l0ZW1hcAogICAgICAkcj13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvcGFnZS1zaXRlbWFwLnhtbD94PScudGltZSgpKSxhcnJheSgndGltZW91dCc9PjI1KSk7ICRoPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsgJG9bJ3BhZ2Vfc2l0ZW1hcCddPWFycmF5KHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSxzdWJzdHJfY291bnQoJGgsJzxsb2M+Jyksc3Vic3RyX2NvdW50KCRoLCcvdGFrc2FzLycpLHN1YnN0cl9jb3VudCgkaCwnL3NrYWljaXVva2xlLycpKTsKICAgICAgJG9bJ25vaW5kZXhfbGlrbyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAucG9zdF9uYW1lIEZST00geyRwfXBvc3RzIHAgSk9JTiB7JHB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0ncmFua19tYXRoX3JvYm90cycgQU5EIG0ubWV0YV92YWx1ZSBMSUtFICclbm9pbmRleCUnIFdIRVJFIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwLnBvc3RfdHlwZSBJTiAoJ3BhZ2UnLCdwb3N0JywncHJvZHVjdCcpIExJTUlUIDIwIixBUlJBWV9BKTsKICAgIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-065035';
const GKEY='ps_s1703mf';
const PHASES=["2"];
const OUT='analize/s1703_mf2.json';
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
