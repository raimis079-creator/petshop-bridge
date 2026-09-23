process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzA1byddKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJGY9JF9HRVRbJ3BzX3MxNzA1byddOyAkcj1bJ2YnPT4kZl07CiAgJG1pZHM9YXJyYXlfbWFwKCdpbnR2YWwnLCR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBBTkQgQklOQVJZIG1ldGFfdmFsdWU9J0FWJyIpKTsKICAkc3Jvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQscHJvZHVjdF9pZCxzb3VyY2Usc3RvY2tfcXR5LGlzX2FjdGl2ZSBGUk9NIHskcH1wc19zb3VyY2VzIFdIRVJFIEJJTkFSWSBzb3VyY2U9J0FWJyIsQVJSQVlfQSk7CiAgJHNpZHM9YXJyYXlfbWFwKCdpbnR2YWwnLGFycmF5X2NvbHVtbigkc3Jvd3MsJ3Byb2R1Y3RfaWQnKSk7CiAgJGFsbD1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKGFycmF5X21lcmdlKCRtaWRzLCRzaWRzKSkpOwogICRpbmZvPWZ1bmN0aW9uKCRpZCkgdXNlKCR3cGRiLCRwKXsgJHByPXdjX2dldF9wcm9kdWN0KCRpZCk7ICRvPVsndCc9Pm1iX3N1YnN0cihnZXRfdGhlX3RpdGxlKCRpZCksMCw1MCksJ3N0Jz0+Z2V0X3Bvc3Rfc3RhdHVzKCRpZCksJ3NhbmQnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKSwnc3RvY2snPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3N0b2NrJyx0cnVlKSwnb3duJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19vd25fc3RvY2tfcXR5Jyx0cnVlKSwnc3MnPT4kcHI/JHByLT5nZXRfc3RvY2tfc3RhdHVzKCk6bnVsbCwncSc9PiRwcj8kcHItPmdldF9zdG9ja19xdWFudGl0eSgpOm51bGwsCiAgICAgJ3NyYyc9PiR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHNvdXJjZSBzLGlzX2FjdGl2ZSBhIEZST00geyRwfXBzX3NvdXJjZXMgV0hFUkUgcHJvZHVjdF9pZD0kaWQiLEFSUkFZX0EpXTsKICAgICB0cnl7ICRycz1QZXRzaG9wX0FWX1NvdXJjZTo6cmVzb2x2ZSgkaWQsMSk7ICRvWydyZXMnXT0kcnNbJ3NvdXJjZSddLicgLyAnLiRyc1sncmVhc29uJ107IH1jYXRjaChcVGhyb3dhYmxlICRlKXsgJG9bJ3JlcyddPSdlcnIgJy4kZS0+Z2V0TWVzc2FnZSgpOyB9IHJldHVybiAkbzsgfTsKICBpZigkZj09PScyJyl7CiAgICBpZighZ2V0X29wdGlvbigncHNfczE3MDVfQVZfYmFrJykpIHVwZGF0ZV9vcHRpb24oJ3BzX3MxNzA1X0FWX2JhaycsWydtZXRhJz0+JG1pZHMsJ3NyYyc9PiRzcm93c10sZmFsc2UpOwogICAgJHJbJ2R1cGwnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBhLnByb2R1Y3RfaWQgRlJPTSB7JHB9cHNfc291cmNlcyBhIEpPSU4geyRwfXBzX3NvdXJjZXMgYiBPTiBhLnByb2R1Y3RfaWQ9Yi5wcm9kdWN0X2lkIEFORCBCSU5BUlkgYS5zb3VyY2U9J0FWJyBBTkQgQklOQVJZIGIuc291cmNlPSdhdiciLEFSUkFZX0EpOwogICAgJHJbJ3VwZF9tZXRhJ109JHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRwfXBvc3RtZXRhIFNFVCBtZXRhX3ZhbHVlPSdhdicgV0hFUkUgbWV0YV9rZXk9J19wc19zYW5kZWxpcycgQU5EIEJJTkFSWSBtZXRhX3ZhbHVlPSdBViciKTsKICAgICRyWyd1cGRfc3JjJ109JHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRwfXBzX3NvdXJjZXMgU0VUIHNvdXJjZT0nYXYnIFdIRVJFIEJJTkFSWSBzb3VyY2U9J0FWJyIpOwogICAgZm9yZWFjaCgkYWxsIGFzICRpZCl7IGNsZWFuX3Bvc3RfY2FjaGUoJGlkKTsgd3BfY2FjaGVfZGVsZXRlKCRpZCwncG9zdF9tZXRhJyk7IGlmKGZ1bmN0aW9uX2V4aXN0cygncHNfc291cmNlc19zeW5jX3NhdWdpYWknKSkgcHNfc291cmNlc19zeW5jX3NhdWdpYWkoJGlkKTsgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkaWQpOyB9CiAgICBpZihmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX2NsZWFyX2NhY2hlJykpIHdwX2NhY2hlX2NsZWFyX2NhY2hlKCk7CiAgfSBlbHNlIHsgJHJbJ3ByaWVzJ109W107IGZvcmVhY2goJGFsbCBhcyAkaWQpICRyWydwcmllcyddWyRpZF09JGluZm8oJGlkKTsgfQogICRyWydtZXRhX24nXT1jb3VudCgkbWlkcyk7ICRyWydzcmNfbiddPWNvdW50KCRzcm93cyk7CiAgaWYoJGY9PT0nMicpeyAkclsncG8nXT1bXTsgZm9yZWFjaCgkYWxsIGFzICRpZCkgJHJbJ3BvJ11bJGlkXT0kaW5mbygkaWQpOwogICAgJHJbJ2xpa29fbWV0YSddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19wc19zYW5kZWxpcycgQU5EIEJJTkFSWSBtZXRhX3ZhbHVlPSdBViciKTsKICAgICRyWydsaWtvX3NyYyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cHNfc291cmNlcyBXSEVSRSBCSU5BUlkgc291cmNlPSdBViciKTsgfQogIC8vIGnFoSBrdXIgYXRzaXJhbmRhICdBVicKICAkclsnZ3JlcCddPVtdOyBmb3JlYWNoKGdsb2IoV1BfQ09OVEVOVF9ESVIuJy97bXUtcGx1Z2lucyxwbHVnaW5zL3BldHNob3AtKn0vKi5waHAnLEdMT0JfQlJBQ0UpIGFzICRmbCl7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmbCk7IGlmKHByZWdfbWF0Y2hfYWxsKCIvWydcIl1BVlsnXCJdXHMqKD0+fCx8XCkpLyIsJGMsJG0pKSAkclsnZ3JlcCddW109YmFzZW5hbWUoJGZsKS4nOicuY291bnQoJG1bMF0pOyB9CiAgJHJbJ3NuaXAnXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIENPTkNBVChpZCwnICcsbmFtZSkgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgYWN0aXZlPTEgQU5EIGNvZGUgUkVHRVhQICdfcHNfc2FuZGVsaXMnIEFORCBCSU5BUlkgY29kZSBMSUtFICclJydBVicnJSciKTsKICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-103947';
const GKEY='ps_s1705o';
const PHASES=["2"];
const OUT='analize/s1705_o2.json';
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
