process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE2cyAva2FzYS8gbnVvcm9kb3Mga29kZSByZWFkLW9ubHkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzE2cyddKSkgcmV0dXJuOwogIEBzZXRfdGltZV9saW1pdCgxNzApOyBnbG9iYWwgJHdwZGI7ICRyPVsndic9PidTMTcxNnMnXTsKICB0cnl7CiAgICAkclsnY2hlY2tvdXRfcGFnZSddPVt3Y19nZXRfcGFnZV9pZCgnY2hlY2tvdXQnKSxnZXRfcG9zdF9maWVsZCgncG9zdF9uYW1lJyx3Y19nZXRfcGFnZV9pZCgnY2hlY2tvdXQnKSksZ2V0X3Bvc3RfZmllbGQoJ3Bvc3RfdGl0bGUnLHdjX2dldF9wYWdlX2lkKCdjaGVja291dCcpKSx3Y19nZXRfY2hlY2tvdXRfdXJsKCldOwogICAgJGZpbGVzPWFycmF5X21lcmdlKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSxnbG9iKFdQTVVfUExVR0lOX0RJUi4nL3BzLXNhYmxvbmFpLyoucGhwJyksZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC0qLyoucGhwJyksZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC0qL2luY2x1ZGVzLyoucGhwJyksZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC0qL3RlbXBsYXRlcy9lbWFpbHMvKi5waHAnKSxnbG9iKGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvKi5waHAnKSxnbG9iKFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy8qLmpzb24nKSk7CiAgICAkbj0wOyBmb3JlYWNoKCRmaWxlcyBhcyAkZyl7ICRzPUBmaWxlX2dldF9jb250ZW50cygkZyk7IGlmKCRzPT09ZmFsc2UpIGNvbnRpbnVlOyAkYz1wcmVnX21hdGNoX2FsbCgnIy9rYXNhLyMnLCRzKTsgaWYoJGMpeyAkbis9JGM7ICRyWydmYWlsYWknXVtzdHJfcmVwbGFjZShBQlNQQVRILCcnLCRnKV09JGM7IH0gfQogICAgJHJbJ3Zpc29fa29kZSddPSRuOwogICAgJHJbJ3NuaXBwZXRzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsIG5hbWUsIChMRU5HVEgoY29kZSktTEVOR1RIKFJFUExBQ0UoY29kZSwnL2thc2EvJywnJykpKS82IG4gRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBhY3RpdmU9MSBBTkQgY29kZSBMSUtFICclL2thc2EvJSciLEFSUkFZX0EpOwogICAgJHJbJ3R1cmlueXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwb3N0X3R5cGUsIENPVU5UKCopIG4gRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3N0YXR1cyBJTiAoJ3B1Ymxpc2gnLCdkcmFmdCcpIEFORCBwb3N0X2NvbnRlbnQgTElLRSAnJS9rYXNhLyUnIEdST1VQIEJZIHBvc3RfdHlwZSIsQVJSQVlfQSk7CiAgICAkclsnZ3NjX2tsaWthaV9rYXNhJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT0FMRVNDRShTVU0ocGFzcGF1ZGltYWkpLDApIEZST00geyR3cGRiLT5wcmVmaXh9cHNfZmFrdF9nc2NfdXJsX2QgV0hFUkUgdXJsIExJS0UgJyUva2FzYS8lJyIpOwogICAgJHJbJ25vaW5kZXgnXT1nZXRfcG9zdF9tZXRhKHdjX2dldF9wYWdlX2lkKCdjaGVja291dCcpLCdyYW5rX21hdGhfcm9ib3RzJyx0cnVlKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-215606';
const GKEY='ps_s1716s';
const PHASES=["1"];
const OUT='analize/s1716_s1.json';
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
