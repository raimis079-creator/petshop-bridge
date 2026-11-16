process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODcxYyBWRiAxMS0xMyBsYWlza2FzIHBha2FydG90aW5haSBpIHRlcnJhQCAoMSAtIGRyeSwgMiAtIHNpdXN0aSB0aWsgdGVycmFAKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NzFjJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgyMDApOyBnbG9iYWwgJHdwZGI7ICRmPSRfR0VUWydwc19zMTg3MWMnXTsgJHI9Wyd2Jz0+J1MxODcxYycsJ2ZhemUnPT4kZl07CiAgdHJ5ewogICRJRFM9WzM4NTI3LDM4NTMyLDM4NTMzLDM4NTgyXTsgJFRFTUE9J1tQRVJTScWyU1RJIFZldGZhcm1hc10gdcW+c2FreW1hcyAyMDI2LTExLTEzIChwYWthcnRvdGluYWkpJzsKICAkYT1nZXRfb3B0aW9uKCdwc19sYWlza3VfYXJjaHl2YXMnKTsgJG9yaWc9bnVsbDsgZm9yZWFjaCgoYXJyYXkpJGEgYXMgJHgpeyBpZigoJHhbJ2xhaWthcyddPz8nJyk9PT0nMjAyNi0xMS0xMyAxMjoyNTo1NScpICRvcmlnPSR4OyB9CiAgaWYoISRvcmlnKXsgdGhyb3cgbmV3IEV4Y2VwdGlvbignb3JpZ2luYWxhcyBhcmNoeXZlIG5lcmFzdGFzJyk7IH0KICAkclsnb3JpZyddPVsna2FtJz0+JG9yaWdbJ2thbSddLCd0ZW1hJz0+JG9yaWdbJ3RlbWEnXSwnaHRtbF9sZW4nPT5zdHJsZW4oJG9yaWdbJ2h0bWwnXT8/JycpLCdwcmllZGFpJz0+JG9yaWdbJ3ByaWVkYWknXT8/W11dOwogICRqYXU9ZmFsc2U7IGZvcmVhY2goKGFycmF5KSRhIGFzICR4KXsgaWYoKCR4Wyd0ZW1hJ10/PycnKT09PSRURU1BKSAkamF1PSR4WydsYWlrYXMnXTsgfSAkclsnamF1X3NpdXN0YSddPSRqYXU7CiAgJEM9J1BldHNob3BfQVZfRHJvcHNoaXAnOyAkY2FsbD1mdW5jdGlvbigkbSwuLi4kYXJncykgdXNlKCRDKXsgJHJtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCRDLCRtKTsgJHJtLT5zZXRBY2Nlc3NpYmxlKHRydWUpOyByZXR1cm4gJHJtLT5pbnZva2UobnVsbCwuLi4kYXJncyk7IH07CiAgJHByaWVkYWk9W107ICRyWydsaXBkdWthaSddPVtdOwogIGZvcmVhY2goJElEUyBhcyAkaWQpeyAkbz13Y19nZXRfb3JkZXIoJGlkKTsgJGQ9anNvbl9kZWNvZGUoKHN0cmluZykkby0+Z2V0X21ldGEoJ3ZlbmlwYWtfc2hpcHBpbmdfb3JkZXJfZGF0YScpLHRydWUpOyAkcD0kY2FsbCgnbGlwZHVrYXMnLCRpZCk7ICRyWydsaXBkdWthaSddW109WyRvLT5nZXRfb3JkZXJfbnVtYmVyKCksJGRbJ3BhY2tfbnVtYmVycyddPz9udWxsLCRkWydtYW5pZmVzdCddPz9udWxsLCRwP2Jhc2VuYW1lKCRwKTonTkVQQVZZS08nLCRwP2ZpbGVzaXplKCRwKTowXTsgaWYoJHApICRwcmllZGFpW109JHA7IH0KICBmb3JlYWNoKCRjYWxsKCdtYW5pZmVzdGFzJywkSURTLFtdKSBhcyAkbSl7ICRwcmllZGFpW109JG07ICRyWydtYW5pZmVzdGFzJ11bXT1bYmFzZW5hbWUoJG0pLGZpbGVzaXplKCRtKV07IH0KICAkZz0kY2FsbCgnZ3J1cHVvdGknLCRJRFMsdHJ1ZSk7ICR1ej0kZ1sndmYnXT8/W107ICRyWydjc3ZfdXpzJ109YXJyYXlfbWFwKGZuKCR4KT0+JHhbJ25yJ10uJyAnLmNvdW50KCR4WydlaWx1dGVzJ10pLicgZWlsLicsJHV6KTsKICAkY3N2PSRDOjpjc3ZfZmFpbGFzKCd2ZicsJHV6KTsgaWYoJGNzdil7ICRyWydjc3YnXT1bYmFzZW5hbWUoJGNzdiksZmlsZXNpemUoJGNzdiksbWJfc3Vic3RyKGZpbGVfZ2V0X2NvbnRlbnRzKCRjc3YpLDAsODAwKV07ICRwcmllZGFpW109JGNzdjsgfQogICRpdmFkYXM9JzxwPjxiPlBBS0FSVE9USU5BSTo8L2I+IHBha2FydG90aW5haSBzaXVuxI1pYW1lIDIwMjYtMTEtMTMgdcW+c2FreW11cyAoIzE3MjQsICMxNzI1LCAjMTcyNiwgIzE3MzEpIOKAkyBwZW5rdGFkaWVuaW8gbGFpxaFrYXMgZMSXbCBwYcWhdG8gc3V0cmlraW1vIErFq3PFsyBuZXBhc2lla8SXLiBWZW5pcGFrIGxpcGR1a2FpIHRpZSBwYXR5cyAocHJpc2VndGkpLiBQcmHFoW9tZSBpxaFzacWzc3RpIMWhaWFuZGllbi48L3A+PGhyPic7CiAgJGh0bWw9JGl2YWRhcy4kb3JpZ1snaHRtbCddOwogICRyWydwcmllZGFpJ109YXJyYXlfbWFwKGZuKCRwKT0+YmFzZW5hbWUoJHApLicgJy5yb3VuZChmaWxlc2l6ZSgkcCkvMTAyNCkuJ0tCJywkcHJpZWRhaSk7CiAgaWYoJGY9PT0nMScpeyAkclsnaHRtbF9wcmFkemlhJ109bWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCRodG1sKSwwLDE1MDApOyB9CiAgaWYoJGY9PT0nMicpewogICAgaWYoJGphdSkgdGhyb3cgbmV3IEV4Y2VwdGlvbignamF1IHNpdXN0YSAnLiRqYXUpOwogICAgaWYoY291bnQoJHJbJ2xpcGR1a2FpJ10pIT09NCB8fCBpbl9hcnJheSgnTkVQQVZZS08nLGFycmF5X2NvbHVtbigkclsnbGlwZHVrYWknXSwzKSx0cnVlKSkgdGhyb3cgbmV3IEV4Y2VwdGlvbignbmUgdmlzaSBsaXBkdWthaScpOwogICAgJGVycj0nJzsgJGNiPWZ1bmN0aW9uKCRlKSB1c2UoJiRlcnIpeyAkZXJyPWlzX3dwX2Vycm9yKCRlKT8kZS0+Z2V0X2Vycm9yX21lc3NhZ2UoKTona2xhaWRhJzsgfTsgYWRkX2FjdGlvbignd3BfbWFpbF9mYWlsZWQnLCRjYik7CiAgICAkdGlrcmk9W107ICRnaz1mdW5jdGlvbigkcG0pIHVzZSgmJHRpa3JpKXsgZm9yZWFjaCgoYXJyYXkpJHBtLT5nZXRUb0FkZHJlc3NlcygpIGFzICR4KSAkdGlrcmlbXT0keFswXTsgfTsgYWRkX2FjdGlvbigncGhwbWFpbGVyX2luaXQnLCRnaywxKTsKICAgICRvaz13cF9tYWlsKFsndGVycmFAcGV0c2hvcC5sdCddLCRURU1BLCRodG1sLFsnQ29udGVudC1UeXBlOiB0ZXh0L2h0bWw7IGNoYXJzZXQ9VVRGLTgnLCdGcm9tOiBVQUIgQXZlc2EgPHRlcnJhQHBldHNob3AubHQ+JywnUmVwbHktVG86IHRlcnJhQHBldHNob3AubHQnXSwkcHJpZWRhaSk7CiAgICByZW1vdmVfYWN0aW9uKCdwaHBtYWlsZXJfaW5pdCcsJGdrLDEpOyByZW1vdmVfYWN0aW9uKCd3cF9tYWlsX2ZhaWxlZCcsJGNiKTsKICAgICRyWydzaXVzdGEnXT1bJ29rJz0+JG9rLCdrYW0nPT4kdGlrcmksJ2tsYWlkYSc9PiRlcnIsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKV07CiAgICAkQzo6YXJjaHl2dW90aShbJ3RlcnJhQHBldHNob3AubHQnXSwkVEVNQSwkaHRtbCwkcHJpZWRhaSwnUGFrYXJ0b3RpbmlzIFZGIDExLTEzIGxhacWha2FzIHBlcnNpdW50aW11aSAoUzE4NzEsIFJhaW1pcyDigJ5D4oCcKScpOwogICAgaWYoJG9rKXsgZm9yZWFjaCgkSURTIGFzICRpZCl7ICRvPXdjX2dldF9vcmRlcigkaWQpOyAkby0+YWRkX29yZGVyX25vdGUoJ1Bha2FydG90aW5pcyBWRiBsYWnFoWthcyAoMTEtMTMgbmVwYXNpZWvElykgacWhc2nFs3N0YXMgxK8gdGVycmFAcGV0c2hvcC5sdCBwZXJzacWzc3RpIFZGOyBWZW5pcGFrIGxpcGR1a2FpIHRpZSBwYXR5cyAoUzE4NzEpLicpOyB9IH0KICB9CiAgZm9yZWFjaCgkcHJpZWRhaSBhcyAkcCkgQHVubGluaygkcCk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydLTEFJREEnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0OyB9KTsK';
const VER='dep-085257';
const GKEY='ps_s1871c';
const PHASES=["2"];
const OUT='analize/s1871_c2.json';
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
