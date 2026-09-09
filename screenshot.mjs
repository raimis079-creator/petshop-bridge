process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjgwIHNhdmlrYWludSBwcmllaW5hbXVtYXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19ibDUnXSk/JF9HRVRbJ3BzX2JsNSddOicnKSE9PSdSJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2ODAnLCd3cCc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSk7CiAgZ2xvYmFsICR3cGRiOyAkdHA9JHdwZGItPnByZWZpeC4ncHNfcGFydGlqb3MnOwogIHRyeXsKICAgICRzcWw9IlNFTEVDVCBwLklELCBDQVNUKHBtLm1ldGFfdmFsdWUgQVMgU0lHTkVEKSBzdG9jaywgQ09BTEVTQ0UoU1VNKENBU0UgV0hFTiB0LmF0c2F1a3RhPTAgT1IgdC5hdHNhdWt0YSBJUyBOVUxMIFRIRU4gdC5raWVraXNfbGlrbyBFTFNFIDAgRU5EKSwwKSBwYXJ0aWpvc2UKICAgICAgICAgIEZST00geyR3cGRiLT5wb3N0c30gcAogICAgICAgICAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBwbSBPTiBwbS5wb3N0X2lkPXAuSUQgQU5EIHBtLm1ldGFfa2V5PSdfc3RvY2snCiAgICAgICAgICBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHNkIE9OIHNkLnBvc3RfaWQ9cC5JRCBBTkQgc2QubWV0YV9rZXk9J19wc19zYW5kZWxpcycgQU5EIHNkLm1ldGFfdmFsdWU9J2F2JwogICAgICAgICAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogICAgICAgICAgR1JPVVAgQlkgcC5JRCBIQVZJTkcgc3RvY2sgPiBwYXJ0aWpvc2UiOwogICAgJHI9JHdwZGItPmdldF9yZXN1bHRzKCRzcWwsQVJSQVlfQSk7CiAgICAkb1sndmlzbyddPWNvdW50KCRyKTsKICAgICRzdVNhdj0wOyAkYmVTYXY9YXJyYXkoKTsgJHN1U3RvY2s9MDsgJG51bGluaXM9MDsgJHZudFRydWtzdGE9MDsgJHZudEJlU2F2PTA7CiAgICAkcHZ6U3U9YXJyYXkoKTsgJHNhbHRpbmlhaT1hcnJheSgnX2Nvc3RfcHJpY2UnPT4wLCdfdmZfY29zdCc9PjAsJ196Yl9jb3N0Jz0+MCk7CiAgICBmb3JlYWNoKCRyIGFzICR4KXsKICAgICAgJGlkPShpbnQpJHhbJ0lEJ107ICR0cj0oaW50KSR4WydzdG9jayddLShpbnQpJHhbJ3BhcnRpam9zZSddOyAkdm50VHJ1a3N0YSs9JHRyOwogICAgICBpZigoaW50KSR4WydzdG9jayddPjApICRzdVN0b2NrKys7IGVsc2UgJG51bGluaXMrKzsKICAgICAgJHNhdj0nJzsgJHNsdD0nJzsKICAgICAgZm9yZWFjaChhcnJheSgnX2Nvc3RfcHJpY2UnLCdfdmZfY29zdCcsJ196Yl9jb3N0JykgYXMgJG1rKXsgJHY9Z2V0X3Bvc3RfbWV0YSgkaWQsJG1rLHRydWUpOwogICAgICAgIGlmKCR2IT09JycgJiYgJHYhPT1udWxsICYmIChmbG9hdCkkdj4wKXsgJHNhdj0oZmxvYXQpJHY7ICRzbHQ9JG1rOyBicmVhazsgfSB9CiAgICAgIGlmKCRzYXYhPT0nJyl7ICRzdVNhdisrOyAkc2FsdGluaWFpWyRzbHRdKys7CiAgICAgICAgaWYoY291bnQoJHB2elN1KTw4KSAkcHZ6U3VbXT1hcnJheSgnaWQnPT4kaWQsJ3Bhdic9PnN1YnN0cihnZXRfdGhlX3RpdGxlKCRpZCksMCwzOCksJ3N0b2NrJz0+KGludCkkeFsnc3RvY2snXSwndHJ1a3N0YSc9PiR0ciwnc2F2Jz0+JHNhdiwnaXMnPT4kc2x0KTsgfQogICAgICBlbHNlIHsgJHZudEJlU2F2Kz1tYXgoMCwkdHIpOwogICAgICAgIGlmKGNvdW50KCRiZVNhdik8MTUpICRiZVNhdltdPWFycmF5KCdpZCc9PiRpZCwncGF2Jz0+c3Vic3RyKGdldF90aGVfdGl0bGUoJGlkKSwwLDM4KSwnc3RvY2snPT4oaW50KSR4WydzdG9jayddLCd0cnVrc3RhJz0+JHRyKTsgfQogICAgfQogICAgJG9bJ3N1X3NhdmlrYWluYSddPSRzdVNhdjsKICAgICRvWydiZV9zYXZpa2Fpbm9zJ109Y291bnQoJHIpLSRzdVNhdjsKICAgICRvWydzdV9saWt1Y2l1X3ZpcnNfMCddPSRzdVN0b2NrOwogICAgJG9bJ2xpa3V0aXNfMCddPSRudWxpbmlzOwogICAgJG9bJ3RydWtzdGFfdm50X3Zpc28nXT0kdm50VHJ1a3N0YTsKICAgICRvWyd0cnVrc3RhX3ZudF9iZV9zYXZpa2Fpbm9zJ109JHZudEJlU2F2OwogICAgJG9bJ3NhdmlrYWlub3Nfc2FsdGluaWFpJ109JHNhbHRpbmlhaTsKICAgICRvWydwdnpfc3Vfc2F2aWthaW5hJ109JHB2elN1OwogICAgJG9bJ2JlX3NhdmlrYWlub3Nfc2FyYXNhcyddPSRiZVNhdjsKICAgIC8vIGF0c2tpcmFpOiB0aWsgdG9zLCBrdXIgbGlrdXRpcyA+IDAgSVIgbmVyYSBzYXZpa2Fpbm9zCiAgICAka3JpdGluZXM9MDsKICAgIGZvcmVhY2goJHIgYXMgJHgpeyBpZigoaW50KSR4WydzdG9jayddPD0wKSBjb250aW51ZTsgJGlkPShpbnQpJHhbJ0lEJ107ICRvaz1mYWxzZTsKICAgICAgZm9yZWFjaChhcnJheSgnX2Nvc3RfcHJpY2UnLCdfdmZfY29zdCcsJ196Yl9jb3N0JykgYXMgJG1rKXsgJHY9Z2V0X3Bvc3RfbWV0YSgkaWQsJG1rLHRydWUpOyBpZigkdiE9PScnICYmIChmbG9hdCkkdj4wKXskb2s9dHJ1ZTticmVhazt9IH0KICAgICAgaWYoISRvaykgJGtyaXRpbmVzKys7IH0KICAgICRvWydsaWt1dGlzX3ZpcnMwX2JlX3NhdmlrYWlub3MnXT0ka3JpdGluZXM7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-084802';
const GKEY='ps_bl5';
const PHASES=["R"];
const OUT='analize/s1680_r.json';
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
