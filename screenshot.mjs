process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODIwbSByZWNvbjogxaHEl3JpbW8gbGVudGVsacWzIHNjaGVtYSArIHBhdnl6ZMW+aWFpIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgyMG0nXSkpIHJldHVybjsgJHI9Wyd2Jz0+J1MxODIwbSddOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7CiAgdHJ5ewogICAgZm9yZWFjaChbJ3BzX2ZlZWRpbmdfdGFibGVzJywncHNfZmVlZGluZ19yb3dzJywncHNfZmVlZGluZ19tYXAnLCdwc19mZWVkaW5nX2ltcG9ydF9sb2cnXSBhcyAkdCl7ICRyWydjb2xzJ11bJHRdPSR3cGRiLT5nZXRfcmVzdWx0cygiU0hPVyBDT0xVTU5TIEZST00geyRQfSR0IixBUlJBWV9BKTsgJHJbJ24nXVskdF09JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH0kdCIpOyB9CiAgICAvLyBwYXZ5emTFvmlhaTogxaFsYXBpbyBtYWlzdG8gxaF1bmltcyBsZW50ZWzEl3MsIHlwYcSNIHN1IDMga8Wrbm8gYsWra2zEl3Mgc3R1bHBlbGlhaXMKICAgICRyWyd0YWJsZXNfc2FtcGxlJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskUH1wc19mZWVkaW5nX3RhYmxlcyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDMiLEFSUkFZX0EpOwogICAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIERJU1RJTkNUIG0uZmVlZGluZ190YWJsZV9pZCBGUk9NIHskUH1wc19mZWVkaW5nX21hcCBtIEpPSU4geyRQfXRlcm1fcmVsYXRpb25zaGlwcyB0ciBPTiB0ci5vYmplY3RfaWQ9bS5wcm9kdWN0X2lkIEpPSU4geyRQfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teT0ncHJvZHVjdF9jYXQnIEpPSU4geyRQfXRlcm1zIHQgT04gdC50ZXJtX2lkPXR0LnRlcm1faWQgV0hFUkUgdC5zbHVnPSdrb25zZXJ2YWktc3VuaW1zJyBBTkQgbS5pc19hY3RpdmU9MSBMSU1JVCA0MCIpOwogICAgJHJbJ2tvbnNfdGFibGVzJ109Y291bnQoJGlkcyk7CiAgICBpZigkaWRzKXsgJGluPWltcGxvZGUoJywnLGFycmF5X21hcCgnaW50dmFsJywkaWRzKSk7ICRyWydrb25zX3RibCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JFB9cHNfZmVlZGluZ190YWJsZXMgV0hFUkUgaWQgSU4gKCRpbikgTElNSVQgNCIsQVJSQVlfQSk7CiAgICAgICRmaXJzdD0oaW50KSRpZHNbMF07ICRyWydrb25zX3Jvd3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRQfXBzX2ZlZWRpbmdfcm93cyBXSEVSRSBmZWVkaW5nX3RhYmxlX2lkPSRmaXJzdCBMSU1JVCAzMCIsQVJSQVlfQSk7ICRyWydrb25zX21hcCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JFB9cHNfZmVlZGluZ19tYXAgV0hFUkUgZmVlZGluZ190YWJsZV9pZD0kZmlyc3QiLEFSUkFZX0EpOyB9CiAgICAvLyBsZW50ZWzEl3Mgc3Uga8Wrbm8gYsWra2zEl3MgYcWhaW1pCiAgICAkclsnYXhpc192YWxzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskUH1wc19mZWVkaW5nX3Jvd3MgV0hFUkUgZmVlZGluZ190YWJsZV9pZCBJTiAoU0VMRUNUIGlkIEZST00geyRQfXBzX2ZlZWRpbmdfdGFibGVzKSBHUk9VUCBCWSBmZWVkaW5nX3RhYmxlX2lkIExJTUlUIDMiLEFSUkFZX0EpOwogICAgJHJbJ2ltcG9ydF9sb2dfbGFzdCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLGFjdGlvbixwcm9kdWN0X2lkLGZlZWRpbmdfdGFibGVfaWQsb2xkX3Byb3ZlbmFuY2UsbmV3X3Byb3ZlbmFuY2UsY3JlYXRlZF9hdCxzdGF0dXMgRlJPTSB7JFB9cHNfZmVlZGluZ19pbXBvcnRfbG9nIE9SREVSIEJZIGlkIERFU0MgTElNSVQgOCIsQVJSQVlfQSk7CiAgICAvLyByZXBvIGtvZGFzCiAgICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfRmVlZGluZ19SZXBvc2l0b3J5JykpeyAkcmY9bmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9GZWVkaW5nX1JlcG9zaXRvcnknKTsgJHNyYz1maWxlKCRyZi0+Z2V0RmlsZU5hbWUoKSk7ICRyWydyZXBvX2ZpbGUnXT1iYXNlbmFtZSgkcmYtPmdldEZpbGVOYW1lKCkpOyAkbT0kcmYtPmdldE1ldGhvZCgnZ2V0X2Zvcl9wcm9kdWN0Jyk7ICRyWydyZXBvJ109aW1wbG9kZSgnJyxhcnJheV9zbGljZSgkc3JjLCRtLT5nZXRTdGFydExpbmUoKS0xLG1pbig5MCwkbS0+Z2V0RW5kTGluZSgpLSRtLT5nZXRTdGFydExpbmUoKSsxKSkpOyAkclsncmVwb19tZXRob2RzJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCRtKXtyZXR1cm4gJG0tPm5hbWU7fSwkcmYtPmdldE1ldGhvZHMoKSk7IH0KICAgIC8vIHByb2R1a3RvIHNrYWnEjWl1b2tsxJcgaXIgRFAKICAgICRmPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtcHJvZHVjdC1jYWxjLnBocCc7IGlmKGlzX2ZpbGUoJGYpKXsgJGM9ZmlsZSgkZik7ICRoPVtdOyBmb3JlYWNoKCRjIGFzICRpPT4kTCl7IGlmKHByZWdfbWF0Y2goJy9fZHBfYmFzZXxmZWVkaW5nX21hcHxnZXRfZm9yX3Byb2R1Y3R8Y2FsY1wofHByb2R1Y3RfaWR8a29uc2VydnxrYXRlZ29yL2knLCRMKSkgJGhbXT0oJGkrMSkuJzogJy5tYl9zdWJzdHIodHJpbSgkTCksMCwyMDApO30gJHJbJ3BjYWxjJ109YXJyYXlfc2xpY2UoJGgsMCw0MCk7IH0KICAgIC8vIGltcG9ydG8gLyBhZG1pbiDEr3JhbmtpYWkgxaHEl3JpbW8gbGVudGVsxJdtcwogICAgJHJbJ2ZlZWRpbmdfY2xhc3NlcyddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoZ2V0X2RlY2xhcmVkX2NsYXNzZXMoKSxmdW5jdGlvbigkYyl7cmV0dXJuIHN0cmlwb3MoJGMsJ2ZlZWRpbmcnKSE9PWZhbHNlO30pKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-170640';
const GKEY='ps_s1820m';
const PHASES=["1"];
const OUT='analize/s1820_m.json';
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
