process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA3ZiBsYXVrYWkgcGlsbmFzIGF1ZGl0YXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODA3ZiddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTIwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4MDdmJ107CiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIERJU1RJTkNUIHBvc3RfaWQgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19wc19sYXVrYXMnIik7CiAgJHNhbmQ9ZnVuY3Rpb24oJHBpZCl7ICRzPWdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKTsgaWYoJHMpIHJldHVybiAkczsgJHNyYz0kd3BkYl9kdW1teT1udWxsOyByZXR1cm4gJyc7IH07CiAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICRwPWdldF9wb3N0KCRpZCk7IGlmKCEkcCkgY29udGludWU7ICRwcj13Y19nZXRfcHJvZHVjdCgkaWQpOwogICAgJGNmZz1nZXRfcG9zdF9tZXRhKCRpZCwnX21ubV9jb25maWcnLHRydWUpOyAka2lkcz1bXTsgaWYoaXNfYXJyYXkoJGNmZykpeyBmb3JlYWNoKCRjZmcgYXMgJGs9PiRjKXsgJGtpZHNbXT0oaW50KShpc3NldCgkY1sncHJvZHVjdF9pZCddKT8kY1sncHJvZHVjdF9pZCddOiRrKTsgfSB9CiAgICBpZighJGtpZHMgJiYgJHByICYmIG1ldGhvZF9leGlzdHMoJHByLCdnZXRfY29udGVudHMnKSl7IGZvcmVhY2goKGFycmF5KSRwci0+Z2V0X2NvbnRlbnRzKCkgYXMgJGs9PiRjKXsgJGtpZHNbXT0oaW50KShpc19hcnJheSgkYykmJmlzc2V0KCRjWydwcm9kdWN0X2lkJ10pPyRjWydwcm9kdWN0X2lkJ106JGspOyB9IH0KICAgICRraWRzPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoYXJyYXlfZmlsdGVyKCRraWRzKSkpOyAkeXJhPTA7JG5lcmE9MDskc2FuZGVsaWFpPVtdOyRwdnpfbmVyYT1bXTska2Fpbm9zPVtdOwogICAgZm9yZWFjaCgka2lkcyBhcyAkayl7ICRrcD13Y19nZXRfcHJvZHVjdCgkayk7IGlmKCEka3ApeyAkbmVyYSsrOyBjb250aW51ZTsgfSAkb2s9JGtwLT5pc19pbl9zdG9jaygpJiYka3AtPmdldF9zdGF0dXMoKT09PSdwdWJsaXNoJzsgaWYoJG9rKXskeXJhKys7ICRrYWlub3NbXT0oZmxvYXQpJGtwLT5nZXRfcHJpY2UoKTt9IGVsc2UgeyAkbmVyYSsrOyBpZihjb3VudCgkcHZ6X25lcmEpPDQpICRwdnpfbmVyYVtdPW1iX3N1YnN0cigka3AtPmdldF9uYW1lKCksMCwzNSk7IH0KICAgICAgJHM9Z2V0X3Bvc3RfbWV0YSgkaywnX3BzX3NhbmRlbGlzJyx0cnVlKTsgaWYoISRzKXsgJHNyYz0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIEdST1VQX0NPTkNBVChESVNUSU5DVCBzb3VyY2UpIEZST00geyRQfXBzX3NvdXJjZXMgV0hFUkUgcHJvZHVjdF9pZD0lZCBBTkQgKHF0eT4wIE9SIHF0eSBJUyBOVUxMKSIsJGspKTsgJHM9JHNyYz86Jz8nOyB9ICRzYW5kZWxpYWlbJHNdPSgkc2FuZGVsaWFpWyRzXT8/MCkrMTsgfQogICAgJGRvdj1qc29uX2RlY29kZSgoc3RyaW5nKWdldF9wb3N0X21ldGEoJGlkLCdfcHNfbGF1a2FzX2RvdmFub3MnLHRydWUpLHRydWUpOyAkZG49W107IGZvcmVhY2goKGFycmF5KSRkb3YgYXMgJGcpeyAkZ3A9d2NfZ2V0X3Byb2R1Y3QoKGludCkkZyk7ICRkbltdPSRncD9bbWJfc3Vic3RyKCRncC0+Z2V0X25hbWUoKSwwLDM4KSwkZ3AtPmlzX2luX3N0b2NrKCk/J3lyYSc6J07EllJBJywoaW50KSRncC0+Z2V0X3N0b2NrX3F1YW50aXR5KCksKGZsb2F0KSRncC0+Z2V0X3ByaWNlKCksZ2V0X3Bvc3RfbWV0YSgoaW50KSRnLCdfcHNfc2FuZGVsaXMnLHRydWUpXTpbJyMnLiRnLCduZXJhc3RhJ107IH0KICAgICRyWydsYXVrYWknXVtdPVsnaWQnPT4kaWQsJ3Bhdic9PiRwLT5wb3N0X3RpdGxlLCdzdGF0dXMnPT4kcC0+cG9zdF9zdGF0dXMsJ3VybCc9PicvJy4kcC0+cG9zdF9uYW1lLicvJywnZ3J1cGUnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX2xhdWthc19ncnVwZScsdHJ1ZSksJ3NhbmRlbGlzX21ldGEnPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3BzX2xhdWthc19zYW5kZWxpcycsdHJ1ZSksJ21pbic9PmdldF9wb3N0X21ldGEoJGlkLCdfbW5tX21pbl9jb250YWluZXJfc2l6ZScsdHJ1ZSksJ3ByZWtpdSc9PmNvdW50KCRraWRzKSwneXJhJz0+JHlyYSwnbmVyYSc9PiRuZXJhLCduZXJhX3B2eic9PiRwdnpfbmVyYSwndmFpa3Vfc2FuZGVsaWFpJz0+JHNhbmRlbGlhaSwna2FpbmFfbWluX21heCc9PiRrYWlub3M/W21pbigka2Fpbm9zKSxtYXgoJGthaW5vcyldOm51bGwsJ2Rvdl9yaWJhJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19sYXVrYXNfZG92YW5vc19yaWJhJyx0cnVlKSwnZG92YW5vcyc9PiRkbiwncGFrb3Bvcyc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHNfbGF1a2FzX3Bha29wb3MnLHRydWUpLCdudW90cmF1a2EnPT4oYm9vbClnZXRfcG9zdF90aHVtYm5haWxfaWQoJGlkKSwnaWVqaW1hcyc9PmdldF9wb3N0X21ldGEoJGlkLCdfcHNfbGF1a2FzX2llamltYXMnLHRydWUpLCd0cnVtcGFzJz0+bWJfc3Vic3RyKChzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19sYXVrYXNfdHJ1bXBhcycsdHJ1ZSksMCw4MCldOyB9CiAgJHJbJ3BzX3NvdXJjZXNfY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JFB9cHNfc291cmNlcyIpOyAkclsnU1FMJ109JHdwZGItPmxhc3RfZXJyb3I7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LDEpOwo=';
const VER='dep-090921';
const GKEY='ps_s1807f';
const PHASES=["1"];
const OUT='analize/s1807_f.json';
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
