process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODUyciDigJQgQW5pbW9uZGEgODUgZyDEryBEMTkgxaFlaW1hcyAoa2FpcCBMYW5kZmxlaXNoIGF2LSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX3MxODUyJ10pPyRfR0VUWydwc19zMTg1MiddOicnKTsgaWYoJGY9PT0nJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTg1MnItJy4kZik7CiAgJEJBU0U9YXJyYXkoMzg0MzIsMzg0MzQsMzg0MzYsMzg0MzgpOwogICRwbGFuPWFycmF5KCk7CiAgZm9yZWFjaCgkQkFTRSBhcyAkYil7ICRzPSdhdi0nLmdldF9wb3N0X2ZpZWxkKCdwb3N0X25hbWUnLCRiKTsgJHM9c3Vic3RyKCRzLDAsMTgwKTsKICAgICRwaz0kd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHBvc3RfaWQgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnIEFORCBtZXRhX3ZhbHVlPSVzIiwoc3RyaW5nKSRiKSk7CiAgICAkcGxhblskYl09YXJyYXkoJ3NlaW1hJz0+JHMsJ3Bha2FpJz0+JHBrKTsgfQogIGlmKCRmPT09JzEnKXsgJG9bJ3BsYW4nXT0kcGxhbjsgZm9yZWFjaCgkcGxhbiBhcyAkYj0+JHgpeyBmb3JlYWNoKCR4WydwYWthaSddIGFzICRpZCl7ICRvWydxJ11bJGlkXT1nZXRfcG9zdF9tZXRhKCRpZCwnX2RwX3BhY2tfcXR5Jyx0cnVlKTt9IH0gZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsgfQogIGlmKCRmPT09JzInKXsKICAgICRkMTk9KGFycmF5KWdldF9vcHRpb24oJ3BzX2RrX2QxOV9zZWltb3MnLGFycmF5KCkpOwogICAgJGJhaz1hcnJheSgnZDE5Jz0+JGQxOSwnbWV0YSc9PmFycmF5KCksJ3Rlcm0nPT5hcnJheSgpKTsKICAgIGZvcmVhY2goJHBsYW4gYXMgJGI9PiR4KXsgZm9yZWFjaChhcnJheV9tZXJnZShhcnJheSgkYiksJHhbJ3Bha2FpJ10pIGFzICRpZCl7ICRiYWtbJ21ldGEnXVskaWRdPWdldF9wb3N0X21ldGEoJGlkLCdfcHNfZHlkemlvX3NlaW1hJyx0cnVlKTsgJGJha1sndGVybSddWyRpZF09d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwYV9wYWt1b3Rlc19keWRpcycsYXJyYXkoJ2ZpZWxkcyc9PidpZHMnKSk7IH0gfQogICAgaWYoIWdldF9vcHRpb24oJ3BzX3MxODUycl9iYWsnKSkgdXBkYXRlX29wdGlvbigncHNfczE4NTJyX2JhaycsJGJhayxmYWxzZSk7CiAgICBmb3JlYWNoKCRwbGFuIGFzICRiPT4keCl7CiAgICAgIHVwZGF0ZV9wb3N0X21ldGEoJGIsJ19wc19keWR6aW9fc2VpbWEnLCR4WydzZWltYSddKTsKICAgICAgZm9yZWFjaCgkeFsncGFrYWknXSBhcyAkaWQpeyAkcT0oaW50KWdldF9wb3N0X21ldGEoJGlkLCdfZHBfcGFja19xdHknLHRydWUpOwogICAgICAgIHVwZGF0ZV9wb3N0X21ldGEoJGlkLCdfcHNfZHlkemlvX3NlaW1hJywkeFsnc2VpbWEnXSk7CiAgICAgICAgJG5tPSRxLicgw5cgODUgZyc7ICR0PXRlcm1fZXhpc3RzKCRubSwncGFfcGFrdW90ZXNfZHlkaXMnKTsgaWYoISR0KXsgJHQ9d3BfaW5zZXJ0X3Rlcm0oJG5tLCdwYV9wYWt1b3Rlc19keWRpcycpOyB9CiAgICAgICAgJHRpZD1pc19hcnJheSgkdCk/KGludCkkdFsndGVybV9pZCddOihpbnQpJHQ7CiAgICAgICAgd3Bfc2V0X29iamVjdF90ZXJtcygkaWQsYXJyYXkoJHRpZCksJ3BhX3Bha3VvdGVzX2R5ZGlzJyxmYWxzZSk7CiAgICAgICAgJG9bJ3NldCddWyRpZF09YXJyYXkoJHEsJG5tLCR0aWQpOyB9CiAgICAgIGlmKCFpbl9hcnJheSgkeFsnc2VpbWEnXSwkZDE5LHRydWUpKSAkZDE5W109JHhbJ3NlaW1hJ107CiAgICAgICRpZHM9YXJyYXlfbWVyZ2UoYXJyYXkoJGIpLCR4WydwYWthaSddKTsgZm9yZWFjaCgkaWRzIGFzICRpZCl7IGNsZWFuX3Bvc3RfY2FjaGUoJGlkKTsgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkaWQpOyBpZihmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX3Bvc3RfY2hhbmdlJykpIHdwX2NhY2hlX3Bvc3RfY2hhbmdlKCRpZCk7IH0gfQogICAgdXBkYXRlX29wdGlvbigncHNfZGtfZDE5X3NlaW1vcycsJGQxOSk7IGRlbGV0ZV90cmFuc2llbnQoJ3BzX2RrX3NlaW1vcycpOwogICAgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9jbGVhcl9jYWNoZScpKSB7IC8qIHRpayBrYXRlZ29yaWpvcyAqLyB9CiAgICAkb1snZDE5X24nXT1jb3VudCgkZDE5KTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsgfQogIGlmKCRmPT09JzMnKXsgJGQxOT0oYXJyYXkpZ2V0X29wdGlvbigncHNfZGtfZDE5X3NlaW1vcycsYXJyYXkoKSk7CiAgICBmb3JlYWNoKCRwbGFuIGFzICRiPT4keCl7IGZvcmVhY2goYXJyYXlfbWVyZ2UoYXJyYXkoJGIpLCR4WydwYWthaSddKSBhcyAkaWQpeyAkb1snY2hrJ11bJGlkXT1hcnJheShnZXRfcG9zdF9tZXRhKCRpZCwnX3BzX2R5ZHppb19zZWltYScsdHJ1ZSk9PT0keFsnc2VpbWEnXSx3cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3BhX3Bha3VvdGVzX2R5ZGlzJyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpLGdldF9wb3N0X3N0YXR1cygkaWQpKTsgfSAkb1snZDE5J11bJGJdPWluX2FycmF5KCR4WydzZWltYSddLCRkMTksdHJ1ZSk7IH0KICAgIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7IH0KICBpZigkZj09PSc5Jyl7ICRiYWs9Z2V0X29wdGlvbigncHNfczE4NTJyX2JhaycpOyBpZighJGJhayl7ZWNobyBqc29uX2VuY29kZShhcnJheSgndic9PiduZXJhIGJhaycpKTtleGl0O30KICAgIHVwZGF0ZV9vcHRpb24oJ3BzX2RrX2QxOV9zZWltb3MnLCRiYWtbJ2QxOSddKTsKICAgIGZvcmVhY2goJGJha1snbWV0YSddIGFzICRpZD0+JG0peyBpZigkbT09PScnKSBkZWxldGVfcG9zdF9tZXRhKCRpZCwnX3BzX2R5ZHppb19zZWltYScpOyBlbHNlIHVwZGF0ZV9wb3N0X21ldGEoJGlkLCdfcHNfZHlkemlvX3NlaW1hJywkbSk7IHdwX3NldF9vYmplY3RfdGVybXMoJGlkLGFycmF5X21hcCgnaW50dmFsJywkYmFrWyd0ZXJtJ11bJGlkXSksJ3BhX3Bha3VvdGVzX2R5ZGlzJyxmYWxzZSk7IGNsZWFuX3Bvc3RfY2FjaGUoJGlkKTsgfQogICAgZGVsZXRlX3RyYW5zaWVudCgncHNfZGtfc2VpbW9zJyk7ICRvWydhdHN0YXR5dGEnXT0xOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQp9KTsK';
const VER='dep-125703';
const GKEY='ps_s1852';
const PHASES=["1"];
const OUT='analize/s1852_r.json';
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
