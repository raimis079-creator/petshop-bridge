process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODUyYSByZWNvbiDigJQgVm9tIEZlaW5zdGVuIHBhdnl6ZMW+aWFpICsgRUFOIHBhdGlrcmEgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX3MxODUyJ10pPyRfR0VUWydwc19zMTg1MiddOicnKTsgaWYoJGYhPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxODUyYScpOwogICRlYW5zPWFycmF5KCc0MDE3NzIxODI5Njg3JywnNDAxNzcyMTgzNjc0NicsJzQwMTc3MjE4MzY3MzknLCc0MDE3NzIxODM2NzE1JywnNDAxNzcyMTgzNjcwOCcsJzQwMTc3MjE4MzI2MTgnKTsKICBmb3JlYWNoKCRlYW5zIGFzICRlKXsgJG9bJ2VhbiddWyRlXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2lkLG1ldGFfa2V5IEZST00geyRwfXBvc3RtZXRhIFdIRVJFIG1ldGFfdmFsdWU9JXMiLCRlKSxBUlJBWV9BKTsKICAgICRvWydzcmMnXVskZV09JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgcHJvZHVjdF9pZCxzb3VyY2Usc3RvY2tfcXR5LGNvc3RfbmV0IEZST00geyRwfXBzX3NvdXJjZXMgV0hFUkUgZWFuPSVzIiwkZSksQVJSQVlfQSk7IH0KICBmb3JlYWNoKGFycmF5KDE5NDQ2LDE5NDQwLDE5MzYxKSBhcyAkaWQpeyAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoISRwcikgY29udGludWU7CiAgICAkeD1hcnJheSgndCc9PiRwci0+Z2V0X25hbWUoKSwnc2t1Jz0+JHByLT5nZXRfc2t1KCksJ2thaW5hJz0+JHByLT5nZXRfcHJpY2UoKSwnY29zdCc9PmdldF9wb3N0X21ldGEoJGlkLCdfY29zdF9wcmljZScsdHJ1ZSksJ2Nvc3Rfc3JjJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19jb3N0X3ByaWNlX3NvdXJjZScsdHJ1ZSksJ3NhbmQnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKSwnc3ZvcmlzJz0+JHByLT5nZXRfd2VpZ2h0KCksCiAgICAgICdjYXQnPT53cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfY2F0JyxhcnJheSgnZmllbGRzJz0+J2FsbCcpKSwnYnJhbmQnPT53cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfYnJhbmQnLGFycmF5KCdmaWVsZHMnPT4naWRzJykpLAogICAgICAnYXR0cnMnPT5hcnJheV9tYXAoZnVuY3Rpb24oJHQpe3JldHVybiAkdC0+dGF4b25vbXkuJz0nLiR0LT50ZXJtX2lkLic6Jy4kdC0+bmFtZTt9LHdwX2dldF9vYmplY3RfdGVybXMoJGlkLGFycmF5X2tleXMoJHByLT5nZXRfYXR0cmlidXRlcygpKSkpLAogICAgICAnZGVzYyc9PiRwci0+Z2V0X2Rlc2NyaXB0aW9uKCksJ3Nob3J0Jz0+JHByLT5nZXRfc2hvcnRfZGVzY3JpcHRpb24oKSwnaW1nJz0+d3BfZ2V0X2F0dGFjaG1lbnRfdXJsKCRwci0+Z2V0X2ltYWdlX2lkKCkpLCdnYWwnPT5jb3VudCgkcHItPmdldF9nYWxsZXJ5X2ltYWdlX2lkcygpKSwKICAgICAgJ3JtJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ3JhbmtfbWF0aF9kZXNjcmlwdGlvbicsdHJ1ZSksJ3JtdCc9PmdldF9wb3N0X21ldGEoJGlkLCdyYW5rX21hdGhfdGl0bGUnLHRydWUpLCd5dCc9PmdldF9wb3N0X21ldGEoJGlkLCdfeW9hc3Rfd3BzZW9fdGl0bGUnLHRydWUpLAogICAgICAncGFydCc9PiR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGdhdXRhLHRpZWtlamFzLHNhdmlrYWluYV9ldXIsa2lla2lzX2dhdXRhcyBGUk9NIHskcH1wc19wYXJ0aWpvcyBXSEVSRSBwcm9kdWN0X2lkPSVkIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMiIsJGlkKSxBUlJBWV9BKSwKICAgICAgJ2ZlZWQnPT4kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGZlZWRpbmdfdGFibGVfaWQgRlJPTSB7JHB9cHNfZmVlZGluZ19tYXAgV0hFUkUgcHJvZHVjdF9pZD0lZCBBTkQgaXNfYWN0aXZlPTEiLCRpZCkpKTsKICAgICR4WydjYXQnXT1hcnJheV9tYXAoZnVuY3Rpb24oJGMpe3JldHVybiAkYy0+dGVybV9pZC4nOicuJGMtPm5hbWU7fSwkeFsnY2F0J10pOyAkb1sncmVmJ11bJGlkXT0keDsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-112914';
const GKEY='ps_s1852';
const PHASES=["GO"];
const OUT='analize/s1852_a.json';
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
