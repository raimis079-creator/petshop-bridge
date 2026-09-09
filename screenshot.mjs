process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjcxIGNtcGx6IG9uYm9hcmRpbmcgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9aXNzZXQoJF9HRVRbJ3BzX2JrTSddKT8kX0dFVFsncHNfYmtNJ106Jyc7CiAgaWYoJGYhPT0nQScmJiRmIT09J0InKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTY3MScsJ2ZhemUnPT4kZiwnd3AnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpOwogIHRyeXsKICAgIGlmKCRmPT09J0EnKXsKICAgICAgJG9bJ3ByaWVzJ109Z2V0X29wdGlvbignY21wbHpfd3NjX29uYm9hcmRpbmdfc3RhdHVzJyk7CiAgICAgIC8vIG9uYm9hcmRpbmcga2xhc2UKICAgICAgZm9yZWFjaChnZXRfZGVjbGFyZWRfY2xhc3NlcygpIGFzICRjKXsgaWYoc3RyaXBvcygkYywnb25ib2FyZGluZycpIT09ZmFsc2UpICRvWydvbmJvYXJkaW5nX2tsYXNlcyddW109JGM7IH0KICAgICAgJGRpcj1XUF9QTFVHSU5fRElSLicvY29tcGxpYW56LWdkcHInOwogICAgICAvLyByYXN0aSBvbmJvYXJkaW5nIGZhaWxhCiAgICAgICRyYXN0aT1hcnJheSgpOwogICAgICAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRkaXIsRmlsZXN5c3RlbUl0ZXJhdG9yOjpTS0lQX0RPVFMpKTsKICAgICAgZm9yZWFjaCgkaXQgYXMgJHApeyAkbj0kcC0+Z2V0RmlsZW5hbWUoKTsKICAgICAgICBpZihwcmVnX21hdGNoKCcvb25ib2FyZGluZ3x3c2MvaScsJG4pICYmIHN1YnN0cigkbiwtNCk9PT0nLnBocCcpICRyYXN0aVtdPXN0cl9yZXBsYWNlKCRkaXIsJycsJHAtPmdldFBhdGhuYW1lKCkpOyB9CiAgICAgICRvWydmYWlsYWknXT1hcnJheV9zbGljZSgkcmFzdGksMCwyMCk7CiAgICAgIGZvcmVhY2goJHJhc3RpIGFzICRyZil7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRkaXIuJHJmKTsKICAgICAgICBpZihzdHJpcG9zKCRjLCdvbmJvYXJkaW5nX3N0YXR1cycpIT09ZmFsc2UpewogICAgICAgICAgcHJlZ19tYXRjaF9hbGwoIi9bJ1wiXSh0ZXJtc3xuZXdzbGV0dGVyfHBsdWdpbnN8Y29tcGxldGVkfGRpc21pc3NlZClbJ1wiXS8iLCRjLCRtKTsKICAgICAgICAgICRvWydyYWt0YWknXVskcmZdPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJG1bMV0pKTsKICAgICAgICAgIHByZWdfbWF0Y2hfYWxsKCIvZnVuY3Rpb25ccysoW2EtejAtOV9dKm9uYm9hcmRbYS16MC05X10qKVxzKlwoL2kiLCRjLCRtMik7CiAgICAgICAgICBpZigkbTJbMV0pICRvWydmdW5rY2lqb3MnXVskcmZdPSRtMlsxXTsKICAgICAgICAgIGlmKHByZWdfbWF0Y2goIi8odXBkYXRlX29wdGlvblwoXHMqWydcIl1jbXBsel93c2Nfb25ib2FyZGluZ19zdGF0dXNbJ1wiXS57MCwyMDB9KS9zIiwkYywkbTMpKSAkb1snaXJhc3ltYXMnXVskcmZdPXByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJywkbTNbMV0pOwogICAgICAgIH0gfQogICAgICAvLyBSRVNUIG1hcnNydXRhaQogICAgICBnbG9iYWwgJHdwX3Jlc3Rfc2VydmVyOwogICAgICAkb1sncmVzdF9wYXN0YWJhJ109J1JFU1QgdGlrcmluYW0gYXRza2lyYWknOwogICAgfQogICAgaWYoJGY9PT0nQicpewogICAgICAkc3Q9Z2V0X29wdGlvbignY21wbHpfd3NjX29uYm9hcmRpbmdfc3RhdHVzJyk7CiAgICAgIGlmKCFpc19hcnJheSgkc3QpKSAkc3Q9YXJyYXkoKTsKICAgICAgJG9bJ3ByaWVzJ109JHN0OwogICAgICB1cGRhdGVfb3B0aW9uKCdwc19zMTY3MV9vbmJvYXJkaW5nX2JhaycsJHN0LGZhbHNlKTsKICAgICAgJHN0WydwbHVnaW5zJ109dHJ1ZTsgICAgICAgICAgICAgIC8vIHRpayAibmVzaXVseWsgZGF1Z2lhdSBwbHVnaW51IiDigJQgbmUgdGVpc2luaXMgc3V0aWtpbWFzCiAgICAgICRzdFsnbmV3c2xldHRlciddPWlzc2V0KCRzdFsnbmV3c2xldHRlciddKT8kc3RbJ25ld3NsZXR0ZXInXTp0cnVlOwogICAgICB1cGRhdGVfb3B0aW9uKCdjbXBsel93c2Nfb25ib2FyZGluZ19zdGF0dXMnLCRzdCxmYWxzZSk7CiAgICAgICRvWydwbyddPWdldF9vcHRpb24oJ2NtcGx6X3dzY19vbmJvYXJkaW5nX3N0YXR1cycpOwogICAgICAkb1sndGVybXNfbGlla2EnXT0kb1sncG8nXVsndGVybXMnXT8/bnVsbDsKICAgICAgJG9bJ3dzYyddPWFycmF5KCdzdGF0dXMnPT5nZXRfb3B0aW9uKCdjbXBsel93c2Nfc3RhdHVzJyksJ3NpZ251cCc9PmdldF9vcHRpb24oJ2NtcGx6X3dzY19zaWdudXBfc3RhdHVzJykpOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-073105';
const GKEY='ps_bkM';
const PHASES=["A", "B"];
const OUT='analize/s1671_a.json';
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
