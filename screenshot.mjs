process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODcwZyBLYXRhbG9nYXMgdmlzb3Nfa3J1dm9qZSBzdGViZWppbWFzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTg5OGcnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDIwMCk7IEBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCc1MTJNJyk7ICRyPVsndic9PidTMTg5OGcnXTsgJFQwPW1pY3JvdGltZSh0cnVlKTsKICAkdHo9bmV3IERhdGVUaW1lWm9uZSgnRXVyb3BlL1ZpbG5pdXMnKTsgJG5vdz1uZXcgRGF0ZVRpbWUoJ25vdycsJHR6KTsgJG51bz0oY2xvbmUgJG5vdyktPm1vZGlmeSgnLTI0IGhvdXJzJyk7ICRyWydsYW5nYXMnXT1bJG51by0+Zm9ybWF0KCdtLWQgSDppJyksJG5vdy0+Zm9ybWF0KCdtLWQgSDppJyldOwogICRkb209ZGlybmFtZShBQlNQQVRIKTsgJGxvZ3M9JGRvbS4nL2xvZ3MnOyAkclsnZmFpbGFpJ109W107CiAgJGZzPVtdOyBmb3JlYWNoKGdsb2IoJGxvZ3MuJy8qJyk/OltdIGFzICRmeCl7ICRiPWJhc2VuYW1lKCRmeCk7ICRyWydmYWlsYWknXVtdPVskYixyb3VuZChmaWxlc2l6ZSgkZngpLzEwNDg1NzYsMSkuJ01CJywobmV3IERhdGVUaW1lKCdAJy5maWxlbXRpbWUoJGZ4KSkpLT5zZXRUaW1lem9uZSgkdHopLT5mb3JtYXQoJ20tZCBIOmknKV07IGlmKHByZWdfbWF0Y2goJy9lcnJvci9pJywkYikpIGNvbnRpbnVlOyBpZihmaWxlbXRpbWUoJGZ4KTwkbnVvLT5nZXRUaW1lc3RhbXAoKSkgY29udGludWU7IGlmKHByZWdfbWF0Y2goJy9cLih6aXApJC8nLCRiKSkgY29udGludWU7ICRmc1tdPSRmeDsgfQogICRNPVsnSmFuJz0+MSwnRmViJz0+MiwnTWFyJz0+MywnQXByJz0+NCwnTWF5Jz0+NSwnSnVuJz0+NiwnSnVsJz0+NywnQXVnJz0+OCwnU2VwJz0+OSwnT2N0Jz0+MTAsJ05vdic9PjExLCdEZWMnPT4xMl07CiAgJGhpdHM9W107ICRzZWVuPVtdOyAkclsnc2thaXR5dGEnXT1bXTsKICBmb3JlYWNoKCRmcyBhcyAkZngpeyAkZ3o9cHJlZ19tYXRjaCgnL1wuZ3ovJywkZngpOyAkaD0kZ3o/Z3pvcGVuKCRmeCwncmInKTpmb3BlbigkZngsJ3InKTsgaWYoISRoKSBjb250aW51ZTsgJG49MDsKICAgIHdoaWxlKCgkbG49JGd6P2d6Z2V0cygkaCwxNjM4NCk6ZmdldHMoJGgsMTYzODQpKSE9PWZhbHNlKXsgJG4rKzsgaWYoc3RycG9zKCRsbiwncHMta2F0YWxvZ2FzJyk9PT1mYWxzZSkgY29udGludWU7CiAgICAgIGlmKCFwcmVnX21hdGNoKCcjXihcUyspIFxTKyBcUysgXFsoXGRcZCkvKFx3ezN9KS8oXGR7NH0pOihcZFxkOlxkXGQ6XGRcZCkgKFsrLV1cZHs0fSlcXSAiKFxTKykgKFxTKylbXiJdKiIgKFxkezN9KSAoXFMrKSMnLCRsbiwkbSkpIGNvbnRpbnVlOwogICAgICAkZHQ9RGF0ZVRpbWU6OmNyZWF0ZUZyb21Gb3JtYXQoJ2QvTS9ZIEg6aTpzIE8nLCRtWzJdLicvJy4kbVszXS4nLycuJG1bNF0uJyAnLiRtWzVdLicgJy4kbVs2XSk7IGlmKCEkZHQpIGNvbnRpbnVlOyAkZHQtPnNldFRpbWV6b25lKCR0eik7IGlmKCRkdDwkbnVvKSBjb250aW51ZTsKICAgICAgJGs9bWQ1KCRsbik7IGlmKGlzc2V0KCRzZWVuWyRrXSkpIGNvbnRpbnVlOyAkc2Vlblska109MTsKICAgICAgJHU9JG1bOF07ICRxcz1bXTsgcGFyc2Vfc3RyKChzdHJpbmcpcGFyc2VfdXJsKCR1LFBIUF9VUkxfUVVFUlkpLCRxcyk7CiAgICAgICRpcD0kbVsxXTsgJG5ldD1zdHJwb3MoJGlwLCc6JykhPT1mYWxzZT9pbXBsb2RlKCc6JyxhcnJheV9zbGljZShleHBsb2RlKCc6JywkaXApLDAsMykpLic6Oi80OCc6cHJlZ19yZXBsYWNlKCcjXC5cZCskIycsJy4wLzI0JywkaXApOwogICAgICAkaGl0c1tdPVsndCc9PiRkdC0+Zm9ybWF0KCdtLWQgSDppOnMnKSwndHMnPT4kZHQtPmdldFRpbWVzdGFtcCgpLCdzdCc9PiRtWzldLCd2aWV3Jz0+JHFzWyd2aWV3J10/PycnLCdrcnV2YSc9PiRxc1sna3J1dmEnXT8/JycsJ3EnPT5pc3NldCgkcXNbJ3EnXSk/bWJfc3Vic3RyKCRxc1sncSddLDAsNDApOicnLCduZXQnPT4kbmV0LCdtJz0+JG1bN11dOwogICAgICBpZihtaWNyb3RpbWUodHJ1ZSktJFQwPjE1MCl7ICRyWydudXRyYXVrdGEnXT1iYXNlbmFtZSgkZngpOyBicmVhayAyOyB9IH0KICAgICRnej9nemNsb3NlKCRoKTpmY2xvc2UoJGgpOyAkclsnc2thaXR5dGEnXVtdPVtiYXNlbmFtZSgkZngpLCRuXTsgfQogICRyWyd2aXNvJ109Y291bnQoJGhpdHMpOyAkc3Q9W107ICR2dz1bXTsgZm9yZWFjaCgkaGl0cyBhcyAkeCl7ICRzdFskeFsnc3QnXV09KCRzdFskeFsnc3QnXV0/PzApKzE7ICR2az0oJHhbJ3ZpZXcnXT86Jy0nKS4nfCcuJHhbJ3N0J107ICR2d1skdmtdPSgkdndbJHZrXT8/MCkrMTsgfSAkclsnc3RhdHVzYWknXT0kc3Q7ICRyWyd2aWV3X3N0YXR1c2FpJ109JHZ3OwogICRyWydrcnV2YV91emtsJ109YXJyYXlfdmFsdWVzKGFycmF5X21hcChmbigkeCk9PmFycmF5X2RpZmZfa2V5KCR4LFsndHMnPT4xXSksYXJyYXlfZmlsdGVyKCRoaXRzLGZuKCR4KT0+JHhbJ3ZpZXcnXT09PSd2aXNvc19rcnV2b2plJ3x8JHhbJ2tydXZhJ10hPT0nJykpKTsKICAkZTUwMD1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKCRoaXRzLGZuKCR4KT0+JHhbJ3N0J109PT0nNTAwJykpOwogICRyWydlNTAwJ109YXJyYXlfbWFwKGZuKCR4KT0+YXJyYXlfZGlmZl9rZXkoJHgsWyd0cyc9PjFdKSwkZTUwMCk7CiAgLy8gUEhQIEZhdGFsIMKxNSBzCiAgJGxmPWluaV9nZXQoJ2Vycm9yX2xvZycpOyBpZighJGxmfHwhaXNfZmlsZSgkbGYpKSAkbGY9JGRvbS4nL2xvZ3MvcGhwX2Vycm9yLmxvZyc7ICRyWydwaHBfbG9nJ109YmFzZW5hbWUoJGxmKTsgJGZhdD1bXTsKICBpZihpc19maWxlKCRsZikpeyAkc3o9ZmlsZXNpemUoJGxmKTsgJGZoPWZvcGVuKCRsZiwncicpOyBmc2VlaygkZmgsbWF4KDAsJHN6LTMwMDAwMDApKTsgJHR4PWZyZWFkKCRmaCwzMDAwMDAwKTsgZmNsb3NlKCRmaCk7CiAgICBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkdHgpIGFzICRsbil7IGlmKHN0cmlwb3MoJGxuLCdGYXRhbCcpPT09ZmFsc2UpIGNvbnRpbnVlOyBpZighcHJlZ19tYXRjaCgnI15cWyhcZFxkLVx3ezN9LVxkezR9IFxkXGQ6XGRcZDpcZFxkKSAoW15cXV0rKVxdIycsJGxuLCRtKSkgY29udGludWU7ICRkdD1EYXRlVGltZTo6Y3JlYXRlRnJvbUZvcm1hdCgnZC1NLVkgSDppOnMnLCRtWzFdLG5ldyBEYXRlVGltZVpvbmUoJG1bMl09PSdVVEMnPydVVEMnOidFdXJvcGUvVmlsbml1cycpKTsgaWYoISRkdHx8JGR0PCRudW8pIGNvbnRpbnVlOyAkZHQtPnNldFRpbWV6b25lKCR0eik7ICRmYXRbXT1bJ3RzJz0+JGR0LT5nZXRUaW1lc3RhbXAoKSwndCc9PiRkdC0+Zm9ybWF0KCdtLWQgSDppOnMnKSwnbCc9Pm1iX3N1YnN0cigkbG4sMCwzMDApXTsgfSB9CiAgJHJbJ2ZhdGFsX3BhcmFfbiddPWNvdW50KCRmYXQpOyAkclsnZmF0YWxfcGFyYSddPWFycmF5X3NsaWNlKGFycmF5X21hcChmbigkeCk9PiR4Wyd0J10uJyAnLm1iX3N1YnN0cigkeFsnbCddLDMwLDIwMCksJGZhdCksLTEwKTsKICAkclsnZTUwMF9mYXRhbCddPVtdOyBmb3JlYWNoKCRlNTAwIGFzICR4KXsgJG10PVtdOyBmb3JlYWNoKCRmYXQgYXMgJGYpeyBpZihhYnMoJGZbJ3RzJ10tJHhbJ3RzJ10pPD01KSAkbXRbXT0kZlsnbCddOyB9ICRyWydlNTAwX2ZhdGFsJ11bXT1bJHhbJ3QnXSwkeFsndmlldyddLCR4WydxJ10sJG10XTsgfQogICRyWyd0cnVrbWVfcyddPXJvdW5kKG1pY3JvdGltZSh0cnVlKS0kVDAsMSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7IH0pOwo=';
const VER='dep-074548';
const GKEY='ps_s1898g';
const PHASES=["1"];
const OUT='analize/rytas1119_g.json';
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
