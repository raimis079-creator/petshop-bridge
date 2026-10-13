process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzgyZyBHQTQgcHVyY2hhc2UgcGVyIHRyYW5zYWN0aW9uX2lkIChEYXRhIEFQSSwgdGlrIHNrYWl0eW1hcykgwrcgMSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3ODJnJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNTApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTc4MmcnXTsKICB0cnl7CiAgICAkYz1maWxlKCcvaG9tZS9neXZ1bmFpMi9kb21haW5zL3BldHNob3AubHQvcHVibGljX2h0bWwvd3AtY29udGVudC9tdS1wbHVnaW5zL3BldHNob3AtZ2E0LXNlcnZlcmlzLnBocCcpOyAkclsnaGRyJ109YXJyYXlfbWFwKCd0cmltJyxhcnJheV9zbGljZSgkYywyLDE4KSk7CiAgICBmb3JlYWNoKCRjIGFzICRpPT4kbCkgaWYocHJlZ19tYXRjaCgnL2NsaWVudF9pZHxjaWRfaXNfc2xhcHVrb3xfZ2E9fHNlc3Npb25faWR8Y29uc2VudHxub25fcGVyc29uYWxpemVkfHRpbWVzdGFtcF9taWNyb3MvJywkbCkpICRyWydjaWRfbGluZXMnXVtdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMTYwKSk7CiAgICAkcz0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIGlkLG5hbWUsY29kZSBGUk9NIHskUH1zbmlwcGV0cyBXSEVSRSBpZD02MTQiLEFSUkFZX0EpOyAkclsnczYxNCddPVsnbmFtZSc9PiRzWyduYW1lJ10/P251bGwsJ2xpbmVzJz0+W11dOyBpZigkcykgZm9yZWFjaChleHBsb2RlKCJcbiIsJHNbJ2NvZGUnXSkgYXMgJGk9PiRsKSBpZihwcmVnX21hdGNoKCcvcHVyY2hhc2V8dHJhbnNhY3Rpb25faWR8X3NlbnR8Y29uc2VudHxndGFnfGRhdGFMYXllci8nLCRsKSkgJHJbJ3M2MTQnXVsnbGluZXMnXVtdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMTUwKSk7CiAgICAkcmM9bmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9HQTRfU2VydmVyaXMnKTsgJHRtPSRyYy0+Z2V0TWV0aG9kKCd0b2tlbicpOyAkdG0tPnNldEFjY2Vzc2libGUodHJ1ZSk7ICR0b2s9JHRtLT5pbnZva2UobnVsbCk7IGlmKGlzX3dwX2Vycm9yKCR0b2spKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCd0b2tlbjogJy4kdG9rLT5nZXRfZXJyb3JfbWVzc2FnZSgpKTsgaWYoaXNfYXJyYXkoJHRvaykpICR0b2s9JHRva1snYWNjZXNzX3Rva2VuJ10/P3Jlc2V0KCR0b2spOwogICAgJGJvZHk9WydkYXRlUmFuZ2VzJz0+W1snc3RhcnREYXRlJz0+JzE0ZGF5c0FnbycsJ2VuZERhdGUnPT4neWVzdGVyZGF5J11dLCdkaW1lbnNpb25zJz0+W1snbmFtZSc9Pid0cmFuc2FjdGlvbklkJ11dLCdtZXRyaWNzJz0+W1snbmFtZSc9PidldmVudENvdW50J10sWyduYW1lJz0+J3B1cmNoYXNlUmV2ZW51ZSddXSwnZGltZW5zaW9uRmlsdGVyJz0+WydmaWx0ZXInPT5bJ2ZpZWxkTmFtZSc9PidldmVudE5hbWUnLCdzdHJpbmdGaWx0ZXInPT5bJ3ZhbHVlJz0+J3B1cmNoYXNlJ11dXSwnbGltaXQnPT4xMDAwXTsKICAgICRoPXdwX3JlbW90ZV9wb3N0KCdodHRwczovL2FuYWx5dGljc2RhdGEuZ29vZ2xlYXBpcy5jb20vdjFiZXRhL3Byb3BlcnRpZXMvMzQ2MDUxNTgwOnJ1blJlcG9ydCcsWyd0aW1lb3V0Jz0+NDAsJ2hlYWRlcnMnPT5bJ0F1dGhvcml6YXRpb24nPT4nQmVhcmVyICcuJHRvaywnQ29udGVudC1UeXBlJz0+J2FwcGxpY2F0aW9uL2pzb24nXSwnYm9keSc9Pmpzb25fZW5jb2RlKCRib2R5KV0pOwogICAgaWYoaXNfd3BfZXJyb3IoJGgpKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCRoLT5nZXRfZXJyb3JfbWVzc2FnZSgpKTsgJGo9anNvbl9kZWNvZGUod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJGgpLHRydWUpOyBpZihlbXB0eSgkalsncm93cyddKSl7ICRyWydhcGknXT1tYl9zdWJzdHIod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJGgpLDAsNDAwKTsgfQogICAgJGRpc3Q9W107ICRkdXA9W107ICRub3RXb289W107ICR0b3Q9MDsgZm9yZWFjaCgkalsncm93cyddPz9bXSBhcyAkcm93KXsgJHRpZD0kcm93WydkaW1lbnNpb25WYWx1ZXMnXVswXVsndmFsdWUnXTsgJG49KGludCkkcm93WydtZXRyaWNWYWx1ZXMnXVswXVsndmFsdWUnXTsgJHRvdCs9JG47ICRkaXN0WyRuXT0oJGRpc3RbJG5dPz8wKSsxOyBpZigkbj4xKSAkZHVwW109JHRpZC4nw5cnLiRuOyBpZighY3R5cGVfZGlnaXQoJHRpZCl8fCEkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkIEZST00geyRQfXdjX29yZGVycyBXSEVSRSBpZD0lZCIsJHRpZCkpKSAkbm90V29vW109JHRpZDsgfQogICAgJHJbJ2dhNCddPVsndW5pcXVlX3RpZCc9PmNvdW50KCRqWydyb3dzJ10/P1tdKSwnZXZlbnRzJz0+JHRvdCwnZXZlbnRDb3VudF9kaXN0Jz0+JGRpc3QsJ2R1cF90aWRzJz0+YXJyYXlfc2xpY2UoJGR1cCwwLDE1KSwndGlkX25vdF9pbl93b28nPT5hcnJheV9zbGljZSgkbm90V29vLDAsMTUpLCdub3RfaW5fd29vX24nPT5jb3VudCgkbm90V29vKV07CiAgICAkclsnd29vX3BhaWRfMTRkJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXdjX29yZGVycyBXSEVSRSBkYXRlX3BhaWRfZ210Pj1EQVRFX1NVQihVVENfREFURSgpLElOVEVSVkFMIDE0IERBWSkgQU5EIGRhdGVfcGFpZF9nbXQ8VVRDX0RBVEUoKSBBTkQgc3RhdHVzIElOICgnd2MtcHJvY2Vzc2luZycsJ3djLWNvbXBsZXRlZCcpIik7CiAgICAkclsnbXBfMTRkJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXdjX29yZGVyc19tZXRhIFdIRVJFIG1ldGFfa2V5PSdfcHNfZ2E0X21wX2F0JyBBTkQgbWV0YV92YWx1ZT49REFURV9TVUIoVVRDX0RBVEUoKSxJTlRFUlZBTCAxNCBEQVkpIik7CiAgICAkclsnZGxfMTRkJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXdjX29yZGVyc19tZXRhIG0gSk9JTiB7JFB9d2Nfb3JkZXJzIG8gT04gby5pZD1tLm9yZGVyX2lkIFdIRVJFIG0ubWV0YV9rZXk9J19wZXRzaG9wX2RsX3B1cmNoYXNlX3NlbnQnIEFORCBvLmRhdGVfY3JlYXRlZF9nbXQ+PURBVEVfU1VCKFVUQ19EQVRFKCksSU5URVJWQUwgMTQgREFZKSIpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-160242';
const GKEY='ps_s1782g';
const PHASES=["1"];
const OUT='analize/s1782_g.json';
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
