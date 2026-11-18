process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODkzYyBrb2RhczogacWhaW3EjWnFsyBpciDigJ5yYW5rYSBpxaFpbXRh4oCcIGxvZ2lrYSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4OTNjJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxMjApOyBnbG9iYWwgJHdwZGI7ICRyPVsndic9PidTMTg5M2MnXTsKICB0cnl7CiAgICAkZj1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwvcGV0c2hvcC14bWwucGhwJzsgJEw9ZmlsZSgkZik7ICRyWyd4bWxfbWQ1J109bWQ1X2ZpbGUoJGYpOwogICAgJHdhbnQ9W107IGZvcmVhY2goJEwgYXMgJGk9PiRsKXsgaWYocHJlZ19tYXRjaCgnL2lzaW10aXN8cGVyeml1cnxyYW5rYV9pc2ltdGF8X3BzX3B1Ymxpa3VvdGEvJywkbCkpICR3YW50W109JGk7IH0KICAgICRvdXQ9W107IGZvcmVhY2goJHdhbnQgYXMgJGkpeyBmb3IoJGo9bWF4KDAsJGktNik7JGo8PW1pbihjb3VudCgkTCktMSwkaSs4KTskaisrKXsgJG91dFskaisxXT1ydHJpbShtYl9zdWJzdHIoJExbJGpdLDAsMjMwKSk7IH0gfSBrc29ydCgkb3V0KTsgJHJbJ3htbCddPSRvdXQ7CiAgICAkbmVlZGxlcz1bJ19wc19yYW5rYV9pc2ltdGFfa2FzJywnX3BzX2lzaW10aXNfcGVyeml1cmV0YSddOyAkcm9vdHM9W1dQX1BMVUdJTl9ESVIsZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCksV1BNVV9QTFVHSU5fRElSXTsKICAgIGZvcmVhY2goJHJvb3RzIGFzICRyb290KXsgaWYoIWlzX2Rpcigkcm9vdCkpIGNvbnRpbnVlOyAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRyb290LEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSk7ICRuPTA7CiAgICAgIGZvcmVhY2goJGl0IGFzICRmZil7ICRwPShzdHJpbmcpJGZmOyBpZihzdWJzdHIoJHAsLTQpIT09Jy5waHAnfHxzdHJwb3MoJHAsJy9wZXRzaG9wJyk9PT1mYWxzZSYmc3RycG9zKCRwLCdmbGF0c29tZS1jaGlsZCcpPT09ZmFsc2UmJnN0cnBvcygkcCwnbXUtcGx1Z2lucycpPT09ZmFsc2UpIGNvbnRpbnVlOyAkYz1AZmlsZV9nZXRfY29udGVudHMoJHApOyBpZigkYz09PWZhbHNlKSBjb250aW51ZTsKICAgICAgICBmb3JlYWNoKCRuZWVkbGVzIGFzICRuZCl7IGlmKHN0cnBvcygkYywkbmQpPT09ZmFsc2UpIGNvbnRpbnVlOyAkTEw9ZXhwbG9kZSgiXG4iLCRjKTsgZm9yZWFjaCgkTEwgYXMgJGk9PiRsKXsgaWYoc3RycG9zKCRsLCRuZCkhPT1mYWxzZXx8c3RycG9zKCRsLCInX3BzX3JhbmthX2lzaW10YSciKSE9PWZhbHNlKXsgJGN0eD1bXTsgZm9yKCRqPW1heCgwLCRpLTMpOyRqPD1taW4oY291bnQoJExMKS0xLCRpKzMpOyRqKyspICRjdHhbXT0oJGorMSkuJzogJy5tYl9zdWJzdHIocnRyaW0oJExMWyRqXSksMCwyMjApOyAkclsnZmlsZXMnXVtzdHJfcmVwbGFjZShXUF9DT05URU5UX0RJUiwnJywkcCldW109JGN0eDsgaWYoKyskbj4yNSkgYnJlYWsgMzsgfSB9IGJyZWFrOyB9IH0gfQogICAgJHNuPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsY29kZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0xIEFORCBuYW1lIE5PVCBMSUtFICdURU1QIFBTJScgQU5EIChjb2RlIExJS0UgJyVfcHNfcmFua2FfaXNpbXRhJScgT1IgY29kZSBMSUtFICclX3BzX2lzaW10aXNfcGVyeml1cmV0YSUnIE9SIGNvZGUgTElLRSAnJV9wc19pc2ltdGlzX2xhdWtpYSUnKSIsQVJSQVlfQSk7CiAgICBmb3JlYWNoKCRzbiBhcyAkcyl7ICRMTD1leHBsb2RlKCJcbiIsJHNbJ2NvZGUnXSk7IGZvcmVhY2goJExMIGFzICRpPT4kbCl7IGlmKHByZWdfbWF0Y2goJy9fcHNfcmFua2FfaXNpbXRhfF9wc19pc2ltdGlzXy8nLCRsKSl7ICRjdHg9W107IGZvcigkaj1tYXgoMCwkaS0zKTskajw9bWluKGNvdW50KCRMTCktMSwkaSs0KTskaisrKSAkY3R4W109KCRqKzEpLic6ICcubWJfc3Vic3RyKHJ0cmltKCRMTFskal0pLDAsMjIwKTsgJHJbJ3NuaXAnXVskc1snaWQnXS4nICcuJHNbJ25hbWUnXV1bXT0kY3R4OyB9IH0gfQogICAgZm9yZWFjaChbMjIzNjYsMjIzNjldIGFzICRpZCl7ICRyWyd3YW5weSddWyRpZF09WydwZXJ6Jz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19pc2ltdGlzX3BlcnppdXJldGEnLHRydWUpLCdwdWInPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3B1Ymxpa3VvdGEnLHRydWUpXTsgfQogICAgJHJbJ29wdCddPVsncGF2Jz0+Z2V0X29wdGlvbigncHNfemJfa2FydGVsZV9pc2ltdHlzX3BhdicpLCdza3UnPT5nZXRfb3B0aW9uKCdwc196Yl9rYXJ0ZWxlX2lzaW10eXNfc2t1JyldOwogICAgJHJbJ3Rlcm1zJ109W107IGZvcmVhY2goWzk1LDk2LDgyNCwxNl0gYXMgJHQpeyAkdHQ9Z2V0X3Rlcm0oJHQsJ3Byb2R1Y3RfY2F0Jyk7ICRyWyd0ZXJtcyddWyR0XT0kdHQmJiFpc193cF9lcnJvcigkdHQpPyR0dC0+bmFtZS4nIC8nLiR0dC0+c2x1Zy4nIHBhcmVudCAnLiR0dC0+cGFyZW50Om51bGw7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OyB9KTsK';
const VER='dep-210054';
const GKEY='ps_s1893c';
const PHASES=["1"];
const OUT='analize/s1893c.json';
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
