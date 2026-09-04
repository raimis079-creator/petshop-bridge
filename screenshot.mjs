process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTEgcnVuIGUxNnIg4oCUIHBhxaF0byByZXB1dGFjaWpvcyByZWNvbiAoa2xhdXNpbWFzIDgpOiBzaXVudGltbyBrZWxpYXMgKFNNVFApLCBTZW5kZXIgQVBJIChkb21lbmFpL3N0YXRpc3Rpa2EvYm91bmNlcyksIEROU0JMLCBTUEYvREtJTS9ETUFSQyAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19lMTZyJ10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4ncnVuIGUxNnInKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyBzZXRfdGltZV9saW1pdCgyODApOwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICB0cnl7CiAgIC8vIDEuIEt1byBzaXVuxI1pYSB3cF9tYWlsCiAgICRvWydzbXRwX3BsdWdpbmFpJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigoYXJyYXkpZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKSxmdW5jdGlvbigkeCl7cmV0dXJuIHN0cmlwb3MoJHgsJ3NtdHAnKSE9PWZhbHNlfHxzdHJpcG9zKCR4LCdtYWlsJykhPT1mYWxzZTt9KSk7CiAgIGZvcmVhY2goYXJyYXkoJ3dwX21haWxfc210cCcsJ2ZsdWVudF9zbXRwX3NldHRpbmdzJywnZWFzeV93cF9zbXRwJywnc3dwc210cF9vcHRpb25zJywncG9zdG1hbl9vcHRpb25zJykgYXMgJGspeyAkdj1nZXRfb3B0aW9uKCRrKTsgaWYoJHYpeyBpZihpc19hcnJheSgkdikpeyBhcnJheV93YWxrX3JlY3Vyc2l2ZSgkdixmdW5jdGlvbigmJHgsJGtrKXsgaWYocHJlZ19tYXRjaCgnL3Bhc3N8c2VjcmV0fGtleXx0b2tlbi9pJywoc3RyaW5nKSRraykpICR4PScqKionOyB9KTsgfSAkb1snc210cF9vcHQnXVska109JHY7IH0gfQogICBnbG9iYWwgJHdwX2ZpbHRlcjsgZm9yZWFjaChhcnJheSgncGhwbWFpbGVyX2luaXQnLCdwcmVfd3BfbWFpbCcsJ3dwX21haWxfZnJvbScsJ3dwX21haWxfZnJvbV9uYW1lJykgYXMgJGgpeyAkb1snaG9va3MnXVskaF09YXJyYXkoKTsgaWYoIWVtcHR5KCR3cF9maWx0ZXJbJGhdKSl7IGZvcmVhY2goJHdwX2ZpbHRlclskaF0tPmNhbGxiYWNrcyBhcyAkcHI9PiRjYnMpeyBmb3JlYWNoKCRjYnMgYXMgJGNiKXsgJGZuPSRjYlsnZnVuY3Rpb24nXTsgJG9bJ2hvb2tzJ11bJGhdW109JHByLic6ICcuKGlzX2FycmF5KCRmbik/KGlzX29iamVjdCgkZm5bMF0pP2dldF9jbGFzcygkZm5bMF0pOiRmblswXSkuJzo6Jy4kZm5bMV06KGlzX3N0cmluZygkZm4pPyRmbjonY2xvc3VyZScpKTsgfSB9IH0gfQogICAkb1snd2NfZnJvbSddPWFycmF5KGdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2VtYWlsX2Zyb21fbmFtZScpLGdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2VtYWlsX2Zyb21fYWRkcmVzcycpKTsKICAgJG9bJ2Rldl9wYXN0YXNfenVybmFsYXMnXT1jb3VudCgoYXJyYXkpZ2V0X29wdGlvbigncHNfZGV2X3Bhc3Rhc196dXJuYWxhcycsYXJyYXkoKSkpOwogICAvLyAyLiBTZW5kZXIgQVBJCiAgICRtdD1jbGFzc19leGlzdHMoJ1BldHNob3BfU2VuZGVyX0FkYXB0ZXInKT9QZXRzaG9wX1NlbmRlcl9BZGFwdGVyOjpnZXRfc3RvcmVkX3Rva2VuKCdtYXJrZXRpbmcnKTonJzsgJHR0PWNsYXNzX2V4aXN0cygnUGV0c2hvcF9TZW5kZXJfQWRhcHRlcicpP1BldHNob3BfU2VuZGVyX0FkYXB0ZXI6OmdldF9zdG9yZWRfdG9rZW4oJ3RyYW5zYWN0aW9uYWwnKTonJzsKICAgJG9bJ3NlbmRlcl90b2tlbmFpJ109YXJyYXkoJ21hcmtldGluZyc9PnN0cmxlbigoc3RyaW5nKSRtdCksJ3RyYW5zYWN0aW9uYWwnPT5zdHJsZW4oKHN0cmluZykkdHQpKTsKICAgJFM9ZnVuY3Rpb24oJHBhdGgsJHRvaykgeyAkcj13cF9yZW1vdGVfZ2V0KCdodHRwczovL2FwaS5zZW5kZXIubmV0L3YyJy4kcGF0aCxhcnJheSgndGltZW91dCc9PjMwLCdoZWFkZXJzJz0+YXJyYXkoJ0F1dGhvcml6YXRpb24nPT4nQmVhcmVyICcuJHRvaywnQWNjZXB0Jz0+J2FwcGxpY2F0aW9uL2pzb24nKSkpOyBpZihpc193cF9lcnJvcigkcikpIHJldHVybiBhcnJheSgnZXJyJz0+JHItPmdldF9lcnJvcl9tZXNzYWdlKCkpOyAkYz13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcik7ICRiPWpzb25fZGVjb2RlKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSx0cnVlKTsgcmV0dXJuIGFycmF5KCdjb2RlJz0+JGMsJ2JvZHknPT5pc19hcnJheSgkYik/bWJfc3Vic3RyKGpzb25fZW5jb2RlKCRiLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpLDAsMTIwMCk6bWJfc3Vic3RyKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSwwLDMwMCkpOyB9OwogICBpZigkbXQpeyBmb3JlYWNoKGFycmF5KCcvZG9tYWlucycsJy9zZW5kZXJzJywnL2FjY291bnQnLCcvbWUnLCcvY2FtcGFpZ25zP2xpbWl0PTMnLCcvZ3JvdXBzP2xpbWl0PTMnLCcvc3Vic2NyaWJlcnM/bGltaXQ9MScsJy9zdWJzY3JpYmVycz9saW1pdD0zJnN0YXR1cz1ib3VuY2VkJywnL3N1YnNjcmliZXJzP2xpbWl0PTMmc3RhdHVzPXVuc3Vic2NyaWJlZCcsJy9zdWJzY3JpYmVycz9saW1pdD0zJnN0YXR1cz1zcGFtJywnL3N0YXRpc3RpY3MnLCcvdHJhbnNhY3Rpb25hbC9tZXNzYWdlcz9saW1pdD01JywnL21lc3NhZ2U/bGltaXQ9NScpIGFzICRwYXRoKXsgJG9bJ3NlbmRlciddWyRwYXRoXT0kUygkcGF0aCwkbXQpOyB9IH0KICAgaWYoJHR0KXsgJG9bJ3NlbmRlcl90ciddWycvdHJhbnNhY3Rpb25hbC9tZXNzYWdlcz9saW1pdD01J109JFMoJy90cmFuc2FjdGlvbmFsL21lc3NhZ2VzP2xpbWl0PTUnLCR0dCk7ICRvWydzZW5kZXJfdHInXVsnL2RvbWFpbnMnXT0kUygnL2RvbWFpbnMnLCR0dCk7IH0KICAgLy8gMy4gRE5TOiBTUEYgLyBETUFSQyAvIERLSU0gLyBNWAogICBmb3JlYWNoKGFycmF5KCdwZXRzaG9wLmx0JywnX2RtYXJjLnBldHNob3AubHQnLCdzZW5kZXIuX2RvbWFpbmtleS5wZXRzaG9wLmx0JywnZGVmYXVsdC5fZG9tYWlua2V5LnBldHNob3AubHQnLCdzMS5fZG9tYWlua2V5LnBldHNob3AubHQnLCdtYWlsLnBldHNob3AubHQnLCdkZXYuYXZlc2EubHQnKSBhcyAkZCl7ICRyPUBkbnNfZ2V0X3JlY29yZCgkZCxETlNfVFhUKTsgJG9bJ2Ruc190eHQnXVskZF09JHI/YXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gbWJfc3Vic3RyKCR4Wyd0eHQnXSwwLDMwMCk7fSwkcik6bnVsbDsgfQogICAkb1snZG5zX214J109YXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gJHhbJ3RhcmdldCddLicgKCcuJHhbJ3ByaSddLicpJzt9LChhcnJheSlAZG5zX2dldF9yZWNvcmQoJ3BldHNob3AubHQnLEROU19NWCkpOwogICAvLyA0LiBJxaFlaW5hbnRpcyBJUCArIEROU0JMCiAgICRpcD13cF9yZW1vdGVfcmV0cmlldmVfYm9keSh3cF9yZW1vdGVfZ2V0KCdodHRwczovL2FwaS5pcGlmeS5vcmcnLGFycmF5KCd0aW1lb3V0Jz0+MTUpKSk7ICRvWydpc2VpbmFudGlzX2lwJ109JGlwOwogICAkaXBzPWFycmF5X3VuaXF1ZShhcnJheV9maWx0ZXIoYXJyYXkoJGlwLCc3OS45OC4yOS4yNCcsJzE4NS4zLjIyOS4xMzAnLGdldGhvc3RieW5hbWUoJ3BldHNob3AubHQnKSkpKTsKICAgZm9yZWFjaCgkaXBzIGFzICR4KXsgaWYoIWZpbHRlcl92YXIoJHgsRklMVEVSX1ZBTElEQVRFX0lQLEZJTFRFUl9GTEFHX0lQVjQpKSBjb250aW51ZTsgJHJldj1pbXBsb2RlKCcuJyxhcnJheV9yZXZlcnNlKGV4cGxvZGUoJy4nLCR4KSkpOyBmb3JlYWNoKGFycmF5KCd6ZW4uc3BhbWhhdXMub3JnJywnYmwuc3BhbWNvcC5uZXQnLCdiLmJhcnJhY3VkYWNlbnRyYWwub3JnJywnZG5zYmwuc29yYnMubmV0JywnaG9zdGthcm1hLmp1bmtlbWFpbGZpbHRlci5jb20nLCdzcGFtLmRuc2JsLnNvcmJzLm5ldCcpIGFzICRibCl7ICRoPSRyZXYuJy4nLiRibDsgJGE9Z2V0aG9zdGJ5bmFtZSgkaCk7ICRvWydkbnNibCddWyR4XVskYmxdPSgkYT09PSRoKT8nxaF2YXJ1cyc6JGE7IH0gfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-080428';
const GKEY='ps_e16r';
const PHASES=["R"];
const OUT='analize/e16_run1r.json';
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
