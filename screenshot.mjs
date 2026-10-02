process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQ2ZSBzdXN0YWJkeXRpIDEwODItMTA4NCAoUmFpbWlvIGRhcnlrIDEwOjEwKSArIGFkYXB0ZXJpbyBtZXRvZGFpLiAxIHN0YWJkeXRpIC8gOSBhdHN0YXR5dGkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzQ2ZSddKSkgcmV0dXJuOyAkZj0kX0dFVFsncHNfczE3NDZlJ107IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJFQ9JFAuJ3BzX2VtYWlsX2pvYnMnOyAkcj1bJ3YnPT4nUzE3NDZlJywnZmF6ZSc9PiRmXTsgJElEUz0nMTA4MiwxMDgzLDEwODQnOwogIGlmKCRmPT09JzEnKXsKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSAkVCBXSEVSRSBpZCBJTigkSURTKSIsQVJSQVlfQSk7CiAgICAkclsncHJpZXMnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpeyByZXR1cm4gWyR4WydpZCddLCR4WydzdGF0dXMnXSwkeFsnYXR0ZW1wdHMnXSxzdWJzdHIoKHN0cmluZykkeFsnbGFzdF9lcnJvciddLDAsNDApLCR4Wyd1cGRhdGVkX2F0J11dOyB9LCRyb3dzKTsKICAgIGlmKCFnZXRfb3B0aW9uKCdwc19zMTc0Nl9wYXVzZV9iYWsnKSkgdXBkYXRlX29wdGlvbigncHNfczE3NDZfcGF1c2VfYmFrJywkcm93cyxmYWxzZSk7CiAgICAkbj0kd3BkYi0+cXVlcnkoIlVQREFURSAkVCBTRVQgc3RhdHVzPSdkZWZlcnJlZCcsIG5leHRfYXR0ZW1wdF9hdD0nMjAyNy0wMS0wMSAwMDowMDowMCcsIHNraXBfcmVhc29uPSdzdXN0YWJkeXRhX3MxNzQ2X3RpbWVvdXQnLCBibG9ja19yZWFzb249J3N1c3RhYmR5dGFfczE3NDZfdGltZW91dCcsIHVwZGF0ZWRfYXQ9VVRDX1RJTUVTVEFNUCgpIFdIRVJFIGlkIElOKCRJRFMpIEFORCBzdGF0dXM9J3BlbmRpbmcnIik7CiAgICAkclsnc3VzdGFiZHl0YSddPSRuOyAkclsncG8nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxzdGF0dXMsbmV4dF9hdHRlbXB0X2F0LGF0dGVtcHRzIEZST00gJFQgV0hFUkUgaWQgSU4oJElEUykiLEFSUkFZX0EpOwogICAgJHJbJ2tpdGknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxzdGF0dXMsYXR0ZW1wdHMscHJvdmlkZXJfbWVzc2FnZV9pZCBwbSxzZW50X2F0LHJlY2lwaWVudF9lbWFpbCBlIEZST00gJFQgV0hFUkUgaWQgSU4oOTkxLDk5MiwxMDgyKSIsQVJSQVlfQSk7CiAgICAkYT1mdW5jdGlvbl9leGlzdHMoJ3BzX2VzcF9hZGFwdGVyJyk/cHNfZXNwX2FkYXB0ZXIoKTpudWxsOyBpZigkYSl7ICRyYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCRhKTsgJHJbJ2FkYXB0ZXJpcyddPVskcmMtPmdldE5hbWUoKSxiYXNlbmFtZSgkcmMtPmdldEZpbGVOYW1lKCkpXTsgJHJbJ21ldG9kYWknXT1hcnJheV9tYXAoZnVuY3Rpb24oJG0pe3JldHVybiAkbS0+bmFtZTt9LCRyYy0+Z2V0TWV0aG9kcyhSZWZsZWN0aW9uTWV0aG9kOjpJU19QVUJMSUMpKTsgJHQ9ZmlsZV9nZXRfY29udGVudHMoJHJjLT5nZXRGaWxlTmFtZSgpKTsgcHJlZ19tYXRjaF9hbGwoIiNbJ1wiXSgvdlxkL1thLXpfL3t9XSt8aHR0cHM6Ly9hcGlcLnNlbmRlclwubmV0W14nXCJdKilbJ1wiXSMiLCR0LCRtKTsgJHJbJ2VuZHBvaW50YWknXT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtWzFdKSk7ICRwPXN0cnBvcygkdCwnZnVuY3Rpb24gc2VuZF90cmFuc2FjdGlvbmFsX2VtYWlsJyk7ICRyWydzZW5kX2tvZGFzJ109c3Vic3RyKCR0LCRwLDE2MDApOyB9CiAgfQogIGlmKCRmPT09JzknKXsgJGJhaz1nZXRfb3B0aW9uKCdwc19zMTc0Nl9wYXVzZV9iYWsnKTsgaWYoaXNfYXJyYXkoJGJhaykpIGZvcmVhY2goJGJhayBhcyAkYil7ICR3cGRiLT51cGRhdGUoJFQsWydzdGF0dXMnPT4kYlsnc3RhdHVzJ10sJ25leHRfYXR0ZW1wdF9hdCc9PiRiWyduZXh0X2F0dGVtcHRfYXQnXSwnc2tpcF9yZWFzb24nPT4kYlsnc2tpcF9yZWFzb24nXSwnYmxvY2tfcmVhc29uJz0+JGJbJ2Jsb2NrX3JlYXNvbiddXSxbJ2lkJz0+JGJbJ2lkJ11dKTsgfSAkclsnYXRzdGF0eXRhJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsc3RhdHVzIEZST00gJFQgV0hFUkUgaWQgSU4oJElEUykiLEFSUkFZX0EpOyB9CiAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==';
const VER='dep-071021';
const GKEY='ps_s1746e';
const PHASES=["1"];
const OUT='out/s1746_e.json';
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
