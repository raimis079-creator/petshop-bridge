process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzk3YSB1enNha3ltYXMgMTUzMSB2YXJpYWNpam9zIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc5N2EnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE1MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzk3YSddOwogIHRyeXsKICAgICRvaWQ9KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIG9yZGVyX2lkIEZST00geyRQfXdjX29yZGVyc19tZXRhIFdIRVJFIG1ldGFfa2V5PSdfcHNfb3JkZXJfbnVtYmVyJyBBTkQgbWV0YV92YWx1ZT0nMTUzMScgTElNSVQgMSIpOyAkclsnb2lkJ109JG9pZDsgJG89d2NfZ2V0X29yZGVyKCRvaWQpOwogICAgJHJbJ3V6cyddPVsnc3QnPT4kby0+Z2V0X3N0YXR1cygpLCdzdWt1cnRhJz0+JG8tPmdldF9kYXRlX2NyZWF0ZWQoKS0+ZGF0ZSgnWS1tLWQgSDppOnMnKSwnYXBtb2tldGEnPT4kby0+Z2V0X2RhdGVfcGFpZCgpPyRvLT5nZXRfZGF0ZV9wYWlkKCktPmRhdGUoJ1ktbS1kIEg6aTpzJyk6bnVsbF07CiAgICAkbnM9W107IGZvcmVhY2god2NfZ2V0X29yZGVyX25vdGVzKFsnb3JkZXJfaWQnPT4kb2lkLCdvcmRlcl9ieSc9PidkYXRlX2NyZWF0ZWQnLCdvcmRlcic9PidBU0MnXSkgYXMgJG4peyAkbnNbXT0kbi0+ZGF0ZV9jcmVhdGVkLT5kYXRlKCdtLWQgSDppOnMnKS4nICcubWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCRuLT5jb250ZW50KSwwLDI2MCk7IH0gJHJbJ3Bhc3RhYm9zJ109JG5zOwogICAgJHBhcj1bXTsKICAgIGZvcmVhY2goJG8tPmdldF9pdGVtcygpIGFzICRpaWQ9PiRpKXsgJGltPVtdOyBmb3JlYWNoKCRpLT5nZXRfbWV0YV9kYXRhKCkgYXMgJG1kKXsgJGltWyRtZC0+a2V5XT1pc19zY2FsYXIoJG1kLT52YWx1ZSk/bWJfc3Vic3RyKChzdHJpbmcpJG1kLT52YWx1ZSwwLDEyMCk6J1thcnJdJzsgfQogICAgICAkclsnZWlsdXRlcyddW109WydpaWQnPT4kaWlkLCdwaWQnPT4kaS0+Z2V0X3Byb2R1Y3RfaWQoKSwndmlkJz0+JGktPmdldF92YXJpYXRpb25faWQoKSwncGF2Jz0+JGktPmdldF9uYW1lKCksJ3F0eSc9PiRpLT5nZXRfcXVhbnRpdHkoKSwnbWV0YSc9PiRpbV07IGlmKCRpLT5nZXRfdmFyaWF0aW9uX2lkKCkpICRwYXJbJGktPmdldF9wcm9kdWN0X2lkKCldPTE7IH0KICAgICRzaW5jZT0kby0+Z2V0X2RhdGVfY3JlYXRlZCgpLT5nZXRUaW1lc3RhbXAoKS04NjQwMCozOwogICAgZm9yZWFjaChhcnJheV9rZXlzKCRwYXIpIGFzICRwaWQpeyAkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsgJHg9WydwYXYnPT4kcC0+Z2V0X25hbWUoKSwnbW9kaWZpZWQnPT5nZXRfcG9zdF9maWVsZCgncG9zdF9tb2RpZmllZCcsJHBpZCksJ2RlZmF1bHRfYXR0cic9PiRwLT5nZXRfZGVmYXVsdF9hdHRyaWJ1dGVzKCksJ3RodW1iJz0+Z2V0X3Bvc3RfdGh1bWJuYWlsX2lkKCRwaWQpLCdnYWxsZXJ5Jz0+JHAtPmdldF9nYWxsZXJ5X2ltYWdlX2lkcygpXTsKICAgICAgZm9yZWFjaCgkcC0+Z2V0X2F0dHJpYnV0ZXMoKSBhcyAkaz0+JGEpeyAkeFsnYXR0ciddWyRrXT1bJ3ZhcmlhdGlvbic9PiRhLT5nZXRfdmFyaWF0aW9uKCksJ29wdHMnPT4kYS0+aXNfdGF4b25vbXkoKT9hcnJheV9tYXAoZnVuY3Rpb24oJHQpe3JldHVybiAkdC0+c2x1Zzt9LCAkYS0+Z2V0X3Rlcm1zKCkgPzogW10pOiRhLT5nZXRfb3B0aW9ucygpXTsgfQogICAgICAkdnM9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgSUQsbWVudV9vcmRlcixwb3N0X3N0YXR1cyxwb3N0X21vZGlmaWVkLHBvc3RfdGl0bGUgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF9wYXJlbnQ9JWQgQU5EIHBvc3RfdHlwZT0ncHJvZHVjdF92YXJpYXRpb24nIE9SREVSIEJZIG1lbnVfb3JkZXIsSUQiLCRwaWQpLEFSUkFZX0EpOwogICAgICBmb3JlYWNoKCR2cyBhcyAmJHYpeyAkdmlkPShpbnQpJHZbJ0lEJ107ICRtPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG1ldGFfa2V5LG1ldGFfdmFsdWUgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD0lZCBBTkQgKG1ldGFfa2V5IExJS0UgJ2F0dHJpYnV0ZV8lJScgT1IgbWV0YV9rZXkgSU4oJ190aHVtYm5haWxfaWQnLCdfc2t1JywnX3N0b2NrJywnX3N0b2NrX3N0YXR1cycsJ19tYW5hZ2Vfc3RvY2snLCdfcHJpY2UnLCdfcmVndWxhcl9wcmljZScsJ192YXJpYXRpb25fZGVzY3JpcHRpb24nKSkiLCR2aWQpLEFSUkFZX0EpOyBmb3JlYWNoKCRtIGFzICRtbSkgJHZbJG1tWydtZXRhX2tleSddXT0kbW1bJ21ldGFfdmFsdWUnXTsKICAgICAgICBpZighZW1wdHkoJHZbJ190aHVtYm5haWxfaWQnXSkpICR2WydpbWcnXT1iYXNlbmFtZSgoc3RyaW5nKWdldF9hdHRhY2hlZF9maWxlKChpbnQpJHZbJ190aHVtYm5haWxfaWQnXSkpOyB9CiAgICAgICR4Wyd2YXJpYWNpam9zJ109JHZzOwogICAgICAkaWRzPWFycmF5X21lcmdlKFskcGlkXSx3cF9saXN0X3BsdWNrKCR2cywnSUQnKSk7CiAgICAgIGlmKCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICd7JFB9cHNfbnVvdHJfenVybmFsYXMnIikpICR4WydudW90cl96dXJuYWxhcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JFB9cHNfbnVvdHJfenVybmFsYXMgV0hFUkUgcG9zdF9pZCBJTigiLmltcGxvZGUoJywnLGFycmF5X21hcCgnaW50dmFsJywkaWRzKSkuIikgT1JERVIgQlkgaWQgREVTQyBMSU1JVCA0MCIsQVJSQVlfQSk7CiAgICAgIGVsc2UgeyAkeFsnbnVvdHJfb3B0J109Z2V0X29wdGlvbigncHNfbnVvdHJfenVybmFsYXMnKSA/ICdvcHRpb24nIDogbnVsbDsgfQogICAgICAkcGFyWyRwaWRdPSR4OyB9CiAgICAkclsndGV2YWknXT0kcGFyOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlR8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-164612';
const GKEY='ps_s1797a';
const PHASES=["1"];
const OUT='analize/s1797a.json';
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
