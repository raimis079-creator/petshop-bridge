process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzMxZCBnYXZpbW8gbmF1am9zIHByZWvEl3MgbGlrdcSNaW8gdmFsZHltYXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzMxZCddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTczMWQnXTsgQHNldF90aW1lX2xpbWl0KDIwMCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzMxZCcsJ2ZhemUnPT4kZl07CiAgdHJ5ewogIGlmKCRmPT09JzEnKXsKICAgICRNPVdQX0NPTlRFTlRfRElSLicvbXUtcGx1Z2lucy8nOwogICAgJHNyYz1maWxlKCRNLidwZXRzaG9wLWdhdmltYXMucGhwJyk7ICRyWydlaWwnXT1jb3VudCgkc3JjKTsKICAgIGZvcmVhY2goJHNyYyBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCcjc2V0X21hbmFnZV9zdG9ja1xzKlwoXHMqZmFsc2UjJywkbCkpeyAkclsnbmF1amFfcHJla2UnXT1pbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRzcmMsJGksMTEwKSk7IGJyZWFrOyB9IH0KICAgIGZvcmVhY2goWydwZXRzaG9wLWdhdmltYXMucGhwJywncGV0c2hvcC1wYXJ0aWpvcy5waHAnLCdwZXRzaG9wLWF2LXN0b2NrLnBocCcsJ3BldHNob3Ata2F0YWxvZ2FzLnBocCcsJ3BldHNob3AtZ2F2aW1vLXBlcnJ1c2lhdmltYXMucGhwJ10gYXMgJGZuKXsgJHM9QGZpbGUoJE0uJGZuKTsgaWYoISRzKSBjb250aW51ZTsgZm9yZWFjaCgkcyBhcyAkaT0+JGwpeyBpZihzdHJpcG9zKCRsLCdtYW5hZ2Vfc3RvY2snKSE9PWZhbHNlKSAkclsnZ3JlcCddWyRmbl1bXT0oJGkrMSkuJzogJy50cmltKG1iX3N1YnN0cigkbCwwLDE3MCkpOyB9IH0KICB9CiAgaWYoJGY9PT0nMicpewogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCxwLnBvc3Rfc3RhdHVzLHAucG9zdF90aXRsZSxwLnBvc3RfZGF0ZSBGUk9NIHskUH1wb3N0cyBwIEpPSU4geyRQfXBvc3RtZXRhIG0gT04gbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXk9J19tYW5hZ2Vfc3RvY2snIEFORCBtLm1ldGFfdmFsdWU9J25vJyBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXMgTk9UIElOKCd0cmFzaCcsJ2F1dG8tZHJhZnQnKSIsQVJSQVlfQSk7CiAgICAkbz1bXTsgZm9yZWFjaCgkcm93cyBhcyAkeCl7ICRwcj13Y19nZXRfcHJvZHVjdCgkeFsnSUQnXSk7IGlmKCEkcHJ8fCEkcHItPmlzX3R5cGUoJ3NpbXBsZScpKSBjb250aW51ZTsgaWYoZ2V0X3Bvc3RfbWV0YSgkeFsnSUQnXSwnX2RwX2Jhc2VfcHJvZHVjdF9pZCcsdHJ1ZSkpIGNvbnRpbnVlOwogICAgICAkb1tdPVsoaW50KSR4WydJRCddLCR4Wydwb3N0X3N0YXR1cyddLG1iX3N1YnN0cigkeFsncG9zdF90aXRsZSddLDAsNTApLCR4Wydwb3N0X2RhdGUnXSxnZXRfcG9zdF9tZXRhKCR4WydJRCddLCdfc3RvY2tfc3RhdHVzJyx0cnVlKSxnZXRfcG9zdF9tZXRhKCR4WydJRCddLCdfcHNfc2FuZGVsaXMnLHRydWUpLGdldF9wb3N0X21ldGEoJHhbJ0lEJ10sJ19vd25fc3RvY2tfcXR5Jyx0cnVlKSwoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cHNfcGFydGlqb3MgV0hFUkUgcHJvZHVjdF9pZD0iLihpbnQpJHhbJ0lEJ10pXTsgfQogICAgJHJbJ3NpbXBsZV9tYW5hZ2Vfbm9fdmlzb3NfYnVzZW5vcyddPSRvOwogICAgLy8gZ2F2aW11IHN1a3VydG9zIHByZWtlcyBudW8gMDgtMDE6IGtpZWsgdHVyaSBtYW5hZ2UgeWVzL25vCiAgICAkZz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELHAucG9zdF9zdGF0dXMsbS5tZXRhX3ZhbHVlIG1zIEZST00geyRQfXBvc3RzIHAgSk9JTiB7JFB9cG9zdG1ldGEgcHAgT04gcHAucG9zdF9pZD1wLklEIEFORCBwcC5tZXRhX2tleT0nX3BzX3B1Ymxpa3VvdGEnIExFRlQgSk9JTiB7JFB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0nX21hbmFnZV9zdG9jaycgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIixBUlJBWV9BKTsKICAgICRzPVtdOyBmb3JlYWNoKCRnIGFzICR4KXsgJGs9JHhbJ3Bvc3Rfc3RhdHVzJ10uJ3wnLiR4WydtcyddOyAkc1ska109KCRzWyRrXT8/MCkrMTsgfSAkclsnc3VfcHNfcHVibGlrdW90YSddPSRzOwogICAgLy8gIzE4NTUxIElOUFMwNiAoUzE2ODkgcmFua2luaXMpCiAgICAkclsnMTg1NTEnXT1bJ3N0Jz0+Z2V0X3Bvc3Rfc3RhdHVzKDE4NTUxKSwnbXMnPT5nZXRfcG9zdF9tZXRhKDE4NTUxLCdfbWFuYWdlX3N0b2NrJyx0cnVlKSwnc3MnPT5nZXRfcG9zdF9tZXRhKDE4NTUxLCdfc3RvY2tfc3RhdHVzJyx0cnVlKV07CiAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-155427';
const GKEY='ps_s1731d';
const PHASES=["1", "2"];
const OUT='analize/s1731_d.json';
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
