process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzkwdzIgQWRzIG51byAwOS0wOSBzdSBzaXVudHUgc2F2aWthaW5hIGlyIHBha2FydG90aW5pYWlzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc5MHcyJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgyNTApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRGPSRQLidwc19mYWt0X3V6c2FreW1haSc7ICRyPVsndic9PidTMTc5MHcyJ107CiAgdHJ5ewogICAgJHJbJ3NjJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskUH1wc19mYWt0X3NpdW50b3MiKTsKICAgICRyWydhZHNfa2FtcCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGthbXBhbmlqYV9pZCwgTUFYKGthbXBhbmlqYSkgaywgUk9VTkQoU1VNKGlzbGFpZG9zX2N0KS8xMDAsMikgZXVyLCBTVU0ocGFzcGF1ZGltYWkpIHBhc3AgRlJPTSB7JFB9cHNfZmFrdF9yZWtsYW1hIFdIRVJFIGthbmFsYXM9J2dvb2dsZV9hZHMnIEFORCBkaWVuYSBCRVRXRUVOICcyMDI2LTA5LTA5JyBBTkQgJzIwMjYtMTAtMTknIEdST1VQIEJZIGthbXBhbmlqYV9pZCIsQVJSQVlfQSk7CiAgICAkclsnYWRzX2lraV8wOTA5J109JHdwZGItPmdldF92YXIoIlNFTEVDVCBST1VORChTVU0oaXNsYWlkb3NfY3QpLzEwMCwyKSBGUk9NIHskUH1wc19mYWt0X3Jla2xhbWEgV0hFUkUga2FuYWxhcz0nZ29vZ2xlX2FkcycgQU5EIGRpZW5hPCcyMDI2LTA5LTA5JyIpOwogICAgJHJbJ2Fkc19zYXYnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBZRUFSV0VFSyhkaWVuYSwzKSB3LCBNSU4oZGllbmEpIG51bywgUk9VTkQoU1VNKGlzbGFpZG9zX2N0KS8xMDAsMikgZXVyIEZST00geyRQfXBzX2Zha3RfcmVrbGFtYSBXSEVSRSBrYW5hbGFzPSdnb29nbGVfYWRzJyBBTkQgZGllbmEgQkVUV0VFTiAnMjAyNi0wOS0wOScgQU5EICcyMDI2LTEwLTE5JyBHUk9VUCBCWSB3IixBUlJBWV9BKTsKICAgICRvaz0iKGYudGVzdGluaXM9MCBPUiBmLnRlc3RpbmlzIElTIE5VTEwpIEFORCBmLnN0YXR1c2FzX2dhbHV0aW5pcyBOT1QgSU4gKCdjYW5jZWxsZWQnLCdmYWlsZWQnLCdyZWZ1bmRlZCcsJ3BlbmRpbmcnLCd0cmFzaCcsJ2NoZWNrb3V0LWRyYWZ0JykiOwogICAgJGc9IihmLmdjbGlkPD4nJyBPUiAoZi51dG1fc291cmNlPSdnb29nbGUnIEFORCBmLnV0bV9tZWRpdW09J2NwYycpKSI7CiAgICAkc2M9JHJbJ3NjJ107ICRrYz1pbl9hcnJheSgna2FpbmFfY3QnLCRzYyk/J2thaW5hX2N0JzooaW5fYXJyYXkoJ3NhdmlrYWluYV9jdCcsJHNjKT8nc2F2aWthaW5hX2N0JzooaW5fYXJyYXkoJ2thaW5hX211bXNfY3QnLCRzYyk/J2thaW5hX211bXNfY3QnOm51bGwpKTsgJHJbJ3NpdW50dV9zdHVscCddPSRrYzsKICAgICRzaj0ka2M/IkxFRlQgSk9JTiAoU0VMRUNUIHV6c2FreW1hc19pZCwgU1VNKCRrYykgcyBGUk9NIHskUH1wc19mYWt0X3NpdW50b3MgR1JPVVAgQlkgdXpzYWt5bWFzX2lkKSBzIE9OIHMudXpzYWt5bWFzX2lkPWYudXpzYWt5bWFzX2lkIjoiIjsKICAgICRzcz0ka2M/IiwgUk9VTkQoU1VNKElGTlVMTChzLnMsMCkpLzEwMCwyKSBzaXVudHVfc2F2LCBTVU0ocy5zIElTIE5VTEwpIGJlX3NpdW50b3NfaXJhc28iOiIiOwogICAgJHNlbD0iQ09VTlQoKikgbiwgUk9VTkQoU1VNKGYudmlzb19jdCkvMTAwLDIpIHZpc28sIFJPVU5EKFNVTShmLm1hcnphX2N0KS8xMDAsMikgbWFyemEsIFJPVU5EKFNVTShmLmtvbnRyaWJ1Y2lqYV9jdCkvMTAwLDIpIGtvbnRyLCBST1VORChTVU0oZi5wcmlzdGF0eW1hc19wYWltdGFfY3QpLzEwMCwyKSBwcmlzdF9wYWltdGEsIFNVTShmLmtsaWVudGFzX25hdWphcykgbmF1amkgJHNzIjsKICAgICRyWydnb29nbGVfa2FtcCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElGKGYudXRtX2NhbXBhaWduIFJFR0VYUCAnXlswLTldKyQnLGYudXRtX2NhbXBhaWduLCcoYmUga2FtcGFuaWpvcyBJRCwgdGlrIGdjbGlkKScpIGssICRzZWwgRlJPTSAkRiBmICRzaiBXSEVSRSAkb2sgQU5EICRnIEFORCBmLmRpZW5hIEJFVFdFRU4gJzIwMjYtMDktMDknIEFORCAnMjAyNi0xMC0xOScgR1JPVVAgQlkgayIsQVJSQVlfQSk7CiAgICAkclsnZ29vZ2xlX3Zpc28nXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUICRzZWwgRlJPTSAkRiBmICRzaiBXSEVSRSAkb2sgQU5EICRnIEFORCBmLmRpZW5hIEJFVFdFRU4gJzIwMjYtMDktMDknIEFORCAnMjAyNi0xMC0xOSciLEFSUkFZX0EpOwogICAgJHJbJ3Zpc2knXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUICRzZWwgRlJPTSAkRiBmICRzaiBXSEVSRSAkb2sgQU5EIGYuZGllbmEgQkVUV0VFTiAnMjAyNi0wOS0wOScgQU5EICcyMDI2LTEwLTE5JyIsQVJSQVlfQSk7CiAgICAkclsnZ29vZ2xlX3NhdiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIFlFQVJXRUVLKGYuZGllbmEsMykgdywgJHNlbCBGUk9NICRGIGYgJHNqIFdIRVJFICRvayBBTkQgJGcgQU5EIGYuZGllbmEgQkVUV0VFTiAnMjAyNi0wOS0wOScgQU5EICcyMDI2LTEwLTE5JyBHUk9VUCBCWSB3IixBUlJBWV9BKTsKICAgIC8vIHBha2FydG90aW5pYWk6IHBpcm1hcyB1xb5zYWt5bWFzIEdvb2dsZSAtPiB2xJdsZXNuaSBiZXQga3VyaXVvIGthbmFsdQogICAgJHJbJ3Bha2FydCddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgZi5rbGllbnRhc19lbWFpbF9oYXNoKSBrbGllbnR1LCBDT1VOVCgqKSB1enMsIFJPVU5EKFNVTShmLmtvbnRyaWJ1Y2lqYV9jdCkvMTAwLDIpIGtvbnRyLCBTVU0oJGcpIGlzX2p1X3ZlbF9nb29nbGUgRlJPTSAkRiBmIEpPSU4gKFNFTEVDVCB4LmtsaWVudGFzX2VtYWlsX2hhc2ggaCwgTUlOKHguc3VrdXJ0YV9hdCkgdCBGUk9NICRGIHggV0hFUkUgKHgudGVzdGluaXM9MCBPUiB4LnRlc3RpbmlzIElTIE5VTEwpIEFORCB4LnN0YXR1c2FzX2dhbHV0aW5pcyBOT1QgSU4gKCdjYW5jZWxsZWQnLCdmYWlsZWQnLCdyZWZ1bmRlZCcsJ3BlbmRpbmcnKSBHUk9VUCBCWSB4LmtsaWVudGFzX2VtYWlsX2hhc2gpIHAgT04gcC5oPWYua2xpZW50YXNfZW1haWxfaGFzaCBBTkQgZi5zdWt1cnRhX2F0PnAudCBKT0lOICRGIGYxIE9OIGYxLmtsaWVudGFzX2VtYWlsX2hhc2g9cC5oIEFORCBmMS5zdWt1cnRhX2F0PXAudCBBTkQgKGYxLmdjbGlkPD4nJyBPUiAoZjEudXRtX3NvdXJjZT0nZ29vZ2xlJyBBTkQgZjEudXRtX21lZGl1bT0nY3BjJykpIFdIRVJFICRvayIsQVJSQVlfQSk7CiAgICAkclsnbmF1amlfZ29vZ2xlX2tsaWVudGFpJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBmLmtsaWVudGFzX2VtYWlsX2hhc2gpIEZST00gJEYgZiBXSEVSRSAkb2sgQU5EICRnIEFORCBmLmtsaWVudGFzX25hdWphcz0xIEFORCBmLmRpZW5hIEJFVFdFRU4gJzIwMjYtMDktMDknIEFORCAnMjAyNi0xMC0xOSciKTsKICAgIC8vIGJyYW5kIGthbXBhbmlqb3Mga2xpZW50YWk6IGFyIHNlbmkgKGlzdCBwaXJrxJkpCiAgICAkclsnYnJhbmRfbmF1anVtYXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBmLmtsaWVudGFzX25hdWphcywgQ09VTlQoKikgbiBGUk9NICRGIGYgV0hFUkUgJG9rIEFORCBmLnV0bV9jYW1wYWlnbj0nMjMzNDY3MTIwNzQnIEdST1VQIEJZIGYua2xpZW50YXNfbmF1amFzIixBUlJBWV9BKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsgfSk7Cg==';
const VER='dep-183121';
const GKEY='ps_s1790w2';
const PHASES=["1"];
const OUT='analize/s1790_w2.json';
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
