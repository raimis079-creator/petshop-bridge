process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODAgaiDigJQgcmVhZC1vbmx5OiBrb2TEl2wgc3Ug4oCeR3JhbmRjYXJubyBsYW1iIDgwMCBnIiBrcmVwxaFlbHlqZSBrYXNvamUgbsSXcmEgTFAgRXhwcmVzcyDigJQgcHJla8SXLCBtZXRhLCBraWVrdmllbm8gZmlsdHJvIHJlenVsdGF0YXMuICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODBqJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYiwkd3BfZmlsdGVyOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTY4MCBqJyk7CiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIElEIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcG9zdF90aXRsZSBMSUtFICclcmFuZCVhcm5vJScgQU5EIChwb3N0X3RpdGxlIExJS0UgJyVhbWIlJyBPUiBwb3N0X3RpdGxlIExJS0UgJyXEl3JpZW4lJykgT1JERVIgQlkgSUQgTElNSVQgNiIpOwogIGZvcmVhY2goJGlkcyBhcyAkaSl7ICRwcj13Y19nZXRfcHJvZHVjdCgkaSk7ICRvWydrYW5kaWRhdGFpJ11bXT1hcnJheSgkaSwkcHItPmdldF9uYW1lKCksJHByLT5nZXRfc2t1KCksJHByLT5nZXRfd2VpZ2h0KCksJHByLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSwkcHItPmdldF9zdG9ja19zdGF0dXMoKSk7IH0KICAkcGlkPTA7IGZvcmVhY2goJGlkcyBhcyAkaSl7IGlmKHN0cmlwb3MoZ2V0X3RoZV90aXRsZSgkaSksJzgwMCcpIT09ZmFsc2UpeyAkcGlkPShpbnQpJGk7IGJyZWFrOyB9IH0gaWYoISRwaWQpICRwaWQ9KGludCkoJGlkc1swXT8/MCk7CiAgJHByPXdjX2dldF9wcm9kdWN0KCRwaWQpOyAkb1sncHJla2UnXT1hcnJheSgkcGlkLCRwcj8kcHItPmdldF9uYW1lKCk6bnVsbCwnc3ZvcmlzJz0+JHByPyRwci0+Z2V0X3dlaWdodCgpOm51bGwsJ2tpZWtpcyc9PiRwcj8kcHItPmdldF9zdG9ja19xdWFudGl0eSgpOm51bGwsJ3N0Jz0+JHByPyRwci0+Z2V0X3N0b2NrX3N0YXR1cygpOm51bGwsJ2tsYXNlJz0+JHByPyRwci0+Z2V0X3NoaXBwaW5nX2NsYXNzKCk6bnVsbCk7CiAgZm9yZWFjaChhcnJheSgnX3BzX3Rpa19rdXJqZXJpdScsJ19mdWxmaWxsbWVudF9jb3VyaWVyX29ubHknLCdfemJfZW5hYmxlZCcsJ19wc19zYWx0aW5pcycsJ19wc19zYW5kZWxpcycsJ19wc190aWVrZWphcycsJ192Zl9lbmFibGVkJywnX3BzX2tlbGlhcycsJ19mdWxmaWxsbWVudF9zb3VyY2UnKSBhcyAkaykgJG9bJ21ldGEnXVska109Z2V0X3Bvc3RfbWV0YSgkcGlkLCRrLHRydWUpOwogIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9GdWxmaWxsbWVudF9Tb3VyY2UnKSkgJG9bJ3Jlc29sdmUnXT1QZXRzaG9wX0Z1bGZpbGxtZW50X1NvdXJjZTo6cmVzb2x2ZSgkcGlkKTsKICB3Y19sb2FkX2NhcnQoKTsgV0MoKS0+c2Vzc2lvbi0+c2V0X2N1c3RvbWVyX3Nlc3Npb25fY29va2llKHRydWUpOyBXQygpLT5jYXJ0LT5lbXB0eV9jYXJ0KCk7ICRjaz1XQygpLT5jYXJ0LT5hZGRfdG9fY2FydCgkcGlkLDEpOyAkb1snY2FydCddPSRjaz8nb2snOidGQUlMICcud3Bfc3RyaXBfYWxsX3RhZ3Mod2NfcHJpbnRfbm90aWNlcyh0cnVlKSk7CiAgV0MoKS0+Y3VzdG9tZXItPnNldF9zaGlwcGluZ19jb3VudHJ5KCdMVCcpOyBXQygpLT5jdXN0b21lci0+c2V0X2JpbGxpbmdfY291bnRyeSgnTFQnKTsKICAkcGs9V0MoKS0+Y2FydC0+Z2V0X3NoaXBwaW5nX3BhY2thZ2VzKCk7ICRwazA9JHBrWzBdOyAkb1sna2cnXT1XQygpLT5jYXJ0LT5nZXRfY2FydF9jb250ZW50c193ZWlnaHQoKTsKICAkem9uZT1XQ19TaGlwcGluZ19ab25lczo6Z2V0X3pvbmVfbWF0Y2hpbmdfcGFja2FnZSgkcGswKTsgJHJhdGVzPWFycmF5KCk7IGZvcmVhY2goJHpvbmUtPmdldF9zaGlwcGluZ19tZXRob2RzKHRydWUpIGFzICRtKXsgJG0tPnJhdGVzPWFycmF5KCk7ICRtLT5jYWxjdWxhdGVfc2hpcHBpbmcoJHBrMCk7IGZvcmVhY2goJG0tPnJhdGVzIGFzICRyaWQ9PiRyKSAkcmF0ZXNbJHJpZF09JHI7IH0KICAkb1sncHJpZXNfZmlsdHJ1cyddPWFycmF5X2tleXMoJHJhdGVzKTsgJHBrMFsncmF0ZXMnXT0kcmF0ZXM7CiAgZm9yZWFjaCgkd3BfZmlsdGVyWyd3b29jb21tZXJjZV9wYWNrYWdlX3JhdGVzJ10tPmNhbGxiYWNrcyBhcyAkcHJpbz0+JGNicyl7IGZvcmVhY2goJGNicyBhcyAkY2IpeyAkZj0kY2JbJ2Z1bmN0aW9uJ107ICRubT1pc19hcnJheSgkZik/KGlzX29iamVjdCgkZlswXSk/Z2V0X2NsYXNzKCRmWzBdKTokZlswXSkuJzo6Jy4kZlsxXTooaXNfc3RyaW5nKCRmKT8kZjonY2xvc3VyZScpOyAkYmVmb3JlPWFycmF5X2tleXMoJHJhdGVzKTsgJHJhdGVzPWNhbGxfdXNlcl9mdW5jX2FycmF5KCRmLGFycmF5KCRyYXRlcywkcGswKSk7ICRvWydmaWx0cmFpJ11bXT0kcHJpby4nICcuJG5tLicg4oaSICcuaW1wbG9kZSgnLCcsYXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gcHJlZ19yZXBsYWNlKCcvXnNob3B1cF92ZW5pcGFrX3NoaXBwaW5nX3xed29vX2xpdGh1YW5pYXBvc3RfLycsJycsJHgpO30sYXJyYXlfa2V5cygkcmF0ZXMpKSk7IH0gfQogIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9SaW5raW5pYWknKSl7ICRyZj1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9SaW5raW5pYWknLCdwYXN0b21hdG9fc2FyZ2FzJyk7ICRzcmM9ZmlsZSgkcmYtPmdldEZpbGVOYW1lKCkpOyAkb1snc2FyZ2FzX3NyYyddPXByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyxpbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRzcmMsJHJmLT5nZXRTdGFydExpbmUoKS0xLCRyZi0+Z2V0RW5kTGluZSgpLSRyZi0+Z2V0U3RhcnRMaW5lKCkrMSkpKTsgfQogIFdDKCktPmNhcnQtPmVtcHR5X2NhcnQoKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-074933';
const GKEY='ps_s1680j';
const PHASES=["GO", "CL"];
const OUT='analize/s1680_j.json';
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
