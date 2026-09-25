process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE5dCDigJQgREIgaGlnaWVuYTogMSBzYXVzYXMsIDIgdnlrZHl0aSAobmVha3R5dsWrcyBzbmlwcGV0YWkg4oaSIGd6ICsgREVMRVRFOyBzbmlwcGV0c19iYWtfczYzNiDihpIgZ3ogKyBEUk9QOyBzaG9ydHBpeGVsXyog4oaSIHBvc3RtZXRhIGd6ICsgRFJPUDsgcGFzaWJhaWfEmSB0cmFuc2llbnRhaSksIDkgc25pcHBldMWzIGF0c3RhdHltYXMgacWhIGd6ICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcxOXQnXSkpIHJldHVybjsgJGY9JF9HRVRbJ3BzX3MxNzE5dCddOyAkcj1bJ3YnPT4nUzE3MTl0JywnZmF6ZSc9PiRmXTsgQHNldF90aW1lX2xpbWl0KDI1MCk7IEBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCc3NjhNJyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICAkYXJjaD0nL2hvbWUvZ3l2dW5haTIvZG9tYWlucy9wZXRzaG9wLmx0L3BzLWFyY2h5dmFzL3MxNzE5LWRiJzsgJHE9ZnVuY3Rpb24oJHMpIHVzZSgkd3BkYil7ICR4PSR3cGRiLT5nZXRfcmVzdWx0cygkcyxBUlJBWV9BKTsgcmV0dXJuICR3cGRiLT5sYXN0X2Vycm9yP1snU1FMX0VSUic9PiR3cGRiLT5sYXN0X2Vycm9yXTokeDsgfTsKICAkZHVtcD1mdW5jdGlvbigkc3FsLCRmaWxlKSB1c2UoJHdwZGIsJGFyY2gpeyAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHNxbCxBUlJBWV9BKTsgaWYoJHdwZGItPmxhc3RfZXJyb3IpIHRocm93IG5ldyBFeGNlcHRpb24oJHdwZGItPmxhc3RfZXJyb3IpOyAkZ3o9Z3plbmNvZGUoanNvbl9lbmNvZGUoJHJvd3MsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKSw2KTsgaWYoISRneikgdGhyb3cgbmV3IEV4Y2VwdGlvbignZ3ogJy4kZmlsZSk7IGlmKGZpbGVfcHV0X2NvbnRlbnRzKCRhcmNoLicvJy4kZmlsZSwkZ3opPT09ZmFsc2UpIHRocm93IG5ldyBFeGNlcHRpb24oJ3JhxaF5bWFzICcuJGZpbGUpOyAkY2hrPWpzb25fZGVjb2RlKGd6ZGVjb2RlKGZpbGVfZ2V0X2NvbnRlbnRzKCRhcmNoLicvJy4kZmlsZSkpLHRydWUpOyBpZighaXNfYXJyYXkoJGNoayl8fGNvdW50KCRjaGspIT09Y291bnQoJHJvd3MpKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCdwYXRpa3JhICcuJGZpbGUpOyByZXR1cm4gW2NvdW50KCRyb3dzKSxyb3VuZChzdHJsZW4oJGd6KS8xMDI0KS4na2InXTsgfTsKICAkc2l6ZT1mdW5jdGlvbigkdCkgdXNlKCR3cGRiKXsgcmV0dXJuICR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgVEFCTEVfUk9XUyByLFJPVU5EKChEQVRBX0xFTkdUSCtJTkRFWF9MRU5HVEgpLzEwNDg1NzYsMSkgbWIgRlJPTSBpbmZvcm1hdGlvbl9zY2hlbWEuVEFCTEVTIFdIRVJFIFRBQkxFX1NDSEVNQT1EQVRBQkFTRSgpIEFORCBUQUJMRV9OQU1FPSVzIiwkdCksQVJSQVlfQSk7IH07CiAgdHJ5ewogICAgJHNwPSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICd7JHB9c2hvcnRwaXhlbCUnIik7ICRiaz0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyRwfXNuaXBwZXRzX2JhayUnIik7CiAgICAkclsncHJpZXMnXT1bJ3NuaXBwZXRzX25lYWt0eXZ1cyc9PiRxKCJTRUxFQ1QgQ09VTlQoKikgbixST1VORChTVU0oTEVOR1RIKGNvZGUpKS8xMDQ4NTc2LDEpIG1iLFNVTShuYW1lIExJS0UgJ1RFTVAlJykgdGVtcCBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBhY3RpdmU9MCIpLCdzbmlwcGV0c19ha3R5dnVzJz0+JHEoIlNFTEVDVCBDT1VOVCgqKSBuIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0xIiksJ3NuaXBwZXRzX2Jhayc9PmFycmF5X21hcChmdW5jdGlvbigkdCkgdXNlKCRzaXplKXtyZXR1cm4gWyR0LCRzaXplKCR0KV07fSwkYmspLCdzaG9ydHBpeGVsJz0+YXJyYXlfbWFwKGZ1bmN0aW9uKCR0KSB1c2UoJHNpemUpe3JldHVybiBbJHQsJHNpemUoJHQpXTt9LCRzcCksJ3Nob3J0cGl4ZWxfYWt0eXZ1cyc9PmluX2FycmF5KCdzaG9ydHBpeGVsLWltYWdlLW9wdGltaXNlci93cC1zaG9ydHBpeGVsLnBocCcsKGFycmF5KWdldF9vcHRpb24oJ2FjdGl2ZV9wbHVnaW5zJykpLCd0cmFuc2llbnRhaV9wYXNpYmFpZ2UnPT4kcSgiU0VMRUNUIENPVU5UKCopIG4gRlJPTSB7JHB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdfdHJhbnNpZW50X3RpbWVvdXRfJScgQU5EIG9wdGlvbl92YWx1ZSswPFVOSVhfVElNRVNUQU1QKCkiKSwnZGJfbWInPT4kcSgiU0VMRUNUIFJPVU5EKFNVTShEQVRBX0xFTkdUSCtJTkRFWF9MRU5HVEgpLzEwNDg1NzYsMSkgbWIgRlJPTSBpbmZvcm1hdGlvbl9zY2hlbWEuVEFCTEVTIFdIRVJFIFRBQkxFX1NDSEVNQT1EQVRBQkFTRSgpIildOwogICAgaWYoJGY9PT0nMicpeyBpZighaXNfZGlyKCRhcmNoKSkgbWtkaXIoJGFyY2gsMDcwMCx0cnVlKTsKICAgICAgJHJbJ2d6J11bJ3NuaXBwZXRzLWluYWN0aXZlJ109JGR1bXAoIlNFTEVDVCAqIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0wIiwnc25pcHBldHMtaW5hY3RpdmUtczE3MTkuanNvbi5neicpOwogICAgICAkZGVsPSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0wIik7ICRyWydzbmlwcGV0c19pc3RyaW50YSddPSRkZWw7CiAgICAgIGZvcmVhY2goJGJrIGFzICR0KXsgJHJbJ2d6J11bJHRdPSRkdW1wKCJTRUxFQ1QgKiBGUk9NIGAkdGAiLCR0LictczE3MTkuanNvbi5neicpOyAkd3BkYi0+cXVlcnkoIkRST1AgVEFCTEUgYCR0YCIpOyAkclsnZHJvcCddW109JHQ7IH0KICAgICAgaWYoISRyWydwcmllcyddWydzaG9ydHBpeGVsX2FrdHl2dXMnXSl7IGZvcmVhY2goJHNwIGFzICR0KXsgaWYoc3RycG9zKCR0LCdwb3N0bWV0YScpIT09ZmFsc2V8fHN0cnBvcygkdCwnbWV0YScpIT09ZmFsc2V8fHN0cnBvcygkdCwnZm9sZGVycycpIT09ZmFsc2UpICRyWydneiddWyR0XT0kZHVtcCgiU0VMRUNUICogRlJPTSBgJHRgIiwkdC4nLXMxNzE5Lmpzb24uZ3onKTsgJHdwZGItPnF1ZXJ5KCJEUk9QIFRBQkxFIGAkdGAiKTsgJHJbJ2Ryb3AnXVtdPSR0OyB9IH0gZWxzZSAkclsnc2hvcnRwaXhlbCddPSdha3R5dnVzIOKAlCBuZWxpZXN0YSc7CiAgICAgICRyWyd0cmFuc2llbnRhaSddPWRlbGV0ZV9leHBpcmVkX3RyYW5zaWVudHModHJ1ZSk7CiAgICAgICR3cGRiLT5xdWVyeSgiT1BUSU1JWkUgVEFCTEUgeyRwfXNuaXBwZXRzIik7IHdwX2NhY2hlX2ZsdXNoKCk7CiAgICAgICRyWydwbyddPVsnc25pcHBldHMnPT4kcSgiU0VMRUNUIGFjdGl2ZSxDT1VOVCgqKSBuLFJPVU5EKFNVTShMRU5HVEgoY29kZSkpLzEwMjQpIGtiIEZST00geyRwfXNuaXBwZXRzIEdST1VQIEJZIGFjdGl2ZSIpLCdsZW50ZWxlc19saWtvJz0+YXJyYXlfbWVyZ2UoJHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJ3skcH1zaG9ydHBpeGVsJSciKSwkd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyRwfXNuaXBwZXRzX2JhayUnIikpLCdkYl9tYic9PiRxKCJTRUxFQ1QgUk9VTkQoU1VNKERBVEFfTEVOR1RIK0lOREVYX0xFTkdUSCkvMTA0ODU3NiwxKSBtYiBGUk9NIGluZm9ybWF0aW9uX3NjaGVtYS5UQUJMRVMgV0hFUkUgVEFCTEVfU0NIRU1BPURBVEFCQVNFKCkiKSwnYXJjaHl2YXMnPT5hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiBbYmFzZW5hbWUoJHgpLHJvdW5kKGZpbGVzaXplKCR4KS8xMDI0KS4na2InXTt9LGdsb2IoJGFyY2guJy8qJykpXTsKICAgICAgJGhiPXdwX3JlbW90ZV9nZXQoJ2h0dHBzOi8vcGV0c2hvcC5sdC8/cHNfaGI9Jy50aW1lKCksWyd0aW1lb3V0Jz0+MjUsJ3NzbHZlcmlmeSc9PmZhbHNlXSk7ICRyWydoYiddPWlzX3dwX2Vycm9yKCRoYik/J0VSUic6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJGhiKTsgfQogICAgaWYoJGY9PT0nOScpeyAkcm93cz1qc29uX2RlY29kZShnemRlY29kZShmaWxlX2dldF9jb250ZW50cygkYXJjaC4nL3NuaXBwZXRzLWluYWN0aXZlLXMxNzE5Lmpzb24uZ3onKSksdHJ1ZSk7ICRuPTA7IGZvcmVhY2goJHJvd3MgYXMgJHJvdyl7IGlmKCR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgaWQ9JWQiLCRyb3dbJ2lkJ10pKSkgY29udGludWU7ICR3cGRiLT5pbnNlcnQoInskcH1zbmlwcGV0cyIsJHJvdyk7ICRuKys7IH0gJHJbJ2F0c3RhdHl0YSddPSRuOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LDEpOwo=';
const VER='dep-164103';
const GKEY='ps_s1719t';
const PHASES=["2"];
const OUT='analize/s1719_t2.json';
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
