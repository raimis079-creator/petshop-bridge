process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI3bWEgcmVhZC1vbmx5OiAyLjMgc2thbsSXc3TFsyBhdHRhY2ggcmVjb24g4oCUIHNjaGVtYSwga2FuZGlkYXRhaSwgRkJUICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcyN21hJ10pKSByZXR1cm47ICRmPSRfR0VUWydwc19zMTcyN21hJ107ICRyPVsndic9PidTMTcyN21hJywnZic9PiRmXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyBAc2V0X3RpbWVfbGltaXQoMTcwKTsKICB0cnl7CiAgICBpZigkZj09PScxJyl7CiAgICAgIGZvcmVhY2goWydwc19zb3VyY2VzJywncHNfZmFrdF9laWx1dGVzJywncHNfZmFrdF91enNha3ltYWknLCd3Y19vcmRlcl9wcm9kdWN0X2xvb2t1cCddIGFzICR0KXsgJHJbJ3NjaGVtYSddWyR0XT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRQfXskdH0iKTsgfQogICAgICAkcGF0PVsnJWF1c3lzJScsJyVhdXNpcyUnLCcla29qb3MlJywnJWtvamEgJScsJyVza3JhbmQlJywnJWtlbGVwJScsJyVwbGF1xI0lJywnJXBsYXVjJScsJyVtaWFtb3IlJ107CiAgICAgICR3PWltcGxvZGUoJyBPUiAnLGFycmF5X2ZpbGwoMCxjb3VudCgkcGF0KSwncC5wb3N0X3RpdGxlIExJS0UgJXMnKSk7CiAgICAgICRpZHM9JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwLklEIEZST00geyRQfXBvc3RzIHAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzIElOICgncHVibGlzaCcsJ2RyYWZ0JywncHJpdmF0ZScpIEFORCAoJHcpIiwkcGF0KSk7CiAgICAgICRvdXQ9W107CiAgICAgIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkcD13Y19nZXRfcHJvZHVjdCgkaWQpOyBpZighJHApIGNvbnRpbnVlOwogICAgICAgIGlmKGdldF9wb3N0X21ldGEoJGlkLCdfZHBfYmFzZV9wcm9kdWN0X2lkJyx0cnVlKSkgeyAkZHA9MTsgfSBlbHNlICRkcD0wOwogICAgICAgICRzcmM9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskUH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQ9JWQiLCRpZCksQVJSQVlfQSk7CiAgICAgICAgJGNhdHM9d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwcm9kdWN0X2NhdCcsWydmaWVsZHMnPT4nbmFtZXMnXSk7ICRiPXdwX2dldF9wb3N0X3Rlcm1zKCRpZCwncHJvZHVjdF9icmFuZCcsWydmaWVsZHMnPT4nbmFtZXMnXSk7CiAgICAgICAgJHNvbGQ9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBsLm9yZGVyX2lkKSB1LCBTVU0obC5wcm9kdWN0X3F0eSkgcSBGUk9NIHskUH13Y19vcmRlcl9wcm9kdWN0X2xvb2t1cCBsIEpPSU4geyRQfXdjX29yZGVycyBvIE9OIG8uaWQ9bC5vcmRlcl9pZCBXSEVSRSBsLnByb2R1Y3RfaWQ9JWQgQU5EIGwuZGF0ZV9jcmVhdGVkPj0nMjAyNi0wOS0wNyAyMjowNzowMCcgQU5EIG8uc3RhdHVzIElOICgnd2MtcHJvY2Vzc2luZycsJ3djLWNvbXBsZXRlZCcsJ3djLW9uLWhvbGQnKSIsJGlkKSxBUlJBWV9BKTsKICAgICAgICAkb3V0W109WydpZCc9PihpbnQpJGlkLCdwYXYnPT4kcC0+Z2V0X25hbWUoKSwnc3QnPT5nZXRfcG9zdF9zdGF0dXMoJGlkKSwnc2t1Jz0+JHAtPmdldF9za3UoKSwnZHAnPT4kZHAsJ3JlZyc9PiRwLT5nZXRfcmVndWxhcl9wcmljZSgnZWRpdCcpLCdzYWxlJz0+JHAtPmdldF9zYWxlX3ByaWNlKCdlZGl0JyksJ2Nvc3RfcHJpY2UnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX2Nvc3RfcHJpY2UnLHRydWUpLCdzdG9jayc9PiRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSwnc3MnPT4kcC0+Z2V0X3N0b2NrX3N0YXR1cygpLCdvd24nPT5nZXRfcG9zdF9tZXRhKCRpZCwnX293bl9zdG9ja19xdHknLHRydWUpLCdzYW5kZWxpcyc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpLCdzcmMnPT4kc3JjLCdzdm9yaXMnPT4kcC0+Z2V0X3dlaWdodCgpLCdsd2gnPT5bJHAtPmdldF9sZW5ndGgoKSwkcC0+Z2V0X3dpZHRoKCksJHAtPmdldF9oZWlnaHQoKV0sJ3NoaXAnPT4kcC0+Z2V0X3NoaXBwaW5nX2NsYXNzKCksJ2NhdHMnPT4kY2F0cywnYnJhbmQnPT4kYj8kYlswXTonJywndG90YWxfc2FsZXMnPT4oaW50KWdldF9wb3N0X21ldGEoJGlkLCd0b3RhbF9zYWxlcycsdHJ1ZSksJ3BvX3QwJz0+JHNvbGQsJ2ltZyc9PiRwLT5nZXRfaW1hZ2VfaWQoKT8xOjBdOwogICAgICB9CiAgICAgICRyWyduJ109Y291bnQoJG91dCk7ICRyWydwcmVrZXMnXT0kb3V0OwogICAgfQogICAgaWYoJGY9PT0nMicpewogICAgICAkZm49V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1wcmVrZXMtdHZhcmthLnBocCc7ICRyWydleGlzdHMnXT1maWxlX2V4aXN0cygkZm4pOwogICAgICBpZigkclsnZXhpc3RzJ10peyAkc3JjPWZpbGUoJGZuKTsgJHJbJ2xpbmVzJ109Y291bnQoJHNyYyk7ICRyWydtZDUnXT1tZDVfZmlsZSgkZm4pOwogICAgICAgICRoaXQ9W107IGZvcmVhY2goJHNyYyBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvZmJ0fGthcnR1fGZ1bmN0aW9uIHxhZGRfYWN0aW9ufGFkZF9maWx0ZXJ8Y3Jvc3NzZWxsfGNyb3NzX3NlbGx8dXBzZWxsfFNFTEVDVHxsaW1pdHxMSU1JVC9pJywkbCkpICRoaXRbXT0oJGkrMSkuJzogJy5ydHJpbShtYl9zdWJzdHIoJGwsMCwyMjApKTsgfSAkclsnaGl0J109YXJyYXlfc2xpY2UoJGhpdCwwLDE2MCk7IH0KICAgICAgJHJbJ2ZidF9maWxlcyddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpLGZ1bmN0aW9uKCR4KXsgcmV0dXJuIHN0cmlwb3MoZmlsZV9nZXRfY29udGVudHMoJHgpLCdEYcW+bmFpIHBlcmthbWEnKSE9PWZhbHNlIHx8IHN0cmlwb3MoZmlsZV9nZXRfY29udGVudHMoJHgpLCdmYnQnKSE9PWZhbHNlOyB9KSk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9LCAxKTsK';
const VER='dep-181207';
const GKEY='ps_s1727ma';
const PHASES=["1", "2"];
const OUT='analize/s1727_ma.json';
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
