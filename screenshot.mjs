process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjQ0IFQwIHRlc3RpbmlzIHV6c2FreW1hcyBQYXlzZXJhICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfdDAnXSk/JF9HRVRbJ3BzX3QwJ106JycpOyBpZigkZiE9PSdHTycmJiRmIT09J0NMJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2NDQnLCdmYXplJz0+JGYpOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsKICAgIGlmKCRmPT09J0dPJyl7CiAgICAgICRwaWQ9KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIHAuSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBwIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gcHIgT04gcHIucG9zdF9pZD1wLklEIEFORCBwci5tZXRhX2tleT0nX3ByaWNlJyBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHNzIE9OIHNzLnBvc3RfaWQ9cC5JRCBBTkQgc3MubWV0YV9rZXk9J19zdG9ja19zdGF0dXMnIEFORCBzcy5tZXRhX3ZhbHVlPSdpbnN0b2NrJyBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBDQVNUKHByLm1ldGFfdmFsdWUgQVMgREVDSU1BTCgxMCwyKSkgQkVUV0VFTiAyLjAwIEFORCAzLjUwIEFORCAoU0VMRUNUIENBU1Qoc3EubWV0YV92YWx1ZSBBUyBERUNJTUFMKDEwLDApKSBGUk9NIHdwX3Bvc3RtZXRhIHNxIFdIRVJFIHNxLnBvc3RfaWQ9cC5JRCBBTkQgc3EubWV0YV9rZXk9J19zdG9jaycgTElNSVQgMSk+PTMgT1JERVIgQlkgQ0FTVChwci5tZXRhX3ZhbHVlIEFTIERFQ0lNQUwoMTAsMikpIEFTQyBMSU1JVCAxIik7CiAgICAgIGlmKCEkcGlkKSAkcGlkPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBwLklEIEZST00geyR3cGRiLT5wb3N0c30gcCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHByIE9OIHByLnBvc3RfaWQ9cC5JRCBBTkQgcHIubWV0YV9rZXk9J19wcmljZScgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBzcyBPTiBzcy5wb3N0X2lkPXAuSUQgQU5EIHNzLm1ldGFfa2V5PSdfc3RvY2tfc3RhdHVzJyBBTkQgc3MubWV0YV92YWx1ZT0naW5zdG9jaycgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgQ0FTVChwci5tZXRhX3ZhbHVlIEFTIERFQ0lNQUwoMTAsMikpPj0xLjAwIE9SREVSIEJZIENBU1QocHIubWV0YV92YWx1ZSBBUyBERUNJTUFMKDEwLDIpKSBBU0MgTElNSVQgMSIpOwogICAgICBpZighJHBpZCkgdGhyb3cgbmV3IEV4Y2VwdGlvbignbmVyYXN0YSBwcmVrZXMnKTsKICAgICAgJHByPXdjX2dldF9wcm9kdWN0KCRwaWQpOwogICAgICAkb1sncHJla2UnXT1hcnJheSgnaWQnPT4kcGlkLCdza3UnPT4kcHItPmdldF9za3UoKSwncGF2Jz0+JHByLT5nZXRfbmFtZSgpLCdrYWluYSc9PiRwci0+Z2V0X3ByaWNlKCksJ3N0b2NrJz0+JHByLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSk7CiAgICAgICRndz0nJzsgZm9yZWFjaChXQygpLT5wYXltZW50X2dhdGV3YXlzKCktPnBheW1lbnRfZ2F0ZXdheXMoKSBhcyAkZyl7ICRvWydnYXRld2F5cyddW109JGctPmlkLic6Jy4kZy0+ZW5hYmxlZDsgaWYoJGd3PT09JycgJiYgc3RyaXBvcygkZy0+aWQsJ3BheXNlcmEnKSE9PWZhbHNlICYmICRnLT5lbmFibGVkPT09J3llcycpICRndz0kZy0+aWQ7IH0KICAgICAgJG9yZD13Y19jcmVhdGVfb3JkZXIoKTsKICAgICAgJG9yZC0+YWRkX3Byb2R1Y3QoJHByLDEpOwogICAgICAkb3JkLT5zZXRfYmlsbGluZ19lbWFpbChnZXRfb3B0aW9uKCdhZG1pbl9lbWFpbCcpKTsKICAgICAgJG9yZC0+c2V0X2JpbGxpbmdfZmlyc3RfbmFtZSgnVDAnKTsgJG9yZC0+c2V0X2JpbGxpbmdfbGFzdF9uYW1lKCdUZXN0YXMnKTsKICAgICAgaWYoJGd3KSAkb3JkLT5zZXRfcGF5bWVudF9tZXRob2QoJGd3KTsKICAgICAgJG9yZC0+Y2FsY3VsYXRlX3RvdGFscygpOwogICAgICAkb3JkLT51cGRhdGVfc3RhdHVzKCdwZW5kaW5nJywnUzE2NDQgVDAgUGF5c2VyYSB0ZXN0dWknKTsKICAgICAgJG9yZC0+c2F2ZSgpOwogICAgICAkb1snb2lkJ109JG9yZC0+Z2V0X2lkKCk7CiAgICAgICRvWydudW1lcmlzJ109JG9yZC0+Z2V0X29yZGVyX251bWJlcigpOwogICAgICAkb1snc3VtYSddPSRvcmQtPmdldF90b3RhbCgpOwogICAgICAkb1snZ3cnXT0kZ3c7CiAgICAgICRvWydrZXknXT0kb3JkLT5nZXRfb3JkZXJfa2V5KCk7CiAgICAgICRvWydwYXlfdXJsJ109JG9yZC0+Z2V0X2NoZWNrb3V0X3BheW1lbnRfdXJsKCk7CiAgICB9IGVsc2UgewogICAgICAkb2lkPTM1ODY3OwogICAgICBpZigkb2lkKXsgJG9kPXdjX2dldF9vcmRlcigkb2lkKTsgaWYoJG9kKXsgJG9kLT5kZWxldGUodHJ1ZSk7ICRvWydpc3RyaW50YSddPSRvaWQ7IH0gfQogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-222318';
const GKEY='ps_t0';
const PHASES=["CL", "GO"];
const OUT='analize/s1644b_t0_order.json';
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
