process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjM5ayBMUCBrZWxpYXMg4oCUIEhDMDM0NzIyMzM5TFQgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19uMiddKT8kX0dFVFsncHNfbjInXTonJykhPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTYzOWsnLCducic9PidIQzAzNDcyMjMzOUxUJyk7CiAgdHJ5ewogICAgJG9yZD13Y19nZXRfb3JkZXIoMzU4NjIpOwogICAgaWYoISRvcmR8fCRvcmQtPmdldF9iaWxsaW5nX2VtYWlsKCkhPT0ndGVycmFAcGV0c2hvcC5sdCcpIHRocm93IG5ldyBFeGNlcHRpb24oJ25lIHRhcycpOwogICAgYWRkX2ZpbHRlcignd29vY29tbWVyY2VfZW1haWxfZW5hYmxlZF9jdXN0b21lcl9wcm9jZXNzaW5nX29yZGVyJywnX19yZXR1cm5fZmFsc2UnKTsKICAgICRvcmQtPmRlbGV0ZV9tZXRhX2RhdGEoJ19wc19kYWx5c19pc3NpdXN0YScpOyAkb3JkLT5kZWxldGVfbWV0YV9kYXRhKCdfcHNfc2VraW1vX3NpdXN0YScpOwogICAgJG9yZC0+ZGVsZXRlX21ldGFfZGF0YSgndmVuaXBha19zaGlwcGluZ19vcmRlcl9kYXRhJyk7ICRvcmQtPmRlbGV0ZV9tZXRhX2RhdGEoJ19wc19zaXVudG9zJyk7CiAgICAkb3JkLT51cGRhdGVfbWV0YV9kYXRhKCdfd29vX2xpdGh1YW5pYXBvc3RfYmFyY29kZScsJ0hDMDM0NzIyMzM5TFQnKTsKICAgICRvcmQtPnVwZGF0ZV9tZXRhX2RhdGEoJ193b29fbGl0aHVhbmlhcG9zdF9zaGlwcGluZ19zdGF0dXNfdmFsdWUnLCdscC1vbi10aGUtd2F5Jyk7CiAgICAkb3JkLT51cGRhdGVfc3RhdHVzKCdwcm9jZXNzaW5nJywnUzE2Mzk6IExQIHRlc3R1aScsdHJ1ZSk7CiAgICAkcmVzPVBldHNob3BfRGFyYmFsYXVraXM6Omlzc2l1c3RhKHdjX2dldF9vcmRlcigzNTg2MiksbnVsbCx0cnVlLCdhdicsJ2xwJyk7CiAgICAkb1sncmVzMSddPSRyZXM7CiAgICBpZigkcmVzWzBdPT09J2RsX2tsYWlkYScpeyAvLyBhdHNhcmdpbmlzOiBudW1lcmlzIGkgX3BzX3NpdW50b3MgKGxwKQogICAgICAkb3JkPXdjX2dldF9vcmRlcigzNTg2Mik7CiAgICAgICRvcmQtPnVwZGF0ZV9tZXRhX2RhdGEoJ19wc19zaXVudG9zJyx3cF9qc29uX2VuY29kZShhcnJheSgnYXYnPT5hcnJheSgnc2FuZGVsaXMnPT4nYXYnLCdrb2Rhcyc9PidscCcsCiAgICAgICAgJ21hbmlmZXN0Jz0+JycsJ251bWVyaWFpJz0+YXJyYXkoJ0hDMDM0NzIyMzM5TFQnKSwnZGF0YSc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSkpKSk7ICRvcmQtPnNhdmUoKTsKICAgICAgJG9bJ3JlczInXT1QZXRzaG9wX0RhcmJhbGF1a2lzOjppc3NpdXN0YSh3Y19nZXRfb3JkZXIoMzU4NjIpLG51bGwsdHJ1ZSwnYXYnLCdscCcpOwogICAgfQogICAgJG9bJ3N0YXR1c2FzJ109d2NfZ2V0X29yZGVyKDM1ODYyKS0+Z2V0X3N0YXR1cygpOwogICAgJHo9KGFycmF5KWdldF9vcHRpb24oJ3BzX2Rldl9wYXN0YXNfenVybmFsYXMnLGFycmF5KCkpOyAkb1snenVybmFsYXMnXT1hcnJheV9zbGljZSgkeiwtMSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-065523';
const GKEY='ps_n2';
const PHASES=["GO"];
const OUT='analize/s1639_k.json';
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
