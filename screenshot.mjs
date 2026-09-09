process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjgyIHBhcnRpanUgcGFwaWxkeW1hcyBBUFBMWSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj1pc3NldCgkX0dFVFsncHNfYmw5J10pPyRfR0VUWydwc19ibDknXTonJzsKICBpZigkZiE9PSdBJyYmJGYhPT0nQicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjgyJywnZmF6ZSc9PiRmLCd3cCc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSk7CiAgZ2xvYmFsICR3cGRiOyAkdHA9JHdwZGItPnByZWZpeC4ncHNfcGFydGlqb3MnOwogIHRyeXsKICAgIGlmKCRmPT09J0EnKXsKICAgICAgaWYoKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gYCR0cGAgV0hFUkUgcGFzdGFiYSBMSUtFICclUzE2ODIlJykiKT4wKXt9CiAgICAgICRqYXU9KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gYCR0cGAgV0hFUkUgcGFzdGFiYSBMSUtFICclUzE2ODIlJyIpOwogICAgICBpZigkamF1PjApeyAkb1snU1RPUCddPSdqYXUgaXZ5a2R5dGEsIHJhc3RhICcuJGphdTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsgfQogICAgICAkcGxhbj1nZXRfb3B0aW9uKCdwc19zMTY4Ml9wbGFuYXMnKTsKICAgICAgaWYoIWlzX2FycmF5KCRwbGFuKXx8IWNvdW50KCRwbGFuKSl7ICRvWydTVE9QJ109J3BsYW5hcyBuZXJhc3Rhcyc7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7IH0KICAgICAgLy8gcGlsbmEgcGFydGlqdSBsZW50ZWxlcyBrb3BpamEKICAgICAgJHZpcz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00gYCR0cGAiLEFSUkFZX0EpOwogICAgICB1cGRhdGVfb3B0aW9uKCdwc19zMTY4Ml9wYXJ0aWpvc19iYWsnLCR2aXMsZmFsc2UpOwogICAgICAkb1snYmFrX2VpbHVjaXUnXT1jb3VudCgkdmlzKTsKICAgICAgJGRhdGE9JzIwMjYtMDktMDcnOyAkcGFzdGFiYT0nUHJhZGluaXMgbGlrdXRpcyBULTAgKHBhcGlsZHltYXMsIFMxNjgyKSc7CiAgICAgICRvaz0wOyAkZXJyPWFycmF5KCk7ICR2bnQ9MDsgJGV1cj0wOwogICAgICBmb3JlYWNoKCRwbGFuIGFzICR4KXsKICAgICAgICAkaWQ9KGludCkkeFsnaWQnXTsgJGs9KGludCkkeFsna2lla2lzJ107ICRzPShmbG9hdCkkeFsnc2F2J107CiAgICAgICAgaWYoJGlkPD0wfHwkazw9MHx8JHM8PTApeyAkZXJyW109JGlkLic6bmV0aW5rYW1pIGR1b21lbnlzJzsgY29udGludWU7IH0KICAgICAgICAkaW5zPSR3cGRiLT5pbnNlcnQoJHRwLGFycmF5KAogICAgICAgICAgJ3Byb2R1Y3RfaWQnPT4kaWQsJ2dhdXRhJz0+JGRhdGEsJ2tpZWtpc19nYXV0YXMnPT4kaywna2lla2lzX2xpa28nPT4kaywKICAgICAgICAgICdzYXZpa2FpbmFfZXVyJz0+JHMsJ3NhdmlrYWluYV9vcmlnJz0+JHMsJ3ZhbGl1dGEnPT4nRVVSJywna3Vyc2FzJz0+MSwKICAgICAgICAgICd0aWVrZWphcyc9PicnLCdpbXBvcnR1b3RhJz0+MCwndGlla2ltYXNfaWQnPT4wLAogICAgICAgICAgJ3Bhc3RhYmEnPT4kcGFzdGFiYSwnc3VrdXJ0YSc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwndXNlcl9pZCc9PjAsJ2F0c2F1a3RhJz0+MCwKICAgICAgICApLGFycmF5KCclZCcsJyVzJywnJWQnLCclZCcsJyVmJywnJWYnLCclcycsJyVmJywnJXMnLCclZCcsJyVkJywnJXMnLCclcycsJyVkJywnJWQnKSk7CiAgICAgICAgaWYoJGlucz09PWZhbHNlKXsgJGVycltdPSRpZC4nOicuJHdwZGItPmxhc3RfZXJyb3I7IH0gZWxzZSB7ICRvaysrOyAkdm50Kz0kazsgJGV1cis9JGsqJHM7IH0KICAgICAgfQogICAgICAkb1snc3VrdXJ0YSddPSRvazsgJG9bJ2tsYWlkb3MnXT0kZXJyOyAkb1sndm50J109JHZudDsgJG9bJ2V1ciddPXJvdW5kKCRldXIsMik7CiAgICAgICRvWydwYXJ0aWp1X3BvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gYCR0cGAiKTsKICAgIH0KICAgIGlmKCRmPT09J0InKXsKICAgICAgLy8gS3J5em1pbmU6IGFyIGRhYmFyIGxpa3V0aXMgPT0gcGFydGlqb3NlCiAgICAgICRzcWw9IlNFTEVDVCBwLklELCBDQVNUKHBtLm1ldGFfdmFsdWUgQVMgU0lHTkVEKSBzdG9jaywKICAgICAgICAgICAgICAgICAgIENPQUxFU0NFKFNVTShDQVNFIFdIRU4gdC5hdHNhdWt0YT0wIE9SIHQuYXRzYXVrdGEgSVMgTlVMTCBUSEVOIHQua2lla2lzX2xpa28gRUxTRSAwIEVORCksMCkgcGFydGlqb3NlCiAgICAgICAgICAgIEZST00geyR3cGRiLT5wb3N0c30gcAogICAgICAgICAgICBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHBtIE9OIHBtLnBvc3RfaWQ9cC5JRCBBTkQgcG0ubWV0YV9rZXk9J19zdG9jaycKICAgICAgICAgICAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBzZCBPTiBzZC5wb3N0X2lkPXAuSUQgQU5EIHNkLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIEFORCBzZC5tZXRhX3ZhbHVlPSdhdicKICAgICAgICAgICAgTEVGVCBKT0lOIGAkdHBgIHQgT04gdC5wcm9kdWN0X2lkPXAuSUQKICAgICAgICAgICAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogICAgICAgICAgICBHUk9VUCBCWSBwLklELCBwbS5tZXRhX3ZhbHVlIjsKICAgICAgJHI9JHdwZGItPmdldF9yZXN1bHRzKCRzcWwsQVJSQVlfQSk7CiAgICAgICRtYXo9MDskZGF1PTA7JHN1dD0wOyRtYXpWbnQ9MDsKICAgICAgZm9yZWFjaCgkciBhcyAkeCl7ICRzPShpbnQpJHhbJ3N0b2NrJ107JHA9KGludCkkeFsncGFydGlqb3NlJ107CiAgICAgICAgaWYoJHM9PT0kcCkkc3V0Kys7IGVsc2VpZigkcz4kcCl7JG1heisrOyRtYXpWbnQrPSRzLSRwO30gZWxzZSAkZGF1Kys7IH0KICAgICAgJG9bJ2tyeXptaW5lJ109YXJyYXkoJ2F2X3ByZWtpdSc9PmNvdW50KCRyKSwnc3V0YW1wYSc9PiRzdXQsJ3N0b2NrX2RhdWdpYXUnPT4kbWF6LCd0cnVrc3RhX3ZudCc9PiRtYXpWbnQsJ3BhcnRpam9zZV9kYXVnaWF1Jz0+JGRhdSk7CiAgICAgICRvWydzMTY4Ml9wYXJ0aWp1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gYCR0cGAgV0hFUkUgcGFzdGFiYSBMSUtFICclUzE2ODIlJyIpOwogICAgICAkb1snczE2ODJfdm50J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIFNVTShraWVraXNfbGlrbykgRlJPTSBgJHRwYCBXSEVSRSBwYXN0YWJhIExJS0UgJyVTMTY4MiUnIik7CiAgICAgICRvWydzMTY4Ml92ZXJ0ZSddPXJvdW5kKChmbG9hdCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIFNVTShraWVraXNfbGlrbypzYXZpa2FpbmFfZXVyKSBGUk9NIGAkdHBgIFdIRVJFIHBhc3RhYmEgTElLRSAnJVMxNjgyJSciKSwyKTsKICAgICAgJG9bJ3BhcnRpanVfdmlzbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIGAkdHBgIik7CiAgICAgIC8vIGtvbmtyZXRpIHByZWtlIGlzIHJ5dG8KICAgICAgJG9bJ3ByZWtlXzE2MTY1J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsa2lla2lzX2dhdXRhcyxraWVraXNfbGlrbyxzYXZpa2FpbmFfZXVyLGdhdXRhLHBhc3RhYmEgRlJPTSBgJHRwYCBXSEVSRSBwcm9kdWN0X2lkPTE2MTY1IixBUlJBWV9BKTsKICAgICAgJG9bJ3B2el8xNzM5NyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLGtpZWtpc19saWtvLHNhdmlrYWluYV9ldXIsZ2F1dGEgRlJPTSBgJHRwYCBXSEVSRSBwcm9kdWN0X2lkPTE3Mzk3IixBUlJBWV9BKTsKICAgICAgJG9bJ3N2ZXRhaW5lJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUod3BfcmVtb3RlX2dldChob21lX3VybCgnLycpLGFycmF5KCd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlKSkpOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-090504';
const GKEY='ps_bl9';
const PHASES=["A", "B"];
const OUT='analize/s1682_a.json';
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
