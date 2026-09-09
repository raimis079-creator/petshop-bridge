process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjYxIDM1ODczIGZpeCArIHZhbHltYXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTY2MWYnXSl8fCRfR0VUWydwc19zMTY2MWYnXSE9PSdHTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjYxRicpOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsKICAgIC8vIDEuIDM1ODczOiBhdHN0YXR5dGkgX3JlZHVjZWRfc3RvY2s9NCAoY29yZSBzdW1hemlubyA0LCBtZXRhIGlzdHJpbnRhIHBheS1wYWdlIGtlbHlqZSkKICAgICRvcmQ9d2NfZ2V0X29yZGVyKDM1ODczKTsKICAgIGZvcmVhY2goJG9yZC0+Z2V0X2l0ZW1zKCkgYXMgJGl0KXsKICAgICAgaWYoKGludCkkaXQtPmdldF9tZXRhKCdfcmVkdWNlZF9zdG9jaycpPT09MCl7ICRpdC0+dXBkYXRlX21ldGFfZGF0YSgnX3JlZHVjZWRfc3RvY2snLDQpOyAkaXQtPnNhdmUoKTsgJG9bJ2ZpeCddPSdpcmHFoXl0YSA0JzsgfQogICAgICBlbHNlICRvWydmaXgnXT0namF1IGJ1dm8gJy4kaXQtPmdldF9tZXRhKCdfcmVkdWNlZF9zdG9jaycpOwogICAgfQogICAgLy8gb3JkZXIgZmxhZyAoSFBPUyBvcGVyYXRpb25hbCkg4oCUIGthZCByZXN0b3JlIHZhcnRhaSBhdHNpZGFyeXR1CiAgICAkb3JkLT5nZXRfZGF0YV9zdG9yZSgpLT5zZXRfc3RvY2tfcmVkdWNlZCgzNTg3Myx0cnVlKTsKICAgICRvcmQtPmFkZF9vcmRlcl9ub3RlKCdTMTY2MTogYXRzdGF0eXRhIF9yZWR1Y2VkX3N0b2NrPTQgaXIgc3RvY2tfcmVkdWNlZCDFvnltxJcgKHBheS1wYWdlIGtlbGlhcyBqYXMgacWhdHJ5bsSXKSDigJQga2FkIGF0xaFhdWtpbW8gYXR2ZWp1IGxpa3V0aXMgZ3LEr8W+dMWzLicpOwogICAgJG9bJ2ZsYWdfcG8nXT13Y19nZXRfb3JkZXIoMzU4NzMpLT5nZXRfbWV0YSgnX29yZGVyX3N0b2NrX3JlZHVjZWQnKTsKICAgIC8vIDIuIHRlc3R1IHZhbHltYXMKICAgICRwPWdldF9wYWdlX2J5X3RpdGxlKCdURVNUIFMxNjYxIGxpa3V0aXMnLE9CSkVDVCwncHJvZHVjdCcpOwogICAgaWYoJHApeyBmb3JlYWNoKCR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgRElTVElOQ1Qgb2kub3JkZXJfaWQgRlJPTSB7JHdwZGItPnByZWZpeH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBvaSBKT0lOIHskd3BkYi0+cHJlZml4fXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIG0gT04gbS5vcmRlcl9pdGVtX2lkPW9pLm9yZGVyX2l0ZW1faWQgQU5EIG0ubWV0YV9rZXk9J19wcm9kdWN0X2lkJyBBTkQgbS5tZXRhX3ZhbHVlPSVkIiwkcC0+SUQpKSBhcyAkeCl7ICRvZD13Y19nZXRfb3JkZXIoJHgpOyBpZigkb2QpeyAkb2QtPmRlbGV0ZSh0cnVlKTsgJG9bJ2lzdHJpbnRhX29yZCddW109JHg7IH0gfQogICAgICB3cF9kZWxldGVfcG9zdCgkcC0+SUQsdHJ1ZSk7ICRvWydpc3RyaW50YV9waWQnXT0kcC0+SUQ7IH0KICAgIC8vIDMuIFRFTVAgc25pcHBldHUgdHJ5bmltYXMgaXMgREIKICAgICRvWyd0ZW1wX2lzdHJpbnRhJ109JHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAgUFMgZGVwLSUnIEFORCBhY3RpdmU9MCIpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-113032';
const GKEY='ps_s1661f';
const PHASES=["GO"];
const OUT='analize/s1661_f.json';
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

