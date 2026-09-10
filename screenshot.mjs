process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NjkgYXEg4oCUIFJFQUQtT05MWTogMjAzIHBhbmHFoWnFsyBwcmVracWzIDQwNCDihpIga2FuZGlkYXRhaSBwZXLFvmnFq3JhaSAoUDEvUDIpLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY2OWFxJ10pKSByZXR1cm47CiAgJGY9JF9HRVRbJ3BzX3MxNjY5YXEnXTsgJG89YXJyYXkoJ3YnPT4nUzE2NjkgYXEnLCdmYXplJz0+JGYpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgdHJ5ewogICAgJE49ZnVuY3Rpb24oJHMpeyAkcz1zdHJ0b2xvd2VyKHJhd3VybGRlY29kZShiYXNlbmFtZSgkcykpKTsgJHM9c3RyX3JlcGxhY2UoYXJyYXkoJ3NjYXJvbicsJ2NjYXJvbicsJ3pjYXJvbicsJ3VvZ29uJywnYW9nb24nLCdlb2dvbicsJ2Vkb3QnLCdpb2dvbicsJ3VtYWNyJyksYXJyYXkoJ3MnLCdjJywneicsJ3UnLCdhJywnZScsJ2UnLCdpJywndScpLCRzKTsgJHM9cHJlZ19yZXBsYWNlKCcvXjItMF9cZCstLycsJycsJHMpOyAkcz1wcmVnX3JlcGxhY2UoJy8tXGR7NX0tXGQkLycsJycsJHMpOyAkcz1wcmVnX3JlcGxhY2UoJy8oXnwtKWFuZCgtfCQpLycsJy0nLCRzKTsgcmV0dXJuICRzOyB9OwogICAgJGZsYXQ9ZnVuY3Rpb24oJHMpeyByZXR1cm4gcHJlZ19yZXBsYWNlKCcvW15hLXowLTldLycsJycsJHMpOyB9OwogICAgJGlkeD1hcnJheSgpOyAkdG9rPWFycmF5KCk7ICRpbmZvPWFycmF5KCk7CiAgICBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELCBwb3N0X25hbWUsIHBvc3Rfc3RhdHVzLCBwb3N0X3RpdGxlIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzIElOICgncHVibGlzaCcsJ2RyYWZ0JywncHJpdmF0ZScpIixBUlJBWV9BKSBhcyAkcil7CiAgICAgICRuPSROKCRyWydwb3N0X25hbWUnXSk7ICRpZHhbJGZsYXQoJG4pXVtdPSRyWydwb3N0X3N0YXR1cyddOwogICAgICBpZigkclsncG9zdF9zdGF0dXMnXSE9PSdwdWJsaXNoJykgY29udGludWU7ICRpbmZvWyRyWydJRCddXT1hcnJheSgkbiwkclsncG9zdF90aXRsZSddKTsKICAgICAgZm9yZWFjaChhcnJheV91bmlxdWUoZXhwbG9kZSgnLScsJG4pKSBhcyAkdCkgaWYoc3RybGVuKCR0KT49NCAmJiAhcHJlZ19tYXRjaCgnL15cZCskLycsJHQpKSAkdG9rWyR0XVtdPShpbnQpJHJbJ0lEJ107IH0KICAgICRtYXA9cGV0c2hvcF9sZWdhY3lfMzAxX21hcCgpOyAka2VsaWFpPWFycmF5KCk7CiAgICBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGtlbGlhcyB1LCBTVU0oaGl0cykgaywgU1VNKGJvdF9oaXRzKSBiLCBNQVgocmVmZXJlcikgciBGUk9NIHskcH1wc19zZW9fNDA0IFdIRVJFIHBhc2t1dGluaXNfYXQgPj0gJzIwMjYtMDktMDknIEdST1VQIEJZIHUiLEFSUkFZX0EpIGFzICRyKXsgJGs9c3RydG9sb3dlcih0cmltKHJhd3VybGRlY29kZSgoc3RyaW5nKXBhcnNlX3VybCgkclsndSddLFBIUF9VUkxfUEFUSCkpLCcvJykpOyBpZigkaz09PScnKSBjb250aW51ZTsgJGtlbGlhaVska11bJ2gnXT0oJGtlbGlhaVska11bJ2gnXT8/MCkrKGludCkkclsnayddOyAka2VsaWFpWyRrXVsnYiddPSgka2VsaWFpWyRrXVsnYiddPz8wKSsoaW50KSRyWydiJ107ICRrZWxpYWlbJGtdWydyJ109cGFyc2VfdXJsKChzdHJpbmcpJHJbJ3InXSxQSFBfVVJMX0hPU1QpPzooc3RyaW5nKSgka2VsaWFpWyRrXVsnciddPz8nJyk7IH0KICAgIGZvcmVhY2goJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdXJsX2tlbGlhcyB1LCBDT1VOVChESVNUSU5DVCBkaWVuYSxsYW5reXRvamFzX2QpIGwsIE1BWChDT0FMRVNDRShOVUxMSUYocmVmZXJlcl9kb21lbmFzLCcnKSxzYWx0aW5pcykpIHIgRlJPTSB7JHB9cHNfd2ViX2l2eWtpYWkgV0hFUkUgdGlwYXM9J2Vycm9yNDA0JyBBTkQgc2FsdGluaXNfYXBsaW5rYT0ncHJvZCcgQU5EIHRlc3RpbmlzPTAgR1JPVVAgQlkgdSIsQVJSQVlfQSkgYXMgJHIpeyAkaz1zdHJ0b2xvd2VyKHRyaW0ocmF3dXJsZGVjb2RlKChzdHJpbmcpcGFyc2VfdXJsKCRyWyd1J10sUEhQX1VSTF9QQVRIKSksJy8nKSk7IGlmKCRrPT09JycpIGNvbnRpbnVlOyAka2VsaWFpWyRrXVsnd2ViJ109KCRrZWxpYWlbJGtdWyd3ZWInXT8/MCkrKGludCkkclsnbCddOyBpZihlbXB0eSgka2VsaWFpWyRrXVsnciddKSkgJGtlbGlhaVska11bJ3InXT0oc3RyaW5nKSRyWydyJ107IH0KICAgICRsaXN0PWFycmF5KCk7CiAgICBmb3JlYWNoKCRrZWxpYWkgYXMgJGs9PiR4KXsKICAgICAgaWYoaXNzZXQoJG1hcFska10pKSBjb250aW51ZTsKICAgICAgaWYocHJlZ19tYXRjaCgnIyhefC8pKFwufHdwLXxhZG1pbnxsdC9hZG1pbnxpbWFnZS98Y2F0YWxvZy98X3Byb2ZpbGVyfF9lbnZpcm9ubWVudHxfaWduaXRpb258ZmNrZWRpdG9yfHN0YXRpYy98YXNzZXRzL3xvcGVufHZlbmRvcnxjZ2l8aXBmc3xhcGkvKXxcLihwaHB8aHRtbD98anBnfGpwZWd8cG5nfGdpZnxqc3xjc3N8dHh0fHhtbHxpY298anNvbnx5bWx8c3FsfHppcHxsb2d8YmFrfGxvY2t8b2xkfHNhdmUpJHx+JCMnLCRrKSkgY29udGludWU7CiAgICAgIGlmKHN1YnN0cl9jb3VudChiYXNlbmFtZSgkayksJy0nKTw9MykgY29udGludWU7CiAgICAgICRmaz0kZmxhdCgkTigkaykpOyBpZihpc3NldCgkaWR4WyRma10pKSBjb250aW51ZTsgLyogc2F1Z8WrcyBhcmJhIGRyYWZ0IOKAlCBqYXUgacWhc3ByxJlzdGkgKi8KICAgICAgJGxpc3RbJGtdPSR4OyB9CiAgICBrc29ydCgkbGlzdCk7ICRrZXlzPWFycmF5X2tleXMoJGxpc3QpOyAkb1sndmlzbyddPWNvdW50KCRrZXlzKTsKICAgICRwdXM9KGludCljZWlsKGNvdW50KCRrZXlzKS8yKTsgJGtleXM9KCRmPT09J1AxJyk/YXJyYXlfc2xpY2UoJGtleXMsMCwkcHVzKTphcnJheV9zbGljZSgka2V5cywkcHVzKTsKICAgIGZvcmVhY2goJGtleXMgYXMgJGspeyAkeD0kbGlzdFska107ICRuPSROKCRrKTsgJGNhbmQ9YXJyYXkoKTsKICAgICAgZm9yZWFjaChhcnJheV91bmlxdWUoZXhwbG9kZSgnLScsJG4pKSBhcyAkdCkgaWYoaXNzZXQoJHRva1skdF0pKSBmb3JlYWNoKCR0b2tbJHRdIGFzICRpZCkgJGNhbmRbJGlkXT0oJGNhbmRbJGlkXT8/MCkrMTsKICAgICAgJGNhbmQ9YXJyYXlfZmlsdGVyKCRjYW5kLGZ1bmN0aW9uKCRjKXtyZXR1cm4gJGM+PTI7fSk7ICRzYz1hcnJheSgpOwogICAgICBmb3JlYWNoKGFycmF5X2tleXMoJGNhbmQpIGFzICRpZCl7IHNpbWlsYXJfdGV4dCgkZmxhdCgkbiksJGZsYXQoJGluZm9bJGlkXVswXSksJHBjKTsgaWYoJHBjPj02MCkgJHNjWyRpZF09JHBjOyB9CiAgICAgIGFyc29ydCgkc2MpOyAkdG9wPWFycmF5KCk7CiAgICAgIGZvcmVhY2goYXJyYXlfc2xpY2UoJHNjLDAsMyx0cnVlKSBhcyAkaWQ9PiRwYyl7ICRwcD13Y19nZXRfcHJvZHVjdCgkaWQpOyAkdG9wW109YXJyYXkoJ2lkJz0+JGlkLCdwYXYnPT5odG1sX2VudGl0eV9kZWNvZGUoJGluZm9bJGlkXVsxXSksJ3VybCc9PndwX21ha2VfbGlua19yZWxhdGl2ZShnZXRfcGVybWFsaW5rKCRpZCkpLCdwYyc9PnJvdW5kKCRwYyksJ2xpa3V0aXMnPT4kcHA/JHBwLT5nZXRfc3RvY2tfc3RhdHVzKCk6Jz8nKTsgfQogICAgICAkb1snciddW109YXJyYXkoJ2snPT4kaywnem0nPT5tYXgoMCwoJHhbJ2gnXT8/MCktKCR4WydiJ10/PzApKSswLCd3ZWInPT4keFsnd2ViJ10/PzAsJ2JvdCc9PiR4WydiJ10/PzAsJ3Zpc28nPT4keFsnaCddPz8wLCdyZWYnPT4keFsnciddPz8nJywnYyc9PiR0b3ApOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRvKTsKfSk7Cg==';
const VER='dep-193954';
const GKEY='ps_s1669aq';
const PHASES=["P1", "P2"];
const OUT='analize/s1669_aq.json';
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
