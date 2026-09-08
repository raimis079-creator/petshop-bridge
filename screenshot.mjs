process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjQzZSBudW90cmF1a29zICsgVDAgc2FyZ2FpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfYmUnXSk/JF9HRVRbJ3BzX2JlJ106JycpIT09J0dPJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgndic9PidTMTY0M2UnKTsKICB0cnl7CiAgICAvLyAxLiBTaG9ydFBpeGVsIC8gd2VicAogICAgaWYoIWZ1bmN0aW9uX2V4aXN0cygnZ2V0X3BsdWdpbnMnKSkgcmVxdWlyZV9vbmNlIEFCU1BBVEguJ3dwLWFkbWluL2luY2x1ZGVzL3BsdWdpbi5waHAnOwogICAgJGFrdD1nZXRfb3B0aW9uKCdhY3RpdmVfcGx1Z2lucycsYXJyYXkoKSk7CiAgICAkb1snc3AnXT1hcnJheSgpOwogICAgZm9yZWFjaChnZXRfcGx1Z2lucygpIGFzICRmPT4kcCl7CiAgICAgIGlmKHN0cmlwb3MoJGYsJ3Nob3J0cGl4ZWwnKSE9PWZhbHNlfHxzdHJpcG9zKCRwWydOYW1lJ10sJ3Nob3J0cGl4ZWwnKSE9PWZhbHNlKQogICAgICAgICRvWydzcCddWyRmXT1hcnJheSgndic9PiRwWydWZXJzaW9uJ10sJ2FrdHl2dXMnPT5pbl9hcnJheSgkZiwkYWt0KT8xOjApOwogICAgfQogICAgJHNwcz1nZXRfb3B0aW9uKCd3cC1zaG9ydC1waXhlbC1zZXR0aW5ncycpOyAkb1snc3BfbnVzdGF0eW1haSddPSAkc3BzPyBhcnJheV9zbGljZSgoYXJyYXkpJHNwcywwLDEyKSA6ICduZXJhJzsKICAgICRvWydzcF9rdm90YSddPWFycmF5KCdrcmVkaXRhaSc9PmdldF9vcHRpb24oJ3dwLXNob3J0LXBpeGVsLXF1b3RhLWV4Y2VlZGVkJyksJ2FwZG9yb3RpJz0+Z2V0X29wdGlvbignd3Atc2hvcnQtcGl4ZWwtZmlsZUNvdW50JyksJ3N1dGF1cHl0YSc9PmdldF9vcHRpb24oJ3dwLXNob3J0LXBpeGVsLXNhdmVkU3BhY2UnKSk7CiAgICAkb1snd2VicF9tdSddPSBmaWxlX2V4aXN0cyhXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXdlYnAucGhwJykgPyBmaWxlc2l6ZShXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXdlYnAucGhwJykgOiAnbmVyYSc7CiAgICAvLyAyLiBOdW90cmF1a3Uga2lla2lzIGlyIGR5ZGlzCiAgICAkb1snYXR0YWNoJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdhdHRhY2htZW50JyBBTkQgcG9zdF9taW1lX3R5cGUgTElLRSAnaW1hZ2UvJSciKTsKICAgICR1ZD13cF91cGxvYWRfZGlyKCk7ICRiZD0kdWRbJ2Jhc2VkaXInXTsKICAgICRzdW09MDskbj0wOyR3ZWJwPTA7CiAgICAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRiZCxGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICAgZm9yZWFjaCgkaXQgYXMgJGZpKXsgaWYoISRmaS0+aXNGaWxlKCkpIGNvbnRpbnVlOyAkZT1zdHJ0b2xvd2VyKCRmaS0+Z2V0RXh0ZW5zaW9uKCkpOwogICAgICBpZigkZT09PSd3ZWJwJyl7JHdlYnArKzt9CiAgICAgIGlmKGluX2FycmF5KCRlLGFycmF5KCdqcGcnLCdqcGVnJywncG5nJywnd2VicCcpKSl7ICRzdW0rPSRmaS0+Z2V0U2l6ZSgpOyAkbisrOyB9IH0KICAgICRvWyd1cGxvYWRzJ109YXJyYXkoJ2ZhaWx1Jz0+JG4sJ3dlYnAnPT4kd2VicCwnTUInPT5yb3VuZCgkc3VtLzEwNDg1NzYsMSkpOwogICAgLy8gMy4gVDAgc2FyZ2FpCiAgICAkb1snYmxvZ19wdWJsaWMnXT1nZXRfb3B0aW9uKCdibG9nX3B1YmxpYycpOwogICAgJG9bJ2ZsYXRzb21lX3JlZyddPWdldF9vcHRpb24oJ2ZsYXRzb21lX3JlZ2lzdHJhdGlvbicpOwogICAgJG9bJ2Rldl9vcHRpb25zJ109JHdwZGItPmdldF9jb2woIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX3ZhbHVlIExJS0UgJyVkZXYuYXZlc2EubHQlJyBMSU1JVCAyMCIpOwogICAgJG9bJ2Rldl9wb3N0bWV0YSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIG1ldGFfdmFsdWUgTElLRSAnJWRldi5hdmVzYS5sdCUnIik7CiAgICAkb1snZGV2X3Bvc3RzJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF9jb250ZW50IExJS0UgJyVkZXYuYXZlc2EubHQlJyBPUiBndWlkIExJS0UgJyVkZXYuYXZlc2EubHQlJyIpOwogICAgJG9bJ2Rldl91c2VybWV0YSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+dXNlcm1ldGF9IFdIRVJFIG1ldGFfdmFsdWUgTElLRSAnJWRldi5hdmVzYS5sdCUnIik7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-183412';
const GKEY='ps_be';
const PHASES=["GO"];
const OUT='analize/s1643_e.json';
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
