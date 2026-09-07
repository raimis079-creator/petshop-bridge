process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjM4YyBoaWthcmkgZ2F2aW1hcyAzNjU2L1cvMjAyNiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2wzJ10pPyRfR0VUWydwc19sMyddOicnKSE9PSdHTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjM4YycsJ2Zha3R1cmEnPT4nMzY1Ni9XLzIwMjYnLCdrdXJzYXMnPT40LjEyKTsKICB0cnl7CiAgICBnbG9iYWwgJHdwZGI7ICRQVD0kd3BkYi0+cHJlZml4Lidwc19wYXJ0aWpvcyc7CiAgICAvLyBwaWQsIGVhbiwgcSwgcGxuL3ZudCwgcGF2YWRpbmltYXMgcGF0aWtyYWkKICAgICRlaWw9YXJyYXkoCiAgICAgIGFycmF5KDE4MjM2LCcwNDIwNTUwMTEyMDQnLDUsJzcuOTAnLCdiYWJ5IHBlbGxldCwgMTAwJyksCiAgICAgIGFycmF5KDE4MjY5LCcwNDIwNTUwMzExMTAnLDUsJzUuNDMnLCdDaWNobGlkIFN0YXBsZSBCYWJ5JyksCiAgICAgIGFycmF5KDE4MjcyLCcwNDIwNTUwNDYzMzYnLDUsJzIxLjE1JywnR29sZCBTaW5raW5nIE1pbmknKSwKICAgICAgYXJyYXkoMTgyNzgsJzA0MjA1NTA0NzMzMycsNSwnMjEuMTUnLCdHb2xkIFNpbmtpbmcgTWVkaXVtJyksCiAgICAgIGFycmF5KDE4MjAzLCcwNDIwNTUyMTMxNjUnLDYsJzEzLjg0JywnQWxnYWUgV2FmZXJzJyksCiAgICAgIGFycmF5KDE4MjE4LCcwNDIwNTUwMTQ4MjMnLDEsJzEyNy44MycsJ1N0YXBsZSBMYXJnZSwgNSBrZycpLAogICAgKTsKICAgICRzdW1fcT0wOyRzdW1fcGxuPTA7CiAgICBmb3JlYWNoKCRlaWwgYXMgJGUpewogICAgICBsaXN0KCRwaWQsJGVhbiwkcSwkcGxuLCR6b2Rpcyk9JGU7CiAgICAgICRyPWFycmF5KCdpZCc9PiRwaWQsJ3EnPT4kcSwncGxuJz0+JHBsbik7CiAgICAgICR0PWdldF90aGVfdGl0bGUoJHBpZCk7CiAgICAgIGlmKHN0cnBvcygkdCwkem9kaXMpPT09ZmFsc2UpeyAkclsnU1RPUCddPSdwYXZhZGluaW1hcyBuZXN1dGFtcGE6ICcuJHQ7ICRvWydlaWwnXVtdPSRyOyBjb250aW51ZTsgfQogICAgICAkc2FuZD1nZXRfcG9zdF9tZXRhKCRwaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSk7CiAgICAgIGlmKCRzYW5kIT09J2F2J3x8Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfdmZfcXR5Jyx0cnVlKSE9PScnfHxnZXRfcG9zdF9tZXRhKCRwaWQsJ196Yl9xdHknLHRydWUpIT09JycpewogICAgICAgICRyWydTVE9QJ109J25lIGdyeW5hcyBhdjogc2FuZD0nLiRzYW5kOyAkb1snZWlsJ11bXT0kcjsgY29udGludWU7IH0KICAgICAgJGphdT0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkUFQgV0hFUkUgcHJvZHVjdF9pZD0lZCBBTkQgcGFzdGFiYSBMSUtFICVzIiwkcGlkLCclMzY1Ni9XLzIwMjYlJykpOwogICAgICBpZigkamF1KXsgJHJbJ2phdV95cmEnXT0kamF1OyAkb1snZWlsJ11bXT0kcjsgY29udGludWU7IH0KICAgICAgJHJbJ3N0b2NrX3ByaWVzJ109KGludClnZXRfcG9zdF9tZXRhKCRwaWQsJ19zdG9jaycsdHJ1ZSk7CiAgICAgIC8vIEVBTiBqZWkgdHVzY2lhcwogICAgICBpZihnZXRfcG9zdF9tZXRhKCRwaWQsJ19lYW4nLHRydWUpPT09JycpeyB1cGRhdGVfcG9zdF9tZXRhKCRwaWQsJ19lYW4nLCRlYW4pOyAkclsnZWFuX2lyYXN5dGFzJ109JGVhbjsgfQogICAgICBpZihnZXRfcG9zdF9tZXRhKCRwaWQsJ19nbG9iYWxfdW5pcXVlX2lkJyx0cnVlKT09PScnKXsgdXBkYXRlX3Bvc3RfbWV0YSgkcGlkLCdfZ2xvYmFsX3VuaXF1ZV9pZCcsJGVhbik7IH0KICAgICAgJHJlcz1QZXRzaG9wX1BhcnRpam9zOjpwcmlpbXRpKCRwaWQsYXJyYXkoJ2tpZWtpcyc9PiRxLCdzYXZpa2FpbmEnPT4kcGxuLCd2YWxpdXRhJz0+J1BMTicsJ2t1cnNhcyc9PjQuMTIsCiAgICAgICAgJ3RpZWtlamFzJz0+J0hpa2FyaScsJ3Bhc3RhYmEnPT4nRmFrdHVyYSBWQVQgMzY1Ni9XLzIwMjYgKFMxNjM4KScpKTsKICAgICAgaWYoaXNfd3BfZXJyb3IoJHJlcykpeyAkclsnS0xBSURBJ109JHJlcy0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsgJG9bJ2VpbCddW109JHI7IGNvbnRpbnVlOyB9CiAgICAgICRyWydwYXJ0aWphJ109JHJlczsKICAgICAgLy8ga3J5em1pbmU6IGVpbHV0ZSAtPiBEQgogICAgICAkclsnc3RvY2tfcG8nXT0oaW50KWdldF9wb3N0X21ldGEoJHBpZCwnX3N0b2NrJyx0cnVlKTsKICAgICAgJHA9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCxraWVraXNfZ2F1dGFzLGtpZWtpc19saWtvLHNhdmlrYWluYV9ldXIsc2F2aWthaW5hX29yaWcsdmFsaXV0YSxrdXJzYXMgRlJPTSAkUFQgV0hFUkUgcHJvZHVjdF9pZD0lZCBBTkQgcGFzdGFiYSBMSUtFICVzIiwkcGlkLCclMzY1Ni9XLzIwMjYlJyksQVJSQVlfQSk7CiAgICAgICRyWydkYl9wYXJ0aWphJ109JHA7CiAgICAgICRyWydPSyddPSgkclsnc3RvY2tfcG8nXT09PSRyWydzdG9ja19wcmllcyddKyRxICYmICRwICYmIChpbnQpJHBbJ2tpZWtpc19nYXV0YXMnXT09PSRxCiAgICAgICAgJiYgYWJzKChmbG9hdCkkcFsnc2F2aWthaW5hX29yaWcnXS0oZmxvYXQpJHBsbik8MC4wMDEKICAgICAgICAmJiBhYnMoKGZsb2F0KSRwWydzYXZpa2FpbmFfZXVyJ10tcm91bmQoJHBsbi80LjEyLDQpKTwwLjAwMDEpPzE6J0ZBSUwnOwogICAgICAkc3VtX3ErPSRxOyAkc3VtX3Bsbis9JHEqKGZsb2F0KSRwbG47CiAgICAgICRvWydlaWwnXVtdPSRyOwogICAgfQogICAgLy8gREIgLT4gc2FsdGluaXMKICAgICRkYj0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwcm9kdWN0X2lkLGtpZWtpc19nYXV0YXMsc2F2aWthaW5hX29yaWcgRlJPTSAkUFQgV0hFUkUgcGFzdGFiYSBMSUtFICclMzY1Ni9XLzIwMjYlJyIsQVJSQVlfQSk7CiAgICAkb1snZGJfcGFydGlqdSddPWNvdW50KCRkYik7CiAgICAkb1snZGJfc3VtX3EnXT1hcnJheV9zdW0oYXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gKGludCkkeFsna2lla2lzX2dhdXRhcyddO30sJGRiKSk7CiAgICAkb1snZGJfc3VtX3BsbiddPXJvdW5kKGFycmF5X3N1bShhcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiAkeFsna2lla2lzX2dhdXRhcyddKiR4WydzYXZpa2FpbmFfb3JpZyddO30sJGRiKSksMik7CiAgICAkb1snbGF1a3RhJ109YXJyYXkoJ2VpbCc9PjYsJ3EnPT4yNywncGxuJz0+NDg5LjAyKTsKICAgICRvWydzdW1fYXBwbHknXT1hcnJheSgncSc9PiRzdW1fcSwncGxuJz0+cm91bmQoJHN1bV9wbG4sMikpOwogICAgJG9bJ0tSWVpNSU5FJ109KCRvWydkYl9wYXJ0aWp1J109PT02ICYmICRvWydkYl9zdW1fcSddPT09MjcgJiYgYWJzKCRvWydkYl9zdW1fcGxuJ10tNDg5LjAyKTwwLjAxKT8nT0snOidGQUlMJzsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-211731';
const GKEY='ps_l3';
const PHASES=["GO"];
const OUT='analize/s1638_c2.json';
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
