process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzk1cmYgcmVmaWxsIGFuYWxpemUgbnVvIG1pZ3JhY2lqb3MgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzk1cmYnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE1MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzk1cmYnXTsKICB0cnl7CiAgJHJbJ2VqX2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRQfXBzX2VtYWlsX2pvYnMiKTsKICAkclsncmVmaWxsX2xlbnQnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyRQfXBzX3JlZmlsbCUnIik7CiAgZm9yZWFjaCgkclsncmVmaWxsX2xlbnQnXSBhcyAkdCl7ICRyWydsZW50J11bJHRdPVsnY29scyc9PiR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkdCIpLCduJz0+JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0IildOyB9CiAgJHJbJ2Zsb3dzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZmxvdyxzdGF0dXMsQ09VTlQoKikgbixNSU4oY3JlYXRlZF9hdCkgbnVvIEZST00geyRQfXBzX2VtYWlsX2pvYnMgV0hFUkUgZmxvdyBMSUtFICclcmVmaWxsJScgR1JPVVAgQlkgZmxvdyxzdGF0dXMiLEFSUkFZX0EpOwogICRvaz0iKGYudGVzdGluaXM9MCBPUiBmLnRlc3RpbmlzIElTIE5VTEwpIEFORCBmLnN0YXR1c2FzX2dhbHV0aW5pcyBOT1QgSU4gKCdjYW5jZWxsZWQnLCdmYWlsZWQnLCdyZWZ1bmRlZCcsJ3BlbmRpbmcnLCd0cmFzaCcsJ2NoZWNrb3V0LWRyYWZ0JykiOwogIC8vIHNpdXN0aSByZWZpbGwgbGFpc2thaQogICRqb2JzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHJlY2lwaWVudF9lbWFpbCBlbSxzZW50X2F0LGNsaWNrZWRfYXQsb3JkZXJfaWQgRlJPTSB7JFB9cHNfZW1haWxfam9icyBXSEVSRSBmbG93IExJS0UgJ3JlZmlsbCUnIEFORCBzdGF0dXM9J3NlbnQnIE9SREVSIEJZIHNlbnRfYXQiLEFSUkFZX0EpOwogICRyWydzaXVzdGEnXT1jb3VudCgkam9icyk7CiAgJHBlcj1bXTsgJHBpcmt0YT1bXTsgCiAgZm9yZWFjaCgkam9icyBhcyAkail7ICR3az1kYXRlKCdZLW0tZCcsc3RydG90aW1lKCdtb25kYXkgdGhpcyB3ZWVrJyxzdHJ0b3RpbWUoJGpbJ3NlbnRfYXQnXSkpKTsgJHBlclskd2tdWydzaXVzdGEnXT0oJHBlclskd2tdWydzaXVzdGEnXT8/MCkrMTsKICAgICRvPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgZi51enNha3ltYXNfaWQgaWQsZi5kaWVuYSxmLnZpc29fY3QsZi5rb250cmlidWNpamFfY3QsZi51dG1fc291cmNlLGYudXRtX2NhbXBhaWduLGYua2FuYWxhc19wYXNrdXRpbmlzIGthbixvLmRhdGVfY3JlYXRlZF9nbXQgZHQgRlJPTSB7JFB9cHNfZmFrdF91enNha3ltYWkgZiBKT0lOIHskUH13Y19vcmRlcnMgbyBPTiBvLmlkPWYudXpzYWt5bWFzX2lkIFdIRVJFICRvayBBTkQgby5iaWxsaW5nX2VtYWlsPSVzIEFORCBvLmRhdGVfY3JlYXRlZF9nbXQ+JXMgQU5EIG8uZGF0ZV9jcmVhdGVkX2dtdDw9REFURV9BREQoJXMsSU5URVJWQUwgMTQgREFZKSBPUkRFUiBCWSBvLmRhdGVfY3JlYXRlZF9nbXQgTElNSVQgMSIsJGpbJ2VtJ10sJGpbJ3NlbnRfYXQnXSwkalsnc2VudF9hdCddKSxBUlJBWV9BKTsKICAgIGlmKCRvKXsgJHdvPXdjX2dldF9vcmRlcigkb1snaWQnXSk7ICRkPShzdHJ0b3RpbWUoJG9bJ2R0J10pLXN0cnRvdGltZSgkalsnc2VudF9hdCddKSkvODY0MDA7ICRwZXJbJHdrXVsncGlya28xNCddPSgkcGVyWyR3a11bJ3BpcmtvMTQnXT8/MCkrMTsgaWYoJGQ8PTcpICRwZXJbJHdrXVsncGlya283J109KCRwZXJbJHdrXVsncGlya283J10/PzApKzE7CiAgICAgICRwaXJrdGFbXT1bJ2pvYic9PiRqWydpZCddLCducic9PiR3bz8kd28tPmdldF9vcmRlcl9udW1iZXIoKTokb1snaWQnXSwncG9fZCc9PnJvdW5kKCRkLDEpLCdldXInPT4kb1sndmlzb19jdCddLzEwMCwna29udHInPT4kb1sna29udHJpYnVjaWphX2N0J10vMTAwLCd1dG0nPT4kb1sndXRtX3NvdXJjZSddLicvJy4kb1sndXRtX2NhbXBhaWduJ10sJ2thbic9PiRvWydrYW4nXSwnY2xpY2snPT4kalsnY2xpY2tlZF9hdCddPzE6MCwnc2VudCc9PnN1YnN0cigkalsnc2VudF9hdCddLDAsMTApXTsgfQogICAgaWYoJGpbJ2NsaWNrZWRfYXQnXSkgJHBlclskd2tdWydjbGljayddPSgkcGVyWyR3a11bJ2NsaWNrJ10/PzApKzE7CiAgfQogIGtzb3J0KCRwZXIpOyAkclsnc2F2YWl0ZXMnXT0kcGVyOyAkclsncGlya28nXT0kcGlya3RhOwogICRyWyd1dG1fdXpzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZi5kaWVuYSxmLnV6c2FreW1hc19pZCxmLnZpc29fY3QvMTAwIGV1cixmLnV0bV9zb3VyY2UsZi51dG1fY2FtcGFpZ24sZi51dG1fbWVkaXVtIEZST00geyRQfXBzX2Zha3RfdXpzYWt5bWFpIGYgV0hFUkUgJG9rIEFORCAoZi51dG1fY2FtcGFpZ24gTElLRSAnJXJlZmlsbCUnIE9SIGYudXRtX2NvbnRlbnQgTElLRSAnJXJlZmlsbCUnKSBPUkRFUiBCWSBmLmRpZW5hIixBUlJBWV9BKTsKICAvLyBob2xkb3V0CiAgaWYoaW5fYXJyYXkoJFAuJ3BzX3JlZmlsbF90cmFja2luZycsJHJbJ3JlZmlsbF9sZW50J10pKXsgJHJbJ3RyYWNraW5nX3NhbXBsZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JFB9cHNfcmVmaWxsX3RyYWNraW5nIE9SREVSIEJZIDEgREVTQyBMSU1JVCAzIixBUlJBWV9BKTsgfQogICRyWydvcHQnXT1bJ2hvbGRvdXQnPT5nZXRfb3B0aW9uKCdwc19yZWZpbGxfaG9sZG91dCcpLCdudXN0Jz0+Z2V0X29wdGlvbigncGV0c2hvcF9yZWZpbGxfc2V0dGluZ3MnKV07CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydFUlInXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0OyB9KTsK';
const VER='dep-163928';
const GKEY='ps_s1795rf';
const PHASES=["1"];
const OUT='analize/s1795_rf.json';
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
