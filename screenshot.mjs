process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjYxIGUyZSArIHMxNjg5IGtvZGFzICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPWlzc2V0KCRfR0VUWydwc19zMTY2MWUnXSk/JF9HRVRbJ3BzX3MxNjYxZSddOicnOyBpZigkZiE9PSdUJyYmJGYhPT0nQ0wnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTY2MUUnLCdmYXplJz0+JGYpOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsKICAgIGlmKCRmPT09J1QnKXsKICAgICAgZm9yZWFjaChhcnJheSg1MzA0LDUzMDUsNTMwNykgYXMgJHNpZCkgJG9bJ3MnLiRzaWRdPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgY29kZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGlkPSVkIiwkc2lkKSk7CiAgICAgIC8vIGUyZTogdGVzdGluZSBwcmVrZSArIHBlbmRpbmcgKyByZWR1Y2UgKyBjYW5jZWwKICAgICAgJHBpZD13cF9pbnNlcnRfcG9zdChhcnJheSgncG9zdF90aXRsZSc9PidURVNUIFMxNjYxIGxpa3V0aXMnLCdwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnKSk7CiAgICAgIHdwX3NldF9vYmplY3RfdGVybXMoJHBpZCwnc2ltcGxlJywncHJvZHVjdF90eXBlJyk7CiAgICAgIHVwZGF0ZV9wb3N0X21ldGEoJHBpZCwnX21hbmFnZV9zdG9jaycsJ3llcycpOyB1cGRhdGVfcG9zdF9tZXRhKCRwaWQsJ19zdG9jaycsNTApOwogICAgICB1cGRhdGVfcG9zdF9tZXRhKCRwaWQsJ19zdG9ja19zdGF0dXMnLCdpbnN0b2NrJyk7IHVwZGF0ZV9wb3N0X21ldGEoJHBpZCwnX3ByaWNlJywnMScpOyB1cGRhdGVfcG9zdF9tZXRhKCRwaWQsJ19yZWd1bGFyX3ByaWNlJywnMScpOwogICAgICAkb3JkPXdjX2NyZWF0ZV9vcmRlcigpOyAkb3JkLT5hZGRfcHJvZHVjdCh3Y19nZXRfcHJvZHVjdCgkcGlkKSwzKTsgJG9yZC0+c2V0X3N0YXR1cygncGVuZGluZycpOyAkb3JkLT5jYWxjdWxhdGVfdG90YWxzKCk7ICRvcmQtPnNhdmUoKTsKICAgICAgd2NfbWF5YmVfcmVkdWNlX3N0b2NrX2xldmVscygkb3JkLT5nZXRfaWQoKSk7CiAgICAgICRvcmQ9d2NfZ2V0X29yZGVyKCRvcmQtPmdldF9pZCgpKTsKICAgICAgJG9bJ3BvX3JlZHVjZSddPWFycmF5KCdmbGFnJz0+JG9yZC0+Z2V0X21ldGEoJ19vcmRlcl9zdG9ja19yZWR1Y2VkJyksJ3N0b2NrJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfc3RvY2snLHRydWUpKTsKICAgICAgJG9yZC0+dXBkYXRlX3N0YXR1cygnY2FuY2VsbGVkJywnVEVTVCBTMTY2MSByYW5raW5pcyBhdHNhdWtpbWFzJyk7CiAgICAgICRvcmQ9d2NfZ2V0X29yZGVyKCRvcmQtPmdldF9pZCgpKTsKICAgICAgJG9bJ3BvX2NhbmNlbCddPWFycmF5KCdmbGFnJz0+JG9yZC0+Z2V0X21ldGEoJ19vcmRlcl9zdG9ja19yZWR1Y2VkJyksJ3N0b2NrJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfc3RvY2snLHRydWUpKTsKICAgICAgJG9bJ3Rlc3Rfb2lkJ109JG9yZC0+Z2V0X2lkKCk7ICRvWyd0ZXN0X3BpZCddPSRwaWQ7CiAgICAgICRvWydwYXN0YWJvcyddPSR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgTEVGVChjb21tZW50X2NvbnRlbnQsODApIEZST00geyR3cGRiLT5jb21tZW50c30gV0hFUkUgY29tbWVudF9wb3N0X0lEPSVkIEFORCBjb21tZW50X3R5cGU9J29yZGVyX25vdGUnIiwkb3JkLT5nZXRfaWQoKSkpOwogICAgfSBlbHNlIHsKICAgICAgJG9pZD0oaW50KWdldF9vcHRpb24oJ3BzX3MxNjYxX3Rlc3Rfb2lkJywwKTsKICAgICAgLy8gQ0wgc3UgaGFyZGtvZGludGFpcyBpZCBwZXIgb3B0aW9uIG5laXNlam8g4oCUIHRyaW5hbSBwYWdhbCBwYXZhZGluaW1hCiAgICAgIGZvcmVhY2god2NfZ2V0X29yZGVycyhhcnJheSgnbGltaXQnPT41LCdzZWFyY2gnPT4nVEVTVCBTMTY2MScpKSBhcyAkb2Qpe30KICAgICAgJHA9Z2V0X3BhZ2VfYnlfdGl0bGUoJ1RFU1QgUzE2NjEgbGlrdXRpcycsT0JKRUNULCdwcm9kdWN0Jyk7CiAgICAgIGlmKCRwKXsgJG9yZHM9JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBESVNUSU5DVCBvaS5vcmRlcl9pZCBGUk9NIHskd3BkYi0+cHJlZml4fXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1zIG9pIEpPSU4geyR3cGRiLT5wcmVmaXh9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgbSBPTiBtLm9yZGVyX2l0ZW1faWQ9b2kub3JkZXJfaXRlbV9pZCBBTkQgbS5tZXRhX2tleT0nX3Byb2R1Y3RfaWQnIEFORCBtLm1ldGFfdmFsdWU9JWQiLCRwLT5JRCkpOwogICAgICAgIGZvcmVhY2goJG9yZHMgYXMgJHgpeyAkb2Q9d2NfZ2V0X29yZGVyKCR4KTsgaWYoJG9kKXsgJG9kLT5kZWxldGUodHJ1ZSk7ICRvWydpc3RyaW50YV9vcmQnXVtdPSR4OyB9IH0KICAgICAgICB3cF9kZWxldGVfcG9zdCgkcC0+SUQsdHJ1ZSk7ICRvWydpc3RyaW50YV9waWQnXT0kcC0+SUQ7CiAgICAgIH0KICAgIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-112144';
const GKEY='ps_s1661e';
const PHASES=["T"];
const OUT='analize/s1661_t.json';
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

