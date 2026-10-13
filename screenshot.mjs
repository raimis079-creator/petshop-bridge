process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzgxZSBOZWlzcnVzaXVvdGkgZWlsZXMgbG9naWthIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc4MWUnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDEyMCk7ICRyPVsndic9PidTMTc4MWUnXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogIHRyeXsKICAgICRncmVwPWZ1bmN0aW9uKCRmaWxlLCRwYXQsJG1heD04MCwkdz00MjApeyAkb3V0PVtdOyBmb3JlYWNoKGZpbGUoJGZpbGUpIGFzICRpPT4kbCl7IGlmKHByZWdfbWF0Y2goJHBhdCwkbCkpeyAkb3V0W109KCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGwsMCwkdykpOyBpZihjb3VudCgkb3V0KT49JG1heCkgYnJlYWs7IH0gfSByZXR1cm4gJG91dDsgfTsKICAgICRjdXQ9ZnVuY3Rpb24oJGZpbGUsJGEsJGIsJHc9MTYwMCl7ICRscz1maWxlKCRmaWxlKTsgJG89W107IGZvcigkaT0kYTskaTw9JGI7JGkrKyl7ICRvW109JGkuJzogJy5ydHJpbShtYl9zdWJzdHIoJGxzWyRpLTFdPz8nJywwLCR3KSk7IH0gcmV0dXJuICRvOyB9OwogICAgJGRsPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZGFyYmFsYXVraXMucGhwJzsgJGRrPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZGVzay5waHAnOwogICAgJHJbJ2RsX2VpbGVzJ109JGdyZXAoJGRsLCcvY29uc3QgRUlMRVN8XCdydXNcJ3wicnVzInxfcHNfcnVzaXVvdGF8bmVpc3J1c3xOZWnFoXLFq8WhaXVvdGkvaXUnKTsKICAgICRyWydka18xMjAwJ109JGN1dCgkZGssMTE5NiwxMjE2LDUwMCk7CiAgICAvLyBmYWt0YWkoKSBkYWxpcyBrdXIgbnVzdGF0b21vcyBlaWxlczogbnVvICdydXMnIHByaXNreXJpbW8KICAgICRscz1maWxlKCRkbCk7ICRoaXQ9W107IGZvcmVhY2goJGxzIGFzICRpPT4kbCl7IGlmKHByZWdfbWF0Y2goJy9cJGZcW1wncnVzXCdcXVxzKj18XCRmXFtcJ2VpbGVzXCdcXVxbXF18XCRmXFtcJ2VpbGVzXCdcXVxzKj0vJywkbCkpICRoaXRbXT0kaSsxOyB9ICRyWydydXNfZWlsX25yJ109JGhpdDsKICAgIGlmKCRoaXQpeyAkYT1tYXgoMSxtaW4oJGhpdCktMyk7ICRiPW1pbihjb3VudCgkbHMpLG1heCgkaGl0KSszKTsgaWYoJGItJGE+NzApICRiPSRhKzcwOyAkclsncnVzX2tvZGFzJ109JGN1dCgkZGwsJGEsJGIpOyB9CiAgICAvLyBkYWJhcnRpbmUgMTM5NCBidWtsZSBwZXIgZGFyYmFsYXVraW8gZmFrdHVzCiAgICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfRGFyYmFsYXVraXMnKSl7ICRvPXdjX2dldF9vcmRlcigzNjgyOCk7ICRtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0RhcmJhbGF1a2lzJywnZmFrdGFpJyk7ICRtLT5zZXRBY2Nlc3NpYmxlKHRydWUpOyAkej1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9EYXJiYWxhdWtpcycsJ3p1cm5hbGFzJyk7ICR6LT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogICAgICAkZj0kbS0+aW52b2tlKG51bGwsJG8sJHotPmludm9rZShudWxsLFszNjgyOF0pKTsgJHJbJ2YxMzk0J109WydydXMnPT4kZlsncnVzJ10/P251bGwsJ2VpbGVzJz0+JGZbJ2VpbGVzJ10/P251bGwsJ3RpZXNpYWknPT4kZlsndGllc2lhaSddPz9udWxsLCdhdl9zaWRlJz0+JGZbJ2F2X3NpZGUnXT8/bnVsbCwnZWlsJz0+YXJyYXlfbWFwKGZuKCRlKT0+WyduJz0+bWJfc3Vic3RyKCRlWyduJ10sMCwzMCksJ2snPT4kZVsnayddLCdzcmMnPT4kZVsnc3JjJ10sJ2xvY2snPT4kZVsnbG9jayddPz8nJ10sJGZbJ2VpbCddPz9bXSldOyB9CiAgICAvLyBraWVrIGRhYmFyIGF0dmlydSBtaXNyaXUgdXpzYWt5bXUgc3UgcGxhbnUgYmV0IGJlIF9wc19ydXNpdW90YQogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgby5pZCwgbi5tZXRhX3ZhbHVlIG5yLCBtLm1ldGFfdmFsdWUgc3ByIEZST00geyRQfXdjX29yZGVycyBvIEpPSU4geyRQfXdjX29yZGVyc19tZXRhIG0gT04gbS5vcmRlcl9pZD1vLmlkIEFORCBtLm1ldGFfa2V5PSdfcHNfbWlzcnVzX3NwcmVuZGltYXMnIExFRlQgSk9JTiB7JFB9d2Nfb3JkZXJzX21ldGEgbiBPTiBuLm9yZGVyX2lkPW8uaWQgQU5EIG4ubWV0YV9rZXk9J19wc19vcmRlcl9udW1iZXInIExFRlQgSk9JTiB7JFB9d2Nfb3JkZXJzX21ldGEgcnUgT04gcnUub3JkZXJfaWQ9by5pZCBBTkQgcnUubWV0YV9rZXk9J19wc19ydXNpdW90YScgV0hFUkUgby5zdGF0dXM9J3djLXByb2Nlc3NpbmcnIEFORCAocnUubWV0YV92YWx1ZSBJUyBOVUxMIE9SIHJ1Lm1ldGFfdmFsdWU9JycpIixBUlJBWV9BKTsgJHJbJ3BsYW5hc19iZV9ydXNpdW90YSddPSRyb3dzOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlR8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-100756';
const GKEY='ps_s1781e';
const PHASES=["1"];
const OUT='analize/s1781_e.json';
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
