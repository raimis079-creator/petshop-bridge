process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI3bWQgcmVhZC1vbmx5OiAyLjMgbWnFoXJpb3Mgc2l1bnRvcywgRkJUIMWhdW7FsyBzYXVzYW0gbWFpc3R1aSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MjdtZCddKSkgcmV0dXJuOyAkZj0kX0dFVFsncHNfczE3MjdtZCddOyAkcj1bJ3YnPT4nUzE3MjdtZCcsJ2YnPT4kZl07IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgQHNldF90aW1lX2xpbWl0KDE3MCk7CiAgdHJ5ewogICAgaWYoJGY9PT0nMScpewogICAgICAkclsnc2l1bnRvc19jb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskUH1wc19mYWt0X3NpdW50b3MiKTsKICAgICAgJHJbJ21pc3J1cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG8ubWlzcnVzLCBvLnNhbmRlbGl1X2tpZWtpcyBzaywgQ09VTlQoKikgbiwgUk9VTkQoQVZHKG8udmlzb19jdCkvMTAwLDIpIGFvdiwgUk9VTkQoQVZHKG8ua29udHJpYnVjaWphX2N0KS8xMDAsMikga29udHIgRlJPTSB7JFB9cHNfZmFrdF91enNha3ltYWkgbyBXSEVSRSBvLnRlc3RpbmlzPTAgQU5EIG8uYXBtb2tldGFfYXQgSVMgTk9UIE5VTEwgR1JPVVAgQlkgby5taXNydXMsIG8uc2FuZGVsaXVfa2lla2lzIixBUlJBWV9BKTsKICAgICAgJHJbJ3NpdW50dV9wZXJfdXpzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgeC5uIHNpdW50b3MsIENPVU5UKCopIHV6cyBGUk9NIChTRUxFQ1Qgby51enNha3ltYXNfaWQsIChTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cHNfZmFrdF9zaXVudG9zIHMgV0hFUkUgcy51enNha3ltYXNfaWQ9by51enNha3ltYXNfaWQgQU5EIENPQUxFU0NFKHMuc3RhdHVzYXMsJycpPD4nYXRzYXVrdGEnKSBuIEZST00geyRQfXBzX2Zha3RfdXpzYWt5bWFpIG8gV0hFUkUgby50ZXN0aW5pcz0wIEFORCBvLmFwbW9rZXRhX2F0IElTIE5PVCBOVUxMKSB4IEdST1VQIEJZIHgubiIsQVJSQVlfQSk7CiAgICAgICRyWydtaXNydXNfcHZ6J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgby51enNha3ltYXNfaWQsIG8uc2FuZGVsaWFpLCBvLnZlemVqYWksIG8udmlzb19jdCwgKFNFTEVDVCBHUk9VUF9DT05DQVQoQ09OQ0FUKENPQUxFU0NFKHMuc2FuZGVsaXMsJycpLCc6JyxDT0FMRVNDRShzLmthaW5hX3ZlemVqb19jdCwnJykpIFNFUEFSQVRPUiAnLCcpIEZST00geyRQfXBzX2Zha3Rfc2l1bnRvcyBzIFdIRVJFIHMudXpzYWt5bWFzX2lkPW8udXpzYWt5bWFzX2lkKSBzaXVudG9zIEZST00geyRQfXBzX2Zha3RfdXpzYWt5bWFpIG8gV0hFUkUgby50ZXN0aW5pcz0wIEFORCBvLmFwbW9rZXRhX2F0IElTIE5PVCBOVUxMIEFORCBvLm1pc3J1cz0xIExJTUlUIDE1IixBUlJBWV9BKTsKICAgICAgJHJbJ2tlbGlhc19yZWFzb24nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtLm1ldGFfdmFsdWUgcmVhc29uLCBDT1VOVCgqKSBuIEZST00geyRQfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIG0gSk9JTiB7JFB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbXMgaSBPTiBpLm9yZGVyX2l0ZW1faWQ9bS5vcmRlcl9pdGVtX2lkIEpPSU4geyRQfXdjX29yZGVycyBvIE9OIG8uaWQ9aS5vcmRlcl9pZCBXSEVSRSBvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTA5LTA3IDE5OjA3OjAwJyBBTkQgby5zdGF0dXMgSU4gKCd3Yy1wcm9jZXNzaW5nJywnd2MtY29tcGxldGVkJykgQU5EIG0ubWV0YV9rZXk9J19wc19zb3VyY2VfcmVhc29uJyBHUk9VUCBCWSBtLm1ldGFfdmFsdWUgT1JERVIgQlkgbiBERVNDIExJTUlUIDIwIixBUlJBWV9BKTsKICAgIH0KICAgIGlmKCRmPT09JzInKXsKICAgICAgJGluc3Q9bnVsbDsgZ2xvYmFsICR3cF9maWx0ZXI7IGZvcmVhY2goWyd3b29jb21tZXJjZV9hZnRlcl9hZGRfdG9fY2FydF9mb3JtJywnd29vY29tbWVyY2Vfc2luZ2xlX3Byb2R1Y3Rfc3VtbWFyeScsJ3dvb2NvbW1lcmNlX2FmdGVyX2NhcnRfdGFibGUnXSBhcyAkaCkgZm9yZWFjaCgoJHdwX2ZpbHRlclskaF0tPmNhbGxiYWNrcz8/W10pIGFzICRwcj0+JGNicyl7IGZvcmVhY2goJGNicyBhcyAkY2IpeyBpZihpc19hcnJheSgkY2JbJ2Z1bmN0aW9uJ10pICYmIGlzX29iamVjdCgkY2JbJ2Z1bmN0aW9uJ11bMF0pICYmIGdldF9jbGFzcygkY2JbJ2Z1bmN0aW9uJ11bMF0pPT09J1BldHNob3BfRkJUJykgJGluc3Q9JGNiWydmdW5jdGlvbiddWzBdOyB9IH0KICAgICAgJHRvcD0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBlLnByZWtlX2lkIHBpZCwgQ09VTlQoRElTVElOQ1QgZS51enNha3ltYXNfaWQpIHUsIE1BWChlLnBhdmFkaW5pbWFzX3R1b19tZXR1KSBwYXYsIE1BWChlLmthdGVnb3JpanVfa2VsaWFzKSBrIEZST00geyRQfXBzX2Zha3RfZWlsdXRlcyBlIFdIRVJFIGUudGVzdGluaXM9MCBBTkQgKGUua2F0ZWdvcmlqdV9rZWxpYXMgTElLRSAnJXNhdXNhcy1tYWlzdGFzLXN1bmltcyUnIE9SIGUua2F0ZWdvcmlqdV9rZWxpYXMgTElLRSAnJXNhdXNhcy1tYWlzdGFzLWthdGVtcyUnKSBHUk9VUCBCWSBlLnByZWtlX2lkIE9SREVSIEJZIHUgREVTQyBMSU1JVCAxMCIsQVJSQVlfQSk7CiAgICAgICRnYz1uZXcgUmVmbGVjdGlvbk1ldGhvZCgkaW5zdCwnZ2V0X2NvbXBhbmlvbnMnKTsgJGdjLT5zZXRBY2Nlc3NpYmxlKHRydWUpOyAkc289bmV3IFJlZmxlY3Rpb25NZXRob2QoJGluc3QsJ3NvdXJjZV9vZicpOyAkc28tPnNldEFjY2Vzc2libGUodHJ1ZSk7ICRkZj1uZXcgUmVmbGVjdGlvbk1ldGhvZCgkaW5zdCwnZGlzY291bnRfZm9yJyk7ICRkZi0+c2V0QWNjZXNzaWJsZSh0cnVlKTsgJHBjPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCRpbnN0LCdwcm9kdWN0X2NhdF9zbHVncycpOyAkcGMtPnNldEFjY2Vzc2libGUodHJ1ZSk7CiAgICAgIGZvcmVhY2goJHRvcCBhcyAkdCl7ICRwaWQ9KGludCkkdFsncGlkJ107ICRjPSRnYy0+aW52b2tlKCRpbnN0LCRwaWQpOyAkbD1bXTsgZm9yZWFjaChhcnJheV9zbGljZSgoYXJyYXkpJGMsMCw2KSBhcyAkY2lkKXsgJGNpZD1pc19hcnJheSgkY2lkKT8oJGNpZFsnaWQnXT8/cmVzZXQoJGNpZCkpOiRjaWQ7ICRjcF89d2NfZ2V0X3Byb2R1Y3QoJGNpZCk7IGlmKCEkY3BfKSBjb250aW51ZTsgJGxbXT0kY2lkLicgJy5tYl9zdWJzdHIoJGNwXy0+Z2V0X25hbWUoKSwwLDQ1KS4nICcuJGNwXy0+Z2V0X3ByaWNlKCkuJyBzcmM9Jy5qc29uX2VuY29kZSgkc28tPmludm9rZSgkaW5zdCwkY2lkKSkuJyAtJy4kZGYtPmludm9rZSgkaW5zdCwkY3BfKS4nJSc7IH0KICAgICAgICAkclsncCddW109WydwaWQnPT4kcGlkLCdwYXYnPT5tYl9zdWJzdHIoJHRbJ3BhdiddLDAsNjApLCd1Jz0+JHRbJ3UnXSwnc3JjJz0+JHNvLT5pbnZva2UoJGluc3QsJHBpZCksJ2NhdHMnPT4kcGMtPmludm9rZSgkaW5zdCwkcGlkKSwnY29tcCc9PiRsXTsgfQogICAgICAvLyBrb25zZXJ2xbMga2F0ZWdvcmlqb3Mgc2x1ZydhaSDigJQgYXIgcGF0ZW5rYSDEryBwb3JhcwogICAgICAkclsnYW5pbW9uZGFfY2F0cyddPSRwYy0+aW52b2tlKCRpbnN0LDE5Mzk2KTsgJHJbJ21pYW1vcl9kcmlua19jYXRzJ109JHBjLT5pbnZva2UoJGluc3QsMTgzNjkpOwogICAgICAvLyBzcmNfb2YgQVYgc2thbsSXc3RhbXMKICAgICAgZm9yZWFjaChbMTYyOTgsMTg2NTUsMTYzMDUsMTkwOTgsMTg2MzksMTg2NDcsMTc0ODEsMTc0NzgsMTc0NzVdIGFzICR4KSAkclsnc2thbl9zcmMnXVskeF09JHNvLT5pbnZva2UoJGluc3QsJHgpOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-182310';
const GKEY='ps_s1727md';
const PHASES=["1", "2"];
const OUT='analize/s1727_md.json';
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
