process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODE2c3QgYmVzdHNlbGVyaWFpIGJlIGxpa3VjaW8gKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODE2c3QnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4MTZzdCddOwogICR0b3A9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZS5wcmVrZV9pZCBwaWQsIGUudmFyaWFjaWphX2lkIHZpZCwgTEVGVChNQVgoZS5wYXZhZGluaW1hc190dW9fbWV0dSksNzApIHAsIFNVTShlLmtpZWtpcykgaywgQ09VTlQoRElTVElOQ1QgZS51enNha3ltYXNfaWQpIHV6cywgUk9VTkQoU1VNKGUua2FpbmFfY3QtZS5zYXZpa2FpbmFfY3QpLzEwMCkgbWFyemEsIE1BWChlLnNhbmRlbGlzKSBzIEZST00geyRQfXBzX2Zha3RfZWlsdXRlcyBlIEpPSU4geyRQfXBzX2Zha3RfdXpzYWt5bWFpIHUgT04gdS51enNha3ltYXNfaWQ9ZS51enNha3ltYXNfaWQgQU5EIHUudGVzdGluaXM9MCBBTkQgdS5zdGF0dXNhc19nYWx1dGluaXMgTk9UIElOKCdjYW5jZWxsZWQnLCdmYWlsZWQnLCdyZWZ1bmRlZCcsJ3BlbmRpbmcnKSBXSEVSRSBlLmRpZW5hPj0nMjAyNi0wOS0wOScgQU5EIGUucmlua2lueXNfaWQgSVMgTlVMTCBHUk9VUCBCWSAxLDIgT1JERVIgQlkgdXpzIERFU0MgTElNSVQgMTUwIixBUlJBWV9BKTsKICAkb3V0PVtdOyAkbj0wOyBmb3JlYWNoKCR0b3AgYXMgJHQpeyAkaWQ9KGludCkoJHRbJ3ZpZCddPzokdFsncGlkJ10pOyAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoISRwcikgY29udGludWU7ICRuKys7CiAgICAkc3Q9JHByLT5nZXRfc3RvY2tfc3RhdHVzKCk7ICRxPSRwci0+Z2V0X3N0b2NrX3F1YW50aXR5KCk7ICR2aXM9JHByLT5nZXRfY2F0YWxvZ192aXNpYmlsaXR5KCk7ICRwcz1nZXRfcG9zdF9zdGF0dXMoJHRbJ3BpZCddKTsKICAgIGlmKCRzdCE9PSdpbnN0b2NrJ3x8JHBzIT09J3B1Ymxpc2gnfHwkdmlzPT09J2hpZGRlbicpICRvdXRbXT1bJG4sJGlkLCR0WydwJ10sJHRbJ3V6cyddLCR0WydrJ10sJHRbJ21hcnphJ10sJHRbJ3MnXSwkc3QsJHEsJHBzLCR2aXMsKHN0cmluZylnZXRfcG9zdF9tZXRhKCR0WydwaWQnXSwnX3BzX3NhbmRlbGlzJyx0cnVlKSwoc3RyaW5nKWdldF9wb3N0X21ldGEoJHRbJ3BpZCddLCdfcHNfZHJvcHNoaXBfcGFzbGVwdGEnLHRydWUpXTsgfQogICRyWyd0aWtyaW50YSddPSRuOyAkclsnYmVfbGlrdWNpbyddPSRvdXQ7ICRyWyduX2JlJ109Y291bnQoJG91dCk7CiAgLy8gYmVuZHJhcyB2YWl6ZGFzOiBraWVrIHB1Ymxpc2ggcHJla2l1IG91dG9mc3RvY2sgcGFnYWwgc2FuZGVsaQogICRyWyd2aXNvX29vcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIENPQUxFU0NFKHMubWV0YV92YWx1ZSwnPycpIHNhbmQsIENPVU5UKCopIG4gRlJPTSB7JFB9cG9zdHMgcCBKT0lOIHskUH1wb3N0bWV0YSBtIE9OIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdfc3RvY2tfc3RhdHVzJyBBTkQgbS5tZXRhX3ZhbHVlPSdvdXRvZnN0b2NrJyBMRUZUIEpPSU4geyRQfXBvc3RtZXRhIHMgT04gcy5wb3N0X2lkPXAuSUQgQU5EIHMubWV0YV9rZXk9J19wc19zYW5kZWxpcycgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBHUk9VUCBCWSAxIixBUlJBWV9BKTsKICAkclsndmlzb19wdWJsaXNoJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCciKTsKICAvLyBhciB5cmEgc3RvY2tfd2F0Y2ggKHByYW5lc3RpIGthaSBidXMpIGxhdWtpYW5jaXUKICAkclsnbGF1a2lhX3ByYW5lc2V0aSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHByb2R1Y3RfaWQsIENPVU5UKCopIG4gRlJPTSB7JFB9cHNfc3RvY2tfd2F0Y2ggV0hFUkUgc3RhdHVzPSd3YWl0aW5nJyBHUk9VUCBCWSAxIE9SREVSIEJZIDIgREVTQyBMSU1JVCAxMCIsQVJSQVlfQSk7CiAgLy8gcnl0YXM6IGFyIGphdSB5cmEgbGlrdWNpdSBwYXRpa3JhCiAgJHM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1yeXRhcy5waHAnKTsgJHJbJ3J5dGFzX21kNSddPW1kNSgkcyk7ICRyWydyeXRhc19sZW4nXT1zdHJsZW4oJHMpOyBwcmVnX21hdGNoX2FsbCgiIydrb2Rhcydccyo9PlxzKicoW2Etel8wLTldKyknIyIsJHMsJG0pOyAkclsncnl0YXNfa29kYWknXT1hcnJheV91bmlxdWUoJG1bMV0pOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsgfSk7Cg==';
const VER='dep-123808';
const GKEY='ps_s1816st';
const PHASES=["1"];
const OUT='analize/s1816_st.json';
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
