process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzEzaSBwZXRzaG9wLWNhY2hlLnBocCBudXNrYWl0eW1hcyAvIGRlcGxveSB2MS4xICgxIHNrYWl0eXRpIC8gMiBkZXBsb3kgLyAzIHBhdGlrcmEgLyA5IGF0c3RhdHl0aSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzEzaSddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTcxM2knXTsgQHNldF90aW1lX2xpbWl0KDE3MCk7ICRyPVsndic9PidTMTcxM2knLCdmYXplJz0+JGZdOyAkZm49V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1jYWNoZS5waHAnOyAkYmFrPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzL3BldHNob3AtY2FjaGUucGhwLmJha19zMTcxMyc7CiAgdHJ5ewogICAgaWYoJGY9PT0nMScpeyAkclsnbWQ1J109bWQ1X2ZpbGUoJGZuKTsgJHJbJ2R5ZGlzJ109ZmlsZXNpemUoJGZuKTsgJHJbJ2I2NCddPWJhc2U2NF9lbmNvZGUoZmlsZV9nZXRfY29udGVudHMoJGZuKSk7IH0KICAgIGlmKCRmPT09JzInKXsKICAgICAgJGI2ND0nJSVCNjQlJSc7ICRtZDU9JyUlTUQ1JSUnOyAkbmV3PWJhc2U2NF9kZWNvZGUoJGI2NCk7IGlmKG1kNSgkbmV3KSE9PSRtZDUpIHRocm93IG5ldyBFeGNlcHRpb24oJ21kNSBuZXN1dGFtcGEgJy5tZDUoJG5ldykpOwogICAgICAkdG9rPUB0b2tlbl9nZXRfYWxsKCRuZXcsVE9LRU5fUEFSU0UpOyBpZighJHRvaykgdGhyb3cgbmV3IEV4Y2VwdGlvbigndG9rZW5fZ2V0X2FsbCcpOwogICAgICBpZighZmlsZV9leGlzdHMoJGJhaykpIGNvcHkoJGZuLCRiYWspOyAkclsnYmFrJ109WyRiYWssbWQ1X2ZpbGUoJGJhayldOwogICAgICBmaWxlX3B1dF9jb250ZW50cygkZm4sJG5ldyk7ICRyWyduYXVqYV9tZDUnXT1tZDVfZmlsZSgkZm4pOwogICAgICAkaD13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvP25jPScubXRfcmFuZCgpKSxbJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgJHJbJ2hlYXJ0YmVhdCddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRoKTsKICAgICAgaWYoJHJbJ2hlYXJ0YmVhdCddPj01MDB8fCRyWydoZWFydGJlYXQnXT09MCl7IGNvcHkoJGJhaywkZm4pOyAkclsnUk9MTEJBQ0snXT0xOyB9CiAgICB9CiAgICBpZigkZj09PSczJyl7CiAgICAgICRwaWQ9MTc5Nzg7ICRjcD0kR0xPQkFMU1snY2FjaGVfcGF0aCddPz8oV1BfQ09OVEVOVF9ESVIuJy9jYWNoZS8nKTsgJHNjPSRjcC4nc3VwZXJjYWNoZS9wZXRzaG9wLmx0Lyc7CiAgICAgICR1cmxzPVsnLycsJy9rYXRlZ29yaWphL3N1bmltcy9tYWlzdGFzLXN1bmltcy9zYXVzYXMtbWFpc3Rhcy1zdW5pbXMvJywnL2thdGVnb3JpamEvc3VuaW1zL21haXN0YXMtc3VuaW1zLycsJy9rYXRlZ29yaWphL3N1bmltcy8nLCcvZ2FtaW50b2phcy9qb3NlcmEvJywnL3BhcmR1b3R1dmUvJywnL2thdGVnb3JpamEva2F0ZW1zLyddOyAkZGlycz1bXTsgZm9yZWFjaCgkdXJscyBhcyAkdSl7IHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJHUpLFsndGltZW91dCc9PjQwLCdzc2x2ZXJpZnknPT5mYWxzZV0pOyAkZGlyc1skdV09JHNjLnRyaW0oJHUsJy8nKS4nLyc7IH0KICAgICAgJHN0PWZ1bmN0aW9uKCkgdXNlKCRkaXJzKXsgY2xlYXJzdGF0Y2FjaGUoKTsgJG89W107IGZvcmVhY2goJGRpcnMgYXMgJHU9PiRkKXsgJG9bJHVdPWlzX2RpcigkZCk/YXJyYXlfdmFsdWVzKGFycmF5X21hcCgnYmFzZW5hbWUnLGFycmF5X2ZpbHRlcihnbG9iKCRkLidpbmRleConKT86W10sJ2lzX2ZpbGUnKSkpOidORVJBJzsgfSByZXR1cm4gJG87IH07CiAgICAgICRyWydwcmllcyddPSRzdCgpOyAkclsndmVyc2lqYSddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9DYWNoZScpP1BldHNob3BfQ2FjaGU6OlZFUlNJSkE6bnVsbDsKICAgICAgJGg9d3BfcmVtb3RlX2dldChob21lX3VybCgnLz9wc19zMTcxM2k9NiZuYz0nLm10X3JhbmQoKSksWyd0aW1lb3V0Jz0+NjAsJ3NzbHZlcmlmeSc9PmZhbHNlXSk7ICRyWyd2aWRpbmUnXT1bd3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJGgpLHN1YnN0cih3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkaCksMCwyMDApXTsKICAgICAgJHJbJ3BvJ109JHN0KCk7CiAgICB9CiAgICBpZigkZj09PSc2Jyl7ICRyWydob3N0J109JF9TRVJWRVJbJ0hUVFBfSE9TVCddPz9udWxsOyAkcD13Y19nZXRfcHJvZHVjdCgxNzk3OCk7IGRvX2FjdGlvbignd29vY29tbWVyY2VfcHJvZHVjdF9zZXRfc3RvY2snLCRwKTsgJHJbJ2VpbGUnXT0nc2h1dGRvd24nOyB9CiAgICBpZigkZj09PSc5Jyl7IGlmKCFmaWxlX2V4aXN0cygkYmFrKSkgdGhyb3cgbmV3IEV4Y2VwdGlvbignYmFrIG5lcmEnKTsgY29weSgkYmFrLCRmbik7ICRyWydhdHN0YXR5dGEnXT1tZDVfZmlsZSgkZm4pOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSwgMSk7Cg==';
const VER='dep-185029';
const GKEY='ps_s1713i';
const PHASES=["1"];
const OUT='analize/s1713_i1.json';
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
