process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzggayDigJQgUkVBRC1PTkxZOiBrbGllbnTFsyBha3R5dnVtYXMgaXIgcGFrYXJ0b3RpbnVtYXMgacWhIGlzdG9yaWpvcyAocHNfaXN0X2Zha3RfdXpzYWt5bWFpL2VpbHV0ZXMpLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zZWM4ayddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjc4IGsnKTsgJHdwZGItPnN1cHByZXNzX2Vycm9ycyh0cnVlKTsKICAkVT0ieyRwfXBzX2lzdF9mYWt0X3V6c2FreW1haSI7ICRFPSJ7JHB9cHNfaXN0X2Zha3RfZWlsdXRlcyI7ICRvWydjb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NICRVIik7CiAgJGtsPWluX2FycmF5KCdrbGllbnRhc19pZCcsJG9bJ2NvbHMnXSk/J2tsaWVudGFzX2lkJzooaW5fYXJyYXkoJ2VsX3Bhc3Rhc19oYXNoJywkb1snY29scyddKT8nZWxfcGFzdGFzX2hhc2gnOihpbl9hcnJheSgna2xpZW50YXNfaGFzaCcsJG9bJ2NvbHMnXSk/J2tsaWVudGFzX2hhc2gnOidlbF9wYXN0YXMnKSk7CiAgJGR0PWluX2FycmF5KCdhcG1va2V0YV9hdCcsJG9bJ2NvbHMnXSk/J2FwbW9rZXRhX2F0Jzonc3VrdXJ0YV9hdCc7ICRzdW09aW5fYXJyYXkoJ3N1bWFfY3QnLCRvWydjb2xzJ10pPydzdW1hX2N0Jzondmlzb19jdCc7ICRvWydrbCddPSRrbDsgJG9bJ2R0J109JGR0OyAkb1snc3VtJ109JHN1bTsKICAkb1sndmlzbyddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoKikgbiwgQ09VTlQoRElTVElOQ1QgJGtsKSBrbCwgTUlOKCRkdCkgbnVvLCBNQVgoJGR0KSBpa2ksIFJPVU5EKFNVTSgkc3VtKS8xMDApIGV1ciBGUk9NICRVIixBUlJBWV9BKTsKICBmb3JlYWNoKGFycmF5KDEyLDI0LDM2KSBhcyAkbSl7ICRvWydwZXInLiRtXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIENPVU5UKCopIHV6cywgQ09VTlQoRElTVElOQ1QgJGtsKSBrbGllbnRhaSwgUk9VTkQoU1VNKCRzdW0pLzEwMCkgZXVyLCBST1VORChBVkcoJHN1bSkvMTAwLDEpIGFvdiBGUk9NICRVIFdIRVJFICRkdD5EQVRFX1NVQihOT1coKSxJTlRFUlZBTCAkbSBNT05USCkiLEFSUkFZX0EpOyB9CiAgJG9bJ3Bha2FydDEyJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbiwgQ09VTlQoKikga2xpZW50YWksIFJPVU5EKFNVTShldXIpKSBldXIgRlJPTSAoU0VMRUNUICRrbCBrLCBDT1VOVCgqKSBuLCBTVU0oJHN1bSkvMTAwIGV1ciBGUk9NICRVIFdIRVJFICRkdD5EQVRFX1NVQihOT1coKSxJTlRFUlZBTCAxMiBNT05USCkgR1JPVVAgQlkgJGtsKSB0IEdST1VQIEJZIExFQVNUKG4sNikgT1JERVIgQlkgbiIsQVJSQVlfQSk7CiAgJG9bJ2ludGVydiddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgUk9VTkQoQVZHKGQpKSBGUk9NIChTRUxFQ1QgREFURURJRkYoTUFYKCRkdCksTUlOKCRkdCkpLyhDT1VOVCgqKS0xKSBkIEZST00gJFUgV0hFUkUgJGR0PkRBVEVfU1VCKE5PVygpLElOVEVSVkFMIDI0IE1PTlRIKSBHUk9VUCBCWSAka2wgSEFWSU5HIENPVU5UKCopPj0zKSB0Iik7CiAgJG9bJ2Npa2xpbmVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZS5za3UsIE1BWChlLnBhdmFkaW5pbWFzX3R1b19tZXR1KSBwLCBDT1VOVChESVNUSU5DVCB1LiRrbCkga2wsIENPVU5UKCopIHBpcmssIFJPVU5EKENPVU5UKCopL0NPVU5UKERJU1RJTkNUIHUuJGtsKSwxKSBwZXJfa2wsIFJPVU5EKFNVTShlLmthaW5hX2N0KS8xMDApIGV1ciBGUk9NICRFIGUgSk9JTiAkVSB1IE9OIHUuaWQ9ZS51enNha3ltYXNfaWQgV0hFUkUgdS4kZHQ+REFURV9TVUIoTk9XKCksSU5URVJWQUwgMjQgTU9OVEgpIEdST1VQIEJZIGUuc2t1IEhBVklORyBrbD49NSBBTkQgcGVyX2tsPj0yIE9SREVSIEJZIHBpcmsgREVTQyBMSU1JVCA0MCIsQVJSQVlfQSk7CiAgJG9bJ3RvcF9ldXIyNCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGUuYnJlbmRhc19zbHVnIGIsIFJPVU5EKFNVTShlLmthaW5hX2N0KS8xMDApIGV1ciwgQ09VTlQoRElTVElOQ1QgdS4ka2wpIGtsIEZST00gJEUgZSBKT0lOICRVIHUgT04gdS5pZD1lLnV6c2FreW1hc19pZCBXSEVSRSB1LiRkdD5EQVRFX1NVQihOT1coKSxJTlRFUlZBTCAxMiBNT05USCkgR1JPVVAgQlkgYiBPUkRFUiBCWSBldXIgREVTQyBMSU1JVCAyMCIsQVJSQVlfQSk7CiAgJG9bJ3NlbmRlciddPWFycmF5KCdrb250YWt0YWlfb3BjaWphJz0+Z2V0X29wdGlvbigncGV0c2hvcF9lc3Bfc2VuZGVyX2tvbnRha3R1X3NrJywnLScpLCdzdXRpa2ltYWlfbWV0YSc9PiR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9dXNlcm1ldGEgV0hFUkUgbWV0YV9rZXkgTElLRSAnJW5ld3NsZXR0ZXIlJyBPUiBtZXRhX2tleSBMSUtFICclcmlua29kYXIlJyBPUiBtZXRhX2tleSBMSUtFICclbWFya2V0aW5nX2NvbnNlbnQlJyIpLCdzdXRpa19yYWt0YWknPT4kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIERJU1RJTkNUIG1ldGFfa2V5IEZST00geyRwfXVzZXJtZXRhIFdIRVJFIG1ldGFfa2V5IExJS0UgJyVuZXdzbGV0dGVyJScgT1IgbWV0YV9rZXkgTElLRSAnJXJpbmtvZGFyJScgT1IgbWV0YV9rZXkgTElLRSAnJWNvbnNlbnQlJyBPUiBtZXRhX2tleSBMSUtFICclc3V0aWslJyBMSU1JVCAxMCciKSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-221333';
const GKEY='ps_sec8k';
const PHASES=["GO"];
const OUT='analize/s1678_k.json';
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
