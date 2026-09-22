process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzA0YiBpc3Rvcmlqb3Mgc2FsdGluaXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9KGlzc2V0KCRfR0VUWydwc19zMTcwNGInXSk/JF9HRVRbJ3BzX3MxNzA0YiddOicnKTsgaWYoJGYhPT0nMScmJiRmIT09JzInKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTcwNGInLCdmYXplJz0+JGYpOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJHBpZD0xOTM2NjsKICAgIGlmKCRmPT09JzEnKXsKICAgICAgJGM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJyk7CiAgICAgICRvWydkeWRpcyddPXN0cmxlbigkYyk7CiAgICAgIC8vIGlzdG9yaWpvcyBmdW5rY2lqb3MKICAgICAgcHJlZ19tYXRjaF9hbGwoJy9mdW5jdGlvblxzKyhbYS16MC05X10qaXN0b3JpalthLXowLTlfXSopXHMqXCgvaScsJGMsJG0pOyAkb1snZnVua2Npam9zJ109JG1bMV07CiAgICAgICRpPXN0cnBvcygkYywnVklTS0FTLCBLQVMgVllLTycpOyAkb1sncG96J109JGk7CiAgICAgIGlmKCRpIT09ZmFsc2UpeyAkb1snZ2FiYWxhcyddPXN1YnN0cigkYyxtYXgoMCwkaS05MDAwKSwxMjAwMCk7IH0KICAgIH0gZWxzZSB7CiAgICAgIC8vIHV6c2FreW1haSBzdSBzaWEgcHJla2UKICAgICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgb2kub3JkZXJfaWQsIG9pbS5tZXRhX3ZhbHVlIHF0eSwgb2kub3JkZXJfaXRlbV9pZCBGUk9NIHskcH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBvaQogICAgICAgIEpPSU4geyRwfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIGltIE9OIGltLm9yZGVyX2l0ZW1faWQ9b2kub3JkZXJfaXRlbV9pZCBBTkQgaW0ubWV0YV9rZXk9J19wcm9kdWN0X2lkJyBBTkQgaW0ubWV0YV92YWx1ZT0lZAogICAgICAgIExFRlQgSk9JTiB7JHB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgb2ltIE9OIG9pbS5vcmRlcl9pdGVtX2lkPW9pLm9yZGVyX2l0ZW1faWQgQU5EIG9pbS5tZXRhX2tleT0nX3F0eScKICAgICAgICBPUkRFUiBCWSBvaS5vcmRlcl9pZCBERVNDIExJTUlUIDMwIiwkcGlkKSxBUlJBWV9BKTsKICAgICAgJG9bJ3V6c2FreW1haSddPWFycmF5KCk7CiAgICAgIGZvcmVhY2goJHJvd3MgYXMgJHIpeyAkb3JkPXdjX2dldF9vcmRlcigkclsnb3JkZXJfaWQnXSk7CiAgICAgICAgJG9bJ3V6c2FreW1haSddW109YXJyYXkoJ2lkJz0+JHJbJ29yZGVyX2lkJ10sJ3F0eSc9PiRyWydxdHknXSwnc3RhdHVzJz0+JG9yZD8kb3JkLT5nZXRfc3RhdHVzKCk6Jz8nLCdkYXRhJz0+JG9yZD8kb3JkLT5nZXRfZGF0ZV9jcmVhdGVkKCktPmRhdGUoJ1ktbS1kIEg6aScpOic/JywKICAgICAgICAgICdfcmVkdWNlZF9zdG9jayc9PndjX2dldF9vcmRlcl9pdGVtX21ldGEoJHJbJ29yZGVyX2l0ZW1faWQnXSwnX3JlZHVjZWRfc3RvY2snLHRydWUpLAogICAgICAgICAgJ19wc19hdl9yZWR1Y2VkX3F0eSc9PndjX2dldF9vcmRlcl9pdGVtX21ldGEoJHJbJ29yZGVyX2l0ZW1faWQnXSwnX3BzX2F2X3JlZHVjZWRfcXR5Jyx0cnVlKSwKICAgICAgICAgICdfcHNfc291cmNlJz0+d2NfZ2V0X29yZGVyX2l0ZW1fbWV0YSgkclsnb3JkZXJfaXRlbV9pZCddLCdfcHNfc291cmNlJyx0cnVlKSwKICAgICAgICAgICducic9PiRvcmQ/JG9yZC0+Z2V0X21ldGEoJ19wc19ucicpOicnKTsKICAgICAgfQogICAgICAvLyB1enNha3ltdSBpdnlraWFpCiAgICAgICRvWydpdnlraWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskcH1wc191enNha3ltdV9pdnlraWFpIFdIRVJFIGxhaWthcyBCRVRXRUVOICcyMDI2LTA5LTE5IDIwOjAwOjAwJyBBTkQgJzIwMjYtMDktMTkgMjM6MDA6MDAnIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNDAiLEFSUkFZX0EpOwogICAgICAvLyBwYXJ0aWp1IG51cmFzeW1haSAoamVpIHlyYSB6dXJuYWxhcykKICAgICAgJG9bJ3BhcnRpanVfc3R1bHAnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRwfXBzX3BhcnRpam9zIik7CiAgICAgICRvWydwYXJ0aWp1X251cmFzeW1haV9sZW50ZWxlJ109JHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJ3skcH1wc19wYXJ0aWolJyIpOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-080047';
const GKEY='ps_s1704b';
const PHASES=["2"];
const OUT='analize/s1704_b.json';
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
