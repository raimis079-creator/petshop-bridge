process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjc1IHlhbmRleCBjbGFyaXR5IGFkc2Vuc2UgenZhbGd5YmEgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19ia1YnXSk/JF9HRVRbJ3BzX2JrViddOicnKSE9PSdSJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2NzVSJywnd3AnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpOwogIGdsb2JhbCAkd3BkYjsKICB0cnl7CiAgICAkem9kemlhaT1hcnJheSgneWFuZGV4Jz0+J3lhbmRleCcsJ21jLnlhbmRleCc9PidtYy55YW5kZXgnLCdtZXRyaWthJz0+J21ldHJpa2EnLCd5bSgnPT4neW0oJywKICAgICAgJ2NsYXJpdHknPT4nY2xhcml0eScsJ2Fkc2Vuc2UnPT4nYWRzYnlnb29nbGUnLCdwYWdlYWQnPT4ncGFnZWFkMi5nb29nbGVzeW5kaWNhdGlvbicpOwogICAgJHBzbD1hcnJheSgndGl0dWxpbmlzJz0+aG9tZV91cmwoJy8nKSwncHJla2UnPT5ob21lX3VybCgnL3Byb2R1Y3QvYW1icm9zaWEtYmVncnVkaXMtc3Utc3ZpZXppYS1rYWxha3V0aWVuYS1pci1hbnRpZW5hLXNhdXNhcy1tYWlzdGFzLXN1bmltcy1mcmVzaC10dXJrZXktZHVjay0ya2cvJyksJ2tyZXBzZWxpcyc9PndjX2dldF9jYXJ0X3VybCgpKTsKICAgIGZvcmVhY2goJHBzbCBhcyAkaz0+JHUpewogICAgICAkcj13cF9yZW1vdGVfZ2V0KCR1LGFycmF5KCd0aW1lb3V0Jz0+NDUsJ3NzbHZlcmlmeSc9PmZhbHNlLCdoZWFkZXJzJz0+YXJyYXkoJ1VzZXItQWdlbnQnPT4nTW96aWxsYS81LjAgQ2hyb21lLzE1MicpKSk7CiAgICAgIGlmKGlzX3dwX2Vycm9yKCRyKSl7ICRvWydodG1sJ11bJGtdPSdFUlInOyBjb250aW51ZTsgfQogICAgICAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcik7ICR0PWFycmF5KCk7CiAgICAgIGZvcmVhY2goJHpvZHppYWkgYXMgJGxhYj0+JHopICR0WyRsYWJdPXN1YnN0cl9jb3VudChzdHJ0b2xvd2VyKCRiKSxzdHJ0b2xvd2VyKCR6KSk7CiAgICAgICRvWydodG1sJ11bJGtdPSR0OwogICAgfQogICAgLy8gQ29tcGxpYW56IG51c3RhdHltYWksIGt1cmllIGl0cmF1a2lhIHNpYXMgcGFzbGF1Z2FzCiAgICAkY289Z2V0X29wdGlvbignY21wbHpfb3B0aW9ucycpOwogICAgZm9yZWFjaChhcnJheSgneWFuZGV4X2lkJywneWFuZGV4X2Vjb21tZXJjZScsJ2NsYXJpdHlfaWQnLCdjbGFyaXR5X2NvbnNlbnRfbW9kZScsJ21hdG9tb191cmwnLCdtYXRvbW9fc2l0ZV9pZCcsJ2NsaWNreV9zaXRlX2lkJywnY29tcGlsZV9zdGF0aXN0aWNzJywndXNlc19hZF9jb29raWVzJywndXNlc19hZF9jb29raWVzX3BlcnNvbmFsaXplZCcsJ3RoaXJkcGFydHlfc2VydmljZXNfb25fc2l0ZScpIGFzICRrKSAkb1snY21wbHpfbnVzdGF0eW1haSddWyRrXT1pc3NldCgkY29bJGtdKT8oaXNfYXJyYXkoJGNvWyRrXSk/aW1wbG9kZSgnLCcsJGNvWyRrXSk6JGNvWyRrXSk6J25lcmEnOwogICAgLy8gSXMga3VyIGF0a2VsaWF2bzogcGF6aXVyaW0gc2VydmljZSBpcmFzdXMKICAgICRvWydzZXJ2aWNlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELG5hbWUsbGFuZ3VhZ2Usc3luYyxzbHVnIEZST00geyR3cGRiLT5wcmVmaXh9Y21wbHpfc2VydmljZXMgV0hFUkUgbmFtZSBJTiAoJ1lhbmRleCBNZXRyaWNhJywnTWljcm9zb2Z0IENsYXJpdHknLCdHb29nbGUgQWRzZW5zZScpIixBUlJBWV9BKTsKICAgICRpZHM9YXJyYXkoKTsgZm9yZWFjaCgkb1snc2VydmljZXMnXSBhcyAkcykgJGlkc1tdPShpbnQpJHNbJ0lEJ107CiAgICBpZigkaWRzKSAkb1snanVfc2xhcHVrYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxuYW1lLGxhbmd1YWdlLHNlcnZpY2VJRCBGUk9NIHskd3BkYi0+cHJlZml4fWNtcGx6X2Nvb2tpZXMgV0hFUkUgc2VydmljZUlEIElOICgiLmltcGxvZGUoJywnLCRpZHMpLiIpIixBUlJBWV9BKTsKICAgICRvWydzbGFwdWt1X3NrJ109JGlkcz8oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH1jbXBsel9jb29raWVzIFdIRVJFIHNlcnZpY2VJRCBJTiAoIi5pbXBsb2RlKCcsJywkaWRzKS4iKSIpOjA7CiAgICAvLyBhciB5cmEgdG9raXUgc2xhcHVrdSBwYXZhZGluaW11IGFwc2tyaXRhaQogICAgJG9bJ2l0YXJ0aW5pX3NsYXB1a2FpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQsbmFtZSxsYW5ndWFnZSxzZXJ2aWNlSUQgRlJPTSB7JHdwZGItPnByZWZpeH1jbXBsel9jb29raWVzIFdIRVJFIG5hbWUgTElLRSAnXF95bSUnIE9SIG5hbWUgTElLRSAnJWNsYXJpdHklJyBPUiBuYW1lIExJS0UgJyVfY2xjayUnIE9SIG5hbWUgTElLRSAnJV9jbHNrJScgT1IgbmFtZSBMSUtFICclYWRzZW5zZSUnIE9SIG5hbWUgTElLRSAnXF9nY2wlJyBMSU1JVCAyNSIsQVJSQVlfQSk7CiAgICAvLyBwbHVnaW5haSwga3VyaWUgZ2FsZXR1IHRhaSBkZXRpCiAgICBpZighZnVuY3Rpb25fZXhpc3RzKCdnZXRfcGx1Z2lucycpKSByZXF1aXJlX29uY2UgQUJTUEFUSC4nd3AtYWRtaW4vaW5jbHVkZXMvcGx1Z2luLnBocCc7CiAgICBmb3JlYWNoKGdldF9wbHVnaW5zKCkgYXMgJHNsPT4kcCl7IGlmKHByZWdfbWF0Y2goJy95YW5kZXh8Y2xhcml0eXxhZHNlbnNlL2knLCRzbC4nICcuJHBbJ05hbWUnXSkpICRvWydwbHVnaW5haSddWyRzbF09JHBbJ05hbWUnXTsgfQogICAgJG9bJ3BsdWdpbmFpJ109JG9bJ3BsdWdpbmFpJ10/PyduZXJhIHRva2l1IHBsdWdpbnUnOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-081403';
const GKEY='ps_bkV';
const PHASES=["R"];
const OUT='analize/s1675_r.json';
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
