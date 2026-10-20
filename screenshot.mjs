process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzkxYyBQREYgZ2VuZXJhdmltbyBrb2RhcyArIEFWUE4gbG9naWthIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc5MWMnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE1MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzkxYyddOwogICRjdXQ9ZnVuY3Rpb24oJGZpbGUsJGEsJGIpeyAkbHM9ZmlsZSgkZmlsZSk7ICRvPVtdOyBmb3IoJGk9bWF4KDEsJGEpOyRpPD1taW4oY291bnQoJGxzKSwkYik7JGkrKykgJG9bXT0kaS4nOiAnLnJ0cmltKG1iX3N1YnN0cigkbHNbJGktMV0sMCwyMjApKTsgcmV0dXJuICRvOyB9OwogIHRyeXsKICAgICRmbj1nZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKS4nL2Z1bmN0aW9ucy5waHAnOyAkclsnZ2VuJ109JGN1dCgkZm4sMzU0LDQyMSk7CiAgICAkaD1bXTsgZm9yZWFjaChmaWxlKCRmbikgYXMgJGk9PiRsKXsgaWYocHJlZ19tYXRjaCgnL19wZXRzaG9wX2F2cG5fbnVtYmVyfHBldHNob3BfYXZwbl9jb3VudGVyfF9wZXRzaG9wX2NvbXBsZXRlZF9wZGZ8dW5saW5rfHdjZG5cL2ludm9pY2UvJywkbCkpICRoW109KCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGwsMCwyMjApKTsgfSAkclsnZm5fZ3JlcCddPSRoOwogICAgJGI9Z2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy93b29jb21tZXJjZS1kZWxpdmVyeS1ub3Rlcy9iYXNlLnBocCc7ICRoPVtdOyBpZihmaWxlX2V4aXN0cygkYikpeyBmb3JlYWNoKGZpbGUoJGIpIGFzICRpPT4kbCl7IGlmKHByZWdfbWF0Y2goJy9fcGV0c2hvcF9hdnBuX251bWJlcnxhdnBuX2NvdW50ZXJ8ZG9jdW1lbnRfdHlwZS8nLCRsKSkgJGhbXT0oJGkrMSkuJzogJy50cmltKG1iX3N1YnN0cigkbCwwLDIyMCkpOyB9IH0gJHJbJ2Jhc2VfZ3JlcCddPSRoOwogICAgLy8ga2FzIHRyaW5hIHBkZjogZ3JlcCBtdS1wbHVnaW5zCiAgICAkZz1bXTsgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJHgpeyBmb3JlYWNoKGZpbGUoJHgpIGFzICRpPT4kbCl7IGlmKHN0cnBvcygkbCwnd2Nkbi9pbnZvaWNlJykhPT1mYWxzZXx8KHN0cnBvcygkbCwndW5saW5rJykhPT1mYWxzZSYmc3RyaXBvcygkbCwncGRmJykhPT1mYWxzZSkpICRnW109YmFzZW5hbWUoJHgpLic6Jy4oJGkrMSkuJyAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMjAwKSk7IH0gfSAkclsndHJpbmEnXT0kZzsKICAgICRyWydjb3VudGVyJ109Z2V0X29wdGlvbigncGV0c2hvcF9hdnBuX2NvdW50ZXInKTsKICAgIC8vIGtpZWsgY29tcGxldGVkIHN1IGNvbXBsZXRlZF9wZGYgbWV0YSwgYmV0IGZhaWxvIG5lcmEKICAgICRyb3dzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskUH13Y19vcmRlcnNfbWV0YSBXSEVSRSBtZXRhX2tleT0nX3BldHNob3BfY29tcGxldGVkX3BkZiciKTsgJHlyYT0wOyAkbmVyYT0wOyBmb3JlYWNoKCRyb3dzIGFzICRwKXsgaWYoZmlsZV9leGlzdHMoJHApKSAkeXJhKys7IGVsc2UgJG5lcmErKzsgfSAkclsncGRmX21ldGEnXT1bJ3lyYSc9PiR5cmEsJ25lcmEnPT4kbmVyYV07CiAgICAkclsnaXZ5a2lhaV8wODAwJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbGFpa2FzLHV6c2FreW1hcyxzcml0aXMsdmVpa3NtYXMsa2FzX3ZhcmRhcyxMRUZUKHBhc3RhYmEsMTIwKSBwIEZST00geyRQfXBzX3V6c2FreW11X2l2eWtpYWkgV0hFUkUgbGFpa2FzIEJFVFdFRU4gJzIwMjYtMTAtMjAgMDQ6NTU6MDAnIEFORCAnMjAyNi0xMC0yMCAwNToxNTowMCcgT1JERVIgQlkgaWQgTElNSVQgMjAiLEFSUkFZX0EpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlR8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-204830';
const GKEY='ps_s1791c';
const PHASES=["1"];
const OUT='analize/s1791p_c.json';
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
