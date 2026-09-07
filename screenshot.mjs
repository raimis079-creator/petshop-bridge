process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzUgdnQ2IOKAlCBsYWnFoWvFsyBmYWlsxbMgdHVyaW55cyAoTFQgcGF0aWtyYSkgKyBmYWlsZWQgbGFpxaFrbyBiYW5keW1hcyBkYXIga2FydMSFLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTYzNXZ0NiddKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE2MzUgdnQ2Jyk7CiAgJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJG49d2NfY3JlYXRlX29yZGVyKGFycmF5KCdjdXN0b21lcl9pZCc9PjApKTsgJG4tPmFkZF9wcm9kdWN0KHdjX2dldF9wcm9kdWN0KDM1MzU3KSwxKTsKICAkbi0+c2V0X2JpbGxpbmdfZW1haWwoJ3Z0QGRldi5hdmVzYS5sdCcpOyAkbi0+Y2FsY3VsYXRlX3RvdGFscygpOyAkbi0+c2F2ZSgpOyAkaWQ9JG4tPmdldF9pZCgpOyAkb1snaWQnXT0kaWQ7CiAgJG4tPnVwZGF0ZV9zdGF0dXMoJ2ZhaWxlZCcsJ3Z0MycpOyB3cF9jYWNoZV9mbHVzaCgpOwogICR6PShhcnJheSlnZXRfb3B0aW9uKCdwc19kZXZfcGFzdGFzX3p1cm5hbGFzJyxhcnJheSgpKTsKICBmb3JlYWNoKGFycmF5X3NsaWNlKCR6LC0yKSBhcyAkZSl7CiAgICAkZnM9KGFycmF5KSgkZVsnZmFpbGFpJ10/P2FycmF5KCkpOyAkdHh0PScnOwogICAgZm9yZWFjaCgkZnMgYXMgJGYpeyBpZihpc19zdHJpbmcoJGYpJiZmaWxlX2V4aXN0cygkZikpICR0eHQuPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgfQogICAgaWYoISR0eHQgJiYgIWVtcHR5KCRlWyd1cmwnXSkpeyAkcj13cF9yZW1vdGVfZ2V0KCRlWyd1cmwnXSxhcnJheSgndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSkpOyAkdHh0PShzdHJpbmcpd3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOyB9CiAgICAkdD13cF9zdHJpcF9hbGxfdGFncygkdHh0KTsKICAgICRsdD0nPyc7IGlmKHN0cnBvcygkdCwnRGVqYSwgdcW+c2FreW1vJykhPT1mYWxzZSkgJGx0PSdMVCDinJMgKGZhaWxlZCBib2R5KSc7CiAgICBlbHNlaWYoc3RycG9zKCR0LCdQcmFuZcWhYW1lLCBrYWQnKSE9PWZhbHNlKSAkbHQ9J0xUIOKckyAoY2FuY2VsbGVkIGJvZHkpJzsKICAgIGVsc2VpZihzdHJwb3MoJHQsJ1VuZm9ydHVuYXRlbHknKSE9PWZhbHNlfHxzdHJwb3MoJHQsJ2dldHRpbmcgaW4gdG91Y2gnKSE9PWZhbHNlKSAkbHQ9J0VOICEnOwogICAgJHBvcz1zdHJwb3MoJHQsJ0RlamEnKTsgaWYoJHBvcz09PWZhbHNlKSRwb3M9c3RycG9zKCR0LCdQcmFuZcWhYW1lJyk7IGlmKCRwb3M9PT1mYWxzZSkkcG9zPXN0cnBvcygkdCwnVW5mb3J0dW5hdGVseScpOyBpZigkcG9zPT09ZmFsc2UpJHBvcz0wOwogICAgJG9bJ2xhaXNrYWknXVtdPWFycmF5KCd0ZW1hJz0+bWJfc3Vic3RyKCRlWyd0ZW1hJ10/PycnLDAsNjApLCdsdCc9PiRsdCwnaXN0cmF1a2EnPT5tYl9zdWJzdHIoJHQsJHBvcywxNDApKTsKICB9CiAgd2NfZ2V0X29yZGVyKCRpZCktPmRlbGV0ZSh0cnVlKTsgJG9bJ2lzdHJpbnRhcyddPXdjX2dldF9vcmRlcigkaWQpPzA6MTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDk5KTsK';
const VER='dep-084503';
const GKEY='ps_s1635vt6';
const PHASES=["V6"];
const OUT='analize/s1635_vt6.json';
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
