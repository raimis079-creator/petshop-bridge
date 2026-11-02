process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODE5YSBNbk0gYsWra2zElyArIFpCIHNtdWxrbcSXcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX3MxODE5YSddKT8kX0dFVFsncHNfczE4MTlhJ106JycpOyBpZigkZiE9PSdHTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxODE5YScpOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICAgICRvWydwbHVnaW5zJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigoYXJyYXkpZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKSxmdW5jdGlvbigkeCl7cmV0dXJuIHByZWdfbWF0Y2goJy9taXh8bWF0Y2h8YnVuZGxlfGNvbXBvc2l0ZXxyaW5raW4vaScsJHgpO30pKTsKICAgICRvWyd0eXBlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHQubmFtZSB0eXBlLCBwLnBvc3Rfc3RhdHVzIHN0LCBDT1VOVCgqKSBuIEZST00geyRwfXBvc3RzIHAgSk9JTiB7JHB9dGVybV9yZWxhdGlvbnNoaXBzIHRyIE9OIHRyLm9iamVjdF9pZD1wLklEIEpPSU4geyRwfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teT0ncHJvZHVjdF90eXBlJyBKT0lOIHskcH10ZXJtcyB0IE9OIHQudGVybV9pZD10dC50ZXJtX2lkIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBHUk9VUCBCWSB0Lm5hbWUsIHAucG9zdF9zdGF0dXMiLEFSUkFZX0EpOwogICAgLy8gTW5NIHByb2R1a3RhaSBpciBqxbMga29tcG9uZW50xbMgc2FuZMSXbGlhaQogICAgJG1ubT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHAuSUQgRlJPTSB7JHB9cG9zdHMgcCBKT0lOIHskcH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgT04gdHIub2JqZWN0X2lkPXAuSUQgSk9JTiB7JHB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgQU5EIHR0LnRheG9ub215PSdwcm9kdWN0X3R5cGUnIEpPSU4geyRwfXRlcm1zIHQgT04gdC50ZXJtX2lkPXR0LnRlcm1faWQgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCB0LnNsdWc9J21peC1hbmQtbWF0Y2gnIik7CiAgICAkb1snbW5tJ109YXJyYXkoKTsKICAgIGZvcmVhY2goJG1ubSBhcyAkaWQpeyAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoISRwcikgY29udGludWU7ICRjb21wPWFycmF5KCk7CiAgICAgIGlmKG1ldGhvZF9leGlzdHMoJHByLCdnZXRfY2hpbGRfaXRlbXMnKSl7IGZvcmVhY2goJHByLT5nZXRfY2hpbGRfaXRlbXMoKSBhcyAkY2kpeyAkY2lkPSRjaS0+Z2V0X3Byb2R1Y3RfaWQoKTsgJGNvbXBbXT0oaW50KSRjaWQ7IH0gfQogICAgICBlbHNlaWYobWV0aG9kX2V4aXN0cygkcHIsJ2dldF9jaGlsZHJlbicpKSAkY29tcD0kcHItPmdldF9jaGlsZHJlbigpOwogICAgICAkc2FuZD1hcnJheSgpOyBmb3JlYWNoKCRjb21wIGFzICRjKXsgJHM9Z2V0X3Bvc3RfbWV0YSgkYywnX3BzX3NhbmRlbGlzJyx0cnVlKT86Jz8nOyAkc2FuZFskc109KCRzYW5kWyRzXT8/MCkrMTsgfQogICAgICAkb1snbW5tJ11bXT1hcnJheSgnaWQnPT4kaWQsJ3QnPT4kcHItPmdldF9uYW1lKCksJ3N0Jz0+JHByLT5nZXRfc3RhdHVzKCksJ3ByaWNlJz0+JHByLT5nZXRfcHJpY2UoKSwnbl9jb21wJz0+Y291bnQoJGNvbXApLCdzYW5kJz0+JHNhbmQsJ21pbic9PmdldF9wb3N0X21ldGEoJGlkLCdfbW5tX21pbl9jb250YWluZXJfc2l6ZScsdHJ1ZSksJ21heCc9PmdldF9wb3N0X21ldGEoJGlkLCdfbW5tX21heF9jb250YWluZXJfc2l6ZScsdHJ1ZSksJ3ByaWNpbmcnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX21ubV9wZXJfcHJvZHVjdF9wcmljaW5nJyx0cnVlKSk7CiAgICB9CiAgICAvLyBaQiBzbXVsa23El3M6IHB1Ymxpc2gsIGthaW5hIDwgNiDigqwsIHBhZ2FsIGthdGVnb3JpasSFCiAgICAkb1snemJfY2hlYXAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0Y2F0Lm5hbWUgY2F0LCBDT1VOVCgqKSBuLCBST1VORChBVkcoQ0FTVChwbS5tZXRhX3ZhbHVlIEFTIERFQ0lNQUwoMTAsMikpKSwyKSBhdmdfcHJpY2UsIFNVTShwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJykgcHViCiAgICAgIEZST00geyRwfXBvc3RzIHAgSk9JTiB7JHB9cG9zdG1ldGEgcyBPTiBzLnBvc3RfaWQ9cC5JRCBBTkQgcy5tZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBBTkQgcy5tZXRhX3ZhbHVlPSd6YicKICAgICAgSk9JTiB7JHB9cG9zdG1ldGEgcG0gT04gcG0ucG9zdF9pZD1wLklEIEFORCBwbS5tZXRhX2tleT0nX3ByaWNlJwogICAgICBMRUZUIEpPSU4geyRwfXRlcm1fcmVsYXRpb25zaGlwcyB0ciBPTiB0ci5vYmplY3RfaWQ9cC5JRCBKT0lOIHskcH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBBTkQgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JyBKT0lOIHskcH10ZXJtcyB0Y2F0IE9OIHRjYXQudGVybV9pZD10dC50ZXJtX2lkCiAgICAgIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cyBJTiAoJ3B1Ymxpc2gnLCdkcmFmdCcpIEFORCBDQVNUKHBtLm1ldGFfdmFsdWUgQVMgREVDSU1BTCgxMCwyKSk8NiBBTkQgQ0FTVChwbS5tZXRhX3ZhbHVlIEFTIERFQ0lNQUwoMTAsMikpPjAKICAgICAgR1JPVVAgQlkgdGNhdC5uYW1lIE9SREVSIEJZIG4gREVTQyBMSU1JVCAzMCIsQVJSQVlfQSk7CiAgICAkb1snemJfY2hlYXBfdG90YWwnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIENPVU5UKCopIG4sIFNVTShwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJykgcHViLCBTVU0ocC5wb3N0X3N0YXR1cz0nZHJhZnQnKSBkciBGUk9NIHskcH1wb3N0cyBwIEpPSU4geyRwfXBvc3RtZXRhIHMgT04gcy5wb3N0X2lkPXAuSUQgQU5EIHMubWV0YV9rZXk9J19wc19zYW5kZWxpcycgQU5EIHMubWV0YV92YWx1ZT0nemInIEpPSU4geyRwfXBvc3RtZXRhIHBtIE9OIHBtLnBvc3RfaWQ9cC5JRCBBTkQgcG0ubWV0YV9rZXk9J19wcmljZScgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzIElOICgncHVibGlzaCcsJ2RyYWZ0JykgQU5EIENBU1QocG0ubWV0YV92YWx1ZSBBUyBERUNJTUFMKDEwLDIpKSBCRVRXRUVOIDAuMDEgQU5EIDUuOTkiLEFSUkFZX0EpOwogICAgLy8gWkIgc211bGttacWzIHBhcmRhdmltYWkgbnVvIG1pZ3JhY2lqb3MKICAgICRvWyd6Yl9jaGVhcF9zYWxlcyddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgZS51enNha3ltYXNfaWQpIHV6cywgU1VNKGUua2lla2lzKSB2bnQgRlJPTSB7JHB9cHNfZmFrdF9laWx1dGVzIGUgV0hFUkUgZS5zYW5kZWxpcz0nemInIEFORCBlLmthaW5hX3ZudF9jdCA8IDQ5NiBBTkQgKGUudGVzdGluaXM9MCBPUiBlLnRlc3RpbmlzIElTIE5VTEwpIixBUlJBWV9BKTsKICAgICRvWyd6Yl9vcmRlcnMnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIENPVU5UKERJU1RJTkNUIHV6c2FreW1hc19pZCkgdXpzLCBTVU0oa2lla2lzKSB2bnQgRlJPTSB7JHB9cHNfZmFrdF9laWx1dGVzIFdIRVJFIHNhbmRlbGlzPSd6YicgQU5EICh0ZXN0aW5pcz0wIE9SIHRlc3RpbmlzIElTIE5VTEwpIixBUlJBWV9BKTsKICAgICRvWydlcnInXT0kd3BkYi0+bGFzdF9lcnJvcjsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-134703';
const GKEY='ps_s1819a';
const PHASES=["GO"];
const OUT='analize/s1819_a.json';
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
