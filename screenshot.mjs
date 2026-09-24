process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzEzZSB2YWx5bW8gdGVzdGFzIGF0c2tpcm9taXMgdXprbGF1c29taXMgKDEgc3VrdXJ0aSBjYWNoZSAvIDIgc2V0X3N0b2NrIC8gMyBwYXRpa3JhIC8gNCBwb3N0X2NoYW5nZSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzEzZSddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTcxM2UnXTsgQHNldF90aW1lX2xpbWl0KDE3MCk7IGdsb2JhbCAkd3BkYjsgJHI9Wyd2Jz0+J1MxNzEzZScsJ2ZhemUnPT4kZl07CiAgJGNwPSRHTE9CQUxTWydjYWNoZV9wYXRoJ10/PyhXUF9DT05URU5UX0RJUi4nL2NhY2hlLycpOyAkc2M9JGNwLidzdXBlcmNhY2hlL3BldHNob3AubHQvJzsKICAkcGlkPTE3OTc4OyAkdT1nZXRfcGVybWFsaW5rKCRwaWQpOyAkZD0kc2MudHJpbShwYXJzZV91cmwoJHUsUEhQX1VSTF9QQVRIKSwnLycpLicvJzsKICAkc3Q9ZnVuY3Rpb24oKSB1c2UoJGQsJHNjKXsgY2xlYXJzdGF0Y2FjaGUoKTsgcmV0dXJuIFsncHJla2UnPT5pc19kaXIoJGQpP2FycmF5X21hcCgnYmFzZW5hbWUnLGdsb2IoJGQuJyonKT86W10pOidORVJBJywnaG9tZSc9PmFycmF5X21hcCgnYmFzZW5hbWUnLGdsb2IoJHNjLidpbmRleConKT86W10pLCdrYXQnPT5pc19kaXIoJHNjLidrYXRlZ29yaWphJyk/Y291bnQoZ2xvYigkc2MuJ2thdGVnb3JpamEvKicpPzpbXSk6J05FUkEnXTsgfTsKICB0cnl7CiAgICBpZigkZj09PScxJyl7IHdwX3JlbW90ZV9nZXQoJHUsWyd0aW1lb3V0Jz0+NDAsJ3NzbHZlcmlmeSc9PmZhbHNlXSk7IHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSxbJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgd3BfcmVtb3RlX2dldChob21lX3VybCgnL2thdGVnb3JpamEva2F0ZW1zLycpLFsndGltZW91dCc9PjQwLCdzc2x2ZXJpZnknPT5mYWxzZV0pOyAkclsncG8nXT0kc3QoKTsgfQogICAgaWYoJGY9PT0nMicpeyAkclsncHJpZXMnXT0kc3QoKTsgJHA9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7IGRvX2FjdGlvbignd29vY29tbWVyY2VfcHJvZHVjdF9zZXRfc3RvY2snLCRwKTsgJHJbJ2lza2FydCddPSRzdCgpOyAkclsncGFzdGFiYSddPSd2YWx5bWFzIHBlciBzaHV0ZG93biDigJQgeml1cmV0aSBmYXplIDMnOyB9CiAgICBpZigkZj09PSczJyl7ICRyWydkYWJhciddPSRzdCgpOyB9CiAgICBpZigkZj09PSc0Jyl7ICRyWydwcmllcyddPSRzdCgpOyBpZihmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX3Bvc3RfY2hhbmdlJykpIHdwX2NhY2hlX3Bvc3RfY2hhbmdlKCRwaWQpOyAkclsnaXNrYXJ0J109JHN0KCk7IH0KICAgIGlmKCRmPT09JzUnKXsgJHJbJ3ByaWVzJ109JHN0KCk7IGRvX2FjdGlvbigncGV0c2hvcF9jYWNoZV9pc3ZhbHl0aScpOyAkclsnaXNrYXJ0J109JHN0KCk7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-184008';
const GKEY='ps_s1713e';
const PHASES=["1", "2", "3"];
const OUT='analize/s1713_e1.json';
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
