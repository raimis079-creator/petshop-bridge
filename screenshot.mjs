process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQwdSByZWNvbiAyICgxIHJlYWQtb25seSArIHNob3RzKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NDB1J10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNTApOyBnbG9iYWwgJHdwZGI7ICRyPVsndic9PidTMTc0MHUnXTsKICB0cnl7CiAgICBmb3JlYWNoKChhcnJheSlnZXRfdGhlbWVfbW9kcygpIGFzICRrPT4kdil7IGlmKHByZWdfbWF0Y2goJy9eKGhlYWRlcnx0b3BiYXJ8aGVhZGVyX2JvdHRvbSlfZWxlbWVudHN8XmhlYWRlcl9tb2JpbGV8c2VhcmNoLycsJGspKSAkclsnbW9kcyddWyRrXT0kdjsgfQogICAgJGhpdHM9W107ICRmaWxlcz1hcnJheV9tZXJnZShnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJyksZ2xvYihnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKS4nLyoucGhwJyksZ2xvYihnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKS4nLyovKi5waHAnKSxnbG9iKGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvKi5jc3MnKSxnbG9iKFdQX0NPTlRFTlRfRElSLicvcGx1Z2lucy9wZXRzaG9wLSovKi5waHAnKSxnbG9iKFdQX0NPTlRFTlRfRElSLicvcGx1Z2lucy9wZXRzaG9wLSovKi8qLnBocCcpKTsKICAgIGZvcmVhY2goJGZpbGVzIGFzICRmcCl7ICRzPShzdHJpbmcpQGZpbGVfZ2V0X2NvbnRlbnRzKCRmcCk7IGZvcmVhY2goWydiYW5lcmlzLWEnLCdwc2Mtc3RpY2t5LWF0YycsJ3BzLXdhc2snLCdjbXBsei1jb29raWViYW5uZXInXSBhcyAkbil7IGlmKHN0cnBvcygkcywkbikhPT1mYWxzZSkgJGhpdHNbJG5dW109c3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkZnApOyB9IH0KICAgICRyWydmYWlsYWknXT0kaGl0czsKICAgIC8vIGNvbXBsaWFueiBjdXN0b20gY3NzCiAgICAkbz1nZXRfb3B0aW9uKCdjbXBsel9vcHRpb25zJyk7IGlmKGlzX2FycmF5KCRvKSl7IGZvcmVhY2goJG8gYXMgJGs9PiR2KXsgaWYocHJlZ19tYXRjaCgnL2Nzc3xwb3NpdGlvbnxiYW5uZXJ8bW9iaWxlL2knLCRrKSYmaXNfc2NhbGFyKCR2KSkgJHJbJ2NtcGx6X29wdCddWyRrXT1tYl9zdWJzdHIoKHN0cmluZykkdiwwLDMwMCk7IH0gfQogICAgJGNiPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JHdwZGItPnByZWZpeH1jbXBsel9jb29raWViYW5uZXJzIExJTUlUIDIiLEFSUkFZX0EpOyBmb3JlYWNoKChhcnJheSkkY2IgYXMgJGIpeyAkbzI9W107IGZvcmVhY2goJGIgYXMgJGs9PiR2KXsgaWYocHJlZ19tYXRjaCgnL2Nzc3xwb3NpdGlvbnxzaXplfGZvbnR8YmFubmVyX3dpZHRofHVzZV9jdXN0b218dGhlbWV8bGF5b3V0fGNvbG9ycGFsZXR0ZV90b2dnbGVzfGJ1dHRvbnMvaScsJGspKSAkbzJbJGtdPW1iX3N1YnN0cigoc3RyaW5nKSR2LDAsNDAwKTsgfSAkclsnY21wbHpfYmFubmVyJ11bXT0kbzI7IH0KICAgIC8vIHN0aWNreSBhdGMgQ1NTIGtvbnRla3N0YXMKICAgIGlmKCFlbXB0eSgkaGl0c1sncHNjLXN0aWNreS1hdGMnXSkpeyAkcz1maWxlX2dldF9jb250ZW50cyhBQlNQQVRILiRoaXRzWydwc2Mtc3RpY2t5LWF0YyddWzBdKTsgcHJlZ19tYXRjaF9hbGwoJy8uezAsODB9cHNjLXN0aWNreS1hdGNbXntdKlx7W159XSpcfS8nLCRzLCRtKTsgJHJbJ3N0aWNreV9jc3MnXT1hcnJheV9zbGljZSgkbVswXSwwLDYpOyBwcmVnX21hdGNoX2FsbCgnLy57MCwxMjB9cHNjLXN0aWNreS1hdGMuezAsMjAwfS8nLCRzLCRtMik7ICRyWydzdGlja3lfanMnXT1hcnJheV9zbGljZShhcnJheV9maWx0ZXIoJG0yWzBdLGZ1bmN0aW9uKCR4KXtyZXR1cm4gc3RycG9zKCR4LCd7Jyk9PT1mYWxzZTt9KSwwLDYpOyB9CiAgICAkclsnc2hvdHMnXT1bCiAgICAgIFsnbic9PidlMV9rYXQnLCd1Jz0+aG9tZV91cmwoJy9rYXRlZ29yaWphL3N1bmltcy9tYWlzdGFzLXN1bmltcy9zYXVzYXMtbWFpc3Rhcy1zdW5pbXMvJyksJ3cnPT4zOTAsJ2gnPT44NDQsJ2V2YWwnPT4iKCgpPT57Y29uc3QgZT1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHMtd2FzaycpO2NvbnN0IGM9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNtcGx6LWNvb2tpZWJhbm5lcicpO3JldHVybiB7d2FzazplP2Uub3V0ZXJIVE1MLnJlcGxhY2UoL1xccysvZywnICcpLnNsaWNlKDAsMzAwMCk6bnVsbCx3YXNrX2g6ZT9lLm9mZnNldEhlaWdodDpudWxsLGNtcGx6X3ZhaWthaTpjP1suLi5jLmNoaWxkcmVuXS5tYXAoeD0+eC5jbGFzc05hbWUrJzonK3gub2Zmc2V0SGVpZ2h0Kyc6JytnZXRDb21wdXRlZFN0eWxlKHgpLmRpc3BsYXkpLmpvaW4oJyB8ICcpOm51bGwsY21wbHpfYnV0dG9uczpjPyhjLnF1ZXJ5U2VsZWN0b3IoJy5jbXBsei1idXR0b25zJyl8fHt9KS5vdXRlckhUTUw/LnNsaWNlKDAsOTAwKTpudWxsLGNtcGx6X2RvY3M6Yz8oYy5xdWVyeVNlbGVjdG9yKCcuY21wbHotZG9jdW1lbnRzLCAuY21wbHotbGlua3MnKXx8e30pLm91dGVySFRNTD8uc2xpY2UoMCw3MDApOm51bGwsY21wbHpfdGl0bGVfZGlzcDpjP2dldENvbXB1dGVkU3R5bGUoYy5xdWVyeVNlbGVjdG9yKCcuY21wbHotdGl0bGUnKSkuZGlzcGxheTpudWxsfX0pKCkiXSwKICAgICAgWyduJz0+J2UyX2Rlc2snLCd1Jz0+aG9tZV91cmwoJy8nKSwndyc9PjE0NDAsJ2gnPT45MDAsJ2V2YWwnPT4iKCgpPT4oe3BhaWVza2FfZGVzazpbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlci1zZWFyY2gsIC5oZWFkZXItc2VhcmNoLWZvcm0sIC5zZWFyY2hmb3JtJyldLm1hcChlPT5lLmNsYXNzTmFtZSsnOicrZS5vZmZzZXRXaWR0aCsneCcrZS5vZmZzZXRIZWlnaHQpLnNsaWNlKDAsNSl9KSkoKSJdLAogICAgXTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-194045';
const GKEY='ps_s1740u';
const PHASES=["1"];
const OUT='analize/s1740u.json';
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
