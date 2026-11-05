process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODMxa2F0IHBpbG5hcyBrYXRhbG9nYXMgZGV6dXRlbXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODMxa2F0J10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgyODApOyBAaW5pX3NldCgnbWVtb3J5X2xpbWl0JywnMTAyNE0nKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkZj0kX0dFVFsncHNfczE4MzFrYXQnXTsgJHI9Wyd2Jz0+J1MxODMxa2F0JywnZic9PiRmXTsKICB0cnl7CiAgJHNxbD0iU0VMRUNUIHAuSUQgaWQsIHAucG9zdF90aXRsZSBubSwgcC5wb3N0X3N0YXR1cyBzdCwKICAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX3N0b2NrJyBUSEVOIG0ubWV0YV92YWx1ZSBFTkQpIHN0b2NrLAogICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfb3duX3N0b2NrX3F0eScgVEhFTiBtLm1ldGFfdmFsdWUgRU5EKSBvd24sCiAgICBNQVgoQ0FTRSBXSEVOIG0ubWV0YV9rZXk9J19wc19zYW5kZWxpcycgVEhFTiBtLm1ldGFfdmFsdWUgRU5EKSBzYW5kLAogICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfcHJpY2UnIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgcHJpY2UsCiAgICBNQVgoQ0FTRSBXSEVOIG0ubWV0YV9rZXk9J19jb3N0X3ByaWNlJyBUSEVOIG0ubWV0YV92YWx1ZSBFTkQpIGMxLAogICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfemJfY29zdCcgVEhFTiBtLm1ldGFfdmFsdWUgRU5EKSBjMiwKICAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX3ZmX2Nvc3QnIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgYzMsCiAgICBNQVgoQ0FTRSBXSEVOIG0ubWV0YV9rZXk9J193ZWlnaHQnIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgdywKICAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX3piX2xlbmd0aCcgVEhFTiBtLm1ldGFfdmFsdWUgRU5EKSBsLAogICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfemJfd2lkdGgnIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgd2QsCiAgICBNQVgoQ0FTRSBXSEVOIG0ubWV0YV9rZXk9J196Yl9oZWlnaHQnIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgaCwKICAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX3piX2JyYW5kJyBUSEVOIG0ubWV0YV92YWx1ZSBFTkQpIGJyCiAgICBGUk9NIHskUH1wb3N0cyBwIEpPSU4geyRQfXBvc3RtZXRhIG0gT04gbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXkgSU4oJ19zdG9jaycsJ19vd25fc3RvY2tfcXR5JywnX3BzX3NhbmRlbGlzJywnX3ByaWNlJywnX2Nvc3RfcHJpY2UnLCdfemJfY29zdCcsJ192Zl9jb3N0JywnX3dlaWdodCcsJ196Yl9sZW5ndGgnLCdfemJfd2lkdGgnLCdfemJfaGVpZ2h0JywnX3piX2JyYW5kJykKICAgIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cyBJTigncHVibGlzaCcsJ2RyYWZ0JykgR1JPVVAgQlkgcC5JRCI7CiAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCRzcWwsQVJSQVlfQSk7ICRvdXQ9W107ICRuPTA7CiAgJGhhbGY9Y291bnQoJHJvd3MpPj4xOyAkc2xpY2UgPSAkZj09PScxJyA/IGFycmF5X3NsaWNlKCRyb3dzLDAsJGhhbGYpIDogYXJyYXlfc2xpY2UoJHJvd3MsJGhhbGYpOwogIGZvcmVhY2goJHNsaWNlIGFzICR4KXsgJHN0b2NrPW1heCgoaW50KSR4WydzdG9jayddLChpbnQpJHhbJ293biddKTsgaWYoJHN0b2NrPDMpIGNvbnRpbnVlOyAkY29zdD0keFsnYzEnXT86KCR4WydjMiddPzokeFsnYzMnXSk7IGlmKCRjb3N0PT09bnVsbHx8JGNvc3Q9PT0nJykgY29udGludWU7IGlmKChmbG9hdCkkeFsncHJpY2UnXT4zMCkgY29udGludWU7CiAgICAkY2F0cz13cF9nZXRfcG9zdF90ZXJtcygkeFsnaWQnXSwncHJvZHVjdF9jYXQnLFsnZmllbGRzJz0+J25hbWVzJ10pOyAkYz1pbXBsb2RlKCcvJywkY2F0cyk7IGlmKHByZWdfbWF0Y2goJy9TYXVzYXMgbWFpc3Rhc3xLcmFpa2FpfE5hcnZhaXxBa3Zhcml1fERyYXNreWtsfEd1b2xpYWl8VHJhbnNwb3J0fFR1YWxldGFpL2l1JywkYykpIGNvbnRpbnVlOwogICAgJG5tPXByZWdfcmVwbGFjZSgnL15bXGQuXStfXGQrXHMrfF5UUlhfXGQrXHMrfF5bQS1aXVxkezV9XHMrL3UnLCcnLGh0bWxfZW50aXR5X2RlY29kZSgkeFsnbm0nXSkpOwogICAgJG91dFtdPVsoaW50KSR4WydpZCddLG1iX3N1YnN0cigkbm0sMCw4MCksJHhbJ3N0J11bMF0sJHhbJ3NhbmQnXT86JycsJHN0b2NrLHJvdW5kKChmbG9hdCkkY29zdCwyKSwoZmxvYXQpJHhbJ3ByaWNlJ10sJHhbJ3cnXSE9PW51bGw/cm91bmQoKGZsb2F0KSR4Wyd3J10sMyk6bnVsbCwkeFsnbCddPyhmbG9hdCkkeFsnbCddOm51bGwsJHhbJ3dkJ10/KGZsb2F0KSR4Wyd3ZCddOm51bGwsJHhbJ2gnXT8oZmxvYXQpJHhbJ2gnXTpudWxsLG1iX3N1YnN0cihlbmQoJGNhdHMpPzonJywwLDMwKSwkeFsnYnInXT86JyddOyB9CiAgJHJbJ3Zpc29fZGInXT1jb3VudCgkcm93cyk7ICRyWyduJ109Y291bnQoJG91dCk7ICRyWydjb2xzJ109J2lkLG5tLHN0YXR1cyhwL2QpLHNhbmRlbGlzLHN0b2NrLGNvc3QscHJpY2Usd2VpZ2h0X2tnLExfY20sV19jbSxIX2NtLGthdGVnb3JpamEsYnJhbmQnOyAkclsncCddPSRvdXQ7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydFUlInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsgfSk7Cg==';
const VER='dep-134832';
const GKEY='ps_s1831kat';
const PHASES=["1", "2"];
const OUT='analize/s1831_kat.json';
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
