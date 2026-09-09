process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjg0IGZ1bmtjaW5pcyB0ZXN0YXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19ibGYnXSk/JF9HRVRbJ3BzX2JsZiddOicnKSE9PSdUJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2ODRUJywnd3AnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpOwogIGdsb2JhbCAkd3BkYjsKICB0cnl7CiAgICAvLyBhZG1pbmFzCiAgICAkYWRtPWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSwnZmllbGRzJz0+J0lEJykpOwogICAgaWYoISRhZG0peyAkb1snU1RPUCddPSduZXJhIGFkbWlubyc7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAgICB3cF9zZXRfY3VycmVudF91c2VyKChpbnQpJGFkbVswXSk7CiAgICAkb1sndmFydG90b2phcyddPShpbnQpJGFkbVswXTsKICAgICRvWydnYWxpJ109Y3VycmVudF91c2VyX2NhbignbWFuYWdlX3dvb2NvbW1lcmNlJyk7CgogICAgLy8gd3BfZGllIC0+IGlzaW10aXMsIGthZCB3cF9zZW5kX2pzb24gbmVpc2p1bmd0dSBwcm9jZXNvCiAgICAkaD1mdW5jdGlvbigpeyByZXR1cm4gZnVuY3Rpb24oJG1zZywkdGl0bGU9JycsJGFyZ3M9YXJyYXkoKSl7IHRocm93IG5ldyBFeGNlcHRpb24oJ1dQRElFJyk7IH07IH07CiAgICBhZGRfZmlsdGVyKCd3cF9kaWVfYWpheF9oYW5kbGVyJywkaCw5OSk7CiAgICBhZGRfZmlsdGVyKCd3cF9kaWVfaGFuZGxlcicsJGgsOTkpOwoKICAgICRrdmllY2lhbT1mdW5jdGlvbigkcG9zdCkgdXNlICgmJG8pewogICAgICAkX1BPU1Q9JHBvc3Q7ICRfUkVRVUVTVD0kcG9zdDsKICAgICAgb2Jfc3RhcnQoKTsKICAgICAgdHJ5eyBQZXRzaG9wX0thdGFsb2dhczo6YWpheF9wYXJ0aWphKCk7IH1jYXRjaChUaHJvd2FibGUgJGUpe30KICAgICAgJG91dD1vYl9nZXRfY2xlYW4oKTsKICAgICAgJGo9anNvbl9kZWNvZGUoJG91dCx0cnVlKTsKICAgICAgcmV0dXJuICRqIT09bnVsbD8kajphcnJheSgnUkFXJz0+c3Vic3RyKCRvdXQsMCwyMDApKTsKICAgIH07CgogICAgJGxlbnQ9UGV0c2hvcF9QYXJ0aWpvczo6bGVudGVsZSgpOwogICAgLy8gdGVzdGluZSBwYXJ0aWphOiBTMTY4MiBzdWt1cnRhLCBtYXphIHByZWtlCiAgICAkcD0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUICogRlJPTSBgJGxlbnRgIFdIRVJFIHBhc3RhYmEgTElLRSAnJVMxNjgyJScgQU5EIGtpZWtpc19nYXV0YXMgQkVUV0VFTiAyIEFORCA2IE9SREVSIEJZIGlkIExJTUlUIDEiLEFSUkFZX0EpOwogICAgaWYoISRwKXsgJG9bJ1NUT1AnXT0ndGVzdGluxJcgcGFydGlqYSBuZXJhc3RhJzsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsgfQogICAgJHBhcnQ9KGludCkkcFsnaWQnXTsgJHBpZD0oaW50KSRwWydwcm9kdWN0X2lkJ107CiAgICAkb1sndGVzdGluZSddPWFycmF5KCdwYXJ0aWphJz0+JHBhcnQsJ3ByZWtlJz0+JHBpZCwncGF2Jz0+c3Vic3RyKGh0bWxfZW50aXR5X2RlY29kZShnZXRfdGhlX3RpdGxlKCRwaWQpKSwwLDQwKSwKICAgICAgJ2dhdXRhJz0+KGludCkkcFsna2lla2lzX2dhdXRhcyddLCdsaWtvX3ByaWVzJz0+KGludCkkcFsna2lla2lzX2xpa28nXSwnc2F2X3ByaWVzJz0+JHBbJ3NhdmlrYWluYV9ldXInXSwnZ2FsX3ByaWVzJz0+JHBbJ2dlcmlhdXNpYV9pa2knXSk7CiAgICAkbj13cF9jcmVhdGVfbm9uY2UoJ3BzX2thdCcpOwogICAgJGI9YXJyYXkoJ2FjdGlvbic9Pidwc19rYXRfcGFydGlqYScsJ25vbmNlJz0+JG4sJ3BhcnQnPT4kcGFydCwnaWQnPT4kcGlkKTsKCiAgICAvLyAxLiBnYWxpb2ppbW8gZGF0YSDigJQgdGFpLCBrbyBSYWltaXMgbmVnYWxlam8gaXZlc3RpCiAgICAkb1snVDFfZGF0YV9nZXJhJ109JGt2aWVjaWFtKCRiK2FycmF5KCdsYXVrYXMnPT4nZ2VyaWF1c2lhX2lraScsJ3JlaWtzbWUnPT4nMjAyNy0wOS0zMCcpKTsKICAgICRvWydUMV9kYiddPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgZ2VyaWF1c2lhX2lraSBGUk9NIGAkbGVudGAgV0hFUkUgaWQ9JWQiLCRwYXJ0KSk7CiAgICAvLyAyLiBibG9nYSBkYXRhCiAgICAkb1snVDJfZGF0YV9ibG9nYSddPSRrdmllY2lhbSgkYithcnJheSgnbGF1a2FzJz0+J2dlcmlhdXNpYV9pa2knLCdyZWlrc21lJz0+JzIwMjctMDItMzEnKSk7CiAgICAvLyAzLiBsaWt1dGlzIHBlciBkaWRlbGlzCiAgICAkb1snVDNfcGVyX2RpZGVsaXMnXT0ka3ZpZWNpYW0oJGIrYXJyYXkoJ2xhdWthcyc9PidraWVraXNfbGlrbycsJ3JlaWtzbWUnPT4oc3RyaW5nKSgoaW50KSRwWydraWVraXNfZ2F1dGFzJ10rNSkpKTsKICAgIC8vIDQuIGxpa3V0aXMgZ2VyYXMgKC0xKQogICAgJG5hdWphcz1tYXgoMCwoaW50KSRwWydraWVraXNfbGlrbyddLTEpOwogICAgJG9bJ1Q0X2xpa3V0aXMnXT0ka3ZpZWNpYW0oJGIrYXJyYXkoJ2xhdWthcyc9PidraWVraXNfbGlrbycsJ3JlaWtzbWUnPT4oc3RyaW5nKSRuYXVqYXMpKTsKICAgICRvWydUNF9kYiddPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qga2lla2lzX2xpa28gRlJPTSBgJGxlbnRgIFdIRVJFIGlkPSVkIiwkcGFydCkpOwogICAgLy8gNS4gc2F2aWthaW5hIHN1IGthYmxlbGl1CiAgICAkb1snVDVfc2F2aWthaW5hJ109JGt2aWVjaWFtKCRiK2FycmF5KCdsYXVrYXMnPT4nc2F2aWthaW5hX2V1cicsJ3JlaWtzbWUnPT4nOSw5OScpKTsKICAgICRvWydUNV9kYiddPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgc2F2aWthaW5hX2V1ciBGUk9NIGAkbGVudGAgV0hFUkUgaWQ9JWQiLCRwYXJ0KSk7CiAgICAvLyA2LiBzdmV0aW1hcyBsYXVrYXMKICAgICRvWydUNl9zdmV0aW1hcyddPSRrdmllY2lhbSgkYithcnJheSgnbGF1a2FzJz0+J3RpZWtlamFzJywncmVpa3NtZSc9PidYJykpOwogICAgLy8gNy4gc3ZldGltYSBwcmVrZQogICAgJG9bJ1Q3X2tpdGFfcHJla2UnXT0ka3ZpZWNpYW0oYXJyYXkoJ2FjdGlvbic9Pidwc19rYXRfcGFydGlqYScsJ25vbmNlJz0+JG4sJ3BhcnQnPT4kcGFydCwnaWQnPT45OTk5OTksJ2xhdWthcyc9PidraWVraXNfbGlrbycsJ3JlaWtzbWUnPT4nMScpKTsKCiAgICAvLyBBVFNUQVRPTSB2aXNrYSBrYWlwIGJ1dm8KICAgICR3cGRiLT51cGRhdGUoJGxlbnQsYXJyYXkoCiAgICAgICdraWVraXNfbGlrbyc9PihpbnQpJHBbJ2tpZWtpc19saWtvJ10sCiAgICAgICdzYXZpa2FpbmFfZXVyJz0+JHBbJ3NhdmlrYWluYV9ldXInXSwKICAgICAgJ2dlcmlhdXNpYV9pa2knPT4kcFsnZ2VyaWF1c2lhX2lraSddLAogICAgKSxhcnJheSgnaWQnPT4kcGFydCksYXJyYXkoJyVkJywnJWYnLCclcycpLGFycmF5KCclZCcpKTsKICAgICRwbz0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGtpZWtpc19saWtvLHNhdmlrYWluYV9ldXIsZ2VyaWF1c2lhX2lraSBGUk9NIGAkbGVudGAgV0hFUkUgaWQ9JWQiLCRwYXJ0KSxBUlJBWV9BKTsKICAgICRvWydhdHN0YXR5dGEnXT0kcG87CiAgICAkb1snYXRzdGF0eXRhX3RlaXNpbmdhaSddPSgoaW50KSRwb1sna2lla2lzX2xpa28nXT09PShpbnQpJHBbJ2tpZWtpc19saWtvJ10gJiYgKGZsb2F0KSRwb1snc2F2aWthaW5hX2V1ciddPT09KGZsb2F0KSRwWydzYXZpa2FpbmFfZXVyJ10pOwogICAgLy8genVybmFsbyBpcmFzYWkKICAgICRvWyd6dXJuYWxlJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgbGFpa2FzLGxhdWthcyxzZW5hLG5hdWphLHBhc3RhYmEgRlJPTSB7JHdwZGItPnByZWZpeH1wc19pdnlraWFpIFdIRVJFIHByb2R1Y3RfaWQ9JWQgT1JERVIgQlkgaWQgREVTQyBMSU1JVCA1IiwkcGlkKSxBUlJBWV9BKTsKICAgIHJlbW92ZV9maWx0ZXIoJ3dwX2RpZV9hamF4X2hhbmRsZXInLCRoLDk5KTsKICAgIHJlbW92ZV9maWx0ZXIoJ3dwX2RpZV9oYW5kbGVyJywkaCw5OSk7CiAgICAkb1snc3ZldGFpbmUnXT13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSh3cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvJyksYXJyYXkoJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-094857';
const GKEY='ps_blf';
const PHASES=["T"];
const OUT='analize/s1684_t.json';
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
