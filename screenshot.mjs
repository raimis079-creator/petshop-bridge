process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzcgcnVuIG8g4oCUIHBldHNob3AtYWRzLW9mZmxpbmUgdjEuMCBERVBMT1kgKEQpICsgZW5kcG9pbnQgdGVzdGFzIChUKS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2NzdvJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJEY9JF9HRVRbJ3BzX3MxNjc3byddOyAkbz1hcnJheSgndic9PidTMTY3NyBvJywnZmF6ZSc9PiRGKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJGYxPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtYWRzLW9mZmxpbmUucGhwJzsKICBpZigkRj09PSdEJyl7ICRrMT1iYXNlNjRfZGVjb2RlKCdQRDl3YUhBS0x5b3FDaUFxSUZCc2RXZHBiaUJPWVcxbE9pQlFaWFJ6YUc5d0lFRmtjeUJQWm1ac2FXNWxDaUFxSUVSbGMyTnlhWEIwYVc5dU9pQkJjRzF2YThTWGRNV3pJSFhGdm5OaGEzbHR4Yk1nYzNVZ1oyTnNhV1FnYzhTRmNtSEZvV0Z6SUVkdmIyZHNaU0JCWkhNZ2IyWm1iR2x1WlNCcmIyNTJaWEp6YVdyRnN5REVyMnZFbDJ4cGJYVnBJQ2hCWkhNZ1UyTnlhWEIwSUhOcllXbDBieUJLVTA5T0tTNGdVbVZoWkMxdmJteDVMaUJUTVRZM055NEtJQ29nVm1WeWMybHZiam9nTVM0d0NpQXFDaUFxSUV0UFJNU1dURG9nYm1GeXhhRjVhMnpFbDNNZ1FXUnpJSFJoWnlkaGN5QndjbUZ5WVc1a1lTQnJiMjUyWlhKemFXcGhjeUFvWVdSaWJHOWpheXdnWVhSdFpYTjBZWE1nYzNWMGFXdHBiV0Z6S1N3Z2J5Qm5ZMnhwWkNCMXhiNXpZV3Q1YldVZ2JHbGxhMkVnZG1sellXUmhMZ29nS2lCV2FXVnVZU0IwYVdWellTQTlJRmRESUhYRnZuTmhhM2x0WVhNNklHZGpiR2xrSUNzZ1lYQnRiMnZFbDJwcGJXOGdiR0ZwYTJGeklDc2djM1Z0WVM0Z1IyOXZaMnhsSUdSMVlteHBkVzkwZFhNZ0tHZGpiR2xrSzJ4aGFXdGhjeXR3WVhaaFpHbHVhVzFoY3lrZ1lYUnRaWFJoSUhCaGRITXVDaUFxSUZYRnZtdHNZWFZ6WVRvZ0x6OXdjMTloWkhOZmIyWm1iR2x1WlQwOGNtRnJkR0Z6UGlaa2FXVnViM005TXlBZzRvYVNJRXBUVDA0Z2UyNHNJR1ZwYkRwYmUyZGpiR2xrTEd4aGFXdGhjeXgyWlhKMFpTeDJZV3hwZFhSaExIVjZjMzFkZlFvZ0tpQlNZV3QwWVhNNklHOXdZMmxxWVNCd2MxOWhaSE5mYjJabWJHbHVaVjl5WVd0MFlYTWdLSE4xYTNWeWFXRWdaR1Z3Ykc5NUlNU3ZjbUZ1YTJsektTNEtJQ292Q21sbUlDZ2dJU0JrWldacGJtVmtLQ0FuUVVKVFVFRlVTQ2NnS1NBcElIc2daWGhwZERzZ2ZRcGhaR1JmWVdOMGFXOXVLQ0FuYVc1cGRDY3NJR1oxYm1OMGFXOXVJQ2dwSUhzS0NXbG1JQ2dnSVNCcGMzTmxkQ2dnSkY5SFJWUmJKM0J6WDJGa2MxOXZabVpzYVc1bEoxMGdLU0FwSUhzZ2NtVjBkWEp1T3lCOUNna2tjbUZyZEdGeklEMGdLSE4wY21sdVp5a2daMlYwWDI5d2RHbHZiaWdnSjNCelgyRmtjMTl2Wm1ac2FXNWxYM0poYTNSaGN5Y3NJQ2NuSUNrN0NnbHBaaUFvSUNjbklEMDlQU0FrY21GcmRHRnpJSHg4SUNFZ2FHRnphRjlsY1hWaGJITW9JQ1J5WVd0MFlYTXNJQ2h6ZEhKcGJtY3BJQ1JmUjBWVVd5ZHdjMTloWkhOZmIyWm1iR2x1WlNkZElDa2dLU0I3SUhOMFlYUjFjMTlvWldGa1pYSW9JRFF3TXlBcE95QmxlR2wwT3lCOUNnbG5iRzlpWVd3Z0pIZHdaR0k3SUNSd0lEMGdKSGR3WkdJdFBuQnlaV1pwZURzS0NTUmthV1Z1YjNNZ1BTQnRZWGdvSURFc0lHMXBiaWdnTXpBc0lDaHBiblFwSUNnZ0pGOUhSVlJiSjJScFpXNXZjeWRkSUQ4L0lETWdLU0FwSUNrN0Nna2tiblZ2SUNBZ0lEMGdaMjFrWVhSbEtDQW5XUzF0TFdRZ1NEcHBPbk1uTENCMGFXMWxLQ2tnTFNBa1pHbGxibTl6SUNvZ09EWTBNREFnS1RzS0NTUnliM2R6SUNBZ1BTQWtkM0JrWWkwK1oyVjBYM0psYzNWc2RITW9JQ1IzY0dSaUxUNXdjbVZ3WVhKbEtBb0pDU0pUUlV4RlExUWdkWHB6WVd0NWJXRnpYMmxrTENCblkyeHBaQ0JHVWs5TklIc2tjSDF3YzE5bVlXdDBYM1Y2YzJGcmVXMWhhU0JYU0VWU1JTQjBaWE4wYVc1cGN6MHdJRUZPUkNCblkyeHBaRHcrSnljZ1FVNUVJR0Z3Ylc5clpYUmhYMkYwSUVsVElFNVBWQ0JPVlV4TUlFRk9SQ0JoY0cxdmEyVjBZVjloZENBK1BTQWxjeUJCVGtRZ2MzUmhkSFZ6WVhOZloyRnNkWFJwYm1seklFbE9JQ2duY0hKdlkyVnpjMmx1Wnljc0oyTnZiWEJzWlhSbFpDY3BJaXdnSkc1MWJ5QXBMQ0JCVWxKQldWOUJJQ2s3Q2dra1pXbHNJRDBnWVhKeVlYa29LVHNLQ1dadmNtVmhZMmdnS0NBa2NtOTNjeUJoY3lBa2NpQXBJSHNLQ1Fra2J5QTlJSGRqWDJkbGRGOXZjbVJsY2lnZ0tHbHVkQ2tnSkhKYkozVjZjMkZyZVcxaGMxOXBaQ2RkSUNrN0Nna0phV1lnS0NBaElDUnZJSHg4SUNFZ0pHOHRQbWx6WDNCaGFXUW9LU0I4ZkNBaElDUnZMVDVuWlhSZlpHRjBaVjl3WVdsa0tDa2dLU0I3SUdOdmJuUnBiblZsT3lCOUNna0pKR1ZwYkZ0ZElEMGdZWEp5WVhrb0Nna0pDU2RuWTJ4cFpDY2dJQ0E5UGlBa2Nsc25aMk5zYVdRblhTd0tDUWtKSjJ4aGFXdGhjeWNnSUQwK0lDUnZMVDVuWlhSZlpHRjBaVjl3WVdsa0tDa3RQbVp2Y20xaGRDZ2dKMWt0YlMxa0lFZzZhVHB6VUNjZ0tTd0tDUWtKSjNabGNuUmxKeUFnSUQwK0lISnZkVzVrS0NBb1pteHZZWFFwSUNSdkxUNW5aWFJmZEc5MFlXd29LU3dnTWlBcExBb0pDUWtuZG1Gc2FYVjBZU2NnUFQ0Z0pHOHRQbWRsZEY5amRYSnlaVzVqZVNncExBb0pDUWtuZFhwekp5QWdJQ0FnUFQ0Z0pHOHRQbWRsZEY5cFpDZ3BMQW9KQ1NrN0NnbDlDZ2xvWldGa1pYSW9JQ2REYjI1MFpXNTBMVlI1Y0dVNklHRndjR3hwWTJGMGFXOXVMMnB6YjI0N0lHTm9ZWEp6WlhROWRYUm1MVGduSUNrN0NnbGxZMmh2SUhkd1gycHpiMjVmWlc1amIyUmxLQ0JoY25KaGVTZ2dKM1luSUQwK0lDY3hMakFuTENBblpHbGxibTl6SnlBOVBpQWtaR2xsYm05ekxDQW5iaWNnUFQ0Z1kyOTFiblFvSUNSbGFXd2dLU3dnSjJWcGJDY2dQVDRnSkdWcGJDQXBJQ2s3Q2dsbGVHbDBPd3A5SUNrN0NnPT0nKTsKICAgIGlmKG1kNSgkazEpIT09JzQ5MzE5YjY5ZDFlMTk0YWFiYjdiYWY0ZTJkMzEzZjJkJyl7ICRvWydTVE9QJ109J2I2NCBtZDUnOyB9IGVsc2VpZihAdG9rZW5fZ2V0X2FsbCgkazEsVE9LRU5fUEFSU0UpPT09ZmFsc2UpeyAkb1snU1RPUCddPSdzaW50YWtzxJcnOyB9CiAgICBlbHNlIHsgaWYoIWdldF9vcHRpb24oJ3BzX2Fkc19vZmZsaW5lX3Jha3RhcycpKSB1cGRhdGVfb3B0aW9uKCdwc19hZHNfb2ZmbGluZV9yYWt0YXMnLHdwX2dlbmVyYXRlX3Bhc3N3b3JkKDMyLGZhbHNlKSxmYWxzZSk7CiAgICAgIGZpbGVfcHV0X2NvbnRlbnRzKCRmMSwkazEpOyAkb1snbWQ1J109bWQ1X2ZpbGUoJGYxKTsKICAgICAgJHI9d3BfcmVtb3RlX2dldChob21lX3VybCgnLz9wc19waW5nX3MxNjc3bz0nLnRpbWUoKSksYXJyYXkoJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsgJGM9aXNfd3BfZXJyb3IoJHIpPydFUlInOndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKTsgJG9bJ3BpbmcnXT0kYzsKICAgICAgaWYoaXNfd3BfZXJyb3IoJHIpfHwkYz49NTAwKXsgdW5saW5rKCRmMSk7ICRvWydST0xMQkFDSyddPTE7IH0gfSB9CiAgaWYoJEY9PT0nVCcpeyAkaz1nZXRfb3B0aW9uKCdwc19hZHNfb2ZmbGluZV9yYWt0YXMnKTsgJG9bJ3Jha3RhcyddPSRrOwogICAgJHI9d3BfcmVtb3RlX2dldChob21lX3VybCgnLz9wc19hZHNfb2ZmbGluZT0nLiRrLicmZGllbm9zPTUnKSxhcnJheSgndGltZW91dCc9PjQwLCdzc2x2ZXJpZnknPT5mYWxzZSkpOyAkb1snaHR0cCddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKTsgJGI9anNvbl9kZWNvZGUod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpLHRydWUpOwogICAgJG9bJ24nXT0kYlsnbiddPz9udWxsOyAkb1sncHZ6J109YXJyYXlfc2xpY2UoJGJbJ2VpbCddPz9hcnJheSgpLDAsMyk7IGZvcmVhY2goJG9bJ3B2eiddIGFzICYkZSl7ICRlWydnY2xpZCddPXN1YnN0cigkZVsnZ2NsaWQnXSwwLDgpLifigKYnOyB9IHVuc2V0KCRlKTsKICAgICRvWydmYWt0X2djbGlkX3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cHNfZmFrdF91enNha3ltYWkgV0hFUkUgdGVzdGluaXM9MCBBTkQgZ2NsaWQ8PicnIik7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9KTsK';
const VER='dep-145505';
const GKEY='ps_s1677o';
const PHASES=["D", "T"];
const OUT='analize/s1677_o.json';
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
