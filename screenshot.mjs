process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzggazMg4oCUIFJFQUQtT05MWTogdmllbmthcnRpbmlhaSB2cyBncsSvxb50YW50eXMgcGFnYWwgcGlybcSFIGthbmFsxIUsIGvEhSBwaXJrbyB2aWVua2FydGluaWFpLCBwaXJtbyB1xb5zYWt5bW8gQU9WLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zZWM4azMnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTY3OCBrMycpOyAkd3BkYi0+c3VwcHJlc3NfZXJyb3JzKHRydWUpOwogICRVPSJ7JHB9cHNfaXN0X2Zha3RfdXpzYWt5bWFpIjsgJEU9InskcH1wc19pc3RfZmFrdF9laWx1dGVzIjsKICAkb1sna2FuYWxhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIENPQUxFU0NFKE5VTExJRihrYW5hbGFzX3Bpcm1hcywnJyksJyhuxJdyYSknKSBrLCBDT1VOVCgqKSBuIEZST00gJFUgV0hFUkUgYXBtb2tldGFfYXQ+REFURV9TVUIoTk9XKCksSU5URVJWQUwgMjQgTU9OVEgpIEdST1VQIEJZIGsgT1JERVIgQlkgbiBERVNDIExJTUlUIDEwIixBUlJBWV9BKTsKICAvLyBrbGllbnRhaSwga3VyacWzIHBpcm1hcyB1xb5zYWt5bWFzIDEy4oCTMjQgbcSXbi4gYXRnYWwgKHR1csSXam8gMTIgbcSXbi4gZ3LEr8W+dGkpOiBhciBncsSvxb5vLCBwYWdhbCBwaXJtbyB1xb5zYWt5bW8ga2FuYWzEhQogICRvWydncml6b19wYWdhbF9rYW5hbGEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBDT0FMRVNDRShOVUxMSUYoZi5rYW5hbGFzX3Bpcm1hcywnJyksJyhuxJdyYSknKSBrLCBDT1VOVCgqKSBrbGllbnRhaSwgU1VNKHQubj4xKSBncml6bywgUk9VTkQoU1VNKHQubj4xKS9DT1VOVCgqKSoxMDApIHBjdCwgUk9VTkQoQVZHKGYudmlzb19jdCkvMTAwLDEpIHBpcm1vX2FvdiBGUk9NIChTRUxFQ1Qga2xpZW50YXNfaWQsIE1JTihhcG1va2V0YV9hdCkgcGlybWEsIENPVU5UKCopIG4gRlJPTSAkVSBHUk9VUCBCWSBrbGllbnRhc19pZCBIQVZJTkcgcGlybWEgQkVUV0VFTiBEQVRFX1NVQihOT1coKSxJTlRFUlZBTCAyNCBNT05USCkgQU5EIERBVEVfU1VCKE5PVygpLElOVEVSVkFMIDEyIE1PTlRIKSkgdCBKT0lOICRVIGYgT04gZi5rbGllbnRhc19pZD10LmtsaWVudGFzX2lkIEFORCBmLmFwbW9rZXRhX2F0PXQucGlybWEgR1JPVVAgQlkgayBPUkRFUiBCWSBrbGllbnRhaSBERVNDIExJTUlUIDEwIixBUlJBWV9BKTsKICAkb1snZ3Jpem9fcGFnYWxfZ2NsaWQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAoZi5nY2xpZDw+JycgQU5EIGYuZ2NsaWQgSVMgTk9UIE5VTEwpIGFkcywgQ09VTlQoKikga2xpZW50YWksIFNVTSh0Lm4+MSkgZ3Jpem8sIFJPVU5EKFNVTSh0Lm4+MSkvQ09VTlQoKikqMTAwKSBwY3QsIFJPVU5EKEFWRyhmLnZpc29fY3QpLzEwMCwxKSBwaXJtb19hb3YgRlJPTSAoU0VMRUNUIGtsaWVudGFzX2lkLCBNSU4oYXBtb2tldGFfYXQpIHBpcm1hLCBDT1VOVCgqKSBuIEZST00gJFUgR1JPVVAgQlkga2xpZW50YXNfaWQgSEFWSU5HIHBpcm1hIEJFVFdFRU4gREFURV9TVUIoTk9XKCksSU5URVJWQUwgMjQgTU9OVEgpIEFORCBEQVRFX1NVQihOT1coKSxJTlRFUlZBTCAxMiBNT05USCkpIHQgSk9JTiAkVSBmIE9OIGYua2xpZW50YXNfaWQ9dC5rbGllbnRhc19pZCBBTkQgZi5hcG1va2V0YV9hdD10LnBpcm1hIEdST1VQIEJZIGFkcyIsQVJSQVlfQSk7CiAgJG9bJ2dyaXpvX3BhZ2FsX2JyZW5kYSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGUuYnJlbmRhc19zbHVnIGIsIENPVU5UKERJU1RJTkNUIHQua2xpZW50YXNfaWQpIGtsaWVudGFpLCBDT1VOVChESVNUSU5DVCBDQVNFIFdIRU4gdC5uPjEgVEhFTiB0LmtsaWVudGFzX2lkIEVORCkgZ3Jpem8sIFJPVU5EKENPVU5UKERJU1RJTkNUIENBU0UgV0hFTiB0Lm4+MSBUSEVOIHQua2xpZW50YXNfaWQgRU5EKS9DT1VOVChESVNUSU5DVCB0LmtsaWVudGFzX2lkKSoxMDApIHBjdCBGUk9NIChTRUxFQ1Qga2xpZW50YXNfaWQsIE1JTihhcG1va2V0YV9hdCkgcGlybWEsIENPVU5UKCopIG4gRlJPTSAkVSBHUk9VUCBCWSBrbGllbnRhc19pZCBIQVZJTkcgcGlybWEgQkVUV0VFTiBEQVRFX1NVQihOT1coKSxJTlRFUlZBTCAyNCBNT05USCkgQU5EIERBVEVfU1VCKE5PVygpLElOVEVSVkFMIDEyIE1PTlRIKSkgdCBKT0lOICRVIGYgT04gZi5rbGllbnRhc19pZD10LmtsaWVudGFzX2lkIEFORCBmLmFwbW9rZXRhX2F0PXQucGlybWEgSk9JTiAkRSBlIE9OIGUudXpzYWt5bWFzX2lkPWYudXpzYWt5bWFzX2lkIEdST1VQIEJZIGIgSEFWSU5HIGtsaWVudGFpPj0yNSBPUkRFUiBCWSBrbGllbnRhaSBERVNDIExJTUlUIDE1IixBUlJBWV9BKTsKICAkb1snZ3Jpem9fcGFnYWxfYW92J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgQ0FTRSBXSEVOIGYudmlzb19jdDwyMDAwIFRIRU4gJzwyMCcgV0hFTiBmLnZpc29fY3Q8MzUwMCBUSEVOICcyMC0zNScgV0hFTiBmLnZpc29fY3Q8NjAwMCBUSEVOICczNS02MCcgRUxTRSAnNjArJyBFTkQgYiwgQ09VTlQoKikga2xpZW50YWksIFJPVU5EKFNVTSh0Lm4+MSkvQ09VTlQoKikqMTAwKSBwY3QgRlJPTSAoU0VMRUNUIGtsaWVudGFzX2lkLCBNSU4oYXBtb2tldGFfYXQpIHBpcm1hLCBDT1VOVCgqKSBuIEZST00gJFUgR1JPVVAgQlkga2xpZW50YXNfaWQgSEFWSU5HIHBpcm1hIEJFVFdFRU4gREFURV9TVUIoTk9XKCksSU5URVJWQUwgMjQgTU9OVEgpIEFORCBEQVRFX1NVQihOT1coKSxJTlRFUlZBTCAxMiBNT05USCkpIHQgSk9JTiAkVSBmIE9OIGYua2xpZW50YXNfaWQ9dC5rbGllbnRhc19pZCBBTkQgZi5hcG1va2V0YV9hdD10LnBpcm1hIEdST1VQIEJZIGIgT1JERVIgQlkgTUlOKGYudmlzb19jdCkiLEFSUkFZX0EpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-222506';
const GKEY='ps_sec8k3';
const PHASES=["GO"];
const OUT='analize/s1678_k3.json';
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
