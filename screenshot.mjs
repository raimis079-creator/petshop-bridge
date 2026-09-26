process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzIxaCByZWNvbiByZWFkLW9ubHk6IGZlZWRpbmctY2FsYyBSRVNUIGF0c2FreW1hcywgRmVlZGluZ19TZXJ2aWNlIEFQSSwgcGV0IHN2b3JpcyBwcmlzaWp1bmd1c2lhbSwga2F0YWxvZ28gYWpheF9zZWltYSwgcHJvZHVjdC1jYWxjLmpzIHJlenVsdGF0byBrYWJseXMgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzIxaCddKSkgcmV0dXJuOyAkZj0kX0dFVFsncHNfczE3MjFoJ107ICRyPVsndic9PidTMTcyMWgnXTsgQHNldF90aW1lX2xpbWl0KDEyMCk7ICRtdT1XUE1VX1BMVUdJTl9ESVI7ICRjb3JlPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUnOwogICRncmVwPWZ1bmN0aW9uKCRmaWxlLCRwYXQsJGN0eD0xNjAsJG1heD0xNCl7IGlmKCFpc19maWxlKCRmaWxlKSkgcmV0dXJuICdORVJBJzsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGZpbGUpOyBwcmVnX21hdGNoX2FsbCgnI1teXG5dezAsJy4kY3R4Lid9KCcuJHBhdC4nKVteXG5dezAsJy4kY3R4Lid9IycsJHMsJG0pOyByZXR1cm4gYXJyYXlfc2xpY2UoYXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gbWJfc3Vic3RyKHRyaW0oJHgpLDAsNDIwKTt9LCRtWzBdKSwwLCRtYXgpOyB9OwogIHRyeXsKICAgICRyWydjYWxjX3Jlc3QnXT0kZ3JlcCgkY29yZS4nL2luY2x1ZGVzL2NsYXNzLXByb2R1Y3QtY2FsYy5waHAnLCdyZWdpc3Rlcl9yZXN0X3JvdXRlfGZlZWRpbmctY2FsY3xQU1BldENvbmZpZ3xcJ3Jlc3RcJ3xcJ2FjY291bnRcJ3xcJ3BldHNcJ3xzcGVjaWVzfGZ1bmN0aW9uICcsMjAwLDMwKTsKICAgIGZvcmVhY2goZ2xvYigkY29yZS4nL2luY2x1ZGVzLyoucGhwJykgYXMgJHBoKXsgJHM9ZmlsZV9nZXRfY29udGVudHMoJHBoKTsgaWYoc3RycG9zKCRzLCJmZWVkaW5nLWNhbGMiKSE9PWZhbHNlKSAkclsncmVzdF9maWxlcyddW109YmFzZW5hbWUoJHBoKTsgaWYocHJlZ19tYXRjaCgnL2NsYXNzXHMrXHcqRmVlZGluZ19TZXJ2aWNlLycsJHMpKSAkclsnZnNfZmlsZSddPWJhc2VuYW1lKCRwaCk7IH0KICAgICRmcz0kY29yZS4nL2luY2x1ZGVzL2NsYXNzLWZlZWRpbmctc2VydmljZS5waHAnOyAkcz1maWxlX2dldF9jb250ZW50cygkZnMpOyBwcmVnX21hdGNoKCcvXihuYW1lc3BhY2VccytbXjtdKzspL20nLCRzLCRucyk7ICRyWydmc19ucyddPSRuc1sxXT8/Jyc7IHByZWdfbWF0Y2hfYWxsKCcjKHB1YmxpY3xwcml2YXRlfHByb3RlY3RlZCk/XHMqKHN0YXRpYyApP2Z1bmN0aW9uIChcdyspXHMqXCgoW14pXSopXCkjJywkcywkbSk7ICRyWydmc19mbnMnXT1hcnJheV9tYXAoZnVuY3Rpb24oJGEsJGIpe3JldHVybiAkYS4nKCcubWJfc3Vic3RyKCRiLDAsOTApLicpJzt9LCRtWzNdLCRtWzRdKTsKICAgICRyWydmc19jYWxjJ109JGdyZXAoJGZzLCdmdW5jdGlvbiBjYWxjXGJ8ZnVuY3Rpb24gZXZhbHVhdGV8XCdkYXlzX21pbnxcJ2RheXNfbWF4fGRheXNfbWlufGRheXNfbWF4fGdyYW1zX3Blcl9kYXl8XCdncGR8XCdyYW5nZXxcJ21pblwnfFwnbWF4XCd8c3RhdHVzfG5lZWRzX2lucHV0fFdFSUdIVF9PVVQnLDIwMCwzMCk7CiAgICBmb3JlYWNoKGdsb2IoJGNvcmUuJy9pbmNsdWRlcy8qLnBocCcpIGFzICRwaCl7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRwaCk7IGlmKHByZWdfbWF0Y2goJyNmZWVkaW5nLWNhbGMjJywkcykpeyAkclsncmVzdF9jYiddW2Jhc2VuYW1lKCRwaCldPSRncmVwKCRwaCwnZmVlZGluZy1jYWxjfGZ1bmN0aW9uIGhhbmRsZV9jYWxjfGZ1bmN0aW9uIGNhbGNfZW5kcG9pbnR8cmVzdF9lbnN1cmVfcmVzcG9uc2V8V1BfUkVTVF9SZXNwb25zZXxcJG91dFxbfFwncmVzdWx0XCd8XCdkYXlzJywyMDAsMjUpOyB9IH0KICAgICRyWydwZXRfZm5zJ109JGdyZXAoJGNvcmUuJy9pbmNsdWRlcy9jbGFzcy1wZXQtcHJvZmlsZS5waHAnLCdwdWJsaWMgc3RhdGljIGZ1bmN0aW9uIChnZXR8cGV0c3xmb3JfdXNlcnxjdXJyZW50fGxpc3R8YnlfdXNlcnxmaW5kKVx3KnxjdXJyZW50X3dlaWdodF9rZycsMTYwLDIwKTsKICAgICRyWydwZXRfdWknXT0kZ3JlcCgkY29yZS4nL2luY2x1ZGVzL2NsYXNzLXBldC11aS5waHAnLCdwdWJsaWMgc3RhdGljIGZ1bmN0aW9uIFx3KycsMTAwLDIwKTsKICAgICRyWydqc19yZXN1bHQnXT0kZ3JlcCgkY29yZS4nL2Fzc2V0cy9wcm9kdWN0LWNhbGMuanMnLCdwcy1jYWxjLXJlc3xDdXN0b21FdmVudHxkaXNwYXRjaEV2ZW50fGZ1bmN0aW9uIHJlbmRlcnxsYXN0V2VpZ2h0ID18cmVzXC58ZGF0YVwuZGF5c3xkYXlzJywxNjAsMzApOwogICAgJHJbJ2thdGFsb2dhc19zZWltYSddPSRncmVwKCRtdS4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCcsJ2Z1bmN0aW9uIGFqYXhfc2VpbWEnLDEwLDEpOyAkcz1maWxlX2dldF9jb250ZW50cygkbXUuJy9wZXRzaG9wLWthdGFsb2dhcy5waHAnKTsgaWYoKCRpPXN0cnBvcygkcywnZnVuY3Rpb24gYWpheF9zZWltYScpKSE9PWZhbHNlKSAkclsna2F0YWxvZ2FzX3NlaW1hX2JvZHknXT1tYl9zdWJzdHIoJHMsJGksMTgwMCk7CiAgICAkclsnc3BlY2llc19tZXRhJ109W2dldF9wb3N0X21ldGEoMTg1OTAsJ19wc19zcGVjaWVzJyx0cnVlKSwgd3BfZ2V0X29iamVjdF90ZXJtcygxODU5MCwncGFfZ3l2dW5vX3J1c2lzJyxbJ2ZpZWxkcyc9PidzbHVncyddKV07CiAgICAvLyBSRVNUIGNhbGMgZ3l2YWkKICAgICRycT1uZXcgV1BfUkVTVF9SZXF1ZXN0KCdQT1NUJywnL3BldHNob3AvdjEvZmVlZGluZy1jYWxjJyk7ICRycS0+c2V0X2JvZHlfcGFyYW1zKFsncHJvZHVjdF9pZCc9PjE4NTkwLCd3ZWlnaHRfa2cnPT44LCdzcGVjaWVzX2NvZGUnPT4nZG9nJ10pOyAkcnM9cmVzdF9kb19yZXF1ZXN0KCRycSk7ICRyWydyZXN0X3RyeSddPVsnc3RhdHVzJz0+JHJzLT5nZXRfc3RhdHVzKCksJ2RhdGEnPT5qc29uX2RlY29kZShtYl9zdWJzdHIoanNvbl9lbmNvZGUoJHJzLT5nZXRfZGF0YSgpLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpLDAsMTUwMCksdHJ1ZSldOwogICAgaWYoJHJzLT5nZXRfc3RhdHVzKCk+PTQwMCl7ICRzcnY9cmVzdF9nZXRfc2VydmVyKCk7ICRyb3V0ZXM9YXJyYXlfa2V5cygkc3J2LT5nZXRfcm91dGVzKCkpOyAkclsncm91dGVzJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigkcm91dGVzLGZ1bmN0aW9uKCR4KXtyZXR1cm4gc3RycG9zKCR4LCdmZWVkaW5nJykhPT1mYWxzZXx8c3RycG9zKCR4LCdwZXQnKSE9PWZhbHNlO30pKTsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-125407';
const GKEY='ps_s1721h';
const PHASES=["1"];
const OUT='analize/s1721_h.json';
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
