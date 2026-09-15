process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODN0IGsg4oCUIHJlYWQtb25seTogIzEwNTMg4oCUIHN0YXR1c2FzLCBzaXVudGltYXMsIG1ldGEgKF9wc18qLCB2ZW5pcGFrL2xwIGtsYWlkb3MpLCBwYXN0YWJvcywgZmFrdF9zaXVudG9zLCBkYXJiYWxhdWtpbyBzaXVudG9zX2tsYWlkYS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODN0ayddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjgzdCBrJyk7CiAgJGlkPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1Qgb3JkZXJfaWQgRlJPTSB7JHB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXk9J19wc19vcmRlcl9udW1iZXInIEFORCBtZXRhX3ZhbHVlPScxMDU3JyIpOyAkdz13Y19nZXRfb3JkZXIoJGlkKTsKICAkb1snaWQnXT0kaWQ7ICRvWydzdGF0dXMnXT0kdy0+Z2V0X3N0YXR1cygpOyAkb1snc3VrdXJ0YSddPSR3LT5nZXRfZGF0ZV9jcmVhdGVkKCktPmRhdGUoJ20tZCBIOmknKTsgJG9bJ2FwbW9rJ109JHctPmdldF9wYXltZW50X21ldGhvZCgpOyAkb1snc20nXT1pbXBsb2RlKCd8JyxhcnJheV9tYXAoZnVuY3Rpb24oJHMpe3JldHVybiAkcy0+Z2V0X21ldGhvZF9pZCgpLicjJy4kcy0+Z2V0X2luc3RhbmNlX2lkKCkuJyAnLiRzLT5nZXRfbmFtZSgpO30sJHctPmdldF9zaGlwcGluZ19tZXRob2RzKCkpKTsKICAkb1snc2FsaXMnXT0kdy0+Z2V0X2JpbGxpbmdfY291bnRyeSgpLicgJy4kdy0+Z2V0X3NoaXBwaW5nX2NvdW50cnkoKS4nIHRlbCAnLiR3LT5nZXRfYmlsbGluZ19waG9uZSgpOyAkb1snc3VtYSddPSR3LT5nZXRfdG90YWwoKTsKICAkbT1hcnJheSgpOyBmb3JlYWNoKCR3LT5nZXRfbWV0YV9kYXRhKCkgYXMgJG1kKSBpZihwcmVnX21hdGNoKCcvXl9wc198dmVuaXBha3xsaXRodWFuaWF8ZXJyb3J8a2xhaWQvaScsJG1kLT5rZXkpICYmICFwcmVnX21hdGNoKCcvX3BzX2dhfF9wc19rYW5hbGFpfF9wc19ncm91cHMvJywkbWQtPmtleSkpICRtWyRtZC0+a2V5XT1pc19zY2FsYXIoJG1kLT52YWx1ZSk/c3Vic3RyKChzdHJpbmcpJG1kLT52YWx1ZSwwLDIwMCk6anNvbl9lbmNvZGUoJG1kLT52YWx1ZSxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsKICAkb1snbWV0YSddPSRtOyAkb1snaXRlbXMnXT1hcnJheV9tYXAoZnVuY3Rpb24oJGl0KXtyZXR1cm4gJGl0LT5nZXRfbmFtZSgpLicgw5cnLiRpdC0+Z2V0X3F1YW50aXR5KCkuJyBbJy4kaXQtPmdldF9tZXRhKCdfcHNfa2VsaWFzJykuJy8nLiRpdC0+Z2V0X21ldGEoJ19wc19laWx1dGVzX3NhbHRpbmlzJykuJ10nO30sYXJyYXlfdmFsdWVzKCR3LT5nZXRfaXRlbXMoKSkpOwogICRvWydwYXN0YWJvcyddPWFycmF5X21hcChmdW5jdGlvbigkbil7cmV0dXJuICRuLT5kYXRlX2NyZWF0ZWQtPmRhdGUoJ20tZCBIOmknKS4nIFsnLiRuLT5hZGRlZF9ieS4nXSAnLnN1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkbi0+Y29udGVudCksMCwyNjApO30sd2NfZ2V0X29yZGVyX25vdGVzKGFycmF5KCdvcmRlcl9pZCc9PiRpZCwnbGltaXQnPT4yMCkpKTsKICAkb1snZnMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCB2ZXplamFzLHNpdW50b3NfbnIsc3RhdHVzYXMscHJvYmxlbWFfa29kYXMscmVnaXN0cnVvdGFfYXQgRlJPTSB7JHB9cHNfZmFrdF9zaXVudG9zIFdIRVJFIHV6c2FreW1hc19pZD0lZCIsJGlkKSxBUlJBWV9BKTsKICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfRGFyYmFsYXVraXMnKSl7ICRyPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0RhcmJhbGF1a2lzJywnc2l1bnRvc19rbGFpZGEnKTsgJHItPnNldEFjY2Vzc2libGUodHJ1ZSk7IGZvcmVhY2goYXJyYXkoJ3ZlbmlwYWsnLCdscCcpIGFzICR2KSAkb1sna2xhaWRhXycuJHZdPSRyLT5pbnZva2UobnVsbCwkdywkdik7IH0KICAkb1snc2FyZ2FzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbGFpa2FzLGx5Z2lzLExFRlQoemludXRlLDIyMCkgeiBGUk9NIHskcH1wc19zYXJnYXNfa2xhaWRvcyBXSEVSRSBsYWlrYXM+PURBVEVfU1VCKE5PVygpLElOVEVSVkFMIDE0IEhPVVIpIE9SREVSIEJZIGlkIERFU0MgTElNSVQgOCIsQVJSQVlfQSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-092312';
const GKEY='ps_s1683tk';
const PHASES=["A"];
const OUT='analize/s1683t_k.json';
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
