process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjc5IGFwaW10aXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19ibDQnXSk/JF9HRVRbJ3BzX2JsNCddOicnKSE9PSdSJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2NzliJywnd3AnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpOwogIGdsb2JhbCAkd3BkYjsgJHRwPSR3cGRiLT5wcmVmaXguJ3BzX3BhcnRpam9zJzsKICB0cnl7CiAgICAkc3FsPSJTRUxFQ1QgcC5JRCwgQ0FTVChwbS5tZXRhX3ZhbHVlIEFTIFNJR05FRCkgc3RvY2ssIENPQUxFU0NFKFNVTShDQVNFIFdIRU4gdC5hdHNhdWt0YT0wIE9SIHQuYXRzYXVrdGEgSVMgTlVMTCBUSEVOIHQua2lla2lzX2xpa28gRUxTRSAwIEVORCksMCkgcGFydGlqb3NlCiAgICAgICAgICBGUk9NIHskd3BkYi0+cG9zdHN9IHAKICAgICAgICAgIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gcG0gT04gcG0ucG9zdF9pZD1wLklEIEFORCBwbS5tZXRhX2tleT0nX3N0b2NrJwogICAgICAgICAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBzZCBPTiBzZC5wb3N0X2lkPXAuSUQgQU5EIHNkLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIEFORCBzZC5tZXRhX3ZhbHVlPSdhdicKICAgICAgICAgIExFRlQgSk9JTiBgJHRwYCB0IE9OIHQucHJvZHVjdF9pZD1wLklECiAgICAgICAgICBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnCiAgICAgICAgICBHUk9VUCBCWSBwLklEIjsKICAgICRyPSR3cGRiLT5nZXRfcmVzdWx0cygkc3FsLEFSUkFZX0EpOwogICAgJG9bJ2F2X3ByZWtpdSddPWNvdW50KCRyKTsKICAgICR0cj1hcnJheSgnc3RvY2s+cGFydGlqb3NlJz0+YXJyYXkoKSwnc3RvY2s8cGFydGlqb3NlJz0+YXJyYXkoKSwnc3V0YW1wYSc9PjAsJ2JlX3BhcnRpanVfc3VfbGlrdWNpdSc9PmFycmF5KCkpOwogICAgJHN1bWFUcj0wOwogICAgZm9yZWFjaCgkciBhcyAkeCl7ICRzPShpbnQpJHhbJ3N0b2NrJ107ICRwPShpbnQpJHhbJ3BhcnRpam9zZSddOwogICAgICBpZigkcz09PSRwKSB7ICR0clsnc3V0YW1wYSddKys7IGNvbnRpbnVlOyB9CiAgICAgIGlmKCRzPiRwKXsgJHRyWydzdG9jaz5wYXJ0aWpvc2UnXVtdPWFycmF5KCR4WydJRCddLCRzLCRwLCRzLSRwKTsgJHN1bWFUcis9JHMtJHA7IGlmKCRwPT09MCYmJHM+MCkgJHRyWydiZV9wYXJ0aWp1X3N1X2xpa3VjaXUnXVtdPWFycmF5KCR4WydJRCddLCRzKTsgfQogICAgICBlbHNlICR0clsnc3RvY2s8cGFydGlqb3NlJ11bXT1hcnJheSgkeFsnSUQnXSwkcywkcCwkcC0kcyk7IH0KICAgICRvWydzdXRhbXBhJ109JHRyWydzdXRhbXBhJ107CiAgICAkb1snc3RvY2tfZGF1Z2lhdV9zayddPWNvdW50KCR0clsnc3RvY2s+cGFydGlqb3NlJ10pOwogICAgJG9bJ3N0b2NrX2RhdWdpYXVfdm50J109JHN1bWFUcjsKICAgICRvWydiZV9wYXJ0aWp1X3Zpc2FpJ109Y291bnQoJHRyWydiZV9wYXJ0aWp1X3N1X2xpa3VjaXUnXSk7CiAgICAkb1sncGFydGlqb3NlX2RhdWdpYXVfc2snXT1jb3VudCgkdHJbJ3N0b2NrPHBhcnRpam9zZSddKTsKICAgIHVzb3J0KCR0clsnc3RvY2s+cGFydGlqb3NlJ10sZnVuY3Rpb24oJGEsJGIpe3JldHVybiAkYlszXS0kYVszXTt9KTsKICAgICRvWyd0b3AxNSddPWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIGFycmF5KCdpZCc9PiR4WzBdLCdwYXYnPT5zdWJzdHIoZ2V0X3RoZV90aXRsZSgkeFswXSksMCw0MiksJ3N0b2NrJz0+JHhbMV0sJ3BhcnRpam9zZSc9PiR4WzJdLCdza2lydHVtYXMnPT4keFszXSk7fSxhcnJheV9zbGljZSgkdHJbJ3N0b2NrPnBhcnRpam9zZSddLDAsMTUpKTsKICAgIHVzb3J0KCR0clsnc3RvY2s8cGFydGlqb3NlJ10sZnVuY3Rpb24oJGEsJGIpe3JldHVybiAkYlszXS0kYVszXTt9KTsKICAgICRvWydwZXJ0ZWtsaXVzX3RvcDUnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiBhcnJheSgnaWQnPT4keFswXSwncGF2Jz0+c3Vic3RyKGdldF90aGVfdGl0bGUoJHhbMF0pLDAsNDIpLCdzdG9jayc9PiR4WzFdLCdwYXJ0aWpvc2UnPT4keFsyXSk7fSxhcnJheV9zbGljZSgkdHJbJ3N0b2NrPHBhcnRpam9zZSddLDAsNSkpOwogICAgLy8gS2llayBwYXJ0aWp1IGlzICJQcmFkaW5pcyBsaWt1dGlzIFQtMCIKICAgICRvWydwYXJ0aWp1X3Bhc3RhYm9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgTEVGVChwYXN0YWJhLDQwKSBwLENPVU5UKCopIGsgRlJPTSBgJHRwYCBHUk9VUCBCWSBMRUZUKHBhc3RhYmEsNDApIE9SREVSIEJZIGsgREVTQyBMSU1JVCA4IixBUlJBWV9BKTsKICAgICRvWydudWxpbmlvX2xpa3VjaW9fcHJla2l1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0bWV0YX0gcG0gSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBzZCBPTiBzZC5wb3N0X2lkPXBtLnBvc3RfaWQgQU5EIHNkLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIEFORCBzZC5tZXRhX3ZhbHVlPSdhdicgV0hFUkUgcG0ubWV0YV9rZXk9J19zdG9jaycgQU5EIENBU1QocG0ubWV0YV92YWx1ZSBBUyBTSUdORUQpPTAiKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-083830';
const GKEY='ps_bl4';
const PHASES=["R"];
const OUT='analize/s1679_b.json';
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
