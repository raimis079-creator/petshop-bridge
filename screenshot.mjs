process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI0c3Ygc2l1bnTFsyBzdm9yaW8gcGFrbGFpZGEgZMSXbCBzYW5kxJdsaW8gcHJpc2t5cmltbyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MjRzdiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTgyNHN2J107CiAgJGNscz1udWxsOyBmb3JlYWNoKGdldF9kZWNsYXJlZF9jbGFzc2VzKCkgYXMgJGMpeyBpZihtZXRob2RfZXhpc3RzKCRjLCdrYWluYV9pc190YXJpZm8nKSYmbWV0aG9kX2V4aXN0cygkYywnc3ZvcmlzX2cnKSl7ICRjbHM9JGM7IGJyZWFrOyB9IH0gJHJbJ2NscyddPSRjbHM7CiAgJG1hcD1mdW5jdGlvbigkcyl7ICRzPShzdHJpbmcpJHM7IHJldHVybiAoJHM9PT0nJ3x8JHM9PT0nbGVnYWN5Jyk/J2F2JzokczsgfTsKICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRQfXBzX2Zha3Rfc2l1bnRvcyBXSEVSRSBkaWVuYT49JzIwMjYtMTAtMDEnIEFORCBzYW5kZWxpb19zYWx0aW5pcz0nZGVzaycgQU5EIENPQUxFU0NFKHRlc3RpbmlzLDApPTAiLEFSUkFZX0EpOyAkclsnc2l1bnR1J109Y291bnQoJHJvd3MpOwogICRieT1bXTsgZm9yZWFjaCgkcm93cyBhcyAkeCkgJGJ5WyR4Wyd1enNha3ltYXNfaWQnXV1bXT0keDsKICAkcGFsaWVzdGE9MDsgJGRpZl9jdD0wOyAkcHZ6PVtdOyAkZWlsX25lYXQ9MDsKICBmb3JlYWNoKCRieSBhcyAkb2lkPT4kc2l1bnRvcyl7ICRlaWw9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgZWlsdXRlc19pZCxzYW5kZWxpcyxzdm9yaXNfZyxraWVraXMgRlJPTSB7JFB9cHNfZmFrdF9laWx1dGVzIFdIRVJFIHV6c2FreW1hc19pZD0lZCBBTkQgQ09BTEVTQ0UodGVzdGluaXMsMCk9MCIsJG9pZCksQVJSQVlfQSk7CiAgICAkdGlrcmFzPVtdOyAkZmFrdD1bXTsgZm9yZWFjaCgkZWlsIGFzICRlKXsgJHNyYz13Y19nZXRfb3JkZXJfaXRlbV9tZXRhKChpbnQpJGVbJ2VpbHV0ZXNfaWQnXSwnX3BzX3NvdXJjZScsdHJ1ZSk7ICRydD0kc3JjPyRtYXAoJHNyYyk6JG1hcCgkZVsnc2FuZGVsaXMnXSk7IGlmKCRydCE9PSRtYXAoJGVbJ3NhbmRlbGlzJ10pKSAkZWlsX25lYXQrKzsgJGc9KGludCkkZVsnc3ZvcmlzX2cnXSooaW50KSRlWydraWVraXMnXTsgJHRpa3Jhc1skcnRdPSgkdGlrcmFzWyRydF0/PzApKyRnOyAkZmFrdFskbWFwKCRlWydzYW5kZWxpcyddKV09KCRmYWt0WyRtYXAoJGVbJ3NhbmRlbGlzJ10pXT8/MCkrJGc7IH0KICAgICRzaXVudHVfc2s9W107IGZvcmVhY2goJHNpdW50b3MgYXMgJHMpICRzaXVudHVfc2tbJG1hcCgkc1snc2FuZGVsaXMnXSldPSgkc2l1bnR1X3NrWyRtYXAoJHNbJ3NhbmRlbGlzJ10pXT8/MCkrMTsKICAgIGZvcmVhY2goJHNpdW50b3MgYXMgJHMpeyAkc2Q9JG1hcCgkc1snc2FuZGVsaXMnXSk7ICR0Zz0oaW50KXJvdW5kKCgkdGlrcmFzWyRzZF0/PzApL21heCgxLCRzaXVudHVfc2tbJHNkXSkpOyAkZGc9KGludCkkc1snc3ZvcmlzX2Rla2xhcnVvdGFzX2cnXTsKICAgICAgaWYoYWJzKCR0Zy0kZGcpPDMwMCkgY29udGludWU7IGxpc3QoJGsyLCk9Y2FsbF91c2VyX2Z1bmMoWyRjbHMsJ2thaW5hX2lzX3RhcmlmbyddLCRzWyd2ZXplamFzJ10sKHN0cmluZykkc1sncHJpc3RhdHltb190aXBhcyddLCR0Zywkc1snZGllbmEnXSwkc1snZHlkaXMnXSk7ICRkPShpbnQpJGsyLShpbnQpJHNbJ2thaW5hX3ZlemVqb19jdCddOwogICAgICAkcGFsaWVzdGErKzsgJGRpZl9jdCs9JGQ7IGlmKGNvdW50KCRwdnopPDE1KSAkcHZ6W109WydvaWQnPT4oaW50KSRvaWQsJ25yJz0+d2NfZ2V0X29yZGVyKCRvaWQpP3djX2dldF9vcmRlcigkb2lkKS0+Z2V0X29yZGVyX251bWJlcigpOicnLCdzYW5kJz0+JHNkLCdkZWtsX2cnPT4kZGcsJ3Rpa3Jhc19nJz0+JHRnLCdidXZvX2N0Jz0+KGludCkkc1sna2FpbmFfdmV6ZWpvX2N0J10sJ2J1dHVfY3QnPT4oaW50KSRrMl07IH0gfQogICRyKz0gWyd1enNha3ltdSc9PmNvdW50KCRieSksJ2VpbHVjaXVfa2l0YXNfc2FuZGVsaXMnPT4kZWlsX25lYXQsJ3NpdW50dV9wYWxpZXN0YSc9PiRwYWxpZXN0YSwnc2tpcnR1bWFzX2V1cic9PnJvdW5kKCRkaWZfY3QvMTAwLDIpLCdwdnonPT4kcHZ6XTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK';
const VER='dep-091828';
const GKEY='ps_s1824sv';
const PHASES=["1"];
const OUT='analize/s1824_sv.json';
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
