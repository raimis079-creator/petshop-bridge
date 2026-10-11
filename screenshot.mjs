process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzY3ZCBha2Npam9zIHByZWtlcyAoYnVzZW5hLCB1enNha3ltYWkpICsgYXRzYXVrdGkgMTM1OS0xMzYxLDEzNjQgKHByaWV6YXN0aXMpIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc2N2QnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDEyMCk7ICRyPVsndic9PidTMTc2N2QnXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogIHRyeXsKICAkQT1bMTQ2NzUsMTQ2NzEsMTQ2NDIsMTQ2MzAsMTQ2MzQsMTQ2MzgsMzY0NzksMzY0NzddOwogIGZvcmVhY2goJEEgYXMgJHBpZCl7ICRwPXdjX2dldF9wcm9kdWN0KCRwaWQpOyAkclsnYWtjaWphJ11bJHBpZF09W21iX3N1YnN0cigkcC0+Z2V0X25hbWUoKSwwLDQ1KSwkcC0+Z2V0X3JlZ3VsYXJfcHJpY2UoJ2VkaXQnKSwkcC0+Z2V0X3NhbGVfcHJpY2UoJ2VkaXQnKSwkcC0+Z2V0X3ByaWNlKCksJHAtPmlzX29uX3NhbGUoKT8xOjAsZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfemJfY29zdCcsdHJ1ZSksZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfZHBfbnVvbGFpZGFfcHJvYycsdHJ1ZSksJHAtPmdldF9zdG9ja19zdGF0dXMoKV07IH0KICAkaW49aW1wbG9kZSgnLCcsYXJyYXlfc2xpY2UoJEEsMCw2KSk7CiAgJHJbJ2FrY2lqb3NfdXpzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgby5pZCwgby5zdGF0dXMsIG8uZGF0ZV9jcmVhdGVkX2dtdCwgaW0ubWV0YV92YWx1ZSBwaWQsIHEubWV0YV92YWx1ZSBxdHksIHQubWV0YV92YWx1ZSBzdW1hIEZST00geyRQfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1zIGkgSk9JTiB7JFB9d2Nfb3JkZXJzIG8gT04gby5pZD1pLm9yZGVyX2lkIEFORCBvLnR5cGU9J3Nob3Bfb3JkZXInIEFORCBvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTEwLTEwIDE5OjQ0OjAwJyBKT0lOIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtbWV0YSBpbSBPTiBpbS5vcmRlcl9pdGVtX2lkPWkub3JkZXJfaXRlbV9pZCBBTkQgaW0ubWV0YV9rZXk9J19wcm9kdWN0X2lkJyBBTkQgaW0ubWV0YV92YWx1ZSBJTiAoJGluKSBKT0lOIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtbWV0YSBxIE9OIHEub3JkZXJfaXRlbV9pZD1pLm9yZGVyX2l0ZW1faWQgQU5EIHEubWV0YV9rZXk9J19xdHknIEpPSU4geyRQfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIHQgT04gdC5vcmRlcl9pdGVtX2lkPWkub3JkZXJfaXRlbV9pZCBBTkQgdC5tZXRhX2tleT0nX2xpbmVfdG90YWwnIixBUlJBWV9BKTsKICBmb3JlYWNoKFsxMzU5LDEzNjAsMTM2MSwxMzY0LDEzNjhdIGFzICRudW0peyAkaWRzPXdjX2dldF9vcmRlcnMoWydsaW1pdCc9PjEsJ3JldHVybic9PidpZHMnLCdtZXRhX2tleSc9Pidfb3JkZXJfbnVtYmVyJywnbWV0YV92YWx1ZSc9PihzdHJpbmcpJG51bV0pOyAkbz0kaWRzP3djX2dldF9vcmRlcigkaWRzWzBdKTpudWxsOyBpZighJG8peyAkb289d2NfZ2V0X29yZGVycyhbJ2xpbWl0Jz0+NjAsJ3R5cGUnPT4nc2hvcF9vcmRlcicsJ3N0YXR1cyc9PidhbnknLCdkYXRlX2NyZWF0ZWQnPT4nPj0nLnN0cnRvdGltZSgnMjAyNi0xMC0xMCAxMjowMDowMCBVVEMnKV0pOyBmb3JlYWNoKCRvbyBhcyAkeCkgaWYoJHgtPmdldF9vcmRlcl9udW1iZXIoKT09JG51bSkgJG89JHg7IH0KICAgIGlmKCEkbyl7ICRyWyd1enMnXVskbnVtXT0nbmVyYXN0YSc7IGNvbnRpbnVlOyB9CiAgICAkbnQ9W107IGZvcmVhY2god2NfZ2V0X29yZGVyX25vdGVzKFsnb3JkZXJfaWQnPT4kby0+Z2V0X2lkKCksJ2xpbWl0Jz0+Nl0pIGFzICRuKSAkbnRbXT0kbi0+ZGF0ZV9jcmVhdGVkLT5kYXRlKCdIOmknKS4nICcubWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCRuLT5jb250ZW50KSwwLDE0MCk7CiAgICAkclsndXpzJ11bJG51bV09WydzdGF0dXMnPT4kby0+Z2V0X3N0YXR1cygpLCdzdW1hJz0+JG8tPmdldF90b3RhbCgpLCdtb2tlamltYXMnPT4kby0+Z2V0X3BheW1lbnRfbWV0aG9kX3RpdGxlKCksJ2VsX2hhc2hfa2l0aSc9PmltcGxvZGUoJywnLGFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuICR4LT5nZXRfb3JkZXJfbnVtYmVyKCkuJzonLnN1YnN0cihtZDUoc3RydG9sb3dlcigkeC0+Z2V0X2JpbGxpbmdfZW1haWwoKSkpLDAsNikuJzonLiR4LT5nZXRfc3RhdHVzKCk7fSx3Y19nZXRfb3JkZXJzKFsnbGltaXQnPT42MCwndHlwZSc9PidzaG9wX29yZGVyJywnc3RhdHVzJz0+J2FueScsJ2RhdGVfY3JlYXRlZCc9Pic+PScuc3RydG90aW1lKCcyMDI2LTEwLTEwIDEyOjAwOjAwIFVUQycpXSkpKSwnZWxfaGFzaCc9PnN1YnN0cihtZDUoc3RydG9sb3dlcigkby0+Z2V0X2JpbGxpbmdfZW1haWwoKSkpLDAsNiksJ3ByZWtpdSc9PiRvLT5nZXRfaXRlbV9jb3VudCgpLCdwYXN0YWJvcyc9PiRudF07IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9KTsK';
const VER='dep-083739';
const GKEY='ps_s1767d';
const PHASES=["1"];
const OUT='out/s1767d2.json';
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
