process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTEgayDigJQgYXIgeXJhIOKAnnByYW5lxaF0aSBrYWkgYnVzIiAoYmFjay1pbi1zdG9jaykgZnVua2NpamE6IHBsdWdpbmFpLCBsZW50ZWzEl3MsIGtvZG8gcGFpZcWha2EsIMSvdnlraWFpLiBSZWFkLW9ubHkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjkxayddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7ICR3cGRiLT5zdXBwcmVzc19lcnJvcnModHJ1ZSk7CiAgJG9bJ2FrdHl2dXNfcGx1Z2luYWknXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKChhcnJheSlnZXRfb3B0aW9uKCdhY3RpdmVfcGx1Z2lucycpLGZ1bmN0aW9uKCR4KXtyZXR1cm4gcHJlZ19tYXRjaCgnL3N0b2NrfHdhaXR8bm90aWZ8YWxlcnR8cHJhbmV8YmFjay9pJywkeCk7fSkpOwogICRvWyd2aXNpX3BsdWdpbmFpX2F0aXRpbmthJ109YXJyYXkoKTsgZm9yZWFjaCAoKGFycmF5KWdsb2IoV1BfUExVR0lOX0RJUi4nLyonLEdMT0JfT05MWURJUikgYXMgJGQpeyBpZiAocHJlZ19tYXRjaCgnL3N0b2NrfHdhaXR8bm90aWZ8YWxlcnR8YmFjay9pJyxiYXNlbmFtZSgkZCkpKSAkb1sndmlzaV9wbHVnaW5haV9hdGl0aW5rYSddW109YmFzZW5hbWUoJGQpOyB9CiAgJG9bJ2xlbnRlbGVzJ109JHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJyUnIik7ICRvWydsZW50ZWxlcyddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoJG9bJ2xlbnRlbGVzJ10sZnVuY3Rpb24oJHQpe3JldHVybiBwcmVnX21hdGNoKCcvd2FpdHxub3RpZnxhbGVydHxzdG9ja3xwcmFuZXxsYXVrfHN1YnNjci9pJywkdCk7fSkpOwogICRoaXRzPWFycmF5KCk7IGZvcmVhY2ggKGFycmF5KFdQTVVfUExVR0lOX0RJUiwgV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZScsIGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLCBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwnKSBhcyAkZGlyKXsgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZGlyKSk7IGZvcmVhY2ggKCRpdCBhcyAkZil7IGlmICghcHJlZ19tYXRjaCgnL1wuKHBocHxqcykkLycsJGYpKSBjb250aW51ZTsgJGM9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgaWYgKCRjPT09ZmFsc2UpIGNvbnRpbnVlOyBpZiAocHJlZ19tYXRjaF9hbGwoJy9wcmFuZcWhdGkga2FpfHByYW5lc3RpIGthaXxrYWkgYnVzfGJhY2suP2luLj9zdG9ja3x3YWl0bGlzdHxzdG9ja19ub3RpZnxpbmZvcm11b3RpIGthaXxsYXVraW1vL2l1JywkYywkbSkpeyAkaGl0c1tzdHJfcmVwbGFjZShBQlNQQVRILCcnLCRmKV09YXJyYXlfY291bnRfdmFsdWVzKGFycmF5X21hcCgnbWJfc3RydG9sb3dlcicsJG1bMF0pKTsgfSB9IH0KICAkb1sna29kb19hdGl0aWttZW55cyddPSRoaXRzOwogICRvWydpdnlraWFpX3RpcGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdGlwYXMsIENPVU5UKCopIG4gRlJPTSB7JHB9cHNfd2ViX2l2eWtpYWkgV0hFUkUgbGFpa2FzPj1OT1coKS1JTlRFUlZBTCAxMCBEQVkgR1JPVVAgQlkgdGlwYXMgT1JERVIgQlkgbiBERVNDIExJTUlUIDMwIixBUlJBWV9BKTsKICAkb1snaXZ5a2lhaV9jb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskcH1wc193ZWJfaXZ5a2lhaSIpOwogICRvWydzbmlwcGV0YWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCwgbmFtZSwgYWN0aXZlIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnJXByYW5lJScgT1IgbmFtZSBMSUtFICclc3RvY2slJyBPUiBuYW1lIExJS0UgJyVsYXVrJScgT1IgY29kZSBMSUtFICcla2FpIGJ1cyUnIE9SIGNvZGUgTElLRSAnJWJhY2tfaW5fc3RvY2slJyBMSU1JVCAyMCIsQVJSQVlfQSk7CiAgJG9bJ2lzdG9yaWphX2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRwfXBzX2lzdF91enNha3ltYWkiKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-181011';
const GKEY='ps_s1691k';
const PHASES=["1"];
const OUT='analize/s1691_k.json';
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
