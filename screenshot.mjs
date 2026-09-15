process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODUgbWEg4oCUIFJFQUQtT05MWTogR29vZ2xlIEFkcyBixatrbMSXIDA5LTE1IHJ5dGFzOiBwc19mYWt0X3Jla2xhbWEgcGFza3V0aW7El3MgZGllbm9zIHBhZ2FsIGthbXBhbmlqxIUsIHBzX2Fkc19yZWNvbi9wYXNrdXRpbmlzLCBvZmZsaW5lIMSva8SXbGltbyDFvnVybmFsYXMsIGdjbGlkIHXFvnNha3ltYWksIEFkcyB2cyBXQyBrb252ZXJzaWpvcy4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODVtYSddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjg1IG1hJyk7CiAgZm9yZWFjaChhcnJheSgncHNfYWRzX3Bhc2t1dGluaXMnLCdwc19hZHNfcmVjb24nLCdwc19hZHNfb2ZmbGluZV9wYXNrdXRpbmlzJywncHNfYWRzX29mZmxpbmVfbG9nJywncHNfYWRzX29mZmxpbmVfYnVzZW5hJykgYXMgJGspICRvWydvcHQnXVska109Z2V0X29wdGlvbigkayxudWxsKTsKICAkb1snb3BjaWpvc19hZHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSBrLCBMRUZUKG9wdGlvbl92YWx1ZSw0MDApIHYgRlJPTSB7JHB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdwc19hZHMlJyBPUiBvcHRpb25fbmFtZSBMSUtFICdwc19vZmZsaW5lJSciLEFSUkFZX0EpOwogICRvWydyZWtsYW1hX2RpZW5vcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGRpZW5hLCBrYW1wYW5pamEsIGlzbGFpZG9zX2N0LCBwYXNwYXVkaW1haSwga29udmVyc2lqb3MsIGtvbnZfdmVydGVfY3QgRlJPTSB7JHB9cHNfZmFrdF9yZWtsYW1hIFdIRVJFIGRpZW5hPj0nMjAyNi0wOS0wOScgT1JERVIgQlkgZGllbmEsIGlzbGFpZG9zX2N0IERFU0MiLEFSUkFZX0EpOwogICRvWydyZWtsYW1hX2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRwfXBzX2Zha3RfcmVrbGFtYSIpOwogICRvWyd3Y19hZHNfZGllbm9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZGllbmEsIENPVU5UKCopIHV6cywgU1VNKGdjbGlkPTEpIHN1X2djbGlkLCBTVU0oa2xpZW50YXNfbmF1amFzPTEpIG5hdWppLCBST1VORChTVU0odmlzb19jdCkvMTAwKSBldXIgRlJPTSB7JHB9cHNfZmFrdF91enNha3ltYWkgV0hFUkUgdGVzdGluaXM9MCBBTkQgYXBtb2tldGFfYXQgSVMgTk9UIE5VTEwgQU5EIChrYW5hbGFzX3Bpcm1hcz0nbW9rYW1hcycgT1Iga2FuYWxhc19wYXNrdXRpbmlzPSdtb2thbWFzJyBPUiBnY2xpZD0xKSBHUk9VUCBCWSBkaWVuYSBPUkRFUiBCWSBkaWVuYSIsQVJSQVlfQSk7CiAgJG9bJ2djbGlkX21ldGEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX2tleSBrLCBDT1VOVCgqKSBuLCBNQVgobWV0YV92YWx1ZSkgcGFzayBGUk9NIHskcH13Y19vcmRlcnNfbWV0YSBXSEVSRSBtZXRhX2tleSBJTignX3BzX2djbGlkJywnX3BzX2Fkc19vZmZsaW5lX3VwbG9hZGVkJywnX3BzX2Fkc19vZmZsaW5lX2F0JywnX3BzX2Fkc19jb252ZXJzaW9uX3NlbnQnKSBHUk9VUCBCWSBrIixBUlJBWV9BKTsKICAkb1snb2ZmbGluZV9tZXRhX2FsbCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG1ldGFfa2V5IGssIENPVU5UKCopIG4gRlJPTSB7JHB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXkgTElLRSAnJW9mZmxpbmUlJyBPUiBtZXRhX2tleSBMSUtFICclYWRzJScgR1JPVVAgQlkgayIsQVJSQVlfQSk7CiAgJGY9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1hZHMtb2ZmbGluZS5waHAnOyBpZihmaWxlX2V4aXN0cygkZikpeyAkTD1leHBsb2RlKCJcbiIsZmlsZV9nZXRfY29udGVudHMoJGYpKTsgZm9yZWFjaCgkTCBhcyAkaT0+JGwpIGlmKHByZWdfbWF0Y2goJy91cGRhdGVfb3B0aW9ufGFkZF9vcHRpb258Z2V0X29wdGlvbnxyZXN0X3JvdXRlfHJlZ2lzdGVyX3Jlc3Rfcm91dGV8X3BzX2djbGlkfGNvbnZlcnNpb25fbmFtZXxDb252ZXJzaW9uIE5hbWV8dXBkYXRlX3Bvc3RfbWV0YXx1cGRhdGVfbWV0YV9kYXRhL2knLCRsKSkgJG9bJ29mZmxpbmVfa29kYXMnXVtdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMTgwKSk7IH0KICAkb1snYWRzX3V6a2xhdXNvc19sb2cnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRwfXBzX2Fkc19sb2cgT1JERVIgQlkgaWQgREVTQyBMSU1JVCA1IixBUlJBWV9BKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-115628';
const GKEY='ps_s1685ma';
const PHASES=["GO"];
const OUT='analize/s1685_ma.json';
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
