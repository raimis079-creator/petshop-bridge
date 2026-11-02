process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODIybiAxNTAgZyBwYWvFsyBwYXRpa3JhIChyZWFkLW9ubHkgKyBzaG90cykgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODIybiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTgyMm4nXTsgQHNldF90aW1lX2xpbWl0KDE3MCk7CiAgJGlkcz1bXTsgZm9yZWFjaChbMzM2NjgsMzM3MTQsMzM3MTYsMzM3MjBdIGFzICRiaWQpeyAkYj13Y19nZXRfcHJvZHVjdCgkYmlkKTsgJGNvc3Q9KGZsb2F0KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgY29zdF9uZXQgRlJPTSB7JFB9cHNfc291cmNlcyBXSEVSRSBwcm9kdWN0X2lkPSVkIE9SREVSIEJZIGNvc3RfbmV0IERFU0MgTElNSVQgMSIsJGJpZCkpOwogICAgJG89Wyd0Jz0+JGItPmdldF9uYW1lKCksJ2Jhc2UnPT5bJGItPmdldF9zdGF0dXMoKSwkYi0+Z2V0X3dlaWdodCgpLGdldF9wb3N0X21ldGEoJGJpZCwnX2dsb2JhbF91bmlxdWVfaWQnLHRydWUpXSwndGlkJz0+JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBmZWVkaW5nX3RhYmxlX2lkIEZST00geyRQfXBzX2ZlZWRpbmdfbWFwIFdIRVJFIHByb2R1Y3RfaWQ9JWQgQU5EIGlzX2FjdGl2ZT0xIiwkYmlkKSldOwogICAgZm9yZWFjaCgkd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHBvc3RfaWQgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnIEFORCBtZXRhX3ZhbHVlPSVkIiwkYmlkKSkgYXMgJGlkKXsgJHA9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoISRwfHwkcC0+Z2V0X3N0YXR1cygpPT09J3RyYXNoJykgY29udGludWU7ICRxPShpbnQpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19kcF9wYWNrX3F0eScsdHJ1ZSk7ICRrPShmbG9hdCkkcC0+Z2V0X3ByaWNlKCk7ICRpZHNbXT0oaW50KSRpZDsKICAgICAgJG9bJ3Bha2FpJ11bJHFdPVsoaW50KSRpZCwkcC0+Z2V0X3N0YXR1cygpLCRrLHJvdW5kKCRrLyRxLDMpLCRwLT5pc19pbl9zdG9jaygpPzE6MCwkcC0+aXNfcHVyY2hhc2FibGUoKT8xOjAscm91bmQoJGsvMS4yMS0kY29zdCokcS0yLjE1LDIpLCR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgZmVlZGluZ190YWJsZV9pZCBGUk9NIHskUH1wc19mZWVkaW5nX21hcCBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBpc19hY3RpdmU9MSIsJGlkKSksaW1wbG9kZSgnLCcsd3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwYV9wYWt1b3Rlc19keWRpcycsWydmaWVsZHMnPT4nbmFtZXMnXSkpLCRwLT5nZXRfd2VpZ2h0KCldOyB9CiAgICBrc29ydCgkb1sncGFrYWknXSk7ICRyWydnJ11bJGJpZF09JG87IH0KICAkclsnc3R1bHAnXT0nW2lkLHN0LGthaW5hLHZudCxpbnN0b2NrLHB1cmNoLGxpZWthX3BvX3Bhc3RvbWF0byx0aWQsZHlkaXMsd10nOwogICR4PXdwX3JlbW90ZV9nZXQoYWRkX3F1ZXJ5X2FyZygncHNfaGInLHRpbWUoKSxnZXRfdGVybV9saW5rKDc5LCdwcm9kdWN0X2NhdCcpKSxbJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHgpOyAkaz1bXTsKICBmb3JlYWNoKCRpZHMgYXMgJGlkKSBpZihwcmVnX21hdGNoKCcvcG9zdC0nLiRpZC4nXGIvJywkaCkpICRrW109JGlkOyAkclsna2F0X3AxJ109Wydrb2Rhcyc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCR4KSwna29ydGVsZXMnPT4ka107CiAgJHg9d3BfcmVtb3RlX2dldChhZGRfcXVlcnlfYXJnKCdwc19oYicsdGltZSgpLGdldF9wZXJtYWxpbmsoMzc0ODApKSxbJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHgpOyAkclsnc29sbzQwMCddPVsna29kYXMnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkeCksJ2tpYXVsaWVub3NfbGVudCc9PnN0cnBvcygkaCwnS2F0xJdzIHN2b3JpcycpIT09ZmFsc2UsJ3Nlbm9qaSc9PnN0cnBvcygkaCwndG9zIHBhxI1pb3MgYW5hbGl0aW7El3MnKSE9PWZhbHNlXTsKICAkbG9nPWluaV9nZXQoJ2Vycm9yX2xvZycpOyAkc3o9ZmlsZXNpemUoJGxvZyk7ICRoaD1mb3BlbigkbG9nLCdyJyk7IGZzZWVrKCRoaCxtYXgoMCwkc3otMzAwMDAwKSk7ICR0PWZyZWFkKCRoaCwzMDAwMDApOyBmY2xvc2UoJGhoKTsKICAkclsnZmF0YWxfcG9fMjAxNSddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoZXhwbG9kZSgiXG4iLCR0KSxmdW5jdGlvbigkcyl7IHJldHVybiBzdHJpcG9zKCRzLCdGYXRhbCcpIT09ZmFsc2UgJiYgcHJlZ19tYXRjaCgnLzAyLU5vdi0yMDI2ICgyWzAtM106KS8nLCRzKTsgfSkpOwogICRyWydzaG90cyddPVtbJ24nPT4nczE4MjJfa2F0MzJfdGVsJywndSc9PmdldF9wZXJtYWxpbmsoMzc0ODkpLCd3Jz0+MzkwLCdoJz0+ODQ0LCdmdWxsJz0+dHJ1ZV0sWyduJz0+J3MxODIyX2thdF9rYXRlZ190ZWwnLCd1Jz0+Z2V0X3Rlcm1fbGluayg3OSwncHJvZHVjdF9jYXQnKSwndyc9PjM5MCwnaCc9Pjg0NCwnZnVsbCc9PmZhbHNlXV07CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-205549';
const GKEY='ps_s1822n';
const PHASES=["1"];
const OUT='analize/s1822_n.json';
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
