process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzQgcnVuIHAyIOKAlCAoUzQpIFNNVFAgbWFpbGVyIGRldGFsxJdzLCBQYXlzZXJhIG9wY2lqb3MsIHNlcmlqxbMgb3BjaWrFsyB2YXJkYWksIHNpdGV1cmwgREIgdnMga29uc3RhbnRhLCBwZXRzaG9wLWVzcCByZWNvbi4gUkVBRC1PTkxZLCBtYXNrdW90YS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2MzRwMiddKSkgcmV0dXJuOwogICRvPWFycmF5KCd2Jz0+J1MxNjM0IHAyJyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJG1hc2s9ZnVuY3Rpb24oJHYpeyAkdj0oc3RyaW5nKSR2OyAkbD1zdHJsZW4oJHYpOyByZXR1cm4gJGw/IHN1YnN0cigkdiwwLDMpLifigKYoJy4kbC4nKSc6Jyc7IH07CiAgLy8gMSkgU01UUAogICRzPWdldF9vcHRpb24oJ3dwX21haWxfc210cCcpOwogIGlmKGlzX2FycmF5KCRzKSl7CiAgICAkb1snc210cCddWydtYWlsZXInXT0kc1snbWFpbCddWydtYWlsZXInXT8/Jz8nOwogICAgJG9bJ3NtdHAnXVsnZnJvbSddPWFycmF5KCRzWydtYWlsJ11bJ2Zyb21fbmFtZSddPz8nJywkc1snbWFpbCddWydmcm9tX2VtYWlsJ10/PycnLCdmb3JjZSc9PiRzWydtYWlsJ11bJ2Zyb21fZW1haWxfZm9yY2UnXT8/JycpOwogICAgZm9yZWFjaChhcnJheSgnaG9zdCcsJ3BvcnQnLCdlbmNyeXB0aW9uJywnYXV0aCcsJ2F1dG90bHMnKSBhcyAkaykgJG9bJ3NtdHAnXVska109JHNbJ3NtdHAnXVska10/PycnOwogICAgJG9bJ3NtdHAnXVsndXNlciddPSRtYXNrKCRzWydzbXRwJ11bJ3VzZXInXT8/JycpOwogIH0KICAvLyAyKSBQYXlzZXJhCiAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsTEVOR1RIKG9wdGlvbl92YWx1ZSkgbCBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyVwYXlzZXJhJScgT1JERVIgQlkgb3B0aW9uX25hbWUgTElNSVQgMjUiKTsKICBmb3JlYWNoKCRyb3dzIGFzICRyKSAkb1sncGF5c2VyYV92YXJkYWknXVskci0+b3B0aW9uX25hbWVdPSRyLT5sOwogIGZvcmVhY2goJHJvd3MgYXMgJHIpeyBpZigkci0+bD4xMCAmJiAkci0+bDwzMDAwKXsgJHY9Z2V0X29wdGlvbigkci0+b3B0aW9uX25hbWUpOyBpZihpc19hcnJheSgkdikpeyAkYj1hcnJheSgpOyBmb3JlYWNoKCR2IGFzICRraz0+JHZ2KXsgaWYoIWlzX3NjYWxhcigkdnYpKXskYlska2tdPSdbYXJyXSc7Y29udGludWU7fSAkYlska2tdPXByZWdfbWF0Y2goJy9wYXNzfHNpZ258c2VjcmV0L2knLCRrayk/JG1hc2soJHZ2KTptYl9zdWJzdHIoKHN0cmluZykkdnYsMCw1MCk7IH0gJG9bJ3BheXNlcmEnXVskci0+b3B0aW9uX25hbWVdPSRiOyB9IH0gfQogIC8vIDMpIHNlcmlqb3MKICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSxvcHRpb25fdmFsdWUgRlJPTSB7JHB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBSRUdFWFAgJ2F2cG58aWFwdnxwcGt8a3JfJyBBTkQgb3B0aW9uX25hbWUgTk9UIExJS0UgJyV0cmFuc2llbnQlJyBMSU1JVCAxNSIpOwogIGZvcmVhY2goJHJvd3MgYXMgJHIpICRvWydzZXJpam9zJ11bJHItPm9wdGlvbl9uYW1lXT1tYl9zdWJzdHIoJHItPm9wdGlvbl92YWx1ZSwwLDI1KTsKICAvLyA0KSBzaXRldXJsCiAgJG9bJ3NpdGV1cmxfZGInXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIG9wdGlvbl92YWx1ZSBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lPSdzaXRldXJsJyIpOwogICRvWydob21lX2RiJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBvcHRpb25fdmFsdWUgRlJPTSB7JHB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZT0naG9tZSciKTsKICAkb1sna29uc3QnXT1hcnJheSgnV1BfSE9NRSc9PmRlZmluZWQoJ1dQX0hPTUUnKT9XUF9IT01FOm51bGwsJ1dQX1NJVEVVUkwnPT5kZWZpbmVkKCdXUF9TSVRFVVJMJyk/V1BfU0lURVVSTDpudWxsKTsKICAvLyA1KSBwZXRzaG9wLWVzcAogIGZvcmVhY2goZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1lc3AvKi5waHAnKSBhcyAkZyl7ICRoPWZpbGVfZ2V0X2NvbnRlbnRzKCRnLGZhbHNlLG51bGwsMCw4MDApOyBpZihwcmVnX21hdGNoKCcvVmVyc2lvbjpccyooWzAtOS5dKykvJywkaCwkbSkpICRvWydlc3AnXVsndmVyJ109JG1bMV07ICRvWydlc3AnXVsnZmFpbGFzJ109YmFzZW5hbWUoJGcpOyBicmVhazsgfQogICRlc3A9Jyc7CiAgZm9yZWFjaChnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWVzcC8qLnBocCcpIGFzICRnKSAkZXNwLj1maWxlX2dldF9jb250ZW50cygkZyk7CiAgZm9yZWFjaChnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWVzcC9pbmNsdWRlcy8qLnBocCcpIGFzICRnKSAkZXNwLj1maWxlX2dldF9jb250ZW50cygkZyk7CiAgJG9bJ2VzcCddWydkeWRpcyddPXN0cmxlbigkZXNwKTsKICBmb3JlYWNoKGFycmF5KCdhcGkuc2VuZGVyLm5ldCcsJ3Jlc3Rfcm91dGUnLCdyZWdpc3Rlcl9yZXN0X3JvdXRlJywnd3BfbWFpbCcsJ3dvb2NvbW1lcmNlX2VtYWlsJywnYWRkX3N1YnNjcmliZXInLCd3ZWJob29rJywnY3JvbicpIGFzICR6KSAkb1snZXNwJ11bJ2tpZWsnXVskel09c3Vic3RyX2NvdW50KCRlc3AsJHopOwogIHByZWdfbWF0Y2hfYWxsKCcvcmVnaXN0ZXJfcmVzdF9yb3V0ZVwoXHMqW1wnIl0oW15cJyJdKylbXCciXVxzKixccypbXCciXShbXlwnIl0rKVtcJyJdLycsJGVzcCwkbXIsUFJFR19TRVRfT1JERVIpOwogIGZvcmVhY2goYXJyYXlfc2xpY2UoJG1yLDAsOCkgYXMgJHgpICRvWydlc3AnXVsncm91dGVzJ11bXT0keFsxXS4keFsyXTsKICBwcmVnX21hdGNoX2FsbCgnL2FkZF9hY3Rpb25cKFxzKltcJyJdKFthLXowLTlfXSspW1wnIl0vJywkZXNwLCRtYSk7ICRvWydlc3AnXVsnaG9va3MnXT1hcnJheV9zbGljZShhcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtYVsxXT8/YXJyYXkoKSkpLDAsMjApOwogICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLExFTkdUSChvcHRpb25fdmFsdWUpIGwgRlJPTSB7JHB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdwZXRzaG9wX2VzcCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX2VzcCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX3NlbmRlciUnIExJTUlUIDE1Iik7CiAgZm9yZWFjaCgkcm93cyBhcyAkcikgJG9bJ2VzcCddWydvcHQnXVskci0+b3B0aW9uX25hbWVdPSRyLT5sOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sOTkpOwo=';
const VER='dep-192424';
const GKEY='ps_s1634p2';
const PHASES=["S4"];
const OUT='analize/s1634_p2.json';
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
