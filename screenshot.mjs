process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODM5cGggUHJhZ21hIGtvZGFzICsgIzE1MjIvIzE2MzggKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODM5cGgnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDIwMCk7IEBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCc3NjhNJyk7ICRmPShzdHJpbmcpJF9HRVRbJ3BzX3MxODM5cGgnXTsgJHI9Wyd2Jz0+J1MxODM5cGgnLCdmJz0+JGZdOwogIHRyeXsKICBpZigkZj09PScxJyl7ICRyWydwcmFnbWFfYjY0J109YmFzZTY0X2VuY29kZShmaWxlX2dldF9jb250ZW50cyhXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1wcmFnbWEvcGV0c2hvcC1wcmFnbWEucGhwJykpOyB9CiAgaWYoJGY9PT0nMicpeyAkbHM9ZXhwbG9kZSgiXG4iLGZpbGVfZ2V0X2NvbnRlbnRzKGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvZnVuY3Rpb25zLnBocCcpKTsgJHJbJ2ZuJ109aW1wbG9kZSgiXG4iLGFycmF5X3NsaWNlKCRscywyNzksMzAwKSk7IH0KICBpZigkZj09PSczJyl7IGdsb2JhbCAkd3BkYjsgZm9yZWFjaChbJ0FWUE4wMTE0MzAnLCdBVlBOMDExNTUwJ10gYXMgJGF2KXsgJGlkPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgb3JkZXJfaWQgRlJPTSB7JHdwZGItPnByZWZpeH13Y19vcmRlcnNfbWV0YSBXSEVSRSBtZXRhX2tleT0nX3BldHNob3BfYXZwbl9udW1iZXInIEFORCBtZXRhX3ZhbHVlPSVzIExJTUlUIDEiLCRhdikpOwogICAgICAkbz0kaWQ/d2NfZ2V0X29yZGVyKCRpZCk6bnVsbDsgaWYoISRvKXsgJHJbJGF2XT0nbmVyYXN0YSc7IGNvbnRpbnVlOyB9CiAgICAgICRuPXdjX2dldF9vcmRlcl9ub3RlcyhbJ29yZGVyX2lkJz0+JG8tPmdldF9pZCgpLCdvcmRlcic9PidBU0MnXSk7ICRyWyRhdl09WydpZCc9PiRvLT5nZXRfaWQoKSwnbnInPT4kby0+Z2V0X29yZGVyX251bWJlcigpLCdzdGF0dXMnPT4kby0+Z2V0X3N0YXR1cygpLCdwbSc9PiRvLT5nZXRfcGF5bWVudF9tZXRob2QoKSwndG90YWwnPT4kby0+Z2V0X3RvdGFsKCksJ3BhaWQnPT4kby0+Z2V0X2RhdGVfcGFpZCgpPyRvLT5nZXRfZGF0ZV9wYWlkKCktPmRhdGUoJ1ktbS1kIEg6aScpOm51bGwsJ21ldGEnPT5bJ3NmJz0+JG8tPmdldF9tZXRhKCdfcGV0c2hvcF9zZl9kYXRhJyksJ2lraSc9PiRvLT5nZXRfbWV0YSgnX3BzX2FwbW9rZXRpX2lraScpLCduZWFwJz0+JG8tPmdldF9tZXRhKCdfcHNfcHZtX3NmX25lYXBtb2tldGEnKV0sJ25vdGVzJz0+YXJyYXlfbWFwKGZuKCR4KT0+WyR4LT5kYXRlX2NyZWF0ZWQtPmRhdGUoJ20tZCBIOmknKSwkeC0+YWRkZWRfYnksbWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCR4LT5jb250ZW50KSwwLDE2MCldLCRuKV07IH0gfQogIGlmKCRmPT09JzQnKXsgZm9yZWFjaChbJzIwMjYtMDknLCcyMDI2LTEwJywnMjAyNi0xMSddIGFzICRtKXsgJGZyb209c3RydG90aW1lKCRtLictMDEgMDA6MDA6MDAnKTsgJHRvPXN0cnRvdGltZShkYXRlKCdZLW0tdCAyMzo1OTo1OScsJGZyb20pKTsKICAgICAgJG9zPXdjX2dldF9vcmRlcnMoWydzdGF0dXMnPT5bJ2NvbXBsZXRlZCddLCdkYXRlX2NyZWF0ZWQnPT4kZnJvbS4nLi4uJy4kdG8sJ2xpbWl0Jz0+LTEsJ3R5cGUnPT4nc2hvcF9vcmRlciddKTsgJFM9WyduJz0+MCwncHJhZ21hX2RhdGFfbmVfc2YnPT4wLCdzZl9raXRhc19tZW4nPT5bXSwncHZ6Jz0+W11dOwogICAgICBmb3JlYWNoKCRvcyBhcyAkbyl7IGlmKCRvLT5nZXRfbWV0YSgnX3BldHNob3BfaW52b2ljZV9kb2N1bWVudF90eXBlJykhPT0naW52b2ljZSd8fCEkby0+Z2V0X21ldGEoJ19wZXRzaG9wX2F2cG5fbnVtYmVyJykpIGNvbnRpbnVlOyAkU1snbiddKys7CiAgICAgICAgJHBkPSRvLT5nZXRfZGF0ZV9wYWlkKCk/JG8tPmdldF9kYXRlX3BhaWQoKS0+ZGF0ZSgnWS1tLWQnKTokby0+Z2V0X2RhdGVfY3JlYXRlZCgpLT5kYXRlKCdZLW0tZCcpOwogICAgICAgICRzZj0kby0+Z2V0X21ldGEoJ19wZXRzaG9wX3NmX2RhdGEnKTsgJGRvYz1wcmVnX21hdGNoKCcvXlxkezR9LVxkezJ9LVxkezJ9JC8nLChzdHJpbmcpJHNmKT8kc2Y6KCRvLT5nZXRfZGF0ZV9jb21wbGV0ZWQoKT93cF9kYXRlKCdZLW0tZCcsJG8tPmdldF9kYXRlX2NvbXBsZXRlZCgpLT5nZXRUaW1lc3RhbXAoKSk6bnVsbCk7CiAgICAgICAgaWYoJHBkIT09JGRvYyl7ICRTWydwcmFnbWFfZGF0YV9uZV9zZiddKys7IGlmKGNvdW50KCRTWydwdnonXSk8NikgJFNbJ3B2eiddW109WyRvLT5nZXRfb3JkZXJfbnVtYmVyKCksJG8tPmdldF9tZXRhKCdfcGV0c2hvcF9hdnBuX251bWJlcicpLCdwcmFnbWEnPT4kcGQsJ3NmJz0+JGRvY107IH0KICAgICAgICBpZigkZG9jICYmIHN1YnN0cigkZG9jLDAsNykhPT0kbSkgJFNbJ3NmX2tpdGFzX21lbiddW109WyRvLT5nZXRfb3JkZXJfbnVtYmVyKCksJG8tPmdldF9tZXRhKCdfcGV0c2hvcF9hdnBuX251bWJlcicpLCdzdWt1cnRhJz0+JG8tPmdldF9kYXRlX2NyZWF0ZWQoKS0+ZGF0ZSgnbS1kIEg6aScpLCdwcmFnbWEnPT4kcGQsJ3NmJz0+JGRvYywoZmxvYXQpJG8tPmdldF90b3RhbCgpXTsgfQogICAgICAkclskbV09JFM7IH0KICAgICRvPXdjX2dldF9vcmRlcnMoWydzdGF0dXMnPT5bJ2NvbXBsZXRlZCddLCdkYXRlX2NyZWF0ZWQnPT5zdHJ0b3RpbWUoJzIwMjYtMDgtMDEnKS4nLi4uJy5zdHJ0b3RpbWUoJzIwMjYtMDgtMzEgMjM6NTk6NTknKSwnbGltaXQnPT4tMSwndHlwZSc9PidzaG9wX29yZGVyJ10pOyAkclsncnVncF9uJ109Y291bnQoJG8pOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydFUlInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsgfSk7Cg==';
const VER='dep-101327';
const GKEY='ps_s1839ph';
const PHASES=["4"];
const OUT='analize/s1839_ph3.json';
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
