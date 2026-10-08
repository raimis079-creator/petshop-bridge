process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzU5YyB2aXNvcyBkZXp1dGVzL2FwbGFua2FpOiBib3VuY2Ugc3UgY2F0c2Jvb2tzaGVyc2hleXMgbnVvIDEwLTA3IDEyOjAwIFVUQyAocmVhZC1vbmx5LCB0aWsgYW50cmFzdGVzKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NTljJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNjUpOyAkcj1bJ3YnPT4nUzE3NTljJ107CiAgdHJ5ewogICRob21lPScvaG9tZS9neXZ1bmFpMic7ICRzaW5jZT1zdHJ0b3RpbWUoJzIwMjYtMTAtMDcgMTI6MDAgVVRDJyk7ICROPSdjYXRzYm9va3NoZXJzaGV5cyc7CiAgJGJveGVzPShhcnJheSlnbG9iKCRob21lLicvaW1hcC8qLyovTWFpbGRpcicsR0xPQl9PTkxZRElSKTsgJHJbJ2RlenV0ZXMnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpeyByZXR1cm4gcHJlZ19yZXBsYWNlKCcjXi9ob21lL2d5dnVuYWkyL2ltYXAvfC9NYWlsZGlyJCMnLCcnLCR4KTsgfSwkYm94ZXMpOwogICRjbnQ9W107ICRtaW49W107ICRwdno9bnVsbDsgJGtpdGk9W107CiAgZm9yZWFjaCgkYm94ZXMgYXMgJGIpeyAkYm94PXByZWdfcmVwbGFjZSgnI14vaG9tZS9neXZ1bmFpMi9pbWFwL3wvTWFpbGRpciQjJywnJywkYik7CiAgICAkZGlycz1hcnJheV9tZXJnZShbJGIuJy9uZXcnLCRiLicvY3VyJ10sKGFycmF5KWdsb2IoJGIuJy8uKi9uZXcnLEdMT0JfT05MWURJUiksKGFycmF5KWdsb2IoJGIuJy8uKi9jdXInLEdMT0JfT05MWURJUikpOwogICAgZm9yZWFjaCgkZGlycyBhcyAkZCl7ICRmb2xkPSRib3guJyAnLnN1YnN0cigkZCxzdHJsZW4oJGIpKTsgJG5mPTA7ICRuYj0wOwogICAgICBmb3JlYWNoKChhcnJheSlnbG9iKCRkLicvKicpIGFzICRmKXsgJG10PUBmaWxlbXRpbWUoJGYpOyBpZigkbXQ8JHNpbmNlKSBjb250aW51ZTsgJG5mKys7CiAgICAgICAgJHQ9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmLGZhbHNlLG51bGwsMCwyMDAwMCk7IGlmKCR0PT09ZmFsc2UpIGNvbnRpbnVlOwogICAgICAgICRocD1zdHJwb3MoJHQsIlxyXG5cclxuIik7IGlmKCRocD09PWZhbHNlKSAkaHA9c3RycG9zKCR0LCJcblxuIik7ICRIPXN1YnN0cigkdCwwLCRocD86MjAwMCk7CiAgICAgICAgaWYoIXByZWdfbWF0Y2goJy9eU3ViamVjdDpccyooTWFpbCBkZWxpdmVyeSBmYWlsZWR8VW5kZWxpdmVyfERlbGl2ZXJ5IFN0YXR1c3xSZXR1cm5lZCBtYWlsfGZhaWx1cmUgbm90aWNlKS9taScsJEgpKSBjb250aW51ZTsgJG5iKys7CiAgICAgICAgaWYoc3RyaXBvcygkdCwkTikhPT1mYWxzZSl7ICRjbnRbJGZvbGRdPSgkY250WyRmb2xkXT8/MCkrMTsgJGs9Z21kYXRlKCdtLWQgSDppJywkbXQpOyAkbWluWyRrXT0oJG1pblska10/PzApKzE7CiAgICAgICAgICBpZighJHB2eil7ICRmdWxsPUBmaWxlX2dldF9jb250ZW50cygkZixmYWxzZSxudWxsLDAsNjAwMDApOyAkY3A9c3RyaXBvcygkZnVsbCwnVGhpcyBpcyBhIGNvcHkgb2YgdGhlIG1lc3NhZ2UnKTsgaWYoJGNwPT09ZmFsc2UpICRjcD1zdHJpcG9zKCRmdWxsLCdtZXNzYWdlL3JmYzgyMicpOwogICAgICAgICAgICAkcHZ6PVsnZmFpbGFzJz0+JGZvbGQuJy8nLmJhc2VuYW1lKCRmKSwnYm91bmNlX2FudHJhc3Rlcyc9Pm1iX3N1YnN0cigkSCwwLDMwMDApLCdrb3BpamEnPT4kY3AhPT1mYWxzZT9tYl9zdWJzdHIoc3Vic3RyKCRmdWxsLCRjcCw0NTAwKSwwLDQ1MDApOicobmVyYSknXTsgfSB9CiAgICAgICAgZWxzZWlmKGNvdW50KCRraXRpKTwxMCl7IGlmKHByZWdfbWF0Y2goJy9eXHN7Mix9KFteXHNAXStAW15cc10rKVxzKiQvbScsJHQsJG1tKSkgJGtpdGlbXT1bJGZvbGQsZ21kYXRlKCdtLWQgSDppJywkbXQpLCRtbVsxXV07IH0KICAgICAgfQogICAgICBpZigkbmYpICRyWydhcGxhbmthaSddWyRmb2xkXT1bJG5mLCRuYl07CiAgICB9IH0KICBrc29ydCgkbWluKTsgJHJbJ3N1X2FkcmVzdSddPSRjbnQ7ICRyWydwZXJfbWluX3V0YyddPSRtaW47ICRyWydraXRpX2JvdW5jZSddPSRraXRpOyAkclsncHZ6J109JHB2ejsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9KTsK';
const VER='dep-075807';
const GKEY='ps_s1759c';
const PHASES=["1"];
const OUT='out/s1759_c.json';
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
