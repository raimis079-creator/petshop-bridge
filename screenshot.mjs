process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODIzYiAjMTYgbmV0dXJpbWFzIGR5ZGlzIG5lIHZlaWR1ICgxIGRyeSwgMiBhcHBseSwgMyBzaG90cywgOSByZXN0b3JlKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MjNiJ10pKSByZXR1cm47ICRGPSRfR0VUWydwc19zMTgyM2InXTsgJHI9Wyd2Jz0+J1MxODIzYicsJ0YnPT4kRl07IGdsb2JhbCAkd3BkYjsKICAkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWR5ZHppYWkta2F0YWxvZ2FzLnBocCc7ICRiYWs9ZGlybmFtZShBQlNQQVRIKS4nL3BzLWFyY2h5dmFzL3BldHNob3AtZHlkemlhaS1rYXRhbG9nYXMucGhwLmJha19zMTgyMyc7IGlmKCFmaWxlX2V4aXN0cygkZikpeyAkZj1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1keWR6aWFpLWthdGFsb2dhcy9wZXRzaG9wLWR5ZHppYWkta2F0YWxvZ2FzLnBocCc7IH0KICAkclsnZiddPSRmOyAkYz1AZmlsZV9nZXRfY29udGVudHMoJGYpOyAkclsnbWQ1J109bWQ1KChzdHJpbmcpJGMpOwogICRBMT0iaXNzZXQoIFwkZHBbIFwkaWQgXSApID8gMSA6IDAgKTsiOyAkQjE9Imlzc2V0KCBcJGRwWyBcJGlkIF0gKSA/IDEgOiAwLCBcJHlyYSA/IDEgOiAwICk7IjsKICAkQTI9Ilx0XHRcdGlmICggXCRuZV9wYWthaSApIHsgXCRrYW5kID0gXCRuZV9wYWthaTsgfSI7ICRCMj0iXHRcdFx0XCR0dXIgPSBhcnJheV92YWx1ZXMoIGFycmF5X2ZpbHRlciggXCRrYW5kLCBmdW5jdGlvbiAoIFwkbiApIHsgcmV0dXJuICEgZW1wdHkoIFwkbls4XSApOyB9ICkgKTsgLy8gdjEuNCAoUzE4MjMgIzE2KTogbmV0dXJpbWFzIGR5ZGlzIHZlaWR1IG5ldGFtcGEsIGtvbCDFoWVpbW9qZSB5cmEgdHVyaW3Fs1xuXHRcdFx0aWYgKCBcJHR1ciApIHsgXCRrYW5kID0gXCR0dXI7IFwkbmVfcGFrYWkgPSBhcnJheV92YWx1ZXMoIGFycmF5X2ZpbHRlciggXCRrYW5kLCBmdW5jdGlvbiAoIFwkbiApIHsgcmV0dXJuIGVtcHR5KCBcJG5bN10gKTsgfSApICk7IH1cbiIuJEEyOwogICRyWydjbnQnXT1bc3Vic3RyX2NvdW50KCRjLCRBMSksc3Vic3RyX2NvdW50KCRjLCRBMildOwogICRmYWNlPWZ1bmN0aW9uKCl7ICRvPVtdOyAkcz1QZXRzaG9wX0R5ZHppdV9LYXRhbG9nYXM6OnNlaW1vcygpOyBmb3JlYWNoKCRzIGFzICRrPT4kbSl7ICRrMj1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKCRtLGZ1bmN0aW9uKCRuKXtyZXR1cm4gZW1wdHkoJG5bNl0pO30pKTsgaWYoISRrMikkazI9JG07ICRucD1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKCRrMixmdW5jdGlvbigkbil7cmV0dXJuIGVtcHR5KCRuWzddKTt9KSk7IGlmKCRucCkkazI9JG5wOyB1c29ydCgkazIsZnVuY3Rpb24oJGEsJGIpe3JldHVybiAoJGJbMV08PT4kYVsxXSk/OigkYls0XTw9PiRhWzRdKTt9KTsgJHY9JGsyWzBdWzBdOyAkcD13Y19nZXRfcHJvZHVjdCgkdik7IGlmKCRwICYmICEkcC0+aXNfaW5fc3RvY2soKSl7ICR0dXI9W107IGZvcmVhY2goJG0gYXMgJG4peyAkcT13Y19nZXRfcHJvZHVjdCgkblswXSk7IGlmKCRxICYmICRxLT5pc19pbl9zdG9jaygpKSAkdHVyW109JG5bMF07IH0gaWYoJHR1cikgJG9bXT1bJGssJHYsJHR1cl07IH0gfSByZXR1cm4gJG87IH07CiAgaWYoJEY9PT0nMScpeyAkclsnYmxvZ2lfdmVpZGFpJ109JGZhY2UoKTsgJHJbJ24nXT1jb3VudCgkclsnYmxvZ2lfdmVpZGFpJ10pOyB9CiAgZWxzZWlmKCRGPT09JzInKXsgaWYoJHJbJ2NudCddIT09WzEsMV0peyAkclsna2xhaWRhJ109J2NudCc7IGdvdG8gb3V0OyB9CiAgICAkbj1zdHJfcmVwbGFjZShbJEExLCRBMl0sWyRCMSwkQjJdLCRjKTsgJG49cHJlZ19yZXBsYWNlKCcvXG4gXCpcL1xuLycsIlxuICogICB2MS40IChTMTgyMyAjMTYsIDIwMjYtMTEtMDMsIFJhaW1pcyk6IG5ldHVyaW1hcyAob3V0b2ZzdG9jaykgbmFyeXMgdmVpZHUgbmV0YW1wYSwga29sIMWhZWltb2plIHlyYSB0dXJpbcWzIOKAkyBPbnRhcmlvIDAsNzUga2cg4oCeTmV0dXJpbWXigJwgYXR2ZWppcy5cbiAqL1xuIiwkbiwxKTsKICAgIHRyeXsgdG9rZW5fZ2V0X2FsbCgkbixUT0tFTl9QQVJTRSk7IH1jYXRjaChcVGhyb3dhYmxlICRlKXsgJHJbJ2tsYWlkYSddPSdwYXJzZSAnLiRlLT5nZXRNZXNzYWdlKCk7IGdvdG8gb3V0OyB9CiAgICBpZighZmlsZV9leGlzdHMoJGJhaykpIGZpbGVfcHV0X2NvbnRlbnRzKCRiYWssJGMpOyBmaWxlX3B1dF9jb250ZW50cygkZiwkbik7IGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpIG9wY2FjaGVfaW52YWxpZGF0ZSgkZix0cnVlKTsgZGVsZXRlX3RyYW5zaWVudCgncHNfZGtfc2VpbW9zJyk7ICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdfdHJhbnNpZW50JXBzX2R5ZCUnIik7CiAgICBpZihmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX2NsZWFyX2NhY2hlJykpIHdwX2NhY2hlX2NsZWFyX2NhY2hlKCk7IGlmKGZ1bmN0aW9uX2V4aXN0cygncm9ja2V0X2NsZWFuX2RvbWFpbicpKSByb2NrZXRfY2xlYW5fZG9tYWluKCk7CiAgICAkclsnbWQ1X25ldyddPW1kNV9maWxlKCRmKTsgJGhiPVtdOyBmb3JlYWNoKFsnLycsJy9wYXJkdW90dXZlLycsJy9rYXRlZ29yaWphL3N1bmltcy9tYWlzdGFzLXN1bmltcy9zYXVzYXMtbWFpc3Rhcy1zdW5pbXMvJywnL2thdGVnb3JpamEva2F0ZW1zL21haXN0YXMta2F0ZW1zL2tvbnNlcnZhaS1rYXRlbXMvJywnLz9zPW9udGFyaW8mcG9zdF90eXBlPXByb2R1Y3QnXSBhcyAkdSl7ICR4PXdwX3JlbW90ZV9nZXQoYWRkX3F1ZXJ5X2FyZygncHNfaGInLHRpbWUoKSxob21lX3VybCgkdSkpLFsndGltZW91dCc9PjQwLCdzc2x2ZXJpZnknPT5mYWxzZV0pOyAkaGJbXT1bJHUsd3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpLHN1YnN0cl9jb3VudCh3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkeCksJ3Byb2R1Y3Qtc21hbGwnKV07IH0KICAgICRyWydoYiddPSRoYjsgZm9yZWFjaCgkaGIgYXMgJGgpeyBpZigkaFsxXT49NTAwfHwkaFsxXT09MCl7IGZpbGVfcHV0X2NvbnRlbnRzKCRmLCRjKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCdvcGNhY2hlX2ludmFsaWRhdGUnKSkgb3BjYWNoZV9pbnZhbGlkYXRlKCRmLHRydWUpOyAkclsnQVRTVEFUWVRBJ109MTsgfSB9IH0KICBlbHNlaWYoJEY9PT0nMycpeyAkclsncG8nXT0kZmFjZSgpOyAkclsnc2hvdHMnXT1bWyduJz0+J3MxODIzXzE2X29udGFyaW8nLCd1Jz0+aG9tZV91cmwoJy8/cz1vbnRhcmlvK21pbmkrbGFtYiZwb3N0X3R5cGU9cHJvZHVjdCcpLCd3Jz0+MzkwLCdoJz0+ODQ0LCdldmFsJz0+IigoKT0+e3ZhciBjPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9kdWN0LXNtYWxsJyk7aWYoYyl7Yy5zY3JvbGxJbnRvVmlldygpO3dpbmRvdy5zY3JvbGxCeSgwLC02MCl9cmV0dXJuIDF9KSgpIl1dOyB9CiAgZWxzZWlmKCRGPT09JzknKXsgaWYoZmlsZV9leGlzdHMoJGJhaykpeyBmaWxlX3B1dF9jb250ZW50cygkZixmaWxlX2dldF9jb250ZW50cygkYmFrKSk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpIG9wY2FjaGVfaW52YWxpZGF0ZSgkZix0cnVlKTsgZGVsZXRlX3RyYW5zaWVudCgncHNfZGtfc2VpbW9zJyk7ICRyWydhdHN0YXR5dGEnXT1tZDVfZmlsZSgkZik7IH0gfQogIG91dDogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-225523';
const GKEY='ps_s1823b';
const PHASES=["1"];
const OUT='analize/s1823_b1.json';
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
