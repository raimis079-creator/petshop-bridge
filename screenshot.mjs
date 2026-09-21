process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE3MDMgYiDigJQgIzExMDQgKDM2MDIyKTogdmlzb3MgbWV0YSBzdSAncGFzdGFiJy8nbm90ZSc7IGRhcmJhbGF1a2lvIHBhc3RhYsWzIGxlbnRlbMSXOyBMUCBwbHVnaW5vIG1ldG9kYWkgYmFyY29kZS90cmFja2luZyBwYWdhbCBpdGVtIGlkIChwYXZhZGluaW1haSkgaXIgYmFuZHltYXMgZ2F1dGkgYmFyY29kZSByZWFkLW9ubHkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNzAzYiddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7ICRpZD0zNjAyMjsKICAkb1snbWV0YV9wYXN0YWJvcyddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIG1ldGFfa2V5LExFRlQobWV0YV92YWx1ZSwyMDApIHYgRlJPTSB7JHB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgb3JkZXJfaWQ9JWQgQU5EIChtZXRhX2tleSBMSUtFICclJXBhc3RhYiUlJyBPUiBtZXRhX2tleSBMSUtFICclJW5vdGUlJScgT1IgbWV0YV9rZXkgTElLRSAnJSVrb21lbnRhciUlJykiLCRpZCksQVJSQVlfQSk7CiAgJG9bJ2xlbnRlbGVzJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigkd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMiKSxmdW5jdGlvbigkdCl7cmV0dXJuIHByZWdfbWF0Y2goJy9wYXN0YWJ8bm90ZXxrb21lbnRhci9pJywkdCk7fSkpOwogIGZvcmVhY2ggKCRvWydsZW50ZWxlcyddIGFzICR0KXsgJGNvbHM9JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIGAkdGAiLDApOyAkb2M9bnVsbDsgZm9yZWFjaCAoYXJyYXkoJ29yZGVyX2lkJywndXpzYWt5bWFzX2lkJywndXpzYWt5bWFzJywnb2JqZWN0X2lkJykgYXMgJGMpIGlmIChpbl9hcnJheSgkYywkY29scykpIHskb2M9JGM7YnJlYWs7fSBpZiAoJG9jKSAkb1snbGVudF8nLiR0XT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00gYCR0YCBXSEVSRSBgJG9jYD0kaWQgT1JERVIgQlkgMSBERVNDIExJTUlUIDUiLEFSUkFZX0EpOyB9CiAgJG9bJ3Zpc29zX3Bhc3RhYm9zX3N1X0xUJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgY29tbWVudF9kYXRlLGNvbW1lbnRfYXV0aG9yLExFRlQoY29tbWVudF9jb250ZW50LDE2MCkgYyBGUk9NIHskcH1jb21tZW50cyBXSEVSRSBjb21tZW50X3Bvc3RfSUQ9JWQgQU5EIGNvbW1lbnRfdHlwZT0nb3JkZXJfbm90ZScgT1JERVIgQlkgY29tbWVudF9JRCBERVNDIExJTUlUIDE1IiwkaWQpLEFSUkFZX0EpOwogICRvWyd3Y19vcmRlcl9ub3RlX2NvdW50J109KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyRwfWNvbW1lbnRzIFdIRVJFIGNvbW1lbnRfcG9zdF9JRD0lZCBBTkQgY29tbWVudF90eXBlPSdvcmRlcl9ub3RlJyIsJGlkKSk7CiAgLy8gTFAgcGx1Z2luCiAgJGNscz1hcnJheV9maWx0ZXIoZ2V0X2RlY2xhcmVkX2NsYXNzZXMoKSxmdW5jdGlvbigkYyl7cmV0dXJuIHN0cmlwb3MoJGMsJ2xpdGh1YW5pYXBvc3QnKSE9PWZhbHNlfHxzdHJpcG9zKCRjLCdscGV4cHJlc3MnKSE9PWZhbHNlO30pOyAkb1snbHBfa2xhc2VzJ109YXJyYXlfdmFsdWVzKCRjbHMpOwogIGZvcmVhY2ggKCRjbHMgYXMgJGMpeyAkbXM9Z2V0X2NsYXNzX21ldGhvZHMoJGMpOyAkaGl0PWFycmF5X2ZpbHRlcigkbXMsZnVuY3Rpb24oJG0pe3JldHVybiBwcmVnX21hdGNoKCcvYmFyY29kZXx0cmFja3xsYWJlbHxzdGlja2VyfHNoaXBwaW5nX2l0ZW18cGFyY2VsL2knLCRtKTt9KTsgaWYgKCRoaXQpICRvWydscF9tZXRvZGFpJ11bJGNdPWFycmF5X3ZhbHVlcygkaGl0KTsgfQogICRvWydscF9vcGNpam9zJ109JHdwZGItPmdldF9jb2woIlNFTEVDVCBDT05DQVQob3B0aW9uX25hbWUsJyB8ICcsTEVGVChvcHRpb25fdmFsdWUsODApKSBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyVsaXRodWFuaWFwb3N0JScgQU5EIG9wdGlvbl9uYW1lIE5PVCBMSUtFICcldHJhbnNpZW50JScgQU5EIG9wdGlvbl9uYW1lIE5PVCBMSUtFICclcGFzc3dvcmQlJyBBTkQgb3B0aW9uX25hbWUgTk9UIExJS0UgJyVzZWNyZXQlJyBMSU1JVCAxNSIpOwogICRvWydraXRpX2xwX3V6c19zdV9iYyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9yZGVyX2lkLG1ldGFfdmFsdWUgRlJPTSB7JHB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXk9J193b29fbGl0aHVhbmlhcG9zdF9iYXJjb2RlJyBBTkQgbWV0YV92YWx1ZTw+JycgT1JERVIgQlkgb3JkZXJfaWQgREVTQyBMSU1JVCA1IixBUlJBWV9BKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-051434';
const GKEY='ps_s1703b';
const PHASES=["1"];
const OUT='analize/s1703_b.json';
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
