process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODAgaiDigJQgcmVhZC1vbmx5OiBrb2TEl2wgc3Ug4oCeR3JhbmRjYXJubyBsYW1iIDgwMCBnIiBrcmVwxaFlbHlqZSBrYXNvamUgbsSXcmEgTFAgRXhwcmVzcyDigJQgcHJla8SXLCBtZXRhLCBraWVrdmllbm8gZmlsdHJvIHJlenVsdGF0YXMuICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODBqJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYiwkd3BfZmlsdGVyOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidTMTY4MCBqJyk7CiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIElEIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgKHBvc3RfdGl0bGUgTElLRSAnJWNhcm5vJScgT1IgcG9zdF90aXRsZSBMSUtFICclQ2Fybm8lJykgQU5EIHBvc3RfdGl0bGUgTElLRSAnJTgwMCUnIE9SREVSIEJZIElEIExJTUlUIDYiKTsKICBmb3JlYWNoKCRpZHMgYXMgJGkpeyAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGkpOyAkb1sna2FuZGlkYXRhaSddW109YXJyYXkoJGksJHByLT5nZXRfbmFtZSgpLCRwci0+Z2V0X3NrdSgpLCRwci0+Z2V0X3dlaWdodCgpLCRwci0+Z2V0X3N0b2NrX3F1YW50aXR5KCksJHByLT5nZXRfc3RvY2tfc3RhdHVzKCkpOyB9CiAgJHBpZD0wOyBmb3JlYWNoKCRpZHMgYXMgJGkpeyBpZihzdHJpcG9zKGdldF90aGVfdGl0bGUoJGkpLCc4MDAnKSE9PWZhbHNlKXsgJHBpZD0oaW50KSRpOyBicmVhazsgfSB9IGlmKCEkcGlkKSAkcGlkPShpbnQpKCRpZHNbMF0/PzApOwogICRwcj13Y19nZXRfcHJvZHVjdCgkcGlkKTsgJG9bJ3ByZWtlJ109YXJyYXkoJHBpZCwkcHI/JHByLT5nZXRfbmFtZSgpOm51bGwsJ3N2b3Jpcyc9PiRwcj8kcHItPmdldF93ZWlnaHQoKTpudWxsLCdraWVraXMnPT4kcHI/JHByLT5nZXRfc3RvY2tfcXVhbnRpdHkoKTpudWxsLCdzdCc9PiRwcj8kcHItPmdldF9zdG9ja19zdGF0dXMoKTpudWxsLCdrbGFzZSc9PiRwcj8kcHItPmdldF9zaGlwcGluZ19jbGFzcygpOm51bGwpOwogIGZvcmVhY2goYXJyYXkoJ19wc190aWtfa3VyamVyaXUnLCdfZnVsZmlsbG1lbnRfY291cmllcl9vbmx5JywnX3piX2VuYWJsZWQnLCdfcHNfc2FsdGluaXMnLCdfcHNfc2FuZGVsaXMnLCdfcHNfdGlla2VqYXMnLCdfdmZfZW5hYmxlZCcsJ19wc19rZWxpYXMnLCdfZnVsZmlsbG1lbnRfc291cmNlJykgYXMgJGspICRvWydtZXRhJ11bJGtdPWdldF9wb3N0X21ldGEoJHBpZCwkayx0cnVlKTsKICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfRnVsZmlsbG1lbnRfU291cmNlJykpICRvWydyZXNvbHZlJ109UGV0c2hvcF9GdWxmaWxsbWVudF9Tb3VyY2U6OnJlc29sdmUoJHBpZCk7CiAgd2NfbG9hZF9jYXJ0KCk7IFdDKCktPnNlc3Npb24tPnNldF9jdXN0b21lcl9zZXNzaW9uX2Nvb2tpZSh0cnVlKTsgV0MoKS0+Y2FydC0+ZW1wdHlfY2FydCgpOyAkY2s9V0MoKS0+Y2FydC0+YWRkX3RvX2NhcnQoJHBpZCwxKTsgJG9bJ2NhcnQnXT0kY2s/J29rJzonRkFJTCAnLndwX3N0cmlwX2FsbF90YWdzKHdjX3ByaW50X25vdGljZXModHJ1ZSkpOwogIFdDKCktPmN1c3RvbWVyLT5zZXRfc2hpcHBpbmdfY291bnRyeSgnTFQnKTsgV0MoKS0+Y3VzdG9tZXItPnNldF9iaWxsaW5nX2NvdW50cnkoJ0xUJyk7CiAgJHBrPVdDKCktPmNhcnQtPmdldF9zaGlwcGluZ19wYWNrYWdlcygpOyAkcGswPSRwa1swXTsgJG9bJ2tnJ109V0MoKS0+Y2FydC0+Z2V0X2NhcnRfY29udGVudHNfd2VpZ2h0KCk7CiAgJHpvbmU9V0NfU2hpcHBpbmdfWm9uZXM6OmdldF96b25lX21hdGNoaW5nX3BhY2thZ2UoJHBrMCk7ICRyYXRlcz1hcnJheSgpOyBmb3JlYWNoKCR6b25lLT5nZXRfc2hpcHBpbmdfbWV0aG9kcyh0cnVlKSBhcyAkbSl7ICRtLT5yYXRlcz1hcnJheSgpOyAkbS0+Y2FsY3VsYXRlX3NoaXBwaW5nKCRwazApOyBmb3JlYWNoKCRtLT5yYXRlcyBhcyAkcmlkPT4kcikgJHJhdGVzWyRyaWRdPSRyOyB9CiAgJG9bJ3ByaWVzX2ZpbHRydXMnXT1hcnJheV9rZXlzKCRyYXRlcyk7ICRwazBbJ3JhdGVzJ109JHJhdGVzOwogIGZvcmVhY2goJHdwX2ZpbHRlclsnd29vY29tbWVyY2VfcGFja2FnZV9yYXRlcyddLT5jYWxsYmFja3MgYXMgJHByaW89PiRjYnMpeyBmb3JlYWNoKCRjYnMgYXMgJGNiKXsgJGY9JGNiWydmdW5jdGlvbiddOyAkbm09aXNfYXJyYXkoJGYpPyhpc19vYmplY3QoJGZbMF0pP2dldF9jbGFzcygkZlswXSk6JGZbMF0pLic6OicuJGZbMV06KGlzX3N0cmluZygkZik/JGY6J2Nsb3N1cmUnKTsgJGJlZm9yZT1hcnJheV9rZXlzKCRyYXRlcyk7ICRyYXRlcz1jYWxsX3VzZXJfZnVuY19hcnJheSgkZixhcnJheSgkcmF0ZXMsJHBrMCkpOyAkb1snZmlsdHJhaSddW109JHByaW8uJyAnLiRubS4nIOKGkiAnLmltcGxvZGUoJywnLGFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIHByZWdfcmVwbGFjZSgnL15zaG9wdXBfdmVuaXBha19zaGlwcGluZ198Xndvb19saXRodWFuaWFwb3N0Xy8nLCcnLCR4KTt9LGFycmF5X2tleXMoJHJhdGVzKSkpOyB9IH0KICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfUmlua2luaWFpJykpeyAkcmY9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfUmlua2luaWFpJywncGFzdG9tYXRvX3NhcmdhcycpOyAkc3JjPWZpbGUoJHJmLT5nZXRGaWxlTmFtZSgpKTsgJG9bJ3Nhcmdhc19zcmMnXT1wcmVnX3JlcGxhY2UoJy9ccysvJywnICcsaW1wbG9kZSgnJyxhcnJheV9zbGljZSgkc3JjLCRyZi0+Z2V0U3RhcnRMaW5lKCktMSwkcmYtPmdldEVuZExpbmUoKS0kcmYtPmdldFN0YXJ0TGluZSgpKzEpKSk7IH0KICBXQygpLT5jYXJ0LT5lbXB0eV9jYXJ0KCk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-075113';
const GKEY='ps_s1680j';
const PHASES=["GO", "CL"];
const OUT='analize/s1680_j2.json';
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
