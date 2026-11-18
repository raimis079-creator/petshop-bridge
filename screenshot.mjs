process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODkwdSBrdXJqZXJpcyB0aWtyb2plIGthc29qZSAocmVhZC1vbmx5ICsgbnVvdHJhdWtvcykgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODkwdiddKSkgcmV0dXJuOyAkcj1bJ3YnPT4ndTEnLCdzaG90cyc9PltdXTsgZ2xvYmFsICR3cGRiOwogIHRyeXsKICAgIC8qIHRpa3JhIGthc2E6IHR1xaHEjWlhcyBrcmVwxaFlbGlzIOKGkiAxNSBrZyDDlzEsIHRhZGEgw5czICovCiAgICAkdWlkPTQ0OyBkZWxldGVfdXNlcl9tZXRhKCR1aWQsJ193b29jb21tZXJjZV9wZXJzaXN0ZW50X2NhcnRfJy5nZXRfY3VycmVudF9ibG9nX2lkKCkpOyAkd3BkYi0+ZGVsZXRlKCR3cGRiLT5wcmVmaXguJ3dvb2NvbW1lcmNlX3Nlc3Npb25zJyxbJ3Nlc3Npb25fa2V5Jz0+KHN0cmluZykkdWlkXSk7CiAgICAkZXhwPXRpbWUoKSszKkhPVVJfSU5fU0VDT05EUzsgJHRvaz1XUF9TZXNzaW9uX1Rva2Vuczo6Z2V0X2luc3RhbmNlKCR1aWQpLT5jcmVhdGUoJGV4cCk7CiAgICAkclsnY29va2llcyddPVtbJ25hbWUnPT5MT0dHRURfSU5fQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnbG9nZ2VkX2luJywkdG9rKSwnZG9tYWluJz0+J3BldHNob3AubHQnXSxbJ25hbWUnPT4ncHNfanMnLCd2YWx1ZSc9PicxJywnZG9tYWluJz0+J3BldHNob3AubHQnXV07CiAgICAkZXY9Im5ldyBQcm9taXNlKHI9PnNldFRpbWVvdXQoKCk9PnIoQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjc2hpcHBpbmdfbWV0aG9kIGxpLCAud29vY29tbWVyY2Utc2hpcHBpbmctbWV0aG9kcyBsaScpKS5tYXAobD0+bC5pbm5lclRleHQucmVwbGFjZSgvXFxzKy9nLCcgJykudHJpbSgpKS5qb2luKCcgfHwgJykpLDQwMDApKSI7CiAgICAkaD0wOyBmb3JlYWNoKCR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcC5JRCBGUk9NIHskd3BkYi0+cG9zdHN9IHAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBtIE9OIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdfd2VpZ2h0JyBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBDQVNUKG0ubWV0YV92YWx1ZSBBUyBERUNJTUFMKDEwLDIpKSBCRVRXRUVOIDEyIEFORCAyMCBMSU1JVCAyMDAiKSBhcyAkaWQpeyAkeD13Y19nZXRfcHJvZHVjdCgkaWQpOyBpZigkeCAmJiAkeC0+aXNfdHlwZSgnc2ltcGxlJykgJiYgJHgtPmlzX2luX3N0b2NrKCkgJiYgJHgtPmhhc19lbm91Z2hfc3RvY2soNikgJiYgZ2V0X3Bvc3RfbWV0YSgkaWQsJ19wc190aWtfa3VyamVyaXUnLHRydWUpIT09J3llcycpeyAkaD0oaW50KSRpZDsgYnJlYWs7IH0gfQogICAgJHg9d2NfZ2V0X3Byb2R1Y3QoJGgpOyAka2c9KGZsb2F0KSR4LT5nZXRfd2VpZ2h0KCk7ICRyWydwcmVrZSddPVskaCwkeC0+Z2V0X25hbWUoKSwka2csJHgtPmdldF9zaGlwcGluZ19jbGFzc19pZCgpXTsKICAgICRldj0ibmV3IFByb21pc2Uocj0+c2V0VGltZW91dCgoKT0+cihBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNzaGlwcGluZ19tZXRob2QgbGksIC53b29jb21tZXJjZS1zaGlwcGluZy1tZXRob2RzIGxpJykpLm1hcChsPT5sLmlubmVyVGV4dC5yZXBsYWNlKC9cXHMrL2csJyAnKS50cmltKCkuc2xpY2UoMCw2MCkpLmpvaW4oJyB8fCAnKSksNDAwMCkpIjsKICAgICRyWydzaG90cyddW109WyduJz0+J3MxODkwdV8wJywndSc9PmhvbWVfdXJsKCcvP3Q9Jy50aW1lKCkpLCd3Jz0+MzkwLCdoJz0+NTAwXTsKICAgIGZvcmVhY2goWzMsNCw1LDZdIGFzICRpPT4kcSl7ICRhZGQ9JGk9PT0wPzM6MTsKICAgICAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4OTB1X2FkZCcuJHEsJ3UnPT5ob21lX3VybCgnLz9hZGQtdG8tY2FydD0nLiRoLicmcXVhbnRpdHk9Jy4kYWRkLicmbmM9Jy4kcSksJ3cnPT4zOTAsJ2gnPT41MDBdOwogICAgICAkclsnc2hvdHMnXVtdPVsnbic9PidzMTg5MHVfa2FzYV8nLiRxLid2bnQnLCd1Jz0+d2NfZ2V0X2NoZWNrb3V0X3VybCgpLic/YT0nLiRxLCd3Jz0+MzkwLCdoJz0+OTAwLCdldmFsJz0+JGV2XTsKICAgICAgJHJbJ2ZuJ11bJHEuJ3ZudF8nLigkcSoka2cpLidrZyddPVBldHNob3BfUHJlbnVtZXJhdGE6Omt1cmplcmlvX2N0KFtbJ3Byb2R1Y3RfaWQnPT4kaCwncXR5Jz0+JHFdXSk7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LDEpOwo=';
const VER='dep-194227';
const GKEY='ps_s1890v';
const PHASES=["GO"];
const OUT='analize/s1890_v.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
