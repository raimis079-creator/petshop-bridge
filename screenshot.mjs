process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcwNWgnXSkpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRmPSRfR0VUWydwc19zMTcwNWgnXTsgJHI9WydmJz0+JGZdOwogICRpZHM9YXJyYXlfbWFwKCdpbnR2YWwnLCR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBBTkQgbWV0YV92YWx1ZT0nYW1icm9zaWEnIikpOwogICRiYWs9Z2V0X29wdGlvbigncHNfczE3MDVfYW1icm9zaWFfYmFrJyk7CiAgaWYoJGY9PT0nMicpeyAvLyB2eWtkeXRpCiAgICBpZighJGJhayl7ICRiYWs9W107IGZvcmVhY2goJGlkcyBhcyAkaWQpICRiYWtbJGlkXT1bJ3N0b2NrJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19zdG9jaycsdHJ1ZSksJ293bic9PmdldF9wb3N0X21ldGEoJGlkLCdfb3duX3N0b2NrX3F0eScsdHJ1ZSldOyB1cGRhdGVfb3B0aW9uKCdwc19zMTcwNV9hbWJyb3NpYV9iYWsnLCRiYWssZmFsc2UpOyB9CiAgICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJG93bj0oaW50KWdldF9wb3N0X21ldGEoJGlkLCdfb3duX3N0b2NrX3F0eScsdHJ1ZSk7ICRzdD0oaW50KWdldF9wb3N0X21ldGEoJGlkLCdfc3RvY2snLHRydWUpOwogICAgICBpZigkb3duPD0wKSBjb250aW51ZTsKICAgICAgdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJ19zdG9jaycsJHN0KyRvd24pOyB1cGRhdGVfcG9zdF9tZXRhKCRpZCwnX293bl9zdG9ja19xdHknLDApOwogICAgICBpZihmdW5jdGlvbl9leGlzdHMoJ3BzX3NvdXJjZXNfc3luY19zYXVnaWFpJykpIHBzX3NvdXJjZXNfc3luY19zYXVnaWFpKCRpZCk7CiAgICAgIHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJGlkKTsgY2xlYW5fcG9zdF9jYWNoZSgkaWQpOyAkclsna2Vpc3RhJ11bXT0kaWQ7IH0KICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfY2xlYXJfY2FjaGUnKSkgd3BfY2FjaGVfY2xlYXJfY2FjaGUoKTsKICB9CiAgaWYoJGY9PT0nMycgJiYgJGJhayl7IGZvcmVhY2goJGJhayBhcyAkaWQ9PiRiKXsgJHE9KGludCkkYlsnb3duJ10rKGludCkkYlsnc3RvY2snXTsgJGM9Z2V0X3Bvc3RfbWV0YSgkaWQsJ19jb3N0X3ByaWNlJyx0cnVlKTsKICAgICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJVUERBVEUgeyRwfXBzX3NvdXJjZXMgU0VUIHN0b2NrX3F0eT0lZCwgY29zdF9uZXQ9SUYoY29zdF9uZXQgSVMgTlVMTCBPUiBjb3N0X25ldD0wLCVzLGNvc3RfbmV0KSwgaXNfc2VsbGFibGU9MSwgaXNfYWN0aXZlPTEgV0hFUkUgcHJvZHVjdF9pZD0lZCBBTkQgc291cmNlPSdhbWJyb3NpYSciLCRxLCRjLCRpZCkpOwogICAgICB1cGRhdGVfcG9zdF9tZXRhKCRpZCwnX3N0b2NrJywkcSk7IHVwZGF0ZV9wb3N0X21ldGEoJGlkLCdfb3duX3N0b2NrX3F0eScsMCk7CiAgICAgIHBzX3NvdXJjZXNfc3luY19zYXVnaWFpKCRpZCk7IHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJGlkKTsgY2xlYW5fcG9zdF9jYWNoZSgkaWQpOwogICAgICAkclsncG8zJ11bJGlkXT1bJ21zJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19tYW5hZ2Vfc3RvY2snLHRydWUpLCdzcyc9PmdldF9wb3N0X21ldGEoJGlkLCdfc3RvY2tfc3RhdHVzJyx0cnVlKSwnc3RvY2snPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3N0b2NrJyx0cnVlKV07IH0KICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfY2xlYXJfY2FjaGUnKSkgd3BfY2FjaGVfY2xlYXJfY2FjaGUoKTsgfQogIGlmKCRmPT09JzknICYmICRiYWspeyBmb3JlYWNoKCRiYWsgYXMgJGlkPT4kYil7IHVwZGF0ZV9wb3N0X21ldGEoJGlkLCdfc3RvY2snLCRiWydzdG9jayddKTsgdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJ19vd25fc3RvY2tfcXR5JywkYlsnb3duJ10pOyBpZihmdW5jdGlvbl9leGlzdHMoJ3BzX3NvdXJjZXNfc3luY19zYXVnaWFpJykpIHBzX3NvdXJjZXNfc3luY19zYXVnaWFpKCRpZCk7IHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJGlkKTt9ICRyWydhdHN0YXR5dGEnXT1jb3VudCgkYmFrKTsgfQogICRzPVsnc3RvY2snPT4wLCdvd24nPT4wLCdpbnN0b2NrJz0+MF07CiAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICRzWydzdG9jayddKz0oaW50KWdldF9wb3N0X21ldGEoJGlkLCdfc3RvY2snLHRydWUpOyAkc1snb3duJ10rPShpbnQpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19vd25fc3RvY2tfcXR5Jyx0cnVlKTsgJHByPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCRwciYmJHByLT5pc19pbl9zdG9jaygpKSAkc1snaW5zdG9jayddKys7ICRyWyd3Y19xdHknXVskaWRdPSRwcj8kcHItPmdldF9zdG9ja19xdWFudGl0eSgpOm51bGw7IH0KICAkclsnc3VtYSddPSRzOyAkclsnbiddPWNvdW50KCRpZHMpOyAkclsnYmFrJ109JGJhaz9jb3VudCgkYmFrKTowOwogICRyWydzcmMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzb3VyY2UsIENPVU5UKCopIG4sIFNVTShzdG9ja19xdHkpIHEsIFNVTShpc19hY3RpdmUpIGEgRlJPTSB7JHB9cHNfc291cmNlcyBXSEVSRSBwcm9kdWN0X2lkIElOICgiLmltcGxvZGUoJywnLCRpZHMpLiIpIEdST1VQIEJZIDEiLEFSUkFZX0EpOwogICRyWydzcmNfZGV0J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcHJvZHVjdF9pZCwgc291cmNlLCBzdG9ja19xdHksIGNvc3RfbmV0LCBpc19hY3RpdmUsIGlzX3NlbGxhYmxlIEZST00geyRwfXBzX3NvdXJjZXMgV0hFUkUgcHJvZHVjdF9pZCBJTiAoMTk3MTUsMTk3NTEpIixBUlJBWV9BKTsKICAkclsnZm4nXT1mdW5jdGlvbl9leGlzdHMoJ3BzX3NvdXJjZXNfc3luY19zYXVnaWFpJyk7CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSwgMSk7Cg==';
const VER='dep-094240';
const GKEY='ps_s1705h';
const PHASES=["3"];
const OUT='analize/s1705_h3.json';
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
