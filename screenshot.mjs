process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzM5ZCBzYWxpcyByb2R5bWFzICsgcGxhbmFzIGxhbmdhcyArIHBpbHR1dmVsaXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzM5ZCddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMjAwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3MzlkJ107CiAgdHJ5ewogICAgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJGYpeyAkdD1maWxlX2dldF9jb250ZW50cygkZik7ICRscz1leHBsb2RlKCJcbiIsJHQpOyBmb3JlYWNoKCRscyBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCIvKFsnXCJdXFxzKsWgYWwoaXN8eXMpfD5cXHMqxaBhbChpc3x5cyl8J3NhbGlzJ1xccyo9PnxcXGJzYWxpc1xcYi4qKGxhYmVsfGFudHJ8dGh8PCl8xaBhbGlzKS91IiwkbCkpICRyWydzYWxpcyddW109YmFzZW5hbWUoJGYpLic6Jy4oJGkrMSkuJzogJy50cmltKHN1YnN0cigkbCwwLDE3MCkpOyB9IH0KICAgICRwbD1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXBsYW5hcy1sYW5nYXMucGhwJzsgJHQ9ZmlsZV9nZXRfY29udGVudHMoJHBsKTsgJHJbJ3BsYW5hc19tZDUnXT1tZDUoJHQpOyAkclsncGxhbmFzX2R5ZGlzJ109c3RybGVuKCR0KTsKICAgIGZvcmVhY2goZXhwbG9kZSgiXG4iLCR0KSBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvZnVuY3Rpb24gfGFkZF9zdWJtZW51X3BhZ2V8YWRkX21lbnVfcGFnZXw8aDJ8PGgzfFZlcnNpb246LycsJGwpKSAkclsncGxhbmFzX3N0cnVrdHVyYSddW109KCRpKzEpLic6ICcudHJpbShzdWJzdHIoJGwsMCwxNjApKTsgfQogICAgLy8gcGlsdHV2ZWxpcyAwOS0yNC4uMDktMjksIGJlIHRlc3Rpbml1CiAgICAkdz0iZGllbmEgQkVUV0VFTiAnMjAyNi0wOS0yNCcgQU5EICcyMDI2LTA5LTI5JyBBTkQgKHRlc3RpbmlzPTAgT1IgdGVzdGluaXMgSVMgTlVMTCkiOwogICAgJHJbJ3RpcGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdGlwYXMsIENPVU5UKERJU1RJTkNUIGxhbmt5dG9qYXNfZCkgbGFuaywgQ09VTlQoKikgaXYgRlJPTSB7JFB9cHNfd2ViX2l2eWtpYWkgV0hFUkUgJHcgR1JPVVAgQlkgMSBPUkRFUiBCWSAyIERFU0MgTElNSVQgMjUiLEFSUkFZX0EpOwogICAgJHJbJ3B1c2xfdGlwYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwdXNsX3RpcGFzLCBDT1VOVChESVNUSU5DVCBsYW5reXRvamFzX2QpIGxhbmsgRlJPTSB7JFB9cHNfd2ViX2l2eWtpYWkgV0hFUkUgJHcgQU5EIHRpcGFzPSdwYWdldmlldycgR1JPVVAgQlkgMSBPUkRFUiBCWSAyIERFU0MgTElNSVQgMTUiLEFSUkFZX0EpOwogICAgZm9yZWFjaChbJ21vYmlsZScsJ2Rlc2t0b3AnLCd0YWJsZXQnXSBhcyAkaXIpewogICAgICAkcT1mdW5jdGlvbigkY29uZCkgdXNlKCR3cGRiLCRQLCR3LCRpcil7IHJldHVybiAoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgbGFua3l0b2phc19kKSBGUk9NIHskUH1wc193ZWJfaXZ5a2lhaSBXSEVSRSAkdyBBTkQgaXJlbmdpbnlzPSckaXInIEFORCAkY29uZCIpOyB9OwogICAgICAkclsncGlsdHV2ZWxpcyddWyRpcl09WydzcmF1dGFzJz0+JHEoIjE9MSIpLCdwcmVrZSc9PiRxKCJwdXNsX3RpcGFzPSdwcmVrZSciKSwnYWRkX3RvX2NhcnQnPT4kcSgidGlwYXM9J2FkZF90b19jYXJ0JyIpLCdrcmVwc2VsaXMnPT4kcSgicHVzbF90aXBhcz0na3JlcHNlbGlzJyIpLCdiZWdpbl9jaGVja291dCc9PiRxKCJ0aXBhcz0nYmVnaW5fY2hlY2tvdXQnIE9SIHB1c2xfdGlwYXM9J2NoZWNrb3V0JyIpLCdhY2l1Jz0+JHEoInB1c2xfdGlwYXM9J2FjaXUnIildOwogICAgfQogICAgJHJbJ3V6c2FreW1haV9mYWt0J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaXJlbmdpbnlzLCBDT1VOVCgqKSBuIEZST00geyRQfXBzX2Zha3RfdXpzYWt5bWFpIFdIRVJFIGRpZW5hIEJFVFdFRU4gJzIwMjYtMDktMjQnIEFORCAnMjAyNi0wOS0yOScgR1JPVVAgQlkgMSIsQVJSQVlfQSk7CiAgICAvLyBib3R1IHRhcnNhOiAxIHB1c2xhcGlzICsgYWRkX3RvX2NhcnQKICAgICRyWydib3RhaV8xcHVzbF9hdGMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAoU0VMRUNUIGxhbmt5dG9qYXNfZCwgU1VNKHRpcGFzPSdwYWdldmlldycpIHB2LCBTVU0odGlwYXM9J2FkZF90b19jYXJ0JykgYXRjIEZST00geyRQfXBzX3dlYl9pdnlraWFpIFdIRVJFICR3IEdST1VQIEJZIDEgSEFWSU5HIHB2PD0xIEFORCBhdGM+PTEpIHgiKTsKICAgICRyWydrYWxiYV90b3AnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzYWxpcywgQ09VTlQoRElTVElOQ1QgbGFua3l0b2phc19kKSBuIEZST00geyRQfXBzX3dlYl9pdnlraWFpIFdIRVJFICR3IEdST1VQIEJZIDEgT1JERVIgQlkgMiBERVNDIExJTUlUIDgiLEFSUkFZX0EpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-164917';
const GKEY='ps_s1739d';
const PHASES=["1"];
const OUT='analize/s1739_d.json';
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
