process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NDMgQSDigJQgcGFyZHVvdMWzIERFTFRBIGFwcGx5OiAxMiBncnluxbMgQVYgZWlsdcSNacWzICgxMjA5OeKAkzEyMTA2KS4gU2FyZ2FpOiBfcHNfc2FuZGVsaXM9J2F2JywgdmYvemIgdHXFocSNaW9zLCBtYW5hZ2Vfc3RvY2s9eWVzLCBsYXVraWFtYXMgc2VuYXMgc3RvY2suICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjQzYSddKSkgcmV0dXJuOwogICRmPXN0cnRvdXBwZXIoc2FuaXRpemVfa2V5KCRfR0VUWydwc19zMTY0M2EnXSkpOyAkbz1hcnJheSgndic9PidTMTY0MyBBJywnZic9PiRmKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyBzZXRfdGltZV9saW1pdCgyODApOwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKCiAgLy8gc2t1O3BpZDtidXZvO2tpZWtpcwogICREPSI1NDE0MzY1MjYwNTY5OzE1NTI3OzEzOzEKODM3MjI7MTk3MDg7MjA7Mwo4MzcyMTsxOTY4NTszNTszCjgzOTY3OzE5NjEzOzI3OzMKNzA0MDAxOzE4MTMxOzc7MQpHMzc4OzE3NjQ0OzE7MQo4Mjc2NzsxOTU3ODs2MzsyCjgyNzY1OzE5NDc5OzE0MzsyCjgyNzY0OzE5NDg4OzIwOzIKODI3NDE7MTk1OTg7MTAzOzIKODI4MDQ7MTk1NjI7NTY7MgpHMzc3OzE3NjQxOzU7MSI7CgogICRyPWFycmF5KCk7ICRvaz0wOyAkc2tpcD0wOyAkc3VtPTA7CiAgZm9yZWFjaChhcnJheV9maWx0ZXIoZXhwbG9kZSgiXG4iLCREKSkgYXMgJGwpewogICAgJGM9ZXhwbG9kZSgnOycsJGwpOyAkcz10cmltKCRjWzBdKTsgJHBpZD0oaW50KSRjWzFdOyAkYnV2bz0oaW50KSRjWzJdOyAkcT0oaW50KSRjWzNdOwogICAgJHg9YXJyYXkoJ3NrdSc9PiRzLCdwaWQnPT4kcGlkLCdxJz0+JHEpOwogICAgaWYodHJpbSgoc3RyaW5nKWdldF9wb3N0X21ldGEoJHBpZCwnX3NrdScsdHJ1ZSkpIT09JHMpeyAkeFsnc2tpcCddPSdTS1UgbmVzdXRhbXBhJzsgJHJbXT0keDsgJHNraXArKzsgY29udGludWU7IH0KICAgIGlmKGdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKSE9PSdhdicpeyAkeFsnc2tpcCddPSduZSBhdic7ICRyW109JHg7ICRza2lwKys7IGNvbnRpbnVlOyB9CiAgICAkdmY9Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfdmZfcXR5Jyx0cnVlKTsgJHpiPWdldF9wb3N0X21ldGEoJHBpZCwnX3piX3F0eScsdHJ1ZSk7CiAgICBpZigkdmYhPT0nJyB8fCAkemIhPT0nJyl7ICR4Wydza2lwJ109J3ZmL3piIHlyYSc7ICRyW109JHg7ICRza2lwKys7IGNvbnRpbnVlOyB9CiAgICBpZihnZXRfcG9zdF9tZXRhKCRwaWQsJ19tYW5hZ2Vfc3RvY2snLHRydWUpIT09J3llcycpeyAkeFsnc2tpcCddPSdtYW5hZ2Vfc3RvY2sgbmUgeWVzJzsgJHJbXT0keDsgJHNraXArKzsgY29udGludWU7IH0KICAgICRkYj0oaW50KWdldF9wb3N0X21ldGEoJHBpZCwnX3N0b2NrJyx0cnVlKTsKICAgIGlmKCRkYiE9PSRidXZvKXsgJHhbJ3NraXAnXT0nc3RvY2sgcGFzaWtlaXRlOiBkYicuJGRiLicgbGF1aycuJGJ1dm87ICRyW109JHg7ICRza2lwKys7IGNvbnRpbnVlOyB9CiAgICBpZigkZj09PSdBJyl7CiAgICAgICRwcj13Y19nZXRfcHJvZHVjdCgkcGlkKTsgJHByLT5zZXRfbWFuYWdlX3N0b2NrKHRydWUpOyAkcHItPnNldF9zdG9ja19xdWFudGl0eSgkZGItJHEpOyAkcHItPnNhdmUoKTsKICAgICAgJHhbJ3BvJ109KGludClnZXRfcG9zdF9tZXRhKCRwaWQsJ19zdG9jaycsdHJ1ZSk7CiAgICB9CiAgICAkeFsnYnV2byddPSRkYjsgJHhbJ25hdWphcyddPSRkYi0kcTsgJG9rKys7ICRzdW0rPSRxOyAkcltdPSR4OwogIH0KICAkb1snZWlsdXRlcyddPSRyOyAkb1snb2snXT0kb2s7ICRvWydza2lwJ109JHNraXA7ICRvWydudXJhc3l0YV92bnQnXT0kc3VtOwogICRvWydkYl9zdG9ja19zdW1hJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIFNVTShtZXRhX3ZhbHVlKzApIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfc3RvY2snIik7CiAgJG9bJ3BpbmcnXT13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSh3cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvJyksYXJyYXkoJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='dep-213743';
const GKEY='ps_s1643a';
const PHASES=["A"];
const OUT='analize/s1643a.json';
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
