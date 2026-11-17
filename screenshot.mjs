process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODc2YiBpc3RvcmlqYSArIGdhbWludG9qYWkgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODc2YiddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTcwKTsgQGluaV9zZXQoJ21lbW9yeV9saW1pdCcsJzUxMk0nKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4NzZiJ107ICRUMD1taWNyb3RpbWUodHJ1ZSk7CiAgdHJ5ewogIGZvcmVhY2goJHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJ3skUH1wc1xcX2lzdCUnIikgYXMgJHQpeyAkclsnaXN0J11bJHRdPVsnY29scyc9PiR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkdCIpLCduJz0+JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0IiksJ3B2eic9PmFycmF5X21hcChmbigkeCk9PmFycmF5X21hcChmbigkdik9PmlzX3N0cmluZygkdik/bWJfc3Vic3RyKCR2LDAsNjApOiR2LCR4KSwkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00gJHQgTElNSVQgMiIsQVJSQVlfQSkpXTsgfQogICR0PSRQLidwc19mYWt0X2VpbHV0ZXMnOyBpZigkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJHQnIikpICRyWydmYWt0X2VpbF9jb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NICR0Iik7CiAgLy8gZ2FtaW50b2phcyB4IHNhdmFpdGUsID49NyBrZyBzYXVzYXMKICAkaWRzPVtdOyBmb3JlYWNoKFsnc2F1c2FzLW1haXN0YXMtc3VuaW1zJywnc2F1c2FzLW1haXN0YXMta2F0ZW1zJ10gYXMgJHMpeyAkdHQ9Z2V0X3Rlcm1fYnkoJ3NsdWcnLCRzLCdwcm9kdWN0X2NhdCcpOyBpZigkdHQpICRpZHM9YXJyYXlfbWVyZ2UoJGlkcyxbJHR0LT50ZXJtX2lkXSxnZXRfdGVybV9jaGlsZHJlbigkdHQtPnRlcm1faWQsJ3Byb2R1Y3RfY2F0JykpOyB9CiAgJGluPWltcGxvZGUoJywnLGFycmF5X21hcCgnaW50dmFsJywkaWRzKSk7CiAgJGRyeT1hcnJheV9mbGlwKGFycmF5X21hcCgnaW50dmFsJywkd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIERJU1RJTkNUIHRyLm9iamVjdF9pZCBGUk9NIHskUH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgSk9JTiB7JFB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgV0hFUkUgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JyBBTkQgdHQudGVybV9pZCBJTiAoJGluKSIpKSk7CiAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbC5vcmRlcl9pZCwgbC5wcm9kdWN0X2lkLCBsLnZhcmlhdGlvbl9pZCwgbC5wcm9kdWN0X3F0eSBxLCBsLnByb2R1Y3RfbmV0X3JldmVudWUgcmV2LCBsLmRhdGVfY3JlYXRlZCBkIEZST00geyRQfXdjX29yZGVyX3Byb2R1Y3RfbG9va3VwIGwgSk9JTiB7JFB9d2Nfb3JkZXJzIG8gT04gby5pZD1sLm9yZGVyX2lkIFdIRVJFIG8uc3RhdHVzIElOKCd3Yy1jb21wbGV0ZWQnLCd3Yy1wcm9jZXNzaW5nJywnd2Mtb24taG9sZCcpIixBUlJBWV9BKTsKICAkYnc9W107ICRiYz1bXTsKICBmb3JlYWNoKCRyb3dzIGFzICR4KXsgJHBpZD0oaW50KSR4Wydwcm9kdWN0X2lkJ107IGlmKCFpc3NldCgkZHJ5WyRwaWRdKSkgY29udGludWU7ICRrPShpbnQpJHhbJ3ZhcmlhdGlvbl9pZCddPzokcGlkOyAkdz0oZmxvYXQpZ2V0X3Bvc3RfbWV0YSgkaywnX3dlaWdodCcsdHJ1ZSk7IGlmKCR3PDcpIGNvbnRpbnVlOwogICAgJHk9KG5ldyBEYXRlVGltZSgkeFsnZCddKSktPmZvcm1hdCgnby1cV1cnKTsgJGI9aW1wbG9kZSgnLCcsd3BfZ2V0X3Bvc3RfdGVybXMoJHBpZCwncHJvZHVjdF9icmFuZCcsWydmaWVsZHMnPT4nbmFtZXMnXSkpPzonPyc7ICRid1skYl1bJHldPSgkYndbJGJdWyR5XT8/MCkrKGludCkkeFsncSddOyB9CiAgZm9yZWFjaCgkYncgYXMgJGI9PiYkYSkga3NvcnQoJGEpOyB1bnNldCgkYSk7ICRyWydicmFuZF93ayddPSRidzsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0VSUiddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgJHJbJ3RydWttZV9zJ109cm91bmQobWljcm90aW1lKHRydWUpLSRUMCwxKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsgfSk7Cg==';
const VER='dep-083817';
const GKEY='ps_s1876b';
const PHASES=["1"];
const OUT='analize/s1876_b.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
