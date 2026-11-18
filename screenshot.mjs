process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODg1azIgVkYgbnVvdHJhdWt1IG5lYXRpdGlraW1haSB2aXNvbXMgcHJla2VtcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4ODVrMiddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTcwKTsgQGluaV9zZXQoJ21lbW9yeV9saW1pdCcsJzc2OE0nKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4ODVrMiddOwogIHRyeXsKICAkc2t1cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwbS5wb3N0X2lkIHBpZCwgcG0ubWV0YV92YWx1ZSBza3UsIHAucG9zdF9zdGF0dXMgc3QgRlJPTSB7JFB9cG9zdG1ldGEgcG0gSk9JTiB7JFB9cG9zdHMgcCBPTiBwLklEPXBtLnBvc3RfaWQgV0hFUkUgcG0ubWV0YV9rZXk9J192Zl9zdXBwbGllcl9za3UnIEFORCBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXMgSU4oJ3B1Ymxpc2gnLCdkcmFmdCcsJ3ByaXZhdGUnKSIsQVJSQVlfQSk7CiAgJGJ5c2t1PVtdOyBmb3JlYWNoKCRza3VzIGFzICRzKSAkYnlza3VbJHNbJ3NrdSddXVtdPSRzOwogICR4PWZpbGVfZ2V0X2NvbnRlbnRzKFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wZXRzaG9wLXZmLWNhY2hlLnhtbCcpOwogIHByZWdfbWF0Y2hfYWxsKCcjPGl0ZW1cYi4qPzwvaXRlbT4jcycsJHgsJGl0ZW1zKTsgJHJbJ3htbF9pdGVtcyddPWNvdW50KCRpdGVtc1swXSk7CiAgJHhtbGltZz1bXTsgJG5lc2s9MDsKICBmb3JlYWNoKCRpdGVtc1swXSBhcyAkaXQpeyBwcmVnX21hdGNoX2FsbCgnIzwoW0EtWmEtel9dKyk+KFtePF17Miw0MH0pPC9cMT4jJywkaXQsJHRnLFBSRUdfU0VUX09SREVSKTsgJHNrdT1udWxsOyBmb3JlYWNoKCR0ZyBhcyAkdCl7IGlmKGlzc2V0KCRieXNrdVt0cmltKCR0WzJdKV0pKXsgJHNrdT10cmltKCR0WzJdKTsgYnJlYWs7IH0gfSBpZighJHNrdSl7ICRuZXNrKys7IGNvbnRpbnVlOyB9CiAgICBwcmVnX21hdGNoX2FsbCgnI3Byb2R1Y3QtaW1hZ2VzLyhcZCspLyMnLCRpdCwkbW0pOyAkeG1saW1nWyRza3VdPWFycmF5X21hcCgnaW50dmFsJywkbW1bMV0pOyB9CiAgJHJbJ3htbF9iZV9tdXN1X3NrdSddPSRuZXNrOyAkclsnc3V0YXBkaW50YSddPWNvdW50KCR4bWxpbWcpOwogICRwbT1bXTsgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpLmF0dGFjaG1lbnRfaWQgYSwgaS5pbWFnZV91cmwgdSBGUk9NIHskUH1wbXhpX2ltYWdlcyBpIFdIRVJFIGkuaW1hZ2VfdXJsIExJS0UgJyVwcm9kdWN0LWltYWdlcy8lJyIsQVJSQVlfQSkgYXMgJHkpeyBpZihwcmVnX21hdGNoKCcjcHJvZHVjdC1pbWFnZXMvKFxkKykvIycsJHlbJ3UnXSwkbSkpICRwbVsoaW50KSR5WydhJ11dPShpbnQpJG1bMV07IH0KICAkYmFkPVtdOyAkb2s9MDsgJHJhbms9MDsgJGJlPTA7CiAgZm9yZWFjaCgkYnlza3UgYXMgJHNrdT0+JGxpc3QpeyBpZighaXNzZXQoJHhtbGltZ1skc2t1XSkpIGNvbnRpbnVlOyBmb3JlYWNoKCRsaXN0IGFzICRzKXsgJHBpZD0oaW50KSRzWydwaWQnXTsgJHRoPShpbnQpZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfdGh1bWJuYWlsX2lkJyx0cnVlKTsgJGdhbD1hcnJheV9maWx0ZXIoYXJyYXlfbWFwKCdpbnR2YWwnLGV4cGxvZGUoJywnLChzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHJvZHVjdF9pbWFnZV9nYWxsZXJ5Jyx0cnVlKSkpKTsKICAgICAgJG1pbmU9W107IGZvcmVhY2goYXJyYXlfbWVyZ2UoWyR0aF0sJGdhbCkgYXMgJGEpeyBpZigkYSAmJiBpc3NldCgkcG1bJGFdKSkgJG1pbmVbXT0kcG1bJGFdOyB9CiAgICAgIGlmKCEkdGgpeyAkYmUrKzsgY29udGludWU7IH0KICAgICAgaWYoIWlzc2V0KCRwbVskdGhdKSl7ICRyYW5rKys7IGNvbnRpbnVlOyB9IC8vIHJhbmthIGlrZWx0YSBudW90cmF1a2EgKG5lIGlzIFZGKQogICAgICAkeGk9JHhtbGltZ1skc2t1XTsKICAgICAgaWYoIWluX2FycmF5KCRwbVskdGhdLCR4aSx0cnVlKSl7ICRiYWRbXT1bJ3BpZCc9PiRwaWQsJ3NrdSc9PiRza3UsJ3N0Jz0+JHNbJ3N0J10sJ211c3UnPT4kbWluZSwneG1sJz0+JHhpLCd0Jz0+bWJfc3Vic3RyKGdldF90aGVfdGl0bGUoJHBpZCksMCw2MCldOyB9IGVsc2UgJG9rKys7IH0gfQogICRyWydvayddPSRvazsgJHJbJ3JhbmthJ109JHJhbms7ICRyWydiZV9udW90ciddPSRiZTsgJHJbJ25lYXRpdGlua2FfbiddPWNvdW50KCRiYWQpOwogICRyWyduZWF0aXRpbmthX3B1YmxfbiddPWNvdW50KGFycmF5X2ZpbHRlcigkYmFkLGZuKCRiKT0+JGJbJ3N0J109PT0ncHVibGlzaCcpKTsKICB1c29ydCgkYmFkLGZuKCRhLCRiKT0+c3RyY21wKCRiWydzdCddLCRhWydzdCddKSk7ICRyWyduZWF0aXRpbmthJ109YXJyYXlfc2xpY2UoJGJhZCwwLDgwKTsKICB9Y2F0Y2goXFRocm93YWJsZSAkZSl7ICRyWydFUlInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsgfSk7Cg==';
const VER='dep-102805';
const GKEY='ps_s1885k2';
const PHASES=["1"];
const OUT='analize/s1885k2.json';
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
