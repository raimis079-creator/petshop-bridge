process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI0dmYgVkYga29uc2VydsWzIGludmVudG9yaXVzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgyNHZmJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODI0dmYnXTsKICAkY2F0cz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHQuc2x1ZyBGUk9NIHskUH10ZXJtcyB0IEpPSU4geyRQfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV9pZD10LnRlcm1faWQgV0hFUkUgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JyBBTkQgdC5zbHVnIExJS0UgJyVrb25zZXJ2JSciKTsKICAkclsnY2F0cyddPSRjYXRzOwogICRpZHM9Z2V0X3Bvc3RzKFsncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PlsncHVibGlzaCcsJ2RyYWZ0J10sJ251bWJlcnBvc3RzJz0+LTEsJ2ZpZWxkcyc9PidpZHMnLCd0YXhfcXVlcnknPT5bWyd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2ZpZWxkJz0+J3NsdWcnLCd0ZXJtcyc9PiRjYXRzXV0sJ21ldGFfcXVlcnknPT5bWydrZXknPT4nX3BzX3NhbmRlbGlzJywndmFsdWUnPT4ndmYnXV1dKTsKICAka2lkcz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX3ZhbHVlIGIsIENPVU5UKCopIG4gRlJPTSB7JFB9cG9zdG1ldGEgbSBKT0lOIHskUH1wb3N0cyBwIE9OIHAuSUQ9bS5wb3N0X2lkIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBXSEVSRSBtLm1ldGFfa2V5PSdfZHBfYmFzZV9wcm9kdWN0X2lkJyBHUk9VUCBCWSBtZXRhX3ZhbHVlIixPQkpFQ1RfSyk7CiAgJHRvdD1bJ3Zpc2knPT4wLCdwdWJsaXNoJz0+MCwnaW5zdG9jayc9PjAsJ3N1X3Bha2Fpcyc9PjAsJ2JlX3Bha1VfaW5zdG9jayc9PjBdOyAkYnI9W107ICRzej1bXTsKICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHA9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoISRwKSBjb250aW51ZTsgJHRvdFsndmlzaSddKys7IGlmKCRwLT5nZXRfc3RhdHVzKCk9PT0ncHVibGlzaCcpICR0b3RbJ3B1Ymxpc2gnXSsrOwogICAgJGluPSRwLT5nZXRfc3RhdHVzKCk9PT0ncHVibGlzaCcgJiYgJHAtPmlzX2luX3N0b2NrKCk7IGlmKCRpbikgJHRvdFsnaW5zdG9jayddKys7CiAgICAkaHA9aXNzZXQoJGtpZHNbJGlkXSk7IGlmKCRocCkgJHRvdFsnc3VfcGFrYWlzJ10rKzsKICAgIGlmKCRpbiAmJiAhJGhwKXsgJHRvdFsnYmVfcGFrVV9pbnN0b2NrJ10rKzsgJGI9d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwcm9kdWN0X2JyYW5kJyxbJ2ZpZWxkcyc9PiduYW1lcyddKTsgJGI9JGJbMF0/Pyc/JzsgJGJyWyRiXT0oJGJyWyRiXT8/MCkrMTsKICAgICAgJGc9KGludClyb3VuZCgoZmxvYXQpJHAtPmdldF93ZWlnaHQoKSoxMDAwKTsgJHN6WyRnXT0oJHN6WyRnXT8/MCkrMTsKICAgICAgaWYoc3RyaXBvcygkcC0+Z2V0X25hbWUoKSwnZ3JhbmNhcm5vJykhPT1mYWxzZSkgJHJbJ2dyYW5jYXJubyddW109WyRpZCwkcC0+Z2V0X25hbWUoKSwkcC0+Z2V0X3ByaWNlKCksJHAtPmdldF9zdG9ja19xdWFudGl0eSgpLGdldF9wb3N0X21ldGEoJGlkLCdfcHNfZHlkemlvX3NlaW1hJyx0cnVlKV07IH0KICB9CiAgYXJzb3J0KCRicik7IGtzb3J0KCRzeik7ICRyKz1bJ3RvdCc9PiR0b3QsJ2JyYW5kJz0+JGJyLCdzdm9yaXNfZyc9PiRzel07CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-110115';
const GKEY='ps_s1824vf';
const PHASES=["1"];
const OUT='analize/s1824_vf.json';
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
