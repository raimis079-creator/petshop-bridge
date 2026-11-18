process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODkzYSBhZHZlbnRvIGthbGVuZG9yaWFpIOKAkyBixatrbMSXIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTg5M2EnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDEyMCk7IGdsb2JhbCAkd3BkYjsgJHI9Wyd2Jz0+J1MxODkzYSddOwogIHRyeXsKICAgICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBJRCBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzIE5PVCBJTiAoJ3RyYXNoJywnYXV0by1kcmFmdCcpIEFORCAocG9zdF90aXRsZSBMSUtFICclYWR2ZW50JScgT1IgcG9zdF90aXRsZSBMSUtFICcla2FsZW5kb3JpJScpIik7CiAgICAkclsnbiddPWNvdW50KCRpZHMpOyAkclsncCddPVtdOwogICAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICRwPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcCkgY29udGludWU7ICRwbz1nZXRfcG9zdCgkaWQpOwogICAgICAkY2F0cz13cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfY2F0JyxbJ2ZpZWxkcyc9PidhbGwnXSk7ICRjbD1bXTsgZm9yZWFjaCgkY2F0cyBhcyAkYyl7ICRjbFtdPSRjLT50ZXJtX2lkLic6Jy4kYy0+bmFtZTsgfQogICAgICAkbT1bXTsgZm9yZWFjaChbJ19wc19zYW5kZWxpcycsJ196Yl9jb3N0JywnX3ZmX2Nvc3QnLCdfemJfcXR5JywnX3ZmX3F0eScsJ19wc19pc2ltdGlzX2xhdWtpYV9wZXJ6aXVyb3MnLCdfcHNfc2F2aWthaW5hJywnX3piX3NrdScsJ192Zl9za3UnLCdfcHNfdGlla2VqYXMnLCdfcHNfbG9ja2VkJywnX3BzX2Fwcl9sb2NrZWQnLCdfZ2xvYmFsX3VuaXF1ZV9pZCcsJ196Yl9ycnAnLCdfd2VpZ2h0J10gYXMgJGspeyAkdj1nZXRfcG9zdF9tZXRhKCRpZCwkayx0cnVlKTsgaWYoJHYhPT0nJykgJG1bJGtdPSR2OyB9CiAgICAgICRhbGxtPWFycmF5X2tleXMoZ2V0X3Bvc3RfbWV0YSgkaWQpKTsgCiAgICAgICRyWydwJ11bXT1bJ2lkJz0+KGludCkkaWQsJ3QnPT4kcG8tPnBvc3RfdGl0bGUsJ3N0Jz0+JHBvLT5wb3N0X3N0YXR1cywnc2x1Zyc9PiRwby0+cG9zdF9uYW1lLCdza3UnPT4kcC0+Z2V0X3NrdSgpLCd0eXBlJz0+JHAtPmdldF90eXBlKCksJ3JlZyc9PiRwLT5nZXRfcmVndWxhcl9wcmljZSgpLCdzYWxlJz0+JHAtPmdldF9zYWxlX3ByaWNlKCksJ3ByaWNlJz0+JHAtPmdldF9wcmljZSgpLAogICAgICAgICdzdG9jayc9PiRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSwnc3MnPT4kcC0+Z2V0X3N0b2NrX3N0YXR1cygpLCdtcyc9PiRwLT5nZXRfbWFuYWdlX3N0b2NrKCksJ3Zpcyc9PiRwLT5nZXRfY2F0YWxvZ192aXNpYmlsaXR5KCksJ2ltZyc9PihpbnQpJHAtPmdldF9pbWFnZV9pZCgpLCdnYWwnPT5jb3VudCgkcC0+Z2V0X2dhbGxlcnlfaW1hZ2VfaWRzKCkpLAogICAgICAgICdjYXRzJz0+JGNsLCdsZW4nPT5tYl9zdHJsZW4od3Bfc3RyaXBfYWxsX3RhZ3MoJHBvLT5wb3N0X2NvbnRlbnQpKSwnc2hvcnQnPT5tYl9zdHJsZW4od3Bfc3RyaXBfYWxsX3RhZ3MoJHBvLT5wb3N0X2V4Y2VycHQpKSwnZGVzYyc9Pm1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkcG8tPnBvc3RfY29udGVudCksMCw1MDApLCdleCc9Pm1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkcG8tPnBvc3RfZXhjZXJwdCksMCwzMDApLAogICAgICAgICd3Jz0+JHAtPmdldF93ZWlnaHQoKSwnbSc9PiRtLCdtZXRha2V5cyc9PmFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoJGFsbG0sZnVuY3Rpb24oJGspeyByZXR1cm4gcHJlZ19tYXRjaCgnL15fKHpifHZmfHBzKV8vJywkayk7IH0pKSwnbW9kJz0+JHBvLT5wb3N0X21vZGlmaWVkXTsKICAgIH0KICAgICRyWydjYXQ4MjQnXT1bJ3Rlcm0nPT5nZXRfdGVybSg4MjQsJ3Byb2R1Y3RfY2F0JyksJ2NudF9wdWInPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnRlcm1fcmVsYXRpb25zaGlwc30gdHIgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBKT0lOIHskd3BkYi0+cG9zdHN9IHAgT04gcC5JRD10ci5vYmplY3RfaWQgV0hFUkUgdHQudGVybV9pZD04MjQgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIildOwogICAgJHJbJ2NhdDExOSddPWdldF90ZXJtKDExOSwncHJvZHVjdF9jYXQnKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OyB9KTsK';
const VER='dep-205636';
const GKEY='ps_s1893a';
const PHASES=["1"];
const OUT='analize/s1893a.json';
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
