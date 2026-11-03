process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODI1aiAjMjEgc2F1c28gbWFpc3RvIGludmVudG9yaXVzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgyNWonXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4MjVqJ107CiAgdHJ5ewogICR0ZXJtcz1nZXRfdGVybXMoWyd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2hpZGVfZW1wdHknPT5mYWxzZV0pOyAkY2F0cz1bXTsgZm9yZWFjaCgkdGVybXMgYXMgJHQpeyBpZihwcmVnX21hdGNoKCcvc2F1c3zEl2RhbHxlZGFsfGRyeS91aScsJHQtPnNsdWcuJyAnLiR0LT5uYW1lKSkgJGNhdHNbJHQtPnNsdWddPVskdC0+dGVybV9pZCwkdC0+bmFtZSwkdC0+Y291bnQsJHQtPnBhcmVudF07IH0gJHJbJ2NhdHMnXT0kY2F0czsKICAkc2x1Z3M9YXJyYXlfa2V5cyhhcnJheV9maWx0ZXIoJGNhdHMsZnVuY3Rpb24oJGMpeyByZXR1cm4gcHJlZ19tYXRjaCgnL21haXN0fMSXZGFsfGVkYWwvdWknLCRjWzFdKTsgfSkpOwogICRyWydzbHVncyddPSRzbHVnczsKICAkaWRzPWdldF9wb3N0cyhbJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywncG9zdF9zdGF0dXMnPT5bJ3B1Ymxpc2gnXSwnbnVtYmVycG9zdHMnPT4tMSwnZmllbGRzJz0+J2lkcycsJ3RheF9xdWVyeSc9PltbJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnZmllbGQnPT4nc2x1ZycsJ3Rlcm1zJz0+JHNsdWdzXV1dKTsKICAkbWFwcGVkPWFycmF5X2ZsaXAoJHdwZGItPmdldF9jb2woIlNFTEVDVCBwcm9kdWN0X2lkIEZST00geyRQfXBzX2ZlZWRpbmdfbWFwIFdIRVJFIGlzX2FjdGl2ZT0xIikpOwogICRwYWNrcz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtLm1ldGFfdmFsdWUgYiwgQ09VTlQoKikgbiBGUk9NIHskUH1wb3N0bWV0YSBtIEpPSU4geyRQfXBvc3RzIHAgT04gcC5JRD1tLnBvc3RfaWQgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIFdIRVJFIG0ubWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnIEdST1VQIEJZIG0ubWV0YV92YWx1ZSIsT0JKRUNUX0spOwogICR0b3Q9Wyd2aXNpJz0+MCwndHVyaW1pJz0+MCwnc3VfbGVudGVsZSc9PjAsJ3N0aWxpdXMnPT4wLCdzaWxwbmFzJz0+MF07ICRvPVtdOwogIGZvcmVhY2goJGlkcyBhcyAkaWQpeyBpZihnZXRfcG9zdF9tZXRhKCRpZCwnX2RwX2Jhc2VfcHJvZHVjdF9pZCcsdHJ1ZSkpIGNvbnRpbnVlOyAkcD13Y19nZXRfcHJvZHVjdCgkaWQpOyBpZighJHApIGNvbnRpbnVlOyAkdG90Wyd2aXNpJ10rKzsKICAgICRpbj0kcC0+aXNfaW5fc3RvY2soKTsgaWYoJGluKSAkdG90Wyd0dXJpbWknXSsrOwogICAgJGQ9KHN0cmluZykkcC0+Z2V0X2Rlc2NyaXB0aW9uKCk7ICR0eHQ9dHJpbSh3cF9zdHJpcF9hbGxfdGFncygkZCkpOyAkbGVuPW1iX3N0cmxlbigkdHh0KTsKICAgICRzdHk9KGJvb2wpcHJlZ19tYXRjaCgnL0tvZMSXbCB2ZXJ0YSByaW5rdGlzL3UnLCRkKTsgJHRibD1zdHJwb3MoJGQsJzx0YWJsZScpIT09ZmFsc2U7ICRzZXI9KGJvb2wpcHJlZ19tYXRjaCgnL8WhxJdyaW18xaDEl3JpbXxwYXJvcyBub3JtL3UnLCRkKTsKICAgICRzdWR0PShib29sKXByZWdfbWF0Y2goJy9TdWTEl3Rpcy91JywkZCk7ICRhbmFsPShib29sKXByZWdfbWF0Y2goJy9BbmFsaXRpbi91JywkZCk7CiAgICAkbT1pc3NldCgkbWFwcGVkWyRpZF0pOyBpZigkbSkgJHRvdFsnc3VfbGVudGVsZSddKys7IGlmKCRzdHkpICR0b3RbJ3N0aWxpdXMnXSsrOyBpZigkbGVuPDQwMHx8ISRzdWR0KSAkdG90WydzaWxwbmFzJ10rKzsKICAgICRiPXdwX2dldF9wb3N0X3Rlcm1zKCRpZCwncHJvZHVjdF9icmFuZCcsWydmaWVsZHMnPT4nbmFtZXMnXSk7ICRjPXdwX2dldF9wb3N0X3Rlcm1zKCRpZCwncHJvZHVjdF9jYXQnLFsnZmllbGRzJz0+J3NsdWdzJ10pOwogICAgJG9bXT1bJGlkLCRwLT5nZXRfbmFtZSgpLCRiWzBdPz8nJyxnZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKSwkaW4/MTowLChmbG9hdCkkcC0+Z2V0X3dlaWdodCgpLCRtPzE6MCwkc3R5PzE6MCwkdGJsPzE6MCwkc2VyPzE6MCwkc3VkdD8xOjAsJGFuYWw/MTowLCRsZW4sZ2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19hcHJhc3ltYXNfdXpyYWtpbnRhcycsdHJ1ZSk9PT0neWVzJz8xOjAsaXNzZXQoJHBhY2tzWyRpZF0pPzE6MCxnZXRfcG9zdF9tZXRhKCRpZCwnX3BzX2R5ZHppb19zZWltYScsdHJ1ZSksaW1wbG9kZSgnLCcsJGMpLChmbG9hdCkkcC0+Z2V0X3ByaWNlKCldOwogIH0KICAkclsndG90J109JHRvdDsgJHJbJ2NvbHMnXT0naWQsbm0sYnJhbmQsc2FuZCxpbixrZyxtYXAsc3RpbGl1cyx0Ymwsc2VyLHN1ZGV0LGFuYWwsbGVuLGxvY2sscGFrLHNlaW1hLGNhdCxwcmljZSc7ICRyWydwJ109JG87CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9LCAxKTsK';
const VER='dep-135303';
const GKEY='ps_s1825j';
const PHASES=["1"];
const OUT='analize/s1825_j.json';
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
