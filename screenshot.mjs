process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzkwZSByeXRhczogR0E0IHZzIFdvbyBwbyBHVE0gcGF1esSXcywga2FtcGFuaWrFsyBJROKGknBhdmFkaW5pbWFpLCBhdMWhYXVrdGkvbmVhcG1va8SXdGkgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzkwZSddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTUwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3OTBlJ107CiAgdHJ5ewogICAgJHJbJ3Jla2xfY29scyddPWFycmF5X21hcChmbigkYyk9PiRjWydGaWVsZCddLCR3cGRiLT5nZXRfcmVzdWx0cygiU0hPVyBDT0xVTU5TIEZST00geyRQfXBzX2Zha3RfcmVrbGFtYSIsQVJSQVlfQSkpOwogICAgaWYoaW5fYXJyYXkoJ2thbXBhbmlqYV9pZCcsJHJbJ3Jla2xfY29scyddKSkgJHJbJ2thbXAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBESVNUSU5DVCBrYW1wYW5pamFfaWQgaWQsIGthbXBhbmlqYSBrIEZST00geyRQfXBzX2Zha3RfcmVrbGFtYSBXSEVSRSBkaWVuYT49JzIwMjYtMTAtMDcnIixBUlJBWV9BKTsKICAgICRyYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0dBNF9TZXJ2ZXJpcycpOyAkbT0kcmMtPmdldE1ldGhvZCgnZ2E0X2RpZW5vcycpOyAkbS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsgJGc9JG0tPmludm9rZShudWxsLCcyMDI2LTEwLTE2JywnMjAyNi0xMC0xOScpOyAkclsnZ2E0J109aXNfd3BfZXJyb3IoJGcpPyRnLT5nZXRfZXJyb3JfbWVzc2FnZSgpOiRnOwogICAgJHJbJ3dvbyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEUoQ09OVkVSVF9UWihkYXRlX3BhaWRfZ210LCcrMDA6MDAnLCcrMDM6MDAnKSkgZCwgQ09VTlQoKikgbiBGUk9NIHskUH13Y19vcmRlcnMgV0hFUkUgZGF0ZV9wYWlkX2dtdD49JzIwMjYtMTAtMTUgMjE6MDAnIEFORCBzdGF0dXMgSU4gKCd3Yy1wcm9jZXNzaW5nJywnd2MtY29tcGxldGVkJywnd2Mtb24taG9sZCcpIEFORCBkYXRlX3BhaWRfZ210IElTIE5PVCBOVUxMIEdST1VQIEJZIGQiLEFSUkFZX0EpOwogICAgJHJbJ21wJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgTEVGVChtZXRhX3ZhbHVlLDEwKSBkLCBDT1VOVCgqKSBuIEZST00geyRQfXdjX29yZGVyc19tZXRhIFdIRVJFIG1ldGFfa2V5PSdfcHNfZ2E0X21wX2F0JyBBTkQgbWV0YV92YWx1ZT49JzIwMjYtMTAtMTYnIEdST1VQIEJZIGQiLEFSUkFZX0EpOwogICAgJG89W107IGZvcmVhY2god2NfZ2V0X29yZGVycyhbJ2xpbWl0Jz0+NDAsJ3R5cGUnPT4nc2hvcF9vcmRlcicsJ3N0YXR1cyc9PlsnY2FuY2VsbGVkJywncGVuZGluZycsJ29uLWhvbGQnLCdmYWlsZWQnXSwnZGF0ZV9jcmVhdGVkJz0+Jz49Jy5zdHJ0b3RpbWUoJzIwMjYtMTAtMTggMjE6MDA6MDAgVVRDJyldKSBhcyAkeCl7ICRub3Rlcz13Y19nZXRfb3JkZXJfbm90ZXMoWydvcmRlcl9pZCc9PiR4LT5nZXRfaWQoKSwnbGltaXQnPT4zXSk7ICRvW109WyR4LT5nZXRfb3JkZXJfbnVtYmVyKCksJHgtPmdldF9kYXRlX2NyZWF0ZWQoKS0+ZGF0ZSgnbS1kIEg6aScpLCR4LT5nZXRfc3RhdHVzKCksJHgtPmdldF90b3RhbCgpLCR4LT5nZXRfcGF5bWVudF9tZXRob2QoKSxzdWJzdHIobWQ1KHN0cnRvbG93ZXIoJHgtPmdldF9iaWxsaW5nX2VtYWlsKCkpKSwwLDYpLGFycmF5X21hcChmbigkbik9Pm1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkbi0+Y29udGVudCksMCw3MCksJG5vdGVzKV07IH0KICAgICRyWyduZWFwbSddPSRvOyAkclsnbW5tX3BvX2ZpeCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGUudXpzYWt5bWFzX2lkIG9pZCwgZS5wcmVrZV9pZCwgZS5yaW5raW55c19pZCwgZS5zYXZpa2FpbmFfY3QsIGUuc2F2aWthaW5vc19zYWx0aW5pcyBGUk9NIHskUH1wc19mYWt0X2VpbHV0ZXMgZSBKT0lOIHskUH1wc19mYWt0X3V6c2FreW1haSB1IE9OIHUudXpzYWt5bWFzX2lkPWUudXpzYWt5bWFzX2lkIFdIRVJFIGUucmlua2luaW9fdGlwYXM9J21ubScgQU5EIHUuc3VrdXJ0YV9hdD49JzIwMjYtMTAtMTkgMTk6MzA6MDAnIixBUlJBWV9BKTsgJHJbJ3dwYWlfc2lhbmRpZW4nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpbXBvcnRfaWQgaSwgREFURV9GT1JNQVQoZGF0ZSwnJUg6JWknKSB0LCB0aW1lX3J1biBGUk9NIHskUH1wbXhpX2hpc3RvcnkgV0hFUkUgZGF0ZT49JzIwMjYtMTAtMjAnIEFORCB0aW1lX3J1biBJUyBOT1QgTlVMTCBPUkRFUiBCWSBkYXRlIixBUlJBWV9BKTsgJHJbJ3dwYWlfaW1wb3J0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsTEVGVChzY2hlZHVsZWQsNDApIHMgRlJPTSB7JFB9cG14aV9pbXBvcnRzIixBUlJBWV9BKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-180854';
const GKEY='ps_s1790e';
const PHASES=["1"];
const OUT='analize/s1790_e.json';
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
