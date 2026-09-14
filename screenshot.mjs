process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODEgcCDigJQgcmVhZC1vbmx5OiBrcml0aW1vIHBqxat2aXMg4oCUIGthbmFsYWkvbmF1amktZ3LEr8W+dGFudHlzIHBlciBtxJduZXPEryAoaXN0b3JpamErbmF1amEpIGlyIEdBNCBzZXNpam9zIHBlciBtxJduZXPEryAyMDI1LTA24oCmMjAyNi0wOS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODFwJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE2ODEgcCcpOwogICRzcWw9IlNFTEVDVCBEQVRFX0ZPUk1BVChhcG1va2V0YV9hdCwnJSVZLSUlbScpIG0sQ09BTEVTQ0UoTlVMTElGKGthbmFsYXNfcGFza3V0aW5pcywnJyksJz8nKSBrLENPVU5UKCopIG4gRlJPTSAlcyBXSEVSRSBhcG1va2V0YV9hdD49JzIwMjUtMDYtMDEnIEdST1VQIEJZIG0sayI7CiAgJG9bJ2lzdCddPSR3cGRiLT5nZXRfcmVzdWx0cyhzcHJpbnRmKCRzcWwsJHAuJ3BzX2lzdF9mYWt0X3V6c2FreW1haScpLEFSUkFZX0EpOwogICRvWyduYXVqYSddPSR3cGRiLT5nZXRfcmVzdWx0cyhzcHJpbnRmKCRzcWwsJHAuJ3BzX2Zha3RfdXpzYWt5bWFpJykuIiBBTkQgc2FsdGluaXNfYXBsaW5rYT0ncHJvZCcgQU5EIHRlc3RpbmlzPTAiLEFSUkFZX0EpOwogICRvWyduYXVqaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEVfRk9STUFUKGFwbW9rZXRhX2F0LCclWS0lbScpIG0sU1VNKGtsaWVudGFzX25hdWphcz0xKSBuYXVqaSxDT1VOVCgqKSBuLFJPVU5EKEFWRyh2aXNvX2N0KS8xMDAsMSkgYW92LFNVTShpc19yZWZpbGw9MSkgcmVmaWxsIEZST00geyRwfXBzX2lzdF9mYWt0X3V6c2FreW1haSBXSEVSRSBhcG1va2V0YV9hdD49JzIwMjUtMDYtMDEnIEdST1VQIEJZIG0iLEFSUkFZX0EpOwogICRyPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0dBNF9TZXJ2ZXJpcycsJ3Rva2VuJyk7ICRyLT5zZXRBY2Nlc3NpYmxlKHRydWUpOyAkdG9rPSRyLT5pbnZva2UobnVsbCk7CiAgJHg9d3BfcmVtb3RlX3Bvc3QoJ2h0dHBzOi8vYW5hbHl0aWNzZGF0YS5nb29nbGVhcGlzLmNvbS92MWJldGEvcHJvcGVydGllcy8zNDYwNTE1ODA6cnVuUmVwb3J0JyxhcnJheSgndGltZW91dCc9PjQwLCdoZWFkZXJzJz0+YXJyYXkoJ0F1dGhvcml6YXRpb24nPT4nQmVhcmVyICcuJHRvaywnQ29udGVudC1UeXBlJz0+J2FwcGxpY2F0aW9uL2pzb24nKSwnYm9keSc9Pmpzb25fZW5jb2RlKGFycmF5KCdkYXRlUmFuZ2VzJz0+YXJyYXkoYXJyYXkoJ3N0YXJ0RGF0ZSc9PicyMDI1LTA2LTAxJywnZW5kRGF0ZSc9PicyMDI2LTA5LTEzJykpLCdkaW1lbnNpb25zJz0+YXJyYXkoYXJyYXkoJ25hbWUnPT4neWVhck1vbnRoJyksYXJyYXkoJ25hbWUnPT4nc2Vzc2lvbkRlZmF1bHRDaGFubmVsR3JvdXAnKSksJ21ldHJpY3MnPT5hcnJheShhcnJheSgnbmFtZSc9PidzZXNzaW9ucycpLGFycmF5KCduYW1lJz0+J2Vjb21tZXJjZVB1cmNoYXNlcycpKSwnbGltaXQnPT41MDApKSkpOwogICRqPWpzb25fZGVjb2RlKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCR4KSx0cnVlKTsgZm9yZWFjaCgkalsncm93cyddPz9hcnJheSgpIGFzICRyb3cpICRvWydnYTQnXVtdPWFycmF5KCRyb3dbJ2RpbWVuc2lvblZhbHVlcyddWzBdWyd2YWx1ZSddLCRyb3dbJ2RpbWVuc2lvblZhbHVlcyddWzFdWyd2YWx1ZSddLChpbnQpJHJvd1snbWV0cmljVmFsdWVzJ11bMF1bJ3ZhbHVlJ10sKGludCkkcm93WydtZXRyaWNWYWx1ZXMnXVsxXVsndmFsdWUnXSk7CiAgJG9bJ2UnXT0kd3BkYi0+bGFzdF9lcnJvcjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-111122';
const GKEY='ps_s1681p';
const PHASES=["A"];
const OUT='analize/s1681_p.json';
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
