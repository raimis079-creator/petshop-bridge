process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzUwYyB2aWVubyBsYWlza28gcGF0aWtyYSBudW8gcHJhZHppb3MgaWtpIGdhbG8gKDY1MiBpc3NpdXN0YXMsIDY0NiBwcmFsZWlzdGFzLCAxMjE4IHppbikgcmVhZC1vbmx5ICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc1MGMnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDEyMCk7IGdsb2JhbCAkd3BkYjsgJFQ9JHdwZGItPnByZWZpeC4ncHNfZW1haWxfam9icyc7ICRyPVsndic9PidTMTc1MGMnXTsKICAkbWFzaz1mdW5jdGlvbigkcyl7IHJldHVybiBwcmVnX3JlcGxhY2UoJy8oW0EtWmEtejAtOS5fJSstXXszfSlbQS1aYS16MC05Ll8lKy1dKkAvJywnJDHigKZAJywoc3RyaW5nKSRzKTsgfTsKICB0cnl7CiAgJHJbJ2JlX3Byb3ZpZGVyX2lkX3NpYW5kaWVuJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJFQgV0hFUkUgc3RhdHVzPSdzZW50JyBBTkQgc2VudF9hdD49JzIwMjYtMTAtMDMgMjE6MDA6MDAnIEFORCBDT0FMRVNDRShwcm92aWRlcl9tZXNzYWdlX2lkLCcnKT0nJyIpOwogICRyWydkZWxpdmVyZWRfc2lhbmRpZW4nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkVCBXSEVSRSBzdGF0dXM9J3NlbnQnIEFORCBzZW50X2F0Pj0nMjAyNi0xMC0wMyAyMTowMDowMCcgQU5EIGRlbGl2ZXJlZF9hdCBJUyBOT1QgTlVMTCIpOwogIGZvcmVhY2goWzY1Miw2NDZdIGFzICRpZCl7ICRqPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgaWQsam9iX2tleSxmbG93LHN0YXR1cyxza2lwX3JlYXNvbixyZWNpcGllbnRfZW1haWwscmVjaXBpZW50X3VzZXJfaWQsc3ViamVjdCxwcm92aWRlcixwcm92aWRlcl9tZXNzYWdlX2lkLGF0dGVtcHRzLGNyZWF0ZWRfYXQsc2NoZWR1bGVkX2F0LHNlbnRfYXQsZGVjaXNpb25fYXQsY29udGV4dF9qc29uIEZST00gJFQgV0hFUkUgaWQ9JGlkIixBUlJBWV9BKTsgaWYoISRqKXsgJHJbJ2onLiRpZF09J25lcmEnOyBjb250aW51ZTsgfQogICAgJGVtPSRqWydyZWNpcGllbnRfZW1haWwnXTsgJGpbJ3JlY2lwaWVudF9lbWFpbCddPSRtYXNrKCRlbSk7ICRqWydjb250ZXh0X2pzb24nXT1tYl9zdWJzdHIoJG1hc2soJGpbJ2NvbnRleHRfanNvbiddKSwwLDQwMCk7ICR4PVsnam9iJz0+JGpdOwogICAgJG9pZD0wOyBpZihwcmVnX21hdGNoKCcvKFxkezQsNn0pLycsKHN0cmluZykkalsnam9iX2tleSddLCRtKSkgJG9pZD0oaW50KSRtWzFdOyAkYz1qc29uX2RlY29kZSgoc3RyaW5nKSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgY29udGV4dF9qc29uIEZST00gJFQgV0hFUkUgaWQ9JGlkIiksdHJ1ZSk7IGZvcmVhY2goWydvcmRlcl9pZCcsJ3V6c2FreW1hc19pZCcsJ29yZGVyJ10gYXMgJGspeyBpZighZW1wdHkoJGNbJGtdKSkgJG9pZD0oaW50KSRjWyRrXTsgfQogICAgJG89JG9pZD93Y19nZXRfb3JkZXIoJG9pZCk6bnVsbDsgaWYoJG8peyAkaXQ9W107IGZvcmVhY2goJG8tPmdldF9pdGVtcygpIGFzICRpKXsgJHA9JGktPmdldF9wcm9kdWN0KCk7ICRjYXRzPSRwP3dwX2xpc3RfcGx1Y2soZ2V0X3RoZV90ZXJtcygkcC0+Z2V0X3BhcmVudF9pZCgpPzokcC0+Z2V0X2lkKCksJ3Byb2R1Y3RfY2F0Jyk/OltdLCduYW1lJyk6W107ICRpdFtdPW1iX3N1YnN0cigkaS0+Z2V0X25hbWUoKSwwLDQ1KS4nIMOXJy4kaS0+Z2V0X3F1YW50aXR5KCkuJyBbJy5tYl9zdWJzdHIoaW1wbG9kZSgnLycsJGNhdHMpLDAsNjApLiddJzsgfQogICAgICAkeFsndXpzJ109WyRvLT5nZXRfb3JkZXJfbnVtYmVyKCksJG8tPmdldF9zdGF0dXMoKSwkby0+Z2V0X2RhdGVfY3JlYXRlZCgpLT5kYXRlKCdtLWQgSDppJykscm91bmQoKGZsb2F0KSRvLT5nZXRfdG90YWwoKSwyKSwkaXRdOwogICAgICAkeFsndG9fcGFjaW9fcGlya2ltYWlfcG8nXT1bXTsgZm9yZWFjaCh3Y19nZXRfb3JkZXJzKFsnbGltaXQnPT4xMCwndHlwZSc9PidzaG9wX29yZGVyJywnYmlsbGluZ19lbWFpbCc9PiRlbSwnZGF0ZV9jcmVhdGVkJz0+Jz4nLiRvLT5nZXRfZGF0ZV9jcmVhdGVkKCktPmdldFRpbWVzdGFtcCgpXSkgYXMgJHBvKSAkeFsndG9fcGFjaW9fcGlya2ltYWlfcG8nXVtdPVskcG8tPmdldF9vcmRlcl9udW1iZXIoKSwkcG8tPmdldF9zdGF0dXMoKSwkcG8tPmdldF9kYXRlX2NyZWF0ZWQoKS0+ZGF0ZSgnbS1kJyldOyB9CiAgICBlbHNlICR4Wyd1enMnXT0nbmVyYXN0YXMgKG9pZD0nLiRvaWQuJyknOwogICAgJHhbJ2tpdGlfbGFpc2thaV9nYXZlanVpJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCR3KSB1c2UoJG1hc2speyByZXR1cm4gJHc7IH0sJHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQsZmxvdyxzdGF0dXMsQ09BTEVTQ0Uoc2tpcF9yZWFzb24sJycpIHNyLERBVEVfRk9STUFUKENPQUxFU0NFKHNlbnRfYXQsZGVjaXNpb25fYXQsc2NoZWR1bGVkX2F0KStJTlRFUlZBTCAzIEhPVVIsJyUlbS0lJWQgJSVIOiUlaScpIHQgRlJPTSAkVCBXSEVSRSByZWNpcGllbnRfZW1haWw9JXMgT1JERVIgQlkgaWQiLCRlbSksQVJSQVlfQSkpOwogICAgJHJbJ2onLiRpZF09JHg7IH0KICAkZW09JHdwZGItPmdldF92YXIoIlNFTEVDVCByZWNpcGllbnRfZW1haWwgRlJPTSAkVCBXSEVSRSBpZD0xMjE4Iik7CiAgJHJbJ3ppbl8xMjE4J109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQsZmxvdyxzdGF0dXMsQ09BTEVTQ0Uoc2tpcF9yZWFzb24sJycpIHNyLGpvYl9rZXksREFURV9GT1JNQVQoQ09BTEVTQ0Uoc2VudF9hdCxkZWNpc2lvbl9hdCxzY2hlZHVsZWRfYXQpK0lOVEVSVkFMIDMgSE9VUiwnJSVtLSUlZCAlJUg6JSVpJykgdCxhdHRlbXB0cyBhIEZST00gJFQgV0hFUkUgcmVjaXBpZW50X2VtYWlsPSVzIE9SREVSIEJZIGlkIiwkZW0pLEFSUkFZX0EpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0pOwo=';
const VER='dep-184350';
const GKEY='ps_s1750c';
const PHASES=["1"];
const OUT='out/s1750_c.json';
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
