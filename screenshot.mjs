process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzA0YyBkdmlndWJvIG51cmFzeW1vIG1hc3RhcyAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX3MxNzA0YyddKT8kX0dFVFsncHNfczE3MDRjJ106JycpOyBpZigkZiE9PScxJyYmJGYhPT0nMicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNzA0YycsJ2ZhemUnPT4kZik7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICAgaWYoJGY9PT0nMScpewogICAgICAvLyB2aXNvcyBlaWx1dGVzIHN1IGFiaWVtIHp5bWVtCiAgICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9pLm9yZGVyX2lkLCBvaS5vcmRlcl9pdGVtX2lkLAogICAgICAgICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfcHJvZHVjdF9pZCcgVEhFTiBtLm1ldGFfdmFsdWUgRU5EKSBwaWQsCiAgICAgICAgICBNQVgoQ0FTRSBXSEVOIG0ubWV0YV9rZXk9J19xdHknIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgcXR5LAogICAgICAgICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfcmVkdWNlZF9zdG9jaycgVEhFTiBtLm1ldGFfdmFsdWUgRU5EKSB3Y19yZWQsCiAgICAgICAgICBNQVgoQ0FTRSBXSEVOIG0ubWV0YV9rZXk9J19wc19hdl9yZWR1Y2VkX3F0eScgVEhFTiBtLm1ldGFfdmFsdWUgRU5EKSBhdl9yZWQKICAgICAgICBGUk9NIHskcH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBvaQogICAgICAgIEpPSU4geyRwfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIG0gT04gbS5vcmRlcl9pdGVtX2lkPW9pLm9yZGVyX2l0ZW1faWQKICAgICAgICBXSEVSRSBvaS5vcmRlcl9pdGVtX3R5cGU9J2xpbmVfaXRlbScKICAgICAgICBHUk9VUCBCWSBvaS5vcmRlcl9pdGVtX2lkCiAgICAgICAgSEFWSU5HIHdjX3JlZCBJUyBOT1QgTlVMTCBBTkQgYXZfcmVkIElTIE5PVCBOVUxMIEFORCBhdl9yZWQ+MAogICAgICAgIE9SREVSIEJZIG9pLm9yZGVyX2lkIERFU0MgTElNSVQgMjAwIixBUlJBWV9BKTsKICAgICAgJG9bJ2R2aWd1Ym9zX2VpbHV0ZXNfbiddPWNvdW50KCRyb3dzKTsKICAgICAgJG9bJ2R2aWd1Ym9zX2VpbHV0ZXMnXT0kcm93czsKICAgICAgLy8gdGlrIFdDIG51cmFzeXRhCiAgICAgICRvWyd0aWtfd2NfbiddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIChTRUxFQ1Qgb2kub3JkZXJfaXRlbV9pZCwKICAgICAgICAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX3JlZHVjZWRfc3RvY2snIFRIRU4gMSBFTkQpIGEsCiAgICAgICAgICBNQVgoQ0FTRSBXSEVOIG0ubWV0YV9rZXk9J19wc19hdl9yZWR1Y2VkX3F0eScgVEhFTiAxIEVORCkgYgogICAgICAgIEZST00geyRwfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1zIG9pIEpPSU4geyRwfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIG0gT04gbS5vcmRlcl9pdGVtX2lkPW9pLm9yZGVyX2l0ZW1faWQKICAgICAgICBXSEVSRSBvaS5vcmRlcl9pdGVtX3R5cGU9J2xpbmVfaXRlbScgR1JPVVAgQlkgb2kub3JkZXJfaXRlbV9pZCBIQVZJTkcgYT0xIEFORCBiIElTIE5VTEwpIHgiKTsKICAgICAgJG9bJ3Rpa19hdl9uJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gKFNFTEVDVCBvaS5vcmRlcl9pdGVtX2lkLAogICAgICAgICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfcmVkdWNlZF9zdG9jaycgVEhFTiAxIEVORCkgYSwKICAgICAgICAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX3BzX2F2X3JlZHVjZWRfcXR5JyBUSEVOIDEgRU5EKSBiCiAgICAgICAgRlJPTSB7JHB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbXMgb2kgSk9JTiB7JHB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgbSBPTiBtLm9yZGVyX2l0ZW1faWQ9b2kub3JkZXJfaXRlbV9pZAogICAgICAgIFdIRVJFIG9pLm9yZGVyX2l0ZW1fdHlwZT0nbGluZV9pdGVtJyBHUk9VUCBCWSBvaS5vcmRlcl9pdGVtX2lkIEhBVklORyBiPTEgQU5EIGEgSVMgTlVMTCkgeCIpOwogICAgfSBlbHNlIHsKICAgICAgLy8gYXYtcmVkdWNlIGtvZGFzICsgY2FuX3JlZHVjZSBmaWx0cmFpCiAgICAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtYXYtcmVkdWNlLnBocCcpOwogICAgICAkb1snYXZfcmVkdWNlX2R5ZGlzJ109c3RybGVuKCRjKTsgJG9bJ2F2X3JlZHVjZV9tZDUnXT1tZDUoJGMpOwogICAgICAkb1snYXZfcmVkdWNlJ109JGM7CiAgICAgIC8vIGthcyBrYWJpbmFzaSBhbnQgY2FuX3JlZHVjZQogICAgICAkZGlyPVdQTVVfUExVR0lOX0RJUjsgJHJhZD1hcnJheSgpOwogICAgICBmb3JlYWNoKHNjYW5kaXIoJGRpcikgYXMgJGZuKXsgaWYoc3Vic3RyKCRmbiwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOyAkY2M9QGZpbGVfZ2V0X2NvbnRlbnRzKCRkaXIuJy8nLiRmbik7IGlmKCRjYz09PWZhbHNlKSBjb250aW51ZTsKICAgICAgICBpZihzdHJwb3MoJGNjLCd3b29jb21tZXJjZV9jYW5fcmVkdWNlX29yZGVyX3N0b2NrJykhPT1mYWxzZSkgJHJhZFtdPSRmbjsgfQogICAgICAkb1snY2FuX3JlZHVjZV9mYWlsYWknXT0kcmFkOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-080407';
const GKEY='ps_s1704c';
const PHASES=["2"];
const OUT='analize/s1704_c2.json';
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
