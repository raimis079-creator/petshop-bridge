process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzM5YSBuZWFwbW9rZXRpIHV6c2FreW1haSAocmVhZC1vbmx5LCBiZSBhc21lbnMgZHVvbWVudSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzM5YSddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMjAwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3MzlhJ107CiAgdHJ5ewogICAgJHJbJ2hvbGRfc3RvY2tfbWluJ109Z2V0X29wdGlvbignd29vY29tbWVyY2VfaG9sZF9zdG9ja19taW51dGVzJyk7ICRyWydtYW5hZ2Vfc3RvY2snXT1nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9tYW5hZ2Vfc3RvY2snKTsKICAgICRiYWNzPWdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2JhY3Nfc2V0dGluZ3MnKTsgJHJbJ2JhY3NfZW5hYmxlZCddPSRiYWNzWydlbmFibGVkJ10/P251bGw7CiAgICAkcHM9Z2V0X29wdGlvbignd29vY29tbWVyY2VfcGF5c2VyYV9zZXR0aW5ncycpOyBpZihpc19hcnJheSgkcHMpKXsgZm9yZWFjaCgkcHMgYXMgJGs9PiR2KXsgaWYocHJlZ19tYXRjaCgnL3Bhc3N8c2lnbnxzZWNyZXR8a2V5fHByb2plY3RfaWQvaScsJGspKSAkcHNbJGtdPScqKionOyB9ICRyWydwYXlzZXJhX3NldHRpbmdzJ109JHBzOyB9CiAgICAkclsnY3Jvbl9jYW5jZWxfdW5wYWlkJ109d3BfbmV4dF9zY2hlZHVsZWQoJ3dvb2NvbW1lcmNlX2NhbmNlbF91bnBhaWRfb3JkZXJzJyk/ZGF0ZSgnWS1tLWQgSDppJyx3cF9uZXh0X3NjaGVkdWxlZCgnd29vY29tbWVyY2VfY2FuY2VsX3VucGFpZF9vcmRlcnMnKSk6bnVsbDsKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHN0YXR1cyxwYXltZW50X21ldGhvZCBwbSxST1VORCh0b3RhbF9hbW91bnQsMikgc3VtYSxjdXN0b21lcl9pZCBjaWQsTUQ1KExPV0VSKGJpbGxpbmdfZW1haWwpKSBlaCxkYXRlX2NyZWF0ZWRfZ210IGQgRlJPTSB7JFB9d2Nfb3JkZXJzIFdIRVJFIHR5cGU9J3Nob3Bfb3JkZXInIEFORCBkYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0wOS0wOCAyMTowMCcgQU5EIHN0YXR1cyBJTignd2MtY2FuY2VsbGVkJywnd2MtZmFpbGVkJywnd2MtcGVuZGluZycsJ3djLW9uLWhvbGQnKSBPUkRFUiBCWSBkYXRlX2NyZWF0ZWRfZ210IixBUlJBWV9BKTsKICAgICRyWyduJ109Y291bnQoJHJvd3MpOwogICAgJHBhaWQ9W107IGZvcmVhY2goJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgTUQ1KExPV0VSKGJpbGxpbmdfZW1haWwpKSBlaCwgTUlOKGRhdGVfY3JlYXRlZF9nbXQpIGQsIENPVU5UKCopIG4gRlJPTSB7JFB9d2Nfb3JkZXJzIFdIRVJFIHR5cGU9J3Nob3Bfb3JkZXInIEFORCBzdGF0dXMgSU4oJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnKSBBTkQgZGF0ZV9jcmVhdGVkX2dtdD49JzIwMjYtMDktMDggMjE6MDAnIEdST1VQIEJZIDEiLEFSUkFZX0EpIGFzICR4KSAkcGFpZFskeFsnZWgnXV09JHg7CiAgICAkYWdnPVtdOwogICAgZm9yZWFjaCgkcm93cyBhcyAkbyl7CiAgICAgICRub3Rlcz0kd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIExFRlQoUkVQTEFDRShjb21tZW50X2NvbnRlbnQsJ1xuJywnICcpLDE2MCkgRlJPTSB7JHdwZGItPmNvbW1lbnRzfSBXSEVSRSBjb21tZW50X3Bvc3RfSUQ9JWQgQU5EIGNvbW1lbnRfdHlwZT0nb3JkZXJfbm90ZScgT1JERVIgQlkgY29tbWVudF9JRCIsJG9bJ2lkJ10pKTsKICAgICAgJGNyZWF0ZWQ9c3RydG90aW1lKCRvWydkJ10uJyBVVEMnKTsKICAgICAgJGNhbmNlbF9ub3RlPW51bGw7IGZvcmVhY2goJG5vdGVzIGFzICRuKXsgaWYoc3RyaXBvcygkbiwnYXTFoWF1aycpIT09ZmFsc2V8fHN0cmlwb3MoJG4sJ2NhbmNlbCcpIT09ZmFsc2V8fHN0cmlwb3MoJG4sJ05lYXBtb2vEl3RhcycpIT09ZmFsc2V8fHN0cmlwb3MoJG4sJ1VucGFpZCcpIT09ZmFsc2UpeyAkY2FuY2VsX25vdGU9JG47IGJyZWFrOyB9IH0KICAgICAgJHN0X2NoYW5nZT0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGNvbW1lbnRfZGF0ZV9nbXQgRlJPTSB7JHdwZGItPmNvbW1lbnRzfSBXSEVSRSBjb21tZW50X3Bvc3RfSUQ9JWQgQU5EIGNvbW1lbnRfdHlwZT0nb3JkZXJfbm90ZScgQU5EIChjb21tZW50X2NvbnRlbnQgTElLRSAnJSVhdMWhYXVrdCUlJyBPUiBjb21tZW50X2NvbnRlbnQgTElLRSAnJSVhbmNlbCUlJykgT1JERVIgQlkgY29tbWVudF9JRCBMSU1JVCAxIiwkb1snaWQnXSkpOwogICAgICAkbWlucz0kc3RfY2hhbmdlP3JvdW5kKChzdHJ0b3RpbWUoJHN0X2NoYW5nZS4nIFVUQycpLSRjcmVhdGVkKS82MCk6bnVsbDsKICAgICAgJHBwPSRwYWlkWyRvWydlaCddXT8/bnVsbDsKICAgICAgJHJbJ3V6cyddW109WydpZCc9PiRvWydpZCddLCdzdCc9PiRvWydzdGF0dXMnXSwncG0nPT4kb1sncG0nXSwnc3VtYSc9PiRvWydzdW1hJ10sJ2NpZCc9PiRvWydjaWQnXSwnayc9PnN1YnN0cigkb1snZWgnXSwwLDYpLCdkJz0+JG9bJ2QnXSwnbWluX2lraV9hdHNhdWtpbW8nPT4kbWlucywndmVsaWF1X2FwbW9rZWpvJz0+JHBwPygkcHBbJ24nXS4nw5cgbnVvICcuJHBwWydkJ10pOiduZScsJ3Bhc3RhYm9zJz0+YXJyYXlfc2xpY2UoJG5vdGVzLDAsNSldOwogICAgICAka2V5PSRvWydwbSddLid8Jy4oJHBwPydhcG1va2Vqbyc6J25lJyk7ICRhZ2dbJGtleV09KCRhZ2dbJGtleV0/PzApKzE7CiAgICB9CiAgICAkclsnYWdnJ109JGFnZzsKICAgIC8vIHBheXNlcmEgbG9nYWkKICAgICRsZz1nbG9iKFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy93Yy1sb2dzLypwYXlzZXJhKicpOyAkclsncGF5c2VyYV9sb2dhaSddPWFycmF5X21hcChmdW5jdGlvbigkZil7cmV0dXJuIGJhc2VuYW1lKCRmKS4nICcucm91bmQoZmlsZXNpemUoJGYpLzEwMjQpLidrJzt9LCRsZz86W10pOwogICAgaWYoJGxnKXsgdXNvcnQoJGxnLGZ1bmN0aW9uKCRhLCRiKXtyZXR1cm4gZmlsZW10aW1lKCRiKS1maWxlbXRpbWUoJGEpO30pOyAkdD1AZmlsZV9nZXRfY29udGVudHMoJGxnWzBdKTsgJGxzPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoZXhwbG9kZSgiXG4iLCR0KSxmdW5jdGlvbigkbCl7cmV0dXJuIHByZWdfbWF0Y2goJy9lcnJvcnxmYWlsfGRlY2xpbnxjYW5jZWx8c3RhdHVzfGtsYWlkYS9pJywkbCk7fSkpOyAkclsncGF5c2VyYV9sb2dfdGFpbCddPWFycmF5X21hcChmdW5jdGlvbigkbCl7cmV0dXJuIHN1YnN0cihwcmVnX3JlcGxhY2UoJy9bXHcuKy1dK0BbXHcuLV0rLycsJ1tlbWFpbF0nLCRsKSwwLDIwMCk7fSxhcnJheV9zbGljZSgkbHMsLTI1KSk7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-164344';
const GKEY='ps_s1739a';
const PHASES=["1"];
const OUT='analize/s1739_a.json';
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
