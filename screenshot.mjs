process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA3dW4gYXRzaXNha8SZIEwyIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgwN3VrJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJEs9JFAuJ3BzX3JlbGF1bmNoX2tvbnRha3RhaSc7ICRyPVsndic9Pid1ayddOwogICR0b2s9UGV0c2hvcF9TZW5kZXJfQWRhcHRlcjo6Z2V0X3N0b3JlZF90b2tlbignbWFya2V0aW5nJyk7CiAgJGFwaT1mdW5jdGlvbigkbSwkcCkgdXNlKCR0b2speyAkeD13cF9yZW1vdGVfcmVxdWVzdCgnaHR0cHM6Ly9hcGkuc2VuZGVyLm5ldC92MicuJHAsWydtZXRob2QnPT4kbSwndGltZW91dCc9PjI1LCdoZWFkZXJzJz0+WydBdXRob3JpemF0aW9uJz0+J0JlYXJlciAnLiR0b2ssJ0FjY2VwdCc9PidhcHBsaWNhdGlvbi9qc29uJ11dKTsgcmV0dXJuIFsnY29kZSc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCR4KSwnYm9keSc9Pmpzb25fZGVjb2RlKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCR4KSx0cnVlKV07IH07CiAgJG89Z2V0X29wdGlvbigncHNfcmVsYXVuY2hfbDJfa2F0ZScpOyBmb3JlYWNoKFsnY2FsYycsJ3N0ZCddIGFzICRrKXsgJHg9JGFwaSgnR0VUJywnL2NhbXBhaWducy8nLiRvWyRrXSk7ICRkPSR4Wydib2R5J11bJ2RhdGEnXT8/W107ICRrZWVwPVtdOyBmb3JlYWNoKCRkIGFzICRraz0+JHZ2KXsgaWYoaXNfc2NhbGFyKCR2dikmJnByZWdfbWF0Y2goJy9zZW50fG9wZW58Y2xpY2t8Ym91bmNlfHVuc3VifHNwYW18Y29tcGxhaW4vaScsJGtrKSkgJGtlZXBbJGtrXT0kdnY7IH0gJHJbJ2NhbXAnXVska109JGtlZXA7IH0KICAkZW09JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgTE9XRVIoZW1haWwpIGUsaGVyb19yZWFzb24sbGFzdF9mb29kX2RhdGUsa2xpa19uLGF0aWRhcmVfbiBGUk9NICRLIFdIRVJFIGJhbmdhPScyYiciLE9CSkVDVF9LKTsKICAkcGc9MTsgJHVuPVtdOyBkb3sgJHg9JGFwaSgnR0VUJywnL3N1YnNjcmliZXJzP2xpbWl0PTEwMCZwYWdlPScuJHBnKTsgZm9yZWFjaCgoYXJyYXkpKCR4Wydib2R5J11bJ2RhdGEnXT8/W10pIGFzICRzKXsgJGU9c3RydG9sb3dlcigkc1snZW1haWwnXT8/JycpOyBpZihpc3NldCgkZW1bJGVdKSAmJiAoJHNbJ3N0YXR1cyddWydlbWFpbCddPz8nJykhPT0nYWN0aXZlJyl7ICRjPSRlbVskZV07ICR1bltdPVskc1snc3RhdHVzJ11bJ2VtYWlsJ10/Pyc/JywkYy0+aGVyb19yZWFzb24sc3Vic3RyKCRjLT5sYXN0X2Zvb2RfZGF0ZSwwLDcpLCRjLT5rbGlrX24sJGMtPmF0aWRhcmVfbl07IH0gfSAkbGFzdD0keFsnYm9keSddWydtZXRhJ11bJ2xhc3RfcGFnZSddPz8xOyAkcGcrKzsgfSB3aGlsZSgkcGc8PSRsYXN0JiYkcGc8NjApOwogICRyWyduZWFrdHl2dXNfMmInXT0kdW47ICRyWyd1enNfMmInXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvLmlkLG8udG90YWxfYW1vdW50LG8uZGF0ZV9jcmVhdGVkX2dtdCxrLmJhbmdhIEZST00geyRQfXdjX29yZGVycyBvIEpPSU4gJEsgayBPTiBMT1dFUihrLmVtYWlsKT1MT1dFUihvLmJpbGxpbmdfZW1haWwpIFdIRVJFIG8udHlwZT0nc2hvcF9vcmRlcicgQU5EIG8uc3RhdHVzIElOKCd3Yy1wcm9jZXNzaW5nJywnd2MtY29tcGxldGVkJywnd2Mtb24taG9sZCcpIEFORCBvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTEwLTI5IDA4OjAwOjAwJyBBTkQgay5iYW5nYSBJTignMmInLCdIMmInLCcyYScsJ0gyYScpIixBUlJBWV9BKTsgJHJbJ3ByaW1pbmtfMmInXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwYXNrX3V0bSxDT1VOVCgqKSBuIEZST00gJEsgV0hFUkUgYmFuZ2E9JzJiJyBBTkQgcHJpbWlua19hdCBJUyBOT1QgTlVMTCBHUk9VUCBCWSBwYXNrX3V0bSIsQVJSQVlfQSk7ICRyWydkb2dfcG9vbCddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkSyBXSEVSRSBydXNpcz0nc3VvJyBBTkQgaGVyb19yZWFzb24gSU4oJ3JlY2VudF9leGFjdCcsJ3JlcGVhdF9leGFjdCcsJ29sZF9wdXJjaGFzZScpIEFORCBiYW5nYSBJUyBOVUxMIik7ICRyWycyYl9wYWdhbF9oZXJvJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaGVyb19yZWFzb24sQ09VTlQoKikgbixTVU0oYXRpZGFyZV9uPjApIGF0aWQsU1VNKGtsaWtfbj4wKSBrbGlrIEZST00gJEsgV0hFUkUgYmFuZ2E9JzJiJyBHUk9VUCBCWSBoZXJvX3JlYXNvbiIsQVJSQVlfQSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwxKTsK';
const VER='dep-154701';
const GKEY='ps_s1807uk';
const PHASES=["1"];
const OUT='analize/s1807_uk.json';
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
