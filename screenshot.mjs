process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjczIEMxIGtvbnZlcnNpanUgc2lnbmFsYXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19jMSddKXx8JF9HRVRbJ3BzX2MxJ10hPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgndic9PidTMTY3M0MxJyk7CiAgdHJ5ewogICAgJHQ9JHdwZGItPnByZWZpeC4ncHNfZmFrdF91enNha3ltYWknOwogICAgJG9bJ2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00gJHQiKTsKICAgICRvWydwdnonXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUICogRlJPTSAkdCBPUkRFUiBCWSAxIERFU0MgTElNSVQgMSIsQVJSQVlfQSk7CiAgICAkb1sndmlzbyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCIpOwogICAgLy8gV0MgdXpzYWt5bWFpIHBlciBkaWVuYSwgMTQgZC4KICAgICRvWyd3Y19vcmRlcnMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBEQVRFKGRhdGVfY3JlYXRlZF9nbXQpIGQsc3RhdHVzLENPVU5UKCopIG4sUk9VTkQoU1VNKHRvdGFsX2Ftb3VudCksMikgc3VtYSBGUk9NIHskd3BkYi0+cHJlZml4fXdjX29yZGVycyBXSEVSRSBkYXRlX2NyZWF0ZWRfZ210Pj1EQVRFX1NVQihOT1coKSxJTlRFUlZBTCAxNCBEQVkpIEFORCB0eXBlPSdzaG9wX29yZGVyJyBHUk9VUCBCWSAxLDIgT1JERVIgQlkgMSIsQVJSQVlfQSk7CiAgICAvLyBnYTQgc2VydmVyaXMKICAgICRvWydnYTRfdGFibGVzJ109JHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJ3skd3BkYi0+cHJlZml4fXBzX2dhNCUnIik7CiAgICAkb1snZ2E0X29wdHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSxMRUZUKG9wdGlvbl92YWx1ZSwzMDApIHYgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ3BzX2dhNCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX2d0bSUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX2FkcyUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX2NvbnNlbnQlJyIsQVJSQVlfQSk7CiAgICAkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWdhNC1zZXJ2ZXJpcy5waHAnOyAkYz1maWxlX2dldF9jb250ZW50cygkZik7ICRvWydnYTRfc3JjX2xlbiddPXN0cmxlbigkYyk7CiAgICBwcmVnX21hdGNoX2FsbCgnLyhmdW5jdGlvblxzK1x3K3xhZGRfYWN0aW9uXChbXixdK3xhZGRfZmlsdGVyXChbXixdK3xtZWFzdXJlbWVudF9pZHxhcGlfc2VjcmV0fHB1cmNoYXNlfGNvbnZlcnNpb258YXdjdHxjb25zZW50fGdjbGlkfHVzZXJfZGF0YXxzaGEyNTYpL2knLCRjLCRtKTsgJG9bJ2dhNF9ncmVwJ109YXJyYXlfY291bnRfdmFsdWVzKCRtWzBdKTsKICAgIHByZWdfbWF0Y2goJy9WZXJzaW9uOlxzKihbXGRcLl0rKS8nLCRjLCR2KTsgJG9bJ2dhNF92ZXInXT0kdlsxXT8/bnVsbDsKICAgIC8vIEdUTSBzbmlwcGV0IHRoZW1lamU/CiAgICAkb1snZ3RtX2luX2hlYWQnXT1mYWxzZTsgZm9yZWFjaChhcnJheShnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKS4nL2Z1bmN0aW9ucy5waHAnLGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvaGVhZGVyLnBocCcpIGFzICRmZil7IGlmKGZpbGVfZXhpc3RzKCRmZikmJnN0cnBvcyhmaWxlX2dldF9jb250ZW50cygkZmYpLCdHVE0tJykhPT1mYWxzZSkgJG9bJ2d0bV9pbl9oZWFkJ109JGZmOyB9CiAgICAkaD13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvJyksYXJyYXkoJ3RpbWVvdXQnPT4xNSkpOyAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkaCk7CiAgICAkb1snZnJvbnQnXT1hcnJheSgnR1RNJz0+c3Vic3RyX2NvdW50KCRiLCdHVE0tTUYzR1pHVCcpLCdndGFnJz0+c3Vic3RyX2NvdW50KCRiLCdndGFnKCcpLCdjb25zZW50X2RlZmF1bHQnPT5zdWJzdHJfY291bnQoJGIsIidjb25zZW50JyIpLCdBVyc9PnByZWdfbWF0Y2goJy9BVy1cZCsvJywkYiwkYXcpPyRhd1swXTpudWxsLCdHLSc9PnByZWdfbWF0Y2goJy9HLVtBLVowLTldKy8nLCRiLCRnKT8kZ1swXTpudWxsLCdjb29raWV5ZXN8Y29tcGxpYW56fGNvb2tpZWJvdCc9PnByZWdfbWF0Y2goJy8oY29va2lleWVzfGNvbXBsaWFuenxjb29raWVib3R8Y21wbHp8Y2t5KS9pJywkYiwkY20pPyRjbVsxXTpudWxsKTsKICAgICRvWydwbHVnaW5zX2NvbnNlbnQnXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKGdldF9vcHRpb24oJ2FjdGl2ZV9wbHVnaW5zJyksZnVuY3Rpb24oJHApe3JldHVybiBwcmVnX21hdGNoKCcvY29va3xjb25zZW50fGdkcHJ8Y21wL2knLCRwKTt9KSk7CiAgICAvLyBhZHMgcmVjb24gb3BjaWphIOKAlCBwYXNrdXRpbmlzCiAgICAkcj1nZXRfb3B0aW9uKCdwc19hZHNfcmVjb24nKTsgJG9bJ2Fkc19yZWNvbiddPWlzX2FycmF5KCRyKT9hcnJheSgna2V5cyc9PmFycmF5X2tleXMoJHIpLCd2Jz0+JHJbJ3YnXT8/bnVsbCwna2FkYSc9PiRyWydrYWRhJ10/P251bGwpOnN1YnN0cihqc29uX2VuY29kZSgkciksMCwyMDApOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-200524';
const GKEY='ps_c1';
const PHASES=["GO"];
const OUT='analize/s1673_c1.json';
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

  // S1671 MERCHANT API: data source lt
  if(process.env.GTM_SA_JSON){ try{
    let raw=process.env.GTM_SA_JSON.trim(); out.mc_raw={len:raw.length,head:raw.slice(0,12)}; if(!raw.startsWith('{')){ raw='{'+raw+'}'; } const sa=JSON.parse(raw); const crypto=await import('crypto');
    const now=Math.floor(Date.now()/1000); const b=s=>Buffer.from(JSON.stringify(s)).toString('base64url');
    const hdr=b({alg:'RS256',typ:'JWT'}); const clm=b({iss:sa.client_email,scope:'https://www.googleapis.com/auth/content',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});
    const sig=crypto.createSign('RSA-SHA256').update(hdr+'.'+clm).sign(sa.private_key,'base64url');
    const tr=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion='+hdr+'.'+clm+'.'+sig});
    const tj=await tr.json(); out.mc={sa:sa.client_email,token:tr.status};
    if(tj.access_token){ const H={Authorization:'Bearer '+tj.access_token};
      const l=await fetch('https://merchantapi.googleapis.com/datasources/v1/accounts/5321054797/dataSources',{headers:H}); const lj=await l.json();
      out.mc.sources={status:l.status,items:(lj.dataSources||[]).map(d=>({name:d.name,dn:d.displayName,lang:d.primaryProductDataSource&&d.primaryProductDataSource.contentLanguage,label:d.primaryProductDataSource&&d.primaryProductDataSource.feedLabel,uri:d.fileInput&&d.fileInput.fetchSettings&&d.fileInput.fetchSettings.fetchUri}))};
      let pt='',n=0,st={},iss={},pages=0,samples={},noStatus=0,full={};
      do{ const r=await fetch('https://merchantapi.googleapis.com/products/v1/accounts/5321054797/products?pageSize=250'+(pt?'&pageToken='+pt:''),{headers:H}); const j=await r.json(); pages++;
        if(j.error){ out.mc.prod_err=JSON.stringify(j.error).slice(0,400); break; }
        for(const p of (j.products||[])){ n++; const ps=p.productStatus; if(!ps){noStatus++;continue;}
          for(const d of (ps.destinationStatuses||[])){ const k=d.reportingContext||'?'; st[k]=st[k]||{ok:0,pend:0,dis:0}; if((d.approvedCountries||[]).length) st[k].ok++; if((d.pendingCountries||[]).length) st[k].pend++; if((d.disapprovedCountries||[]).length) st[k].dis++; }
          for(const i of (ps.itemLevelIssues||[])){ const k=(i.reportingContext||'?')+'|'+i.severity+'|'+i.code+'|'+(i.attribute||''); iss[k]=(iss[k]||0)+1; if(!samples[k]) samples[k]={desc:i.description,detail:(i.detail||'').slice(0,160),res:i.resolution,ids:[]}; if(samples[k].ids.length<3) samples[k].ids.push(p.offerId); if(/missing_shipping_weight|live_animals|healthcare|personal_hardships|inappropriate|violated_discovery|sexual|image_too_small|invalid_upc|alcohol|illegal_drugs|legal_restr/.test(i.code)&&(i.reportingContext==='SHOPPING_ADS'||i.reportingContext==='DEMAND_GEN_ADS')){ full[i.code]=full[i.code]||{}; full[i.code][p.offerId]=(p.attributes&&p.attributes.title||'').slice(0,70); } } }
        pt=j.nextPageToken||''; }while(pt&&pages<20);
      const ss=await fetch('https://merchantapi.googleapis.com/accounts/v1/accounts/5321054797/shippingSettings',{headers:H}); out.mc.shipping={status:ss.status,body:(await ss.text()).slice(0,2500)}; out.mc.full=full; out.mc.products={n,pages,noStatus,statuses:st,issues:Object.entries(iss).sort((a,b)=>b[1]-a[1]).map(([k,c])=>Object.assign({k,c},samples[k]))};
    } else out.mc.token_body=JSON.stringify(tj).slice(0,300);
  }catch(e){ out.mc_klaida=String(e).slice(0,400); } }
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
