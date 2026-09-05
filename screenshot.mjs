process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTggcnVuIHIzIOKAlCBSRUNPTjogdGVtb3MgSUFQVi9BVlBOIGxhacWha8WzIGthYmxpYWkgKGthZGEgc2l1bsSNaWFtYSBpxaFhbmtzdGluxJcgYmFjcyBrbGllbnR1aTsga29kxJdsIEFWUE4gcHJpc2tpcmlhbWFzIHByb2Nlc3Npbmcvb24taG9sZCksIFdDIGxhacWha8WzIMSvanVuZ2ltYXMsIGthc29zIGJhY3MgdcW+c2FreW3FsyBtZXRhLiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19yMyddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjE4IHIzJyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgc2V0X3RpbWVfbGltaXQoMjgwKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJEo9ZnVuY3Rpb24oJG8peyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7IH07CiAgdHJ5ewogICR0Zj1nZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKS4nL2Z1bmN0aW9ucy5waHAnOyAkbGluZXM9ZmlsZSgkdGYpOwogIGZvcmVhY2goJGxpbmVzIGFzICRpPT4kbCl7IGlmKHByZWdfbWF0Y2goJy9hZGRfYWN0aW9ufGFkZF9maWx0ZXIvJywkbCkgJiYgcHJlZ19tYXRjaCgnL2VtYWlsfHRoYW5reW91fG9yZGVyX3N0YXR1c3xuZXdfb3JkZXJ8YXR0YWNobWVudHN8aW52b2ljZXxwZGZ8bWFpbC9pJywkbCkpeyAkb1sna2FibGlhaSddW109KCRpKzEpLic6ICcubWJfc3Vic3RyKHRyaW0oJGwpLDAsMTcwKTsgfSBpZihwcmVnX21hdGNoKCcvd3BfbWFpbFwofC0+c2VuZFwofHBldHNob3BfZ2V0X2F2cG5fbnVtYmVyfGF2cG5fY291bnRlci8nLCRsKSl7ICRvWydzaXVudGltYWknXVtdPSgkaSsxKS4nOiAnLm1iX3N1YnN0cih0cmltKCRsKSwwLDE3MCk7IH0gfQogIC8vIGZ1bmtjaWphLCBrdXJpIHByaXNraXJpYSBBVlBOCiAgZm9yZWFjaCgkbGluZXMgYXMgJGk9PiRsKXsgaWYocHJlZ19tYXRjaCgnL2Z1bmN0aW9uIHBldHNob3BfZ2V0X2F2cG5fbnVtYmVyfGZ1bmN0aW9uIHBldHNob3BfZ2VuZXJhdGVfaW52b2ljZV9wZGZ8ZnVuY3Rpb24gcGV0c2hvcF9pbnZvaWNlX3R5cGV8ZnVuY3Rpb24gcGV0c2hvcF8uKmF0dGFjaC8nLCRsKSl7ICRvWydmdW5rY2lqb3MnXVtdPSgkaSsxKS4nOiAnLnRyaW0oJGwpOyB9IH0KICBpZihwcmVnX21hdGNoX2FsbCgnL2Z1bmN0aW9uIChwZXRzaG9wX1thLXpfXSspLycsaW1wbG9kZSgnJywkbGluZXMpLCRmbSkpeyAkb1sndmlzb3NfZiddPWFycmF5X3NsaWNlKCRmbVsxXSwwLDgwKTsgfQogIC8vIDI2MOKAkzMwMCBlaWx1dMSXcyAodGlwbyBudXN0YXR5bWFzKQogICRvWyd0aXBhc19zcmMnXT1pbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRsaW5lcywyNTksNDUpKTsKICBmb3JlYWNoKGFycmF5KCd3b29jb21tZXJjZV9jdXN0b21lcl9vbl9ob2xkX29yZGVyX3NldHRpbmdzJywnd29vY29tbWVyY2VfY3VzdG9tZXJfcHJvY2Vzc2luZ19vcmRlcl9zZXR0aW5ncycsJ3dvb2NvbW1lcmNlX25ld19vcmRlcl9zZXR0aW5ncycsJ3dvb2NvbW1lcmNlX2N1c3RvbWVyX2ludm9pY2Vfc2V0dGluZ3MnKSBhcyAkayl7ICRzPWdldF9vcHRpb24oJGspOyAkb1snd2NfZW1haWwnXVska109aXNfYXJyYXkoJHMpP2FycmF5KCdlbmFibGVkJz0+JHNbJ2VuYWJsZWQnXT8/bnVsbCwnc3ViamVjdCc9PiRzWydzdWJqZWN0J10/PycnKTokczsgfQogIGZvcmVhY2goYXJyYXkoMzU0NDIsMzU0MzYsMzU3NzcsMzU4MDEsMzU4MDIpIGFzICRpZCl7ICR4PXdjX2dldF9vcmRlcigkaWQpOyBpZighJHgpIGNvbnRpbnVlOyAkb1snbWV0YSddWyRpZF09YXJyYXkoJ3N0Jz0+JHgtPmdldF9zdGF0dXMoKSwncG0nPT4keC0+Z2V0X3BheW1lbnRfbWV0aG9kKCksJ2F2cG4nPT4keC0+Z2V0X21ldGEoJ19wZXRzaG9wX2F2cG5fbnVtYmVyJyksJ2lhcHYnPT4keC0+Z2V0X21ldGEoJ19wZXRzaG9wX2lhcHZfbnVtYmVyJyksJ3BkZic9PmJhc2VuYW1lKChzdHJpbmcpJHgtPmdldF9tZXRhKCdfcGV0c2hvcF9jb21wbGV0ZWRfcGRmJykpLCdpYXB2X3BkZic9PmJhc2VuYW1lKChzdHJpbmcpJHgtPmdldF9tZXRhKCdfcGV0c2hvcF9wcm9mb3JtYV9wZGYnKSksJ2tleXMnPT5hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKGFycmF5X21hcChmdW5jdGlvbigkbSl7cmV0dXJuICRtLT5rZXk7fSwkeC0+Z2V0X21ldGFfZGF0YSgpKSxmdW5jdGlvbigkayl7cmV0dXJuIHN0cmlwb3MoJGssJ3BldHNob3AnKSE9PWZhbHNlfHxzdHJpcG9zKCRrLCdwZGYnKSE9PWZhbHNlfHxzdHJpcG9zKCRrLCdpYXB2JykhPT1mYWxzZXx8c3RyaXBvcygkaywnYXZwbicpIT09ZmFsc2U7fSkpKTsgfQogICRvWydhdnBuX2NvdW50ZXInXT1nZXRfb3B0aW9uKCdwZXRzaG9wX2F2cG5fY291bnRlcicpOyAkb1snaWFwdl9jb3VudGVyJ109Z2V0X29wdGlvbigncGV0c2hvcF9pYXB2X2NvdW50ZXInKTsKICAkbm90ZXM9d2NfZ2V0X29yZGVyX25vdGVzKGFycmF5KCdvcmRlcl9pZCc9PjM1ODAxLCdsaW1pdCc9PjEwKSk7ICRvWydub3Rlc18zNTgwMSddPWFycmF5X21hcChmdW5jdGlvbigkbm4pe3JldHVybiBtYl9zdWJzdHIoJG5uLT5jb250ZW50LDAsMTYwKTt9LCRub3Rlcyk7CiAgJG9bJ3RlbXBfbGlrbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuYmFzZW5hbWUoJGUtPmdldEZpbGUoKSkuJzonLiRlLT5nZXRMaW5lKCk7IH0KICAkSigkbyk7Cn0sOTkpOwo=';
const VER='dep-202507';
const GKEY='ps_r3';
const PHASES=["R"];
const OUT='analize/s1618_r3.json';
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
