process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjM5ciBidWtsZSBwbyBsdXppbyArIGF0c2F1a2ltYXMgKyB2ZWxhdmltYXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19uOSddKT8kX0dFVFsncHNfbjknXTonJykhPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTYzOXInKTsKICB0cnl7CiAgICAkb3JkPXdjX2dldF9vcmRlcigzNTg2Myk7CiAgICAkb1snMzU4NjMnXT1hcnJheSgnc3RhdHVzYXMnPT4kb3JkLT5nZXRfc3RhdHVzKCksJ3JlZnVuZHMnPT5hcnJheSgpKTsKICAgIGZvcmVhY2goJG9yZC0+Z2V0X3JlZnVuZHMoKSBhcyAkcil7ICRvWyczNTg2MyddWydyZWZ1bmRzJ11bXT1hcnJheSgnaWQnPT4kci0+Z2V0X2lkKCksJ3N1bWEnPT4kci0+Z2V0X2Ftb3VudCgpLAogICAgICAna3JfbnInPT5nZXRfcG9zdF9tZXRhKCRyLT5nZXRfaWQoKSwnX3BldHNob3Bfa3JhdnBuX251bWJlcicsdHJ1ZSksCiAgICAgICdrcl9wZGYnPT5iYXNlbmFtZSgoc3RyaW5nKWdldF9wb3N0X21ldGEoJHItPmdldF9pZCgpLCdfcGV0c2hvcF9rcmF2cG5fcGRmJyx0cnVlKSkpOyB9CiAgICAvLyBhdHNhdWtpbWFzIDM1ODYyCiAgICBpZih3Y19nZXRfb3JkZXIoMzU4NjIpLT5nZXRfc3RhdHVzKCkhPT0nY2FuY2VsbGVkJyl7CiAgICAgIHdjX2dldF9vcmRlcigzNTg2MiktPnVwZGF0ZV9zdGF0dXMoJ2NhbmNlbGxlZCcsJ1MxNjM5IMWhYWJsb27FsyB0ZXN0YXMnLHRydWUpOwogICAgfQogICAgJG9bJzM1ODYyJ109d2NfZ2V0X29yZGVyKDM1ODYyKS0+Z2V0X3N0YXR1cygpOwogICAgJG9bJzE4MjM2X3N0b2NrJ109Z2V0X3Bvc3RfbWV0YSgxODIzNiwnX3N0b2NrJyx0cnVlKTsKICAgIC8vIHZlbGF2aW1vIGxhaXNrYXM6IG5hdWphcyBwcm9jZXNzaW5nCiAgICAkcmFzdGE9MDsKICAgICRuPXdjX2NyZWF0ZV9vcmRlcigpOwogICAgJG4tPmFkZF9wcm9kdWN0KHdjX2dldF9wcm9kdWN0KDE4MjcyKSwxKTsKICAgICRzaD1uZXcgV0NfT3JkZXJfSXRlbV9TaGlwcGluZygpOyAkc2gtPnNldF9tZXRob2RfdGl0bGUoJ1ZFTklQQUsgS3VyamVyaXMnKTsKICAgICRzaC0+c2V0X21ldGhvZF9pZCgnc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfY291cmllcl9tZXRob2QnKTsgJHNoLT5zZXRfaW5zdGFuY2VfaWQoMik7ICRzaC0+c2V0X3RvdGFsKCc0Ljk5Jyk7ICRuLT5hZGRfaXRlbSgkc2gpOwogICAgJGFkcj1hcnJheSgnZmlyc3RfbmFtZSc9PidSYWltdW5kYXMnLCdsYXN0X25hbWUnPT4nQnVsYWthcycsJ2VtYWlsJz0+J3RlcnJhQHBldHNob3AubHQnLCdwaG9uZSc9PicrMzcwNjAwMDAwMDAnLCdhZGRyZXNzXzEnPT4nVGVzdG8gZy4gMScsJ2NpdHknPT4nVmlsbml1cycsJ3Bvc3Rjb2RlJz0+JzAxMTAwJywnY291bnRyeSc9PidMVCcpOwogICAgJG4tPnNldF9hZGRyZXNzKCRhZHIsJ2JpbGxpbmcnKTsgJG4tPnNldF9hZGRyZXNzKCRhZHIsJ3NoaXBwaW5nJyk7CiAgICAkbi0+c2V0X3BheW1lbnRfbWV0aG9kKCdiYWNzJyk7ICRuLT5zZXRfcGF5bWVudF9tZXRob2RfdGl0bGUoJ0JhbmtpbmlzIHBhdmVkaW1hcycpOyAkbi0+Y2FsY3VsYXRlX3RvdGFscygpOwogICAgYWRkX2ZpbHRlcignd29vY29tbWVyY2VfZW1haWxfZW5hYmxlZF9jdXN0b21lcl9wcm9jZXNzaW5nX29yZGVyJywnX19yZXR1cm5fZmFsc2UnKTsKICAgICRuLT51cGRhdGVfc3RhdHVzKCdwcm9jZXNzaW5nJywnUzE2MzkgdsSXbGF2aW1vIHRlc3R1aScsdHJ1ZSk7CiAgICAkbmlkPSRuLT5nZXRfaWQoKTsgJG9bJ3ZlbGF2aW1vX3V6c2FreW1hcyddPSRuaWQ7CiAgICAkcm09bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRGFyYmFsYXVraXMnLCd2ZWxhdmltb19sYWlza2FpJyk7ICRybS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICAgICRybS0+aW52b2tlKG51bGwsIGN1cnJlbnRfdGltZSgndGltZXN0YW1wJykrNSpEQVlfSU5fU0VDT05EUywgYXJyYXkoJG5pZCkpOwogICAgJG9bJ3ZlbGF2aW1vX3p5bWUnXT0oc3RyaW5nKXdjX2dldF9vcmRlcigkbmlkKS0+Z2V0X21ldGEoJ19wc192ZWxhdmltb19sYWlza2FzJyk7CiAgICAkej0oYXJyYXkpZ2V0X29wdGlvbigncHNfZGV2X3Bhc3Rhc196dXJuYWxhcycsYXJyYXkoKSk7CiAgICBmb3JlYWNoKGFycmF5X3NsaWNlKCR6LC02KSBhcyAkeCl7ICRvWyd6J11bXT0keFsnbGFpa2FzJ10uJyB8ICcuJHhbJ2thbSddLicgfCAnLiR4Wyd0ZW1hJ107IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRGaWxlKCkuJzonLiRlLT5nZXRMaW5lKCk7CiAgICAkej0oYXJyYXkpZ2V0X29wdGlvbigncHNfZGV2X3Bhc3Rhc196dXJuYWxhcycsYXJyYXkoKSk7CiAgICBmb3JlYWNoKGFycmF5X3NsaWNlKCR6LC00KSBhcyAkeCl7ICRvWyd6J11bXT0keFsnbGFpa2FzJ10uJyB8ICcuJHhbJ2thbSddLicgfCAnLiR4Wyd0ZW1hJ107IH0gfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-072509';
const GKEY='ps_n9';
const PHASES=["GO"];
const OUT='analize/s1639_r.json';
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
