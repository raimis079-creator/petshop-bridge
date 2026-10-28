process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA3cmYgcmVmaWxsIHNyYXV0byBixatrbMSXIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgwN3JmJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJEo9JFAuJ3BzX2VtYWlsX2pvYnMnOyAkUj0kUC4ncHNfcmVmaWxsX3RyYWNraW5nJzsgJHI9Wyd2Jz0+J3JmJ107CiAgJHJbJ3ZhcnRhaSddPWdldF9vcHRpb24oJ3BzX2xpZmVjeWNsZV92YXJ0YWknKTsKICAkY29scz0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00gJEoiKTsgJHJbJ2pvYl9jb2xzJ109JGNvbHM7CiAgJGZjPWluX2FycmF5KCdmbG93JywkY29scyk/J2Zsb3cnOihpbl9hcnJheSgnZmxvd19rZXknLCRjb2xzKT8nZmxvd19rZXknOihpbl9hcnJheSgndGlwYXMnLCRjb2xzKT8ndGlwYXMnOm51bGwpKTsgJHJbJ2Zsb3dfY29sJ109JGZjOwogIGlmKCRmYyl7ICRyWydqb2JzXzE0ZCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICRmYyBmLHN0YXR1cyxDT1VOVCgqKSBuLE1BWChjcmVhdGVkX2F0KSBwYXNrIEZST00gJEogV0hFUkUgY3JlYXRlZF9hdD49REFURV9TVUIoVVRDX1RJTUVTVEFNUCgpLElOVEVSVkFMIDE0IERBWSkgR1JPVVAgQlkgJGZjLHN0YXR1cyBPUkRFUiBCWSAkZmMiLEFSUkFZX0EpOyB9CiAgJHJbJ3JlZmlsbF9yZWxhdW5jaCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1cyxwdXJjaGFzZV9jb3VudCxDT1VOVCgqKSBuLE1JTihwcmVkaWN0ZWRfZW1wdHlfZGF0ZSkgbWluX2QsTUFYKHByZWRpY3RlZF9lbXB0eV9kYXRlKSBtYXhfZCBGUk9NICRSIFdIRVJFIGZlZWRiYWNrX2N5Y2xlPSdyZWxhdW5jaCcgR1JPVVAgQlkgc3RhdHVzLHB1cmNoYXNlX2NvdW50IixBUlJBWV9BKTsKICAkclsncmVmaWxsX3JlbGF1bmNoX3ByYWVqZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHIuaWQsci51c2VyX2lkLHIucHJlZGljdGVkX2VtcHR5X2RhdGUsci5zdGF0dXMsci5jcmVhdGVkX2F0IEZST00gJFIgciBXSEVSRSByLmZlZWRiYWNrX2N5Y2xlPSdyZWxhdW5jaCcgQU5EIHIucHJlZGljdGVkX2VtcHR5X2RhdGU8Q1VSREFURSgpIEFORCByLnVzZXJfaWQ8PjQ0IE9SREVSIEJZIHIucHJlZGljdGVkX2VtcHR5X2RhdGUgREVTQyBMSU1JVCA4IixBUlJBWV9BKTsKICBpZigkZmMpeyBmb3JlYWNoKCRyWydyZWZpbGxfcmVsYXVuY2hfcHJhZWplJ10gYXMgJiR4KXsgJHhbJ2pvYnMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCAkZmMgZixzdGF0dXMsY3JlYXRlZF9hdCxzY2hlZHVsZWRfYXQgRlJPTSAkSiBXSEVSRSAodXNlcl9pZD0lZCBPUiBkZWR1cGVfa2V5IExJS0UgJXMpIEFORCAkZmMgTElLRSAlcyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDMiLCR4Wyd1c2VyX2lkJ10sJyU6Jy4keFsnaWQnXS4nJScsJyVyZWZpbGwlJyksQVJSQVlfQSk7IH0gdW5zZXQoJHgpOyB9CiAgaWYoJHdwZGItPmxhc3RfZXJyb3IpICRyWydkYl9lcnInXT0kd3BkYi0+bGFzdF9lcnJvcjsKICAkZj1XUF9DT05URU5UX0RJUi4nL211LXBsdWdpbnMnOyAkaGl0cz1bXTsgZm9yZWFjaChnbG9iKCRmLicvKi5waHAnKSBhcyAkcCl7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsgaWYoc3RycG9zKCRzLCdyZWZpbGxfZHVlJykhPT1mYWxzZSl7IHByZWdfbWF0Y2hfYWxsKCcvLnswLDEyMH1yZWZpbGxfZHVlLnswLDE2MH0vJywkcywkbSk7ICRoaXRzW2Jhc2VuYW1lKCRwKV09YXJyYXlfc2xpY2UoJG1bMF0sMCw0KTsgfSB9ICRyWydrb2RhcyddPSRoaXRzOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwxKTsK';
const VER='dep-172146';
const GKEY='ps_s1807rf';
const PHASES=["1"];
const OUT='analize/s1807_rf.json';
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
