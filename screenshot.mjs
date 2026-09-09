process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjc3IHN1dGlraW1vIGdyYW5kaW5lICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfYmwxJ10pPyRfR0VUWydwc19ibDEnXTonJykhPT0nQScpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjc3QScsJ3dwJz0+Y3VycmVudF90aW1lKCdteXNxbCcpKTsKICBnbG9iYWwgJHdwZGI7CiAgdHJ5ewogICAgLy8gMS4gS3VyIGd5dmVuYSBHVE0ga29kYXMKICAgICRzbj0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSxMRU5HVEgoY29kZSkgbCBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGNvZGUgTElLRSAnJWdvb2dsZXRhZ21hbmFnZXIlJyBPUiBjb2RlIExJS0UgJyVHVE0tJScgT1IgY29kZSBMSUtFICclY29uc2VudCUnIE9SREVSIEJZIGFjdGl2ZSBERVNDIixBUlJBWV9BKTsKICAgICRvWydzbmlwcGV0YWknXT0kc247CiAgICAkb1snbXUnXT1hcnJheSgpOwogICAgZm9yZWFjaChzY2FuZGlyKFdQTVVfUExVR0lOX0RJUikgYXMgJGYpeyBpZihzdWJzdHIoJGYsLTQpIT09Jy5waHAnKSBjb250aW51ZTsgJGM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvJy4kZik7CiAgICAgICR0PWFycmF5KCdndG0nPT5zdWJzdHJfY291bnQoJGMsJ2dvb2dsZXRhZ21hbmFnZXInKSwnY29uc2VudCc9PnN1YnN0cl9jb3VudCgkYywnY29uc2VudCcpLCdndGFnJz0+c3Vic3RyX2NvdW50KCRjLCdndGFnJyksJ2NtcGx6Jz0+c3Vic3RyX2NvdW50KCRjLCdjbXBseicpKTsKICAgICAgaWYoYXJyYXlfc3VtKCR0KT4wKSAkb1snbXUnXVskZl09JHQ7IH0KICAgIC8vIDIuIFRpdHVsaW5pbyBIRUFEIGFuYWxpemUKICAgICRyPXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSxhcnJheSgndGltZW91dCc9PjQ1LCdzc2x2ZXJpZnknPT5mYWxzZSwnaGVhZGVycyc9PmFycmF5KCdVc2VyLUFnZW50Jz0+J01vemlsbGEvNS4wIENocm9tZS8xNTInKSkpOwogICAgJGI9aXNfd3BfZXJyb3IoJHIpPycnOndwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKICAgICRoZWFkPXN1YnN0cigkYiwwLHN0cnBvcygkYiwnPC9oZWFkPicpPzoyMDAwMCk7CiAgICAkcG96PWZ1bmN0aW9uKCRoLCR6KXsgJHA9c3RyaXBvcygkaCwkeik7IHJldHVybiAkcD09PWZhbHNlPy0xOiRwOyB9OwogICAgJG9bJ2VpbGlza3VtYXMnXT1hcnJheSgKICAgICAgJ2NvbnNlbnRfZGVmYXVsdCc9PiRwb3ooJGhlYWQsIidjb25zZW50JyIpLAogICAgICAnY29uc2VudF9kZWZhdWx0X3R4dCc9PiRwb3ooJGhlYWQsJ2NvbnNlbnQiLCJkZWZhdWx0Jyk+PTA/JHBveigkaGVhZCwnY29uc2VudCIsImRlZmF1bHQnKTokcG96KCRoZWFkLCJjb25zZW50JywgJ2RlZmF1bHQiKSwKICAgICAgJ2d0bV9zY3JpcHRhcyc9PiRwb3ooJGhlYWQsJ2dvb2dsZXRhZ21hbmFnZXIuY29tL2d0bS5qcycpLAogICAgICAnZ3RtX2lubGluZSc9PiRwb3ooJGhlYWQsJ0dUTS1NRjNHWkdUJyksCiAgICAgICdjbXBsel9qcyc9PiRwb3ooJGhlYWQsJ2NvbXBsaWFueicpLAogICAgICAnZGF0YUxheWVyJz0+JHBveigkaGVhZCwnZGF0YUxheWVyJyksCiAgICApOwogICAgZm9yZWFjaChhcnJheSgnYWRfc3RvcmFnZScsJ2FuYWx5dGljc19zdG9yYWdlJywnYWRfdXNlcl9kYXRhJywnYWRfcGVyc29uYWxpemF0aW9uJywnZnVuY3Rpb25hbGl0eV9zdG9yYWdlJywnc2VjdXJpdHlfc3RvcmFnZScsJ3dhaXRfZm9yX3VwZGF0ZScsJ2NtcGx6X3N0YXR1cycsJ2NtcGx6X2NvbnNlbnQnKSBhcyAkeikgJG9bJ3Jha3Rhem9kemlhaSddWyR6XT1zdWJzdHJfY291bnQoJGIsJHopOwogICAgLy8gY29uc2VudCBkZWZhdWx0IGJsb2thcwogICAgaWYocHJlZ19tYXRjaCgnLyguezMwMH1jb25zZW50W1wnIl1ccyosXHMqW1wnIl1kZWZhdWx0Lns2MDB9KS9zJywkYiwkbSkpICRvWydjb25zZW50X2RlZmF1bHRfa29kYXMnXT1wcmVnX3JlcGxhY2UoJy9ccysvJywnICcsJG1bMV0pOwogICAgaWYocHJlZ19tYXRjaCgnLyguezIwMH1ndG1cLmpzLnszMDB9KS9zJywkYiwkbSkpICRvWydndG1fa29kYXMnXT1wcmVnX3JlcGxhY2UoJy9ccysvJywnICcsJG1bMV0pOwogICAgLy8gMy4gQ29tcGxpYW56IGludGVncmFjaWpvcwogICAgJGNvPWdldF9vcHRpb24oJ2NtcGx6X29wdGlvbnMnKTsKICAgIGZvcmVhY2goYXJyYXkoJ2NvbnNlbnQtbW9kZScsJ2d0YWctYmFzaWMtY29uc2VudC1tb2RlJywnY21wbHotZ3RhZy11cmxwYXNzdGhyb3VnaCcsJ2NtcGx6LWd0YWctYWRzX2RhdGFfcmVkYWN0aW9uJywnY21wbHotdG0tdGVtcGxhdGUnLCdndG1fY29kZScsJ2d0bV9jb2RlX2hlYWQnLCdzY3JpcHRfY2VudGVyX2J1dHRvbicsJ2Jsb2NrX3JlY2FwdGNoYV9zZXJ2aWNlJywnc2VsZl9ob3N0X2dvb2dsZV9mb250cycpIGFzICRrKSAkb1snY21wbHonXVska109aXNzZXQoJGNvWyRrXSk/KGlzX2FycmF5KCRjb1ska10pP2ltcGxvZGUoJywnLCRjb1ska10pOiRjb1ska10pOiduZXJhJzsKICAgICRvWydjbXBsel9pbnRlZ3JhY2lqb3MnXT1nZXRfb3B0aW9uKCdjbXBsel9hY3RpdmVfaW50ZWdyYXRpb25zJyk7CiAgICAvLyA0LiBBciBDb21wbGlhbnogYmxva2F0b3JpdXMga2Egbm9ycyBnYXVkbwogICAgJG9bJ2Jsb2thdG9yaXVzJ109YXJyYXkoJ2RhdGFfY21wbHonPT5zdWJzdHJfY291bnQoJGIsJ2RhdGEtY21wbHonKSwnYmxvY2tlZCc9PnN1YnN0cl9jb3VudCgkYiwnY21wbHotYmxvY2tlZC1jb250ZW50JyksCiAgICAgICdzY3JpcHRfY2xhc3MnPT5zdWJzdHJfY291bnQoJGIsJ2NtcGx6LXNjcmlwdCcpLCdwbGFjZWhvbGRlcic9PnN1YnN0cl9jb3VudCgkYiwnY21wbHotcGxhY2Vob2xkZXInKSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-082757';
const GKEY='ps_bl1';
const PHASES=["A"];
const OUT='analize/s1677_a.json';
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
