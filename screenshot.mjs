process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTMgcnVuIGUyciDigJQgUjogNCBldGFwbyAjMiBMUCByZWNvbiAyICh0aWsgc2thaXR5bWFzKTogdXBkYXRlX3RyYWNraW5nX3N0YXR1cyBwaWxuYXMga29kYXMsIExwT3JkZXJTdGF0dXMga2xhc8SXLCBwbHVnaW5vIGxlbnRlbMSXcywgIzM1NDE2IGLFq2tsxJcsIGlzX3NoaXBwaW5nX21ldGhvZF9zdXBwb3J0ZWQgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfZTJyJ10pKSByZXR1cm47CiAgJGY9c3RydG91cHBlcihzYW5pdGl6ZV9rZXkoJF9HRVRbJ3BzX2UyciddKSk7ICRvPWFycmF5KCd2Jz0+J1MxNjEzIGUycicsJ2YnPT4kZik7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgc2V0X3RpbWVfbGltaXQoMjgwKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJEo9ZnVuY3Rpb24oJG8peyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7IH07CiAgJHNyYz1mdW5jdGlvbigkY2xzLCRtLCRtYXg9NjAwMCl7IHRyeXsgJHI9bmV3IFJlZmxlY3Rpb25NZXRob2QoJGNscywkbSk7ICRscz1maWxlKCRyLT5nZXRGaWxlTmFtZSgpKTsgJGM9aW1wbG9kZSgnJyxhcnJheV9zbGljZSgkbHMsJHItPmdldFN0YXJ0TGluZSgpLTEsJHItPmdldEVuZExpbmUoKS0kci0+Z2V0U3RhcnRMaW5lKCkrMSkpOyByZXR1cm4gYXJyYXkoJ2YnPT5iYXNlbmFtZSgkci0+Z2V0RmlsZU5hbWUoKSksJ2wnPT4kci0+Z2V0U3RhcnRMaW5lKCkuJy0nLiRyLT5nZXRFbmRMaW5lKCksJ2tvZGFzJz0+bWJfc3Vic3RyKCRjLDAsJG1heCkpOyB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgcmV0dXJuICdFUlIgJy4kZS0+Z2V0TWVzc2FnZSgpOyB9IH07CiAgdHJ5ewogIGlmKCRmPT09J1InKXsKICAgICREPVdQX1BMVUdJTl9ESVIuJy93b28tbGl0aHVhbmlhcG9zdC1tYWluJzsKICAgICRvWyd1cGRhdGVfdHJhY2tpbmdfc3RhdHVzJ109JHNyYygnV29vX0xpdGh1YW5pYXBvc3RfQWRtaW5fT3JkZXJfVHJhY2tpbmcnLCd1cGRhdGVfdHJhY2tpbmdfc3RhdHVzJyw3MDAwKTsKICAgICRvWydnZXRfdHJhY2tpbmdfZXZlbnRzJ109JHNyYygnV29vX0xpdGh1YW5pYXBvc3RfQWRtaW5fT3JkZXJfVHJhY2tpbmcnLCdnZXRfdHJhY2tpbmdfZXZlbnRzJywyNTAwKTsKICAgICRvWydpc19zdXBwb3J0ZWQnXT0kc3JjKCdXb29fTGl0aHVhbmlhcG9zdF9BZG1pbl9PcmRlcl9TZXJ2aWNlJywnaXNfc2hpcHBpbmdfbWV0aG9kX3N1cHBvcnRlZCcsMTIwMCk7CiAgICAkb1snb25fcGFyY2VsX3NhdmUnXT0kc3JjKCdXb29fTGl0aHVhbmlhcG9zdF9BZG1pbl9PcmRlcl9TZXJ2aWNlJywnb25fcGFyY2VsX3NhdmUnLDI1MDApOwogICAgLy8gTHBPcmRlclN0YXR1cyBrbGFzxJcKICAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRELicvYWRtaW4vY2xhc3Mtd29vLWxpdGh1YW5pYXBvc3QtYWRtaW4tb3JkZXItc2VydmljZS5waHAnKTsgJGxzPWV4cGxvZGUoIlxuIiwkYyk7ICRvWydMcE9yZGVyU3RhdHVzJ109aW1wbG9kZSgiXG4iLGFycmF5X3NsaWNlKCRscyw0MCw2NikpOwogICAgLy8gbGVudGVsxJdzCiAgICBmb3JlYWNoKGFycmF5KCd3b29fbGl0aHVhbmlhcG9zdF90cmFja2luZ19zdGF0dXMnLCd3b29fbGl0aHVhbmlhcG9zdF90cmFja2luZ19ldmVudHMnKSBhcyAkdCl7ICR0bj0kd3BkYi0+JHQ/PygkcC4kdCk7ICRvWydsZW50ZWxlcyddWyR0XT1hcnJheSgndmFyZGFzJz0+JHRuLCd5cmEnPT4kd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJHRuJyIpLCdzdHVscGVsaWFpJz0+JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIGAkdG5gIiwwKSwnZWlsdWNpdSc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIGAkdG5gIiksJ3B2eic9PiR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSBgJHRuYCBPUkRFUiBCWSAxIERFU0MgTElNSVQgMyIsQVJSQVlfQSkpOyB9CiAgICAkb1snbHBfb3BjaWpvc190cmFja2luZyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lIG4sIG9wdGlvbl92YWx1ZSB2IEZST00geyRwfW9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnbHBzZXR0aW5nc190cmFja2luZyUnIixBUlJBWV9BKTsKICAgIC8vICMzNTQxNgogICAgJHg9d2NfZ2V0X29yZGVyKDM1NDE2KTsgaWYoJHgpeyAkbT1hcnJheSgpOyBmb3JlYWNoKCR4LT5nZXRfbWV0YV9kYXRhKCkgYXMgJG1kKXsgaWYoc3RycG9zKCRtZC0+a2V5LCdfcHNfJyk9PT0wfHxzdHJwb3MoJG1kLT5rZXksJ193b29fbGl0aCcpPT09MCkgJG1bJG1kLT5rZXldPW1iX3N1YnN0cihpc19zY2FsYXIoJG1kLT52YWx1ZSk/KHN0cmluZykkbWQtPnZhbHVlOndwX2pzb25fZW5jb2RlKCRtZC0+dmFsdWUpLDAsMTQwKTsgfQogICAgICAkaXQ9YXJyYXkoKTsgZm9yZWFjaCgkeC0+Z2V0X2l0ZW1zKCkgYXMgJGlpZD0+JGkpeyAkaXRbJGlpZF09YXJyYXkoJ24nPT5tYl9zdWJzdHIoJGktPmdldF9uYW1lKCksMCw1MCksJ3EnPT4kaS0+Z2V0X3F1YW50aXR5KCksJ3BpZCc9PiRpLT5nZXRfcHJvZHVjdF9pZCgpLCdrZWxpYXMnPT4kaS0+Z2V0X21ldGEoJ19wc19rZWxpYXMnKSwnc3JjJz0+JGktPmdldF9tZXRhKCdfcHNfc291cmNlJyksJ3JlZCc9PiRpLT5nZXRfbWV0YSgnX3BzX2F2X3JlZHVjZWRfcXR5JykpOyB9CiAgICAgICRvWyd1MzU0MTYnXT1hcnJheSgnc3QnPT4keC0+Z2V0X3N0YXR1cygpLCdwYWlkJz0+JHgtPmlzX3BhaWQoKSwnY3VzdCc9PiR4LT5nZXRfY3VzdG9tZXJfaWQoKSwnZW1haWwnPT4keC0+Z2V0X2JpbGxpbmdfZW1haWwoKSwnc2hpcCc9PiR4LT5nZXRfc2hpcHBpbmdfbWV0aG9kKCksJ2NyZWF0ZWQnPT4keC0+Z2V0X2RhdGVfY3JlYXRlZCgpLT5kYXRlKCdZLW0tZCBIOmknKSwnbWV0YSc9PiRtLCdpdGVtcyc9PiRpdCwncmVnJz0+UGV0c2hvcF9TaXVudG9zOjpzYXJhc2FzKDM1NDE2KSwna2wnPT5QZXRzaG9wX0RhcmJhbGF1a2lzOjprbGllbnRvX3NpdW50b3MoJHgpKTsgfQogICAgLy8gNTc4NyBrbGllbnRvIExQIHXFvnNha3ltxbMgbsSXcmE/IHZpc2kgNTc4NyB1xb5zYWt5bWFpICsgbWV0b2RhcwogICAgJG9bJ2s1Nzg3J109YXJyYXkoKTsgZm9yZWFjaCh3Y19nZXRfb3JkZXJzKGFycmF5KCdjdXN0b21lcl9pZCc9PjU3ODcsJ2xpbWl0Jz0+MjAsJ3JldHVybic9PidvYmplY3RzJykpIGFzICR1KXsgJG9bJ2s1Nzg3J11bXT0kdS0+Z2V0X2lkKCkuJyAnLiR1LT5nZXRfc3RhdHVzKCkuJyAnLiR1LT5nZXRfc2hpcHBpbmdfbWV0aG9kKCk7IH0KICAgICRvWydkbF92ZXJzaWphJ109UGV0c2hvcF9EYXJiYWxhdWtpczo6VkVSU0lKQTsgJG9bJ2RsX21kNSddPW1kNV9maWxlKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZGFyYmFsYXVraXMucGhwJyk7ICRvWydrc19tZDUnXT1tZDVfZmlsZShXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWtsaWVudG8tc2l1bnRvcy5waHAnKTsKICAgICRvWydwYXNrdXRpbmlzJ109Z2V0X29wdGlvbigncHNfdmVuaXBha19zZWtpbWFzX3Bhc2t1dGluaXMnKTsKICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgJEooJG8pOwp9LDk5KTsK';
const VER='dep-101143';
const GKEY='ps_e2r';
const PHASES=["R"];
const OUT='analize/s1613_e2_run1r.json';
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
