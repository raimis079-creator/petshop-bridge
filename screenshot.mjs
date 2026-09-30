process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQxYWEgV1AgbGFpc2t1IG51b3RyYXVrb3MgKHJlYWQtb25seSwgbGFpc2thaSBORVNJVU5DSUFNSSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzQxYWEnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDEyMCk7IGdsb2JhbCAkd3BkYjsgJHI9Wyd2Jz0+J1MxNzQxYWEnXTsKICB0cnl7CiAgICAkdXA9d3BfdXBsb2FkX2RpcigpOyAkYj0kdXBbJ2Jhc2VkaXInXTsgJGJ1PSR1cFsnYmFzZXVybCddOwogICAgJGg9ZmlsZV9nZXRfY29udGVudHMoJGIuJy8uaHRhY2Nlc3MnKTsgJHJbJ3VwbG9hZHNfaHRhY2Nlc3MnXT1leHBsb2RlKCJcbiIsJGgpOwogICAgJHdlYnA9ZnVuY3Rpb24oJHUpIHVzZSgkYiwkYnUpeyAkcD1wYXJzZV91cmwoJHUsUEhQX1VSTF9QQVRIKTsgJHJlbD1wcmVnX3JlcGxhY2UoJyNeL3dwLWNvbnRlbnQvdXBsb2Fkcy8jJywnJywoc3RyaW5nKSRwKTsgaWYoJHJlbD09PSRwKSByZXR1cm4gJ25lX3VwbG9hZHMnOyAkZj0kYi4nLycuJHJlbDsgJHc9cHJlZ19yZXBsYWNlKCcvXC4oanBlP2d8cG5nKSQvaScsJy53ZWJwJywkZik7IHJldHVybiBpc19maWxlKCR3KT8nV0VCUF9ZUkEnOidiZV93ZWJwJzsgfTsKICAgICRpbWdzPWZ1bmN0aW9uKCRodG1sKSB1c2UoJHdlYnApeyBwcmVnX21hdGNoX2FsbCgnIzxpbWdbXj5dK3NyYz1bIlwnXShbXiJcJ10rKVsiXCddI2knLCRodG1sLCRtKTsgJG89W107IGZvcmVhY2goYXJyYXlfdW5pcXVlKCRtWzFdKSBhcyAkdSl7ICRvW109W21iX3N1YnN0cigkdSwwLDEyMCksJHdlYnAoJHUpXTsgfSByZXR1cm4gJG87IH07CiAgICAkclsnaGVhZGVyX2ltYWdlJ109Z2V0X29wdGlvbignd29vY29tbWVyY2VfZW1haWxfaGVhZGVyX2ltYWdlJyk7CiAgICAkbz13Y19nZXRfb3JkZXJzKFsnbGltaXQnPT4xLCdzdGF0dXMnPT5bJ3Byb2Nlc3NpbmcnLCdjb21wbGV0ZWQnXSwnb3JkZXJieSc9PidkYXRlJywnb3JkZXInPT4nREVTQycsJ3R5cGUnPT4nc2hvcF9vcmRlciddKTsgJG89JG9bMF0/P251bGw7CiAgICBpZigkbyl7ICRyWyd1enMnXT0kby0+Z2V0X29yZGVyX251bWJlcigpOwogICAgICAkbT1XQygpLT5tYWlsZXIoKTsgJGVtPSRtLT5lbWFpbHM7CiAgICAgIGZvcmVhY2goWydXQ19FbWFpbF9DdXN0b21lcl9Qcm9jZXNzaW5nX09yZGVyJywnV0NfRW1haWxfQ3VzdG9tZXJfQ29tcGxldGVkX09yZGVyJywnV0NfRW1haWxfTmV3X09yZGVyJ10gYXMgJGNsKXsgaWYoIWlzc2V0KCRlbVskY2xdKSkgY29udGludWU7ICRlPSRlbVskY2xdOyAkZS0+b2JqZWN0PSRvOyAkZS0+cGxhY2Vob2xkZXJzWyd7b3JkZXJfbnVtYmVyfSddPSRvLT5nZXRfb3JkZXJfbnVtYmVyKCk7ICRlLT5wbGFjZWhvbGRlcnNbJ3tvcmRlcl9kYXRlfSddPXdjX2Zvcm1hdF9kYXRldGltZSgkby0+Z2V0X2RhdGVfY3JlYXRlZCgpKTsgb2Jfc3RhcnQoKTsgJGh0bWw9JGUtPmdldF9jb250ZW50KCk7IG9iX2VuZF9jbGVhbigpOyBpZihtZXRob2RfZXhpc3RzKCRlLCdzdHlsZV9pbmxpbmUnKSkgJGh0bWw9JGUtPnN0eWxlX2lubGluZSgkaHRtbCk7ICRyWyd3YyddWyRjbF09WydpanVuZ3Rhcyc9PiRlLT5pc19lbmFibGVkKCksJ2ltZyc9PiRpbWdzKCRodG1sKSwnZHlkaXMnPT5zdHJsZW4oJGh0bWwpXTsgfQogICAgfQogICAgLy8gbcWrc8WzIMWhYWJsb25haToga3VyIGRlZGFtb3MgbnVvdHJhdWtvcwogICAgJGhpdD1bXTsgZm9yZWFjaChhcnJheV9tZXJnZShnbG9iKFdQTVVfUExVR0lOX0RJUi4nL3BzLXNhYmxvbmFpLyoucGhwJyk/OltdLGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS90ZW1wbGF0ZXMvZW1haWxzLyovKi5waHAnKT86W10sZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL3RlbXBsYXRlcy9lbWFpbHMvKi5waHAnKT86W10sZ2xvYihnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKS4nL3dvb2NvbW1lcmNlL2VtYWlscy8qLnBocCcpPzpbXSkgYXMgJGYpeyAkcz1maWxlX2dldF9jb250ZW50cygkZik7ICRuPXByZWdfbWF0Y2hfYWxsKCcvPGltZ3x3cF9nZXRfYXR0YWNobWVudF9pbWFnZXxnZXRfaW1hZ2VcKHxpbWFnZV91cmx8dGh1bWJuYWlsL2knLCRzKTsgaWYoJG4pICRoaXRbc3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkZildPSRuOyB9ICRyWydzYWJsb25haV9zdV9udW90cmF1a29tJ109JGhpdDsKICAgICRyWydlbWFpbF9sYXlvdXQnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfRW1haWxfTGF5b3V0Jyk/KG5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfRW1haWxfTGF5b3V0JykpLT5nZXRGaWxlTmFtZSgpOm51bGw7CiAgICBpZigkclsnZW1haWxfbGF5b3V0J10peyAkcz1maWxlX2dldF9jb250ZW50cygkclsnZW1haWxfbGF5b3V0J10pOyBwcmVnX21hdGNoX2FsbCgnIyg8aW1nW14+XXswLDIwMH0pIycsJHMsJG1tKTsgJHJbJ2xheW91dF9pbWcnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiBtYl9zdWJzdHIoJHgsMCwyMDApO30sYXJyYXlfc2xpY2UoJG1tWzFdLDAsNikpOyAkclsnbGF5b3V0X2ZpbGUnXT1zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRyWydlbWFpbF9sYXlvdXQnXSk7IHVuc2V0KCRyWydlbWFpbF9sYXlvdXQnXSk7IH0KICAgIC8vIGtpZWsgdXBsb2FkcyBmYWlsxbMgdHVyaSAud2VicCDFoWFsaWEKICAgICRyWyd3cF9tYWlsX2ZpbHRyYWknXT1bXTsgZ2xvYmFsICR3cF9maWx0ZXI7IGZvcmVhY2goWyd3cF9tYWlsJywncGhwbWFpbGVyX2luaXQnLCd3b29jb21tZXJjZV9tYWlsX2NvbnRlbnQnXSBhcyAkaGspeyBpZihpc3NldCgkd3BfZmlsdGVyWyRoa10pKXsgZm9yZWFjaCgkd3BfZmlsdGVyWyRoa10tPmNhbGxiYWNrcyBhcyAkcHI9PiRjYnMpeyBmb3JlYWNoKCRjYnMgYXMgJGNiKXsgJGY9JGNiWydmdW5jdGlvbiddOyAkclsnd3BfbWFpbF9maWx0cmFpJ11bJGhrXVtdPSRwci4nOicuKGlzX2FycmF5KCRmKT8oaXNfb2JqZWN0KCRmWzBdKT9nZXRfY2xhc3MoJGZbMF0pOiRmWzBdKS4nOjonLiRmWzFdOihpc19zdHJpbmcoJGYpPyRmOidjbG9zdXJlJykpOyB9IH0gfSB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-094502';
const GKEY='ps_s1741aa';
const PHASES=["1"];
const OUT='analize/s1741_aa.json';
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
