process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE5ZSDigJQgYWNjZXNzIGxvZ8WzIGFuYWxpesSXICh0YXIuZ3osIHJlYWQtb25seSkgKGopICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcxOWUnXSkpIHJldHVybjsgJHI9Wyd2Jz0+J1MxNzE5ZScsJ3QnPT5kYXRlKCdZLW0tZCBIOmk6cycpXTsgQHNldF90aW1lX2xpbWl0KDI1MCk7IEBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCc3NjhNJyk7CiAgJGRvbT1kaXJuYW1lKEFCU1BBVEgpOyAkVDA9bWljcm90aW1lKHRydWUpOwogIHRyeXsKICAgICRmaWxlcz1bJGRvbS4nL2xvZ3MvU2VwLTIwMjYudGFyLmd6JywkZG9tLicvbG9ncy9TZXAtMjAyNi50YXIuZ3ouMSddOwogICAgZm9yZWFjaCgkZmlsZXMgYXMgJGZ4KXsgaWYoIWZpbGVfZXhpc3RzKCRmeCkpIGNvbnRpbnVlOyAkaz1iYXNlbmFtZSgkZngpOyAkZ3o9ZmlsZV9nZXRfY29udGVudHMoJGZ4KTsgJHRhcj1AZ3pkZWNvZGUoJGd6KTsgdW5zZXQoJGd6KTsgaWYoJHRhcj09PWZhbHNlKXsgJHJbJGtdPSdnemRlY29kZSBrbGFpZGEnOyBjb250aW51ZTsgfQogICAgICAkbGVuPXN0cmxlbigkdGFyKTsgJHBvcz0wOyAkbWVtYmVycz1bXTsgJHR4dD0nJzsKICAgICAgd2hpbGUoJHBvcys1MTI8PSRsZW4peyAkaD1zdWJzdHIoJHRhciwkcG9zLDUxMik7IGlmKHRyaW0oJGgsIlwwIik9PT0nJykgYnJlYWs7ICRuYW1lPXJ0cmltKHN1YnN0cigkaCwwLDEwMCksIlwwIik7ICRzaXplPW9jdGRlYyh0cmltKHN1YnN0cigkaCwxMjQsMTIpKSk7ICR0eXBlPXN1YnN0cigkaCwxNTYsMSk7ICRtZW1iZXJzW109WyRuYW1lLCRzaXplLCR0eXBlXTsgJHBvcys9NTEyOyBpZigkdHlwZT09PScwJ3x8JHR5cGU9PT0iXDAifHwkdHlwZT09PScnKXsgaWYocHJlZ19tYXRjaCgnL2xvZyR8YWNjZXNzfHBldHNob3AvaScsJG5hbWUpJiYhcHJlZ19tYXRjaCgnL2Vycm9yfGRldlwuL2knLCRuYW1lKSkgJHR4dC49c3Vic3RyKCR0YXIsJHBvcywkc2l6ZSk7IH0gJHBvcys9Y2VpbCgkc2l6ZS81MTIpKjUxMjsgfQogICAgICB1bnNldCgkdGFyKTsgJHJbJGtdPVsndGFyX21iJz0+cm91bmQoJGxlbi8xMDQ4NTc2LDEpLCduYXJpYWknPT5hcnJheV9zbGljZSgkbWVtYmVycywwLDgpLCd0eHRfbWInPT5yb3VuZChzdHJsZW4oJHR4dCkvMTA0ODU3NiwxKV07CiAgICAgIGlmKCR0eHQ9PT0nJyl7IGNvbnRpbnVlOyB9CiAgICAgICRscz1leHBsb2RlKCJcbiIsJHR4dCk7IHVuc2V0KCR0eHQpOyAkbj0wOyRzdD1bXTskdWE9W107JGlwPVtdOyRhdGM9MDskYXRjX2lwPVtdOyRhdGNfdWE9W107JGZpcnN0PW51bGw7JGxhc3Q9bnVsbDskYm90cz0wOyRwYXRocz1bXTskY3Jvbj0wOyRhamF4PTA7JHdjYWpheD0wOyRzdG9yZT0wOyRjYXRfcT0wOyRhZG1pbj0wOyRsb2dpbj0wOyRob3Vycz1bXTsKICAgICAgZm9yZWFjaCgkbHMgYXMgJGxuKXsgaWYoIXByZWdfbWF0Y2goJy9eKFxTKykgXFMrIFxTKyBcWyhbXlxdXSspXF0gIihcUyspIChcUyspW14iXSoiIChcZHszfSkgKFxTKykoPzogIihbXiJdKikiICIoW14iXSopIik/LycsJGxuLCRtKSkgY29udGludWU7ICRuKys7IGlmKCEkZmlyc3QpICRmaXJzdD0kbVsyXTsgJGxhc3Q9JG1bMl07ICRzdFskbVs1XV09KCRzdFskbVs1XV0/PzApKzE7ICR1PXByZWdfcmVwbGFjZSgnL15Nb3ppbGxhXC81XC4wIC8nLCcnLHN1YnN0cigkbVs4XT8/Jy0nLDAsNzApKTsgJHVhWyR1XT0oJHVhWyR1XT8/MCkrMTsgJGlwWyRtWzFdXT0oJGlwWyRtWzFdXT8/MCkrMTsgJGhyPXN1YnN0cigkbVsyXSwxMiwyKTsgJGhvdXJzWyRocl09KCRob3Vyc1skaHJdPz8wKSsxOwogICAgICAgIGlmKHByZWdfbWF0Y2goJy9ib3R8Y3Jhd2x8c3BpZGVyfEdQVHxDbGF1ZGV8QmluZ3xZYW5kZXh8U2VtcnVzaHxBaHJlZnN8cHl0aG9ufGN1cmx8R28taHR0cHxTY3JhcHl8ZmFjZWJvb2t8QW1hem9uYm90fEJ5dGVzcGlkZXJ8UGV0YWxCb3R8RGF0YUZvclNlb3xNSjEyL2knLCRtWzhdPz8nJykpICRib3RzKys7CiAgICAgICAgaWYoc3RycG9zKCRtWzRdLCdhZGQtdG8tY2FydD0nKSE9PWZhbHNlKXsgJGF0YysrOyAkYXRjX2lwWyRtWzFdXT0oJGF0Y19pcFskbVsxXV0/PzApKzE7ICRhdGNfdWFbJHVdPSgkYXRjX3VhWyR1XT8/MCkrMTsgfQogICAgICAgIGlmKHN0cnBvcygkbVs0XSwnd3AtY3Jvbi5waHAnKSE9PWZhbHNlKSAkY3JvbisrOyBpZihzdHJwb3MoJG1bNF0sJ2FkbWluLWFqYXgucGhwJykhPT1mYWxzZSkgJGFqYXgrKzsgaWYoc3RycG9zKCRtWzRdLCd3Yy1hamF4PScpIT09ZmFsc2UpICR3Y2FqYXgrKzsgaWYoc3RycG9zKCRtWzRdLCd3Yy9zdG9yZScpIT09ZmFsc2UpICRzdG9yZSsrOyBpZihzdHJwb3MoJG1bNF0sJ3lpdGhfd2Nhbj0nKSE9PWZhbHNlfHxzdHJwb3MoJG1bNF0sJ2ZpbHRlcl8nKSE9PWZhbHNlKSAkY2F0X3ErKzsgaWYoc3RycG9zKCRtWzRdLCcvd3AtYWRtaW4vJyk9PT0wKSAkYWRtaW4rKzsgaWYoc3RycG9zKCRtWzRdLCd3cC1sb2dpbi5waHAnKSE9PWZhbHNlJiYkbVszXT09PSdQT1NUJykgJGxvZ2luKys7CiAgICAgICAgJHB0aD1wcmVnX3JlcGxhY2UoJy9cPy4qLycsJycsJG1bNF0pOyAkcHRoPXByZWdfcmVwbGFjZSgnL1wvcGFnZVwvXGQrLycsJy9wYWdlL04nLCRwdGgpOyAkcHRoPXByZWdfcmVwbGFjZSgnI14vKGthdGVnb3JpamF8cHJla2V8Z2FtaW50b2phcykvW14vXSsjJywnLyQxLyonLCRwdGgpOyAkcGF0aHNbJHB0aF09KCRwYXRoc1skcHRoXT8/MCkrMTsgfQogICAgICBhcnNvcnQoJHVhKTsgYXJzb3J0KCRpcCk7IGFyc29ydCgkYXRjX2lwKTsgYXJzb3J0KCRhdGNfdWEpOyBhcnNvcnQoJHBhdGhzKTsga3NvcnQoJGhvdXJzKTsKICAgICAgJHJbJGtdKz1bJ24nPT4kbiwnbnVvJz0+JGZpcnN0LCdpa2knPT4kbGFzdCwnc3RhdHVzYWknPT4kc3QsJ2JvdGFpX3BjdCc9PiRuP3JvdW5kKDEwMCokYm90cy8kbik6bnVsbCwnYWRkX3RvX2NhcnQnPT4kYXRjLCdhdGNfaXBfdG9wJz0+YXJyYXlfc2xpY2UoJGF0Y19pcCwwLDgsdHJ1ZSksJ2F0Y191YV90b3AnPT5hcnJheV9zbGljZSgkYXRjX3VhLDAsNix0cnVlKSwnd3BfY3Jvbic9PiRjcm9uLCdhZG1pbl9hamF4Jz0+JGFqYXgsJ3djX2FqYXgnPT4kd2NhamF4LCd3Y19zdG9yZSc9PiRzdG9yZSwnZmlsdHJhaSc9PiRjYXRfcSwnd3BfYWRtaW4nPT4kYWRtaW4sJ2xvZ2luX3Bvc3QnPT4kbG9naW4sJ3VhX3RvcCc9PmFycmF5X3NsaWNlKCR1YSwwLDE0LHRydWUpLCdpcF90b3AnPT5hcnJheV9zbGljZSgkaXAsMCwxMCx0cnVlKSwna2VsaWFpX3RvcCc9PmFycmF5X3NsaWNlKCRwYXRocywwLDE0LHRydWUpLCd2YWxhbmRvcyc9PiRob3Vyc107CiAgICAgIGlmKG1pY3JvdGltZSh0cnVlKS0kVDA+MTUwKSBicmVhazsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogICRyWyd0cnVrbWVfcyddPXJvdW5kKG1pY3JvdGltZSh0cnVlKS0kVDAsMSk7ICRyWydtZW1fbWInXT1yb3VuZChtZW1vcnlfZ2V0X3BlYWtfdXNhZ2UodHJ1ZSkvMTA0ODU3Nik7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sMSk7Cg==';
const VER='dep-142221';
const GKEY='ps_s1719e';
const PHASES=["j"];
const OUT='analize/s1719_e.json';
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
