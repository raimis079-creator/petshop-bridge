process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MzcgcnVuIG4wIOKAlCBWSVNJxaBLQVMgQVYgTElLVcSMScWyIE5VTElOSU1BUyAoUmFpbWlvIHNwcmVuZGltYXMgMDktMDcpOiBrb3BpamEg4oaSIHZpc29zIHBhcnRpam9zIHRyaW5hbW9zIOKGkiB2aXNpIF9zdG9jaz0wLCBfb3duX3N0b2NrX3F0eSDFoWFsaW5hbWkg4oaSIGxvb2t1cCBzeW5jIOKGkiBrb250cm9sxJcgzqM9MC4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2MzduJ10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4nUzE2MzcgbjAnKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyBzZXRfdGltZV9saW1pdCgyODApOyBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCc3NjhNJyk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICR1cD13cF91cGxvYWRfZGlyKCk7ICRiaz10cmFpbGluZ3NsYXNoaXQoJHVwWydiYXNlZGlyJ10pLidwcy1iYWNrdXBzL2xpa3VjaWFpLXByaWVzLW51bGluaW1hLScuZGF0ZSgnWS1tLWRfSGknKTsgd3BfbWtkaXJfcCgkYmspOwogICRtZXRhPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBvc3RfaWQsbWV0YV9rZXksbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleSBJTignX3N0b2NrJywnX293bl9zdG9ja19xdHknKSIsQVJSQVlfQSk7CiAgZmlsZV9wdXRfY29udGVudHMoJGJrLicvc3RvY2tfbWV0YS5qc29uLmd6JyxnemVuY29kZSh3cF9qc29uX2VuY29kZSgkbWV0YSkpKTsKICAkcHQ9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskcH1wc19wYXJ0aWpvcyIsQVJSQVlfQSk7CiAgZmlsZV9wdXRfY29udGVudHMoJGJrLicvcHNfcGFydGlqb3MuanNvbi5neicsZ3plbmNvZGUod3BfanNvbl9lbmNvZGUoJHB0KSkpOwogICRvWydrb3BpamEnXT1hcnJheSgnbWV0YV9laWwnPT5jb3VudCgkbWV0YSksJ3BhcnRpam9zJz0+Y291bnQoJHB0KSwnZGlyJz0+c3RyX3JlcGxhY2UoJHVwWydiYXNlZGlyJ10sJycsJGJrKSk7CiAgJG9bJ3ByaWVzJ109YXJyYXkoJ3N0b2NrX3N1bWEnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgU1VNKG1ldGFfdmFsdWUrMCkgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19zdG9jayciKSwKICAgICdvd25fc3VtYSc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBTVU0obWV0YV92YWx1ZSswKSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX293bl9zdG9ja19xdHknIikpOwogICRvWydpc3RyaW50YV9wYXJ0aWp1J109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1wc19wYXJ0aWpvcyIpOwogICRvWydzdG9ja19udWxpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIlVQREFURSB7JHB9cG9zdG1ldGEgU0VUIG1ldGFfdmFsdWU9JzAnIFdIRVJFIG1ldGFfa2V5PSdfc3RvY2snIEFORCBtZXRhX3ZhbHVlPD4nMCciKTsKICAkb1snb3duX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX293bl9zdG9ja19xdHknIik7CiAgJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRwfXdjX3Byb2R1Y3RfbWV0YV9sb29rdXAgU0VUIHN0b2NrX3F1YW50aXR5PTAgV0hFUkUgc3RvY2tfcXVhbnRpdHkgSVMgTk9UIE5VTEwgQU5EIHN0b2NrX3F1YW50aXR5PD4wIik7CiAgZm9yZWFjaChhcnJheSgncHNfczE2MzdfYmFrJywncHNfczE2Mzdfc2VlbicsJ3BzX3MxNjM2eF9kb25lJykgYXMgJGspIGRlbGV0ZV9vcHRpb24oJGspOwogIHdwX2NhY2hlX2ZsdXNoKCk7CiAgJG9bJ2tvbnRyb2xlJ109YXJyYXkoJ3N0b2NrX3N1bWEnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgU1VNKG1ldGFfdmFsdWUrMCkgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19zdG9jayciKSwKICAgICdzdG9ja19ndDAnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9J19zdG9jaycgQU5EIG1ldGFfdmFsdWUrMD4wIiksCiAgICAnb3duX2VpbCc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX293bl9zdG9ja19xdHknIiksCiAgICAncGFydGlqb3MnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cHNfcGFydGlqb3MiKSwKICAgICdsb29rdXBfZ3QwJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXdjX3Byb2R1Y3RfbWV0YV9sb29rdXAgV0hFUkUgc3RvY2tfcXVhbnRpdHk+MCIpKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDk5KTsK';
const VER='dep-190411';
const GKEY='ps_s1637n';
const PHASES=["n"];
const OUT='analize/s1637_n0.json';
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
