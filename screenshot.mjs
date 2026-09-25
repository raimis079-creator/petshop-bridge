process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE3YyByZWNvbiByZWFkLW9ubHk6IFN1cGVyIENhY2hlIHBpbG5hcyB2YWx5bWFzLCBsb2dpbi1zYXJnYXMgaW5zZXJ0LCByeXRvIHNhcmdvIGxlbXB1dGVzLCBrcmVwc2VsaW8gcHJhbGVpZGltYWkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzE3YyddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTcxN2MnXTsgQHNldF90aW1lX2xpbWl0KDE3MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzE3YycsJ2ZhemUnPT4kZl07CiAgJHR6PW5ldyBEYXRlVGltZVpvbmUoJ0V1cm9wZS9WaWxuaXVzJyk7CiAgJGN0eD1mdW5jdGlvbigkZmlsZSwkcmUsJHByZT0zMDAsJHBvc3Q9NzAwLCRtYXg9NCl7IGlmKCFpc19maWxlKCRmaWxlKSkgcmV0dXJuIG51bGw7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmaWxlKTsgJG89W107IGlmKHByZWdfbWF0Y2hfYWxsKCRyZSwkcywkbSxQUkVHX09GRlNFVF9DQVBUVVJFKSl7IGZvcmVhY2goYXJyYXlfc2xpY2UoJG1bMF0sMCwkbWF4KSBhcyAkeCl7ICRzdD1tYXgoMCwkeFsxXS0kcHJlKTsgJG9bXT0nQCcuc3Vic3RyX2NvdW50KHN1YnN0cigkcywwLCR4WzFdKSwiXG4iKS4nOiAnLnN1YnN0cigkcywkc3QsJHByZSskcG9zdCk7IH0gfSByZXR1cm4gJG87IH07CiAgdHJ5ewogIGlmKCRmPT09JzEnKXsKICAgIC8vIDEuIFdQIFN1cGVyIENhY2hlOiBrYWlwIHZlaWtpYSB3cF9jYWNoZV9jbGVhcl9vbl9wb3N0X2VkaXQKICAgICRwaD1XUF9QTFVHSU5fRElSLicvd3Atc3VwZXItY2FjaGUvd3AtY2FjaGUtcGhhc2UyLnBocCc7CiAgICAkclsnc2NfY2xlYXJfb25fZWRpdCddPSRjdHgoJHBoLCcjd3BfY2FjaGVfY2xlYXJfb25fcG9zdF9lZGl0IycsMjUwLDQ1MCw0KTsKICAgICRyWydzY19ob29rcyddPVtdOyBnbG9iYWwgJHdwX2ZpbHRlcjsgZm9yZWFjaChbJ2VkaXRfcG9zdCcsJ3NhdmVfcG9zdCcsJ2NsZWFuX3Bvc3RfY2FjaGUnLCd0cmFuc2l0aW9uX3Bvc3Rfc3RhdHVzJywnd29vY29tbWVyY2VfcHJvZHVjdF9zZXRfc3RvY2snLCd3b29jb21tZXJjZV92YXJpYXRpb25fc2V0X3N0b2NrJywnd3BfdHJhc2hfcG9zdCcsJ2RlbGV0ZV9wb3N0J10gYXMgJGgpeyBpZighaXNzZXQoJHdwX2ZpbHRlclskaF0pKSBjb250aW51ZTsgZm9yZWFjaCgkd3BfZmlsdGVyWyRoXS0+Y2FsbGJhY2tzIGFzICRwcmlvPT4kY2JzKXsgZm9yZWFjaCgkY2JzIGFzICRjYil7ICRmbj0kY2JbJ2Z1bmN0aW9uJ107ICRubT1pc19hcnJheSgkZm4pPyhpc19vYmplY3QoJGZuWzBdKT9nZXRfY2xhc3MoJGZuWzBdKTokZm5bMF0pLic6OicuJGZuWzFdOihpc19zdHJpbmcoJGZuKT8kZm46J2Nsb3N1cmUnKTsgaWYocHJlZ19tYXRjaCgnI2NhY2hlfHdwc2N8c3VwZXIjaScsJG5tKSB8fCAkZm4gaW5zdGFuY2VvZiBDbG9zdXJlKXsgaWYoJGZuIGluc3RhbmNlb2YgQ2xvc3VyZSl7ICRyZj1uZXcgUmVmbGVjdGlvbkZ1bmN0aW9uKCRmbik7ICRubS49JyBAJy5iYXNlbmFtZSgkcmYtPmdldEZpbGVOYW1lKCkpLic6Jy4kcmYtPmdldFN0YXJ0TGluZSgpOyBpZighcHJlZ19tYXRjaCgnI2NhY2hlI2knLCRyZi0+Z2V0RmlsZU5hbWUoKSkpIGNvbnRpbnVlOyB9ICRyWydzY19ob29rcyddWyRoXVtdPSRwcmlvLic6ICcuJG5tOyB9IH0gfSB9CiAgICAvLyBwcmVraXUgaXNzYXVnb2ppbWFpIHBlciBwYXNrdXRpbmVzIDMgdmFsLiAocG9zdF9tb2RpZmllZCA9IHZpZXRpbmlzIGxhaWthcykKICAgICRyWydwcmVraXVfbW9kaWYnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBEQVRFX0ZPUk1BVChwb3N0X21vZGlmaWVkLCclSCcpIHZhbCwgcG9zdF90eXBlLCBDT1VOVCgqKSBuIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlIElOKCdwcm9kdWN0JywncHJvZHVjdF92YXJpYXRpb24nKSBBTkQgcG9zdF9tb2RpZmllZD49REFURV9TVUIoJyIuY3VycmVudF90aW1lKCdteXNxbCcpLiInLElOVEVSVkFMIDYgSE9VUikgR1JPVVAgQlkgMSwyIE9SREVSIEJZIDEsMiIsQVJSQVlfQSk7CiAgICAvLyAyLiBsb2dpbi1zYXJnYXMKICAgICRsZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWxvZ2luLXNhcmdhcy5waHAnOwogICAgaWYoaXNfZmlsZSgkbGYpKXsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGxmKTsgJHJbJ2xvZ2luJ11bJ21kNSddPW1kNSgkcyk7ICRyWydsb2dpbiddWydkeWRpcyddPXN0cmxlbigkcyk7ICRyWydsb2dpbiddWydtdGltZSddPShuZXcgRGF0ZVRpbWUoJ0AnLmZpbGVtdGltZSgkbGYpKSktPnNldFRpbWV6b25lKCR0eiktPmZvcm1hdCgnbS1kIEg6aScpOyAkclsnbG9naW4nXVsnYW50cmFzdGUnXT1zdWJzdHIoJHMsMCw5MDApOyAkclsnbG9naW4nXVsnaXZ5a29fY3R4J109JGN0eCgkbGYsIiMnaXZ5a28nIyIsNzAwLDUwMCwyKTsgcHJlZ19tYXRjaF9hbGwoJyNcJHdwZGItPihpbnNlcnR8cXVlcnl8cHJlcGFyZSlcKFxzKlteLF17MCwxMjB9IycsJHMsJG1tKTsgJHJbJ2xvZ2luJ11bJ2RiJ109YXJyYXlfc2xpY2UoJG1tWzBdLDAsOCk7IH0KICAgIC8vIDMuIFJ5dG8gc2FyZ2FzOiBsZW1wdXRlcwogICAgJHJmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Atcnl0YXMucGhwJzsKICAgICRyWydyeXRhc196YWxpb3NfY3R4J109JGN0eCgkcmYsJyN6YWxpb3MjJyw1MDAsMzAwLDMpOwogICAgJHJbJ3J5dGFzX2ZuJ109W107IGlmKGlzX2ZpbGUoJHJmKSl7IHByZWdfbWF0Y2hfYWxsKCcjKHB1YmxpY3xwcml2YXRlfHByb3RlY3RlZCk/XHMqc3RhdGljXHMrZnVuY3Rpb25ccysoW2Etel8wLTldKykjaScsZmlsZV9nZXRfY29udGVudHMoJHJmKSwkbW0pOyAkclsncnl0YXNfZm4nXT0kbW1bMl07IH0KICAgICRyWydyeXRhc19vcHRfbGlrZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLCBMRU5HVEgob3B0aW9uX3ZhbHVlKSBsZW4gRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ3BzX3J5dGFzJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJXJ5dGFzX3NhcmdhcyUnIixBUlJBWV9BKTsKICAgICRwdj1nZXRfb3B0aW9uKCdwc19yeXRhc19zYXJnYXNfcGFzaycpOyAkclsncnl0YXNfcGFza19yYXcnXT1pc19hcnJheSgkcHYpP2FycmF5X3NsaWNlKCRwdiwtMywzLHRydWUpOiRwdjsKICAgIC8vIDQuIGtyZXBzZWxpby9uZWFwbW9rZXRvIHByYWxlaWRpbWFpIDQ4IHZhbC4gKGJlIFBJSSkKICAgICRyWydrcmVwc2VsaW9fcHJhbGVpc3RpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsIGZsb3csIGZsb3dfY2xhc3MsIExFRlQoam9iX2tleSw2MCkgamssIHNjaGVkdWxlZF9hdCwgc2tpcF9yZWFzb24sIElGKGNvbnRleHRfanNvbiBMSUtFICclb3JkZXIlJywnb3JkZXInLCcnKSBjdHggRlJPTSB7JFB9cHNfZW1haWxfam9icyBXSEVSRSBmbG93IExJS0UgJ2NhcnRfYWJhbmRvbmVkJScgQU5EIHNjaGVkdWxlZF9hdD49REFURV9TVUIoTk9XKCksSU5URVJWQUwgNzIgSE9VUikgT1JERVIgQlkgaWQiLEFSUkFZX0EpOwogICAgJHJbJ2xhaWthcyddPShuZXcgRGF0ZVRpbWUoJ25vdycsJHR6KSktPmZvcm1hdCgnWS1tLWQgSDppOnMnKTsKICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSwgMSk7Cg==';
const VER='dep-064802';
const GKEY='ps_s1717c';
const PHASES=["1"];
const OUT='analize/s1717_c.json';
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
