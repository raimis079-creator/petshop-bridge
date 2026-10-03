process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQ5dSB0ZXN0YXM6IFBha2FydG90aSBsYWlza2FzIGJlIHByZWtpdSBudW9yb2R1ICgzIG51b3JvZG9zKSBpIHRlcnJhQGd5dnVuYWkubHQgKyBzYWJsb25vIGtvZGFzICovCmFkZF9maWx0ZXIoICdwZXRzaG9wX2VtYWlsX2Zsb3dzJywgZnVuY3Rpb24gKCAkZiApIHsgJGZbJ3BzX3MxNzQ5X3Rlc3RhcyddID0gYXJyYXkoICdjbGFzcycgPT4gJ3RyYW5zYWN0aW9uYWwnLCAndGVtcGxhdGUnID0+ICdwcy1zMTc0OS10ZXN0YXMnLCAnZGVsYXknID0+IDAgKTsgcmV0dXJuICRmOyB9ICk7CmFkZF9maWx0ZXIoICdwZXRzaG9wX2VtYWlsX3RlbXBsYXRlX3BhdGgnLCBmdW5jdGlvbiAoICRmaWxlLCAkZmxvdywgJHNsdWcgKSB7IHJldHVybiAoICdwc19zMTc0OV90ZXN0YXMnID09PSAkZmxvdyApID8gZGlybmFtZSggQUJTUEFUSCApIC4gJy9wc19zMTc0OV90ZXN0YXNfdHBsLnBocCcgOiAkZmlsZTsgfSwgMTAsIDMgKTsKYWRkX2FjdGlvbiggJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uICgpIHsKCWlmICggISBpc3NldCggJF9HRVRbJ3BzX3MxNzQ5dSddICkgKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCggMTUwICk7IGdsb2JhbCAkd3BkYjsgJFQgPSAkd3BkYi0+cHJlZml4IC4gJ3BzX2VtYWlsX2pvYnMnOyAkciA9IGFycmF5KCAndicgPT4gJ1MxNzQ5dScsICd1dGMnID0+IGdtZGF0ZSggJ0g6aTpzJyApICk7CgkkdHBsID0gZGlybmFtZSggQUJTUEFUSCApIC4gJy9wc19zMTc0OV90ZXN0YXNfdHBsLnBocCc7CglmaWxlX3B1dF9jb250ZW50cyggJHRwbCwgIjw/cGhwXG5cJHN1YmplY3QgPSAnW1RFU1RBUyBTMTc0OV0gJyAuICggaXNzZXQoIFwkcGF5bG9hZFsndGVtYSddICkgPyBcJHBheWxvYWRbJ3RlbWEnXSA6ICcnICk7XG5lY2hvIGlzc2V0KCBcJHBheWxvYWRbJ2h0bWwnXSApID8gXCRwYXlsb2FkWydodG1sJ10gOiAnJztcbiIgKTsKCSRqID0gJHdwZGItPmdldF9yb3coICJTRUxFQ1QgKiBGUk9NICRUIFdIRVJFIGlkPTEwODIiLCBBUlJBWV9BICk7CgkkY3R4ID0gKGFycmF5KSBqc29uX2RlY29kZSggKHN0cmluZykgJGpbJ2NvbnRleHRfanNvbiddLCB0cnVlICk7ICRwcmVwID0gYXBwbHlfZmlsdGVycyggJ3BldHNob3BfZW1haWxfcHJlcGFyZV9jb250ZXh0JywgJGN0eCwgJ3JlZmlsbF9kdWUnLCAkaiApOyBpZiAoIGlzX2FycmF5KCAkcHJlcCApICkgeyAkY3R4ID0gJHByZXA7IH0KCSRybiA9IFBldHNob3BfRW1haWxfRGlzcGF0Y2g6OnJlbmRlciggJ3JlZmlsbF9kdWUnLCBhcnJheV9tZXJnZSggKGFycmF5KSBqc29uX2RlY29kZSggKHN0cmluZykgJGpbJ3BheWxvYWQnXSwgdHJ1ZSApLCAkY3R4ICksICRqICk7CgkkaHRtbCA9IHByZWdfcmVwbGFjZSggJyM8YVxiW14+XSpocmVmPSJbXiJdKi9wcm9kdWN0L1teIl0qIltePl0qPiguKj8pPC9hPiNpcycsICckMScsICRyblsnaHRtbCddICk7CgkkclsnaHRtbCddID0gYXJyYXkoICdrYicgPT4gcm91bmQoIHN0cmxlbiggJGh0bWwgKSAvIDEwMjQsIDEgKSwgJ2ltZycgPT4gc3Vic3RyX2NvdW50KCBzdHJ0b2xvd2VyKCAkaHRtbCApLCAnPGltZycgKSwgJ251b3JvZHUnID0+IHN1YnN0cl9jb3VudCggc3RydG9sb3dlciggJGh0bWwgKSwgJzxhICcgKSApOwoJJGUgPSBQZXRzaG9wX0VtYWlsX0Rpc3BhdGNoOjplbnF1ZXVlKCAncHNfczE3NDlfdGVzdGFzJywgJ3RlcnJhQGd5dnVuYWkubHQnLCBhcnJheSggJ3RlbWEnID0+ICdQYWthcnRvdGkgbGFpc2thczogMTggcHJla2l1LCAzIG51b3JvZG9zJywgJ2h0bWwnID0+ICRodG1sICksIGFycmF5KCAnam9iX2tleScgPT4gJ3MxNzQ5XzNuXycgLiB0aW1lKCksICdzY2hlZHVsZWRfYXQnID0+ICcyMDMwLTAxLTAxIDAwOjAwOjAwJyApICk7CgkkaWQgPSAoaW50KSAkZVsnam9iX2lkJ107ICR3cGRiLT51cGRhdGUoICRULCBhcnJheSggJ3NjaGVkdWxlZF9hdCcgPT4gY3VycmVudF90aW1lKCAnbXlzcWwnLCB0cnVlICkgKSwgYXJyYXkoICdpZCcgPT4gJGlkICkgKTsKCSRyWydzaXVudGltYXMnXSA9IFBldHNob3BfRW1haWxfRGlzcGF0Y2g6OnByb2Nlc3NfcGVuZGluZyggMjAsIGZhbHNlLCBhcnJheSggJGlkICkgKTsKCSRyWydkYiddID0gJHdwZGItPmdldF9yb3coICJTRUxFQ1QgaWQsc3RhdHVzLGF0dGVtcHRzLHByb3ZpZGVyX21lc3NhZ2VfaWQgbWlkLGxhc3RfZXJyb3IgRlJPTSAkVCBXSEVSRSBpZD0kaWQiLCBBUlJBWV9BICk7CglpZiAoICdzZW50JyAhPT0gJHJbJ2RiJ11bJ3N0YXR1cyddICkgeyAkd3BkYi0+dXBkYXRlKCAkVCwgYXJyYXkoICdzdGF0dXMnID0+ICdza2lwcGVkJywgJ3NraXBfcmVhc29uJyA9PiAnczE3NDlfdGVzdGFzX2JhaWd0YXMnICksIGFycmF5KCAnaWQnID0+ICRpZCApICk7IH0KCXVubGluayggJHRwbCApOyAkclsnc2FibG9uYXNfaXN0cmludGFzJ10gPSAhIGlzX2ZpbGUoICR0cGwgKTsKCSRmaWxlID0gYXBwbHlfZmlsdGVycyggJ3BldHNob3BfZW1haWxfdGVtcGxhdGVfcGF0aCcsIFBFVFNIT1BfQ09SRV9ESVIgLiAndGVtcGxhdGVzL2VtYWlscy9yZWZpbGwucGhwJywgJ3JlZmlsbF9kdWUnLCAncmVmaWxsJyApOwoJJHJbJ3JlZmlsbF9zYWJsb25hcyddID0gc3RyX3JlcGxhY2UoIFdQX0NPTlRFTlRfRElSLCAnJywgJGZpbGUgKSAuICcgJyAuICggaXNfZmlsZSggJGZpbGUgKSA/IG1kNV9maWxlKCAkZmlsZSApIC4gJyAnIC4gZmlsZXNpemUoICRmaWxlICkgOiAnTkVSQScgKTsKCSRyWydyZWZpbGxfa29kYXMnXSA9IGlzX2ZpbGUoICRmaWxlICkgPyBiYXNlNjRfZW5jb2RlKCBmaWxlX2dldF9jb250ZW50cyggJGZpbGUgKSApIDogJyc7CgllY2hvIHdwX2pzb25fZW5jb2RlKCAkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSB8IEpTT05fUFJFVFRZX1BSSU5UICk7IGV4aXQ7Cn0gKTsK';
const VER='dep-200551';
const GKEY='ps_s1749u';
const PHASES=["1"];
const OUT='s1749u.json';
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
