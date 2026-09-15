process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODYgbWcg4oCUIFBBVElLUkEgKGF0c2tpcmEgdcW+a2xhdXNhKTogZmxvd3MoKSB3aW5fYmFjay9yZWZpbGxfZHVlIGtsYXPElywgY3JvbiwgZGllbmEoKSAoa2FuZGlkYXTFsyBkYWJhciAwKSwgd2luX2JhY2sgxaFhYmxvbm8gcmVuZGVyIHJlYWxpdSB1xb5zYWt5bXUgMzU5NDggbmVzaXVuxI1pYW50IChrYWlwIHMxNjg1X21tKS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODZtZyddKSkgcmV0dXJuOyAkbz1hcnJheSgndic9PidTMTY4NiBtZycpOwogICRmbD1QZXRzaG9wX0VtYWlsX0Rpc3BhdGNoOjpmbG93cygpOyAkb1snZmxvd3MnXT1hcnJheSgnd2luX2JhY2snPT5pc3NldCgkZmxbJ3dpbl9iYWNrJ10pPyRmbFsnd2luX2JhY2snXTpudWxsLCdyZWZpbGxfZHVlJz0+JGZsWydyZWZpbGxfZHVlJ10pOwogICRvWydjcm9uX25leHQnXT13cF9uZXh0X3NjaGVkdWxlZCgncHNfc3VncmF6aW5pbWFzX2RpZW5hJykgPyBnZXRfZGF0ZV9mcm9tX2dtdChnbWRhdGUoJ1ktbS1kIEg6aTpzJyx3cF9uZXh0X3NjaGVkdWxlZCgncHNfc3VncmF6aW5pbWFzX2RpZW5hJykpKSA6IG51bGw7CiAgUGV0c2hvcF9TdWdyYXppbmltYXM6OmRpZW5hKCk7ICRvWydkaWVuYV9sb2cnXT1nZXRfb3B0aW9uKCdwc19zdWdyYXppbmltYXNfcGFzaycpOwogICRvaWQ9MzU5NDg7ICRvcmQ9d2NfZ2V0X29yZGVyKCRvaWQpOyAkdWlkPSRvcmQ/JG9yZC0+Z2V0X2N1c3RvbWVyX2lkKCk6MDsgJGVtYWlsPSRvcmQ/JG9yZC0+Z2V0X2JpbGxpbmdfZW1haWwoKTonJzsKICBnbG9iYWwgJHdwZGI7ICRwaWQ9KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHByb2R1Y3RfaWQgRlJPTSB7JHdwZGItPnByZWZpeH1wc19yZWZpbGxfdHJhY2tpbmcgV0hFUkUgdXNlcl9pZD0lZCBBTkQgbGFzdF9vcmRlcl9pZD0lZCBMSU1JVCAxIiwkdWlkLCRvaWQpKTsKICAkb1sndGVzdCddPWFycmF5KCd1aWQnPT4kdWlkLCdwaWQnPT4kcGlkKTsKICAkcGF0aD1hcHBseV9maWx0ZXJzKCdwZXRzaG9wX2VtYWlsX3RlbXBsYXRlX3BhdGgnLFBFVFNIT1BfQ09SRV9ESVIuJ3RlbXBsYXRlcy9lbWFpbHMvd2luLWJhY2stNjAucGhwJywnd2luX2JhY2snLCd3aW4tYmFjay02MCcpOyAkb1sndHBsX3BhdGgnXT0kcGF0aDsKICAkcGF5bG9hZD1hcnJheSgncHJvZHVjdF9pZCc9PiRwaWQsJ29yZGVyX2lkJz0+JG9pZCk7ICRmbG93X2NsYXNzPSdzaW1pbGFyX3NvZnRfb3B0aW4nOyAkcmVjaXBpZW50PSRlbWFpbDsgJHN1YmplY3Q9Jyc7CiAgb2Jfc3RhcnQoKTsgaW5jbHVkZSAkcGF0aDsgJGh0bWw9b2JfZ2V0X2NsZWFuKCk7ICRvWydzdWJqZWN0J109JHN1YmplY3Q7ICRvWydodG1sX2xlbiddPXN0cmxlbigkaHRtbCk7CiAgJG9bJ3Rla3N0YXMnXT10cmltKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyxzdHJpcF90YWdzKHN0cl9yZXBsYWNlKCc8JywnICA8JywkaHRtbCkpKSk7ICRvWyd0ZWtzdGFzJ109bWJfc3Vic3RyKCRvWyd0ZWtzdGFzJ10sMCw5MDApOwogICRvWydteWd0dWthcyddPXByZWdfbWF0Y2goJy9ocmVmPSIoW14iXSpwc19wYWthcnRvdGlbXiJdKikiLycsJGh0bWwsJG0pP2h0bWxfZW50aXR5X2RlY29kZSgkbVsxXSk6bnVsbDsgJG9bJ29wdG91dCddPXByZWdfbWF0Y2goJy9ocmVmPSIoW14iXSpwc19hdHNpc2FreXRpW14iXSopIi8nLCRodG1sLCRtMik/J3lyYSc6J07EllJBJzsgJG9bJ2tlaXN0aSddPXN0cnBvcygkaHRtbCwnS2Vpc3RpIHByaW1pbmltxIUnKSE9PWZhbHNlOwogICRvWydlbGlnX3Rlc3QnXT1QZXRzaG9wX0VtYWlsX0Rpc3BhdGNoOjpjaGVja19lbGlnaWJpbGl0eSgnc2ltaWxhcl9zb2Z0X29wdGluJywkZW1haWwsJ3dpbl9iYWNrJyxhcnJheSgndXNlcl9pZCc9PiR1aWQsJ3Byb2R1Y3RfaWQnPT4kcGlkLCdsYXN0X3B1cmNoYXNlX2RhdGUnPT4nMjAyNi0wOS0xNCcpKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-171240';
const GKEY='ps_s1686mg';
const PHASES=["TEST"];
const OUT='analize/s1686_mg.json';
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
