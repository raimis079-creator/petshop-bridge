process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjM5cSBncmF6YSArIGF0c2F1a2ltYXMgKyB2ZWxhdmltbyBsYWlza2FzICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfbjgnXSk/JF9HRVRbJ3BzX244J106JycpIT09J0dPJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2MzlxJyk7CiAgdHJ5ewogICAgLy8gMSkgREFMSU5FIEdSQVpBICMzNTg2MyDigJQgQ2ljaGxpZCBlaWx1dGUgKDMuODkpIC0+IGN1c3RvbWVyX3JlZnVuZGVkX29yZGVyICsga3JlZGl0aW5lCiAgICAkb3JkPXdjX2dldF9vcmRlcigzNTg2Myk7CiAgICBpZighJG9yZHx8JG9yZC0+Z2V0X2JpbGxpbmdfZW1haWwoKSE9PSd0ZXJyYUBwZXRzaG9wLmx0JykgdGhyb3cgbmV3IEV4Y2VwdGlvbignbmUgdGFzJyk7CiAgICAkbGk9YXJyYXkoKTsKICAgIGZvcmVhY2goJG9yZC0+Z2V0X2l0ZW1zKCkgYXMgJGlpZD0+JGl0KXsgaWYoJGl0LT5nZXRfcHJvZHVjdF9pZCgpPT09MTgyNjkpeyAkbGlbJGlpZF09YXJyYXkoJ3F0eSc9PjEsJ3JlZnVuZF90b3RhbCc9PiRpdC0+Z2V0X3RvdGFsKCksJ3JlZnVuZF90YXgnPT5hcnJheSgpKTsgJHN1bWE9JGl0LT5nZXRfdG90YWwoKTsgfSB9CiAgICBpZighJGxpKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCdlaWx1dGVzIG5lcmEnKTsKICAgICRyPXdjX2NyZWF0ZV9yZWZ1bmQoYXJyYXkoJ29yZGVyX2lkJz0+MzU4NjMsJ2Ftb3VudCc9PiRzdW1hLCdyZWFzb24nPT4nUzE2MzkgxaFhYmxvbsWzIHRlc3RhcycsCiAgICAgICdsaW5lX2l0ZW1zJz0+JGxpLCdyZWZ1bmRfcGF5bWVudCc9PmZhbHNlLCdyZXN0b2NrX2l0ZW1zJz0+dHJ1ZSkpOwogICAgaWYoaXNfd3BfZXJyb3IoJHIpKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCdyZWZ1bmQ6ICcuJHItPmdldF9lcnJvcl9tZXNzYWdlKCkpOwogICAgJG9bJ3JlZnVuZF9pZCddPSRyLT5nZXRfaWQoKTsgJG9bJ3JlZnVuZF9zdW1hJ109JHN1bWE7CiAgICAkb1sna3InXT1hcnJheSgnbnInPT5nZXRfcG9zdF9tZXRhKCRyLT5nZXRfaWQoKSwnX3BldHNob3Bfa3JhdnBuX251bWJlcicsdHJ1ZSksJ3BkZic9PmJhc2VuYW1lKChzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkci0+Z2V0X2lkKCksJ19wZXRzaG9wX2tyYXZwbl9wZGYnLHRydWUpKSk7CiAgICAvLyAyKSBBVFNBVUtJTUFTICMzNTg2MiAtPiBjdXN0b21lcl9jYW5jZWxsZWRfb3JkZXIgKGtsaWVudHVpKSArIGFkbWluCiAgICAkbzI9d2NfZ2V0X29yZGVyKDM1ODYyKTsKICAgICRvMi0+dXBkYXRlX3N0YXR1cygnY2FuY2VsbGVkJywnUzE2MzkgxaFhYmxvbsWzIHRlc3RhcycsdHJ1ZSk7CiAgICAkb1snMzU4NjJfc3RhdHVzYXMnXT13Y19nZXRfb3JkZXIoMzU4NjIpLT5nZXRfc3RhdHVzKCk7CiAgICAkb1snMTgyMzZfc3RvY2snXT1nZXRfcG9zdF9tZXRhKDE4MjM2LCdfc3RvY2snLHRydWUpOwogICAgLy8gMykgVkVMQVZJTU8gTEFJU0tBUyDigJQgbmF1amFzIHByb2Nlc3NpbmcgdXpzYWt5bWFzLCB0YWRhIHZlbGF2aW1vX2xhaXNrYWkoKSBzaW11bGl1b3RhIGRpZW5hCiAgICAkbj13Y19jcmVhdGVfb3JkZXIoKTsKICAgICRuLT5hZGRfcHJvZHVjdCh3Y19nZXRfcHJvZHVjdCgxODI3MiksMSk7CiAgICAkc2g9bmV3IFdDX09yZGVyX0l0ZW1fU2hpcHBpbmcoKTsgJHNoLT5zZXRfbWV0aG9kX3RpdGxlKCdWRU5JUEFLIEt1cmplcmlzJyk7CiAgICAkc2gtPnNldF9tZXRob2RfaWQoJ3Nob3B1cF92ZW5pcGFrX3NoaXBwaW5nX2NvdXJpZXJfbWV0aG9kJyk7ICRzaC0+c2V0X2luc3RhbmNlX2lkKDIpOyAkc2gtPnNldF90b3RhbCgnNC45OScpOyAkbi0+YWRkX2l0ZW0oJHNoKTsKICAgICRhZHI9YXJyYXkoJ2ZpcnN0X25hbWUnPT4nUmFpbXVuZGFzJywnbGFzdF9uYW1lJz0+J0J1bGFrYXMnLCdlbWFpbCc9Pid0ZXJyYUBwZXRzaG9wLmx0JywncGhvbmUnPT4nKzM3MDYwMDAwMDAwJywnYWRkcmVzc18xJz0+J1Rlc3RvIGcuIDEnLCdjaXR5Jz0+J1ZpbG5pdXMnLCdwb3N0Y29kZSc9PicwMTEwMCcsJ2NvdW50cnknPT4nTFQnKTsKICAgICRuLT5zZXRfYWRkcmVzcygkYWRyLCdiaWxsaW5nJyk7ICRuLT5zZXRfYWRkcmVzcygkYWRyLCdzaGlwcGluZycpOwogICAgJG4tPnNldF9wYXltZW50X21ldGhvZCgnYmFjcycpOyAkbi0+c2V0X3BheW1lbnRfbWV0aG9kX3RpdGxlKCdCYW5raW5pcyBwYXZlZGltYXMnKTsKICAgICRuLT5jYWxjdWxhdGVfdG90YWxzKCk7CiAgICBhZGRfZmlsdGVyKCd3b29jb21tZXJjZV9lbWFpbF9lbmFibGVkX2N1c3RvbWVyX3Byb2Nlc3Npbmdfb3JkZXInLCdfX3JldHVybl9mYWxzZScpOyAvLyBrYWQgbmV0ZXLFoXR1IHBhxaF0bwogICAgJG4tPnVwZGF0ZV9zdGF0dXMoJ3Byb2Nlc3NpbmcnLCdTMTYzOSB2xJdsYXZpbW8gdGVzdHVpJyx0cnVlKTsKICAgICRuaWQ9JG4tPmdldF9pZCgpOyAkb1sndmVsYXZpbW9fdXpzYWt5bWFzJ109JG5pZDsKICAgICRybT1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9EYXJiYWxhdWtpcycsJ3ZlbGF2aW1vX2xhaXNrYWknKTsgJHJtLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogICAgJG9bJ3ZlbGF2aW1vX3JlcyddPSRybS0+aW52b2tlKG51bGwsIGN1cnJlbnRfdGltZSgndGltZXN0YW1wJykrNSpEQVlfSU5fU0VDT05EUywgYXJyYXkoJG5pZCkpOwogICAgJG9bJ3ZlbGF2aW1vX3p5bWUnXT0oc3RyaW5nKXdjX2dldF9vcmRlcigkbmlkKS0+Z2V0X21ldGEoJ19wc192ZWxhdmltb19sYWlza2FzJyk7CiAgICAkej0oYXJyYXkpZ2V0X29wdGlvbigncHNfZGV2X3Bhc3Rhc196dXJuYWxhcycsYXJyYXkoKSk7CiAgICBmb3JlYWNoKGFycmF5X3NsaWNlKCR6LC02KSBhcyAkeCl7ICRvWyd6J11bXT0keFsnbGFpa2FzJ10uJyB8ICcuJHhbJ2thbSddLicgfCAnLiR4Wyd0ZW1hJ10uJyB8IHByOicuJHhbJ3ByaWVkYWknXS4nICcuJHhbJ2ZhaWxhaSddOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-072249';
const GKEY='ps_n8';
const PHASES=["GO"];
const OUT='analize/s1639_q.json';
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
