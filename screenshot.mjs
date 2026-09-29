process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzM5bSBoaXBvYWxlcmdpbmlhaSBwYWx5Z2luaW11aSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MzltJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgyMDApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTczOW0nXTsKICB0cnl7CiAgICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfRmVlZGluZ19TZXJ2aWNlJykpeyAkcm09bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRmVlZGluZ19TZXJ2aWNlJywnY2FsYycpOyAkclsnY2FsY19zaWcnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHApe3JldHVybiAkcC0+Z2V0TmFtZSgpLigkcC0+aXNPcHRpb25hbCgpPyc9Pyc6JycpO30sJHJtLT5nZXRQYXJhbWV0ZXJzKCkpOyB9CiAgICAkbGlrZT0iKHAucG9zdF90aXRsZSBMSUtFICclSHlwb2FsbCUnIE9SIHAucG9zdF90aXRsZSBMSUtFICclSGlwb2FsZXIlJyBPUiBwLnBvc3RfdGl0bGUgTElLRSAnJUFuYWxsZXJnZW5pYyUnIE9SIHAucG9zdF90aXRsZSBMSUtFICclTW9ub3Byb3RlaW4lJyBPUiBwLnBvc3RfdGl0bGUgTElLRSAnJURlcm1hdG9zaXMlJyBPUiBwLnBvc3RfdGl0bGUgTElLRSAnJVNlbnNpJScgT1IgcC5wb3N0X3RpdGxlIExJS0UgJyVBbGxlcmclJyBPUiBwLnBvc3RfdGl0bGUgTElLRSAnJUh5cG8gJScpIjsKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQsIHAucG9zdF90aXRsZSB0LCBwbS5tZXRhX3ZhbHVlIHByaWNlLCBzcy5tZXRhX3ZhbHVlIHN0IEZST00geyR3cGRiLT5wb3N0c30gcCBMRUZUIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gcG0gT04gcG0ucG9zdF9pZD1wLklEIEFORCBwbS5tZXRhX2tleT0nX3ByaWNlJyBMRUZUIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gc3MgT04gc3MucG9zdF9pZD1wLklEIEFORCBzcy5tZXRhX2tleT0nX3N0b2NrX3N0YXR1cycgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgJGxpa2UgQU5EIChwLnBvc3RfdGl0bGUgTElLRSAnJUV4Y2x1c2lvbiUnIE9SIHAucG9zdF90aXRsZSBMSUtFICclUm95YWwlJyBPUiBwLnBvc3RfdGl0bGUgTElLRSAnJUpvc2VyYSUnIE9SIHAucG9zdF90aXRsZSBMSUtFICclSm9zaURvZyUnIE9SIHAucG9zdF90aXRsZSBMSUtFICclTW9uZ2UlJykgQU5EIChwLnBvc3RfdGl0bGUgTk9UIExJS0UgJyVrYXQlJyBBTkQgcC5wb3N0X3RpdGxlIE5PVCBMSUtFICclY2F0JScpIE9SREVSIEJZIHAucG9zdF90aXRsZSBMSU1JVCA4MCIsQVJSQVlfQSk7CiAgICAkcGFyZD1bXTsgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBlLnByZWtlX2lkIHBpZCwgU1VNKGUua2lla2lzKSBxIEZST00geyRQfXBzX2Zha3RfZWlsdXRlcyBlIEpPSU4geyRQfXBzX2Zha3RfdXpzYWt5bWFpIHUgT04gdS51enNha3ltYXNfaWQ9ZS51enNha3ltYXNfaWQgV0hFUkUgdS5kaWVuYT49REFURV9TVUIoQ1VSREFURSgpLElOVEVSVkFMIDEyMCBEQVkpIEdST1VQIEJZIDEiLEFSUkFZX0EpIGFzICR4KSAkcGFyZFskeFsncGlkJ11dPSR4WydxJ107CiAgICAkaXN0PVtdOyBpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAneyRQfXBzX2lzdF9mYWt0X2VpbHV0ZXMnIikpeyBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHByZWtlX2lkIHBpZCwgU1VNKGtpZWtpcykgcSBGUk9NIHskUH1wc19pc3RfZmFrdF9laWx1dGVzIEdST1VQIEJZIDEiLEFSUkFZX0EpIGFzICR4KSAkaXN0WyR4WydwaWQnXV09JHhbJ3EnXTsgfQogICAgZm9yZWFjaCgkcm93cyBhcyAkeCl7ICRwcj13Y19nZXRfcHJvZHVjdCgkeFsnSUQnXSk7ICRjPSRwcj93cF9zdHJpcF9hbGxfdGFncygkcHItPmdldF9kZXNjcmlwdGlvbigpKTonJzsgJGk9bWJfc3RyaXBvcygkYywnU3VkxJd0aXMnKTsgJHN1ZD0kaSE9PWZhbHNlP21iX3N1YnN0cigkYywkaSwyNjApOm1iX3N1YnN0cigkYywwLDE2MCk7CiAgICAgICRjYWxjPW51bGw7IGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9GZWVkaW5nX1NlcnZpY2UnKSl7IHRyeXsgJGNhbGM9UGV0c2hvcF9GZWVkaW5nX1NlcnZpY2U6OmNhbGMoJHhbJ0lEJ10sMjApOyB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJGNhbGM9J0VSUiAnLiRlLT5nZXRNZXNzYWdlKCk7IH0gfQogICAgICAkclsncCddW109WydpZCc9PiR4WydJRCddLCd0Jz0+JHhbJ3QnXSwnZXVyJz0+JHhbJ3ByaWNlJ10sJ3N0Jz0+JHhbJ3N0J10sJ3BhcmQxMjAnPT4kcGFyZFskeFsnSUQnXV0/PzAsJ2lzdCc9PiRpc3RbJHhbJ0lEJ11dPz8wLCdjYWxjMjAnPT5pc19hcnJheSgkY2FsYyk/YXJyYXlfaW50ZXJzZWN0X2tleSgkY2FsYyxhcnJheV9mbGlwKFsnZ19kJywnZ3JhbWFpJywnZXVyX2QnLCdldXJfbWVuJywna2FpbmFfZCcsJ2thaW5hX21lbicsJ25vcm0nXSkpOiRjYWxjLCdzdWQnPT5wcmVnX3JlcGxhY2UoJy9ccysvJywnICcsJHN1ZCldOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-171700';
const GKEY='ps_s1739m';
const PHASES=["1"];
const OUT='analize/s1739_m.json';
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
