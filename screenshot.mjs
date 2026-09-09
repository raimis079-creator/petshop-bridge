process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjYxIGxpa3VjaW8gZ3JhemEgKERSWS9BKSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj1pc3NldCgkX0dFVFsncHNfczE2NjFnJ10pPyRfR0VUWydwc19zMTY2MWcnXTonJzsgaWYoJGYhPT0nRFJZJyYmJGYhPT0nQScpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjYxRycsJ2ZhemUnPT4kZik7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOyAkcGlkPTE0OTUxOwogICAgaWYoJGY9PT0nRFJZJyl7CiAgICAgIGZvcmVhY2goYXJyYXkoJ19zdG9jaycsJ19wc19zYW5kZWxpcycsJ192Zl9xdHknLCdfemJfcXR5JywnX293bl9zdG9ja19xdHknLCdfbWFuYWdlX3N0b2NrJykgYXMgJGspCiAgICAgICAgJG9bJ21ldGEnXVska109Z2V0X3Bvc3RfbWV0YSgkcGlkLCRrLHRydWUpOwogICAgICAvLyB2aXNhIGxpa3VjaW8gcGFzdGFidSBpc3RvcmlqYSBzaWFpIHByZWtlaQogICAgICAkb1sncGFzdGFib3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBjb21tZW50X3Bvc3RfSUQgb2lkLGNvbW1lbnRfZGF0ZSBkLExFRlQoY29tbWVudF9jb250ZW50LDEyMCkgdCBGUk9NIHskd3BkYi0+Y29tbWVudHN9IFdIRVJFIGNvbW1lbnRfdHlwZT0nb3JkZXJfbm90ZScgQU5EIGNvbW1lbnRfY29udGVudCBMSUtFICclxb1hcm7FsyBwYWdhbGl1a2FpJScgT1JERVIgQlkgY29tbWVudF9kYXRlIixBUlJBWV9BKTsKICAgICAgLy8gdXpzYWt5bWFpIHN1IHNpYSBwcmVrZQogICAgICAkb1sndXpzYWt5bWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgb2kub3JkZXJfaWQsIG8uc3RhdHVzIEZST00geyR3cGRiLT5wcmVmaXh9d29vY29tbWVyY2Vfb3JkZXJfaXRlbXMgb2kgSk9JTiB7JHdwZGItPnByZWZpeH13b29jb21tZXJjZV9vcmRlcl9pdGVtbWV0YSBtIE9OIG0ub3JkZXJfaXRlbV9pZD1vaS5vcmRlcl9pdGVtX2lkIEFORCBtLm1ldGFfa2V5PSdfcHJvZHVjdF9pZCcgQU5EIG0ubWV0YV92YWx1ZT0lZCBKT0lOIHskd3BkYi0+cHJlZml4fXdjX29yZGVycyBvIE9OIG8uaWQ9b2kub3JkZXJfaWQiLCRwaWQpLEFSUkFZX0EpOwogICAgICAvLyB2YXJpa2xpbyByZWNvbjoga3VyIG5hdWRvamFtYSBfZHBfc3RvY2tfcmVkdWNlZAogICAgICBmb3JlYWNoKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSBhcyAkZmwpewogICAgICAgICRjPWZpbGUoV1BNVV9QTFVHSU5fRElSLicvJy5iYXNlbmFtZSgkZmwpKTsKICAgICAgICBmb3JlYWNoKCRjIGFzICRpPT4kbG4pIGlmKHN0cnBvcygkbG4sJ19kcF9zdG9ja19yZWR1Y2VkJykhPT1mYWxzZSkgJG9bJ2RwX2t1ciddW109YmFzZW5hbWUoJGZsKS4nOicuKCRpKzEpLicgJy50cmltKG1iX3N1YnN0cigkbG4sMCwxMDApKTsKICAgICAgfQogICAgfSBlbHNlIHsKICAgICAgLy8gQTogKzQga2lla3ZpZW5hbSBpcyAzNTg3NC8zNTg3NSwgaWRlbXBvdGVuY2lqYSBwZXIgcGFzdGFiYQogICAgICBmb3JlYWNoKGFycmF5KDM1ODc0LDM1ODc1KSBhcyAkb2lkKXsKICAgICAgICAkeXJhPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+Y29tbWVudHN9IFdIRVJFIGNvbW1lbnRfcG9zdF9JRD0lZCBBTkQgY29tbWVudF90eXBlPSdvcmRlcl9ub3RlJyBBTkQgY29tbWVudF9jb250ZW50IExJS0UgJyUlcmFua2luaXUgYsWrZHUgUzE2NjElJSciLCRvaWQpKTsKICAgICAgICBpZigkeXJhKXsgJG9bJ29yZCddWyRvaWRdPSdKQVUnOyBjb250aW51ZTsgfQogICAgICAgICRwcj13Y19nZXRfcHJvZHVjdCgkcGlkKTsgJHByaWVzPSRwci0+Z2V0X3N0b2NrX3F1YW50aXR5KCk7CiAgICAgICAgJHBvPXdjX3VwZGF0ZV9wcm9kdWN0X3N0b2NrKCRwciw0LCdpbmNyZWFzZScpOwogICAgICAgICRvcmQ9d2NfZ2V0X29yZGVyKCRvaWQpOwogICAgICAgICRvcmQtPmFkZF9vcmRlcl9ub3RlKCdMaWt1dGlzIHBhZGlkaW50YXMgcmFua2luaXUgYsWrZHUgUzE2NjE6IMW9YXJuxbMgcGFnYWxpdWthaSwgODAgZyArNCAoJy4kcHJpZXMuJ+KGkicuJHBvLicpLiBBdMWhYXVraW1vIG1ldHUgYXV0b21hdGluaXMgZ3LEhcW+aW5pbWFzIG5lxK92eWtvLicpOwogICAgICAgICRvWydvcmQnXVskb2lkXT1hcnJheSgncHJpZXMnPT4kcHJpZXMsJ3BvJz0+JHBvKTsKICAgICAgfQogICAgICAkb1snZ2FsdXRpbmlzJ109Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfc3RvY2snLHRydWUpOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-105754';
const GKEY='ps_s1661g';
const PHASES=["A"];
const OUT='analize/s1661_ga.json';
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

