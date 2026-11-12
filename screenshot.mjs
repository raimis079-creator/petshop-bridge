process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODU1YSDigJQgcmVjb246IE1pYW1vciBrb25zZXJ2YWkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX3MxODU1J10pPyRfR0VUWydwc19zMTg1NSddOicnKTsgaWYoJGY9PT0nJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTg1NWEnLCdyb3dzJz0+YXJyYXkoKSk7CiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIElEIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzIElOKCdwdWJsaXNoJywnZHJhZnQnLCdwcml2YXRlJykgQU5EIHBvc3RfdGl0bGUgTElLRSAnJW1pYW1vciUnIEFORCBwb3N0X3RpdGxlIE5PVCBSRUdFWFAgJ15bMC05XSsgdm50JyIpOwogICRkMTk9KGFycmF5KWdldF9vcHRpb24oJ3BzX2RrX2QxOV9zZWltb3MnLGFycmF5KCkpOwogIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoISRwcikgY29udGludWU7ICRjYXRzPXdwX2dldF9wb3N0X3Rlcm1zKCRpZCwncHJvZHVjdF9jYXQnLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSk7CiAgICAkcGs9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgbS5wb3N0X2lkIGlkLChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBxIFdIRVJFIHEucG9zdF9pZD1tLnBvc3RfaWQgQU5EIHEubWV0YV9rZXk9J19kcF9wYWNrX3F0eScpIHEsKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXBvc3RtZXRhIHEgV0hFUkUgcS5wb3N0X2lkPW0ucG9zdF9pZCBBTkQgcS5tZXRhX2tleT0nX3ByaWNlJykgcHIsKFNFTEVDVCBwb3N0X3N0YXR1cyBGUk9NIHskcH1wb3N0cyB6IFdIRVJFIHouSUQ9bS5wb3N0X2lkKSBzdCBGUk9NIHskcH1wb3N0bWV0YSBtIFdIRVJFIG0ubWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnIEFORCBtLm1ldGFfdmFsdWU9JXMiLChzdHJpbmcpJGlkKSxBUlJBWV9BKTsKICAgICRzPSRwci0+Z2V0X21ldGEoJ19wc19keWR6aW9fc2VpbWEnKTsKICAgICRvWydyb3dzJ11bXT1hcnJheSgnaWQnPT4kaWQsJ3QnPT4kcHItPmdldF9uYW1lKCksJ3N0Jz0+JHByLT5nZXRfc3RhdHVzKCksJ3NrdSc9PiRwci0+Z2V0X3NrdSgpLCdlYW4nPT4kcHItPmdldF9tZXRhKCdfZ2xvYmFsX3VuaXF1ZV9pZCcpPzokcHItPmdldF9tZXRhKCdfemJfZWFuJyk/OiRwci0+Z2V0X21ldGEoJ192Zl9lYW4nKSwna2FpbmEnPT4kcHItPmdldF9wcmljZSgpLCdyZWcnPT4kcHItPmdldF9yZWd1bGFyX3ByaWNlKCksJ2Nvc3QnPT4kcHItPmdldF9tZXRhKCdfY29zdF9wcmljZScpPzokcHItPmdldF9tZXRhKCdfemJfY29zdCcpPzokcHItPmdldF9tZXRhKCdfdmZfY29zdCcpLCdzYW5kJz0+JHByLT5nZXRfbWV0YSgnX3BzX3NhbmRlbGlzJyksJ3N0b2NrJz0+JHByLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSwnc3MnPT4kcHItPmdldF9zdG9ja19zdGF0dXMoKSwncDMwJz0+JHByLT5nZXRfbWV0YSgnX3BzX3NhbGVzXzMwZCcpLCdwMzY1Jz0+JHByLT5nZXRfbWV0YSgnX3BzX3NhbGVzXzM2NWQnKSwnbzM2NSc9PiRwci0+Z2V0X21ldGEoJ19wc19vcmRlcnNfMzY1ZCcpLCdzZWltYSc9PiRzPyhpbl9hcnJheSgkcywkZDE5LHRydWUpPydEMTknOidzZWltYScpOicnLCdjYXRzJz0+aW1wbG9kZSgnfCcsJGNhdHMpLCdwYWthaSc9PiRwayk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-151123';
const GKEY='ps_s1855';
const PHASES=["R"];
const OUT='analize/s1855_a.json';
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
