process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MjggciDigJQgUkVDT04gKHRpayBza2FpdHltYXMpOiBXQ0ROIOKAnnByaW50IGJ1dHRvbnPigJwga2xpZW50byBwYXNreXJvamUgKG9wY2lqb3Mgd2Nkbl8qLCBrb2RhcyksIOKAnkF0c2lzYWt5dGkgc3V0YXJ0aWVzIChFUyAxNCBkLiB0ZWlzxJcp4oCcIMWhYWx0aW5pcy4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfcjEzJ10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4nUzE2MjggcicpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDEyMCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRvWyd3Y2RuX29wdCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLExFRlQob3B0aW9uX3ZhbHVlLDE2MCkgdiBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ3djZG4lJyBBTkQgb3B0aW9uX25hbWUgTk9UIExJS0UgJyV0ZW1wbGF0ZV8lJyBPUkRFUiBCWSBvcHRpb25fbmFtZSIsQVJSQVlfQSk7CiAgJGRpcj1XUF9QTFVHSU5fRElSLicvd29vY29tbWVyY2UtZGVsaXZlcnktbm90ZXMvJzsgJG9bJ3djZG5fZGlyJ109aXNfZGlyKCRkaXIpOyAkaGl0cz1hcnJheSgpOwogIGZvcmVhY2goZ2xvYigkZGlyLid7LCovLCovKi99Ki5waHAnLEdMT0JfQlJBQ0UpIGFzICRmcCl7ICRjPShzdHJpbmcpZmlsZV9nZXRfY29udGVudHMoJGZwKTsgaWYocHJlZ19tYXRjaCgnL3ByaW50X2J1dHRvbnxteV9hY2NvdW50fHZpZXdfb3JkZXJ8d2Nkbl9wcmludF9idXR0b258d29vY29tbWVyY2Vfdmlld19vcmRlcnx3b29jb21tZXJjZV9teV9hY2NvdW50X215X29yZGVyc19hY3Rpb25zfG9yZGVyLWRldGFpbHN8YWZ0ZXJfb3JkZXJfdGFibGUvaScsJGMpKXsgJEw9ZXhwbG9kZSgiXG4iLCRjKTsgZm9yZWFjaCgkTCBhcyAkaz0+JGwpeyBpZihwcmVnX21hdGNoKCcvYWRkX2FjdGlvblwofGFkZF9maWx0ZXJcKHxwcmludF9idXR0b258d2Nkbl9wcmludF9idXR0b258Z2V0X29wdGlvblwoXHMqLndjZG4vaScsJGwpJiZwcmVnX21hdGNoKCcvcHJpbnR8YnV0dG9ufG15X2FjY291bnR8dmlld19vcmRlcnxvcmRlcl90YWJsZXxvcmRlcl9kZXRhaWxzfG9yZGVyc19hY3Rpb25zL2knLCRsKSl7ICRoaXRzW109c3RyX3JlcGxhY2UoJGRpciwnJywkZnApLic6Jy4oJGsrMSkuJzogJy5tYl9zdWJzdHIodHJpbSgkbCksMCwyMDApOyB9IH0gfSB9ICRvWyd3Y2RuX2tvZGFzJ109YXJyYXlfc2xpY2UoJGhpdHMsMCw0NSk7CiAgJHRoPWdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpOyAkaDI9YXJyYXkoKTsgZm9yZWFjaChhcnJheV9tZXJnZShnbG9iKCR0aC4nLyoucGhwJyk/OmFycmF5KCksZ2xvYigkdGguJy93b29jb21tZXJjZS97LCovLCovKi99Ki5waHAnLEdMT0JfQlJBQ0UpPzphcnJheSgpLGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKT86YXJyYXkoKSkgYXMgJGZwKXsgJGM9KHN0cmluZylmaWxlX2dldF9jb250ZW50cygkZnApOyBpZihzdHJwb3MoJGMsJ0F0c2lzYWt5dGkgc3V0YXJ0aWVzJykhPT1mYWxzZXx8c3RycG9zKCRjLCcxNCBkLicpIT09ZmFsc2V8fHN0cnBvcygkYywnU3BhdXNkaW50aScpIT09ZmFsc2UpeyAkTD1leHBsb2RlKCJcbiIsJGMpOyBmb3JlYWNoKCRMIGFzICRrPT4kbCl7IGlmKHByZWdfbWF0Y2goJy9BdHNpc2FreXRpIHN1dGFydGllc3wxNCBkXC58U3BhdXNkaW50aXxwcmludF9idXR0b258d2Nkbi9pJywkbCkpICRoMltdPWJhc2VuYW1lKGRpcm5hbWUoJGZwKSkuJy8nLmJhc2VuYW1lKCRmcCkuJzonLigkaysxKS4nOiAnLm1iX3N1YnN0cih0cmltKCRsKSwwLDE4MCk7IH0gfSB9ICRvWyd0ZW1hX211J109YXJyYXlfc2xpY2UoJGgyLDAsMzApOwogICRvWydha3R5dnVzJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigoYXJyYXkpZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKSxmdW5jdGlvbigkeCl7cmV0dXJuIHByZWdfbWF0Y2goJy9kZWxpdmVyeXxpbnZvaWNlfHBkZnxhdHNpc2FrfHJlZnVuZHxyZXR1cm58Y2FuY2VsL2knLCR4KTt9KSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LDk5KTsK';
const VER='dep-160234';
const GKEY='ps_r13';
const PHASES=["R"];
const OUT='analize/s1628_r.json';
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
