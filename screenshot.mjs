process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjQzdCBzaXN0ZW1vcyBwanV2aWFpIFJFQUQtT05MWSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2J0J10pPyRfR0VUWydwc19idCddOicnKSE9PSdHTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogIGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoJ3YnPT4nUzE2NDN0JywncmV6aW1hcyc9PidSRUFELU9OTFknKTsKICB0cnl7CiAgICAvLyAxLiBORUdZVkkgS0FCTElBSSB2aXN1b3NlIGthYmxpdW9zZSAobmUgdGlrIGZhaWxlKSDigJQgdGlrcmEgV1AgYnVzZW5hCiAgICBnbG9iYWwgJHdwX2ZpbHRlcjsKICAgICRuZWc9YXJyYXkoKTsKICAgIGZvcmVhY2goJHdwX2ZpbHRlciBhcyAka2FibD0+JG9iail7CiAgICAgIGlmKHN0cnBvcygka2FibCwnd3BfYWpheCcpIT09MCAmJiBzdHJwb3MoJGthYmwsJ3BldHNob3AnKSE9PTAgJiYgc3RycG9zKCRrYWJsLCdwc18nKSE9PTApIGNvbnRpbnVlOwogICAgICBmb3JlYWNoKCRvYmotPmNhbGxiYWNrcyBhcyAkcHI9PiRjYnMpewogICAgICAgIGZvcmVhY2goJGNicyBhcyAkY2IpewogICAgICAgICAgJGY9JGNiWydmdW5jdGlvbiddOyAkb2s9dHJ1ZTsgJHZhcmRhcz0nJzsKICAgICAgICAgIGlmKGlzX3N0cmluZygkZikpeyAkdmFyZGFzPSRmOyAkb2s9ZnVuY3Rpb25fZXhpc3RzKCRmKTsgfQogICAgICAgICAgZWxzZWlmKGlzX2FycmF5KCRmKSYmY291bnQoJGYpPT0yKXsKICAgICAgICAgICAgJGtsPWlzX29iamVjdCgkZlswXSk/Z2V0X2NsYXNzKCRmWzBdKTokZlswXTsgJHZhcmRhcz0ka2wuJzo6Jy4kZlsxXTsKICAgICAgICAgICAgJG9rPW1ldGhvZF9leGlzdHMoJGZbMF0sJGZbMV0pOwogICAgICAgICAgfSBlbHNlIGNvbnRpbnVlOwogICAgICAgICAgaWYoISRvaykgJG5lZ1tdPSRrYWJsLicgLT4gJy4kdmFyZGFzOwogICAgICAgIH0KICAgICAgfQogICAgfQogICAgJG9bJ05FR1lWSV9LQUJMSUFJJ109YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkbmVnKSk7CiAgICAvLyAyLiBDUk9OCiAgICAkY3I9X2dldF9jcm9uX2FycmF5KCk7ICRlaT1hcnJheSgpOyAkdmVsPTA7ICRub3c9dGltZSgpOwogICAgZm9yZWFjaCgkY3IgYXMgJHRzPT4kaCl7IGZvcmVhY2goJGggYXMgJGhvb2s9PiR4KXsgJGVpWyRob29rXT0oJGVpWyRob29rXT8/MCkrY291bnQoJHgpOyBpZigkdHM8JG5vdy0zNjAwKSAkdmVsKys7IH0gfQogICAgYXJzb3J0KCRlaSk7CiAgICAkb1snY3JvbiddPWFycmF5KCdrYWJsaXUnPT5jb3VudCgkZWkpLCdpdnlraXVfdmVsdW9qYV8xaCc9PiR2ZWwsJ3RvcCc9PmFycmF5X3NsaWNlKCRlaSwwLDEyLHRydWUpKTsKICAgICRvWydjcm9uX2JlX2thYmxpdSddPWFycmF5KCk7CiAgICBmb3JlYWNoKGFycmF5X2tleXMoJGVpKSBhcyAkaCl7IGlmKCFpc3NldCgkd3BfZmlsdGVyWyRoXSkpICRvWydjcm9uX2JlX2thYmxpdSddW109JGg7IH0KICAgIC8vIDMuIFVaU0FLWU1BSSAvIHBzXyBsZW50ZWxlcwogICAgJG9bJ3V6c2FreW1haSddPWFycmF5KCk7CiAgICBmb3JlYWNoKHdjX2dldF9vcmRlcl9zdGF0dXNlcygpIGFzICRzdD0+JGxhYil7ICRrPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cHJlZml4fXdjX29yZGVycyBXSEVSRSBzdGF0dXM9JXMiLCRzdCkpOyBpZigkaykgJG9bJ3V6c2FreW1haSddWyRzdF09JGs7IH0KICAgIC8vIDQuIFBSRUtFUwogICAgJG9bJ3ByZWtlcyddPWFycmF5KAogICAgICAncHVibGlzaCc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIpLAogICAgICAnZHJhZnQnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0nZHJhZnQnIiksCiAgICAgICdiZV9rYWlub3MnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RzfSBwIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIE5PVCBFWElTVFMoU0VMRUNUIDEgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBtIFdIRVJFIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdfcHJpY2UnIEFORCBtLm1ldGFfdmFsdWU8PicnKSIpLAogICAgICAnYmVfc2t1Jz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0c30gcCBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBOT1QgRVhJU1RTKFNFTEVDVCAxIEZST00geyR3cGRiLT5wb3N0bWV0YX0gbSBXSEVSRSBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0nX3NrdScgQU5EIG0ubWV0YV92YWx1ZTw+JycpIiksCiAgICApOwogICAgJG9bJ3NrdV9kdWJsaWthdGFpJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgbWV0YV9rZXk9J19za3UnIEFORCBtZXRhX3ZhbHVlPD4nJyBHUk9VUCBCWSBtZXRhX3ZhbHVlIEhBVklORyBDT1VOVCgqKT4xKSB4Iik7CiAgICAvLyA1LiBMQUlTS1UgRUlMRQogICAgJGx0PSR3cGRiLT5wcmVmaXguJ3BzX2VtYWlsX2pvYnMnOwogICAgaWYoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyRsdCciKSkgJG9bJ2xhaXNrdV9laWxlJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc3RhdHVzLENPVU5UKCopIGsgRlJPTSAkbHQgR1JPVVAgQlkgc3RhdHVzIixBUlJBWV9BKTsKICAgIC8vIDYuIEFVVE9MT0FECiAgICAkb1snYXV0b2xvYWRfS0InXT1yb3VuZCgoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgU1VNKExFTkdUSChvcHRpb25fdmFsdWUpKSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgYXV0b2xvYWQ9J3llcyciKS8xMDI0LDEpOwogICAgJG9bJ2F1dG9sb2FkX3RvcCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLFJPVU5EKExFTkdUSChvcHRpb25fdmFsdWUpLzEwMjQsMSkgS0IgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIGF1dG9sb2FkPSd5ZXMnIE9SREVSIEJZIExFTkdUSChvcHRpb25fdmFsdWUpIERFU0MgTElNSVQgNSIsQVJSQVlfQSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-195110';
const GKEY='ps_bt';
const PHASES=["GO"];
const OUT='analize/s1643_t.json';
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
