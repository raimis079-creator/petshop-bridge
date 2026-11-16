process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODc0dDIgcHJpc2lqdW5naW1vIGRlcmluaW1hcyAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKGlzc2V0KCRfR0VUWydwc19zMTg3NHcnXSkpeyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyAkaz1hcnJheV9rZXlzKCRfQ09PS0lFKTsgJGxpPSRfQ09PS0lFW0xPR0dFRF9JTl9DT09LSUVdPz8nJzsgZWNobyBqc29uX2VuY29kZShbJ3VpZCc9PmdldF9jdXJyZW50X3VzZXJfaWQoKSwna2V5cyc9PiRrLCd2Jz0+d3BfdmFsaWRhdGVfYXV0aF9jb29raWUoJGxpLCdsb2dnZWRfaW4nKSwnbGVuJz0+c3RybGVuKCRsaSksJ3ByYWR6aWEnPT5zdWJzdHIoJGxpLDAsMzApXSk7IGV4aXQ7IH0KICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODc0dSddKSkgcmV0dXJuOyAkcj1bJ3YnPT4ndDInLCdzaG90cyc9PltdXTsKICAkdWlkPTQ0OyAkZXhwPXRpbWUoKSszKkhPVVJfSU5fU0VDT05EUzsgJHRvaz1XUF9TZXNzaW9uX1Rva2Vuczo6Z2V0X2luc3RhbmNlKCR1aWQpLT5jcmVhdGUoJGV4cCk7CiAgJGxpPXdwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnbG9nZ2VkX2luJywkdG9rKTsKICAkclsnY29va2llcyddPVtbJ25hbWUnPT5MT0dHRURfSU5fQ09PS0lFLCd2YWx1ZSc9PiRsaSwnZG9tYWluJz0+J3BldHNob3AubHQnXSxbJ25hbWUnPT4ncHNfanMnLCd2YWx1ZSc9PicxJywnZG9tYWluJz0+J3BldHNob3AubHQnXV07CiAgJHJbJ2NuYW1lJ109TE9HR0VEX0lOX0NPT0tJRTsgJHJbJ3NpdGUnXT1zaXRlX3VybCgpOyAkclsnaG9tZSddPWhvbWVfdXJsKCk7ICRyWydjZG9tJ109ZGVmaW5lZCgnQ09PS0lFX0RPTUFJTicpP0NPT0tJRV9ET01BSU46bnVsbDsgJHJbJ2NwYXRoJ109Q09PS0lFUEFUSDsKICAkeD13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvcGFza3lyYS9wcmVudW1lcmF0b3MvP25jPScudGltZSgpKSxbJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2Nvb2tpZXMnPT5bTE9HR0VEX0lOX0NPT0tJRT0+JGxpXV0pOwogICRiPWlzX3dwX2Vycm9yKCR4KT8nRVJSJzp3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkeCk7ICRyWydzZXJ2ZXInXT1bJ2tvZGFzJz0+aXNfd3BfZXJyb3IoJHgpPzA6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpLCdsb2dnZWQnPT5zdHJwb3MoJGIsJ2xvZ2dlZC1pbicpIT09ZmFsc2UsJ3BzbjMnPT5zdWJzdHJfY291bnQoJGIsJ3BzbjMtJyksJ2hkcic9PmlzX3dwX2Vycm9yKCR4KT8nJzp3cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVyKCR4LCdjZi1jYWNoZS1zdGF0dXMnKV07CiAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4NzRfZGJnMicsJ3UnPT5ob21lX3VybCgnLz9wc19zMTg3NHc9MSZuYz0nLnRpbWUoKSksJ3cnPT4zOTAsJ2gnPT40MDAsJ2V2YWwnPT4nZG9jdW1lbnQuYm9keS5pbm5lclRleHQnXTsKICAkclsnc2hvdHMnXVtdPVsnbic9PidzMTg3NF9kYmcnLCd1Jz0+aG9tZV91cmwoJy9wYXNreXJhL3ByZW51bWVyYXRvcy8/bmM9Jy50aW1lKCkpLCd3Jz0+MzkwLCdoJz0+OTAwLCdldmFsJz0+ImRvY3VtZW50LmJvZHkuY2xhc3NOYW1lLmluZGV4T2YoJ2xvZ2dlZC1pbicpKycgfCAnK2RvY3VtZW50LmNvb2tpZS5sZW5ndGgiXTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-213806';
const GKEY='ps_s1874u';
const PHASES=["GO"];
const OUT='analize/s1874_t2.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
