process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzgxYiBtaXNydXMgc3ByZW5kaW1hcyDigJQga29kbyBwYWllc2thIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc4MWInXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDEyMCk7ICRyPVsndic9PidTMTc4MWInXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogIHRyeXsKICAgICRwYXQ9Jy9taXNydXNfc3ByZW5kaW18X3BzX2tlbGlhc1tcJyJdfF9wc19rb25zb2xpZGFjaWphfGZ1bmN0aW9uIG1pc3J8dGllc2lhaVtcJyJdLyc7CiAgICAkZmlsZXM9YXJyYXlfbWVyZ2UoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLSoucGhwJyksZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC0qLyoucGhwJyksZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC0qL2luY2x1ZGVzLyoucGhwJykpOwogICAgJGg9W107CiAgICBmb3JlYWNoKCRmaWxlcyBhcyAkZmwpeyAkbHM9QGZpbGUoJGZsKTsgaWYoISRscykgY29udGludWU7ICRvPVtdOyBmb3JlYWNoKCRscyBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCRwYXQsJGwpKSAkb1tdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMjYwKSk7IH0gaWYoJG8pICRoW2Jhc2VuYW1lKCRmbCkuJyBtZDUgJy5zdWJzdHIobWQ1X2ZpbGUoJGZsKSwwLDgpXT1hcnJheV9zbGljZSgkbywwLDYwKTsgfQogICAgJHJbJ2hpdHMnXT0kaDsKICAgICRzbj0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lIEZST00geyRQfXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0xIEFORCAoY29kZSBMSUtFICclbWlzcnVzX3NwcmVuZGltJScgT1IgY29kZSBMSUtFICclX3BzX2tvbnNvbGlkYWNpamElJykiLEFSUkFZX0EpOyAkclsnc25pcHBldHMnXT0kc247CiAgICAvLyBraXRpIG1pc3J1cyB1enNha3ltYWkgc3UgVkYgKyBBVjoga29rcyBidXZvIHNwcmVuZGltYXMKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG0ub3JkZXJfaWQsIG0ubWV0YV92YWx1ZSBzcHIsIG4ubWV0YV92YWx1ZSBuciwgZy5tZXRhX3ZhbHVlIGdycCwgby5kYXRlX2NyZWF0ZWRfZ210IGQsIG8uc3RhdHVzIEZST00geyRQfXdjX29yZGVyc19tZXRhIG0gSk9JTiB7JFB9d2Nfb3JkZXJzIG8gT04gby5pZD1tLm9yZGVyX2lkIExFRlQgSk9JTiB7JFB9d2Nfb3JkZXJzX21ldGEgbiBPTiBuLm9yZGVyX2lkPW0ub3JkZXJfaWQgQU5EIG4ubWV0YV9rZXk9J19wc19vcmRlcl9udW1iZXInIExFRlQgSk9JTiB7JFB9d2Nfb3JkZXJzX21ldGEgZyBPTiBnLm9yZGVyX2lkPW0ub3JkZXJfaWQgQU5EIGcubWV0YV9rZXk9J19wc19ncm91cHMnIFdIRVJFIG0ubWV0YV9rZXk9J19wc19taXNydXNfc3ByZW5kaW1hcycgT1JERVIgQlkgbS5vcmRlcl9pZCBERVNDIExJTUlUIDQwIixBUlJBWV9BKTsKICAgIGZvcmVhY2goJHJvd3MgYXMgJiR4KXsgJGc9anNvbl9kZWNvZGUoJHhbJ2dycCddLHRydWUpOyAkeFsnZ3JwJ109aXNfYXJyYXkoJGcpP2ltcGxvZGUoJywnLGFycmF5X21hcChmbigkayk9PiRrLic6Jy4kZ1ska11bJ3ZpZW5ldGFpJ10sYXJyYXlfa2V5cygkZykpKTonJzsgfSB1bnNldCgkeCk7CiAgICAkclsna2l0aSddPSRyb3dzOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlR8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-094922';
const GKEY='ps_s1781b';
const PHASES=["1"];
const OUT='analize/s1781_b.json';
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
