process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODlzIHIg4oCUIFJFQ09OIEpvc2VyYSBrYWluxbMgYW5hbGl6xJc6IDUgcHJla8SXcyDigJQga2FpbmEsIHNhdmlrYWluYSwgbWFyxb5hLCBwYXJkYXZpbWFpIGlzdG9yaWpvamUsIHBlcsW+acWrcm9zLiBSZWFkLW9ubHkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjg5c3InXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOyAkd3BkYi0+c3VwcHJlc3NfZXJyb3JzKHRydWUpOwogICRpZHM9YXJyYXkoJzQwMzIyNTQ3ODU5ODknPT4nU2Vuc2lQbHVzIDEyLDUnLCc0MDMyMjU0Nzc1MjYzJz0+J0Zlc3RpdmFsIDEyLDUnLCc0MDMyMjU0NzMxNjQxJz0+J09wdGluZXNzIDEyLDUnLCc0MDMyMjU0NzQ5NTQ3Jz0+J01hcmluZXNzZSAxMCcsJzQwMzIyNTQ3NzU1MjInPT4nTWluaSBEZWx1eGUgMTAnKTsKICAkb1snc3JjX2NvbHMnXT1pbXBsb2RlKCcsJywoYXJyYXkpJHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskcH1wc19zb3VyY2VzIikpOwogIGZvcmVhY2goJGlkcyBhcyAkZ3Rpbj0+JGxibCl7CiAgICAkcGlkPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2lkIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5IElOICgnX2dsb2JhbF91bmlxdWVfaWQnLCdfZWFuJykgQU5EIG1ldGFfdmFsdWU9JXMgTElNSVQgMSIsJGd0aW4pKTsKICAgIGlmKCEkcGlkKXskb1skbGJsXT0nbmVyYXN0YSc7Y29udGludWU7fSAkcHI9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7CiAgICAkcj1hcnJheSgncGlkJz0+JHBpZCwna2FpbmEnPT4oZmxvYXQpJHByLT5nZXRfcHJpY2UoKSwncmVnJz0+JHByLT5nZXRfcmVndWxhcl9wcmljZSgpLCdha2NpamEnPT4kcHItPmdldF9zYWxlX3ByaWNlKCksJ3NhbmRlbGlzJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpLCdzdG9jayc9PiRwci0+Z2V0X3N0b2NrX3F1YW50aXR5KCkuJy8nLiRwci0+Z2V0X3N0b2NrX3N0YXR1cygpLAogICAgICAnY29zdF9wcmljZSc9PmdldF9wb3N0X21ldGEoJHBpZCwnX2Nvc3RfcHJpY2UnLHRydWUpLCd2Zl9za3UnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ192Zl9za3UnLHRydWUpLCd2Zl9iYXNlJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfdmZfYmFzZV9wcmljZScsdHJ1ZSksJ3ZmX3F0eSc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3ZmX3F0eScsdHJ1ZSkpOwogICAgJHM9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskcH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQ9JWQiLCRwaWQpLEFSUkFZX0EpOyAkclsnc291cmNlcyddPWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIGFycmF5X2ludGVyc2VjdF9rZXkoJHgsYXJyYXlfZmxpcChhcnJheSgnc291cmNlJywnc3VwcGxpZXInLCdjb3N0X25ldCcsJ3ByaWNlJywncXR5JywnYWN0aXZlJywndXBkYXRlZF9hdCcpKSk7fSwkcz86YXJyYXkoKSk7CiAgICAkclsnbWV0YV9rYWluJ109YXJyYXkoKTsgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBtZXRhX2tleSxtZXRhX3ZhbHVlIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9JWQgQU5EIChtZXRhX2tleSBMSUtFICclJXByaWMlJScgT1IgbWV0YV9rZXkgTElLRSAnJSVjb3N0JSUnIE9SIG1ldGFfa2V5IExJS0UgJyUlc2F2aWslJScgT1IgbWV0YV9rZXkgTElLRSAnJSVtYXJ6JSUnIE9SIG1ldGFfa2V5IExJS0UgJyUldmZfJSUnKSIsJHBpZCksQVJSQVlfQSkgYXMgJG0peyBpZihzdHJsZW4oJG1bJ21ldGFfdmFsdWUnXSk8NDApJHJbJ21ldGFfa2FpbiddWyRtWydtZXRhX2tleSddXT0kbVsnbWV0YV92YWx1ZSddOyB9CiAgICAkclsnaXN0XzEybSddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgZS51enNha3ltYXNfaWQpIHV6cywgU1VNKGUua2lla2lzKSB2bnQsIFJPVU5EKEFWRyhlLmthaW5hX3ZudF9jdCkvMTAwLDIpIHZpZF9rYWluYSwgUk9VTkQoTUlOKGUua2FpbmFfdm50X2N0KS8xMDAsMikgbWluX2ssIFJPVU5EKE1BWChlLmthaW5hX3ZudF9jdCkvMTAwLDIpIG1heF9rLCBST1VORChBVkcoZS5zYXZpa2FpbmFfdm50X2N0KS8xMDAsMikgdmlkX3NhdmlrIEZST00geyRwfXBzX2lzdF9mYWt0X2VpbHV0ZXMgZSBKT0lOIHskcH1wc19pc3RfZmFrdF91enNha3ltYWkgZiBPTiBmLnV6c2FreW1hc19pZD1lLnV6c2FreW1hc19pZCBXSEVSRSBlLnByZWtlX2lkPSVkIEFORCBmLnN1a3VydGFfYXQ+PURBVEVfU1VCKE5PVygpLElOVEVSVkFMIDEyIE1PTlRIKSIsJHBpZCksQVJSQVlfQSk7CiAgICAkclsnaXN0X2tldHYnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT05DQVQoWUVBUihmLnN1a3VydGFfYXQpLCdRJyxRVUFSVEVSKGYuc3VrdXJ0YV9hdCkpIHEsIFNVTShlLmtpZWtpcykgdm50LCBST1VORChBVkcoZS5rYWluYV92bnRfY3QpLzEwMCwyKSBrIEZST00geyRwfXBzX2lzdF9mYWt0X2VpbHV0ZXMgZSBKT0lOIHskcH1wc19pc3RfZmFrdF91enNha3ltYWkgZiBPTiBmLnV6c2FreW1hc19pZD1lLnV6c2FreW1hc19pZCBXSEVSRSBlLnByZWtlX2lkPSVkIEFORCBmLnN1a3VydGFfYXQ+PScyMDI1LTAxLTAxJyBHUk9VUCBCWSBxIE9SREVSIEJZIHEiLCRwaWQpLEFSUkFZX0EpOwogICAgJHJbJ3BvX3QwJ109JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBlaWwsIFNVTShraWVraXMpIHZudCwgUk9VTkQoQVZHKGthaW5hX3ZudF9jdCkvMTAwLDIpIGssIFJPVU5EKEFWRyhzYXZpa2FpbmFfdm50X2N0KS8xMDAsMikgc2F2LCBNQVgoc2F2aWthaW5vc19zYWx0aW5pcykgc3MgRlJPTSB7JHB9cHNfZmFrdF9laWx1dGVzIFdIRVJFIHByZWtlX2lkPSVkIEFORCB0ZXN0aW5pcz0wIiwkcGlkKSxBUlJBWV9BKTsKICAgICRyWydwZXJ6aXVyb3NfMzBkJ109JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBTVU0odGlwYXM9J3ZpZXdfaXRlbScpIHZpZXcsIENPVU5UKERJU1RJTkNUIElGKHRpcGFzPSd2aWV3X2l0ZW0nLHNlc2lqYSxOVUxMKSkgc2VzLCBTVU0odGlwYXM9J2FkZF90b19jYXJ0JykgY2FydCBGUk9NIHskcH1wc193ZWJfaXZ5a2lhaSBXSEVSRSB0ZXN0aW5pcz0wIEFORCBsYWlrYXM+PURBVEVfU1VCKE5PVygpLElOVEVSVkFMIDMwIERBWSkgQU5EIChyYWt0YXM9JXMgT1IgcmFrdGFzMj0lcykiLCRwaWQsJHBpZCksQVJSQVlfQSk7CiAgICAkclsndXJsJ109Z2V0X3Blcm1hbGluaygkcGlkKTsgJG9bJGxibF09JHI7CiAgfQogICRvWyd2Zl90YWlzeWtsZSddPWdldF9vcHRpb24oJ3BzX3ZmX3ByaWNpbmdfcnVsZXMnKSA/OiBnZXRfb3B0aW9uKCdwZXRzaG9wX3ZmX3ByaWNpbmcnKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-104903';
const GKEY='ps_s1689sr';
const PHASES=["GO"];
const OUT='analize/s1689s_r.json';
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
