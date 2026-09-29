process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzM1YiBneXZ1bmFpLmx0IHBvcnRhbG8gc3RydWt0dXJhIChyZWFkLW9ubHk7IGNvbmZpZy8gbmVza2FpdG9tYXMpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTczNWInXSkpIHJldHVybjsKICAkZj0kX0dFVFsncHNfczE3MzViJ107IEBzZXRfdGltZV9saW1pdCgyNTApOyAkcj1bJ3YnPT4nUzE3MzViJywnZmF6ZSc9PiRmXTsgJEI9Jy9ob21lL2d5dnVuYWkyL2RvbWFpbnMvZ3l2dW5haS5sdC9wdWJsaWNfaHRtbCc7CiAgJGxzPWZ1bmN0aW9uKCRwLCRtYXg9ODApeyAkbz1bXTsgaWYoIUBpc19kaXIoJHApKSByZXR1cm4gJ05FRElSJzsgZm9yZWFjaChAc2NhbmRpcigkcCk/OltdIGFzICRuKXsgaWYoJG49PScuJ3x8JG49PScuLicpIGNvbnRpbnVlOyAkcT0iJHAvJG4iOyAkb1tdPShpc19kaXIoJHEpPydEICc6J0YgJykuJG4uKGlzX2ZpbGUoJHEpPycgJy5yb3VuZChmaWxlc2l6ZSgkcSkvMTAyNCkuJ2snOicnKTsgaWYoY291bnQoJG8pPj0kbWF4KXskb1tdPScuLi4nO2JyZWFrO30gfSByZXR1cm4gJG87IH07CiAgJGNudD1mdW5jdGlvbigkcCl7ICRuPTA7JHM9MDskbnc9MDsgaWYoIWlzX2RpcigkcCkpIHJldHVybiAnTkVESVInOyBmb3JlYWNoKG5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkcCxGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpIGFzICRmaSl7ICRuKys7ICRzKz0kZmktPmdldFNpemUoKTsgJG53PW1heCgkbncsJGZpLT5nZXRNVGltZSgpKTsgfSByZXR1cm4gIiRuIGZhaWzFsywgIi5yb3VuZCgkcy8xMDQ4NTc2KS4iIE1CLCBuYXVqYXVzaWFzICIuZGF0ZSgnWS1tLWQnLCRudyk7IH07CiAgdHJ5ewogICAgJHJbJ2h0YWNjZXNzJ109QGZpbGVfZ2V0X2NvbnRlbnRzKCIkQi8uaHRhY2Nlc3MiKTsKICAgICRyWydpbmRleF9oZWFkJ109c3Vic3RyKEBmaWxlX2dldF9jb250ZW50cygiJEIvaW5kZXgucGhwIiksMCwxNTAwKTsKICAgIGZvcmVhY2goWydhcHBsaWNhdGlvbicsJ2FwcGxpY2F0aW9uL2NvbnRyb2xsZXJzJywnYXBwbGljYXRpb24vbW9kZWxzJywnYXBwbGljYXRpb24vdmlld3MnLCdhcHBsaWNhdGlvbi9saWJyYXJpZXMnLCdhcHBsaWNhdGlvbi9sYW5ndWFnZScsJ0JhY2t1cHMnLCdhc3NldHMnLCdhc3NldHMvdXBsb2FkcycsJ2JhbmVyaWFpJywnZGV2Jywnc3lzdGVtJ10gYXMgJGQpICRyWydsczonLiRkXT0kbHMoIiRCLyRkIik7CiAgICBmb3JlYWNoKFsnYXNzZXRzJywnQmFja3VwcycsJ2FwcGxpY2F0aW9uJywnZGV2JywnYmFuZXJpYWknXSBhcyAkZCkgJHJbJ2NudDonLiRkXT0kY250KCIkQi8kZCIpOwogICAgLy8gdmlld3Mg4oCTIGtva2llIG1vZHVsaWFpCiAgICAkdj1bXTsgaWYoaXNfZGlyKCIkQi9hcHBsaWNhdGlvbi92aWV3cyIpKSBmb3JlYWNoKG5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigiJEIvYXBwbGljYXRpb24vdmlld3MiLEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSkgYXMgJGZpKXsgJHZbXT1zdHJfcmVwbGFjZSgiJEIvYXBwbGljYXRpb24vdmlld3MvIiwnJywkZmktPmdldFBhdGhuYW1lKCkpOyBpZihjb3VudCgkdik+MTUwKSBicmVhazsgfSAkclsndmlld3MnXT0kdjsKICAgIC8vIG1pZ3JhdGlvbnMgLyBzcWwgZHVtcCdhaSBrdXIgbm9ycz8gKHRpayB2YXJkYWkpCiAgICAkc3FsPVtdOyBmb3JlYWNoKG5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkQixGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpIGFzICRmaSl7IGlmKHByZWdfbWF0Y2goJy9cLihzcWx8c3FsXC5nenx6aXB8dGFyXC5neikkL2knLCRmaS0+Z2V0RmlsZW5hbWUoKSkpICRzcWxbXT1zdHJfcmVwbGFjZSgkQiwnJywkZmktPmdldFBhdGhuYW1lKCkpLicgJy5yb3VuZCgkZmktPmdldFNpemUoKS8xMDQ4NTc2LDEpLidNQiAnLmRhdGUoJ1ktbS1kJywkZmktPmdldE1UaW1lKCkpOyBpZihjb3VudCgkc3FsKT40MCkgYnJlYWs7IH0gJHJbJ3NxbF9hcmNoeXZhaSddPSRzcWw7CiAgICAvLyBsb2dzCiAgICAkclsnbHM6bG9ncyddPSRscygnL2hvbWUvZ3l2dW5haTIvZG9tYWlucy9neXZ1bmFpLmx0L2xvZ3MnLDIwKTsKICAgICRyWydsczphcHBsaWNhdGlvbl9iYWNrdXBzJ109JGxzKCcvaG9tZS9neXZ1bmFpMi9hcHBsaWNhdGlvbl9iYWNrdXBzJywzMCk7CiAgICAkclsnbHM6cHJpdmF0ZV9odG1sJ109JGxzKCcvaG9tZS9neXZ1bmFpMi9kb21haW5zL2d5dnVuYWkubHQvcHJpdmF0ZV9odG1sJywyMCk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-065830';
const GKEY='ps_s1735b';
const PHASES=["1"];
const OUT='analize/s1735_b.json';
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
