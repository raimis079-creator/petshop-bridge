process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODU3YSBrbGFpZHUgZGlhZ25vc3Rpa2EgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODU3YiddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMjAwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4NTdiJ107CiAgdHJ5ewogICAgLy8gMSBFeGNsdXNpb246IGt1cmlvc2UgcHJla2VzZSAiZHJlZ21lIDc4IiArIHNhdXNhcwogICAgJHJbJ2V4Y2wnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCwgcG9zdF90aXRsZSwgcG9zdF9zdGF0dXMsIExPQ0FURSgnZHLEl2dtxJcgNzgnLHBvc3RfY29udGVudCkgZDc4LCBMT0NBVEUoJ8W+aXJuaWFpIDY1Jyxwb3N0X2NvbnRlbnQpIHo2NSwgQ0hBUl9MRU5HVEgocG9zdF9jb250ZW50KSBsZW4gRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF90aXRsZSBMSUtFICclRXhjbHVzaW9uJScgQU5EIChwb3N0X3RpdGxlIExJS0UgJyVraWF1bCUnKSBPUkRFUiBCWSBJRCIsQVJSQVlfQSk7CiAgICAka2lkPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgSUQgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF9uYW1lPSdqYXV0cmlhbS1tYXphbS1zdW5pdWktZXhjbHVzaW9uLWh5cG8tbWluaS1raWF1bGllbmEtMi1rZy1zYXVzYXMtNC1rb25zZXJ2YWknIEFORCBwb3N0X3R5cGU9J3Byb2R1Y3QnIik7CiAgICAkclsna2l0X2lkJ109JGtpZDsgJHJbJ2tpdF9tZXRhJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgbWV0YV9rZXksIExFRlQobWV0YV92YWx1ZSw0MDApIHYgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD0lZCBBTkQgKG1ldGFfa2V5IExJS0UgJyVyaW5rJScgT1IgbWV0YV9rZXkgTElLRSAnJWJ1bmRsZSUnIE9SIG1ldGFfa2V5IExJS0UgJyVraXQlJyBPUiBtZXRhX2tleSBMSUtFICclc3VkZXQlJyBPUiBtZXRhX2tleSBMSUtFICcla29tcCUnIE9SIG1ldGFfa2V5IExJS0UgJyVpdGVtcyUnKSIsJGtpZCksQVJSQVlfQSk7CiAgICAvLyAyIG5hdWphcy1zdW5pdWthcyBwdXNsYXBpcwogICAgJHA9JHdwZGItPmdldF9yb3coIlNFTEVDVCBJRCwgcG9zdF90eXBlLCBwb3N0X3N0YXR1cywgTEVGVChwb3N0X2NvbnRlbnQsNjAwKSBjIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfbmFtZT0nbmF1amFzLXN1bml1a2FzJyBPUkRFUiBCWSBwb3N0X3R5cGU9J3BhZ2UnIERFU0MgTElNSVQgMSIsQVJSQVlfQSk7ICRyWyducyddPSRwOwogICAgaWYoJHApICRyWyduc19tZXRhJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgbWV0YV9rZXksIExFRlQobWV0YV92YWx1ZSwyMDApIHYgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD0lZCBBTkQgbWV0YV9rZXkgTk9UIExJS0UgJ1xcX2VkaXQlJyIsJHBbJ0lEJ10pLEFSUkFZX0EpOwogICAgJHJbJ3NwcmVuZGltYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCwgcG9zdF9uYW1lLCBwb3N0X3R5cGUsIExFRlQocG9zdF9jb250ZW50LDEyMCkgYyBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvc3RfbmFtZSBJTiAoJ2phdXRydXMtdmlyc2tpbmltYXMnLCdpc3Jhbmt1cy1hdWdpbnRpbmlzJywnbmF1amFzLWthY2l1a2FzJywnbmF1amFzLXN1bml1a2FzJykiLEFSUkFZX0EpOwogICAgJHJbJ2xvY2FsZSddPWdldF9sb2NhbGUoKTsgJHJbJ3djX2x0J109ZmlsZV9leGlzdHMoV1BfTEFOR19ESVIuJy9wbHVnaW5zL3dvb2NvbW1lcmNlLWx0X0xULm1vJyk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydlcnInXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsgfSk7Cg==';
const VER='dep-175932';
const GKEY='ps_s1857b';
const PHASES=["1"];
const OUT='analize/s1857_b.json';
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
