process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjgyIHBhcnRpanUgcGFwaWxkeW1hcyBEUlkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19ibDgnXSk/JF9HRVRbJ3BzX2JsOCddOicnKSE9PSdEJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2ODJEUlknLCd3cCc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSk7CiAgZ2xvYmFsICR3cGRiOyAkdHA9JHdwZGItPnByZWZpeC4ncHNfcGFydGlqb3MnOwogIHRyeXsKICAgIC8vIDEuIFMxNjM3IHByYWRpbmlvIGxpa3VjaW8gZGF0YQogICAgJGV0PSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGdhdXRhLENPVU5UKCopIGssTUlOKHN1a3VydGEpIG51byxNQVgoc3VrdXJ0YSkgaWtpIEZST00gYCR0cGAgV0hFUkUgcGFzdGFiYSBMSUtFICdQcmFkaW5pcyBsaWt1dGlzIFQtMCUnIEdST1VQIEJZIGdhdXRhIE9SREVSIEJZIGsgREVTQyIsQVJSQVlfQSk7CiAgICAkb1snZXRhbG9uYXMnXT0kZXQ7CiAgICAkZGF0YT0kZXQ/JGV0WzBdWydnYXV0YSddOm51bGw7CiAgICAkb1snbmF1ZG9zaXVfZGF0YSddPSRkYXRhOwogICAgaWYoISRkYXRhKXsgJG9bJ1NUT1AnXT0nbmVyYXN0YSBldGFsb25pbsSXIGRhdGEnOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OyB9CiAgICAvLyAyLiBUcnVrc3RhCiAgICAkc3FsPSJTRUxFQ1QgcC5JRCwgQ0FTVChwbS5tZXRhX3ZhbHVlIEFTIFNJR05FRCkgc3RvY2ssCiAgICAgICAgICAgICAgICAgQ09BTEVTQ0UoU1VNKENBU0UgV0hFTiB0LmF0c2F1a3RhPTAgT1IgdC5hdHNhdWt0YSBJUyBOVUxMIFRIRU4gdC5raWVraXNfbGlrbyBFTFNFIDAgRU5EKSwwKSBwYXJ0aWpvc2UKICAgICAgICAgIEZST00geyR3cGRiLT5wb3N0c30gcAogICAgICAgICAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBwbSBPTiBwbS5wb3N0X2lkPXAuSUQgQU5EIHBtLm1ldGFfa2V5PSdfc3RvY2snCiAgICAgICAgICBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHNkIE9OIHNkLnBvc3RfaWQ9cC5JRCBBTkQgc2QubWV0YV9rZXk9J19wc19zYW5kZWxpcycgQU5EIHNkLm1ldGFfdmFsdWU9J2F2JwogICAgICAgICAgTEVGVCBKT0lOIGAkdHBgIHQgT04gdC5wcm9kdWN0X2lkPXAuSUQKICAgICAgICAgIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcKICAgICAgICAgIEdST1VQIEJZIHAuSUQsIHBtLm1ldGFfdmFsdWUgSEFWSU5HIHN0b2NrID4gcGFydGlqb3NlIjsKICAgICRyPSR3cGRiLT5nZXRfcmVzdWx0cygkc3FsLEFSUkFZX0EpOwogICAgJHBsYW49YXJyYXkoKTsgJHN1bWFWbnQ9MDsgJHN1bWFFdXI9MDsgJHNsdD1hcnJheSgndmYnPT4wLCd6Yic9PjAsJ2tvcnRlbGUnPT4wKTsgJGtsYWlkb3M9YXJyYXkoKTsKICAgIGZvcmVhY2goJHIgYXMgJHgpewogICAgICAkaWQ9KGludCkkeFsnSUQnXTsgJHRyPShpbnQpJHhbJ3N0b2NrJ10tKGludCkkeFsncGFydGlqb3NlJ107CiAgICAgIGlmKCR0cjw9MCkgY29udGludWU7CiAgICAgICR2Zj1nZXRfcG9zdF9tZXRhKCRpZCwnX3ZmX2Nvc3QnLHRydWUpOyAkdmY9KCR2ZiE9PScnJiYoZmxvYXQpJHZmPjApPyhmbG9hdCkkdmY6bnVsbDsKICAgICAgJHpiPWdldF9wb3N0X21ldGEoJGlkLCdfemJfY29zdCcsdHJ1ZSk7ICR6Yj0oJHpiIT09JycmJihmbG9hdCkkemI+MCk/KGZsb2F0KSR6YjpudWxsOwogICAgICAkY3A9Z2V0X3Bvc3RfbWV0YSgkaWQsJ19jb3N0X3ByaWNlJyx0cnVlKTsgJGNwPSgkY3AhPT0nJyYmKGZsb2F0KSRjcD4wKT8oZmxvYXQpJGNwOm51bGw7CiAgICAgIGlmKCR2ZiE9PW51bGwpeyAkc2F2PSR2ZjsgJGt1cj0ndmYnOyB9IGVsc2VpZigkemIhPT1udWxsKXsgJHNhdj0kemI7ICRrdXI9J3piJzsgfSBlbHNlaWYoJGNwIT09bnVsbCl7ICRzYXY9JGNwOyAka3VyPSdrb3J0ZWxlJzsgfQogICAgICBlbHNlIHsgJGtsYWlkb3NbXT0kaWQ7IGNvbnRpbnVlOyB9CiAgICAgICRzbHRbJGt1cl0rKzsgJHN1bWFWbnQrPSR0cjsgJHN1bWFFdXIrPSR0ciokc2F2OwogICAgICAkcGxhbltdPWFycmF5KCdpZCc9PiRpZCwna2lla2lzJz0+JHRyLCdzYXYnPT5yb3VuZCgkc2F2LDQpLCdpcyc9PiRrdXIpOwogICAgfQogICAgJG9bJ3BsYW5hc19zayddPWNvdW50KCRwbGFuKTsKICAgICRvWydzdW1hX3ZudCddPSRzdW1hVm50OwogICAgJG9bJ3N1bWFfZXVyJ109cm91bmQoJHN1bWFFdXIsMik7CiAgICAkb1snc2FsdGluaWFpJ109JHNsdDsKICAgICRvWydiZV9zYXZpa2Fpbm9zJ109JGtsYWlkb3M7CiAgICB1c29ydCgkcGxhbixmdW5jdGlvbigkYSwkYil7cmV0dXJuICRiWydraWVraXMnXS0kYVsna2lla2lzJ107fSk7CiAgICAkb1sndG9wMTAnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpeyAkeFsncGF2J109c3Vic3RyKGh0bWxfZW50aXR5X2RlY29kZShnZXRfdGhlX3RpdGxlKCR4WydpZCddKSksMCwzOCk7IHJldHVybiAkeDsgfSxhcnJheV9zbGljZSgkcGxhbiwwLDEwKSk7CiAgICAkb1sncGFzdGFiYV9idXMnXT0nUHJhZGluaXMgbGlrdXRpcyBULTAgKHBhcGlsZHltYXMsIFMxNjgyKSc7CiAgICAvLyBzYXJnYWkKICAgICRvWydzYXJnYWknXT1hcnJheSgKICAgICAgJ3Rpa19hdic9PnRydWUsJ3Rpa19wdWJsaXNoJz0+dHJ1ZSwKICAgICAgJ2phdV95cmFfcGFwaWxkeW11Jz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gYCR0cGAgV0hFUkUgcGFzdGFiYSBMSUtFICclUzE2ODIlJyIpLAogICAgICAncGFydGlqdV9wcmllcyc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIGAkdHBgIiksCiAgICApOwogICAgdXBkYXRlX29wdGlvbigncHNfczE2ODJfcGxhbmFzJywkcGxhbixmYWxzZSk7CiAgICAkb1sncGxhbmFzX2lzc2F1Z290YXMnXT1jb3VudCgkcGxhbik7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-090309';
const GKEY='ps_bl8';
const PHASES=["D"];
const OUT='analize/s1682_d.json';
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
