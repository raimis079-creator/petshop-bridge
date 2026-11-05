process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI5cHggUHJhZ21hIHNwYWxpbyBla3Nwb3J0YXM6IDEga29kYXMgKHJlYWQtb25seSksIDIgcGFsZWlzdGkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODI5cHgnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDI1MCk7IEBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCcxMDI0TScpOyAkZj0oc3RyaW5nKSRfR0VUWydwc19zMTgyOXB4J107ICRyPVsndic9PidTMTgyOXB4JywnZic9PiRmXTsgZ2xvYmFsICR3cF9maWx0ZXI7CiAgdHJ5ewogICRoPSR3cF9maWx0ZXJbJ3BldHNob3BfcHJhZ21hX21vbnRobHlfZXhwb3J0J10/P251bGw7ICRjYnM9W107CiAgaWYoJGgpeyBmb3JlYWNoKCRoLT5jYWxsYmFja3MgYXMgJHByPT4kYXJyKXsgZm9yZWFjaCgkYXJyIGFzICRjKXsgJGZuPSRjWydmdW5jdGlvbiddOyBpZihpc19hcnJheSgkZm4pKXsgJHJtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCRmblswXSwkZm5bMV0pOyB9IGVsc2VpZigkZm4gaW5zdGFuY2VvZiBDbG9zdXJlfHxpc19zdHJpbmcoJGZuKSl7ICRybT1uZXcgUmVmbGVjdGlvbkZ1bmN0aW9uKCRmbik7IH0gJGNic1tdPVsnZic9PiRybS0+Z2V0RmlsZU5hbWUoKSwncyc9PiRybS0+Z2V0U3RhcnRMaW5lKCksJ2UnPT4kcm0tPmdldEVuZExpbmUoKSwnbic9PmlzX2FycmF5KCRmbik/KGlzX29iamVjdCgkZm5bMF0pP2dldF9jbGFzcygkZm5bMF0pOiRmblswXSkuJzo6Jy4kZm5bMV06KGlzX3N0cmluZygkZm4pPyRmbjonY2xvc3VyZScpXTsgfSB9IH0KICAkclsnY2JzJ109JGNiczsKICBpZigkZj09PScxJyAmJiAkY2JzKXsgJHNyYz1maWxlKCRjYnNbMF1bJ2YnXSk7ICRyWydzcmMnXT1hcnJheV9tYXAoJ3J0cmltJyxhcnJheV9tZXJnZShhcnJheV9zbGljZSgkc3JjLDU2LDEwMSksWyc9PT09PSddLGFycmF5X3NsaWNlKCRzcmMsMjg0LDQ1KSkpOyAkclsnZmFpbGFzX2VpbCddPWNvdW50KCRzcmMpOwogICAgJEw9W107IGZvcmVhY2goJHNyYyBhcyAkbj0+JGxuKXsgaWYocHJlZ19tYXRjaCgnL2Z1bmN0aW9uIHx3cF9tYWlsfG1lbW9yeXxhdHRhY2htZW50c3xyZWNpcGllbnR8YXVkYWMvaScsJGxuKSkgJExbXT0oJG4rMSkuJzogJy5tYl9zdWJzdHIodHJpbSgkbG4pLDAsMjAwKTsgfSAkclsnZm4nXT1hcnJheV9zbGljZSgkTCwwLDgwKTsgfQogIGlmKCRmPT09JzInKXsgJGxnMD1jb3VudCgoYXJyYXkpZ2V0X29wdGlvbigncGV0c2hvcF9wcmFnbWFfbG9nJykpOyAkbTA9bWVtb3J5X2dldF91c2FnZSh0cnVlKTsKICAgICRvaz0wOyBhZGRfYWN0aW9uKCd3cF9tYWlsX3N1Y2NlZWRlZCcsZnVuY3Rpb24oJGQpIHVzZSAoJiRyKXsgJHJbJ21haWxfb2snXVtdPVsndG8nPT4kZFsndG8nXSwnc3Viaic9PiRkWydzdWJqZWN0J10sJ2F0dCc9PmFycmF5X21hcCgnYmFzZW5hbWUnLChhcnJheSkoJGRbJ2F0dGFjaG1lbnRzJ10/P1tdKSldOyB9KTsKICAgIGFkZF9hY3Rpb24oJ3dwX21haWxfZmFpbGVkJyxmdW5jdGlvbigkZSkgdXNlICgmJHIpeyAkclsnbWFpbF9mYWlsJ11bXT0kZS0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsgfSk7CiAgICBkb19hY3Rpb24oJ3BldHNob3BfcHJhZ21hX21vbnRobHlfZXhwb3J0Jyk7CiAgICAkbGc9KGFycmF5KWdldF9vcHRpb24oJ3BldHNob3BfcHJhZ21hX2xvZycpOyAkclsnbG9nX25hdWppJ109YXJyYXlfc2xpY2UoJGxnLCRsZzApOyAkclsnbWVtX3BlYWtfbWInXT1yb3VuZChtZW1vcnlfZ2V0X3BlYWtfdXNhZ2UodHJ1ZSkvMTA0ODU3Nik7ICRyWyduZXh0J109d3BfbmV4dF9zY2hlZHVsZWQoJ3BldHNob3BfcHJhZ21hX21vbnRobHlfZXhwb3J0Jyk/d3BfZGF0ZSgnWS1tLWQgSDppJyx3cF9uZXh0X3NjaGVkdWxlZCgncGV0c2hvcF9wcmFnbWFfbW9udGhseV9leHBvcnQnKSk6bnVsbDsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRVJSJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRGaWxlKCkuJzonLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7IH0pOwo=';
const VER='dep-085920';
const GKEY='ps_s1829px';
const PHASES=["1"];
const OUT='analize/s1829_px.json';
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
