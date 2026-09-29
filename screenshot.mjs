process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzM2bCBrdXIgdmVkYSDigJ5EYXVnaWF1PXBpZ2lhdSIgbnVvcm9kb3MgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzM2bCddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTczNmwnXTsgQHNldF90aW1lX2xpbWl0KDIwMCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzM2bCcsJ2ZhemUnPT4kZl07CiAgdHJ5ewogIGlmKCRmPT09JzEnKXsKICAgICRyWydtZW5pdSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQscC5wb3N0X3RpdGxlLG0xLm1ldGFfdmFsdWUgdGlwYXMsbTIubWV0YV92YWx1ZSBvYmosbTMubWV0YV92YWx1ZSB1cmwgRlJPTSB7JFB9cG9zdHMgcCBMRUZUIEpPSU4geyRQfXBvc3RtZXRhIG0xIE9OIG0xLnBvc3RfaWQ9cC5JRCBBTkQgbTEubWV0YV9rZXk9J19tZW51X2l0ZW1fdHlwZScgTEVGVCBKT0lOIHskUH1wb3N0bWV0YSBtMiBPTiBtMi5wb3N0X2lkPXAuSUQgQU5EIG0yLm1ldGFfa2V5PSdfbWVudV9pdGVtX29iamVjdF9pZCcgTEVGVCBKT0lOIHskUH1wb3N0bWV0YSBtMyBPTiBtMy5wb3N0X2lkPXAuSUQgQU5EIG0zLm1ldGFfa2V5PSdfbWVudV9pdGVtX3VybCcgV0hFUkUgcC5wb3N0X3R5cGU9J25hdl9tZW51X2l0ZW0nIEFORCAocC5wb3N0X3RpdGxlIExJS0UgJyVpZ2lhdSUnIE9SIG0zLm1ldGFfdmFsdWUgTElLRSAnJWlnaWF1JScgT1IgbTIubWV0YV92YWx1ZT0nOTEnKSIsQVJSQVlfQSk7CiAgICAkclsncHVzbGFwaWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQscG9zdF90aXRsZSxwb3N0X25hbWUscG9zdF9zdGF0dXMgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlIElOKCdwYWdlJywncG9zdCcpIEFORCAocG9zdF9uYW1lIExJS0UgJyVpZ2lhdSUnIE9SIHBvc3RfdGl0bGUgTElLRSAnJWlnaWF1JScgT1IgcG9zdF9jb250ZW50IExJS0UgJyVkYXVnaWF1LXBpZ2lhdSUnKSIsQVJSQVlfQSk7CiAgICAkeD13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvP3BzX2hiPScudGltZSgpKSxbJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2hlYWRlcnMnPT5bJ0Nvb2tpZSc9Pidwc19qcz0xJ11dKTsgJGg9aXNfd3BfZXJyb3IoJHgpPycnOndwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCR4KTsKICAgIHByZWdfbWF0Y2hfYWxsKCd+aHJlZj0iKFteIl0qKD86aWdpYXV8ZGF1Z2lhdSlbXiJdKikifmknLCRoLCRtKTsgJHJbJ3ByYWR6aW9zX251b3JvZG9zJ109YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkbVsxXSkpOwogICAgLy8gcGF0aSBrYXRlZ29yaWphOiBraWVrIHBlciBwdXNsYXDErywgcHVzbGFwacWzIHNrYWnEjWl1cywgcGlybW9zIGtvcnRlbMSXcwogICAgJHU9YWRkX3F1ZXJ5X2FyZygncHNfaGInLHRpbWUoKS4nMScsZ2V0X3Rlcm1fbGluayg5MSwncHJvZHVjdF9jYXQnKSk7ICR4PXdwX3JlbW90ZV9nZXQoJHUsWyd0aW1lb3V0Jz0+NDAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdoZWFkZXJzJz0+WydDb29raWUnPT4ncHNfanM9MSddXSk7ICRoPWlzX3dwX2Vycm9yKCR4KT8nJzp3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkeCk7CiAgICBwcmVnX21hdGNoX2FsbCgnfmNsYXNzPSJbXiJdKlxicHJvZHVjdC1zbWFsbFxiW14iXSoificsJGgsJG0yKTsgJHJbJ2tvcnRlbGl1XzFwc2wnXT1jb3VudCgkbTJbMF0pOwogICAgcHJlZ19tYXRjaF9hbGwoJ34vcGFnZS8oXGQrKS9+JywkaCwkbTMpOyAkclsncHVzbGFwaWFpX251b3JvZG9zJ109YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkbTNbMV0pKTsKICAgIGlmKHByZWdfbWF0Y2goJ353b29jb21tZXJjZS1yZXN1bHQtY291bnRbXj5dKj4oLio/KTwvcD5+cycsJGgsJG00KSkgJHJbJ3JjJ109dHJpbSh3cF9zdHJpcF9hbGxfdGFncygkbTRbMV0pKTsKICAgICRyWydrZXNhcyddPWdsb2IoV1BfQ09OVEVOVF9ESVIuJy9jYWNoZS9zdXBlcmNhY2hlL3BldHNob3AubHQva2F0ZWdvcmlqYS9kYXVnaWF1LXBpZ2lhdS8qJyk7CiAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-123628';
const GKEY='ps_s1736l';
const PHASES=["1"];
const OUT='analize/s1736_l.json';
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
