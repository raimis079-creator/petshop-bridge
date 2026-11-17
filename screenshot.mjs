process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODg0YyBFcmlrYSBudW9sYWlkYSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4ODRjJ10pKSByZXR1cm47ICRyPVsndic9PidjMSddOyBnbG9iYWwgJHdwZGI7IEBzZXRfdGltZV9saW1pdCgxMjApOwogIHRyeXsKICAgICR1PSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHUuSUQsdS51c2VyX2VtYWlsLHUuZGlzcGxheV9uYW1lLHUudXNlcl9yZWdpc3RlcmVkIEZST00geyR3cGRiLT51c2Vyc30gdSBXSEVSRSB1LmRpc3BsYXlfbmFtZSBMSUtFICclTWElZWlrYWl0JScgT1IgdS51c2VyX2VtYWlsIExJS0UgJyVtYXplaWslJyBPUiB1LklEIElOIChTRUxFQ1QgdXNlcl9pZCBGUk9NIHskd3BkYi0+dXNlcm1ldGF9IFdIRVJFIChtZXRhX2tleSBJTiAoJ2JpbGxpbmdfbGFzdF9uYW1lJywnbGFzdF9uYW1lJykgQU5EIG1ldGFfdmFsdWUgTElLRSAnJWElZWlrYWl0JScpKSIsQVJSQVlfQSk7CiAgICBmb3JlYWNoKCR1IGFzICYkeCl7ICR4WydtZXRhJ109Wydmbic9PmdldF91c2VyX21ldGEoJHhbJ0lEJ10sJ2JpbGxpbmdfZmlyc3RfbmFtZScsdHJ1ZSksJ2xuJz0+Z2V0X3VzZXJfbWV0YSgkeFsnSUQnXSwnYmlsbGluZ19sYXN0X25hbWUnLHRydWUpLCdwcmVuX251b2wnPT5QZXRzaG9wX1ByZW51bWVyYXRhOjprbGllbnRvX251b2xhaWRhKCR4WydJRCddKV07CiAgICAgICRvcz13Y19nZXRfb3JkZXJzKFsnY3VzdG9tZXJfaWQnPT4keFsnSUQnXSwnbGltaXQnPT40MCwnb3JkZXJieSc9PidkYXRlJywnb3JkZXInPT4nREVTQyddKTsKICAgICAgJHhbJ29yZGVycyddPVtdOyBmb3JlYWNoKCRvcyBhcyAkbyl7ICRpdD1bXTsgZm9yZWFjaCgkby0+Z2V0X2l0ZW1zKCkgYXMgJGkpeyAkcD0kaS0+Z2V0X3Byb2R1Y3QoKTsgJGJyPScnOyBpZigkcCl7ICR0PXdwX2dldF9wb3N0X3Rlcm1zKCRwLT5nZXRfcGFyZW50X2lkKCk/OiRwLT5nZXRfaWQoKSwncHJvZHVjdF9icmFuZCcsWydmaWVsZHMnPT4nbmFtZXMnXSk7ICRicj1pc193cF9lcnJvcigkdCk/Jyc6aW1wbG9kZSgnLycsJHQpO30gJGl0W109WyRpLT5nZXRfbmFtZSgpLCRpLT5nZXRfcXVhbnRpdHkoKSxyb3VuZCgkaS0+Z2V0X3N1YnRvdGFsKCksMikscm91bmQoJGktPmdldF90b3RhbCgpLDIpLCRicl07IH0KICAgICAgICAkeFsnb3JkZXJzJ11bXT1bJ2lkJz0+JG8tPmdldF9pZCgpLCducic9PiRvLT5nZXRfb3JkZXJfbnVtYmVyKCksJ2QnPT4kby0+Z2V0X2RhdGVfY3JlYXRlZCgpPyRvLT5nZXRfZGF0ZV9jcmVhdGVkKCktPmRhdGUoJ1ktbS1kJyk6JycsJ3N0Jz0+JG8tPmdldF9zdGF0dXMoKSwndG90Jz0+JG8tPmdldF90b3RhbCgpLCdkaXNjJz0+JG8tPmdldF9kaXNjb3VudF90b3RhbCgpLCdrdXAnPT4kby0+Z2V0X2NvdXBvbl9jb2RlcygpLCdmZWVzJz0+YXJyYXlfbWFwKGZ1bmN0aW9uKCRmKXtyZXR1cm4gWyRmLT5nZXRfbmFtZSgpLCRmLT5nZXRfdG90YWwoKV07fSxhcnJheV92YWx1ZXMoJG8tPmdldF9mZWVzKCkpKSwnaXRlbXMnPT4kaXRdOyB9CiAgICB9IHVuc2V0KCR4KTsKICAgICRyWyd1c2VycyddPSR1OwogICAgLy8gaXN0b3JpamEgZVNob3ByZW50CiAgICAkclsnaXN0J109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskd3BkYi0+cHJlZml4fXBzX2lzdF9mYWt0X3V6c2FreW1haSBXSEVSRSBlbWFpbCBMSUtFICVzIE9SREVSIEJZIDEgREVTQyBMSU1JVCA1IiwnJW1hemVpayUnKSxBUlJBWV9BKTsKICAgICRyWydpc3RfbiddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX2lzdF9mYWt0X3V6c2FreW1haSBXSEVSRSBlbWFpbCBMSUtFICclbWF6ZWlrJSciKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwxKTsK';
const VER='dep-220603';
const GKEY='ps_s1884c';
const PHASES=["GO"];
const OUT='analize/s1884_c.json';
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
