process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODgxIGRlcCBhdHNpc2FreW1vIGZ1bmtjaWpvcyB0ZWtzdGFzIHB1c2xhcGl1b3NlICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTg4MXAnXSkpIHJldHVybjsgJEY9KHN0cmluZykkX0dFVFsncHNfczE4ODFwJ107ICRyPVsndic9PidwMScsJ0YnPT4kRl07IGdsb2JhbCAkd3BkYjsKICAkZGlyPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1hcmNoeXZhcy9zMTg4MSc7IAogICRNRD1bMzQ1MjM9PidmZjMzMmIzM2VkMTViOGVhZWQwMDI5MWQ4MmRkODkwOCcsMzQ1MjQ9PidiNjAzNzE4NDc4OWM2YTM0MjExMGZlZDZjMmU3YTZkMCddOwogICRuYXVqYT1mdW5jdGlvbigkaWQsJGMsJiRpbmZvKXsKICAgIGlmKCRpZD09PTM0NTIzKXsKICAgICAgJGE9J0FwaWUgZ3LEhcW+aW5pbcSFIHByYW5lxaFraXRlIGVsLiBwYcWhdHUuJzsgJGI9J0FwaWUgZ3LEhcW+aW5pbcSFIHByYW5lxaFraXRlIHNhdm8gdcW+c2FreW1vIHB1c2xhcHlqZSwgcGFzcGF1ZMSZIOKAnkF0c2lzYWt5dGkgc3V0YXJ0aWVz4oCcLCBhcmJhIGVsLiBwYcWhdHUuJzsKICAgICAgJGEyPSc8bGk+QXBpZSBzdXRhcnRpZXMgYXRzaXNha3ltxIUgUGlya8SXamFzIHByYW5lxaFhIHJhxaF0dSDigJMgPGEgaHJlZj0iL2tvbnRha3RhaS8iPnBhcmHFoXlkYW1hcyBtdW1zPC9hPiBpciBwYXRlaWtkYW1hcyBwcmVrxJdzIMSvc2lnaWppbW8gZG9rdW1lbnTEhS48L2xpPic7CiAgICAgICRiMj0nPGxpPkFwaWUgc3V0YXJ0aWVzIGF0c2lzYWt5bcSFIFBpcmvEl2phcyBnYWxpIHByYW5lxaF0aSBzYXZvIHXFvnNha3ltbyBwdXNsYXB5amUsIHBhc3BhdWTEmXMg4oCeQXRzaXNha3l0aSBzdXRhcnRpZXPigJwuPC9saT4nLiJcblx0Ii4nPGxpPlRhaXAgcGF0IGdhbGltYSBwcmFuZcWhdGkgcmHFoXR1IOKAkyA8YSBocmVmPSIva29udGFrdGFpLyI+cGFyYcWheWRhbWFzIG11bXM8L2E+IGlyIHBhdGVpa2RhbWFzIHByZWvEl3MgxK9zaWdpamltbyBkb2t1bWVudMSFLjwvbGk+JzsKICAgICAgJGluZm89WydhJz0+c3Vic3RyX2NvdW50KCRjLCRhKSwnYTInPT5zdWJzdHJfY291bnQoJGMsJGEyKV07CiAgICAgIGlmKCRpbmZvWydhJ10hPT0xfHwkaW5mb1snYTInXSE9PTEpIHJldHVybiBudWxsOwogICAgICByZXR1cm4gc3RyX3JlcGxhY2UoWyRhLCRhMl0sWyRiLCRiMl0sJGMpOwogICAgfQogICAgJHM9JzxwPjMuMi4gUGlya8SXamFzIHR1cmkgdGVpc8SZIGF0c2lzYWt5dGknOyAkcD1zdHJwb3MoJGMsJHMpOyAkaW5mbz1bJ3Jhc3RhJz0+c3Vic3RyX2NvdW50KCRjLCRzKV07CiAgICBpZigkaW5mb1sncmFzdGEnXSE9PTEpIHJldHVybiBudWxsOyAkZT1zdHJwb3MoJGMsJzwvcD4nLCRwKTsgaWYoJGU9PT1mYWxzZSkgcmV0dXJuIG51bGw7ICRlKz00OwogICAgJGluZm9bJ3Bhc3RyYWlwYSddPW1iX3N1YnN0cihzdWJzdHIoJGMsJHAsJGUtJHApLDAsMjAwMCk7ICRpbmZvWydwbyddPW1iX3N1YnN0cihzdWJzdHIoJGMsJGUsMjAwKSwwLDIwMCk7CiAgICAkaW5zPSJcblxuIi4nPHA+QXBpZSBzdXRhcnRpZXMgYXRzaXNha3ltxIUgUGlya8SXamFzIHRhaXAgcGF0IGdhbGkgcHJhbmXFoXRpIHNhdm8gdcW+c2FreW1vIHB1c2xhcHlqZSwgcGFzcGF1ZMSZcyDigJ5BdHNpc2FreXRpIHN1dGFydGllc+KAnC4gR2F2xJlzIHByYW5lxaFpbcSFLCBQYXJkYXbEl2phcyBuZWRlbHNkYW1hcyBlbC4gcGHFoXR1IHBhdHZpcnRpbmEgam8gZ2F2aW3EhS48L3A+JzsKICAgIHJldHVybiBzdWJzdHIoJGMsMCwkZSkuJGlucy5zdWJzdHIoJGMsJGUpOwogIH07CiAgdHJ5ewogIGZvcmVhY2goWzM0NTIzLDM0NTI0XSBhcyAkaWQpeyAkcD1nZXRfcG9zdCgkaWQpOyAkYz0kcC0+cG9zdF9jb250ZW50OyAkeD1bJ21kNV9kYWJhcic9Pm1kNSgkYyldOwogICAgaWYoJEY9PT0nRCd8fCRGPT09JzEnKXsKICAgICAgaWYobWQ1KCRjKSE9PSRNRFskaWRdKXsgJHhbJ1NUT1AnXT0ndHVyaW55cyBwYXNpa2VpdGVzJzsgJHJbJGlkXT0keDsgJHJbJ29rJ109ZmFsc2U7IGNvbnRpbnVlOyB9CiAgICAgICRpbmZvPVtdOyAkbj0kbmF1amEoJGlkLCRjLCRpbmZvKTsgJHhbJ2luZm8nXT0kaW5mbzsgaWYoJG49PT1udWxsKXsgJHhbJ1NUT1AnXT0nbmVyYWRhdSB2aWV0b3MnOyAkclskaWRdPSR4OyAkclsnb2snXT1mYWxzZTsgY29udGludWU7IH0KICAgICAgJHhbJ2lsZ2lzJ109W3N0cmxlbigkYyksc3RybGVuKCRuKV07ICR4WydtZDVfbmF1amFzJ109bWQ1KCRuKTsgJHhbJ2F0c2lzYWt5dGlfc3V0YXJ0aWVzJ109W3N1YnN0cl9jb3VudCgkYywnQXRzaXNha3l0aSBzdXRhcnRpZXMnKSxzdWJzdHJfY291bnQoJG4sJ0F0c2lzYWt5dGkgc3V0YXJ0aWVzJyldOwogICAgICBpZigkRj09PScxJyl7IGlmKCgkclsnb2snXT8/dHJ1ZSk9PT1mYWxzZSl7ICR4WydTVE9QJ109J2Fua3N0ZXNuaXMgbmVwYXZ5a28nOyAkclskaWRdPSR4OyBjb250aW51ZTsgfQogICAgICAgIGlmKCFpc19kaXIoJGRpcikpIHdwX21rZGlyX3AoJGRpcik7ICRiYWs9JGRpci4nL3BhZ2VfJy4kaWQuJy5odG1sLmJhayc7IGlmKCFmaWxlX2V4aXN0cygkYmFrKSkgZmlsZV9wdXRfY29udGVudHMoJGJhaywkYyk7ICR4WydiYWsnXT1bZmlsZV9leGlzdHMoJGJhayksbWQ1X2ZpbGUoJGJhayldOwogICAgICAgIGlmKG1kNV9maWxlKCRiYWspIT09JE1EWyRpZF0peyAkeFsnU1RPUCddPSdrb3BpamEgYmxvZ2EnOyAkclskaWRdPSR4OyAkclsnb2snXT1mYWxzZTsgY29udGludWU7IH0KICAgICAgICAkdT0kd3BkYi0+dXBkYXRlKCR3cGRiLT5wb3N0cyxbJ3Bvc3RfY29udGVudCc9PiRuLCdwb3N0X21vZGlmaWVkJz0+Y3VycmVudF90aW1lKCdteXNxbCcpLCdwb3N0X21vZGlmaWVkX2dtdCc9PmN1cnJlbnRfdGltZSgnbXlzcWwnLDEpXSxbJ0lEJz0+JGlkXSk7IGNsZWFuX3Bvc3RfY2FjaGUoJGlkKTsKICAgICAgICAkeFsndXBkYXRlJ109JHU7ICR4WydtZDVfcG8nXT1tZDUoZ2V0X3Bvc3QoJGlkKS0+cG9zdF9jb250ZW50KTsgfQogICAgfQogICAgaWYoJEY9PT0nMicpeyAkeFsnYXRzaXNha3l0aV9zdXRhcnRpZXMnXT1zdWJzdHJfY291bnQoJGMsJ0F0c2lzYWt5dGkgc3V0YXJ0aWVzJyk7ICR4WydpbGdpcyddPXN0cmxlbigkYyk7ICR4Wydtb2RpZmllZCddPSRwLT5wb3N0X21vZGlmaWVkOyAkcG9zPW1iX3N0cnBvcygkYywncGFzcGF1ZMSZcyDigJ5BdHNpc2FreXRpJyk7ICR4Wydpc3RyYXVrYSddPSRwb3MhPT1mYWxzZT9tYl9zdWJzdHIoJGMsbWF4KDAsJHBvcy0xNjApLDQyMCk6bnVsbDsgfQogICAgaWYoJEY9PT0nOScpeyAkYmFrPSRkaXIuJy9wYWdlXycuJGlkLicuaHRtbC5iYWsnOyBpZihmaWxlX2V4aXN0cygkYmFrKSYmbWQ1X2ZpbGUoJGJhayk9PT0kTURbJGlkXSl7ICR3cGRiLT51cGRhdGUoJHdwZGItPnBvc3RzLFsncG9zdF9jb250ZW50Jz0+ZmlsZV9nZXRfY29udGVudHMoJGJhayldLFsnSUQnPT4kaWRdKTsgY2xlYW5fcG9zdF9jYWNoZSgkaWQpOyAkeFsnYXRzdGF0eXRhJ109bWQ1KGdldF9wb3N0KCRpZCktPnBvc3RfY29udGVudCk7IH0gZWxzZSAkeFsnU1RPUCddPSduZXJhIGtvcGlqb3MnOyB9CiAgICAkclskaWRdPSR4OyB9CiAgaWYoIWlzc2V0KCRyWydvayddKSkgJHJbJ29rJ109dHJ1ZTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwxKTsK';
const VER='dep-200637';
const GKEY='ps_s1881p';
const PHASES=["1", "2"];
const OUT='analize/s1881_dep_12.json';
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
