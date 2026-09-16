process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODggaiDigJQgIzEwODEgdmlkaW7ElyBwYXN0YWJhIChpZCBwYWdhbCBudW1lcsSvKSArIHBpbG5hcyBULTAgZmlrdHl2acWzIGxpa3XEjWnFsyBza2VuYXM6IHByZWvEl3Mgc3UgVC0wIHBhcnRpamEgKGxpa28+MCksIGJlIFZGIG1ldGEsIGt1cmnFsyBnYW1pbnRvamFzIHR1cmkgVkYtc3VzaWV0xbMgcHJla2nFsyBhcmJhIFZGIGZlZWQnZSB5cmEgYnJhbmQnYXMuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjg4aiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjg4IGonKTsKICAkaWQ9JHdwZGItPmdldF92YXIoIlNFTEVDVCBvcmRlcl9pZCBGUk9NIHskcH13Y19vcmRlcnNfbWV0YSBXSEVSRSBtZXRhX2tleT0nX3BzX29yZGVyX251bWJlcicgQU5EIG1ldGFfdmFsdWU9JzEwODEnIik7IGlmKCEkaWQpeyBmb3JlYWNoKCR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgaWQgRlJPTSB7JHB9d2Nfb3JkZXJzIFdIRVJFIHR5cGU9J3Nob3Bfb3JkZXInIEFORCBzdGF0dXM9J3djLXByb2Nlc3NpbmcnIikgYXMgJGkpIGlmKHdjX2dldF9vcmRlcigkaSktPmdldF9vcmRlcl9udW1iZXIoKT09JzEwODEnKXsgJGlkPSRpOyBicmVhazsgfSB9CiAgaWYoJGlkKXsgJHc9d2NfZ2V0X29yZGVyKCRpZCk7ICR3LT5hZGRfb3JkZXJfbm90ZSgnUzE2ODg6IHByZWvElyBJTlBTMDYgKEV4Y2x1c2lvbiBJbnRlc3RpbmFsIDcga2cpIE7EllJBIG5laSBBViwgbmVpIFZGIOKAlCBBViBsaWt1dGlzIGJ1dm8gZmlrdHl2dXMgacWhIFQtMCBpbXBvcnRvLiBLbGllbnRlaSByYcWhbyBSYWltaXMgcGF0cy4gTkVTScWyU1RJLicsZmFsc2UsdHJ1ZSk7ICRvWydub3RlJ109JGlkOyB9CiAgJHU9d3BfdXBsb2FkX2RpcigpOyAkeD1zaW1wbGV4bWxfbG9hZF9maWxlKCR1WydiYXNlZGlyJ10uJy9wZXRzaG9wLXZmLWNhY2hlLnhtbCcpOyAkdmZiPWFycmF5KCk7ICR2ZmJjPWFycmF5KCk7ICR2Zm49YXJyYXkoKTsgZm9yZWFjaCgkeC0+cm93IGFzICRpdCl7ICRiPW1iX3N0cnRvdXBwZXIodHJpbSgoc3RyaW5nKSRpdC0+YnJhbmQpKTsgJHZmYlskYl09KCR2ZmJbJGJdPz8wKSsxOyAkYmM9cHJlZ19yZXBsYWNlKCcvXEQvJywnJywoc3RyaW5nKSRpdC0+YmFyY29kZSk7IGlmKCRiYyYmJGJjIT09JzAwMDAwMDAwMDAwMCcpICR2ZmJjWyRiY109KHN0cmluZykkaXQtPnNrdV9pZC4nIHwgJy5tYl9zdWJzdHIoKHN0cmluZykkaXQtPnByb2R1Y3RfbmFtZSwwLDYwKS4nIHwgcXR5ICcuKHN0cmluZykkaXQtPnF0eTsgfQogICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBhLnByb2R1Y3RfaWQgaWQscGEua2lla2lzX2xpa28gbCxwYS5zYXZpa2FpbmFfZXVyIHNhdixwby5wb3N0X3RpdGxlIHQscG8ucG9zdF9zdGF0dXMgc3QsKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9cGEucHJvZHVjdF9pZCBBTkQgbWV0YV9rZXk9J19sZWdhY3lfbWFudWZhY3R1cmVyJykgZ2FtLChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXBhLnByb2R1Y3RfaWQgQU5EIG1ldGFfa2V5PSdfZWFuJykgZWFuLChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXBhLnByb2R1Y3RfaWQgQU5EIG1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnKSBzYW5kIEZST00geyRwfXBzX3BhcnRpam9zIHBhIEpPSU4geyRwfXBvc3RzIHBvIE9OIHBvLklEPXBhLnByb2R1Y3RfaWQgV0hFUkUgcGEucGFzdGFiYSBMSUtFICdQcmFkaW5pcyBsaWt1dGlzIFQtMCUnIEFORCBwYS5hdHNhdWt0YT0wIEFORCBwYS5raWVraXNfbGlrbz4wIEFORCBOT1QgRVhJU1RTIChTRUxFQ1QgMSBGUk9NIHskcH1wb3N0bWV0YSB2IFdIRVJFIHYucG9zdF9pZD1wYS5wcm9kdWN0X2lkIEFORCB2Lm1ldGFfa2V5PSdfdmZfc3VwcGxpZXJfc2t1JykiLEFSUkFZX0EpOwogIGZvcmVhY2goJHJvd3MgYXMgJHIpeyAkZz1tYl9zdHJ0b3VwcGVyKHRyaW0oKHN0cmluZykkclsnZ2FtJ10pKTsgJGU9cHJlZ19yZXBsYWNlKCcvXEQvJywnJywoc3RyaW5nKSRyWydlYW4nXSk7ICRoaXQ9bnVsbDsgaWYoJGUpeyBmb3JlYWNoKGFycmF5KCRlLHN1YnN0cigkZSwwLC0xKSkgYXMgJGspIGlmKGlzc2V0KCR2ZmJjWyRrXSkpeyAkaGl0PSR2ZmJjWyRrXTsgYnJlYWs7IH0gfQogICAgJGJ2PWZhbHNlOyBmb3JlYWNoKCR2ZmIgYXMgJHZiPT4kbil7IGlmKCRnICYmICgkdmI9PT0kZyB8fCBzdHJwb3MoJHZiLCRnKSE9PWZhbHNlIHx8IHN0cnBvcygkZywkdmIpIT09ZmFsc2UpKSB7ICRidj10cnVlOyBicmVhazsgfSB9CiAgICBpZigkaGl0KSAkb1snQV9lYW5fdmYnXVtdPSRyWydpZCddLicgfCAnLm1iX3N1YnN0cigkclsndCddLDAsNTUpLicgfCBsaWtvICcuJHJbJ2wnXS4nIHwgJy4kclsnZ2FtJ10uJyB8IFZGOiAnLiRoaXQ7CiAgICBlbHNlaWYoJGJ2KSAkb1snQl9icmFuZF92ZiddWyRnXVtdPSRyWydpZCddLicgfCAnLm1iX3N1YnN0cigkclsndCddLDAsNTUpLicgfCBsaWtvICcuJHJbJ2wnXS4nIHwgJy5yb3VuZCgkclsnbCddKiRyWydzYXYnXSkuJyDigqwnOyB9CiAgJG9bJ0FfbiddPWNvdW50KCRvWydBX2Vhbl92ZiddPz9hcnJheSgpKTsgJG9bJ0JfbiddPWFycmF5X21hcCgnY291bnQnLCRvWydCX2JyYW5kX3ZmJ10/P2FycmF5KCkpOyAkb1sndmlzb19iZV92ZiddPWNvdW50KCRyb3dzKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-133553';
const GKEY='ps_s1688j';
const PHASES=["A"];
const OUT='analize/s1688_j.json';
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
