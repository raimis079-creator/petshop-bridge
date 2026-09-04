process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTMgcnVuIGU4ciDigJQgUiAodGlrIHNrYWl0eW1hcyk6IFYxMyByZWNvbiDigJQgUGV0c2hvcF9BVl9Ecm9wc2hpcDo6cGVyZHVvdG9zKCkgxaFhbHRpbmlzIGlyIHJlaWvFoW3El3MsIGBfcHNfZHJvcHNoaXBfc2VudF9zcmNgIHJhxaF5bWFzIChrb25zIOKAnkthcnR1IHN1IERyb3BzaGlwcGluZ+KAnCBsYWnFoWthcyksIHZhcmlrbGlvIHNhcmdhcyBwZXRzaG9wLWRyb3BzaGlwLXNhcmdhcy5waHAsIHXFvnNha3ltYWkgc3UgX3BzX3NsYV92ZWxhdmltYXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfZThyJ10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4nUzE2MTMgZThyJyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgc2V0X3RpbWVfbGltaXQoMjgwKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJEo9ZnVuY3Rpb24oJG8peyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7IH07CiAgJHNyYz1mdW5jdGlvbigkY2xzLCRtLCRtYXg9MzAwMCl7IHRyeXsgJHI9bmV3IFJlZmxlY3Rpb25NZXRob2QoJGNscywkbSk7ICRscz1maWxlKCRyLT5nZXRGaWxlTmFtZSgpKTsgJGM9aW1wbG9kZSgnJyxhcnJheV9zbGljZSgkbHMsJHItPmdldFN0YXJ0TGluZSgpLTEsJHItPmdldEVuZExpbmUoKS0kci0+Z2V0U3RhcnRMaW5lKCkrMSkpOyByZXR1cm4gYXJyYXkoJ2YnPT5iYXNlbmFtZSgkci0+Z2V0RmlsZU5hbWUoKSksJ2wnPT4kci0+Z2V0U3RhcnRMaW5lKCkuJy0nLiRyLT5nZXRFbmRMaW5lKCksJ2tvZGFzJz0+bWJfc3Vic3RyKCRjLDAsJG1heCkpOyB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgcmV0dXJuICdFUlIgJy4kZS0+Z2V0TWVzc2FnZSgpOyB9IH07CiAgdHJ5ewogICAgJG9bJ3BlcmR1b3Rvc19zcmMnXT0kc3JjKCdQZXRzaG9wX0FWX0Ryb3BzaGlwJywncGVyZHVvdG9zJywyNTAwKTsKICAgICRvWydzZW50X3NyY19yYXN5bWFzJ109YXJyYXkoKTsgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJGZpKXsgaWYoYmFzZW5hbWUoJGZpKT09PSdwZXRzaG9wLWRhcmJhbGF1a2lzLnBocCcpIGNvbnRpbnVlOyAkbHM9ZmlsZSgkZmkpOyBmb3JlYWNoKCRscyBhcyAkaT0+JGwpeyBpZihzdHJwb3MoJGwsJ19wc19kcm9wc2hpcF9zZW50X3NyYycpIT09ZmFsc2V8fHN0cnBvcygkbCwnX3BzX2Ryb3BzaGlwX3NlbnQnKSE9PWZhbHNlJiZzdHJwb3MoJGwsJ3VwZGF0ZV9tZXRhJykhPT1mYWxzZSl7ICRvWydzZW50X3NyY19yYXN5bWFzJ11bXT1iYXNlbmFtZSgkZmkpLic6Jy4oJGkrMSkuJyAnLm1iX3N1YnN0cih0cmltKCRsKSwwLDI0MCk7IH0gfSB9CiAgICAkc2Y9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1kcm9wc2hpcC1zYXJnYXMucGhwJzsgJG9bJ3NhcmdhcyddPWZpbGVfZXhpc3RzKCRzZik/YXJyYXkoJ2R5ZGlzJz0+ZmlsZXNpemUoJHNmKSwnbWQ1Jz0+bWQ1X2ZpbGUoJHNmKSwnYW50cmFzdGUnPT5tYl9zdWJzdHIoZmlsZV9nZXRfY29udGVudHMoJHNmKSwwLDE4MDApKTonbmVyYSc7CiAgICAkb1snc2xhX3V6cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG0ub3JkZXJfaWQgaWQsIG8uc3RhdHVzLCBMRUZUKG0ubWV0YV92YWx1ZSw4MCkgdiBGUk9NIHskcH13Y19vcmRlcnNfbWV0YSBtIEpPSU4geyRwfXdjX29yZGVycyBvIE9OIG8uaWQ9bS5vcmRlcl9pZCBXSEVSRSBtLm1ldGFfa2V5PSdfcHNfc2xhX3ZlbGF2aW1hcycgT1JERVIgQlkgbS5vcmRlcl9pZCBERVNDIExJTUlUIDIwIixBUlJBWV9BKTsKICAgICRvWydzZW50X3V6cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG0ub3JkZXJfaWQgaWQsIG8uc3RhdHVzLCBtLm1ldGFfa2V5IGssIExFRlQobS5tZXRhX3ZhbHVlLDE2MCkgdiBGUk9NIHskcH13Y19vcmRlcnNfbWV0YSBtIEpPSU4geyRwfXdjX29yZGVycyBvIE9OIG8uaWQ9bS5vcmRlcl9pZCBXSEVSRSBtLm1ldGFfa2V5IElOICgnX3BzX2Ryb3BzaGlwX3NlbnQnLCdfcHNfZHJvcHNoaXBfc2VudF9zcmMnKSBBTkQgby5zdGF0dXM9J3djLXByb2Nlc3NpbmcnIE9SREVSIEJZIG0ub3JkZXJfaWQgREVTQyBMSU1JVCAzMCIsQVJSQVlfQSk7CiAgICBmb3JlYWNoKGFycmF5KDM1NDIxLDM1NDQxLDM1NDE4LDM1NDIwKSBhcyAkaWQpeyAkeD13Y19nZXRfb3JkZXIoJGlkKTsgaWYoJHgpeyAkb1sncGVyZCddWyRpZF09YXJyYXkoJ3N0Jz0+JHgtPmdldF9zdGF0dXMoKSwncGVyZHVvdG9zJz0+UGV0c2hvcF9BVl9Ecm9wc2hpcDo6cGVyZHVvdG9zKCR4KSwnaXNzJz0+KHN0cmluZykkeC0+Z2V0X21ldGEoJ19wc19kYWx5c19pc3NpdXN0YScpLCdzbGEnPT4oc3RyaW5nKSR4LT5nZXRfbWV0YSgnX3BzX3NsYV92ZWxhdmltYXMnKSwna2wnPT5QZXRzaG9wX0Rlc2s6OmtsYXVzaW1hcygkeCkpOyB9IH0KICAgICRvWydkZXNrX2tsYXVzaW1hcyddPSRzcmMoJ1BldHNob3BfRGVzaycsJ2tsYXVzaW1hcycsMjIwMCk7CiAgICAkb1snbm93J109Y3VycmVudF90aW1lKCdteXNxbCcpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogICRKKCRvKTsKfSw5OSk7Cg==';
const VER='dep-111757';
const GKEY='ps_e8r';
const PHASES=["R"];
const OUT='analize/s1613_e8_run1r.json';
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
