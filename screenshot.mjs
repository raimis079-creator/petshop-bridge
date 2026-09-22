process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzAzIG1jIOKAlCByZWNvbiAocmVhZC1vbmx5KTogd2VpZ2h0LWZpbHRlciwgYW5hbGl0aWthIGJlYWNvbiwgcmVsYXVuY2ggc3ZvcmlzLCBmZWVkaW5nLWNhbGMgUkVTVCwgY2FsYyBncmVpdGlzICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcwM21jJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE3MDMgbWMnKTsgJGY9JF9HRVRbJ3BzX3MxNzAzbWMnXTsKICB0cnl7CiAgICAkY29yZT1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlLyc7CiAgICBpZigkZj09PScxJyl7CiAgICAgICRvWyd3ZWlnaHRfZmlsdGVyJ109bWJfc3Vic3RyKGZpbGVfZ2V0X2NvbnRlbnRzKCRjb3JlLidpbmNsdWRlcy9jbGFzcy13ZWlnaHQtZmlsdGVyLnBocCcpLDAsMTAyMDApOwogICAgICAkb1snY2FsY19oYW5kb2ZmJ109bWJfc3Vic3RyKGZpbGVfZ2V0X2NvbnRlbnRzKCRjb3JlLidhc3NldHMvY2FsYy1oYW5kb2ZmLmpzJyksMCwzOTAwKTsKICAgIH0KICAgIGlmKCRmPT09JzInKXsKICAgICAgJGE9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1hbmFsaXRpa2EucGhwJyk7CiAgICAgICRvWydhbmFsaXRpa2FfaGVhZCddPW1iX3N1YnN0cigkYSwwLDE1MDApOwogICAgICBpZihwcmVnX21hdGNoKCcvZnVuY3Rpb24gYmVhY29uXGIuKj9cbiAgXH1cbi9zJywkYSwkbSkpICRvWydiZWFjb24nXT1tYl9zdWJzdHIoJG1bMF0sMCw1MDAwKTsgZWxzZSB7ICRpPXN0cnBvcygkYSwnYmVhY29uJyk7ICRvWydiZWFjb25fY3R4J109bWJfc3Vic3RyKCRhLG1heCgwLCRpLTIwMCksNTAwMCk7IH0KICAgICAgJHJsPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtcmVsYXVuY2gucGhwJyk7CiAgICAgIGZvcmVhY2goYXJyYXkoJ3N2b3JpcycsJ2pzJywncnVzaXMnLCdkaWVub3MnKSBhcyAkZm4peyAkaT1zdHJwb3MoJHJsLCdmdW5jdGlvbiAnLiRmbi4nKCcpOyAkb1sncmxfJy4kZm5dPSRpIT09ZmFsc2U/bWJfc3Vic3RyKCRybCwkaSwyNjAwKTonTsSWUkEnOyB9CiAgICAgIC8vIFJFU1QgZmVlZGluZy1jYWxjIOKAlCBrdXIgcmVnaXN0cnVvdGFzCiAgICAgICRyb3V0ZXM9cmVzdF9nZXRfc2VydmVyKCktPmdldF9yb3V0ZXMoKTsgZm9yZWFjaCgkcm91dGVzIGFzICRyPT4kaCl7IGlmKHN0cnBvcygkciwncGV0c2hvcC92MScpIT09ZmFsc2UpICRvWydwZXRzaG9wX3YxJ11bXT0kcjsgfQogICAgICAkb1snZmVlZGluZ191aV9oZWFkJ109bWJfc3Vic3RyKGZpbGVfZ2V0X2NvbnRlbnRzKCRjb3JlLidpbmNsdWRlcy9jbGFzcy1mZWVkaW5nLXVpLnBocCcpLDAsMzAwMCk7CiAgICB9CiAgICBpZigkZj09PSczJyl7CiAgICAgIC8vIGdyZWl0aXM6IGNhbGMgdmlzb21zIGd5dm9tcyDFoXVuxbMgcHJla8SXbXMgc3UgbGVudGVsZSwgMTAga2cKICAgICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbS5wcm9kdWN0X2lkIHBpZCwgdC5zcGVjaWVzIEZST00geyRwfXBzX2ZlZWRpbmdfbWFwIG0gSk9JTiB7JHB9cHNfZmVlZGluZ190YWJsZXMgdCBPTiB0LmlkPW0uZmVlZGluZ190YWJsZV9pZCBKT0lOIHskcH1wb3N0cyBwbyBPTiBwby5JRD1tLnByb2R1Y3RfaWQgSk9JTiB7JHB9cG9zdG1ldGEgcHMgT04gcHMucG9zdF9pZD1tLnByb2R1Y3RfaWQgQU5EIHBzLm1ldGFfa2V5PSdfc3RvY2tfc3RhdHVzJyBBTkQgcHMubWV0YV92YWx1ZT0naW5zdG9jaycgV0hFUkUgbS5pc19hY3RpdmU9MSBBTkQgdC5pc19hY3RpdmU9MSBBTkQgcG8ucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCB0LnNwZWNpZXM9J2RvZyciLEFSUkFZX0EpOwogICAgICAkdDA9bWljcm90aW1lKHRydWUpOyAkc3Q9YXJyYXkoKTsgJG9rPWFycmF5KCk7ICRuPTA7CiAgICAgIGZvcmVhY2goJHJvd3MgYXMgJHIpeyAkbisrOyBpZigkbj40MDApIGJyZWFrOyAkcmVzPVBldHNob3BfRmVlZGluZ19TZXJ2aWNlOjpjYWxjKGFycmF5KCdwcm9kdWN0X2lkJz0+KGludCkkclsncGlkJ10sJ3dlaWdodF9rZyc9PjEwLCdzcGVjaWVzX2NvZGUnPT4nZG9nJykpOyAkcz0kcmVzWydzdGF0dXMnXS4nLycuaW1wbG9kZSgnLCcsKGFycmF5KSgkcmVzWydyZWFzb25fY29kZXMnXT8/YXJyYXkoKSkpOyAkc3RbJHNdPSgkc3RbJHNdPz8wKSsxOyBpZigkcmVzWydzdGF0dXMnXT09PSdvaycmJiRyZXNbJ2Nvc3RfZGF5X21pbiddIT09bnVsbCl7ICRva1tdPWFycmF5KCdwaWQnPT4oaW50KSRyWydwaWQnXSwnY2QnPT4kcmVzWydjb3N0X2RheV9taW4nXSwnY2R4Jz0+JHJlc1snY29zdF9kYXlfbWF4J10sJ2QnPT4kcmVzWydkYXlzX21pbiddLCdnJz0+JHJlc1snbm9ybV9taW5fZyddLCdhbSc9PiRyZXNbJ2FjdGl2aXR5X21vZGUnXSwnd20nPT4kcmVzWyd3ZWlnaHRfbW9kZSddKTsgfSB9CiAgICAgICRvWyduJ109JG47ICRvWydzZWsnXT1yb3VuZChtaWNyb3RpbWUodHJ1ZSktJHQwLDIpOyAkb1snc3RhdHVzYWknXT0kc3Q7CiAgICAgIHVzb3J0KCRvayxmdW5jdGlvbigkYSwkYil7cmV0dXJuICRhWydjZCddPD0+JGJbJ2NkJ107fSk7ICRvWydva19uJ109Y291bnQoJG9rKTsKICAgICAgZm9yZWFjaChhcnJheV9zbGljZSgkb2ssMCwxMikgYXMgJHgpeyAkcHI9d2NfZ2V0X3Byb2R1Y3QoJHhbJ3BpZCddKTsgJHhbJ24nXT0kcHI/bWJfc3Vic3RyKCRwci0+Z2V0X25hbWUoKSwwLDYwKTonJzsgJHhbJ2thaW5hJ109JHByPyRwci0+Z2V0X3ByaWNlKCk6bnVsbDsgJG9bJ3BpZ2lhdXNpJ11bXT0keDsgfQogICAgICBmb3JlYWNoKGFycmF5X3NsaWNlKCRvaywtNSkgYXMgJHgpeyAkcHI9d2NfZ2V0X3Byb2R1Y3QoJHhbJ3BpZCddKTsgJHhbJ24nXT0kcHI/bWJfc3Vic3RyKCRwci0+Z2V0X25hbWUoKSwwLDYwKTonJzsgJHhbJ2thaW5hJ109JHByPyRwci0+Z2V0X3ByaWNlKCk6bnVsbDsgJG9bJ2JyYW5naWF1c2knXVtdPSR4OyB9CiAgICAgIC8vIG5lLW9rIHBhdnl6ZMW+aWFpCiAgICAgICRuPTA7IGZvcmVhY2goJHJvd3MgYXMgJHIpeyAkcmVzPVBldHNob3BfRmVlZGluZ19TZXJ2aWNlOjpjYWxjKGFycmF5KCdwcm9kdWN0X2lkJz0+KGludCkkclsncGlkJ10sJ3dlaWdodF9rZyc9PjEwLCdzcGVjaWVzX2NvZGUnPT4nZG9nJykpOyBpZigkcmVzWydzdGF0dXMnXSE9PSdvaycpeyAkb1snbmVfb2snXVtdPWFycmF5KCdwaWQnPT4oaW50KSRyWydwaWQnXSwnc3QnPT4kcmVzWydzdGF0dXMnXSwncmMnPT4kcmVzWydyZWFzb25fY29kZXMnXSwnbXNnJz0+JHJlc1snbWVzc2FnZV9sdCddLCdzcCc9PiRyZXNbJ3NwZWNpZXNfcmVxdWlyZWQnXSwnaW8nPT5jb3VudCgoYXJyYXkpJHJlc1snaW50ZXJ2YWxfb3B0aW9ucyddKSwnYW8nPT4kcmVzWydhY3Rpdml0eV9vcHRpb25zJ10pOyBpZigrKyRuPj04KSBicmVhazsgfSB9CiAgICAgIC8vIHBhcmRhdmltYWkgOTAgZC4gcGFnYWwgcHJla8SZIChmYWt0YWkpIOKAlCBwZXJrYW1pYXVzaQogICAgICAkb1snZmFrdF9laWx1dGVzX2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRwfXBzX2Zha3RfZWlsdXRlcyIsMCk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0RmlsZSgpLic6Jy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-062047';
const GKEY='ps_s1703mc';
const PHASES=["1", "2", "3"];
const OUT='analize/s1703_mc.json';
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
