process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzg5YSBQcmFnbWEgbGFpc2thcyBidWhhbHRlcmVpIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc4OWEnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDEyMCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzg5YSddOwogIHRyeXsKICAgIC8vIDEuIHByYWdtYSBmYWlsYWkKICAgICRmPVtdOyBmb3JlYWNoKGFycmF5X21lcmdlKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKnByYWdtYSonKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy8qcHJhZ21hKicpLGdsb2IoV1BfUExVR0lOX0RJUi4nLypwcmFnbWEqLyoucGhwJyksZ2xvYihXUF9QTFVHSU5fRElSLicvKnByYWdtYSovaW5jbHVkZXMvKi5waHAnKSkgYXMgJHgpeyAkZltdPXN0cl9yZXBsYWNlKEFCU1BBVEgsJycsJHgpLihpc19maWxlKCR4KT8nICcuZmlsZXNpemUoJHgpLidCICcuZGF0ZSgnWS1tLWQnLGZpbGVtdGltZSgkeCkpOicgRElSJyk7IH0gJHJbJ2ZhaWxhaSddPSRmOwogICAgJGFjdD0oYXJyYXkpZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKTsgJHJbJ2FrdHl2dXNfcGx1Z2luYWlfcHJhZ21hJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigkYWN0LGZuKCRwKT0+c3RyaXBvcygkcCwncHJhZ21hJykhPT1mYWxzZSkpOwogICAgLy8gMi4gb3BjaWpvcwogICAgJG89JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsIExFRlQob3B0aW9uX3ZhbHVlLDYwMCkgdiBGUk9NIHskUH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyVwcmFnbWElJyBPUiBvcHRpb25fbmFtZSBMSUtFICclYXVkYWMlJyBPUkRFUiBCWSBvcHRpb25fbmFtZSIsQVJSQVlfQSk7ICRyWydvcGNpam9zJ109JG87CiAgICAvLyAzLiBjcm9uCiAgICAkY3I9X2dldF9jcm9uX2FycmF5KCk7ICRjPVtdOyBmb3JlYWNoKCRjciBhcyAkdHM9PiRob29rcyl7IGZvcmVhY2goJGhvb2tzIGFzICRoPT4kZXYpeyBpZihzdHJpcG9zKCRoLCdwcmFnbWEnKSE9PWZhbHNlfHxzdHJpcG9zKCRoLCdidWhhbCcpIT09ZmFsc2V8fHN0cmlwb3MoJGgsJ2F1ZGFjJykhPT1mYWxzZSl7IGZvcmVhY2goJGV2IGFzICRlKXsgJGNbXT0kaC4nIEAgJy53cF9kYXRlKCdZLW0tZCBIOmknLCR0cykuJyBzY2hlZD0nLigkZVsnc2NoZWR1bGUnXT86J29uY2UnKTsgfSB9IH0gfSAkclsnY3JvbiddPSRjOwogICAgLy8gNC4ga29kYXM6IGdyZXAgYWRkX2FjdGlvbi9jcm9uL3dwX21haWwKICAgICRzcmM9W107IGZvcmVhY2goYXJyYXlfbWVyZ2UoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qcHJhZ21hKi5waHAnKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy8qcHJhZ21hKi8qLnBocCcpLGdsb2IoV1BfUExVR0lOX0RJUi4nLypwcmFnbWEqL2luY2x1ZGVzLyoucGhwJykpIGFzICR4KXsgZm9yZWFjaChmaWxlKCR4KSBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvVmVyc2lvbjp8d3Bfc2NoZWR1bGV8YWRkX2FjdGlvblwofHdwX21haWxcKHxhdWRhY3xwcm9kdWN0aW9ufGNvbnN0IHxmdW5jdGlvbiAoc2VuZHxzaXVzdGl8Y3JvbnxydW58ZWtzcG9ydCkvaScsJGwpKSAkc3JjW109YmFzZW5hbWUoJHgpLic6Jy4oJGkrMSkuJyAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMjIwKSk7IH0gfSAkclsna29kYXMnXT1hcnJheV9zbGljZSgkc3JjLDAsODApOwogICAgLy8gNS4gbGVudGVsZXMKICAgICRyWydsZW50ZWxlcyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICclcHJhZ21hJSciKTsKICAgIGZvcmVhY2goJHJbJ2xlbnRlbGVzJ10gYXMgJHQpeyAkclsndF8nLiR0XT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00gYCR0YCBPUkRFUiBCWSAxIERFU0MgTElNSVQgOCIsQVJSQVlfQSk7IH0KICAgIC8vIDYuIFdQIE1haWwgU01UUCBsb2cKICAgICRtbD0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAnJXdwbWFpbHNtdHAlJyIpOyAkclsnd3BtYWlsc210cF9sZW50ZWxlcyddPSRtbDsKICAgIGZvcmVhY2goJG1sIGFzICR0KXsgJGNvbHM9JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIGAkdGAiKTsgaWYoaW5fYXJyYXkoJ3Blb3BsZScsJGNvbHMpfHxpbl9hcnJheSgnc3ViamVjdCcsJGNvbHMpKXsgJHJbJ21sXycuJHRdPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSBgJHRgIFdIRVJFICIuKGluX2FycmF5KCdwZW9wbGUnLCRjb2xzKT8icGVvcGxlIExJS0UgJyVhdWRhYyUnIjoic3ViamVjdCBMSUtFICclcmFnbWElJyIpLiIgT1JERVIgQlkgMSBERVNDIExJTUlUIDEwIixBUlJBWV9BKTsgfSBlbHNlICRyWydtbF9jb2xzXycuJHRdPSRjb2xzOyB9CiAgICAvLyA3LiBwc19lbWFpbF9qb2JzIC8gZXZlbnQgbG9nIHN1IGF1ZGFjCiAgICAkclsnZW1haWxfam9icyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLGZsb3cscmVjaXBpZW50X2VtYWlsLHN1YmplY3Qsc3RhdHVzLHNlbnRfYXQsY3JlYXRlZF9hdCBGUk9NIHskUH1wc19lbWFpbF9qb2JzIFdIRVJFIHJlY2lwaWVudF9lbWFpbCBMSUtFICclYXVkYWMlJyBPUiBzdWJqZWN0IExJS0UgJyVyYWdtYSUnIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMTAiLEFSUkFZX0EpOwogICAgLy8gOC4gcGhwIGxvZyBlaWx1dGVzIGFwaWUgcHJhZ21hCiAgICAkbGc9ZGlybmFtZShBQlNQQVRIKS4nL2xvZ3MvcGhwX2Vycm9yLmxvZyc7ICRoPVtdOyBpZihpc19yZWFkYWJsZSgkbGcpKXsgJGZwPWZvcGVuKCRsZywncicpOyB3aGlsZSgoJGw9ZmdldHMoJGZwKSkhPT1mYWxzZSl7IGlmKHN0cmlwb3MoJGwsJ3ByYWdtYScpIT09ZmFsc2V8fHN0cmlwb3MoJGwsJ2F1ZGFjJykhPT1mYWxzZSkgJGhbXT1tYl9zdWJzdHIodHJpbSgkbCksMCwyNDApOyB9IGZjbG9zZSgkZnApOyB9ICRyWydwaHBfbG9nJ109YXJyYXlfc2xpY2UoJGgsLTE1KTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-091104';
const GKEY='ps_s1789a';
const PHASES=["1"];
const OUT='analize/s1789p_a.json';
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
