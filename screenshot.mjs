process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjc0IHdzYyBidWtsZSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2JrVCddKT8kX0dFVFsncHNfYmtUJ106JycpIT09J1MnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTY3NFMnLCd3cCc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSk7CiAgZ2xvYmFsICR3cGRiOwogIHRyeXsKICAgICRvWyd3c2MnXT1hcnJheSgKICAgICAgJ3N0YXR1cyc9PmdldF9vcHRpb24oJ2NtcGx6X3dzY19zdGF0dXMnKSwKICAgICAgJ3NpZ251cCc9PmdldF9vcHRpb24oJ2NtcGx6X3dzY19zaWdudXBfc3RhdHVzJyksCiAgICAgICdvbmJvYXJkaW5nJz0+Z2V0X29wdGlvbignY21wbHpfd3NjX29uYm9hcmRpbmdfc3RhdHVzJyksCiAgICAgICdzaXRlX2lkJz0+Z2V0X29wdGlvbignY21wbHpfd3NjX3NpdGVfaWQnKSwKICAgICAgJ2VtYWlsJz0+Z2V0X29wdGlvbignY21wbHpfd3NjX2VtYWlsJyksCiAgICAgICdkaXNtaXNzZWQnPT5nZXRfb3B0aW9uKCdjbXBsel93c2NfZGlzbWlzc2VkJyksCiAgICAgICdyZXNldF9jb21wbGV0ZSc9PmdldF9vcHRpb24oJ2NtcGx6X3dzY19yZXNldF9jb21wbGV0ZScpLAogICAgICAnYXV0ZW50aWZpa3VvdGFzJz0+Y2xhc3NfZXhpc3RzKCdjbXBsel93c2NfYXV0aCcpPyhjbXBsel93c2NfYXV0aDo6d3NjX2lzX2F1dGhlbnRpY2F0ZWQoKT8nVEFJUCc6J25lJyk6Jz8nLAogICAgKTsKICAgIGZvcmVhY2goJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsTEVGVChvcHRpb25fdmFsdWUsOTApIHYgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyV3c2MlJyBPUkRFUiBCWSBvcHRpb25fbmFtZSIsQVJSQVlfQSkgYXMgJHIpICRvWyd2aXNvc193c2MnXVskclsnb3B0aW9uX25hbWUnXV09JHJbJ3YnXTsKICAgICRvWydjb29raWVzX24nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH1jbXBsel9jb29raWVzIik7CiAgICAkb1snY29va2llc19sdCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cHJlZml4fWNtcGx6X2Nvb2tpZXMgV0hFUkUgbGFuZ3VhZ2U9J2x0JyIpOwogICAgJG9bJ3NlcnZpY2VzX24nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH1jbXBsel9zZXJ2aWNlcyIpOwogICAgJG9bJ2Nvb2tpZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxuYW1lLGxhbmd1YWdlLHN5bmMsc2hvd09uUG9saWN5IEZST00geyR3cGRiLT5wcmVmaXh9Y21wbHpfY29va2llcyBPUkRFUiBCWSBJRCBERVNDIExJTUlUIDE1IixBUlJBWV9BKTsKICAgICRvWydzY2FuJ109YXJyYXkoJ3Byb2dyZXNzJz0+Z2V0X29wdGlvbignY21wbHpfd3NjX3NjYW5fcHJvZ3Jlc3MnKSwnc2Nhbl9pZCc9PmdldF9vcHRpb24oJ2NtcGx6X3dzY19zY2FuX2lkJyksCiAgICAgICdsYXN0X3NjYW4nPT5nZXRfb3B0aW9uKCdjbXBsel93c2NfbGFzdF9zY2FuJyksJ3N5bmNfY29tcGxldGUnPT5nZXRfb3B0aW9uKCdjbXBsel9zeW5jX2Nvb2tpZXNfY29tcGxldGUnKSk7CiAgICAvLyBwb2xpdGlrb3MgcHVzbGFwaXMKICAgICRyPXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy9zbGFwdWt1LXBvbGl0aWthLycpLGFycmF5KCd0aW1lb3V0Jz0+NDAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdoZWFkZXJzJz0+YXJyYXkoJ1VzZXItQWdlbnQnPT4nTW96aWxsYS81LjAgQ2hyb21lLzE1MicpKSk7CiAgICAkYj1pc193cF9lcnJvcigkcik/Jyc6d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOwogICAgJG9bJ3BvbGl0aWthJ109YXJyYXkoJ2tvZGFzJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpLCdvdmVydmlld190dXNjaWFzJz0+c3Vic3RyX2NvdW50KCRiLCdpZD0iY21wbHotY29va2llcy1vdmVydmlldyI+PC9kaXY+JyksCiAgICAgICd0cic9PnN1YnN0cl9jb3VudCgkYiwnPHRyJyksJ25lc2luY2hyb25penVvdGFzJz0+c3Vic3RyX2NvdW50KCRiLCduZXNpbmNocm9uaXp1b3RhcycpKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-080930';
const GKEY='ps_bkT';
const PHASES=["S"];
const OUT='analize/s1674_s.json';
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
