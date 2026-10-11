process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzc2ZSBFeGNsdXNpb24gTWVkaXRlcnJhbmVvIDEya2cgbmF1am9zIGthaW5vcyDigJQgMSBkcnksIDIgZGVwbG95LCAzIHZlcmlmeStmZWVkcywgOSByb2xsYmFjayAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NzZlJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNzApOyAkcGg9KHN0cmluZykkX0dFVFsncHNfczE3NzZlJ107ICRyPVsndic9PidTMTc3NmUnLCdwaCc9PiRwaF07IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsKICAkTj1bMjA1Mzc9Pic1NS4xNCcsMjExMTk9Pic1Mi45OCcsMjExNDM9Pic1MS44OCcsMjExNDc9Pic1MS40NCcsMjExMzM9Pic1MS4wMicsMjExMTU9Pic1MS4wMiddOwogIHRyeXsKICBpZigkcGg9PT0nMScpewogICAgZm9yZWFjaCgkTiBhcyAkaWQ9PiRucCl7ICRwPXdjX2dldF9wcm9kdWN0KCRpZCk7ICRyWydkYWJhciddWyRpZF09W21iX3N1YnN0cigkcC0+Z2V0X25hbWUoKSwwLDYwKSwkcC0+Z2V0X3JlZ3VsYXJfcHJpY2UoJ2VkaXQnKSwkcC0+Z2V0X3NhbGVfcHJpY2UoJ2VkaXQnKSwkcC0+Z2V0X3ByaWNlKCksJG5wLCRwLT5nZXRfc3RvY2tfc3RhdHVzKCksZ2V0X3Bvc3RfbWV0YSgkaWQsJ192Zl9jb3N0Jyx0cnVlKV07IH0KICAgICRyWydwYWthaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBvc3RfaWQsIG1ldGFfa2V5LCBtZXRhX3ZhbHVlIEZST00geyRQfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5IExJS0UgJyVkcCUnIEFORCBtZXRhX3ZhbHVlIElOICgnIi5pbXBsb2RlKCInLCciLGFycmF5X2tleXMoJE4pKS4iJykgTElNSVQgMjAiLEFSUkFZX0EpOwogICAgJHJbJ2lzdG9yaWphX2xlbnRlbGUnXT0kd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAneyRQfXBzX2Zha3Rfa2Fpbm9zJyIpOwogICAgaWYoJHJbJ2lzdG9yaWphX2xlbnRlbGUnXSkgJHJbJ2lzdF9wYXNrJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcHJla2VfaWQsIG51b19hdCwga2FpbmFfY3QsIHJlZ3VsaWFyaV9jdCwgYWtjaWpvamUsIHNhbHRpbmlzIEZST00geyRQfXBzX2Zha3Rfa2Fpbm9zIFdIRVJFIHByZWtlX2lkIElOICgiLmltcGxvZGUoJywnLGFycmF5X2tleXMoJE4pKS4iKSBPUkRFUiBCWSBudW9fYXQgREVTQyBMSU1JVCAxMiIsQVJSQVlfQSk7CiAgfQogIGVsc2VpZigkcGg9PT0nMicpewogICAgJGJhaz1bXTsgZm9yZWFjaCgkTiBhcyAkaWQ9PiRucCl7ICRwPXdjX2dldF9wcm9kdWN0KCRpZCk7ICRiYWtbJGlkXT1bJHAtPmdldF9yZWd1bGFyX3ByaWNlKCdlZGl0JyksJHAtPmdldF9zYWxlX3ByaWNlKCdlZGl0JyldOyAkcC0+c2V0X3JlZ3VsYXJfcHJpY2UoJG5wKTsgJHAtPnNldF9zYWxlX3ByaWNlKCcnKTsgJHAtPnNhdmUoKTsgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkaWQpOyB9CiAgICBpZighZ2V0X29wdGlvbigncHNfczE3NzZfYmFrJykpIHVwZGF0ZV9vcHRpb24oJ3BzX3MxNzc2X2JhaycsWydhdCc9PmdtZGF0ZSgnWS1tLWQgSDppOnMnKSwna2Fpbm9zJz0+JGJha10sZmFsc2UpOwogICAgJHJbJ2JhayddPSRiYWs7CiAgfQogIGVsc2VpZigkcGg9PT0nMycpewogICAgZm9yZWFjaCgkTiBhcyAkaWQ9PiRucCl7IGNsZWFuX3Bvc3RfY2FjaGUoJGlkKTsgJHA9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgJHJbJ3BvJ11bJGlkXT1bJHAtPmdldF9yZWd1bGFyX3ByaWNlKCdlZGl0JyksJHAtPmdldF9wcmljZSgpLCRwLT5nZXRfcHJpY2UoKT09JG5wPydPSyc6J05FJ107IH0KICAgIGlmKGhhc19hY3Rpb24oJ3BzX2ZlZWRzX25ha3RpbmlzJykpeyAkdD1taWNyb3RpbWUodHJ1ZSk7IGRvX2FjdGlvbigncHNfZmVlZHNfbmFrdGluaXMnKTsgJHJbJ2ZlZWRzX3MnXT1yb3VuZChtaWNyb3RpbWUodHJ1ZSktJHQsMSk7IH0KICAgIGZvcmVhY2goWydrYWluYTI0JywnZ29vZ2xlJ10gYXMgJGYpeyAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSh3cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvZmVlZC8nLiRmLic/bmM9Jy50aW1lKCkpLFsnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3RpbWVvdXQnPT45MF0pKTsgZm9yZWFjaCgkTiBhcyAkaWQ9PiRucCl7ICRyWydmZWVkJ11bJGZdWyRpZF09KHN0cnBvcygkYiwkbnApIT09ZmFsc2UpPyd5cmEgJy4kbnA6J25lcmFzdGEnOyB9IH0KICAgIGlmKCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICd7JFB9cHNfZmFrdF9rYWlub3MnIikpICRyWydpc3QnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwcmVrZV9pZCwgbnVvX2F0LCBrYWluYV9jdCwgcmVndWxpYXJpX2N0LCBzYWx0aW5pcyBGUk9NIHskUH1wc19mYWt0X2thaW5vcyBXSEVSRSBwcmVrZV9pZCBJTiAoIi5pbXBsb2RlKCcsJyxhcnJheV9rZXlzKCROKSkuIikgT1JERVIgQlkgbnVvX2F0IERFU0MgTElNSVQgOCIsQVJSQVlfQSk7CiAgICAkdT13cF9yZW1vdGVfZ2V0KGdldF9wZXJtYWxpbmsoMjExMTkpLic/bmM9Jy50aW1lKCksWydzc2x2ZXJpZnknPT5mYWxzZSwndGltZW91dCc9PjMwXSk7ICRoPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCR1KTsgJHJbJ3B1c2xhcGlzXzIxMTE5J109c3RycG9zKCRoLCc1Miw5OCcpIT09ZmFsc2U/J3JvZG8gNTIsOTgnOiduZXJhc3RhJzsKICB9CiAgZWxzZWlmKCRwaD09PSc5Jyl7ICRiaz1nZXRfb3B0aW9uKCdwc19zMTc3Nl9iYWsnKTsgZm9yZWFjaCgoJGJrWydrYWlub3MnXT8/W10pIGFzICRpZD0+JHYpeyAkcD13Y19nZXRfcHJvZHVjdCgkaWQpOyAkcC0+c2V0X3JlZ3VsYXJfcHJpY2UoJHZbMF0pOyAkcC0+c2V0X3NhbGVfcHJpY2UoJHZbMV0pOyAkcC0+c2F2ZSgpOyB9ICRyWydncmF6aW50YSddPSRiazsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0pOwo=';
const VER='dep-191123';
const GKEY='ps_s1776e';
const PHASES=["3"];
const OUT='out/s1776e3.json';
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
