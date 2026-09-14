process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODAgZCDigJQgcmVhZC1vbmx5OiBMUCBwbHVnaW5vIG9yZGVyLXNlcnZpY2UgaXIgb3JkZXItYWN0aW9ucyBtZXRvZMWzIGvFq25haSAobGlwZHVrbyBrZWxpYXMpLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY4MGQnXSkpIHJldHVybjsgJG89YXJyYXkoJ3YnPT4nUzE2ODAgZCcpOyAkZGlyPVdQX1BMVUdJTl9ESVIuJy93b28tbGl0aHVhbmlhcG9zdC1tYWluL2FkbWluLyc7CiAgJGdldD1mdW5jdGlvbigkZmlsZSwkbmFtZXMpdXNlKCRkaXIsJiRvKXsgJGM9ZmlsZV9nZXRfY29udGVudHMoJGRpci4kZmlsZSk7ICR0PXRva2VuX2dldF9hbGwoJGMpOyAkbj1jb3VudCgkdCk7ICRvdXQ9YXJyYXkoKTsKICAgIGZvcigkaT0wOyRpPCRuOyRpKyspeyBpZihpc19hcnJheSgkdFskaV0pJiYkdFskaV1bMF09PT1UX0ZVTkNUSU9OKXsgZm9yKCRqPSRpKzE7JGo8JG4mJiEoaXNfYXJyYXkoJHRbJGpdKSYmJHRbJGpdWzBdPT09VF9TVFJJTkcpOyRqKyspOyAkbm09JHRbJGpdWzFdPz8nJzsgaWYoIWluX2FycmF5KCRubSwkbmFtZXMpKSBjb250aW51ZTsgJGRlcHRoPTA7JHM9Jyc7JGs9JGo7IGZvcig7JGs8JG47JGsrKyl7ICR0b2s9aXNfYXJyYXkoJHRbJGtdKT8kdFska11bMV06JHRbJGtdOyAkcy49JHRvazsgaWYoJHRvaz09PSd7JykkZGVwdGgrKzsgaWYoJHRvaz09PSd9Jyl7JGRlcHRoLS07IGlmKCRkZXB0aD09PTApIGJyZWFrO30gfSAkb3V0WyRubV09cHJlZ19yZXBsYWNlKCcvWyBcdF0rLycsJyAnLHByZWdfcmVwbGFjZSgnL1xuXHMqXG4vJywiXG4iLCRzKSk7IH0gfQogICAgJG9bJGZpbGVdPSRvdXQ7IH07CiAgJGdldCgnY2xhc3Mtd29vLWxpdGh1YW5pYXBvc3QtYWRtaW4tb3JkZXItc2VydmljZS5waHAnLGFycmF5KCdfX2NvbnN0cnVjdCcsJ2hhbmRsZV9nZW5lcmF0ZV9zdGlja2VycycsJ2hhbmRsZV9pbml0aWF0ZV9zaGlwcGluZycsJ29uX2luaXRpYXRlX3N1Y2Nlc3MnLCdkb3dubG9hZF9sYWJlbHMnLCdpc19zaGlwcGluZ19pbml0aWF0ZWQnLCdpc19yZWFkeV90b19pbml0aWF0ZWQnLCdnZXRfaW5zdGFuY2UnLCdpbnN0YW5jZScpKTsKICAkZ2V0KCdjbGFzcy13b28tbGl0aHVhbmlhcG9zdC1hZG1pbi1vcmRlci1hY3Rpb25zLnBocCcsYXJyYXkoJ19fY29uc3RydWN0JywncHJvY2Vzc19wcmludF9sYWJlbCcsJ3Byb2Nlc3NfY3JlYXRlX3BhcmNlbCcpKTsKICAkZ2V0KCdhcGkvY2xhc3Mtd29vLWxpdGh1YW5pYXBvc3QtYWRtaW4tc3RpY2tlci1hcGkucGhwJyxhcnJheSgnZ2V0X3N0aWNrZXJzJywnZG93bmxvYWRfc3RpY2tlcnNfcGRmJykpOwogICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRkaXIuJ2NsYXNzLXdvby1saXRodWFuaWFwb3N0LWFkbWluLW9yZGVyLXNlcnZpY2UucGhwJyk7IHByZWdfbWF0Y2goJy9jbGFzc1xzKyhcdyspW157XSovJywkYywkbSk7ICRvWydzdmNfY2xhc3MnXT0kbVswXT8/Jyc7IHByZWdfbWF0Y2hfYWxsKCcvKD86cHJpdmF0ZXxwcm90ZWN0ZWR8cHVibGljKVxzK1wkKFx3KykvJywkYywkbTIpOyAkb1snc3ZjX3Byb3BzJ109YXJyYXlfdW5pcXVlKCRtMlsxXSk7CiAgJGM9ZmlsZV9nZXRfY29udGVudHMoJGRpci4nY2xhc3Mtd29vLWxpdGh1YW5pYXBvc3QtYWRtaW4tb3JkZXItYWN0aW9ucy5waHAnKTsgcHJlZ19tYXRjaCgnL2NsYXNzXHMrKFx3KylbXntdKi8nLCRjLCRtKTsgJG9bJ2FjdF9jbGFzcyddPSRtWzBdPz8nJzsKICAkYz1maWxlX2dldF9jb250ZW50cyhXUF9QTFVHSU5fRElSLicvd29vLWxpdGh1YW5pYXBvc3QtbWFpbi9pbmNsdWRlcy9jbGFzcy13b28tbGl0aHVhbmlhcG9zdC5waHAnKTsgcHJlZ19tYXRjaF9hbGwoJy9uZXdccytXb29fTGl0aHVhbmlhcG9zdF9BZG1pbl9PcmRlcl8oU2VydmljZXxBY3Rpb25zKVxzKlwoW147XSo7LycsJGMsJG0zKTsgJG9bJ25ldyddPSRtM1swXTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-070622';
const GKEY='ps_s1680d';
const PHASES=["GO", "CL"];
const OUT='analize/s1680_d.json';
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
