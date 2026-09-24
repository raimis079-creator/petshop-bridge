process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzExYyddKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHI9W107CiAgZm9yZWFjaChbJ3NuaXAnLCdzZXJ5a2wnLCdwdXJ2Jywna2lhdWwlc25pcCddIGFzICR3KSAkclsncCddWyR3XT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBJRCxwb3N0X25hbWUscG9zdF9zdGF0dXMgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X25hbWUgTElLRSAlcyBPUkRFUiBCWSBwb3N0X3N0YXR1cz0ncHVibGlzaCcgREVTQyBMSU1JVCA4IiwnJScuJHcuJyUnKSxBUlJBWV9BKTsKICAkclsnY2F0J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdC5zbHVnLHQudGVybV9pZCx4LnBhcmVudCBGUk9NIHskd3BkYi0+dGVybXN9IHQgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHggT04geC50ZXJtX2lkPXQudGVybV9pZCBXSEVSRSB4LnRheG9ub215PSdwcm9kdWN0X2NhdCcgQU5EICh0LnNsdWcgTElLRSAnJXNlcnlrJScgT1IgdC5zbHVnIExJS0UgJyVkdWJlbmVsJScgT1IgdC5zbHVnIExJS0UgJyVraWxpbSUnIE9SIHQuc2x1ZyBMSUtFICclbWFpc3Rhcy1rYXRlbXMlJyBPUiB0LnNsdWcgTElLRSAnJXNrYW5lc3QlJykiLEFSUkFZX0EpOwogICRyWydibG9nbWFwJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCxwLnBvc3RfbmFtZSxwLnBvc3RfdHlwZSxwLnBvc3Rfc3RhdHVzLCBSRUdFWFBfU1VCU1RSKG0ubWV0YV92YWx1ZSwnYmxvZ2lkPVswLTldKycpIGIgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBtIEpPSU4geyR3cGRiLT5wb3N0c30gcCBPTiBwLklEPW0ucG9zdF9pZCBXSEVSRSBtLm1ldGFfa2V5PSdfcGV0c2hvcF9wcmVfZm9yY2VfY29udGVudCcgQU5EIG0ubWV0YV92YWx1ZSBMSUtFICclcm91dGU9YmxvZy9hcnRpY2xlL3ByaW50cyUnIixBUlJBWV9BKTsKICAkclsnYmxvZ19vdGhlciddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQscC5wb3N0X25hbWUscC5wb3N0X3R5cGUsIFJFR0VYUF9TVUJTVFIocC5wb3N0X2NvbnRlbnQsJ2Jsb2dpZD1bMC05XSsnKSBiIEZST00geyR3cGRiLT5wb3N0c30gcCBXSEVSRSBwLnBvc3RfdHlwZSBJTigncG9zdCcsJ3BhZ2UnKSBBTkQgcC5wb3N0X2NvbnRlbnQgTElLRSAnJWJsb2dpZD0lJyIsQVJSQVlfQSk7CiAgLy8gd2hvIHNlcnZlcyByb2JvdHMKICBnbG9iYWwgJHdwX2ZpbHRlcjsgJHJbJ3JvYm90c19ob29rcyddPVtdOyBpZihpc3NldCgkd3BfZmlsdGVyWydyb2JvdHNfdHh0J10pKSBmb3JlYWNoKCR3cF9maWx0ZXJbJ3JvYm90c190eHQnXS0+Y2FsbGJhY2tzIGFzICRwcj0+JGNicykgZm9yZWFjaCgkY2JzIGFzICRjYil7ICRmbj0kY2JbJ2Z1bmN0aW9uJ107ICRyWydyb2JvdHNfaG9va3MnXVtdPSRwci4nICcuKGlzX2FycmF5KCRmbik/KGlzX29iamVjdCgkZm5bMF0pP2dldF9jbGFzcygkZm5bMF0pOiRmblswXSkuJzo6Jy4kZm5bMV06KGlzX3N0cmluZygkZm4pPyRmbjonY2xvc3VyZScpKTsgfQogICRyWydtdV9leGlzdHMnXT1bJ3JvYm90cyc9PmZpbGVfZXhpc3RzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZ3NjLXR2YXJrYS5waHAnKV07CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSwgMSk7Cg==';
const VER='dep-133027';
const GKEY='ps_s1711c';
const PHASES=["1"];
const OUT='analize/s1711_c.json';
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
