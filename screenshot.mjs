process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjY0IHNyYXV0YXMgaXIgcGlsdHV2YXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19iazQnXSk/JF9HRVRbJ3BzX2JrNCddOicnKSE9PSdGJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2NjRGJywnd3AnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpOwogIGdsb2JhbCAkd3BkYjsKICAkcD0kd3BkYi0+cHJlZml4OwogIHRyeXsKICAgIC8vIEtyZXDFoWVsaWFpCiAgICAkYz0kcC4ncHNfY2FydHMnOwogICAgaWYoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyRjJyIpKXsKICAgICAgJG9bJ2NhcnRzX3N0dWxwZWxpYWknXT0kd3BkYi0+Z2V0X2NvbCgiREVTQyAkYyIsMCk7CiAgICAgICRvWydjYXJ0c192aXNvJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRjIik7CiAgICAgICRvWydjYXJ0c19wYXNrdXRpbmlhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSAkYyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDYiLEFSUkFZX0EpOwogICAgfQogICAgLy8gV0Mgc2VzaWpvcyDigJQga2llayBzdSBwcmVrxJdtaXMKICAgICRzPSRwLid3b29jb21tZXJjZV9zZXNzaW9ucyc7CiAgICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzZXNzaW9uX2tleSxzZXNzaW9uX3ZhbHVlLHNlc3Npb25fZXhwaXJ5IEZST00gJHMgT1JERVIgQlkgc2Vzc2lvbl9leHBpcnkgREVTQyBMSU1JVCA2MCIsQVJSQVlfQSk7CiAgICAkc3VQcmVrPTA7ICR0dXN0aT0wOwogICAgZm9yZWFjaCgkcm93cyBhcyAkcil7ICR2PUBtYXliZV91bnNlcmlhbGl6ZSgkclsnc2Vzc2lvbl92YWx1ZSddKTsgJGhhcz1mYWxzZTsKICAgICAgaWYoaXNfYXJyYXkoJHYpICYmIGlzc2V0KCR2WydjYXJ0J10pKXsgJGNjPUBtYXliZV91bnNlcmlhbGl6ZSgkdlsnY2FydCddKTsgaWYoaXNfc3RyaW5nKCRjYykpICRjYz1AbWF5YmVfdW5zZXJpYWxpemUoJGNjKTsgaWYoaXNfYXJyYXkoJGNjKSYmY291bnQoJGNjKSkgJGhhcz10cnVlOyB9CiAgICAgIGlmKCRoYXMpICRzdVByZWsrKzsgZWxzZSAkdHVzdGkrKzsgfQogICAgJG9bJ3Nlc2lqb3NfNjAnXT1hcnJheSgnc3VfcHJla2VtaXMnPT4kc3VQcmVrLCd0dXNjaW9zJz0+JHR1c3RpLAogICAgICAnbmF1amF1c2lhX2JhaWdzaXMnPT4kcm93cz9kYXRlKCdtLWQgSDppJywoaW50KSRyb3dzWzBdWydzZXNzaW9uX2V4cGlyeSddKTpudWxsKTsKICAgICRvWydzZXNpam9zX3Blcl92YWwnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHMgV0hFUkUgc2Vzc2lvbl9leHBpcnkgPiAiLih0aW1lKCkrNDcqMzYwMCkpOwogICAgJG9bJ3Nlc2lqb3NfcGVyXzZ2YWwnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHMgV0hFUkUgc2Vzc2lvbl9leHBpcnkgPiAiLih0aW1lKCkrNDIqMzYwMCkpOwogICAgLy8gQnJvd3NlIGxvZyAvIGV2ZW50IGxvZwogICAgZm9yZWFjaChhcnJheSgncHNfYnJvd3NlX2xvZycsJ3BzX2V2ZW50X2xvZycsJ3BzX2l2eWtpYWknKSBhcyAkdG4peyAkdD0kcC4kdG47CiAgICAgIGlmKCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckdCciKSl7ICRjb2w9JHdwZGItPmdldF9jb2woIkRFU0MgJHQiLDApOwogICAgICAgICRkY29sPW51bGw7IGZvcmVhY2goYXJyYXkoJ2xhaWthcycsJ2NyZWF0ZWRfYXQnLCd0cycsJ2RhdGEnLCdzdWt1cnRhJykgYXMgJGNhbmQpIGlmKGluX2FycmF5KCRjYW5kLCRjb2wpKXskZGNvbD0kY2FuZDticmVhazt9CiAgICAgICAgJG9bJHRuXT1hcnJheSgnc3R1bHAnPT4kY29sLCd2aXNvJz0+JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0IikpOwogICAgICAgIGlmKCRkY29sKSAkb1skdG5dWydzaWFuZGllbiddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCBXSEVSRSAkZGNvbD4nMjAyNi0wOS0wOSAwMDowMDowMCciKTsKICAgICAgfSB9CiAgICAvLyBBcGxlaXN0aSBrcmVwxaFlbGlhaSAvIGR1bm5pbmcKICAgICRvWydjYXJ0c19zaWFuZGllbiddPWlzc2V0KCRvWydjYXJ0c19zdHVscGVsaWFpJ10pJiZpbl9hcnJheSgndXBkYXRlZF9hdCcsJG9bJ2NhcnRzX3N0dWxwZWxpYWknXSk/JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRjIFdIRVJFIHVwZGF0ZWRfYXQ+JzIwMjYtMDktMDkgMDA6MDA6MDAnIik6bnVsbDsKICAgIC8vIEdBNCBzZXJ2ZXJpbyBzaXVudGltYWkKICAgIGZvcmVhY2goJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsTEVGVChvcHRpb25fdmFsdWUsMTYwKSB2IEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdwc19nYTQlJyBPUiBvcHRpb25fbmFtZSBMSUtFICdwc19rYW5hbGFpJScgTElNSVQgOCIsQVJSQVlfQSkgYXMgJHIpICRvWydnYTQnXVskclsnb3B0aW9uX25hbWUnXV09JHJbJ3YnXTsKICAgIC8vIEtpZWsgcHJla2l1IHR1cmkgbGlrdXRpIC8gYXIgcGFyZHVvdHV2ZSByb2RvIHByZWtlcwogICAgJG9bJ2luc3RvY2snXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBtZXRhX2tleT0nX3N0b2NrX3N0YXR1cycgQU5EIG1ldGFfdmFsdWU9J2luc3RvY2snIik7CiAgICAkb1snb3V0b2ZzdG9jayddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIG1ldGFfa2V5PSdfc3RvY2tfc3RhdHVzJyBBTkQgbWV0YV92YWx1ZT0nb3V0b2ZzdG9jayciKTsKICAgIC8vIFBhaWVza29zCiAgICAkb1sncGFzdGFydW9qdV9tZXR1X3ByaXNpanVuZ2UnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT51c2VybWV0YX0gV0hFUkUgbWV0YV9rZXk9J3Nlc3Npb25fdG9rZW5zJyIpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-061457';
const GKEY='ps_bk4';
const PHASES=["F"];
const OUT='analize/s1664_f.json';
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
