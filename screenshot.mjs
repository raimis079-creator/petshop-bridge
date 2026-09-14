process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODQgbWMyIOKAlCBSRUFELU9OTFk6IHBzX2NvbnNlbnRfbG9nIGRldGFsxJcsIHBzX21hcmtldGluZ19jb25zZW50IGtpbG3Elywga2Fzb3Mgc3V0aWtpbW8gbGF1a2FzIGtvZGUuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjg0bWMyJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE2ODQgbWMyJyk7ICR3cGRiLT5zdXBwcmVzc19lcnJvcnModHJ1ZSk7CiAgJG9bJ2xvZ19ncnAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBmaWVsZCwgc291cmNlLCB0b192YWx1ZSwgQ09VTlQoKikgbiwgTUlOKGNoYW5nZWRfYXQpIG51bywgTUFYKGNoYW5nZWRfYXQpIGlraSBGUk9NIHskcH1wc19jb25zZW50X2xvZyBHUk9VUCBCWSBmaWVsZCwgc291cmNlLCB0b192YWx1ZSBPUkRFUiBCWSBuIERFU0MiLEFSUkFZX0EpOwogICRvWydsb2dfc2FtcGxlJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZmllbGQsIGZyb21fdmFsdWUsIHRvX3ZhbHVlLCBzb3VyY2UsIGNoYW5nZWRfYXQgRlJPTSB7JHB9cHNfY29uc2VudF9sb2cgT1JERVIgQlkgaWQgREVTQyBMSU1JVCA1IixBUlJBWV9BKTsKICAkb1snY29uc2VudF91c2VycyddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoKikgbiwgTUlOKHUudXNlcl9yZWdpc3RlcmVkKSBudW8sIE1BWCh1LnVzZXJfcmVnaXN0ZXJlZCkgaWtpLCBTVU0odS51c2VyX3JlZ2lzdGVyZWQ8JzIwMjYtMDktMDEnKSBzZW51IEZST00geyRwfXVzZXJtZXRhIG0gSk9JTiB7JHB9dXNlcnMgdSBPTiB1LklEPW0udXNlcl9pZCBXSEVSRSBtLm1ldGFfa2V5PSdwc19tYXJrZXRpbmdfY29uc2VudCcgQU5EIG0ubWV0YV92YWx1ZSBJTignMScsJ3llcycpIixBUlJBWV9BKTsKICAkb1sndXNlcnNfdG90YWwnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIENPVU5UKCopIG4sIFNVTSh1c2VyX3JlZ2lzdGVyZWQ8JzIwMjYtMDktMDEnKSBzZW51IEZST00geyRwfXVzZXJzIixBUlJBWV9BKTsKICAkb1snaXN0X2VtYWlsX21ldGEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX2tleSBrLCBDT1VOVCgqKSBuIEZST00geyRwfXVzZXJtZXRhIFdIRVJFIG1ldGFfa2V5IExJS0UgJ3BzX2lzdCUnIE9SIG1ldGFfa2V5IExJS0UgJ19wc19pc3QlJyBPUiBtZXRhX2tleSBMSUtFICdwc19taWdyJScgR1JPVVAgQlkgayBMSU1JVCAxNSIsQVJSQVlfQSk7CiAgJG9bJ3N1cHByZXNzaW9uJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgY2hhbm5lbCwgcmVhc29uLCBzb3VyY2UsIHN1cHByZXNzZWRfYXQgRlJPTSB7JHB9cHNfZW1haWxfc3VwcHJlc3Npb24iLEFSUkFZX0EpOwogICRvWydlbWFpbF9jb250ZW50J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZmxvdywgdmVyc2lvbiwgc3RhdHVzLCBzdWJqZWN0IEZST00geyRwfXBzX2VtYWlsX2NvbnRlbnQgT1JERVIgQlkgZmxvdyIsQVJSQVlfQSk7CiAgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJGYpeyAkcz1maWxlX2dldF9jb250ZW50cygkZik7IGlmKHN0cnBvcygkcywncHNfbWFya2V0aW5nX2NvbnNlbnQnKSE9PWZhbHNlKXsgJEw9ZXhwbG9kZSgiXG4iLCRzKTsgJGg9YXJyYXkoKTsgZm9yZWFjaCgkTCBhcyAkaT0+JGwpIGlmKHByZWdfbWF0Y2goJy9wc19tYXJrZXRpbmdfY29uc2VudHxTdXRpbmt1fG5hdWppZW58cmlua29kYXIvaScsJGwpKSAkaFtdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMTgwKSk7ICRvWydrb2RhcyddW2Jhc2VuYW1lKCRmKV09YXJyYXlfc2xpY2UoJGgsMCwyNSk7IH0gfQogIGZvcmVhY2goZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvKi5waHAnKSBhcyAkZil7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgaWYoc3RycG9zKCRzLCdwc19tYXJrZXRpbmdfY29uc2VudCcpIT09ZmFsc2UpeyAkTD1leHBsb2RlKCJcbiIsJHMpOyAkaD1hcnJheSgpOyBmb3JlYWNoKCRMIGFzICRpPT4kbCkgaWYocHJlZ19tYXRjaCgnL3BzX21hcmtldGluZ19jb25zZW50fFN1dGlua3V8bmF1amllbnxyaW5rb2Rhcnxjb25zZW50X2xvZy9pJywkbCkpICRoW109KCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGwsMCwxODApKTsgJG9bJ2tvZGFzJ11bJ2NvcmUvJy5iYXNlbmFtZSgkZildPWFycmF5X3NsaWNlKCRoLDAsMjUpOyB9IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-175635';
const GKEY='ps_s1684mc2';
const PHASES=["GO"];
const OUT='analize/s1684_mc2.json';
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
