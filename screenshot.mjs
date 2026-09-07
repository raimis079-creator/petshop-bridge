process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzUgZmIyIOKAlCByYXN0aSBoYXJkY29kZWQgaHJlZj0iaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tIiAoZm9vdGVyIGJsb2thcy93aWRnZXQpIGlyIHBha2Vpc3RpIMSvIC9QZXRzaG9wLmx0OyBwYXRpa3JhLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTYzNWZiMiddKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkbz1hcnJheSgndic9PidTMTYzNSBmYjInKTsgJFNFTj0naHR0cHM6Ly93d3cuZmFjZWJvb2suY29tIic7ICROQVU9J2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9QZXRzaG9wLmx0Iic7CiAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQscG9zdF90eXBlLHBvc3RfdGl0bGUgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF9jb250ZW50IExJS0UgJyVodHRwczovL3d3dy5mYWNlYm9vay5jb21cIiUnIEFORCBwb3N0X3N0YXR1cyBJTiAoJ3B1Ymxpc2gnLCdkcmFmdCcsJ3ByaXZhdGUnKSBMSU1JVCAxMCIpOwogIGZvcmVhY2goJHJvd3MgYXMgJHIpeyAkb1sncG9zdGFpJ11bXT1hcnJheSgkci0+SUQsJHItPnBvc3RfdHlwZSxtYl9zdWJzdHIoJHItPnBvc3RfdGl0bGUsMCw1MCkpOwogICAgJGM9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2NvbnRlbnQgRlJPTSB7JHB9cG9zdHMgV0hFUkUgSUQ9JWQiLCRyLT5JRCkpOwogICAgJG49c3RyX3JlcGxhY2UoJFNFTiwkTkFVLCRjKTsKICAgIGlmKCRuIT09JGMpeyAkd3BkYi0+dXBkYXRlKCRwLidwb3N0cycsYXJyYXkoJ3Bvc3RfY29udGVudCc9PiRuKSxhcnJheSgnSUQnPT4kci0+SUQpKTsgY2xlYW5fcG9zdF9jYWNoZSgkci0+SUQpOyAkb1sncGFrZWlzdGFfcG9zdCddW109JHItPklEOyB9IH0KICAkb3Jvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUgRlJPTSB7JHB9b3B0aW9ucyBXSEVSRSBvcHRpb25fdmFsdWUgTElLRSAnJWh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbVwiJScgQU5EIG9wdGlvbl9uYW1lIE5PVCBMSUtFICdfdHJhbnNpZW50JScgTElNSVQgMTAiKTsKICBmb3JlYWNoKCRvcm93cyBhcyAkcil7ICRvWydvcGNpam9zJ11bXT0kci0+b3B0aW9uX25hbWU7CiAgICAkdj1nZXRfb3B0aW9uKCRyLT5vcHRpb25fbmFtZSk7CiAgICBpZihpc19zdHJpbmcoJHYpKXsgJG49c3RyX3JlcGxhY2UoJFNFTiwkTkFVLCR2KTsgaWYoJG4hPT0kdil7IHVwZGF0ZV9vcHRpb24oJHItPm9wdGlvbl9uYW1lLCRuKTsgJG9bJ3Bha2Vpc3RhX29wdCddW109JHItPm9wdGlvbl9uYW1lOyB9IH0KICAgIGVsc2VpZihpc19hcnJheSgkdikpeyBhcnJheV93YWxrX3JlY3Vyc2l2ZSgkdixmdW5jdGlvbigmJHgpdXNlKCRTRU4sJE5BVSl7IGlmKGlzX3N0cmluZygkeCkpICR4PXN0cl9yZXBsYWNlKCRTRU4sJE5BVSwkeCk7IH0pOyB1cGRhdGVfb3B0aW9uKCRyLT5vcHRpb25fbmFtZSwkdik7ICRvWydwYWtlaXN0YV9vcHQnXVtdPSRyLT5vcHRpb25fbmFtZS4nIFthcnJdJzsgfSB9CiAgd3BfY2FjaGVfZmx1c2goKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9jbGVhcl9jYWNoZScpKSB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOwogICRyPXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSxhcnJheSgndGltZW91dCc9PjYwLCdzc2x2ZXJpZnknPT5mYWxzZSkpOyAkaD0oc3RyaW5nKXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKICAkb1snZmJfcGV0c2hvcCddPXN1YnN0cl9jb3VudCgkaCwnZmFjZWJvb2suY29tL1BldHNob3AubHQnKTsgJG9bJ2ZiX3BsaWthcyddPXN1YnN0cl9jb3VudCgkaCwnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tIicpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sOTkpOwo=';
const VER='dep-073955';
const GKEY='ps_s1635fb2';
const PHASES=["F2"];
const OUT='analize/s1635_fb2.json';
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
