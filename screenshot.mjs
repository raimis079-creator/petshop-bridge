process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODU0ZCDigJQgMiBuYXVqxbMgODUgZyBwYWthaSAxNi8zMiwgxaFlaW1vcywgcHVibGlrYXZpbWFzIFMxODUyK1MxODU0ICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgJGY9KGlzc2V0KCRfR0VUWydwc19zMTg1NCddKT8kX0dFVFsncHNfczE4NTQnXTonJyk7IGlmKCRmPT09JycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE4NTRkLScuJGYpOwogICRORVc9YXJyYXkoMzg0NzEsMzg0NzMpOwogICRQQUs9YXJyYXkoYXJyYXkoMzg0NzEsMTYsJzEzLjkwJyksYXJyYXkoMzg0NzEsMzIsJzI0LjkwJyksYXJyYXkoMzg0NzMsMTYsJzEzLjkwJyksYXJyYXkoMzg0NzMsMzIsJzI0LjkwJykpOwogICRyYXN0aT1mdW5jdGlvbigkYiwkcSkgdXNlKCR3cGRiLCRwKXsgcmV0dXJuICR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgcC5wb3N0X2lkIEZST00geyRwfXBvc3RtZXRhIHAgSk9JTiB7JHB9cG9zdG1ldGEgcSBPTiBxLnBvc3RfaWQ9cC5wb3N0X2lkIEFORCBxLm1ldGFfa2V5PSdfZHBfcGFja19xdHknIEFORCBxLm1ldGFfdmFsdWU9JXMgSk9JTiB7JHB9cG9zdHMgeiBPTiB6LklEPXAucG9zdF9pZCBBTkQgei5wb3N0X3N0YXR1czw+J3RyYXNoJyBXSEVSRSBwLm1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJyBBTkQgcC5tZXRhX3ZhbHVlPSVzIiwoc3RyaW5nKSRxLChzdHJpbmcpJGIpKTsgfTsKICBpZigkZj09PSdDJyl7IGZvcmVhY2goJE5FVyBhcyAkaWQpeyAkd3BkYi0+dXBkYXRlKCRwLidwc19zb3VyY2VzJyxhcnJheSgnY29zdF9uZXQnPT4nMC40MjAwJyksYXJyYXkoJ3Byb2R1Y3RfaWQnPT4kaWQsJ3NvdXJjZSc9PidhdicpKTsgJG9bJGlkXT1hcnJheShnZXRfcG9zdF9tZXRhKCRpZCwnX2Nvc3RfcHJpY2UnLHRydWUpLCR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgY29zdF9uZXQgRlJPTSB7JHB9cHNfc291cmNlcyBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBzb3VyY2U9J2F2JyIsJGlkKSkpOyB9IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAgaWYocHJlZ19tYXRjaCgnL15QKFxkKSQvJywkZiwkbSkpeyBsaXN0KCRiaWQsJHF0eSwka2FpbmEpPSRQQUtbKGludCkkbVsxXS0xXTsKICAgICRleD0kcmFzdGkoJGJpZCwkcXR5KTsgaWYoJGV4KXsgZWNobyBqc29uX2VuY29kZShhcnJheSgndic9PidTMTg1NGQtJy4kZiwnamF1Jz0+JGV4KSk7IGV4aXQ7IH0KICAgICRiYXplPXdjX2dldF9wcm9kdWN0KCRiaWQpOyAkcj1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9SaW5raW5pYWknLCdpc3NhdWdvdGlfZHAnKTsgJHItPnNldEFjY2Vzc2libGUodHJ1ZSk7CiAgICAkci0+aW52b2tlQXJncygkci0+aXNTdGF0aWMoKT9udWxsOm5ldyBQZXRzaG9wX1JpbmtpbmlhaSgpLGFycmF5KDAsJHF0eS4nIHZudC4gJy4kYmF6ZS0+Z2V0X25hbWUoKSwnJywka2FpbmEsd3Bfc3RyaXBfYWxsX3RhZ3MoJGJhemUtPmdldF9zaG9ydF9kZXNjcmlwdGlvbigpKSxmYWxzZSxhcnJheSgpLGFycmF5KCRiaWQ9PiRxdHkpLG51bGwsYXJyYXkoKSxudWxsKSk7CiAgICBlY2hvIGpzb25fZW5jb2RlKGFycmF5KCd2Jz0+J1MxODU0ZC0nLiRmLCdwYXN0YWJhJz0+J2JlIHdwX3NlbmRfanNvbicpKTsgZXhpdDsgfQogIGlmKCRmPT09J0YnKXsgJGQxOT0oYXJyYXkpZ2V0X29wdGlvbigncHNfZGtfZDE5X3NlaW1vcycsYXJyYXkoKSk7IGlmKCFnZXRfb3B0aW9uKCdwc19zMTg1NF9iYWsnKSkgdXBkYXRlX29wdGlvbigncHNfczE4NTRfYmFrJyxhcnJheSgnZDE5Jz0+JGQxOSksZmFsc2UpOyAkVD1hcnJheSgxNj0+ODIyLDMyPT44MjMpOwogICAgZm9yZWFjaCgkTkVXIGFzICRiKXsgJHM9J2F2LScuc2FuaXRpemVfdGl0bGUoZ2V0X3RoZV90aXRsZSgkYikpOyB1cGRhdGVfcG9zdF9tZXRhKCRiLCdfcHNfZHlkemlvX3NlaW1hJywkcyk7CiAgICAgIGZvcmVhY2goYXJyYXkoMTYsMzIpIGFzICRxKXsgJGlkPSRyYXN0aSgkYiwkcSk7IGlmKCEkaWQpeyAkb1sndHJ1a3N0YSddW109JGIuJ3gnLiRxOyBjb250aW51ZTsgfSB1cGRhdGVfcG9zdF9tZXRhKCRpZCwnX3BzX2R5ZHppb19zZWltYScsJHMpOyB3cF9zZXRfb2JqZWN0X3Rlcm1zKCRpZCxhcnJheSgkVFskcV0pLCdwYV9wYWt1b3Rlc19keWRpcycsZmFsc2UpOyB1cGRhdGVfcG9zdF9tZXRhKCRpZCwnX3BzX3MxODU0X3Bha2FzJywkYik7ICRvWydwYWsnXVskYl1bJHFdPWFycmF5KCRpZCx3Y19nZXRfcHJvZHVjdCgkaWQpLT5nZXRfcHJpY2UoKSxnZXRfcG9zdF9tZXRhKCRpZCwnX2Nvc3RfcHJpY2UnLHRydWUpKTsgfQogICAgICBpZighaW5fYXJyYXkoJHMsJGQxOSx0cnVlKSkgJGQxOVtdPSRzOyB9CiAgICB1cGRhdGVfb3B0aW9uKCdwc19ka19kMTlfc2VpbW9zJywkZDE5KTsgZGVsZXRlX3RyYW5zaWVudCgncHNfZGtfc2VpbW9zJyk7ICRvWydkMTlfbiddPWNvdW50KCRkMTkpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OyB9CiAgaWYoJGY9PT0nVScpeyAkaWRzPWFycmF5KDM4NDMwLDM4NDMyLDM4NDM0LDM4NDM4LDM4NDQwLDM4NDcxLDM4NDczLDM4NDQyLDM4NDQzLDM4NDQ0LDM4NDQ1LDM4NDQ4LDM4NDQ5KTsKICAgIGZvcmVhY2goJE5FVyBhcyAkYil7IGZvcmVhY2goYXJyYXkoMTYsMzIpIGFzICRxKXsgJHg9JHJhc3RpKCRiLCRxKTsgaWYoJHgpICRpZHNbXT0oaW50KSR4OyB9IH0KICAgICRiYWs9Z2V0X29wdGlvbigncHNfczE4NTRfYmFrJyxhcnJheSgpKTsgJGJha1sncHVibGlrdW90YSddPSRpZHM7IHVwZGF0ZV9vcHRpb24oJ3BzX3MxODU0X2JhaycsJGJhayxmYWxzZSk7CiAgICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHdhcz1nZXRfcG9zdF9zdGF0dXMoJGlkKTsgaWYoJHdhcyE9PSdwdWJsaXNoJyl7IHdwX3VwZGF0ZV9wb3N0KGFycmF5KCdJRCc9PiRpZCwncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcpKTsgfQogICAgICBjbGVhbl9wb3N0X2NhY2hlKCRpZCk7IHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJGlkKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9wb3N0X2NoYW5nZScpKSB3cF9jYWNoZV9wb3N0X2NoYW5nZSgkaWQpOwogICAgICAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgJG9bJ3N0J11bJGlkXT1hcnJheSgkd2FzLCRwci0+Z2V0X3N0YXR1cygpLCRwci0+Z2V0X3N0b2NrX3N0YXR1cygpLCRwci0+Z2V0X3ByaWNlKCksbWJfc3Vic3RyKCRwci0+Z2V0X25hbWUoKSwwLDQ1KSk7IH0KICAgIGRlbGV0ZV90cmFuc2llbnQoJ3BzX2RrX3NlaW1vcycpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OyB9Cn0pOwo=';
const VER='dep-150018';
const GKEY='ps_s1854';
const PHASES=["F", "U"];
const OUT='analize/s1854_d.json';
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
