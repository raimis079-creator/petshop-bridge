process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjcwIHBsdWdpbnUgcGF0aWtyYSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2JrSyddKT8kX0dFVFsncHNfYmtLJ106JycpIT09J1AnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTY3MCcsJ3dwJz0+Y3VycmVudF90aW1lKCdteXNxbCcpKTsKICBnbG9iYWwgJHdwZGI7CiAgdHJ5ewogICAgaWYoIWZ1bmN0aW9uX2V4aXN0cygnZ2V0X3BsdWdpbnMnKSkgcmVxdWlyZV9vbmNlIEFCU1BBVEguJ3dwLWFkbWluL2luY2x1ZGVzL3BsdWdpbi5waHAnOwogICAgJHZpcz1nZXRfcGx1Z2lucygpOyAkYWt0PShhcnJheSlnZXRfb3B0aW9uKCdhY3RpdmVfcGx1Z2lucycpOwogICAgJG9bJ3BsdWdpbnVfdmlzbyddPWNvdW50KCR2aXMpOyAkb1snYWt0eXZpdSddPWNvdW50KCRha3QpOwogICAgJGl0YXJ0PWFycmF5KCk7CiAgICBmb3JlYWNoKCR2aXMgYXMgJHNsPT4kcCl7CiAgICAgICRkPVdQX1BMVUdJTl9ESVIuJy8nLmRpcm5hbWUoJHNsKTsKICAgICAgJG10PWlzX2RpcigkZCk/ZmlsZW10aW1lKCRkKTowOwogICAgICBpZigkbXQ+dGltZSgpLTcyMDApICRpdGFydFskc2xdPWFycmF5KCdwYXYnPT4kcFsnTmFtZSddLCd2ZXInPT4kcFsnVmVyc2lvbiddLCdrYXRhbG9nYXNfa2Vpc3Rhcyc9PmRhdGUoJ20tZCBIOmknLCRtdCksJ2FrdHl2dXMnPT5pbl9hcnJheSgkc2wsJGFrdCk/J1RBSVAnOiduZScpOwogICAgICBpZihwcmVnX21hdGNoKCcvcmVhbGx5LXNpbXBsZXx0ZXJtcy1jb25kaXRpb25zfGNvbXBsaWFuei9pJywkc2wpKSAkb1sncnNwJ11bJHNsXT1hcnJheSgkcFsnTmFtZSddLCRwWydWZXJzaW9uJ10saW5fYXJyYXkoJHNsLCRha3QpPydha3R5dnVzJzonbmVha3R5dnVzJyk7CiAgICB9CiAgICAkb1snbmF1amlfcGVyXzJ2YWwnXT0kaXRhcnQ/JGl0YXJ0OiduZXJhJzsKICAgIC8vIE5hdWppIHB1c2xhcGlhaS9wb3N0YWkKICAgICRvWyduYXVqaV9pcmFzYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxwb3N0X3RpdGxlLHBvc3RfdHlwZSxwb3N0X3N0YXR1cyxwb3N0X2RhdGUgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X2RhdGU+JzIwMjYtMDktMDkgMDg6MDA6MDAnIEFORCBwb3N0X3R5cGUgTk9UIElOICgncmV2aXNpb24nLCdzaG9wX29yZGVyX3BsYWNlaG9sZCcsJ3NjaGVkdWxlZC1hY3Rpb24nKSBPUkRFUiBCWSBJRCBERVNDIExJTUlUIDEwIixBUlJBWV9BKTsKICAgIC8vIFdTQyBidXNlbmEKICAgICRvWyd3c2MnXT1hcnJheSgnc3RhdHVzJz0+Z2V0X29wdGlvbignY21wbHpfd3NjX3N0YXR1cycpLCdzaWdudXAnPT5nZXRfb3B0aW9uKCdjbXBsel93c2Nfc2lnbnVwX3N0YXR1cycpLAogICAgICAnc2l0ZV9pZCc9PmdldF9vcHRpb24oJ2NtcGx6X3dzY19zaXRlX2lkJyksJ29uYm9hcmRpbmcnPT5nZXRfb3B0aW9uKCdjbXBsel93c2Nfb25ib2FyZGluZ19zdGF0dXMnKSwKICAgICAgJ2F1dGVudGlmaWt1b3Rhcyc9PihjbGFzc19leGlzdHMoJ2NtcGx6X3dzY19hdXRoJykpPyhjbXBsel93c2NfYXV0aDo6d3NjX2lzX2F1dGhlbnRpY2F0ZWQoKT8ndGFpcCc6J25lJyk6Jz8nKTsKICAgICRvWydjb29raWVzX24nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH1jbXBsel9jb29raWVzIik7CiAgICAkb1snc2VydmljZXNfbiddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cHJlZml4fWNtcGx6X3NlcnZpY2VzIik7CiAgICAkb1snc3ZldGFpbmUnXT13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSh3cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvJyksYXJyYXkoJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-072522';
const GKEY='ps_bkK';
const PHASES=["P"];
const OUT='analize/s1670_p.json';
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
