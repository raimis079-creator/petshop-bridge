process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjcxIFZGIHNla2ltbyByZWNvbiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZiA9IGlzc2V0KCRfR0VUWydwc19zMTY3MXInXSkgPyAkX0dFVFsncHNfczE2NzFyJ10gOiAnJzsgaWYgKCRmICE9PSAnUicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvID0gYXJyYXkoJ3YnPT4nUzE2NzFyJyk7CiAgdHJ5IHsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICAgICRvWydjcm9uX25leHQnXSA9IHdwX25leHRfc2NoZWR1bGVkKCdwc192ZW5pcGFrX3Nla2ltYXMnKSA/IGdtZGF0ZSgnWS1tLWQgSDppOnMnLCB3cF9uZXh0X3NjaGVkdWxlZCgncHNfdmVuaXBha19zZWtpbWFzJykpLicgVVRDJyA6ICdOxJZSQSc7CiAgICAkb1snbm93X3V0YyddID0gZ21kYXRlKCdZLW0tZCBIOmk6cycpOwogICAgJG9bJ3Bhc2t1dGluaXMnXSA9IGdldF9vcHRpb24oJ3BzX3ZlbmlwYWtfc2VraW1hc19wYXNrdXRpbmlzJyk7CiAgICAkbnJzID0gYXJyYXkoJzEwMDAnLCcxMDAxJywnMTAwNycsJzEwMTMnLCcxMDE0JywnMTAxNycpOwogICAgJGlkcyA9ICR3cGRiLT5nZXRfY29sKCJTRUxFQ1Qgb3JkZXJfaWQgRlJPTSB7JHB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXk9J19wc19vcmRlcl9udW1iZXInIEFORCBtZXRhX3ZhbHVlIElOICgnIi5pbXBsb2RlKCInLCciLCRucnMpLiInKSIpOwogICAgJGthbmQgPSBhcnJheSgpOwogICAgaWYgKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9EYXJiYWxhdWtpcycpKSB7ICRyYyA9IG5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfRGFyYmFsYXVraXMnKTsgaWYgKCRyYy0+aGFzTWV0aG9kKCdzZWtpbW9fa2FuZGlkYXRhaScpKSB7ICRtPSRyYy0+Z2V0TWV0aG9kKCdzZWtpbW9fa2FuZGlkYXRhaScpOyAkbS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsgJGthbmQ9JG0tPmludm9rZShudWxsKTsgfSB9CiAgICAkb1sna2FuZGlkYXRhaV9uJ10gPSBjb3VudCgka2FuZCk7CiAgICBmb3JlYWNoICgkaWRzIGFzICRpZCkgewogICAgICAkb3JkID0gd2NfZ2V0X29yZGVyKCRpZCk7IGlmKCEkb3JkKSBjb250aW51ZTsKICAgICAgJHIgPSBhcnJheSgnaWQnPT4kaWQsJ25yJz0+JG9yZC0+Z2V0X21ldGEoJ19wc19vcmRlcl9udW1iZXInKSwnc3RhdHVzJz0+JG9yZC0+Z2V0X3N0YXR1cygpLCdrYW5kaWRhdGFzJz0+aW5fYXJyYXkoKGludCkkaWQsJGthbmQsdHJ1ZSkpOwogICAgICBmb3JlYWNoIChhcnJheSgnX3BzX3NpdW50b3MnLCdfcHNfdmVuaXBha19zZWtpbWFzJywnX3BzX2RhbHlzX2lzc2l1c3RhJywnX3BzX3ZmX3NpdW50YScsJ19wc19kcm9wc2hpcCcsJ19wc192Zl9zZWtpbW8nKSBhcyAkaykgeyAkdj0kb3JkLT5nZXRfbWV0YSgkayk7IGlmKCR2IT09JycgJiYgJHYhPT1udWxsKSAkclska109IGlzX3N0cmluZygkdik/IG1iX3N1YnN0cigkdiwwLDYwMCkgOiAkdjsgfQogICAgICAkbWV0YSA9ICR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG1ldGFfa2V5LCBMRUZUKG1ldGFfdmFsdWUsMTIwKSB2IEZST00geyRwfXdjX29yZGVyc19tZXRhIFdIRVJFIG9yZGVyX2lkPSVkIEFORCAobWV0YV9rZXkgTElLRSAnJSVzaXVudCUlJyBPUiBtZXRhX2tleSBMSUtFICclJXZlbmlwYWslJScgT1IgbWV0YV9rZXkgTElLRSAnJSV2ZiUlJyBPUiBtZXRhX2tleSBMSUtFICclJWRyb3AlJScgT1IgbWV0YV9rZXkgTElLRSAnJSVzZWtpbSUlJyBPUiBtZXRhX2tleSBMSUtFICclJXRyYWNrJSUnKSIsICRpZCksIEFSUkFZX0EpOwogICAgICAkclsnbWV0YV9yYWt0YWknXSA9ICRtZXRhOwogICAgICBpZiAoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX1NpdW50b3MnKSkgeyAkclsncmVnJ10gPSBQZXRzaG9wX1NpdW50b3M6OnNhcmFzYXMoJGlkKTsgfQogICAgICAkbm90ZXMgPSB3Y19nZXRfb3JkZXJfbm90ZXMoYXJyYXkoJ29yZGVyX2lkJz0+JGlkLCdsaW1pdCc9PjYpKTsgJHJbJ3Bhc3RhYm9zJ109YXJyYXkoKTsgZm9yZWFjaCgkbm90ZXMgYXMgJG4peyAkclsncGFzdGFib3MnXVtdPSRuLT5kYXRlX2NyZWF0ZWQtPmRhdGUoJ20tZCBIOmknKS4nICcubWJfc3Vic3RyKCRuLT5jb250ZW50LDAsMTQwKTsgfQogICAgICAkb1sndXpzJ11bXSA9ICRyOwogICAgfQogICAgLy8gVGllc2lvZ2luaXMgVmVuaXBhayBBUEkgdGVzdGFzIHZpZW5hbSBWRiBudW1lcml1aQogICAgJHQ9J1YwNzI2N0UxMDAwMDY1JzsKICAgICRyciA9IHdwX3JlbW90ZV9nZXQoJ2h0dHBzOi8vdHJhY2tpbmcudmVuaXBhay5jb20vYXBpL3YxL2V2ZW50cz9wYWNrX25vPScuJHQsIGFycmF5KCd0aW1lb3V0Jz0+MTUsJ2hlYWRlcnMnPT5hcnJheSgnQWNjZXB0Jz0+J2FwcGxpY2F0aW9uL2pzb24nKSkpOwogICAgJG9bJ2FwaV90ZXN0J10gPSBpc193cF9lcnJvcigkcnIpID8gJHJyLT5nZXRfZXJyb3JfbWVzc2FnZSgpIDogYXJyYXkoJ2NvZGUnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcnIpLCdib2R5Jz0+bWJfc3Vic3RyKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyciksMCwxMjAwKSk7CiAgICAvLyBDcm9uIMW+dXJuYWxhczogcGFza3V0aW5pYWkgcHMgxK92eWtpYWkgc3UgdmVuaXBhawogICAgJG9bJ2l2eWtpYWknXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHV6c2FreW1hcywgdmVpa3NtYXMsIHJlenVsdGF0YXMsIExFRlQocGFzdGFiYSw4MCkgcCwgbGFpa2FzIEZST00geyRwfXBzX3V6c2FreW11X2l2eWtpYWkgV0hFUkUga2FuYWxhcz0ndmVuaXBhaycgT1JERVIgQlkgaWQgREVTQyBMSU1JVCA4IiwgQVJSQVlfQSk7CiAgfSBjYXRjaCAoVGhyb3dhYmxlICRlKSB7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-142425';
const GKEY='ps_s1671r';
const PHASES=["R"];
const OUT='analize/s1671_r.json';
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
