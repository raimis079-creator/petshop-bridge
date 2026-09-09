process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjc0IHBvbGl0aWtvcyBwYXRpa3JhICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfYmtVJ10pPyRfR0VUWydwc19ia1UnXTonJykhPT0nVicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjc0VicsJ3dwJz0+Y3VycmVudF90aW1lKCdteXNxbCcpKTsKICBnbG9iYWwgJHdwZGI7CiAgdHJ5ewogICAgJHI9d3BfcmVtb3RlX2dldChob21lX3VybCgnL3NsYXB1a3UtcG9saXRpa2EvJyksYXJyYXkoJ3RpbWVvdXQnPT40NSwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2hlYWRlcnMnPT5hcnJheSgnVXNlci1BZ2VudCc9PidNb3ppbGxhLzUuMCBDaHJvbWUvMTUyJywnQ2FjaGUtQ29udHJvbCc9Piduby1jYWNoZScpKSk7CiAgICAkYj1pc193cF9lcnJvcigkcik/Jyc6d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOwogICAgJHR4PXRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN0cmlwX3RhZ3MoJGIpKSk7CiAgICAkb1sncHVzbGFwaXMnXT1hcnJheSgna29kYXMnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkciksJ2lsZ2lzJz0+c3RybGVuKCRiKSwKICAgICAgJ292ZXJ2aWV3X2Rpdic9PnN1YnN0cl9jb3VudCgkYiwnY21wbHotY29va2llcy1vdmVydmlldycpLAogICAgICAndHVzY2lhc19kaXYnPT5zdWJzdHJfY291bnQoJGIsJ2lkPSJjbXBsei1jb29raWVzLW92ZXJ2aWV3Ij48L2Rpdj4nKSwKICAgICAgJ2NtcGx6X2xlbnRlbGUnPT5zdWJzdHJfY291bnQoJGIsJ2NtcGx6LWNvb2tpZXMtcGVyLXB1cnBvc2UnKStzdWJzdHJfY291bnQoJGIsJ2NtcGx6LXNlcnZpY2UtaGVhZGVyJykrc3Vic3RyX2NvdW50KCRiLCdjbXBsei1jb29raWUtbmFtZScpLAogICAgICAnbmVzaW5jaHJvbml6dW90YXMnPT5zdWJzdHJfY291bnQoJHR4LCduZXNpbmNocm9uaXp1b3RhcycpLAogICAgICAnZXhfY29tJz0+c3Vic3RyX2NvdW50KCR0eCwnZXguY29tJykpOwogICAgaWYocHJlZ19tYXRjaCgnL8SuZMSXdGkgc2xhcHVrYWkoLnswLDE0MDB9KS9zdScsJHR4LCRtKSkgJG9bJ3NreXJpdXNfNiddPXRyaW0oJG1bMV0pOwogICAgLy8gcGFzbGF1Z29zCiAgICAkb1snc2VydmljZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxuYW1lLGxhbmd1YWdlLHN5bmMgRlJPTSB7JHdwZGItPnByZWZpeH1jbXBsel9zZXJ2aWNlcyBPUkRFUiBCWSBuYW1lIExJTUlUIDIwIixBUlJBWV9BKTsKICAgICRvWydjb29raWVzX3BhZ2FsX2thbGJhJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbGFuZ3VhZ2UsQ09VTlQoKikgayBGUk9NIHskd3BkYi0+cHJlZml4fWNtcGx6X2Nvb2tpZXMgR1JPVVAgQlkgbGFuZ3VhZ2UiLEFSUkFZX0EpOwogICAgLy8gbG9nYWkKICAgICRsZz1nZXRfb3B0aW9uKCdjbXBsel93c2NfbG9ncycpOyAkb1snd3NjX2xvZ2FpJ109aXNfYXJyYXkoJGxnKT9hcnJheV9zbGljZSgkbGcsMCw1KTokbGc7CiAgICAkb1snYnVrbGUnXT1hcnJheSgnYXV0aCc9PmNtcGx6X3dzY19hdXRoOjp3c2NfaXNfYXV0aGVudGljYXRlZCgpPydUQUlQJzonbmUnLCdzdGF0dXMnPT5nZXRfb3B0aW9uKCdjbXBsel93c2Nfc3RhdHVzJyksCiAgICAgICdzaXRlX2lkJz0+Z2V0X29wdGlvbignY21wbHpfd3NjX3NpdGVfaWQnKSwnY2hlY2tzX3NjYW5faWQnPT5nZXRfb3B0aW9uKCdjbXBsel93c2NfY2hlY2tzX3NjYW5faWQnKSk7CiAgICAvLyB2ZWRsaW8gYXRzYWt5bWFpIOKAlCBhciBkYXIgcmVpa2lhIHRhaXN5dGkKICAgICRjbz1nZXRfb3B0aW9uKCdjbXBsel9vcHRpb25zJyk7CiAgICBmb3JlYWNoKGFycmF5KCd1c2VzX3RoaXJkcGFydHlfc2VydmljZXMnLCd0aGlyZHBhcnR5X3NlcnZpY2VzX29uX3NpdGUnLCdjb25zZW50LW1vZGUnLCdndG1fY29kZScsJ3VhX2NvZGUnLCdhd19jb2RlJywnY29tcGlsZV9zdGF0aXN0aWNzJywndXNlc19hZF9jb29raWVzJykgYXMgJGspICRvWyd2ZWRseXMnXVska109aXNzZXQoJGNvWyRrXSk/KGlzX2FycmF5KCRjb1ska10pP2ltcGxvZGUoJywnLCRjb1ska10pOiRjb1ska10pOiduZXJhJzsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-081123';
const GKEY='ps_bkU';
const PHASES=["V"];
const OUT='analize/s1674_v.json';
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
