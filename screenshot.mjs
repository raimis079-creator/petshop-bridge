process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODIwYyBNb25nZSBrb25zZXJ2YWk6IEFWIHZzIFpCIMWhZcWhxJdsaWFpIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgyMGMnXSkpIHJldHVybjsgJHI9Wyd2Jz0+J1MxODIwYyddOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7CiAgdHJ5ewogICAgJHNoPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBvc3RfaWQgemIsIG1ldGFfdmFsdWUgYXYgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19wc19zaGFkb3dfb2YnIixBUlJBWV9BKTsgJHJbJ3NoYWRvd19uJ109Y291bnQoJHNoKTsKICAgICRzaG1hcD1bXTsgZm9yZWFjaCgkc2ggYXMgJHMpICRzaG1hcFsoaW50KSRzWydhdiddXVtdPShpbnQpJHNbJ3piJ107CiAgICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgSUQgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXMgSU4gKCdwdWJsaXNoJywnZHJhZnQnLCdwcml2YXRlJykgQU5EIHBvc3RfdGl0bGUgTElLRSAnJU1vbmdlJScgQU5EIChwb3N0X3RpdGxlIExJS0UgJyU0MDAlJyBPUiBwb3N0X3RpdGxlIExJS0UgJyVrb25zZXJ2JScgT1IgcG9zdF90aXRsZSBMSUtFICclV2V0JScgT1IgcG9zdF90aXRsZSBMSUtFICclMTUwJScpIik7CiAgICAkcm93cz1bXTsKICAgIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkaWQ9KGludCkkaWQ7ICRwPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcCkgY29udGludWU7CiAgICAgICRzYW5kPWdldF9wb3N0X21ldGEoJGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpOyAkb3duPWdldF9wb3N0X21ldGEoJGlkLCdfb3duX3N0b2NrX3F0eScsdHJ1ZSk7CiAgICAgICRzcmM9Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FWX1NvdXJjZScpP1BldHNob3BfQVZfU291cmNlOjpyZXNvbHZlKCRpZCk6bnVsbDsKICAgICAgJGVhbj1nZXRfcG9zdF9tZXRhKCRpZCwnX2dsb2JhbF91bmlxdWVfaWQnLHRydWUpPzpnZXRfcG9zdF9tZXRhKCRpZCwnX3piX2VhbicsdHJ1ZSk7CiAgICAgICRyb3dzW109WydpZCc9PiRpZCwndCc9Pm1iX3N1YnN0cigkcC0+Z2V0X25hbWUoKSwwLDcwKSwnc3QnPT4kcC0+Z2V0X3N0YXR1cygpLCd2aXMnPT4kcC0+Z2V0X2NhdGFsb2dfdmlzaWJpbGl0eSgpLCdzYW5kJz0+JHNhbmQsJ293bic9PiRvd24sJ3N0b2NrJz0+JHAtPmdldF9zdG9ja19xdWFudGl0eSgpLCdhdic9PiRzcmNbJ2F2X3F0eSddPz9udWxsLCdwcmljZSc9PiRwLT5nZXRfcmVndWxhcl9wcmljZSgnZWRpdCcpLCdjb3N0Jz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19jb3N0X3ByaWNlJyx0cnVlKSwnemJjb3N0Jz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ196Yl9jb3N0Jyx0cnVlKSwnZWFuJz0+JGVhbiwnc2t1Jz0+JHAtPmdldF9za3UoKSwnc2hhZG93X29mJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19zaGFkb3dfb2YnLHRydWUpLCdzaGFkb3dzJz0+JHNobWFwWyRpZF0/P1tdLAogICAgICAgICdwYXJkMzY1Jz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19zYWxlc18zNjVkJyx0cnVlKSwnc3Jjcyc9PiR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHNvdXJjZSxzdG9ja19xdHksY29zdF9uZXQgRlJPTSB7JFB9cHNfc291cmNlcyBXSEVSRSBwcm9kdWN0X2lkPSVkIiwkaWQpLEFSUkFZX0EpLAogICAgICAgICdwYXJ0Jz0+JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBTVU0oa2lla2lzX2xpa28pIEZST00geyRQfXBzX3BhcnRpam9zIFdIRVJFIHByb2R1Y3RfaWQ9JWQiLCRpZCkpLAogICAgICAgICdkcCc9PiR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgcC5wb3N0X2lkIEZST00geyRQfXBvc3RtZXRhIHAgSk9JTiB7JFB9cG9zdHMgeCBPTiB4LklEPXAucG9zdF9pZCBBTkQgeC5wb3N0X3N0YXR1czw+J3RyYXNoJyBXSEVSRSBwLm1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJyBBTkQgcC5tZXRhX3ZhbHVlPSVkIiwkaWQpKV07IH0KICAgICRyWydyb3dzJ109JHJvd3M7CiAgICAvLyBpc3RvcmluaWFpICsgbmF1amkgcGFyZGF2aW1haSAxMiBtxJduLiBBViBNb25nZSBwcmVracWzCiAgICAkaW49aW1wbG9kZSgnLCcsYXJyYXlfbWFwKCdpbnR2YWwnLCRpZHMpKT86JzAnOwogICAgJHJbJ2lzdCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHByZWtlX2lkLCBTVU0oa2lla2lzKSBxIEZST00geyRQfXBzX2lzdF9mYWt0X2VpbHV0ZXMgV0hFUkUgcHJla2VfaWQgSU4gKCRpbikgQU5EIGRpZW5hPj1EQVRFX1NVQihDVVJEQVRFKCksSU5URVJWQUwgMzY1IERBWSkgR1JPVVAgQlkgcHJla2VfaWQiLEFSUkFZX0EpOwogICAgJHJbJ2Zha3QnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwcmVrZV9pZCwgU1VNKGtpZWtpcykgcSwgQ09VTlQoRElTVElOQ1QgdXpzYWt5bWFzX2lkKSB1IEZST00geyRQfXBzX2Zha3RfZWlsdXRlcyBXSEVSRSBwcmVrZV9pZCBJTiAoJGluKSBBTkQgKHRlc3RpbmlzPTAgT1IgdGVzdGluaXMgSVMgTlVMTCkgR1JPVVAgQlkgcHJla2VfaWQiLEFSUkFZX0EpOwogICAgJHJbJ3NoYWRvd19ydWxlJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbWV0YV92YWx1ZSwgQ09VTlQoKikgbiBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3piX2RyYWZ0X3JlYXNvbicgR1JPVVAgQlkgbWV0YV92YWx1ZSIsQVJSQVlfQSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-144700';
const GKEY='ps_s1820c';
const PHASES=["1"];
const OUT='analize/s1820_c.json';
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
