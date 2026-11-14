process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODY3ZiBhdXRvLXB1Ymxpc2ggdHlyaW1hcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NjdmJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNDApOyBAaW5pX3NldCgnbWVtb3J5X2xpbWl0JywnNTEyTScpOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTg2N2YnXTsKICAkclsnYXAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtLnBvc3RfaWQgaWQsIG0ubWV0YV92YWx1ZSBhcCwgcC5wb3N0X3N0YXR1cyBzdCwgcC5wb3N0X21vZGlmaWVkIG1vZF8sIExFRlQocC5wb3N0X3RpdGxlLDUwKSB0LCAoU0VMRUNUIExFRlQobWV0YV92YWx1ZSw0MCkgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1tLnBvc3RfaWQgQU5EIG1ldGFfa2V5PSdfcHNfcmFua2FfaXNpbXRhJyBMSU1JVCAxKSByYW5rYSwgKFNFTEVDVCBMRUZUKG1ldGFfdmFsdWUsMzApIEZST00geyRQfXBvc3RtZXRhIFdIRVJFIHBvc3RfaWQ9bS5wb3N0X2lkIEFORCBtZXRhX2tleT0nX3BzX3ZtdnRfaXNpbXRhJyBMSU1JVCAxKSB2bXZ0LCAoU0VMRUNUIExFRlQobWV0YV92YWx1ZSwzMCkgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgcG9zdF9pZD1tLnBvc3RfaWQgQU5EIG1ldGFfa2V5PSdfdmZfc2tpcF9yZWFzb24nIExJTUlUIDEpIHNraXAgRlJPTSB7JFB9cG9zdG1ldGEgbSBKT0lOIHskUH1wb3N0cyBwIE9OIHAuSUQ9bS5wb3N0X2lkIFdIRVJFIG0ubWV0YV9rZXk9J192Zl9hdXRvX3B1Ymxpc2hlZF9hdCcgQU5EIG0ubWV0YV92YWx1ZT49JzIwMjYtMTEtMTInIE9SREVSIEJZIG0ubWV0YV92YWx1ZSBERVNDIExJTUlUIDQwIixBUlJBWV9BKTsKICAkclsndm12dF9wdWInXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELCBwLnBvc3Rfc3RhdHVzLCBMRUZUKHAucG9zdF90aXRsZSw1MCkgdCBGUk9NIHskUH1wb3N0cyBwIEpPSU4geyRQfXBvc3RtZXRhIG0gT04gbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXk9J19wc192bXZ0X2lzaW10YScgV0hFUkUgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCciLEFSUkFZX0EpOwogICRyWyd2bXZ0X24nXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfcHNfdm12dF9pc2ltdGEnIik7CiAgJHJbJ3JhbmthX3B1YiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQsIExFRlQocC5wb3N0X3RpdGxlLDUwKSB0IEZST00geyRQfXBvc3RzIHAgSk9JTiB7JFB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0nX3BzX3JhbmthX2lzaW10YScgQU5EIG0ubWV0YV92YWx1ZT0ndGFpcCcgV0hFUkUgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgTElNSVQgMjAiLEFSUkFZX0EpOwogICRmaWxlcz1hcnJheV9tZXJnZShnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJyk/OltdLCBnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXhtbC8qLnBocCcpPzpbXSwgZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwvaW5jbHVkZXMvKi5waHAnKT86W10pOwogIGZvcmVhY2goWydfdmZfYXV0b19wdWJsaXNoZWRfYXQnLCdfcHNfcmFua2FfaXNpbXRhJ10gYXMgJG5lZWRsZSl7IGZvcmVhY2goJGZpbGVzIGFzICRmKXsgJEw9QGZpbGUoJGYpOyBpZighJEwpIGNvbnRpbnVlOyBmb3JlYWNoKCRMIGFzICRpPT4kbG4peyBpZihzdHJwb3MoJGxuLCRuZWVkbGUpIT09ZmFsc2UpICRyWydoaXQnXVskbmVlZGxlXVtdPWJhc2VuYW1lKCRmKS4nOicuKCRpKzEpLicgJy5tYl9zdWJzdHIodHJpbSgkbG4pLDAsMjIwKTsgfSB9IH0KICAkclsnc25pcCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlIEZST00geyRQfXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0xIEFORCAoY29kZSBMSUtFICclX3ZmX2F1dG9fcHVibGlzaGVkX2F0JScgT1IgY29kZSBMSUtFICclX3BzX3JhbmthX2lzaW10YSUnKSIsQVJSQVlfQSk7CiAgJHNsPVsnbGl0dGxlLW9uZS1rYWxlZGluaXMnLCdldmV4aWEnXTsgJHJbJ2FjYyddPVtdOwogIGZvcmVhY2goWycnLCcuMSddIGFzICRzZngpeyAkZng9ZGlybmFtZShBQlNQQVRIKS4nL2xvZ3MvTm92LTIwMjYudGFyLmd6Jy4kc2Z4OyAkaD1AZ3pvcGVuKCRmeCwncmInKTsgaWYoISRoKSBjb250aW51ZTsgd2hpbGUoKCRsbj1nemdldHMoJGgsODE5MikpIT09ZmFsc2UpeyBmb3JlYWNoKCRzbCBhcyAkcyl7IGlmKHN0cmlwb3MoJGxuLCRzKSE9PWZhbHNlICYmIHByZWdfbWF0Y2goJyNcWyhbXlxdXSspXF0gIihcdyspIChbXiAiXSopW14iXSoiIChcZHszfSkjJywkbG4sJG0pKSAkclsnYWNjJ11bXT0kbVsxXS4nICcuJG1bMl0uJyAnLm1iX3N1YnN0cigkbVszXSwwLDkwKS4nICcuJG1bNF07IH0gfSBnemNsb3NlKCRoKTsgfQogICRyWydhY2MnXT1hcnJheV9zbGljZSgkclsnYWNjJ10sLTI1KTsKICAkclsnY3JvbjA2MDAnXT1bXTsgZm9yZWFjaChfZ2V0X2Nyb25fYXJyYXkoKSBhcyAkdHM9PiRob29rcyl7ICR0PShuZXcgRGF0ZVRpbWUoJ0AnLiR0cykpLT5zZXRUaW1lem9uZShuZXcgRGF0ZVRpbWVab25lKCdFdXJvcGUvVmlsbml1cycpKS0+Zm9ybWF0KCdIOmknKTsgaWYoJHQ+PScwNTo1NScmJiR0PD0nMDY6MDUnKSBmb3JlYWNoKCRob29rcyBhcyAkaD0+JHgpICRyWydjcm9uMDYwMCddW109JHQuJyAnLiRoOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7IH0pOwo=';
const VER='dep-085315';
const GKEY='ps_s1867f';
const PHASES=["1"];
const OUT='analize/s1867_f.json';
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
