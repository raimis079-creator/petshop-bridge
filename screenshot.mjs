process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcxMGInXSkpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRmPSRfR0VUWydwc19zMTcxMGInXTsgJHI9WydmJz0+JGZdOwogICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBESVNUSU5DVCBwLklEIEZST00geyRwfXBvc3RzIHAgTEVGVCBKT0lOIHskcH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgT04gdHIub2JqZWN0X2lkPXAuSUQgTEVGVCBKT0lOIHskcH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBBTkQgdHQudGF4b25vbXk9J3Byb2R1Y3RfYnJhbmQnIExFRlQgSk9JTiB7JHB9dGVybXMgdCBPTiB0LnRlcm1faWQ9dHQudGVybV9pZCBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXMgSU4gKCdwdWJsaXNoJywnZHJhZnQnLCdwcml2YXRlJywncGVuZGluZycpIEFORCAocC5wb3N0X3RpdGxlIExJS0UgJyVKb3NlcmElJyBPUiBwLnBvc3RfdGl0bGUgTElLRSAnJUpvc2lEb2clJyBPUiBwLnBvc3RfdGl0bGUgTElLRSAnJUpvc2lDYXQlJyBPUiB0Lm5hbWUgTElLRSAnJUpvc2VyYSUnKSIpOwogICRvdXQ9W107ICRrZXlzPVsnX3NrdScsJ19lYW4nLCdfZ2xvYmFsX3VuaXF1ZV9pZCcsJ19wcmljZScsJ19yZWd1bGFyX3ByaWNlJywnX3NhbGVfcHJpY2UnLCdfdmZfcGVyc29uYWxfY29zdCcsJ192Zl9jb3N0JywnX3ZmX2Nvc3RfeG1sJywnX3ZmX3F0eScsJ19zdG9jaycsJ19zdG9ja19zdGF0dXMnLCdfcHNfc2FuZGVsaXMnLCdfY29zdF9wcmljZScsJ19vd25fc3RvY2tfcXR5JywnX3BzX2ZlZWRfb2ZmX2thaW5hMjQnLCdfcHNfZmVlZF9vZmZfa2Fpbm9zJywnX3BzX3JhbmthX2lzaW10YScsJ193ZWlnaHQnLCdfdmZfcHJpY2VfcnVsZV91c2VkJywnX3ZmX3N1cHBsaWVyX3NrdSddOwogIGZvcmVhY2goJGlkcyBhcyAkaWQpewogICAgJG09JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgbWV0YV9rZXkgayxtZXRhX3ZhbHVlIHYgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD0lZCBBTkQgbWV0YV9rZXkgSU4gKCciLmltcGxvZGUoIicsJyIsJGtleXMpLiInKSIsJGlkKSxBUlJBWV9BKTsKICAgICRtbT1bXTsgZm9yZWFjaCgkbSBhcyAkeCl7ICRtbVskeFsnayddXT0keFsndiddOyB9CiAgICAkcG9zdD0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHBvc3RfdGl0bGUscG9zdF9zdGF0dXMscG9zdF9uYW1lIEZST00geyRwfXBvc3RzIFdIRVJFIElEPSVkIiwkaWQpLEFSUkFZX0EpOwogICAgJHZpcz0kd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHQuc2x1ZyBGUk9NIHskcH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgSk9JTiB7JHB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgSk9JTiB7JHB9dGVybXMgdCBPTiB0LnRlcm1faWQ9dHQudGVybV9pZCBXSEVSRSB0ci5vYmplY3RfaWQ9JWQgQU5EIHR0LnRheG9ub215PSdwcm9kdWN0X3Zpc2liaWxpdHknIiwkaWQpKTsKICAgICRjYXRzPSR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgdC5zbHVnIEZST00geyRwfXRlcm1fcmVsYXRpb25zaGlwcyB0ciBKT0lOIHskcH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBKT0lOIHskcH10ZXJtcyB0IE9OIHQudGVybV9pZD10dC50ZXJtX2lkIFdIRVJFIHRyLm9iamVjdF9pZD0lZCBBTkQgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JyIsJGlkKSk7CiAgICAkc2t1PSRtbVsnX3NrdSddPz8nJzsKICAgICRzPWZ1bmN0aW9uKCRkYXlzKSB1c2UoJHdwZGIsJHAsJGlkLCRza3UpewogICAgICAkYT0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPQUxFU0NFKFNVTShraWVraXMpLDApIEZST00geyRwfXBzX2Zha3RfZWlsdXRlcyBXSEVSRSBwcmVrZV9pZD0lZCBBTkQgdGVzdGluaXM9MCBBTkQgc2FsdGluaXNfYXBsaW5rYT0ncHJvZCcgQU5EIGFwbW9rZXRhX2F0Pj1EQVRFX1NVQihOT1coKSxJTlRFUlZBTCAlZCBEQVkpIiwkaWQsJGRheXMpKTsKICAgICAgJGI9JHNrdT8kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPQUxFU0NFKFNVTShraWVraXMpLDApIEZST00geyRwfXBzX2lzdF9mYWt0X2VpbHV0ZXMgV0hFUkUgKHNrdT0lcyBPUiBwcmVrZV9pZD0lZCkgQU5EIGFwbW9rZXRhX2F0Pj1EQVRFX1NVQihOT1coKSxJTlRFUlZBTCAlZCBEQVkpIiwkc2t1LCRpZCwkZGF5cykpOjA7CiAgICAgIHJldHVybiAoaW50KSRhKyhpbnQpJGI7IH07CiAgICAkbHk9JHNrdT8oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09BTEVTQ0UoU1VNKGtpZWtpcyksMCkgRlJPTSB7JHB9cHNfaXN0X2Zha3RfZWlsdXRlcyBXSEVSRSAoc2t1PSVzIE9SIHByZWtlX2lkPSVkKSBBTkQgYXBtb2tldGFfYXQgQkVUV0VFTiBEQVRFX1NVQihOT1coKSxJTlRFUlZBTCA0NTUgREFZKSBBTkQgREFURV9TVUIoTk9XKCksSU5URVJWQUwgMzY1IERBWSkiLCRza3UsJGlkKSk6MDsKICAgICRsYXN0cD0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIEFWRyhrYWluYV92bnRfY3QpIEZST00gKFNFTEVDVCBrYWluYV92bnRfY3QgRlJPTSB7JHB9cHNfZmFrdF9laWx1dGVzIFdIRVJFIHByZWtlX2lkPSVkIEFORCB0ZXN0aW5pcz0wIEFORCBhcG1va2V0YV9hdD49REFURV9TVUIoTk9XKCksSU5URVJWQUwgMzY1IERBWSkgVU5JT04gQUxMIFNFTEVDVCBrYWluYV92bnRfY3QgRlJPTSB7JHB9cHNfaXN0X2Zha3RfZWlsdXRlcyBXSEVSRSAoc2t1PSVzIE9SIHByZWtlX2lkPSVkKSBBTkQgYXBtb2tldGFfYXQ+PURBVEVfU1VCKE5PVygpLElOVEVSVkFMIDM2NSBEQVkpKSB4IiwkaWQsJHNrdSwkaWQpKTsKICAgICRvdXRbXT1bJ2lkJz0+JGlkLCd0aXRsZSc9PiRwb3N0Wydwb3N0X3RpdGxlJ10sJ3N0YXR1cyc9PiRwb3N0Wydwb3N0X3N0YXR1cyddLCdzbHVnJz0+JHBvc3RbJ3Bvc3RfbmFtZSddLCd2aXMnPT4kdmlzLCdjYXRzJz0+JGNhdHMsJ20nPT4kbW0sJ3MzMCc9PiRzKDMwKSwnczkwJz0+JHMoOTApLCdzMzY1Jz0+JHMoMzY1KSwnczkwX2x5Jz0+JGx5LCdhdmdfcHJpY2VfMzY1X2N0Jz0+JGxhc3RwXTsKICB9CiAgJHJbJ24nXT1jb3VudCgkb3V0KTsgJHJbJ3Jvd3MnXT0kb3V0OwogIHdwX3NlbmRfanNvbigkcik7Cn0sIDEpOwo=';
const VER='dep-191506';
const GKEY='ps_s1710b';
const PHASES=["1"];
const OUT='analize/s1710_b.json';
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
