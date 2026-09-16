process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODkgbCDigJQgREVQOiBFeGNsdXNpb24gRGlldCBzdXBwbGllciBkaXNjb3VudCAxNSUuIEZFRUQ6IHByaXZlcnN0aW5pcyB0cmF1a2ltYXMgKyBWRVRESUVUIHNrYWljaXVzLiBNQVRDSDogc3VzaWVqaW1vIGxvZ2lrYS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGc9JF9HRVRbJ3BzX3MxNjg5bCddPz8nJzsgaWYoJGc9PT0nJykgcmV0dXJuOyAkbz1hcnJheSgndic9PidTMTY4OSBsJywnZic9PiRnKTsKICAkSU5DPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXhtbC9pbmNsdWRlcy8nOyAkQkFLPWRpcm5hbWUoQUJTUEFUSCkuJy9wcy1hcmNoeXZhcy8nOyBpZighaXNfZGlyKCRCQUspKSAkQkFLPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy8nOwoKICBpZigkZz09PSdERVAnKXsKICAgICRwPSRJTkMuJ2NsYXNzLXByaWNpbmctdmYucGhwJzsgJHNyYz1maWxlX2dldF9jb250ZW50cygkcCk7CiAgICAkYT0iXHRcdCdFeGNsdXNpb24nICAgID0+IDAuMTUsXG5cdFx0J0dyZWVuUGV0Rm9vZCcgPT4gMC4xNSwiOwogICAgJGI9Ilx0XHQnRXhjbHVzaW9uJyAgICA9PiAwLjE1LFxuXHRcdCdFeGNsdXNpb24gRGlldCcgPT4gMC4xNSwgICAvLyB2MS44LjAgKFMxNjg5KSDigJQgUmFpbWlzIHBhdHZpcnRpbm86IFZGIDE1JSBnYWxpb2phIGlyIFZFVERJRVRcblx0XHQnR3JlZW5QZXRGb29kJyA9PiAwLjE1LCI7CiAgICAkbj1zdWJzdHJfY291bnQoJHNyYywkYSk7ICRvWydhbmtlcmlzJ109JG47CiAgICBpZigkbj09PTEpeyAkbmV3PXN0cl9yZXBsYWNlKCRhLCRiLCRzcmMpOyAkb2s9dHJ1ZTsgdHJ5eyB0b2tlbl9nZXRfYWxsKCRuZXcsVE9LRU5fUEFSU0UpO31jYXRjaChcUGFyc2VFcnJvciAkZSl7JG9rPWZhbHNlOyRvWydwYXJzZSddPSRlLT5nZXRNZXNzYWdlKCk7fQogICAgICBpZigkb2speyBjb3B5KCRwLCRCQUsuJ2NsYXNzLXByaWNpbmctdmYucGhwLmJha19zMTY4OWInKTsgJG9bJ2lyYXN5dGEnXT0oYm9vbClmaWxlX3B1dF9jb250ZW50cygkcCwkbmV3LExPQ0tfRVgpOyAkb1snbWQ1J109bWQ1X2ZpbGUoJHApOyB9IH0KICAgICRoYj13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvP3BzX2hiPTEnKSxhcnJheSgndGltZW91dCc9PjIwKSk7ICRvWydoYiddPWlzX3dwX2Vycm9yKCRoYik/JGhiLT5nZXRfZXJyb3JfbWVzc2FnZSgpOndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRoYik7CiAgfQoKICBpZigkZz09PSdGRUVEJyl7CiAgICAkY2xzPScnOyBmb3JlYWNoKGdldF9kZWNsYXJlZF9jbGFzc2VzKCkgYXMgJGMpeyBpZihzdHJpcG9zKCRjLCdWRl9GZWVkJykhPT1mYWxzZSl7ICRjbHM9JGM7IGJyZWFrOyB9IH0KICAgICRvWydrbGFzZSddPSRjbHM7CiAgICBpZigkY2xzKXsgJG9bJ21ldG9kYWknXT1nZXRfY2xhc3NfbWV0aG9kcygkY2xzKTsKICAgICAgZm9yZWFjaChhcnJheSgndHJhdWt0aScsJ2ZldGNoJywncGFyc2lzaXVzdGknLCdhdG5hdWppbnRpJywncnVuJywnY3JvbicpIGFzICRtKXsKICAgICAgICBpZihtZXRob2RfZXhpc3RzKCRjbHMsJG0pKXsgdHJ5eyAkcm09bmV3IFJlZmxlY3Rpb25NZXRob2QoJGNscywkbSk7ICRybS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsgJG9bJ2t2aWVzdGEnXT0kbTsgJHJlcz0kcm0tPmlzU3RhdGljKCk/JHJtLT5pbnZva2UobnVsbCk6JHJtLT5pbnZva2UobmV3ICRjbHMoKSk7ICRvWydyZXonXT1pc19zY2FsYXIoJHJlcyk/JHJlczpqc29uX2RlY29kZShqc29uX2VuY29kZSgkcmVzKSx0cnVlKTsgfWNhdGNoKFxUaHJvd2FibGUgJGUpeyAkb1sna2xhaWRhJ109JGUtPmdldE1lc3NhZ2UoKTsgfSBicmVhazsgfQogICAgICB9CiAgICB9CiAgICAkZj1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcGV0c2hvcC12Zi1jYWNoZS54bWwnOyBjbGVhcnN0YXRjYWNoZSgpOyAkYz1AZmlsZV9nZXRfY29udGVudHMoJGYpOwogICAgJG9bJ2NhY2hlJ109YXJyYXkoJ2xhaWthcyc9PmRhdGUoJ1ktbS1kIEg6aTpzJyxAZmlsZW10aW1lKCRmKSksJ3ZldGRpZXQnPT5zdWJzdHJfY291bnQoKHN0cmluZykkYywnRVhDTCBWRVRESUVUJyksJ2lucHMwNic9PnN1YnN0cl9jb3VudCgoc3RyaW5nKSRjLCdJTlBTMDYnKSwnZWlsdXRlcyc9PnN1YnN0cl9jb3VudCgoc3RyaW5nKSRjLCc8cm93PicpKTsKICAgICRvWydwYXNrdXRpbmlzJ109Z2V0X29wdGlvbigncHNfdmZfZmVlZF9wYXNrdXRpbmlzJyk7CiAgfQoKICBpZigkZz09PSdNQVRDSCcpewogICAgJGY9JElOQy4nY2xhc3MtdmYtaW1wb3J0LnBocCc7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgJEw9ZXhwbG9kZSgiXG4iLCRzKTsgJG91dD1hcnJheSgpOwogICAgZm9yZWFjaCgkTCBhcyAkaT0+JGxuKXsgaWYocHJlZ19tYXRjaCgnfm1hdGNofF92Zl9iYXJjb2RlfF9nbG9iYWxfdW5pcXVlX2lkfF9lYW58ZmluZF9leGlzdHxieV9za3V8YnlfYmFyY29kZX5pJywkbG4pKSAkb3V0W109KCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGxuLDAsMTcwKSk7IH0KICAgICRvWyd2ZmknXT1hcnJheV9zbGljZSgkb3V0LDAsNjApOwogICAgZm9yZWFjaChnbG9iKCRJTkMuJyoucGhwJykgYXMgJGZmKXsgJGM9ZmlsZV9nZXRfY29udGVudHMoJGZmKTsgaWYocHJlZ19tYXRjaCgnfmZ1bmN0aW9uW15cbl0qbWF0Y2h+aScsJGMpKSAkb1snZmFpbGFpX3N1X21hdGNoJ11bXT1iYXNlbmFtZSgkZmYpOyB9CiAgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-162008';
const GKEY='ps_s1689l';
const PHASES=["DEP", "FEED", "MATCH"];
const OUT='analize/s1689_l.json';
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
