process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODgxYSBhdHNpc2FreW1vIGZ1bmtjaWpvcyBwYXRpa3JhIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTg4MWEnXSkpIHJldHVybjsgJHI9Wyd2Jz0+J2ExJ107IGdsb2JhbCAkd3BkYjsgQHNldF90aW1lX2xpbWl0KDEyMCk7CiAgdHJ5ewogICRuZWVkbGVzPVsndHNpc2FreXRpIHN1dGFydCcsJ3RzaXNha3ltbyBmdW5rYycsJ3ZhbGlkX29yZGVyX3N0YXR1c2VzX2Zvcl9jYW5jZWwnLCdjYW5jZWxfb3JkZXInLCdvcmRlcl9idXR0b25fdGV4dCcsJ3dpdGhkcmF3J107CiAgJGRpcnM9W1dQTVVfUExVR0lOX0RJUiwgZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCldOwogICRoaXRzPVtdOwogIGZvcmVhY2goJGRpcnMgYXMgJGQpeyBpZighaXNfZGlyKCRkKSkgY29udGludWU7CiAgICAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRkLEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSk7CiAgICBmb3JlYWNoKCRpdCBhcyAkZil7IGlmKHN1YnN0cigkZi0+Z2V0RmlsZW5hbWUoKSwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOyBpZigkZi0+Z2V0U2l6ZSgpPjYwMDAwMCkgY29udGludWU7ICRjPUBmaWxlX2dldF9jb250ZW50cygkZi0+Z2V0UGF0aG5hbWUoKSk7IGlmKCRjPT09ZmFsc2UpIGNvbnRpbnVlOwogICAgICBmb3JlYWNoKCRuZWVkbGVzIGFzICRuKXsgJGs9c3Vic3RyX2NvdW50KCRjLCRuKTsgaWYoJGspICRoaXRzWyRuXVtdPXN0cl9yZXBsYWNlKFdQX0NPTlRFTlRfRElSLCcnLCRmLT5nZXRQYXRobmFtZSgpKS4nIHgnLiRrOyB9IH0gfQogICRyWydmYWlsYWknXT0kaGl0czsKICAkc3Q9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBjb2RlIExJS0UgJyV0c2lzYWt5dGkgc3V0YXJ0JScgT1IgY29kZSBMSUtFICcldmFsaWRfb3JkZXJfc3RhdHVzZXNfZm9yX2NhbmNlbCUnIE9SIGNvZGUgTElLRSAnJW9yZGVyX2J1dHRvbl90ZXh0JScgT1IgY29kZSBMSUtFICclY2FuY2VsX29yZGVyJSciLEFSUkFZX0EpOwogICRyWydzbmlwcGV0YWknXT0kc3Q7CiAgJHJbJ3B1c2xhcGlhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfdGl0bGUscG9zdF9zdGF0dXMscG9zdF90eXBlLHBvc3RfbmFtZSBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3Rfc3RhdHVzIElOKCdwdWJsaXNoJywnZHJhZnQnLCdwcml2YXRlJykgQU5EIHBvc3RfdHlwZSBJTigncGFnZScsJ3Bvc3QnLCd3cF9ibG9jaycsJ2Jsb2NrcycpIEFORCAocG9zdF9jb250ZW50IExJS0UgJyV0c2lzYWt5dGkgc3V0YXJ0JScgT1IgcG9zdF90aXRsZSBMSUtFICcldHNpc2FrJScpIExJTUlUIDMwIixBUlJBWV9BKTsKICAkclsnbWVuaXUnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxwb3N0X3RpdGxlIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSduYXZfbWVudV9pdGVtJyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCAocG9zdF90aXRsZSBMSUtFICcldHNpc2FrJScgT1IgcG9zdF90aXRsZSBMSUtFICclcsSFxb5pbiUnKSIsQVJSQVlfQSk7CiAgJHJbJ2NhbmNlbF9zdGF0dXNhaSddPWFwcGx5X2ZpbHRlcnMoJ3dvb2NvbW1lcmNlX3ZhbGlkX29yZGVyX3N0YXR1c2VzX2Zvcl9jYW5jZWwnLFsncGVuZGluZycsJ2ZhaWxlZCddLG51bGwpOwogICRhY3Q9W107CiAgZm9yZWFjaChbJ3BlbmRpbmcnLCdvbi1ob2xkJywncHJvY2Vzc2luZycsJ2NvbXBsZXRlZCddIGFzICRzKXsgJG89d2NfZ2V0X29yZGVycyhbJ3N0YXR1cyc9PiRzLCdsaW1pdCc9PjEsJ29yZGVyYnknPT4nZGF0ZScsJ29yZGVyJz0+J0RFU0MnXSk7IGlmKCEkbyl7ICRhY3RbJHNdPSduZXJhIHV6c2FreW1vJzsgY29udGludWU7IH0KICAgICRhPXdjX2dldF9hY2NvdW50X29yZGVyc19hY3Rpb25zKCRvWzBdKTsgJGFjdFskc109WydpZCc9PiRvWzBdLT5nZXRfaWQoKSwndmVpa3NtYWknPT5hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiAkeFsnbmFtZSddO30sJGEpXTsgfQogICRyWydwYXNreXJvc192ZWlrc21haSddPSRhY3Q7CiAgJHJbJ215Z3R1a2FzX2JlbmRyYXMnXT1hcHBseV9maWx0ZXJzKCd3b29jb21tZXJjZV9vcmRlcl9idXR0b25fdGV4dCcsX18oJ1BsYWNlIG9yZGVyJywnd29vY29tbWVyY2UnKSk7CiAgJGd3PVtdOyBmb3JlYWNoKFdDKCktPnBheW1lbnRfZ2F0ZXdheXMoKS0+cGF5bWVudF9nYXRld2F5cygpIGFzICRpZD0+JGcpeyBpZigkZy0+ZW5hYmxlZD09PSd5ZXMnKSAkZ3dbJGlkXT1bJ3RpdGxlJz0+JGctPmdldF90aXRsZSgpLCdteWd0dWthcyc9PiRnLT5vcmRlcl9idXR0b25fdGV4dF07IH0KICAkclsnc2FsdGluaWFpX21va2VqaW1vJ109JGd3OwogICRwaWQ9d2NfZ2V0X3BhZ2VfaWQoJ3Rlcm1zJyk7ICRyWyd0YWlzeWtsaXVfcHNsJ109JHBpZD4wP1skcGlkLGdldF90aGVfdGl0bGUoJHBpZCksZ2V0X3Blcm1hbGluaygkcGlkKV06bnVsbDsKICBmb3JlYWNoKFsnZ3JhemluaW1hcycsJ3RhaXN5a2xlcyddIGFzICRzbHVnKXsgJHA9Z2V0X3BhZ2VfYnlfcGF0aCgkc2x1Zyk7IGlmKCRwKXsgJHQ9d3Bfc3RyaXBfYWxsX3RhZ3MoJHAtPnBvc3RfY29udGVudCk7ICRwb3M9bWJfc3RyaXBvcygkdCwnYXRzaXNhaycpOyAkclsncHNsXycuJHNsdWddPVsnaWQnPT4kcC0+SUQsJ2lsZ2lzJz0+bWJfc3RybGVuKCR0KSwnaXN0cmF1a2EnPT4kcG9zIT09ZmFsc2U/bWJfc3Vic3RyKCR0LG1heCgwLCRwb3MtMjAwKSw3MDApOicoem9kemlvICJhdHNpc2FrIiBuZXJhKSddOyB9IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwxKTsK';
const VER='dep-195610';
const GKEY='ps_s1881a';
const PHASES=["1"];
const OUT='analize/s1881_a.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
