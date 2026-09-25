process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE5ZyDigJQgcmVjb24gcHJpZcWhIHNhdWd1bW8gcGFrZXTEhSwgcmVhZC1vbmx5IChsKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MTlnJ10pKSByZXR1cm47ICRyPVsndic9PidTMTcxOWcnLCd0Jz0+ZGF0ZSgnWS1tLWQgSDppOnMnKV07IEBzZXRfdGltZV9saW1pdCgxMjApOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICB0cnl7CiAgICAkZGlycz1bV1BfQ09OVEVOVF9ESVIuJy9tdS1wbHVnaW5zJyxXUF9DT05URU5UX0RJUi4nL3BsdWdpbnMvcGV0c2hvcC1jb3JlJyxXUF9DT05URU5UX0RJUi4nL3BsdWdpbnMvcGV0c2hvcC14bWwnLFdQX0NPTlRFTlRfRElSLicvcGx1Z2lucy9wZXRzaG9wLWZlZWRzJyxXUF9DT05URU5UX0RJUi4nL3RoZW1lcy9mbGF0c29tZS1jaGlsZCcsV1BfQ09OVEVOVF9ESVIuJy9wbHVnaW5zL3djLXZlbmlwYWstc2hpcHBpbmcnLFdQX0NPTlRFTlRfRElSLicvcGx1Z2lucy93b28tbGl0aHVhbmlhcG9zdC1tYWluJ107CiAgICAkcGF0PScvW15cbl17MCw4MH0ocHMtbGlwZHVrYWl8cGV0c2hvcC12Zi1jYWNoZXx2ZXRmYXJtYXNfcmVzcG9uc2V8d3BhbGxpbXBvcnRcL2ZpbGVzfGJhc2V1cmxbXlxuXXswLDIwfWxpcGR1aylbXlxuXXswLDgwfS8nOwogICAgZm9yZWFjaCgkZGlycyBhcyAkZCl7IGlmKCFpc19kaXIoJGQpKSBjb250aW51ZTsgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZCxGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOyBmb3JlYWNoKCRpdCBhcyAkZmkpeyBpZighJGZpLT5pc0ZpbGUoKXx8c3Vic3RyKCRmaS0+Z2V0RmlsZW5hbWUoKSwtNCkhPT0nLnBocCcpIGNvbnRpbnVlOyAkYz1maWxlX2dldF9jb250ZW50cygkZmktPmdldFBhdGhuYW1lKCkpOyBpZihwcmVnX21hdGNoX2FsbCgkcGF0LCRjLCRtKSl7ICRyWydrb2RhcyddW3N0cl9yZXBsYWNlKFdQX0NPTlRFTlRfRElSLCcnLCRmaS0+Z2V0UGF0aG5hbWUoKSldPWFycmF5X3NsaWNlKGFycmF5X3VuaXF1ZShhcnJheV9tYXAoJ3RyaW0nLCRtWzBdKSksMCw4KTsgfSB9IH0KICAgICRzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsY29kZSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBhY3RpdmU9MSIsQVJSQVlfQSk7IGZvcmVhY2goJHMgYXMgJHgpeyBpZihwcmVnX21hdGNoX2FsbCgkcGF0LCR4Wydjb2RlJ10sJG0pKSAkclsnc25pcHBldHMnXVskeFsnaWQnXS4nICcuJHhbJ25hbWUnXV09YXJyYXlfc2xpY2UoYXJyYXlfdW5pcXVlKGFycmF5X21hcCgndHJpbScsJG1bMF0pKSwwLDUpOyB9CiAgICAkdXA9d3BfdXBsb2FkX2RpcigpWydiYXNlZGlyJ107ICRyWyd1cGxvYWRzX2h0YWNjZXNzX2Z1bGwnXT1maWxlX2V4aXN0cygkdXAuJy8uaHRhY2Nlc3MnKT9maWxlX2dldF9jb250ZW50cygkdXAuJy8uaHRhY2Nlc3MnKTpudWxsOwogICAgZm9yZWFjaChbJ3BzLWxpcGR1a2FpJywncHMtbGlwZHVrYWkvbHAnLCd3cGFsbGltcG9ydCcsJ3dwYWxsaW1wb3J0L2ZpbGVzJywncHMtYmFja3VwcycsJ3BldHNob3AtbGVnYWN5JywncG1heC1zMTY3MiddIGFzICRkKXsgJHJbJ3N1Yl9odCddWyRkXT1maWxlX2V4aXN0cygkdXAuJy8nLiRkLicvLmh0YWNjZXNzJyk/c3Vic3RyKGZpbGVfZ2V0X2NvbnRlbnRzKCR1cC4nLycuJGQuJy8uaHRhY2Nlc3MnKSwwLDIwMCk6bnVsbDsgfQogICAgJHJbJ3dwYWlfZmlsZXMnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiBbYmFzZW5hbWUoJHgpLHJvdW5kKGZpbGVzaXplKCR4KS8xMDQ4NTc2LDEpLidNQicsZGF0ZSgnbS1kJyxmaWxlbXRpbWUoJHgpKV07fSxnbG9iKCR1cC4nL3dwYWxsaW1wb3J0L2ZpbGVzLyonKT86W10pOwogICAgJHJbJ3dwYWlfcGF0aHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLExFRlQocGF0aCw5MCkgcGF0aCBGUk9NIHskcH1wbXhpX2ltcG9ydHMiLEFSUkFZX0EpOwogICAgJHJbJ2xpcGR1a2FpX21ldGEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX2tleSxDT1VOVCgqKSBuLExFRlQoTUFYKG1ldGFfdmFsdWUpLDkwKSBwdnogRlJPTSB7JHB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXkgTElLRSAnJWxpcGR1ayUnIE9SIG1ldGFfa2V5IExJS0UgJyVsYWJlbCUnIE9SIG1ldGFfa2V5IExJS0UgJyVzdGlja2VyJScgR1JPVVAgQlkgbWV0YV9rZXkiLEFSUkFZX0EpOwogICAgJHJbJ3RyYXNoX2thbmRpZGF0YWknXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiBbc3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkeCksZmlsZXNpemUoJHgpLGRhdGUoJ20tZCcsZmlsZW10aW1lKCR4KSldO30sYXJyYXlfbWVyZ2UoZ2xvYigkdXAuJy8qX3Jlc3VsdC5qc29uJyk/OltdLGdsb2IoJHVwLicvbG9va3VwZGlhZy5qc29uJyk/OltdLGdsb2IoJHVwLicvdmV0ZmFybWFzX3Jlc3BvbnNlXyoueG1sJyk/OltdLFtBQlNQQVRILid3cC1jb250ZW50L3BocHRlc3QucGhwJyxBQlNQQVRILidpbmRleC5odG1sLmJhY2t1cC41YTZkZWZkMGI2YzhiNGNkNDE4YTk3MDA4NmUyYzBiNCddKSk7CiAgICAkdT1nZXRfdXNlcl9ieSgnbG9naW4nLCd0ZXN0dW90b2phcycpOyAkclsndGVzdHVvdG9qYXMnXT0kdT9bJ2lkJz0+JHUtPklELCdwb3N0cyc9PmNvdW50X3VzZXJfcG9zdHMoJHUtPklEKSwnb3JkZXJzJz0+KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXdjX29yZGVycyBXSEVSRSBjdXN0b21lcl9pZD0lZCIsJHUtPklEKSksJ2NvbW1lbnRzJz0+KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyRwfWNvbW1lbnRzIFdIRVJFIHVzZXJfaWQ9JWQiLCR1LT5JRCkpXTpudWxsOwogICAgJHJbJ3NuaXBwZXQ0NjVfaG9va3MnXT1wcmVnX21hdGNoX2FsbCgnL2FkZF8oYWN0aW9ufGZpbHRlcilcKFxzKltcJyJdKFteXCciXSspLycsKHN0cmluZykkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIGNvZGUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgaWQ9NDY1IiksJG0pPyRtWzJdOltdOwogICAgJHJbJ3BzX3ByaXZhdGVfbG9ncyddPWFycmF5X21hcCgnYmFzZW5hbWUnLGdsb2IoV1BfQ09OVEVOVF9ESVIuJy9wZXRzaG9wLXByaXZhdGUtbG9ncy8qJyk/OltdKTsgJHJbJ3ByaXZhdGVfbG9nc19rb2RhcyddPVtdOyBmb3JlYWNoKGdsb2IoV1BfQ09OVEVOVF9ESVIuJy9wbHVnaW5zLyovKi5waHAnKT86W10gYXMgJGYpeyBpZihzdHJwb3MoZmlsZV9nZXRfY29udGVudHMoJGYpLCdwZXRzaG9wLXByaXZhdGUtbG9ncycpIT09ZmFsc2UpICRyWydwcml2YXRlX2xvZ3Nfa29kYXMnXVtdPXN0cl9yZXBsYWNlKFdQX0NPTlRFTlRfRElSLCcnLCRmKTsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LDEpOwo=';
const VER='dep-144940';
const GKEY='ps_s1719g';
const PHASES=["l"];
const OUT='analize/s1719_g.json';
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
