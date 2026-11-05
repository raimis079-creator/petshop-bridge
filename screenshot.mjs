process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI5cHogUHJhZ21hIDIwMjYtMTAgc2l1bnRpbWFzIGRhbGltaXM6IDEgZHJ5LCAyIHNpdXN0aSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MjlweiddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMjgwKTsgQGluaV9zZXQoJ21lbW9yeV9saW1pdCcsJzEwMjRNJyk7ICRmPShzdHJpbmcpJF9HRVRbJ3BzX3MxODI5cHonXTsgJHI9Wyd2Jz0+J1MxODI5cHonLCdmJz0+JGZdOwogIHRyeXsKICAkWT0yMDI2OyAkTT0xMDsgJHBlcj0nMjAyNi0xMCc7ICRPUklHPTE5NDsgJExJTT03KjEwNDg1NzY7CiAgJGtub3duPShhcnJheSlnZXRfb3B0aW9uKCdwZXRzaG9wX3ByYWdtYV9rbm93bl9lbWFpbHMnLFtdKTsgJHJbJ2tub3duX24nXT1jb3VudCgka25vd24pOwogICRvcmRlcnM9d2NfZ2V0X29yZGVycyhbJ3N0YXR1cyc9PlsnY29tcGxldGVkJ10sJ2RhdGVfY3JlYXRlZCc9PnN0cnRvdGltZSgnMjAyNi0xMC0wMSAwMDowMDowMCcpLicuLi4nLnN0cnRvdGltZSgnMjAyNi0xMC0zMSAyMzo1OTo1OScpLCdsaW1pdCc9Pi0xLCdvcmRlcmJ5Jz0+J2RhdGUnLCdvcmRlcic9PidBU0MnLCd0eXBlJz0+J3Nob3Bfb3JkZXInXSk7CiAgJHZhbGlkPVtdOyBmb3JlYWNoKCRvcmRlcnMgYXMgJG8peyBpZigkby0+Z2V0X21ldGEoJ19wZXRzaG9wX2ludm9pY2VfZG9jdW1lbnRfdHlwZScpPT09J2ludm9pY2UnICYmICRvLT5nZXRfbWV0YSgnX3BldHNob3BfYXZwbl9udW1iZXInKSkgJHZhbGlkW109JG87IH0gJHJbJ3ZhbGlkJ109Y291bnQoJHZhbGlkKTsKICAkYmFzZT1hcnJheV9zbGljZSgka25vd24sMCwkT1JJRyk7ICRhZGRlZD1hcnJheV9zbGljZSgka25vd24sJE9SSUcpOwogICRuZXdFPVtdOyAkcGRmcz1bXTsgJG5ycz1bXTsgJG5vcGRmPVtdOwogIGZvcmVhY2goJHZhbGlkIGFzICRvKXsgJGU9c3RydG9sb3dlcih0cmltKCRvLT5nZXRfYmlsbGluZ19lbWFpbCgpKSk7IGlmKCFpbl9hcnJheSgkZSwkYmFzZSx0cnVlKSl7ICRwPSRvLT5nZXRfbWV0YSgnX3BldHNob3BfY29tcGxldGVkX3BkZicpID86ICRvLT5nZXRfbWV0YSgnX3BldHNob3Bfb3JkZXJfcGRmJyk7IGlmKCRwJiZmaWxlX2V4aXN0cygkcCkpICRwZGZzW109JHA7IGVsc2UgJG5vcGRmW109JG8tPmdldF9vcmRlcl9udW1iZXIoKTsgJG5ld0VbXT0kZTsgJG5yc1tdPSRvLT5nZXRfbWV0YSgnX3BldHNob3BfYXZwbl9udW1iZXInKS4nICgnLiRvLT5nZXRfYmlsbGluZ19maXJzdF9uYW1lKCkuJyAnLiRvLT5nZXRfYmlsbGluZ19sYXN0X25hbWUoKS4nKSc7IH0gfQogICRyWyduYXVqaSddPWNvdW50KCRuZXdFKTsgJHJbJ3BkZl9uJ109Y291bnQoJHBkZnMpOyAkclsnYmVfcGRmJ109JG5vcGRmOyAkclsnYWRkZWRfbiddPWNvdW50KCRhZGRlZCk7ICRyWydhZGRlZF9zdXRhbXBhJ109Y291bnQoYXJyYXlfZGlmZihhcnJheV91bmlxdWUoJG5ld0UpLCRhZGRlZCkpPT09MCAmJiBjb3VudChhcnJheV9kaWZmKCRhZGRlZCwkbmV3RSkpPT09MDsKICAkdG1wPXN5c19nZXRfdGVtcF9kaXIoKTsgJHR4PVskdG1wLiIvaW1vbmVzXyRwZXIudHh0Ij0+cGV0c2hvcF9wcmFnbWFfZ2VuZXJhdGVfaW1vbmVzKCR2YWxpZCksJHRtcC4iL3BhcmRhdmltYWlfJHBlci50eHQiPT5wZXRzaG9wX3ByYWdtYV9nZW5lcmF0ZV9wYXJkYXZpbWFpKCR2YWxpZCksJHRtcC4iL3BhcmRhdmltYWlfc3VtXyRwZXIudHh0Ij0+cGV0c2hvcF9wcmFnbWFfZ2VuZXJhdGVfcGFyZGF2aW1haV9zdW0oJHZhbGlkKV07CiAgZm9yZWFjaCgkdHggYXMgJHA9PiRjKXsgZmlsZV9wdXRfY29udGVudHMoJHAsJGMpOyB9ICR0eHQ9YXJyYXlfa2V5cygkdHgpOyAkclsndHh0X2tiJ109YXJyYXlfbWFwKGZuKCRwKT0+cm91bmQoZmlsZXNpemUoJHApLzEwMjQpLCR0eHQpOwogICRwYXJ0cz1bXTsgJGN1cj0kdHh0OyAkc3o9YXJyYXlfc3VtKGFycmF5X21hcCgnZmlsZXNpemUnLCR0eHQpKTsgZm9yZWFjaCgkcGRmcyBhcyAkcCl7ICRzPWZpbGVzaXplKCRwKTsgaWYoJHN6KyRzPiRMSU0gJiYgY291bnQoJGN1cikpeyAkcGFydHNbXT0kY3VyOyAkY3VyPVtdOyAkc3o9MDsgfSAkY3VyW109JHA7ICRzeis9JHM7IH0gaWYoJGN1cikgJHBhcnRzW109JGN1cjsKICAkclsncGRmX21iJ109cm91bmQoYXJyYXlfc3VtKGFycmF5X21hcCgnZmlsZXNpemUnLCRwZGZzKSkvMTA0ODU3NiwxKTsgJHJbJ2RhbHlzJ109YXJyYXlfbWFwKGZuKCRhKT0+W2NvdW50KCRhKSxyb3VuZChhcnJheV9zdW0oYXJyYXlfbWFwKCdmaWxlc2l6ZScsJGEpKS8xMDQ4NTc2LDEpXSwkcGFydHMpOwogIGlmKCRmPT09JzInKXsKICAgIGlmKCEkclsnYWRkZWRfc3V0YW1wYSddKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCdrbm93bl9lbWFpbHMgbmVhdGl0aW5rYSDigJMgbmVzaXVuxI1pdScpOwogICAgdXBkYXRlX29wdGlvbigncGV0c2hvcF9wcmFnbWFfa25vd25fZW1haWxzJywkYmFzZSk7ICRyWydrbm93bl9hdHN0YXR5dGEnXT1jb3VudCgkYmFzZSk7CiAgICAkTj1jb3VudCgkcGFydHMpOyAkb2s9MDsgJGhkPVsnQ29udGVudC1UeXBlOiB0ZXh0L3BsYWluOyBjaGFyc2V0PVVURi04J107CiAgICBhZGRfYWN0aW9uKCd3cF9tYWlsX2ZhaWxlZCcsZnVuY3Rpb24oJGUpIHVzZSAoJiRyKXsgJHJbJ21haWxfZmFpbCddW109JGUtPmdldF9lcnJvcl9tZXNzYWdlKCk7IH0pOwogICAgZm9yZWFjaCgkcGFydHMgYXMgJGs9PiRhdHQpeyAkaT0kaysxOwogICAgICAkYm9keT0iTGFiYSBkaWVuYSxcblxuIjsKICAgICAgaWYoJGk9PT0xKXsgJGJvZHkuPSJQcmlzZWd0aSAkcGVyIG1lbmVzaW8gcGFyZGF2aW3FsyBmYWlsYWkgUHJhZ21hIGltcG9ydHVpLlxuXG5OQVVKSSBLTElFTlRBSSAoIi5jb3VudCgkbnJzKS4iIHNhc2thaXRvcykgLSBQREYgcHJpc2VndG9zICIuJE4uIiBsYWlza3Vvc2UgKGRlbCBkeWR6aW8gcGFkYWxpbnRhKTpcbiI7IGZvcmVhY2goJG5ycyBhcyAkbnIpICRib2R5Lj0iICAtICRuclxuIjsgJGJvZHkuPSJcblNpb3Mgc2Fza2FpdG9zIGdhbGkgcmVpa2V0aSBhdHNraXJvIGltcG9ydG8uXG5cbiI7IH0KICAgICAgZWxzZSB7ICRib2R5Lj0iJHBlciBuYXVqxbMga2xpZW50xbMgUERGIHPEhXNrYWl0b3MsICRpIGRhbGlzIGnFoSAkTiAoIi5jb3VudCgkYXR0KS4iIFBERikuXG5cbiI7IH0KICAgICAgJGJvZHkuPSJQZXRzaG9wLmx0IHNpc3RlbWEiOwogICAgICAkc3Viaj0iUGV0c2hvcC5sdCBwYXJkYXZpbWFpICRwZXIgKCRpLyROKSI7CiAgICAgICRyZXM9d3BfbWFpbCgnaW5mb0BhdWRhYy5sdCcsJHN1YmosJGJvZHksJGhkLCRhdHQpOyAkclsnc2l1c3RhJ11bXT1bJHN1YmosY291bnQoJGF0dCksJHJlc107IGlmKCRyZXMpICRvaysrOyB9CiAgICB3cF9tYWlsKCd0ZXJyYUBwZXRzaG9wLmx0JywnW1BSQUdNQV0gUGV0c2hvcC5sdCBwYXJkYXZpbWFpICcuJHBlci4nIC0gJy4oJG9rPT09JE4/J09LJzonS0xBSURBJykuIiAoJG9rLyROIGxhaXNrYWkpIiwiU2l1bnRpbWFzIGkgaW5mb0BhdWRhYy5sdCBkYWxpbWlzIChTMTgyOSwgcmFua2luaXMgcGFsZWlkaW1hcyBwbyAxMS0wNSBjcm9uIGdlZGltbyk6ICRvayBpcyAkTiBsYWlza3UgcHJpaW10YS5cblV6c2FreW11OiAiLmNvdW50KCR2YWxpZCkuIiwgbmF1anUga2xpZW50dTogIi5jb3VudCgkbmV3RSkuIiwgUERGOiAiLmNvdW50KCRwZGZzKS4iLlxuRmFpbGFpOiBpbW9uZXMvcGFyZGF2aW1haS9wYXJkYXZpbWFpX3N1bSAkcGVyICgxLWFtZSBsYWlza2UpLiIsJGhkLCR0eHQpOwogICAgaWYoJG9rPT09JE4peyB1cGRhdGVfb3B0aW9uKCdwZXRzaG9wX3ByYWdtYV9rbm93bl9lbWFpbHMnLGFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoYXJyYXlfbWVyZ2UoJGJhc2UsJG5ld0UpKSkpOyBwZXRzaG9wX3ByYWdtYV9sb2coIiRwZXI6IGVrc3BvcnRhcyBJU1NJVVNUQVMgZGFsaW1pcyAkb2svJE4gbGFpc2thaSAoUzE4MjkgcmFua2luaXMgcG8gMTEtMDUgY3JvbiBnZWRpbW8pLiBVenNha3ltdTogIi5jb3VudCgkdmFsaWQpLiIsIE5hdWp1IGtsaWVudHU6ICIuY291bnQoJG5ld0UpKTsgfQogICAgZWxzZSB7IHBldHNob3BfcHJhZ21hX2xvZygiJHBlcjogU0lVTlRJTUFTIE5FUEFWWUtPICgkb2svJE4gbGFpc2thaSBwcmlpbXRhKSBTMTgyOSDigJMga25vd25fZW1haWxzIG5lYXRuYXVqaW50aSIpOyB9CiAgICAkclsnb2snXT0kb2s7ICRyWydOJ109JE47ICRyWydrbm93bl9wbyddPWNvdW50KChhcnJheSlnZXRfb3B0aW9uKCdwZXRzaG9wX3ByYWdtYV9rbm93bl9lbWFpbHMnKSk7IH0KICBmb3JlYWNoKCR0eHQgYXMgJHApIEB1bmxpbmsoJHApOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRVJSJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7IH0pOwo=';
const VER='dep-090147';
const GKEY='ps_s1829pz';
const PHASES=["1"];
const OUT='analize/s1829_pz.json';
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
