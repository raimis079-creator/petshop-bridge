process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODAgZyDigJQgcmVhZC1vbmx5OiBzaW11bGl1b3RpIGtyZXDFoWVsxK8gKGxlbmd2YSBBViBwcmVrxJcpIGlyIGdhdXRpIHByaXN0YXR5bW8gYsWrZHVzIOKAlCBhciBMUCBFeHByZXNzIHJvZG9tYXM7IGt1ciBkaW5nc3RhLiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjgwZyddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjgwIGcnKTsKICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgSUQgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwb3N0X3RpdGxlIExJS0UgJyVzdGlybm9zIGtvamElJyBMSU1JVCAxIik7ICRwaWQ9KGludCkoJGlkc1swXT8/MCk7CiAgaWYoISRwaWQpeyAkcGlkPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBwb3N0X2lkIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfc2t1JyBBTkQgbWV0YV92YWx1ZT0nNDgzNzAnIik7IH0KICAkcHI9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7ICRvWydwcmVrZSddPWFycmF5KCRwaWQsJHByPyRwci0+Z2V0X25hbWUoKTpudWxsLCRwcj8kcHItPmdldF93ZWlnaHQoKTpudWxsLCRwcj8kcHItPmdldF9zdG9ja19xdWFudGl0eSgpOm51bGwsJHByPyRwci0+Z2V0X21ldGEoJ19wc19zYWx0aW5pcycpOm51bGwpOwogIHdjX2xvYWRfY2FydCgpOyBXQygpLT5zZXNzaW9uLT5zZXRfY3VzdG9tZXJfc2Vzc2lvbl9jb29raWUodHJ1ZSk7IFdDKCktPmNhcnQtPmVtcHR5X2NhcnQoKTsKICAkY2s9V0MoKS0+Y2FydC0+YWRkX3RvX2NhcnQoJHBpZCwxKTsgJG9bJ2NhcnQnXT0kY2s/J29rJzonRkFJTCAnLndjX3ByaW50X25vdGljZXModHJ1ZSk7CiAgV0MoKS0+Y3VzdG9tZXItPnNldF9zaGlwcGluZ19jb3VudHJ5KCdMVCcpOyBXQygpLT5jdXN0b21lci0+c2V0X3NoaXBwaW5nX2NpdHkoJ1ZpbG5pdXMnKTsgV0MoKS0+Y3VzdG9tZXItPnNldF9zaGlwcGluZ19wb3N0Y29kZSgnMDExMDAnKTsgV0MoKS0+Y3VzdG9tZXItPnNldF9iaWxsaW5nX2NvdW50cnkoJ0xUJyk7CiAgJHBrPVdDKCktPmNhcnQtPmdldF9zaGlwcGluZ19wYWNrYWdlcygpOyAkcGs9V0MoKS0+c2hpcHBpbmcoKS0+Y2FsY3VsYXRlX3NoaXBwaW5nKCRwayk7CiAgZm9yZWFjaCgkcGsgYXMgJGk9PiRrKXsgZm9yZWFjaCgoYXJyYXkpKCRrWydyYXRlcyddPz9hcnJheSgpKSBhcyAkcmlkPT4kcil7ICRvWydyYXRlcyddW109JHJpZC4nICcuJHItPmdldF9sYWJlbCgpLicgJy4kci0+Z2V0X2Nvc3QoKTsgfSB9CiAgLy8gYmUgZmlsdHLFszogdGllc2lvZ2lhaSBpxaEgem9ub3MgbWV0b2TFswogICR6b25lPVdDX1NoaXBwaW5nX1pvbmVzOjpnZXRfem9uZV9tYXRjaGluZ19wYWNrYWdlKCRwa1swXSk7ICRvWyd6b25hJ109JHpvbmUtPmdldF96b25lX25hbWUoKTsKICBmb3JlYWNoKCR6b25lLT5nZXRfc2hpcHBpbmdfbWV0aG9kcyh0cnVlKSBhcyAkbSl7ICRyYXc9YXJyYXkoKTsgaWYobWV0aG9kX2V4aXN0cygkbSwnY2FsY3VsYXRlX3NoaXBwaW5nJykpeyAkbS0+cmF0ZXM9YXJyYXkoKTsgJG0tPmNhbGN1bGF0ZV9zaGlwcGluZygkcGtbMF0pOyBmb3JlYWNoKCRtLT5yYXRlcyBhcyAkcmlkPT4kcikgJHJhd1tdPSRyaWQuJyAnLiRyLT5nZXRfY29zdCgpOyB9ICRvWydtZXRvZGFpJ11bXT0kbS0+aWQuJzonLiRtLT5pbnN0YW5jZV9pZC4nICcuJG0tPnRpdGxlLicg4oaSICcuaW1wbG9kZSgnIHwgJywkcmF3KTsgfQogICRvWydrZyddPVdDKCktPmNhcnQtPmdldF9jYXJ0X2NvbnRlbnRzX3dlaWdodCgpOyAkb1sncmliYSddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9SaW5raW5pYWknKSYmZGVmaW5lZCgnUGV0c2hvcF9SaW5raW5pYWk6OlBBU1RPTUFUT19SSUJBJyk/UGV0c2hvcF9SaW5raW5pYWk6OlBBU1RPTUFUT19SSUJBOm51bGw7CiAgaWYoZnVuY3Rpb25fZXhpc3RzKCdwZXRzaG9wX2hpZGVfcGFyY2VsX2lmX2NvdXJpZXJfb25seScpKXsgJHJmPW5ldyBSZWZsZWN0aW9uRnVuY3Rpb24oJ3BldHNob3BfaGlkZV9wYXJjZWxfaWZfY291cmllcl9vbmx5Jyk7ICRvWydoaWRlX2ZuJ109YXJyYXkoJHJmLT5nZXRGaWxlTmFtZSgpLCRyZi0+Z2V0U3RhcnRMaW5lKCkpOyAkc3JjPWZpbGUoJHJmLT5nZXRGaWxlTmFtZSgpKTsgJG9bJ2hpZGVfc3JjJ109aW1wbG9kZSgnJyxhcnJheV9zbGljZSgkc3JjLCRyZi0+Z2V0U3RhcnRMaW5lKCktMSwkcmYtPmdldEVuZExpbmUoKS0kcmYtPmdldFN0YXJ0TGluZSgpKzEpKTsgfQogICRvWydmaWx0cmFpJ109YXJyYXkoKTsgZ2xvYmFsICR3cF9maWx0ZXI7IGlmKGlzc2V0KCR3cF9maWx0ZXJbJ3dvb2NvbW1lcmNlX3BhY2thZ2VfcmF0ZXMnXSkpeyBmb3JlYWNoKCR3cF9maWx0ZXJbJ3dvb2NvbW1lcmNlX3BhY2thZ2VfcmF0ZXMnXS0+Y2FsbGJhY2tzIGFzICRwcl89PiRjYnMpeyBmb3JlYWNoKCRjYnMgYXMgJGNiKXsgJGY9JGNiWydmdW5jdGlvbiddOyAkb1snZmlsdHJhaSddW109JHByXy4nICcuKGlzX2FycmF5KCRmKT8oaXNfb2JqZWN0KCRmWzBdKT9nZXRfY2xhc3MoJGZbMF0pOiRmWzBdKS4nOjonLiRmWzFdOihpc19zdHJpbmcoJGYpPyRmOidjbG9zdXJlJykpOyB9IH0gfQogIFdDKCktPmNhcnQtPmVtcHR5X2NhcnQoKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-072232';
const GKEY='ps_s1680g';
const PHASES=["GO", "CL"];
const OUT='analize/s1680_g.json';
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
