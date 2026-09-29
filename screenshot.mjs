process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQwZiBBVEMgdmlldGEgKyBrYW1wYW5panUgdmFyZGFpICgxIHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzQwZiddKSkgcmV0dXJuOyAkZj0kX0dFVFsncHNfczE3NDBmJ107IEBzZXRfdGltZV9saW1pdCgxNTApOyBnbG9iYWwgJHdwZGI7ICRyPVsndic9PidTMTc0MGYnLCdmYXplJz0+JGZdOyAkVD0kd3BkYi0+cHJlZml4Lidwc193ZWJfaXZ5a2lhaSc7CiAgdHJ5ewogIGlmKCRmPT09JzEnKXsKICAgICRudW89ZGF0ZSgnWS1tLWQnLHN0cnRvdGltZSgnLTIxIGRheXMnKSk7ICRpa2k9ZGF0ZSgnWS1tLWQnLHN0cnRvdGltZSgnLTEgZGF5JykpOwogICAgJHdwZGItPnF1ZXJ5KCJEUk9QIFRFTVBPUkFSWSBUQUJMRSBJRiBFWElTVFMgcHNfdG1wX2JvdCIpOwogICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJDUkVBVEUgVEVNUE9SQVJZIFRBQkxFIHBzX3RtcF9ib3QgKGwgVkFSQ0hBUig2NCkgUFJJTUFSWSBLRVkpIFNFTEVDVCBsYW5reXRvamFzX2QgbCBGUk9NICRUIFdIRVJFIGRpZW5hIEJFVFdFRU4gJXMgQU5EICVzIEFORCAodGVzdGluaXM9MCBPUiB0ZXN0aW5pcyBJUyBOVUxMKSBHUk9VUCBCWSBsYW5reXRvamFzX2QgSEFWSU5HIFNVTSh0aXBhcz0ncGFnZXZpZXcnKTw9MSBBTkQgU1VNKHRpcGFzPSdhZGRfdG9fY2FydCcpPj0xIiwkbnVvLCRpa2kpKTsKICAgICRXPSR3cGRiLT5wcmVwYXJlKCJkaWVuYSBCRVRXRUVOICVzIEFORCAlcyBBTkQgKHRlc3RpbmlzPTAgT1IgdGVzdGluaXMgSVMgTlVMTCkgQU5EIGxhbmt5dG9qYXNfZCBOT1QgSU4gKFNFTEVDVCBsIEZST00gcHNfdG1wX2JvdCkiLCRudW8sJGlraSk7CiAgICAkclsnYXRjX3ZpZXRhJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaXJlbmdpbnlzLCBDQVNFIFdIRU4gdXJsX2tlbGlhcyBMSUtFICclL3Byb2R1Y3QvJScgVEhFTiAncHJla2UnIFdIRU4gdXJsX2tlbGlhcyBMSUtFICclL2thdGVnb3JpamEvJScgT1IgdXJsX2tlbGlhcyBMSUtFICclL2dhbWludG9qYXMvJScgVEhFTiAnc2FyYXNhcycgV0hFTiB1cmxfa2VsaWFzIExJS0UgJyVzPSUlJyBPUiB1cmxfa2VsaWFzIExJS0UgJyVwYWllc2slJyBUSEVOICdwYWllc2thJyBXSEVOIHVybF9rZWxpYXMgTElLRSAnJWtyZXBzZWwlJyBPUiB1cmxfa2VsaWFzIExJS0UgJyVjYXJ0JScgVEhFTiAna3JlcHNlbGlzJyBXSEVOIHVybF9rZWxpYXMgSU4gKCcvJywnJykgT1IgdXJsX2tlbGlhcyBMSUtFICcvPyUnIFRIRU4gJ3ByYWRpbmlzJyBFTFNFICdraXRhJyBFTkQgdmlldGEsIENPVU5UKERJU1RJTkNUIGxhbmt5dG9qYXNfZCkgbGFuaywgQ09VTlQoKikgbiBGUk9NICRUIFdIRVJFICRXIEFORCB0aXBhcz0nYWRkX3RvX2NhcnQnIEdST1VQIEJZIDEsMiBPUkRFUiBCWSAxLCBsYW5rIERFU0MiLEFSUkFZX0EpOwogICAgLy8gcHJla2VzIHB1c2xhcGlvIEFUQyByb2Rpa2xpcyBwYWdhbCBwaXJtxIUga2FuYWxhICh0ZWxlZm9uYXMpOiBwcmVrZXMgcGVyeml1cmEgLT4gQVRDIHRvamUgcGFjaW9qZSBwcmVrZWplICh1cmwpCiAgICAkclsncHJla2VfYXRjX3RlbGVmb25hcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGsua2FuLCBDT1VOVChESVNUSU5DVCB2Lmxhbmt5dG9qYXNfZCkgcGVyeml1cmVqbywgQ09VTlQoRElTVElOQ1QgYS5sYW5reXRvamFzX2QpIGlkZWpvX3ByZWtlamUgRlJPTSAoU0VMRUNUIERJU1RJTkNUIGxhbmt5dG9qYXNfZCBGUk9NICRUIFdIRVJFICRXIEFORCB0aXBhcz0ncGFnZXZpZXcnIEFORCBwdXNsX3RpcGFzPSdwcmVrZScgQU5EIGlyZW5naW55cz0nbW9iaWxlJykgdiBKT0lOIChTRUxFQ1QgbGFua3l0b2phc19kLCBTVUJTVFJJTkdfSU5ERVgoR1JPVVBfQ09OQ0FUKENPQUxFU0NFKGthbmFsYXMsJy0nKSBPUkRFUiBCWSBpZCksJywnLDEpIGthbiBGUk9NICRUIFdIRVJFICRXIEdST1VQIEJZIGxhbmt5dG9qYXNfZCkgayBPTiBrLmxhbmt5dG9qYXNfZD12Lmxhbmt5dG9qYXNfZCBMRUZUIEpPSU4gKFNFTEVDVCBESVNUSU5DVCBsYW5reXRvamFzX2QgRlJPTSAkVCBXSEVSRSAkVyBBTkQgdGlwYXM9J2FkZF90b19jYXJ0JyBBTkQgdXJsX2tlbGlhcyBMSUtFICclL3Byb2R1Y3QvJScpIGEgT04gYS5sYW5reXRvamFzX2Q9di5sYW5reXRvamFzX2QgR1JPVVAgQlkgMSBPUkRFUiBCWSAyIERFU0MiLEFSUkFZX0EpOwogICAgJFI9JHdwZGItPnByZWZpeC4ncHNfZmFrdF9yZWtsYW1hJzsKICAgIGlmKCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckUiciKSl7ICRyWydyZWtsYW1hX3N0dWxwJ109YXJyYXlfa2V5cygoYXJyYXkpJHdwZGItPmdldF9yb3coIlNFTEVDVCAqIEZST00gJFIgTElNSVQgMSIsQVJSQVlfQSkpOyB9CiAgfQogIGlmKCRmPT09JzInKXsKICAgICRSPSR3cGRiLT5wcmVmaXguJ3BzX2Zha3RfcmVrbGFtYSc7ICRjb2xzPWFycmF5X2tleXMoKGFycmF5KSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgKiBGUk9NICRSIExJTUlUIDEiLEFSUkFZX0EpKTsgJHJbJ2NvbHMnXT0kY29sczsKICAgICRpZGM9bnVsbDsgJG5jPW51bGw7IGZvcmVhY2goJGNvbHMgYXMgJGMpeyBpZighJGlkYyAmJiBwcmVnX21hdGNoKCcva2FtcGFuaWouKmlkfGNhbXBhaWduX2lkL2knLCRjKSkgJGlkYz0kYzsgaWYoISRuYyAmJiBwcmVnX21hdGNoKCcva2FtcGFuaWouKihwYXZ8dmFyZCl8Y2FtcGFpZ25fbmFtZS9pJywkYykpICRuYz0kYzsgfQogICAgaWYoJGlkYyAmJiAkbmMpeyAkclsna2FtcGFuaWpvcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICRpZGMgaWQsIE1BWCgkbmMpIHZhcmRhcywgTUlOKGRpZW5hKSBudW8sIE1BWChkaWVuYSkgaWtpIEZST00gJFIgR1JPVVAgQlkgJGlkYyIsQVJSQVlfQSk7IH0gZWxzZSAkclsnbmVyYXN0YSddPVskaWRjLCRuY107CiAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-183147';
const GKEY='ps_s1740f';
const PHASES=["1", "2"];
const OUT='analize/s1740f.json';
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
