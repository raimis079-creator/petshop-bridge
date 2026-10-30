process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA3YW4gcmVsYXVuY2ggTDIgYW5hbGl6xJcgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODA3YW4nXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE2MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJEs9JFAuJ3BzX3JlbGF1bmNoX2tvbnRha3RhaSc7ICRyPVsndic9PidhbicsJ2RhYmFyJz0+Y3VycmVudF90aW1lKCdteXNxbCcpXTsKICAkbnVvPVsnMmEnPT4nMjAyNi0xMC0yOCAxNjoyNTowMCcsJ0gyYSc9PicyMDI2LTEwLTI4IDE2OjI1OjAwJywnMmInPT4nMjAyNi0xMC0yOSAwODowODowMCcsJ0gyYic9PicyMDI2LTEwLTI5IDA4OjA4OjAwJywnMmMnPT4nMjAyNi0xMC0yOSAxNjo1MTowMCcsJ0gyYyc9PicyMDI2LTEwLTI5IDE2OjUxOjAwJywnMSc9PicyMDI2LTA5LTMwIDA5OjQwOjAwJ107CiAgZm9yZWFjaCgkbnVvIGFzICRiPT4kdCl7CiAgICAkcm93PSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgbiwgU1VNKGF0aWRhcmVfbj4wKSBhdGlkLCBTVU0oa2xpa19uPjApIGtsaWssIFNVTShwcmltaW5rX2F0Pj0lcykgcHJpbSBGUk9NICRLIFdIRVJFIGJhbmdhPSVzIiwkdCwkYiksQVJSQVlfQSk7CiAgICAkbz0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKERJU1RJTkNUIG8uaWQpIHV6cywgQ09VTlQoRElTVElOQ1QgTE9XRVIoby5iaWxsaW5nX2VtYWlsKSkgcGlyaywgUk9VTkQoU1VNKG8udG90YWxfYW1vdW50KSwyKSBldXIgRlJPTSAkSyBrIEpPSU4geyRQfXdjX29yZGVycyBvIE9OIExPV0VSKG8uYmlsbGluZ19lbWFpbCk9TE9XRVIoay5lbWFpbCkgV0hFUkUgay5iYW5nYT0lcyBBTkQgby50eXBlPSdzaG9wX29yZGVyJyBBTkQgby5zdGF0dXMgSU4oJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnLCd3Yy1vbi1ob2xkJykgQU5EIG8uZGF0ZV9jcmVhdGVkX2dtdD49JXMiLCRiLCR0KSxBUlJBWV9BKTsKICAgICRyWydiJ11bJGJdPSRyb3crJG87IH0KICAkclsnZF9wYXNpcmlua2ltYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBiYW5nYSxwYXNrX3V0bSxDT1VOVCgqKSBuIEZST00gJEsgV0hFUkUgYmFuZ2EgSU4oJzJhJywnMmInLCcyYycpIEFORCBwYXNrX3V0bSBMSUtFICdwcmltaW5rJScgQU5EIHByaW1pbmtfYXQgSVMgTk9UIE5VTEwgR1JPVVAgQlkgYmFuZ2EscGFza191dG0iLEFSUkFZX0EpOwogICRyWydrbGlrX3V0bSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBhc2tfdXRtLENPVU5UKCopIG4gRlJPTSAkSyBXSEVSRSBiYW5nYSBJTignMmEnLCcyYicsJzJjJykgQU5EIGtsaWtfbj4wIEdST1VQIEJZIHBhc2tfdXRtIE9SREVSIEJZIG4gREVTQyIsQVJSQVlfQSk7CiAgLy8gdcW+c2FreW1haSBkZXRhbGlhaSAoZ2F2xJdqYWkpCiAgJHJbJ3V6c19kZXQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBrLmJhbmdhLGsuaGVyb19yZWFzb24sby5pZCxST1VORChvLnRvdGFsX2Ftb3VudCwyKSBldXIsby5kYXRlX2NyZWF0ZWRfZ210LGsua2xpa19uLGsuYXRpZGFyZV9uIEZST00gJEsgayBKT0lOIHskUH13Y19vcmRlcnMgbyBPTiBMT1dFUihvLmJpbGxpbmdfZW1haWwpPUxPV0VSKGsuZW1haWwpIFdIRVJFIGsuYmFuZ2EgSU4oJzJhJywnMmInLCcyYycsJ0gyYScsJ0gyYicsJ0gyYycpIEFORCBvLnR5cGU9J3Nob3Bfb3JkZXInIEFORCBvLnN0YXR1cyBJTignd2MtcHJvY2Vzc2luZycsJ3djLWNvbXBsZXRlZCcsJ3djLW9uLWhvbGQnKSBBTkQgby5kYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0xMC0yOCAxNjoyNTowMCcgT1JERVIgQlkgby5pZCIsQVJSQVlfQSk7CiAgZm9yZWFjaCgkclsndXpzX2RldCddIGFzICYkdSl7ICRvbz13Y19nZXRfb3JkZXIoJHVbJ2lkJ10pOyAkdVsnc3JjJ109JG9vPygkb28tPmdldF9tZXRhKCdfd2Nfb3JkZXJfYXR0cmlidXRpb25fdXRtX3NvdXJjZScpPzokb28tPmdldF9tZXRhKCdfd2Nfb3JkZXJfYXR0cmlidXRpb25fc291cmNlX3R5cGUnKSk6bnVsbDsgJHVbJ3ByZWtlcyddPSRvbz9tYl9zdWJzdHIoaW1wbG9kZSgnOyAnLGFycmF5X21hcChmdW5jdGlvbigkaSl7cmV0dXJuICRpLT5nZXRfbmFtZSgpO30sJG9vLT5nZXRfaXRlbXMoKSkpLDAsOTApOm51bGw7IH0gdW5zZXQoJHUpOwogIC8vIGJhemluaXM6IGtpZWsgxaFpZSDFvm1vbsSXcyBwaXJrZGF2byBwZXIgMiBkLiAoaXN0b3JpxaFrYWkpIOKAlCBwaXJraW3FsyBkYcW+bmlzIHBlciAzMCBkLiBwcmllxaEgbGFpxaFrxIUgbmF1am9qZSBzdmV0YWluxJdqZSA9IDAgKGF0cmlua3RpIG5lcGlya8SZKS4gQmF6xJc6IEwxIEggZ3J1cMSXIG5ldHVyaW07IGltYW0gdmlzxbMgbmVwYXNpZWtpYW3FsyAoYmFuZ2EgTlVMTCwgdG9zIHBhxI1pb3MgZ3J1cMSXcykgcGlya2ltdXMgcGVyIHTEhSBwYXTEryBsYWlrb3RhcnDErwogICRyWyduZXNpdXN0aV9waXJraW1haSddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoKikgbiwgKFNFTEVDVCBDT1VOVChESVNUSU5DVCBMT1dFUihvLmJpbGxpbmdfZW1haWwpKSBGUk9NICRLIGsyIEpPSU4geyRQfXdjX29yZGVycyBvIE9OIExPV0VSKG8uYmlsbGluZ19lbWFpbCk9TE9XRVIoazIuZW1haWwpIFdIRVJFIGsyLmJhbmdhIElTIE5VTEwgQU5EIGsyLmhlcm9fcmVhc29uIElOKCdyZWNlbnRfZXhhY3QnLCdyZXBlYXRfZXhhY3QnLCdvbGRfcHVyY2hhc2UnKSBBTkQgby50eXBlPSdzaG9wX29yZGVyJyBBTkQgby5zdGF0dXMgSU4oJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnLCd3Yy1vbi1ob2xkJykgQU5EIG8uZGF0ZV9jcmVhdGVkX2dtdD49JzIwMjYtMTAtMjggMTY6MjU6MDAnKSBwaXJrIEZST00gJEsgV0hFUkUgYmFuZ2EgSVMgTlVMTCBBTkQgaGVyb19yZWFzb24gSU4oJ3JlY2VudF9leGFjdCcsJ3JlcGVhdF9leGFjdCcsJ29sZF9wdXJjaGFzZScpIixBUlJBWV9BKTsKICAvLyBTZW5kZXIgYXRzaXNha3ltYWkgcGFnYWwgYmFuZ8SFCiAgJHRvaz1QZXRzaG9wX1NlbmRlcl9BZGFwdGVyOjpnZXRfc3RvcmVkX3Rva2VuKCdtYXJrZXRpbmcnKTsgJGVtPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIExPV0VSKGVtYWlsKSBlLGJhbmdhLGhlcm9fcmVhc29uIEZST00gJEsgV0hFUkUgYmFuZ2EgSU4oJzEnLCcyYScsJzJiJywnMmMnKSIsT0JKRUNUX0spOwogICRzdD1bXTsgJHBnPTE7IGRveyAkeD13cF9yZW1vdGVfZ2V0KCdodHRwczovL2FwaS5zZW5kZXIubmV0L3YyL3N1YnNjcmliZXJzP2xpbWl0PTEwMCZwYWdlPScuJHBnLFsndGltZW91dCc9PjI1LCdoZWFkZXJzJz0+WydBdXRob3JpemF0aW9uJz0+J0JlYXJlciAnLiR0b2ssJ0FjY2VwdCc9PidhcHBsaWNhdGlvbi9qc29uJ11dKTsgJGI9anNvbl9kZWNvZGUod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHgpLHRydWUpOyBmb3JlYWNoKChhcnJheSkoJGJbJ2RhdGEnXT8/W10pIGFzICRzKXsgJGU9c3RydG9sb3dlcigkc1snZW1haWwnXT8/JycpOyBpZighaXNzZXQoJGVtWyRlXSkpIGNvbnRpbnVlOyAkc3M9JHNbJ3N0YXR1cyddWydlbWFpbCddPz8nPyc7ICRrPSRlbVskZV0tPmJhbmdhLid8Jy4kc3M7ICRzdFska109KCRzdFska10/PzApKzE7ICRrMj0kZW1bJGVdLT5iYW5nYS4nfCcuJGVtWyRlXS0+aGVyb19yZWFzb24uJ3wnLiRzczsgaWYoJHNzIT09J2FjdGl2ZScpICRzdFskazJdPSgkc3RbJGsyXT8/MCkrMTsgfSAkbGFzdD0kYlsnbWV0YSddWydsYXN0X3BhZ2UnXT8/MTsgJHBnKys7IH0gd2hpbGUoJHBnPD0kbGFzdCYmJHBnPDgwKTsKICBrc29ydCgkc3QpOyAkclsnc2VuZGVyX2J1c2Vub3MnXT0kc3Q7CiAgJHJbJ3N1cHAnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBzX2VtYWlsX3N1cHByZXNzaW9uIik7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LDEpOwo=';
const VER='dep-063812';
const GKEY='ps_s1807an';
const PHASES=["1"];
const OUT='analize/s1807_an.json';
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
