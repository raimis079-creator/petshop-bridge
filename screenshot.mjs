process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODE2YW8gYWRzLW9mZmxpbmUgdjEuMyBtYXJ6YSAoMSBkcnksIDIgYXBwbHksIDMgdmVyaWZ5LCA5IHJlc3RvcmUpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgxNmFvJ10pKSByZXR1cm47ICRmPSRfR0VUWydwc19zMTgxNmFvJ107ICRyPVsndic9PidTMTgxNmFvJywnZmF6ZSc9PiRmXTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICRGPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtYWRzLW9mZmxpbmUucGhwJzsgJEJBSz1kaXJuYW1lKEFCU1BBVEgpLicvcHMtYXJjaHl2YXMvcGV0c2hvcC1hZHMtb2ZmbGluZS5waHAuYmFrX3MxODE2JzsgJHM9ZmlsZV9nZXRfY29udGVudHMoJEYpOyAkclsnbWQ1J109bWQ1KCRzKTsKICAkTzE9Ilx0XHRcIlNFTEVDVCB1enNha3ltYXNfaWQsIGxhbmRpbmdfdXJsIEZST00ge1wkcH1wc19mYWt0X3V6c2FreW1haSBXSEVSRSB0ZXN0aW5pcz0wIjsKICAkTjE9Ilx0XHRcIlNFTEVDVCB1enNha3ltYXNfaWQsIGxhbmRpbmdfdXJsLCBrb250cmlidWNpamFfY3QgRlJPTSB7XCRwfXBzX2Zha3RfdXpzYWt5bWFpIFdIRVJFIHRlc3RpbmlzPTAiOwogICRPMj0iXHRcdFx0J3ZlcnRlJyAgID0+IHJvdW5kKCAoZmxvYXQpIFwkby0+Z2V0X3RvdGFsKCksIDIgKSxcbiI7CiAgJE4yPSRPMi4iXHRcdFx0J21hcnphJyAgID0+IG1heCggMC4wMSwgcm91bmQoICggKGludCkgXCRyWydrb250cmlidWNpamFfY3QnXSApIC8gMTAwLCAyICkgKSwgLy8gdjEuMyAoUzE4MTYpOiBrb250cmlidWNpamEgacWhIGZha3TFsyDigJQgYW50cmFtIGtvbnZlcnNpam9zIHZlaWtzbXVpIOKAnlBpcmtpbWFzIG1hcsW+YSAob2ZmbGluZSnigJw7IG1pbiAwLDAxLCBrYWQgQWRzIG5lcHJpaW10xbMga2FpcCAwXG4iOwogICRPMz0iICogVmVyc2lvbjogMS4xXG4iOyAkTjM9IiAqIFZlcnNpb246IDEuM1xuICogdjEuMyAoUzE4MTYsIDIwMjYtMTEtMDIpOiBsYXVrYXMgJ21hcnphJyA9IHBzX2Zha3RfdXpzYWt5bWFpLmtvbnRyaWJ1Y2lqYV9jdC8xMDAgKG1hcsW+YSArIHBhaW10YXMgcHJpc3RhdHltYXMg4oiSIG1va8SXamltbyBtb2tlc3RpcyDiiJIgcGFrdW90xJc7IGJlIHZlxb7El2pvKS4gQWRzIFNjcmlwdCBqxK8ga2VsaWEgxK8gYXRza2lyxIUgQU5UUklOxK4ga29udmVyc2lqb3MgdmVpa3NtxIUg4oCeUGlya2ltYXMgbWFyxb5hIChvZmZsaW5lKeKAnCAoc3RlYsSXamltYXMsIHBhc2nFq2x5bcWzIG5la2VpxI1pYSkuICd2ZXJ0ZScgbmVrZWlzdGEuXG4iOwogICRPND0iJ3YnID0+ICcxLjInIjsgJE40PSIndicgPT4gJzEuMyciOwogICRyWydyYXN0YSddPVtzdWJzdHJfY291bnQoJHMsJE8xKSxzdWJzdHJfY291bnQoJHMsJE8yKSxzdWJzdHJfY291bnQoJHMsJE8zKSxzdWJzdHJfY291bnQoJHMsJE80KV07ICRyWydqYXUnXT1zdHJwb3MoJHMsIidtYXJ6YSciKSE9PWZhbHNlOwogICRuPXN0cl9yZXBsYWNlKFskTzEsJE8yLCRPMywkTzRdLFskTjEsJE4yLCROMywkTjRdLCRzKTsKICBpZigkZj09PSdMJyl7ICR0bXA9ZGlybmFtZShBQlNQQVRIKS4nL3BzLWFyY2h5dmFzLy5saW50X3MxODE2Yi5waHAnOyAkdD1wcmVnX3JlcGxhY2UoJyNhZGRfYWN0aW9uXFwoXFxzKlwnKGluaXR8d3B8d29vY29tbWVyY2VfY2hlY2tvdXRfY3JlYXRlX29yZGVyKVwnIycsJ2FkZF9hY3Rpb24oXCdwc19saW50X25pZWthZGFfJDFcJycsJG4pOyAkdD1zdHJfcmVwbGFjZSgnZnVuY3Rpb24gcHNfYWRzX29mZmxpbmVfZ2NsaWQnLCdmdW5jdGlvbiBwc19hZHNfb2ZmbGluZV9nY2xpZF9saW50JywkdCk7IGZpbGVfcHV0X2NvbnRlbnRzKCR0bXAsJHQpOyB0cnl7IGluY2x1ZGUgJHRtcDsgJHJbJ2xpbnQnXT0nT0snOyB9Y2F0Y2goXFRocm93YWJsZSAkZSl7ICRyWydsaW50J109J0tMQUlEQSAnLiRlLT5nZXRNZXNzYWdlKCkuJyAnLiRlLT5nZXRMaW5lKCk7IH0gQHVubGluaygkdG1wKTsgfQogIGlmKCRmPT09JzInKXsgaWYoJHJbJ2phdSddfHwkclsncmFzdGEnXSE9PVsxLDEsMSwxXSkgJHJbJ2tsYWlkYSddPSduZXJhc3RhL2phdSc7IGVsc2UgeyBpZighaXNfZmlsZSgkQkFLKSkgY29weSgkRiwkQkFLKTsgZmlsZV9wdXRfY29udGVudHMoJEYsJG4pOyBjbGVhcnN0YXRjYWNoZSgpOyAkclsncG9fbWQ1J109bWQ1X2ZpbGUoJEYpOyAkclsnYmFrJ109bWQ1X2ZpbGUoJEJBSyk7IH0gfQogIGlmKCRmPT09JzMnKXsgJGs9Z2V0X29wdGlvbigncHNfYWRzX29mZmxpbmVfcmFrdGFzJyk7ICR4PXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8/cHNfYWRzX29mZmxpbmU9Jy5yYXd1cmxlbmNvZGUoJGspLicmZGllbm9zPTMnKSxbJ3RpbWVvdXQnPT42MF0pOyAkYj1qc29uX2RlY29kZSh3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkeCksdHJ1ZSk7ICRyWydodHRwJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpOyAkclsndmVyJ109JGJbJ3YnXT8/bnVsbDsgJHJbJ24nXT0kYlsnbiddPz9udWxsOyAkclsncHZ6J109YXJyYXlfbWFwKGZuKCRlKT0+Wyd1enMnPT4kZVsndXpzJ10sJ3ZlcnRlJz0+JGVbJ3ZlcnRlJ10sJ21hcnphJz0+JGVbJ21hcnphJ10/PydORVJBJywnbGFpa2FzJz0+JGVbJ2xhaWthcyddLCdnY2xpZF9sZW4nPT5zdHJsZW4oJGVbJ2djbGlkJ10pXSxhcnJheV9zbGljZSgkYlsnZWlsJ10/P1tdLDAsNikpOyAkclsnbWFyemFfdGlrciddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHV6c2FreW1hc19pZCwgUk9VTkQodmlzb19jdC8xMDAsMikgdiwgUk9VTkQoa29udHJpYnVjaWphX2N0LzEwMCwyKSBrIEZST00geyRwfXBzX2Zha3RfdXpzYWt5bWFpIFdIRVJFIHV6c2FreW1hc19pZCBJTiAoIi5pbXBsb2RlKCcsJyxhcnJheV9tYXAoZm4oJGUpPT4oaW50KSRlWyd1enMnXSxhcnJheV9zbGljZSgkYlsnZWlsJ10/P1tdLDAsNikpID86IFswXSkuIikiLEFSUkFZX0EpOyB9CiAgaWYoJGY9PT0nOScpeyBpZihpc19maWxlKCRCQUspKXsgY29weSgkQkFLLCRGKTsgY2xlYXJzdGF0Y2FjaGUoKTsgJHJbJ2F0a3VydGEnXT1tZDVfZmlsZSgkRik7fSB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0OyB9KTsK';
const VER='dep-132039';
const GKEY='ps_s1816ao';
const PHASES=["1", "L"];
const OUT='analize/s1816_ao.json';
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
