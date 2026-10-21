process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzkzaiDigJQgMSByYXN0aSB1xb5zYWt5bcSFIHN1IHN2ZXRpbXUgUERGIGtlbGl1ICsgd2NkbiBTZXR0aW5ncyDCtyAyIHN1dHZhcmt5dGkgam8gUERGICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc5M2onXSkpIHJldHVybjsgJEY9KHN0cmluZykkX0dFVFsncHNfczE3OTNqJ107IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzkzaicsJ2YnPT4kRl07CiAgdHJ5ewogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgYS5vcmRlcl9pZCwgYS5tZXRhX3ZhbHVlIGF2cG4sIGIubWV0YV92YWx1ZSBwIEZST00geyRQfXdjX29yZGVyc19tZXRhIGEgSk9JTiB7JFB9d2Nfb3JkZXJzX21ldGEgYiBPTiBiLm9yZGVyX2lkPWEub3JkZXJfaWQgQU5EIGIubWV0YV9rZXk9J19wZXRzaG9wX2NvbXBsZXRlZF9wZGYnIFdIRVJFIGEubWV0YV9rZXk9J19wZXRzaG9wX2F2cG5fbnVtYmVyJyBBTkQgYS5tZXRhX3ZhbHVlPD4nJyIsQVJSQVlfQSk7CiAgICAkYmFkPVtdOyBmb3JlYWNoKCRyb3dzIGFzICR4KXsgaWYoc3RycG9zKGJhc2VuYW1lKCR4WydwJ10pLCR4WydhdnBuJ10pPT09ZmFsc2UpeyAkbz13Y19nZXRfb3JkZXIoKGludCkkeFsnb3JkZXJfaWQnXSk7ICRiYWRbXT1bJ2lkJz0+JHhbJ29yZGVyX2lkJ10sJ25yJz0+JG8tPmdldF9vcmRlcl9udW1iZXIoKSwnYXZwbic9PiR4WydhdnBuJ10sJ2tlbGlhcyc9PmJhc2VuYW1lKCR4WydwJ10pLCdzdCc9PiRvLT5nZXRfc3RhdHVzKCksJ2JhaWd0YSc9PiRvLT5nZXRfZGF0ZV9jb21wbGV0ZWQoKT8kby0+Z2V0X2RhdGVfY29tcGxldGVkKCktPmRhdGUoJ1ktbS1kIEg6aScpOm51bGwsJ3Bhc3RhYm9zJz0+YXJyYXlfbWFwKGZ1bmN0aW9uKCRuKXtyZXR1cm4gJG4tPmRhdGVfY3JlYXRlZC0+ZGF0ZSgnbS1kIEg6aScpLicgJy5tYl9zdWJzdHIod3Bfc3RyaXBfYWxsX3RhZ3MoJG4tPmNvbnRlbnQpLDAsMTQwKTt9LGFycmF5X2ZpbHRlcih3Y19nZXRfb3JkZXJfbm90ZXMoWydvcmRlcl9pZCc9PihpbnQpJHhbJ29yZGVyX2lkJ11dKSxmdW5jdGlvbigkbil7cmV0dXJuIHN0cmlwb3MoJG4tPmNvbnRlbnQsJ0FWUE4nKSE9PWZhbHNlfHxzdHJpcG9zKCRuLT5jb250ZW50LCdTMTcnKSE9PWZhbHNlO30pKV07IH0gfQogICAgJHJbJ3N2ZXRpbWFzX2tlbGlhcyddPSRiYWQ7CiAgICBpZigkRj09PScxJyl7ICRzcmM9ZmlsZShXUF9QTFVHSU5fRElSLicvd29vY29tbWVyY2UtZGVsaXZlcnktbm90ZXMvaW5jbHVkZXMvc2VydmljZXMvY2xhc3MtcGRmLnBocCcpOyBmb3JlYWNoKCRzcmMgYXMgJGk9PiRsKXsgaWYocHJlZ19tYXRjaCgnL15ccyoodXNlfG5hbWVzcGFjZSkgLycsJGwpKSAkclsncGRmX3VzZSddW109dHJpbSgkbCk7IH0KICAgICAgZm9yZWFjaChbJ1xUeWNoZVxXQ0ROXEhlbHBlcnNcU2V0dGluZ3MnLCdcVHljaGVcV0NETlxTZXR0aW5ncycsJ1xUeWNoZVxXQ0ROXFNlcnZpY2VzXFNldHRpbmdzJywnXFR5Y2hlXFdDRE5cQ29yZVxTZXR0aW5ncyddIGFzICRjKXsgaWYoY2xhc3NfZXhpc3RzKCRjKSYmbWV0aG9kX2V4aXN0cygkYywnZ2V0JykpeyAkclsnd2Nkbl9nZXQnXVskY109JGM6OmdldCgnbnVtYmVyRGF5c1BkZkV4cGlyYXRpb24nKTsgfSB9IH0KICAgIGlmKCRGPT09JzInKXsKICAgICAgaWYoY291bnQoJGJhZCkhPT0xKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCd0aWvEl3Rhc2kgMSwgcmFzdGEgJy5jb3VudCgkYmFkKSk7CiAgICAgICRiPSRiYWRbMF07ICRvPXdjX2dldF9vcmRlcigoaW50KSRiWydpZCddKTsgaWYoJG8tPmdldF9tZXRhKCdfcGV0c2hvcF9pbnZvaWNlX2RvY3VtZW50X3R5cGUnKSE9PSdpbnZvaWNlJ3x8ISRvLT5nZXRfZGF0ZV9jb21wbGV0ZWQoKSkgdGhyb3cgbmV3IEV4Y2VwdGlvbignbmUgaW52b2ljZS9uZWJhaWd0YXMnKTsKICAgICAgaWYoZ2V0X29wdGlvbigncHNfczE3OTNqX2JhaycpPT09ZmFsc2UpIGFkZF9vcHRpb24oJ3BzX3MxNzkzal9iYWsnLFsnaWQnPT4kYlsnaWQnXSwnX3BldHNob3BfY29tcGxldGVkX3BkZic9PiRvLT5nZXRfbWV0YSgnX3BldHNob3BfY29tcGxldGVkX3BkZicpXSwnJywnbm8nKTsKICAgICAgJGMwPWdldF9vcHRpb24oJ3BldHNob3BfYXZwbl9jb3VudGVyJyk7ICRmPXBldHNob3BfZ2VuZXJhdGVfaW52b2ljZV9wZGYoKGludCkkYlsnaWQnXSk7IGNsZWFyc3RhdGNhY2hlKCk7CiAgICAgIGlmKGdldF9vcHRpb24oJ3BldHNob3BfYXZwbl9jb3VudGVyJykhPT0kYzApIHRocm93IG5ldyBFeGNlcHRpb24oJ1NLQUlUSUtMSVMgUEFTSUtFSVTElicpOwogICAgICAkbz13Y19nZXRfb3JkZXIoKGludCkkYlsnaWQnXSk7IGlmKCRvLT5nZXRfbWV0YSgnX3BldHNob3BfYXZwbl9udW1iZXInKSE9PSRiWydhdnBuJ10pIHRocm93IG5ldyBFeGNlcHRpb24oJ0FWUE4gcGFzaWtlaXTElycpOwogICAgICBpZighJGZ8fHN0cnBvcyhiYXNlbmFtZSgkZiksJGJbJ2F2cG4nXSk9PT1mYWxzZXx8IWZpbGVfZXhpc3RzKCRmKSkgdGhyb3cgbmV3IEV4Y2VwdGlvbignUERGIG5lZ2F1dGFzICcuYmFzZW5hbWUoKHN0cmluZykkZikpOwogICAgICAkby0+dXBkYXRlX21ldGFfZGF0YSgnX3BldHNob3BfY29tcGxldGVkX3BkZicsJGYpOyAkby0+c2F2ZSgpOyAkclsnc3V0dmFya3l0YSddPVskYlsnbnInXSxiYXNlbmFtZSgkZildOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlR8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-181614';
const GKEY='ps_s1793j';
const PHASES=["1"];
const OUT='analize/s1793j.json';
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
