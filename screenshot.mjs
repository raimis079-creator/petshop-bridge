process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzg5aCBsYXRla3NvIHphaXNsYXMgc3UgbWFpc3RvIHNrYWljaXVva2xlIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc4OWgnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE1MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzg5aCddOwogIHRyeXsKICAgIC8vIDEuIGt1ciB5cmEgYmxva2FzCiAgICAkaD1bXTsgZm9yZWFjaChhcnJheV9tZXJnZShnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJyksZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC0qLyoucGhwJyksZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC0qL2luY2x1ZGVzLyoucGhwJyksZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC0qL3RlbXBsYXRlcy8qLnBocCcpLGdsb2IoZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy8qLnBocCcpKSBhcyAkZil7IGZvcmVhY2goZmlsZSgkZikgYXMgJGk9PiRsKXsgaWYoc3RyaXBvcygkbCwnS2llayDFoWlvIG1haXN0byB1xb50ZWtzJykhPT1mYWxzZXx8c3RyaXBvcygkbCwnS2llayBncmFtxbMgZHVvZGF0ZScpIT09ZmFsc2UpICRoW109c3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkZikuJzonLigkaSsxKTsgfSB9CiAgICAkc249JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUgRlJPTSB7JFB9c25pcHBldHMgV0hFUkUgY29kZSBMSUtFICclS2llayDFoWlvIG1haXN0byB1xb50ZWtzJScgT1IgY29kZSBMSUtFICclS2llayBncmFtxbMgZHVvZGF0ZSUnIixBUlJBWV9BKTsgJHJbJ2t1ciddPSRoOyAkclsnc25pcHBldGFpJ109JHNuOwogICAgLy8gMi4gcHJla2U6IGxhdGVrc28sIDQuMzcKICAgICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBwLklEIEZST00geyRQfXBvc3RzIHAgSk9JTiB7JFB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0nX3ByaWNlJyBBTkQgbS5tZXRhX3ZhbHVlIElOKCc0LjM3JywnNC4zNzAwMDAnKSBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXMgSU4oJ3B1Ymxpc2gnLCdkcmFmdCcsJ3ByaXZhdGUnKSBPUkRFUiBCWSBwLnBvc3RfbW9kaWZpZWQgREVTQyBMSU1JVCAyMCIpOwogICAgJHg9W107IGZvcmVhY2goJGlkcyBhcyAkaWQpeyAkYz1nZXRfcG9zdF9maWVsZCgncG9zdF9jb250ZW50JywkaWQpLicgJy5nZXRfcG9zdF9maWVsZCgncG9zdF9leGNlcnB0JywkaWQpOyBpZihzdHJpcG9zKCRjLCdsYXRlaycpPT09ZmFsc2UgJiYgc3RyaXBvcyhnZXRfdGhlX3RpdGxlKCRpZCksJ2xhdGVrJyk9PT1mYWxzZSkgY29udGludWU7CiAgICAgICRtPVtdOyBmb3JlYWNoKGdldF9wb3N0X21ldGEoJGlkKSBhcyAkaz0+JHYpeyBpZihwcmVnX21hdGNoKCcvXl8oc2t1fHByaWNlfHN0b2NrfHBzX3x6Ynx2ZnxmZWVkaW5nfHBhY2t8d2VpZ2h0fGR5ZHp8Y2FsY3xza2FpY3xyZWMpfGZlZWRpbmd8Y2FsY3xzdm9yaXN8cGFrdW90L2knLCRrKSkgJG1bJGtdPW1iX3N1YnN0cigoc3RyaW5nKSR2WzBdLDAsMTIwKTsgfQogICAgICAkeFtdPVsnaWQnPT4kaWQsJ3RpdGxlJz0+Z2V0X3RoZV90aXRsZSgkaWQpLCdzdGF0dXMnPT5nZXRfcG9zdF9zdGF0dXMoJGlkKSwnc3VrdXJ0YSc9PmdldF9wb3N0X2ZpZWxkKCdwb3N0X2RhdGUnLCRpZCksJ2tlaXN0YSc9PmdldF9wb3N0X2ZpZWxkKCdwb3N0X21vZGlmaWVkJywkaWQpLCd1cmwnPT5nZXRfcGVybWFsaW5rKCRpZCksJ2thdCc9PndwX2dldF9wb3N0X3Rlcm1zKCRpZCwncHJvZHVjdF9jYXQnLFsnZmllbGRzJz0+J25hbWVzJ10pLCdwYV9wYWt1b3Rlc19keWRpcyc9PndwX2dldF9wb3N0X3Rlcm1zKCRpZCwncGFfcGFrdW90ZXNfZHlkaXMnLFsnZmllbGRzJz0+J25hbWVzJ10pLCdtZXRhJz0+JG0sCiAgICAgICAgJ2ZlZWRpbmdfbWFwJz0+JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskUH1wc19mZWVkaW5nX21hcCBXSEVSRSBwcm9kdWN0X2lkPSVkIExJTUlUIDMiLCRpZCksQVJSQVlfQSldOyB9CiAgICAkclsncHJla2VzJ109JHg7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydlcnInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVHxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-110837';
const GKEY='ps_s1789h';
const PHASES=["1"];
const OUT='analize/s1789p_h.json';
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
