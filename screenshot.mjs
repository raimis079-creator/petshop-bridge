process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI1aiByZWFkLW9ubHk6IHBvIHB1Ymxpa2F2aW1vIOKAlCBkeWTFvmnFsyBsZW50ZWzEl3MgdGVrc3RhcyBiYXrEl3MgaXIgcGFrbyBwdXNsYXB5amUsIGZpbHRyYXMg4oCeUGFrdW90xJdzIGR5ZGlzIiwga2F0YWxvZ28gdmVpZGFpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcyNWonXSkpIHJldHVybjsgJHI9Wyd2Jz0+J1MxNzI1aiddOyBAc2V0X3RpbWVfbGltaXQoMTcwKTsKICAkZ2V0PWZ1bmN0aW9uKCR1KXsgJHg9d3BfcmVtb3RlX2dldCgkdSxbJ3RpbWVvdXQnPT4zNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2Nvb2tpZXMnPT5bJ3BzX2pzJz0+JzEnXV0pOyByZXR1cm4gaXNfd3BfZXJyb3IoJHgpPydFUlIgJy4keC0+Z2V0X2Vycm9yX21lc3NhZ2UoKTp3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkeCk7IH07CiAgJGxlbnQ9ZnVuY3Rpb24oJGgpeyBpZighcHJlZ19tYXRjaCgnIzx0YWJsZVtePl0qcHMtZHlkeltePl0qPi4qPzwvdGFibGU+I3MnLCRoLCRtKSAmJiAhcHJlZ19tYXRjaCgnIzx0YWJsZVtePl0qPig/Oig/ITwvdGFibGU+KS4pKlJpbmt0aXMuKj88L3RhYmxlPiNzJywkaCwkbSkpIHJldHVybiAnTkVSQSc7ICR0PXByZWdfcmVwbGFjZSgnIzwodHIpW14+XSo+IycsIlxuIiwkbVswXSk7ICR0PXByZWdfcmVwbGFjZSgnIzxbXj5dKz4jJywnICcsJHQpOyByZXR1cm4gYXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihhcnJheV9tYXAoZnVuY3Rpb24oJGwpe3JldHVybiB0cmltKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJywkbCkpO30sZXhwbG9kZSgiXG4iLGh0bWxfZW50aXR5X2RlY29kZSgkdCkpKSkpOyB9OwogICRjaXBzPWZ1bmN0aW9uKCRoLCRwaWQpeyBpZihwcmVnX21hdGNoX2FsbCgnI2RhdGEtcHJvZHVjdF9pZD0iJy4kcGlkLiciLnswLDUwfSNzJywkaCwkbSkpIHJldHVybiBjb3VudCgkbVswXSk7IHJldHVybiAwOyB9OwogIHRyeXsKICAgIGZvcmVhY2goWzE2NDYwLDM2MzM0LDE2NTU1LDE2NTkxXSBhcyAkcGlkKXsgJGg9JGdldChnZXRfcGVybWFsaW5rKCRwaWQpLic/cHNfbmM9Jy50aW1lKCkpOyAkclsncHNsJ11bJHBpZF09WydwYXYnPT5nZXRfdGhlX3RpdGxlKCRwaWQpLCdsZW50ZWxlJz0+JGxlbnQoJGgpXTsgfQogICAgLy8gZmlsdHJhczogc2F1c2FzIG1haXN0YXMga2F0xJdtcywgcGFrdW90xJdzIGR5ZGlzIDIga2cKICAgICR0PWdldF90ZXJtX2J5KCdzbHVnJywnMi1rZycsJ3BhX3Bha3VvdGVzX2R5ZGlzJyk7ICRyWyd0ZXJtaW5hc18ya2cnXT0kdD8kdC0+c2x1ZzpudWxsOwogICAgJGNhdHM9d3BfZ2V0X3Bvc3RfdGVybXMoMTY0NjAsJ3Byb2R1Y3RfY2F0Jyk7ICRjbD1udWxsOyBmb3JlYWNoKCRjYXRzIGFzICRjKXsgaWYoc3RyaXBvcygkYy0+bmFtZSwnU2F1c2FzJykhPT1mYWxzZSl7JGNsPWdldF90ZXJtX2xpbmsoJGMpO30gfQogICAgaWYoJGNsICYmICR0KXsgJHU9YWRkX3F1ZXJ5X2FyZyhbJ2ZpbHRlcl9wYWt1b3Rlc19keWRpcyc9PiR0LT5zbHVnLCdwc19uYyc9PnRpbWUoKV0sJGNsKTsgJGg9JGdldCgkdSk7IHByZWdfbWF0Y2hfYWxsKCcjPHAgY2xhc3M9Im5hbWUgcHJvZHVjdC10aXRsZVteIl0qIj48YVtePl0qPihbXjxdKyk8L2E+IycsJGgsJG0pOyAkclsnZmlsdHJhc191cmwnXT0kdTsgJHJbJ2ZpbHRyYXNfMmtnX2tvcnRlbGVzJ109YXJyYXlfc2xpY2UoJG1bMV0sMCw0MCk7ICRyWydmaWx0cmFzXzJ2bnQnXT1jb3VudChhcnJheV9maWx0ZXIoJG1bMV0sZnVuY3Rpb24oJHgpe3JldHVybiBzdHJpcG9zKCR4LCcyIHZudC4nKSE9PWZhbHNlO30pKTsgfQogICAgaWYoJGNsKXsgJGg9JGdldChhZGRfcXVlcnlfYXJnKCdwc19uYycsdGltZSgpLCRjbCkpOyBwcmVnX21hdGNoX2FsbCgnIzxwIGNsYXNzPSJuYW1lIHByb2R1Y3QtdGl0bGVbXiJdKiI+PGFbXj5dKj4oW148XSspPC9hPiMnLCRoLCRtKTsgJHJbJ2thdGVnb3JpamFfMnZudF92ZWlkYWknXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKCRtWzFdLGZ1bmN0aW9uKCR4KXtyZXR1cm4gc3RyaXBvcygkeCwnMiB2bnQuJykhPT1mYWxzZTt9KSk7ICRyWydrYXRlZ29yaWphX2tvcnRlbGl1J109Y291bnQoJG1bMV0pOyB9CiAgICAvLyBRdWF0dHJvIGdhbWludG9qbyBwdXNsYXBpcwogICAgJGI9d3BfZ2V0X3Bvc3RfdGVybXMoMTY1NTUsJ3Byb2R1Y3RfYnJhbmQnKTsgaWYoJGIpeyAkaD0kZ2V0KGFkZF9xdWVyeV9hcmcoJ3BzX25jJyx0aW1lKCksZ2V0X3Rlcm1fbGluaygkYlswXSkpKTsgcHJlZ19tYXRjaF9hbGwoJyM8cCBjbGFzcz0ibmFtZSBwcm9kdWN0LXRpdGxlW14iXSoiPjxhW14+XSo+KFtePF0rKTwvYT4jJywkaCwkbSk7ICRyWydxdWF0dHJvX2tvcnRlbGl1J109Y291bnQoJG1bMV0pOyAkclsncXVhdHRyb18ydm50X3ZlaWRhaSddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoJG1bMV0sZnVuY3Rpb24oJHgpe3JldHVybiBzdHJpcG9zKCR4LCcyIHZudC4nKSE9PWZhbHNlO30pKTsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-150828';
const GKEY='ps_s1725j';
const PHASES=["1"];
const OUT='analize/s1725_j.json';
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
