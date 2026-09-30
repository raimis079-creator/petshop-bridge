process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQyZyBzdHJhaXBzbmnFsyBzcmF1dGFzOiBHU0MgKyB3ZWIgxK92eWtpYWkgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzQyZyddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTUwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3NDJnJ107CiAgJHE9ZnVuY3Rpb24oJHNxbCkgdXNlICgkd3BkYiwmJHIpeyAkeD0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHNxbCxBUlJBWV9BKTsgaWYoJHdwZGItPmxhc3RfZXJyb3IpICRyWydTUUxfRVJSJ11bXT1tYl9zdWJzdHIoJHdwZGItPmxhc3RfZXJyb3IsMCwyMDApOyByZXR1cm4gJHg7IH07CiAgdHJ5ewogICAgJHBzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELCBwb3N0X25hbWUgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvc3RfdHlwZT0ncG9zdCciLEFSUkFZX0EpOwogICAgJHJbJ2dzY19tYXgnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIE1BWChkaWVuYSkgRlJPTSB7JFB9cHNfZmFrdF9nc2NfdXJsX2QiKTsgJHJbJ3dlYl9taW4nXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIE1JTihkaWVuYSkgRlJPTSB7JFB9cHNfd2ViX2l2eWtpYWkiKTsKICAgICRyWyd0aXBhaSddPSRxKCJTRUxFQ1QgdGlwYXMsIENPVU5UKCopIG4gRlJPTSB7JFB9cHNfd2ViX2l2eWtpYWkgR1JPVVAgQlkgMSBPUkRFUiBCWSBuIERFU0MgTElNSVQgMTUiKTsKICAgIGZvcmVhY2goJHBzIGFzICRwKXsgJHM9ZXNjX3NxbCgkcFsncG9zdF9uYW1lJ10pOyAkaz1nZXRfcGVybWFsaW5rKCRwWydJRCddKTsgJGtlbD13cF9wYXJzZV91cmwoJGssUEhQX1VSTF9QQVRIKTsKICAgICAgJHJvdz1bJ3NsdWcnPT4kcFsncG9zdF9uYW1lJ10sJ2tlbGlhcyc9PiRrZWxdOwogICAgICAkcm93Wydnc2NfMjhkJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBTVU0oY2xpY2tzKSBjbCwgU1VNKGltcHIpIGltLCBST1VORChBVkcocG9zKSwxKSBwb3MgRlJPTSB7JFB9cHNfZmFrdF9nc2NfdXJsX2QgV0hFUkUgdXJsIExJS0UgJyUvJHMlJyBBTkQgZGllbmE+PUNVUkRBVEUoKS1JTlRFUlZBTCAzMCBEQVkiLEFSUkFZX0EpOwogICAgICAkcm93Wydnc2NfbnVvMDkwOSddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgU1VNKGNsaWNrcykgY2wsIFNVTShpbXByKSBpbSBGUk9NIHskUH1wc19mYWt0X2dzY191cmxfZCBXSEVSRSB1cmwgTElLRSAnJS8kcyUnIEFORCBkaWVuYT49JzIwMjYtMDktMDknIixBUlJBWV9BKTsKICAgICAgJHJvd1snZ3NjX3ByaWVzJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBTVU0oY2xpY2tzKSBjbCwgU1VNKGltcHIpIGltLCBNSU4oZGllbmEpIG51byBGUk9NIHskUH1wc19mYWt0X2dzY191cmxfZCBXSEVSRSB1cmwgTElLRSAnJS8kcyUnIEFORCBkaWVuYTwnMjAyNi0wOS0wOSciLEFSUkFZX0EpOwogICAgICAkcm93Wyd3ZWInXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBrYW5hbGFzLCBDT1VOVChESVNUSU5DVCBzZXNpamEpIHNlcywgQ09VTlQoKikgbiBGUk9NIHskUH1wc193ZWJfaXZ5a2lhaSBXSEVSRSB0ZXN0aW5pcz0wIEFORCB1cmxfa2VsaWFzIExJS0UgJyUvJHMlJyBHUk9VUCBCWSAxIE9SREVSIEJZIHNlcyBERVNDIixBUlJBWV9BKTsKICAgICAgLy8gc2VzaWpvcywga3VyaW9zIHBvIHN0cmFpcHNuaW8gYXBsYW5rxJcgcHJla8SZL2thdGVnb3JpasSFCiAgICAgICRyb3dbJ3RvbGlhdSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBhLnNlc2lqYSkgRlJPTSB7JFB9cHNfd2ViX2l2eWtpYWkgYSBKT0lOIHskUH1wc193ZWJfaXZ5a2lhaSBiIE9OIGIuc2VzaWphPWEuc2VzaWphIEFORCBiLmxhaWthcz5hLmxhaWthcyBBTkQgYi51cmxfa2VsaWFzIE5PVCBMSUtFICclLyRzJScgV0hFUkUgYS50ZXN0aW5pcz0wIEFORCBhLnVybF9rZWxpYXMgTElLRSAnJS8kcyUnIik7CiAgICAgICRyWydzJ11bXT0kcm93OyB9CiAgICAkclsnZ3NjX3Zpc2FfMjhkJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBTVU0oY2xpY2tzKSBjbCwgU1VNKGltcHIpIGltLCBTVU0oY2xpY2tzX3R1cmlueXMpIHR1cmlueXMgRlJPTSB7JFB9cHNfZmFrdF9nc2NfZGllbm9zIFdIRVJFIGRpZW5hPj1DVVJEQVRFKCktSU5URVJWQUwgMzAgREFZIixBUlJBWV9BKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-165721';
const GKEY='ps_s1742g';
const PHASES=["1"];
const OUT='analize/s1742_g.json';
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
