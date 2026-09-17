process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODlzIGsg4oCUIFJFQ09OIFBhZ2VTcGVlZCBJbnNpZ2h0cyAobGFiK0NyVVgpIGtlbGllbXMgcHVzbGFwaWFtcy4gUmVhZC1vbmx5LiA/cHNfczE2ODlzaz0xJnU9MC4uMyZzPW1vYmlsZXxkZXNrdG9wICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjg5c2snXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE3MCk7CiAgJHBhZ2VzPWFycmF5KGhvbWVfdXJsKCcvJyksIGhvbWVfdXJsKCcva2F0ZWdvcmlqYS9zdW5pbXMvJyksIGhvbWVfdXJsKCcvcHJvZHVjdC9naW1jYXQtbnV0cmktdGF1cmluZS1iaXRlcy1xdWFyay1zdS10YXVyaW51LWlyLXJpa290YS00MjUtZy8nKSwgaG9tZV91cmwoJy9rYXNhLycpKTsKICAkbz1hcnJheSgpOyAka2V5PWdldF9vcHRpb24oJ3BzX3Nlb19wc2lfa2V5JykgPzogZ2V0X29wdGlvbigncHNfcHNpX2tleScpOwogIGZvcmVhY2goYXJyYXkoYXJyYXkoMSwnbW9iaWxlJyksYXJyYXkoMCwnZGVza3RvcCcpKSBhcyAkail7IGxpc3QoJGksJHMpPSRqOwogICAgJHE9J2h0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3BhZ2VzcGVlZG9ubGluZS92NS9ydW5QYWdlc3BlZWQ/dXJsPScucmF3dXJsZW5jb2RlKCRwYWdlc1skaV0pLicmc3RyYXRlZ3k9Jy4kcy4nJmxvY2FsZT1sdCZjYXRlZ29yeT1wZXJmb3JtYW5jZSZjYXRlZ29yeT1zZW8mY2F0ZWdvcnk9YWNjZXNzaWJpbGl0eSZjYXRlZ29yeT1iZXN0LXByYWN0aWNlcycuKCRrZXk/JyZrZXk9Jy4ka2V5OicnKTsKICAgICRyPXdwX3JlbW90ZV9nZXQoJHEsYXJyYXkoJ3RpbWVvdXQnPT42MCkpOyBpZihpc193cF9lcnJvcigkcikpeyRvW109YXJyYXkoJGksJHMsJ0VSUiAnLiRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpKTtjb250aW51ZTt9CiAgICAkZD1qc29uX2RlY29kZSh3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkciksdHJ1ZSk7IGlmKGVtcHR5KCRkWydsaWdodGhvdXNlUmVzdWx0J10pKXskb1tdPWFycmF5KCRpLCRzLHN1YnN0cih3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkciksMCwyMDApKTtjb250aW51ZTt9CiAgICAkTD0kZFsnbGlnaHRob3VzZVJlc3VsdCddOyAkQT0kTFsnYXVkaXRzJ107ICRzYz1hcnJheSgpOyBmb3JlYWNoKCRMWydjYXRlZ29yaWVzJ10gYXMgJGs9PiRjKSRzY1ska109cm91bmQoJGNbJ3Njb3JlJ10qMTAwKTsKICAgICRtPWFycmF5KCk7IGZvcmVhY2goYXJyYXkoJ2ZpcnN0LWNvbnRlbnRmdWwtcGFpbnQnLCdsYXJnZXN0LWNvbnRlbnRmdWwtcGFpbnQnLCd0b3RhbC1ibG9ja2luZy10aW1lJywnY3VtdWxhdGl2ZS1sYXlvdXQtc2hpZnQnLCdzcGVlZC1pbmRleCcsJ3NlcnZlci1yZXNwb25zZS10aW1lJywndG90YWwtYnl0ZS13ZWlnaHQnLCdkb20tc2l6ZScpIGFzICRhKSRtWyRhXT0kQVskYV1bJ2Rpc3BsYXlWYWx1ZSddPz8nJzsKICAgICRvcHA9YXJyYXkoKTsgZm9yZWFjaCgkQSBhcyAkaz0+JGEpeyBpZigoJGFbJ2RldGFpbHMnXVsndHlwZSddPz8nJyk9PT0nb3Bwb3J0dW5pdHknICYmICgkYVsnc2NvcmUnXT8/MSk8MC45ICYmICFlbXB0eSgkYVsnZGlzcGxheVZhbHVlJ10pKSAkb3BwW109JGsuJzogJy4kYVsnZGlzcGxheVZhbHVlJ107IH0KICAgICRmYWlsPWFycmF5KCk7IGZvcmVhY2goYXJyYXkoJ3NlbycsJ2FjY2Vzc2liaWxpdHknLCdiZXN0LXByYWN0aWNlcycpIGFzICRjYXQpeyBmb3JlYWNoKCRMWydjYXRlZ29yaWVzJ11bJGNhdF1bJ2F1ZGl0UmVmcyddIGFzICRyZWYpeyAkYT0kQVskcmVmWydpZCddXTsgaWYoaXNzZXQoJGFbJ3Njb3JlJ10pICYmICRhWydzY29yZSddIT09bnVsbCAmJiAkYVsnc2NvcmUnXTwxICYmICgkcmVmWyd3ZWlnaHQnXT8/MCk+MCkgJGZhaWxbXT0kY2F0WzBdLic6Jy4kcmVmWydpZCddOyB9IH0KICAgICRmPSRkWydsb2FkaW5nRXhwZXJpZW5jZSddWydtZXRyaWNzJ10/P2FycmF5KCk7ICRjcnV4PWFycmF5KCk7IGZvcmVhY2goJGYgYXMgJGs9PiR2KSRjcnV4W3N0cl9yZXBsYWNlKCdfTVMnLCcnLCRrKV09KCR2WydwZXJjZW50aWxlJ10/PycnKS4nICcuJHZbJ2NhdGVnb3J5J107CiAgICAkb1tdPWFycmF5KCdwJz0+JGksJ3MnPT4kcywnc2MnPT4kc2MsJ20nPT4kbSwnb3BwJz0+YXJyYXlfc2xpY2UoJG9wcCwwLDgpLCdmYWlsJz0+YXJyYXlfc2xpY2UoJGZhaWwsMCwxNCksJ2NydXgnPT4kY3J1eCwnY3J1eF9vcmlnaW4nPT4kZFsnb3JpZ2luTG9hZGluZ0V4cGVyaWVuY2UnXVsnb3ZlcmFsbF9jYXRlZ29yeSddPz9udWxsKTsKICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9KTsK';
const VER='dep-093549';
const GKEY='ps_s1689sk';
const PHASES=["GO"];
const OUT='analize/s1689s_k2.json';
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
