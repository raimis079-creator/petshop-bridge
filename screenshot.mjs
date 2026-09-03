process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MDggcnVuIGUzeiDigJQgVDIgZHZpZ3ViYXMga2VsaW8ga2VpdGltYXMgbHlnaWFncmXEjWlhaSAoI3BzX2UzX29pZDIpLCBwbyB0byBhdMWhYXVraW1hcyAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19lM3onXSkpIHJldHVybjsKICAkbz1hcnJheSgndic9PidydW4gZTN6Jyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgc2V0X3RpbWVfbGltaXQoMjgwKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJHU9Z2V0X3VzZXJfYnkoJ2xvZ2luJywndGVzdHVvdG9qYXMnKTsgJHVpZD0kdS0+SUQ7ICRleHA9dGltZSgpKzE4MDA7ICR0b2s9V1BfU2Vzc2lvbl9Ub2tlbnM6OmdldF9pbnN0YW5jZSgkdWlkKS0+Y3JlYXRlKCRleHApOyAkbGM9d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdsb2dnZWRfaW4nLCR0b2spOwogICRjaz1TRUNVUkVfQVVUSF9DT09LSUUuJz0nLndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnc2VjdXJlX2F1dGgnLCR0b2spLic7ICcuQVVUSF9DT09LSUUuJz0nLndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnYXV0aCcsJHRvaykuJzsgJy5MT0dHRURfSU5fQ09PS0lFLic9Jy4kbGM7CiAgJF9DT09LSUVbTE9HR0VEX0lOX0NPT0tJRV09JGxjOyB3cF9zZXRfY3VycmVudF91c2VyKCR1aWQpOwogICRCPWFkbWluX3VybCgnYWRtaW4ucGhwP3BhZ2U9cHMtZGVzaycpOyAkb2lkPShpbnQpZ2V0X29wdGlvbigncHNfZTNfb2lkMicpOyAkb1snb2lkJ109JG9pZDsgJG9yZD13Y19nZXRfb3JkZXIoJG9pZCk7ICRpaWQ9MDsgZm9yZWFjaCgkb3JkLT5nZXRfaXRlbXMoKSBhcyAkaz0+JGl0KXsgJGlpZD0kazsgfQogICRzdD1mdW5jdGlvbigpeyB3cF9jYWNoZV9mbHVzaCgpOyByZXR1cm4gYXJyYXkoJ3N0b2NrJz0+Z2V0X3Bvc3RfbWV0YSgxODU5MywnX3N0b2NrJyx0cnVlKSwnb3duJz0+Z2V0X3Bvc3RfbWV0YSgxODU5MywnX293bl9zdG9ja19xdHknLHRydWUpKTsgfTsgJG9bJ3ByaWVzJ109JHN0KCk7CiAgJG1rPWZ1bmN0aW9uKCRrKSB1c2UoJEIsJG9pZCwkaWlkLCRjayl7IHJldHVybiBhcnJheSgndXJsJz0+YWRtaW5fdXJsKCdhZG1pbi1wb3N0LnBocCcpLic/Jy5odHRwX2J1aWxkX3F1ZXJ5KGFycmF5KCdhY3Rpb24nPT4ncHNfZGxfdmVpa3NtYXMnLCd2Jz0+J2tlbGlhcycsJ2lkJz0+JG9pZCwnaWlkJz0+JGlpZCwnayc9PiRrLCdfd3Bub25jZSc9PndwX2NyZWF0ZV9ub25jZSgncHNfZGxfa2VsaWFzXycuJG9pZCksJ2cnPT4kQikpLCdoZWFkZXJzJz0+YXJyYXkoJ0Nvb2tpZSc9PiRjayksJ3R5cGUnPT4nR0VUJyk7IH07CiAgJGF0az1mdW5jdGlvbigkcnMpeyAkb3V0PWFycmF5KCk7IGZvcmVhY2goJHJzIGFzICRyKXsgaWYoaXNfb2JqZWN0KCRyKSYmaXNzZXQoJHItPmhlYWRlcnMpKXsgJGw9KHN0cmluZykoJHItPmhlYWRlcnNbJ2xvY2F0aW9uJ10/PycnKTsgcGFyc2Vfc3RyKChzdHJpbmcpcGFyc2VfdXJsKCRsLFBIUF9VUkxfUVVFUlkpLCRxKTsgJG91dFtdPWFycmF5KCRyLT5zdGF0dXNfY29kZSxyYXd1cmxkZWNvZGUoJHFbJ3BkX25yJ10/PycnKSwkcVsncGRfb2snXT8/JycpOyB9IGVsc2UgeyAkb3V0W109J2tsYWlkYTogJy4oaXNfb2JqZWN0KCRyKT8kci0+Z2V0TWVzc2FnZSgpOmdldHR5cGUoJHIpKTsgfSB9IHJldHVybiAkb3V0OyB9OwogIHRyeXsKICAgICRvWydkdmlndWJhc190aWVzaWFpJ109JGF0ayhXcE9yZ1xSZXF1ZXN0c1xSZXF1ZXN0czo6cmVxdWVzdF9tdWx0aXBsZShhcnJheSgkbWsoJ3RpZXNpYWknKSwkbWsoJ3RpZXNpYWknKSksYXJyYXkoJ3ZlcmlmeSc9PmZhbHNlLCdmb2xsb3dfcmVkaXJlY3RzJz0+ZmFsc2UsJ3RpbWVvdXQnPT42MCkpKTsKICAgICRvWydwb190aWVzaWFpJ109JHN0KCk7ICRpdD13Y19nZXRfb3JkZXIoJG9pZCktPmdldF9pdGVtKCRpaWQpOyAkb1snZWlsX3BvX3RpZXNpYWknXT1hcnJheSgna2VsaWFzJz0+JGl0LT5nZXRfbWV0YSgnX3BzX2tlbGlhcycpLCdzcmMnPT4kaXQtPmdldF9tZXRhKCdfcHNfc291cmNlJyksJ3JlZHVjZWQnPT4kaXQtPmdldF9tZXRhKCdfcHNfYXZfcmVkdWNlZF9xdHknKSk7CiAgICAkb1snZHZpZ3ViYXNfYXYnXT0kYXRrKFdwT3JnXFJlcXVlc3RzXFJlcXVlc3RzOjpyZXF1ZXN0X211bHRpcGxlKGFycmF5KCRtaygnYXYnKSwkbWsoJ2F2JykpLGFycmF5KCd2ZXJpZnknPT5mYWxzZSwnZm9sbG93X3JlZGlyZWN0cyc9PmZhbHNlLCd0aW1lb3V0Jz0+NjApKSk7CiAgICAkb1sncG9fYXYnXT0kc3QoKTsgJGl0PXdjX2dldF9vcmRlcigkb2lkKS0+Z2V0X2l0ZW0oJGlpZCk7ICRvWydlaWxfcG9fYXYnXT1hcnJheSgna2VsaWFzJz0+JGl0LT5nZXRfbWV0YSgnX3BzX2tlbGlhcycpLCdzcmMnPT4kaXQtPmdldF9tZXRhKCdfcHNfc291cmNlJyksJ3JlZHVjZWQnPT4kaXQtPmdldF9tZXRhKCdfcHNfYXZfcmVkdWNlZF9xdHknKSk7CiAgICAkb1snenVybmFsYXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCB2ZWlrc21hcyxyZXp1bHRhdGFzLHBhc3RhYmEgRlJPTSB7JHB9cHNfdXpzYWt5bXVfaXZ5a2lhaSBXSEVSRSB1enNha3ltYXM9JWQgT1JERVIgQlkgaWQiLCRvaWQpLEFSUkFZX0EpOwogICAgLy8gYXTFoWF1a3RpIHRlc3RpbsSvIOKAlCBsaWt1dGlzIGdyxK/FvnRhCiAgICAkcj13cF9yZW1vdGVfZ2V0KGFkbWluX3VybCgnYWRtaW4tcG9zdC5waHAnKS4nPycuaHR0cF9idWlsZF9xdWVyeShhcnJheSgnYWN0aW9uJz0+J3BzX2Rlc2tfdmVpa3NtYXMnLCd2Jz0+J2F0c2F1a3RpJywnaWQnPT4kb2lkLCdfd3Bub25jZSc9PndwX2NyZWF0ZV9ub25jZSgncHNfZGVza19hdHNhdWt0aV8nLiRvaWQpLCdnJz0+JEIpKSxhcnJheSgnaGVhZGVycyc9PmFycmF5KCdDb29raWUnPT4kY2spLCdzc2x2ZXJpZnknPT5mYWxzZSwncmVkaXJlY3Rpb24nPT4wLCd0aW1lb3V0Jz0+NjApKTsgJGw9d3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkciwnbG9jYXRpb24nKTsgcGFyc2Vfc3RyKChzdHJpbmcpcGFyc2VfdXJsKChzdHJpbmcpJGwsUEhQX1VSTF9RVUVSWSksJHEpOyAkb1snYXRzYXVrdGEnXT1yYXd1cmxkZWNvZGUoJHFbJ3BkX25yJ10/PycnKS4nIFsnLigkcVsncGRfb2snXT8/JycpLiddJzsKICAgICRvWydnYWxhcyddPSRzdCgpOyAkb1snYnVzZW5hJ109d2NfZ2V0X29yZGVyKCRvaWQpLT5nZXRfc3RhdHVzKCk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-170737';
const GKEY='ps_e3z';
const PHASES=["Z"];
const OUT='analize/e3_run17z.json';
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
