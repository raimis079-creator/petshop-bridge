process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxOTA4cyBTZW5kZXIgU01TIHBlciBpdnlraSB0ZXN0YXMgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxOTA4cyddKSkgcmV0dXJuOyAkRj0oc3RyaW5nKSRfR0VUWydwc19zMTkwOHMnXTsgJHI9Wyd2Jz0+J3MxJywnRic9PiRGXTsgQHNldF90aW1lX2xpbWl0KDkwKTsKICAkRU09J3RlcnJhQGd5dnVuYWkubHQnOyAkVEVMPScrMzcwNjgxODc3ODcnOwogICRUWFQ9J1RFU1RBUyAyLiBQZXRzaG9wLmx0OiByeXRvaiBpc3NpdW5jaWFtZSBKdXN1IHByZW51bWVyYXRhICgzMSwyOSBFVVIpIGkgcGFzdG9tYXRhIEFJQkUgTmVtZW5jaW5lLiBQcmFsZWlzdGkgZ2FsaXRlIHNpYW5kaWVuIHBhc2t5cm9qZS4gSW5mbyArMzcwNjgxODc3ODcnOwogIHRyeXsKICAgIGlmKCFjbGFzc19leGlzdHMoJ1BldHNob3BfU2VuZGVyX0FkYXB0ZXInKSkgdGhyb3cgbmV3IEV4Y2VwdGlvbignbmVyYSBhZGFwdGVyaW8nKTsKICAgICR0b2s9UGV0c2hvcF9TZW5kZXJfQWRhcHRlcjo6Z2V0X3N0b3JlZF90b2tlbignbWFya2V0aW5nJyk7IGlmKCEkdG9rKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCduZXJhIHRva2VubycpOwogICAgJHJxPWZ1bmN0aW9uKCRtLCRwLCRiPW51bGwpIHVzZSgkdG9rKXsgJGE9WydtZXRob2QnPT4kbSwndGltZW91dCc9PjI1LCdoZWFkZXJzJz0+WydBdXRob3JpemF0aW9uJz0+J0JlYXJlciAnLiR0b2ssJ0NvbnRlbnQtVHlwZSc9PidhcHBsaWNhdGlvbi9qc29uJywnQWNjZXB0Jz0+J2FwcGxpY2F0aW9uL2pzb24nXV07IGlmKCRiIT09bnVsbCkkYVsnYm9keSddPXdwX2pzb25fZW5jb2RlKCRiKTsKICAgICAgJHg9d3BfcmVtb3RlX3JlcXVlc3QoJ2h0dHBzOi8vYXBpLnNlbmRlci5uZXQvdjInLiRwLCRhKTsgaWYoaXNfd3BfZXJyb3IoJHgpKSByZXR1cm4gWydlcnInPT4keC0+Z2V0X2Vycm9yX21lc3NhZ2UoKV07CiAgICAgIHJldHVybiBbJ2NvZGUnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkeCksJ2JvZHknPT5zdWJzdHIod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHgpLDAsOTAwKV07IH07CiAgICAkclsnbGVuJ109c3RybGVuKCRUWFQpOwogICAgJGc9JHJxKCdHRVQnLCcvc3Vic2NyaWJlcnMvJy5yYXd1cmxlbmNvZGUoJEVNKSk7ICRqPWpzb25fZGVjb2RlKCRnWydib2R5J10/PycnLHRydWUpOwogICAgJHJbJ3ByaWVzJ109Wydjb2RlJz0+JGdbJ2NvZGUnXT8/bnVsbCwncGhvbmUnPT4kalsnZGF0YSddWydwaG9uZSddPz9udWxsLCdzdGF0dXMnPT4kalsnZGF0YSddWydzdGF0dXMnXT8/bnVsbF07CiAgICBpZigkRj09PSdTVCcpeyAkclsncGF0Y2gnXT0kcnEoJ1BBVENIJywnL3N1YnNjcmliZXJzLycucmF3dXJsZW5jb2RlKCRFTSksWyd0cmFuc2FjdGlvbmFsX3Ntc19zdGF0dXMnPT4nQUNUSVZFJywndHNtc19zdGF0dXMnPT4nQUNUSVZFJywndHJpZ2dlcl9hdXRvbWF0aW9uJz0+ZmFsc2VdKTsgJGc9JHJxKCdHRVQnLCcvc3Vic2NyaWJlcnMvJy5yYXd1cmxlbmNvZGUoJEVNKSk7ICRqPWpzb25fZGVjb2RlKCRnWydib2R5J10/PycnLHRydWUpOyAkclsncG9fc3QnXT0kalsnZGF0YSddWydzdGF0dXMnXT8/bnVsbDsgJHJbJ3JhdyddPXN1YnN0cigkZ1snYm9keSddPz8nJywwLDcwMCk7IH0KICAgIGlmKCRGPT09J1BSJyl7ICRzdD1mdW5jdGlvbigpIHVzZSgkcnEsJEVNKXsgJGc9JHJxKCdHRVQnLCcvc3Vic2NyaWJlcnMvJy5yYXd1cmxlbmNvZGUoJEVNKSk7ICRqPWpzb25fZGVjb2RlKCRnWydib2R5J10/PycnLHRydWUpOyByZXR1cm4gJGpbJ2RhdGEnXVsnc3RhdHVzJ10/P251bGw7IH07CiAgICAgICRycSgnUEFUQ0gnLCcvc3Vic2NyaWJlcnMvJy5yYXd1cmxlbmNvZGUoJEVNKSxbJ3RzbXNfc3RhdHVzJz0+J1VOU1VCU0NSSUJFRCcsJ3RyaWdnZXJfYXV0b21hdGlvbic9PmZhbHNlXSk7ICRyWydwb190c21zX3Vuc3ViJ109JHN0KCk7CiAgICAgICRycSgnUEFUQ0gnLCcvc3Vic2NyaWJlcnMvJy5yYXd1cmxlbmNvZGUoJEVNKSxbJ3RyYW5zYWN0aW9uYWxfc21zX3N0YXR1cyc9PidVTlNVQlNDUklCRUQnLCd0cmlnZ2VyX2F1dG9tYXRpb24nPT5mYWxzZV0pOyAkclsncG9fdHJhbnNfdW5zdWInXT0kc3QoKTsKICAgICAgJHJxKCdQQVRDSCcsJy9zdWJzY3JpYmVycy8nLnJhd3VybGVuY29kZSgkRU0pLFsndHJhbnNhY3Rpb25hbF9zbXNfc3RhdHVzJz0+J0FDVElWRScsJ3RyaWdnZXJfYXV0b21hdGlvbic9PmZhbHNlXSk7ICRyWydwb190cmFuc19hY3QnXT0kc3QoKTsKICAgICAgJHJxKCdQQVRDSCcsJy9zdWJzY3JpYmVycy8nLnJhd3VybGVuY29kZSgkRU0pLFsndHNtc19zdGF0dXMnPT4nQUNUSVZFJywndHJpZ2dlcl9hdXRvbWF0aW9uJz0+ZmFsc2VdKTsgJHJbJ3BvX3RzbXNfYWN0J109JHN0KCk7IH0KICAgIGlmKCRGPT09J0VWJyl7ICRyWydldmVudCddPSRycSgnUE9TVCcsJy9ldmVudHMnLFsnc3Vic2NyaWJlcic9PlsnZW1haWwnPT4kRU1dLCd0eXBlJz0+J3ByZW5fc21zX3J5dG9qJ10pOyB9CiAgICBpZigkRj09PSdHTycpewogICAgICAkclsncGF0Y2gnXT0kcnEoJ1BBVENIJywnL3N1YnNjcmliZXJzLycucmF3dXJsZW5jb2RlKCRFTSksWydwaG9uZSc9PiRURUwsJ2ZpZWxkcyc9PlsnUFNfUFJFTl9TTVMnPT4kVFhUXV0pOwogICAgICAkclsnZXZlbnQnXT0kcnEoJ1BPU1QnLCcvZXZlbnRzJyxbJ3N1YnNjcmliZXInPT5bJ2VtYWlsJz0+JEVNXSwndHlwZSc9PidwcmVuX3Ntc19yeXRvaiddKTsKICAgICAgJGc9JHJxKCdHRVQnLCcvc3Vic2NyaWJlcnMvJy5yYXd1cmxlbmNvZGUoJEVNKSk7ICRqPWpzb25fZGVjb2RlKCRnWydib2R5J10/PycnLHRydWUpOwogICAgICAka29sPVtdOyBmb3JlYWNoKCgkalsnZGF0YSddWydjb2x1bW5zJ10/P1tdKSBhcyAkYyl7IGlmKHN0cmlwb3MoJGNbJ3RpdGxlJ10/PycnLCdQUkVOX1NNUycpIT09ZmFsc2UpICRrb2xbXT0kYzsgfQogICAgICAkclsncG8nXT1bJ3Bob25lJz0+JGpbJ2RhdGEnXVsncGhvbmUnXT8/bnVsbCwnc3RhdHVzJz0+JGpbJ2RhdGEnXVsnc3RhdHVzJ10/P251bGwsJ2xhdWthcyc9PiRrb2xdOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sMSk7Cg==';
const VER='dep-133804';
const GKEY='ps_s1908s';
const PHASES=["PR"];
const OUT='analize/s1908_pr.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
