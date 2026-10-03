process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQ5YiBsYWlza3UgREIgdHlyaW1hcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NDliJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNzApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRUPSRQLidwc19lbWFpbF9qb2JzJzsgJHI9Wyd2Jz0+J1MxNzQ5YiddOwogICRyWyd2aXNvJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZmxvdywgZmxvd19jbGFzcyBjbHMsIHN0YXR1cywgQ09VTlQoKikgbiwgU1VNKGF0dGVtcHRzKSBiYW5keW11LCBNQVgoYXR0ZW1wdHMpIG1heF9iYW5kLCBNSU4oY3JlYXRlZF9hdCkgbnVvLCBNQVgodXBkYXRlZF9hdCkgaWtpIEZST00gJFQgR1JPVVAgQlkgMSwyLDMgT1JERVIgQlkgMSwzIixBUlJBWV9BKTsKICAkclsnc2VudF9hdHRlbXB0c19ndDEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxmbG93LGF0dGVtcHRzLHJlY2lwaWVudF9lbWFpbCBlLHNlbnRfYXQsTEVGVChDT0FMRVNDRShsYXN0X2Vycm9yLCcnKSw0MCkgZXIgRlJPTSAkVCBXSEVSRSBhdHRlbXB0cz4xIE9SREVSIEJZIGlkIixBUlJBWV9BKTsKICAkclsnZHViX2dhdmVqYXNfZGllbmEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCByZWNpcGllbnRfZW1haWwgZSwgZmxvdywgREFURShzZW50X2F0KSBkLCBDT1VOVCgqKSBuIEZST00gJFQgV0hFUkUgc3RhdHVzPSdzZW50JyBHUk9VUCBCWSAxLDIsMyBIQVZJTkcgbj4xIE9SREVSIEJZIGQiLEFSUkFZX0EpOwogICRyWydkdWJfam9ia2V5J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gKFNFTEVDVCBqb2Jfa2V5IEZST00gJFQgR1JPVVAgQlkgam9iX2tleSBIQVZJTkcgQ09VTlQoKik+MSkgeCIpOwogICRyWydzZW50X3Blcl9kaWVuYSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEUoc2VudF9hdCkgZCwgQ09VTlQoKikgbiwgU1VNKHByb3ZpZGVyX21lc3NhZ2VfaWQgSVMgTk9UIE5VTEwgQU5EIHByb3ZpZGVyX21lc3NhZ2VfaWQ8PicnKSBzdV9pZCBGUk9NICRUIFdIRVJFIHN0YXR1cz0nc2VudCcgQU5EIHNlbnRfYXQ+PScyMDI2LTA5LTI1JyBHUk9VUCBCWSAxIE9SREVSIEJZIDEiLEFSUkFZX0EpOwogIC8vIHJlbmRlciBkeWR6aWFpCiAgJHJbJ3JlbmRlciddPVtdOyBmb3JlYWNoKFs2NzksOTkwLDk5MSw5OTIsMTA4Ml0gYXMgJGlkKXsgJHJvdz0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSAkVCBXSEVSRSBpZD0lZCIsJGlkKSxBUlJBWV9BKTsgaWYoISRyb3cpIGNvbnRpbnVlOyAkcD1qc29uX2RlY29kZSgkcm93WydwYXlsb2FkJ10sdHJ1ZSk/OltdOyAkYz1qc29uX2RlY29kZSgoc3RyaW5nKSRyb3dbJ2NvbnRleHRfanNvbiddLHRydWUpPzpbXTsgJHg9UGV0c2hvcF9FbWFpbF9EaXNwYXRjaDo6cmVuZGVyKCRyb3dbJ2Zsb3cnXSxhcnJheV9tZXJnZSgkcCwkYyksJHJvdyk7ICRoPSR4WydodG1sJ107CiAgICAkb2lkPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBsYXN0X29yZGVyX2lkIEZST00geyRQfXBzX3JlZmlsbF90cmFja2luZyBXSEVSRSBpZD0lZCIsKGludCkoJGNbJ3JlZmlsbF9pZCddPz8wKSkpOyAkbz13Y19nZXRfb3JkZXIoJG9pZCk7CiAgICAkclsncmVuZGVyJ11bJGlkXT1bJ3V6cyc9PiRvPyRvLT5nZXRfb3JkZXJfbnVtYmVyKCk6JycsJ2VpbHVjaXVfdXpzJz0+JG8/Y291bnQoJG8tPmdldF9pdGVtcygpKTowLCdodG1sX2tiJz0+cm91bmQoc3RybGVuKCRoKS8xMDI0LDEpLCdpbWcnPT5zdWJzdHJfY291bnQoJGgsJzxpbWcnKSwnZGF0YV91cmknPT5zdWJzdHJfY291bnQoJGgsJ2RhdGE6aW1hZ2UnKSwndGVtYSc9PiR4WydzdWJqZWN0J11dOyB9CiAgLy8gU01UUCAvIHdwX21haWwgenVybmFsYWkKICAkclsnd3BtYWlsc210cCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEUoY3JlYXRlZF9hdCkgZCwgQ09VTlQoKikgbiwgTEVGVChNQVgoY29udGVudCksMTYwKSBwdnogRlJPTSB7JFB9d3BtYWlsc210cF9kZWJ1Z19ldmVudHMgV0hFUkUgY3JlYXRlZF9hdD49JzIwMjYtMDktMDcnIEdST1VQIEJZIDEgT1JERVIgQlkgMSIsQVJSQVlfQSk7CiAgJHQ9JHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJ3skUH1wc191enNha3ltdV9pdnlraWFpJyIpOyAkclsndXpzX2l2eWtpYWlfbGVudCddPSR0OwogIGlmKCR0KXsgJHJbJ3V6c19pdnlraWFpX2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00gJHQiKTsgfQogICRmPShuZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX1V6c2FreW11X0l2eWtpYWknKSktPmdldEZpbGVOYW1lKCk7ICR0eD1maWxlX2dldF9jb250ZW50cygkZik7ICRwPXN0cnBvcygkdHgsJ2Z1bmN0aW9uIGxhaXNrYXMnKTsgJHJbJ2xhaXNrYXNfZm4nXT1zdWJzdHIoJHR4LCRwLDE1MDApOyBwcmVnX21hdGNoKCcjL1wqXCouKj9cKi8jcycsJHR4LCRtKTsgJHJbJ3VpX2hkJ109bWJfc3Vic3RyKCRtWzBdPz8nJywwLDcwMCk7CiAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==';
const VER='dep-172958';
const GKEY='ps_s1749b';
const PHASES=["1"];
const OUT='out/s1749_b.json';
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
