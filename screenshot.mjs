process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzc5aSAjMTg1NTcgYmFuZHltYWk6IHZpc29zIHBhc3RhYm9zLCBwcmVrZSwgcGF5c2VyYSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NzlpJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCg5MCk7ICRyPVsndic9PidTMTc3OWknXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogIHRyeXsKICAgIGZvcmVhY2goWycxMzk1JywnMTM5NycsJzE0MDcnLCcxNDA5JywnMTM5MyddIGFzICRudW0peyBmb3JlYWNoKHdjX2dldF9vcmRlcnMoWydsaW1pdCc9PjYwLCd0eXBlJz0+J3Nob3Bfb3JkZXInLCdzdGF0dXMnPT4nYW55JywnZGF0ZV9jcmVhdGVkJz0+Jz49Jy5zdHJ0b3RpbWUoJzIwMjYtMTAtMTIgMDY6MDA6MDAgVVRDJyldKSBhcyAkbyl7IGlmKCRvLT5nZXRfb3JkZXJfbnVtYmVyKCkhPT0kbnVtKSBjb250aW51ZTsKICAgICAgJG50PVtdOyBmb3JlYWNoKGFycmF5X3JldmVyc2Uod2NfZ2V0X29yZGVyX25vdGVzKFsnb3JkZXJfaWQnPT4kby0+Z2V0X2lkKCldKSkgYXMgJG4pICRudFtdPSRuLT5kYXRlX2NyZWF0ZWQtPmRhdGUoJ20tZCBIOmk6cycpLicgWycuKCRuLT5hZGRlZF9ieT86J3N5cycpLiddICcubWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCRuLT5jb250ZW50KSwwLDIwMCk7CiAgICAgICRtZXRhPVtdOyBmb3JlYWNoKCRvLT5nZXRfbWV0YV9kYXRhKCkgYXMgJG0peyAkaz0kbS0+a2V5OyBpZihwcmVnX21hdGNoKCcjcGF5c2VyYXxhdHRyaWJ1dGlvbnxfcHNffGNyZWF0ZWRfdmlhI2knLCRrKSkgJG1ldGFbJGtdPWlzX3NjYWxhcigkbS0+dmFsdWUpP21iX3N1YnN0cigoc3RyaW5nKSRtLT52YWx1ZSwwLDgwKTonW2Fycl0nOyB9CiAgICAgICRyWydvJ11bJG51bV09WydjcmVhdGVkX3ZpYSc9PiRvLT5nZXRfY3JlYXRlZF92aWEoKSwnc2hpcHBpbmcnPT4kby0+Z2V0X3NoaXBwaW5nX21ldGhvZCgpLCdub3Rlcyc9PiRudCwnbWV0YSc9PiRtZXRhLCd1YSc9Pm1iX3N1YnN0cigkby0+Z2V0X2N1c3RvbWVyX3VzZXJfYWdlbnQoKSwwLDkwKSwnaXBfaGFzaCc9PnN1YnN0cihtZDUoJG8tPmdldF9jdXN0b21lcl9pcF9hZGRyZXNzKCkpLDAsNiksJ2N1c3RvbWVyX2lkJz0+JG8tPmdldF9jdXN0b21lcl9pZCgpXTsgfSB9CiAgICAkcD13Y19nZXRfcHJvZHVjdCgxODU1Nyk7ICRyWydwcmVrZSddPVskcC0+Z2V0X25hbWUoKSwkcC0+Z2V0X3ByaWNlKCksJHAtPmdldF9zdG9ja19zdGF0dXMoKSwkcC0+Z2V0X3N0b2NrX3F1YW50aXR5KCksZ2V0X3Bvc3RfbWV0YSgxODU1NywnX293bl9zdG9ja19xdHknLHRydWUpLGdldF9wb3N0X21ldGEoMTg1NTcsJ19tYW5hZ2Vfc3RvY2snLHRydWUpLGdldF9wb3N0X21ldGEoMTg1NTcsJ19iYWNrb3JkZXJzJyx0cnVlKSxnZXRfcG9zdF9tZXRhKDE4NTU3LCdfcHNfc2FuZGVsaXMnLHRydWUpXTsKICAgICRyWydzb3VyY2VzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskUH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQ9MTg1NTciLEFSUkFZX0EpOwogICAgJHJbJ2pvYnMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxmbG93LHN0YXR1cyxDT0FMRVNDRShza2lwX3JlYXNvbiwnJykgc3IsY3JlYXRlZF9hdCxzZW50X2F0IEZST00geyRQfXBzX2VtYWlsX2pvYnMgV0hFUkUgZmxvdyBJTignY2FydF9hYmFuZG9uZWQnLCdjYXJ0X2FiYW5kb25lZF8yJykgQU5EIGNyZWF0ZWRfYXQ+PScyMDI2LTEwLTEyIDA3OjAwOjAwJyBPUkRFUiBCWSBpZCIsQVJSQVlfQSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSk7Cg==';
const VER='dep-061154';
const GKEY='ps_s1779i';
const PHASES=["1"];
const OUT='out/s1779i.json';
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
