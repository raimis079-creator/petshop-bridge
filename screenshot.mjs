process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjY4IHdzYyByZXNldCAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj1pc3NldCgkX0dFVFsncHNfYmtHJ10pPyRfR0VUWydwc19ia0cnXTonJzsKICBpZigkZiE9PSdBJyYmJGYhPT0nQicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjY4WCcsJ2ZhemUnPT4kZik7CiAgZ2xvYmFsICR3cGRiOwogICRyYWt0YWk9YXJyYXkoJ2NtcGx6X3dzY19zdGF0dXMnLCdjbXBsel93c2Nfc2lnbnVwX3N0YXR1cycsJ2NtcGx6X3dzY19zaWdudXBfZGF0ZScsJ2NtcGx6X3dzY19vbmJvYXJkaW5nX3N0YXR1cycsJ2NtcGx6X3dzY19jb25zZW50X2NvbnNlbnRkYXRhJywnY21wbHpfY29uc2VudF93c2NfY29uc2VudCcsJ2NtcGx6X3dzY19zaXRlX2lkJywnY21wbHpfd3NjX3Rva2VuJywnY21wbHpfd3NjX2VtYWlsJyk7CiAgdHJ5ewogICAgaWYoJGY9PT0nQScpewogICAgICAvLyBCQUsgcGlsbmEga29waWphIHByaWVzIGxpZXNpYW50CiAgICAgICRiYWs9YXJyYXkoKTsgZm9yZWFjaCgkcmFrdGFpIGFzICRrKXsgJHY9Z2V0X29wdGlvbigkayk7IGlmKCR2IT09ZmFsc2UpICRiYWtbJGtdPSR2OyB9CiAgICAgIHVwZGF0ZV9vcHRpb24oJ3BzX3MxNjY4X3dzY19iYWsnLCRiYWssZmFsc2UpOwogICAgICAkb1snYmFrJ109YXJyYXlfa2V5cygkYmFrKTsKICAgICAgJG9bJ3ByaWVzJ109YXJyYXkoJ3N0YXR1cyc9PmdldF9vcHRpb24oJ2NtcGx6X3dzY19zdGF0dXMnKSwnc2lnbnVwJz0+Z2V0X29wdGlvbignY21wbHpfd3NjX3NpZ251cF9zdGF0dXMnKSwnc2l0ZV9pZCc9PmdldF9vcHRpb24oJ2NtcGx6X3dzY19zaXRlX2lkJykpOwogICAgICAvLyBSZXNldCBwZXIgcGx1Z2lubyBBUEkKICAgICAgaWYoY2xhc3NfZXhpc3RzKCdjbXBsel93c2Nfc2Nhbm5lcicpICYmIG1ldGhvZF9leGlzdHMoJ2NtcGx6X3dzY19zY2FubmVyJywnd3NjX3NjYW5fcmVzZXQnKSl7CiAgICAgICAgY21wbHpfd3NjX3NjYW5uZXI6OndzY19zY2FuX3Jlc2V0KCk7ICRvWydyZXNldCddPSdjbXBsel93c2Nfc2Nhbm5lcjo6d3NjX3NjYW5fcmVzZXQoKSBpdnlrZHl0YSc7CiAgICAgIH0gZWxzZSAkb1sncmVzZXQnXT0nbWV0b2RvIG5lcmEnOwogICAgICAvLyBTZW5vcyBkZXYuYXZlc2EubHQgcmVnaXN0cmFjaWpvcyB6eW1lcwogICAgICBmb3JlYWNoKGFycmF5KCdjbXBsel93c2NfY29uc2VudF9jb25zZW50ZGF0YScsJ2NtcGx6X2NvbnNlbnRfd3NjX2NvbnNlbnQnLCdjbXBsel93c2Nfc2lnbnVwX3N0YXR1cycsJ2NtcGx6X3dzY19zdGF0dXMnLCdjbXBsel93c2Nfc2lnbnVwX2RhdGUnLCdjbXBsel93c2Nfc2l0ZV9pZCcsJ2NtcGx6X3dzY190b2tlbicpIGFzICRrKSBkZWxldGVfb3B0aW9uKCRrKTsKICAgICAgJG9bJ3BvJ109YXJyYXkoJ3N0YXR1cyc9PmdldF9vcHRpb24oJ2NtcGx6X3dzY19zdGF0dXMnKSwnc2lnbnVwJz0+Z2V0X29wdGlvbignY21wbHpfd3NjX3NpZ251cF9zdGF0dXMnKSwnc2l0ZV9pZCc9PmdldF9vcHRpb24oJ2NtcGx6X3dzY19zaXRlX2lkJyksCiAgICAgICAgJ29uYm9hcmRpbmcnPT5nZXRfb3B0aW9uKCdjbXBsel93c2Nfb25ib2FyZGluZ19zdGF0dXMnKSk7CiAgICAgICRvWydsaWt1c2lvc193c2MnXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIG9wdGlvbl9uYW1lIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICcld3NjJSciKTsKICAgIH0KICAgIGlmKCRmPT09J0InKXsKICAgICAgJG9bJ2J1c2VuYSddPWFycmF5KCdzdGF0dXMnPT5nZXRfb3B0aW9uKCdjbXBsel93c2Nfc3RhdHVzJyksJ3NpZ251cCc9PmdldF9vcHRpb24oJ2NtcGx6X3dzY19zaWdudXBfc3RhdHVzJyksCiAgICAgICAgJ3NpdGVfaWQnPT5nZXRfb3B0aW9uKCdjbXBsel93c2Nfc2l0ZV9pZCcpLCdvbmJvYXJkaW5nJz0+Z2V0X29wdGlvbignY21wbHpfd3NjX29uYm9hcmRpbmdfc3RhdHVzJyksCiAgICAgICAgJ2F1dGVudGlmaWt1b3Rhcyc9PihjbGFzc19leGlzdHMoJ2NtcGx6X3dzY19hdXRoJykmJm1ldGhvZF9leGlzdHMoJ2NtcGx6X3dzY19hdXRoJywnd3NjX2lzX2F1dGhlbnRpY2F0ZWQnKSk/KGNtcGx6X3dzY19hdXRoOjp3c2NfaXNfYXV0aGVudGljYXRlZCgpPyd0YWlwJzonbmUnKTonPycsCiAgICAgICAgJ3NjYW5fZW5hYmxlZCc9PihjbGFzc19leGlzdHMoJ2NtcGx6X3dzY19zY2FubmVyJykmJm1ldGhvZF9leGlzdHMoJ2NtcGx6X3dzY19zY2FubmVyJywnd3NjX3NjYW5fZW5hYmxlZCcpKT8nbWV0b2RhcyB5cmEnOic/Jyk7CiAgICAgICRvWydiYWtfeXJhJ109aXNfYXJyYXkoZ2V0X29wdGlvbigncHNfczE2Njhfd3NjX2JhaycpKT8ndGFpcCc6J25lJzsKICAgICAgJG9bJ3N2ZXRhaW5lX29rJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUod3BfcmVtb3RlX2dldChob21lX3VybCgnL3NsYXB1a3UtcG9saXRpa2EvJyksYXJyYXkoJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKSk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-071327';
const GKEY='ps_bkG';
const PHASES=["A", "B"];
const OUT='analize/s1668_x.json';
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
