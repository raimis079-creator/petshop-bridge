process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTQgcnVuIGUzciDigJQgUkVDT04gMiAodGlrIHNrYWl0eW1hcykgIzI6IFZlbmlwYWsgcGx1Z2lubyBwaWNrdXAgZnVua2Npam9zIChmZXRjaC9jYWNoZSwgc3RvcmUsIHJlc29sdmUpICsgZGlzcGF0Y2ggYWRyZXNvIMWhYWx0aW5pczsgUGV0c2hvcF9EZXNrOjp2ZW5pcGFrX3JlZ2lzdHJ1b3RpL3NpdW50b3Nfa2xhaWRhL3NpdW50b3Nfa29kYXM7IExQIHBhcmNlbCBlcnJvciBoYW5kbGluZyArIExwT3JkZXJTdGF0dXM7IExQIHRlcm1pbmFsxbMgbGVudGVsxJdzIGR5ZGlzOyAjMzU0MTYga2xhaWRvcyBtZXRhLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19lM3InXSkpIHJldHVybjsKICAkbz1hcnJheSgndic9PidTMTYxNCBlM3InKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyBzZXRfdGltZV9saW1pdCgyODApOwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkc3JjbT1mdW5jdGlvbigkY2xzLCRtLCRtYXg9ODApeyB0cnl7ICRyPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCRjbHMsJG0pOyAkZj1maWxlKCRyLT5nZXRGaWxlTmFtZSgpKTsgJGE9JHItPmdldFN0YXJ0TGluZSgpLTE7ICRuPW1pbigkbWF4LCRyLT5nZXRFbmRMaW5lKCktJGEpOyByZXR1cm4gYXJyYXkoJ2YnPT5iYXNlbmFtZSgkci0+Z2V0RmlsZU5hbWUoKSkuJzonLiRyLT5nZXRTdGFydExpbmUoKS4nLScuJHItPmdldEVuZExpbmUoKSwnc3JjJz0+YXJyYXlfbWFwKGZ1bmN0aW9uKCRsKXsgcmV0dXJuIHJ0cmltKG1iX3N1YnN0cigkbCwwLDI0MCkpOyB9LGFycmF5X3NsaWNlKCRmLCRhLCRuKSkpOyB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgcmV0dXJuICdFUlIgJy4kZS0+Z2V0TWVzc2FnZSgpOyB9IH07CiAgJHNyY2Y9ZnVuY3Rpb24oJGZuLCRtYXg9NjApeyB0cnl7ICRyPW5ldyBSZWZsZWN0aW9uRnVuY3Rpb24oJGZuKTsgJGY9ZmlsZSgkci0+Z2V0RmlsZU5hbWUoKSk7ICRhPSRyLT5nZXRTdGFydExpbmUoKS0xOyAkbj1taW4oJG1heCwkci0+Z2V0RW5kTGluZSgpLSRhKTsgcmV0dXJuIGFycmF5KCdmJz0+YmFzZW5hbWUoJHItPmdldEZpbGVOYW1lKCkpLic6Jy4kci0+Z2V0U3RhcnRMaW5lKCkuJy0nLiRyLT5nZXRFbmRMaW5lKCksJ3NyYyc9PmFycmF5X21hcChmdW5jdGlvbigkbCl7IHJldHVybiBydHJpbShtYl9zdWJzdHIoJGwsMCwyNDApKTsgfSxhcnJheV9zbGljZSgkZiwkYSwkbikpKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7IHJldHVybiAnRVJSICcuJGUtPmdldE1lc3NhZ2UoKTsgfSB9OwogICRsaW5lcz1mdW5jdGlvbigkZmlsZSwkYSwkYil7ICRmPUBmaWxlKCRmaWxlKTsgaWYoISRmKSByZXR1cm4gJ27El3JhJzsgcmV0dXJuIGFycmF5X21hcChmdW5jdGlvbigkbCl7IHJldHVybiBydHJpbShtYl9zdWJzdHIoJGwsMCwyNDApKTsgfSxhcnJheV9zbGljZSgkZiwkYS0xLCRiLSRhKzEpKTsgfTsKICB0cnl7CiAgICAkdnA9V1BfUExVR0lOX0RJUi4nL3djLXZlbmlwYWstc2hpcHBpbmcnOyAkbHA9V1BfUExVR0lOX0RJUi4nL3dvby1saXRodWFuaWFwb3N0LW1haW4nOwogICAgJG9bJ3ZwX2ZldGNoX2Z1bmNzJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihnZXRfZGVmaW5lZF9mdW5jdGlvbnMoKVsndXNlciddLGZ1bmN0aW9uKCRmKXsgcmV0dXJuIHN0cnBvcygkZiwndmVuaXBhaycpPT09MDsgfSkpOwogICAgZm9yZWFjaCgkb1sndnBfZmV0Y2hfZnVuY3MnXSBhcyAkZm4peyAkb1sndnBfZm5fJy4kZm5dPSRzcmNmKCRmbiw0NSk7IH0KICAgICRvWyd2cF9kaXNwYXRjaF80NjBfNTcwJ109JGxpbmVzKCR2cC4nL2FkbWluL2NsYXNzLXdvb2NvbW1lcmNlLXNob3B1cC12ZW5pcGFrLXNoaXBwaW5nLWFkbWluLWRpc3BhdGNoLnBocCcsNDU1LDU3NSk7CiAgICAkb1sndnBfZGlzcGF0Y2hfMjYwXzM0MCddPSRsaW5lcygkdnAuJy9hZG1pbi9jbGFzcy13b29jb21tZXJjZS1zaG9wdXAtdmVuaXBhay1zaGlwcGluZy1hZG1pbi1kaXNwYXRjaC5waHAnLDI2MCwzNDApOwogICAgZm9yZWFjaChhcnJheSgndmVuaXBha19yZWdpc3RydW90aScsJ3NpdW50b3Nfa2xhaWRhJywnc2l1bnRvc19rb2RhcycsJ3NpdW50dV9idWtsZScpIGFzICRtKXsgJG9bJ2Rlc2tfJy4kbV09JHNyY20oJ1BldHNob3BfRGVzaycsJG0sOTApOyB9CiAgICAkb1snbHBfZXJyXzk3MF8xMDEwJ109JGxpbmVzKCRscC4nL2FkbWluL2NsYXNzLXdvby1saXRodWFuaWFwb3N0LWFkbWluLW9yZGVyLXNlcnZpY2UucGhwJyw5NjAsMTAxMCk7CiAgICAkb1snbHBfY3JlYXRlXzY4MF83NzAnXT0kbGluZXMoJGxwLicvYWRtaW4vY2xhc3Mtd29vLWxpdGh1YW5pYXBvc3QtYWRtaW4tb3JkZXItc2VydmljZS5waHAnLDY4NSw3NzApOwogICAgJG9bJ2xwX2NyZWF0ZV84MDBfODUwJ109JGxpbmVzKCRscC4nL2FkbWluL2NsYXNzLXdvby1saXRodWFuaWFwb3N0LWFkbWluLW9yZGVyLXNlcnZpY2UucGhwJyw4MDAsODUwKTsKICAgICRvWydscF9wdWJsaWNfNDgwXzUxNSddPSRsaW5lcygkbHAuJy9wdWJsaWMvY2xhc3Mtd29vLWxpdGh1YW5pYXBvc3QtcHVibGljLnBocCcsNDc4LDUxNSk7CiAgICAkb1snbHBfdGVybWluYWxhaV9uJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH13b29fbGl0aHVhbmlhcG9zdF91bmlzZW5kX3Rlcm1pbmFscyIpOyAkb1snbHBfdGVybWluYWxhaV9sdCddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9d29vX2xpdGh1YW5pYXBvc3RfdW5pc2VuZF90ZXJtaW5hbHMgV0hFUkUgY291bnRyeV9jb2RlPSdMVCciKTsgJG9bJ2xwX3Rlcm1pbmFsYWlfcHZ6J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdGVybWluYWxfaWQsbmFtZSxhZGRyZXNzLGNpdHkgRlJPTSB7JHB9d29vX2xpdGh1YW5pYXBvc3RfdW5pc2VuZF90ZXJtaW5hbHMgV0hFUkUgY291bnRyeV9jb2RlPSdMVCcgTElNSVQgMyIsQVJSQVlfQSk7CiAgICAkb1snbHBfbHBleHByZXNzX24nXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXdvb19saXRodWFuaWFwb3N0X2xwZXhwcmVzc190ZXJtaW5hbHMiKTsKICAgICRvWyd2cF90cmFuc2llbnRzJ109JHdwZGItPmdldF9jb2woIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyV0cmFuc2llbnQldmVuaXBhayUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyV2ZW5pcGFrX3BpY2t1cCUnIExJTUlUIDIwIik7CiAgICAkeD13Y19nZXRfb3JkZXIoMzU0MTYpOyAkb1snMzU0MTYnXT1hcnJheSgnc3QnPT4keC0+Z2V0X3N0YXR1cygpLCdlcnInPT4keC0+Z2V0X21ldGEoJ193b29fbGl0aHVhbmlhcG9zdF9wYXJjZWxfY3JlYXRlX2Vycm9yJyksJ3N0dic9PiR4LT5nZXRfbWV0YSgnX3dvb19saXRodWFuaWFwb3N0X3NoaXBwaW5nX3N0YXR1c192YWx1ZScpLCd0ZXJtJz0+JHgtPmdldF9tZXRhKCdfd29vX2xpdGh1YW5pYXBvc3RfbHBleHByZXNzX3Rlcm1pbmFsJyksJ3Rlcm1faWQnPT4keC0+Z2V0X21ldGEoJ193b29fbGl0aHVhbmlhcG9zdF9scGV4cHJlc3NfdGVybWluYWxfaWQnKSwnc21fbWV0YSc9PmFycmF5X21hcChmdW5jdGlvbigkcyl7IHJldHVybiAkcy0+Z2V0X21ldGFfZGF0YSgpOyB9LCR4LT5nZXRfc2hpcHBpbmdfbWV0aG9kcygpKSk7CiAgICAkeD13Y19nZXRfb3JkZXIoMzU0NDIpOyAkb1snMzU0NDInXT1hcnJheSgncHAnPT4keC0+Z2V0X21ldGEoJ3ZlbmlwYWtfcGlja3VwX3BvaW50JyksJ3BwZCc9PiR4LT5nZXRfbWV0YSgndmVuaXBha19waWNrdXBfcG9pbnRfZGF0YScpLCd2c29kJz0+JHgtPmdldF9tZXRhKCd2ZW5pcGFrX3NoaXBwaW5nX29yZGVyX2RhdGEnKSwnc21fbWV0YSc9PmFycmF5X21hcChmdW5jdGlvbigkcyl7IHJldHVybiAkcy0+Z2V0X21ldGFfZGF0YSgpOyB9LCR4LT5nZXRfc2hpcHBpbmdfbWV0aG9kcygpKSk7CiAgICAkeD13Y19nZXRfb3JkZXIoMzU0MzUpOyAkb1snMzU0MzVfdnNvZCddPSR4LT5nZXRfbWV0YSgndmVuaXBha19zaGlwcGluZ19vcmRlcl9kYXRhJyk7CiAgICAkb1snZGFyYmFsYXVraXNfdmVyc2lqYSddPVBldHNob3BfRGFyYmFsYXVraXM6OlZFUlNJSkE7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LDk5KTsK';
const VER='dep-151556';
const GKEY='ps_e3r';
const PHASES=["R"];
const OUT='analize/s1614_e3r.json';
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
