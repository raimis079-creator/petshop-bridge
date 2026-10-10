process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzY0ZCBwcm92aWRlciBrbGFzZSwgR0Qgd2VicCwgU2VuZGVyIGxhaXNrdSBraWVraXMsIGtsaWVudHUgcGFzdG8gZG9tZW5haSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NjRkJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxMjApOyAkcj1bJ3YnPT4nUzE3NjRkJ107IGdsb2JhbCAkd3BkYjsKICB0cnl7CiAgJHA9YXBwbHlfZmlsdGVycygncGV0c2hvcF9lbWFpbF9wcm92aWRlcicsbnVsbCk7ICRyWydwcm92aWRlciddPWlzX29iamVjdCgkcCk/Z2V0X2NsYXNzKCRwKTpnZXR0eXBlKCRwKTsKICBpZihpc19vYmplY3QoJHApKXsgJHJjPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJHApOyAkclsncHJvdmlkZXJfZmFpbGFzJ109c3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkcmMtPmdldEZpbGVOYW1lKCkpOyAkclsncHJvdmlkZXJfaW50ZXJmYWNlcyddPSRyYy0+Z2V0SW50ZXJmYWNlTmFtZXMoKTsgJHJbJ3Byb3ZpZGVyX2ZpbmFsJ109JHJjLT5pc0ZpbmFsKCk7ICRyWydwcm92aWRlcl9tZXRvZGFpJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCRtKXsgcmV0dXJuICRtLT5nZXROYW1lKCkuJygnLmltcGxvZGUoJywnLGFycmF5X21hcChmdW5jdGlvbigkcHApeyByZXR1cm4gKCRwcC0+aGFzVHlwZSgpPyRwcC0+Z2V0VHlwZSgpLicgJzonJykuJyQnLiRwcC0+Z2V0TmFtZSgpLigkcHAtPmlzT3B0aW9uYWwoKT8nPSc6JycpOyB9LCRtLT5nZXRQYXJhbWV0ZXJzKCkpKS4nKSc7IH0sYXJyYXlfZmlsdGVyKCRyYy0+Z2V0TWV0aG9kcyhSZWZsZWN0aW9uTWV0aG9kOjpJU19QVUJMSUMpLGZ1bmN0aW9uKCRtKXtyZXR1cm4gISRtLT5pc1N0YXRpYygpO30pKTsgfQogIGlmKGludGVyZmFjZV9leGlzdHMoJ1BldHNob3BfTWVzc2FnZV9Qcm92aWRlcicpKXsgJHJpPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfTWVzc2FnZV9Qcm92aWRlcicpOyAkclsnaW50ZXJmYWNlX21ldG9kYWknXT1hcnJheV9tYXAoZnVuY3Rpb24oJG0pe3JldHVybiAkbS0+Z2V0TmFtZSgpO30sJHJpLT5nZXRNZXRob2RzKCkpOyB9CiAgZ2xvYmFsICR3cF9maWx0ZXI7ICRyWydwcm92aWRlcl9maWx0cmFpJ109W107IGlmKGlzc2V0KCR3cF9maWx0ZXJbJ3BldHNob3BfZW1haWxfcHJvdmlkZXInXSkpIGZvcmVhY2goJHdwX2ZpbHRlclsncGV0c2hvcF9lbWFpbF9wcm92aWRlciddLT5jYWxsYmFja3MgYXMgJHByaW89PiRjYnMpIGZvcmVhY2goJGNicyBhcyAkY2IpeyAkZj0kY2JbJ2Z1bmN0aW9uJ107ICRyWydwcm92aWRlcl9maWx0cmFpJ11bXT0kcHJpby4nICcuKGlzX2FycmF5KCRmKT8oaXNfb2JqZWN0KCRmWzBdKT9nZXRfY2xhc3MoJGZbMF0pOiRmWzBdKS4nOjonLiRmWzFdOihpc19zdHJpbmcoJGYpPyRmOidjbG9zdXJlJykpOyB9CiAgJGdpPWZ1bmN0aW9uX2V4aXN0cygnZ2RfaW5mbycpP2dkX2luZm8oKTpbXTsgJHJbJ2dkJ109Wyd3ZWJwX3JlYWQnPT5mdW5jdGlvbl9leGlzdHMoJ2ltYWdlY3JlYXRlZnJvbXdlYnAnKSwnd2VicCc9PiRnaVsnV2ViUCBTdXBwb3J0J10/P251bGwsJ2pwZWcnPT4kZ2lbJ0pQRUcgU3VwcG9ydCddPz9udWxsLCd2ZXInPT4kZ2lbJ0dEIFZlcnNpb24nXT8/bnVsbF07CiAgJHQ9JHdwZGItPnByZWZpeC4ncHNfZW1haWxfam9icyc7ICRyWydzZW5kZXJfbnVvXzA5MTAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBmbG93LCBDT1VOVCgqKSBuIEZST00gJHQgV0hFUkUgc3RhdHVzPSdzZW50JyBBTkQgY3JlYXRlZF9hdD49JzIwMjYtMDktMTAnIEdST1VQIEJZIGZsb3cgT1JERVIgQlkgbiBERVNDIixBUlJBWV9BKTsKICAkclsnc2VuZGVyXzdkJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQgV0hFUkUgc3RhdHVzPSdzZW50JyBBTkQgY3JlYXRlZF9hdD49REFURV9TVUIoTk9XKCksSU5URVJWQUwgNyBEQVkpIik7CiAgLy8ga2xpZW50dSBlbC4gcGFzdG8gZG9tZW5haSAodW5pa2FsdXMgYWRyZXNhaSwgdXpzYWt5bWFpIG51byAwOS0wNyksIHRpayBkb21lbnUgZ3J1cGVzCiAgJGVtPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgTE9XRVIoYmlsbGluZ19lbWFpbCkgRlJPTSB7JHdwZGItPnByZWZpeH13Y19vcmRlcl9hZGRyZXNzZXMgYSBKT0lOIHskd3BkYi0+cHJlZml4fXdjX29yZGVycyBvIE9OIG8uaWQ9YS5vcmRlcl9pZCBXSEVSRSBhLmFkZHJlc3NfdHlwZT0nYmlsbGluZycgQU5EIG8udHlwZT0nc2hvcF9vcmRlcicgQU5EIG8uZGF0ZV9jcmVhdGVkX2dtdD49JzIwMjYtMDktMDcnIEFORCBvLnN0YXR1cyBJTiAoJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnLCd3Yy1vbi1ob2xkJykiKTsKICBpZighJGVtKSAkZW09JHdwZGItPmdldF9jb2woIlNFTEVDVCBESVNUSU5DVCBMT1dFUihlbWFpbCkgRlJPTSB7JHdwZGItPnByZWZpeH13Y19vcmRlcl9hZGRyZXNzZXMgV0hFUkUgYWRkcmVzc190eXBlPSdiaWxsaW5nJyIpOwogICRnPVsnZ21haWwnPT4wLCdvdXRsb29rL2hvdG1haWwvbGl2ZSc9PjAsJ3lhaG9vJz0+MCwnaWNsb3VkL21lJz0+MCwnaW5ib3gubHQnPT4wLCdraXRpIChpbW9uaXUsIG9uZS5sdCBpciBrdC4pJz0+MF07ICR0b3A9W107CiAgZm9yZWFjaCgkZW0gYXMgJGUpeyAkZD1zdWJzdHIoc3RycmNocigkZSwnQCcpLDEpOyBpZighJGQpIGNvbnRpbnVlOyAkdG9wWyRkXT0oJHRvcFskZF0/PzApKzE7CiAgICBpZihwcmVnX21hdGNoKCcvXihnbWFpbHxnb29nbGVtYWlsKVwuLycsJGQpKSAkZ1snZ21haWwnXSsrOyBlbHNlaWYocHJlZ19tYXRjaCgnL14ob3V0bG9va3xob3RtYWlsfGxpdmV8bXNuKVwuLycsJGQpKSAkZ1snb3V0bG9vay9ob3RtYWlsL2xpdmUnXSsrOyBlbHNlaWYoc3RycG9zKCRkLCd5YWhvby4nKT09PTApICRnWyd5YWhvbyddKys7IGVsc2VpZihwcmVnX21hdGNoKCcvXihpY2xvdWR8bWV8bWFjKVwuY29tJC8nLCRkKSkgJGdbJ2ljbG91ZC9tZSddKys7IGVsc2VpZigkZD09PSdpbmJveC5sdCcpICRnWydpbmJveC5sdCddKys7IGVsc2UgJGdbJ2tpdGkgKGltb25pdSwgb25lLmx0IGlyIGt0LiknXSsrOyB9CiAgYXJzb3J0KCR0b3ApOyAkclsnZG9tZW5haSddPVsndW5pa2FsaXUnPT5jb3VudCgkZW0pLCdncnVwZXMnPT4kZywndG9wX3ZpZXNpZWppJz0+YXJyYXlfc2xpY2UoYXJyYXlfZmlsdGVyKCR0b3AsZnVuY3Rpb24oJG4sJGQpeyByZXR1cm4gcHJlZ19tYXRjaCgnL14oZ21haWx8Z29vZ2xlbWFpbHxvdXRsb29rfGhvdG1haWx8bGl2ZXxtc258eWFob298aWNsb3VkfG1lfGluYm94fG9uZXx0YWthc3xtYWlsfHplYnJhfGRlbGZpfHNwbGl1c3xjZW50cmFzfHBvc3R8Z214fHlhbmRleClcLi8nLCRkKTsgfSxBUlJBWV9GSUxURVJfVVNFX0JPVEgpLDAsMTIsdHJ1ZSldOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0pOwo=';
const VER='dep-164304';
const GKEY='ps_s1764d';
const PHASES=["1"];
const OUT='out/s1764d.json';
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
