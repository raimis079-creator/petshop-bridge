process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzYzYSBGYXJtaW5hIHByZWtlczoga2Fpbm9zLCBzYXZpa2FpbmEsIGFudGthaW5pcywgcGFyZGF2aW1haSArIHV6c2FreW1vIGthc3R1IHZpZHVya2lhaSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NjNhJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNTApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTc2M2EnXTsKICB0cnl7CiAgJEE9JFAuJ3BzX2Zha3RfYXRzYXJnb3NfZCc7ICRkbWF4PSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgTUFYKGRhdGEpIEZST00gJEEiKTsKICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGUgSU4oJ3Byb2R1Y3QnLCdwcm9kdWN0X3ZhcmlhdGlvbicpIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvc3RfdGl0bGUgTElLRSAnJWZhcm1pbmElJyIpOwogICRyWyduJ109Y291bnQoJGlkcyk7ICRyWydkbWF4J109JGRtYXg7ICRyb3dzPVtdOwogIGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkcD13Y19nZXRfcHJvZHVjdCgkaWQpOyBpZighJHAgfHwgJHAtPmlzX3R5cGUoJ3ZhcmlhYmxlJykpIGNvbnRpbnVlOwogICAgJGE9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBzYXZpa2FpbmFfdm50X2N0IHN2LHNhdmlrYWlub3Nfc2FsdGluaXMgc3MsbGlrdXRpc19hdiBsYXYsbGlrdXRpc190aWVrZWpvIGx0LHBhcmRhdmltYWlfdm50XzMwZCBwMzAgRlJPTSAkQSBXSEVSRSBwcmVrZV9pZD0lZCBBTkQgZGF0YT0lcyIsJGlkLCRkbWF4KSxBUlJBWV9BKTsKICAgICRzdj0kYT8oaW50KSRhWydzdiddOihpbnQpcm91bmQoMTAwKihmbG9hdClnZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3NhdmlrYWluYScsdHJ1ZSkpOwogICAgJHByaWNlPShmbG9hdCkkcC0+Z2V0X3ByaWNlKCk7ICRyZWc9KGZsb2F0KSRwLT5nZXRfcmVndWxhcl9wcmljZSgpOyAkbmV0PSRwcmljZS8xLjIxOwogICAgJHJvd3NbXT1bJ2lkJz0+JGlkLCdwYXYnPT5tYl9zdWJzdHIoJHAtPmdldF9uYW1lKCksMCw2MCksJ2thaW5hJz0+JHByaWNlLCdyZWcnPT4kcmVnLCdzYXZfbmV0Jz0+JHN2LzEwMCwnYW50a18lJz0+JHN2P3JvdW5kKDEwMCooJG5ldCoxMDAtJHN2KS8kc3YsMSk6bnVsbCwna2FpbmFfMjAnPT4kc3Y/cm91bmQoJHN2LzEwMCoxLjIqMS4yMSwyKTpudWxsLCdsYWIwJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19jdXN0b21fbGFiZWxfMCcsdHJ1ZSk/OmdldF9wb3N0X21ldGEoJGlkLCdjdXN0b21fbGFiZWxfMCcsdHJ1ZSksJ3N0b2NrJz0+JHAtPmdldF9zdG9ja19zdGF0dXMoKSwnc3MnPT4kYVsnc3MnXT8/JycsJ2x0Jz0+JGFbJ2x0J10/PycnLCdwMzAnPT4kYVsncDMwJ10/PycnLCdkcCc9PmdldF9wb3N0X21ldGEoJGlkLCdfZHBfYmFzZV9wcm9kdWN0X2lkJyx0cnVlKT8nRFAnOicnIF07IH0KICB1c29ydCgkcm93cyxmdW5jdGlvbigkeCwkeSl7IHJldHVybiAkeVsna2FpbmEnXTw9PiR4WydrYWluYSddOyB9KTsgJHJbJ3ByZWtlcyddPSRyb3dzOwogICRVPSRQLidwc19mYWt0X3V6c2FreW1haSc7ICRTPSRQLidwc19mYWt0X3NpdW50b3MnOwogICRyWyd1enNfa2FzdGFpJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBDT1VOVCgqKSBuLCBST1VORChBVkcodS5wcmlzdGF0eW1hc19wYWltdGFfY3QpLzEwMCwyKSBwcmlzdGF0X3BhaW10YSwgUk9VTkQoQVZHKHUubW9rZWppbW9fbW9rZXN0aXNfY3QpLzEwMCwyKSBtb2ssIFJPVU5EKEFWRyh1LnBha3VvdGVzX3NhdmlrYWluYV9jdCkvMTAwLDIpIHBhaywgUk9VTkQoQVZHKChTRUxFQ1QgQ09BTEVTQ0UoU1VNKHMua2FpbmFfdmV6ZWpvX2N0KSwwKSBGUk9NICRTIHMgV0hFUkUgcy51enNha3ltYXNfaWQ9dS51enNha3ltYXNfaWQgQU5EIENPQUxFU0NFKHMuc3RhdHVzYXMsJycpPD4nYXRzYXVrdGEnKSkvMTAwLDIpIHZleiwgUk9VTkQoQVZHKHUudmlzb19jdCkvMTAwLDEpIHZpc28sIFJPVU5EKEFWRyh1LmtvbnRyaWJ1Y2lqYV9jdC11Lm1hcnphX2N0KS8xMDAsMikga29udHJfbWludXNfbWFyemEgRlJPTSAkVSB1IFdIRVJFIHUudGVzdGluaXM9MCBBTkQgdS5zdGF0dXNhc19nYWx1dGluaXMgSU4oJ2NvbXBsZXRlZCcsJ3Byb2Nlc3NpbmcnKSBBTkQgdS52aXNvX2N0Pj01MDAwIEFORCB1LnN1a3VydGFfYXQ+PScyMDI2LTA5LTIwJyIsQVJSQVlfQSk7CiAgJHJbJ2Zhcm1pbmFfZWlsJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZS5kaWVuYSxMRUZUKGUucGF2YWRpbmltYXNfdHVvX21ldHUsNTApIHBhdixlLmtpZWtpcyBxLGUua2FpbmFfY3QgayxlLnNhdmlrYWluYV9jdCBzdiBGUk9NIHskUH1wc19mYWt0X2VpbHV0ZXMgZSBXSEVSRSBlLnRlc3RpbmlzPTAgQU5EIGUuYnJlbmRhc19zbHVnPSdmYXJtaW5hJyIsQVJSQVlfQSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSk7Cg==';
const VER='dep-081334';
const GKEY='ps_s1763a';
const PHASES=["1"];
const OUT='out/s1763_a.json';
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
