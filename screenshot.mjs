process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI5YiBrZcWhbyB2YWx5bW8ga2FsdGluaW5rYXMgKGNsYXNzLWNhY2hlLXdhdGNoZXIpIHJlYWQtb25seSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MjliJ10pKSByZXR1cm47CiAgJGY9JF9HRVRbJ3BzX3MxNzI5YiddOyBAc2V0X3RpbWVfbGltaXQoMjAwKTsgJHI9Wyd2Jz0+J1MxNzI5YicsJ2ZhemUnPT4kZl07CiAgdHJ5ewogIGlmKCRmPT09JzEnKXsKICAgICRyb290PVdQX0NPTlRFTlRfRElSOyAkaGl0cz1bXTsKICAgICRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJHJvb3QsRmlsZXN5c3RlbUl0ZXJhdG9yOjpTS0lQX0RPVFMpKTsKICAgIGZvcmVhY2goJGl0IGFzICRmaSl7ICRuPSRmaS0+Z2V0RmlsZW5hbWUoKTsgaWYoaW5fYXJyYXkoJG4sWydjbGFzcy1jYWNoZS13YXRjaGVyLnBocCcsJ2NsYXNzLWNhY2hlLnBocCcsJ2NsYXNzLWhlbHBlci5waHAnXSx0cnVlKSkgJGhpdHNbXT1zdWJzdHIoJGZpLT5nZXRQYXRobmFtZSgpLHN0cmxlbigkcm9vdCkpOyBpZihjb3VudCgkaGl0cyk+MzApIGJyZWFrOyB9CiAgICAkclsnZmFpbGFpJ109JGhpdHM7CiAgICBmb3JlYWNoKCRoaXRzIGFzICRoKXsgaWYoYmFzZW5hbWUoJGgpIT09J2NsYXNzLWNhY2hlLXdhdGNoZXIucGhwJykgY29udGludWU7ICRzcmM9ZmlsZSgkcm9vdC4kaCk7ICRyWyd3YXRjaGVyJ11bJGhdPVsnZWlsJz0+Y291bnQoJHNyYyksJ21kNSc9PnN1YnN0cihtZDVfZmlsZSgkcm9vdC4kaCksMCw4KV07CiAgICAgICR0eHQ9aW1wbG9kZSgnJywkc3JjKTsKICAgICAgcHJlZ19tYXRjaF9hbGwoJyNhZGRfYWN0aW9uXHMqXChccypbXCciXShbXlwnIl0rKVtcJyJdW147XSo7IycsJHR4dCwkbSk7ICRyWyd3YXRjaGVyJ11bJGhdWydhZGRfYWN0aW9uJ109YXJyYXlfc2xpY2UoJG1bMF0sMCw2MCk7CiAgICAgICRyWyd3YXRjaGVyJ11bJGhdWycyNjBfMzMwJ109aW1wbG9kZSgnJyxhcnJheV9zbGljZSgkc3JjLDI1NSw4MCkpOwogICAgICAkclsnd2F0Y2hlciddWyRoXVsnaGVhZCddPWltcGxvZGUoJycsYXJyYXlfc2xpY2UoJHNyYywwLDQwKSk7CiAgICB9CiAgICBmb3JlYWNoKCRoaXRzIGFzICRoKXsgaWYoYmFzZW5hbWUoJGgpIT09J2NsYXNzLWNhY2hlLnBocCcpIGNvbnRpbnVlOyAkc3JjPWZpbGUoJHJvb3QuJGgpOyAkclsnY2FjaGVfcGhwJ11bJGhdPWltcGxvZGUoJycsYXJyYXlfc2xpY2UoJHNyYywyMjUsMzApKTsgfQogIH0KICBpZigkZj09PScyJyl7CiAgICAkclsnYWN0aXZlX3BsdWdpbnMnXT1nZXRfb3B0aW9uKCdhY3RpdmVfcGx1Z2lucycpOwogICAgJFc9V1BfQ09OVEVOVF9ESVIuJy9wbHVnaW5zL3Nlby1ieS1yYW5rLW1hdGgvaW5jbHVkZXMvJzsKICAgIGZvcmVhY2goW1snY2xhc3MtaGVscGVyLnBocCcsMjE1LDYwXSxbJ21vZHVsZXMvc2l0ZW1hcC9jbGFzcy1jYWNoZS13YXRjaGVyLnBocCcsNDAsMjIwXV0gYXMgJHgpeyAkc3JjPUBmaWxlKCRXLiR4WzBdKTsgJHJbJ2tvZGFpJ11bJHhbMF1dPSRzcmM/aW1wbG9kZSgnJyxhcnJheV9zbGljZSgkc3JjLCR4WzFdLTEsJHhbMl0pKTonbmVyYSc7IH0KICAgICRyWydybV9zaXRlbWFwX2NhY2hlJ109bnVsbDsgJG89Z2V0X29wdGlvbigncmFuay1tYXRoLW9wdGlvbnMtc2l0ZW1hcCcpOyBpZihpc19hcnJheSgkbykpeyBmb3JlYWNoKCRvIGFzICRrPT4kdikgaWYoc3RyaXBvcygkaywnY2FjaGUnKSE9PWZhbHNlfHxzdHJpcG9zKCRrLCdpbmNsdWRlJykhPT1mYWxzZSkgJHJbJ3JtX3NpdGVtYXBfY2FjaGUnXVska109JHY7IH0KICAgICRyWydybV92ZXInXT1kZWZpbmVkKCdSQU5LX01BVEhfVkVSU0lPTicpP1JBTktfTUFUSF9WRVJTSU9OOm51bGw7CiAgICAkclsnZmlsdHJhaSddPVtdOyBnbG9iYWwgJHdwX2ZpbHRlcjsgZm9yZWFjaChbJ3JhbmtfbWF0aC9zaXRlbWFwL2VuYWJsZV9jYWNoaW5nJywncmFua19tYXRoL2NsZWFyX2NhY2hlJywncmFua19tYXRoL3NpdGVtYXAvaW52YWxpZGF0ZWRfc3RvcmFnZSddIGFzICRoayl7ICRyWydmaWx0cmFpJ11bJGhrXT1pc3NldCgkd3BfZmlsdGVyWyRoa10pP2NvdW50KCR3cF9maWx0ZXJbJGhrXS0+Y2FsbGJhY2tzKTowOyB9CiAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-050922';
const GKEY='ps_s1729b';
const PHASES=["2"];
const OUT='analize/s1729b2.json';
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
