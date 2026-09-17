process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTAgZCDigJQgdGVzdGFzOiBzdmXEjWlvIGthc2Egc3UgZXNhbW9zIHBhc2t5cm9zIGVsLiBwYcWhdHUgKHRlcnJhQGd5dnVuYWkubHQpLCBiYWNzLCB0ZXN0aW7ElyBwcmVrxJc7IHBvIHRvIGF0xaFhdWt0aS4gKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRFPSd0ZXJyYUBneXZ1bmFpLmx0JzsKICBpZiAoKGlzc2V0KCRfR0VUWydwc19zMTY5MGQnXSkgJiYgJF9HRVRbJ3BzX3MxNjkwZCddPT09J2QyJykpIHsKICAgICRwaWQ9MzQ4ODk7ICR3cGRiLT51cGRhdGUoJHAuJ3Bvc3RzJyxhcnJheSgncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcpLGFycmF5KCdJRCc9PiRwaWQpKTsgY2xlYW5fcG9zdF9jYWNoZSgkcGlkKTsgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygkcGlkKTsgJHByPXdjX2dldF9wcm9kdWN0KCRwaWQpOyBpZighJHByfHwhJHByLT5pc19wdXJjaGFzYWJsZSgpKXtlY2hvIGpzb25fZW5jb2RlKGFycmF5KCduZXBlcmthbWEnPT4xLCdzdCc9PiRwcj8kcHItPmdldF9zdGF0dXMoKTpudWxsLCdwcmljZSc9PiRwcj8kcHItPmdldF9wcmljZSgpOm51bGwsJ3N0b2NrJz0+JHByPyRwci0+Z2V0X3N0b2NrX3N0YXR1cygpOm51bGwpKTtleGl0O30gd2NfbG9hZF9jYXJ0KCk7IFdDKCktPmNhcnQtPmVtcHR5X2NhcnQoKTsgV0MoKS0+Y2FydC0+YWRkX3RvX2NhcnQoJHBpZCwxKTsKICAgICRfUE9TVD1hcnJheSgnYmlsbGluZ19maXJzdF9uYW1lJz0+J1Rlc3RhcycsJ2JpbGxpbmdfbGFzdF9uYW1lJz0+J1MxNjkwJywnYmlsbGluZ19jb3VudHJ5Jz0+J0xUJywnYmlsbGluZ19hZGRyZXNzXzEnPT4nVGVzdG8gZy4gMScsJ2JpbGxpbmdfY2l0eSc9PidWaWxuaXVzJywnYmlsbGluZ19wb3N0Y29kZSc9PicwMTEwMCcsJ2JpbGxpbmdfcGhvbmUnPT4nKzM3MDYwMDAwMDAwJywnYmlsbGluZ19lbWFpbCc9PiRFLCdjcmVhdGVhY2NvdW50Jz0+MSwncGF5bWVudF9tZXRob2QnPT4nYmFjcycsJ3Rlcm1zJz0+MSwndGVybXMtZmllbGQnPT4xLCdzaGlwX3RvX2RpZmZlcmVudF9hZGRyZXNzJz0+MCwnb3JkZXJfY29tbWVudHMnPT4nVEVTVEFTIFMxNjkwIOKAlCBhdMWhYXVrdGknKTsKICAgICRfUE9TVFsnd29vY29tbWVyY2UtcHJvY2Vzcy1jaGVja291dC1ub25jZSddPXdwX2NyZWF0ZV9ub25jZSgnd29vY29tbWVyY2UtcHJvY2Vzc19jaGVja291dCcpOyAkX1BPU1RbJ193cG5vbmNlJ109JF9QT1NUWyd3b29jb21tZXJjZS1wcm9jZXNzLWNoZWNrb3V0LW5vbmNlJ107CiAgICAkX1JFUVVFU1Q9YXJyYXlfbWVyZ2UoJF9SRVFVRVNULCRfUE9TVCk7ICRfU0VSVkVSWydSRVFVRVNUX01FVEhPRCddPSdQT1NUJzsgaWYoIWRlZmluZWQoJ0RPSU5HX0FKQVgnKSkgZGVmaW5lKCdET0lOR19BSkFYJyx0cnVlKTsKICAgIGFkZF9maWx0ZXIoJ3dwX2RvaW5nX2FqYXgnLCdfX3JldHVybl90cnVlJyk7IFdDKCktPmNoZWNrb3V0KCktPnByb2Nlc3NfY2hlY2tvdXQoKTsgZWNobyBqc29uX2VuY29kZShhcnJheSgnbmVidXZvX2V4aXQnPT50cnVlLCAnbm90aWNlcyc9PndjX2dldF9ub3RpY2VzKCkpKTsgZXhpdDsgfQogIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3MxNjkwZCddKSAmJiAkX0dFVFsncHNfczE2OTBkJ109PT0nZDMnKSkgeyAkbz1hcnJheSgpOwogICAgJGlkcz13Y19nZXRfb3JkZXJzKGFycmF5KCdsaW1pdCc9PjIsJ29yZGVyYnknPT4naWQnLCdvcmRlcic9PidERVNDJywnYmlsbGluZ19lbWFpbCc9PiRFLCdyZXR1cm4nPT4naWRzJykpOwogICAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICRvcmQ9d2NfZ2V0X29yZGVyKCRpZCk7ICRuPWFycmF5KCk7IGZvcmVhY2god2NfZ2V0X29yZGVyX25vdGVzKGFycmF5KCdvcmRlcl9pZCc9PiRpZCwnbGltaXQnPT42KSkgYXMgJG50KSAkbltdPW1iX3N1YnN0cihwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsJG50LT5jb250ZW50KSwwLDEwMCk7CiAgICAgICRyb3c9YXJyYXkoJ2lkJz0+JGlkLCdzdCc9PiRvcmQtPmdldF9zdGF0dXMoKSwndWlkJz0+JG9yZC0+Z2V0X2N1c3RvbWVyX2lkKCksJ21ldGEnPT4kb3JkLT5nZXRfbWV0YSgnX3BzX3Bhc2t5cmFfcHJpc2tpcnRhJyksJ3N1a3VydGFzJz0+JG9yZC0+Z2V0X2RhdGVfY3JlYXRlZCgpLT5kYXRlKCdtLWQgSDppJyksJ3Bhc3RhYm9zJz0+JG4pOwogICAgICBpZiAoJG9yZC0+Z2V0X2N1c3RvbWVyX25vdGUoKT09PSdURVNUQVMgUzE2OTAg4oCUIGF0xaFhdWt0aScgJiYgJG9yZC0+aGFzX3N0YXR1cygnb24taG9sZCcpKSB7ICRvcmQtPnVwZGF0ZV9zdGF0dXMoJ2NhbmNlbGxlZCcsJ1RFU1RBUyBTMTY5MCBhdMWhYXVrdGFzIGF1dG9tYXRpxaFrYWkuJyk7ICRyb3dbJ2F0c2F1a3RhJ109dHJ1ZTsgfQogICAgICAkb1sndXpzJ11bXT0kcm93OyB9CiAgICAkd3BkYi0+dXBkYXRlKCRwLidwb3N0cycsYXJyYXkoJ3Bvc3Rfc3RhdHVzJz0+J2RyYWZ0JyksYXJyYXkoJ0lEJz0+MzQ4ODkpKTsgY2xlYW5fcG9zdF9jYWNoZSgzNDg4OSk7ICRvWyd0ZXN0aW5lX2dyYXppbnRhJ109Z2V0X3Bvc3Rfc3RhdHVzKDM0ODg5KTsgJHU9Z2V0X3VzZXJfYnkoJ2VtYWlsJywkRSk7ICRvWydwYXNreXJvc19hZHJlc2FzJ109YXJyYXkoJ2FkZHInPT5nZXRfdXNlcl9tZXRhKCR1LT5JRCwnYmlsbGluZ19hZGRyZXNzXzEnLHRydWUpLCdjaXR5Jz0+Z2V0X3VzZXJfbWV0YSgkdS0+SUQsJ2JpbGxpbmdfY2l0eScsdHJ1ZSkpOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsgfQogIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3MxNjkwZCddKSAmJiAkX0dFVFsncHNfczE2OTBkJ109PT0nZDEnKSkgeyAkbz1hcnJheSgpOwogICAgJG9bJ3VpZCddPWVtYWlsX2V4aXN0cygkRSk7ICRvWydwcm9kJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQscG9zdF9uYW1lLHBvc3Rfc3RhdHVzIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIChwb3N0X25hbWUgTElLRSAnJXRlc3RhcyUnIE9SIHBvc3RfdGl0bGUgTElLRSAnJXRlc3RpbiUnIE9SIHBvc3RfbmFtZSBMSUtFICcldGVzdC0lJykgTElNSVQgOCIsQVJSQVlfQSk7CiAgICAkb1sncGx1Z2luJ109Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0thc2FfUGFza3lyYScpOwogICAgJGQ9YXBwbHlfZmlsdGVycygnd29vY29tbWVyY2VfY2hlY2tvdXRfcG9zdGVkX2RhdGEnLGFycmF5KCdiaWxsaW5nX2VtYWlsJz0+JEUsJ2NyZWF0ZWFjY291bnQnPT4xKSk7CiAgICAkb1snY3JlYXRlYWNjb3VudF9wbyddPSRkWydjcmVhdGVhY2NvdW50J107ICRvWydjdXN0b21lcl9pZF9wbyddPWFwcGx5X2ZpbHRlcnMoJ3dvb2NvbW1lcmNlX2NoZWNrb3V0X2N1c3RvbWVyX2lkJywwKTsgJG9bJ3VwZGF0ZV9kYXRhJ109YXBwbHlfZmlsdGVycygnd29vY29tbWVyY2VfY2hlY2tvdXRfdXBkYXRlX2N1c3RvbWVyX2RhdGEnLHRydWUsbnVsbCk7CiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQp9LDk5KTsK';
const VER='dep-160915';
const GKEY='ps_s1690d';
const PHASES=["d2", "d3"];
const OUT='analize/s1690_d2.json';
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
