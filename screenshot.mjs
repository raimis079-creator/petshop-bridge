process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NjggYW8g4oCUIFNuaXBwZXQgMjUxNSAoUGV0c2hvcCBTb3VyY2VzKTogcmVnaXN0cmFzIHNpbmNocm9uaXp1b2phbWFzIGlyIHBha2l0dXMgYF9vd25fc3RvY2tfcXR5YCAoQVYgbGlrdXRpcyB0aWVrxJdqbyBwcmVrxJdtcykuIEQgLyBULiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY2OGFvJ10pKSByZXR1cm47CiAgJGY9JF9HRVRbJ3BzX3MxNjY4YW8nXTsgZ2xvYmFsICR3cGRiOyAkdD0kd3BkYi0+cHJlZml4LidzbmlwcGV0cyc7ICRvPWFycmF5KCd2Jz0+J1MxNjY4IGFvJywnZmF6ZSc9PiRmKTsKICAkb2xkPSJpZiAoIFwka2V5ID09PSAnX3BzX3NhbmRlbGlzJyApIHBzX3NvdXJjZXNfc3luY19zYXVnaWFpKCBcJHBpZCApIjsKICAkbmV3PSJpZiAoIFwka2V5ID09PSAnX3BzX3NhbmRlbGlzJyB8fCBcJGtleSA9PT0gJ19vd25fc3RvY2tfcXR5JyApIHBzX3NvdXJjZXNfc3luY19zYXVnaWFpKCBcJHBpZCApIjsKICB0cnl7CiAgaWYoJGY9PT0nRCcpewogICAgJGM9KHN0cmluZykkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIGNvZGUgRlJPTSAkdCBXSEVSRSBpZD0yNTE1Iik7ICRvWydtZDVfcHJpZXMnXT1tZDUoJGMpOwogICAgaWYoc3Vic3RyX2NvdW50KCRjLCRuZXcpPT09Mil7ICRvWydyZXonXT0nSkFVJzsgd3Bfc2VuZF9qc29uKCRvKTsgfQogICAgaWYoc3Vic3RyX2NvdW50KCRjLCRvbGQpIT09Mil7ICRvWydyZXonXT0nU1RPUDogcmFkYXUgJy5zdWJzdHJfY291bnQoJGMsJG9sZCkuJyB2aWV0YXMgKHR1cmkgYsWrdGkgMiknOyB3cF9zZW5kX2pzb24oJG8pOyB9CiAgICAkbj1zdHJfcmVwbGFjZSgkb2xkLCRuZXcsJGMpOwogICAgdHJ5eyB0b2tlbl9nZXRfYWxsKCc8P3BocCAnLiRuLCBUT0tFTl9QQVJTRSk7IH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1sncmV6J109J1NUT1A6IFRPS0VOX1BBUlNFICcuJGUtPmdldE1lc3NhZ2UoKTsgd3Bfc2VuZF9qc29uKCRvKTsgfQogICAgaWYoIWdldF9vcHRpb24oJ3BzX3MxNjY4X3NuaXAyNTE1X2JhaycpKSB1cGRhdGVfb3B0aW9uKCdwc19zMTY2OF9zbmlwMjUxNV9iYWsnLCRjLGZhbHNlKTsKICAgICR3cGRiLT51cGRhdGUoJHQsYXJyYXkoJ2NvZGUnPT4kbiwnbW9kaWZpZWQnPT5jdXJyZW50X3RpbWUoJ215c3FsJyx0cnVlKSksYXJyYXkoJ2lkJz0+MjUxNSkpOwogICAgaWYoZnVuY3Rpb25fZXhpc3RzKCdcXENvZGVfU25pcHBldHNcXGNsZWFuX3NuaXBwZXRzX2NhY2hlJykpIFxDb2RlX1NuaXBwZXRzXGNsZWFuX3NuaXBwZXRzX2NhY2hlKCR0KTsKICAgICRvWydtZDVfcG8nXT1tZDUoKHN0cmluZykkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIGNvZGUgRlJPTSAkdCBXSEVSRSBpZD0yNTE1IikpOwogICAgJHI9d3BfcmVtb3RlX2dldChob21lX3VybCgnLz9wc19oYj1zMTY2OGFvJyksYXJyYXkoJ3RpbWVvdXQnPT4yMCkpOyAkY2M9aXNfd3BfZXJyb3IoJHIpPzA6KGludCl3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcik7ICRvWydwaW5nJ109JGNjOwogICAgaWYoJGNjPT09MHx8JGNjPj01MDApeyAkd3BkYi0+dXBkYXRlKCR0LGFycmF5KCdjb2RlJz0+JGMpLGFycmF5KCdpZCc9PjI1MTUpKTsgJG9bJ3JleiddPSdST0xMQkFDSyc7IH0gZWxzZSAkb1sncmV6J109J09LJzsKICB9IGVsc2VpZigkZj09PSdUJyl7CiAgICAkUz0kd3BkYi0+cHJlZml4Lidwc19zb3VyY2VzJzsgJHBpZD0xNjYzOTsgJG93bj0oaW50KWdldF9wb3N0X21ldGEoJHBpZCwnX293bl9zdG9ja19xdHknLHRydWUpOyAkb1snb3duJ109JG93bjsKICAgICR3cGRiLT51cGRhdGUoJFMsYXJyYXkoJ3N0b2NrX3F0eSc9PjApLGFycmF5KCdwcm9kdWN0X2lkJz0+JHBpZCwnc291cmNlJz0+J2F2JykpOyAvLyBkaXJidGluYWkgcGFzZW7EmXMgcmVnaXN0cmFzCiAgICAkb1sncmVnaXN0cmFzX3ByaWVzJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBzdG9ja19xdHkgRlJPTSAkUyBXSEVSRSBwcm9kdWN0X2lkPSRwaWQgQU5EIHNvdXJjZT0nYXYnIik7CiAgICB1cGRhdGVfcG9zdF9tZXRhKCRwaWQsJ19vd25fc3RvY2tfcXR5Jywkb3duKzEpOyB1cGRhdGVfcG9zdF9tZXRhKCRwaWQsJ19vd25fc3RvY2tfcXR5Jywkb3duKTsgd3BfY2FjaGVfZGVsZXRlKCRwaWQsJ3Bvc3RfbWV0YScpOwogICAgJG9bJ3JlZ2lzdHJhc19wbyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1Qgc3RvY2tfcXR5IEZST00gJFMgV0hFUkUgcHJvZHVjdF9pZD0kcGlkIEFORCBzb3VyY2U9J2F2JyIpOwogICAgJG9bJ293bl9wbyddPWdldF9wb3N0X21ldGEoJHBpZCwnX293bl9zdG9ja19xdHknLHRydWUpOwogICAgJG9bJ2VpbHV0ZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzb3VyY2Usc3RvY2tfcXR5LGNvc3RfbmV0LGlzX2FjdGl2ZSBGUk9NICRTIFdIRVJFIHByb2R1Y3RfaWQ9JHBpZCIsQVJSQVlfQSk7CiAgICAkb1sncmV6J109KChpbnQpJG9bJ3JlZ2lzdHJhc19wbyddPT09JG93biAmJiAoaW50KSRvWydvd25fcG8nXT09PSRvd24pPydPSyc6J0ZBSUwnOwogIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJG8pOwp9KTsK';
const VER='dep-095551';
const GKEY='ps_s1668ao';
const PHASES=["D", "T"];
const OUT='analize/s1668_ao.json';
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
