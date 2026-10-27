process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA0ZCBaQiBpbXBvcnRvICMzIHN1c2llamltYWkgaXIga29kYXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODA0ZCddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTUwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4MDRkJ107CiAgdHJ5ewogICAgJG89bWF5YmVfdW5zZXJpYWxpemUoJHdwZGItPmdldF92YXIoIlNFTEVDVCBvcHRpb25zIEZST00geyRQfXBteGlfaW1wb3J0cyBXSEVSRSBpZD0zIikpOyAkaz1bXTsKICAgIGZvcmVhY2goKGFycmF5KSRvIGFzICRraz0+JHZ2KXsgaWYocHJlZ19tYXRjaCgnL3N0b2NrfGN1c3RvbXxjZnx1cGRhdGV8aXNffHF0eXx1bmlxdWV8eHBhdGh8cm9vdHxzaW5nbGVfcHJvZHVjdF9zdG9ja3xmaWVsZC9pJywka2spKSAka1ska2tdPWlzX3NjYWxhcigkdnYpP21iX3N1YnN0cigoc3RyaW5nKSR2diwwLDMwMCk6bWJfc3Vic3RyKGpzb25fZW5jb2RlKCR2dixKU09OX1VORVNDQVBFRF9VTklDT0RFKSwwLDYwMCk7IH0KICAgICRyWydpbXAzJ109JGs7CiAgICAkaGl0cz1bXTsgJGZpbGVzPWFycmF5X21lcmdlKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLSovKi5waHAnKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLSovaW5jbHVkZXMvKi5waHAnKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLSovKi8qLnBocCcpKTsKICAgIGZvcmVhY2goJGZpbGVzIGFzICRmKXsgZm9yZWFjaChmaWxlKCRmKSBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvcG14aV98X3piX3F0eXxpbXBvcnRfaWQuezAsOH0zXGIvJywkbCkpICRoaXRzW109c3RyX3JlcGxhY2UoW1dQTVVfUExVR0lOX0RJUixXUF9QTFVHSU5fRElSXSxbJ211JywncGwnXSwkZikuJzonLigkaSsxKS4nICcudHJpbShtYl9zdWJzdHIoJGwsMCwyMDApKTsgfSB9ICRyWydrb2RhcyddPWFycmF5X3NsaWNlKCRoaXRzLDAsODApOwogICAgJHNuPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUgRlJPTSB7JFB9c25pcHBldHMgV0hFUkUgYWN0aXZlPTEgQU5EIChjb2RlIExJS0UgJyVwbXhpXyUnIE9SIGNvZGUgTElLRSAnJV96Yl9xdHklJykiLEFSUkFZX0EpOyAkclsnc25pcHBldHMnXT0kc247CiAgICBmb3JlYWNoKCRzbiBhcyAkcyl7ICRjPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgY29kZSBGUk9NIHskUH1zbmlwcGV0cyBXSEVSRSBpZD0lZCIsJHNbJ2lkJ10pKTsgZm9yZWFjaChleHBsb2RlKCJcbiIsJGMpIGFzICRpPT4kbCl7IGlmKHByZWdfbWF0Y2goJy9wbXhpX3xfemJfcXR5LycsJGwpKSAkclsnc25fZWlsJ11bXT0kc1snaWQnXS4nOicuKCRpKzEpLicgJy50cmltKG1iX3N1YnN0cigkbCwwLDIwMCkpOyB9IH0KICAgICRmZT1nZXRfb3B0aW9uKCd3cGFsbGltcG9ydF9mdW5jdGlvbnMnKTsgJHJbJ3dwYWlfZnVuY3Rpb25zX2lsZ2lzJ109JGZlP3N0cmxlbigkZmUpOjA7CiAgICAkdXA9d3BfdXBsb2FkX2RpcigpOyAkZmY9JHVwWydiYXNlZGlyJ10uJy93cGFsbGltcG9ydC9mdW5jdGlvbnMucGhwJzsgaWYoZmlsZV9leGlzdHMoJGZmKSl7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmZik7ICRyWyd3cGFpX2Z1bmN0aW9uc19tZDUnXT1tZDUoJGMpOyAkclsnd3BhaV9mdW5jdGlvbnMnXT1tYl9zdWJzdHIoJGMsMCw2MDAwKTsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlR8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-200513';
const GKEY='ps_s1804d';
const PHASES=["1"];
const OUT='analize/s1804d.json';
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
