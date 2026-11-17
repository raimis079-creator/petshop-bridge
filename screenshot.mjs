process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODc2ZCBkaWRlbGl1IG1haXN1IGthaW5vcyBpciBwaXJrZWphaSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NzZkJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxNzApOyBAaW5pX3NldCgnbWVtb3J5X2xpbWl0JywnNzY4TScpOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTg3NmQnXTsgJFQwPW1pY3JvdGltZSh0cnVlKTsKICB0cnl7CiAgJEw9W107IAogIGZvcmVhY2goWydpc3QnPT5bInskUH1wc19pc3RfZmFrdF9laWx1dGVzIiwieyRQfXBzX2lzdF9mYWt0X3V6c2FreW1haSJdLCduZXcnPT5bInskUH1wc19mYWt0X2VpbHV0ZXMiLCJ7JFB9cHNfZmFrdF91enNha3ltYWkiXV0gYXMgJHNyYz0+JHR0KXsKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGUuYXBtb2tldGFfYXQgZCwgZS5raWVraXMgcSwgZS5rYWluYV92bnRfY3QgcHUsIGUuc3ZvcmlzX2cgcywgZS5wYXZhZGluaW1hc190dW9fbWV0dSBwLCBlLmthdGVnb3JpanVfa2VsaWFzIGMsIGUuYnJlbmRhc19zbHVnIGIsIGUuc2t1LCBlLnByZWtlX2lkLCB1LmtsaWVudGFzX2VtYWlsX2hhc2ggaCwgdS5rYW5hbGFzX3Bhc2t1dGluaXMga2FuIEZST00geyR0dFswXX0gZSBMRUZUIEpPSU4geyR0dFsxXX0gdSBPTiB1LnV6c2FreW1hc19pZD1lLnV6c2FreW1hc19pZCBXSEVSRSBlLmFwbW9rZXRhX2F0Pj0nMjAyNS0wMS0wMScgQU5EIENPQUxFU0NFKGUudGVzdGluaXMsMCk9MCIsQVJSQVlfQSk7CiAgICBmb3JlYWNoKCRyb3dzIGFzICR4KXsgaWYobWJfc3RyaXBvcygoc3RyaW5nKSR4WydjJ10sJ3NhdXMnKT09PWZhbHNlKSBjb250aW51ZTsgJHBrPTA7IGlmKHByZWdfbWF0Y2goJy8oXGQrKD86Wy4sXVxkKyk/KVxzKmtnL2l1Jywoc3RyaW5nKSR4WydwJ10sJG1tKSkgJHBrPShmbG9hdClzdHJfcmVwbGFjZSgnLCcsJy4nLCRtbVsxXSk7IGlmKHByZWdfbWF0Y2goJy9eXHMqKFxkKylccyp2bnQvdScsKHN0cmluZykkeFsncCddKSkgY29udGludWU7ICR3PSRwaz86KChmbG9hdCkkeFsncyddKS8xMDAwOyBpZigkdzw3KSBjb250aW51ZTsgJHhbJ3cnXT0kdzsgJHhbJ3NyYyddPSRzcmM7ICRMW109JHg7IH0KICB9CiAgJHJbJ24nXT1jb3VudCgkTCk7CiAgLy8gdG9wIHByb2R1a3RhaSBwYWdhbCAyMDI1IGtpZWvEryAocmFrdGFzOiBza3UpCiAgJGFnZz1bXTsgZm9yZWFjaCgkTCBhcyAkeCl7ICRrPSR4Wydza3UnXT86JHhbJ3AnXTsgJHk9c3Vic3RyKCR4WydkJ10sMCw3KTsgaWYoIWlzc2V0KCRhZ2dbJGtdKSkgJGFnZ1ska109WydwJz0+bWJfc3Vic3RyKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJywkeFsncCddKSwwLDYwKSwnYic9PiR4WydiJ10sJ24yNSc9PjAsJ20nPT5bXV07IGlmKCR5PCcyMDI2LTAxJykgJGFnZ1ska11bJ24yNSddKz0keFsncSddOyAkYWdnWyRrXVsnbSddWyR5XVsncSddPSgkYWdnWyRrXVsnbSddWyR5XVsncSddPz8wKSskeFsncSddOyAkYWdnWyRrXVsnbSddWyR5XVsncHMnXVtdPSR4WydwdSddLzEwMDsgfQogIHVhc29ydCgkYWdnLGZuKCRhLCRiKT0+JGJbJ24yNSddPD0+JGFbJ24yNSddKTsgJGFnZz1hcnJheV9zbGljZSgkYWdnLDAsMTgsdHJ1ZSk7CiAgZm9yZWFjaCgkYWdnIGFzICYkYSl7IGZvcmVhY2goJGFbJ20nXSBhcyAmJG1tKXsgJG1tWydrYWluYSddPXJvdW5kKGFycmF5X3N1bSgkbW1bJ3BzJ10pL2NvdW50KCRtbVsncHMnXSksMik7IHVuc2V0KCRtbVsncHMnXSk7IH0ga3NvcnQoJGFbJ20nXSk7IH0gdW5zZXQoJGEsJG1tKTsKICAkclsndG9wJ109JGFnZzsKICAvLyBwaXJrxJdqYWk6IEpvc2VyYSAvIHZpc2kgZGlkZWxpIG1hacWhYWkKICAkYnV5PVtdOyBmb3JlYWNoKCRMIGFzICR4KXsgaWYoISR4WydoJ10pIGNvbnRpbnVlOyAkcGVyPSR4WydkJ108JzIwMjUtMDctMDEnPydBJzooJHhbJ2QnXTwnMjAyNi0wMS0wMSc/J0InOigkeFsnZCddPCcyMDI2LTA3LTAxJz8nQyc6J0QnKSk7ICRidXlbJHhbJ2gnXV1bJHBlcl1bJHhbJ2InXV09MTsgJGJ1eVskeFsnaCddXVsnZmlyc3QnXT1taW4oJGJ1eVskeFsnaCddXVsnZmlyc3QnXT8/JzknLCR4WydkJ10pOyB9CiAgLy8ga2llayBwaXJrdXNpxbMgQyAoMjAyNi0wMS4uMDYpIHBpcmtvIEQgKDIwMjYtMDcuLjExKQogICRjQz0wOyRjQ0Q9MDskakM9MDskakNEPTA7JGpDRGo9MDsgZm9yZWFjaCgkYnV5IGFzICRoPT4kYSl7IGlmKGlzc2V0KCRhWydDJ10pKXsgJGNDKys7IGlmKGlzc2V0KCRhWydEJ10pKSAkY0NEKys7IGlmKGlzc2V0KCRhWydDJ11bJ2pvc2VyYSddKSl7ICRqQysrOyBpZihpc3NldCgkYVsnRCddKSkgJGpDRCsrOyBpZihpc3NldCgkYVsnRCddWydqb3NlcmEnXSkpICRqQ0RqKys7IH0gfSB9CiAgJHJbJ3BpcmtlamFpJ109WydDX3Zpc2knPT4kY0MsJ0NfaXJfRCc9PiRjQ0QsJ0Nfam9zZXJhJz0+JGpDLCdDX2pvc2VyYV9waXJrb19EX2RpZGVsxK8nPT4kakNELCdDX2pvc2VyYV9waXJrb19EX2pvc2VyYSc9PiRqQ0RqXTsKICAvLyBhciBqaWUgcGlya28gYmV0IGvEhSBuYXVqb2plIHN2ZXRhaW7El2plIHBvIDA5LTA5CiAgJGhzPVtdOyBmb3JlYWNoKCRidXkgYXMgJGg9PiRhKSBpZihpc3NldCgkYVsnQyddKSAmJiAhaXNzZXQoJGFbJ0QnXSkpICRoc1tdPSRoOwogIGlmKCRocyl7ICRwaD1pbXBsb2RlKCcsJyxhcnJheV9maWxsKDAsY291bnQoJGhzKSwnJXMnKSk7ICRyWydDX2JlX0RfcGlya29fYmV0X2thX25ldyddPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVChESVNUSU5DVCBrbGllbnRhc19lbWFpbF9oYXNoKSBGUk9NIHskUH1wc19mYWt0X3V6c2FreW1haSBXSEVSRSBrbGllbnRhc19lbWFpbF9oYXNoIElOICgkcGgpIEFORCB0ZXN0aW5pcz0wIiwuLi4kaHMpKTsgJHJbJ0NfYmVfRF9uJ109Y291bnQoJGhzKTsgfQogIC8vIG5hdWppIHZzIGdyaXrEmSBkaWRlbGl1IG1haXN1IHBpcmtlamFpIHBlciBtZW5lc2kKICAkbm09W107IGZvcmVhY2goJEwgYXMgJHgpeyBpZighJHhbJ2gnXSkgY29udGludWU7ICR5PXN1YnN0cigkeFsnZCddLDAsNyk7ICRpc25ldz1zdWJzdHIoJGJ1eVskeFsnaCddXVsnZmlyc3QnXSwwLDcpPT09JHk7ICRubVskeV1bJGlzbmV3PyduYXVqaSc6J3NlbmknXVskeFsnaCddXT0xOyB9CiAgZm9yZWFjaCgkbm0gYXMgJiRhKXsgZm9yZWFjaCgkYSBhcyAmJGIpICRiPWNvdW50KCRiKTsgfSB1bnNldCgkYSwkYik7IGtzb3J0KCRubSk7ICRyWydwaXJrZWphaV9tZW4nXT0kbm07CiAgLy8ga2FuYWxhcyBwYWdhbCBtZW5lc2kgKGRpZGVsaSBtYWlzYWkpCiAgJGttPVtdOyBmb3JlYWNoKCRMIGFzICR4KXsgJHk9c3Vic3RyKCR4WydkJ10sMCw3KTsgaWYoJHk8JzIwMjUtMDknKSBjb250aW51ZTsgJGttWyR5XVskeFsna2FuJ10/OictJ109KCRrbVskeV1bJHhbJ2thbiddPzonLSddPz8wKSskeFsncSddOyB9IGtzb3J0KCRrbSk7ICRyWydrYW5hbF9tZW4nXT0ka207CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydFUlInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogICRyWyd0cnVrbWVfcyddPXJvdW5kKG1pY3JvdGltZSh0cnVlKS0kVDAsMSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7IH0pOwo=';
const VER='dep-084234';
const GKEY='ps_s1876d';
const PHASES=["1"];
const OUT='analize/s1876_d.json';
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
