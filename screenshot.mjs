process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE5dSDigJQgc25pcHBldCA2MTQgdjEuMiAoc2VzaWphIHJhxaFvbWEgdGlrIGthaSBBVEMgZWlsxJcgbmV0dcWhxI1pYSk6IDEgc2F1c2FzIChrb2RvIGZyYWdtZW50YWkpLCAyIHBhdGFpc2EsIDkgYXRzdGF0eW1hcyAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MTl1J10pKSByZXR1cm47ICRmPSRfR0VUWydwc19zMTcxOXUnXTsgJHI9Wyd2Jz0+J1MxNzE5dScsJ2ZhemUnPT4kZl07IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICB0cnl7ICRjPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgY29kZSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBpZD02MTQiKTsgJG5hbWU9JHdwZGItPmdldF92YXIoIlNFTEVDVCBuYW1lIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIGlkPTYxNCIpOwogICAgJGxpbmVzPWV4cGxvZGUoIlxuIiwkYyk7ICRvdXQ9W107IGZvcmVhY2goJGxpbmVzIGFzICRpPT4kbCl7IGlmKHN0cnBvcygkbCwncGV0c2hvcF9ndG1fYXRjX3F1ZXVlJykhPT1mYWxzZSl7IGZvcigkaj1tYXgoMCwkaS02KTskajw9bWluKGNvdW50KCRsaW5lcyktMSwkaSs2KTskaisrKSAkb3V0WyRqXT0kbGluZXNbJGpdOyB9IH0ga3NvcnQoJG91dCk7CiAgICBpZigkZj09PScxJyl7ICRyWyduYW1lJ109JG5hbWU7ICRyWydsZW4nXT1zdHJsZW4oJGMpOyAkclsnZnJhZ21lbnRhaSddPWFycmF5X21hcChmdW5jdGlvbigkaywkdil7cmV0dXJuICgkaysxKS4nOiAnLiR2O30sYXJyYXlfa2V5cygkb3V0KSwkb3V0KTsgfQogICAgaWYoJGY9PT0nMicpeyAkb2xkPSJXQygpLT5zZXNzaW9uLT5zZXQoICdwZXRzaG9wX2d0bV9hdGNfcXVldWUnLCBhcnJheSgpICk7IjsgJG49c3Vic3RyX2NvdW50KCRjLCRvbGQpOyBpZigkbiE9PTEpIHRocm93IG5ldyBFeGNlcHRpb24oInJhc3RhICRuIGthcnTFszogJG9sZCIpOyB1cGRhdGVfb3B0aW9uKCdwc19zMTcxOV9zbmlwNjE0X2JhaycsJGMsZmFsc2UpOwogICAgICAkbmV3PSJpZiAoICEgZW1wdHkoIFwkcXVldWUgKSApIHsgV0MoKS0+c2Vzc2lvbi0+c2V0KCAncGV0c2hvcF9ndG1fYXRjX3F1ZXVlJywgYXJyYXkoKSApOyB9IC8vIFMxNzE5OiBzZXNpamEgcmHFoW9tYSB0aWsga2FpIGVpbMSXIG5ldHXFocSNaWEgKGJvdMWzIHNlc2lqxbMvcHMgREIgxK9yYcWhxbMgbWHFvmluaW1hcykiOyAkYzI9c3RyX3JlcGxhY2UoJG9sZCwkbmV3LCRjKTsgdG9rZW5fZ2V0X2FsbCgiPD9waHBcbiIuJGMyLFRPS0VOX1BBUlNFKTsKICAgICAgJHdwZGItPnVwZGF0ZSgieyRwfXNuaXBwZXRzIixbJ2NvZGUnPT4kYzIsJ25hbWUnPT5zdHJfcmVwbGFjZSgndjEuMScsJ3YxLjInLCRuYW1lKV0sWydpZCc9PjYxNF0pOyB3cF9jYWNoZV9mbHVzaCgpOyAkclsnbmFtZV9wbyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgbmFtZSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBpZD02MTQiKTsKICAgICAgJGhiPXdwX3JlbW90ZV9nZXQoJ2h0dHBzOi8vcGV0c2hvcC5sdC8/cHNfaGI9Jy50aW1lKCksWyd0aW1lb3V0Jz0+MjUsJ3NzbHZlcmlmeSc9PmZhbHNlXSk7ICRyWydoYiddPWlzX3dwX2Vycm9yKCRoYik/J0VSUic6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJGhiKTsgaWYoJHJbJ2hiJ10hPTIwMCl7ICR3cGRiLT51cGRhdGUoInskcH1zbmlwcGV0cyIsWydjb2RlJz0+JGMsJ25hbWUnPT4kbmFtZV0sWydpZCc9PjYxNF0pOyAkclsnUk9MTEJBQ0snXT10cnVlOyB9CiAgICAgICRycz13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvP3BzX3Q9Jy50aW1lKCkpLFsndGltZW91dCc9PjI1LCdzc2x2ZXJpZnknPT5mYWxzZSwnaGVhZGVycyc9PlsndXNlci1hZ2VudCc9PidNb3ppbGxhLzUuMCBwcy10ZXN0JywnY29va2llJz0+J3BzX2pzPTEnXV0pOyAkclsncHJhZGluaXNfc2V0X2Nvb2tpZSddPXdwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXIoJHJzLCdzZXQtY29va2llJyk/OiduxJdyYSAoZ2VyYWkg4oCUIHNlc2lqYSBuZWt1cmlhbWEpJzsgfQogICAgaWYoJGY9PT0nOScpeyAkb2xkPWdldF9vcHRpb24oJ3BzX3MxNzE5X3NuaXA2MTRfYmFrJyk7IGlmKCRvbGQpeyAkd3BkYi0+dXBkYXRlKCJ7JHB9c25pcHBldHMiLFsnY29kZSc9PiRvbGQsJ25hbWUnPT5zdHJfcmVwbGFjZSgndjEuMicsJ3YxLjEnLCRuYW1lKV0sWydpZCc9PjYxNF0pOyAkclsnYXRzdGF0eXRhJ109dHJ1ZTsgfSB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDEpOwo=';
const VER='dep-164512';
const GKEY='ps_s1719u';
const PHASES=["1"];
const OUT='analize/s1719_u1.json';
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
