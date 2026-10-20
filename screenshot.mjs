process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzkxZiAxMCBBVlBOIFBERiBzdSBvcmlnaW5hbGlhIGRhdGEgKGxhaWtpbmFzIGFwbGFua2FzLCBtZXRhIG5lbGllY2lhbWEpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc5MWYnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE3MCk7ICRyPVsndic9PidTMTc5MWYnLCdmJz0+W11dOwogICRMPVsnQVZQTjAxMTE5Nyc9PjM2NTkzLCdBVlBOMDExMTc3Jz0+MzY1ODYsJ0FWUE4wMTExNzYnPT4zNjU4NSwnQVZQTjAxMTIwNSc9PjM2NTgwLCdBVlBOMDExMTgyJz0+MzY1NjAsJ0FWUE4wMTExNDUnPT4zNjMyOCwnQVZQTjAxMTE2Mic9PjM2MzIzLCdBVlBOMDExMTcwJz0+MzYyOTksJ0FWUE4wMTEwNTInPT4zNTk2NywnQVZQTjAxMTA0OCc9PjM1OTE5XTsKICB0cnl7CiAgICBpZighY2xhc3NfZXhpc3RzKCdEb21wZGZcRG9tcGRmJykpeyAkclsnZXJyJ109J27El3JhIGRvbXBkZic7IHRocm93IG5ldyBFeGNlcHRpb24oJ3gnKTsgfQogICAgJHVwPXdwX3VwbG9hZF9kaXIoKTsgJHRtcD10cmFpbGluZ3NsYXNoaXQoJHVwWydiYXNlZGlyJ10pLidwcy10bXAtczE3OTEvJzsgd3BfbWtkaXJfcCgkdG1wKTsKICAgIGZvcmVhY2goJEwgYXMgJGF2cG49PiRvcmRlcl9pZCl7CiAgICAgICR3Y19vcmRlcj13Y19nZXRfb3JkZXIoJG9yZGVyX2lkKTsgJHg9Wyducic9PiR3Y19vcmRlci0+Z2V0X29yZGVyX251bWJlcigpXTsKICAgICAgaWYoJHdjX29yZGVyLT5nZXRfbWV0YSgnX3BldHNob3BfYXZwbl9udW1iZXInKSE9PSRhdnBuIHx8ICR3Y19vcmRlci0+Z2V0X21ldGEoJ19wZXRzaG9wX2ludm9pY2VfZG9jdW1lbnRfdHlwZScpIT09J2ludm9pY2UnKXsgJHhbJ2VyciddPSdBVlBOL3RpcGFzIG5lc3V0YW1wYSc7ICRyWydmJ11bJGF2cG5dPSR4OyBjb250aW51ZTsgfQogICAgICAkZGM9JHdjX29yZGVyLT5nZXRfZGF0ZV9jb21wbGV0ZWQoKTsgJGRvY19kYXRlPSRkYz93cF9kYXRlKCdZLW0tZCcsJGRjLT5nZXRUaW1lc3RhbXAoKSk6Jyc7ICR4WydkYXRhJ109JGRvY19kYXRlOyAkeFsnYXBtb2tldGEnXT0kd2Nfb3JkZXItPmdldF9kYXRlX3BhaWQoKT93cF9kYXRlKCdZLW0tZCcsJHdjX29yZGVyLT5nZXRfZGF0ZV9wYWlkKCktPmdldFRpbWVzdGFtcCgpKTonJzsKICAgICAgaWYoISRkb2NfZGF0ZSl7ICR4WydlcnInXT0nbsSXcmEgxK92eWtkeW1vIGRhdG9zJzsgJHJbJ2YnXVskYXZwbl09JHg7IGNvbnRpbnVlOyB9CiAgICAgIC8vID09IHBldHNob3BfZ2VuZXJhdGVfaW52b2ljZV9wZGYoKSBrb3BpamEsIHRpayBkb2N1bWVudERhdGUgPSDEr3Z5a2R5bW8gZGF0YSA9PQogICAgICAkY291bnRyaWVzPVdDKCktPmNvdW50cmllcz9XQygpLT5jb3VudHJpZXMtPmdldF9jb3VudHJpZXMoKTphcnJheSgpOyAkYl9jb3VudHJ5PSR3Y19vcmRlci0+Z2V0X2JpbGxpbmdfY291bnRyeSgpOyAkYl9jb3VudHJ5X25hbWU9aXNzZXQoJGNvdW50cmllc1skYl9jb3VudHJ5XSk/JGNvdW50cmllc1skYl9jb3VudHJ5XTokYl9jb3VudHJ5OwogICAgICAkc2tpcF9zdGF0ZXM9YXJyYXkoJ3Bhc2lyaW5raXRlIHJham9uYScsJ3NlbGVjdCBhIHJlZ2lvbicsJ3NlbGVjdCBhbiBvcHRpb24nKTsgJGJfc3RhdGU9JHdjX29yZGVyLT5nZXRfYmlsbGluZ19zdGF0ZSgpOyAkYl9zdGF0ZV92YWw9KCRiX3N0YXRlJiYhaW5fYXJyYXkobWJfc3RydG9sb3dlcigkYl9zdGF0ZSksJHNraXBfc3RhdGVzKSk/JGJfc3RhdGU6Jyc7CiAgICAgICRjaXR5X3Bvc3Q9dHJpbSgkd2Nfb3JkZXItPmdldF9iaWxsaW5nX2NpdHkoKS4oJHdjX29yZGVyLT5nZXRfYmlsbGluZ19wb3N0Y29kZSgpPycsICcuJHdjX29yZGVyLT5nZXRfYmlsbGluZ19wb3N0Y29kZSgpOicnKSk7CiAgICAgICRiaWxsaW5nX2xpbmVzPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoYXJyYXkoJHdjX29yZGVyLT5nZXRfYmlsbGluZ19hZGRyZXNzXzEoKSwkd2Nfb3JkZXItPmdldF9iaWxsaW5nX2FkZHJlc3NfMigpLCRjaXR5X3Bvc3QsJGJfc3RhdGVfdmFsLCRiX2NvdW50cnlfbmFtZSkpKTsKICAgICAgJG9yZGVyPWFycmF5KCdpZCc9PiRvcmRlcl9pZCwnb3JkZXJOdW1iZXInPT4kd2Nfb3JkZXItPmdldF9vcmRlcl9udW1iZXIoKSwnZG9jdW1lbnREYXRlJz0+JGRvY19kYXRlLCdkYXRlJz0+JHdjX29yZGVyLT5nZXRfZGF0ZV9jcmVhdGVkKCk/JHdjX29yZGVyLT5nZXRfZGF0ZV9jcmVhdGVkKCktPmZvcm1hdCgnWS1tLWQnKTpkYXRlKCdZLW0tZCcpLCdwYXltZW50TWV0aG9kJz0+JHdjX29yZGVyLT5nZXRfcGF5bWVudF9tZXRob2RfdGl0bGUoKSwnYmlsbGluZyc9PmFycmF5KCduYW1lJz0+dHJpbSgkd2Nfb3JkZXItPmdldF9iaWxsaW5nX2ZpcnN0X25hbWUoKS4nICcuJHdjX29yZGVyLT5nZXRfYmlsbGluZ19sYXN0X25hbWUoKSksJ2FkZHJlc3MnPT4kYmlsbGluZ19saW5lcywncGhvbmUnPT4kd2Nfb3JkZXItPmdldF9iaWxsaW5nX3Bob25lKCksJ2VtYWlsJz0+JHdjX29yZGVyLT5nZXRfYmlsbGluZ19lbWFpbCgpKSwnc2hpcHBpbmcnPT5hcnJheSgnbmFtZSc9PicnLCdhZGRyZXNzJz0+YXJyYXkoKSkpOwogICAgICAkbG9nb191cmw9Jyc7ICRsb2dvX3BhdGg9Jyc7ICRmbD1nZXRfdGhlbWVfbW9kKCdzaXRlX2xvZ28nKTsgaWYoJGZsKXsgJGxvZ29fdXJsPXdwX2dldF9hdHRhY2htZW50X2ltYWdlX3VybCgkZmwsJ2Z1bGwnKTsgJGxvZ29fcGF0aD1nZXRfYXR0YWNoZWRfZmlsZSgkZmwpOyB9CiAgICAgICRzaG9wPWFycmF5KCdsb2dvJz0+JGxvZ29fdXJsLCdsb2dvX3BhdGgnPT4kbG9nb19wYXRoLCduYW1lJz0+Z2V0X2Jsb2dpbmZvKCduYW1lJykpOyAkc2V0dGluZ3M9YXJyYXkoJ2Rpc3BsYXlQcmljZUluUHJvZHVjdERldGFpbHNUYWJsZSc9PnRydWUpOyAkZG9jdW1lbnQ9YXJyYXkoKTsgJHRlbXBsYXRlPSdpbnZvaWNlJzsgJHR5cGU9J3BkZic7ICRpdGVtcz1hcnJheSgpOyAkdG90YWxzPWFycmF5KCk7CiAgICAgIHVuc2V0KCRpbnZvaWNlX251bWJlciwkZG9jX3RpdGxlKTsKICAgICAgb2Jfc3RhcnQoKTsgaW5jbHVkZSBnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKS4nL3dvb2NvbW1lcmNlLWRlbGl2ZXJ5LW5vdGVzL2Jhc2UucGhwJzsgJGJvZHlfaHRtbD1vYl9nZXRfY2xlYW4oKTsKICAgICAgJHhbJ251bWVyaXNfc2FibG9uZSddPWlzc2V0KCRpbnZvaWNlX251bWJlcik/JGludm9pY2VfbnVtYmVyOm51bGw7CiAgICAgIGlmKCgkaW52b2ljZV9udW1iZXI/PycnKSE9PSRhdnBuKXsgJHhbJ2VyciddPSfFoWFibG9uYXMgZ3LEhcW+aW5vIGtpdMSFIG51bWVyxK8nOyAkclsnZiddWyRhdnBuXT0keDsgY29udGludWU7IH0KICAgICAgJGZ1bGxfaHRtbD0nPCFET0NUWVBFIGh0bWw+PGh0bWw+PGhlYWQ+PG1ldGEgY2hhcnNldD0iVVRGLTgiPjxzdHlsZT5AcGFnZXtzaXplOkE0O21hcmdpbjoxMm1tIDE0bW07fWJvZHl7bWFyZ2luOjA7cGFkZGluZzowO308L3N0eWxlPjwvaGVhZD48Ym9keT4nLiRib2R5X2h0bWwuJzwvYm9keT48L2h0bWw+JzsKICAgICAgJG9wdD1uZXcgXERvbXBkZlxPcHRpb25zKCk7ICRvcHQtPnNldCgnaXNSZW1vdGVFbmFibGVkJyx0cnVlKTsgJG9wdC0+c2V0KCdpc0h0bWw1UGFyc2VyRW5hYmxlZCcsdHJ1ZSk7ICRvcHQtPnNldCgnaXNGb250U3Vic2V0dGluZ0VuYWJsZWQnLHRydWUpOyAkb3B0LT5zZXQoJ2Nocm9vdCcsYXJyYXkocmVhbHBhdGgoQUJTUEFUSCkscmVhbHBhdGgoJHVwWydiYXNlZGlyJ10pKSk7CiAgICAgICRkcD1uZXcgXERvbXBkZlxEb21wZGYoJG9wdCk7ICRkcC0+bG9hZEh0bWwoJGZ1bGxfaHRtbCwnVVRGLTgnKTsgJGRwLT5zZXRQYXBlcihhcnJheSgwLDAsNTk1LjI4LDg0MS44OSksJ3BvcnRyYWl0Jyk7ICRkcC0+cmVuZGVyKCk7ICRwZGY9JGRwLT5vdXRwdXQoKTsKICAgICAgJHhbJ2I2NCddPWJhc2U2NF9lbmNvZGUoJHBkZik7ICR4WydkeWRpcyddPXN0cmxlbigkcGRmKTsgJHJbJ2YnXVskYXZwbl09JHg7CiAgICB9CiAgICBAcm1kaXIoJHRtcCk7CiAgICAkclsnY291bnRlcl9wbyddPWdldF9vcHRpb24oJ3BldHNob3BfYXZwbl9jb3VudGVyJyk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7IGlmKGVtcHR5KCRyWydlcnInXSkpICRyWydlcnInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-205418';
const GKEY='ps_s1791f';
const PHASES=["1"];
const OUT='analize/s1791p_f.json';
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
