process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjc2IHNsYXB1a3UgcGFseWdpbmltYXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19ia1onXSk/JF9HRVRbJ3BzX2JrWiddOicnKSE9PSdDJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2NzYnLCd3cCc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSk7CiAgZ2xvYmFsICR3cGRiOwogIHRyeXsKICAgIC8vIDEuIEthIHJlYWxpYWkgZGVkYSBzZXJ2ZXJpcyAoU2V0LUNvb2tpZSkKICAgICRwc2w9YXJyYXkoJ3RpdHVsaW5pcyc9PmhvbWVfdXJsKCcvJyksJ3ByZWtlJz0+aG9tZV91cmwoJy9wcm9kdWN0L2FtYnJvc2lhLWJlZ3J1ZGlzLXN1LXN2aWV6aWEta2FsYWt1dGllbmEtaXItYW50aWVuYS1zYXVzYXMtbWFpc3Rhcy1zdW5pbXMtZnJlc2gtdHVya2V5LWR1Y2stMmtnLycpLAogICAgICAna3JlcHNlbGlzJz0+d2NfZ2V0X2NhcnRfdXJsKCksJ3Bhc2t5cmEnPT53Y19nZXRfcGFnZV9wZXJtYWxpbmsoJ215YWNjb3VudCcpKTsKICAgICRyYXN0aT1hcnJheSgpOwogICAgZm9yZWFjaCgkcHNsIGFzICRrPT4kdSl7CiAgICAgICRyPXdwX3JlbW90ZV9nZXQoJHUsYXJyYXkoJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2hlYWRlcnMnPT5hcnJheSgnVXNlci1BZ2VudCc9PidNb3ppbGxhLzUuMCBDaHJvbWUvMTUyJykpKTsKICAgICAgaWYoaXNfd3BfZXJyb3IoJHIpKSBjb250aW51ZTsKICAgICAgJGhzPXdwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXJzKCRyKTsKICAgICAgJHNjPWlzc2V0KCRoc1snc2V0LWNvb2tpZSddKT8oYXJyYXkpJGhzWydzZXQtY29va2llJ106YXJyYXkoKTsKICAgICAgZm9yZWFjaCgkc2MgYXMgJGxpbmUpeyBpZihwcmVnX21hdGNoKCcvXihbXj1dKyk9LycsdHJpbSgkbGluZSksJG0pKSAkcmFzdGlbdHJpbSgkbVsxXSldW109JGs7IH0KICAgIH0KICAgICRvWydzZXJ2ZXJpb19zbGFwdWthaSddPWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIGltcGxvZGUoJywnLGFycmF5X3VuaXF1ZSgkeCkpO30sJHJhc3RpKTsKICAgIC8vIDIuIEthcyBhcHJhc3l0YSBwb2xpdGlrb2plCiAgICAkYXByPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgbmFtZSBGUk9NIHskd3BkYi0+cHJlZml4fWNtcGx6X2Nvb2tpZXMgV0hFUkUgZGVsZXRlZD0wIEFORCBzaG93T25Qb2xpY3k9MSBBTkQgbGFuZ3VhZ2U9J2x0JyIpOwogICAgJG9bJ2FwcmFzeXR1X3NrJ109Y291bnQoJGFwcik7CiAgICAvLyAzLiBQYWx5Z2luaW1hcwogICAgJHRydWtzdGE9YXJyYXkoKTsKICAgIGZvcmVhY2goYXJyYXlfa2V5cygkcmFzdGkpIGFzICRjKXsKICAgICAgJHlyYT1mYWxzZTsKICAgICAgZm9yZWFjaCgkYXByIGFzICRhKXsgJHNhYj1zdHJfcmVwbGFjZSgnKicsJycsJGEpOwogICAgICAgIGlmKCRhPT09JGMgfHwgKCRzYWIhPT0nJyAmJiBzdHJpcG9zKCRjLCRzYWIpPT09MCkgfHwgc3RyaXBvcygkYSwkYyk9PT0wKXsgJHlyYT10cnVlOyBicmVhazsgfSB9CiAgICAgIGlmKCEkeXJhKSAkdHJ1a3N0YVtdPSRjOyB9CiAgICAkb1snTkVBUFJBU1lUSSddPSR0cnVrc3RhOwogICAgLy8gNC4gQXIgeXJhIHBhc2xhdWd1LCBrdXJpdSB0aWtyYWkgbmF1ZG9qYW0sIGJldCBzYXJhc28gbmVyYQogICAgJHN2PSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgbmFtZSBGUk9NIHskd3BkYi0+cHJlZml4fWNtcGx6X3NlcnZpY2VzIik7CiAgICAkb1sncGFzbGF1Z29zJ109JHN2OwogICAgZm9yZWFjaChhcnJheSgnUGF5c2VyYScsJ1ZlbmlwYWsnLCdTZW5kZXInLCdHb29nbGUgVGFnIE1hbmFnZXInLCdHb29nbGUgQWRzJywnRmxhdHNvbWUnLCdZb3VUdWJlJywnRmFjZWJvb2snKSBhcyAkcCl7CiAgICAgICRvWydhcl95cmFfcGFzbGF1Z2EnXVskcF09aW5fYXJyYXkoJHAsJHN2KT8ndGFpcCc6J05FJzsKICAgIH0KICAgIC8vIDUuIFNrcmlwdGFpIHB1c2xhcHlqZSwga3VyaWUgZGVkYSBzbGFwdWt1cyBwZXIgSlMKICAgICRyPXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSxhcnJheSgndGltZW91dCc9PjQwLCdzc2x2ZXJpZnknPT5mYWxzZSwnaGVhZGVycyc9PmFycmF5KCdVc2VyLUFnZW50Jz0+J01vemlsbGEvNS4wIENocm9tZS8xNTInKSkpOwogICAgJGI9aXNfd3BfZXJyb3IoJHIpPycnOndwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKICAgIGZvcmVhY2goYXJyYXkoJ2dvb2dsZXRhZ21hbmFnZXInPT4nZ29vZ2xldGFnbWFuYWdlci5jb20nLCdndGFnJz0+J2d0YWcoJywncGF5c2VyYSc9PidwYXlzZXJhJywnc2VuZGVyJz0+J3NlbmRlci5uZXQnLCdmYWNlYm9vayc9Pidjb25uZWN0LmZhY2Vib29rJywneW91dHViZSc9Pid5b3V0dWJlLmNvbS9lbWJlZCcsJ2hvdGphcic9Pidob3RqYXInLCdzb3VyY2VidXN0ZXInPT4nc291cmNlYnVzdGVyJykgYXMgJGs9PiR6KSAkb1snc2tyaXB0YWknXVska109c3Vic3RyX2NvdW50KHN0cnRvbG93ZXIoJGIpLHN0cnRvbG93ZXIoJHopKTsKICAgIC8vIDYuIEJhbmVyaW8gYnVzZW5hCiAgICAkb1snYmFuZXJpcyddPWFycmF5KCdsZW50ZWxpdSc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cHJlZml4fWNtcGx6X2Nvb2tpZWJhbm5lcnMiKSwKICAgICAgJ2Jsb2thdmltYXMnPT5zdWJzdHJfY291bnQoJGIsJ2NtcGx6LWJsb2NrZWQtY29udGVudCcpK3N1YnN0cl9jb3VudCgkYiwnZGF0YS1jbXBseicpLAogICAgICAnY21wbHpfanMnPT5zdWJzdHJfY291bnQoJGIsJ2NvbXBsaWFueicpKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-082333';
const GKEY='ps_bkZ';
const PHASES=["C"];
const OUT='analize/s1676_c.json';
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
