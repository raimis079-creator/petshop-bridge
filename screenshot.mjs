process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA3YSByZWxhdW5jaCBMMSBzdW8gMSBiYW5nb3MgcmV6dWx0YXRhcyBwbyA0IHNhdi4gKHJlYWQtb25seSwgYmUgYWRyZXPFsykgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODA3YSddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTcwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4MDdhJ107CiAgJHRvaz1QZXRzaG9wX1NlbmRlcl9BZGFwdGVyOjpnZXRfc3RvcmVkX3Rva2VuKCdtYXJrZXRpbmcnKTsKICAkYXBpPWZ1bmN0aW9uKCRtLCRwKSB1c2UoJHRvayl7ICR4PXdwX3JlbW90ZV9yZXF1ZXN0KCdodHRwczovL2FwaS5zZW5kZXIubmV0L3YyJy4kcCxbJ21ldGhvZCc9PiRtLCd0aW1lb3V0Jz0+MjUsJ2hlYWRlcnMnPT5bJ0F1dGhvcml6YXRpb24nPT4nQmVhcmVyICcuJHRvaywnQWNjZXB0Jz0+J2FwcGxpY2F0aW9uL2pzb24nXV0pOyBpZihpc193cF9lcnJvcigkeCkpIHJldHVybiBbJ2NvZGUnPT4wXTsgcmV0dXJuIFsnY29kZSc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCR4KSwnYm9keSc9Pmpzb25fZGVjb2RlKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCR4KSx0cnVlKV07IH07CiAgZm9yZWFjaChbJ241Z2xWNSc9PidjYWxjJywnbzJqbTlZJz0+J3N0ZCddIGFzICRjaWQ9PiRrKXsgJGM9JGFwaSgnR0VUJywnL2NhbXBhaWducy8nLiRjaWQpOyAkZD0kY1snYm9keSddWydkYXRhJ10/P1tdOyAkclsna2FtcCddWyRrXT1bJ2NvZGUnPT4kY1snY29kZSddLCdzZW50Jz0+JGRbJ3NlbnQnXT8/KCRkWydzdGF0aXN0aWNzJ11bJ3NlbnQnXT8/bnVsbCksJ29wZW5zJz0+JGRbJ29wZW5zJ10/PygkZFsnc3RhdGlzdGljcyddWydvcGVucyddPz9udWxsKSwnY2xpY2tzJz0+JGRbJ2NsaWNrcyddPz8oJGRbJ3N0YXRpc3RpY3MnXVsnY2xpY2tzJ10/P251bGwpLCdib3VuY2VzJz0+JGRbJ2JvdW5jZXMnXT8/KCRkWydzdGF0aXN0aWNzJ11bJ2JvdW5jZXMnXT8/bnVsbCksJ3Vuc3ViJz0+JGRbJ3Vuc3Vic2NyaWJlcyddPz8oJGRbJ3N0YXRpc3RpY3MnXVsndW5zdWJzY3JpYmVzJ10/P251bGwpLCdzcGFtJz0+JGRbJ3NwYW1fY29tcGxhaW50cyddPz8oJGRbJ3N0YXRpc3RpY3MnXVsnc3BhbV9jb21wbGFpbnRzJ10/P251bGwpLCdyYWt0YWknPT5hcnJheV9rZXlzKCRkKV07IGlmKGlzc2V0KCRkWydzdGF0aXN0aWNzJ10pKSAkclsna2FtcCddWyRrXVsnc3RhdCddPSRkWydzdGF0aXN0aWNzJ107IH0KICAvLyBncnVwacWzIG5hcmlhaSDihpIgYsWrc2Vub3MKICAkc2I9W107IGZvcmVhY2goWydhS2tsNU0nLCdkTGxtNVgnXSBhcyAkZyl7ICRwZz0xOyBkb3sgJHg9JGFwaSgnR0VUJywnL3N1YnNjcmliZXJzP2xpbWl0PTEwMCZwYWdlPScuJHBnLicmZ3JvdXA9Jy4kZyk7IGZvcmVhY2goKGFycmF5KSgkeFsnYm9keSddWydkYXRhJ10/P1tdKSBhcyAkcyl7ICRzYltzdHJ0b2xvd2VyKCRzWydlbWFpbCddPz8nJyldPSRzWydzdGF0dXMnXVsnZW1haWwnXT8/Jz8nOyB9ICRsYXN0PSR4Wydib2R5J11bJ21ldGEnXVsnbGFzdF9wYWdlJ10/PzE7ICRwZysrOyB9IHdoaWxlKCRwZzw9JGxhc3QgJiYgJHBnPDEwKTsgfQogICRyWydnYXZlanUnXT1jb3VudCgkc2IpOyAkclsnYnVzZW5vcyddPWFycmF5X2NvdW50X3ZhbHVlcygkc2IpOwogIC8vIHXFvnNha3ltYWkgbmF1am9qZSBzdmV0YWluxJdqZSBwbyAwOS0zMCBpxaEgZ2F2xJdqxbMKICAkZW1zPWFycmF5X2tleXMoJHNiKTsgJHBoPWltcGxvZGUoJywnLGFycmF5X2ZpbGwoMCxjb3VudCgkZW1zKSwnJXMnKSk7CiAgJHJvd3M9JGVtcz8kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBvLmlkLCBvLmRhdGVfY3JlYXRlZF9nbXQgZCwgby50b3RhbF9hbW91bnQgdCwgby5zdGF0dXMgcywgTE9XRVIoby5iaWxsaW5nX2VtYWlsKSBlIEZST00geyRQfXdjX29yZGVycyBvIFdIRVJFIG8udHlwZT0nc2hvcF9vcmRlcicgQU5EIG8uc3RhdHVzIElOKCd3Yy1wcm9jZXNzaW5nJywnd2MtY29tcGxldGVkJywnd2Mtb24taG9sZCcpIEFORCBvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTA5LTMwIDA5OjAwOjAwJyBBTkQgTE9XRVIoby5iaWxsaW5nX2VtYWlsKSBJTiAoJHBoKSIsJGVtcyksQVJSQVlfQSk6W107CiAgJHV6PVtdOyBmb3JlYWNoKCRyb3dzIGFzICR4KXsgJG89d2NfZ2V0X29yZGVyKCR4WydpZCddKTsgJGthbj0kbz9bJG8tPmdldF9tZXRhKCdfcHNfdXRtX2NhbXBhaWduJyksJG8tPmdldF9tZXRhKCdfcHNfa2FuYWxhc19wYXNrdXRpbmlzJyldOltdOyAkZj0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGthbmFsYXNfcGFza3V0aW5pcywgdXRtX2NhbXBhaWduLCBrb250cmlidWNpamFfY3QgRlJPTSB7JFB9cHNfZmFrdF91enNha3ltYWkgV0hFUkUgdXpzYWt5bWFzX2lkPSVkIiwkeFsnaWQnXSksQVJSQVlfQSk7ICR1eltdPVsnbnInPT4kbz8kby0+Z2V0X29yZGVyX251bWJlcigpOiR4WydpZCddLCdkJz0+c3Vic3RyKCR4WydkJ10sMCwxMCksJ2V1cic9PnJvdW5kKCR4Wyd0J10sMiksJ2thbmFsYXMnPT4kZlsna2FuYWxhc19wYXNrdXRpbmlzJ10/Pyc/JywndXRtJz0+JGZbJ3V0bV9jYW1wYWlnbiddPz8nJywna29udHInPT5pc3NldCgkZlsna29udHJpYnVjaWphX2N0J10pP3JvdW5kKCRmWydrb250cmlidWNpamFfY3QnXS8xMDAsMik6bnVsbF07IH0KICAkclsndXpzYWt5bWFpJ109JHV6OyAkclsndXpzX24nXT1jb3VudCgkdXopOyAkclsndXpzX2V1ciddPXJvdW5kKGFycmF5X3N1bShhcnJheV9jb2x1bW4oJHV6LCdldXInKSksMik7ICRyWydwaXJrZWp1J109Y291bnQoYXJyYXlfdW5pcXVlKGFycmF5X2NvbHVtbigkcm93cywnZScpKSk7CiAgLy8ga2llayBsaWt1c2nFsyBrYW5kaWRhdMWzIGtpdGFpIGJhbmdhaSAodGFzIHBhdHMgZmlsdHJhczogMSBwaXJraW1hcyBudW8gMjAyNS0wMSwgdGlrIMWhdW7FsyBtYWlzdGFzLCBiZSBzdXRpa2ltbywgZGFyIG5lcGlya28gbmF1am9qZSkg4oCUIHNrYWnEjWl1cyBpxaEgUzE3NDEgc8SFcmHFoW8gbG9naWtvcyBuZWJlcGVycmHFoWF1OyBpbWFtIHJlbGF1bmNoX2tvbnRha3RhaSBiZW5kcmFpCiAgJHJbJ3JlbGF1bmNoX2tvbnRha3RhaV92aXNvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBzX3JlbGF1bmNoX2tvbnRha3RhaSIpOwogICRyWyduYXVqaV9waXJrZWphaV9wb18wOTMwX2lzX3JlbGF1bmNoJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIExPV0VSKG8uYmlsbGluZ19lbWFpbCkpIEZST00geyRQfXdjX29yZGVycyBvIEpPSU4geyRQfXBzX3JlbGF1bmNoX2tvbnRha3RhaSBrIE9OIExPV0VSKGsuZW1haWwpPUxPV0VSKG8uYmlsbGluZ19lbWFpbCkgV0hFUkUgby50eXBlPSdzaG9wX29yZGVyJyBBTkQgby5zdGF0dXMgSU4oJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnLCd3Yy1vbi1ob2xkJykgQU5EIG8uZGF0ZV9jcmVhdGVkX2dtdD49JzIwMjYtMDktMzAnIik7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LDEpOwo=';
const VER='dep-075637';
const GKEY='ps_s1807a';
const PHASES=["1"];
const OUT='analize/s1807_a.json';
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
