process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQwaiByZWxhdW5jaCB0ZWNobmlrYSByZWNvbjogRE5TICsgYmF6ZXMgc3V2ZXN0aW5lcywgQkUgUElJICgxIHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzQwaiddKSkgcmV0dXJuOyAkZj0kX0dFVFsncHNfczE3NDBqJ107IEBzZXRfdGltZV9saW1pdCgxNTApOyBnbG9iYWwgJHdwZGI7ICRyPVsndic9PidTMTc0MGonLCdmYXplJz0+JGZdOwogIHRyeXsKICBpZigkZj09PScxJyl7CiAgICAkdHh0PWZ1bmN0aW9uKCRoKXsgJG89W107ICRycz1AZG5zX2dldF9yZWNvcmQoJGgsRE5TX1RYVCk7IGZvcmVhY2goKGFycmF5KSRycyBhcyAkeCl7ICRvW109aXNzZXQoJHhbJ3R4dCddKT8keFsndHh0J106aW1wbG9kZSgnJywoYXJyYXkpKCR4WydlbnRyaWVzJ10/P1tdKSk7IH0gcmV0dXJuICRvOyB9OwogICAgJHJbJ2RucyddWydzcGZfcm9vdCddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoJHR4dCgncGV0c2hvcC5sdCcpLGZ1bmN0aW9uKCRzKXtyZXR1cm4gc3RyaXBvcygkcywnc3BmJykhPT1mYWxzZXx8c3RyaXBvcygkcywndmVyaWZpY2F0aW9uJykhPT1mYWxzZXx8c3RyaXBvcygkcywnZ29vZ2xlLXNpdGUnKSE9PWZhbHNlO30pKTsKICAgICRyWydkbnMnXVsnZG1hcmMnXT0kdHh0KCdfZG1hcmMucGV0c2hvcC5sdCcpOwogICAgJHJbJ2RucyddWydteCddPWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuICR4WydwcmknXS4nICcuJHhbJ3RhcmdldCddO30sKGFycmF5KUBkbnNfZ2V0X3JlY29yZCgncGV0c2hvcC5sdCcsRE5TX01YKSk7CiAgICBmb3JlYWNoKFsnZGVmYXVsdCcsJ3NlbmRlcicsJ3MxJywnczInLCdrMScsJ2syJywnazMnLCdnb29nbGUnLCdtYWlsJywnZGtpbScsJ3NtdHAnLCdtbCcsJ21sc2VuZCcsJ21sc2VuZDInLCdzaWInLCdicmV2bycsJ21hbmRyaWxsJywnbXh2YXVsdCcsJ3gnLCdzZWxlY3RvcjEnLCdzZWxlY3RvcjInLCdob3N0aW5nZXInLCdka2ltMSddIGFzICRzKXsgJGg9JHMuJy5fZG9tYWlua2V5LnBldHNob3AubHQnOyAkdD0kdHh0KCRoKTsgJGM9QGRuc19nZXRfcmVjb3JkKCRoLEROU19DTkFNRSk7IGlmKCR0fHwkYykgJHJbJ2RucyddWydka2ltJ11bJHNdPVsndHh0Jz0+YXJyYXlfbWFwKGZ1bmN0aW9uKCR2KXtyZXR1cm4gbWJfc3Vic3RyKCR2LDAsNjApLifigKYnO30sJHQpLCdjbmFtZSc9PmFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuICR4Wyd0YXJnZXQnXTt9LChhcnJheSkkYyldOyB9CiAgICBmb3JlYWNoKFsnbmV3cy5wZXRzaG9wLmx0JywnbWFpbC5wZXRzaG9wLmx0JywnZW1haWwucGV0c2hvcC5sdCddIGFzICRoKXsgJGE9QGRuc19nZXRfcmVjb3JkKCRoLEROU19BK0ROU19DTkFNRSk7ICRyWydkbnMnXVsnc3ViJ11bJGhdPWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuICR4Wyd0eXBlJ10uJyAnLigkeFsnaXAnXT8/JHhbJ3RhcmdldCddPz8nJyk7fSwoYXJyYXkpJGEpOyB9CiAgICAkaXA9Z2V0aG9zdGJ5bmFtZShnZXRob3N0bmFtZSgpKTsgJHJbJ2RucyddWydzZXJ2ZXJpb19wdHInXT1bJGlwLEBnZXRob3N0YnlhZGRyKCRpcCldOwogICAgLy8ga2FpcCBzaXVuY2lhbWkgV1AgbGFpc2thaQogICAgJHJbJ21haWwnXT1bJ3BocG1haWxlcl9ob29rcyc9Pmhhc19hY3Rpb24oJ3BocG1haWxlcl9pbml0Jyk/dHJ1ZTpmYWxzZSwnd3BfbWFpbF9zbXRwJz0+ZGVmaW5lZCgnV1BNU19PTicpfHxjbGFzc19leGlzdHMoJ1dQTWFpbFNNVFBcXENvcmUnKSwnYWt0eXZ1c19wbHVnaW5haSc9PmFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoKGFycmF5KWdldF9vcHRpb24oJ2FjdGl2ZV9wbHVnaW5zJyksZnVuY3Rpb24oJHApe3JldHVybiBwcmVnX21hdGNoKCcvbWFpbHxzbXRwfHNlbmRlcnxicmV2b3xtYWlsZXIvaScsJHApO30pKV07CiAgICAvLyBiYXplOiB0aWsgc3R1bHBlbGlhaSBpciBzdXZlc3RpbmVzCiAgICBmb3JlYWNoKFsncHNfcmVsYXVuY2hfa29udGFrdGFpJywncHNfaXN0X3V6c2FreW1haSddIGFzICR0KXsgJFQ9JHdwZGItPnByZWZpeC4kdDsgaWYoISR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckVCciKSl7ICRyWydkYiddWyR0XT0nbmVyYSc7IGNvbnRpbnVlOyB9CiAgICAgICRjb2xzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0hPVyBDT0xVTU5TIEZST00gJFQiLEFSUkFZX0EpOyAkclsnZGInXVskdF1bJ24nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkVCIpOwogICAgICAkclsnZGInXVskdF1bJ3N0dWxwJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCRjKXtyZXR1cm4gJGNbJ0ZpZWxkJ10uJzonLiRjWydUeXBlJ107fSwkY29scyk7CiAgICAgIGZvcmVhY2goJGNvbHMgYXMgJGMpeyAkZm49JGNbJ0ZpZWxkJ107IGlmKHByZWdfbWF0Y2goJy9tYWlsfHZhcmR8cGF2YXJkfHRlbHxhZHJlc3xuYW1lfHBob25lfGlwfHRva2VufGhhc2gvaScsJGZuKSkgY29udGludWU7ICRkPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBgJGZuYCkgRlJPTSAkVCIpOyBpZigkZD4wICYmICRkPD0xMikgJHJbJ2RiJ11bJHRdWydwYXNpc2snXVskZm5dPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGAkZm5gIHYsIENPVU5UKCopIG4gRlJPTSAkVCBHUk9VUCBCWSBgJGZuYCBPUkRFUiBCWSBuIERFU0MiLEFSUkFZX0EpOyBlbHNlaWYocHJlZ19tYXRjaCgnL2RhdGF8ZGF0ZXxsYWlrfF9hdCR8ZGllbmEvaScsJGZuKSkgJHJbJ2RiJ11bJHRdWydpbnRlcnZhbGFzJ11bJGZuXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIE1JTihgJGZuYCkgbW4sIE1BWChgJGZuYCkgbXggRlJPTSAkVCIsQVJSQVlfQSk7IH0KICAgIH0KICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-184156';
const GKEY='ps_s1740j';
const PHASES=["1"];
const OUT='analize/s1740j.json';
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
