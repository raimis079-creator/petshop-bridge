process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MDcgcnVuMTMg4oCUIGt1ciBkaW5nbyBSYWltaW8gMiBuYXVqaSB1xb5zYWt5bWFpIChyZWNvbiwgbmlla28gbmVrZWnEjWlhKSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19kbG4nXSkpIHJldHVybjsgJG89YXJyYXkoJ3YnPT4ncnVuMTMnKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogIHRyeXsKICAgICRvWyd0ZW1wX2lzdHJpbnRhJ109JHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgICAkcmY9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRGFyYmFsYXVraXMnLCdmYWt0YWknKTsgJHJmLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogICAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00geyRwfXdjX29yZGVycyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDQiKTsKICAgIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkb289d2NfZ2V0X29yZGVyKCRpZCk7ICR4PSRyZi0+aW52b2tlKG51bGwsJG9vLGFycmF5KCkpOyAkaXQ9YXJyYXkoKTsgZm9yZWFjaCgkb28tPmdldF9pdGVtcygpIGFzICRpaWQ9PiRpKSAkaXRbXT0kaS0+Z2V0X3F1YW50aXR5KCkuJ8OXICcubWJfc3Vic3RyKCRpLT5nZXRfbmFtZSgpLDAsMzApLicgc3JjPScuJGktPmdldF9tZXRhKCdfcHNfc291cmNlJykuJyBrZWw9Jy4kaS0+Z2V0X21ldGEoJ19wc19rZWxpYXMnKTsgJHRrPWFycmF5KCk7IGZvcmVhY2goJHhbJ3Rha2VsaXMnXSBhcyAkdCkgJHRrW109KCdkb25lJz09PSR0WzJdPyfinJMnOignbm93Jz09PSR0WzJdPyfilrYnOifCtycpKS4kdFsxXTsKICAgICAgJG9bJ3V6cyddWyRpZF09YXJyYXkoJ3N0Jz0+JG9vLT5nZXRfc3RhdHVzKCksJ3BhaWQnPT4kb28tPmlzX3BhaWQoKSwnc3VrdXJ0YSc9PiRvby0+Z2V0X2RhdGVfY3JlYXRlZCgpLT5kYXRlKCdIOmk6cycpLCdwYWlkX2F0Jz0+JG9vLT5nZXRfZGF0ZV9wYWlkKCk/JG9vLT5nZXRfZGF0ZV9wYWlkKCktPmRhdGUoJ0g6aTpzJyk6bnVsbCwna2xpZW50YXMnPT4kb28tPmdldF9iaWxsaW5nX2ZpcnN0X25hbWUoKS4nICcuJG9vLT5nZXRfYmlsbGluZ19sYXN0X25hbWUoKSwnbW9rJz0+JG9vLT5nZXRfcGF5bWVudF9tZXRob2QoKSwncHJpc3RhdHltYXMnPT4kb28tPmdldF9zaGlwcGluZ19tZXRob2QoKSwnY3JlYXRlZF92aWEnPT4kb28tPmdldF9jcmVhdGVkX3ZpYSgpLCdpdGVtcyc9PiRpdCwncnVzJz0+JHhbJ3J1cyddLCduYXVqYXMnPT4keFsnbmF1amFzJ10sJ2tsJz0+JHhbJ2tsJ10sJ2VpbGVzJz0+aW1wbG9kZSgnLCcsJHhbJ2VpbGVzJ10pLCdidG4nPT4keFsnYnRuJ11bMF0sJ3RrJz0+aW1wbG9kZSgnIOKAuiAnLCR0ayksJ3p1cm5hbGFzJz0+YXJyYXlfbWFwKGZ1bmN0aW9uKCRyKXtyZXR1cm4gUGV0c2hvcF9VenNha3ltdV9JdnlraWFpOjp6bW9ndWkoJHIpO30sUGV0c2hvcF9VenNha3ltdV9JdnlraWFpOjp1enNha3ltbygkaWQsNSkpKTsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsgfSk7Cg==';
const VER='dep-101531';
const GKEY='ps_dln';
const PHASES=["T"];
const OUT='analize/e2_run13.json';
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
