process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODN0IHQg4oCUIHJlYWQtb25seTogVkYgc3VzaWVqaW1vIGtsYWlkxbMgc2tlbmFzIOKAlCBwcmVrxJdzLCBrdXIgX3ZmX2JhcmNvZGUgbmVzdXRhbXBhIHN1IF9lYW4gKGJlIGtvbnRyb2xpbmlvIHNrYWl0bWVucykgYXJiYSBrYWluYSA8IDAuNcOXVkYgeG1sIGthaW5hOyBKT1MwODA1IGthcyB0YWk7IDIxNzA3IHZzIDE4MDU0LiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY4M3R0J10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4ndCcpOwogICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBtLnBvc3RfaWQgaWQsIE1BWChDQVNFIFdIRU4gcG0ubWV0YV9rZXk9J19lYW4nIFRIRU4gcG0ubWV0YV92YWx1ZSBFTkQpIGVhbiwgTUFYKENBU0UgV0hFTiBwbS5tZXRhX2tleT0nX3ZmX2JhcmNvZGUnIFRIRU4gcG0ubWV0YV92YWx1ZSBFTkQpIHZmYiwgTUFYKENBU0UgV0hFTiBwbS5tZXRhX2tleT0nX3ZmX3N1cHBsaWVyX3NrdScgVEhFTiBwbS5tZXRhX3ZhbHVlIEVORCkgdmZza3UsIE1BWChDQVNFIFdIRU4gcG0ubWV0YV9rZXk9J192Zl9jb3N0X3htbCcgVEhFTiBwbS5tZXRhX3ZhbHVlIEVORCkgdmZ4bWwsIE1BWChDQVNFIFdIRU4gcG0ubWV0YV9rZXk9J19wcmljZScgVEhFTiBwbS5tZXRhX3ZhbHVlIEVORCkgcHJpY2UsIE1BWChDQVNFIFdIRU4gcG0ubWV0YV9rZXk9J192Zl9tYXRjaF90eXBlJyBUSEVOIHBtLm1ldGFfdmFsdWUgRU5EKSBtdCBGUk9NIHskcH1wb3N0bWV0YSBwbSBKT0lOIHskcH1wb3N0cyBwbyBPTiBwby5JRD1wbS5wb3N0X2lkIEFORCBwby5wb3N0X3R5cGU9J3Byb2R1Y3QnIFdIRVJFIHBtLm1ldGFfa2V5IElOKCdfZWFuJywnX3ZmX2JhcmNvZGUnLCdfdmZfc3VwcGxpZXJfc2t1JywnX3ZmX2Nvc3RfeG1sJywnX3ByaWNlJywnX3ZmX21hdGNoX3R5cGUnKSBHUk9VUCBCWSBwbS5wb3N0X2lkIEhBVklORyB2ZmIgSVMgTk9UIE5VTEwgQU5EIHZmYjw+JyciLEFSUkFZX0EpOwogICRvWyd2aXNvX3ZmJ109Y291bnQoJHJvd3MpOyAkbmU9YXJyYXkoKTsgJHBpZz1hcnJheSgpOwogIGZvcmVhY2goJHJvd3MgYXMgJHIpeyAkZT1wcmVnX3JlcGxhY2UoJy9cRC8nLCcnLChzdHJpbmcpJHJbJ2VhbiddKTsgJGI9cHJlZ19yZXBsYWNlKCcvXEQvJywnJywoc3RyaW5nKSRyWyd2ZmInXSk7IGlmKCRlJiYkYiYmc3RycG9zKCRlLCRiKSE9PTAmJiRlIT09JGImJnN1YnN0cigkZSwwLC0xKSE9PSRiKSAkbmVbXT0kclsnaWQnXS4nICcuZ2V0X3RoZV90aXRsZSgkclsnaWQnXSkuJyB8IGVhbiAnLiRlLicgdmYgJy4kYi4nICcuJHJbJ3Zmc2t1J10uJyAoJy4kclsnbXQnXS4nKSBrYWluYSAnLiRyWydwcmljZSddOwogICAgaWYoKGZsb2F0KSRyWyd2ZnhtbCddPjAmJihmbG9hdCkkclsncHJpY2UnXT4wJiYoZmxvYXQpJHJbJ3ByaWNlJ108MC42KihmbG9hdCkkclsndmZ4bWwnXSkgJHBpZ1tdPSRyWydpZCddLicgJy5nZXRfdGhlX3RpdGxlKCRyWydpZCddKS4nIHwga2FpbmEgJy4kclsncHJpY2UnXS4nIHZzIFZGIHhtbCAnLiRyWyd2ZnhtbCddLicgJy4kclsndmZza3UnXS4nIHN0PScuZ2V0X3Bvc3Rfc3RhdHVzKCRyWydpZCddKTsgfQogICRvWydlYW5fbmVzdXRhbXBhX24nXT1jb3VudCgkbmUpOyAkb1snZWFuX25lc3V0YW1wYSddPWFycmF5X3NsaWNlKCRuZSwwLDI1KTsgJG9bJ3BpZ2lhdV82MHByb2NfbiddPWNvdW50KCRwaWcpOyAkb1sncGlnaWF1XzYwcHJvYyddPWFycmF5X3NsaWNlKCRwaWcsMCwyNSk7CiAgJG9bJ2pvczA4MDUnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxwb3N0X3RpdGxlLHBvc3Rfc3RhdHVzIEZST00geyRwfXBvc3RzIFdIRVJFIElEIElOIChTRUxFQ1QgcG9zdF9pZCBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3ZmX3N1cHBsaWVyX3NrdScgQU5EIG1ldGFfdmFsdWU9J0pPUzA4MDUnKSBPUiBwb3N0X3RpdGxlIExJS0UgJyVKT1MwODA1JSciLEFSUkFZX0EpOwogICRvWydpbXBvcnQzMjk3NSddPWFycmF5KCd0Jz0+Z2V0X3RoZV90aXRsZSgzMjk3NSksJ3N0Jz0+Z2V0X3Bvc3Rfc3RhdHVzKDMyOTc1KSwndHlwZSc9PmdldF9wb3N0X3R5cGUoMzI5NzUpLCdtZXRhJz0+YXJyYXlfc2xpY2UoYXJyYXlfbWFwKGZ1bmN0aW9uKCRrLCR2KXtyZXR1cm4gJGsuJz0nLnN1YnN0cigkdlswXSwwLDUwKTt9LGFycmF5X2tleXMoZ2V0X3Bvc3RfbWV0YSgzMjk3NSkpLGdldF9wb3N0X21ldGEoMzI5NzUpKSwwLDIwKSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-103530';
const GKEY='ps_s1683tt';
const PHASES=["A"];
const OUT='analize/s1683t_t.json';
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
