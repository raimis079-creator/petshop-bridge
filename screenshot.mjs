process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzUwZiBqYXVfcGlya29fcG86IGthcywga2FkYSBwaXJrbyB2ZWwsIGlzIGt1ciBhdGVqbywga29raXVzIGxhaXNrdXMgZ2F2byBwcmllcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NTBmJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxMjApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRUPSRQLidwc19lbWFpbF9qb2JzJzsgJHI9Wyd2Jz0+J1MxNzUwZiddOwogICRtYXNrPWZ1bmN0aW9uKCRzKXsgcmV0dXJuIHByZWdfcmVwbGFjZSgnLyhbQS1aYS16MC05Ll8lKy1dezN9KVtBLVphLXowLTkuXyUrLV0qQC8nLCckMeKApkAnLChzdHJpbmcpJHMpOyB9OwogIHRyeXsKICAkam9icz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxqb2Jfa2V5LHJlY2lwaWVudF9lbWFpbCxjb250ZXh0X2pzb24sREFURV9GT1JNQVQoZGVjaXNpb25fYXQrSU5URVJWQUwgMyBIT1VSLCclbS0lZCAlSDolaScpIHQgRlJPTSAkVCBXSEVSRSBza2lwX3JlYXNvbj0namF1X3BpcmtvX3BvJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDUiLEFSUkFZX0EpOwogIGZvcmVhY2goJGpvYnMgYXMgJGopeyAkZW09JGpbJ3JlY2lwaWVudF9lbWFpbCddOyAkYz1qc29uX2RlY29kZSgoc3RyaW5nKSRqWydjb250ZXh0X2pzb24nXSx0cnVlKTsgJG9pZD0oaW50KSgkY1snb3JkZXJfaWQnXT8/MCk7ICR4PVsnam9iJz0+JGpbJ2lkJ10sJ2UnPT4kbWFzaygkZW0pLCdzcHJlbmRpbWFzJz0+JGpbJ3QnXV07CiAgICAkbz0kb2lkP3djX2dldF9vcmRlcigkb2lkKTpudWxsOyBpZigkbyl7ICR4WydwaXJtYXMnXT1bJG8tPmdldF9vcmRlcl9udW1iZXIoKSwkby0+Z2V0X2RhdGVfY3JlYXRlZCgpLT5kYXRlKCdtLWQgSDppJykscm91bmQoKGZsb2F0KSRvLT5nZXRfdG90YWwoKSwyKV07CiAgICAgICR4Wyd2ZWxpYXUnXT1bXTsgZm9yZWFjaCh3Y19nZXRfb3JkZXJzKFsnbGltaXQnPT4xMCwndHlwZSc9PidzaG9wX29yZGVyJywnYmlsbGluZ19lbWFpbCc9PiRlbSwnZGF0ZV9jcmVhdGVkJz0+Jz4nLiRvLT5nZXRfZGF0ZV9jcmVhdGVkKCktPmdldFRpbWVzdGFtcCgpLCdvcmRlcmJ5Jz0+J2RhdGUnLCdvcmRlcic9PidBU0MnXSkgYXMgJHBvKXsKICAgICAgICAkZj0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHV0bV9zb3VyY2Ugcyx1dG1fbWVkaXVtIG0sdXRtX2NhbXBhaWduIGMsa2FuYWxhc19wYXNrdXRpbmlzIGsgRlJPTSB7JFB9cHNfZmFrdF91enNha3ltYWkgV0hFUkUgdXpzYWt5bWFzX2lkPSVkIiwkcG8tPmdldF9pZCgpKSxBUlJBWV9BKTsKICAgICAgICAkaXQ9W107IGZvcmVhY2goJHBvLT5nZXRfaXRlbXMoKSBhcyAkaSkgJGl0W109bWJfc3Vic3RyKCRpLT5nZXRfbmFtZSgpLDAsNDApLicgw5cnLiRpLT5nZXRfcXVhbnRpdHkoKTsKICAgICAgICAkeFsndmVsaWF1J11bXT1bJHBvLT5nZXRfb3JkZXJfbnVtYmVyKCksJHBvLT5nZXRfc3RhdHVzKCksJHBvLT5nZXRfZGF0ZV9jcmVhdGVkKCktPmRhdGUoJ20tZCBIOmknKSxyb3VuZCgoZmxvYXQpJHBvLT5nZXRfdG90YWwoKSwyKSwkcG8tPmdldF9tZXRhKCdfcHNfcGFrYXJ0b3RpX2lzJyk/OicnLCRmLCRpdF07IH0KICAgICAgJHhbJ3Bpcm1vX3ByZWtlcyddPVtdOyBmb3JlYWNoKCRvLT5nZXRfaXRlbXMoKSBhcyAkaSkgJHhbJ3Bpcm1vX3ByZWtlcyddW109bWJfc3Vic3RyKCRpLT5nZXRfbmFtZSgpLDAsNDApLicgw5cnLiRpLT5nZXRfcXVhbnRpdHkoKTsgfQogICAgJHhbJ2xhaXNrYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCxmbG93LHN0YXR1cyxDT0FMRVNDRShza2lwX3JlYXNvbiwnJykgc3IsREFURV9GT1JNQVQoQ09BTEVTQ0Uoc2VudF9hdCxkZWNpc2lvbl9hdCxzY2hlZHVsZWRfYXQpK0lOVEVSVkFMIDMgSE9VUiwnJSVtLSUlZCAlJUg6JSVpJykgdCxMRUZUKENPQUxFU0NFKHN1YmplY3QsJycpLDQ1KSBzdWJqIEZST00gJFQgV0hFUkUgcmVjaXBpZW50X2VtYWlsPSVzIE9SREVSIEJZIENPQUxFU0NFKHNlbnRfYXQsZGVjaXNpb25fYXQsc2NoZWR1bGVkX2F0KSIsJGVtKSxBUlJBWV9BKTsKICAgICRyWydqb2JzJ11bXT0keDsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0pOwo=';
const VER='dep-185522';
const GKEY='ps_s1750f';
const PHASES=["1"];
const OUT='out/s1750_f.json';
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
