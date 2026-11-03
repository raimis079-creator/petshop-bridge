process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI0ZSBBViBrb25zZXJ2xbMgaW52ZW50b3JpdXMgKDEgcmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MjRlJ10pKSByZXR1cm47ICRyPVsndic9PidTMTgyNGUnXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogICRjYXRzPVtdOyBmb3JlYWNoKFsna29uc2VydmFpLWthdGVtcycsJ2tvbnNlcnZhaS1zdW5pbXMnXSBhcyAkcyl7ICR0PWdldF90ZXJtX2J5KCdzbHVnJywkcywncHJvZHVjdF9jYXQnKTsgaWYoJHQpeyAkY2F0c1tdPSR0LT50ZXJtX2lkOyBmb3JlYWNoKChhcnJheSlnZXRfdGVybV9jaGlsZHJlbigkdC0+dGVybV9pZCwncHJvZHVjdF9jYXQnKSBhcyAkYykgJGNhdHNbXT0kYzsgfSB9CiAgJGlkcz1nZXRfcG9zdHMoWydwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnLCdudW1iZXJwb3N0cyc9Pi0xLCdmaWVsZHMnPT4naWRzJywndGF4X3F1ZXJ5Jz0+W1sndGF4b25vbXknPT4ncHJvZHVjdF9jYXQnLCdmaWVsZCc9Pid0ZXJtX2lkJywndGVybXMnPT4kY2F0c11dXSk7CiAgJG1ldGFzPVtdOyAkbz1bXTsKICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgaWYoZ2V0X3Bvc3RfbWV0YSgkaWQsJ19kcF9iYXNlX3Byb2R1Y3RfaWQnLHRydWUpKSBjb250aW51ZTsgaWYoZ2V0X3Bvc3RfbWV0YSgkaWQsJ196Yl9jb3N0Jyx0cnVlKSE9PScnKSBjb250aW51ZTsgJHA9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoISRwfHwkcC0+aXNfdHlwZSgndmFyaWFibGUnKSkgeyBpZigkcCYmJHAtPmlzX3R5cGUoJ3ZhcmlhYmxlJykpICRvW109WyRpZCwnVkFSJywkcC0+Z2V0X25hbWUoKV07IGNvbnRpbnVlOyB9CiAgICAkYz0nJzsgZm9yZWFjaChbJ19wc19zYXZpa2FpbmEnLCdfd2NfY29nX2Nvc3QnLCdfYWxnX3djX2NvZ19jb3N0JywnX3B1cmNoYXNlX3ByaWNlJywnX3BzX2Nvc3QnLCdfdmZfY29zdCddIGFzICRrKXsgJHY9Z2V0X3Bvc3RfbWV0YSgkaWQsJGssdHJ1ZSk7IGlmKCR2IT09JycpeyAkYz0kay4nPScuJHY7IGJyZWFrOyB9IH0KICAgICRwaz0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdG1ldGEgbSBKT0lOIHskUH1wb3N0cyBwIE9OIHAuSUQ9bS5wb3N0X2lkIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBXSEVSRSBtLm1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJyBBTkQgbS5tZXRhX3ZhbHVlPSVkIiwkaWQpKTsKICAgICRzMzA9KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPQUxFU0NFKFNVTShsLnByb2R1Y3RfcXR5KSwwKSBGUk9NIHskUH13Y19vcmRlcl9wcm9kdWN0X2xvb2t1cCBsIEpPSU4geyRQfXdjX29yZGVyX3N0YXRzIHMgT04gcy5vcmRlcl9pZD1sLm9yZGVyX2lkIEFORCBzLnN0YXR1cyBJTiAoJ3djLWNvbXBsZXRlZCcsJ3djLXByb2Nlc3NpbmcnKSBXSEVSRSBsLnByb2R1Y3RfaWQ9JWQgQU5EIGwuZGF0ZV9jcmVhdGVkPj1EQVRFX1NVQihOT1coKSxJTlRFUlZBTCA5MCBEQVkpIiwkaWQpKTsKICAgICRvW109WyRpZCwkcC0+Z2V0X3NrdSgpLCRwLT5nZXRfbmFtZSgpLChmbG9hdCkkcC0+Z2V0X3JlZ3VsYXJfcHJpY2UoKSwoZmxvYXQpJHAtPmdldF9zYWxlX3ByaWNlKCksJHAtPmdldF9zdG9ja19xdWFudGl0eSgpLCRwLT5nZXRfc3RvY2tfc3RhdHVzKCksJGMsJHBrLCRzMzAsZ2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19keWR6aW9fc2VpbWEnLHRydWUpLCRwLT5nZXRfd2VpZ2h0KCldOyB9CiAgaWYoaXNzZXQoJGlkc1swXSkpeyBmb3JlYWNoKGdldF9wb3N0X21ldGEoJG9bMF1bMF0/PyRpZHNbMF0pIGFzICRrPT4kdil7IGlmKHByZWdfbWF0Y2goJy9jb3N0fHNhdmlrfGthaW58cHJpY2V8dmZffHRpZWsvaScsJGspKSAkbWV0YXNbJGtdPSR2WzBdOyB9IH0KICAkclsnbiddPWNvdW50KCRvKTsgJHJbJ28nXT0kbzsgJHJbJ21ldGFzX3B2eiddPSRtZXRhczsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-071912';
const GKEY='ps_s1824e';
const PHASES=["1"];
const OUT='analize/s1824_e.json';
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
