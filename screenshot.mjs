process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzUgdGY0IOKAlCBzdWt1cnRpIE1uTSDigJ5LcmFpa28gZMSXxb7ElyA4IHZudC4gVE9GVSBCZWxvQ2F0IjogdmFpa2FpPTE3IFRPRlUgdmllbmV0aW5pxbMsIG1pbj1tYXg9OCwgcGVyLWl0ZW0ga2Fpbm9zLCBrYXQuIFJJTktJTklBSStuYXVqYSDigJ5LcmFpa28gcmlua2luaWFpIisxMDcuIFBhdGlrcmEgcmVhZC1iYWNrLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTYzNXRmNCddKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE2MzUgdGY0Jyk7CiAgJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgaWYoZ2V0X3BhZ2VfYnlfcGF0aCgna3JhaWtvLWRlemUtOC12bnQtdG9mdS1iZWxvY2F0JyxPQkpFQ1QsJ3Byb2R1Y3QnKSl7ICRvWydqYXVfeXJhJ109MTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICAkVkFJS0FJPWFycmF5KDE3NzA3LDE3NzA0LDE3NzAxLDE3Njk4LDE3Njk1LDE3NjkyLDE3Njg5LDE3Njg2LDE3NjgzLDE3NjgwLDE3Njc3LDE3Njc0LDE3NjcxLDE3NjY4LDE3NjY1LDE3NjYyLDE3NjU5KTsKICAvLyBrYXRlZ29yaWphIOKAnktyYWlrbyByaW5raW5pYWkiIHBvIFJJTktJTklBSSg2NzkpCiAgJHQ9Z2V0X3Rlcm1fYnkoJ25hbWUnLCdLcmFpa28gcmlua2luaWFpJywncHJvZHVjdF9jYXQnKTsKICBpZighJHQpeyAkcj13cF9pbnNlcnRfdGVybSgnS3JhaWtvIHJpbmtpbmlhaScsJ3Byb2R1Y3RfY2F0JyxhcnJheSgncGFyZW50Jz0+Njc5KSk7ICRrdD1pc193cF9lcnJvcigkcik/MDokclsndGVybV9pZCddOyB9IGVsc2UgJGt0PSR0LT50ZXJtX2lkOwogICRvWydrcmFpa29fcmlua19rYXQnXT0ka3Q7CiAgJHByPW5ldyBXQ19Qcm9kdWN0X01peF9hbmRfTWF0Y2goKTsKICAkcHItPnNldF9uYW1lKCdLcmFpa28gZMSXxb7ElywgOCB2bnQuIOKAlCBUT0ZVIEJlbG9DYXQga3JhaWthcyBrYXTEl21zLCA2IGwgKDIsNSBrZyksIDIgbW0gZ3JhbnVsxJdzJyk7CiAgJHByLT5zZXRfc2x1Zygna3JhaWtvLWRlemUtOC12bnQtdG9mdS1iZWxvY2F0Jyk7CiAgJHByLT5zZXRfc3RhdHVzKCdwdWJsaXNoJyk7ICRwci0+c2V0X2NhdGFsb2dfdmlzaWJpbGl0eSgndmlzaWJsZScpOwogICRwci0+c2V0X3Nob3J0X2Rlc2NyaXB0aW9uKCdUT0ZVIEJlbG9DYXQg4oCUIG5hdMWrcmFsdXMgc29qb3MgcGx1b8WhdG8ga3JhaWthcywgbmVkdWxrYW50aXMsIHN1xaFva2FudGlzLiBTdXNpcmluayBzYXZvIDggcGFrdW/EjWnFsyBkxJfFvsSZIGnFoSB2aXPFsyBrdmFwxbMg4oCUIGthaW5hIHBhZ2FsIHBhc2lyaW5raW3EhS4nKTsKICBpZihtZXRob2RfZXhpc3RzKCRwciwnc2V0X21pbl9jb250YWluZXJfc2l6ZScpKSAkcHItPnNldF9taW5fY29udGFpbmVyX3NpemUoOCk7CiAgaWYobWV0aG9kX2V4aXN0cygkcHIsJ3NldF9tYXhfY29udGFpbmVyX3NpemUnKSkgJHByLT5zZXRfbWF4X2NvbnRhaW5lcl9zaXplKDgpOwogIGlmKG1ldGhvZF9leGlzdHMoJHByLCdzZXRfcHJpY2VkX3Blcl9wcm9kdWN0JykpICRwci0+c2V0X3ByaWNlZF9wZXJfcHJvZHVjdCh0cnVlKTsKICBpZihtZXRob2RfZXhpc3RzKCRwciwnc2V0X3BhY2tpbmdfbW9kZScpKSAkcHItPnNldF9wYWNraW5nX21vZGUoJ3RvZ2V0aGVyJyk7CiAgaWYobWV0aG9kX2V4aXN0cygkcHIsJ3NldF93ZWlnaHRfY3VtdWxhdGl2ZScpKSAkcHItPnNldF93ZWlnaHRfY3VtdWxhdGl2ZSh0cnVlKTsKICBpZihtZXRob2RfZXhpc3RzKCRwciwnc2V0X2NvbnRlbnRfc291cmNlJykpICRwci0+c2V0X2NvbnRlbnRfc291cmNlKCdwcm9kdWN0cycpOwogICRpZD0kcHItPnNhdmUoKTsgJG9bJ2lkJ109JGlkOwogIC8vIG1ldGEgc3VkZXJpbmltYXMgc3UgMzQ5NDcgxaFhYmxvbnUgKGtvIHNldHRlcmlhaSBuZXBhZGVuZ8SXKQogIGZvcmVhY2goYXJyYXkoJ19tbm1fbWluX2NvbnRhaW5lcl9zaXplJz0+OCwnX21ubV9tYXhfY29udGFpbmVyX3NpemUnPT44LCdfbW5tX3Blcl9wcm9kdWN0X3ByaWNpbmcnPT4neWVzJywnX21ubV9wYWNraW5nX21vZGUnPT4ndG9nZXRoZXInLCdfbW5tX3dlaWdodF9jdW11bGF0aXZlJz0+J3llcycsJ19tbm1fY29udGVudF9zb3VyY2UnPT4ncHJvZHVjdHMnLCdfbW5tX2xheW91dF9vdmVycmlkZSc9PidubycsJ19tbm1fbGF5b3V0X3N0eWxlJz0+J3RhYnVsYXInLCdfbW5tX2FkZF90b19jYXJ0X2Zvcm1fbG9jYXRpb24nPT4nZGVmYXVsdCcpIGFzICRrPT4kdikgdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJGssJHYpOwogIC8vIHZhaWthaQogICR0Yj0kcC4nd2NfbW5tX2NoaWxkX2l0ZW1zJzsgJGk9MTsKICBmb3JlYWNoKCRWQUlLQUkgYXMgJHBpZCl7ICR3cGRiLT5pbnNlcnQoJHRiLGFycmF5KCdwcm9kdWN0X2lkJz0+JHBpZCwnY29udGFpbmVyX2lkJz0+JGlkLCdtZW51X29yZGVyJz0+JGkrKykpOyB9CiAgd3Bfc2V0X29iamVjdF90ZXJtcygkaWQsYXJyYXkoNjc5LChpbnQpJGt0LDEwNyksJ3Byb2R1Y3RfY2F0Jyk7CiAgd3Bfc2V0X29iamVjdF90ZXJtcygkaWQsYXJyYXkoJ0JlbG9DYXQnKSwncHJvZHVjdF9icmFuZCcpOwogIHVwZGF0ZV9wb3N0X21ldGEoJGlkLCdfcHNfc2FuZGVsaXMnLCdiZWxjb3JfdG9mdScpOwogIGNsZWFuX3Bvc3RfY2FjaGUoJGlkKTsgd3BfY2FjaGVfZmx1c2goKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCd3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzJykpIHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJGlkKTsKICAvLyBwYXRpa3JhCiAgJGM9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsKICAkb1sncG8nXT1hcnJheSgndGlwYXMnPT4kYy0+Z2V0X3R5cGUoKSwnc3RhdHVzJz0+JGMtPmdldF9zdGF0dXMoKSwndXJsJz0+Z2V0X3Blcm1hbGluaygkaWQpLAogICAgJ3ZhaWt1Jz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR0Yn0gV0hFUkUgY29udGFpbmVyX2lkPXskaWR9IiksCiAgICAnbWluJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19tbm1fbWluX2NvbnRhaW5lcl9zaXplJyx0cnVlKSwnbWF4Jz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19tbm1fbWF4X2NvbnRhaW5lcl9zaXplJyx0cnVlKSwKICAgICdwZXJfaXRlbSc9PmdldF9wb3N0X21ldGEoJGlkLCdfbW5tX3Blcl9wcm9kdWN0X3ByaWNpbmcnLHRydWUpLCdrYXQnPT53cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfY2F0JyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpKTsKICAkcj13cF9yZW1vdGVfZ2V0KGdldF9wZXJtYWxpbmsoJGlkKSxhcnJheSgndGltZW91dCc9PjYwLCdzc2x2ZXJpZnknPT5mYWxzZSkpOyAkaD0oc3RyaW5nKXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKICAkb1snZnJvbnRlbmQnXT1hcnJheSgnY29kZSc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSwndG9mdV9rb3J0ZWxlc2UnPT5zdWJzdHJfY291bnQoJGgsJ1RPRlUgQmVsb0NhdCcpLCdpX2RlemVfbXlndHVrYWknPT5zdWJzdHJfY291bnQoJGgsJ8SuIETElsW9xJgnKStzdWJzdHJfY291bnQoJGgsJ8SuIGTEl8W+xJknKSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='dep-101322';
const GKEY='ps_s1635tf4';
const PHASES=["T6"];
const OUT='analize/s1635_tf4.json';
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
