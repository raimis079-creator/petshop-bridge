process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzk1cmYyIHJlZmlsbCBhbmFsaXplIHYyIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc5NXJmMiddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTUwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3OTVyZjInXTsKICAkb2s9IihmLnRlc3RpbmlzPTAgT1IgZi50ZXN0aW5pcyBJUyBOVUxMKSBBTkQgZi5zdGF0dXNhc19nYWx1dGluaXMgTk9UIElOICgnY2FuY2VsbGVkJywnZmFpbGVkJywncmVmdW5kZWQnLCdwZW5kaW5nJywndHJhc2gnLCdjaGVja291dC1kcmFmdCcpIjsKICAkclsndXRtX3JlZmlsbCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGYuZGllbmEsZi51enNha3ltYXNfaWQgaWQsUk9VTkQoZi52aXNvX2N0LzEwMCwyKSBldXIsUk9VTkQoZi5rb250cmlidWNpamFfY3QvMTAwLDIpIGtvbnRyIEZST00geyRQfXBzX2Zha3RfdXpzYWt5bWFpIGYgV0hFUkUgJG9rIEFORCBmLnV0bV9jYW1wYWlnbj0ncmVmaWxsX2R1ZScgT1JERVIgQlkgZi5kaWVuYSIsQVJSQVlfQSk7CiAgZm9yZWFjaCgkclsndXRtX3JlZmlsbCddIGFzICYkdSl7ICRvPXdjX2dldF9vcmRlcigkdVsnaWQnXSk7ICR1WyduciddPSRvPyRvLT5nZXRfb3JkZXJfbnVtYmVyKCk6Jyc7IH0gdW5zZXQoJHUpOwogICRqb2JzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHJlY2lwaWVudF9lbWFpbCBlbSxzZW50X2F0LGNsaWNrZWRfYXQsY29udGV4dF9qc29uIGMgRlJPTSB7JFB9cHNfZW1haWxfam9icyBXSEVSRSBmbG93PSdyZWZpbGxfZHVlJyBBTkQgc3RhdHVzPSdzZW50JyBPUkRFUiBCWSBzZW50X2F0IixBUlJBWV9BKTsKICAkclsnc2VudF9qb2JzJ109Y291bnQoJGpvYnMpOyAkYnk9W107IGZvcmVhY2goJGpvYnMgYXMgJGopeyAkYnlbJGpbJ2VtJ11dW109JGo7IH0gJHJbJ2dhdmVqYWknXT1jb3VudCgkYnkpOwogICRyb3dzPVtdOyBmb3JlYWNoKCRieSBhcyAkZW09PiRqcyl7ICRmaXJzdD0kanNbMF1bJ3NlbnRfYXQnXTsgJHBpZHM9W107IGZvcmVhY2goJGpzIGFzICRqKXsgJGM9anNvbl9kZWNvZGUoJGpbJ2MnXSx0cnVlKTsgaWYoIWVtcHR5KCRjWydwcm9kdWN0X2lkJ10pKSAkcGlkc1tdPShpbnQpJGNbJ3Byb2R1Y3RfaWQnXTsgfQogICAgJG9zPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGYudXpzYWt5bWFzX2lkIGlkLG8uZGF0ZV9jcmVhdGVkX2dtdCBkdCxmLnZpc29fY3QsZi5rb250cmlidWNpamFfY3QsZi51dG1fY2FtcGFpZ24gdWMsZi5rYW5hbGFzX3Bhc2t1dGluaXMga2FuIEZST00geyRQfXBzX2Zha3RfdXpzYWt5bWFpIGYgSk9JTiB7JFB9d2Nfb3JkZXJzIG8gT04gby5pZD1mLnV6c2FreW1hc19pZCBXSEVSRSAkb2sgQU5EIG8uYmlsbGluZ19lbWFpbD0lcyBBTkQgby5kYXRlX2NyZWF0ZWRfZ210PiVzIE9SREVSIEJZIG8uZGF0ZV9jcmVhdGVkX2dtdCIsJGVtLCRmaXJzdCksQVJSQVlfQSk7CiAgICAkcm93PVsnc2VudCc9PnN1YnN0cigkZmlyc3QsMCwxMCksJ2xhaXNrdSc9PmNvdW50KCRqcyksJ2RpZW51X251byc9PnJvdW5kKCh0aW1lKCktc3RydG90aW1lKCRmaXJzdCkpLzg2NDAwKSwndXpzJz0+W11dOwogICAgZm9yZWFjaCgkb3MgYXMgJG8peyAkd289d2NfZ2V0X29yZGVyKCRvWydpZCddKTsgJHNhbWU9ZmFsc2U7IGlmKCR3byl7IGZvcmVhY2goJHdvLT5nZXRfaXRlbXMoKSBhcyAkaXQpeyAkcHA9JGl0LT5nZXRfdmFyaWF0aW9uX2lkKCk/OiRpdC0+Z2V0X3Byb2R1Y3RfaWQoKTsgaWYoaW5fYXJyYXkoJHBwLCRwaWRzLHRydWUpfHxpbl9hcnJheSgkaXQtPmdldF9wcm9kdWN0X2lkKCksJHBpZHMsdHJ1ZSkpICRzYW1lPXRydWU7IH0gfQogICAgICAkcm93Wyd1enMnXVtdPVsnbnInPT4kd28/JHdvLT5nZXRfb3JkZXJfbnVtYmVyKCk6JG9bJ2lkJ10sJ3BvX2QnPT5yb3VuZCgoc3RydG90aW1lKCRvWydkdCddKS1zdHJ0b3RpbWUoJGZpcnN0KSkvODY0MDAsMSksJ2V1cic9PiRvWyd2aXNvX2N0J10vMTAwLCdrb250cic9PiRvWydrb250cmlidWNpamFfY3QnXS8xMDAsJ2thbmFsYXMnPT4kb1sndWMnXT09PSdyZWZpbGxfZHVlJz8nUkVGSUxMJzokb1sna2FuJ10uJy8nLiRvWyd1YyddLCd0YV9wYXRpX3ByZWtlJz0+JHNhbWVdOyB9CiAgICAkcm93c1tdPSRyb3c7IH0KICAkclsnZ2F2ZWphaV9yb3dzJ109JHJvd3M7CiAgJHJbJ3RyYWNraW5nJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc3RhdHVzLENPVU5UKCopIG4sU1VNKHByZWRpY3RlZF9lbXB0eV9kYXRlPD1DVVJEQVRFKCkpIGphdV90dXJlam8sTUlOKHByZWRpY3RlZF9lbXB0eV9kYXRlKSBtaW5fZCBGUk9NIHskUH1wc19yZWZpbGxfdHJhY2tpbmcgR1JPVVAgQlkgc3RhdHVzIixBUlJBWV9BKTsKICAkclsnYnVzaW1pJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgREFURV9GT1JNQVQocHJlZGljdGVkX2VtcHR5X2RhdGUsJyVZLSVtJykgbSxDT1VOVCgqKSBuIEZST00geyRQfXBzX3JlZmlsbF90cmFja2luZyBXSEVSRSBzdGF0dXM9J2FjdGl2ZScgQU5EIHByZWRpY3RlZF9lbXB0eV9kYXRlPkNVUkRBVEUoKSBHUk9VUCBCWSBtIE9SREVSIEJZIG0iLEFSUkFZX0EpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsgfSk7Cg==';
const VER='dep-164334';
const GKEY='ps_s1795rf2';
const PHASES=["1"];
const OUT='analize/s1795_rf2.json';
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
