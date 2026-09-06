process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzQgcnVuIHIzIOKAlCAoUjMpIGVpbGnFsyBuYXYgc3UgUElMTkFJUyBhdXRoIGNvb2tpZXMgKFMxNjMyIHBhbW9rYSk7IGxhcGFzIGdlbmVyYXRvcml1cyBkYXJiYWxhdWt5amUuIFJFQUQtT05MWS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2MzRyMyddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjM0IHIzJyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJHR1PWdldF91c2VyX2J5KCdsb2dpbicsJ3Rlc3R1b3RvamFzJyk7ICR1aWQ9JHR1LT5JRDsgJGV4cD10aW1lKCkrOTAwOyAkdG9rPVdQX1Nlc3Npb25fVG9rZW5zOjpnZXRfaW5zdGFuY2UoJHVpZCktPmNyZWF0ZSgkZXhwKTsKICAkY3M9YXJyYXkoKTsKICBmb3JlYWNoKGFycmF5KGFycmF5KExPR0dFRF9JTl9DT09LSUUsJ2xvZ2dlZF9pbicpLGFycmF5KFNFQ1VSRV9BVVRIX0NPT0tJRSwnc2VjdXJlX2F1dGgnKSkgYXMgJGMpCiAgICAkY3NbXT1uZXcgV1BfSHR0cF9Db29raWUoYXJyYXkoJ25hbWUnPT4kY1swXSwndmFsdWUnPT53cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJGNbMV0sJHRvaykpKTsKICAkcj13cF9yZW1vdGVfZ2V0KGFkbWluX3VybCgnYWRtaW4ucGhwP3BhZ2U9cHMtZGVzayZlaWxlPXZpc2knKSxhcnJheSgnY29va2llcyc9PiRjcywndGltZW91dCc9PjkwLCdzc2x2ZXJpZnknPT5mYWxzZSkpOwogICRoPShzdHJpbmcpd3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOwogICRvWydjb2RlJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpOyAkb1snZHlkaXMnXT1zdHJsZW4oJGgpOyAkb1snbG9naW5fcHVzbGFwaXMnXT0oc3RycG9zKCRoLCd3cC1sb2dpbicpIT09ZmFsc2UgJiYgc3RycG9zKCRoLCdwcy1kZXNrJyk9PT1mYWxzZSk/MTowOwogIGZvcmVhY2goYXJyYXkoJ2RsLW5hdicsJ2RsLWVpbGVzJywnPG5hdicsJ2VpbGU9JykgYXMgJHopICRvWydraWVrJ11bJHpdPXN1YnN0cl9jb3VudCgkaCwkeik7CiAgJHBvcz1zdHJwb3MoJGgsJ2VpbGU9bGF1a2lhbScpOyBpZigkcG9zPT09ZmFsc2UpJHBvcz1zdHJwb3MoJGgsJ2VpbGU9Jyk7CiAgaWYoJHBvcyE9PWZhbHNlKXsgJHN0PW1heCgwLCRwb3MtNTAwKTsgJG9bJ2FwbGluayddPW1iX3N1YnN0cigkaCwkc3QsMTIwMCk7IH0KICBwcmVnX21hdGNoX2FsbCgnLyhHYXV0aXxOZWnFoXLFq8WhaXVvdGl8TGF1a2lhbXxTdXJpbmt0aSBBVnxEcm9wc2hpcHBpbmd8UGFydW/FoXRhfEtsYXVzaW1haXxOZWFwbW9rxJd0aXxWaXNpKVteMC05PF17MCwxNX0oXGQrKS91JywkaCwkbTIsUFJFR19TRVRfT1JERVIpOwogIGZvcmVhY2goYXJyYXlfc2xpY2UoJG0yLDAsMTIpIGFzICR4KSAkb1snc2snXVskeFsxXV09JHhbMl07CiAgLy8gbGFwYXMgZ2VuZXJhdG9yaXVzCiAgJGQ9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1kYXJiYWxhdWtpcy5waHAnKTsgJGxpbj1leHBsb2RlKCJcbiIsJGQpOwogIGZvcmVhY2goJGxpbiBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvU3VyaW5raW1vIGxhcGFzfHN1cmlua2ltb19sYXBhc3xsYXBhc1wofGZ1bmN0aW9uIC4qbGFwL2l1JywkbCkpICRvWydkbF9sYXBhcyddWyRpKzFdPXRyaW0obWJfc3Vic3RyKCRsLDAsMTMwKSk7IH0KICAkb1snZGxfbGFwYXMnXT1hcnJheV9zbGljZSgkb1snZGxfbGFwYXMnXT8/YXJyYXkoKSwwLDIwLHRydWUpOwogIGZvcmVhY2goJGxpbiBhcyAkaT0+JGwpeyBpZihzdHJwb3MoJGwsJ2dldF9za3UnKSE9PWZhbHNlICYmICgkaT4wKSYmcHJlZ19tYXRjaCgnL2xhcHxTdXJpbmsvaScsaW1wbG9kZSgnICcsYXJyYXlfc2xpY2UoJGxpbixtYXgoMCwkaS0zMCksMzApKSkpIHsgJG9bJ2RsX3NrdV9sYXBlJ11bJGkrMV09dHJpbShtYl9zdWJzdHIoJGwsMCwxMzApKTsgfSB9CiAgJG9bJ2RsX3NrdV9sYXBlJ109YXJyYXlfc2xpY2UoJG9bJ2RsX3NrdV9sYXBlJ10/P2FycmF5KCksMCwxMCx0cnVlKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDk5KTsK';
const VER='dep-190754';
const GKEY='ps_s1634r3';
const PHASES=["R3"];
const OUT='analize/s1634_r3.json';
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
