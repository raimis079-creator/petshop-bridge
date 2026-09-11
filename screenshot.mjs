process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzAgciDigJQgUkVBRC1PTkxZOiBkcm9wc2hpcCBsYWnFoWtvIGtvZGFzICsgYXRtZXRpbW8gcHJhbmXFoWltYWkgKGJvdW5jZSkgaXIga29waWpvcyBhbnRyYcWhdMSXcyBwYcWhdG8gZMSXxb51dMSXc2UuIFR1cmluaW8gbmVyb2RvbSDigJQgdGlrIHRlY2huaW7El3MgYW50cmHFoXTEl3MuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjcwciddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjcwIHInKTsKICB0cnl7CiAgICAkTD1maWxlKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtYXYtZHJvcHNoaXAucGhwJyk7IGZvcigkaT0xMDM1OyRpPDEwOTUgJiYgJGk8Y291bnQoJEwpOyRpKyspICRvWydrb2RhcyddW109KCRpKzEpLic6ICcucnRyaW0obWJfc3Vic3RyKCRMWyRpXSwwLDE5MCkpOwogICAgJGJhc2U9Jy9ob21lL2d5dnVuYWkyL2ltYXAvcGV0c2hvcC5sdCc7ICRvWydkZXp1dGVzJ109aXNfZGlyKCRiYXNlKT9hcnJheV9tYXAoJ2Jhc2VuYW1lJyxnbG9iKCRiYXNlLicvKicsR0xPQl9PTkxZRElSKSk6J27El3JhIHByaWVpZ29zOiAnLiRiYXNlOwogICAgJG51bz1zdHJ0b3RpbWUoJzIwMjYtMDktMTAgMDk6MDA6MDAgVVRDJyk7CiAgICBmb3JlYWNoKGFycmF5KCd1enNha3ltYWknLCd0ZXJyYScpIGFzICR1KXsgJGRpcnM9YXJyYXlfbWVyZ2UoZ2xvYigiJGJhc2UvJHUvTWFpbGRpci9uZXciKT86YXJyYXkoKSxnbG9iKCIkYmFzZS8kdS9NYWlsZGlyL2N1ciIpPzphcnJheSgpKTsKICAgICAgZm9yZWFjaCgkZGlycyBhcyAkZCl7IGZvcmVhY2goZ2xvYigkZC4nLyonKT86YXJyYXkoKSBhcyAkZil7IGlmKGZpbGVtdGltZSgkZik8JG51bykgY29udGludWU7ICRoPUBmaWxlX2dldF9jb250ZW50cygkZixmYWxzZSxudWxsLDAsNjAwMDApOyBpZigkaD09PWZhbHNlKSBjb250aW51ZTsKICAgICAgICAkaGRyPXN1YnN0cigkaCwwLHN0cnBvcygkaCwiXHJcblxyXG4iKT86c3RycG9zKCRoLCJcblxuIik/OjQwMDApOwogICAgICAgICR2Zj1zdHJpcG9zKCRoLCd2ZXRmYXJtYXMnKSE9PWZhbHNlOyAkYm91bmNlPXByZWdfbWF0Y2goJy9eKFN1YmplY3Q6LiooVW5kZWxpdmVyfERlbGl2ZXJ5IFN0YXR1c3xmYWlsdXJlfFJldHVybmVkIG1haWx8TmVwcmlzdGF0eXR8ZGVsaXZlcnkgZmFpbGVkKXxDb250ZW50LVR5cGU6XHMqbXVsdGlwYXJ0XC9yZXBvcnQpL2ltJywkaGRyKTsKICAgICAgICBpZighJHZmICYmICEkYm91bmNlKSBjb250aW51ZTsKICAgICAgICAkZz1hcnJheSgpOyBmb3JlYWNoKGFycmF5KCdEYXRlJywnRnJvbScsJ1RvJywnQ2MnLCdTdWJqZWN0JywnUmV0dXJuLVBhdGgnLCdES0lNLVNpZ25hdHVyZScsJ1gtRmFpbGVkLVJlY2lwaWVudHMnLCdBdXRvLVN1Ym1pdHRlZCcpIGFzICRrKXsgaWYocHJlZ19tYXRjaCgnL14nLiRrLic6XHMqKC4qKD86XHI/XG5bIFx0XS4qKSopL21pJywkaGRyLCRtKSkgJGdbJGtdPW1iX3N1YnN0cihwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsJG1bMV0pLDAsJGs9PT0nREtJTS1TaWduYXR1cmUnPzcwOjIwMCk7IH0KICAgICAgICBpZigkYm91bmNlICYmIHByZWdfbWF0Y2hfYWxsKCcvKFN0YXR1czpccypbXGQuXSt8RGlhZ25vc3RpYy1Db2RlOi4qfFJlbW90ZS1NVEE6Lip8RmluYWwtUmVjaXBpZW50Oi4qfDU1MFsgLV0uezAsMTYwfXw1NTRbIC1dLnswLDE2MH18NVwuXGRcLlxkKy57MCwxMjB9KS9pJywkaCwkbW0pKSAkZ1snZGlhZyddPWFycmF5X3NsaWNlKGFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoYXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gbWJfc3Vic3RyKHRyaW0oJHgpLDAsMjAwKTt9LCRtbVswXSkpKSwwLDgpOwogICAgICAgICRvWydsYWlza2FpJ11bXT1hcnJheSgnZGV6dXRlJz0+JHUsJ2ZhaWxhc19sYWlrYXMnPT53cF9kYXRlKCdtLWQgSDppJyxmaWxlbXRpbWUoJGYpKSwndmZfbWluaW1hcyc9PiR2ZiwnYm91bmNlJz0+KGJvb2wpJGJvdW5jZSwnaCc9PiRnKTsgfSB9IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJG8pOwp9KTsK';
const VER='dep-084903';
const GKEY='ps_s1670r';
const PHASES=["A"];
const OUT='analize/s1670_r.json';
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
