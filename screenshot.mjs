process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE2byB1cmxfcGFzc3Rocm91Z2ggc2FsdGluaXMgKyBTdXBlciBDYWNoZSBHRVQgdGFpc3lrbGUgcmVhZC1vbmx5ICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcxNm8nXSkpIHJldHVybjsKICBAc2V0X3RpbWVfbGltaXQoMTcwKTsgJHI9Wyd2Jz0+J1MxNzE2byddOwogIHRyeXsKICAgIGZvcmVhY2goYXJyYXlfbWVyZ2UoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpLGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtKi8qLnBocCcpLGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtKi9pbmNsdWRlcy8qLnBocCcpLGdsb2IoZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy8qLnBocCcpKSBhcyAkZyl7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRnKTsgaWYoc3RycG9zKCRzLCd1cmxfcGFzc3Rocm91Z2gnKSE9PWZhbHNlKXsgcHJlZ19tYXRjaF9hbGwoJyNbXlxuXXswLDIwMH11cmxfcGFzc3Rocm91Z2hbXlxuXXswLDEyMH0jJywkcywkbSk7IHByZWdfbWF0Y2goJyNQbHVnaW4gTmFtZTpbXlxuXSojJywkcywkcG4pOyBwcmVnX21hdGNoKCcjVmVyc2lvbjpbXlxuXSojJywkcywkdnYpOyAkclsnZmFpbGFpJ11bc3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkZyldPVsncGx1Z2luJz0+JHBuWzBdPz8nJywndmVyc2lqYSc9PiR2dlswXT8/JycsJ21kNSc9Pm1kNSgkcyksJ2VpbCc9PmFycmF5X21hcCgndHJpbScsJG1bMF0pXTsgfSB9CiAgICBnbG9iYWwgJHdwZGI7ICRyWydzbmlwcGV0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLCBuYW1lLCBhY3RpdmUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBjb2RlIExJS0UgJyV1cmxfcGFzc3Rocm91Z2glJyIsQVJSQVlfQSk7CiAgICAvLyBTdXBlciBDYWNoZToga2FpcCB0cmFrdHVvamEgR0VUIHBhcmFtZXRydXMKICAgICRwMT1XUF9QTFVHSU5fRElSLicvd3Atc3VwZXItY2FjaGUvd3AtY2FjaGUtcGhhc2UxLnBocCc7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRwMSk7IHByZWdfbWF0Y2goJyNmdW5jdGlvbiB3cHNjX2lzX2dldF9xdWVyeVwoLio/XG5cfSNzJywkcywkbSk7ICRyWyd3cHNjX2lzX2dldF9xdWVyeSddPXN1YnN0cigkbVswXT8/JycsMCwxNTAwKTsKICAgIGZvcmVhY2goWyd3cC1jYWNoZS1waGFzZTEucGhwJywnd3AtY2FjaGUtcGhhc2UyLnBocCcsJ3dwLWNhY2hlLnBocCddIGFzICRmKXsgJHM9ZmlsZV9nZXRfY29udGVudHMoV1BfUExVR0lOX0RJUi4nL3dwLXN1cGVyLWNhY2hlLycuJGYpOyBwcmVnX21hdGNoX2FsbCgnI1teXG5dezAsMTIwfSh0cmFja2luZ3x1dG1ffGZiY2xpZHxnY2xpZHxpZ25vcmVfZ2V0fHdwc2NfZ2V0X3BhcmFtc3xjYWNoZV9nZXRfcGFyYW1zKVteXG5dezAsMTIwfSNpJywkcywkbSk7IGlmKCRtWzBdKSAkclsnc2NfZ2V0J11bJGZdPWFycmF5X3NsaWNlKGFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoYXJyYXlfbWFwKCd0cmltJywkbVswXSkpKSwwLDEwKTsgfQogICAgJHJbJ3NjX2dsb2JhbHMnXT1bJ3dwX2NhY2hlX25vX2NhY2hlX2Zvcl9nZXQnPT4kR0xPQkFMU1snd3BfY2FjaGVfbm9fY2FjaGVfZm9yX2dldCddPz9udWxsLCd3cHNjX2lnbm9yZV9nZXQnPT4kR0xPQkFMU1snd3BzY19pZ25vcmVfZ2V0J10/P251bGwsJ3dwX2NhY2hlX3RyYWNraW5nX3BhcmFtZXRlcnMnPT4kR0xPQkFMU1snd3BfY2FjaGVfdHJhY2tpbmdfcGFyYW1ldGVycyddPz9udWxsXTsKICAgIC8vIGFyIC9rcmVwc2VsaXMvP19nbD0uLi4gaXIgL2thdGVnb3JpamEva2F0ZW1zLz9fZ2w9Li4uIGtlc3VvamFtaQogICAgZm9yZWFjaChbJy9rYXRlZ29yaWphL2thdGVtcy8/X2dsPTEqYWJjKl91cCpNUS4uKl9nYSp4JywnL2thdGVnb3JpamEva2F0ZW1zLyddIGFzICR1KXsgJGg9d3BfcmVtb3RlX2dldChob21lX3VybCgkdSksWyd0aW1lb3V0Jz0+NDAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdoZWFkZXJzJz0+WydVc2VyLUFnZW50Jz0+J01vemlsbGEvNS4wIENocm9tZS8xMjgnXV0pOyAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkaCk7ICRyWydrZXNhcyddWyR1XT1bd3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJGgpLHByZWdfbWF0Y2goJyNDYWNoZWQgcGFnZSBnZW5lcmF0ZWQjJywkYik/J0NBQ0hFRCc6KHByZWdfbWF0Y2goJyNEeW5hbWljIHBhZ2UgZ2VuZXJhdGVkIycsJGIpPydkeW5hbWljJzonLScpLHdwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXIoJGgsJ2NhY2hlLWNvbnRyb2wnKV07IH0KICAgICRyWydzdXRpa2ltYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzdXRpa2ltYXMsIENPVU5UKERJU1RJTkNUIHNlc2lqYSkgc2VzIEZST00geyR3cGRiLT5wcmVmaXh9cHNfd2ViX2l2eWtpYWkgV0hFUkUgbGFpa2FzPj1EQVRFX1NVQihOT1coKSxJTlRFUlZBTCA3IERBWSkgQU5EIHRlc3RpbmlzPTAgR1JPVVAgQlkgc3V0aWtpbWFzIixBUlJBWV9BKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-213643';
const GKEY='ps_s1716o';
const PHASES=["1"];
const OUT='analize/s1716_o1.json';
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
