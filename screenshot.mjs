process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODczIHByZW4gcHJla2l1IGthbmRpZGF0YWkgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODczcCddKSkgcmV0dXJuOyAkcj1bJ3YnPT4ncHIxJ107IGdsb2JhbCAkd3BkYjsgJHB4PSR3cGRiLT5wcmVmaXg7CiAgdHJ5ewogICAgJHJbJ251byddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgTUlOKGRhdGVfY3JlYXRlZCkgRlJPTSB7JHB4fXdjX29yZGVyX3N0YXRzIFdIRVJFIHN0YXR1cyBJTignd2MtY29tcGxldGVkJywnd2MtcHJvY2Vzc2luZycpIik7CiAgICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0LnByb2R1Y3RfaWQgcGlkLCBTVU0odC5xKSBxdHksIENPVU5UKCopIGtsaWVudHUsIFNVTSh0Lm8+PTIpIHBha2FydG9qbywgU1VNKHQubykgdXpzIEZST00gKFNFTEVDVCBsLnByb2R1Y3RfaWQsIHMuY3VzdG9tZXJfaWQsIENPVU5UKERJU1RJTkNUIGwub3JkZXJfaWQpIG8sIFNVTShsLnByb2R1Y3RfcXR5KSBxIEZST00geyRweH13Y19vcmRlcl9wcm9kdWN0X2xvb2t1cCBsIEpPSU4geyRweH13Y19vcmRlcl9zdGF0cyBzIE9OIHMub3JkZXJfaWQ9bC5vcmRlcl9pZCBXSEVSRSBzLnN0YXR1cyBJTignd2MtY29tcGxldGVkJywnd2MtcHJvY2Vzc2luZycpIEFORCBzLmN1c3RvbWVyX2lkPjAgR1JPVVAgQlkgbC5wcm9kdWN0X2lkLCBzLmN1c3RvbWVyX2lkKSB0IEdST1VQIEJZIHQucHJvZHVjdF9pZCBIQVZJTkcga2xpZW50dT49NCBPUkRFUiBCWSBwYWthcnRvam8gREVTQywga2xpZW50dSBERVNDIExJTUlUIDkwIixBUlJBWV9BKTsKICAgIGZvcmVhY2goJHJvd3MgYXMgJHgpeyAkcGlkPShpbnQpJHhbJ3BpZCddOyAkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsgaWYoISRwKSBjb250aW51ZTsKICAgICAgJGthaW5hPShmbG9hdCkkcC0+Z2V0X3ByaWNlKCk7ICRjb3N0PTA7IGZvcmVhY2goWydfdmZfY29zdCcsJ196Yl9jb3N0JywnX2Nvc3RfcHJpY2UnXSBhcyAkayl7ICR2PShmbG9hdClnZXRfcG9zdF9tZXRhKCRwaWQsJGssdHJ1ZSk7IGlmKCR2PjApeyRjb3N0PSR2O2JyZWFrO30gfQogICAgICAkc3JjPSR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgc291cmNlIEZST00geyRweH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQ9JWQgQU5EIGlzX2FjdGl2ZT0xIiwkcGlkKSk7CiAgICAgICRjYXRzPXdwX2dldF9wb3N0X3Rlcm1zKCRwaWQsJ3Byb2R1Y3RfY2F0JyxbJ2ZpZWxkcyc9PidzbHVncyddKTsKICAgICAgJHBlbG5hcz0kY29zdD4wPyByb3VuZCgka2FpbmEvMS4yMS0kY29zdC0oJGthaW5hPj0yNT8yLjE1OjApLSRrYWluYSowLjAxMiwyKTpudWxsOwogICAgICAkclsncCddW109WyRwaWQsbWJfc3Vic3RyKCRwLT5nZXRfbmFtZSgpLDAsNzApLCRwLT5nZXRfc3RhdHVzKCksJGthaW5hLCRjb3N0LCRwZWxuYXMsaW1wbG9kZSgnKycsJHNyYyksZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfb3duX3N0b2NrX3F0eScsdHJ1ZSksKGludClnZXRfcG9zdF9tZXRhKCRwaWQsJ19zdG9jaycsdHJ1ZSksKGludCkkeFsncXR5J10sKGludCkkeFsna2xpZW50dSddLChpbnQpJHhbJ3Bha2FydG9qbyddLGltcGxvZGUoJywnLGFycmF5X3NsaWNlKChhcnJheSkkY2F0cywwLDIpKSxnZXRfcG9zdF9tZXRhKCRwaWQsJ19kcF9iYXNlX3Byb2R1Y3RfaWQnLHRydWUpPydEUCc6JycsJHAtPmdldF90eXBlKCldOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyKTsgZXhpdDsKfSwxKTsK';
const VER='dep-124042';
const GKEY='ps_s1873p';
const PHASES=["1"];
const OUT='analize/s1873_pr.json';
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
