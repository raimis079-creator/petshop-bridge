process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE3ZCByZWNvbiByZWFkLW9ubHk6IGtvbnRyaWJ1Y2lqYSBzdS9iZSBwcmlzdGF0eW1vLCBwcmVraXUgaXNzYXVnb2ppbWFpIHBlciAxMCBtaW4sIFdQIEFsbCBJbXBvcnQgc2FyYXNhcyAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MTdkJ10pKSByZXR1cm47CiAgJGY9JF9HRVRbJ3BzX3MxNzE3ZCddOyBAc2V0X3RpbWVfbGltaXQoMTcwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3MTdkJywnZmF6ZSc9PiRmXTsKICAkdHo9bmV3IERhdGVUaW1lWm9uZSgnRXVyb3BlL1ZpbG5pdXMnKTsKICB0cnl7CiAgaWYoJGY9PT0nMScpewogICAgJGNvbHM9JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskUH1wc19mYWt0X3V6c2FreW1haSIpOyAkclsndXpfY29scyddPSRjb2xzOwogICAgJHBjPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoJGNvbHMsZnVuY3Rpb24oJGMpe3JldHVybiBwcmVnX21hdGNoKCcjcHJpc3RhdHxzaXVudHxrb250cmlifHNhdmlrYWlufG1hcnp8bW9rZXN8cGFrdW90IycsJGMpO30pKTsKICAgICRyWyd1el9la29uX2NvbHMnXT0kcGM7CiAgICAkZz0iKGdjbGlkPD4nJyBPUiB1dG1fY2FtcGFpZ24gUkVHRVhQICdeWzAtOV0rJCcgT1IgdXRtX3NvdXJjZT0nZ29vZ2xlJyBPUiBsYW5kaW5nX3VybCBMSUtFICclZ2NsaWQ9JScgT1IgbGFuZGluZ191cmwgTElLRSAnJXV0bV9zb3VyY2U9Z29vZ2xlJScpIjsKICAgICRzZWw9aW1wbG9kZSgnLCcsYXJyYXlfbWFwKGZ1bmN0aW9uKCRjKXtyZXR1cm4gImAkY2AiO30sJHBjKSk7CiAgICAkclsncHZ6J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdXpzYWt5bWFzX2lkLCBzdWt1cnRhX2F0LCB2aXNvX2N0LCAkc2VsIEZST00geyRQfXBzX2Zha3RfdXpzYWt5bWFpIFdIRVJFIHRlc3RpbmlzPTAgQU5EIHN0YXR1c2FzX2dhbHV0aW5pcyBOT1QgSU4oJ2NhbmNlbGxlZCcsJ2ZhaWxlZCcsJ3JlZnVuZGVkJywncGVuZGluZycpIEFORCBzdWt1cnRhX2F0Pj0nMjAyNi0wOS0yNCcgT1JERVIgQlkgc3VrdXJ0YV9hdCIsQVJSQVlfQSk7CiAgICAkclsnbnVsbF9wcmlzdGF0eW1hcyddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoKikgbiwgU1VNKHByaXN0YXR5bWFzX3NhdmlrYWluYV9jdCBJUyBOVUxMKSBudWxsX24gRlJPTSB7JFB9cHNfZmFrdF91enNha3ltYWkgV0hFUkUgdGVzdGluaXM9MCBBTkQgc3VrdXJ0YV9hdD49JzIwMjYtMDktMjEnIixBUlJBWV9BKTsKICAgIGlmKCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICd7JFB9cHNfZmFrdF9zaXVudG9zJyIpKSAkclsnc2l1bnR1X2thaW5hJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgcy51enNha3ltYXNfaWQsIHMua2FpbmFfdmV6ZWpvX2N0LCBzLnN0YXR1c2FzIEZST00geyRQfXBzX2Zha3Rfc2l1bnRvcyBzIFdIRVJFIHMudXpzYWt5bWFzX2lkIElOIChTRUxFQ1QgdXpzYWt5bWFzX2lkIEZST00geyRQfXBzX2Zha3RfdXpzYWt5bWFpIFdIRVJFIHN1a3VydGFfYXQ+PScyMDI2LTA5LTI0JyBBTkQgdGVzdGluaXM9MCkgT1JERVIgQlkgcy51enNha3ltYXNfaWQiLEFSUkFZX0EpOwogICAgLy8gcHJla2l1IGlzc2F1Z29qaW1haSBwZXIgMTAgbWluICh2aWV0aW5pcyBsYWlrYXMpCiAgICAkclsnaXNzYXVnb2ppbWFpXzEwbWluJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgQ09OQ0FUKERBVEVfRk9STUFUKHBvc3RfbW9kaWZpZWQsJyVIOicpLExQQUQoRkxPT1IoTUlOVVRFKHBvc3RfbW9kaWZpZWQpLzEwKSoxMCwyLCcwJykpIHQsIENPVU5UKCopIG4gRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGUgSU4oJ3Byb2R1Y3QnLCdwcm9kdWN0X3ZhcmlhdGlvbicpIEFORCBwb3N0X21vZGlmaWVkPj1EQVRFX1NVQignIi5jdXJyZW50X3RpbWUoJ215c3FsJykuIicsSU5URVJWQUwgNSBIT1VSKSBHUk9VUCBCWSAxIE9SREVSIEJZIDEiLEFSUkFZX0EpOwogICAgLy8gV1AgQWxsIEltcG9ydAogICAgaWYoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJ3skUH1wbXhpX2ltcG9ydHMnIikpewogICAgICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCwgbmFtZSwgZnJpZW5kbHlfbmFtZSwgdHlwZSwgdHJpZ2dlcmVkLCBwcm9jZXNzaW5nLCBleGVjdXRpbmcsIGltcG9ydGVkLCBjcmVhdGVkLCB1cGRhdGVkLCBza2lwcGVkLCBkZWxldGVkLCBjb3VudCwgbGFzdF9hY3Rpdml0eSwgcmVnaXN0ZXJlZF9vbiwgb3B0aW9ucyBGUk9NIHskUH1wbXhpX2ltcG9ydHMgT1JERVIgQlkgaWQiLEFSUkFZX0EpOwogICAgICBmb3JlYWNoKCRyb3dzIGFzICR4KXsgJG89QHVuc2VyaWFsaXplKCR4WydvcHRpb25zJ10pOyAkaz1bXTsgaWYoaXNfYXJyYXkoJG8pKXsgZm9yZWFjaChbJ2N1c3RvbV90eXBlJywnaXNfc2VsZWN0aXZlX2hhc2hpbmcnLCd1cGRhdGVfYWxsX2RhdGEnLCdpc191cGRhdGVfc3RhdHVzJywnaXNfdXBkYXRlX3RpdGxlJywnaXNfdXBkYXRlX2NvbnRlbnQnLCdpc191cGRhdGVfY3VzdG9tX2ZpZWxkcycsJ3VwZGF0ZV9jdXN0b21fZmllbGRzX2xvZ2ljJywnaXNfdXBkYXRlX2NhdGVnb3JpZXMnLCdpc191cGRhdGVfaW1hZ2VzJywnaXNfa2VlcF9mb3JtZXJfcG9zdHMnLCdjcmVhdGVfbmV3X3JlY29yZHMnLCdpc19kZWxldGVfbWlzc2luZycsJ3dpemFyZF90eXBlJywndW5pcXVlX2tleScsJ3RtcF91bmlxdWVfa2V5JywnaXNfdXBkYXRlX2F0dHJpYnV0ZXMnLCdpc191cGRhdGVfcHJpY2UnLCdpc191cGRhdGVfc3RvY2snXSBhcyAka2speyBpZihhcnJheV9rZXlfZXhpc3RzKCRraywkbykpICRrWyRra109aXNfc2NhbGFyKCRvWyRra10pP21iX3N1YnN0cigoc3RyaW5nKSRvWyRra10sMCw2MCk6J1thcnJdJzsgfSB9CiAgICAgICAgdW5zZXQoJHhbJ29wdGlvbnMnXSk7ICR4WydvcHQnXT0kazsgJHhbJ2ZyaWVuZGx5X25hbWUnXT1tYl9zdWJzdHIoKHN0cmluZykkeFsnZnJpZW5kbHlfbmFtZSddLDAsNjApOyAkeFsnbmFtZSddPW1iX3N1YnN0cigoc3RyaW5nKSR4WyduYW1lJ10sMCw2MCk7ICRyWydwbXhpJ11bXT0keDsgfQogICAgfQogICAgJHJbJ2xhaWthcyddPShuZXcgRGF0ZVRpbWUoJ25vdycsJHR6KSktPmZvcm1hdCgnWS1tLWQgSDppOnMnKTsKICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSwgMSk7Cg==';
const VER='dep-065328';
const GKEY='ps_s1717d';
const PHASES=["1"];
const OUT='analize/s1717_d.json';
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
