process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQwbSBFeGNsdXNpb24gSHlwb2FsbGVyZ2VuaWMgZHVvbWVueXMgKDEgcmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NDBtJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNTApOyBnbG9iYWwgJHdwZGI7ICRyPVsndic9PidTMTc0MG0nXTsKICB0cnl7CiAgICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvc3RfdGl0bGUgTElLRSAnJUV4Y2x1c2lvbiUnIEFORCAocG9zdF90aXRsZSBMSUtFICclSHlwbyUnIE9SIHBvc3RfdGl0bGUgTElLRSAnJWhpcG9hbGVyJScgT1IgcG9zdF90aXRsZSBMSUtFICclSHlkcm9seXplZCUnKSBPUkRFUiBCWSBwb3N0X3RpdGxlIik7CiAgICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHA9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoISRwKSBjb250aW51ZTsKICAgICAgJG89WydpZCc9PihpbnQpJGlkLCd0Jz0+Z2V0X3RoZV90aXRsZSgkaWQpLCdrYWluYSc9PiRwLT5nZXRfcHJpY2UoKSwncmVnJz0+JHAtPmdldF9yZWd1bGFyX3ByaWNlKCksJ3N0b2NrJz0+JHAtPmdldF9zdG9ja19zdGF0dXMoKSwncXR5Jz0+JHAtPmdldF9zdG9ja19xdWFudGl0eSgpLCdzdm9yaXMnPT4kcC0+Z2V0X3dlaWdodCgpLCdzYW5kZWxpcyc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpLCdrYXQnPT5pbXBsb2RlKCd8Jyx3cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfY2F0JyxbJ2ZpZWxkcyc9PiduYW1lcyddKSksJ3VybCc9PndwX21ha2VfbGlua19yZWxhdGl2ZShnZXRfcGVybWFsaW5rKCRpZCkpLCdwYXJkJz0+KGludClnZXRfcG9zdF9tZXRhKCRpZCwndG90YWxfc2FsZXMnLHRydWUpXTsKICAgICAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0ZlZWRpbmdfU2VydmljZScpKXsgdHJ5eyAkYz1QZXRzaG9wX0ZlZWRpbmdfU2VydmljZTo6Y2FsYyhbJ3Byb2R1Y3RfaWQnPT4oaW50KSRpZCwnd2VpZ2h0X2tnJz0+MTBdKTsgaWYoaXNfYXJyYXkoJGMpKSAkb1snZDEwJ109WyRjWydub3JtX21pbl9nJ10/P251bGwsJGNbJ25vcm1fbWF4X2cnXT8/bnVsbCwkY1snY29zdF9kYXlfbWluJ10/P251bGwsJGNbJ2Nvc3RfZGF5X21heCddPz9udWxsXTsgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydkMTAnXT0neCc7IH0gfQogICAgICAkclsncCddW109JG87IH0KICAgICR0PWdldF90ZXJtX2J5KCdzbHVnJywnZXhjbHVzaW9uJywncHJvZHVjdF9icmFuZCcpOyBpZigkdCl7ICRyWydicmFuZCddPVsnaWQnPT4kdC0+dGVybV9pZCwnbic9PiR0LT5jb3VudCwndXJsJz0+d3BfbWFrZV9saW5rX3JlbGF0aXZlKGdldF90ZXJtX2xpbmsoJHQpKSwnZGVzY19sZW4nPT5zdHJsZW4oJHQtPmRlc2NyaXB0aW9uKSwnZGVzYyc9Pm1iX3N1YnN0cih0cmltKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyx3cF9zdHJpcF9hbGxfdGFncygkdC0+ZGVzY3JpcHRpb24pKSksMCw3MDApLCdybV90aXRsZSc9PmdldF90ZXJtX21ldGEoJHQtPnRlcm1faWQsJ3JhbmtfbWF0aF90aXRsZScsdHJ1ZSksJ3JtX2Rlc2MnPT5nZXRfdGVybV9tZXRhKCR0LT50ZXJtX2lkLCdyYW5rX21hdGhfZGVzY3JpcHRpb24nLHRydWUpXTsgfQogICAgJHJbJ2xhbmRpbmcnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxwb3N0X3RpdGxlLHBvc3RfbmFtZSBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0ncGFnZScgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgKHBvc3RfbmFtZSBMSUtFICclZXhjbHVzaW9uJScgT1IgcG9zdF90aXRsZSBMSUtFICclRXhjbHVzaW9uJScpIixBUlJBWV9BKTsKICAgIGlmKCRpZHMpeyAkdT1nZXRfcGVybWFsaW5rKCRpZHNbMF0pOyAkYz1jdXJsX2luaXQoJHUuJz9uYz0nLnRpbWUoKSk7IGN1cmxfc2V0b3B0X2FycmF5KCRjLFtDVVJMT1BUX1JFVFVSTlRSQU5TRkVSPT4xLENVUkxPUFRfVElNRU9VVD0+MjVdKTsgJGg9Y3VybF9leGVjKCRjKTsgY3VybF9jbG9zZSgkYyk7IGlmKHByZWdfbWF0Y2goJy88ZGl2IGNsYXNzPSJwcy1wYXphZGFzW14iXSoiPiguKj8pPFwvZGl2PlxzKjxcL2Rpdj4vc2knLCRoLCRtKSkgJHJbJ3BhemFkYXMnXT10cmltKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyxzdHJpcF90YWdzKCRtWzFdKSkpOyB9CiAgICAkclsnc2l1bnRpbWFzJ109WyduZW1va2FtYXNfbnVvJz0+Z2V0X29wdGlvbigncHNfbmVtb2thbWFzX251bycpLCd6b25vcyc9PiR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHpvbmVfaWQsIHpvbmVfbmFtZSBGUk9NIHskd3BkYi0+cHJlZml4fXdvb2NvbW1lcmNlX3NoaXBwaW5nX3pvbmVzIixBUlJBWV9BKV07CiAgICAkclsnZnJlZV9taW4nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtLmluc3RhbmNlX2lkLCBtLm1ldGhvZF9pZCwgbS5pc19lbmFibGVkIEZST00geyR3cGRiLT5wcmVmaXh9d29vY29tbWVyY2Vfc2hpcHBpbmdfem9uZV9tZXRob2RzIG0gV0hFUkUgbS5tZXRob2RfaWQgTElLRSAnJWZyZWUlJyIsQVJSQVlfQSk7CiAgICBmb3JlYWNoKCRyWydmcmVlX21pbiddIGFzICYkZm0peyAkcz1nZXRfb3B0aW9uKCd3b29jb21tZXJjZV8nLiRmbVsnbWV0aG9kX2lkJ10uJ18nLiRmbVsnaW5zdGFuY2VfaWQnXS4nX3NldHRpbmdzJyk7ICRmbVsnbWluJ109aXNfYXJyYXkoJHMpPygkc1snbWluX2Ftb3VudCddPz8nJyk6Jyc7IH0gdW5zZXQoJGZtKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-184940';
const GKEY='ps_s1740m';
const PHASES=["1"];
const OUT='analize/s1740m.json';
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
