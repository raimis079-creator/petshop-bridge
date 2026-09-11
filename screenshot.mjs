process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzUgcnVuIGQg4oCUIDEgcGF0YWlzYTogcHVibGlzaCBwcmVrxJdzIHN1IF9zdG9ja19zdGF0dXM9aW5zdG9jaywgYmV0IGxpa3V0aXMgKF9zdG9jaytfb3duKSDiiaQwLCBiZSBiYWNrb3JkZXJzLCBiZSBraXRvIGFrdHl2YXVzIMWhYWx0aW5pbyBzdSBsaWt1xI1pdSDihpIgb3V0b2ZzdG9jayBwZXIgV0MgQVBJLiBEUlkvQVBQTFkuIEJhY2t1cCBvcHRpb24gcHNfczE2NzVfc3RvY2tfYmFrLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19kNSddKSkgcmV0dXJuOyAkZj0kX0dFVFsncHNfZDUnXTsKICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICR3cGRiLT5zdXBwcmVzc19lcnJvcnModHJ1ZSk7ICRvPWFycmF5KCd2Jz0+J1MxNjc1IGQnLCdmYXplJz0+JGYpOwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzLnBvc3RfaWQgaWQscy5tZXRhX3ZhbHVlIHN0LElGTlVMTChvdy5tZXRhX3ZhbHVlLDApIG93bixJRk5VTEwoc2QubWV0YV92YWx1ZSwnJykgc2FuZCBGUk9NIHskcH1wb3N0bWV0YSBzIEpPSU4geyRwfXBvc3RtZXRhIHN0IE9OIHN0LnBvc3RfaWQ9cy5wb3N0X2lkIEFORCBzdC5tZXRhX2tleT0nX3N0b2NrX3N0YXR1cycgQU5EIHN0Lm1ldGFfdmFsdWU9J2luc3RvY2snIEpPSU4geyRwfXBvc3RzIHBvIE9OIHBvLklEPXMucG9zdF9pZCBBTkQgcG8ucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwby5wb3N0X3R5cGU9J3Byb2R1Y3QnIEpPSU4geyRwfXBvc3RtZXRhIG1zIE9OIG1zLnBvc3RfaWQ9cy5wb3N0X2lkIEFORCBtcy5tZXRhX2tleT0nX21hbmFnZV9zdG9jaycgQU5EIG1zLm1ldGFfdmFsdWU9J3llcycgTEVGVCBKT0lOIHskcH1wb3N0bWV0YSBvdyBPTiBvdy5wb3N0X2lkPXMucG9zdF9pZCBBTkQgb3cubWV0YV9rZXk9J19vd25fc3RvY2tfcXR5JyBMRUZUIEpPSU4geyRwfXBvc3RtZXRhIHNkIE9OIHNkLnBvc3RfaWQ9cy5wb3N0X2lkIEFORCBzZC5tZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBMRUZUIEpPSU4geyRwfXBvc3RtZXRhIGJvIE9OIGJvLnBvc3RfaWQ9cy5wb3N0X2lkIEFORCBiby5tZXRhX2tleT0nX2JhY2tvcmRlcnMnIFdIRVJFIHMubWV0YV9rZXk9J19zdG9jaycgQU5EIChzLm1ldGFfdmFsdWUrMCtJRk5VTEwob3cubWV0YV92YWx1ZSwwKSk8PTAgQU5EIElGTlVMTChiby5tZXRhX3ZhbHVlLCdubycpPSdubyciLEFSUkFZX0EpOwogICRrYW5kPWFycmF5KCk7ICRwcmFsPWFycmF5KCk7CiAgZm9yZWFjaCgkcm93cyBhcyAkcil7ICRpZD0oaW50KSRyWydpZCddOwogICAgJGtpdGFzPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQ9JGlkIEFORCBpc19hY3RpdmU9MSBBTkQgc3RvY2tfcXR5PjAiKTsKICAgICRwcj13Y19nZXRfcHJvZHVjdCgkaWQpOyBpZighJHByKXsgJHByYWxbJGlkXT0nd2MgbnVsbCc7IGNvbnRpbnVlOyB9CiAgICBpZigkcHItPmdldF90eXBlKCkhPT0nc2ltcGxlJyl7ICRwcmFsWyRpZF09J3RpcGFzICcuJHByLT5nZXRfdHlwZSgpOyBjb250aW51ZTsgfQogICAgaWYoJGtpdGFzPjApeyAkcHJhbFskaWRdPSdraXRhcyDFoWFsdGluaXMgc3UgbGlrdcSNaXUnOyBjb250aW51ZTsgfQogICAgaWYoJHByLT5nZXRfc3RvY2tfcXVhbnRpdHkoKT4wKXsgJHByYWxbJGlkXT0nV0MgcXR5ICcuJHByLT5nZXRfc3RvY2tfcXVhbnRpdHkoKTsgY29udGludWU7IH0KICAgICRrYW5kWyRpZF09YXJyYXkoJ3NhbmQnPT4kclsnc2FuZCddLCdzdCc9PiRyWydzdCddLCdvd24nPT4kclsnb3duJ10sJ3QnPT5tYl9zdWJzdHIoJHByLT5nZXRfbmFtZSgpLDAsNTApKTsKICB9CiAgJG9bJ2thbmRpZGF0YWknXT1jb3VudCgka2FuZCk7ICRvWydwcmFsZWlzdGEnXT0kcHJhbDsgJG9bJ3BhZ2FsX3NhbmRlbGknXT1hcnJheV9jb3VudF92YWx1ZXMoYXJyYXlfY29sdW1uKCRrYW5kLCdzYW5kJykpOyAkb1sncHZ6J109YXJyYXlfc2xpY2UoJGthbmQsMCw1LHRydWUpOwogIGlmKCRmPT09J0FQUExZJyAmJiAka2FuZCl7CiAgICAkYmFrPWdldF9vcHRpb24oJ3BzX3MxNjc1X3N0b2NrX2JhaycsYXJyYXkoKSk7ICRvaz0wOyAka2w9YXJyYXkoKTsKICAgIGZvcmVhY2goJGthbmQgYXMgJGlkPT4kayl7ICRwcj13Y19nZXRfcHJvZHVjdCgkaWQpOyAkYmFrWyRpZF09YXJyYXkoJ3N0YXR1cyc9PidpbnN0b2NrJywnbGFpa2FzJz0+Y3VycmVudF90aW1lKCdteXNxbCcpKTsgJHByLT5zZXRfc3RvY2tfc3RhdHVzKCdvdXRvZnN0b2NrJyk7ICRwci0+c2F2ZSgpOyAkcHIyPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCRwcjItPmdldF9zdG9ja19zdGF0dXMoKT09PSdvdXRvZnN0b2NrJykgJG9rKys7IGVsc2UgJGtsW109JGlkOyB9CiAgICB1cGRhdGVfb3B0aW9uKCdwc19zMTY3NV9zdG9ja19iYWsnLCRiYWssZmFsc2UpOyAkb1snYXBwbHknXT1hcnJheSgnb2snPT4kb2ssJ2tsYWlkb3MnPT4ka2wpOwogICAgaWYoZnVuY3Rpb25fZXhpc3RzKCd3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzJykpIGZvcmVhY2goYXJyYXlfa2V5cygka2FuZCkgYXMgJGlkKSB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRpZCk7CiAgICAkb1sncG8nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cG9zdG1ldGEgcyBKT0lOIHskcH1wb3N0bWV0YSBzdCBPTiBzdC5wb3N0X2lkPXMucG9zdF9pZCBBTkQgc3QubWV0YV9rZXk9J19zdG9ja19zdGF0dXMnIEFORCBzdC5tZXRhX3ZhbHVlPSdpbnN0b2NrJyBKT0lOIHskcH1wb3N0cyBwbyBPTiBwby5JRD1zLnBvc3RfaWQgQU5EIHBvLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcG8ucG9zdF90eXBlPSdwcm9kdWN0JyBKT0lOIHskcH1wb3N0bWV0YSBtcyBPTiBtcy5wb3N0X2lkPXMucG9zdF9pZCBBTkQgbXMubWV0YV9rZXk9J19tYW5hZ2Vfc3RvY2snIEFORCBtcy5tZXRhX3ZhbHVlPSd5ZXMnIExFRlQgSk9JTiB7JHB9cG9zdG1ldGEgb3cgT04gb3cucG9zdF9pZD1zLnBvc3RfaWQgQU5EIG93Lm1ldGFfa2V5PSdfb3duX3N0b2NrX3F0eScgV0hFUkUgcy5tZXRhX2tleT0nX3N0b2NrJyBBTkQgKHMubWV0YV92YWx1ZSswK0lGTlVMTChvdy5tZXRhX3ZhbHVlLDApKTw9MCIpOwogICAgJGlkcz1hcnJheV9zbGljZShhcnJheV9rZXlzKCRrYW5kKSwwLDIpOyBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHI9d3BfcmVtb3RlX2dldChnZXRfcGVybWFsaW5rKCRpZCksYXJyYXkoJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsgJGI9KHN0cmluZyl3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcik7ICRvWydmcm9udCddWyRpZF09YXJyYXkoJ2NvZGUnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkciksJ291dF9vZl9zdG9ja19odG1sJz0+KGludCkoc3RycG9zKCRiLCdvdXQtb2Ytc3RvY2snKSE9PWZhbHNlfHxzdHJwb3MoJGIsJ291dG9mc3RvY2snKSE9PWZhbHNlKSwnYWRkX3RvX2NhcnRfYnRuJz0+KGludCkoc3RycG9zKCRiLCdzaW5nbGVfYWRkX3RvX2NhcnRfYnV0dG9uJykhPT1mYWxzZSkpOyB9CiAgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='dep-215518';
const GKEY='ps_d5';
const PHASES=["APPLY"];
const OUT='analize/s1675_d2.json';
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
