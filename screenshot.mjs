process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzIyYiByZWFkLW9ubHk6IGZlZWQgYXRyYW5rYSAocHNfZmVlZHNfaWRzKSwgcGFrYWkgZmVlZCd1b3NlLCBHVElOLCBmZWVkX29mZiBtZXRhLCBSeXRvIHNhcmdvIHBhdGlrcnUgc3RydWt0dXJhICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcyMmInXSkpIHJldHVybjsgJHI9Wyd2Jz0+J1MxNzIyYiddOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7IEBzZXRfdGltZV9saW1pdCgxMjApOwogIHRyeXsKICAgICRmZj1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1mZWVkcy9wZXRzaG9wLWZlZWRzLnBocCc7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmZik7CiAgICAkaT1zdHJwb3MoJHMsJ2Z1bmN0aW9uIHBzX2ZlZWRzX2lkcycpOyAkclsnaWRzX2ZuJ109c3Vic3RyKCRzLCRpLDIyMDApOwogICAgJGk9c3RycG9zKCRzLCdmdW5jdGlvbiBwc19mZWVkc19nZW5lcnVvdGknKTsgJHJbJ2dlbl9mbiddPXN1YnN0cigkcywkaSwzMjAwKTsKICAgICRpPXN0cnBvcygkcywnZnVuY3Rpb24gcHNfZmVlZHNfcHJla2UnKTsgJHJbJ3ByZWtlX2ZuJ109c3Vic3RyKCRzLCRpLDE4MDApOwogICAgJGlkcz1hcnJheV9tYXAoJ2ludHZhbCcsJHdwZGItPmdldF9jb2woIlNFTEVDVCBwb3N0X2lkIEZST00geyRQfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJyBBTkQgbWV0YV92YWx1ZTw+JyciKSk7CiAgICBpZihmdW5jdGlvbl9leGlzdHMoJ3BzX2ZlZWRzX2lkcycpKXsgJGFsbD1hcnJheV9tYXAoJ2ludHZhbCcscHNfZmVlZHNfaWRzKCkpOyAkclsnZmVlZF9pZHNfdmlzbyddPWNvdW50KCRhbGwpOyAkclsncGFrYWlfZmVlZF9pZHMnXT1hcnJheV92YWx1ZXMoYXJyYXlfaW50ZXJzZWN0KCRpZHMsJGFsbCkpOyB9CiAgICAkaW49aW1wbG9kZSgnLCcsJGlkcyk7CiAgICAkclsncGFrdV9ndGluJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG9zdF9pZCxtZXRhX2tleSxtZXRhX3ZhbHVlIEZST00geyRQfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQgSU4gKCRpbikgQU5EIG1ldGFfa2V5IElOICgnX2dsb2JhbF91bmlxdWVfaWQnLCdfZWFuJywnX3BzX2ZlZWRfb2ZmX2dvb2dsZScsJ19wc19mZWVkX29mZl9rYWluYTI0JywnX3BzX2ZlZWRfb2ZmX2thaW5vcycsJ193ZWlnaHQnKSBBTkQgbWV0YV92YWx1ZTw+JyciLEFSUkFZX0EpOwogICAgJHJbJ2ZlZWRfb2ZmX3JlaWtzbWVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbWV0YV9rZXksIG1ldGFfdmFsdWUsIENPVU5UKCopIG4gRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXkgTElLRSAnX3BzX2ZlZWRfb2ZmXyUnIEdST1VQIEJZIDEsMiIsQVJSQVlfQSk7CiAgICAkZz1maWxlX2dldF9jb250ZW50cyh3cF91cGxvYWRfZGlyKClbJ2Jhc2VkaXInXS4nL3BldHNob3AtZmVlZHMvZ29vZ2xlLnhtbCcpOyBpZihwcmVnX21hdGNoKCcjPGl0ZW0+KD86KD8hPC9pdGVtPikuKSozNTg1Nig/Oig/ITwvaXRlbT4pLikqPC9pdGVtPiNzJywkZywkbSkpICRyWydnb29nbGVfMzU4NTZfaXRlbSddPW1iX3N1YnN0cigkbVswXSwwLDE1MDApOwogICAgJHJbJ2dvb2dsZV9pZHNfcGFrYWknXT1bXTsgZm9yZWFjaCgkaWRzIGFzICRpZCl7IGlmKHN0cnBvcygkZywnPGc6aWQ+Jy4kaWQuJzwvZzppZD4nKSE9PWZhbHNlKSAkclsnZ29vZ2xlX2lkc19wYWthaSddW109JGlkOyB9CiAgICAvLyBnOmlkIGZvcm1hdGFzCiAgICBwcmVnX21hdGNoX2FsbCgnIzxnOmlkPihbXjxdKyk8L2c6aWQ+IycsJGcsJG1tKTsgJHJbJ2dvb2dsZV9pZF9wdnonXT1hcnJheV9zbGljZSgkbW1bMV0sMCw1KTsgJHJbJ2dvb2dsZV9pZF92aXNvJ109Y291bnQoJG1tWzFdKTsKICAgIC8vIFJ5dG8gc2FyZ2FzOiBwYXRpa3JvcygpIHN0cnVrdHVyYSDigJQga2FpcCBwcmlkZWRhbWEgbGVtcHV0ZQogICAgJHJzPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Atcnl0YXMucGhwJyk7ICRyWydyeXRhc192ZXInXT1wcmVnX21hdGNoKCcjVmVyc2lvbjpccyooW1xkLl0rKSMnLCRycywkbTIpPyRtMlsxXTpudWxsOyAkclsncnl0YXNfbWQ1J109bWQ1KCRycyk7CiAgICAkaT1zdHJwb3MoJHJzLCIvKiBzZWltb3MgKi8iKTsgaWYoJGk9PT1mYWxzZSkgJGk9c3RycG9zKCRycywiJ3NlaW1vcyciKTsgJHJbJ3J5dGFzX3NlaW1vc19ibG9rYXMnXT0kaSE9PWZhbHNlP3N1YnN0cigkcnMsbWF4KDAsJGktMjAwKSwxOTAwKTpudWxsOwogICAgJGk9c3RycG9zKCRycywnZnVuY3Rpb24gcGF0aWtyb3MnKTsgJHJbJ3J5dGFzX3BhdGlrcm9zX2hlYWQnXT0kaSE9PWZhbHNlP3N1YnN0cigkcnMsJGksOTAwKTpudWxsOwogICAgLy8gYmF6aXUga2FpbnUgcG9reWNpdSBkYXpuaXM6IGtpZWsgcHVibGlzaCBwcmVraXUgX3ByaWNlIGtlaXRlc2k/IG5lcmEgaXN0b3Jpam9zIOKAlCBwc19rYWludV96dXJuYWxhcz8gdGlrcmluYW0gbGVudGVsZXMKICAgICRyWydrYWludV9sZW50ZWxlcyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICd7JFB9cHNfJWthaW4lJyIpOwogICAgJHJbJ2thdF9rYWludV9sb2cnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyRQfXBzX2thdGFsb2dvJSciKTsKICAgIC8vIHBha2FpOiBfcmVndWxhcl9wcmljZSB2cyBxdHkqYmFzZSooMS1kKSBkYWJhcnRpbmlzIGQgaXIgJ2FwdmFsaW5pbW8nIHBhdnl6ZHppYWkKICAgIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkYj0oaW50KWdldF9wb3N0X21ldGEoJGlkLCdfZHBfYmFzZV9wcm9kdWN0X2lkJyx0cnVlKTsgJHE9KGludClnZXRfcG9zdF9tZXRhKCRpZCwnX2RwX3BhY2tfcXR5Jyx0cnVlKTsgJGJwPShmbG9hdClnZXRfcG9zdF9tZXRhKCRiLCdfcmVndWxhcl9wcmljZScsdHJ1ZSk7ICRwcD0oZmxvYXQpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19yZWd1bGFyX3ByaWNlJyx0cnVlKTsgJHJbJ3Bha2FpJ11bXT1bJGlkLCRxLCRiLCRicCwkcHAsJGJwPjA/cm91bmQoKDEtJHBwLygkcSokYnApKSoxMDAsMik6bnVsbCwnbW9kJz0+Z2V0X3Bvc3RfZmllbGQoJ3Bvc3RfbW9kaWZpZWQnLCRpZCksJ2Jhc2VfbW9kJz0+Z2V0X3Bvc3RfZmllbGQoJ3Bvc3RfbW9kaWZpZWQnLCRiKSwnYmFzZV9zdGF0dXMnPT5nZXRfcG9zdF9zdGF0dXMoJGIpXTsgfQogICAgLy8gc2F1c2FzIG1haXN0YXMgYmF6aW5pdSBrYWludSBnYWx1bmVzIChhcHZhbGluaW1vIHRhaXN5a2xlaSkKICAgICRyWydrYWludV9nYWx1bmVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgUklHSFQocG0ubWV0YV92YWx1ZSwzKSBnLCBDT1VOVCgqKSBuIEZST00geyRQfXBvc3RtZXRhIHBtIEpPSU4geyRQfXBvc3RtZXRhIHMgT04gcy5wb3N0X2lkPXBtLnBvc3RfaWQgQU5EIHMubWV0YV9rZXk9J19wc19keWR6aW9fc2VpbWEnIEFORCBzLm1ldGFfdmFsdWU8PicnIFdIRVJFIHBtLm1ldGFfa2V5PSdfcmVndWxhcl9wcmljZScgQU5EIHBtLm1ldGFfdmFsdWU8PicnIEdST1VQIEJZIDEgT1JERVIgQlkgbiBERVNDIExJTUlUIDEwIixBUlJBWV9BKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-170959';
const GKEY='ps_s1722b';
const PHASES=["1"];
const OUT='analize/s1722_b.json';
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
