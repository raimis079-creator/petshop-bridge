process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxOTEyIGFkbWluIHByaXNpanVuZ2ltbyBkaWFnbm9zdGlrYSAodGlrIHNrYWl0bykgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxOTEyZCddKSkgcmV0dXJuOyAkcj1bJ3YnPT4nczE5MTJkJ107IEBzZXRfdGltZV9saW1pdCgxMDApOwogIHRyeXsKICAgICRyWydzaXRlJ109Wydob21lJz0+Z2V0X29wdGlvbignaG9tZScpLCdzaXRldXJsJz0+Z2V0X29wdGlvbignc2l0ZXVybCcpLCdlbnYnPT53cF9nZXRfZW52aXJvbm1lbnRfdHlwZSgpLCd3cCc9PmdldF9ibG9naW5mbygndmVyc2lvbicpLCdwaHAnPT5QSFBfVkVSU0lPTiwnbGFpa2FzJz0+Y3VycmVudF90aW1lKCdteXNxbCcpLAogICAgICAnQ09PS0lFX0RPTUFJTic9PmRlZmluZWQoJ0NPT0tJRV9ET01BSU4nKT9DT09LSUVfRE9NQUlOOm51bGwsJ0FETUlOX0NPT0tJRV9QQVRIJz0+ZGVmaW5lZCgnQURNSU5fQ09PS0lFX1BBVEgnKT9BRE1JTl9DT09LSUVfUEFUSDpudWxsLCdGT1JDRV9TU0xfQURNSU4nPT5kZWZpbmVkKCdGT1JDRV9TU0xfQURNSU4nKT9GT1JDRV9TU0xfQURNSU46bnVsbCwnaXNfc3NsJz0+aXNfc3NsKCldOwogICAgJHJbJ2FrdHl2dXNfcGx1Z2luYWknXT1nZXRfb3B0aW9uKCdhY3RpdmVfcGx1Z2lucycpOwogICAgJG11PVdQTVVfUExVR0lOX0RJUjsgJHJbJ211J109W107IGZvcmVhY2goZ2xvYigkbXUuJy8qLnBocCcpIGFzICRmKXsgJHJbJ211J11bXT1bYmFzZW5hbWUoJGYpLGdtZGF0ZSgnWS1tLWQgSDppJyxmaWxlbXRpbWUoJGYpKSxmaWxlc2l6ZSgkZildOyB9CiAgICAvLyBmYWlsYWkgcGFrZWlzdGkgcGVyIDQgdmFsLgogICAgJG5hdWppPVtdOyAkbGltPXRpbWUoKS00KjM2MDA7CiAgICBmb3JlYWNoKFtXUF9DT05URU5UX0RJUi4nL211LXBsdWdpbnMnLFdQX0NPTlRFTlRfRElSLicvcGx1Z2lucycsQUJTUEFUSF0gYXMgJGRpcil7CiAgICAgICRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGRpcixGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOyAkbj0wOwogICAgICBmb3JlYWNoKCRpdCBhcyAkZil7IGlmKCsrJG4+NjAwMDApIGJyZWFrOyBpZigkZi0+aXNGaWxlKCkgJiYgJGYtPmdldE1UaW1lKCk+JGxpbSAmJiBwcmVnX21hdGNoKCcvXC4ocGhwfGh0YWNjZXNzKSR8XlwuaHRhY2Nlc3MkLycsJGYtPmdldEZpbGVuYW1lKCkpKSAkbmF1amlbXT1bc3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkZi0+Z2V0UGF0aG5hbWUoKSksZ21kYXRlKCdIOmknLCRmLT5nZXRNVGltZSgpKV07IGlmKGNvdW50KCRuYXVqaSk+NDApIGJyZWFrIDI7IH0KICAgICAgaWYoJGRpcj09PUFCU1BBVEgpIGJyZWFrOwogICAgfQogICAgJHJbJ3Bha2Vpc3RpXzRoJ109JG5hdWppOwogICAgJHJbJ2h0YWNjZXNzX210aW1lJ109ZmlsZV9leGlzdHMoQUJTUEFUSC4nLmh0YWNjZXNzJyk/Z21kYXRlKCdZLW0tZCBIOmknLGZpbGVtdGltZShBQlNQQVRILicuaHRhY2Nlc3MnKSk6bnVsbDsKICAgIC8vIGFkbWluaXN0cmF0b3JpYWkgaXIgc2VzaWpvcwogICAgZm9yZWFjaChnZXRfdXNlcnMoWydyb2xlX19pbic9PlsnYWRtaW5pc3RyYXRvcicsJ3Nob3BfbWFuYWdlciddLCdmaWVsZHMnPT5bJ0lEJywndXNlcl9sb2dpbicsJ3VzZXJfZW1haWwnXV0pIGFzICR1KXsKICAgICAgJHQ9Z2V0X3VzZXJfbWV0YSgkdS0+SUQsJ3Nlc3Npb25fdG9rZW5zJyx0cnVlKTsgJHNlcz1bXTsgaWYoaXNfYXJyYXkoJHQpKSBmb3JlYWNoKCR0IGFzICRzKSAkc2VzW109Wydpa2knPT5nbWRhdGUoJ20tZCBIOmknLCRzWydleHBpcmF0aW9uJ10pLCdsb2dpbic9PmdtZGF0ZSgnbS1kIEg6aScsJHNbJ2xvZ2luJ10pLCdpcCc9Pmlzc2V0KCRzWydpcCddKT9zdWJzdHIoJHNbJ2lwJ10sMCw3KS4n4oCmJzpudWxsLCd1YSc9Pmlzc2V0KCRzWyd1YSddKT9zdWJzdHIoJHNbJ3VhJ10sMCw0MCk6bnVsbF07CiAgICAgICRyWyd2YXJ0b3RvamFpJ11bXT1bJ2lkJz0+JHUtPklELCdsb2dpbic9PiR1LT51c2VyX2xvZ2luLCdyb2xlJz0+aW1wbG9kZSgnLCcsZ2V0X3VzZXJkYXRhKCR1LT5JRCktPnJvbGVzKSwnc2VzaWpvcyc9PiRzZXNdOwogICAgfQogICAgLy8gdcW+cmFraW5pbWFpIChsaW1pdCBsb2dpbiBpciBwYW4uKQogICAgZ2xvYmFsICR3cGRiOyAkclsnbG9ja291dF9vcGNpam9zJ109JHdwZGItPmdldF9jb2woIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJWxvY2tvdXQlJyBPUiBvcHRpb25fbmFtZSBMSUtFICclbGltaXRfbG9naW4lJyBPUiBvcHRpb25fbmFtZSBMSUtFICcld2ZscyUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVsb2dpbml6ZXIlJyBMSU1JVCAzMCIpOwogICAgZm9yZWFjaChbJ2xpbWl0X2xvZ2luX2xvY2tvdXRzJywnbGltaXRfbG9naW5fcmV0cmllcycsJ2xpbWl0X2xvZ2luX2xvY2tvdXRzX3RvdGFsJ10gYXMgJG8peyAkdj1nZXRfb3B0aW9uKCRvKTsgaWYoJHYpICRyWydsbCddWyRvXT1pc19hcnJheSgkdik/Y291bnQoJHYpOiR2OyB9CiAgICAvLyB3cC1sb2dpbi5waHAgacWhIHNlcnZlcmlvCiAgICAkZz13cF9yZW1vdGVfZ2V0KHNpdGVfdXJsKCd3cC1sb2dpbi5waHAnKSxbJ3RpbWVvdXQnPT4xNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3JlZGlyZWN0aW9uJz0+MF0pOwogICAgJHJbJ3dwX2xvZ2luJ109aXNfd3BfZXJyb3IoJGcpPyRnLT5nZXRfZXJyb3JfbWVzc2FnZSgpOlsnY29kZSc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRnKSwnbG9jYXRpb24nPT53cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVyKCRnLCdsb2NhdGlvbicpLCdsZW4nPT5zdHJsZW4od3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJGcpKSwndXNlcl9sb2dpbl9sYXVrbyc9PnN1YnN0cl9jb3VudCh3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkZyksJ3VzZXJfbG9naW4nKV07CiAgICAkZz13cF9yZW1vdGVfZ2V0KGFkbWluX3VybCgnLycpLFsndGltZW91dCc9PjE1LCdzc2x2ZXJpZnknPT5mYWxzZSwncmVkaXJlY3Rpb24nPT4wXSk7CiAgICAkclsnd3BfYWRtaW4nXT1pc193cF9lcnJvcigkZyk/JGctPmdldF9lcnJvcl9tZXNzYWdlKCk6Wydjb2RlJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJGcpLCdsb2NhdGlvbic9PndwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXIoJGcsJ2xvY2F0aW9uJyldOwogICAgLy8ga2xhaWTFsyDFvnVybmFsYXMKICAgIGZvcmVhY2goW1dQX0NPTlRFTlRfRElSLicvZGVidWcubG9nJyxpbmlfZ2V0KCdlcnJvcl9sb2cnKSxBQlNQQVRILidlcnJvcl9sb2cnLEFCU1BBVEguJ3dwLWFkbWluL2Vycm9yX2xvZyddIGFzICRsZil7IGlmKCRsZiAmJiBAaXNfcmVhZGFibGUoJGxmKSl7ICRzej1maWxlc2l6ZSgkbGYpOyAkZmg9Zm9wZW4oJGxmLCdyJyk7IGZzZWVrKCRmaCxtYXgoMCwkc3otNjAwMCkpOyAkdGFpbD1mcmVhZCgkZmgsNjAwMCk7IGZjbG9zZSgkZmgpOyAkclsnbG9nJ11bJGxmXT1bJ210aW1lJz0+Z21kYXRlKCdtLWQgSDppJyxmaWxlbXRpbWUoJGxmKSksJ3RhaWwnPT5hcnJheV9zbGljZShleHBsb2RlKCJcbiIsdHJpbSgkdGFpbCkpLC0yNSldOyB9IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LDEpOwo=';
const VER='dep-180137';
const GKEY='ps_s1912d';
const PHASES=["D"];
const OUT='analize/s1912_D.json';
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
