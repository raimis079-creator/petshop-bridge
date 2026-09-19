process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2OTQgYiDigJQgcHNfcGV0cyBzdXZlc3RpbsSXOiBraWVrIHJlYWxpxbMgYW5rZXTFsyAobmUgdGVzdCwgcG8gVC0wKSwgcGFzaXNraXJzdHltYWksIHN2b3JpYWksIG1haXN0YXMsIHBldF9wcm9kdWN0cywgZmllbGRfbG9nLCBkcmFmdHMsIHdlaWdodF9zaWduYWwuIFJlYWQtb25seS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2OTRiJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoKTsgJHA9JHdwZGItPnByZWZpeDsgJFQ9InskcH1wc19wZXRzIjsKICAkZz1mdW5jdGlvbigkY29sLCR3aGVyZSkgdXNlKCR3cGRiLCRUKXsgcmV0dXJuICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElGTlVMTChOVUxMSUYoJGNvbCwnJyksJy0nKSBrLENPVU5UKCopIG4gRlJPTSAkVCBXSEVSRSAkd2hlcmUgR1JPVVAgQlkgayBPUkRFUiBCWSBuIERFU0MgTElNSVQgMTUiLEFSUkFZX0EpOyB9OwogICRvWyd2aXNvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJFQiKTsKICAkb1sncGFnYWxfc3RhdHVzX3Rlc3QnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzdGF0dXMsaXNfdGVzdCxkZWxldGVkX2F0IElTIE5PVCBOVUxMIGlzdHJpbnRhLENPVU5UKCopIG4gRlJPTSAkVCBHUk9VUCBCWSAxLDIsMyIsQVJSQVlfQSk7CiAgJG9bJ3BhZ2FsX21lbiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEVfRk9STUFUKGNyZWF0ZWRfYXQsJyVZLSVtJykgbSxDT1VOVCgqKSBuLFNVTShpc190ZXN0PTEpIHRlc3QsU1VNKGNyZWF0ZWRfYXQ+PScyMDI2LTA5LTA3IDIyOjAwOjAwJykgcG9fdDAgRlJPTSAkVCBHUk9VUCBCWSBtIixBUlJBWV9BKTsKICAkVz0iaXNfdGVzdD0wIEFORCBkZWxldGVkX2F0IElTIE5VTEwiOyAkb1sncmVhbGlvcyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRUIFdIRVJFICRXIik7CiAgJG9bJ3JlYWxpb3NfcG9fdDAnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkVCBXSEVSRSAkVyBBTkQgY3JlYXRlZF9hdD49JzIwMjYtMDktMDcgMjI6MDA6MDAnIik7CiAgJG9bJ3VuaWtfdmFydG90b2p1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIHVzZXJfaWQpIEZST00gJFQgV0hFUkUgJFcgQU5EIHVzZXJfaWQ+MCIpOwogICRvWydwb190MF9zYXJhc2FzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsdXNlcl9pZCxzcGVjaWVzLHNwZWNpZXNfZGV0YWlsLGxpZmVfc3RhZ2UsZG9nX3NpemUsY3VycmVudF93ZWlnaHRfa2cgdyxhY3Rpdml0eV9oaW50LGZlZWRpbmdfdHlwZSxwcmltYXJ5X25lZWQsY3VycmVudF9mb29kX2JyYW5kLHByaW1hcnlfcHJvZHVjdF9uYW1lLHF1ZXN0aW9ubmFpcmVfdmVyc2lvbiBxdixEQVRFX0ZPUk1BVChjcmVhdGVkX2F0LCclbS0lZCAlSDolaScpIHN1a3VydGEgRlJPTSAkVCBXSEVSRSAkVyBBTkQgY3JlYXRlZF9hdD49JzIwMjYtMDktMDcgMjI6MDA6MDAnIE9SREVSIEJZIGNyZWF0ZWRfYXQgREVTQyIsQVJSQVlfQSk7CiAgZm9yZWFjaCAoYXJyYXkoJ3NwZWNpZXMnLCdzcGVjaWVzX2RldGFpbCcsJ2xpZmVfc3RhZ2UnLCdkb2dfc2l6ZScsJ2lzX3N0ZXJpbGlzZWQnLCdmZWVkaW5nX3R5cGUnLCdwcmltYXJ5X25lZWQnLCdzZW5zaXRpdml0aWVzJywnaG91c2luZycsJ2FjdGl2aXR5X2hpbnQnLCdjdXJyZW50X2Zvb2RfYnJhbmQnLCdxdWVzdGlvbm5haXJlX3ZlcnNpb24nLCdzb3VyY2VfZHJhZnRfaWQgSVMgTk9UIE5VTEwnKSBhcyAkYykgJG9bJ3Bhc2snXVskY109JGcoJGMsJFcpOwogICRvWydzdm9yaXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzcGVjaWVzLENPVU5UKCopIG4sU1VNKGN1cnJlbnRfd2VpZ2h0X2tnIElTIE5PVCBOVUxMKSBzdV9zdm9yaXUsUk9VTkQoQVZHKGN1cnJlbnRfd2VpZ2h0X2tnKSwxKSB2aWQsTUlOKGN1cnJlbnRfd2VpZ2h0X2tnKSBtbixNQVgoY3VycmVudF93ZWlnaHRfa2cpIG14LFNVTShiaXJ0aF9kYXRlIElTIE5PVCBOVUxMKSBzdV9naW1pbW8gRlJPTSAkVCBXSEVSRSAkVyBHUk9VUCBCWSBzcGVjaWVzIixBUlJBWV9BKTsKICAkb1snbWFpc3Rhc190b3AnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRk5VTEwocHJpbWFyeV9wcm9kdWN0X25hbWUsY3VycmVudF9mb29kX2ZyZWVfdGV4dCkgayxjdXJyZW50X2Zvb2RfYnJhbmQgYixDT1VOVCgqKSBuIEZST00gJFQgV0hFUkUgJFcgR1JPVVAgQlkgMSwyIE9SREVSIEJZIG4gREVTQyBMSU1JVCAxNSIsQVJSQVlfQSk7CiAgJG9bJ3BldF9wcm9kdWN0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHJlbGF0aW9uc2hpcF90eXBlLHNvdXJjZSxDT1VOVCgqKSBuLENPVU5UKERJU1RJTkNUIHBldF9pZCkgcGV0cyBGUk9NIHskcH1wc19wZXRfcHJvZHVjdHMgR1JPVVAgQlkgMSwyIixBUlJBWV9BKTsKICAkb1snZmllbGRfbG9nJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbGF1a2FzLHNhbHRpbmlzLENPVU5UKCopIG4sTUFYKGxhaWthcykgcGFzayBGUk9NIHskcH1wc19wZXRfZmllbGRfbG9nIEdST1VQIEJZIDEsMiBPUkRFUiBCWSBuIERFU0MiLEFSUkFZX0EpOwogICRvWydkcmFmdHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzdGF0dXMsQ09VTlQoKikgbixNQVgoY3JlYXRlZF9hdCkgcGFzayBGUk9NIHskcH1wc19wZXRfcHJvZmlsZV9kcmFmdHMgR1JPVVAgQlkgc3RhdHVzIixBUlJBWV9BKTsKICAkb1snbm90ZXMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cHNfcGV0X25vdGVzIik7CiAgJG9bJ3dlaWdodF9zaWduYWwnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBDT1VOVCgqKSBuIEZST00geyRwfXVzZXJtZXRhIFdIRVJFIG1ldGFfa2V5PSdwc193ZWlnaHRfc2lnbmFsJyIsQVJSQVlfQSk7CiAgJG9bJ3dlaWdodF9zaWduYWxfcHZ6J109JHdwZGItPmdldF9jb2woIlNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXVzZXJtZXRhIFdIRVJFIG1ldGFfa2V5PSdwc193ZWlnaHRfc2lnbmFsJyBPUkRFUiBCWSB1bWV0YV9pZCBERVNDIExJTUlUIDMiKTsKICAvLyBhciBhbmtldMSFIHR1cmludHlzIHBpcmtvPwogICRvWydwaXJrbyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIChTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cHNfZmFrdF91enNha3ltYWkgZiBXSEVSRSBmLnVzZXJfaWQ9dC51c2VyX2lkKSBuX3V6cyxDT1VOVCgqKSBwZXRzIEZST00gKFNFTEVDVCBESVNUSU5DVCB1c2VyX2lkIEZST00gJFQgV0hFUkUgJFcgQU5EIHVzZXJfaWQ+MCkgdCBHUk9VUCBCWSAxIE9SREVSIEJZIDEiLEFSUkFZX0EpOwogIC8vIHdlYiDEr3Z5a2lhaSBhcGllIGFua2V0xIUgLyBza2FpxI1pdW9rbMSZCiAgJG9bJ2l2eWtpYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpdnlraXMsQ09VTlQoKikgbixNSU4oREFURShsYWlrYXMpKSBudW8gRlJPTSB7JHB9cHNfd2ViX2l2eWtpYWkgV0hFUkUgaXZ5a2lzIExJS0UgJyVjYWxjJScgT1IgaXZ5a2lzIExJS0UgJyVwZXQlJyBPUiBpdnlraXMgTElLRSAnJWFua2V0JScgT1IgaXZ5a2lzIExJS0UgJyVmZWVkJScgR1JPVVAgQlkgaXZ5a2lzIE9SREVSIEJZIG4gREVTQyBMSU1JVCAyMCIsQVJSQVlfQSk7CiAgaWYgKCR3cGRiLT5sYXN0X2Vycm9yKSAkb1snZXJyJ109JHdwZGItPmxhc3RfZXJyb3I7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-193841';
const GKEY='ps_s1694b';
const PHASES=["1"];
const OUT='analize/s1694_b.json';
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
