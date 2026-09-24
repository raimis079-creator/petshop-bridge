process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE1YSBXb25kZXIga3JhaWthaSByZWNvbiByZWFkLW9ubHkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzE1YSddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTcxNWEnXTsgQHNldF90aW1lX2xpbWl0KDE3MCk7IGdsb2JhbCAkd3BkYjsgJHI9Wyd2Jz0+J1MxNzE1YScsJ2ZhemUnPT4kZl07ICRQPSR3cGRiLT5wcmVmaXg7CiAgdHJ5ewogIGlmKCRmPT09JzEnKXsKICAgICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBJRCBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzIElOICgncHVibGlzaCcsJ2RyYWZ0JywncHJpdmF0ZScpIEFORCAocG9zdF90aXRsZSBMSUtFICclV29uZGVyJScgT1IgcG9zdF90aXRsZSBMSUtFICcld29uZGVyJScpIik7CiAgICAkclsnbiddPWNvdW50KCRpZHMpOwogICAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICRwPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcCkgY29udGludWU7ICRtPWdldF9wb3N0X21ldGEoJGlkKTsKICAgICAgJHNyYz0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBzb3VyY2UsIHN0b2NrX3F0eSwgYWN0aXZlLCBjb3N0X25ldCwgdXBkYXRlZF9hdCBGUk9NIHskUH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQ9JWQiLCRpZCksQVJSQVlfQSk7CiAgICAgICRyWydwcmVrZXMnXVskaWRdPVsncGF2Jz0+JHAtPmdldF9uYW1lKCksJ3N0YXR1cyc9PiRwLT5nZXRfc3RhdHVzKCksJ3RpcGFzJz0+JHAtPmdldF90eXBlKCksJ3N0b2NrX3N0YXR1cyc9PiRwLT5nZXRfc3RvY2tfc3RhdHVzKCksJ21hbmFnZSc9PiRwLT5nZXRfbWFuYWdlX3N0b2NrKCksJ19zdG9jayc9PiRtWydfc3RvY2snXVswXT8/bnVsbCwnb3duJz0+JG1bJ19vd25fc3RvY2tfcXR5J11bMF0/P251bGwsJ3NhbmRlbGlzJz0+JG1bJ19wc19zYW5kZWxpcyddWzBdPz9udWxsLCd2Zl9xdHknPT4kbVsnX3ZmX3F0eSddWzBdPz9udWxsLCd6Yl9xdHknPT4kbVsnX3piX3F0eSddWzBdPz9udWxsLCdpc19wdXJjaGFzYWJsZSc9PiRwLT5pc19wdXJjaGFzYWJsZSgpLCdpc19pbl9zdG9jayc9PiRwLT5pc19pbl9zdG9jaygpLCdiYWNrb3JkZXJzJz0+JHAtPmdldF9iYWNrb3JkZXJzKCksJ2Ryb3BzaGlwX3Bhc2xlcHRhJz0+JG1bJ19wc19kcm9wc2hpcF9wYXNsZXB0YSddWzBdPz9udWxsLCd2aXNpYmlsaXR5Jz0+JHAtPmdldF9jYXRhbG9nX3Zpc2liaWxpdHkoKSwna2FpbmEnPT4kcC0+Z2V0X3ByaWNlKCksJ3BzX3NvdXJjZXMnPT4kc3JjLCdtb2RpZmllZCc9PmdldF9wb3N0X2ZpZWxkKCdwb3N0X21vZGlmaWVkJywkaWQpLCd1cmwnPT5nZXRfcGVybWFsaW5rKCRpZCldOwogICAgICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfQVZfU291cmNlJykmJm1ldGhvZF9leGlzdHMoJ1BldHNob3BfQVZfU291cmNlJywncmVzb2x2ZScpKXsgdHJ5eyAkclsncHJla2VzJ11bJGlkXVsncmVzb2x2ZSddPVBldHNob3BfQVZfU291cmNlOjpyZXNvbHZlKCRpZCwxKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydwcmVrZXMnXVskaWRdWydyZXNvbHZlJ109J0VSUiAnLiRlLT5nZXRNZXNzYWdlKCk7IH0gfQogICAgfQogICAgLy8ga2FzIHJhxaFvIOKAnm7El3JhIiBrcmVwxaFlbHlqZSDigJQgYWRkX3RvX2NhcnRfdmFsaWRhdGlvbiAvIGNoZWNrX2NhcnRfaXRlbXMga2FibGlhaQogICAgZm9yZWFjaChbJ3dvb2NvbW1lcmNlX2FkZF90b19jYXJ0X3ZhbGlkYXRpb24nLCd3b29jb21tZXJjZV9jaGVja19jYXJ0X2l0ZW1zJywnd29vY29tbWVyY2VfdXBkYXRlX2NhcnRfdmFsaWRhdGlvbicsJ3dvb2NvbW1lcmNlX2lzX3B1cmNoYXNhYmxlJywnd29vY29tbWVyY2VfcHJvZHVjdF9pc19pbl9zdG9jaycsJ3dvb2NvbW1lcmNlX2dldF9hdmFpbGFiaWxpdHlfdGV4dCddIGFzICRoKXsgZ2xvYmFsICR3cF9maWx0ZXI7IGlmKCFpc3NldCgkd3BfZmlsdGVyWyRoXSkpIGNvbnRpbnVlOyBmb3JlYWNoKCR3cF9maWx0ZXJbJGhdLT5jYWxsYmFja3MgYXMgJHByaW89PiRjYnMpeyBmb3JlYWNoKCRjYnMgYXMgJGNiKXsgJGZuPSRjYlsnZnVuY3Rpb24nXTsgJHJbJ2thYmxpYWknXVskaF1bXT0kcHJpby4nOiAnLihpc19hcnJheSgkZm4pPyhpc19vYmplY3QoJGZuWzBdKT9nZXRfY2xhc3MoJGZuWzBdKTokZm5bMF0pLic6OicuJGZuWzFdOihpc19zdHJpbmcoJGZuKT8kZm46J2Nsb3N1cmUnKSk7IH0gfSB9CiAgICAvLyDEr3Z5a2lhaSBwZXIgMyBkLiBzdSBXb25kZXIgcHJla8SXbWlzIChwc193ZWJfaXZ5a2lhaSkKICAgICRjb2xzPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JFB9cHNfd2ViX2l2eWtpYWkiKTsgJHJbJ2l2eWtpdV9jb2xzJ109JGNvbHM7CiAgICAkaWRsPWltcGxvZGUoJywnLGFycmF5X21hcCgnaW50dmFsJywkaWRzPzpbMF0pKTsKICAgICRwYz1pbl9hcnJheSgncHJla2VfaWQnLCRjb2xzKT8ncHJla2VfaWQnOihpbl9hcnJheSgncHJvZHVjdF9pZCcsJGNvbHMpPydwcm9kdWN0X2lkJzpudWxsKTsgJHRjPWluX2FycmF5KCd0aXBhcycsJGNvbHMpPyd0aXBhcyc6KGluX2FycmF5KCdpdnlraXMnLCRjb2xzKT8naXZ5a2lzJzondGlwYXMnKTsgJGxjPWluX2FycmF5KCdsYWlrYXMnLCRjb2xzKT8nbGFpa2FzJzonY3JlYXRlZF9hdCc7CiAgICBpZigkcGMpICRyWydpdnlraWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgJGxjIGwsICR0YyB0LCAkcGMgcCwgTEVGVCh1cmwsODApIHUgRlJPTSB7JFB9cHNfd2ViX2l2eWtpYWkgV0hFUkUgJHBjIElOICgkaWRsKSBBTkQgJGxjPj1EQVRFX1NVQihOT1coKSxJTlRFUlZBTCAzIERBWSkgT1JERVIgQlkgJGxjIERFU0MgTElNSVQgNDAiLEFSUkFZX0EpOwogICAgLy8ga3JlcMWhZWxpbyDEr3Z5a2lhaSAvIHNhcmdvIMW+dXJuYWxhcwogICAgJHJbJ3N0b2NrX3dhdGNoJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskUH1wc19zdG9ja193YXRjaCBXSEVSRSBwcm9kdWN0X2lkIElOICgkaWRsKSBPUkRFUiBCWSAxIERFU0MgTElNSVQgMTAiLEFSUkFZX0EpOwogIH0KICBpZigkZj09PScyJyl7CiAgICAvLyBkcm9wc2hpcCBzYXJnbyAvIGtyZXDFoWVsaW8gdmFsaWRhY2lqb3Mga29kYXMKICAgIGZvcmVhY2goZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpIGFzICRnKXsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGcpOyBpZihwcmVnX21hdGNoKCcjYWRkX3RvX2NhcnRfdmFsaWRhdGlvbnxjaGVja19jYXJ0X2l0ZW1zIycsJHMpKXsgcHJlZ19tYXRjaF9hbGwoJyMuezAsMjAwfShhZGRfdG9fY2FydF92YWxpZGF0aW9ufGNoZWNrX2NhcnRfaXRlbXMpLnswLDkwMH0jcycsJHMsJG0pOyAkclsna29kYXMnXVtiYXNlbmFtZSgkZyldPWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIHN1YnN0cigkeCwwLDExMDApO30sYXJyYXlfc2xpY2UoJG1bMF0sMCwzKSk7IH0gfQogIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-194830';
const GKEY='ps_s1715a';
const PHASES=["1"];
const OUT='analize/s1715_a1.json';
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
