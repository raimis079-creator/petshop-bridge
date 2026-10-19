process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzg4ciBMUCBwYXN0byBrb2RvIGtsYWlkYTogbGF1a2FpLCB2ZXJzaWpvcywgTFAgdXpzYWt5bWFpIHBlciBkLiwga2xhaWRvcyBwZXIgZC4gKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzg4ciddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMjAwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3ODhyJ107CiAgdHJ5ewogICAgJHJbJ3djJ109W1dDKCktPnZlcnNpb24sIGRhdGUoJ1ktbS1kIEg6aScsZmlsZW10aW1lKFdQX1BMVUdJTl9ESVIuJy93b29jb21tZXJjZS93b29jb21tZXJjZS5waHAnKSldOwogICAgJHJbJ2xwX210aW1lJ109ZGF0ZSgnWS1tLWQgSDppJyxmaWxlbXRpbWUoV1BfUExVR0lOX0RJUi4nL3dvby1saXRodWFuaWFwb3N0LW1haW4vd29vLWxpdGh1YW5pYXBvc3QucGhwJykpOwogICAgaWYoIVdDKCktPnNlc3Npb24pIFdDKCktPmluaXRpYWxpemVfc2Vzc2lvbigpOyAkZmxkcz1XQygpLT5jaGVja291dCgpLT5nZXRfY2hlY2tvdXRfZmllbGRzKCk7CiAgICBmb3JlYWNoKFsnYmlsbGluZycsJ3NoaXBwaW5nJ10gYXMgJGcpIGZvcmVhY2goKCRmbGRzWyRnXT8/W10pIGFzICRrPT4kZikgJHJbJ2xhdWthaSddWyRnXVska109WyFlbXB0eSgkZlsncmVxdWlyZWQnXSksJGZbJ3R5cGUnXT8/J3RleHQnLGluX2FycmF5KCdoaWRkZW4nLChhcnJheSkoJGZbJ2NsYXNzJ10/P1tdKSk/J2hpZCc6JycsJGZbJ3ByaW9yaXR5J10/P251bGxdOwogICAgJHJbJ3NoaXBfdG9fZGlmZiddPWdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX3NoaXBfdG9fZGVzdGluYXRpb24nKTsgJHJbJ2NhbGNfc2hpcHBpbmcnXT1nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9lbmFibGVfc2hpcHBpbmdfY2FsYycpOwogICAgJHJbJ2xwX3V6cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEUoQ09OVkVSVF9UWihvLmRhdGVfY3JlYXRlZF9nbXQsJyswMDowMCcsJyswMzowMCcpKSBkLCBTVU0oaS5vcmRlcl9pdGVtX25hbWUgTElLRSAnJUxQJScgT1IgaS5vcmRlcl9pdGVtX25hbWUgTElLRSAnJUxpZXR1dm9zIHBhJScgT1IgaS5vcmRlcl9pdGVtX25hbWUgTElLRSAnJVBhxaF0b21hdCUnKSBscCwgQ09VTlQoKikgdmlzaSBGUk9NIHskUH13Y19vcmRlcnMgbyBKT0lOIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBpIE9OIGkub3JkZXJfaWQ9by5pZCBBTkQgaS5vcmRlcl9pdGVtX3R5cGU9J3NoaXBwaW5nJyBXSEVSRSBvLnR5cGU9J3Nob3Bfb3JkZXInIEFORCBvLnN0YXR1cyBJTiAoJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnLCd3Yy1vbi1ob2xkJykgQU5EIG8uZGF0ZV9jcmVhdGVkX2dtdD49JzIwMjYtMDktMDEnIEdST1VQIEJZIGQgT1JERVIgQlkgZCIsQVJSQVlfQSk7CiAgICAkclsnbHBfcGF2J109JHdwZGItPmdldF9jb2woIlNFTEVDVCBESVNUSU5DVCBpLm9yZGVyX2l0ZW1fbmFtZSBGUk9NIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBpIEpPSU4geyRQfXdjX29yZGVycyBvIE9OIG8uaWQ9aS5vcmRlcl9pZCBXSEVSRSBpLm9yZGVyX2l0ZW1fdHlwZT0nc2hpcHBpbmcnIEFORCBvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTA5LTAxJyIpOwogICAgLy8gTFAgdXpzYWt5bXUgcGFzdG8ga29kYWkKICAgICRyWydscF9wayddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG8uaWQsIERBVEUoby5kYXRlX2NyZWF0ZWRfZ210KSBkLCBhLnBvc3Rjb2RlIHBrLCBhLmNpdHkgRlJPTSB7JFB9d2Nfb3JkZXJzIG8gSk9JTiB7JFB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbXMgaSBPTiBpLm9yZGVyX2lkPW8uaWQgQU5EIGkub3JkZXJfaXRlbV90eXBlPSdzaGlwcGluZycgQU5EIGkub3JkZXJfaXRlbV9uYW1lIExJS0UgJyVMUCUnIExFRlQgSk9JTiB7JFB9d2Nfb3JkZXJfYWRkcmVzc2VzIGEgT04gYS5vcmRlcl9pZD1vLmlkIEFORCBhLmFkZHJlc3NfdHlwZT0nYmlsbGluZycgV0hFUkUgby5kYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0wOS0yMCcgT1JERVIgQlkgby5pZCBERVNDIExJTUlUIDE1IixBUlJBWV9BKTsKICAgIC8vIHBocCBsb2cgTFAga2xhaWRhIHBlciBkaWVuYQogICAgJHBsPWRpcm5hbWUoQUJTUEFUSCkuJy9sb2dzL3BocF9lcnJvci5sb2cnOyAkZmg9Zm9wZW4oJHBsLCdyJyk7ICRjbnQ9W107IHdoaWxlKCgkbD1mZ2V0cygkZmgpKSE9PWZhbHNlKXsgaWYoc3RycG9zKCRsLCdBdHRlbXB0IHRvIHJlYWQgcHJvcGVydHkgImVycm9ycyIgb24gYXJyYXknKSE9PWZhbHNlICYmIHN0cnBvcygkbCwnbGl0aHVhbmlhcG9zdCcpIT09ZmFsc2UpeyAkY250W3N1YnN0cigkbCwxLDExKV09KCRjbnRbc3Vic3RyKCRsLDEsMTEpXT8/MCkrMTsgfSB9ICRyWydscF9rbGFpZGFfZCddPSRjbnQ7CiAgICAkclsncGhwX2xvZ19wcmFkemlhJ109ZmdldHMoZm9wZW4oJHBsLCdyJykpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-090000';
const GKEY='ps_s1788r';
const PHASES=["1"];
const OUT='analize/s1788_r.json';
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
