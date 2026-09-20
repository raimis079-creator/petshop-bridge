process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjk4IDQwNCByZWNvbiAzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTY5OCddKXx8JF9HRVRbJ3BzX3MxNjk4J10hPT0nMScpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjk4IG1jJyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICB0cnl7CiAgICAkdGVzdD1hcnJheSgnL3ByZWtlcy16ZW5rbGFzL2V4Y2x1c2lvbicsJy9wcmVrZXMtemVua2xhcy9vbnRhcmlvJywnL2NoZWNrb3V0JywnL2xvZ2luJywnL3N1bmltcy9wcmlleml1cm9zLXByaWVtb25lcycsJy9raXRhLTQ0NjAwNzI3OC9kYXVnaWF1LXBpZ2lhdS9wYXVrc2NpYW1zLTEzMjI1MTE0OCcsJy90cml4aWUta2lsaW1lbGlzLXB1cnZ1aS1zdXJpbmt0aS0xMjAtODAtY20nLCcvYXV0b21hdGluZS1zZXJ5a2xhLWthdGVpc3VuaXVpJywnL2phdWNpby1hdXNpcy1ydWRhJywnL2pvc2VyYS1taW5pd2VsbC0xMC1rZy1zYXVzYXMtbWFpc3Rhcy1tYXp1LXZlaXNsaXUtc3VuaW1zJywnL3JlYWwtZG9nLXNlbnNpdGl2ZS0xNWtnLXBhc2Nhcm9uYXJhcy1zdWF1Z3VzaWVtcy1zY2Fyb251bmltcy1zdS1hbnRpZW5hLTQ4NDg2LTEnLCcvcGxhY2VrLXBldC1wcm9kdWN0cy1zLXItbycsJy9ncmVlbnBldGZvb2QnLCcvY29udGVudC8zLW51b3N0YXRvcy1pci1zYWx5Z29zJywnL3BhZ3JpbmRpbmlzLzI4MDktb250YXJpby1hZHVsdC1tZWRpdW0tY2hpY2tlbi1hbmQtcG90YXRvZXMtMTIta2ctcGFzYXJhcy12aWR1dGluaXUtdmVpc2xpdS1zdW5pbXMuaHRtbCcsJy9wYXJkdW90dXZlL3BhZ2UvMTA4JywnL3Byb2R1Y3QvZXhjbHVzaW9uLWludGVzdGluYWwtbW9ub3Byb3RlaW4tc2F1c2FzLXN1bnUtbWFpc3Rhcy1zdS1raWF1bGllbmEtaXItcnl6aWFpcy1tLWwxMi1rZy8nLCcvcHJvZHVjdC9kcnVza2Eteml1cmtlbmFtcy1pci1raXRpZW1zLWdyYXV6aWthbXMvJywnL2tyYWlrYXMta2F0ZW1zLXRvZnUtYmVsb2NhdC1sZXZhbmR1LWt2YXBvLTYtbC0yLTUta2ctMi1tbS1ncmFudWxlcycpOwogICAgZm9yZWFjaCgkdGVzdCBhcyAkdSl7ICRyPXdwX3JlbW90ZV9oZWFkKGhvbWVfdXJsKCR1KSxhcnJheSgndGltZW91dCc9PjE1LCdyZWRpcmVjdGlvbic9PjAsJ3VzZXItYWdlbnQnPT4nTW96aWxsYS81LjAgcHMtczE2OTgnKSk7ICRvWydodHRwJ11bJHVdPWlzX3dwX2Vycm9yKCRyKT8kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKTphcnJheSh3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkciksd3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkciwnbG9jYXRpb24nKSx3cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVyKCRyLCd4LXJlZGlyZWN0LWJ5JykpOyB9CiAgICAvLyBsZWdhY3kgbWV0YSByYWt0YWkKICAgICRvWydsZWdhY3lfbWV0YSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG1ldGFfa2V5LCBDT1VOVCgqKSBuIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5IExJS0UgJyVsZWdhY3klJyBPUiBtZXRhX2tleSBMSUtFICclb2xkXyUnIE9SIG1ldGFfa2V5IExJS0UgJyVlc2hvcCUnIEdST1VQIEJZIG1ldGFfa2V5IE9SREVSIEJZIG4gREVTQyBMSU1JVCAyMCIsQVJSQVlfQSk7CiAgICAkb1snbGVnYWN5X3B2eiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBvc3RfaWQsIG1ldGFfa2V5LCBMRUZUKG1ldGFfdmFsdWUsMTIwKSB2IEZST00geyRwfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5IElOICgnX2xlZ2FjeV91cmwnLCdfbGVnYWN5X2lkJywnX2xlZ2FjeV9zbHVnJywnX2xlZ2FjeV9wcm9kdWN0X2lkJywnX2xlZ2FjeV9tYW51ZmFjdHVyZXInKSBPUkRFUiBCWSBwb3N0X2lkIExJTUlUIDgiLEFSUkFZX0EpOwogICAgLy8gdmlkaW7El3MgbnVvcm9kb3MgxK8gL2NoZWNrb3V0LCAvbG9naW4sIGtpdGEtLi4uL3BhdWtzY2lhbXM6IG1lbml1LCBvcGNpam9zLCB0ZW1hLCBsYWnFoWvFsyDFoWFibG9uYWkKICAgICRvWydtZW51X2l0ZW1zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG0ucG9zdF9pZCwgcG0ubWV0YV92YWx1ZSB1cmwgRlJPTSB7JHB9cG9zdG1ldGEgcG0gV0hFUkUgcG0ubWV0YV9rZXk9J19tZW51X2l0ZW1fdXJsJyBBTkQgKHBtLm1ldGFfdmFsdWUgTElLRSAnJWNoZWNrb3V0JScgT1IgcG0ubWV0YV92YWx1ZSBMSUtFICclL2xvZ2luJScgT1IgcG0ubWV0YV92YWx1ZSBMSUtFICclcGF1a3NjaWFtcyUnIE9SIHBtLm1ldGFfdmFsdWUgTElLRSAnJWtpdGEtNDQ2MCUnKSIsQVJSQVlfQSk7CiAgICAkb1snb3B0aW9uc19oaXRzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsIExFTkdUSChvcHRpb25fdmFsdWUpIGxlbiBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl92YWx1ZSBMSUtFICclL2NoZWNrb3V0JScgT1Igb3B0aW9uX3ZhbHVlIExJS0UgJyVwYXVrc2NpYW1zLTEzMjI1MTE0OCUnIE9SIG9wdGlvbl92YWx1ZSBMSUtFICcla2l0YS00NDYwMDcyNzglJyBMSU1JVCAyMCIsQVJSQVlfQSk7CiAgICAkb1sncG9zdHNfaGl0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELCBwb3N0X3R5cGUsIHBvc3RfdGl0bGUgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF9zdGF0dXMgSU4gKCdwdWJsaXNoJywnZHJhZnQnKSBBTkQgKHBvc3RfY29udGVudCBMSUtFICcla2l0YS00NDYwMDcyNzglJyBPUiBwb3N0X2NvbnRlbnQgTElLRSAnJXBhdWtzY2lhbXMtMTMyMjUxMTQ4JScgT1IgcG9zdF9jb250ZW50IExJS0UgJyVocmVmPVwiL2NoZWNrb3V0JScgT1IgcG9zdF9jb250ZW50IExJS0UgJyVwZXRzaG9wLmx0L2NoZWNrb3V0JScgT1IgcG9zdF9jb250ZW50IExJS0UgJyVwZXRzaG9wLmx0L2xvZ2luJScpIExJTUlUIDIwIixBUlJBWV9BKTsKICAgICRvWydzZW80MDRfY2hlY2tvdXRfcmVmJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qga2VsaWFzLCByZWZlcmVyLCBTVU0oaGl0cykgaCBGUk9NIHskcH1wc19zZW9fNDA0IFdIRVJFIGRpZW5hPj0nMjAyNi0wOS0xMScgQU5EIGtlbGlhcyBJTiAoJ2NoZWNrb3V0JywnbG9naW4nLCdraXRhLTQ0NjAwNzI3OC9kYXVnaWF1LXBpZ2lhdS9wYXVrc2NpYW1zLTEzMjI1MTE0OCcpIEdST1VQIEJZIGtlbGlhcywgcmVmZXJlciBPUkRFUiBCWSBoIERFU0MgTElNSVQgMTUiLEFSUkFZX0EpOwogICAgJG9bJ3dlYl9jaGVja291dCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHVybF9rZWxpYXMsIHJlZmVyZXJfZG9tZW5hcywgaXJlbmdpbnlzLCBuYXJzX3NlaW1hLCBzYWxpcywgQ09VTlQoKikgbiBGUk9NIHskcH1wc193ZWJfaXZ5a2lhaSBXSEVSRSB0aXBhcz0nZXJyb3I0MDQnIEFORCB1cmxfa2VsaWFzIExJS0UgJy9jaGVja291dCUnIEdST1VQIEJZIDEsMiwzLDQsNSBMSU1JVCAxMCIsQVJSQVlfQSk7CiAgICAkb1snYnJhbmRfc2x1Z3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0LnNsdWcgRlJPTSB7JHB9dGVybXMgdCBKT0lOIHskcH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1faWQ9dC50ZXJtX2lkIEFORCB0dC50YXhvbm9teT0ncHJvZHVjdF9icmFuZCcgV0hFUkUgdC5zbHVnIElOICgnZXhjbHVzaW9uJywnb250YXJpbycsJ21pYW1vcicsJ2pvc2VyYScsJ2dyZWVucGV0Zm9vZCcsJ2dyZWVuLXBldGZvb2QnLCdwbGFjZWsnKSIsQVJSQVlfQSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-184414';
const GKEY='ps_s1698';
const PHASES=["1"];
const OUT='analize/s1698_mc.json';
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
