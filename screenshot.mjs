process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQxbiByZWxhdW5jaCBmaWx0cmFzOiBudW8gMjAyNS0wMS0wMSwgMSBwaXJraW1hcywgYmUgc3V0aWtpbW8sIGthdGVzL3N1bnlzIOKAlCBCRSBQSUkgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzQxbiddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTUwKTsgZ2xvYmFsICR3cGRiOyAkcj1bJ3YnPT4nUzE3NDFuJ107ICRLPSR3cGRiLT5wcmVmaXguJ3BzX3JlbGF1bmNoX2tvbnRha3RhaSc7ICRPPSR3cGRiLT5wcmVmaXguJ3djX29yZGVycyc7ICRJPSR3cGRiLT5wcmVmaXguJ3BzX2lzdF91enNha3ltYWknOwogIHRyeXsKICAgICR3cGRiLT5xdWVyeSgiRFJPUCBURU1QT1JBUlkgVEFCTEUgSUYgRVhJU1RTIHBzX3RtcF9uYXVqaSIpOyAkd3BkYi0+cXVlcnkoIkRST1AgVEVNUE9SQVJZIFRBQkxFIElGIEVYSVNUUyBwc190bXBfaXN0Iik7ICR3cGRiLT5xdWVyeSgiRFJPUCBURU1QT1JBUlkgVEFCTEUgSUYgRVhJU1RTIHBzX3RtcF9mIik7CiAgICAkd3BkYi0+cXVlcnkoIkNSRUFURSBURU1QT1JBUlkgVEFCTEUgcHNfdG1wX25hdWppIChlIFZBUkNIQVIoMTkxKSBQUklNQVJZIEtFWSkgU0VMRUNUIERJU1RJTkNUIExPV0VSKGJpbGxpbmdfZW1haWwpIGUgRlJPTSAkTyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBBTkQgc3RhdHVzIElOICgnd2MtcHJvY2Vzc2luZycsJ3djLWNvbXBsZXRlZCcsJ3djLW9uLWhvbGQnKSBBTkQgZGF0ZV9jcmVhdGVkX2dtdD49JzIwMjYtMDktMDgnIEFORCBiaWxsaW5nX2VtYWlsPD4nJyIpOwogICAgJHdwZGItPnF1ZXJ5KCJDUkVBVEUgVEVNUE9SQVJZIFRBQkxFIHBzX3RtcF9pc3QgKGUgVkFSQ0hBUigxOTEpIFBSSU1BUlkgS0VZLCBwaXJtIERBVEUsIHBhc2sgREFURSwgbiBJTlQsIG5fdmlzaSBJTlQsIHN1bWEgREVDSU1BTCgxMiwyKSkgU0VMRUNUIExPV0VSKGVtYWlsKSBlLCBEQVRFKE1JTihDQVNFIFdIRU4gaXZ5a2R5dGFzPTEgVEhFTiBkYXRhIEVORCkpIHBpcm0sIERBVEUoTUFYKENBU0UgV0hFTiBpdnlrZHl0YXM9MSBUSEVOIGRhdGEgRU5EKSkgcGFzaywgU1VNKGl2eWtkeXRhcz0xKSBuLCBDT1VOVCgqKSBuX3Zpc2ksIFNVTShDQVNFIFdIRU4gaXZ5a2R5dGFzPTEgVEhFTiBzdW1hIEVMU0UgMCBFTkQpIHN1bWEgRlJPTSAkSSBXSEVSRSBlbWFpbDw+JycgR1JPVVAgQlkgTE9XRVIoZW1haWwpIik7CiAgICAkcnVzPSJDQVNFIFdIRU4gay5ydXNpcyBJTignc3VvJywnZG9nJykgVEhFTiAnc3VvJyBXSEVOIGsucnVzaXM9J2thdGUnIFRIRU4gJ2thdGUnIFdIRU4gQ09OQ0FUX1dTKCcgJyxrLmxhc3Rfa2F0LGsudG9wX2thdCkgUkVHRVhQICfFoXVufHN1bicgQU5EIENPTkNBVF9XUygnICcsay5sYXN0X2thdCxrLnRvcF9rYXQpIFJFR0VYUCAna2F0JyBUSEVOICdhYnVfa2F0JyBXSEVOIENPTkNBVF9XUygnICcsay5sYXN0X2thdCxrLnRvcF9rYXQpIFJFR0VYUCAnxaF1bnxzdW4nIFRIRU4gJ3N1b19rYXQnIFdIRU4gQ09OQ0FUX1dTKCcgJyxrLmxhc3Rfa2F0LGsudG9wX2thdCkgUkVHRVhQICdrYcSNfGthdCcgVEhFTiAna2F0ZV9rYXQnIEVMU0UgJ2tpdGEnIEVORCI7CiAgICAkd3BkYi0+cXVlcnkoIkNSRUFURSBURU1QT1JBUlkgVEFCTEUgcHNfdG1wX2YgU0VMRUNUIGsuaWQsIGsuc2VnbWVudGFzLCBrLmhlcm9fcmVhc29uLCBrLnJ1c2lzLCBrLmxhc3Rfa2F0LCBrLnRvcF9rYXQsIGsuZW1haWwsIGkucGFzaywgaS5uLCBpLm5fdmlzaSwgaS5zdW1hLCAkcnVzIHJzIEZST00gJEsgayBKT0lOIHBzX3RtcF9pc3QgaSBPTiBpLmU9TE9XRVIoay5lbWFpbCkgTEVGVCBKT0lOIHBzX3RtcF9uYXVqaSBuIE9OIG4uZT1MT1dFUihrLmVtYWlsKSBXSEVSRSBuLmUgSVMgTlVMTCBBTkQgay5jb25zZW50PTAgQU5EIGkubj0xIEFORCBpLnBhc2s+PScyMDI1LTAxLTAxJyIpOwogICAgJHJbJ3Zpc29fYmVfcnVzaWVzX2ZpbHRybyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHBzX3RtcF9mIik7CiAgICAkclsncGFnYWxfcnVzaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHJzLCBDT1VOVCgqKSBuIEZST00gcHNfdG1wX2YgR1JPVVAgQlkgcnMgT1JERVIgQlkgbiBERVNDIixBUlJBWV9BKTsKICAgICRyWydraXRhX2thdGVnb3Jpam9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgTEVGVChDT0FMRVNDRShOVUxMSUYodG9wX2thdCwnJyksTlVMTElGKGxhc3Rfa2F0LCcnKSwnKG5lcmEpJyksNjApIGthdCwgQ09VTlQoKikgbiBGUk9NIHBzX3RtcF9mIFdIRVJFIHJzPSdraXRhJyBHUk9VUCBCWSAxIE9SREVSIEJZIG4gREVTQyBMSU1JVCAxNSIsQVJSQVlfQSk7CiAgICAkclsnc2tfcHZ6J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgTEVGVChDT0FMRVNDRShOVUxMSUYodG9wX2thdCwnJyksTlVMTElGKGxhc3Rfa2F0LCcnKSwnKG5lcmEpJyksNjApIGthdCwgcnMsIENPVU5UKCopIG4gRlJPTSBwc190bXBfZiBXSEVSRSBycyBJTignc3VvX2thdCcsJ2thdGVfa2F0JywnYWJ1X2thdCcpIEdST1VQIEJZIDEsMiBPUkRFUiBCWSBuIERFU0MgTElNSVQgMTIiLEFSUkFZX0EpOwogICAgJGtzPSJycyBJTignc3VvJywna2F0ZScsJ3N1b19rYXQnLCdrYXRlX2thdCcsJ2FidV9rYXQnKSI7CiAgICAkclsna2F0ZXNfc3VueXNfdmlzbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHBzX3RtcF9mIFdIRVJFICRrcyIpOwogICAgJHJbJ3BhZ2FsX21lbmVzaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEVfRk9STUFUKHBhc2ssJyVZLSVtJykgbSwgQ09VTlQoKikgbiwgU1VNKHJzIElOKCdzdW8nLCdzdW9fa2F0JykpIHN1bywgU1VNKHJzIElOKCdrYXRlJywna2F0ZV9rYXQnKSkga2F0ZSBGUk9NIHBzX3RtcF9mIFdIRVJFICRrcyBHUk9VUCBCWSAxIE9SREVSIEJZIDEiLEFSUkFZX0EpOwogICAgJHJbJ3BhZ2FsX3NlZ21lbnRhJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc2VnbWVudGFzLCBDT1VOVCgqKSBuIEZST00gcHNfdG1wX2YgV0hFUkUgJGtzIEdST1VQIEJZIDEiLEFSUkFZX0EpOwogICAgJHJbJ2hlcm9fcmVhc29uJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaGVyb19yZWFzb24sIENPVU5UKCopIG4gRlJPTSBwc190bXBfZiBXSEVSRSAka3MgR1JPVVAgQlkgMSBPUkRFUiBCWSBuIERFU0MiLEFSUkFZX0EpOwogICAgJHJbJ2F0c2F1a3RpX2lyZ2lfdHVyZWpvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gcHNfdG1wX2YgV0hFUkUgJGtzIEFORCBuX3Zpc2k+biIpOwogICAgJHJbJ3ZpZF9zdW1hJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBST1VORChBVkcoc3VtYSksMikgRlJPTSBwc190bXBfZiBXSEVSRSAka3MiKTsKICAgICRyWydkb21lbmFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgU1VCU1RSSU5HX0lOREVYKExPV0VSKGVtYWlsKSwnQCcsLTEpIGQsIENPVU5UKCopIG4gRlJPTSBwc190bXBfZiBXSEVSRSAka3MgR1JPVVAgQlkgMSBIQVZJTkcgbj49MTAgT1JERVIgQlkgbiBERVNDIExJTUlUIDgiLEFSUkFZX0EpOwogICAgJHJbJ3BhbHlnaW5pbXVpJ109WydzdXRpa2VfdGFtZV9wYXRfbGFuZ2UnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkSyBrIEpPSU4gcHNfdG1wX2lzdCBpIE9OIGkuZT1MT1dFUihrLmVtYWlsKSBMRUZUIEpPSU4gcHNfdG1wX25hdWppIG4gT04gbi5lPUxPV0VSKGsuZW1haWwpIFdIRVJFIG4uZSBJUyBOVUxMIEFORCBrLmNvbnNlbnQ9MSBBTkQgaS5uPTEgQU5EIGkucGFzaz49JzIwMjUtMDEtMDEnIiksJzJwbGl1c19waXJraW11X251b18yMDI1Jz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJEsgayBKT0lOIHBzX3RtcF9pc3QgaSBPTiBpLmU9TE9XRVIoay5lbWFpbCkgTEVGVCBKT0lOIHBzX3RtcF9uYXVqaSBuIE9OIG4uZT1MT1dFUihrLmVtYWlsKSBXSEVSRSBuLmUgSVMgTlVMTCBBTkQgay5jb25zZW50PTAgQU5EIGkubj49MiBBTkQgaS5wYXNrPj0nMjAyNS0wMS0wMSciKSwnYmVfaXN0X2lyYXN1Jz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJEsgayBMRUZUIEpPSU4gcHNfdG1wX2lzdCBpIE9OIGkuZT1MT1dFUihrLmVtYWlsKSBXSEVSRSBpLmUgSVMgTlVMTCIpXTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-075135';
const GKEY='ps_s1741n';
const PHASES=["1"];
const OUT='analize/s1741_n.json';
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
