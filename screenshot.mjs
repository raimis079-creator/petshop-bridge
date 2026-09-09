process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjgzIHBhcnRpam9zIHZpcnMgbGlrdWNpbyAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2JsYSddKT8kX0dFVFsncHNfYmxhJ106JycpIT09J1InKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTY4MycsJ3dwJz0+Y3VycmVudF90aW1lKCdteXNxbCcpKTsKICBnbG9iYWwgJHdwZGI7ICR0cD0kd3BkYi0+cHJlZml4Lidwc19wYXJ0aWpvcyc7CiAgdHJ5ewogICAgJHNxbD0iU0VMRUNUIHAuSUQsIENBU1QocG0ubWV0YV92YWx1ZSBBUyBTSUdORUQpIHN0b2NrLAogICAgICAgICAgICAgICAgIENPQUxFU0NFKFNVTShDQVNFIFdIRU4gdC5hdHNhdWt0YT0wIE9SIHQuYXRzYXVrdGEgSVMgTlVMTCBUSEVOIHQua2lla2lzX2xpa28gRUxTRSAwIEVORCksMCkgcGFydGlqb3NlCiAgICAgICAgICBGUk9NIHskd3BkYi0+cG9zdHN9IHAKICAgICAgICAgIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gcG0gT04gcG0ucG9zdF9pZD1wLklEIEFORCBwbS5tZXRhX2tleT0nX3N0b2NrJwogICAgICAgICAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBzZCBPTiBzZC5wb3N0X2lkPXAuSUQgQU5EIHNkLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIEFORCBzZC5tZXRhX3ZhbHVlPSdhdicKICAgICAgICAgIExFRlQgSk9JTiBgJHRwYCB0IE9OIHQucHJvZHVjdF9pZD1wLklECiAgICAgICAgICBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnCiAgICAgICAgICBHUk9VUCBCWSBwLklELCBwbS5tZXRhX3ZhbHVlIEhBVklORyBwYXJ0aWpvc2UgPiBzdG9jayI7CiAgICAkcj0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHNxbCxBUlJBWV9BKTsKICAgICRvWyd2aXNvJ109Y291bnQoJHIpOwogICAgJGVpbD1hcnJheSgpOyAkc3VtYVBlcnRla2xpdXM9MDsgJHN1bWFFdXI9MDsKICAgIGZvcmVhY2goJHIgYXMgJHgpewogICAgICAkaWQ9KGludCkkeFsnSUQnXTsgJHN0PShpbnQpJHhbJ3N0b2NrJ107ICRwdD0oaW50KSR4WydwYXJ0aWpvc2UnXTsgJHBlcj0kcHQtJHN0OwogICAgICAkc3VtYVBlcnRla2xpdXMrPSRwZXI7CiAgICAgICRwcnQ9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQsZ2F1dGEsa2lla2lzX2dhdXRhcyxraWVraXNfbGlrbyxzYXZpa2FpbmFfZXVyLHRpZWtlamFzLExFRlQocGFzdGFiYSw0NSkgcGFzdGFiYSxzdWt1cnRhIEZST00gYCR0cGAgV0hFUkUgcHJvZHVjdF9pZD0lZCBBTkQgKGF0c2F1a3RhPTAgT1IgYXRzYXVrdGEgSVMgTlVMTCkgT1JERVIgQlkgZ2F1dGEsaWQiLCRpZCksQVJSQVlfQSk7CiAgICAgICR2ZXJ0ZT0wOyBmb3JlYWNoKCRwcnQgYXMgJHopICR2ZXJ0ZSs9KGZsb2F0KSR6WydraWVraXNfbGlrbyddKihmbG9hdCkkelsnc2F2aWthaW5hX2V1ciddOwogICAgICAkc3VtYUV1cis9KCRwZXI+MD8kcGVyKigoZmxvYXQpKCRwcnRbMF1bJ3NhdmlrYWluYV9ldXInXT8/MCkpOjApOwogICAgICAkZWlsW109YXJyYXkoCiAgICAgICAgJ2lkJz0+JGlkLCdwYXYnPT5zdWJzdHIoaHRtbF9lbnRpdHlfZGVjb2RlKGdldF90aGVfdGl0bGUoJGlkKSksMCw0NiksCiAgICAgICAgJ3NrdSc9PmdldF9wb3N0X21ldGEoJGlkLCdfc2t1Jyx0cnVlKSwKICAgICAgICAnbGlrdXRpcyc9PiRzdCwncGFydGlqb3NlJz0+JHB0LCdwZXJ0ZWtsaXVzJz0+JHBlciwKICAgICAgICAndmZfcXR5Jz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ192Zl9xdHknLHRydWUpLCd6Yl9xdHknPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3piX3F0eScsdHJ1ZSksCiAgICAgICAgJ293bic9PmdldF9wb3N0X21ldGEoJGlkLCdfb3duX3N0b2NrX3F0eScsdHJ1ZSksCiAgICAgICAgJ3BhcnRpanVfdmVydGUnPT5yb3VuZCgkdmVydGUsMiksCiAgICAgICAgJ3BhcnRpam9zJz0+JHBydCwKICAgICAgKTsKICAgIH0KICAgIHVzb3J0KCRlaWwsZnVuY3Rpb24oJGEsJGIpe3JldHVybiAkYlsncGVydGVrbGl1cyddLSRhWydwZXJ0ZWtsaXVzJ107fSk7CiAgICAkb1sncGVydGVrbGl1c192bnQnXT0kc3VtYVBlcnRla2xpdXM7CiAgICAkb1snZWlsdXRlcyddPSRlaWw7CiAgICAvLyBhciB0b3MgcHJla2VzIGJ1dm8gcGFyZHVvdG9zCiAgICAkdD0kd3BkYi0+cHJlZml4Lid3Y19vcmRlcl9wcm9kdWN0X2xvb2t1cCc7CiAgICBpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJHQnIikpewogICAgICAkaWRzPWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuICR4WydpZCddO30sJGVpbCk7CiAgICAgIGlmKCRpZHMpICRvWydwYXJkYXZpbWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcHJvZHVjdF9pZCxTVU0ocHJvZHVjdF9xdHkpIHZudCxDT1VOVChESVNUSU5DVCBvcmRlcl9pZCkgdXpzIEZST00gYCR0YCBXSEVSRSBwcm9kdWN0X2lkIElOICgiLmltcGxvZGUoJywnLGFycmF5X21hcCgnaW50dmFsJywkaWRzKSkuIikgR1JPVVAgQlkgcHJvZHVjdF9pZCIsQVJSQVlfQSk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-090856';
const GKEY='ps_bla';
const PHASES=["R"];
const OUT='analize/s1683_r.json';
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
