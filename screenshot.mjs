process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxOTE5dCBrYXRhbG9nbyB0dmFya2EgdHlyaW1hcyAodGlrIHNrYWl0bykgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxOTE5dCddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoOTApOyBnbG9iYWwgJHdwZGI7ICRyPVsndic9PidzMTkxOXQnXTsKICB0cnl7CiAgICAkclsna2Vpc3RpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQscG9zdF90aXRsZSxwb3N0X3N0YXR1cyxwb3N0X2RhdGUgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3RpdGxlIFJFR0VYUCAnXlswLTldK1suXVswLTldK18nIE9SREVSIEJZIElEIixBUlJBWV9BKTsKICAgICRyWydrZWlzdGkyJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZSBJTiAoJ3Byb2R1Y3QnLCdwcm9kdWN0X3ZhcmlhdGlvbicpIEFORCBwb3N0X3RpdGxlIFJFR0VYUCAnXlswLTldK1suX11bMC05X10qWyBfXSciKTsKICAgICRyWydvcmRlcmJ5J109Z2V0X29wdGlvbignd29vY29tbWVyY2VfZGVmYXVsdF9jYXRhbG9nX29yZGVyYnknKTsKICAgICRyWyd0dmFya2Ffc3JjJ109ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1wcmVrZXMtdHZhcmthLnBocCcpOwogICAgJHJbJ3RheCddPWdldF9vYmplY3RfdGF4b25vbWllcygncHJvZHVjdCcpOwogICAgZm9yZWFjaChnZXRfb2JqZWN0X3RheG9ub21pZXMoJ3Byb2R1Y3QnKSBhcyAkdHgpeyBpZihzdHJwb3MoJHR4LCdwYV8nKT09PTAgJiYgIXByZWdfbWF0Y2goJy9nYW1pbnR8emVua2x8YnJhbmR8cHJlay8nLCR0eCkpIGNvbnRpbnVlOyAkdD1nZXRfdGVybXMoWyd0YXhvbm9teSc9PiR0eCwnaGlkZV9lbXB0eSc9PmZhbHNlLCdzZWFyY2gnPT4nb250YXJpbyddKTsgaWYoIWlzX3dwX2Vycm9yKCR0KSYmJHQpIGZvcmVhY2goJHQgYXMgJHgpICRyWydvbnRhcmlvJ11bXT1bJHR4LCR4LT50ZXJtX2lkLCR4LT5uYW1lLCR4LT5zbHVnLCR4LT5jb3VudF07IH0KICAgICRjYXRzPWdldF90ZXJtcyhbJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnaGlkZV9lbXB0eSc9PmZhbHNlXSk7IAogICAgZm9yZWFjaCgkY2F0cyBhcyAkYyl7IGlmKHByZWdfbWF0Y2goJy9tYWlzdHxrb25zZXJ2fHBhxaFhcnxwYXNhcnzEl2RhbHxlZGFsfHNhdXNhc3zFoWxhcGl8c2xhcGkvaXUnLCRjLT5uYW1lKSkgJHJbJ21haXN0b19rYXQnXVtdPVskYy0+dGVybV9pZCwkYy0+bmFtZSwkYy0+c2x1ZywkYy0+cGFyZW50LCRjLT5jb3VudF07IGlmKCRjLT5wYXJlbnQ9PTApICRyWyd2aXJzdW5lJ11bXT1bJGMtPnRlcm1faWQsJGMtPm5hbWUsJGMtPnNsdWcsJGMtPmNvdW50XTsgfQogICAgJHJbJ3Bpcm1pMjQnXT1bXTsgJHE9bmV3IFdQX1F1ZXJ5KFsncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywncG9zdHNfcGVyX3BhZ2UnPT4yNCwnb3JkZXJieSc9PidtZW51X29yZGVyIHRpdGxlJywnb3JkZXInPT4nQVNDJywnZmllbGRzJz0+J2lkcyddKTsKICAgIGZvcmVhY2goJHEtPnBvc3RzIGFzICRpZCl7ICRyWydwaXJtaTI0J11bXT1bJGlkLGdldF90aGVfdGl0bGUoJGlkKSwoaW50KWdldF9wb3N0X2ZpZWxkKCdtZW51X29yZGVyJywkaWQpXTsgfQogICAgJHJbJ21lbnVfb3JkZXJfc3RhdCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG1lbnVfb3JkZXIsIENPVU5UKCopIG4gRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgR1JPVVAgQlkgbWVudV9vcmRlciBPUkRFUiBCWSBuIERFU0MgTElNSVQgMTAiLEFSUkFZX0EpOwogICAgJGhvb2tzPVtdOyBmb3JlYWNoKFsnd29vY29tbWVyY2VfZ2V0X2NhdGFsb2dfb3JkZXJpbmdfYXJncycsJ3Bvc3RzX2NsYXVzZXMnLCd3b29jb21tZXJjZV9wcm9kdWN0X3F1ZXJ5JywncHJlX2dldF9wb3N0cycsJ3dvb2NvbW1lcmNlX2RlZmF1bHRfY2F0YWxvZ19vcmRlcmJ5J10gYXMgJGgpeyBnbG9iYWwgJHdwX2ZpbHRlcjsgaWYoaXNzZXQoJHdwX2ZpbHRlclskaF0pKSBmb3JlYWNoKCR3cF9maWx0ZXJbJGhdLT5jYWxsYmFja3MgYXMgJHByPT4kY2JzKSBmb3JlYWNoKCRjYnMgYXMgJGNiKXsgJGY9JGNiWydmdW5jdGlvbiddOyAkaG9va3NbJGhdW109JHByLic6Jy4oaXNfc3RyaW5nKCRmKT8kZjooaXNfYXJyYXkoJGYpPyhpc19vYmplY3QoJGZbMF0pP2dldF9jbGFzcygkZlswXSk6JGZbMF0pLic6OicuJGZbMV06J2Nsb3N1cmUnKSk7IH0gfSAkclsnaG9va3MnXT0kaG9va3M7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydlcnInXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LDEpOwo=';
const VER='dep-220014';
const GKEY='ps_s1919t';
const PHASES=["D"];
const OUT='analize/s1919_T.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
