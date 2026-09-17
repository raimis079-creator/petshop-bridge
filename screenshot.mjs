process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODlzIGsg4oCUIFJFQ09OIFBhZ2VTcGVlZCBJbnNpZ2h0cyAobGFiK0NyVVgpIGtlbGllbXMgcHVzbGFwaWFtcy4gUmVhZC1vbmx5LiA/cHNfczE2ODlzaz0xJnU9MC4uMyZzPW1vYmlsZXxkZXNrdG9wICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjg5c2snXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE3MCk7CiAgJHBhZ2VzPWFycmF5KGhvbWVfdXJsKCcvJyksIGhvbWVfdXJsKCcva2F0ZWdvcmlqYS9zdW5pbXMvJyksIGhvbWVfdXJsKCcvcHJvZHVjdC9naW1jYXQtbnV0cmktdGF1cmluZS1iaXRlcy1xdWFyay1zdS10YXVyaW51LWlyLXJpa290YS00MjUtZy8nKSwgaG9tZV91cmwoJy9rYXNhLycpKTsKICAkbz1hcnJheSgpOyAka2V5PWdldF9vcHRpb24oJ3BzX3Nlb19wc2lfa2V5JykgPzogZ2V0X29wdGlvbigncHNfcHNpX2tleScpOwogIGZvcmVhY2goYXJyYXkoYXJyYXkoMCwnbW9iaWxlJyksYXJyYXkoMiwnbW9iaWxlJykpIGFzICRqKXsgbGlzdCgkaSwkcyk9JGo7CiAgICAkcT0naHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vcGFnZXNwZWVkb25saW5lL3Y1L3J1blBhZ2VzcGVlZD91cmw9Jy5yYXd1cmxlbmNvZGUoJHBhZ2VzWyRpXSkuJyZzdHJhdGVneT0nLiRzLicmbG9jYWxlPWx0JmNhdGVnb3J5PXBlcmZvcm1hbmNlJmNhdGVnb3J5PXNlbyZjYXRlZ29yeT1hY2Nlc3NpYmlsaXR5JmNhdGVnb3J5PWJlc3QtcHJhY3RpY2VzJy4oJGtleT8nJmtleT0nLiRrZXk6JycpOwogICAgJHI9d3BfcmVtb3RlX2dldCgkcSxhcnJheSgndGltZW91dCc9PjYwKSk7IGlmKGlzX3dwX2Vycm9yKCRyKSl7JG9bXT1hcnJheSgkaSwkcywnRVJSICcuJHItPmdldF9lcnJvcl9tZXNzYWdlKCkpO2NvbnRpbnVlO30KICAgICRkPWpzb25fZGVjb2RlKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSx0cnVlKTsgaWYoZW1wdHkoJGRbJ2xpZ2h0aG91c2VSZXN1bHQnXSkpeyRvW109YXJyYXkoJGksJHMsc3Vic3RyKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSwwLDIwMCkpO2NvbnRpbnVlO30KICAgICRMPSRkWydsaWdodGhvdXNlUmVzdWx0J107ICRBPSRMWydhdWRpdHMnXTsgJHNjPWFycmF5KCk7IGZvcmVhY2goJExbJ2NhdGVnb3JpZXMnXSBhcyAkaz0+JGMpJHNjWyRrXT1yb3VuZCgkY1snc2NvcmUnXSoxMDApOwogICAgJG09YXJyYXkoKTsgZm9yZWFjaChhcnJheSgnZmlyc3QtY29udGVudGZ1bC1wYWludCcsJ2xhcmdlc3QtY29udGVudGZ1bC1wYWludCcsJ3RvdGFsLWJsb2NraW5nLXRpbWUnLCdjdW11bGF0aXZlLWxheW91dC1zaGlmdCcsJ3NwZWVkLWluZGV4Jywnc2VydmVyLXJlc3BvbnNlLXRpbWUnLCd0b3RhbC1ieXRlLXdlaWdodCcsJ2RvbS1zaXplJykgYXMgJGEpJG1bJGFdPSRBWyRhXVsnZGlzcGxheVZhbHVlJ10/PycnOwogICAgJG9wcD1hcnJheSgpOyBmb3JlYWNoKCRBIGFzICRrPT4kYSl7IGlmKCgkYVsnZGV0YWlscyddWyd0eXBlJ10/PycnKT09PSdvcHBvcnR1bml0eScgJiYgKCRhWydzY29yZSddPz8xKTwwLjkgJiYgIWVtcHR5KCRhWydkaXNwbGF5VmFsdWUnXSkpICRvcHBbXT0kay4nOiAnLiRhWydkaXNwbGF5VmFsdWUnXTsgfQogICAgJGZhaWw9YXJyYXkoKTsgZm9yZWFjaChhcnJheSgnc2VvJywnYWNjZXNzaWJpbGl0eScsJ2Jlc3QtcHJhY3RpY2VzJykgYXMgJGNhdCl7IGZvcmVhY2goJExbJ2NhdGVnb3JpZXMnXVskY2F0XVsnYXVkaXRSZWZzJ10gYXMgJHJlZil7ICRhPSRBWyRyZWZbJ2lkJ11dOyBpZihpc3NldCgkYVsnc2NvcmUnXSkgJiYgJGFbJ3Njb3JlJ10hPT1udWxsICYmICRhWydzY29yZSddPDEgJiYgKCRyZWZbJ3dlaWdodCddPz8wKT4wKSAkZmFpbFtdPSRjYXRbMF0uJzonLiRyZWZbJ2lkJ107IH0gfQogICAgJGY9JGRbJ2xvYWRpbmdFeHBlcmllbmNlJ11bJ21ldHJpY3MnXT8/YXJyYXkoKTsgJGNydXg9YXJyYXkoKTsgZm9yZWFjaCgkZiBhcyAkaz0+JHYpJGNydXhbc3RyX3JlcGxhY2UoJ19NUycsJycsJGspXT0oJHZbJ3BlcmNlbnRpbGUnXT8/JycpLicgJy4kdlsnY2F0ZWdvcnknXTsKICAgICRvW109YXJyYXkoJ3AnPT4kaSwncyc9PiRzLCdzYyc9PiRzYywnbSc9PiRtLCdvcHAnPT5hcnJheV9zbGljZSgkb3BwLDAsOCksJ2ZhaWwnPT5hcnJheV9zbGljZSgkZmFpbCwwLDE0KSwnY3J1eCc9PiRjcnV4LCdjcnV4X29yaWdpbic9PiRkWydvcmlnaW5Mb2FkaW5nRXhwZXJpZW5jZSddWydvdmVyYWxsX2NhdGVnb3J5J10/P251bGwpOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0pOwo=';
const VER='dep-093334';
const GKEY='ps_s1689sk';
const PHASES=["GO"];
const OUT='analize/s1689s_k.json';
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
