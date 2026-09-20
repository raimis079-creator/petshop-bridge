process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTUgYyDigJQgYF9wc19zb3VyY2VgIGtvbmZsaWt0YXM6IGthcyByYcWhbyBjYWxjX3Byb2R1Y3QgKGtvZGFzKSwga2FpcCBkZXNrL2RhcmJhbGF1a2lzL2F2LXNvdXJjZSBza2FpdG8gYF9wc19zb3VyY2VgLCBraWVrIHXFvnNha3ltxbMgZWlsdcSNacWzIHR1cmkgbmUgYXYvdmYvemIgcmVpa8WhbWVzOyAjMTEyMSBlaWx1dMSXLiBSZWFkLW9ubHkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjk1YyddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7ICRwPSR3cGRiLT5wcmVmaXg7ICRDPVdQX0NPTlRFTlRfRElSOwogICRvWydyZWlrc21lcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9pbS5tZXRhX3ZhbHVlIHYsQ09VTlQoKikgbixNSU4ob2kub3JkZXJfaWQpIG51byxNQVgob2kub3JkZXJfaWQpIGlraSBGUk9NIHskcH13b29jb21tZXJjZV9vcmRlcl9pdGVtbWV0YSBvaW0gSk9JTiB7JHB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbXMgb2kgT04gb2kub3JkZXJfaXRlbV9pZD1vaW0ub3JkZXJfaXRlbV9pZCBXSEVSRSBvaW0ubWV0YV9rZXk9J19wc19zb3VyY2UnIEdST1VQIEJZIHYiLEFSUkFZX0EpOwogICRvWydjYWxjX3V6cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9pLm9yZGVyX2lkLG8uc3RhdHVzLG8uZGF0ZV9jcmVhdGVkX2dtdCxvaS5vcmRlcl9pdGVtX25hbWUgRlJPTSB7JHB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgb2ltIEpPSU4geyRwfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1zIG9pIE9OIG9pLm9yZGVyX2l0ZW1faWQ9b2ltLm9yZGVyX2l0ZW1faWQgSk9JTiB7JHB9d2Nfb3JkZXJzIG8gT04gby5pZD1vaS5vcmRlcl9pZCBXSEVSRSBvaW0ubWV0YV9rZXk9J19wc19zb3VyY2UnIEFORCBvaW0ubWV0YV92YWx1ZSBOT1QgSU4gKCdhdicsJ3ZmJywnemInLCdwcmlucycpIE9SREVSIEJZIG9pLm9yZGVyX2lkIERFU0MgTElNSVQgMTUiLEFSUkFZX0EpOwogICRvWydlMTEyMSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9pbS5tZXRhX2tleSxMRUZUKG9pbS5tZXRhX3ZhbHVlLDYwKSB2IEZST00geyRwfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIG9pbSBKT0lOIHskcH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBvaSBPTiBvaS5vcmRlcl9pdGVtX2lkPW9pbS5vcmRlcl9pdGVtX2lkIFdIRVJFIG9pLm9yZGVyX2lkPTM2MDk1IEFORCBvaS5vcmRlcl9pdGVtX3R5cGU9J2xpbmVfaXRlbScgQU5EIG9pbS5tZXRhX2tleSBMSUtFICdfcHNfJSciLEFSUkFZX0EpOwogIC8vIGthcyByYcWhbyBjYWxjX3Byb2R1Y3QgLyBfcHNfc291cmNlCiAgJGZpbGVzPWFycmF5X21lcmdlKGdsb2IoIiRDL211LXBsdWdpbnMvKi5waHAiKSxnbG9iKCIkQy9wbHVnaW5zL3BldHNob3AtY29yZS8qLnBocCIpLGdsb2IoIiRDL3BsdWdpbnMvcGV0c2hvcC1jb3JlL2luY2x1ZGVzLyoucGhwIiksZ2xvYigiJEMvcGx1Z2lucy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvKi8qLnBocCIpLGdsb2IoIiRDL3BsdWdpbnMvcGV0c2hvcC1jb3JlL2Fzc2V0cy8qLmpzIiksZ2xvYigiJEMvdGhlbWVzL2ZsYXRzb21lLWNoaWxkLyoucGhwIiksZ2xvYigiJEMvdGhlbWVzL2ZsYXRzb21lLWNoaWxkL2pzLyouanMiKSk7CiAgZm9yZWFjaCAoJGZpbGVzIGFzICRmKXsgJHM9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgaWYgKCRzPT09ZmFsc2UpIGNvbnRpbnVlOyAkaz1zdHJfcmVwbGFjZSgkQywnJywkZik7CiAgICBpZiAoc3RycG9zKCRzLCdjYWxjX3Byb2R1Y3QnKSE9PWZhbHNlKXsgcHJlZ19tYXRjaF9hbGwoJy9bXlxuXXswLDEyMH1jYWxjX3Byb2R1Y3RbXlxuXXswLDE0MH0vJywkcywkbSk7ICRvWydjYWxjX3Byb2R1Y3Rfa29kZSddWyRrXT1hcnJheV9zbGljZShhcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtWzBdKSksMCw2KTsgfQogICAgaWYgKHN0cnBvcygkcywiX3BzX3NvdXJjZSIpIT09ZmFsc2UpeyBwcmVnX21hdGNoX2FsbCgnL1teXG5dezAsMTEwfV9wc19zb3VyY2VbXlxuXXswLDE0MH0vJywkcywkbSk7ICRvWydfcHNfc291cmNlX2tvZGUnXVska109YXJyYXlfc2xpY2UoYXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkbVswXSkpLDAsOCk7IH0gfQogICRvWydzbmlwcGV0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0xIEFORCAoY29kZSBMSUtFICclY2FsY19wcm9kdWN0JScgT1IgY29kZSBMSUtFICclX3BzX3NvdXJjZSUnKSBMSU1JVCAxMCIsQVJSQVlfQSk7CiAgLy8gZGFyYmFsYXVraW8gdGVrc3RhcyDigJ5zaXVuxI1pYSBrbGllbnR1aSIKICBmb3JlYWNoIChhcnJheSgiJEMvbXUtcGx1Z2lucy9wZXRzaG9wLWRhcmJhbGF1a2lzLnBocCIsIiRDL211LXBsdWdpbnMvcGV0c2hvcC1kZXNrLnBocCIpIGFzICRmKXsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGYpOyBwcmVnX21hdGNoX2FsbCgnL1teXG5dezAsMTQwfXNpdW4oxI18YylpYSBrbGllbnR1aVteXG5dezAsMTQwfS91JywkcywkbSk7ICRvWydzaXVuY2lhX2tsaWVudHVpJ11bYmFzZW5hbWUoJGYpXT1hcnJheV9zbGljZShhcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtWzBdKSksMCw2KTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-074122';
const GKEY='ps_s1695c';
const PHASES=["1"];
const OUT='analize/s1695_c.json';
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
