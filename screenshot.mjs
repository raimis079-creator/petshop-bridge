process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQwcGEgYW5rZXRvcyBzY2hlbWEgcmVjb24gKDEgcmVhZC1vbmx5LCBiZSBQSUkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc0MHBhJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgQHNldF90aW1lX2xpbWl0KDEyMCk7ICRyPVsndic9PidTMTc0MHBhJ107CiAgdHJ5ewogICAgJHRhYnM9JHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIik7CiAgICBmb3JlYWNoKCR0YWJzIGFzICR0KXsgaWYoIXByZWdfbWF0Y2goJy9wZXR8YW5rZXR8bGF1a2FpfHJlZmlsbHxyZWNfbG9nfHdlaWdodHxwcmltaW58YnJhbmRfYWxpYXN8ZXZlbnRfbG9nfGVtYWlsX2pvYnN8c3RhdC9pJywkdCkpIGNvbnRpbnVlOwogICAgICAkY29scz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNIT1cgQ09MVU1OUyBGUk9NIGAkdGAiLEFSUkFZX0EpOyAkbz1bJ24nPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBgJHRgIiksJ3N0dWxwJz0+YXJyYXlfbWFwKGZ1bmN0aW9uKCRjKXtyZXR1cm4gJGNbJ0ZpZWxkJ10uJzonLnByZWdfcmVwbGFjZSgnL1woLiovJywnJywkY1snVHlwZSddKTt9LCRjb2xzKV07CiAgICAgICRkYz1udWxsOyBmb3JlYWNoKCRjb2xzIGFzICRjKXsgaWYocHJlZ19tYXRjaCgnL14oY3JlYXRlZF9hdHxzdWt1cnRhfGNyZWF0ZWR8bGFpa2FzfGRhdGF8ZGF0ZV9jcmVhdGVkfHRzfGNyZWF0ZWRfZ210KSQvJywkY1snRmllbGQnXSkpeyAkZGM9JGNbJ0ZpZWxkJ107IGJyZWFrOyB9IH0KICAgICAgaWYoJGRjKXsgJG9bJ2RhdGFfc3R1bHAnXT0kZGM7ICRvWydpbnRlcnZhbGFzJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBNSU4oYCRkY2ApIG1uLCBNQVgoYCRkY2ApIG14IEZST00gYCR0YCIsQVJSQVlfQSk7ICRvWydudW9fMDkwOSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIGAkdGAgV0hFUkUgYCRkY2A+PScyMDI2LTA5LTA5JyIpOyB9CiAgICAgIGZvcmVhY2goJGNvbHMgYXMgJGMpeyAkZj0kY1snRmllbGQnXTsgaWYocHJlZ19tYXRjaCgnL2VtYWlsfG5hbWV8dmFyZGFzfHBhdmFyZHxwaG9uZXx0ZWx8aXB8dG9rZW58aGFzaHxhZGRyZXNzfGFkcmVzL2knLCRmKSkgY29udGludWU7IGlmKHByZWdfbWF0Y2goJy9eKHRpcGFzfHR5cGV8ZXZlbnR8Zmxvd3xzdGF0dXN8c3BlY2llc3xzcml0aXN8c291cmNlfHNhbHRpbmlzfHN0ZXB8cmVhc29uX2NvZGV8cXVlc3Rpb25uYWlyZV92ZXJzaW9ufHByaW1hcnlfbmVlZHxpc19zdGVyaWxpc2VkfGFjdGl2aXR5fGdlbmRlcnxseXRpcykkL2knLCRmKSl7ICRkPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBgJGZgKSBGUk9NIGAkdGAiKTsgaWYoJGQ8PTMwKSAkb1sncGFzaXNrJ11bJGZdPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGAkZmAgdiwgQ09VTlQoKikgbiBGUk9NIGAkdGAgR1JPVVAgQlkgYCRmYCBPUkRFUiBCWSBuIERFU0MgTElNSVQgMzAiLEFSUkFZX0EpOyB9IH0KICAgICAgJHJbJ3QnXVskdF09JG87IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-214757';
const GKEY='ps_s1740pa';
const PHASES=["1"];
const OUT='analize/s1740pa.json';
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
