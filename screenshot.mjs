process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE0YiBhbmtldG9zIGl2eWtpdSBzYWx0aW5pcyByZWFkLW9ubHkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzE0YiddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTcxNGInXTsgQHNldF90aW1lX2xpbWl0KDE3MCk7IGdsb2JhbCAkd3BkYjsgJHI9Wyd2Jz0+J1MxNzE0YicsJ2ZhemUnPT4kZl07ICRQPSR3cGRiLT5wcmVmaXg7ICR0PSRQLidwc19sYXVrYWlfaXZ5a2lhaSc7CiAgdHJ5ewogIGlmKCRmPT09JzEnKXsKICAgICRyWydtdV9zcmMnXT1maWxlX2dldF9jb250ZW50cyhXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWFua2V0YS1pdnlraWFpLnBocCcpOwogICAgLy8gc3RhcnRlZCAtPiBhYmFuZG9uZWQgbGFpa28gc2tpcnR1bWFpIHBhZ2FsIHNlc2lqYQogICAgJHJbJ3Bvcm9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgcy5sYWlrYXMgc19sYWlrYXMsIGEubGFpa2FzIGFfbGFpa2FzLCBUSU1FU1RBTVBESUZGKFNFQ09ORCxzLmxhaWthcyxhLmxhaWthcykgc2VrLCBzLnNlc2lqYSwgcy52ZXJ0ZSBzX3ZlcnRlLCBhLnZlcnRlIGFfdmVydGUsIHMuaXJlbmdpbnlzLCBzLnVzZXJfaWQgRlJPTSAkdCBzIEpPSU4gJHQgYSBPTiBhLnNlc2lqYT1zLnNlc2lqYSBBTkQgYS50aXBhcz0nYW5rZXRhX2FiYW5kb25lZCcgQU5EIGEubGFpa2FzPj1zLmxhaWthcyBBTkQgYS5sYWlrYXM8REFURV9BREQocy5sYWlrYXMsSU5URVJWQUwgMSBEQVkpIFdIRVJFIHMudGlwYXM9J2Fua2V0YV9zdGFydGVkJyBBTkQgcy5sYWlrYXM+PScyMDI2LTA5LTE4JyBPUkRFUiBCWSBzLmxhaWthcyBERVNDIExJTUlUIDI1IixBUlJBWV9BKTsKICAgICRyWydzZWtfcGFzaXNraXJzdHltYXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBDQVNFIFdIRU4gZDw1IFRIRU4gJzw1cycgV0hFTiBkPDMwIFRIRU4gJzUtMzBzJyBXSEVOIGQ8MTIwIFRIRU4gJzMwLTEyMHMnIEVMU0UgJz4xMjBzJyBFTkQgYiwgQ09VTlQoKikgbiBGUk9NIChTRUxFQ1QgTUlOKFRJTUVTVEFNUERJRkYoU0VDT05ELHMubGFpa2FzLGEubGFpa2FzKSkgZCBGUk9NICR0IHMgSk9JTiAkdCBhIE9OIGEuc2VzaWphPXMuc2VzaWphIEFORCBhLnRpcGFzPSdhbmtldGFfYWJhbmRvbmVkJyBBTkQgYS5sYWlrYXM+PXMubGFpa2FzIFdIRVJFIHMudGlwYXM9J2Fua2V0YV9zdGFydGVkJyBBTkQgcy5zZXNpamE8PicnIEdST1VQIEJZIHMuaWQpIHggR1JPVVAgQlkgYiIsQVJSQVlfQSk7CiAgICAkclsnc3RhcnRlZF9iZV9zZXNpam9zJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQgV0hFUkUgdGlwYXM9J2Fua2V0YV9zdGFydGVkJyBBTkQgc2VzaWphPScnIik7CiAgICAkclsndmVydGVfcHZ6J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdGlwYXMsIHZlcnRlLCBDT1VOVCgqKSBuIEZST00gJHQgV0hFUkUgdGlwYXMgSU4gKCdhbmtldGFfc3RhcnRlZCcsJ2Fua2V0YV9hYmFuZG9uZWQnLCdzdGVwX3N0YXJ0ZWQnLCdzdGVwX2NvbXBsZXRlZCcsJ2Fua2V0YV9jb21wbGV0ZWQnKSBHUk9VUCBCWSB0aXBhcywgdmVydGUgT1JERVIgQlkgdGlwYXMsIG4gREVTQyBMSU1JVCA0MCIsQVJSQVlfQSk7CiAgICAkclsndW5pa19zZXNpam9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdGlwYXMsIENPVU5UKERJU1RJTkNUIHNlc2lqYSkgc2VzLCBDT1VOVCgqKSBuIEZST00gJHQgV0hFUkUgdGlwYXMgSU4gKCdhbmtldGFfc3RhcnRlZCcsJ2Fua2V0YV9hYmFuZG9uZWQnLCdhbmtldGFfY29tcGxldGVkJywnc3RlcF9zdGFydGVkJykgQU5EIGxhaWthcz49JzIwMjYtMDktMDknIEdST1VQIEJZIHRpcGFzIixBUlJBWV9BKTsKICAgICRyWydwc19wZXRzX3BvX1QwJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBzX3BldHMgV0hFUkUgY3JlYXRlZF9hdD49JzIwMjYtMDktMDknIik7CiAgICAkclsnZHJhZnRzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgREFURShjcmVhdGVkX2F0KSBkLCBDT1VOVCgqKSBuIEZST00geyRQfXBzX3BldF9wcm9maWxlX2RyYWZ0cyBXSEVSRSBjcmVhdGVkX2F0Pj0nMjAyNi0wOS0wOScgR1JPVVAgQlkgREFURShjcmVhdGVkX2F0KSBPUkRFUiBCWSBkIERFU0MgTElNSVQgMjAiLEFSUkFZX0EpOwogIH0KICBpZigkZj09PScyJyl7CiAgICBmb3JlYWNoKGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9hc3NldHMvKi5qcycpIGFzICRnKXsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGcpOyBpZihzdHJwb3MoJHMsJ2Fua2V0YV9zdGFydGVkJykhPT1mYWxzZXx8c3RycG9zKCRzLCdzdGFydGVkJykhPT1mYWxzZSl7IHByZWdfbWF0Y2hfYWxsKCcjLnswLDQwMH0oYW5rZXRhX3N0YXJ0ZWR8YW5rZXRhX2FiYW5kb25lZHxzdGVwX3N0YXJ0ZWQpLnswLDQwMH0jcycsJHMsJG0pOyAkclsnanMnXVtiYXNlbmFtZSgkZyldPWFycmF5X3NsaWNlKCRtWzBdLDAsNik7IH0gfQogICAgZm9yZWFjaChnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvKi5waHAnKSBhcyAkZyl7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRnKTsgaWYoc3RycG9zKCRzLCdhbmtldGFfc3RhcnRlZCcpIT09ZmFsc2V8fHN0cnBvcygkcywnYW5rZXRhX2FiYW5kb25lZCcpIT09ZmFsc2UpeyBwcmVnX21hdGNoX2FsbCgnIy57MCw0MDB9KGFua2V0YV9zdGFydGVkfGFua2V0YV9hYmFuZG9uZWQpLnswLDQwMH0jcycsJHMsJG0pOyAkclsncGhwJ11bYmFzZW5hbWUoJGcpXT1hcnJheV9zbGljZSgkbVswXSwwLDYpOyB9IH0KICAgICRyWydtb2RhbF9zcmMnXT1maWxlX2dldF9jb250ZW50cyhXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2luY2x1ZGVzL2NsYXNzLXdlbGNvbWUtbW9kYWwucGhwJyk7CiAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0sIDEpOwo=';
const VER='dep-191057';
const GKEY='ps_s1714b';
const PHASES=["2"];
const OUT='analize/s1714_b2.json';
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
