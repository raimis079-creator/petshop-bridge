process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODQzZSBrbGFpZHUgdHlyaW1hcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NDNlJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxMDApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTg0M2UnXTsKICAkbGY9Jy9ob21lL2d5dnVuYWkyL2RvbWFpbnMvcGV0c2hvcC5sdC9sb2dzL3BocF9lcnJvci5sb2cnOyAkc3o9ZmlsZXNpemUoJGxmKTsgJGZoPWZvcGVuKCRsZiwncicpOyBmc2VlaygkZmgsbWF4KDAsJHN6LTMwMDAwMDApKTsgJHR4PWZyZWFkKCRmaCwzMDAwMDAwKTsgZmNsb3NlKCRmaCk7CiAgJHBhdHM9WydBdHRlbXB0IHRvIHJlYWQgcHJvcGVydHkgImVycm9ycyInLCdhY3Rpb25fc2NoZWR1bGVyX3J1bl9xdWV1ZScsJ2NsYXNzLXNoaXBtZW50cy5waHAnXTsKICAkTD1leHBsb2RlKCJcbiIsJHR4KTsgZm9yZWFjaCgkcGF0cyBhcyAkcCl7ICRoaXQ9W107IGZvcmVhY2goJEwgYXMgJGk9PiRsbil7IGlmKHN0cnBvcygkbG4sJHApIT09ZmFsc2UpeyAkY3R4PVtdOyBmb3IoJGo9bWF4KDAsJGktMik7JGo8PW1pbihjb3VudCgkTCktMSwkaSszKTskaisrKSAkY3R4W109bWJfc3Vic3RyKCRMWyRqXSwwLDMzMCk7ICRoaXRbXT0kY3R4OyB9IH0gJHJbJ2xvZyddWyRwXT1bJ24nPT5jb3VudCgkaGl0KSwncGFzayc9PmFycmF5X3NsaWNlKCRoaXQsLTMpXTsgfQogICRzcmM9ZnVuY3Rpb24oJGYsJGEsJGIpeyAkeD1AZmlsZSgkZik7IGlmKCEkeCkgcmV0dXJuICdORVJBJzsgJG89W107IGZvcigkaT0kYTskaTw9JGIgJiYgJGk8PWNvdW50KCR4KTskaSsrKSAkb1tdPSRpLic6ICcucnRyaW0obWJfc3Vic3RyKCR4WyRpLTFdLDAsMjAwKSk7IHJldHVybiAkbzsgfTsKICAkclsnc3JjX3NoaXAnXT0kc3JjKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3Mtc2hpcG1lbnRzLnBocCcsMTIyLDEzNik7CiAgJGxwPWdsb2IoV1BfUExVR0lOX0RJUi4nL3dvby1saXRodWFuaWFwb3N0LW1haW4vcHUqLyoucGhwJyk7ICRyWydscF9maWxlcyddPWFycmF5X21hcCgnYmFzZW5hbWUnLChhcnJheSkkbHApOwogICRyWydscF9vcHRzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsIExFRlQob3B0aW9uX3ZhbHVlLDIwMCkgdiBGUk9NIHskUH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyVscHNoaXBwaW5nJWRlYnVnJScgT1Igb3B0aW9uX25hbWUgTElLRSAnd29vX2xpdGh1YW5pYXBvc3QlbG9nJScgTElNSVQgMTAiLEFSUkFZX0EpOwogICRyWydhc19mYWlsJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgYS5ob29rLCBhLnN0YXR1cywgQ09VTlQoKikgbiwgTUFYKGEuc2NoZWR1bGVkX2RhdGVfZ210KSBwYXNrIEZST00geyRQfWFjdGlvbnNjaGVkdWxlcl9hY3Rpb25zIGEgV0hFUkUgYS5zdGF0dXMgSU4oJ2ZhaWxlZCcsJ3Bhc3QtZHVlJykgT1IgKGEuc3RhdHVzPSdwZW5kaW5nJyBBTkQgYS5zY2hlZHVsZWRfZGF0ZV9nbXQ8VVRDX1RJTUVTVEFNUCgpLUlOVEVSVkFMIDMwIE1JTlVURSkgR1JPVVAgQlkgMSwyIE9SREVSIEJZIG4gREVTQyBMSU1JVCAxNSIsQVJSQVlfQSk7CiAgJHJbJ2FzX2ZhaWxfMjRoJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgYS5ob29rLCBDT1VOVCgqKSBuLCBNQVgoYS5sYXN0X2F0dGVtcHRfZ210KSBwYXNrIEZST00geyRQfWFjdGlvbnNjaGVkdWxlcl9hY3Rpb25zIGEgV0hFUkUgYS5zdGF0dXM9J2ZhaWxlZCcgQU5EIGEubGFzdF9hdHRlbXB0X2dtdD49VVRDX1RJTUVTVEFNUCgpLUlOVEVSVkFMIDQ4IEhPVVIgR1JPVVAgQlkgMSBMSU1JVCAxMCIsQVJSQVlfQSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0OyB9KTsK';
const VER='dep-074641';
const GKEY='ps_s1843e';
const PHASES=["1"];
const OUT='analize/s1843_e.json';
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
