process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODIwdiBEUCBwYWvFsyBhcHJhxaF5bWFzIHBlciBha29yZGVvbsSFIChzbmlwcGV0IDUxMikgKyDigJ5NYWlzdG8gcHJpZWRhaSIgYW50cmHFoXTEly4gRmF6xJdzOiAyIHRhaWt5dGksIDMgcGF0aWtyYSwgOSBhdHN0YXR5dGkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODIwdiddKSkgcmV0dXJuOyAkZj0oc3RyaW5nKSRfR0VUWydwc19zMTgyMHYnXTsgJHI9Wyd2Jz0+J1MxODIwdicsJ2ZhemUnPT4kZl07IGdsb2JhbCAkd3BkYjsgQHNldF90aW1lX2xpbWl0KDE3MCk7CiAgJEZOPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Atcmlua2luaWFpLnBocCc7ICRPTEQ9J2MyNDJmNTE5NDNkY2RkNzYyNmIyZWQ4YjU0ZjkwYzA0JzsgJEJBSz1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMtYXJjaHl2YXMvcGV0c2hvcC1yaW5raW5pYWkucGhwLmJha19zMTgyMHYnOwogICRBPSIJCVwkcGlkID0gXCRwcm9kdWN0LT5nZXRfaWQoKTtcbgkJXCRyaW5raW55cyA9ICggZ2V0X3Bvc3RfbWV0YSggXCRwaWQsIHNlbGY6Ok1FVEFfS0lFS0lBSSwgdHJ1ZSApICE9PSAnJyApIjsKICAkQj0iCQlcJHBpZCA9IFwkcHJvZHVjdC0+Z2V0X2lkKCk7XG4JCWlmICggZ2V0X3Bvc3RfbWV0YSggXCRwaWQsICdfZHBfYmFzZV9wcm9kdWN0X2lkJywgdHJ1ZSApICE9PSAnJyApIHsgcmV0dXJuIFwkdGFiczsgfSAvKiBTMTgyMDogRFAgcGFrYXMgPSB0YSBwYXRpIHByZWvElyDDlyBOIOKGkiBhcHJhxaF5bW8gYWtvcmRlb25hcyAoNTEyKSBrYWlwIGJhemluZWkgKi9cbgkJXCRyaW5raW55cyA9ICggZ2V0X3Bvc3RfbWV0YSggXCRwaWQsIHNlbGY6Ok1FVEFfS0lFS0lBSSwgdHJ1ZSApICE9PSAnJyApIjsKICAkSURTPVszMzk4NCwzNzQxNSwzNzQxNiwzNzQxN107CiAgJEwxPSc8cD48c3Ryb25nPk1haXN0aW5pYWkgcHJpZWRhaSAoMSBrZyk6PC9zdHJvbmc+IHZpdGFtaW5hcyBBIChyZXRpbmlsbyBhY2V0YXRhcykgNDM3NSBUViwgdml0YW1pbmFzIEQzIDI0NSBUViwgdml0YW1pbmFzIEUgKHZpc8WzIHJhY2VtYXTFsyBhbGZhLXRva29mZXJpbG8gYWNldGF0YXMpIDI5IG1nLCBjaW5rYXMgKGNpbmtvIG9rc2lkYXMpIDE2IG1nLjwvcD4nOwogICRMMj0nPHA+PHN0cm9uZz5NYWlzdG8gcHJpZWRhaTo8L3N0cm9uZz4gdml0YW1pbmFzIEEgKHJldGluaWxvIGFjZXRhdGFzKSA0Mzc1IFRWLCB2aXRhbWluYXMgRDMgMjQ1IFRWLCB2aXRhbWluYXMgRSAodmlzxbMgcmFjZW1hdMWzIGFsZmEtdG9rb2ZlcmlsbyBhY2V0YXRhcykgMjkgbWcsIGNpbmthcyAoY2lua28gb2tzaWRhcykgMTYgbWcgKGtpZWtpYWkgMSBrZyBwYcWhYXJvKS48L3A+JzsKICAkdmFseXRpPWZ1bmN0aW9uKCkgdXNlKCRJRFMsJHdwZGIpeyBmb3JlYWNoKCRJRFMgYXMgJGlkKSBjbGVhbl9wb3N0X2NhY2hlKCRpZCk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfY2xlYXJfY2FjaGUnKSkgd3BfY2FjaGVfY2xlYXJfY2FjaGUoKTsgfTsKICAkY2hrPWZ1bmN0aW9uKCkgdXNlKCRJRFMpeyAkbz1bXTsgZm9yZWFjaChhcnJheV9zbGljZSgkSURTLDEpIGFzICRpZCl7ICR4PXdwX3JlbW90ZV9nZXQoYWRkX3F1ZXJ5X2FyZygncHNfaGInLHRpbWUoKSxnZXRfcGVybWFsaW5rKCRpZCkpLFsndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZV0pOyAkaD13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkeCk7IHByZWdfbWF0Y2hfYWxsKCcvPHN1bW1hcnk+KFtePF0qKTxcL3N1bW1hcnk+L3UnLCRoLCRtKTsgJG9bJGlkXT1bJ2tvZGFzJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpLCdha29yZGVvbmFzJz0+c3RycG9zKCRoLCdwcy1kZXNjLWFjYycpIT09ZmFsc2UsJ3JpbmsnPT5zdHJwb3MoJGgsJ3BzLXJpbmstYXByYXN5bWFzJykhPT1mYWxzZSwnc2VrY2lqb3MnPT4kbVsxXV07IH0gJGgwPXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8/cHNfaGI9Jy50aW1lKCkpLFsndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZV0pOyAkb1snaGInXT13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkaDApOyByZXR1cm4gJG87IH07CiAgdHJ5ewogICAgJHJbJ21kNSddPW1kNV9maWxlKCRGTik7CiAgICBpZigkZj09PScyJyl7CiAgICAgIGlmKCRyWydtZDUnXSE9PSRPTEQpIHRocm93IG5ldyBFeGNlcHRpb24oJ3JpbmtpbmlhaSBtZDUgJy4kclsnbWQ1J10pOwogICAgICAkYz1maWxlX2dldF9jb250ZW50cygkRk4pOyBpZihzdWJzdHJfY291bnQoJGMsJEEpIT09MSkgdGhyb3cgbmV3IEV4Y2VwdGlvbigndmlldGEgbmVyYXN0YScpOwogICAgICBjb3B5KCRGTiwkQkFLKTsgJG49c3RyX3JlcGxhY2UoJEEsJEIsJGMpOyAkdG1wPSRGTi4nLnRtcF9zMTgyMHYnOyBmaWxlX3B1dF9jb250ZW50cygkdG1wLCRuKTsKICAgICAgZmlsZV9wdXRfY29udGVudHMoJEZOLCRuKTsgQHVubGluaygkdG1wKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCdvcGNhY2hlX2ludmFsaWRhdGUnKSkgb3BjYWNoZV9pbnZhbGlkYXRlKCRGTix0cnVlKTsgJHJbJ21kNV9uYXVqYXMnXT1tZDVfZmlsZSgkRk4pOwogICAgICBmb3JlYWNoKCRJRFMgYXMgJGlkKXsgJHA9Z2V0X3Bvc3QoJGlkKTsgaWYoc3RycG9zKCRwLT5wb3N0X2NvbnRlbnQsJEwxKSE9PWZhbHNlKXsgd3BfdXBkYXRlX3Bvc3QoWydJRCc9PiRpZCwncG9zdF9jb250ZW50Jz0+c3RyX3JlcGxhY2UoJEwxLCRMMiwkcC0+cG9zdF9jb250ZW50KV0pOyAkclsncHJpZWRhaSddWyRpZF09J29rJzsgfSBlbHNlICRyWydwcmllZGFpJ11bJGlkXT0nbmVyYXN0YSc7IH0KICAgICAgJHZhbHl0aSgpOyBzbGVlcCgxKTsgJHJbJ2NoayddPSRjaGsoKTsKICAgICAgaWYoJHJbJ2NoayddWydoYiddIT09MjAwKXsgY29weSgkQkFLLCRGTik7IGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpIG9wY2FjaGVfaW52YWxpZGF0ZSgkRk4sdHJ1ZSk7ICR2YWx5dGkoKTsgJHJbJ0FUU1RBVFlUQV9BVVRPJ109JGNoaygpOyB9CiAgICB9CiAgICBpZigkZj09PSczJykgJHJbJ2NoayddPSRjaGsoKTsKICAgIGlmKCRmPT09JzknKXsgaWYoaXNfZmlsZSgkQkFLKSl7IGNvcHkoJEJBSywkRk4pOyBpZihmdW5jdGlvbl9leGlzdHMoJ29wY2FjaGVfaW52YWxpZGF0ZScpKSBvcGNhY2hlX2ludmFsaWRhdGUoJEZOLHRydWUpO30gJHZhbHl0aSgpOyAkclsnY2hrJ109JGNoaygpOyAkclsnbWQ1X3BvJ109bWQ1X2ZpbGUoJEZOKTsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-174413';
const GKEY='ps_s1820v';
const PHASES=["2"];
const OUT='analize/s1820_v2.json';
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
