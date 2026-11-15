process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODY5aCAjMjAgdXpzYWt5bW8gbnVtZXJpcyB0eXJpbWFzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTg2OWgnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE0MCk7IEBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCc1MTJNJyk7IGdsb2JhbCAkd3BkYiwgJHdwX2ZpbHRlcjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODY5aCddOwogIGZvcmVhY2goWyd3b29jb21tZXJjZV9vcmRlcl9udW1iZXInLCd3b29jb21tZXJjZV9zaG9wX29yZGVyX3NlYXJjaF9maWVsZHMnLCd3b29jb21tZXJjZV9vcmRlcl90YWJsZV9zZWFyY2hfcXVlcnlfbWV0YV9rZXlzJywnd29vY29tbWVyY2Vfc2hvcF9vcmRlcl9zZWFyY2hfcmVzdWx0cyddIGFzICRoKXsgJHJbJ2hvb2tzJ11bJGhdPVtdOyBpZihpc3NldCgkd3BfZmlsdGVyWyRoXSkpIGZvcmVhY2goJHdwX2ZpbHRlclskaF0tPmNhbGxiYWNrcyBhcyAkcHI9PiRjYnMpIGZvcmVhY2goJGNicyBhcyAkaWQ9PiRjYil7ICRmPSRjYlsnZnVuY3Rpb24nXTsgJHNyYz0nJzsgdHJ5eyBpZihpc19hcnJheSgkZikpeyAkcmY9bmV3IFJlZmxlY3Rpb25NZXRob2QoJGZbMF0sJGZbMV0pOyB9IGVsc2VpZihpc19zdHJpbmcoJGYpfHwkZiBpbnN0YW5jZW9mIENsb3N1cmUpeyAkcmY9bmV3IFJlZmxlY3Rpb25GdW5jdGlvbigkZik7IH0gJHNyYz1pc3NldCgkcmYpP3N0cl9yZXBsYWNlKEFCU1BBVEgsJycsJHJmLT5nZXRGaWxlTmFtZSgpKS4nOicuJHJmLT5nZXRTdGFydExpbmUoKTonJzsgdW5zZXQoJHJmKTt9Y2F0Y2goXFRocm93YWJsZSAkZSl7fSAkclsnaG9va3MnXVskaF1bXT0kcHIuJyAnLiRpZC4nICcuJHNyYzsgfSB9CiAgJG89d2NfZ2V0X29yZGVyKDM4NDI1KTsgJHJbJ28xNzE5J109WydpZCc9PiRvLT5nZXRfaWQoKSwnbnInPT4kby0+Z2V0X29yZGVyX251bWJlcigpLCdwbSc9PiRvLT5nZXRfcGF5bWVudF9tZXRob2QoKSwndGl0bGUnPT4kby0+Z2V0X3BheW1lbnRfbWV0aG9kX3RpdGxlKCldOwogICRyWydtZXRhX25yJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbWV0YV9rZXksIG1ldGFfdmFsdWUgRlJPTSB7JFB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgb3JkZXJfaWQ9Mzg0MjUgQU5EIChtZXRhX3ZhbHVlPScxNzE5JyBPUiBtZXRhX2tleSBMSUtFICclbnVtYmVyJScgT1IgbWV0YV9rZXkgTElLRSAnJW5yJScgT1IgbWV0YV9rZXkgTElLRSAnJXBheXNlcmElJykiLEFSUkFZX0EpOwogICRyWydocG9zJ109Z2V0X29wdGlvbignd29vY29tbWVyY2VfY3VzdG9tX29yZGVyc190YWJsZV9lbmFibGVkJyk7CiAgLy8gcGFpZXNrYSBXQwogIHRyeXsgJHE9d2NfZ2V0X29yZGVycyhbJ3MnPT4nMTcxOScsJ2xpbWl0Jz0+NSwncmV0dXJuJz0+J2lkcyddKTsgJHJbJ3djX3NfMTcxOSddPSRxOyB9Y2F0Y2goXFRocm93YWJsZSAkZSl7ICRyWyd3Y19zX2VyciddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICB0cnl7ICRxPXdjX2dldF9vcmRlcnMoWydzJz0+JzM4NDI1JywnbGltaXQnPT41LCdyZXR1cm4nPT4naWRzJ10pOyAkclsnd2Nfc18zODQyNSddPSRxOyB9Y2F0Y2goXFRocm93YWJsZSAkZSl7fQogIC8vIGZhaWxhaToga2FzIGt1cmlhIG51bWVyaSwgcGF5c2VyYSBvcmRlcmlkCiAgJGRpcnM9W1dQTVVfUExVR0lOX0RJUiwgV1BfUExVR0lOX0RJUl07ICRoaXRzPVtdOwogICRpdD1mdW5jdGlvbigkZCkgdXNlICgmJGl0KXsgJG91dD1bXTsgZm9yZWFjaChnbG9iKCRkLicvKicpPzpbXSBhcyAkeCl7IGlmKGlzX2RpcigkeCkpeyBpZihwcmVnX21hdGNoKCcjLyh2ZW5kb3J8bm9kZV9tb2R1bGVzfHdvb2NvbW1lcmNlfGxhbmd1YWdlc3xhc3NldHMpJCMnLCR4KSkgY29udGludWU7ICRvdXQ9YXJyYXlfbWVyZ2UoJG91dCwkaXQoJHgpKTsgfSBlbHNlaWYoc3Vic3RyKCR4LC00KT09PScucGhwJykgJG91dFtdPSR4OyB9IHJldHVybiAkb3V0OyB9OwogICRmaWxlcz1hcnJheV9tZXJnZShnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJyk/OltdLCAkaXQoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZScpLCAkaXQoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtZGVzaycpLCBnbG9iKFdQX1BMVUdJTl9ESVIuJy8qcGF5c2VyYSonLEdMT0JfT05MWURJUik/JGl0KGdsb2IoV1BfUExVR0lOX0RJUi4nLypwYXlzZXJhKicsR0xPQl9PTkxZRElSKVswXSk6W10pOwogICRyWydwYXlzZXJhX2RpciddPWdsb2IoV1BfUExVR0lOX0RJUi4nLypwYXlzZXJhKicsR0xPQl9PTkxZRElSKTsgJHJbJ3BsdWdpbnNfZGlycyddPWFycmF5X21hcCgnYmFzZW5hbWUnLGdsb2IoV1BfUExVR0lOX0RJUi4nLyonLEdMT0JfT05MWURJUikpOwogIGZvcmVhY2goJGZpbGVzIGFzICRmKXsgJEw9QGZpbGUoJGYpOyBpZighJEx8fGNvdW50KCRMKT4yMDAwMCkgY29udGludWU7IGZvcmVhY2goJEwgYXMgJGk9PiRsbil7IGlmKHByZWdfbWF0Y2goIi93b29jb21tZXJjZV9vcmRlcl9udW1iZXJ8J29yZGVyaWQnfFwib3JkZXJpZFwifF9wc190cnVtcGFzfF9vcmRlcl9udW1iZXJ8c2hvcF9vcmRlcl9zZWFyY2h8b3JkZXJfdGFibGVfc2VhcmNoL2kiLCRsbikpICRoaXRzW109c3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkZikuJzonLigkaSsxKS4nICcubWJfc3Vic3RyKHRyaW0oJGxuKSwwLDIwMCk7IH0gfQogICRyWydoaXRzJ109YXJyYXlfc2xpY2UoJGhpdHMsMCw4MCk7CiAgJHJbJ3NuaXAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSBGUk9NIHskUH1zbmlwcGV0cyBXSEVSRSBjb2RlIExJS0UgJyV3b29jb21tZXJjZV9vcmRlcl9udW1iZXIlJyBPUiBjb2RlIExJS0UgJyVvcmRlcmlkJScgT1IgY29kZSBMSUtFICclc2hvcF9vcmRlcl9zZWFyY2glJyIsQVJSQVlfQSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7IH0pOwo=';
const VER='dep-085750';
const GKEY='ps_s1869h';
const PHASES=["1"];
const OUT='analize/s1869_h.json';
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
