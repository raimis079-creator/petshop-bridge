process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzgxbiB1enNha3ltYXMgMTQwNCBzaXVudG9zIG51bWVyaXMg4oCUIGJ1a2xlIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc4MW4nXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDEyMCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzgxbiddOwogICRybT1mdW5jdGlvbigkbil7ICRtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0RhcmJhbGF1a2lzJywkbik7ICRtLT5zZXRBY2Nlc3NpYmxlKHRydWUpOyByZXR1cm4gJG07IH07CiAgdHJ5ewogICAgJG9pZD0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1Qgb3JkZXJfaWQgRlJPTSB7JFB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXk9J19wc19vcmRlcl9udW1iZXInIEFORCBtZXRhX3ZhbHVlPScxNDA0JyBMSU1JVCAxIik7ICRvPXdjX2dldF9vcmRlcigkb2lkKTsgJHJbJ29pZCddPSRvaWQ7CiAgICAkclsndXpzJ109WydzdGF0dXMnPT4kby0+Z2V0X3N0YXR1cygpLCdzdWt1cnRhJz0+JG8tPmdldF9kYXRlX2NyZWF0ZWQoKS0+ZGF0ZSgnWS1tLWQgSDppJyksJ3ByaXN0YXR5bWFzJz0+JG8tPmdldF9zaGlwcGluZ19tZXRob2QoKSwndmFyZGFzJz0+JG8tPmdldF9iaWxsaW5nX2ZpcnN0X25hbWUoKV07CiAgICAkbT1bXTsgZm9yZWFjaCgkby0+Z2V0X21ldGFfZGF0YSgpIGFzICRtZCl7ICRrPSRtZC0+a2V5OyBpZihwcmVnX21hdGNoKCcvXl9wc18obWlzcnVzfHJ1c2l1b3RhfGRyb3BzaGlwfHNpdW50fGdyb3Vwc3xvcmRlcl90eXBlfHNoaXBtZW50c3xkYWx5c3x2ZW5pcGFrfG9yZGVyX3NoaXBwZWR8aXNzaXVzdHx6Yil8dmVuaXBha3x0cmFja2luZ3xzaXVudC9pJywkaykpeyAkdj0kbWQtPnZhbHVlOyAkbVska109aXNfc2NhbGFyKCR2KT9tYl9zdWJzdHIoKHN0cmluZykkdiwwLDcwMCk6bWJfc3Vic3RyKGpzb25fZW5jb2RlKCR2LEpTT05fVU5FU0NBUEVEX1VOSUNPREUpLDAsNzAwKTsgfSB9ICRyWydtZXRhJ109JG07CiAgICBmb3JlYWNoKCRvLT5nZXRfaXRlbXMoKSBhcyAkaWlkPT4kaXQpeyAkclsnZWlsJ11bXT0kaWlkLicgfCAnLm1iX3N1YnN0cigkaXQtPmdldF9uYW1lKCksMCw1MCkuJyDDlycuJGl0LT5nZXRfcXVhbnRpdHkoKS4nIHwgc3JjPScuJGl0LT5nZXRfbWV0YSgnX3BzX3NvdXJjZScpLicga2VsaWFzPScuJGl0LT5nZXRfbWV0YSgnX3BzX2tlbGlhcycpLicgaXNzaXVzdGE9Jy4kaXQtPmdldF9tZXRhKCdfcHNfaXNzaXVzdGEnKTsgfQogICAgZm9yZWFjaCh3Y19nZXRfb3JkZXJfbm90ZXMoWydvcmRlcl9pZCc9PiRvaWQsJ29yZGVyX2J5Jz0+J2RhdGVfY3JlYXRlZCcsJ29yZGVyJz0+J0FTQyddKSBhcyAkbil7IGlmKCFwcmVnX21hdGNoKCcvUGF5c2VyYXxGYWt0YWl8R0E0fFN0b2NrIGhvbGQvdScsJG4tPmNvbnRlbnQpKSAkclsncGFzdGFib3MnXVtdPSRuLT5kYXRlX2NyZWF0ZWQtPmRhdGUoJ20tZCBIOmk6cycpLicgWycuJG4tPmFkZGVkX2J5LiddJy4oJG4tPmN1c3RvbWVyX25vdGU/JyAoS0xJRU5UVUkpJzonJykuJyAnLm1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkbi0+Y29udGVudCksMCwzMDApOyB9CiAgICAkZj0kcm0oJ2Zha3RhaScpLT5pbnZva2UobnVsbCwkbywkcm0oJ3p1cm5hbGFzJyktPmludm9rZShudWxsLFskb2lkXSkpOyAkclsnZiddPVsncnVzJz0+JGZbJ3J1cyddLCdlaWxlcyc9PiRmWydlaWxlcyddLCd0aWVzaWFpJz0+JGZbJ3RpZXNpYWknXSwna2wnPT4kZlsna2wnXSwnZGFseXMnPT4kZlsnZGFseXMnXSwndGFrZWxpcyc9PmFycmF5X21hcChmbigkdCk9PiR0WzFdLicgWycuJHRbMl0uJ10nLCRmWyd0YWtlbGlzJ10pXTsKICAgICRyWydzaXVudHVfcmVnaXN0cmFzJ109Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX1NpdW50b3MnKT9QZXRzaG9wX1NpdW50b3M6OnNhcmFzYXMoJG9pZCk6bnVsbDsKICAgICRyWydrbGllbnRvX3NpdW50b3MnXT1QZXRzaG9wX0RhcmJhbGF1a2lzOjprbGllbnRvX3NpdW50b3MoJG8pOwogICAgJHJbJ2Zha3Rfc2l1bnRvcyddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkLHNhbmRlbGlzLHZlemVqYXMsc2l1bnRvc19ucixzdGF0dXNhcyxzdWt1cnRhX2F0LHJlZ2lzdHJ1b3RhX2F0LGlzdmV6dGFfYXQgRlJPTSB7JFB9cHNfZmFrdF9zaXVudG9zIFdIRVJFIHV6c2FreW1hc19pZD0lZCIsJG9pZCksQVJSQVlfQSk7CiAgICAkZW09JG8tPmdldF9iaWxsaW5nX2VtYWlsKCk7ICRqb2JzPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkLGZsb3csc3ViamVjdCxzdGF0dXMsc2VudF9hdCxjcmVhdGVkX2F0LHNraXBfcmVhc29uIEZST00geyRQfXBzX2VtYWlsX2pvYnMgV0hFUkUgcmVjaXBpZW50X2VtYWlsPSVzIEFORCBjcmVhdGVkX2F0Pj0lcyBPUkRFUiBCWSBpZCIsJGVtLCcyMDI2LTEwLTEyIDAwOjAwOjAwJyksQVJSQVlfQSk7ICRyWydlbWFpbF9qb2JzJ109JGpvYnM7CiAgICAkclsnaXZ5a2lhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkLGxhaWthcyxzcml0aXMsdmVpa3NtYXMscmV6dWx0YXRhcyxrYXNfdmFyZGFzLExFRlQocGFzdGFiYSwxNjApIHBhc3RhYmEsTEVGVChwbywzMDApIHBvIEZST00geyRQfXBzX3V6c2FreW11X2l2eWtpYWkgV0hFUkUgdXpzYWt5bWFzPSVkIE9SREVSIEJZIGlkIiwkb2lkKSxBUlJBWV9BKTsKICAgICRscz1maWxlKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZGFyYmFsYXVraXMucGhwJyk7ICRoPVtdOyBmb3JlYWNoKCRscyBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcvZnVuY3Rpb24gKGlzc2l1c3RhfHNpdW50b3NfbGFpc2thc3xzZWtpbW9fdXJsfHNpdW50b3NfbnJfa2Vpc3RpfG51bWVyaSl8cHNfZGxfbnJ8bnJfa2Vpc3RpfFNpdW50b3MgbnVtZXIvdScsJGwpKSAkaFtdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMzAwKSk7IH0gJHJbJ2RsX2dyZXAnXT1hcnJheV9zbGljZSgkaCwwLDI1KTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-155432';
const GKEY='ps_s1781n';
const PHASES=["1"];
const OUT='analize/s1781_n.json';
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
