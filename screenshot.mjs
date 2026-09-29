process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQwZSBwaWx0dXZlbGlzIHBhZ2FsIHNhbHRpbmkgcmVjb24gKDEgcmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NDBlJ10pKSByZXR1cm47ICRmPSRfR0VUWydwc19zMTc0MGUnXTsgQHNldF90aW1lX2xpbWl0KDE1MCk7IGdsb2JhbCAkd3BkYjsgJHI9Wyd2Jz0+J1MxNzQwZScsJ2ZhemUnPT4kZl07ICRUPSR3cGRiLT5wcmVmaXguJ3BzX3dlYl9pdnlraWFpJzsKICB0cnl7CiAgaWYoJGY9PT0nMScpewogICAgJG51bz1kYXRlKCdZLW0tZCcsc3RydG90aW1lKCctMjEgZGF5cycpKTsgJGlraT1kYXRlKCdZLW0tZCcsc3RydG90aW1lKCctMSBkYXknKSk7CiAgICAkdmlkPSR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgbGFua3l0b2phc19kIGwsIE1BWChpcmVuZ2lueXMpIGlyLCBTVUJTVFJJTkdfSU5ERVgoR1JPVVBfQ09OQ0FUKENPQUxFU0NFKGthbmFsYXMsJy0nKSBPUkRFUiBCWSBpZCksJywnLDEpIGthbiwgU1VCU1RSSU5HX0lOREVYKEdST1VQX0NPTkNBVChDT0FMRVNDRShzYWx0aW5pcywnLScpIE9SREVSIEJZIGlkKSwnLCcsMSkgc2FsLCBTVUJTVFJJTkdfSU5ERVgoR1JPVVBfQ09OQ0FUKENPQUxFU0NFKGthbXBhbmlqYSwnLScpIE9SREVSIEJZIGlkKSwnLCcsMSkga2FtcCwgU1VCU1RSSU5HX0lOREVYKEdST1VQX0NPTkNBVChDT0FMRVNDRShsYW5kaW5nLHVybF9rZWxpYXMsJy0nKSBPUkRFUiBCWSBpZCBTRVBBUkFUT1IgJ8KnJyksJ8KnJywxKSBsYW5kLCBTVU0odGlwYXM9J3BhZ2V2aWV3JykgcHYsIFNVTSh0aXBhcz0nYWRkX3RvX2NhcnQnKSBhdGMsIE1BWChwdXNsX3RpcGFzPSdwcmVrZScpIHByLCBNQVgodGlwYXM9J2JlZ2luX2NoZWNrb3V0JyBPUiBwdXNsX3RpcGFzPSdjaGVja291dCcpIGNoLCBNQVgocHVzbF90aXBhcz0nYWNpdScpIGFjIEZST00gJFQgV0hFUkUgZGllbmEgQkVUV0VFTiAlcyBBTkQgJXMgQU5EICh0ZXN0aW5pcz0wIE9SIHRlc3RpbmlzIElTIE5VTEwpIEdST1VQIEJZIGxhbmt5dG9qYXNfZCIsJG51bywkaWtpKTsKICAgICR3cGRiLT5xdWVyeSgiU0VUIFNFU1NJT04gZ3JvdXBfY29uY2F0X21heF9sZW49NDA5NiIpOwogICAgJHJbJ3BhZ2FsX2thbmFsYSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlyLCBrYW4sIENPVU5UKCopIG4sIFNVTShwcikgcHIsIFNVTShwciBBTkQgYXRjPjApIHByX2F0YywgU1VNKGF0Yz4wKSBhdGMsIFNVTShjaCkgY2gsIFNVTShhYykgYWMsIFJPVU5EKEFWRyhwdiksMSkgcHZfdmlkIEZST00gKCR2aWQpIHggV0hFUkUgTk9UIChwdjw9MSBBTkQgYXRjPj0xKSBHUk9VUCBCWSBpcixrYW4gSEFWSU5HIG4+PTIwIE9SREVSIEJZIGlyLCBuIERFU0MiLEFSUkFZX0EpOwogICAgJHJbJ21va2FtYXNfc2FsdGluaWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaXIsIHNhbCwga2FtcCwgQ09VTlQoKikgbiwgU1VNKHByKSBwciwgU1VNKHByIEFORCBhdGM+MCkgcHJfYXRjLCBTVU0oYWMpIGFjLCBST1VORChBVkcocHYpLDEpIHB2X3ZpZCBGUk9NICgkdmlkKSB4IFdIRVJFIE5PVCAocHY8PTEgQU5EIGF0Yz49MSkgQU5EIGthbj0nbW9rYW1hcycgR1JPVVAgQlkgaXIsc2FsLGthbXAgSEFWSU5HIG4+PTEwIE9SREVSIEJZIG4gREVTQyBMSU1JVCAyMCIsQVJSQVlfQSk7CiAgICAkclsnbGFuZGluZ190aXBhc19tb2JpbGUnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBDQVNFIFdIRU4gbGFuZCBMSUtFICclL3Byb2R1Y3QvJScgVEhFTiAncHJla2UnIFdIRU4gbGFuZCBMSUtFICclL2thdGVnb3JpamEvJScgVEhFTiAna2F0ZWdvcmlqYScgV0hFTiBsYW5kIExJS0UgJyU/cz0lJyBPUiBsYW5kIExJS0UgJyUvcGFpZXNrYSUnIFRIRU4gJ3BhaWVza2EnIFdIRU4gbGFuZCBJTiAoJy8nLCdodHRwczovL3BldHNob3AubHQvJykgT1IgbGFuZCBMSUtFICclcGV0c2hvcC5sdC8/JScgT1IgbGFuZCBMSUtFICcvPyUnIFRIRU4gJ3ByYWRpbmlzJyBFTFNFICdraXRhJyBFTkQgbHQsIGthbiwgQ09VTlQoKikgbiwgU1VNKGF0Yz4wKSBhdGMsIFNVTShhYykgYWMsIFJPVU5EKEFWRyhwdiksMSkgcHZfdmlkIEZST00gKCR2aWQpIHggV0hFUkUgTk9UIChwdjw9MSBBTkQgYXRjPj0xKSBBTkQgaXI9J21vYmlsZScgR1JPVVAgQlkgMSwyIEhBVklORyBuPj0xNSBPUkRFUiBCWSBuIERFU0MiLEFSUkFZX0EpOwogICAgJHJbJ2xhbmRpbmdfcHZ6J109JHdwZGItPmdldF9jb2woIlNFTEVDVCBsYW5kIEZST00gKCR2aWQpIHggV0hFUkUgaXI9J21vYmlsZScgQU5EIGthbj0nbW9rYW1hcycgTElNSVQgNSIpOwogICAgJHJbJ2F0Y191cmwnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpcmVuZ2lueXMsIENBU0UgV0hFTiB1cmxfa2VsaWFzIExJS0UgJyUvcHJvZHVjdC8lJyBUSEVOICdwcmVrZScgV0hFTiB1cmxfa2VsaWFzIExJS0UgJyUva2F0ZWdvcmlqYS8lJyBPUiB1cmxfa2VsaWFzIExJS0UgJyUvZ2FtaW50b2phcy8lJyBUSEVOICdzYXJhc2FzJyBXSEVOIHVybF9rZWxpYXMgTElLRSAnJXM9JScgVEhFTiAncGFpZXNrYScgRUxTRSBDT0FMRVNDRShMRUZUKHVybF9rZWxpYXMsNDApLCctJykgRU5EIHZpZXRhLCBDT1VOVChESVNUSU5DVCBsYW5reXRvamFzX2QpIGxhbmsgRlJPTSAkVCBXSEVSRSBkaWVuYSBCRVRXRUVOICVzIEFORCAlcyBBTkQgKHRlc3RpbmlzPTAgT1IgdGVzdGluaXMgSVMgTlVMTCkgQU5EIHRpcGFzPSdhZGRfdG9fY2FydCcgR1JPVVAgQlkgMSwyIEhBVklORyBsYW5rPj01IE9SREVSIEJZIGxhbmsgREVTQyBMSU1JVCAyMCIsJG51bywkaWtpKSxBUlJBWV9BKTsKICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-182727';
const GKEY='ps_s1740e';
const PHASES=["1"];
const OUT='analize/s1740e.json';
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
