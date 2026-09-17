process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODlzIGwg4oCUIFJFQ09OIFNFTyBrYXRhbG9nbyBixatrbMSXICsgR1NDIHRlbmRlbmNpamEuIFJlYWQtb25seS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODlzbCddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7CiAgJG9bJ3Byb2RfcHViJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIpOwogICRvWydwcm9kX25vX3JtZGVzYyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1wb3N0cyB4IExFRlQgSk9JTiB7JHB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9eC5JRCBBTkQgbS5tZXRhX2tleT0ncmFua19tYXRoX2Rlc2NyaXB0aW9uJyBXSEVSRSB4LnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHgucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCAobS5tZXRhX3ZhbHVlIElTIE5VTEwgT1IgbS5tZXRhX3ZhbHVlPScnKSIpOwogICRvWydwcm9kX3Nob3J0X2NvbnRlbnQnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBDSEFSX0xFTkdUSChwb3N0X2NvbnRlbnQpPDMwMCIpOwogICRvWydwcm9kX25vX2V4Y2VycHQnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBDSEFSX0xFTkdUSChwb3N0X2V4Y2VycHQpPDUwIik7CiAgJG9bJ3Byb2Rfbm9faW1nJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXBvc3RzIHggTEVGVCBKT0lOIHskcH1wb3N0bWV0YSBtIE9OIG0ucG9zdF9pZD14LklEIEFORCBtLm1ldGFfa2V5PSdfdGh1bWJuYWlsX2lkJyBXSEVSRSB4LnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHgucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCAobS5tZXRhX3ZhbHVlIElTIE5VTEwgT1IgbS5tZXRhX3ZhbHVlPScnIE9SIG0ubWV0YV92YWx1ZT0nMCcpIik7CiAgJG9bJ3Byb2RfdXBwZXJfdGl0bGUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBCSU5BUlkgcG9zdF90aXRsZT1CSU5BUlkgVVBQRVIocG9zdF90aXRsZSkgQU5EIHBvc3RfdGl0bGUgUkVHRVhQICdbQS1aXXs1fSciKTsKICAkb1sncHJvZF9vdXRvZnN0b2NrJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXBvc3RzIHggSk9JTiB7JHB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9eC5JRCBBTkQgbS5tZXRhX2tleT0nX3N0b2NrX3N0YXR1cycgQU5EIG0ubWV0YV92YWx1ZT0nb3V0b2ZzdG9jaycgV0hFUkUgeC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCB4LnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIpOwogICRvWydjYXRfdG90YWwnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9dGVybV90YXhvbm9teSBXSEVSRSB0YXhvbm9teT0ncHJvZHVjdF9jYXQnIik7CiAgJG9bJ2NhdF9ub19kZXNjJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXRlcm1fdGF4b25vbXkgV0hFUkUgdGF4b25vbXk9J3Byb2R1Y3RfY2F0JyBBTkQgQ0hBUl9MRU5HVEgoZGVzY3JpcHRpb24pPDEwMCIpOwogICRvWydicmFuZF90b3RhbCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH10ZXJtX3RheG9ub215IFdIRVJFIHRheG9ub215PSdwcm9kdWN0X2JyYW5kJyIpOwogICRvWydicmFuZF9ub19kZXNjJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXRlcm1fdGF4b25vbXkgV0hFUkUgdGF4b25vbXk9J3Byb2R1Y3RfYnJhbmQnIEFORCBDSEFSX0xFTkdUSChkZXNjcmlwdGlvbik8MTAwIik7CiAgJGNvbHM9JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskcH1wc19mYWt0X2dzY19kaWVub3MiKTsgJG9bJ2dzY19jb2xzJ109JGNvbHM7CiAgJG9bJ2dzY183ZCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIFlFQVJXRUVLKGRpZW5hLDMpIHNhdiwgTUlOKGRpZW5hKSBudW8sIFNVTShwYXNwYXVkaW1haSkgY2wsIFNVTShwYXJvZHltYWkpIGltcCwgUk9VTkQoQVZHKHBvemljaWphKSwxKSBwb3ogRlJPTSB7JHB9cHNfZmFrdF9nc2NfZGllbm9zIFdIRVJFIGRpZW5hPj1EQVRFX1NVQihDVVJEQVRFKCksSU5URVJWQUwgNzAgREFZKSBHUk9VUCBCWSBzYXYgT1JERVIgQlkgc2F2IixBUlJBWV9BKTsKICAkb1snZ3NjX2x5J109JHdwZGItPmdldF9yb3coIlNFTEVDVCBTVU0ocGFzcGF1ZGltYWkpIGNsLCBTVU0ocGFyb2R5bWFpKSBpbXAgRlJPTSB7JHB9cHNfZmFrdF9nc2NfZGllbm9zIFdIRVJFIGRpZW5hIEJFVFdFRU4gREFURV9TVUIoREFURV9TVUIoQ1VSREFURSgpLElOVEVSVkFMIDEgWUVBUiksSU5URVJWQUwgMTQgREFZKSBBTkQgREFURV9TVUIoQ1VSREFURSgpLElOVEVSVkFMIDEgWUVBUikiLEFSUkFZX0EpOwogICRvWyd3cHNjJ109YXJyYXkoJ29uJz0+ZGVmaW5lZCgnV1BfQ0FDSEUnKSYmV1BfQ0FDSEUsJ2ZpbGVzJz0+Y291bnQoZ2xvYihXUF9DT05URU5UX0RJUi4nL2NhY2hlL3N1cGVyY2FjaGUvcGV0c2hvcC5sdC8qJyxHTE9CX09OTFlESVIpPzphcnJheSgpKSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-093757';
const GKEY='ps_s1689sl';
const PHASES=["GO"];
const OUT='analize/s1689s_l.json';
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
