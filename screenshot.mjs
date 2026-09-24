process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzEzaCB2YWx5bW8gdGVzdGFzIHBlciBwZXRzaG9wLmx0IGhvc3RhICgxIGNhY2hlK3ZpZGluZSB1emtsYXVzYSAvIDIgcGF0aWtyYSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzEzaCddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTcxM2gnXTsgQHNldF90aW1lX2xpbWl0KDE3MCk7ICRyPVsndic9PidTMTcxM2gnLCdmYXplJz0+JGYsJ2hvc3QnPT4kX1NFUlZFUlsnSFRUUF9IT1NUJ10/P251bGxdOyAkcGlkPTE3OTc4OwogICRjcD0kR0xPQkFMU1snY2FjaGVfcGF0aCddPz8oV1BfQ09OVEVOVF9ESVIuJy9jYWNoZS8nKTsgJHNjPSRjcC4nc3VwZXJjYWNoZS9wZXRzaG9wLmx0Lyc7ICR1PWdldF9wZXJtYWxpbmsoJHBpZCk7ICRkPSRzYy50cmltKHBhcnNlX3VybCgkdSxQSFBfVVJMX1BBVEgpLCcvJykuJy8nOwogICRzdD1mdW5jdGlvbigpIHVzZSgkZCwkc2MpeyBjbGVhcnN0YXRjYWNoZSgpOyByZXR1cm4gWydwcmVrZSc9PmlzX2RpcigkZCk/YXJyYXlfdmFsdWVzKGFycmF5X21hcCgnYmFzZW5hbWUnLGFycmF5X2ZpbHRlcihnbG9iKCRkLid7LC59KicsR0xPQl9CUkFDRSk/OltdLCdpc19maWxlJykpKTonTkVSQScsJ2hvbWUnPT5hcnJheV9tYXAoJ2Jhc2VuYW1lJyxnbG9iKCRzYy4naW5kZXgqJyk/OltdKSwna2F0X2thdGVtcyc9PmlzX2Rpcigkc2MuJ2thdGVnb3JpamEva2F0ZW1zJyk/YXJyYXlfbWFwKCdiYXNlbmFtZScsZ2xvYigkc2MuJ2thdGVnb3JpamEva2F0ZW1zLyonKT86W10pOidORVJBJ107IH07CiAgdHJ5ewogICAgaWYoJGY9PT0nMScpeyB3cF9yZW1vdGVfZ2V0KCR1LFsndGltZW91dCc9PjQwLCdzc2x2ZXJpZnknPT5mYWxzZV0pOyB3cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvJyksWyd0aW1lb3V0Jz0+NDAsJ3NzbHZlcmlmeSc9PmZhbHNlXSk7IHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy9rYXRlZ29yaWphL2thdGVtcy8nKSxbJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgJHJbJ3ByaWVzJ109JHN0KCk7CiAgICAgICRoPXdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8/cHNfczE3MTNoPTYmbmM9Jy5tdF9yYW5kKCkpLFsndGltZW91dCc9PjYwLCdzc2x2ZXJpZnknPT5mYWxzZV0pOyAkclsndmlkaW5lJ109W3dwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRoKSxzdWJzdHIod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJGgpLDAsMzAwKV07ICRyWydwbyddPSRzdCgpOyB9CiAgICBpZigkZj09PSc2Jyl7ICRyWydwcmllcyddPSRzdCgpOyAkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsgZG9fYWN0aW9uKCd3b29jb21tZXJjZV9wcm9kdWN0X3NldF9zdG9jaycsJHApOyAkclsnZWlsZSddPSdzaHV0ZG93bic7ICRyWydnY3VzZCddPWdldF9jdXJyZW50X3VybF9zdXBlcmNhY2hlX2RpcigkcGlkKTsgfQogICAgaWYoJGY9PT0nMicpeyAkclsnZGFiYXInXT0kc3QoKTsgJHJbJ2Rldl9kaXInXT1pc19kaXIoJGNwLidzdXBlcmNhY2hlL2Rldi5hdmVzYS5sdCcpP2FycmF5X21hcCgnYmFzZW5hbWUnLGdsb2IoJGNwLidzdXBlcmNhY2hlL2Rldi5hdmVzYS5sdC8qJyk/OltdKTonTkVSQSc7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-184739';
const GKEY='ps_s1713h';
const PHASES=["1", "2"];
const OUT='analize/s1713_h1.json';
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
