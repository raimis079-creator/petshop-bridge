process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODM2cCBwcmVrZXMgQm9ubyBpc3Rvcmlqb21zIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTgzNnAnXSkpIHJldHVybjsKICAkZj0kX0dFVFsncHNfczE4MzZwJ107IEBzZXRfdGltZV9saW1pdCgyODApOyBAaW5pX3NldCgnbWVtb3J5X2xpbWl0JywnNzY4TScpOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTgzNnAnLCdmYXplJz0+JGZdOwogIHRyeXsKICAgICRyWydzcmNfY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JFB9cHNfc291cmNlcyIpOwogICAgJGhhc1NyYz1pbl9hcnJheSgncHJvZHVjdF9pZCcsJHJbJ3NyY19jb2xzJ10pJiZpbl9hcnJheSgnY29zdF9uZXQnLCRyWydzcmNfY29scyddKTsKICAgICRzYWxlcz1bXTsgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRih2YXJpYXRpb25faWQ+MCx2YXJpYXRpb25faWQscHJvZHVjdF9pZCkgcGlkLCBwcm9kdWN0X2lkIHBhciwgU1VNKHByb2R1Y3RfcXR5KSBxIEZST00geyRQfXdjX29yZGVyX3Byb2R1Y3RfbG9va3VwIFdIRVJFIGRhdGVfY3JlYXRlZD49Tk9XKCktSU5URVJWQUwgOTAgREFZIEdST1VQIEJZIDEsMiIsQVJSQVlfQSkgYXMgJHgpeyAkc2FsZXNbKGludCkkeFsncGFyJ11dPSgkc2FsZXNbKGludCkkeFsncGFyJ11dPz8wKSsoaW50KSR4WydxJ107IH0KICAgICRzcmNDb3N0PVtdOyBpZigkaGFzU3JjKXsgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwcm9kdWN0X2lkLCBNSU4oY29zdF9uZXQpIGMgRlJPTSB7JFB9cHNfc291cmNlcyBXSEVSRSBjb3N0X25ldD4wIEdST1VQIEJZIHByb2R1Y3RfaWQiLEFSUkFZX0EpIGFzICR4KSAkc3JjQ29zdFsoaW50KSR4Wydwcm9kdWN0X2lkJ11dPShmbG9hdCkkeFsnYyddOyB9CiAgICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcC5JRCBGUk9NIHskd3BkYi0+cG9zdHN9IHAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBzIE9OIHMucG9zdF9pZD1wLklEIEFORCBzLm1ldGFfa2V5PSdfc3RvY2tfc3RhdHVzJyBBTkQgcy5tZXRhX3ZhbHVlPSdpbnN0b2NrJyBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBOT1QgRVhJU1RTKFNFTEVDVCAxIEZST00geyR3cGRiLT5wb3N0bWV0YX0gZCBXSEVSRSBkLnBvc3RfaWQ9cC5JRCBBTkQgZC5tZXRhX2tleT0nX2RwX2Jhc2VfcHJvZHVjdF9pZCcpIik7CiAgICAkb3V0PVtdOwogICAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICRwcj13Y19nZXRfcHJvZHVjdCgkaWQpOyBpZighJHByKSBjb250aW51ZTsKICAgICAgJHRlcm1zPXdwX2dldF9wb3N0X3Rlcm1zKCRpZCwncHJvZHVjdF9jYXQnLFsnZmllbGRzJz0+J2FsbCddKTsgJGtlbD1bXTsKICAgICAgZm9yZWFjaCgkdGVybXMgYXMgJHQpeyAkYT1hcnJheV9yZXZlcnNlKGdldF9hbmNlc3RvcnMoJHQtPnRlcm1faWQsJ3Byb2R1Y3RfY2F0JykpOyAkbm09W107IGZvcmVhY2goJGEgYXMgJGFpZCl7ICR0dD1nZXRfdGVybSgkYWlkLCdwcm9kdWN0X2NhdCcpOyBpZigkdHQmJiFpc193cF9lcnJvcigkdHQpKSAkbm1bXT0kdHQtPm5hbWU7IH0gJG5tW109JHQtPm5hbWU7ICRrZWxbXT1pbXBsb2RlKCcgPiAnLCRubSk7IH0KICAgICAgdXNvcnQoJGtlbCxmdW5jdGlvbigkYSwkYil7cmV0dXJuIHN1YnN0cl9jb3VudCgkYiwnPicpLXN1YnN0cl9jb3VudCgkYSwnPicpO30pOwogICAgICAkcHJpY2U9KGZsb2F0KSRwci0+Z2V0X3ByaWNlKCk7ICRjb3N0PShmbG9hdClnZXRfcG9zdF9tZXRhKCRpZCwnX2Nvc3RfcHJpY2UnLHRydWUpOyBpZighJGNvc3QmJmlzc2V0KCRzcmNDb3N0WyRpZF0pKSAkY29zdD0kc3JjQ29zdFskaWRdKjEuMjE7CiAgICAgIGlmKCRwci0+aXNfdHlwZSgndmFyaWFibGUnKSl7ICRjaD0kcHItPmdldF9jaGlsZHJlbigpOyAkY3M9W107IGZvcmVhY2goJGNoIGFzICRjKXsgJGNjPShmbG9hdClnZXRfcG9zdF9tZXRhKCRjLCdfY29zdF9wcmljZScsdHJ1ZSk7IGlmKCEkY2MmJmlzc2V0KCRzcmNDb3N0WyRjXSkpICRjYz0kc3JjQ29zdFskY10qMS4yMTsgaWYoJGNjKSAkY3NbXT0kY2M7IH0gaWYoJGNzJiYhJGNvc3QpICRjb3N0PW1pbigkY3MpOyB9CiAgICAgICRicj13cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfYnJhbmQnLFsnZmllbGRzJz0+J25hbWVzJ10pOyAKICAgICAgJG91dFtdPVsnaWQnPT4kaWQsJ24nPT5tYl9zdWJzdHIoJHByLT5nZXRfbmFtZSgpLDAsOTApLCd0Jz0+JHByLT5nZXRfdHlwZSgpLCdrYWluYSc9PnJvdW5kKCRwcmljZSwyKSwnc2F2X3N1X3B2bSc9PiRjb3N0P3JvdW5kKCRjb3N0LDIpOm51bGwsJ3BhcmQ5MCc9PiRzYWxlc1skaWRdPz8wLCdrYXQnPT5hcnJheV9zbGljZSgka2VsLDAsMiksJ2dhbSc9PmlzX3dwX2Vycm9yKCRicik/Jyc6aW1wbG9kZSgnLCcsKGFycmF5KSRiciksJ2ltZyc9PndwX2dldF9hdHRhY2htZW50X2ltYWdlX3VybCgkcHItPmdldF9pbWFnZV9pZCgpLCdtZWRpdW0nKT86JycsJ3NhbmRlbGlzJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSk/OicnLCd1cmwnPT5nZXRfcGVybWFsaW5rKCRpZCldOwogICAgfQogICAgJHJbJ24nXT1jb3VudCgkb3V0KTsKICAgICRyWydwcmVrZXMnXT0kb3V0OwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRVJSJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9KTsK';
const VER='dep-074003';
const GKEY='ps_s1836p';
const PHASES=["1"];
const OUT='analize/s1836p.json';
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
