process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MDcgcnVuMjcg4oCUIHJlY29uOiBhdHNpxJdtaW1vIHByaXN0YXR5bW8gbWV0b2Rhcz8gUHJla2nFsyBrb3J0ZWzEl3MgdmlyxaF1cyBwbyBqdW9zdGEgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7IGlmICghaXNzZXQoJF9HRVRbJ3BzX2RuMyddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd0ZW1wX2lzdHJpbnRhJz0+JHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIikpOwogIGZvcmVhY2goV0NfU2hpcHBpbmdfWm9uZXM6OmdldF96b25lcygpIGFzICR6KXsgZm9yZWFjaCgkelsnc2hpcHBpbmdfbWV0aG9kcyddIGFzICRtKXsgJG9bJ3pvbm9zJ11bJHpbJ3pvbmVfbmFtZSddXVtdPSRtLT5pZC4nOicuJG0tPmdldF9pbnN0YW5jZV9pZCgpLic6Jy4kbS0+Z2V0X3RpdGxlKCkuJzonLigkbS0+aXNfZW5hYmxlZCgpPydvbic6J29mZicpOyB9IH0KICBmb3JlYWNoKFdDKCktPnBheW1lbnRfZ2F0ZXdheXMoKS0+Z2V0X2F2YWlsYWJsZV9wYXltZW50X2dhdGV3YXlzKCkgYXMgJGcpeyAkb1snbW9rZWppbWFpJ11bXT0kZy0+aWQuJzonLiRnLT5nZXRfdGl0bGUoKTsgfQogICRvWydkZXNrX3ZlemVqYXNfc3JjJ109Jyc7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZGVzay5waHAnKTsgaWYocHJlZ19tYXRjaCgnL3Byb3RlY3RlZCBzdGF0aWMgZnVuY3Rpb24gdmV6ZWphc1woLio/XG5cdFx9L3MnLCRjLCRtKSkgJG9bJ2Rlc2tfdmV6ZWphc19zcmMnXT1tYl9zdWJzdHIoJG1bMF0sMCw5MDApOwogIC8vIGthdGFsb2dhcyBkcmF3ZXIKICAkYWRtPWdldF91c2VyX2J5KCdsb2dpbicsJ2JkejQ4NycpOyAkYWlkPSRhZG0tPklEOyAkZXhwPXRpbWUoKSs2MDA7ICR0b2s9V1BfU2Vzc2lvbl9Ub2tlbnM6OmdldF9pbnN0YW5jZSgkYWlkKS0+Y3JlYXRlKCRleHApOyAkY3M9YXJyYXkobmV3IFdQX0h0dHBfQ29va2llKGFycmF5KCduYW1lJz0+U0VDVVJFX0FVVEhfQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCRhaWQsJGV4cCwnc2VjdXJlX2F1dGgnLCR0b2spKSksbmV3IFdQX0h0dHBfQ29va2llKGFycmF5KCduYW1lJz0+QVVUSF9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJGFpZCwkZXhwLCdhdXRoJywkdG9rKSkpLG5ldyBXUF9IdHRwX0Nvb2tpZShhcnJheSgnbmFtZSc9PkxPR0dFRF9JTl9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJGFpZCwkZXhwLCdsb2dnZWRfaW4nLCR0b2spKSkpOwogICRyPXdwX3JlbW90ZV9nZXQoYWRtaW5fdXJsKCdhZG1pbi5waHA/cGFnZT1wcy1rYXRhbG9nYXMma3J1dmE9cHJla3lib2plJnZpZXc9dmlzb3Nfa3J1dm9qZSZxPWpvc2VyYScpLGFycmF5KCdjb29raWVzJz0+JGNzLCd0aW1lb3V0Jz0+NjAsJ3NzbHZlcmlmeSc9PmZhbHNlKSk7ICRiPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKICBwcmVnX21hdGNoX2FsbCgnLyhbLiNdW1x3LV0rKVx7W159XSpwb3NpdGlvbjpccyooZml4ZWR8c3RpY2t5KVtefV0qXH0vJywkYiwkbW0pOyAkb1snZml4ZWQnXT1hcnJheV9zbGljZShhcnJheV91bmlxdWUoJG1tWzBdKSwwLDEyKTsKICBwcmVnX21hdGNoX2FsbCgnLy0tcHNqLWhbXjtdKjt8cGFkZGluZy10b3A6XHMqdmFyXCgtLXBzalteO10qOy8nLCRiLCRtMik7ICRvWydwc2pfdmFycyddPWFycmF5X3NsaWNlKGFycmF5X3VuaXF1ZSgkbTJbMF0pLDAsNik7CiAgcHJlZ19tYXRjaCgnLzxzdHlsZVtePl0qaWQ9InBzalteIl0qIltePl0qPiguKj8pPFwvc3R5bGU+L3MnLCRiLCRtMyk7ICRvWydwc2pfY3NzJ109bWJfc3Vic3RyKCRtM1sxXT8/JycsMCw2MDApOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7IH0pOwo=';
const VER='dep-140617';
const GKEY='ps_dn3';
const PHASES=["T"];
const OUT='analize/e2_run27.json';
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
