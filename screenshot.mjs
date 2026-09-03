process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MDkgcnVuIGU1ciDigJQgcmVjb24gc2VraW1vIGxhacWha3VpICgjNSkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfZTVyJ10pKSByZXR1cm47CiAgJGY9c3RydG91cHBlcihzYW5pdGl6ZV9rZXkoJF9HRVRbJ3BzX2U1ciddKSk7ICRvPWFycmF5KCd2Jz0+J3J1biBlNXInLCdmJz0+JGYpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDI4MCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRvWydob3N0J109JF9TRVJWRVJbJ0hUVFBfSE9TVCddPz8nJzsgJG9bJ2Rldl9wYXN0YXMnXT1hcnJheSgnbWQ1Jz0+bWQ1X2ZpbGUoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1kZXYtcGFzdGFzLnBocCcpLCdsZWlzdGknPT5nZXRfb3B0aW9uKCdwc19kZXZfcGFzdGFzX2xlaXN0aScpLCd6dXJuYWxhc19uJz0+Y291bnQoKGFycmF5KWdldF9vcHRpb24oJ3BzX2Rldl9wYXN0YXNfenVybmFsYXMnLGFycmF5KCkpKSk7CiAgJHQ9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1zaXVudHUtbGFpc2thaS5waHAnOyAkYz1maWxlX2dldF9jb250ZW50cygkdCk7ICRvWydzbCddPWFycmF5KCdieXRlcyc9PnN0cmxlbigkYyksJ21kNSc9Pm1kNSgkYyksJ2I2NCc9PmJhc2U2NF9lbmNvZGUoJGMpKTsKICAkb1snZGwnXT1hcnJheSgndic9PlBldHNob3BfRGFyYmFsYXVraXM6OlZFUlNJSkEsJ21kNSc9Pm1kNV9maWxlKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZGFyYmFsYXVraXMucGhwJykpOwogIC8vIFZlbmlwYWsgLyBMUCBzZWtpbW8gVVJMCiAgZm9yZWFjaChhcnJheSgndmVuaXBhayc9PldQX1BMVUdJTl9ESVIuJy93Yy12ZW5pcGFrLXNoaXBwaW5nJywnbHAnPT5XUF9QTFVHSU5fRElSLicvd29vLWxpdGh1YW5pYXBvc3QtbWFpbicpIGFzICRrPT4kZGlyKXsgJG9bJ3RyYWNrJ11bJGtdPWFycmF5KCk7IGlmKCFpc19kaXIoJGRpcikpeyAkb1sndHJhY2snXVska109J27El3JhICcuJGRpcjsgJG9bJ3BsdWdpbnMnXT1hcnJheV9tYXAoJ2Jhc2VuYW1lJyxnbG9iKFdQX1BMVUdJTl9ESVIuJy8qJyxHTE9CX09OTFlESVIpKTsgY29udGludWU7IH0KICAgICRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGRpcikpOyBmb3JlYWNoKCRpdCBhcyAkZmwpeyBpZihzdWJzdHIoJGZsLC00KSE9PScucGhwJykgY29udGludWU7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmbCk7IGlmKHByZWdfbWF0Y2hfYWxsKCcvaHR0cHM/OlwvXC9bXlxzXCciXSoodHJhY2t8c2VrKVteXHNcJyJdKi9pJywkcywkbSkpeyBmb3JlYWNoKGFycmF5X3VuaXF1ZSgkbVswXSkgYXMgJHUpICRvWyd0cmFjayddWyRrXVtdPXN0cl9yZXBsYWNlKFdQX1BMVUdJTl9ESVIsJycsJGZsKS4nIOKGkiAnLiR1OyB9IH0gJG9bJ3RyYWNrJ11bJGtdPWFycmF5X3NsaWNlKGFycmF5X3VuaXF1ZSgkb1sndHJhY2snXVska10pLDAsMTUpOyB9CiAgLy8gX3BzX3NpdW50b3MgcGF2eXpkxb5pYWkKICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1Qgb3JkZXJfaWQgRlJPTSB7JHB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXk9J19wc19zaXVudG9zJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDQiKTsKICBmb3JlYWNoKCRpZHMgYXMgJG9pZCl7ICRvbz13Y19nZXRfb3JkZXIoJG9pZCk7IGlmKCEkb28pIGNvbnRpbnVlOyAkb1snc2l1bnRvcyddWyRvaWRdPWFycmF5KCdzdCc9PiRvby0+Z2V0X3N0YXR1cygpLCdzaGlwbWVudHMnPT4kb28tPmdldF9tZXRhKCdfcHNfc2hpcG1lbnRzJyksJ3BzX3NpdW50b3MnPT4kb28tPmdldF9tZXRhKCdfcHNfc2l1bnRvcycpLCdkYWx5c19pc3NpdXN0YSc9PiRvby0+Z2V0X21ldGEoJ19wc19kYWx5c19pc3NpdXN0YScpLCdzZWtpbW9fc2l1c3RhJz0+JG9vLT5nZXRfbWV0YSgnX3BzX3Nla2ltb19zaXVzdGEnKSwndmV6Jz0+JG9vLT5nZXRfc2hpcHBpbmdfbWV0aG9kKCksJ3ZlbmlwYWtfcmF3Jz0+bWJfc3Vic3RyKChzdHJpbmcpKGlzX2FycmF5KCRvby0+Z2V0X21ldGEoJ3ZlbmlwYWtfc2hpcHBpbmdfb3JkZXJfZGF0YScpKT9qc29uX2VuY29kZSgkb28tPmdldF9tZXRhKCd2ZW5pcGFrX3NoaXBwaW5nX29yZGVyX2RhdGEnKSk6JG9vLT5nZXRfbWV0YSgndmVuaXBha19zaGlwcGluZ19vcmRlcl9kYXRhJykpLDAsNDAwKSk7IH0KICAkb1snZGFseXNfaXNzX24nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXk9J19wc19kYWx5c19pc3NpdXN0YSciKTsKICAvLyBmYWt0YWkgIzM1NDUwCiAgJHI9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRGFyYmFsYXVraXMnLCdmYWt0YWknKTsgJHItPnNldEFjY2Vzc2libGUodHJ1ZSk7ICR6PW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0RhcmJhbGF1a2lzJywnenVybmFsYXMnKTsgJHotPnNldEFjY2Vzc2libGUodHJ1ZSk7CiAgZm9yZWFjaChhcnJheSgzNTQ1MCkgYXMgJG9pZCl7ICRvbz13Y19nZXRfb3JkZXIoJG9pZCk7IGlmKCEkb28pIGNvbnRpbnVlOyAkZms9JHItPmludm9rZShudWxsLCRvbywkei0+aW52b2tlKG51bGwsYXJyYXkoJG9pZCkpKTsgJGU9YXJyYXkoKTsgZm9yZWFjaCgkZmtbJ2VpbCddIGFzICRsKXsgJGVbXT1hcnJheSgnaWlkJz0+JGxbJ2lpZCddLCdxJz0+JGxbJ3EnXSwnbic9Pm1iX3N1YnN0cigkbFsnbiddLDAsNDApLCdzcmMnPT4kbFsnc3JjJ10sJ2snPT4kbFsnayddLCdnYXV0YSc9PiRsWydnYXV0YSddLCdpbWcnPT4kbFsnaW1nJ10/J3llcyc6JycpOyB9ICRvWydmYWt0YWknXVskb2lkXT1hcnJheSgnc3QnPT4kZmtbJ3N0J10sJ3Zleic9PiRma1sndmV6J10sJ2VpbGVzJz0+JGZrWydlaWxlcyddLCdkYWx5cyc9PiRma1snZGFseXMnXSwndGllc2lhaSc9PiRma1sndGllc2lhaSddLCdlaWwnPT4kZSwnZW1haWwnPT4kb28tPmdldF9iaWxsaW5nX2VtYWlsKCksJ3ZhcmRhcyc9PiRvby0+Z2V0X2JpbGxpbmdfZmlyc3RfbmFtZSgpLCdzaGlwJz0+JG9vLT5nZXRfc2hpcHBpbmdfbWV0aG9kKCksJ3Bhc3RvbWF0YXMnPT4kb28tPmdldF9tZXRhKCdfdmVuaXBha19waWNrdXBfcG9pbnQnKT86JG9vLT5nZXRfbWV0YSgndmVuaXBha19waWNrdXBfcG9pbnQnKT86JycpOyB9CiAgLy8gV0MgZW1haWwgbnVzdGF0eW1haQogICRvWyd3Y19lbWFpbCddPWFycmF5KCdiYXNlJz0+Z2V0X29wdGlvbignd29vY29tbWVyY2VfZW1haWxfYmFzZV9jb2xvcicpLCdiZyc9PmdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2VtYWlsX2JhY2tncm91bmRfY29sb3InKSwnYm9keV9iZyc9PmdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2VtYWlsX2JvZHlfYmFja2dyb3VuZF9jb2xvcicpLCd0ZXh0Jz0+Z2V0X29wdGlvbignd29vY29tbWVyY2VfZW1haWxfdGV4dF9jb2xvcicpLCdoZWFkZXJfaW1nJz0+Z2V0X29wdGlvbignd29vY29tbWVyY2VfZW1haWxfaGVhZGVyX2ltYWdlJyksJ2Zvb3Rlcic9Pm1iX3N1YnN0cigoc3RyaW5nKWdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2VtYWlsX2Zvb3Rlcl90ZXh0JyksMCwxMjApLCdmcm9tJz0+Z2V0X29wdGlvbignd29vY29tbWVyY2VfZW1haWxfZnJvbV9hZGRyZXNzJykpOwogIC8vIGtlbGlvIG1ldGEgcmFrdGFpIHBhcyB2ZW5pcGFrCiAgJG9bJ3ZlbmlwYWtfbWV0YV9rZXlzJ109JHdwZGItPmdldF9jb2woIlNFTEVDVCBESVNUSU5DVCBtZXRhX2tleSBGUk9NIHskcH13Y19vcmRlcnNfbWV0YSBXSEVSRSBtZXRhX2tleSBMSUtFICcldmVuaXBhayUnIE9SIG1ldGFfa2V5IExJS0UgJyVsaXRodWFuaWFwb3N0JScgT1IgbWV0YV9rZXkgTElLRSAnJWxwXyUnIExJTUlUIDMwIik7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-181431';
const GKEY='ps_e5r';
const PHASES=["R"];
const OUT='analize/e5_run1r.json';
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
