process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE3MDMgZiDigJQgSEVQTTExICgjMTg2MjMpOiAxKSBQZXRzaG9wX0Z1bGZpbGxtZW50OjpyZWNhbGN1bGF0ZSDihpIgYXIgc3RvY2tfc3RhdHVzIHRhbXBhIGluc3RvY2s7IDIpIGplaSBuZSDigJQgc2V0X3N0b2NrX3N0YXR1cygnaW5zdG9jaycpIHBlciBXQyArIHBhc3RhYmE7IGNhY2hlIGnFoXZhbHltYXM7IHBhdGlrcmEga2F0ZWdvcmlqb2plLiBUYWlwIHBhdDoga2llayBkYXIgcHJla2nFsyBzdSBfcHNfc2FuZGVsaXM9dmYvemIsIG93bj4wLCBiZXQgb3V0b2ZzdG9jayAodGEgcGF0aSBrbGFpZGEpLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTcwM2YnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOyAkaWQ9MTg2MjM7CiAgJHN0PWZ1bmN0aW9uKCkgdXNlKCRpZCl7ICRwcj13Y19nZXRfcHJvZHVjdCgkaWQpOyByZXR1cm4gYXJyYXkoJ3N0b2NrJz0+JHByLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSwnc3RhdHVzJz0+JHByLT5nZXRfc3RvY2tfc3RhdHVzKCksJ3Rlcm1zJz0+d3BfZ2V0X29iamVjdF90ZXJtcygkaWQsJ3Byb2R1Y3RfdmlzaWJpbGl0eScsYXJyYXkoJ2ZpZWxkcyc9PidzbHVncycpKSk7IH07CiAgJG9bJ3ByaWVzJ109JHN0KCk7CiAgaWYgKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9GdWxmaWxsbWVudCcpKXsgdHJ5IHsgJGZ1PW5ldyBQZXRzaG9wX0Z1bGZpbGxtZW50KCk7IGlmIChtZXRob2RfZXhpc3RzKCRmdSwncmVjYWxjdWxhdGUnKSl7ICRmdS0+cmVjYWxjdWxhdGUoJGlkKTsgJG9bJ3JlY2FsYyddPSdvayc7IH0gfSBjYXRjaCAoVGhyb3dhYmxlICRlKXsgJG9bJ3JlY2FsY19lcnInXT0kZS0+Z2V0TWVzc2FnZSgpOyB9IH0KICAkb1sncG9fcmVjYWxjJ109JHN0KCk7CiAgaWYgKCRvWydwb19yZWNhbGMnXVsnc3RhdHVzJ10hPT0naW5zdG9jaycpeyAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgJHByLT5zZXRfc3RvY2tfc3RhdHVzKCdpbnN0b2NrJyk7ICRwci0+c2F2ZSgpOyB3cF9pbnNlcnRfY29tbWVudChhcnJheSgnY29tbWVudF9wb3N0X0lEJz0+JGlkLCdjb21tZW50X3R5cGUnPT4nbm90ZScsJ2NvbW1lbnRfY29udGVudCc9PidTMTcwMzogcG8gbGlrdcSNaW8gxK92ZWRpbW8ga29ydGVsxJdqZSAoQVYgMiB2bnQuLCBwYXJ0aWphICM0MjU3KSBXQyBzdG9ja19zdGF0dXMgbGlrbyBvdXRvZnN0b2NrIChWRiBxdHkgMCksIHRvZMSXbCBrYXRlZ29yaWpvamUgbmVzaXJvZMSXLiBOdXN0YXR5dGEgaW5zdG9jayByYW5raW5pdS4gS2VsaWFzIOKAnkxpa3XEjWlvIMSvdmVkaW1hcyBrb3J0ZWzEl2plIiBkcm9wc2hpcCBwcmVrZWkgbmVwZXJza2FpxI1pdW9qYSBzdG9ja19zdGF0dXMg4oCUIHRhaXN5dGluYS4nLCd1c2VyX2lkJz0+MCwnY29tbWVudF9hdXRob3InPT4nQ2xhdWRlJywnY29tbWVudF9hcHByb3ZlZCc9PjEpKTsgJG9bJ3Jhbmtpbml1J109J2luc3RvY2snOyB9CiAgJG9bJ3BvJ109JHN0KCk7CiAgaWYgKGZ1bmN0aW9uX2V4aXN0cygnd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cycpKSB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRpZCk7CiAgaWYgKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfcG9zdF9jaGFuZ2UnKSkgd3BfY2FjaGVfcG9zdF9jaGFuZ2UoJGlkKTsgaWYgKGZ1bmN0aW9uX2V4aXN0cygncHJ1bmVfc3VwZXJfY2FjaGUnKSYmZGVmaW5lZCgnV1BfQ09OVEVOVF9ESVInKSl7IEBwcnVuZV9zdXBlcl9jYWNoZShXUF9DT05URU5UX0RJUi4nL2NhY2hlL3N1cGVyY2FjaGUvcGV0c2hvcC5sdC9wcm9kdWN0LWNhdGVnb3J5L3NhdXNhcy1tYWlzdGFzLXN1bmltcy8nLHRydWUpOyBAcHJ1bmVfc3VwZXJfY2FjaGUoV1BfQ09OVEVOVF9ESVIuJy9jYWNoZS9zdXBlcmNhY2hlL3BldHNob3AubHQvcHJvZHVjdC9leGNsdXNpb24taGVwYXRpYy1kaWV0aW5pcy1zYXVzYXMtc3VudS1tYWlzdGFzLXN1LWtpYXVsaWVuYS1yeXppYWlzLWlyLXppcm5lbGlhaXMtbS1sLTEya2cvJyx0cnVlKTsgJG9bJ2NhY2hlJ109J3BydW5lJzsgfQogICRyMj13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvcHJvZHVjdC1jYXRlZ29yeS9zYXVzYXMtbWFpc3Rhcy1zdW5pbXMvP29yZGVyYnk9ZGF0ZSZub2NhY2hlPScudGltZSgpKSxhcnJheSgndGltZW91dCc9PjIwKSk7ICRiMj1pc193cF9lcnJvcigkcjIpPycnOndwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyMik7ICRvWydrYXRlZ29yaWphX3lyYSddPXN0cnBvcygkYjIsJ3Bvc3QtJy4kaWQpIT09ZmFsc2V8fHN0cmlwb3MoJGIyLCdIZXBhdGljJykhPT1mYWxzZTsKICAkcjM9d3BfcmVtb3RlX2dldChob21lX3VybCgnL3Byb2R1Y3QtYnJhbmQvZXhjbHVzaW9uLz9ub2NhY2hlPScudGltZSgpKSxhcnJheSgndGltZW91dCc9PjIwKSk7ICRiMz1pc193cF9lcnJvcigkcjMpPycnOndwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyMyk7ICRvWydicmFuZF95cmEnXT1zdHJwb3MoJGIzLCdwb3N0LScuJGlkKSE9PWZhbHNlfHxzdHJpcG9zKCRiMywnSGVwYXRpYycpIT09ZmFsc2U7CiAgLy8gdGEgcGF0aSBrbGFpZGEga2l0dXI/CiAgJG9bJ3BhbmFzaW9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCwoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wLklEIEFORCBtZXRhX2tleT0nX3NrdScpIHNrdSxvLm1ldGFfdmFsdWUgb3duLHMubWV0YV92YWx1ZSBzYW5kLExFRlQocC5wb3N0X3RpdGxlLDUwKSB0IEZST00geyRwfXBvc3RzIHAgSk9JTiB7JHB9cG9zdG1ldGEgbyBPTiBvLnBvc3RfaWQ9cC5JRCBBTkQgby5tZXRhX2tleT0nX293bl9zdG9ja19xdHknIEFORCBvLm1ldGFfdmFsdWUrMD4wIEpPSU4geyRwfXBvc3RtZXRhIHMgT04gcy5wb3N0X2lkPXAuSUQgQU5EIHMubWV0YV9rZXk9J19wc19zYW5kZWxpcycgQU5EIHMubWV0YV92YWx1ZSBJTiAoJ3ZmJywnemInKSBKT0lOIHskcH1wb3N0bWV0YSBzcyBPTiBzcy5wb3N0X2lkPXAuSUQgQU5EIHNzLm1ldGFfa2V5PSdfc3RvY2tfc3RhdHVzJyBBTkQgc3MubWV0YV92YWx1ZT0nb3V0b2ZzdG9jaycgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBMSU1JVCAyMCIsQVJSQVlfQSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-124607';
const GKEY='ps_s1703f';
const PHASES=["1"];
const OUT='analize/s1703_f.json';
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
