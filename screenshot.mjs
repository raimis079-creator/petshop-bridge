process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODg3a3Iga3JlcMWhZWxpxbMgcGFzaXNraXJzdHltYXMgaXIgVkYgZGFsaXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODg3a3InXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE1MCk7ICRyPVsndic9PidTMTg4N2tyJ107CiAgdHJ5ewogICRpZHM9d2NfZ2V0X29yZGVycyhbJ2xpbWl0Jz0+LTEsJ3JldHVybic9PidpZHMnLCdzdGF0dXMnPT5bJ2NvbXBsZXRlZCcsJ3Byb2Nlc3NpbmcnXSwnZGF0ZV9jcmVhdGVkJz0+Jz49Jy5kYXRlKCdZLW0tZCcsc3RydG90aW1lKCctOTIgZGF5cycpKV0pOwogICRyWyduJ109Y291bnQoJGlkcyk7ICRCPVtdOyAkTT1bXTsgJHZmPTA7ICR2Zm9ubHk9MDsgJHZmbWl4PTA7ICRzaGlwX3BhaWQ9MDsgJHNoaXBfc3VtPTA7ICRwbT0wOyAkbmVhcj1bXTsKICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJG89d2NfZ2V0X29yZGVyKCRpZCk7IGlmKCEkbykgY29udGludWU7IGlmKCRvLT5nZXRfbWV0YSgnX3BzX3Bha2FydG90aW5pcycpfHwkby0+Z2V0X21ldGEoJ19wc19wYXNsYXVnYScpKSBjb250aW51ZTsKICAgICR0PShmbG9hdCkkby0+Z2V0X3RvdGFsKCk7ICRzaD0oZmxvYXQpJG8tPmdldF9zaGlwcGluZ190b3RhbCgpKyhmbG9hdCkkby0+Z2V0X3NoaXBwaW5nX3RheCgpOyAkcHJlaz0kdC0kc2g7ICRtPSRvLT5nZXRfZGF0ZV9jcmVhdGVkKCktPmRhdGUoJ1ktbScpOwogICAgJHNtPW1iX3N0cnRvbG93ZXIoJG8tPmdldF9zaGlwcGluZ19tZXRob2QoKSk7ICRpc1BtPShzdHJwb3MoJHNtLCdwYcWhdG9tYXQnKSE9PWZhbHNlfHxzdHJwb3MoJHNtLCdwYXN0b21hdCcpIT09ZmFsc2V8fHN0cnBvcygkc20sJ2F0c2nEl21pbW8nKSE9PWZhbHNlKTsKICAgICRnPWpzb25fZGVjb2RlKChzdHJpbmcpJG8tPmdldF9tZXRhKCdfcHNfZ3JvdXBzJyksdHJ1ZSk7ICRoYXNWZj1pc19hcnJheSgkZykmJmlzc2V0KCRnWyd2ZiddKTsgJG5nPWlzX2FycmF5KCRnKT9jb3VudCgkZyk6MDsKICAgICRiPSRwcmVrPDE1PydhIDwxNSc6KCRwcmVrPDIwPydiIDE1LTIwJzooJHByZWs8MjU/J2MgMjAtMjUnOigkcHJlazwzMD8nZCAyNS0zMCc6KCRwcmVrPDMyPydlIDMwLTMyJzooJHByZWs8MzU/J2YgMzItMzUnOigkcHJlazw0MD8nZyAzNS00MCc6KCRwcmVrPDUwPydoIDQwLTUwJzooJHByZWs8NzA/J2kgNTAtNzAnOidqIDcwKycpKSkpKSkpKTsKICAgIGlmKCFpc3NldCgkQlskYl0pKSAkQlskYl09WyduJz0+MCwncG0nPT4wLCd2Zic9PjAsJ3N1bSc9PjAsJ3NoaXAnPT4wXTsgJEJbJGJdWyduJ10rKzsgJEJbJGJdWydzdW0nXSs9JHByZWs7ICRCWyRiXVsnc2hpcCddKz0kc2g7IGlmKCRpc1BtKSAkQlskYl1bJ3BtJ10rKzsgaWYoJGhhc1ZmKSAkQlskYl1bJ3ZmJ10rKzsKICAgIGlmKCFpc3NldCgkTVskbV0pKSAkTVskbV09WyduJz0+MCwndmYnPT4wLCd2Zm9ubHknPT4wLCdwbSc9PjAsJ3NoaXBfcGFpZCc9PjBdOyAkTVskbV1bJ24nXSsrOyBpZigkaGFzVmYpeyAkTVskbV1bJ3ZmJ10rKzsgaWYoJG5nPT09MSkgJE1bJG1dWyd2Zm9ubHknXSsrOyB9IGlmKCRpc1BtKSAkTVskbV1bJ3BtJ10rKzsgaWYoJHNoPjApICRNWyRtXVsnc2hpcF9wYWlkJ10rKzsKICB9CiAga3NvcnQoJEIpOyBrc29ydCgkTSk7IGZvcmVhY2goJEIgYXMgJGs9PiR2KXsgJEJbJGtdWydzdW0nXT1yb3VuZCgkdlsnc3VtJ10pOyAkQlska11bJ3NoaXAnXT1yb3VuZCgkdlsnc2hpcCddLDIpOyB9ICRyWydCJ109JEI7ICRyWydNJ109JE07CiAgJHJbJ3NoaXBfY2ZnJ109W107IGZvcmVhY2goV0NfU2hpcHBpbmdfWm9uZXM6OmdldF96b25lcygpIGFzICR6KXsgZm9yZWFjaCgkelsnc2hpcHBpbmdfbWV0aG9kcyddIGFzICRzbSl7ICRyWydzaGlwX2NmZyddW109WyR6Wyd6b25lX25hbWUnXSwkc20tPmlkLCRzbS0+Z2V0X3RpdGxlKCksJHNtLT5lbmFibGVkLCRzbS0+Z2V0X29wdGlvbignY29zdCcpLCRzbS0+Z2V0X29wdGlvbignbWluX2Ftb3VudCcpLCRzbS0+Z2V0X29wdGlvbigncmVxdWlyZXMnKV07IH0gfQogIGdsb2JhbCAkd3BkYjsgJHJbJ29wdHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSwgTEVGVChvcHRpb25fdmFsdWUsMjAwKSB2IEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdwc18lbmVtb2thbSUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzXyVmcmVlX3NoaXAlJyBPUiBvcHRpb25fbmFtZSBMSUtFICdwc18lcHJpc3RhdHltJXJpYmElJyIsQVJSQVlfQSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsgfSk7Cg==';
const VER='dep-161424';
const GKEY='ps_s1887kr';
const PHASES=["1"];
const OUT='analize/s1887_kr.json';
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
