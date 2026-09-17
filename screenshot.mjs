process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODlzIHUg4oCUIERJQUdOT1rEliAyOiBwbGFjZS1vcmRlci1kZWJ1ZyB0dXJpbnlzLCB0YWxweWtsb3MgYsWra2zElyBpciBrYWRhIMSvanVuZ3RhLCBwYXNrdXRpbmlvIGtyZXDFoWVsaW8va2Fzb3MgdmVpa2ltYXMuIFJlYWQtb25seS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODlzdSddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7CiAgJGZzPWdsb2IoV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3djLWxvZ3MvcGxhY2Utb3JkZXItZGVidWctKicuZGF0ZSgnWS1tLWQnKS4nKicpPzphcnJheSgpOyB1c29ydCgkZnMsZnVuY3Rpb24oJGEsJGIpe3JldHVybiBmaWxlbXRpbWUoJGEpLWZpbGVtdGltZSgkYik7fSk7CiAgZm9yZWFjaCgkZnMgYXMgJGYpeyAkdD1maWxlX2dldF9jb250ZW50cygkZik7ICRvWydwb2QnXVtdPWRhdGUoJ0g6aTpzJyxmaWxlbXRpbWUoJGYpKS4nICcuc3Vic3RyKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJywkdCksMCw0MjApOyB9CiAgJGNmZz1AZmlsZV9nZXRfY29udGVudHMoQUJTUEFUSC4nd3AtY29uZmlnLnBocCcpOyBwcmVnX21hdGNoKCcvXi4qV1BfQ0FDSEUuKiQvbScsKHN0cmluZykkY2ZnLCRtKTsgJG9bJ3dwX2NvbmZpZ193cF9jYWNoZSddPSRtWzBdPz8nbsSXcmEnOyAkb1snV1BfQ0FDSEVfY29uc3QnXT1kZWZpbmVkKCdXUF9DQUNIRScpP1dQX0NBQ0hFOm51bGw7CiAgJG9bJ3dwX2NvbmZpZ19tdGltZSddPWRhdGUoJ1ktbS1kIEg6aScsZmlsZW10aW1lKEFCU1BBVEguJ3dwLWNvbmZpZy5waHAnKSk7ICRvWydhZHZfY2FjaGVfbXRpbWUnXT1AZGF0ZSgnWS1tLWQgSDppJyxmaWxlbXRpbWUoV1BfQ09OVEVOVF9ESVIuJy9hZHZhbmNlZC1jYWNoZS5waHAnKSk7CiAgJHdjPVdQX0NPTlRFTlRfRElSLicvd3AtY2FjaGUtY29uZmlnLnBocCc7ICRvWyd3cHNjX2NmZ19tdGltZSddPUBkYXRlKCdZLW0tZCBIOmknLGZpbGVtdGltZSgkd2MpKTsgJGM9KHN0cmluZylAZmlsZV9nZXRfY29udGVudHMoJHdjKTsgZm9yZWFjaChhcnJheSgnY2FjaGVfZW5hYmxlZCcsJ3N1cGVyX2NhY2hlX2VuYWJsZWQnLCd3cF9jYWNoZV9tb2RfcmV3cml0ZScsJ2NhY2hlX3JlamVjdGVkX3VyaScsJ3dwX2NhY2hlX25vdF9sb2dnZWRfaW4nLCd3cHNjX3JlamVjdGVkX2Nvb2tpZXMnLCdjYWNoZV9tYXhfdGltZScpIGFzICRrKXsgaWYocHJlZ19tYXRjaCgnL1wkJy4kay4nXHMqPVxzKihbXjtdKyk7LycsJGMsJG1tKSkkb1snd3BzYyddWyRrXT1zdWJzdHIoJG1tWzFdLDAsMjAwKTsgfQogICRkaXJzPWdsb2IoV1BfQ09OVEVOVF9ESVIuJy9jYWNoZS9zdXBlcmNhY2hlL3BldHNob3AubHQvKicsR0xPQl9PTkxZRElSKT86YXJyYXkoKTsgJG9bJ3N1cGVyY2FjaGVfZGlycyddPWNvdW50KCRkaXJzKTsgJG9bJ3N1cGVyY2FjaGVfb2xkZXN0J109JGRpcnM/ZGF0ZSgnSDppJyxtaW4oYXJyYXlfbWFwKCdmaWxlbXRpbWUnLCRkaXJzKSkpOm51bGw7CiAgJG9bJ2thc2FfY2FjaGVkJ109ZmlsZV9leGlzdHMoV1BfQ09OVEVOVF9ESVIuJy9jYWNoZS9zdXBlcmNhY2hlL3BldHNob3AubHQva2FzYScpIHx8IGZpbGVfZXhpc3RzKFdQX0NPTlRFTlRfRElSLicvY2FjaGUvc3VwZXJjYWNoZS9wZXRzaG9wLmx0L2tyZXBzZWxpcycpOwogICRvWyd3Y19sb2dnZXJfdGFpbCddPXN1YnN0cihwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsKHN0cmluZylAZmlsZV9nZXRfY29udGVudHMoKGdsb2IoV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3djLWxvZ3Mvd2NfbG9nZ2VyLScuZGF0ZSgnWS1tLWQnKS4nKicpPzphcnJheSgnJykpWzBdKSksLTkwMCk7CiAgJG9bJ29wdF9jaGFuZ2VzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUgRlJPTSB7JHB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdwc19zMTY4JScgT1Igb3B0aW9uX25hbWUgTElLRSAncHNfczE2ODklJyBPUkRFUiBCWSBvcHRpb25faWQgREVTQyBMSU1JVCAxMCIsQVJSQVlfQSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-150950';
const GKEY='ps_s1689su';
const PHASES=["GO"];
const OUT='analize/s1689s_u.json';
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
