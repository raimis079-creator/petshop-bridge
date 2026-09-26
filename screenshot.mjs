process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzIxcyByZWFkLW9ubHk6IHJpbmtpbml1IG51b3RyYXVrb3MgKHRodW1iLCBmYWlsYXMsIFVSTCBrb2Rhcywga2F0ZWdvcmlqb3MgcHNsLiBIVE1MKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MjFzJ10pKSByZXR1cm47ICRmPSRfR0VUWydwc19zMTcyMXMnXTsgJHI9Wyd2Jz0+J1MxNzIxcycsJ2ZhemUnPT4kZl07IEBzZXRfdGltZV9saW1pdCgxNzApOyBnbG9iYWwgJHdwZGI7CiAgJHVhPVsndGltZW91dCc9PjIwLCdzc2x2ZXJpZnknPT5mYWxzZSwndXNlci1hZ2VudCc9PidNb3ppbGxhLzUuMCBwcy1zMTcyMScsJ2Nvb2tpZXMnPT5bJ3BzX2pzJz0+JzEnXV07CiAgdHJ5ewogICAgJGNhdHM9WydyaW5raW5pYWknLCdrb25zZXJ2dS1yaW5raW5pYWknLCdrcmFtdGFsdS1yaW5raW5pYWknLCdza2FuZXN0dS1yaW5raW5pYWknXTsKICAgICR1cD13cF91cGxvYWRfZGlyKCk7CiAgICBmb3JlYWNoKCRjYXRzIGFzICRjKXsgJHQ9Z2V0X3Rlcm1fYnkoJ3NsdWcnLCRjLCdwcm9kdWN0X2NhdCcpOyBpZighJHQpeyAkclsna2F0J11bJGNdPSdORVJBJzsgY29udGludWU7IH0KICAgICAgJGlkcz1nZXRfcG9zdHMoWydwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnLCdudW1iZXJwb3N0cyc9PjYwLCdmaWVsZHMnPT4naWRzJywndGF4X3F1ZXJ5Jz0+W1sndGF4b25vbXknPT4ncHJvZHVjdF9jYXQnLCdmaWVsZCc9PidzbHVnJywndGVybXMnPT4kY11dXSk7CiAgICAgICRyb3dzPVtdOyBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHA9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgJHRpZD1nZXRfcG9zdF90aHVtYm5haWxfaWQoJGlkKTsgJGZpbGU9JHRpZD9nZXRfYXR0YWNoZWRfZmlsZSgkdGlkKTonJzsgJHNyYz0kdGlkP3dwX2dldF9hdHRhY2htZW50X2ltYWdlX3NyYygkdGlkLCd3b29jb21tZXJjZV90aHVtYm5haWwnKTpudWxsOyAkbWV0YT0kdGlkP3dwX2dldF9hdHRhY2htZW50X21ldGFkYXRhKCR0aWQpOm51bGw7CiAgICAgICAgJHJvdz1bJ2lkJz0+JGlkLCd0aXBhcyc9PiRwPyRwLT5nZXRfdHlwZSgpOic/JywndGh1bWInPT4oaW50KSR0aWQsJ2ZhaWxhcyc9PiRmaWxlPyhmaWxlX2V4aXN0cygkZmlsZSk/J3lyYSc6J05FUkEgJy5iYXNlbmFtZSgkZmlsZSkpOictJywndGh1bWJfdXJsJz0+JHNyYz8kc3JjWzBdOicnLCd0aHVtYl9mYWlsYXMnPT4nLScsJ2dhbCc9PiRwP2NvdW50KCRwLT5nZXRfZ2FsbGVyeV9pbWFnZV9pZHMoKSk6MCwnbW9kJz0+Z2V0X3Bvc3RfZmllbGQoJ3Bvc3RfbW9kaWZpZWQnLCRpZCldOwogICAgICAgIGlmKCRzcmMpeyAkcmVsPXN0cl9yZXBsYWNlKCR1cFsnYmFzZXVybCddLCcnLCRzcmNbMF0pOyAkcm93Wyd0aHVtYl9mYWlsYXMnXT1maWxlX2V4aXN0cygkdXBbJ2Jhc2VkaXInXS4kcmVsKT8neXJhJzonTkVSQSc7IH0KICAgICAgICBpZigkdGlkJiYhJG1ldGEpICRyb3dbJ21ldGEnXT0nTkVSQSc7CiAgICAgICAgJHJvd3NbXT0kcm93OyB9CiAgICAgICRyWydrYXQnXVskY109Wyd2aXNvJz0+Y291bnQoJGlkcyksJ2JlX3RodW1iJz0+Y291bnQoYXJyYXlfZmlsdGVyKCRyb3dzLGZuKCR4KT0+ISR4Wyd0aHVtYiddKSksJ2ZhaWxvX25lcmEnPT5jb3VudChhcnJheV9maWx0ZXIoJHJvd3MsZm4oJHgpPT5zdHJwb3MoJHhbJ2ZhaWxhcyddLCdORVJBJyk9PT0wKSksJ3RodW1iX2ZhaWxvX25lcmEnPT5jb3VudChhcnJheV9maWx0ZXIoJHJvd3MsZm4oJHgpPT4keFsndGh1bWJfZmFpbGFzJ109PT0nTkVSQScpKSwnZWlsJz0+YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigkcm93cyxmbigkeCk9PiEkeFsndGh1bWInXXx8c3RycG9zKCR4WydmYWlsYXMnXSwnTkVSQScpPT09MHx8JHhbJ3RodW1iX2ZhaWxhcyddPT09J05FUkEnfHxpc3NldCgkeFsnbWV0YSddKSkpXTsKICAgICAgLy8ga2F0ZWdvcmlqb3MgSFRNTAogICAgICAkcnM9d3BfcmVtb3RlX2dldChnZXRfdGVybV9saW5rKCR0KS4nP3BzX25vY2FjaGU9Jy50aW1lKCksJHVhKTsgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHJzKTsKICAgICAgcHJlZ19tYXRjaF9hbGwoJy88ZGl2IGNsYXNzPSJib3gtaW1hZ2UiPi4qPzxpbWdbXj5dKz4vcycsJGgsJG1tKTsgJGltZ3M9JG1tWzBdOyAkcGw9MDsgJG5vc3JjPTA7ICRzcmNzPVtdOwogICAgICBmb3JlYWNoKCRpbWdzIGFzICRpbSl7IGlmKHN0cnBvcygkaW0sJ3BsYWNlaG9sZGVyJykhPT1mYWxzZSkgJHBsKys7IGlmKCFwcmVnX21hdGNoKCcvXHNzcmM9IihbXiJdKykiLycsJGltLCRzKXx8c3RycG9zKCRzWzFdLCdkYXRhOicpPT09MCl7ICRub3NyYysrOyB9IGVsc2UgJHNyY3NbXT0kc1sxXTsgfQogICAgICAkclsnaHRtbCddWyRjXT1bJ2NvZGUnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcnMpLCdib3hfaW1hZ2UnPT5jb3VudCgkaW1ncyksJ3BsYWNlaG9sZGVyJz0+JHBsLCdiZV9zcmMnPT4kbm9zcmMsJ3B2eic9PmFycmF5X3NsaWNlKCRzcmNzLDAsMyksJ3Bpcm1hc19pbWcnPT5pc3NldCgkaW1nc1swXSk/bWJfc3Vic3RyKCRpbWdzWzBdLDAsNDAwKTonJ107CiAgICAgIC8vIGFyIG51b3RyYXVrdSBVUkwgYXRzYWtvCiAgICAgICRrb2RhaT1bXTsgZm9yZWFjaChhcnJheV9zbGljZShhcnJheV91bmlxdWUoJHNyY3MpLDAsNikgYXMgJHUpeyAkeD13cF9yZW1vdGVfaGVhZCgkdSwkdWEpOyAka29kYWlbYmFzZW5hbWUoJHUpXT1pc193cF9lcnJvcigkeCk/J0VSUic6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpOyB9ICRyWydodG1sJ11bJGNdWydpbWdfa29kYWknXT0ka29kYWk7CiAgICB9CiAgICAvLyBNbk0gdGlwbyBwcmVrZXMgdmlzdXI6IGtpZWsgYmUgdGh1bWIKICAgICRyWydtbm0nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELCBwLnBvc3RfdGl0bGUsIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IG0gV0hFUkUgbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXk9J190aHVtYm5haWxfaWQnKSB0aHVtYiBGUk9NIHskd3BkYi0+cG9zdHN9IHAgSk9JTiB7JHdwZGItPnRlcm1fcmVsYXRpb25zaGlwc30gdHIgT04gdHIub2JqZWN0X2lkPXAuSUQgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBKT0lOIHskd3BkYi0+dGVybXN9IHQgT04gdC50ZXJtX2lkPXR0LnRlcm1faWQgV0hFUkUgdHQudGF4b25vbXk9J3Byb2R1Y3RfdHlwZScgQU5EIHQuc2x1ZyBJTiAoJ21peC1hbmQtbWF0Y2gnLCdncm91cGVkJywnYnVuZGxlJykgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEhBVklORyB0aHVtYiBJUyBOVUxMIE9SIHRodW1iPScnIE9SIHRodW1iPScwJyBMSU1JVCAzMCIsQVJSQVlfQSk7CiAgICAvLyBuZXNlbmlhaSBwYWtlaXN0aSBhdHRhY2htZW50YWkgLyBpc3RyaW50aQogICAgJHJbJ2F0dGFjaF90cmludGFfMjRoJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IG0gTEVGVCBKT0lOIHskd3BkYi0+cG9zdHN9IGEgT04gYS5JRD1tLm1ldGFfdmFsdWUgV0hFUkUgbS5tZXRhX2tleT0nX3RodW1ibmFpbF9pZCcgQU5EIGEuSUQgSVMgTlVMTCIpOwogICAgJHJbJ3RodW1iX2JlX2F0dGFjaF9wdnonXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIG0ucG9zdF9pZCBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IG0gSk9JTiB7JHdwZGItPnBvc3RzfSBwIE9OIHAuSUQ9bS5wb3N0X2lkIEFORCBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIExFRlQgSk9JTiB7JHdwZGItPnBvc3RzfSBhIE9OIGEuSUQ9bS5tZXRhX3ZhbHVlIFdIRVJFIG0ubWV0YV9rZXk9J190aHVtYm5haWxfaWQnIEFORCBhLklEIElTIE5VTEwgTElNSVQgMjAiKTsKICAgICRsZj1pbmlfZ2V0KCdlcnJvcl9sb2cnKTsgaWYoJGxmJiZpc19maWxlKCRsZikpeyAkc3o9ZmlsZXNpemUoJGxmKTsgJGgyPWZvcGVuKCRsZiwncicpOyBmc2VlaygkaDIsbWF4KDAsJHN6LTYwMDApKTsgJGxpbmVzPWFycmF5X2ZpbHRlcihleHBsb2RlKCJcbiIsc3RyZWFtX2dldF9jb250ZW50cygkaDIpKSk7ICRyWydsb2dfaW1nJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigkbGluZXMsZm4oJGwpPT5zdHJpcG9zKCRsLCdpbWFnZScpIT09ZmFsc2V8fHN0cmlwb3MoJGwsJ3RodW1iJykhPT1mYWxzZXx8c3RyaXBvcygkbCwnYXR0YWNoJykhPT1mYWxzZSkpOyBmY2xvc2UoJGgyKTsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-162934';
const GKEY='ps_s1721s';
const PHASES=["1"];
const OUT='analize/s1721s.json';
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
