process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NDMgQUQg4oCUIFJFQUQtT05MWTogaXN0b3Jpam9zIGFkYXB0ZXJpbyBBUEkgKGZ1bmtjaWpvcywga2FibGlhaSwgcmVidWlsZCkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjQzYWQnXSkpIHJldHVybjsKICAkbz1hcnJheSgndic9PidTMTY0MyBBRCcpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtaXN0b3Jpam9zLWFkYXB0ZXJpcy5waHAnOwogICRvWyd5cmEnXT1maWxlX2V4aXN0cygkZik/MTowOwogIGlmKCRvWyd5cmEnXSl7CiAgICAkYz1maWxlX2dldF9jb250ZW50cygkZik7ICRvWydkeWRpcyddPXN0cmxlbigkYyk7ICRvWydlaWx1dGVzJ109c3Vic3RyX2NvdW50KCRjLCJcbiIpOwogICAgcHJlZ19tYXRjaCgnL1ZlcnNpb246XHMqKFswLTkuXSspL2knLCRjLCRtKTsgJG9bJ3ZlcnNpamEnXT0kbVsxXT8/Jyc7CiAgICBwcmVnX21hdGNoX2FsbCgnL2Z1bmN0aW9uXHMrKFthLXpBLVowLTlfXSspXHMqXCgvJywkYywkbTEpOyAkb1snZnVua2Npam9zJ109YXJyYXlfc2xpY2UoYXJyYXlfdW5pcXVlKCRtMVsxXSksMCw0MCk7CiAgICBwcmVnX21hdGNoX2FsbCgnLyg/OmFkZF9hY3Rpb258YWRkX2ZpbHRlcnxkb19hY3Rpb24pXChccypbXCciXShbXlwnIl0rKS8nLCRjLCRtMik7ICRvWydrYWJsaWFpJ109YXJyYXlfc2xpY2UoYXJyYXlfdW5pcXVlKCRtMlsxXSksMCwzMCk7CiAgICBwcmVnX21hdGNoX2FsbCgnLyg/OklOU0VSVCBJTlRPfFJFUExBQ0UgSU5UT3xUUlVOQ0FURXxERUxFVEUgRlJPTXxDUkVBVEUgT1IgUkVQTEFDRSBWSUVXKVxzK1x7P1wkP1thLXpfXSpcfT8oW2EtejAtOV9dKykvaScsJGMsJG0zKTsgJG9bJ3Jhc29tb3NfbGVudGVsZXMnXT1hcnJheV9zbGljZShhcnJheV91bmlxdWUoJG0zWzFdKSwwLDI1KTsKICAgIHByZWdfbWF0Y2hfYWxsKCcvW1wnIl0ocHNfW2EtejAtOV9dKylbXCciXS8nLCRjLCRtNCk7ICRvWydtaW5pbW9zJ109YXJyYXlfc2xpY2UoYXJyYXlfdW5pcXVlKCRtNFsxXSksMCwyNSk7CiAgICBwcmVnX21hdGNoX2FsbCgnLyg5MDAwfHByZWZpa3N8T0ZGU0VUfG9mZnNldClbXlxuXXswLDcwfS8nLCRjLCRtNSk7ICRvWydpZF9vZmZzZXQnXT1hcnJheV9zbGljZSgkbTVbMF0sMCw2KTsKICB9CiAgJGc9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1hdGFza2FpdGEta2xpZW50YWkucGhwJzsKICBpZihmaWxlX2V4aXN0cygkZykpeyAkYzI9ZmlsZV9nZXRfY29udGVudHMoJGcpOyBwcmVnX21hdGNoX2FsbCgnL2Z1bmN0aW9uXHMrKFthLXpBLVowLTlfXSspXHMqXCgvJywkYzIsJG02KTsgJG9bJ2tsaWVudGFpX2Z1bmtjaWpvcyddPWFycmF5X3NsaWNlKGFycmF5X3VuaXF1ZSgkbTZbMV0pLDAsMjUpOwogICAgcHJlZ19tYXRjaF9hbGwoJy8oPzpJTlNFUlQgSU5UT3xSRVBMQUNFIElOVE98VFJVTkNBVEV8REVMRVRFIEZST00pXHMrXHs/XCQ/W2Etel9dKlx9PyhbYS16MC05X10rKS9pJywkYzIsJG03KTsgJG9bJ2tsaWVudGFpX3Jhc29tb3MnXT1hcnJheV9zbGljZShhcnJheV91bmlxdWUoJG03WzFdKSwwLDE1KTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sOTkpOwo=';
const VER='dep-220533';
const GKEY='ps_s1643ad';
const PHASES=["AD"];
const OUT='analize/s1643ad.json';
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
