process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzk1aCB1enNha3ltbyAxNTIyIHJlY29uICsgc2Fza2FpdG9zIHNhYmxvbmFzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc5NWgnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3OTVoJ107CiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00geyRQfXdjX29yZGVycyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDYwIik7CiAgJG89bnVsbDsgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICR4PXdjX2dldF9vcmRlcigkaWQpOyBpZigkeCAmJiAkeC0+Z2V0X29yZGVyX251bWJlcigpPT09JzE1MjInKXsgJG89JHg7IGJyZWFrOyB9IH0KICBpZighJG8peyAkclsnZXJyJ109JzE1MjIgbmVyYXN0YXMnOyB9IGVsc2UgewogICAgJHJbJ2lkJ109JG8tPmdldF9pZCgpOyAkclsnc3QnXT0kby0+Z2V0X3N0YXR1cygpOyAkclsnc3VrdXJ0YSddPSRvLT5nZXRfZGF0ZV9jcmVhdGVkKCk/JG8tPmdldF9kYXRlX2NyZWF0ZWQoKS0+ZGF0ZSgnWS1tLWQgSDppJyk6bnVsbDsgJHJbJ3BhaWQnXT0kby0+aXNfcGFpZCgpOyAkclsnZGF0ZV9wYWlkJ109KHN0cmluZykkby0+Z2V0X2RhdGVfcGFpZCgpOwogICAgJHJbJ21vayddPVskby0+Z2V0X3BheW1lbnRfbWV0aG9kKCksJG8tPmdldF9wYXltZW50X21ldGhvZF90aXRsZSgpXTsgJHJbJ3RvdGFsJ109JG8tPmdldF90b3RhbCgpOyAkclsncHZtJ109JG8tPmdldF90b3RhbF90YXgoKTsgJHJbJ3NpdW50J109JG8tPmdldF9zaGlwcGluZ190b3RhbCgpLicgJy4kby0+Z2V0X3NoaXBwaW5nX21ldGhvZCgpOwogICAgZm9yZWFjaChbJ2ZpcnN0X25hbWUnLCdsYXN0X25hbWUnLCdjb21wYW55JywnYWRkcmVzc18xJywnY2l0eScsJ3Bvc3Rjb2RlJywnY291bnRyeScsJ2VtYWlsJywncGhvbmUnXSBhcyAkZil7ICRyWydiaWxsJ11bJGZdPSRvLT57J2dldF9iaWxsaW5nXycuJGZ9KCk7IH0KICAgIGZvcmVhY2goWydmaXJzdF9uYW1lJywnbGFzdF9uYW1lJywnY29tcGFueScsJ2FkZHJlc3NfMScsJ2NpdHknLCdwb3N0Y29kZSddIGFzICRmKXsgJHJbJ3NoaXAnXVskZl09JG8tPnsnZ2V0X3NoaXBwaW5nXycuJGZ9KCk7IH0KICAgICRtZXRhPVtdOyBmb3JlYWNoKCRvLT5nZXRfbWV0YV9kYXRhKCkgYXMgJG0peyAkaz0kbS0+a2V5OyBpZihwcmVnX21hdGNoKCcvcGV0c2hvcHxfcHNffHZhdHxwdm18aW1vbnxjb21wYW55fGtvZGFzfGJpbGxpbmdffF9iaWxsaW5nL2knLCRrKSkgJG1ldGFbJGtdPWlzX3NjYWxhcigkbS0+dmFsdWUpP21iX3N1YnN0cigoc3RyaW5nKSRtLT52YWx1ZSwwLDEyMCk6anNvbl9lbmNvZGUoJG0tPnZhbHVlKTsgfSAkclsnbWV0YSddPSRtZXRhOwogICAgZm9yZWFjaCgkby0+Z2V0X2l0ZW1zKCkgYXMgJGl0KXsgJHJbJ2l0ZW1zJ11bXT1bJGl0LT5nZXRfbmFtZSgpLCRpdC0+Z2V0X3F1YW50aXR5KCksJGl0LT5nZXRfdG90YWwoKSwkaXQtPmdldF90b3RhbF90YXgoKSwkaXQtPmdldF9tZXRhKCdfcHNfc291cmNlJyldOyB9CiAgICAkclsncGFzdGFib3MnXT1hcnJheV9tYXAoZm4oJG4pPT5bJG4tPmRhdGVfY3JlYXRlZC0+ZGF0ZSgnbS1kIEg6aScpLG1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkbi0+Y29udGVudCksMCwxNjApXSx3Y19nZXRfb3JkZXJfbm90ZXMoWydvcmRlcl9pZCc9PiRvLT5nZXRfaWQoKSwnbGltaXQnPT4xNV0pKTsKICAgICRyWydrbGllbnRhc191enMnXT0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXdjX29yZGVycyBXSEVSRSBiaWxsaW5nX2VtYWlsPSVzIEFORCB0eXBlPSdzaG9wX29yZGVyJyIsJG8tPmdldF9iaWxsaW5nX2VtYWlsKCkpKTsKICB9CiAgLy8gc2FibG9uYXMKICAkdHBsPWdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvd29vY29tbWVyY2UvcHJpbnQtb3JkZXIvaW52b2ljZS8nOyAkclsndHBsX2RpciddPWdsb2IoJHRwbC4nKicpOwogIGZvcmVhY2goKGFycmF5KSRyWyd0cGxfZGlyJ10gYXMgJGYpeyBpZihpc19maWxlKCRmKSl7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgJHJbJ3RwbCddW2Jhc2VuYW1lKCRmKV09WydkeWRpcyc9PnN0cmxlbigkcyksJ2VpbCc9PltdXTsgZm9yZWFjaChleHBsb2RlKCJcbiIsJHMpIGFzICRpPT4kbCl7IGlmKHByZWdfbWF0Y2goJy9wcm9mb3JtYXxpc19wYWlkfElCQU58TFQxMnxwYXZlZGltfGFwbW9rfEFwbW9rfGRvY3VtZW50X3R5cGV8ZG9jX3RpdGxlfGludm9pY2VfbnVtYmVyfGRvY3VtZW50RGF0ZXxEYXRhfGRhdGVcKC9pJywkbCkpICRyWyd0cGwnXVtiYXNlbmFtZSgkZildWydlaWwnXVtdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMjAwKSk7IH0gfSB9CiAgLy8ga2FzIHN1a3VyaWEgUERGIHV6YmFpZ3VzIC8gYXBtb2tlanVzIChmdW5jdGlvbnMucGhwIGhvb2snYWkpCiAgJGZzPWZpbGVfZ2V0X2NvbnRlbnRzKGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvZnVuY3Rpb25zLnBocCcpOyBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkZnMpIGFzICRpPT4kbCl7IGlmKHByZWdfbWF0Y2goJy9hZGRfYWN0aW9uXCguKihzdGF0dXN8cGF5bWVudF9jb21wbGV0ZXxjb21wbGV0ZWR8cHJvY2Vzc2luZyl8X3BldHNob3BfY29tcGxldGVkX3BkZnxfcGV0c2hvcF9vcmRlcl9wZGZ8d3BfbWFpbHxhdHRhY2htZW50cy9pJywkbCkpICRyWydmbl9ob29rcyddW109KCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGwsMCwxNzApKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsgfSk7Cg==';
const VER='dep-082814';
const GKEY='ps_s1795h';
const PHASES=["1"];
const OUT='analize/s1795_h.json';
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
