process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTUgcnVuIGU0ciDigJQgUkVDT04gKHRpayBza2FpdHltYXMpOiBrYXMgacWhcmHFoW8gQVZQTi9JQVBWIChncmVwIGNhc2UtaW5zZW5zaXRpdmUgbXUtcGx1Z2lucywgcGx1Z2lucywgdGVtYSwgYWt0eXbFq3Mgc25pcHBldCdhaSksIGhvb2snYWksIFBERiBnZW5lcmF0b3JpdXMsIGFyIHlyYSBrcmVkaXRpbsSXL3BlcnJhxaF5bWFzLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19lNHInXSkpIHJldHVybjsKICAkbz1hcnJheSgndic9PidTMTYxNSBlNHInKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyBzZXRfdGltZV9saW1pdCgyODApOwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkSj1mdW5jdGlvbigkbyl7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsgfTsKICAkY3R4PWZ1bmN0aW9uKCRjLCRwYXQsJGxlbj0xNDAwKXsgJGk9c3RyaXBvcygkYywkcGF0KTsgaWYoJGk9PT1mYWxzZSkgcmV0dXJuIG51bGw7IHJldHVybiBzdWJzdHIoJGMsbWF4KDAsJGktMzAwKSwkbGVuKTsgfTsKICB0cnl7CiAgJGhpdHM9YXJyYXkoKTsKICBmb3JlYWNoKGFycmF5X21lcmdlKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy8qLyoucGhwJyksZ2xvYihXUF9QTFVHSU5fRElSLicvKi8qLyoucGhwJyksZ2xvYihnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKS4nLyoucGhwJyksZ2xvYihnZXRfdGVtcGxhdGVfZGlyZWN0b3J5KCkuJy8qLnBocCcpKSBhcyAkZmYpeyAkYz0oc3RyaW5nKUBmaWxlX2dldF9jb250ZW50cygkZmYpOyBpZihzdHJpcG9zKCRjLCdhdnBuJykhPT1mYWxzZXx8c3RyaXBvcygkYywnaWFwdicpIT09ZmFsc2UpeyAkbj1wcmVnX21hdGNoX2FsbCgnL2F2cG58aWFwdi9pJywkYyk7IHByZWdfbWF0Y2hfYWxsKCcvYWRkXyhhY3Rpb258ZmlsdGVyKVwoXHMqW1wnIl0oW15cJyJdKylbXCciXS8nLCRjLCRtKTsgJGhpdHNbc3RyX3JlcGxhY2UoYXJyYXkoV1BNVV9QTFVHSU5fRElSLicvJyxXUF9QTFVHSU5fRElSLicvJyxXUF9DT05URU5UX0RJUi4nLycpLCcnLCRmZildPWFycmF5KCduJz0+JG4sJ3NpemUnPT5zdHJsZW4oJGMpLCdob29rcyc9PmFycmF5X3NsaWNlKGFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJG1bMl0pKSwwLDI1KSk7IH0gfQogICRvWydmaWxlcyddPSRoaXRzOwogICRzbj0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSxMRU5HVEgoY29kZSkgbGVuIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIChjb2RlIExJS0UgJyVhdnBuJScgT1IgY29kZSBMSUtFICclaWFwdiUnIE9SIGNvZGUgTElLRSAnJV9wZXRzaG9wX2ludm9pY2VfZG9jdW1lbnRfdHlwZSUnKSBBTkQgbmFtZSBOT1QgTElLRSAnVEVNUCUnIE9SREVSIEJZIGFjdGl2ZSBERVNDLCBpZCBERVNDIExJTUlUIDIwIixBUlJBWV9BKTsgJG9bJ3NuaXBwZXRzJ109JHNuOwogIGZvcmVhY2goJHNuIGFzICRzKXsgaWYoKGludCkkc1snYWN0aXZlJ10hPT0xKSBjb250aW51ZTsgJGM9KHN0cmluZykkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGNvZGUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgaWQ9JWQiLCRzWydpZCddKSk7IHByZWdfbWF0Y2hfYWxsKCcvYWRkXyhhY3Rpb258ZmlsdGVyKVwoXHMqW1wnIl0oW15cJyJdKylbXCciXVxzKixccyooW14sXCldezAsNjB9KS8nLCRjLCRtKTsgJG9bJ3NuaXAnXVskc1snaWQnXV09YXJyYXkoJ25hbWUnPT4kc1snbmFtZSddLCdob29rcyc9PmFycmF5X21hcChudWxsLCRtWzJdLCRtWzNdKSwnaGVhZCc9PnN1YnN0cigkYywwLDkwMCksJ2NvdW50ZXJfY3R4Jz0+JGN0eCgkYywncGV0c2hvcF9hdnBuX2NvdW50ZXInLDE2MDApLCdkb2NfdHlwZV9jdHgnPT4kY3R4KCRjLCdfcGV0c2hvcF9pbnZvaWNlX2RvY3VtZW50X3R5cGUnLDkwMCksJ2tyZWRpdCc9PnByZWdfbWF0Y2hfYWxsKCcva3JlZGl0fGNyZWRpdHxzdG9ybm98YW51bGl1L2knLCRjKSwncGRmJz0+cHJlZ19tYXRjaF9hbGwoJy9kb21wZGZ8bXBkZnx0Y3BkZnx3Y2RufHdwb193Y3BkZi9pJywkYywkbW0pP2FycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJG1tWzBdKSk6YXJyYXkoKSk7IH0KICAvLyAyIGZhaWxhaSBzdSBoaXRhaXMg4oCUIGtvbnRla3N0YXMKICBmb3JlYWNoKCRoaXRzIGFzICRmPT4kaCl7IGlmKCRoWyduJ108MykgY29udGludWU7ICRmZj0oc3RycG9zKCRmLCdwZXRzaG9wLScpPT09MCYmZmlsZV9leGlzdHMoV1BNVV9QTFVHSU5fRElSLicvJy4kZikpP1dQTVVfUExVR0lOX0RJUi4nLycuJGY6KGZpbGVfZXhpc3RzKFdQX1BMVUdJTl9ESVIuJy8nLiRmKT9XUF9QTFVHSU5fRElSLicvJy4kZjpXUF9DT05URU5UX0RJUi4nLycuJGYpOyAkYz0oc3RyaW5nKUBmaWxlX2dldF9jb250ZW50cygkZmYpOyAkb1snY3R4J11bJGZdPWFycmF5KCdjb3VudGVyJz0+JGN0eCgkYywncGV0c2hvcF9hdnBuX2NvdW50ZXInLDE0MDApLCdkb2NfdHlwZSc9PiRjdHgoJGMsJ19wZXRzaG9wX2ludm9pY2VfZG9jdW1lbnRfdHlwZScsODAwKSk7IH0KICAkb1snd2Nkbl9kaXInXT1hcnJheV9zbGljZShhcnJheV9tYXAoJ2Jhc2VuYW1lJyxnbG9iKHdwX3VwbG9hZF9kaXIoKVsnYmFzZWRpciddLicvd2Nkbi9pbnZvaWNlLyoucGRmJykpLC01KTsgJG9bJ3djZG5fbiddPWNvdW50KGdsb2Iod3BfdXBsb2FkX2RpcigpWydiYXNlZGlyJ10uJy93Y2RuL2ludm9pY2UvKi5wZGYnKSk7CiAgJG9bJ3N0YXR1c19ob29rcyddPWFycmF5KCk7IGZvcmVhY2goYXJyYXkoJ3dvb2NvbW1lcmNlX3BheW1lbnRfY29tcGxldGUnLCd3b29jb21tZXJjZV9vcmRlcl9zdGF0dXNfcHJvY2Vzc2luZycsJ3dvb2NvbW1lcmNlX29yZGVyX3N0YXR1c19jb21wbGV0ZWQnLCd3b29jb21tZXJjZV9jaGVja291dF9vcmRlcl9wcm9jZXNzZWQnLCd3b29jb21tZXJjZV9uZXdfb3JkZXInLCd3b29jb21tZXJjZV90aGFua3lvdScpIGFzICRoKXsgJGNiPWFycmF5KCk7IGlmKGlzc2V0KCRHTE9CQUxTWyd3cF9maWx0ZXInXVskaF0pKXsgZm9yZWFjaCgkR0xPQkFMU1snd3BfZmlsdGVyJ11bJGhdLT5jYWxsYmFja3MgYXMgJHByPT4kY2JzKXsgZm9yZWFjaCgkY2JzIGFzICRrPT4kdil7ICRmbj0kdlsnZnVuY3Rpb24nXTsgJGNiW109JHByLic6Jy4oaXNfc3RyaW5nKCRmbik/JGZuOihpc19hcnJheSgkZm4pPyhpc19vYmplY3QoJGZuWzBdKT9nZXRfY2xhc3MoJGZuWzBdKTokZm5bMF0pLic6OicuJGZuWzFdOidjbG9zdXJlJykpOyB9IH0gfSAkb1snc3RhdHVzX2hvb2tzJ11bJGhdPSRjYjsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogICRKKCRvKTsKfSw5OSk7Cg==';
const VER='dep-180241';
const GKEY='ps_e4r';
const PHASES=["R"];
const OUT='analize/s1615_e4r.json';
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
