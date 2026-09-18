process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTEgaiDigJQgNTA4IHB1Ymxpa3VvdMWzIOKAnm7El3JhIHNhbmTEl2x5amUiIHByZWtpxbMgcGrFq3ZpcyBwYWdhbCDFoWFsdGluxK8gKHBzX3NvdXJjZXMgLyBfcHNfc2FuZGVsaXMgLyBWRi1aQiBtZXRhKSwgcGFyZGF2aW1haSAzNjUgZC4sIGRyb3BzaGlwIHF0eT0wIGxhaWt5bW8gbG9naWthIHBldHNob3AteG1sLiBSZWFkLW9ubHkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjkxaiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7ICR3cGRiLT5zdXBwcmVzc19lcnJvcnModHJ1ZSk7CiAgJG9bJ3NvdXJjZXNfY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHB9cHNfc291cmNlcyIpOwogICRvWydzb3VyY2VzX3RpcGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc291cmNlLCBDT1VOVCgqKSBuIEZST00geyRwfXBzX3NvdXJjZXMgR1JPVVAgQlkgc291cmNlIixBUlJBWV9BKTsKICAkc3FsPSJTRUxFQ1QgcHMuSUQsIHBzLnBvc3RfdGl0bGUsIHBzLnBvc3RfZGF0ZSwKICAgICAgKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9cHMuSUQgQU5EIG1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIExJTUlUIDEpIHNhbmRlbGlzLAogICAgICAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wcy5JRCBBTkQgbWV0YV9rZXk9J19zdG9jaycgTElNSVQgMSkgc3RvY2ssCiAgICAgIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkPXBzLklEIEFORCBtZXRhX2tleT0nX293bl9zdG9ja19xdHknIExJTUlUIDEpIGF2LAogICAgICAoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wcy5JRCBBTkQgbWV0YV9rZXk9J19tYW5hZ2Vfc3RvY2snIExJTUlUIDEpIG1zLAogICAgICAoU0VMRUNUIENPVU5UKCopIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9cHMuSUQgQU5EIG1ldGFfa2V5PSdfdmZfc3VwcGxpZXJfc2t1JykgdmYsCiAgICAgIChTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1wcy5JRCBBTkQgbWV0YV9rZXkgSU4gKCdfemJfY29zdCcsJ196Yl9za3UnLCdfemJfc3VwcGxpZXJfc2t1JykpIHpiLAogICAgICAoU0VMRUNUIEdST1VQX0NPTkNBVChESVNUSU5DVCBzb3VyY2UpIEZST00geyRwfXBzX3NvdXJjZXMgcyBXSEVSRSBzLnByb2R1Y3RfaWQ9cHMuSUQpIHNyYywKICAgICAgKFNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1wc19pc3RfZmFrdF91enNha3ltYWkgdSBKT0lOIHskcH1wc19pc3RfZmFrdF9laWx1dGVzIGUgT04gZS51enNha3ltb19pZD11LmlkIFdIRVJFIGUud2NfcHJvZHVjdF9pZD1wcy5JRCBBTkQgdS5hcG1va2V0YV9hdD49Tk9XKCktSU5URVJWQUwgMzY1IERBWSkgaXN0MzY1LAogICAgICAoU0VMRUNUIENPVU5UKCopIEZST00geyRwfXdjX29yZGVyX3Byb2R1Y3RfbG9va3VwIGwgSk9JTiB7JHB9d2Nfb3JkZXJzIHdvIE9OIHdvLmlkPWwub3JkZXJfaWQgV0hFUkUgbC5wcm9kdWN0X2lkPXBzLklEIEFORCB3by5zdGF0dXMgSU4gKCd3Yy1wcm9jZXNzaW5nJywnd2MtY29tcGxldGVkJykpIHdjX3V6cwogICAgRlJPTSB7JHB9cG9zdHMgcHMgSk9JTiB7JHB9cG9zdG1ldGEgc3QgT04gc3QucG9zdF9pZD1wcy5JRCBBTkQgc3QubWV0YV9rZXk9J19zdG9ja19zdGF0dXMnIEFORCBzdC5tZXRhX3ZhbHVlPSdvdXRvZnN0b2NrJwogICAgV0hFUkUgcHMucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcHMucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIjsKICAkcj0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHNxbCxBUlJBWV9BKTsgJG9bJ3Zpc28nXT1jb3VudCgkcik7ICRvWydkYl9lcnInXT0kd3BkYi0+bGFzdF9lcnJvcjsKICAkZ3JwPWFycmF5KCk7ICRwdno9YXJyYXkoKTsKICBmb3JlYWNoICgkciBhcyAkeCl7ICRrPSgkeFsndmYnXT8nVkYnOicnKS4oJHhbJ3piJ10/J1pCJzonJykuKCEkeFsndmYnXSYmISR4Wyd6YiddPydiZS14bWwnOicnKS4nIHwgc2FuZGVsaXM9Jy4oJHhbJ3NhbmRlbGlzJ10/OictJykuJyB8IHNyYz0nLigkeFsnc3JjJ10/OictJyk7CiAgICBpZiAoIWlzc2V0KCRncnBbJGtdKSkgJGdycFska109YXJyYXkoJ24nPT4wLCdwYXJkMzY1Jz0+MCwnd2NfdXpzJz0+MCwnYXY+MCc9PjApOyAkZ3JwWyRrXVsnbiddKys7IGlmICgoaW50KSR4Wydpc3QzNjUnXT4wKSAkZ3JwWyRrXVsncGFyZDM2NSddKys7IGlmICgoaW50KSR4Wyd3Y191enMnXT4wKSAkZ3JwWyRrXVsnd2NfdXpzJ10rKzsgaWYgKChpbnQpJHhbJ2F2J10+MCkgJGdycFska11bJ2F2PjAnXSsrOwogICAgaWYgKGNvdW50KCRwdnpbJGtdPz9hcnJheSgpKTwzKSAkcHZ6WyRrXVtdPSR4WydJRCddLicgJy5tYl9zdWJzdHIoJHhbJ3Bvc3RfdGl0bGUnXSwwLDQ1KS4nIHN0b2NrPScuJHhbJ3N0b2NrJ10uJyBhdj0nLiR4WydhdiddLicgbXM9Jy4keFsnbXMnXS4nIGlzdDM2NT0nLiR4Wydpc3QzNjUnXTsKICB9CiAgYXJzb3J0KCRncnApOyAkb1snZ3J1cGVzJ109JGdycDsgJG9bJ3B2eiddPSRwdno7CiAgLy8gcGV0c2hvcC14bWwgbG9naWthOiBxdHk9MCBlc2Ftb3MgcHVibGlzaCBwcmVrxJdzCiAgJGY9V1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL3BldHNob3AteG1sLnBocCc7ICRsPWZpbGUoJGYpOyBmb3JlYWNoICgkbCBhcyAkaT0+JGxuKXsgaWYgKHByZWdfbWF0Y2goJy9xdHlccyo8PVxzKjB8cXR5X3plcm98b3V0b2ZzdG9ja3xidXZ1c2kgcHVibGlzaHxsaWVrYSBtYXRvbWF8MzAgZHxjbGVhbnVwL2knLCRsbikpICRvWyd4bWxfcXR5MCddWyRpKzFdPXRyaW0obWJfc3Vic3RyKCRsbiwwLDE3MCkpOyB9CiAgZm9yZWFjaCAoKGFycmF5KWdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL2luY2x1ZGVzLyoucGhwJykgYXMgJGluYyl7ICRsPWZpbGUoJGluYyk7IGZvcmVhY2ggKCRsIGFzICRpPT4kbG4peyBpZiAocHJlZ19tYXRjaCgnL291dG9mc3RvY2t8cXR5X3plcm98bGlla2EgbWF0b21hfGRyYWZ0LipxdHl8cXR5LipkcmFmdC9pJywkbG4pKSAkb1snaW5jX3F0eTAnXVtiYXNlbmFtZSgkaW5jKV1bJGkrMV09dHJpbShtYl9zdWJzdHIoJGxuLDAsMTcwKSk7IH0gfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-175123';
const GKEY='ps_s1691j';
const PHASES=["1"];
const OUT='analize/s1691_j.json';
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
