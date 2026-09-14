process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODEgcyDigJQgcmVhZC1vbmx5OiB6b25vcyAyIChFRS9MVikgVmVuaXBhayBwaWNrdXAgaW5zdCA1IHBpbG5pIG51c3RhdHltYWksIHBsdWdpbm8gY2FsY3VsYXRlX3NoaXBwaW5nIChQVk0pLCBzYXZpIHNpdW50aW1vIGthaW5vcyBmaWx0cmFpLCBwcmljZXNfaW5jbHVkZV90YXguICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjgxcyddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCd2Jz0+J1MxNjgxIHMnKTsKICAkb1snaW5zdDUnXT1nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9zaG9wdXBfdmVuaXBha19zaGlwcGluZ19waWNrdXBfbWV0aG9kXzVfc2V0dGluZ3MnKTsgJG9bJ2luc3QzJ109Z2V0X29wdGlvbignd29vY29tbWVyY2Vfc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfcGlja3VwX21ldGhvZF8zX3NldHRpbmdzJyk7ICRvWydpbnN0MiddPWdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX3Nob3B1cF92ZW5pcGFrX3NoaXBwaW5nX2NvdXJpZXJfbWV0aG9kXzJfc2V0dGluZ3MnKTsKICAkb1sndGF4J109YXJyYXkoJ3ByaWNlc19pbmNsdWRlX3RheCc9PmdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX3ByaWNlc19pbmNsdWRlX3RheCcpLCdjYWxjX3RheGVzJz0+Z2V0X29wdGlvbignd29vY29tbWVyY2VfY2FsY190YXhlcycpLCdzaGlwX3RheF9jbGFzcyc9PmdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX3NoaXBwaW5nX3RheF9jbGFzcycpLCdkaXNwbGF5X2NhcnQnPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV90YXhfZGlzcGxheV9jYXJ0JykpOwogICRvWydyYXRlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHRheF9yYXRlX2NvdW50cnkgYyx0YXhfcmF0ZSByLHRheF9yYXRlX2NsYXNzIGNsLHRheF9yYXRlX3NoaXBwaW5nIHMgRlJPTSB7JHdwZGItPnByZWZpeH13b29jb21tZXJjZV90YXhfcmF0ZXMiLEFSUkFZX0EpOwogICRmPVdQX1BMVUdJTl9ESVIuJy93Yy12ZW5pcGFrLXNoaXBwaW5nL2FkbWluL2NsYXNzLXdvb2NvbW1lcmNlLXNob3B1cC12ZW5pcGFrLXNoaXBwaW5nLWFkbWluLXBpY2t1cC5waHAnOyAkcz1maWxlX2dldF9jb250ZW50cygkZik7ICRpPXN0cnBvcygkcywnZnVuY3Rpb24gY2FsY3VsYXRlX3NoaXBwaW5nJyk7ICRvWydjYWxjJ109c3Vic3RyKCRzLCRpLDE4MDApOwogIGZvcmVhY2goYXJyYXlfbWVyZ2UoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpLGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtKi97LCovfSoucGhwJyxHTE9CX0JSQUNFKSkgYXMgJGYpeyAkcz1maWxlX2dldF9jb250ZW50cygkZik7IGlmKHByZWdfbWF0Y2hfYWxsKCcvXi4qKHdvb2NvbW1lcmNlX3BhY2thZ2VfcmF0ZXN8d29vY29tbWVyY2Vfc2hpcHBpbmdfcmF0ZV9jb3N0fG1pbl9hbW91bnRfZm9yX2ZyZWVfc2hpcHBpbmd8bmVtb2thbVx3KiBwcmlzdGF0fGZyZWVfc2hpcHBpbmcpLiokL21pJywkcywkbSkpICRvWydmaWx0cmFpJ11bc3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkZildPWFycmF5X3NsaWNlKGFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIHN1YnN0cih0cmltKCR4KSwwLDE2MCk7fSwkbVswXSksMCw2KTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-114821';
const GKEY='ps_s1681s';
const PHASES=["A"];
const OUT='analize/s1681_s.json';
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
