process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzY5YSBwYWthcnRvdGluaWFpIGtsaWVudGFpICsgbGFpc2t1IHBvdmVpa2lzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc2OWEnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE1MCk7ICRyPVsndic9PidTMTc2OWEnXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkRUo9JFAuJ3BzX2VtYWlsX2pvYnMnOwogIHRyeXsKICAgICRTVD0iJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnIjsKICAgICRvPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLCBMT1dFUihiaWxsaW5nX2VtYWlsKSBlbSwgZGF0ZV9jcmVhdGVkX2dtdCBkLCB0b3RhbF9hbW91bnQgdCBGUk9NIHskUH13Y19vcmRlcnMgV0hFUkUgdHlwZT0nc2hvcF9vcmRlcicgQU5EIHN0YXR1cyBJTigkU1QpIEFORCBiaWxsaW5nX2VtYWlsPD4nJyBPUkRFUiBCWSBkYXRlX2NyZWF0ZWRfZ210IixBUlJBWV9BKTsKICAgICRyWydwaXJtYXNfdXpzJ109JG8/JG9bMF1bJ2QnXTpudWxsOyAkclsndXpzX3Zpc28nXT1jb3VudCgkbyk7CiAgICAkYnk9W107IGZvcmVhY2goJG8gYXMgJHgpeyAkYnlbJHhbJ2VtJ11dW109JHg7IH0KICAgICRyWydrbGllbnR1J109Y291bnQoJGJ5KTsgJHJlcD0wOyAkcmVwdT0wOyAkcmVwdD0wOyAkZ2FwPVtdOwogICAgZm9yZWFjaCgkYnkgYXMgJGVtPT4kTCl7IGlmKGNvdW50KCRMKT49Mil7ICRyZXArKzsgJHJlcHUrPWNvdW50KCRMKS0xOyBmb3IoJGk9MTskaTxjb3VudCgkTCk7JGkrKyl7ICRyZXB0Kz0kTFskaV1bJ3QnXTsgJGdhcFtdPXJvdW5kKChzdHJ0b3RpbWUoJExbJGldWydkJ10pLXN0cnRvdGltZSgkTFskaS0xXVsnZCddKSkvODY0MDAsMSk7fSB9IH0KICAgIHNvcnQoJGdhcCk7ICRyWydwYWthcnRvdGluaXVfa2xpZW50dSddPSRyZXA7ICRyWydwYWthcnRvdGluaXVfdXpzJ109JHJlcHU7ICRyWydwYWthcnRvdGluaXVfc3VtYSddPXJvdW5kKCRyZXB0LDIpOyAkclsndGFycGFzX2RfbWVkaWFuYSddPSRnYXA/JGdhcFtpbnRkaXYoY291bnQoJGdhcCksMildOm51bGw7CiAgICAvLyBzYXZhaXRlbWlzOiBkYWxpcyB1enNha3ltdSwga3VyaWUgeXJhIGtsaWVudG8gMisKICAgICRzZWVuPVtdOyAkd2s9W107IGZvcmVhY2goJG8gYXMgJHgpeyAkdz1kYXRlKCdtLWQnLHN0cnRvdGltZSgnbW9uZGF5IHRoaXMgd2Vlaycsc3RydG90aW1lKCR4WydkJ10pKSk7ICRrPWlzc2V0KCRzZWVuWyR4WydlbSddXSk/J2thcnQnOiduYXVqJzsgJHNlZW5bJHhbJ2VtJ11dPTE7ICR3a1skd11bJGtdPSgkd2tbJHddWyRrXT8/MCkrMTsgfSAkclsnc2F2YWl0ZXMnXT0kd2s7CiAgICAvLyBpc3RvcmluaWFpIGtsaWVudGFpCiAgICAkaXN0PW51bGw7IGZvcmVhY2goWydwc19pc3RfdXpzYWt5bWFpJywncHNfcmVsYXVuY2hfa29udGFrdGFpJ10gYXMgJHQpeyBpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAneyRQfSR0JyIpKXsgJGNvbHM9JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskUH0kdCIpOyBmb3JlYWNoKCRjb2xzIGFzICRjKXsgaWYocHJlZ19tYXRjaCgnI21haWwjaScsJGMpKXsgJGlzdFskdF09JGM7IGJyZWFrOyB9IH0gfSB9CiAgICAkclsnaXN0X2xlbnRlbGVzJ109JGlzdDsKICAgIGlmKCRpc3QpeyAkdD1hcnJheV9rZXlfZmlyc3QoJGlzdCk7ICRjPSRpc3RbJHRdOyAkb2xkPWFycmF5X2ZsaXAoYXJyYXlfbWFwKCdzdHJ0b2xvd2VyJywkd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIERJU1RJTkNUIExPV0VSKCRjKSBGUk9NIHskUH0kdCBXSEVSRSAkYzw+JyciKSkpOyAkbj0wOyBmb3JlYWNoKCRieSBhcyAkZW09PiRMKSBpZihpc3NldCgkb2xkWyRlbV0pKSAkbisrOyAkclsnbmF1amFfc3ZldGFpbmVfcGlya29fc2VuaV9rbGllbnRhaSddPSRuOyAkclsnc2VuaV9rb250YWt0YWknXT1jb3VudCgkb2xkKTsgfQogICAgLy8gbGFpc2thaSAtPiB1enNha3ltYWkgcGVyIDcgZC4KICAgICRzZW50PSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGZsb3csIExPV0VSKHJlY2lwaWVudF9lbWFpbCkgZW0sIHNlbnRfYXQgRlJPTSAkRUogV0hFUkUgc3RhdHVzPSdzZW50JyBBTkQgc2VudF9hdCBJUyBOT1QgTlVMTCBBTkQgcmVjaXBpZW50X2VtYWlsIE5PVCBMSUtFICclZ3l2dW5haS5sdCcgQU5EIHJlY2lwaWVudF9lbWFpbCBOT1QgTElLRSAnJXBldHNob3AubHQnIixBUlJBWV9BKTsKICAgICRmPVtdOyBmb3JlYWNoKCRzZW50IGFzICRzKXsgJGs9JHNbJ2Zsb3cnXTsgJGZbJGtdWydpc3NpdXN0YSddPSgkZlska11bJ2lzc2l1c3RhJ10/PzApKzE7ICR0MD1zdHJ0b3RpbWUoJHNbJ3NlbnRfYXQnXSk7ICRoaXQ9bnVsbDsgZm9yZWFjaCgoJGJ5WyRzWydlbSddXT8/W10pIGFzICR4KXsgJHRkPXN0cnRvdGltZSgkeFsnZCddKTsgaWYoJHRkPiR0MCAmJiAkdGQ8PSR0MCs3Kjg2NDAwKXsgJGhpdD0keDsgYnJlYWs7IH0gfSBpZigkaGl0KXsgJGZbJGtdWyd1enNfcGVyXzdkJ109KCRmWyRrXVsndXpzX3Blcl83ZCddPz8wKSsxOyAkZlska11bJ3N1bWEnXT1yb3VuZCgoJGZbJGtdWydzdW1hJ10/PzApKyRoaXRbJ3QnXSwyKTsgfSBpZihzdHJ0b3RpbWUoJHNbJ3NlbnRfYXQnXSk8dGltZSgpLTcqODY0MDApICRmWyRrXVsncGlsbmFzX2xhbmdhcyddPSgkZlska11bJ3BpbG5hc19sYW5nYXMnXT8/MCkrMTsgfQogICAgJHJbJ2xhaXNrYWknXT0kZjsKICAgIC8vIHRpZXNpb2dpbmlzOiBteWd0dWthcyAvIHV0bQogICAgJHJbJ3Bha2FydG90aV9teWd0dWthcyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9d2Nfb3JkZXJzX21ldGEgbSBKT0lOIHskUH13Y19vcmRlcnMgbyBPTiBvLmlkPW0ub3JkZXJfaWQgQU5EIG8uc3RhdHVzIElOKCRTVCkgV0hFUkUgbS5tZXRhX2tleT0nX3BzX3Bha2FydG90aV9pcyciKTsKICAgICRyWyd1dG0nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtLm1ldGFfdmFsdWUgc3JjLCBDT1VOVCgqKSBuLCBST1VORChTVU0oby50b3RhbF9hbW91bnQpLDIpIHMgRlJPTSB7JFB9d2Nfb3JkZXJzX21ldGEgbSBKT0lOIHskUH13Y19vcmRlcnMgbyBPTiBvLmlkPW0ub3JkZXJfaWQgQU5EIG8uc3RhdHVzIElOKCRTVCkgV0hFUkUgbS5tZXRhX2tleT0nX3djX29yZGVyX2F0dHJpYnV0aW9uX3V0bV9zb3VyY2UnIEFORCAobS5tZXRhX3ZhbHVlIExJS0UgJyVzZW5kZXIlJyBPUiBtLm1ldGFfdmFsdWUgTElLRSAnJW1haWwlJyBPUiBtLm1ldGFfdmFsdWUgTElLRSAnJW5ld3NsZXR0ZXIlJykgR1JPVVAgQlkgMSIsQVJSQVlfQSk7CiAgICAkclsndXRtX21lZGl1bV9lbWFpbCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG0ubWV0YV92YWx1ZSBtZWQsIENPVU5UKCopIG4gRlJPTSB7JFB9d2Nfb3JkZXJzX21ldGEgbSBKT0lOIHskUH13Y19vcmRlcnMgbyBPTiBvLmlkPW0ub3JkZXJfaWQgQU5EIG8uc3RhdHVzIElOKCRTVCkgV0hFUkUgbS5tZXRhX2tleT0nX3djX29yZGVyX2F0dHJpYnV0aW9uX3V0bV9tZWRpdW0nIEFORCBtLm1ldGFfdmFsdWUgTElLRSAnJW1haWwlJyBHUk9VUCBCWSAxIixBUlJBWV9BKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9KTsK';
const VER='dep-095900';
const GKEY='ps_s1769a';
const PHASES=["1"];
const OUT='out/s1769a.json';
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
