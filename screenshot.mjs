process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODkgZSDigJQgcmVhZC1vbmx5OiBrdXIgYmxva3VvamFtYXMgYnJlbmRhcyBFWENMIFZFVERJRVQgKGtvZGFzLCBvcGNpam9zLCBvYnNlcnZlciwgdGVybWluYWkpLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zMTY4OWUnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTY4OSBlJyk7CiAgLy8gMS4gb3BjaWpvcyBzdSBicmVuZHUvYmxva2F2aW1vIHBhdmFkaW5pbWFpcwogICRvWydvcHRfdmFyZGFpJ109JHdwZGItPmdldF9jb2woIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyVicmVuZCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVicmFuZCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVibG9rJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJWJsb2NrJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJWV4Y2x1ZGUlJyBPUiBvcHRpb25fbmFtZSBMSUtFICclaWdub3IlJyBMSU1JVCA2MCIpOwogIGZvcmVhY2goKGFycmF5KSRvWydvcHRfdmFyZGFpJ10gYXMgJG4peyAkdj1nZXRfb3B0aW9uKCRuKTsgJHM9aXNfc2NhbGFyKCR2KT8oc3RyaW5nKSR2Ompzb25fZW5jb2RlKCR2LEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBpZihzdHJpcG9zKCRzLCdWRVRESUVUJykhPT1mYWxzZXx8c3RyaXBvcygkcywnRVhDTCcpIT09ZmFsc2V8fHN0cmxlbigkcyk8NDAwKSAkb1snb3B0J11bJG5dPW1iX3N1YnN0cigkcywwLDQwMCk7IH0KICAvLyAyLiBrb2RhczogVkVURElFVAogICRoaXQ9YXJyYXkoKTsKICBmb3JlYWNoKGFycmF5KFdQTVVfUExVR0lOX0RJUiwgV1BfUExVR0lOX0RJUikgYXMgJGQpeyBpZighaXNfZGlyKCRkKSkgY29udGludWU7CiAgICBmb3JlYWNoKG5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZCkpIGFzICRmaSl7CiAgICAgIGlmKCEkZmktPmlzRmlsZSgpKSBjb250aW51ZTsgJGU9c3RydG9sb3dlcigkZmktPmdldEV4dGVuc2lvbigpKTsgaWYoIWluX2FycmF5KCRlLGFycmF5KCdwaHAnLCdqc29uJywndHh0JykpKSBjb250aW51ZTsKICAgICAgJGM9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmaS0+Z2V0UGF0aG5hbWUoKSk7IGlmKCRjPT09ZmFsc2V8fHN0cmlwb3MoJGMsJ1ZFVERJRVQnKT09PWZhbHNlKSBjb250aW51ZTsKICAgICAgZm9yZWFjaChleHBsb2RlKCJcbiIsJGMpIGFzICRsbj0+JGxpbmUpeyBpZihzdHJpcG9zKCRsaW5lLCdWRVRESUVUJykhPT1mYWxzZSkgJGhpdFtdPXN0cl9yZXBsYWNlKEFCU1BBVEgsJycsJGZpLT5nZXRQYXRobmFtZSgpKS4nOicuKCRsbisxKS4nICcudHJpbShtYl9zdWJzdHIoJGxpbmUsMCwyMDApKTsgfQogICAgfQogIH0KICAkb1sna29kYXNfdmV0ZGlldCddPWFycmF5X3NsaWNlKCRoaXQsMCw0MCk7CiAgLy8gMy4gc25pcHBldGFpIChDb2RlIFNuaXBwZXRzIERCKQogICRzbj0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSxMRU5HVEgoY29kZSkgbCBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBjb2RlIExJS0UgJyVWRVRESUVUJScgT1IgbmFtZSBMSUtFICclYnJlbmQlJyBPUiBuYW1lIExJS0UgJyVWRiUnIixBUlJBWV9BKTsKICAkb1snc25pcHBldGFpJ109JHNuOyAkb1snc25fZXJyJ109JHdwZGItPmxhc3RfZXJyb3I7CiAgJG9bJ3NuX3ZldGRpZXQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSxTVUJTVFJJTkcoY29kZSxHUkVBVEVTVCgxLExPQ0FURSgnVkVURElFVCcsY29kZSktMzAwKSw3MDApIGZyYWcgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgY29kZSBMSUtFICclVkVURElFVCUnIixBUlJBWV9BKTsKICAvLyA0LiBvYnNlcnZlcgogICRvWydvYnNlcnZlcl9jb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskcH12Zl9vYnNlcnZlciIpOwogICRvWydvYnNlcnZlcl92ZXRkaWV0J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskcH12Zl9vYnNlcnZlciBXSEVSRSBza3UgTElLRSAnSU5QJScgT1Igc2t1IExJS0UgJ0hFUCUnIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMTAiLEFSUkFZX0EpOwogIC8vIDUuIGJyZW5kbyB0ZXJtaW5hcyBXUAogICR0PWdldF90ZXJtcyhhcnJheSgndGF4b25vbXknPT4ncHJvZHVjdF9icmFuZCcsJ2hpZGVfZW1wdHknPT5mYWxzZSwnc2VhcmNoJz0+J1ZFVERJRVQnKSk7CiAgaWYoaXNfd3BfZXJyb3IoJHQpKSAkdD1nZXRfdGVybXMoYXJyYXkoJ3RheG9ub215Jz0+J3BhX2JyZW5kYXMnLCdoaWRlX2VtcHR5Jz0+ZmFsc2UsJ3NlYXJjaCc9PidWRVRESUVUJykpOwogICRvWyd0ZXJtaW5hcyddPWlzX3dwX2Vycm9yKCR0KT8kdC0+Z2V0X2Vycm9yX21lc3NhZ2UoKTpqc29uX2RlY29kZShqc29uX2VuY29kZSgkdCksdHJ1ZSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-155154';
const GKEY='ps_s1689e';
const PHASES=["GO"];
const OUT='analize/s1689_e.json';
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
