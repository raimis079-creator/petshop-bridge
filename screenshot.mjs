process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODU0YiDigJQgcmVjb246IGxpa3XEjWlhaSwgRFAgbnVyYcWheW1vIGtvZGFzICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgJGY9KGlzc2V0KCRfR0VUWydwc19zMTg1NCddKT8kX0dFVFsncHNfczE4NTQnXTonJyk7IGlmKCRmPT09JycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE4NTRiLScuJGYpOwogIGZvcmVhY2goYXJyYXkoMzg0MzAsMzg0MzIsMzg0MzQsMzg0MzYsMzg0MzgsMzg0NDAsMzg0NzEsMzg0NzMpIGFzICRpZCl7ICRwcj13Y19nZXRfcHJvZHVjdCgkaWQpOwogICAgJG9bJ2InXVskaWRdPWFycmF5KCRwci0+Z2V0X3N0YXR1cygpLCRwci0+Z2V0X3N0b2NrX3F1YW50aXR5KCksJHByLT5nZXRfc3RvY2tfc3RhdHVzKCksJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBzdG9ja19xdHkgRlJPTSB7JHB9cHNfc291cmNlcyBXSEVSRSBwcm9kdWN0X2lkPSVkIEFORCBzb3VyY2U9J2F2JyIsJGlkKSksY2xhc3NfZXhpc3RzKCdQZXRzaG9wX1N0b2NrX1NlcnZpY2UnKT9QZXRzaG9wX1N0b2NrX1NlcnZpY2U6OnBhcmR1b2RhbWEoJGlkKVsna29kZWwnXTpudWxsLG1iX3N1YnN0cigkcHItPmdldF9uYW1lKCksMCw1MCkpOyB9CiAgZm9yZWFjaChhcnJheSgzODQ0MiwzODQ0MywzODQ0NCwzODQ0NSwzODQ0NiwzODQ0NywzODQ0OCwzODQ0OSkgYXMgJGlkKXsgJHByPXdjX2dldF9wcm9kdWN0KCRpZCk7ICRvWydwJ11bJGlkXT1hcnJheSgkcHItPmdldF9zdGF0dXMoKSwkcHItPmdldF9zdG9ja19zdGF0dXMoKSwkcHItPmlzX3B1cmNoYXNhYmxlKCksJHByLT5pc19pbl9zdG9jaygpKTsgfQogIC8qIERQIG51cmHFoXltbyBrb2RhcyAqLwogICRoaXRzPWFycmF5KCk7IGZvcmVhY2goYXJyYXlfbWVyZ2UoZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcCovKi5waHAnKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wKi8qLyoucGhwJyksZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpKSBhcyAkZm4peyAkYz1AZmlsZV9nZXRfY29udGVudHMoJGZuKTsgaWYoISRjfHxzdHJwb3MoJGMsJ19kcF9iYXNlX3Byb2R1Y3RfaWQnKT09PWZhbHNlKSBjb250aW51ZTsKICAgIGZvcmVhY2goZXhwbG9kZSgiXG4iLCRjKSBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvcmVkdWNlfGluY3JlYXNlfHdjX3VwZGF0ZV9wcm9kdWN0X3N0b2NrfHN0b2NrX3F1YW50aXR5fF9yZWR1Y2VkX3N0b2NrfHJlc3RvcmUvaScsJGwpICkgJGhpdHNbYmFzZW5hbWUoJGZuKV1bXT0oJGkrMSkuJzogJy5tYl9zdWJzdHIodHJpbSgkbCksMCwyMDApOyB9IH0KICBmb3JlYWNoKCRoaXRzIGFzICRrPT4kdikgJGhpdHNbJGtdPWFycmF5X3NsaWNlKCR2LDAsMTIpOwogICRvWydrb2RhcyddPSRoaXRzOwogIC8qIHBhc2t1dGluaXMgdcW+c2FreW1hcyBzdSBEUCBwYWt1OiBhciBiYXrEl3MgbGlrdXRpcyBudXJhxaF5dGFzICovCiAgJHJvdz0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIG9pLm9yZGVyX2lkLCBvaW0ubWV0YV92YWx1ZSBwaWQgRlJPTSB7JHB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbXMgb2kgSk9JTiB7JHB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgb2ltIE9OIG9pbS5vcmRlcl9pdGVtX2lkPW9pLm9yZGVyX2l0ZW1faWQgQU5EIG9pbS5tZXRhX2tleT0nX3Byb2R1Y3RfaWQnIEpPSU4geyRwfXBvc3RtZXRhIG0gT04gbS5wb3N0X2lkPW9pbS5tZXRhX3ZhbHVlIEFORCBtLm1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJyBPUkRFUiBCWSBvaS5vcmRlcl9pZCBERVNDIExJTUlUIDEiLEFSUkFZX0EpOwogIGlmKCRyb3cpeyAkb3JkPXdjX2dldF9vcmRlcigkcm93WydvcmRlcl9pZCddKTsgJG5vdGVzPXdjX2dldF9vcmRlcl9ub3RlcyhhcnJheSgnb3JkZXJfaWQnPT4kcm93WydvcmRlcl9pZCddLCdsaW1pdCc9PjE1KSk7ICRvWydwdnonXT1hcnJheSgnb3JkZXInPT4kcm93WydvcmRlcl9pZCddLCdwYWsnPT4kcm93WydwaWQnXSwnZGF0YSc9PiRvcmQ/JG9yZC0+Z2V0X2RhdGVfY3JlYXRlZCgpLT5kYXRlKCdZLW0tZCBIOmknKTonJywgJ2J1c2VuYSc9PiRvcmQ/JG9yZC0+Z2V0X3N0YXR1cygpOicnLCAncGFzdGFib3MnPT5hcnJheV9tYXAoZnVuY3Rpb24oJG4pe3JldHVybiBtYl9zdWJzdHIod3Bfc3RyaXBfYWxsX3RhZ3MoJG4tPmNvbnRlbnQpLDAsMjIwKTt9LCRub3RlcykpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-145533';
const GKEY='ps_s1854';
const PHASES=["S"];
const OUT='analize/s1854_b.json';
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
