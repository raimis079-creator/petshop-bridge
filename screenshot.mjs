process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODUwcjEgIzE2NTIgZ3JhemluaW1vIHR5cmltYXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODUwcjEnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE0MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODUwcjEnXTsKICAkbz13Y19nZXRfb3JkZXIoMzgyNTEpOwogIGZvcmVhY2goJG8tPmdldF9pdGVtcyhbJ2xpbmVfaXRlbScsJ3NoaXBwaW5nJywnZmVlJ10pIGFzICRpaWQ9PiRpdCl7ICR4PVsnaWlkJz0+JGlpZCwndHlwZSc9PiRpdC0+Z2V0X3R5cGUoKSwnbic9Pm1iX3N1YnN0cigkaXQtPmdldF9uYW1lKCksMCw2MCksJ3RvdGFsJz0+JGl0LT5nZXRfdG90YWwoKSwndGF4Jz0+JGl0LT5nZXRfdG90YWxfdGF4KCldOyBpZigkaXQtPmlzX3R5cGUoJ2xpbmVfaXRlbScpKXsgJHhbJ3F0eSddPSRpdC0+Z2V0X3F1YW50aXR5KCk7ICR4WydwaWQnXT0kaXQtPmdldF9wcm9kdWN0X2lkKCk7ICR4WydtZXRhJ109W107IGZvcmVhY2goJGl0LT5nZXRfbWV0YV9kYXRhKCkgYXMgJG0peyAkeFsnbWV0YSddWyRtLT5rZXldPWlzX3NjYWxhcigkbS0+dmFsdWUpP21iX3N1YnN0cigoc3RyaW5nKSRtLT52YWx1ZSwwLDgwKTonW2Fycl0nOyB9IH0gJHJbJ2l0ZW1zJ11bXT0keDsgfQogICRyWyd0b3QnXT1bJ3RvdGFsJz0+JG8tPmdldF90b3RhbCgpLCd0YXgnPT4kby0+Z2V0X3RvdGFsX3RheCgpLCdzaGlwJz0+JG8tPmdldF9zaGlwcGluZ190b3RhbCgpLCdyZWZ1bmRlZCc9PiRvLT5nZXRfdG90YWxfcmVmdW5kZWQoKSwnc3RhdHVzJz0+JG8tPmdldF9zdGF0dXMoKSwncG0nPT4kby0+Z2V0X3BheW1lbnRfbWV0aG9kX3RpdGxlKCldOwogICRtaz1bXTsgZm9yZWFjaCgkby0+Z2V0X21ldGFfZGF0YSgpIGFzICRtKXsgaWYocHJlZ19tYXRjaCgnL3NmfGF2cG58aW52b2ljZXxwZGZ8a3J8Y3JlZGl0fGtyZWRpdHxncmF6aW58d2NkbnxmYWt0fHdpdGhkcmF3fHV6YmFpZ3xzaGlwbWVudHN8cHJhZ21hL2knLCRtLT5rZXkpKSAkbWtbJG0tPmtleV09aXNfc2NhbGFyKCRtLT52YWx1ZSk/bWJfc3Vic3RyKChzdHJpbmcpJG0tPnZhbHVlLDAsMjAwKTptYl9zdWJzdHIod3BfanNvbl9lbmNvZGUoJG0tPnZhbHVlKSwwLDMwMCk7IH0gJHJbJ21ldGEnXT0kbWs7CiAgJHJbJ2Zha3QnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCAqIEZST00geyRQfXBzX2Zha3RfdXpzYWt5bWFpIFdIRVJFIHV6c2FreW1hc19pZD0lZCIsMzgyNTEpLEFSUkFZX0EpOwogICRyWydyZWZ1bmRzX2FsbCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG8uaWQsIG8ucGFyZW50X29yZGVyX2lkLCBvLnRvdGFsX2Ftb3VudCwgby5kYXRlX2NyZWF0ZWRfZ210IEZST00geyRQfXdjX29yZGVycyBvIFdIRVJFIG8udHlwZT0nc2hvcF9vcmRlcl9yZWZ1bmQnIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMTAiLEFSUkFZX0EpOwogICRyWydyZWZ1bmRzX24nXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXdjX29yZGVycyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyX3JlZnVuZCciKTsKICAkclsna3JfbWV0YSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG1ldGFfa2V5LCBDT1VOVCgqKSBuLCBNQVgobWV0YV92YWx1ZSkgbXggRlJPTSB7JFB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXkgTElLRSAnJWtyJScgT1IgbWV0YV9rZXkgTElLRSAnJWNyZWRpdCUnIE9SIG1ldGFfa2V5IExJS0UgJyVrcmVkaXQlJyBPUiBtZXRhX2tleSBMSUtFICclZ3JhemluJScgR1JPVVAgQlkgbWV0YV9rZXkiLEFSUkFZX0EpOwogICRyWydvcHRzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsIExFRlQob3B0aW9uX3ZhbHVlLDMwMCkgdiBGUk9NIHskUH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyVrcl9hdnBuJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJWtyYXZwbiUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVjcmVkaXQlJyBPUiBvcHRpb25fbmFtZSBMSUtFICcla3JlZGl0JScgT1Igb3B0aW9uX25hbWUgTElLRSAncGV0c2hvcF9hdnBuX2NvdW50ZXInIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVwcGslJyBPUiBvcHRpb25fbmFtZSBMSUtFICd3Y2RuJScgTElNSVQgMzAiLEFSUkFZX0EpOwogICRoaXRzPVtdOyAkZmlsZXM9YXJyYXlfbWVyZ2UoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLSoucGhwJyk/OltdLGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtcHJhZ21hLyoucGhwJyk/OltdLGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtcHJhZ21hLyovKi5waHAnKT86W10sW2dldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvZnVuY3Rpb25zLnBocCddKTsKICBmb3JlYWNoKCRmaWxlcyBhcyAkZil7ICRMPUBmaWxlKCRmKTsgaWYoISRMKSBjb250aW51ZTsgZm9yZWFjaCgkTCBhcyAkaT0+JGxuKXsgaWYocHJlZ19tYXRjaCgnL3djX2NyZWF0ZV9yZWZ1bmR8Y3JlZGl0bm90ZXxLUi1BVlBOfGtyZWRpdGlufF9wc19ncmF6aW50aV9yYW5rb21pc3xncmF6aW50aV9waW5pZ3VzfHJlZnVuZGVkfGdldF9yZWZ1bmRzfHNob3Bfb3JkZXJfcmVmdW5kL2knLCRsbikpICRoaXRzW109YmFzZW5hbWUoJGYpLic6Jy4oJGkrMSkuJyAnLm1iX3N1YnN0cih0cmltKCRsbiksMCwyMjApOyB9IH0KICAkclsnY29kZSddPWFycmF5X3NsaWNlKCRoaXRzLDAsMTQwKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsgfSk7Cg==';
const VER='dep-084428';
const GKEY='ps_s1850r1';
const PHASES=["1"];
const OUT='analize/s1850r1.json';
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
