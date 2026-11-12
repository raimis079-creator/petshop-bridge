process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODUxZCBrYWNpdWt1L3N1bml1a3UgcGlya2VqdSBncml6aW1hcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NTFkJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgyNTApOyBAaW5pX3NldCgnbWVtb3J5X2xpbWl0JywnNTEyTScpOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTg1MWQnXTsKICB0cnl7CiAgICAkSz0ia2l0dGVufGthY2l1a3xrYcSNaXVrfGphdW5vbXMga2F0fGJhYnljYXR8YmFieSBjYXQiOwogICAgJFM9InB1cHB5fHN1bml1a3zFoXVuaXVrfGphdW5pZW1zIHN1bnxqYXVuaWVtcyDFoXVufGp1bmlvcnxraWRzfHdlbHBlbiI7CiAgICAkc3FsPSJTRUxFQ1QgbC51enNha3ltYXNfaWQgaWQsIE1JTihsLmRpZW5hKSBkLCBNRDUoTE9XRVIoVFJJTShDT0FMRVNDRShOVUxMSUYoby5iaWxsaW5nX2VtYWlsLCcnKSxwbS5tZXRhX3ZhbHVlKSkpKSBjLCBTVU0obC5rYWluYV9jdCkgY3QsCiAgICAgIE1BWChsLnBhdmFkaW5pbWFzX3R1b19tZXR1IFJFR0VYUCAnJEsnKSBrLCBNQVgobC5wYXZhZGluaW1hc190dW9fbWV0dSBSRUdFWFAgJyRTJykgcCwgTUFYKGwua2xpZW50YXNfbmF1amFzKSBuaiwgR1JPVVBfQ09OQ0FUKERJU1RJTkNUIGwuZ3l2dW5hcykgZwogICAgICBGUk9NIChTRUxFQ1QgdXpzYWt5bWFzX2lkLGRpZW5hLGthaW5hX2N0LHBhdmFkaW5pbWFzX3R1b19tZXR1LGtsaWVudGFzX25hdWphcyxneXZ1bmFzIEZST00geyRQfXBzX2lzdF9mYWt0X2VpbHV0ZXMgV0hFUkUgdGVzdGluaXM9MAogICAgICAgICAgICBVTklPTiBBTEwgU0VMRUNUIHV6c2FreW1hc19pZCxkaWVuYSxrYWluYV9jdCxwYXZhZGluaW1hc190dW9fbWV0dSxrbGllbnRhc19uYXVqYXMsZ3l2dW5hcyBGUk9NIHskUH1wc19mYWt0X2VpbHV0ZXMgV0hFUkUgdGVzdGluaXM9MCkgbAogICAgICBMRUZUIEpPSU4geyRQfXdjX29yZGVycyBvIE9OIG8uaWQ9bC51enNha3ltYXNfaWQKICAgICAgTEVGVCBKT0lOIHskUH1wb3N0bWV0YSBwbSBPTiBwbS5wb3N0X2lkPWwudXpzYWt5bWFzX2lkIEFORCBwbS5tZXRhX2tleT0nX2JpbGxpbmdfZW1haWwnCiAgICAgIEdST1VQIEJZIGwudXpzYWt5bWFzX2lkIjsKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygkc3FsLEFSUkFZX0EpOyBpZigkd3BkYi0+bGFzdF9lcnJvcikgJHJbJ3NxbGVyciddPSR3cGRiLT5sYXN0X2Vycm9yOwogICAgJHJbJ3V6cyddPWNvdW50KCRyb3dzKTsgJGJlPTA7ICRDPVtdOyAkZ3k9W107CiAgICBmb3JlYWNoKCRyb3dzIGFzICRvKXsgZm9yZWFjaChleHBsb2RlKCcsJywoc3RyaW5nKSRvWydnJ10pIGFzICRnKXsgJGd5WyRnXT0oJGd5WyRnXT8/MCkrMTsgfSBpZighJG9bJ2MnXSl7ICRiZSsrOyBjb250aW51ZTsgfSAkQ1skb1snYyddXVtdPSRvOyB9CiAgICAkclsnYmVfa2xpZW50byddPSRiZTsgJHJbJ2tsaWVudHUnXT1jb3VudCgkQyk7IGFyc29ydCgkZ3kpOyAkclsnZ3l2dW5hcyddPWFycmF5X3NsaWNlKCRneSwwLDEyLHRydWUpOwogICAgJHNlZz1mdW5jdGlvbigkbyl7ICRnPW1iX3N0cnRvbG93ZXIoKHN0cmluZykkb1snZyddKTsgaWYoJG9bJ2snXSkgcmV0dXJuICdLX2thY2l1a2FzJzsgaWYoJG9bJ3AnXSkgcmV0dXJuICdQX3N1bml1a2FzJzsKICAgICAgJGthdD0oc3RycG9zKCRnLCdrYXQnKSE9PWZhbHNlKTsgJHN1bj0oc3RycG9zKCRnLCfFoXVuJykhPT1mYWxzZXx8c3RycG9zKCRnLCdzdW4nKSE9PWZhbHNlKTsKICAgICAgaWYoJGthdCYmISRzdW4pIHJldHVybiAna2F0ZV9zdWF1Zyc7IGlmKCRzdW4mJiEka2F0KSByZXR1cm4gJ3N1b19zdWF1Zyc7IHJldHVybiAna2l0YSc7IH07CiAgICAkQT1bXTsgJG1ldGFpPVtdOwogICAgZm9yZWFjaCgkQyBhcyAkYz0+JG9zKXsgdXNvcnQoJG9zLGZ1bmN0aW9uKCRhLCRiKXsgcmV0dXJuIHN0cmNtcCgkYVsnZCddLnNwcmludGYoJyUwMTJkJywkYVsnaWQnXSksJGJbJ2QnXS5zcHJpbnRmKCclMDEyZCcsJGJbJ2lkJ10pKTsgfSk7CiAgICAgICRmPSRvc1swXTsgJHM9JHNlZygkZik7ICR5PXN1YnN0cigkZlsnZCddLDAsNCk7IGlmKCRmWyduaiddKSAkbWV0YWlbJHldWyRzXT0oJG1ldGFpWyR5XVskc10/PzApKzE7CiAgICAgIGZvcmVhY2goWyd2aXNpJz0+dHJ1ZSwndGlrX25hdWppJz0+KGJvb2wpJGZbJ25qJ11dIGFzICRyaz0+JG9rKXsgaWYoISRvaykgY29udGludWU7CiAgICAgICAgaWYoJGZbJ2QnXT4nMjAyNS0xMS0xMicpIGNvbnRpbnVlOyAvLyByZWlraWEgMzY1IGQuIHN0ZWJlamltbwogICAgICAgICRsaW09ZGF0ZSgnWS1tLWQnLHN0cnRvdGltZSgkZlsnZCddLicgKzM2NSBkYXlzJykpOyAkbj0wOyAkY3Q9MDsgJGQyPW51bGw7ICRrdD0wOwogICAgICAgIGZvcmVhY2goJG9zIGFzICRvKXsgaWYoJG9bJ2QnXTw9JGxpbSl7ICRuKys7ICRjdCs9JG9bJ2N0J107IGlmKCRuPT0yKSAkZDI9JG9bJ2QnXTsgfSB9CiAgICAgICAgJGE9JiRBWyRya11bJHNdOyBpZighJGEpICRhPVsnbic9PjAsJ2dyaXpvJz0+MCwndXpzJz0+MCwnY3QnPT4wLCdwaXJtYXNfY3QnPT4wLCczcGxpdXMnPT4wLCdkX2lraTInPT4wXTsKICAgICAgICAkYVsnbiddKys7ICRhWyd1enMnXSs9JG47ICRhWydjdCddKz0kY3Q7ICRhWydwaXJtYXNfY3QnXSs9JGZbJ2N0J107IGlmKCRuPj0yKXsgJGFbJ2dyaXpvJ10rKzsgJGFbJ2RfaWtpMiddKz0oc3RydG90aW1lKCRkMiktc3RydG90aW1lKCRmWydkJ10pKS84NjQwMDsgfSBpZigkbj49MykgJGFbJzNwbGl1cyddKys7IHVuc2V0KCRhKTsKICAgICAgfSB9CiAgICBmb3JlYWNoKCRBIGFzICRyaz0+JHNzKSBmb3JlYWNoKCRzcyBhcyAkcz0+JGEpeyAkclsncmV6J11bJHJrXVskc109WydrbGllbnR1Jz0+JGFbJ24nXSwnZ3Jpem9fcHJvYyc9PnJvdW5kKDEwMCokYVsnZ3Jpem8nXS8kYVsnbiddLDEpLCczcGxpdXNfcHJvYyc9PnJvdW5kKDEwMCokYVsnM3BsaXVzJ10vJGFbJ24nXSwxKSwndXpzX3ZpZCc9PnJvdW5kKCRhWyd1enMnXS8kYVsnbiddLDIpLCdldXJfMzY1ZF92aWQnPT5yb3VuZCgkYVsnY3QnXS8kYVsnbiddLzEwMCwxKSwncGlybWFzX2V1cl92aWQnPT5yb3VuZCgkYVsncGlybWFzX2N0J10vJGFbJ24nXS8xMDAsMSksJ2RfaWtpXzJfdmlkJz0+JGFbJ2dyaXpvJ10/cm91bmQoJGFbJ2RfaWtpMiddLyRhWydncml6byddKTpudWxsXTsgfQogICAga3NvcnQoJG1ldGFpKTsgJHJbJ25hdWppX3BhZ2FsX21ldHVzJ109JG1ldGFpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7IH0pOwo=';
const VER='dep-105151';
const GKEY='ps_s1851d';
const PHASES=["1"];
const OUT='analize/s1851_d.json';
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
