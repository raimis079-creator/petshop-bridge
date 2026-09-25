process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzIwayDigJQga3JlcMWhZWxpbyBwYcW+YWRvIGVrcmFubyBudW90cmF1a29zIChicm93c2VyPTEpOiB2aWVuYXMgxaFhbHRpbmlzIOKGkiBtacWhcnVzICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcyMGsnXSkpIHJldHVybjsgJGg9aG9tZV91cmwoKTsKICAkZXY9JygoKT0+e2NvbnN0IGU9Wy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIi5wcy1wYXphZGFzLWtyZXBzZWxpcyIpXS5tYXAoeD0+eC5jbGFzc05hbWUrIiB8ICIreC50ZXh0Q29udGVudC50cmltKCkpO2NvbnN0IGxwPVsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCIjc2hpcHBpbmdfbWV0aG9kIGxpLCAud29vY29tbWVyY2Utc2hpcHBpbmctbWV0aG9kcyBsaSIpXS5tYXAoeD0+eC50ZXh0Q29udGVudC50cmltKCkucmVwbGFjZSgvXHMrL2csIiAiKS5zbGljZSgwLDYwKSk7cmV0dXJuIHtwYXphZGFzOmUsc2l1bnRpbWFzOmxwfX0pKCknOwogICRyPVsndic9PidTMTcyMGsnLCdzaG90cyc9PlsKICAgIFsnbic9PidzMTcyMGtfMCcsJ3UnPT4kaC4nL3Byb2R1Y3QvZXhjbHVzaW9uLWh5cG9hbGxlcmdlbmljLXNhdXNhcy1zdW51LW1haXN0YXMtc3Uta2lhdWxpZW5hLWlyLXppcm5lbGlhaXMtbS1sLTEyLWtnLycsJ3cnPT4xMjgwLCdoJz0+OTAwLCdldmFsJz0+JygoKT0+e2NvbnN0IGE9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiLnBzLXBhemFkYXMiKTtjb25zdCBrPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIi5wcy1rZyIpO3JldHVybiB7cGF6YWRhczphP2EudGV4dENvbnRlbnQudHJpbSgpOm51bGwsa2c6az9rLnRleHRDb250ZW50Om51bGx9fSkoKSddLAogICAgWyduJz0+J3MxNzIwa18xJywndSc9PiRoLicvP2FkZC10by1jYXJ0PTE4NTYwJywndyc9PjEyODAsJ2gnPT45MDBdLAogICAgWyduJz0+J3MxNzIwa19rcmVwc2VsaXMxJywndSc9PiRoLicva3JlcHNlbGlzLycsJ3cnPT4xMjgwLCdoJz0+OTAwLCdldmFsJz0+JGV2XSwKICAgIFsnbic9PidzMTcyMGtfYXBtb2sxJywndSc9PiRoLicva2FzYS8nLCd3Jz0+MTI4MCwnaCc9PjExMDAsJ2V2YWwnPT4kZXZdLAogICAgWyduJz0+J3MxNzIwa18yJywndSc9PiRoLicvP2FkZC10by1jYXJ0PTE0ODA0Jywndyc9PjEyODAsJ2gnPT45MDBdLAogICAgWyduJz0+J3MxNzIwa19rcmVwc2VsaXMyJywndSc9PiRoLicva3JlcHNlbGlzLycsJ3cnPT4xMjgwLCdoJz0+OTAwLCdldmFsJz0+JGV2XSwKICAgIFsnbic9PidzMTcyMGtfYXBtb2syJywndSc9PiRoLicva2FzYS8nLCd3Jz0+MTI4MCwnaCc9PjExMDAsJ2V2YWwnPT4kZXZdLAogICAgWyduJz0+J3MxNzIwa19taW5pJywndSc9PiRoLicvJywndyc9PjEyODAsJ2gnPT44MDAsJ2V2YWwnPT4nKCgpPT57Y29uc3QgbT1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCIud2lkZ2V0X3Nob3BwaW5nX2NhcnRfY29udGVudCwgLmNhcnQtcG9wdXAtaW5uZXIsIC5oZWFkZXItY2FydC1saW5rICsgLm5hdi1kcm9wZG93biIpO3JldHVybiBtP20uaW5uZXJUZXh0LnJlcGxhY2UoL1xzKy9nLCIgIikuc2xpY2UoMCw0MDApOiJuZXJhIn0pKCknXSwKICAgIFsnbic9PidzMTcyMGtfa3JlcHNlbGlzX20nLCd1Jz0+JGguJy9rcmVwc2VsaXMvJywndyc9PjM5MCwnaCc9PjkwMCwnZnVsbCc9PjFdLAogIF1dOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-193325';
const GKEY='ps_s1720k';
const PHASES=["1"];
const OUT='analize/s1720_k.json';
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
