process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIExFQURFUiBiIHJlY29uIHJlYWQtb25seSAoa2xpZW50YWksIEIyQiwgbWVkaW5pYWkgc3RvdmFpKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfbGVhZGVyYiddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19sZWFkZXJiJ107IEBzZXRfdGltZV9saW1pdCgyODApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidMRUFERVJiJywnZmF6ZSc9PiRmXTsKICAkcT1mdW5jdGlvbigkc3FsKSB1c2UgKCR3cGRiLCYkcil7ICR4PSR3cGRiLT5nZXRfcmVzdWx0cygkc3FsLEFSUkFZX0EpOyBpZigkd3BkYi0+bGFzdF9lcnJvcil7ICRyWydTUUxfRVJSJ11bXT1tYl9zdWJzdHIoJHdwZGItPmxhc3RfZXJyb3IsMCwyMDApOyB9IHJldHVybiAkeDsgfTsKICAkT0s9InRlc3RpbmlzPTAgQU5EIHN0YXR1c2FzX2dhbHV0aW5pcyBOT1QgSU4oJ2NhbmNlbGxlZCcsJ2ZhaWxlZCcsJ3JlZnVuZGVkJywncGVuZGluZycsJ3RyYXNoJykiOwogICRVPSIoU0VMRUNUIHV6c2FreW1hc19pZCxrbGllbnRhc19lbWFpbF9oYXNoIGgsZGllbmEsdmlzb19jdCxzdGF0dXNhc19nYWx1dGluaXMsdGVzdGluaXMgRlJPTSB7JFB9cHNfaXN0X2Zha3RfdXpzYWt5bWFpIFVOSU9OIEFMTCBTRUxFQ1QgdXpzYWt5bWFzX2lkLGtsaWVudGFzX2VtYWlsX2hhc2gsZGllbmEsdmlzb19jdCxzdGF0dXNhc19nYWx1dGluaXMsdGVzdGluaXMgRlJPTSB7JFB9cHNfZmFrdF91enNha3ltYWkpIHUiOwogIHRyeXsKICBpZigkZj09PScxJyl7CiAgICAkclsnc3QnXT0kcSgiU0VMRUNUIHN0YXR1c2FzX2dhbHV0aW5pcyBzLCBDT1VOVCgqKSBuIEZST00gJFUgR1JPVVAgQlkgMSIpOwogICAgJHJbJ3JpYm9zJ109JHEoIlNFTEVDVCBNSU4oZGllbmEpIG1uLCBNQVgoZGllbmEpIG14IEZST00gJFUgV0hFUkUgJE9LIik7CiAgICAkclsnbWV0YWknXT0kcSgiU0VMRUNUIFlFQVIoZGllbmEpIG0sIENPVU5UKCopIHV6cywgQ09VTlQoRElTVElOQ1QgaCkga2xpZW50YWksIFJPVU5EKFNVTSh2aXNvX2N0KS8xMDApIGV1ciBGUk9NICRVIFdIRVJFICRPSyBHUk9VUCBCWSAxIik7CiAgICAkclsnbTEyJ109JHEoIlNFTEVDVCBDT1VOVCgqKSB1enMsIENPVU5UKERJU1RJTkNUIGgpIGtsaWVudGFpLCBST1VORChTVU0odmlzb19jdCkvMTAwKSBldXIgRlJPTSAkVSBXSEVSRSAkT0sgQU5EIGRpZW5hPj0nMjAyNS0xMC0xMiciKTsKICAgICRyWyd2aXNvJ109JHEoIlNFTEVDVCBDT1VOVCgqKSB1enMsIENPVU5UKERJU1RJTkNUIGgpIGtsaWVudGFpIEZST00gJFUgV0hFUkUgJE9LIik7CiAgICAkclsncGFrYXJ0X3Zpc28nXT0kcSgiU0VMRUNUIFNVTShuPj0yKSBwYWthcnQsIFNVTShuPj0zKSB0cnlzX3BsaXVzLCBDT1VOVCgqKSB2aXNpLCBTVU0oSUYobj49MixuLDApKSBwYWthcnRfdXpzLCBTVU0obikgdXpzIEZST00gKFNFTEVDVCBoLCBDT1VOVCgqKSBuIEZST00gJFUgV0hFUkUgJE9LIEdST1VQIEJZIGgpIHgiKTsKICAgICRyWydwYWthcnRfMTInXT0kcSgiU0VMRUNUIFNVTShuPj0yKSBwYWthcnQsIENPVU5UKCopIHZpc2kgRlJPTSAoU0VMRUNUIGgsIENPVU5UKCopIG4gRlJPTSAkVSBXSEVSRSAkT0sgQU5EIGRpZW5hPj0nMjAyNS0xMC0xMicgR1JPVVAgQlkgaCkgeCIpOwogICAgJHJbJ20xMl9ncml6ZSddPSRxKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgYS5oKSBuIEZST00gKFNFTEVDVCBESVNUSU5DVCBoIEZST00gJFUgV0hFUkUgJE9LIEFORCBkaWVuYT49JzIwMjUtMTAtMTInKSBhIEpPSU4gKFNFTEVDVCBESVNUSU5DVCBoIEZST00gJFUgV0hFUkUgJE9LIEFORCBkaWVuYTwnMjAyNS0xMC0xMicpIGIgT04gYS5oPWIuaCIpOwogICAgJHJbJ2lzdF9yYXdfbWV0YWknXT0kcSgiU0VMRUNUIFlFQVIoZGF0YSkgbSwgQ09VTlQoKikgbiwgQ09VTlQoRElTVElOQ1QgTE9XRVIoZW1haWwpKSBlbSwgU1VNKGl2eWtkeXRhcz0xKSBpdnlrZCBGUk9NIHskUH1wc19pc3RfdXpzYWt5bWFpIEdST1VQIEJZIDEiKTsKICAgICRyWydiMmJfaXN0J109JHEoIlNFTEVDVCBUUklNKGltb25lKSBpbW9uZSwgQ09VTlQoKikgbiwgUk9VTkQoU1VNKHN1bWEpKSBldXIsIE1JTihEQVRFKGRhdGEpKSBudW8sIE1BWChEQVRFKGRhdGEpKSBpa2kgRlJPTSB7JFB9cHNfaXN0X3V6c2FreW1haSBXSEVSRSBpbW9uZSBOT1QgSU4oJycsJzAnKSBBTkQgaXZ5a2R5dGFzPTEgR1JPVVAgQlkgMSBPUkRFUiBCWSBuIERFU0MgTElNSVQgMTIwIik7CiAgICAkclsnYjJiX2lzdF9zayddPSRxKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgVFJJTShMT1dFUihpbW9uZSkpKSBpbW9uaXUsIENPVU5UKCopIHV6cywgUk9VTkQoU1VNKHN1bWEpKSBldXIgRlJPTSB7JFB9cHNfaXN0X3V6c2FreW1haSBXSEVSRSBpbW9uZSBOT1QgSU4oJycsJzAnKSBBTkQgaXZ5a2R5dGFzPTEiKTsKICAgICRyWydiMmJfd2MnXT0kcSgiU0VMRUNUIGEuY29tcGFueSBpbW9uZSwgQ09VTlQoKikgbiwgUk9VTkQoU1VNKG8udG90YWxfYW1vdW50KSkgZXVyIEZST00geyRQfXdjX29yZGVycyBvIEpPSU4geyRQfXdjX29yZGVyX2FkZHJlc3NlcyBhIE9OIGEub3JkZXJfaWQ9by5pZCBBTkQgYS5hZGRyZXNzX3R5cGU9J2JpbGxpbmcnIFdIRVJFIG8udHlwZT0nc2hvcF9vcmRlcicgQU5EIG8uc3RhdHVzIElOKCd3Yy1jb21wbGV0ZWQnLCd3Yy1wcm9jZXNzaW5nJykgQU5EIGEuY29tcGFueTw+JycgR1JPVVAgQlkgMSBPUkRFUiBCWSBuIERFU0MgTElNSVQgNjAiKTsKICAgICRyWydzdG92YWlfaXN0J109JHEoIlNFTEVDVCBZRUFSKHUuZGF0YSkgbSwgZS5tb2RlbGlzLCBMRUZUKGUucGF2YWRpbmltYXMsNzApIHBhdiwgU1VNKGUua2lla2lzKSB2bnQsIFJPVU5EKFNVTShlLnN1bWEpLDIpIGV1ciwgQ09VTlQoRElTVElOQ1QgZS51enNha3ltb19pZCkgdXpzIEZST00geyRQfXBzX2lzdF9laWx1dGVzIGUgSk9JTiB7JFB9cHNfaXN0X3V6c2FreW1haSB1IE9OIHUuaWQ9ZS51enNha3ltb19pZCBXSEVSRSB1Lml2eWtkeXRhcz0xIEFORCAoZS5tb2RlbGlzIElOKCcxMDE2MCcsJzEwMTc3JykgT1IgZS5wYXZhZGluaW1hcyBMSUtFICclYW5rxbMgZGFyYm8lJyBPUiBlLnBhdmFkaW5pbWFzIExJS0UgJyVtZWTFvmlvIHN0b3YlJyBPUiBlLnBhdmFkaW5pbWFzIExJS0UgJyVtZWRpbiUnKSBHUk9VUCBCWSAxLDIsMyBPUkRFUiBCWSAxLDQgREVTQyIpOwogICAgJHJbJ3N0b3ZhaV93YyddPSRxKCJTRUxFQ1Qgc2t1LCBMRUZUKHBhdmFkaW5pbWFzX3R1b19tZXR1LDcwKSBwYXYsIFNVTShraWVraXMpIHZudCwgUk9VTkQoU1VNKGthaW5hX2N0KS8xMDAsMikgZXVyIEZST00geyRQfXBzX2Zha3RfZWlsdXRlcyBXSEVSRSB0ZXN0aW5pcz0wIEFORCAoc2t1IElOKCcxMDE2MCcsJzEwMTc3JykgT1IgcGF2YWRpbmltYXNfdHVvX21ldHUgTElLRSAnJWFua8WzIGRhcmJvJScpIEdST1VQIEJZIDEsMiIpOwogICAgZm9yZWFjaChbMTY0NDIsMTY0MzhdIGFzICRpZCl7ICRyWydwcmVrZSddWyRpZF09WydzdG9jayc9PmdldF9wb3N0X21ldGEoJGlkLCdfc3RvY2snLHRydWUpLCdvd24nPT5nZXRfcG9zdF9tZXRhKCRpZCwnX293bl9zdG9ja19xdHknLHRydWUpLCdjb3N0Jz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19jb3N0X3ByaWNlJyx0cnVlKSwnbW9kJz0+Z2V0X3Bvc3RfZmllbGQoJ3Bvc3RfbW9kaWZpZWQnLCRpZCksJ3N1a3VydGEnPT5nZXRfcG9zdF9maWVsZCgncG9zdF9kYXRlJywkaWQpXTsgfQogICAgJHJbJ3BhcnRpam9zJ109JHEoIlNFTEVDVCAqIEZST00geyRQfXBzX3BhcnRpam9zIFdIRVJFIHByZWtlX2lkIElOKDE2NDQyLDE2NDM4KSBMSU1JVCAxMCIpOwogIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-155031';
const GKEY='ps_leaderb';
const PHASES=["1"];
const OUT='analize/leader_b.json';
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
