process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjk3IGZlZWQgcmVjb24gMyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfczE2OTcnXSk/JF9HRVRbJ3BzX3MxNjk3J106JycpOyBpZigkZiE9PScxJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2OTcgbWMyJyk7CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkVz0ieyRwfXBzX3dlYl9pdnlraWFpIjsKICB0cnl7CiAgICAkb1snc2VzX2RpZW5hJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgREFURShsYWlrYXMpIGQsIHJlZmVyZXJfZG9tZW5hcyBoLCBDT1VOVChESVNUSU5DVCBzZXNpamEpIHMsIENPVU5UKCopIG4gRlJPTSAkVyBXSEVSRSAocmVmZXJlcl9kb21lbmFzIExJS0UgJyVrYWluYTI0JScgT1IgcmVmZXJlcl9kb21lbmFzIExJS0UgJyVrYWlub3MubHQlJyBPUiByZWZlcmVyX2RvbWVuYXMgTElLRSAnJWthaW5vdGVrYSUnKSBBTkQgbGFpa2FzPj0nMjAyNi0wOS0xMycgR1JPVVAgQlkgZCxoIE9SREVSIEJZIGQiLEFSUkFZX0EpOwogICAgJG9bJ3Nlc192aXNvJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcmVmZXJlcl9kb21lbmFzIGgsIENPVU5UKERJU1RJTkNUIHNlc2lqYSkgcywgQ09VTlQoRElTVElOQ1QgREFURShsYWlrYXMpKSBkaWVub3MgRlJPTSAkVyBXSEVSRSAocmVmZXJlcl9kb21lbmFzIExJS0UgJyVrYWluYTI0JScgT1IgcmVmZXJlcl9kb21lbmFzIExJS0UgJyVrYWlub3MubHQlJyBPUiByZWZlcmVyX2RvbWVuYXMgTElLRSAnJWthaW5vdGVrYSUnKSBBTkQgbGFpa2FzPj0nMjAyNi0wOS0xMycgR1JPVVAgQlkgaCIsQVJSQVlfQSk7CiAgICAkb1snc2VzX3Zpc29fdmlzaSddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoRElTVElOQ1Qgc2VzaWphKSBGUk9NICRXIFdIRVJFIGxhaWthcz49JzIwMjYtMDktMTMnIik7CiAgICAkb1snaXZ5a2lhaV90aXBhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSAkVyBXSEVSRSByZWZlcmVyX2RvbWVuYXMgTElLRSAnJWthaW5hMjQlJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDIiLEFSUkFZX0EpOwogICAgLy8gcGlybWFzIHNlc2lqb3MgaXZ5a2lzIHN1IGthaW51IHJlZmVyZXIgLT4gbGFuZGluZyBwcmVrZSAtPiBicmVuZGFzOyBzZXNpam9zIGlyIHV6c2FreW1haSBwYWdhbCBicmVuZGEKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHcuc2VzaWphLCBNSU4ody5pZCkgbWlkIEZST00gJFcgdyBXSEVSRSAody5yZWZlcmVyX2RvbWVuYXMgTElLRSAnJWthaW5hMjQlJyBPUiB3LnJlZmVyZXJfZG9tZW5hcyBMSUtFICcla2Fpbm9zLmx0JScgT1Igdy5yZWZlcmVyX2RvbWVuYXMgTElLRSAnJWthaW5vdGVrYSUnKSBBTkQgdy5sYWlrYXM+PScyMDI2LTA5LTEzJyBHUk9VUCBCWSB3LnNlc2lqYSIsQVJSQVlfQSk7CiAgICAkYnI9YXJyYXkoKTsgJHNrdT1hcnJheSgpOwogICAgZm9yZWFjaCgkcm93cyBhcyAkcil7ICR1PSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgdXJsX2tlbGlhcyBGUk9NICRXIFdIRVJFIGlkPSIuKGludCkkclsnbWlkJ10pOyBpZihzdHJwb3MoJHUsJy9wcm9kdWN0LycpIT09MCl7ICRiclsnKG5lIHByZWvElyknXT0oJGJyWycobmUgcHJla8SXKSddPz8wKSsxOyBjb250aW51ZTsgfQogICAgICAkc2x1Zz10cmltKGV4cGxvZGUoJz8nLHN1YnN0cigkdSw5KSlbMF0sJy8nKTsgJHBpZD0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIElEIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfbmFtZT0lcyBBTkQgcG9zdF90eXBlPSdwcm9kdWN0JyBMSU1JVCAxIiwkc2x1ZykpOwogICAgICAkYj0kcGlkPygkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIHQubmFtZSBGUk9NIHskcH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgSk9JTiB7JHB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgQU5EIHR0LnRheG9ub215PSdwcm9kdWN0X2JyYW5kJyBKT0lOIHskcH10ZXJtcyB0IE9OIHQudGVybV9pZD10dC50ZXJtX2lkIFdIRVJFIHRyLm9iamVjdF9pZD0kcGlkIExJTUlUIDEiKT86Jz8nKTonKG5lcmFzdGEpJzsKICAgICAgJGJyWyRiXT0oJGJyWyRiXT8/MCkrMTsgJGs9JHBpZD86JHNsdWc7IGlmKCFpc3NldCgkc2t1WyRrXSkpICRza3VbJGtdPWFycmF5KCdwaWQnPT4kcGlkLCdiJz0+JGIsJ3Nlcyc9PjAsJ3NsdWcnPT4kc2x1Zywna2FpbmEnPT4kcGlkP2dldF9wb3N0X21ldGEoJHBpZCwnX3ByaWNlJyx0cnVlKTonJywnc2F2Jz0+JHBpZD8oZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfY29zdF9wcmljZScsdHJ1ZSk/OmdldF9wb3N0X21ldGEoJHBpZCwnX3ZmX2Nvc3QnLHRydWUpPzpnZXRfcG9zdF9tZXRhKCRwaWQsJ196Yl9jb3N0Jyx0cnVlKSk6JycpOyAkc2t1WyRrXVsnc2VzJ10rKzsgfQogICAgYXJzb3J0KCRicik7IHVhc29ydCgkc2t1LGZ1bmN0aW9uKCRhLCRiKXtyZXR1cm4gJGJbJ3NlcyddLSRhWydzZXMnXTt9KTsKICAgICRvWydzZXNfYnJlbmRhaSddPSRicjsgJG9bJ3Nlc19za3UnXT1hcnJheV9zbGljZShhcnJheV92YWx1ZXMoJHNrdSksMCw1MCk7CiAgICAvLyBrYWluYTI0LnhtbDogc3RvY2sgMCBraWVraXMgaXIgcGFnYWwgYnJlbmRhCiAgICAkdXA9d3BfdXBsb2FkX2RpcigpOyAkcz1maWxlX2dldF9jb250ZW50cygkdXBbJ2Jhc2VkaXInXS4nL3BldHNob3AtZmVlZHMva2FpbmEyNC54bWwnKTsKICAgIHByZWdfbWF0Y2hfYWxsKCcvPHByb2R1Y3QgaWQ9IihcZCspIj4uKj88cHJpY2U+KFtcZFwuXSspPFwvcHJpY2U+Lio/PHN0b2NrPihcZCspPFwvc3RvY2s+Lio/PG1hbnVmYWN0dXJlcj48IVxbQ0RBVEFcWyguKj8pXF1cXT4vcycsJHMsJG1tLFBSRUdfU0VUX09SREVSKTsKICAgICRzdDA9YXJyYXkoKTsgJG4wPTA7ICRrYWlub3M9YXJyYXkoJzw1Jz0+MCwnNS0xMic9PjAsJzEyLTMwJz0+MCwnMzArJz0+MCk7ICRicm49YXJyYXkoKTsKICAgIGZvcmVhY2goJG1tIGFzICRtKXsgJGJyblskbVs0XV09KCRicm5bJG1bNF1dPz8wKSsxOyBpZigoaW50KSRtWzNdPT09MCl7ICRuMCsrOyAkc3QwWyRtWzRdXT0oJHN0MFskbVs0XV0/PzApKzE7IH0gJHByPShmbG9hdCkkbVsyXTsgJGthaW5vc1skcHI8NT8nPDUnOigkcHI8MTI/JzUtMTInOigkcHI8MzA/JzEyLTMwJzonMzArJykpXSsrOyB9CiAgICBhcnNvcnQoJHN0MCk7IGFyc29ydCgkYnJuKTsgJG9bJ2syNF92aXNvJ109Y291bnQoJG1tKTsgJG9bJ2syNF9zdG9jazAnXT0kbjA7ICRvWydrMjRfc3RvY2swX2JyZW5kYWknXT1hcnJheV9zbGljZSgkc3QwLDAsMjAsdHJ1ZSk7ICRvWydrMjRfa2Fpbm9zJ109JGthaW5vczsgJG9bJ2syNF9icmVuZGFpJ109JGJybjsKICAgICRvWydrYWlub3Rla2FfcmVmJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbGFpa2FzLCB1cmxfa2VsaWFzIEZST00gJFcgV0hFUkUgcmVmZXJlcl9kb21lbmFzIExJS0UgJyVrYWlub3Rla2ElJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDYiLEFSUkFZX0EpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-173034';
const GKEY='ps_s1697';
const PHASES=["1"];
const OUT='analize/s1697_mc2.json';
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
