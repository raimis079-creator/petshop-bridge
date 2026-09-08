process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjQzdyBkcmFmdCArIHJpbmtpbml1IG51b3RyYXVrdSB0aWtyaW5pbWFzICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfYncnXSk/JF9HRVRbJ3BzX2J3J106JycpIT09J0dPJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgndic9PidTMTY0M3cnKTsKICB0cnl7CiAgICAvLyAxLiBkdmkgYmUga2Fpbm9zIC0+IGRyYWZ0CiAgICBmb3JlYWNoKGFycmF5KDE0Mjc0LDE0ODI0KSBhcyAkaWQpewogICAgICAkYnV2bz1nZXRfcG9zdF9zdGF0dXMoJGlkKTsKICAgICAgJG9bJ2RyYWZ0J11bJGlkXT1hcnJheSgnYnV2byc9PiRidXZvLCdrYWluYSc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHJpY2UnLHRydWUpKTsKICAgICAgaWYoJGJ1dm89PT0ncHVibGlzaCcpeyB3cF91cGRhdGVfcG9zdChhcnJheSgnSUQnPT4kaWQsJ3Bvc3Rfc3RhdHVzJz0+J2RyYWZ0JykpOyBjbGVhbl9wb3N0X2NhY2hlKCRpZCk7IH0KICAgICAgJG9bJ2RyYWZ0J11bJGlkXVsndGFwbyddPWdldF9wb3N0X3N0YXR1cygkaWQpOwogICAgfQogICAgLy8gMi4gZGV2eW5pIHJpbmtpbmlhaSDigJQga2FzIGlzIHRpa3J1anUgeXJhCiAgICAkbHN0PWFycmF5KDM0OTQyLDM0OTQ0LDM0OTQ1LDM0OTQ3LDM0OTM4LDM1MzA5LDM1MzkwLDM1NzgxLDM1ODYxKTsKICAgIGZvcmVhY2goJGxzdCBhcyAkaWQpewogICAgICAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsKICAgICAgJGdhbD1nZXRfcG9zdF9tZXRhKCRpZCwnX3Byb2R1Y3RfaW1hZ2VfZ2FsbGVyeScsdHJ1ZSk7CiAgICAgICRpbWc9JHByPyRwci0+Z2V0X2ltYWdlX2lkKCk6Jyc7CiAgICAgICRwcz1nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3Jpbmtfa29tcG96aWNpamEnLHRydWUpOwogICAgICAkdHVyaV9yaW5rX2ltZyA9IChzdHJwb3MoKHN0cmluZylnZXRfcG9zdF9maWVsZCgncG9zdF9jb250ZW50JywkaWQpLCdwcy1yaW5rLWltZycpIT09ZmFsc2UpPzE6MDsKICAgICAgLy8gTW5NIGtvbXBvbmVudGFpCiAgICAgICRtbm09Z2V0X3Bvc3RfbWV0YSgkaWQsJ19tbm1fZGF0YScsdHJ1ZSk7CiAgICAgICRrb21wPWlzX2FycmF5KCRtbm0pP2NvdW50KCRtbm0pOjA7CiAgICAgICRvWydyaW5raW5pYWknXVtdPWFycmF5KCdpZCc9PiRpZCwnc3QnPT5nZXRfcG9zdF9zdGF0dXMoJGlkKSwKICAgICAgICAndGh1bWInPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3RodW1ibmFpbF9pZCcsdHJ1ZSksJ2dldF9pbWFnZV9pZCc9PiRpbWcsCiAgICAgICAgJ2dhbGVyaWphJz0+JGdhbCwna29tcG9uZW50dSc9PiRrb21wLCdhcHJhc2Vfcmlua19pbWcnPT4kdHVyaV9yaW5rX2ltZywKICAgICAgICAna29tcG96aWNpamFfbWV0YSc9PiRwcz8xOjAsJ3Bhdic9Pm1iX3N1YnN0cihnZXRfdGhlX3RpdGxlKCRpZCksMCw0NSksCiAgICAgICAgJ251b3JvZGEnPT5nZXRfcGVybWFsaW5rKCRpZCkpOwogICAgfQogICAgLy8gdml6dWFsaSBwYXRpa3JhIDMga29ydGVsZW1zCiAgICAkb1snc2hvdHMnXT1hcnJheSgpOwogICAgZm9yZWFjaChhcnJheSgzNDk0MiwzNTMwOSwzNTg2MSkgYXMgJGlkKXsKICAgICAgJG9bJ3Nob3RzJ11bXT1hcnJheSgnbic9PidzMTY0M19yaW5rXycuJGlkLCd1Jz0+Z2V0X3Blcm1hbGluaygkaWQpLAogICAgICAgICdldmFsJz0+IihmdW5jdGlvbigpe3ZhciBnPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9kdWN0LWltYWdlcywgLndvb2NvbW1lcmNlLXByb2R1Y3QtZ2FsbGVyeSwgLnByb2R1Y3QtZ2FsbGVyeScpO3ZhciBpPWc/Zy5xdWVyeVNlbGVjdG9yQWxsKCdpbWcnKTpbXTtyZXR1cm4ge2dhbGVyaWpvc19ibG9rYXM6ISFnLGltZzppLmxlbmd0aCxwaXJtYXM6aVswXT9pWzBdLmdldEF0dHJpYnV0ZSgnc3JjJyk6bnVsbCxyb2RvbWE6aVswXT9pWzBdLm5hdHVyYWxXaWR0aD4wOmZhbHNlfTt9KSgpIik7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-195924';
const GKEY='ps_bw';
const PHASES=["GO"];
const OUT='analize/s1643_w.json';
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
