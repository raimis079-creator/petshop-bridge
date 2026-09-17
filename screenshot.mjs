process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTAgYSDigJQgYXIgc2VuaSBrbGllbnRhaSBnYWxpIHByaXNpanVuZ3RpIC8ga2FzIHZ5a3N0YSBrYXNvamUuIFJlYWQtb25seS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2OTBhJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoKTsgJHdwZGItPnN1cHByZXNzX2Vycm9ycyh0cnVlKTsKICAkVDA9JzIwMjYtMDktMDcgMTk6MDc6MDAnOwogICRvWyd1c2Vyc190b3RhbCddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9dXNlcnMiKTsKICAkb1sndXNlcnNfcHJpZXNfdDAnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXVzZXJzIFdIRVJFIHVzZXJfcmVnaXN0ZXJlZDwnJFQwJyIpOwogICRvWydwYXNzX2Zvcm1hdGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgTEVGVCh1c2VyX3Bhc3MsNCkgZiwgKHVzZXJfcmVnaXN0ZXJlZDwnJFQwJykgc2VuYXMsIENPVU5UKCopIG4gRlJPTSB7JHB9dXNlcnMgR1JPVVAgQlkgZixzZW5hcyIsQVJSQVlfQSk7CiAgJG9bJ3Bhc3NfdHVzY2lhcyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9dXNlcnMgV0hFUkUgdXNlcl9wYXNzPScnIE9SIHVzZXJfcGFzcyBJUyBOVUxMIik7CiAgJG9bJ3Jlc2V0X3Jha3RhaV9wb190MCddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9dXNlcnMgV0hFUkUgdXNlcl9hY3RpdmF0aW9uX2tleTw+JycgQU5EIFNVQlNUUklOR19JTkRFWCh1c2VyX2FjdGl2YXRpb25fa2V5LCc6JywxKSBSRUdFWFAgJ15bMC05XSskJyBBTkQgRlJPTV9VTklYVElNRShTVUJTVFJJTkdfSU5ERVgodXNlcl9hY3RpdmF0aW9uX2tleSwnOicsMSkpPj0nJFQwJyIpOwogICRvWydyZXNldF9yYWt0YWlfZGllbm9taXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBEQVRFKEZST01fVU5JWFRJTUUoU1VCU1RSSU5HX0lOREVYKHVzZXJfYWN0aXZhdGlvbl9rZXksJzonLDEpKSkgZCwgQ09VTlQoKikgbiBGUk9NIHskcH11c2VycyBXSEVSRSB1c2VyX2FjdGl2YXRpb25fa2V5PD4nJyBBTkQgU1VCU1RSSU5HX0lOREVYKHVzZXJfYWN0aXZhdGlvbl9rZXksJzonLDEpIFJFR0VYUCAnXlswLTldKyQnIEFORCBGUk9NX1VOSVhUSU1FKFNVQlNUUklOR19JTkRFWCh1c2VyX2FjdGl2YXRpb25fa2V5LCc6JywxKSk+PSckVDAnIEdST1VQIEJZIGQiLEFSUkFZX0EpOwogICRvWydzZXNpam9zX2FrdHl2aW9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKHUudXNlcl9yZWdpc3RlcmVkPCckVDAnKSBzZW5hcywgQ09VTlQoKikgbiBGUk9NIHskcH11c2VybWV0YSBtIEpPSU4geyRwfXVzZXJzIHUgT04gdS5JRD1tLnVzZXJfaWQgV0hFUkUgbS5tZXRhX2tleT0nc2Vzc2lvbl90b2tlbnMnIEdST1VQIEJZIHNlbmFzIixBUlJBWV9BKTsKICAkb1sncGFza19sb2dpbl9tZXRhJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbWV0YV9rZXksIENPVU5UKCopIG4gRlJPTSB7JHB9dXNlcm1ldGEgV0hFUkUgbWV0YV9rZXkgSU4gKCd3Y19sYXN0X2FjdGl2ZScsJ2xhc3RfbG9naW4nLCdfcHNfbGFzdF9sb2dpbicsJ3BzX2xhc3RfbG9naW4nKSBHUk9VUCBCWSBtZXRhX2tleSIsQVJSQVlfQSk7CiAgJG9bJ3djX2xhc3RfYWN0aXZlX3BvX3QwJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKHUudXNlcl9yZWdpc3RlcmVkPCckVDAnKSBzZW5hcywgQ09VTlQoKikgbiBGUk9NIHskcH11c2VybWV0YSBtIEpPSU4geyRwfXVzZXJzIHUgT04gdS5JRD1tLnVzZXJfaWQgV0hFUkUgbS5tZXRhX2tleT0nd2NfbGFzdF9hY3RpdmUnIEFORCBtLm1ldGFfdmFsdWU+PVVOSVhfVElNRVNUQU1QKCckVDAnKSBHUk9VUCBCWSBzZW5hcyIsQVJSQVlfQSk7CiAgJG9bJ3V6c19wb190MF9wYWdhbF9rbGllbnRhJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgQ0FTRSBXSEVOIG8uY3VzdG9tZXJfaWQ9MCBUSEVOICdzdmVjaWFzJyBXSEVOIHUudXNlcl9yZWdpc3RlcmVkPCckVDAnIFRIRU4gJ3NlbmFzX3ByaXNpanVuZ2VzJyBFTFNFICduYXVqYXNfcHJpc2lqdW5nZXMnIEVORCBrLCBDT1VOVCgqKSBuLCBTVU0oby5zdGF0dXMgSU4gKCd3Yy1wcm9jZXNzaW5nJywnd2MtY29tcGxldGVkJywnd2Mtb24taG9sZCcpKSBvayBGUk9NIHskcH13Y19vcmRlcnMgbyBMRUZUIEpPSU4geyRwfXVzZXJzIHUgT04gdS5JRD1vLmN1c3RvbWVyX2lkIFdIRVJFIG8udHlwZT0nc2hvcF9vcmRlcicgQU5EIG8uZGF0ZV9jcmVhdGVkX2dtdD49JyRUMCcgR1JPVVAgQlkgayIsQVJSQVlfQSk7CiAgJG9bJ3N2ZWNpYWlfc3Vfc2VuYV9wYXNreXJhJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH13Y19vcmRlcnMgbyBKT0lOIHskcH11c2VycyB1IE9OIHUudXNlcl9lbWFpbD1vLmJpbGxpbmdfZW1haWwgV0hFUkUgby50eXBlPSdzaG9wX29yZGVyJyBBTkQgby5jdXN0b21lcl9pZD0wIEFORCBvLmRhdGVfY3JlYXRlZF9nbXQ+PSckVDAnIEFORCB1LnVzZXJfcmVnaXN0ZXJlZDwnJFQwJyIpOwogICRvWydkaWVub3NfcG9fdDAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBEQVRFKENPTlZFUlRfVFooZGF0ZV9jcmVhdGVkX2dtdCwnKzAwOjAwJywnKzAzOjAwJykpIGQsIENPVU5UKCopIG4sIFNVTShzdGF0dXMgSU4gKCd3Yy1wcm9jZXNzaW5nJywnd2MtY29tcGxldGVkJywnd2Mtb24taG9sZCcpKSBvaywgU1VNKGN1c3RvbWVyX2lkPjApIGxvZ2luIEZST00geyRwfXdjX29yZGVycyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBBTkQgZGF0ZV9jcmVhdGVkX2dtdD49JyRUMCcgR1JPVVAgQlkgZCIsQVJSQVlfQSk7CiAgLy8gV0MgbG9nIHBsYWNlLW9yZGVyLWRlYnVnOiBrbGFpZG9zIHBhZ2FsIGRpZW7EhQogICRvWydsb2cnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBEQVRFKHRpbWVzdGFtcCkgZCwgU1VCU1RSSU5HX0lOREVYKFNVQlNUUklORyhtZXNzYWdlLDEsMTIwKSwneycsMSkgbSwgQ09VTlQoKikgbiBGUk9NIHskcH13b29jb21tZXJjZV9sb2cgV0hFUkUgc291cmNlPSdwbGFjZS1vcmRlci1kZWJ1ZycgQU5EIG1lc3NhZ2UgTk9UIExJS0UgJyV0b3RhbHMgY2FsY3VsYXRlZCUnIEFORCBtZXNzYWdlIE5PVCBMSUtFICclU3RhcnQlJyBHUk9VUCBCWSBkLG0gT1JERVIgQlkgZCxuIERFU0MiLEFSUkFZX0EpOwogICRvWydsb2dfc291cmNlc19zaWFuZGllbiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHNvdXJjZSwgbGV2ZWwsIENPVU5UKCopIG4gRlJPTSB7JHB9d29vY29tbWVyY2VfbG9nIFdIRVJFIHRpbWVzdGFtcD49Q1VSREFURSgpIEdST1VQIEJZIHNvdXJjZSxsZXZlbCBPUkRFUiBCWSBuIERFU0MgTElNSVQgMTUiLEFSUkFZX0EpOwogICRmPWdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvZnVuY3Rpb25zLnBocCc7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgJGk9c3RycG9zKCRzLCdmdW5jdGlvbiBwZXRzaG9wX2FjY291bnRfY2hlY2tib3hfZGVmYXVsdCcpOwogICRvWydmbiddPSRpIT09ZmFsc2U/IHN1YnN0cigkcyxtYXgoMCwkaS0zMDApLDE0MDApOidORVJBJzsKICAkb1snd2Nfb3B0J109YXJyYXkoJ2d1ZXN0Jz0+Z2V0X29wdGlvbignd29vY29tbWVyY2VfZW5hYmxlX2d1ZXN0X2NoZWNrb3V0JyksJ3NpZ251cCc9PmdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2VuYWJsZV9zaWdudXBfYW5kX2xvZ2luX2Zyb21fY2hlY2tvdXQnKSwnZ2VuX3VzZXInPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9yZWdpc3RyYXRpb25fZ2VuZXJhdGVfdXNlcm5hbWUnKSwnZ2VuX3Bhc3MnPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9yZWdpc3RyYXRpb25fZ2VuZXJhdGVfcGFzc3dvcmQnKSwnbG9naW4nPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9lbmFibGVfY2hlY2tvdXRfbG9naW5fcmVtaW5kZXInKSwnaG9sZCc9PmdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2hvbGRfc3RvY2tfbWludXRlcycpKTsKICAkb1snYWRzX3NpYW5kaWVuJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskcH1wc19mYWt0X3Jla2xhbWEgT1JERVIgQlkgZGllbmEgREVTQyBMSU1JVCAzIixBUlJBWV9BKTsKICAkb1snaXZ5a2lhaV9kaWVub3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBkaWVuYSwgQ09VTlQoRElTVElOQ1Qgc2VzaWphKSBzZXMsIFNVTSh0aXBhcz0nYmVnaW5fY2hlY2tvdXQnKSBjaGssIFNVTSh0aXBhcz0ncHVyY2hhc2UnKSBwdXIgRlJPTSB7JHB9cHNfd2ViX2l2eWtpYWkgV0hFUkUgdGVzdGluaXM9MCBBTkQgZGllbmE+PUNVUkRBVEUoKS1JTlRFUlZBTCA3IERBWSBHUk9VUCBCWSBkaWVuYSIsQVJSQVlfQSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-153955';
const GKEY='ps_s1690a';
const PHASES=["ps_s1690a"];
const OUT='analize/s1690_a.json';
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
