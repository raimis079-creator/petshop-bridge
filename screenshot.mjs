process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjQzdSBkZXRhbGVzIFJFQUQtT05MWSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2J1J10pPyRfR0VUWydwc19idSddOicnKSE9PSdHTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogIGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoJ3YnPT4nUzE2NDN1Jyk7CiAgdHJ5ewogICAgLy8gYmUga2Fpbm9zIChwdWJsaXNoKQogICAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHAuSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBwIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIE5PVCBFWElTVFMoU0VMRUNUIDEgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBtIFdIRVJFIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdfcHJpY2UnIEFORCBtLm1ldGFfdmFsdWU8PicnKSIpOwogICAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICRwcj13Y19nZXRfcHJvZHVjdCgkaWQpOwogICAgICAkb1snYmVfa2Fpbm9zJ11bXT1hcnJheSgnaWQnPT4kaWQsJ3NrdSc9PmdldF9wb3N0X21ldGEoJGlkLCdfc2t1Jyx0cnVlKSwndGlwYXMnPT4kcHI/JHByLT5nZXRfdHlwZSgpOic/JywncGF2Jz0+bWJfc3Vic3RyKGdldF90aGVfdGl0bGUoJGlkKSwwLDU1KSwnc2FuZCc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpKTsgfQogICAgLy8gU0tVIGR1Ymxpa2F0YWkKICAgICRkdT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX3ZhbHVlIHNrdSxHUk9VUF9DT05DQVQocG9zdF9pZCkgaWRzLENPVU5UKCopIGsgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBtZXRhX2tleT0nX3NrdScgQU5EIG1ldGFfdmFsdWU8PicnIEdST1VQIEJZIG1ldGFfdmFsdWUgSEFWSU5HIENPVU5UKCopPjEiLEFSUkFZX0EpOwogICAgZm9yZWFjaCgkZHUgYXMgJGQpeyAkZWlsPWFycmF5KCk7CiAgICAgIGZvcmVhY2goZXhwbG9kZSgnLCcsJGRbJ2lkcyddKSBhcyAkaSl7ICRlaWxbXT1hcnJheSgnaWQnPT4kaSwndGlwYXMnPT5nZXRfcG9zdF90eXBlKCRpKSwnc3QnPT5nZXRfcG9zdF9zdGF0dXMoJGkpLCdwYXYnPT5tYl9zdWJzdHIoZ2V0X3RoZV90aXRsZSgkaSksMCw0NSkpOyB9CiAgICAgICRvWydza3VfZHVibGlrYXRhaSddW109YXJyYXkoJ3NrdSc9PiRkWydza3UnXSwncHJla2VzJz0+JGVpbCk7IH0KICAgIC8vIGJlIFNLVSAocHVibGlzaCkg4oCUIHRpayB0aXBhaQogICAgJGI9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCBGUk9NIHskd3BkYi0+cG9zdHN9IHAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgTk9UIEVYSVNUUyhTRUxFQ1QgMSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IG0gV0hFUkUgbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXk9J19za3UnIEFORCBtLm1ldGFfdmFsdWU8PicnKSIsQVJSQVlfQSk7CiAgICAkdGlwPWFycmF5KCk7CiAgICBmb3JlYWNoKCRiIGFzICRyKXsgJHByPXdjX2dldF9wcm9kdWN0KCRyWydJRCddKTsgJHQ9JHByPyRwci0+Z2V0X3R5cGUoKTonPyc7ICR0aXBbJHRdPSgkdGlwWyR0XT8/MCkrMTsgfQogICAgJG9bJ2JlX3NrdV90aXBhaSddPSR0aXA7CiAgICAkb1snYmVfc2t1X3B2eiddPWFycmF5KCk7CiAgICBmb3JlYWNoKGFycmF5X3NsaWNlKCRiLDAsOCkgYXMgJHIpICRvWydiZV9za3VfcHZ6J11bXT1hcnJheSgnaWQnPT4kclsnSUQnXSwncGF2Jz0+bWJfc3Vic3RyKGdldF90aGVfdGl0bGUoJHJbJ0lEJ10pLDAsNDUpLCdzYW5kJz0+Z2V0X3Bvc3RfbWV0YSgkclsnSUQnXSwnX3BzX3NhbmRlbGlzJyx0cnVlKSk7CiAgICAvLyBhdXRvbG9hZCB0ZWlzaW5nYWkgKFdQIDYuNisgJ29uJykKICAgICRvWydhdXRvbG9hZF9LQiddPXJvdW5kKChmbG9hdCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIFNVTShMRU5HVEgob3B0aW9uX3ZhbHVlKSkgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIGF1dG9sb2FkIElOICgneWVzJywnb24nLCdhdXRvJywnYXV0by1vbicpIikvMTAyNCwxKTsKICAgICRvWydhdXRvbG9hZF90b3AnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSxST1VORChMRU5HVEgob3B0aW9uX3ZhbHVlKS8xMDI0LDEpIEtCIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBhdXRvbG9hZCBJTiAoJ3llcycsJ29uJywnYXV0bycsJ2F1dG8tb24nKSBPUkRFUiBCWSBMRU5HVEgob3B0aW9uX3ZhbHVlKSBERVNDIExJTUlUIDYiLEFSUkFZX0EpOwogICAgLy8gcHVibGlzaCBwcmVrZXMgYmUgbnVvdHJhdWtvcwogICAgJG9bJ2JlX251b3RyYXVrb3MnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RzfSBwIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIE5PVCBFWElTVFMoU0VMRUNUIDEgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBtIFdIRVJFIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdfdGh1bWJuYWlsX2lkJyBBTkQgbS5tZXRhX3ZhbHVlPD4nJykiKTsKICAgIC8vIHB1Ymxpc2ggYmUga2F0ZWdvcmlqb3MKICAgICRvWydiZV9rYXRlZ29yaWpvcyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdHN9IHAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgTk9UIEVYSVNUUyhTRUxFQ1QgMSBGUk9NIHskd3BkYi0+dGVybV9yZWxhdGlvbnNoaXBzfSB0ciBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teT0ncHJvZHVjdF9jYXQnIFdIRVJFIHRyLm9iamVjdF9pZD1wLklEKSIpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-195300';
const GKEY='ps_bu';
const PHASES=["GO"];
const OUT='analize/s1643_u.json';
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
