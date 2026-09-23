process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzA5YSddKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHI9W107CiAgJHNsdWdzPVsnYW1icm9zaWEtanVuaW9yLWJlZ3J1ZGlzLXN1LXN2aWV6aWEtdmlzdGllbmEtaXItbGFzaXNhLXNhdXNhcy1tYWlzdGFzLWRpZGVsaXUtdmVpc2xpdS1qYXVuaWVtcy1zdW5pdWthbXMtZnJlc2gtY2hpY2tlbi1zYWxtb24tMTIta2cnLCdhbWJyb3NpYS1qdW5pb3ItYmVncnVkaXMtc3Utc3ZpZXppYS12aXN0aWVuYS1pci1sYXNpc2Etc2F1c2FzLW1haXN0YXMtZGlkZWxpdS12ZWlzbGl1LWphdW5pZW1zLXN1bml1a2Ftcy1mcmVzaC1jaGlja2VuLXNhbG1vbi0yLWtnJ107CiAgJGluZm89ZnVuY3Rpb24oJHBpZCkgdXNlKCR3cGRiKXsKICAgICRwPWdldF9wb3N0KCRwaWQpOyAkbz1bJ2lkJz0+JHBpZCwnc3RhdHVzJz0+JHAtPnBvc3Rfc3RhdHVzLCd0aXRsZSc9PiRwLT5wb3N0X3RpdGxlLCdtb2RpZmllZCc9PiRwLT5wb3N0X21vZGlmaWVkLCdza3UnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19za3UnLHRydWUpLCdzYW5kZWxpcyc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKV07CiAgICAkdD1nZXRfcG9zdF9tZXRhKCRwaWQsJ190aHVtYm5haWxfaWQnLHRydWUpOyAkb1sndGh1bWInXT0kdDsgJG9bJ2dhbGxlcnknXT1nZXRfcG9zdF9tZXRhKCRwaWQsJ19wcm9kdWN0X2ltYWdlX2dhbGxlcnknLHRydWUpOwogICAgJGlkcz1hcnJheV9maWx0ZXIoYXJyYXlfbWVyZ2UoWyR0XSxleHBsb2RlKCcsJywoc3RyaW5nKSRvWydnYWxsZXJ5J10pKSk7CiAgICBmb3JlYWNoKCRpZHMgYXMgJGEpeyAkYXA9Z2V0X3Bvc3QoJGEpOyAkZj1nZXRfYXR0YWNoZWRfZmlsZSgkYSk7ICRvWydhdHQnXVskYV09Wyd5cmEnPT4hISRhcCwndHlwZSc9PiRhcD8kYXAtPnBvc3RfdHlwZTpudWxsLCdzdGF0dXMnPT4kYXA/JGFwLT5wb3N0X3N0YXR1czpudWxsLCdwYXJlbnQnPT4kYXA/JGFwLT5wb3N0X3BhcmVudDpudWxsLCdmaWxlJz0+JGYsJ2ZpbGVfeXJhJz0+JGY/ZmlsZV9leGlzdHMoJGYpOm51bGwsJ3VybCc9PndwX2dldF9hdHRhY2htZW50X3VybCgkYSldOyB9CiAgICAkb1snbWV0YV9pbWcnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBtZXRhX2tleSxMRUZUKG1ldGFfdmFsdWUsMjAwKSB2IEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgcG9zdF9pZD0lZCBBTkQgKG1ldGFfa2V5IExJS0UgJyUldGh1bWIlJScgT1IgbWV0YV9rZXkgTElLRSAnJSVpbWFnZSUlJyBPUiBtZXRhX2tleSBMSUtFICclJWltZyUlJyBPUiBtZXRhX2tleSBMSUtFICclJWZvdG8lJScgT1IgbWV0YV9rZXkgTElLRSAnJSVyYW5rYSUlJyBPUiBtZXRhX2tleSBMSUtFICdfcHNfczE3JSUnKSIsJHBpZCkpOwogICAgJG9bJ2F0dF9jaGlsZHJlbiddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIElELHBvc3Rfc3RhdHVzLHBvc3RfZGF0ZSxndWlkIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF9wYXJlbnQ9JWQgQU5EIHBvc3RfdHlwZT0nYXR0YWNobWVudCciLCRwaWQpKTsKICAgIHJldHVybiAkbzsgfTsKICBmb3JlYWNoKCRzbHVncyBhcyAkcyl7ICRwaWQ9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBJRCBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfbmFtZT0lcyBBTkQgcG9zdF90eXBlPSdwcm9kdWN0JyIsJHMpKTsgJHJbJ3ByZWtlcyddWyRzXT0kcGlkPyRpbmZvKChpbnQpJHBpZCk6J05FUkFTVEEnOyB9CiAgLy8ga2l0b3MgQW1icm9zaWEgYmUgbnVvdHJhdWtvcwogICRyWydhbWJyb3NpYV9iZV9mb3RvJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCxwLnBvc3Rfc3RhdHVzLExFRlQocC5wb3N0X3RpdGxlLDgwKSB0LChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIHBvc3RfaWQ9cC5JRCBBTkQgbWV0YV9rZXk9J190aHVtYm5haWxfaWQnKSB0aCBGUk9NIHskd3BkYi0+cG9zdHN9IHAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3RfdGl0bGUgTElLRSAnJUFtYnJvc2lhJScgT1JERVIgQlkgcC5JRCIpOwogIC8vIFMxNzA1IGJhawogICRiPWdldF9vcHRpb24oJ3BzX3MxNzA1X2FtYnJvc2lhX2JhaycpOyAkclsnYmFrX3MxNzA1X3Jha3RhaSddPWlzX2FycmF5KCRiKT9hcnJheV9zbGljZShhcnJheV9rZXlzKCRiKSwwLDQwKTpnZXR0eXBlKCRiKTsKICAkclsnYmFrX3MxNzA1X3B2eiddPWlzX2FycmF5KCRiKT9hcnJheV9zbGljZSgkYiwwLDIsdHJ1ZSk6bnVsbDsKICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-170543';
const GKEY='ps_s1709a';
const PHASES=["1"];
const OUT='analize/s1709_a.json';
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
