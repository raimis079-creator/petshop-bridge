process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjcxIEdvb2dsZSBmZWVkIHBhdGlrcmEgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2NzFnJ10pIHx8ICRfR0VUWydwc19zMTY3MWcnXSE9PSdHJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7ICRvPWFycmF5KCd2Jz0+J1MxNjcxZycpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgdHJ5IHsKICAgICRmID0gcHNfZmVlZHNfa2VsaWFzKCdnb29nbGUnKTsgJG9bJ2ZhaWxhcyddPWFycmF5KCd5cmEnPT5maWxlX2V4aXN0cygkZiksJ2JhaXRhaSc9PmZpbGVfZXhpc3RzKCRmKT9maWxlc2l6ZSgkZik6MCwnbXRpbWUnPT5maWxlX2V4aXN0cygkZik/ZGF0ZSgnWS1tLWQgSDppOnMnLGZpbGVtdGltZSgkZikpOicnKTsKICAgICRyID0gd3BfcmVtb3RlX2hlYWQoJ2h0dHBzOi8vcGV0c2hvcC5sdC9mZWVkL2dvb2dsZS8nLCBhcnJheSgndGltZW91dCc9PjIwLCdzc2x2ZXJpZnknPT5mYWxzZSkpOyAkb1snaHR0cCddPWlzX3dwX2Vycm9yKCRyKT8kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKTphcnJheSgnY29kZSc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSwnY3QnPT53cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVyKCRyLCdjb250ZW50LXR5cGUnKSwnbGVuJz0+d3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkciwnY29udGVudC1sZW5ndGgnKSk7CiAgICBsaWJ4bWxfdXNlX2ludGVybmFsX2Vycm9ycyh0cnVlKTsgJHggPSBzaW1wbGV4bWxfbG9hZF9maWxlKCRmKTsgaWYoISR4KXsgJG9bJ3htbF9rbGFpZGEnXT1hcnJheV9tYXAoZnVuY3Rpb24oJGUpe3JldHVybiB0cmltKCRlLT5tZXNzYWdlKTt9LGFycmF5X3NsaWNlKGxpYnhtbF9nZXRfZXJyb3JzKCksMCwzKSk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAgICAkbnMgPSAkeC0+Z2V0TmFtZXNwYWNlcyh0cnVlKTsgJGl0ZW1zPSR4LT5jaGFubmVsLT5pdGVtOyAkb1snaXRlbXMnXT1jb3VudCgkaXRlbXMpOwogICAgJHN0PWFycmF5KCdiZV9ndGluJz0+MCwnYmVfaW1nJz0+MCwnYmVfYnJhbmQnPT4wLCdiZV9na2F0Jz0+MCwnYmVfc3ZvcmlvJz0+MCwna2FpbmEwJz0+MCwnYmVfYXByYXN5bW8nPT4wLCd0aXRsZV9pbGdhcyc9PjAsJ2R1YmxfaWQnPT4wLCdndGluX2Jsb2dhcyc9PjApOwogICAgJGlkcz1hcnJheSgpOyAkYmVfZ3Rpbj1hcnJheSgpOyAkYmxvZ2k9YXJyYXkoKTsgJGthdF9iZT1hcnJheSgpOwogICAgZm9yZWFjaCgkaXRlbXMgYXMgJGl0KXsgJGc9JGl0LT5jaGlsZHJlbigkbnNbJ2cnXSk7ICRpZD0oc3RyaW5nKSRnLT5pZDsgaWYoaXNzZXQoJGlkc1skaWRdKSkgJHN0WydkdWJsX2lkJ10rKzsgJGlkc1skaWRdPTE7CiAgICAgICRndD0oc3RyaW5nKSRnLT5ndGluOyBpZigkZ3Q9PT0nJyl7ICRzdFsnYmVfZ3RpbiddKys7IGlmKGNvdW50KCRiZV9ndGluKTw0MDApICRiZV9ndGluW109YXJyYXkoJGlkLChzdHJpbmcpJGl0LT50aXRsZSwoc3RyaW5nKSRnLT5icmFuZCk7IH0KICAgICAgZWxzZWlmKCFwcmVnX21hdGNoKCcvXlxkezh9JHxeXGR7MTIsMTR9JC8nLCRndCkpeyAkc3RbJ2d0aW5fYmxvZ2FzJ10rKzsgaWYoY291bnQoJGJsb2dpKTwyMCkgJGJsb2dpW109YXJyYXkoJGlkLCRndCk7IH0KICAgICAgaWYoKHN0cmluZykkZy0+aW1hZ2VfbGluaz09PScnKSAkc3RbJ2JlX2ltZyddKys7IGlmKChzdHJpbmcpJGctPmJyYW5kPT09JycpICRzdFsnYmVfYnJhbmQnXSsrOwogICAgICBpZigoc3RyaW5nKSRnLT5nb29nbGVfcHJvZHVjdF9jYXRlZ29yeT09PScnKXsgJHN0WydiZV9na2F0J10rKzsgJGs9KHN0cmluZykkZy0+cHJvZHVjdF90eXBlOyAka2F0X2JlWyRrXT0oJGthdF9iZVska10/PzApKzE7IH0KICAgICAgaWYoKHN0cmluZykkZy0+c2hpcHBpbmdfd2VpZ2h0PT09JycpICRzdFsnYmVfc3ZvcmlvJ10rKzsgaWYoKGZsb2F0KSRnLT5wcmljZTw9MCkgJHN0WydrYWluYTAnXSsrOwogICAgICBpZih0cmltKChzdHJpbmcpJGl0LT5kZXNjcmlwdGlvbik9PT0nJykgJHN0WydiZV9hcHJhc3ltbyddKys7IGlmKG1iX3N0cmxlbigoc3RyaW5nKSRpdC0+dGl0bGUpPjE1MCkgJHN0Wyd0aXRsZV9pbGdhcyddKys7IH0KICAgICRvWydzdCddPSRzdDsgJG9bJ2d0aW5fYmxvZ2knXT0kYmxvZ2k7IGFyc29ydCgka2F0X2JlKTsgJG9bJ2thdF9iZV9na2F0J109YXJyYXlfc2xpY2UoJGthdF9iZSwwLDE1LHRydWUpOwogICAgLy8gc3RvY2sgMCBiZXQgaW5zdG9jawogICAgJG9bJ3N0b2NrMF9pbnN0b2NrJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXBvc3RzIHAgSk9JTiB7JHB9cG9zdG1ldGEgcyBPTiBzLnBvc3RfaWQ9cC5JRCBBTkQgcy5tZXRhX2tleT0nX3N0b2NrX3N0YXR1cycgQU5EIHMubWV0YV92YWx1ZT0naW5zdG9jaycgSk9JTiB7JHB9cG9zdG1ldGEgcSBPTiBxLnBvc3RfaWQ9cC5JRCBBTkQgcS5tZXRhX2tleT0nX3N0b2NrJyBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBDQVNUKHEubWV0YV92YWx1ZSBBUyBTSUdORUQpPD0wIEFORCBOT1QgRVhJU1RTIChTRUxFQ1QgMSBGUk9NIHskcH1wb3N0bWV0YSBtIFdIRVJFIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdfbWFuYWdlX3N0b2NrJyBBTkQgbS5tZXRhX3ZhbHVlPSdubycpIik7CiAgICAkb1snc3RvY2swX3B2eiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQsIExFRlQocC5wb3N0X3RpdGxlLDYwKSB0LCBxLm1ldGFfdmFsdWUgc3RvY2ssIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXAuSUQgQU5EIG1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIExJTUlUIDEpIHNhbmQsIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXAuSUQgQU5EIG1ldGFfa2V5PSdfb3duX3N0b2NrX3F0eScgTElNSVQgMSkgb3duLCAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wLklEIEFORCBtZXRhX2tleT0nX21hbmFnZV9zdG9jaycgTElNSVQgMSkgbXMgRlJPTSB7JHB9cG9zdHMgcCBKT0lOIHskcH1wb3N0bWV0YSBzIE9OIHMucG9zdF9pZD1wLklEIEFORCBzLm1ldGFfa2V5PSdfc3RvY2tfc3RhdHVzJyBBTkQgcy5tZXRhX3ZhbHVlPSdpbnN0b2NrJyBKT0lOIHskcH1wb3N0bWV0YSBxIE9OIHEucG9zdF9pZD1wLklEIEFORCBxLm1ldGFfa2V5PSdfc3RvY2snIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIENBU1QocS5tZXRhX3ZhbHVlIEFTIFNJR05FRCk8PTAgTElNSVQgMTIiLCBBUlJBWV9BKTsKICAgICRvWydzdG9jazBfc2FuZCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIENPQUxFU0NFKChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXAuSUQgQU5EIG1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIExJTUlUIDEpLCc/Jykgc2FuZCwgQ09VTlQoKikgbiBGUk9NIHskcH1wb3N0cyBwIEpPSU4geyRwfXBvc3RtZXRhIHMgT04gcy5wb3N0X2lkPXAuSUQgQU5EIHMubWV0YV9rZXk9J19zdG9ja19zdGF0dXMnIEFORCBzLm1ldGFfdmFsdWU9J2luc3RvY2snIEpPSU4geyRwfXBvc3RtZXRhIHEgT04gcS5wb3N0X2lkPXAuSUQgQU5EIHEubWV0YV9rZXk9J19zdG9jaycgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgQ0FTVChxLm1ldGFfdmFsdWUgQVMgU0lHTkVEKTw9MCBHUk9VUCBCWSBzYW5kIiwgQVJSQVlfQSk7CiAgICAkb1snYmVfZ3Rpbl9wYWdhbF9icmFuZCddPWFycmF5KCk7IGZvcmVhY2goJGJlX2d0aW4gYXMgJGIpeyAkb1snYmVfZ3Rpbl9wYWdhbF9icmFuZCddWyRiWzJdPzonKGJlIGJyYW5kKSddPSgkb1snYmVfZ3Rpbl9wYWdhbF9icmFuZCddWyRiWzJdPzonKGJlIGJyYW5kKSddPz8wKSsxOyB9IGFyc29ydCgkb1snYmVfZ3Rpbl9wYWdhbF9icmFuZCddKTsgJG9bJ2JlX2d0aW5fcGFnYWxfYnJhbmQnXT1hcnJheV9zbGljZSgkb1snYmVfZ3Rpbl9wYWdhbF9icmFuZCddLDAsMjAsdHJ1ZSk7CiAgICAkb1snYmVfZ3Rpbl9wdnonXT1hcnJheV9zbGljZSgkYmVfZ3RpbiwwLDgpOwogICAgJG9bJ2Nyb25fZmVlZCddPXdwX25leHRfc2NoZWR1bGVkKCdwc19mZWVkc19nZW5lcnVvdGknKT9kYXRlKCdZLW0tZCBIOmk6cycsd3BfbmV4dF9zY2hlZHVsZWQoJ3BzX2ZlZWRzX2dlbmVydW90aScpKTonPyc7CiAgfSBjYXRjaCAoVGhyb3dhYmxlICRlKSB7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-144447';
const GKEY='ps_s1671g';
const PHASES=["G"];
const OUT='analize/s1671_g.json';
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
