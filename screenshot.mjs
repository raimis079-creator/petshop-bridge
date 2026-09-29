process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzM5ZSBzdmFydXMgcGlsdHV2ZWxpcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MzllJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgyMDApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTczOWUnXTsKICAkdz0iZGllbmEgQkVUV0VFTiAnMjAyNi0wOS0yNCcgQU5EICcyMDI2LTA5LTI5JyBBTkQgKHRlc3RpbmlzPTAgT1IgdGVzdGluaXMgSVMgTlVMTCkiOwogICR3cGRiLT5xdWVyeSgiQ1JFQVRFIFRFTVBPUkFSWSBUQUJMRSBwc190X2xhbmsgQVMgU0VMRUNUIGxhbmt5dG9qYXNfZCBsLCBNQVgoaXJlbmdpbnlzKSBpciwgU1VNKHRpcGFzPSdwYWdldmlldycpIHB2LCBTVU0odGlwYXM9J2FkZF90b19jYXJ0JykgYXRjLCBNQVgocHVzbF90aXBhcz0ncHJla2UnKSBwciwgTUFYKHB1c2xfdGlwYXM9J2thdGVnb3JpamEnIE9SIHB1c2xfdGlwYXM9J3BhaWVza2EnIE9SIHB1c2xfdGlwYXM9J3BhcmR1b3R1dmUnKSBrYXQsIE1BWCh0aXBhcz0ndmlld19jYXJ0JyBPUiBwdXNsX3RpcGFzPSdrcmVwc2VsaXMnKSBrciwgTUFYKHRpcGFzPSdiZWdpbl9jaGVja291dCcgT1IgcHVzbF90aXBhcz0nY2hlY2tvdXQnKSBjaCwgTUFYKHB1c2xfdGlwYXM9J2FjaXUnKSBhYywgTUFYKG5hcnNfc2VpbWEpIG5zLCBNQVgob3Nfc2VpbWEpIG9zIEZST00geyRQfXBzX3dlYl9pdnlraWFpIFdIRVJFICR3IEdST1VQIEJZIGxhbmt5dG9qYXNfZCIpOwogICRyWyd2aXNvJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBDT1VOVCgqKSBuLCBTVU0ocHY8PTEgQU5EIGF0Yz49MSkgYm90X2F0YywgU1VNKHB2PTApIGJlX3B2IEZST00gcHNfdF9sYW5rIixBUlJBWV9BKTsKICAkclsnYm90X3Byb2ZpbGlzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaXIsIG5zLCBvcywgQ09VTlQoKikgbiBGUk9NIHBzX3RfbGFuayBXSEVSRSBwdjw9MSBBTkQgYXRjPj0xIEdST1VQIEJZIDEsMiwzIE9SREVSIEJZIDQgREVTQyBMSU1JVCA4IixBUlJBWV9BKTsKICAkclsnc3ZhcnVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaXIsIENPVU5UKCopIHNyYXV0YXMsIFNVTShwcikgcHJla2UsIFNVTShhdGM+MCkgYXRjLCBTVU0oa3IpIGtyZXBzZWxpcywgU1VNKGNoKSBrYXNhLCBTVU0oYWMpIGFjaXUgRlJPTSBwc190X2xhbmsgV0hFUkUgTk9UIChwdjw9MSBBTkQgYXRjPj0xKSBHUk9VUCBCWSAxIixBUlJBWV9BKTsKICAkclsnYXRjX2JlX2thc29zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaXIsIFNVTShhdGM+MCBBTkQgY2g9MCkgYXRjX2JlX2thc29zLCBTVU0oY2g9MSBBTkQgYWM9MCkga2FzYV9iZV9hY2l1IEZST00gcHNfdF9sYW5rIFdIRVJFIE5PVCAocHY8PTEgQU5EIGF0Yz49MSkgR1JPVVAgQlkgMSIsQVJSQVlfQSk7CiAgJHJbJ3V6cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlyZW5naW55cywgQ09VTlQoKikgbiBGUk9NIHskUH1wc19mYWt0X3V6c2FreW1haSBXSEVSRSBkaWVuYSBCRVRXRUVOICcyMDI2LTA5LTI0JyBBTkQgJzIwMjYtMDktMjknIEdST1VQIEJZIDEiLEFSUkFZX0EpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-165054';
const GKEY='ps_s1739e';
const PHASES=["1"];
const OUT='analize/s1739_e.json';
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
