process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTMgYSDigJQgQWRzIGxhbmdhczoga8SFIGdlbmVydW9qYSBQTWF4IMWhdW55cyAvIGthdMSXcyAvIGJyYW5kIOKAlCBwcmllxaEgKHNlbm9qaSBzdmV0YWluxJcpIGlyIHBvIG1pZ3JhY2lqb3MgKHBzX2Zha3RfcmVrbGFtYSkgKyBXQyBBZHMgdcW+c2FreW3FsyBla29ub21pa2EgKHBzX2Zha3RfdXpzYWt5bWFpKS4gUmVhZC1vbmx5LiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY5M2EnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTY5MyBhJywnbGFpa2FzJz0+Y3VycmVudF90aW1lKCdteXNxbCcpKTsgJHdwZGItPnN1cHByZXNzX2Vycm9ycyh0cnVlKTsKICAkb1sncmVrbGFtYV9wZXJpb2RhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHNlbm9qaV9zdmV0YWluZSBzZW5hLCBNSU4oZGllbmEpIG51bywgTUFYKGRpZW5hKSBpa2ksIENPVU5UKERJU1RJTkNUIGRpZW5hKSBkIEZST00geyRwfXBzX2Zha3RfcmVrbGFtYSBXSEVSRSBrYW5hbGFzPSdnb29nbGVfYWRzJyBHUk9VUCBCWSAxIixBUlJBWV9BKTsKICAkb1sna2FtcF9wZXJpb2RhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIExFRlQoa2FtcGFuaWphLDMwKSBrLCBzZW5vamlfc3ZldGFpbmUgc2VuYSwgTUlOKGRpZW5hKSBudW8sIE1BWChkaWVuYSkgaWtpLCBDT1VOVChESVNUSU5DVCBkaWVuYSkgZCwgU1VNKHBhcm9keW1haSkgcGFyLCBTVU0ocGFzcGF1ZGltYWkpIHBhc3AsIFJPVU5EKFNVTShpc2xhaWRvc19jdCkvMTAwLDIpIGV1ciwgUk9VTkQoU1VNKGtvbnZlcnNpam9zKSwxKSBrb252LCBST1VORChTVU0oa29udl92ZXJ0ZV9jdCkvMTAwKSBrdiBGUk9NIHskcH1wc19mYWt0X3Jla2xhbWEgV0hFUkUga2FuYWxhcz0nZ29vZ2xlX2FkcycgR1JPVVAgQlkgMSwyIE9SREVSIEJZIDEsMiIsQVJSQVlfQSk7CiAgJG9bJ2thbXBfZGllbm9zX3BvJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZGllbmEsIExFRlQoa2FtcGFuaWphLDI2KSBrLCBwYXJvZHltYWkgcGFyLCBwYXNwYXVkaW1haSBwYXNwLCBST1VORChpc2xhaWRvc19jdC8xMDAsMikgZXVyLCBST1VORChrb252ZXJzaWpvcywxKSBrb252LCBST1VORChrb252X3ZlcnRlX2N0LzEwMCkga3YgRlJPTSB7JHB9cHNfZmFrdF9yZWtsYW1hIFdIRVJFIGthbmFsYXM9J2dvb2dsZV9hZHMnIEFORCBkaWVuYT49JzIwMjYtMDktMTMnIE9SREVSIEJZIGthbXBhbmlqYSwgZGllbmEiLEFSUkFZX0EpOwogICRzPSJDT1VOVCgqKSBuLCBST1VORChTVU0odmlzb19jdCkvMTAwKSB2aXNvLCBST1VORChBVkcodmlzb19jdCkvMTAwLDIpIGFvdiwgUk9VTkQoU1VNKG1hcnphX2N0KS8xMDApIG1hcnphLCBST1VORChTVU0oa29udHJpYnVjaWphX2N0KS8xMDApIGtvbnRyaWIsIFJPVU5EKEFWRyhrb250cmlidWNpamFfY3QpLzEwMCwyKSBrb250cmliX3ZpZCwgU1VNKGtsaWVudGFzX25hdWphcykgbmF1amkiOwogICR0PSJ7JHB9cHNfZmFrdF91enNha3ltYWkgV0hFUkUgdGVzdGluaXM9MCBBTkQgc3RhdHVzYXNfZ2FsdXRpbmlzIE5PVCBJTignY2FuY2VsbGVkJywnZmFpbGVkJywncmVmdW5kZWQnLCdwZW5kaW5nJykiOwogICRvWyd3Y192aXNvX3BvJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCAkcyBGUk9NICR0IEFORCBzdWt1cnRhX2F0Pj0nMjAyNi0wOS0wOSciLEFSUkFZX0EpOwogICRvWyd3Y19hZHNfcG8nXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUICRzIEZST00gJHQgQU5EIHN1a3VydGFfYXQ+PScyMDI2LTA5LTA5JyBBTkQgKGdjbGlkPD4nJyBPUiBrYW5hbGFzX3Bhc2t1dGluaXM9J21va2FtYXMnKSIsQVJSQVlfQSk7CiAgJG9bJ3djX2Fkc19kaWVub3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBEQVRFKHN1a3VydGFfYXQpIGQsIENPVU5UKCopIG4sIFJPVU5EKFNVTSh2aXNvX2N0KS8xMDApIHZpc28sIFJPVU5EKFNVTShrb250cmlidWNpamFfY3QpLzEwMCkga29udHJpYiwgU1VNKGtsaWVudGFzX25hdWphcykgbmF1amkgRlJPTSAkdCBBTkQgc3VrdXJ0YV9hdD49JzIwMjYtMDktMDknIEFORCAoZ2NsaWQ8PicnIE9SIGthbmFsYXNfcGFza3V0aW5pcz0nbW9rYW1hcycpIEdST1VQIEJZIDEgT1JERVIgQlkgMSIsQVJSQVlfQSk7CiAgJG9bJ3djX2RpZW5vcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEUoc3VrdXJ0YV9hdCkgZCwgQ09VTlQoKikgbiwgUk9VTkQoU1VNKHZpc29fY3QpLzEwMCkgdmlzbyBGUk9NICR0IEFORCBzdWt1cnRhX2F0Pj0nMjAyNi0wOS0xMycgR1JPVVAgQlkgMSBPUkRFUiBCWSAxIixBUlJBWV9BKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-152906';
const GKEY='ps_s1693a';
const PHASES=["1"];
const OUT='analize/s1693_b.json';
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
