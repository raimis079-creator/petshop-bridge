process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxOTA3YiBQYXlzZXJhIHRlc3RpbmUgcGFza3lyYSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE5MDdiJ10pKSByZXR1cm47ICRmPSRfR0VUWydwc19zMTkwN2InXTsgJHI9Wyd2Jz0+J2IxJywnZmF6ZSc9PiRmXTsgQHNldF90aW1lX2xpbWl0KDEyMCk7CiAgJEVNPSdwYXlzZXJhLnBhdGlrcmFAZ3l2dW5haS5sdCc7ICRVTj0ncGF5c2VyYS1wYXRpa3JhJzsKICAkUFVCPTw8PEsKLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUFzWU5jSFF1K3diT29IY012bzUvNApTQnFyQ3lTWlgyVU9aYmY5MWlLTnRUOTNRcUhuaVhqNHF1SWhYV0dXWGlzREJXWUVvMFE1NHJxTnpNVmJRN0xtCnlqR0hYVXJidzFyb2pia2tLM28xTDc0VTVyTDZSOUFQSFU5anAzNTNUM3FjMnhHTFBxanBQYXZLZDhYREFJZSsKWmkwOEV6REpBRWlQdWFrb3VmTU1lM1Vmd3dTSVJRb0M0V3J5dTVMUlZjeCtobXQ2QjNwVTZmUW5DNklZUXVuYgpHODVNY1diYzZXVk1QTmsvNkhlMWlId3h6dmhyVzFld0xFVjliUElkUVFZeEJ1eFd4MWVVTFhEaVBTdnZYSDlZCm9iek5Mb2dPS0ZyTk1hbmYyUWZxV2ROUEZQWmRObk5kZWFOVVAydVM2Tm01bnBadEN4TFJidHVyamZRMEYxeGEKZlFJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCks7CiAgdHJ5eyBnbG9iYWwgJHdwZGI7ICRUPSR3cGRiLT5wcmVmaXguJ3BzX3N1YnNjcmlwdGlvbnMnOyAkVEk9JHdwZGItPnByZWZpeC4ncHNfc3Vic2NyaXB0aW9uX2l0ZW1zJzsKICAgIGlmKCRmPT09J0dPJyl7CiAgICAgICR1aWQ9ZW1haWxfZXhpc3RzKCRFTSk7ICRuYXVqYXM9ZmFsc2U7CiAgICAgIGlmKCEkdWlkKXsgJHB3PXdwX2dlbmVyYXRlX3Bhc3N3b3JkKDE2LGZhbHNlLGZhbHNlKTsgJHVpZD13cF9jcmVhdGVfdXNlcigkVU4sJHB3LCRFTSk7IGlmKGlzX3dwX2Vycm9yKCR1aWQpKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCR1aWQtPmdldF9lcnJvcl9tZXNzYWdlKCkpOyAkbmF1amFzPXRydWU7CiAgICAgICAgd3BfdXBkYXRlX3VzZXIoWydJRCc9PiR1aWQsJ2ZpcnN0X25hbWUnPT4nUGF5c2VyYScsJ2xhc3RfbmFtZSc9PidQYXRpa3JhJywnZGlzcGxheV9uYW1lJz0+J1BheXNlcmEgUGF0aWtyYScsJ3JvbGUnPT4nY3VzdG9tZXInXSk7CiAgICAgICAgb3BlbnNzbF9wdWJsaWNfZW5jcnlwdCgkcHcsJGVuYywkUFVCLE9QRU5TU0xfUEtDUzFfT0FFUF9QQURESU5HKTsgJHJbJ3B3X2VuYyddPWJhc2U2NF9lbmNvZGUoJGVuYyk7IHVuc2V0KCRwdyk7IH0KICAgICAgJHJbJ3VpZCddPShpbnQpJHVpZDsgJHJbJ25hdWphcyddPSRuYXVqYXM7CiAgICAgICR0PWdldF9vcHRpb24oJ3BzX3ByZW51bWVyYXRhX3Rlc3R1b3RvamFpJyxbXSk7IGlmKCFpc19hcnJheSgkdCkpICR0PVtdOyBpZighaW5fYXJyYXkoKGludCkkdWlkLGFycmF5X21hcCgnaW50dmFsJywkdCksdHJ1ZSkpeyAkdFtdPShpbnQpJHVpZDsgdXBkYXRlX29wdGlvbigncHNfcHJlbnVtZXJhdGFfdGVzdHVvdG9qYWknLCR0KTsgfQogICAgICAkclsndGVzdHVvdG9qYWknXT1nZXRfb3B0aW9uKCdwc19wcmVudW1lcmF0YV90ZXN0dW90b2phaScpOwogICAgICAkc3JjPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgKiBGUk9NICRUIFdIRVJFIGlkPTY4IixBUlJBWV9BKTsKICAgICAgZm9yZWFjaChbJ2JpbGxpbmdfZmlyc3RfbmFtZSc9PidQYXlzZXJhJywnYmlsbGluZ19sYXN0X25hbWUnPT4nUGF0aWtyYScsJ2JpbGxpbmdfZW1haWwnPT4kRU0sJ2JpbGxpbmdfY2l0eSc9PidWaWxuaXVzJywnYmlsbGluZ19jb3VudHJ5Jz0+J0xUJ10gYXMgJGs9PiR2KSB1cGRhdGVfdXNlcl9tZXRhKCR1aWQsJGssJHYpOwogICAgICAkeXJhPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCBGUk9NICRUIFdIRVJFIGVtYWlsPSVzIEFORCBzdGF0dXM9J2FjdGl2ZScgTElNSVQgMSIsJEVNKSk7CiAgICAgIGlmKCEkeXJhKXsKICAgICAgICAkaXRzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHByb2R1Y3RfaWQscXR5IEZST00gJFRJIFdIRVJFIHN1YnNjcmlwdGlvbl9pZD02OCIsQVJSQVlfQSk7CiAgICAgICAgJGRsPWpzb25fZGVjb2RlKChzdHJpbmcpJHNyY1snZGVsaXZlcnlfanNvbiddLHRydWUpOwogICAgICAgICRzaWQ9UGV0c2hvcF9QcmVudW1lcmF0YTo6c3VrdXJ0aShbJ2VtYWlsJz0+JEVNLCd1c2VyX2lkJz0+KGludCkkdWlkLCdpdGVtcyc9PiRpdHMsJ2ludGVydmFsX2RheXMnPT4zMCwnbmV4dF9jeWNsZV9kYXRlJz0+JzIwMjctMDItMTUnLCdtb2RlJz0+KCRzcmNbJ21vZGUnXT86J25vdGlmeV9vbmx5JyksJ2RlbGl2ZXJ5Jz0+aXNfYXJyYXkoJGRsKT8kZGw6bnVsbF0pOwogICAgICAgIGlmKGlzX3dwX2Vycm9yKCRzaWQpKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCRzaWQtPmdldF9lcnJvcl9tZXNzYWdlKCkpOyAkeXJhPShpbnQpJHNpZDsgfQogICAgICAkclsnc2lkJ109JHlyYTsgJHJbJ3N1YiddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQsdXNlcl9pZCxlbWFpbCxzdGF0dXMsaW50ZXJ2YWxfZGF5cyxuZXh0X2N5Y2xlX2RhdGUsbW9kZSxwYXltZW50X21ldGhvZCxkZWxpdmVyeV9qc29uIEZST00gJFQgV0hFUkUgaWQ9JWQiLCR5cmEpLEFSUkFZX0EpOwogICAgICAkclsnaXRlbXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwcm9kdWN0X2lkLHF0eSBGUk9NICRUSSBXSEVSRSBzdWJzY3JpcHRpb25faWQ9JWQiLCR5cmEpLEFSUkFZX0EpOwogICAgICAkclsncmV6ZXJ2YXMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH1wc19wcmVuX3JlemVydmFzIFdIRVJFIHN1YnNjcmlwdGlvbl9pZD0lZCIsJHlyYSkpOwogICAgfQogICAgaWYoJGY9PT0nVicpewogICAgICAkdWlkPShpbnQpZW1haWxfZXhpc3RzKCRFTSk7ICRyWyd1aWQnXT0kdWlkOwogICAgICAkZXhwPXRpbWUoKSsyKkhPVVJfSU5fU0VDT05EUzsgJHRvaz1XUF9TZXNzaW9uX1Rva2Vuczo6Z2V0X2luc3RhbmNlKCR1aWQpLT5jcmVhdGUoJGV4cCk7CiAgICAgICRyWydjb29raWVzJ109W1snbmFtZSc9PkxPR0dFRF9JTl9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdsb2dnZWRfaW4nLCR0b2spLCdkb21haW4nPT4ncGV0c2hvcC5sdCddLFsnbmFtZSc9Pidwc19qcycsJ3ZhbHVlJz0+JzEnLCdkb21haW4nPT4ncGV0c2hvcC5sdCddXTsKICAgICAgJHU9Z2V0X3VzZXJkYXRhKCR1aWQpOyAkclsncHdfbnVzdGF0eXRhcyddPSR1JiZzdHJsZW4oJHUtPnVzZXJfcGFzcyk+MjA7CiAgICAgICRoPXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy9wYXNreXJhLz9uYz0nLnRpbWUoKSksWyd0aW1lb3V0Jz0+MjAsJ3NzbHZlcmlmeSc9PmZhbHNlXSk7ICRoYj1pc193cF9lcnJvcigkaCk/Jyc6d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJGgpOyAkclsnbG9naW5fZm9ybWEnXT1bJ3B3X2xhdWthcyc9Pihib29sKXByZWdfbWF0Y2goJy90eXBlPVsiXCddcGFzc3dvcmQvJywkaGIpLCd1c2VybmFtZV9sYXVrYXMnPT4oYm9vbClwcmVnX21hdGNoKCcvbmFtZT1bIlwnXXVzZXJuYW1lLycsJGhiKSwnbGVuJz0+c3RybGVuKCRoYildOwogICAgICAkZXY9ImRvY3VtZW50LmJvZHkuaW5uZXJUZXh0LnNsaWNlKDAsMTUwMCkiOwogICAgICAkclsnc2hvdHMnXT1bWyduJz0+J3MxOTA3X3Bhc2t5cmFfdGVsJywndSc9PmhvbWVfdXJsKCcvcGFza3lyYS9wcmVudW1lcmF0b3MvJyksJ3cnPT4zOTAsJ2gnPT45MDAsJ2Z1bGwnPT4xLCdldmFsJz0+JGV2XSxbJ24nPT4nczE5MDdfcGFza3lyYV9wYycsJ3UnPT5ob21lX3VybCgnL3Bhc2t5cmEvcHJlbnVtZXJhdG9zLz9wPTInKSwndyc9PjEzNjYsJ2gnPT45MDAsJ2Z1bGwnPT4xXV07CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydlcnInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sMSk7Cg==';
const VER='dep-104327';
const GKEY='ps_s1907b';
const PHASES=["V"];
const OUT='analize/s1907_v.json';
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
