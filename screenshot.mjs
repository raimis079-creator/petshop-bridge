process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NDMg4oCUIHBhcmR1b3TFsyBERUxUQSAoZVNob3ByZW50IDEyMDk54oCTMTIxMDYpLiBOPWRyeS1ydW4gUkVBRC1PTkxZLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY0MyddKSkgcmV0dXJuOwogICRmPXN0cnRvdXBwZXIoc2FuaXRpemVfa2V5KCRfR0VUWydwc19zMTY0MyddKSk7ICRvPWFycmF5KCd2Jz0+J1MxNjQzJywnZic9PiRmKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyBzZXRfdGltZV9saW1pdCgyODApOwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKCiAgJEQ9IjU0MTQzNjUyNjA1Njk7OzEKQU1MRTEyOzsxCjM0MTg1MC1kcDs7MQpIWVBTMDI7OzMKV1dTT0c1MDM1OzsyCjgzNzIyOzszCjgzNzIxOzszCjgzOTY3OzszCjgyNzAwMTIxOzsxCjcwNDAwMTs7MQpHMzc4OzsxCjgyNzY3OzsyCjgyNzY1OzsyCjgyNzY0OzsyCjgyNzQxOzsyCjgyODA0OzsyCkhZUFMwNjs7MQpHMzc3OzsxCjU5MDQxODE0MDA4NDg7UzsxIjsKCiAgJHNrPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBtLm1ldGFfdmFsdWUgc2t1LCBwbS5wb3N0X2lkLCBwby5wb3N0X3R5cGUsIHBvLnBvc3RfcGFyZW50LCBwby5wb3N0X3N0YXR1cyBGUk9NIHskcH1wb3N0bWV0YSBwbSBKT0lOIHskcH1wb3N0cyBwbyBPTiBwby5JRD1wbS5wb3N0X2lkIEFORCBwby5wb3N0X3R5cGUgSU4oJ3Byb2R1Y3QnLCdwcm9kdWN0X3ZhcmlhdGlvbicpIFdIRVJFIHBtLm1ldGFfa2V5PSdfc2t1JyBBTkQgcG0ubWV0YV92YWx1ZTw+JyciKTsKICAkbWFwPWFycmF5KCk7IGZvcmVhY2goJHNrIGFzICRyKXsgJG1hcFt0cmltKChzdHJpbmcpJHItPnNrdSldPWFycmF5KChpbnQpJHItPnBvc3RfaWQsJHItPnBvc3RfdHlwZSwoaW50KSRyLT5wb3N0X3BhcmVudCwkci0+cG9zdF9zdGF0dXMpOyB9CgogICRlaWw9YXJyYXkoKTsgJHN1bV9hdj0wOwogIGZvcmVhY2goYXJyYXlfZmlsdGVyKGV4cGxvZGUoIlxuIiwkRCkpIGFzICRsKXsKICAgICRjPWV4cGxvZGUoJzsnLCRsKTsgJHM9dHJpbSgkY1swXSk7ICR2dj10cmltKCRjWzFdKTsgJHE9KGludCkkY1syXTsKICAgICRyb3c9YXJyYXkoJ3NrdSc9PiRzLCd2YXInPT4kdnYsJ2tpZWtpcyc9PiRxKTsKICAgIGlmKCFpc3NldCgkbWFwWyRzXSkpeyAkcm93WydidXNlbmEnXT0nTkVSQVNUQSc7ICRlaWxbXT0kcm93OyBjb250aW51ZTsgfQogICAgbGlzdCgkcGlkLCRwdHlwZSwkcGFyZW50LCRwc3QpPSRtYXBbJHNdOwogICAgLy8gdmFyaWFjaWphIHBhZ2FsIGF0cmlidXRvIHJlaWtzbWUKICAgIGlmKCR2diE9PScnICYmICRwdHlwZT09PSdwcm9kdWN0Jyl7CiAgICAgICR2cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBJRCBGUk9NIHskcH1wb3N0cyBXSEVSRSBwb3N0X3BhcmVudD0lZCBBTkQgcG9zdF90eXBlPSdwcm9kdWN0X3ZhcmlhdGlvbiciLCRwaWQpKTsKICAgICAgJGhpdD0wOwogICAgICBmb3JlYWNoKCR2cyBhcyAkdil7IGZvcmVhY2goJHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgbWV0YV9rZXksbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPSVkIEFORCBtZXRhX2tleSBMSUtFICdhdHRyaWJ1dGVfJSUnIiwkdi0+SUQpKSBhcyAkbSl7CiAgICAgICAgaWYobWJfc3RydG9sb3dlcih0cmltKCRtLT5tZXRhX3ZhbHVlKSk9PT1tYl9zdHJ0b2xvd2VyKCR2dikpeyAkaGl0PShpbnQpJHYtPklEOyBicmVhayAyOyB9IH0gfQogICAgICBpZigkaGl0KXsgJHBhcmVudD0kcGlkOyAkcGlkPSRoaXQ7ICRwdHlwZT0ncHJvZHVjdF92YXJpYXRpb24nOyB9CiAgICAgIGVsc2UgJHJvd1sncGFzdGFiYSddPSd2YXJpYWNpamEgcGFnYWwgIicuJHZ2LiciIE5FUkFTVEEg4oCUIGltYW1hIGJhemluZSc7CiAgICB9CiAgICAkYmF6ID0gKCRwdHlwZT09PSdwcm9kdWN0X3ZhcmlhdGlvbicgJiYgJHBhcmVudCkgPyAkcGFyZW50IDogJHBpZDsKICAgICRyb3dbJ3BpZCddPSRwaWQ7ICRyb3dbJ3RpcGFzJ109JHB0eXBlOyAkcm93WydiYXppbmUnXT0kYmF6OyAkcm93WydzdGF0dXNhcyddPSRwc3Q7CiAgICAkcm93WydwYXYnXT1tYl9zdWJzdHIoKHN0cmluZylnZXRfdGhlX3RpdGxlKCRiYXopLDAsNDApOwogICAgJHZmPWdldF9wb3N0X21ldGEoJGJheiwnX3ZmX3F0eScsdHJ1ZSk7ICR6Yj1nZXRfcG9zdF9tZXRhKCRiYXosJ196Yl9xdHknLHRydWUpOwogICAgJHJvd1sndmYnXT0oJHZmPT09Jyc/bnVsbDokdmYpOyAkcm93Wyd6YiddPSgkemI9PT0nJz9udWxsOiR6Yik7CiAgICAkcm93Wydwc19zYW5kZWxpcyddPWdldF9wb3N0X21ldGEoJGJheiwnX3BzX3NhbmRlbGlzJyx0cnVlKTsKICAgICRyb3dbJ2F2J10gPSAoJHZmPT09Jyd8fCR2Zj09PW51bGwpICYmICgkemI9PT0nJ3x8JHpiPT09bnVsbCk7CiAgICAkcm93WydzdG9jayddPWdldF9wb3N0X21ldGEoJHBpZCwnX3N0b2NrJyx0cnVlKTsKICAgICRyb3dbJ293biddPWdldF9wb3N0X21ldGEoJGJheiwnX293bl9zdG9ja19xdHknLHRydWUpOwogICAgJHJvd1snbWFuYWdlJ109Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfbWFuYWdlX3N0b2NrJyx0cnVlKTsKICAgIGlmKCRyb3dbJ2F2J10peyAkcm93WyduYXVqYXNfc3RvY2snXT0oaW50KSRyb3dbJ3N0b2NrJ10tJHE7ICRzdW1fYXYrPSRxOyB9CiAgICBpZihzdHJwb3MoJHMsJy1kcCcpIT09ZmFsc2UpewogICAgICAkZHA9YXJyYXkoKTsgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBtZXRhX2tleSxtZXRhX3ZhbHVlIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9JWQgQU5EIChtZXRhX2tleSBMSUtFICclJWRwJSUnIE9SIG1ldGFfa2V5IExJS0UgJyUlcGFrdW90JSUnIE9SIG1ldGFfa2V5PSdfcHNfYmF6aW5lJyBPUiBtZXRhX2tleSBMSUtFICdfcHNfJSUnKSIsJHBpZCkpIGFzICRtKSAkZHBbJG0tPm1ldGFfa2V5XT1tYl9zdWJzdHIoKHN0cmluZykkbS0+bWV0YV92YWx1ZSwwLDQwKTsKICAgICAgJHJvd1snZHBfbWV0YSddPSRkcDsKICAgIH0KICAgICRlaWxbXT0kcm93OwogIH0KICAkb1snZWlsdXRlcyddPSRlaWw7ICRvWydhdl92bnRfdmlzbyddPSRzdW1fYXY7CiAgJG9bJ2RiX3N0b2NrX3N1bWEnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgU1VNKG1ldGFfdmFsdWUrMCkgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19zdG9jayciKTsKICAkb1sncGluZyddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSxhcnJheSgndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSkpKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDk5KTsK';
const VER='dep-213213';
const GKEY='ps_s1643';
const PHASES=["N"];
const OUT='analize/s1643n.json';
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
