process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODAwZiByZWNvbiAyIOKAlCBhcHJhxaF5bcWzIHNla2Npam9zLCBrYcSNacWzIMWhxJdyaW1vIGxlbnRlbMSXLCBwYXZ5emRpbsSXIGthxI1pxbMgcHJla8SXIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfczE4MDBmJ10pPyRfR0VUWydwc19zMTgwMGYnXTonJyk7IGlmKCRmIT09J0dPJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE4MDBmJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICAgJG9bJ2Rlc2NfY291bnRzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbWV0YV9rZXksQ09VTlQoKikgbiBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleSBMSUtFICdwZXRzaG9wX2Rlc2NfJScgQU5EIG1ldGFfdmFsdWU8PicnIEdST1VQIEJZIG1ldGFfa2V5IixBUlJBWV9BKTsKICAgIC8vIHBhdnl6ZGluxJcga2HEjWnFsyBzYXVzbyBtYWlzdG8gcHJla8SXIHN1IHNla2Npam9taXMgaXIgxaHEl3JpbW8gbGVudGVsZSAoc3RlcmlsaXp1b3RvbXMpLCBuYXVqYXVzaWEKICAgICRjaWQ9JHdwZGItPmdldF92YXIoIlNFTEVDVCBwLklEIEZST00geyRwfXBvc3RzIHAgSk9JTiB7JHB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0ncGV0c2hvcF9kZXNjX21haW4nIEFORCBtLm1ldGFfdmFsdWU8PicnIEpPSU4geyRwfXBzX2ZlZWRpbmdfbWFwIGZtIE9OIGZtLnByb2R1Y3RfaWQ9cC5JRCBBTkQgZm0uaXNfYWN0aXZlPTEgSk9JTiB7JHB9dGVybV9yZWxhdGlvbnNoaXBzIHRyIE9OIHRyLm9iamVjdF9pZD1wLklEIEpPSU4geyRwfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50ZXJtX2lkPTgxIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHAucG9zdF90aXRsZSBMSUtFICclc3RlcmlsaXolJyBPUkRFUiBCWSBwLklEIERFU0MgTElNSVQgMSIpOwogICAgaWYoJGNpZCl7ICRwcj13Y19nZXRfcHJvZHVjdCgkY2lkKTsgJHg9YXJyYXkoJ2lkJz0+JGNpZCwnbmFtZSc9PiRwci0+Z2V0X25hbWUoKSwnc2t1Jz0+JHByLT5nZXRfc2t1KCksJ3dlaWdodCc9PiRwci0+Z2V0X3dlaWdodCgpLCdjYXRzJz0+d3BfZ2V0X3Bvc3RfdGVybXMoJGNpZCwncHJvZHVjdF9jYXQnLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSksJ2JyYW5kJz0+d3BfZ2V0X3Bvc3RfdGVybXMoJGNpZCwncHJvZHVjdF9icmFuZCcsYXJyYXkoJ2ZpZWxkcyc9PiduYW1lcycpKSwnZXhjZXJwdCc9PiRwci0+Z2V0X3Nob3J0X2Rlc2NyaXB0aW9uKCksJ2NvbnRlbnRfbGVuJz0+c3RybGVuKCRwci0+Z2V0X2Rlc2NyaXB0aW9uKCkpKTsKICAgICAgZm9yZWFjaCgkcHItPmdldF9hdHRyaWJ1dGVzKCkgYXMgJGs9PiRhKXsgJHhbJ2F0dHJzJ11bJGtdPWFycmF5X21hcChmdW5jdGlvbigkdCl7IHJldHVybiAkdC0+bmFtZTsgfSwgd3BfZ2V0X3Bvc3RfdGVybXMoJGNpZCwkaykpOyB9CiAgICAgIGZvcmVhY2goZ2V0X3Bvc3RfbWV0YSgkY2lkKSBhcyAkaz0+JHYpeyBpZihzdHJwb3MoJGssJ3BldHNob3BfZGVzY18nKT09PTB8fHN0cnBvcygkaywnX3BzX3BpbG51bWFzJyk9PT0wfHxpbl9hcnJheSgkayxhcnJheSgnX2dsb2JhbF91bmlxdWVfaWQnLCdfcHNfc2FuZGVsaXMnLCdfd2VpZ2h0JykpKSAkeFsnbWV0YSddWyRrXT0kdlswXTsgfQogICAgICAkZm09JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCAqIEZST00geyRwfXBzX2ZlZWRpbmdfbWFwIFdIRVJFIHByb2R1Y3RfaWQ9JWQgQU5EIGlzX2FjdGl2ZT0xIiwkY2lkKSxBUlJBWV9BKTsKICAgICAgaWYoJGZtKXsgJHhbJ2Z0YWJsZSddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskcH1wc19mZWVkaW5nX3RhYmxlcyBXSEVSRSBpZD0lZCIsJGZtWydmZWVkaW5nX3RhYmxlX2lkJ10pLEFSUkFZX0EpOyB1bnNldCgkeFsnZnRhYmxlJ11bJ3Jvd3NfYmFja3VwX2pzb24nXSk7ICR4Wydmcm93cyddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSB7JHB9cHNfZmVlZGluZ19yb3dzIFdIRVJFIGZlZWRpbmdfdGFibGVfaWQ9JWQgT1JERVIgQlkgcm93X29yZGVyIiwkZm1bJ2ZlZWRpbmdfdGFibGVfaWQnXSksQVJSQVlfQSk7IH0KICAgICAgJG9bJ2thdF9wdnonXT0keDsgfQogICAgLy8gQW1icm9zaWEgxaF1bsWzIGxlbnRlbMSXIDc5CiAgICAkb1snYW1iNzknXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIGlkLGJyYW5kLGxpbmUsc2NvcGUsc3BlY2llcyx3ZWlnaHRfYmFzaXMscm93X2RpbWVuc2lvbixzaGFwZSxzdGF0dXMsc291cmNlX3VybCxyb3dfY291bnQsbG9va3VwX21ldGhvZCxzb3VyY2Vfa2luZCxpc19hY3RpdmUsdGFibGVfa2V5LGltcG9ydF9iYXRjaF9pZCx2ZXJpZmllZF9ieSBGUk9NIHskcH1wc19mZWVkaW5nX3RhYmxlcyBXSEVSRSBpZD03OSIsQVJSQVlfQSk7CiAgICAkb1snYW1iNzlfcm93cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHJvd19vcmRlcix3ZWlnaHRfZnJvbV9rZyx3ZWlnaHRfdG9fa2csYW1vdW50X2Zyb21fZyxhbW91bnRfdG9fZyxjb25kaXRpb25fZGltZW5zaW9ucyxjb25kaXRpb25fcmF3LGNlbGxfdHlwZSBGUk9NIHskcH1wc19mZWVkaW5nX3Jvd3MgV0hFUkUgZmVlZGluZ190YWJsZV9pZD03OSBPUkRFUiBCWSByb3dfb3JkZXIiLEFSUkFZX0EpOwogICAgJG9bJ2FtYl90YWJsZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxsaW5lLHNjb3BlLHNwZWNpZXMsc3RhdHVzLHJvd19jb3VudCxpc19hY3RpdmUsKFNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1wc19mZWVkaW5nX21hcCBtIFdIRVJFIG0uZmVlZGluZ190YWJsZV9pZD10LmlkKSBwcmVraXUgRlJPTSB7JHB9cHNfZmVlZGluZ190YWJsZXMgdCBXSEVSRSBicmFuZCBMSUtFICclbWJyb3NpYSUnIixBUlJBWV9BKTsKICAgIC8vIGthaXAga3VyaWFtb3MgbGVudGVsxJdzOiBrbGFzxJdzL2ZhaWxhaQogICAgJG9bJ2ZlZWRfZmlsZXMnXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKHNjYW5kaXIoV1BNVV9QTFVHSU5fRElSKSxmdW5jdGlvbigkZil7IHJldHVybiBwcmVnX21hdGNoKCcvZmVlZHxzZXJpbXxuYXVqYXxwcmVrZXxrYXRhbG9nL2knLCRmKTsgfSkpOwogICAgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcy8qLnBocCcpIGFzICRmcCl7ICRvWydjb3JlX2ZpbGVzJ11bXT1iYXNlbmFtZSgkZnApOyB9CiAgICAvLyBBbWJyb3NpYSDFoXVuxbMgYXRyaWJ1dGFpIOKGkiB0ZXJtaW7FsyBwYXZhZGluaW1haQogICAgZm9yZWFjaChhcnJheSgncGFfZ3l2dW5vX3J1c2lzJywncGFfYW16aXVzJywncGFfc3BlY2lhbGlfbWl0eWJhJywncGFfYmFsdHltdV9zYWx0aW5pcycsJ3BhX3Bha3VvdGVzX2R5ZGlzJywncGFfYmVfZ3J1ZHUnLCdwYV9tb25vcHJvdGVpbicsJ3BhX3ZlaXNsZXNfZHlkaXMnKSBhcyAkdHgpeyAkb1sndGVybXMnXVskdHhdPWFycmF5X21hcChmdW5jdGlvbigkdCl7IHJldHVybiAkdC0+dGVybV9pZC4nOicuJHQtPm5hbWU7IH0sIGdldF90ZXJtcyhhcnJheSgndGF4b25vbXknPT4kdHgsJ2hpZGVfZW1wdHknPT5mYWxzZSkpKTsgfQogICAgJG9bJ2thdF9kcnlfYnJhbmRzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdC5uYW1lLCBDT1VOVCgqKSBuIEZST00geyRwfXRlcm1fcmVsYXRpb25zaGlwcyB0ciBKT0lOIHskcH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBBTkQgdHQudGF4b25vbXk9J3Byb2R1Y3RfYnJhbmQnIEpPSU4geyRwfXRlcm1zIHQgT04gdC50ZXJtX2lkPXR0LnRlcm1faWQgV0hFUkUgdHIub2JqZWN0X2lkIElOIChTRUxFQ1Qgb2JqZWN0X2lkIEZST00geyRwfXRlcm1fcmVsYXRpb25zaGlwcyB0cjIgSk9JTiB7JHB9dGVybV90YXhvbm9teSB0dDIgT04gdHQyLnRlcm1fdGF4b25vbXlfaWQ9dHIyLnRlcm1fdGF4b25vbXlfaWQgV0hFUkUgdHQyLnRlcm1faWQ9ODEpIEdST1VQIEJZIHQubmFtZSBPUkRFUiBCWSBuIERFU0MgTElNSVQgMjUiLEFSUkFZX0EpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-120259';
const GKEY='ps_s1800f';
const PHASES=["GO"];
const OUT='analize/s1800_f.json';
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
