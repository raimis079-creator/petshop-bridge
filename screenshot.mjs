process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjc4IGFkc2Vuc2UgcGVydmFkaW5pbWFzICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPWlzc2V0KCRfR0VUWydwc19ibDInXSk/JF9HRVRbJ3BzX2JsMiddOicnOwogIGlmKCRmIT09J0EnJiYkZiE9PSdCJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2NzgnLCdmYXplJz0+JGYsJ3dwJz0+Y3VycmVudF90aW1lKCdteXNxbCcpKTsKICBnbG9iYWwgJHdwZGI7ICR0cz0kd3BkYi0+cHJlZml4LidjbXBsel9zZXJ2aWNlcyc7ICR0Yz0kd3BkYi0+cHJlZml4LidjbXBsel9jb29raWVzJzsKICB0cnl7CiAgICBpZigkZj09PSdBJyl7CiAgICAgICRlaWw9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIGAkdHNgIFdIRVJFIG5hbWU9J0dvb2dsZSBBZHNlbnNlJyIsQVJSQVlfQSk7CiAgICAgICRvWydyYXN0YSddPWNvdW50KCRlaWwpOwogICAgICB1cGRhdGVfb3B0aW9uKCdwc19zMTY3OF9hZHNlbnNlX2JhaycsJGVpbCxmYWxzZSk7CiAgICAgIC8vIHN5bmM9MCBrYWQgY29va2llZGF0YWJhc2Ugc2luY2hyb25pemFjaWphIG5lcGVycmFzeXR1IGF0Z2FsCiAgICAgICRvWyd1cGQnXT0kd3BkYi0+cXVlcnkoIlVQREFURSBgJHRzYCBTRVQgbmFtZT0nR29vZ2xlIEFkcycsIHNsdWc9J2dvb2dsZS1hZHMnLCBzeW5jPTAgV0hFUkUgbmFtZT0nR29vZ2xlIEFkc2Vuc2UnIik7CiAgICAgICRvWydrbGFpZGEnXT0kd3BkYi0+bGFzdF9lcnJvcjsKICAgICAgLy8gc2xhcHVrYW1zIHRvcyBwYXNsYXVnb3MgaXJnaSBzdXN0YWJkb20gc2luY2hyb25pemFjaWphLCBrYWQgbmVhdHN0YXR5dHUgcGF2YWRpbmltbyByeXNpbwogICAgICAkc2lkPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgSUQgRlJPTSBgJHRzYCBXSEVSRSBuYW1lPSdHb29nbGUgQWRzJyIpOwogICAgICBpZigkc2lkKXsgJGluPWltcGxvZGUoJywnLGFycmF5X21hcCgnaW50dmFsJywkc2lkKSk7CiAgICAgICAgJG9bJ3NsYXB1a2FpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQsbmFtZSxsYW5ndWFnZSxzZXJ2aWNlSUQgRlJPTSBgJHRjYCBXSEVSRSBzZXJ2aWNlSUQgSU4gKCRpbikiLEFSUkFZX0EpOwogICAgICAgICRvWyd1cGRfc2xhcHVrdSddPSR3cGRiLT5xdWVyeSgiVVBEQVRFIGAkdGNgIFNFVCBzeW5jPTAgV0hFUkUgc2VydmljZUlEIElOICgkaW4pIik7IH0KICAgICAgLy8ga2VzYXMKICAgICAgZm9yZWFjaCgkd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIG9wdGlvbl9uYW1lIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdfdHJhbnNpZW50X2NtcGx6JScgT1Igb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudF90aW1lb3V0X2NtcGx6JSciKSBhcyAkb24pIGRlbGV0ZV9vcHRpb24oJG9uKTsKICAgICAgZGVsZXRlX29wdGlvbignY21wbHpfdHJhbnNpZW50cycpOwogICAgICB1cGRhdGVfb3B0aW9uKCdjbXBsel9nZW5lcmF0ZV9uZXdfY29va2llcG9saWN5X3NuYXBzaG90Jyx0aW1lKCksZmFsc2UpOwogICAgfQogICAgaWYoJGY9PT0nQicpewogICAgICAkb1snc2VydmljZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxuYW1lLHNsdWcsbGFuZ3VhZ2Usc3luYyBGUk9NIGAkdHNgIE9SREVSIEJZIG5hbWUiLEFSUkFZX0EpOwogICAgICAkcj13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvc2xhcHVrdS1wb2xpdGlrYS8nKSxhcnJheSgndGltZW91dCc9PjQ1LCdzc2x2ZXJpZnknPT5mYWxzZSwnaGVhZGVycyc9PmFycmF5KCdVc2VyLUFnZW50Jz0+J01vemlsbGEvNS4wIENocm9tZS8xNTInLCdDYWNoZS1Db250cm9sJz0+J25vLWNhY2hlJykpKTsKICAgICAgJGI9aXNfd3BfZXJyb3IoJHIpPycnOndwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKICAgICAgJHR4PXRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHN0cmlwX3RhZ3MoJGIpKSk7CiAgICAgICRvWydwb2xpdGlrYSddPWFycmF5KCdrb2Rhcyc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSwKICAgICAgICAnYWRzZW5zZSc9PnN1YnN0cl9jb3VudCgkdHgsJ0Fkc2Vuc2UnKSwnZ29vZ2xlX2Fkcyc9PnN1YnN0cl9jb3VudCgkdHgsJ0dvb2dsZSBBZHMnKSwKICAgICAgICAnZ2NsX2F1Jz0+c3Vic3RyX2NvdW50KCR0eCwnX2djbF9hdScpLCd5YW5kZXgnPT5zdWJzdHJfY291bnQoJHR4LCdZYW5kZXgnKSwnY2xhcml0eSc9PnN1YnN0cl9jb3VudCgkdHgsJ0NsYXJpdHknKSk7CiAgICAgIGlmKHByZWdfbWF0Y2goJy8oLns4MH1fZ2NsX2F1LnsxNTB9KS9zdScsJHR4LCRtKSkgJG9bJ2djbF9rb250ZWtzdGFzJ109dHJpbSgkbVsxXSk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-083129';
const GKEY='ps_bl2';
const PHASES=["A", "B"];
const OUT='analize/s1678_a.json';
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
