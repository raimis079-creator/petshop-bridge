process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTUgcnVuIGU2ciDigJQgUkVDT04gKHRpayBza2FpdHltYXMpOiBwaXJraW1vIHRhaXN5a2xpxbMgcHVzbGFwaXMgKFdDIHRlcm1zIHBhZ2UgKyBwdXNsYXBpYWkgc3Ug4oCedGFpc3lrbOKAnCksIHN0cnVrdMWrcmEgKGFudHJhxaF0xJdzIC8gbnVtZXJ1b3RpIHB1bmt0YWkpLCBwYXN0cmFpcG9zIGFwaWUgcHJpc3RhdHltxIUvZ3LEhcW+aW5pbcSFL25lYXRzacSXbWltxIUsIHR1cmluaW8gZm9ybWF0YXMgKGJsb2thaSAvIEhUTUwgLyBVWCBidWlsZGVyKS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfZTZyJ10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4nUzE2MTUgZTZyJyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgc2V0X3RpbWVfbGltaXQoMTIwKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJEo9ZnVuY3Rpb24oJG8peyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7IH07CiAgdHJ5ewogICR0aWQ9KGludClnZXRfb3B0aW9uKCd3b29jb21tZXJjZV90ZXJtc19wYWdlX2lkJyk7ICRvWyd0ZXJtc19wYWdlX2lkJ109JHRpZDsKICAkaWRzPWFycmF5KCk7IGlmKCR0aWQpICRpZHNbXT0kdGlkOwogICRyPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfdGl0bGUscG9zdF9uYW1lLHBvc3Rfc3RhdHVzLHBvc3RfbW9kaWZpZWQsTEVOR1RIKHBvc3RfY29udGVudCkgbGVuIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncGFnZScgQU5EIHBvc3Rfc3RhdHVzIElOICgncHVibGlzaCcsJ3ByaXZhdGUnLCdkcmFmdCcpIEFORCAocG9zdF9uYW1lIExJS0UgJyV0YWlzeWtsJScgT1IgcG9zdF90aXRsZSBMSUtFICcldGFpc3lrbCUnIE9SIHBvc3RfbmFtZSBMSUtFICclZ3JhemluJScgT1IgcG9zdF90aXRsZSBMSUtFICclZ3LEhcW+aW4lJyBPUiBwb3N0X25hbWUgTElLRSAnJXByaXN0YXQlJyBPUiBwb3N0X3RpdGxlIExJS0UgJyVwcmlzdGF0JScgT1IgcG9zdF9uYW1lIExJS0UgJyVzYWx5ZyUnIE9SIHBvc3RfdGl0bGUgTElLRSAnJXPEhWx5ZyUnKSBPUkRFUiBCWSBJRCIsQVJSQVlfQSk7CiAgJG9bJ3B1c2xhcGlhaSddPSRyOyBmb3JlYWNoKCRyIGFzICR4KXsgJGlkc1tdPShpbnQpJHhbJ0lEJ107IH0gJGlkcz1hcnJheV91bmlxdWUoJGlkcyk7CiAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICRwZz1nZXRfcG9zdCgkaWQpOyBpZighJHBnKSBjb250aW51ZTsgJGM9JHBnLT5wb3N0X2NvbnRlbnQ7ICRkPWFycmF5KCd0aXRsZSc9PiRwZy0+cG9zdF90aXRsZSwnc2x1Zyc9PiRwZy0+cG9zdF9uYW1lLCdzdGF0dXMnPT4kcGctPnBvc3Rfc3RhdHVzLCdsZW4nPT5zdHJsZW4oJGMpLCd1cmwnPT5nZXRfcGVybWFsaW5rKCRpZCksJ2d1dGVuYmVyZyc9PnN0cnBvcygkYywnPCEtLSB3cDonKSE9PWZhbHNlLCd1eCc9PnN0cnBvcygkYywnW3V4XycpIT09ZmFsc2V8fHN0cnBvcygkYywnW3NlY3Rpb24nKSE9PWZhbHNlLCdtb2RpZmllZCc9PiRwZy0+cG9zdF9tb2RpZmllZCk7CiAgICBwcmVnX21hdGNoX2FsbCgnLzxoWzEtNF1bXj5dKj4oLio/KTxcL2hbMS00XT4vc3UnLCRjLCRtKTsgJGRbJ2FudHJhc3RlcyddPWFycmF5X21hcChmdW5jdGlvbigkaCl7IHJldHVybiBtYl9zdWJzdHIodHJpbSh3cF9zdHJpcF9hbGxfdGFncygkaCkpLDAsOTApOyB9LCRtWzFdKTsKICAgIHByZWdfbWF0Y2hfYWxsKCcvKD86Xnw+fFxuKVxzKihcZHsxLDJ9XC5cZHsxLDJ9XC4/KVxzL3UnLCRjLCRtMik7ICRkWydudW1lcnVvdGknXT1hcnJheV9zbGljZShhcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtMlsxXSkpLDAsODApOwogICAgJHR4dD13cF9zdHJpcF9hbGxfdGFncyhzdHJfcmVwbGFjZShhcnJheSgnPGJyPicsJzxici8+JywnPC9wPicsJzwvbGk+JyksIlxuIiwkYykpOyAkbGluZXM9cHJlZ19zcGxpdCgnL1xuKy91JywkdHh0KTsgJGhpdHM9YXJyYXkoKTsgZm9yZWFjaCgkbGluZXMgYXMgJGk9PiRsKXsgJGw9dHJpbSgkbCk7IGlmKCRsPT09Jyd8fG1iX3N0cmxlbigkbCk8MjApIGNvbnRpbnVlOyBpZihwcmVnX21hdGNoKCcvbmVhdHNpfG5lYXRzaWltfGdyxIXFvmlufGdyYXp8cHJpc3RhdHltfHBhxaF0b21hdHxwYXN0b21hdHxrdXJqZXJ8c2l1bnRvc3xhdHNpc2FrL2l1JywkbCkpeyAkaGl0c1tdPW1iX3N1YnN0cigkbCwwLDI2MCk7IH0gfSAkZFsncGFzdHJhaXBvcyddPWFycmF5X3NsaWNlKCRoaXRzLDAsNjApOwogICAgJG9bJ3R1cmlueXMnXVskaWRdPSRkOyB9CiAgJG9bJ2NoZWNrb3V0X3Rlcm1zJ109YXJyYXkoJ3Rlcm1zX3BhZ2UnPT4kdGlkP2dldF90aGVfdGl0bGUoJHRpZCk6bnVsbCwnY2hlY2tvdXRfdGVybXNfc2V0dGluZyc9PmdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2NoZWNrb3V0X3Rlcm1zX2FuZF9jb25kaXRpb25zX2NoZWNrYm94X3RleHQnKSk7CiAgJG9bJ3ByaXN0YXR5bW9fdGFyaWZhaSddPWFycmF5KCk7IGZvcmVhY2goV0NfU2hpcHBpbmdfWm9uZXM6OmdldF96b25lcygpIGFzICR6KXsgZm9yZWFjaCgkelsnc2hpcHBpbmdfbWV0aG9kcyddIGFzICRtKXsgJG9bJ3ByaXN0YXR5bW9fdGFyaWZhaSddW109YXJyYXkoJHpbJ3pvbmVfbmFtZSddLCRtLT5pZCwkbS0+Z2V0X2luc3RhbmNlX2lkKCksJG0tPmdldF90aXRsZSgpLCRtLT5nZXRfb3B0aW9uKCdjb3N0JyksJG0tPmdldF9vcHRpb24oJ21pbl9hbW91bnQnKSk7IH0gfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogICRKKCRvKTsKfSw5OSk7Cg==';
const VER='dep-184659';
const GKEY='ps_e6r';
const PHASES=["R"];
const OUT='analize/s1615_e6r.json';
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
