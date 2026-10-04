process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzUwZyB1enNha3ltYXMgIzEyNjggdmlza2FzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc1MGcnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDEyMCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzUwZyddOwogICRtYXNrPWZ1bmN0aW9uKCRzKXsgJHM9KHN0cmluZykkczsgJHM9cHJlZ19yZXBsYWNlKCcvKFtBLVphLXowLTkuXyUrLV17M30pW0EtWmEtejAtOS5fJSstXSpALycsJyQx4oCmQCcsJHMpOyByZXR1cm4gcHJlZ19yZXBsYWNlKCcvKFwrP1xkW1xkIF17NSx9KShcZHszfSkvJywn4oCmJDInLCRzKTsgfTsKICB0cnl7CiAgJG89bnVsbDsgZm9yZWFjaCh3Y19nZXRfb3JkZXJzKFsnbGltaXQnPT41MCwndHlwZSc9PidzaG9wX29yZGVyJywnZGF0ZV9jcmVhdGVkJz0+c3RydG90aW1lKCcyMDI2LTEwLTAzIDIwOjAwIFVUQycpLicuLi4nLnN0cnRvdGltZSgnMjAyNi0xMC0wNCAwMjowMCBVVEMnKV0pIGFzICR4KXsgaWYoJHgtPmdldF9vcmRlcl9udW1iZXIoKT09PScxMjY4Jyl7ICRvPSR4OyBicmVhazsgfSB9CiAgaWYoISRvKXsgJHJbJ0VSUiddPSduZXJhc3Rhcyc7IHdwX3NlbmRfanNvbigkcik7IH0KICAkaWQ9JG8tPmdldF9pZCgpOyAkclsnaWQnXT0kaWQ7CiAgJHJbJ3BhZ3InXT1bJ3N0Jz0+JG8tPmdldF9zdGF0dXMoKSwnc3VrdXJ0YSc9PiRvLT5nZXRfZGF0ZV9jcmVhdGVkKCktPmRhdGUoJ20tZCBIOmk6cycpLCdhcG1va2V0YSc9PiRvLT5nZXRfZGF0ZV9wYWlkKCk/JG8tPmdldF9kYXRlX3BhaWQoKS0+ZGF0ZSgnbS1kIEg6aTpzJyk6bnVsbCwncG0nPT4kby0+Z2V0X3BheW1lbnRfbWV0aG9kKCkuJyAvICcuJG8tPmdldF9wYXltZW50X21ldGhvZF90aXRsZSgpLCd0eCc9PiRvLT5nZXRfdHJhbnNhY3Rpb25faWQoKSwndmlzbyc9PiRvLT5nZXRfdG90YWwoKSwnc2l1bnRhJz0+JG8tPmdldF9zaGlwcGluZ190b3RhbCgpLCdudW9sYWlkYSc9PiRvLT5nZXRfZGlzY291bnRfdG90YWwoKSwna3Vwb25haSc9PiRvLT5nZXRfY291cG9uX2NvZGVzKCksJ2tsaWVudGFzJz0+JG8tPmdldF9jdXN0b21lcl9pZCgpLCd2aWEnPT4kby0+Z2V0X2NyZWF0ZWRfdmlhKCksJ21pZXN0YXMnPT4kby0+Z2V0X3NoaXBwaW5nX2NpdHkoKT86JG8tPmdldF9iaWxsaW5nX2NpdHkoKSwncGFzdGFiYV9rbGllbnRvJz0+JG1hc2soJG8tPmdldF9jdXN0b21lcl9ub3RlKCkpXTsKICBmb3JlYWNoKCRvLT5nZXRfc2hpcHBpbmdfbWV0aG9kcygpIGFzICRzbSl7ICRtbT1bXTsgZm9yZWFjaCgkc20tPmdldF9tZXRhX2RhdGEoKSBhcyAkbWQpICRtbVskbWQtPmtleV09JG1hc2soaXNfc2NhbGFyKCRtZC0+dmFsdWUpP21iX3N1YnN0cigoc3RyaW5nKSRtZC0+dmFsdWUsMCw4MCk6d3BfanNvbl9lbmNvZGUoJG1kLT52YWx1ZSkpOyAkclsnc2l1bnRpbWFzJ11bXT1bJHNtLT5nZXRfbWV0aG9kX2lkKCksJHNtLT5nZXRfbmFtZSgpLCRzbS0+Z2V0X3RvdGFsKCksJG1tXTsgfQogIGZvcmVhY2goJG8tPmdldF9pdGVtcygpIGFzICRpdCl7ICRwPSRpdC0+Z2V0X3Byb2R1Y3QoKTsgJHBpZD0kaXQtPmdldF9wcm9kdWN0X2lkKCk7ICR2aWQ9JGl0LT5nZXRfdmFyaWF0aW9uX2lkKCk7ICRxPSR2aWQ/OiRwaWQ7ICRtbT1bXTsgZm9yZWFjaCgkaXQtPmdldF9tZXRhX2RhdGEoKSBhcyAkbWQpICRtbVskbWQtPmtleV09aXNfc2NhbGFyKCRtZC0+dmFsdWUpP21iX3N1YnN0cigoc3RyaW5nKSRtZC0+dmFsdWUsMCw2MCk6bWJfc3Vic3RyKHdwX2pzb25fZW5jb2RlKCRtZC0+dmFsdWUpLDAsMTIwKTsKICAgICRyWydlaWwnXVtdPVsncGF2Jz0+JGl0LT5nZXRfbmFtZSgpLCdwaWQnPT4kcSwna2lla2lzJz0+JGl0LT5nZXRfcXVhbnRpdHkoKSwnc3VtYSc9PiRpdC0+Z2V0X3RvdGFsKCksJ3NrdSc9PiRwPyRwLT5nZXRfc2t1KCk6JyhuZXJhIHByZWtlcyknLCdzdCc9PiRwPyRwLT5nZXRfc3RhdHVzKCk6JycsJ2xpa3V0aXMnPT4kcD9bJHAtPmdldF9tYW5hZ2Vfc3RvY2soKSwkcC0+Z2V0X3N0b2NrX3F1YW50aXR5KCksJHAtPmdldF9zdG9ja19zdGF0dXMoKV06bnVsbCwnc2FsdGluaXMnPT5nZXRfcG9zdF9tZXRhKCRxLCdfYWN0aXZlX2Z1bGZpbGxtZW50X3NvdXJjZScsdHJ1ZSksJ2RwX2Jhc2UnPT5nZXRfcG9zdF9tZXRhKCRxLCdfZHBfYmFzZV9wcm9kdWN0X2lkJyx0cnVlKSwnZHBfcXR5Jz0+Z2V0X3Bvc3RfbWV0YSgkcSwnX2RwX3BhY2tfcXR5Jyx0cnVlKSwnbWV0YSc9PiRtbSwKICAgICAgJ3BzX3NvdXJjZXMnPT4kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCAqIEZST00geyRQfXBzX3NvdXJjZXMgV0hFUkUgcHJvZHVjdF9pZD0lZCIsJHEpLEFSUkFZX0EpXTsgfQogICRtZXRhPVtdOyBmb3JlYWNoKCRvLT5nZXRfbWV0YV9kYXRhKCkgYXMgJG1kKXsgJGs9JG1kLT5rZXk7IGlmKHByZWdfbWF0Y2goJy9eXz8oYmlsbGluZ3xzaGlwcGluZylfLycsJGspKSBjb250aW51ZTsgJHY9aXNfc2NhbGFyKCRtZC0+dmFsdWUpPyhzdHJpbmcpJG1kLT52YWx1ZTp3cF9qc29uX2VuY29kZSgkbWQtPnZhbHVlLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyAkbWV0YVska109JG1hc2sobWJfc3Vic3RyKCR2LDAsMTYwKSk7IH0gJHJbJ21ldGEnXT0kbWV0YTsKICAkclsncGFzdGFib3MnXT1bXTsgZm9yZWFjaChhcnJheV9yZXZlcnNlKHdjX2dldF9vcmRlcl9ub3RlcyhbJ29yZGVyX2lkJz0+JGlkLCdsaW1pdCc9PjQwXSkpIGFzICRuKSAkclsncGFzdGFib3MnXVtdPSRuLT5kYXRlX2NyZWF0ZWQtPmRhdGUoJ20tZCBIOmk6cycpLigkbi0+Y3VzdG9tZXJfbm90ZT8nIFtLTElFTlRVSV0nOicnKS4nICcuJG1hc2sobWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCRuLT5jb250ZW50KSwwLDIyMCkpOwogICRyWydsYWlza2FpJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQsZmxvdyxzdGF0dXMsQ09BTEVTQ0Uoc2tpcF9yZWFzb24sJycpIHNyLERBVEVfRk9STUFUKENPQUxFU0NFKHNlbnRfYXQsZGVjaXNpb25fYXQsc2NoZWR1bGVkX2F0KStJTlRFUlZBTCAzIEhPVVIsJyUlbS0lJWQgJSVIOiUlaScpIHQgRlJPTSB7JFB9cHNfZW1haWxfam9icyBXSEVSRSBjb250ZXh0X2pzb24gTElLRSAlcyBPUiBqb2Jfa2V5IExJS0UgJXMgT1JERVIgQlkgaWQiLCclIm9yZGVyX2lkIjonLiRpZC4nJScsJyU6Jy4kaWQpLEFSUkFZX0EpOwogICRyWydmYWt0J109JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCAqIEZST00geyRQfXBzX2Zha3RfdXpzYWt5bWFpIFdIRVJFIHV6c2FreW1hc19pZD0lZCIsJGlkKSxBUlJBWV9BKTsKICBpZigkclsnZmFrdCddKSBmb3JlYWNoKCRyWydmYWt0J10gYXMgJGs9PiR2KXsgaWYocHJlZ19tYXRjaCgnL2VtYWlsfHRlbHxwaG9uZXxhZHJlc3x2YXJkfHBhdmFyZC9pJywkaykpICRyWydmYWt0J11bJGtdPSfigKYnOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSk7Cg==';
const VER='dep-185844';
const GKEY='ps_s1750g';
const PHASES=["1"];
const OUT='out/s1750_g.json';
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
