process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODQgbWQg4oCUIFJFQUQtT05MWTogYXIga2xpZW50YXMgbW9rYSB1xb4gcHJpc3RhdHltxIUg4oCUIHBzX2lzdF9mYWt0X3V6c2FreW1haSAoOSw1IGspIGlyIFdDIF9zaGlwcGluZ190b3RhbCBudW8gVC0wLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY4NG1kJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE2ODQgbWQnKTsgJHdwZGItPnN1cHByZXNzX2Vycm9ycyh0cnVlKTsKICAkYz0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRwfXBzX2lzdF9mYWt0X3V6c2FreW1haSIpOyAkb1sncHJpc3RfY29scyddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoJGMsZnVuY3Rpb24oJHgpe3JldHVybiBzdHJpcG9zKCR4LCdwcmlzdGF0JykhPT1mYWxzZXx8c3RyaXBvcygkeCwnc2l1bnQnKSE9PWZhbHNlO30pKTsKICBmb3JlYWNoKCRvWydwcmlzdF9jb2xzJ10gYXMgJGNvbCkgaWYocHJlZ19tYXRjaCgnL19jdCQvJywkY29sKSkgJG9bJ2lzdCddWyRjb2xdPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoKikgbiwgU1VNKGAkY29sYD4wKSBtb2thX24sIFJPVU5EKFNVTShgJGNvbGApLzEwMCkgZXVyLCBST1VORChBVkcoQ0FTRSBXSEVOIGAkY29sYD4wIFRIRU4gYCRjb2xgIEVORCkvMTAwLDIpIHZpZCBGUk9NIHskcH1wc19pc3RfZmFrdF91enNha3ltYWkgV0hFUkUgYXBtb2tldGFfYXQ+PScyMDI1LTA5LTAxJyIsQVJSQVlfQSk7CiAgJG9bJ2lzdF9wYWdhbF9tZW4nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBEQVRFX0ZPUk1BVChhcG1va2V0YV9hdCwnJVktJW0nKSBtLCBDT1VOVCgqKSBuLCBTVU0ocHJpc3RhdHltYXNfY3Q+MCkgbW9rYV9uLCBST1VORChBVkcodmlzb19jdCkvMTAwLDEpIGFvdiBGUk9NIHskcH1wc19pc3RfZmFrdF91enNha3ltYWkgV0hFUkUgYXBtb2tldGFfYXQ+PScyMDI1LTA5LTAxJyBHUk9VUCBCWSBtIixBUlJBWV9BKTsKICAkb1snd2Nfc2hpcHBpbmcnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIENPVU5UKCopIG4sIFNVTShvLnNoaXBwaW5nX3RvdGFsX2Ftb3VudD4wKSBtb2thX24sIFJPVU5EKFNVTShvLnNoaXBwaW5nX3RvdGFsX2Ftb3VudCksMikgZXVyIEZST00geyRwfXdjX29yZGVycyBvIFdIRVJFIG8uc3RhdHVzIElOKCd3Yy1wcm9jZXNzaW5nJywnd2MtY29tcGxldGVkJykgQU5EIG8uZGF0ZV9jcmVhdGVkX2dtdD49JzIwMjYtMDktMDgnIixBUlJBWV9BKTsKICAkb1snd2Nfc2hpcHBpbmdfYnlfbWV0aG9kJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb2kub3JkZXJfaXRlbV9uYW1lIG0sIENPVU5UKCopIG4sIFJPVU5EKFNVTShvbS5tZXRhX3ZhbHVlKSwyKSBldXIgRlJPTSB7JHB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbXMgb2kgSk9JTiB7JHB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgb20gT04gb20ub3JkZXJfaXRlbV9pZD1vaS5vcmRlcl9pdGVtX2lkIEFORCBvbS5tZXRhX2tleT0nY29zdCcgSk9JTiB7JHB9d2Nfb3JkZXJzIG8gT04gby5pZD1vaS5vcmRlcl9pZCBXSEVSRSBvaS5vcmRlcl9pdGVtX3R5cGU9J3NoaXBwaW5nJyBBTkQgby5kYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0wOS0wOCcgR1JPVVAgQlkgbSIsQVJSQVlfQSk7CiAgJG9bJ3pvbmVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgem0uaW5zdGFuY2VfaWQsIHptLm1ldGhvZF9pZCwgem0uaXNfZW5hYmxlZCwgei56b25lX25hbWUgRlJPTSB7JHB9d29vY29tbWVyY2Vfc2hpcHBpbmdfem9uZV9tZXRob2RzIHptIEpPSU4geyRwfXdvb2NvbW1lcmNlX3NoaXBwaW5nX3pvbmVzIHogT04gei56b25lX2lkPXptLnpvbmVfaWQiLEFSUkFZX0EpOwogIGZvcmVhY2goJG9bJ3pvbmVzJ10gYXMgJiR6KXsgJHM9Z2V0X29wdGlvbignd29vY29tbWVyY2VfJy4kelsnbWV0aG9kX2lkJ10uJ18nLiR6WydpbnN0YW5jZV9pZCddLidfc2V0dGluZ3MnKTsgJHpbJ2Nvc3QnXT1pc3NldCgkc1snY29zdCddKT8kc1snY29zdCddOm51bGw7ICR6WydtaW4nXT1pc3NldCgkc1snbWluX2Ftb3VudCddKT8kc1snbWluX2Ftb3VudCddOm51bGw7ICR6Wyd0aXRsZSddPWlzc2V0KCRzWyd0aXRsZSddKT8kc1sndGl0bGUnXTpudWxsOyB9IHVuc2V0KCR6KTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-181748';
const GKEY='ps_s1684md';
const PHASES=["GO"];
const OUT='analize/s1684_md.json';
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
