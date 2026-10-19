process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzg5ZCBQcmFnbWEgMjAyNi0wOSBla3Nwb3J0YXMg4oCUIDEgc2F1c2FzIChmYWlsYWkgKyBwYXRpa3Jvcywgbmlla28gbmVzaXVuY2lhKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3ODlkJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNjApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTc4OWQnXTsKICB0cnl7CiAgICBpZighZnVuY3Rpb25fZXhpc3RzKCdwZXRzaG9wX3ByYWdtYV9nZW5lcmF0ZV9wYXJkYXZpbWFpJykpeyAkclsnZXJyJ109J3BsdWdpbm8gZnVua2NpanUgbmVyYSc7IHRocm93IG5ldyBFeGNlcHRpb24oJ3gnKTsgfQogICAgJHk9MjAyNjsgJG09OTsgJGZyb209c3RydG90aW1lKCcyMDI2LTA5LTAxIDAwOjAwOjAwJyk7ICR0bz1zdHJ0b3RpbWUoJzIwMjYtMDktMzAgMjM6NTk6NTknKTsgJHJbJ3R6J109ZGF0ZV9kZWZhdWx0X3RpbWV6b25lX2dldCgpOyAkclsnbnVvX2lraSddPVtnbWRhdGUoJ2MnLCRmcm9tKSxnbWRhdGUoJ2MnLCR0byldOwogICAgJG9yZGVycz13Y19nZXRfb3JkZXJzKFsnc3RhdHVzJz0+Wydjb21wbGV0ZWQnXSwnZGF0ZV9jcmVhdGVkJz0+JGZyb20uJy4uLicuJHRvLCdsaW1pdCc9Pi0xLCdvcmRlcmJ5Jz0+J2RhdGUnLCdvcmRlcic9PidBU0MnXSk7CiAgICAkclsnY29tcGxldGVkX3J1Z3NlamlzJ109Y291bnQoJG9yZGVycyk7CiAgICAkdmFsaWQ9W107ICRhdG1lc3RhPVtdOyBmb3JlYWNoKCRvcmRlcnMgYXMgJG8peyAkZHQ9JG8tPmdldF9tZXRhKCdfcGV0c2hvcF9pbnZvaWNlX2RvY3VtZW50X3R5cGUnKTsgJGF2PSRvLT5nZXRfbWV0YSgnX3BldHNob3BfYXZwbl9udW1iZXInKTsgaWYoJGR0PT09J2ludm9pY2UnJiYkYXYpICR2YWxpZFtdPSRvOyBlbHNlICRhdG1lc3RhW109JyMnLiRvLT5nZXRfb3JkZXJfbnVtYmVyKCkuJyBkb2M9Jy4kZHQuJyBhdnBuPScuJGF2OyB9CiAgICAkclsnZWtzcG9ydHVvamFtYSddPWNvdW50KCR2YWxpZCk7ICRyWydhdG1lc3RhJ109JGF0bWVzdGE7CiAgICAvLyBraWVrIHJ1Z3Nlam8gdXpzYWt5bXUgbmUgY29tcGxldGVkIChuZXBhdGVrcykKICAgICRyWyduZV9jb21wbGV0ZWQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzdGF0dXMsIENPVU5UKCopIG4gRlJPTSB7JFB9d2Nfb3JkZXJzIFdIRVJFIHR5cGU9J3Nob3Bfb3JkZXInIEFORCBkYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0wOS0wMSAwMDowMDowMCcgQU5EIGRhdGVfY3JlYXRlZF9nbXQ8PScyMDI2LTA5LTMwIDIzOjU5OjU5JyBHUk9VUCBCWSBzdGF0dXMiLEFSUkFZX0EpOwogICAgLy8gcmlib3M6IExUIGxhaWt1IDA5LTAxIDAwLTAzIGlyIDA5LTMwIDIxLTI0IChwYXRlbmthL25lcGF0ZW5rYSBkZWwgVVRDKQogICAgJHJbJ3JpYm9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgbi5tZXRhX3ZhbHVlIG5yLCBvLnN0YXR1cywgby5kYXRlX2NyZWF0ZWRfZ210IEZST00geyRQfXdjX29yZGVycyBvIExFRlQgSk9JTiB7JFB9d2Nfb3JkZXJzX21ldGEgbiBPTiBuLm9yZGVyX2lkPW8uaWQgQU5EIG4ubWV0YV9rZXk9J19wc19vcmRlcl9udW1iZXInIFdIRVJFIG8udHlwZT0nc2hvcF9vcmRlcicgQU5EICgoby5kYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0wOC0zMSAyMTowMDowMCcgQU5EIG8uZGF0ZV9jcmVhdGVkX2dtdDwnMjAyNi0wOS0wMSAwMDowMDowMCcpIE9SIChvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTA5LTMwIDIxOjAwOjAwJyBBTkQgby5kYXRlX2NyZWF0ZWRfZ210PCcyMDI2LTEwLTAxIDAwOjAwOjAwJykpIixBUlJBWV9BKTsKICAgICRpbW89cGV0c2hvcF9wcmFnbWFfZ2VuZXJhdGVfaW1vbmVzKCR2YWxpZCk7ICRwYXI9cGV0c2hvcF9wcmFnbWFfZ2VuZXJhdGVfcGFyZGF2aW1haSgkdmFsaWQpOyAkc3VtPXBldHNob3BfcHJhZ21hX2dlbmVyYXRlX3BhcmRhdmltYWlfc3VtKCR2YWxpZCk7CiAgICAvLyBwYXRpa3Jvczogc3VtYSBiZSBQVk0gKyBQVk0gPT0gdG90YWwgPwogICAgJG5lc3V0PVtdOyAkVD1bJ3RvdGFsJz0+MCwndGF4Jz0+MCwnc3VtX2V4Jz0+MCwnc2hpcCc9PjAsJ2Rpc2MnPT4wXTsgJGF2cG49W107ICRwZGZfbj0wOyAkcGRmX2I9MDsgJGJlX3BkZj1bXTsKICAgIGZvcmVhY2goJHZhbGlkIGFzICRvKXsgJHN1Yj0oZmxvYXQpJG8tPmdldF9zdWJ0b3RhbCgpOyAkZmVlPTA7IGZvcmVhY2goJG8tPmdldF9mZWVzKCkgYXMgJGYpICRmZWUrPShmbG9hdCkkZi0+Z2V0X3RvdGFsKCk7ICRleD0kc3ViKyRmZWU7ICR0YXg9KGZsb2F0KSRvLT5nZXRfdG90YWxfdGF4KCk7ICR0b3Q9KGZsb2F0KSRvLT5nZXRfdG90YWwoKTsKICAgICAgJFRbJ3RvdGFsJ10rPSR0b3Q7ICRUWyd0YXgnXSs9JHRheDsgJFRbJ3N1bV9leCddKz0kZXg7ICRUWydzaGlwJ10rPShmbG9hdCkkby0+Z2V0X3NoaXBwaW5nX3RvdGFsKCk7ICRUWydkaXNjJ10rPShmbG9hdCkkby0+Z2V0X2Rpc2NvdW50X3RvdGFsKCk7CiAgICAgIGlmKGFicygoJGV4KyR0YXgpLSR0b3QpPjAuMDExKSAkbmVzdXRbXT0nIycuJG8tPmdldF9vcmRlcl9udW1iZXIoKS4nIHRvdGFsICcuJHRvdC4nIOKJoCBiZSBQVk0gJy5yb3VuZCgkZXgsMikuJyArIFBWTSAnLiR0YXguJyAoc2l1bnQuICcuJG8tPmdldF9zaGlwcGluZ190b3RhbCgpLicsIG51b2wuICcuJG8tPmdldF9kaXNjb3VudF90b3RhbCgpLicpJzsKICAgICAgJGF2cG5bXT0kby0+Z2V0X21ldGEoJ19wZXRzaG9wX2F2cG5fbnVtYmVyJyk7CiAgICAgICRwZGY9JG8tPmdldF9tZXRhKCdfcGV0c2hvcF9jb21wbGV0ZWRfcGRmJyk7IGlmKCEkcGRmKSAkcGRmPSRvLT5nZXRfbWV0YSgnX3BldHNob3Bfb3JkZXJfcGRmJyk7IGlmKCRwZGYmJmZpbGVfZXhpc3RzKCRwZGYpKXsgJHBkZl9uKys7ICRwZGZfYis9ZmlsZXNpemUoJHBkZik7IH0gZWxzZSAkYmVfcGRmW109JyMnLiRvLT5nZXRfb3JkZXJfbnVtYmVyKCk7IH0KICAgIGZvcmVhY2goJFQgYXMgJGs9PiR2KSAkVFska109cm91bmQoJHYsMik7ICRyWydzdW1vcyddPSRUOyAkclsnbmVzdXRhbXBhX24nXT1jb3VudCgkbmVzdXQpOyAkclsnbmVzdXRhbXBhJ109YXJyYXlfc2xpY2UoJG5lc3V0LDAsMTUpOwogICAgc29ydCgkYXZwbik7ICRyWydhdnBuX251b19pa2knXT1bcmVzZXQoJGF2cG4pLGVuZCgkYXZwbiksY291bnQoYXJyYXlfdW5pcXVlKCRhdnBuKSldOwogICAgJHJbJ3BkZiddPVsneXJhJz0+JHBkZl9uLCdtYic9PnJvdW5kKCRwZGZfYi8xMDQ4NTc2LDEpLCduZXJhJz0+JGJlX3BkZl07CiAgICAkclsna25vd25fZW1haWxzX24nXT1jb3VudCgoYXJyYXkpZ2V0X29wdGlvbigncGV0c2hvcF9wcmFnbWFfa25vd25fZW1haWxzJyxbXSkpOwogICAgJHJbJ3Bhdnl6ZHlzJ109WydpbW9uZXMnPT5hcnJheV9zbGljZShleHBsb2RlKCJcbiIsJGltbyksMCwzKSwncGFyZGF2aW1haSc9PmFycmF5X3NsaWNlKGV4cGxvZGUoIlxuIiwkcGFyKSwwLDMpLCdzdW0nPT5hcnJheV9zbGljZShleHBsb2RlKCJcbiIsJHN1bSksMCwzKV07CiAgICAkclsnZmFpbGFpX2d6J109WydpbW9uZXNfMjAyNi0wOS50eHQnPT5iYXNlNjRfZW5jb2RlKGd6ZW5jb2RlKCRpbW8sOSkpLCdwYXJkYXZpbWFpXzIwMjYtMDkudHh0Jz0+YmFzZTY0X2VuY29kZShnemVuY29kZSgkcGFyLDkpKSwncGFyZGF2aW1haV9zdW1fMjAyNi0wOS50eHQnPT5iYXNlNjRfZW5jb2RlKGd6ZW5jb2RlKCRzdW0sOSkpXTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgaWYoZW1wdHkoJHJbJ2VyciddKSkgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-092123';
const GKEY='ps_s1789d';
const PHASES=["1"];
const OUT='analize/s1789p_d.json';
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
