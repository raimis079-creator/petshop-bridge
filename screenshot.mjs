process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI0aCBDbG91ZGZsYXJlIHBhdGlrcm9zLiBGYXplczogMSBhciB1emtsYXVzYSBhdGVpbmEgcGVyIENGIChhbnRyYXN0ZXMsIHJlYWwgSVApLCAyIGhlYXJ0YmVhdC9maWx0cnUgNDAzL2thc2EvUkVTVCBwZXIgcGV0c2hvcC5sdCBpcyBzZXJ2ZXJpbywgMyBTTVRQIHRlc3RpbmlzIGxhaXNrYXMgdGVycmFAZ3l2dW5haS5sdCwgNCBjcm9uL1dQQUkvZmVlZCBidXNlbmEgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzI0aCddKSkgcmV0dXJuOyAkZj0oc3RyaW5nKSRfR0VUWydwc19zMTcyNGgnXTsgJHI9Wyd2Jz0+J1MxNzI0aCcsJ2ZhemUnPT4kZl07IEBzZXRfdGltZV9saW1pdCgxNTApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICR0ej1uZXcgRGF0ZVRpbWVab25lKCdFdXJvcGUvVmlsbml1cycpOwogIHRyeXsKICAgIGlmKCRmPT09JzEnKXsKICAgICAgZm9yZWFjaChbJ1JFTU9URV9BRERSJywnUFNfQ0ZfRURHRV9JUCcsJ0hUVFBfQ0ZfQ09OTkVDVElOR19JUCcsJ0hUVFBfQ0ZfUkFZJywnSFRUUF9DRl9JUENPVU5UUlknLCdIVFRQX0NGX1ZJU0lUT1InLCdIVFRQX1hfRk9SV0FSREVEX0ZPUicsJ0hUVFBfWF9GT1JXQVJERURfUFJPVE8nLCdTRVJWRVJfQUREUicsJ0hUVFBTJywnSFRUUF9IT1NUJ10gYXMgJGspICRyWydzcnYnXVska109JF9TRVJWRVJbJGtdPz9udWxsOwogICAgICAkclsncGVyX2NmJ109IWVtcHR5KCRfU0VSVkVSWydIVFRQX0NGX1JBWSddKTsgJHJbJ2NmX2lwX3BsdWdpbiddPWZ1bmN0aW9uX2V4aXN0cygncHNfY2ZfaXBfYXBwbHknKTsKICAgICAgJHJbJ2Ruc19hJ109QGRuc19nZXRfcmVjb3JkKCdwZXRzaG9wLmx0JyxETlNfQSk7ICRyWydkbnNfbnMnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiAkeFsndGFyZ2V0J107fSwoYXJyYXkpQGRuc19nZXRfcmVjb3JkKCdwZXRzaG9wLmx0JyxETlNfTlMpKTsKICAgICAgJHJbJ2xhaWthcyddPShuZXcgRGF0ZVRpbWUoJ25vdycsJHR6KSktPmZvcm1hdCgnSDppOnMnKTsKICAgIH0KICAgIGlmKCRmPT09JzInKXsKICAgICAgJGdldD1mdW5jdGlvbigkdXJsLCRhcmdzPVtdKSB7ICR4PXdwX3JlbW90ZV9nZXQoJHVybCxhcnJheV9tZXJnZShbJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+dHJ1ZSwncmVkaXJlY3Rpb24nPT4wLCd1c2VyLWFnZW50Jz0+J01vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIHBzLXMxNzI0aCddLCRhcmdzKSk7IGlmKGlzX3dwX2Vycm9yKCR4KSkgcmV0dXJuIFsnRVJSJz0+JHgtPmdldF9lcnJvcl9tZXNzYWdlKCldOyAkaD13cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVycygkeCk7IHJldHVybiBbJ2tvZGFzJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpLCdjZl9yYXknPT4kaFsnY2YtcmF5J10/P251bGwsJ3NlcnZlcic9PiRoWydzZXJ2ZXInXT8/bnVsbCwnY2ZfY2FjaGUnPT4kaFsnY2YtY2FjaGUtc3RhdHVzJ10/P251bGwsJ2xvYyc9PiRoWydsb2NhdGlvbiddPz9udWxsLCdsZW4nPT5zdHJsZW4od3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHgpKV07IH07CiAgICAgICRyWydwcmFkemlhJ109JGdldChob21lX3VybCgnLz9wc19oYj0nLnRpbWUoKSkpOwogICAgICAkclsncHJhZHppYV9rZXN1b2phbWEnXT0kZ2V0KGhvbWVfdXJsKCcvJykpOwogICAgICAkclsna2F0ZWdvcmlqYSddPSRnZXQoaG9tZV91cmwoJy9rYXRlZ29yaWphL3N1bmltcy9tYWlzdGFzLXN1bmltcy8nKSk7CiAgICAgICRyWydmaWx0cmFzX2JlX3NsYXB1a28nXT0kZ2V0KGhvbWVfdXJsKCcva2F0ZWdvcmlqYS9zdW5pbXMvbWFpc3Rhcy1zdW5pbXMvP2ZpbHRlcl9hbXppdXM9c3VhdWd1c2llbXMmcHNfeD0wJykpOwogICAgICAkclsnZmlsdHJhc19iZV9zbGFwdWtvX2JlX3BzJ109JGdldChob21lX3VybCgnL2thdGVnb3JpamEvc3VuaW1zL21haXN0YXMtc3VuaW1zLz9maWx0ZXJfYW16aXVzPXN1YXVndXNpZW1zJykpOwogICAgICAkclsnZmlsdHJhc19zdV9zbGFwdWt1J109JGdldChob21lX3VybCgnL2thdGVnb3JpamEvc3VuaW1zL21haXN0YXMtc3VuaW1zLz9maWx0ZXJfYW16aXVzPXN1YXVndXNpZW1zJyksWydjb29raWVzJz0+W25ldyBXUF9IdHRwX0Nvb2tpZShbJ25hbWUnPT4ncHNfanMnLCd2YWx1ZSc9PicxJ10pXV0pOwogICAgICAkclsna2FzYSddPSRnZXQoaG9tZV91cmwoJy9rYXNhLycpKTsKICAgICAgJHJbJ3Jlc3RfYmVfYXV0aCddPSRnZXQocmVzdF91cmwoJ3dwL3YyL3R5cGVzJykpOwogICAgICAkclsnd2NfYXBpJ109JGdldChob21lX3VybCgnL3djLWFwaS8nKSk7CiAgICAgICRyWydzdGF0aWthJ109JGdldChpbmNsdWRlc191cmwoJ2pzL2pxdWVyeS9qcXVlcnkubWluLmpzJykpOwogICAgICAkclsnc3RhdGlrYTInXT0kZ2V0KGluY2x1ZGVzX3VybCgnanMvanF1ZXJ5L2pxdWVyeS5taW4uanMnKSk7CiAgICAgICRyWydzaXRlbWFwJ109JGdldChob21lX3VybCgnL3NpdGVtYXBfaW5kZXgueG1sJykpOwogICAgICAkclsncm9ib3RzJ109JGdldChob21lX3VybCgnL3JvYm90cy50eHQnKSk7CiAgICAgICRyWydsYWlrYXMnXT0obmV3IERhdGVUaW1lKCdub3cnLCR0eikpLT5mb3JtYXQoJ0g6aTpzJyk7CiAgICB9CiAgICBpZigkZj09PSczJyl7CiAgICAgICRvaz13cF9tYWlsKCd0ZXJyYUBneXZ1bmFpLmx0JywnW1RFU1RBUyBTMTcyNF0gQ2xvdWRmbGFyZSDigJQgU01UUCBwYXRpa3JhICcuZGF0ZSgnSDppJyksIlRlc3RpbmlzIGxhacWha2FzIHBvIENsb3VkZmxhcmUgTlMga2VpdGltby4gSmVpIGdhdmFpIOKAlCBXUCBNYWlsIFNNVFAgcGVyIGlzb3Bhcy5zZXJ2ZXJpYWkubHQgdmVpa2lhLlxuTGFpa2FzOiAiLmN1cnJlbnRfdGltZSgnbXlzcWwnKSk7CiAgICAgICRyWyd3cF9tYWlsJ109JG9rOyAkZGJnPWdldF9vcHRpb24oJ3dwX21haWxfc210cF9kZWJ1ZycpOyAkclsnc210cF9kZWJ1Z19wYXNrJ109aXNfYXJyYXkoJGRiZyk/YXJyYXlfc2xpY2UoJGRiZywtMik6bnVsbDsKICAgIH0KICAgIGlmKCRmPT09JzQnKXsKICAgICAgJHJbJ3dwYWlfaGlzdCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGltcG9ydF9pZCBpLHRpbWVfcnVuLExFRlQoc3VtbWFyeSw2MCkgcyxkYXRlIEZST00geyRQfXBteGlfaGlzdG9yeSBXSEVSRSBkYXRlPj1VVENfVElNRVNUQU1QKCktSU5URVJWQUwgMyBIT1VSIE9SREVSIEJZIGlkIERFU0MgTElNSVQgOCIsQVJSQVlfQSk7CiAgICAgICRyWydjcm9uX3ZlbHUnXT0wOyAkbm93PXRpbWUoKTsgZm9yZWFjaChfZ2V0X2Nyb25fYXJyYXkoKSBhcyAkdHM9PiRob29rcyl7IGZvcmVhY2goJGhvb2tzIGFzICRoPT4keCl7IGlmKCR0czwkbm93LTkwMCkgJHJbJ2Nyb25fdmVsdSddKys7IH0gfQogICAgICAkclsncHNfd2ViX2l2eWtpYWlfMTBtaW4nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cHNfd2ViX2l2eWtpYWkgV0hFUkUgc3VrdXJ0YV9hdD49Tk9XKCktSU5URVJWQUwgMTAgTUlOVVRFIik7CiAgICAgICRyWyd1enNha3ltYWlfMWgnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9d2Nfb3JkZXJzIFdIRVJFIHR5cGU9J3Nob3Bfb3JkZXInIEFORCBkYXRlX2NyZWF0ZWRfZ210Pj1VVENfVElNRVNUQU1QKCktSU5URVJWQUwgMSBIT1VSIik7CiAgICAgICRyWydwaHBfbG9nX3RhaWwnXT1bXTsgJGxmPWluaV9nZXQoJ2Vycm9yX2xvZycpOyBpZigkbGYmJmlzX2ZpbGUoJGxmKSl7ICRzej1maWxlc2l6ZSgkbGYpOyAkaD1mb3BlbigkbGYsJ3InKTsgZnNlZWsoJGgsbWF4KDAsJHN6LTYwMDApKTsgJHR4PXN0cmVhbV9nZXRfY29udGVudHMoJGgpOyBmY2xvc2UoJGgpOyAkclsncGhwX2xvZ190YWlsJ109YXJyYXlfc2xpY2UoYXJyYXlfZmlsdGVyKGV4cGxvZGUoIlxuIiwkdHgpKSwtNik7IH0KICAgICAgJHJbJ3NhcmdvX2tsYWlkb3NfMzBtaW4nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBsYWlrYXMsIExFRlQoemludXRlLDEyMCkgeiBGUk9NIHskUH1wc19zYXJnYXNfa2xhaWRvcyBXSEVSRSBsYWlrYXM+PU5PVygpLUlOVEVSVkFMIDMwIE1JTlVURSBBTkQgbHlnaXM8Pid3YXJuaW5nJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDgiLEFSUkFZX0EpOwogICAgICAkclsnbGFpa2FzJ109KG5ldyBEYXRlVGltZSgnbm93JywkdHopKS0+Zm9ybWF0KCdIOmk6cycpOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-170028';
const GKEY='ps_s1724h';
const PHASES=["1", "2", "3", "4"];
const OUT='analize/s1725_cf.json';
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
