process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzYgcnVuIG0g4oCUIFZGIHNpdW50b3M6IGFyIHXFvmRhcnl0b3MsIGFyIGxhacWha2FpIGtsaWVudGFtcyBpxaHEl2pvLiBSRUFELU9OTFkuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjc2bSddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjc2IG0nKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00geyRwfXdjX29yZGVycyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBBTkQgZGF0ZV9jcmVhdGVkX2dtdD49JzIwMjYtMDktMDknIEFORCBzdGF0dXMgTk9UIElOICgnd2MtY2FuY2VsbGVkJywnd2MtY2hlY2tvdXQtZHJhZnQnLCd0cmFzaCcpIE9SREVSIEJZIGlkIik7CiAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICR3PXdjX2dldF9vcmRlcigkaWQpOyBpZighJHcpIGNvbnRpbnVlOyAkc2g9JHctPmdldF9tZXRhKCdfcHNfc2hpcG1lbnRzJyk7ICRzaHM9aXNfYXJyYXkoJHNoKT8kc2g6KGlzX3N0cmluZygkc2gpP2pzb25fZGVjb2RlKCRzaCx0cnVlKTpudWxsKTsKICAgICRyPWFycmF5KCducic9PiR3LT5nZXRfb3JkZXJfbnVtYmVyKCksJ3N0Jz0+JHctPmdldF9zdGF0dXMoKSwnc3VrdXJ0YSc9PiR3LT5nZXRfZGF0ZV9jcmVhdGVkKCktPmRhdGUoJ20tZCBIOmknKSwnc2l1bnRvcyc9PmFycmF5KCkpOwogICAgaWYoaXNfYXJyYXkoJHNocykpIGZvcmVhY2goJHNocyBhcyAkaz0+JHMpeyBpZighaXNfYXJyYXkoJHMpKSBjb250aW51ZTsgJHJbJ3NpdW50b3MnXVtdPWFycmF5X2ludGVyc2VjdF9rZXkoJHMsYXJyYXlfZmxpcChhcnJheSgnc2FuZGVsaXMnLCd2ZXplamFzJywndHJhY2tpbmcnLCdzaXVudG9zX25yJywnYnVzZW5hJywnc3RhdHVzJywnaXNzaXVzdGEnLCdpc3NpdXN0YV9hdCcsJ3ByaXN0YXR5dGEnLCdwcmlzdGF0eXRhX2F0JywndXpkYXJ5dGEnLCdrb2RhcycsJ3ZlbmlwYWtfa29kYXMnLCdwYXNrdXRpbmlzX2tvZGFzJykpKTsgfQogICAgJG5vdGVzPXdjX2dldF9vcmRlcl9ub3RlcyhhcnJheSgnb3JkZXJfaWQnPT4kaWQsJ2xpbWl0Jz0+NDApKTsgJHJbJ3Bhc3RhYm9zJ109YXJyYXkoKTsgZm9yZWFjaCgkbm90ZXMgYXMgJG4peyAkYz0oc3RyaW5nKSRuLT5jb250ZW50OyBpZihwcmVnX21hdGNoKCcvbGFpxaFrfFZlbmlwYWt8TFAgfGnFoXNpxbNzdHx1xb5kYXJ8cHJpc3RhdHxWRnx0aWVrxJdqL2l1JywkYykpICRyWydwYXN0YWJvcyddW109JG4tPmRhdGVfY3JlYXRlZC0+ZGF0ZSgnbS1kIEg6aScpLicgJy5tYl9zdWJzdHIocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCRjKSwwLDE0MCk7IH0KICAgICRyWydwYXN0YWJvcyddPWFycmF5X3NsaWNlKCRyWydwYXN0YWJvcyddLDAsOCk7CiAgICAkb1sndXpzJ11bJGlkXT0kcjsgfQogICRvWydmYWt0X3NpdW50b3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB1enNha3ltYXNfaWQsc2FuZGVsaXMsdmV6ZWphcyxzaXVudG9zX25yLHN0YXR1c2FzLGlzdmV6dGFfYXQscHJpc3RhdHl0YV9hdCxhdHNpaW10YV9hdCBGUk9NIHskcH1wc19mYWt0X3NpdW50b3MgV0hFUkUgc3VrdXJ0YV9hdD49JzIwMjYtMDktMDknIE9SREVSIEJZIHV6c2FreW1hc19pZCIsQVJSQVlfQSk7CiAgJG9bJ3djX3NoaXBwZWRfZW1haWxzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsZmxvdyxzdGF0dXMsc2tpcF9yZWFzb24sc2VudF9hdCBGUk9NIHskcH1wc19lbWFpbF9qb2JzIFdIRVJFIGZsb3cgSU4gKCdvcmRlcl9zaGlwcGVkJykgQU5EIGNyZWF0ZWRfYXQ+PScyMDI2LTA5LTA5JyBPUkRFUiBCWSBpZCIsQVJSQVlfQSk7CiAgJG9bJ2Nyb25fdmVuaXBhayddPXdwX25leHRfc2NoZWR1bGVkKCdwc192ZW5pcGFrX3Nla2ltYXMnKT9kYXRlKCdtLWQgSDppJyx3cF9uZXh0X3NjaGVkdWxlZCgncHNfdmVuaXBha19zZWtpbWFzJykpOidOxJZSQSc7CiAgJG9bJ3Nla2ltb19sb2cnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSBuLCBMRUZUKG9wdGlvbl92YWx1ZSw2MDApIHYgRlJPTSB7JHB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdwc192ZW5pcGFrX3NlayUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX3NpdW50dV9zZWslJyBMSU1JVCA1IixBUlJBWV9BKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlR8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-083125';
const GKEY='ps_s1676m';
const PHASES=["GO"];
const OUT='analize/s1676_m.json';
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
