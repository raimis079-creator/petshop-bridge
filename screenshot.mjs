process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjY4IGNtcGx6IHp2YWxneWJhICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfYmtEJ10pPyRfR0VUWydwc19ia0QnXTonJykhPT0nUicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjY4UicsJ3dwJz0+Y3VycmVudF90aW1lKCdteXNxbCcpKTsKICBnbG9iYWwgJHdwZGI7CiAgdHJ5ewogICAgLy8gUGx1Z2luIHZlcnNpamEKICAgIGlmKCFmdW5jdGlvbl9leGlzdHMoJ2dldF9wbHVnaW5zJykpIHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy9wbHVnaW4ucGhwJzsKICAgIGZvcmVhY2goZ2V0X3BsdWdpbnMoKSBhcyAkc2w9PiRwKXsgaWYoc3RyaXBvcygkc2wsJ2NvbXBsaWFueicpIT09ZmFsc2UpICRvWydwbHVnaW5hcyddWyRzbF09YXJyYXkoJHBbJ1ZlcnNpb24nXSxpc19wbHVnaW5fYWN0aXZlKCRzbCk/J2FrdHl2dXMnOiduZWFrdHl2dXMnKTsgfQogICAgaWYoZGVmaW5lZCgnY21wbHpfdmVyc2lvbicpKSAkb1snY21wbHpfdmVyc2lvbiddPWNtcGx6X3ZlcnNpb247CiAgICAvLyBLbGFzxJdzCiAgICAkdmlzPWdldF9kZWNsYXJlZF9jbGFzc2VzKCk7ICRyYXN0PWFycmF5KCk7CiAgICBmb3JlYWNoKCR2aXMgYXMgJGMpeyBpZihzdHJpcG9zKCRjLCdjbXBseicpIT09ZmFsc2V8fHN0cmlwb3MoJGMsJ2NvbXBsaWFueicpIT09ZmFsc2UpICRyYXN0W109JGM7IH0KICAgICRvWydrbGFzZXMnXT0kcmFzdDsKICAgIGZvcmVhY2goJHJhc3QgYXMgJGMpeyAkbT1nZXRfY2xhc3NfbWV0aG9kcygkYyk7CiAgICAgICRzdj1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKCRtLGZ1bmN0aW9uKCR4KXtyZXR1cm4gcHJlZ19tYXRjaCgnL3NjYW58c3luY3xjb29raWVkYXRhYmFzZXxjb29raWVfYWRtaW58ZGV0ZWN0fHJ1bi9pJywkeCk7fSkpOwogICAgICBpZigkc3YpICRvWydtZXRvZGFpJ11bJGNdPSRzdjsgfQogICAgLy8gQ09NUExJQU5aIHNpbmdsZXRvbiBzYXZ5YsSXcwogICAgaWYoY2xhc3NfZXhpc3RzKCdDT01QTElBTlonKSl7ICRpPUNPTVBMSUFOWjo6aW5zdGFuY2UoKTsKICAgICAgZm9yZWFjaChnZXRfb2JqZWN0X3ZhcnMoJGkpIGFzICRrPT4kdikgJG9bJ0NPTVBMSUFOWl9zYXZ5YmVzJ11bJGtdPWlzX29iamVjdCgkdik/Z2V0X2NsYXNzKCR2KTpnZXR0eXBlKCR2KTsKICAgICAgJG9bJ0NPTVBMSUFOWl9zdGF0aWMnXT1hcnJheV9rZXlzKGdldF9jbGFzc192YXJzKCdDT01QTElBTlonKSk7IH0KICAgIC8vIEZ1bmtjaWpvcwogICAgJGZuPWFycmF5KCk7IGZvcmVhY2goZ2V0X2RlZmluZWRfZnVuY3Rpb25zKClbJ3VzZXInXSBhcyAkZil7IGlmKHByZWdfbWF0Y2goJy9eY21wbHpfLiooc2NhbnxzeW5jfGNvb2tpZSkvaScsJGYpKSAkZm5bXT0kZjsgfQogICAgJG9bJ2Z1bmtjaWpvcyddPWFycmF5X3NsaWNlKCRmbiwwLDQwKTsKICAgIC8vIENyb24ga2FibGlhaQogICAgJGNyPV9nZXRfY3Jvbl9hcnJheSgpOyAkYzI9YXJyYXkoKTsKICAgIGZvcmVhY2goJGNyIGFzICR0cz0+JGhzKSBmb3JlYWNoKCRocyBhcyAkaD0+JHgpIGlmKHN0cmlwb3MoJGgsJ2NtcGx6JykhPT1mYWxzZSkgJGMyWyRoXT1kYXRlKCdtLWQgSDppJywkdHMpOwogICAgJG9bJ2NtcGx6X2Nyb24nXT0kYzI7CiAgICBnbG9iYWwgJHdwX2ZpbHRlcjsgJGtiPWFycmF5KCk7CiAgICBmb3JlYWNoKCR3cF9maWx0ZXIgYXMgJGs9PiR2KSBpZihzdHJpcG9zKCRrLCdjbXBseicpIT09ZmFsc2UgJiYgcHJlZ19tYXRjaCgnL3NjYW58c3luY3xkYXl8aG91ci9pJywkaykpICRrYltdPSRrOwogICAgJG9bJ2NtcGx6X2thYmxpYWknXT0ka2I7CiAgICAvLyBFc2FtYSBidXNlbmEKICAgIGZvcmVhY2goYXJyYXkoJ2NtcGx6X2RldGVjdGVkX2Nvb2tpZXMnLCdjbXBsel9zeW5jX2Nvb2tpZXNfY29tcGxldGUnLCdjbXBsel9zY2FuX3N0YXR1cycsJ2NtcGx6X3NjYW5fcHJvZ3Jlc3MnLCdjbXBsel9wcm9jZXNzZWRfcGFnZXNfbGlzdCcsJ2NtcGx6X3BhZ2VzX2xpc3QnLCdjbXBsel9jb29raWVkYXRhYmFzZV9yZXF1ZXN0X2ZhaWxlZCcsJ2NtcGx6X2Nvb2tpZV9kYXRhX3ZlcmlmaWVkX2RhdGUnLCdjbXBsel9nZW5lcmF0ZV9uZXdfY29va2llcG9saWN5X3NuYXBzaG90JywnY21wbHpfY2hhbmdlZF9jb29raWVzJykgYXMgJGspeyAkdj1nZXRfb3B0aW9uKCRrKTsgJG9bJ2J1c2VuYSddWyRrXT1pc19zY2FsYXIoJHYpPyR2Oihpc19hcnJheSgkdik/KCdtYXN5dmFzICcuY291bnQoJHYpKTonZmFsc2UvbmVyYScpOyB9CiAgICAkY289Z2V0X29wdGlvbignY21wbHpfb3B0aW9ucycpOwogICAgaWYoaXNfYXJyYXkoJGNvKSkgZm9yZWFjaChhcnJheSgnY29va2llX3NjYW4nLCd1c2VfY2RiX2FwaScsJ3VzZXNfdGhpcmRwYXJ0eV9zZXJ2aWNlcycsJ3RoaXJkcGFydHlfc2VydmljZXNfb25fc2l0ZScsJ3dzY19zY2FuX3Bvc3RfdHlwZXMnLCdjb25zZW50X3Blcl9zZXJ2aWNlJywnZ3RtX2NvZGUnLCd1YV9jb2RlJywnYXdfY29kZScpIGFzICRrKSAkb1snbnVzdGF0eW1haSddWyRrXT1pc3NldCgkY29bJGtdKT8oaXNfYXJyYXkoJGNvWyRrXSk/aW1wbG9kZSgnLCcsYXJyYXlfc2xpY2UoJGNvWyRrXSwwLDYpKTokY29bJGtdKTonbmVyYSc7CiAgICAvLyBMZW50ZWxpdSBzdHJ1a3R1cmEKICAgIGZvcmVhY2goYXJyYXkoJ2NtcGx6X2Nvb2tpZXMnLCdjbXBsel9zZXJ2aWNlcycpIGFzICR0KXsgJHR0PSR3cGRiLT5wcmVmaXguJHQ7ICRvWydzdHJ1a3R1cmEnXVskdF09JHdwZGItPmdldF9jb2woIkRFU0MgYCR0dGAiLDApOyB9CiAgICAkb1snY29va2llc192aXNpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQsbmFtZSxsYW5ndWFnZSxzZXJ2aWNlLHN5bmMsc2hvd09uUG9saWN5LGxhc3RVcGRhdGVkRGF0ZSBGUk9NIHskd3BkYi0+cHJlZml4fWNtcGx6X2Nvb2tpZXMiLEFSUkFZX0EpOwogICAgLy8gS29raW9zIGthbGJvcyBudW1hdHl0b3MKICAgICRvWydsb2NhbGUnXT1nZXRfbG9jYWxlKCk7CiAgICAkb1snY21wbHpfc3VwcG9ydGVkX2xhbmdzJ109ZnVuY3Rpb25fZXhpc3RzKCdjbXBsel9nZXRfc3VwcG9ydGVkX2xhbmd1YWdlcycpP2NtcGx6X2dldF9zdXBwb3J0ZWRfbGFuZ3VhZ2VzKCk6J25lcmEgZm4nOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-070726';
const GKEY='ps_bkD';
const PHASES=["R"];
const OUT='analize/s1668_r.json';
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
