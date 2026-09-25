process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE5ZCDigJQgYm90xbMga3JlcMWhZWxpYWkgLyByb2JvdHMgLyBmYXRhbCBVUkwsIHJlYWQtb25seSAoaSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzE5ZCddKSkgcmV0dXJuOyAkcj1bJ3YnPT4nUzE3MTlkJywndCc9PmRhdGUoJ1ktbS1kIEg6aTpzJyldOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgQHNldF90aW1lX2xpbWl0KDEyMCk7CiAgJHE9ZnVuY3Rpb24oJHNxbCkgdXNlKCR3cGRiKXsgJHdwZGItPmxhc3RfZXJyb3I9Jyc7ICR4PSR3cGRiLT5nZXRfcmVzdWx0cygkc3FsLEFSUkFZX0EpOyBpZigkd3BkYi0+bGFzdF9lcnJvcikgcmV0dXJuIFsnU1FMX0VSUic9PnN1YnN0cigkd3BkYi0+bGFzdF9lcnJvciwwLDE2MCldOyByZXR1cm4gJHg7IH07CiAgdHJ5ewogICAgJHJzPXdwX3JlbW90ZV9nZXQoJ2h0dHBzOi8vcGV0c2hvcC5sdC9yb2JvdHMudHh0JyxbJ3RpbWVvdXQnPT4xMCwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgJHJbJ3JvYm90cyddPWlzX3dwX2Vycm9yKCRycyk/J0VSUic6c3Vic3RyKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRycyksMCwxMjAwKTsKICAgICRycz13cF9yZW1vdGVfZ2V0KCdodHRwczovL3BldHNob3AubHQva2F0ZWdvcmlqYS9rYXRlbXMvP3lpdGhfd2Nhbj0xJnByb2R1Y3RfY2F0PXR1YWxldGFpLWtyYWlrYWktc2VtdHV2ZWxpYWksa3JhaWthaS1rYWNpdS10dWFsZXRhbXMmcXVlcnlfdHlwZV9wcm9kdWN0X2NhdD1vciZxdWVyeV90eXBlX3RpcGFzPW9yJmZpbHRlcl90aXBhcz1hdHZpcmFzJyxbJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3VzZXItYWdlbnQnPT4nTW96aWxsYS81LjAgcHMtYXVkaXQnLCdsaW1pdF9yZXNwb25zZV9zaXplJz0+NTAwXSk7ICRyWydmYXRhbF91cmwnXT1pc193cF9lcnJvcigkcnMpPyRycy0+Z2V0X2Vycm9yX21lc3NhZ2UoKTp3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcnMpOwogICAgJHJzPXdwX3JlbW90ZV9nZXQoJ2h0dHBzOi8vcGV0c2hvcC5sdC9rYXRlZ29yaWphL2thdGVtcy8/ZmlsdGVyX3RpcGFzPWF0dmlyYXMmcXVlcnlfdHlwZV90aXBhcz1vcicsWyd0aW1lb3V0Jz0+MjUsJ3NzbHZlcmlmeSc9PmZhbHNlLCd1c2VyLWFnZW50Jz0+J01vemlsbGEvNS4wIHBzLWF1ZGl0JywnbGltaXRfcmVzcG9uc2Vfc2l6ZSc9PjUwMF0pOyAkclsnZmlsdGVyX3VybF9wYXByYXN0YXMnXT1pc193cF9lcnJvcigkcnMpPyRycy0+Z2V0X2Vycm9yX21lc3NhZ2UoKTp3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcnMpOwogICAgJHJbJ3Nlc3Npb25zXzI0aCddPSRxKCJTRUxFQ1QgU1VNKHNlc3Npb25fa2V5IE5PVCBSRUdFWFAgJ15bMC05XSskJykgc3ZlxI1pYWksU1VNKHNlc3Npb25fa2V5IE5PVCBSRUdFWFAgJ15bMC05XSskJyBBTkQgc2Vzc2lvbl92YWx1ZSBMSUtFICclXCJjYXJ0XCI7czolJyBBTkQgc2Vzc2lvbl92YWx1ZSBOT1QgTElLRSAnJVwiY2FydFwiO3M6NjpcImE6MDp7fVwiJScpIHN2ZcSNaWFpX3N1X2tyZXDFoWVsaXUsU1VNKHNlc3Npb25fdmFsdWUgTElLRSAnJVwiY3VzdG9tZXJcIjtzOiUnIEFORCBzZXNzaW9uX3ZhbHVlIExJS0UgJyVcImVtYWlsXCI7czowOiUnKSBiZV9lbWFpbCBGUk9NIHskcH13b29jb21tZXJjZV9zZXNzaW9ucyBXSEVSRSBzZXNzaW9uX2V4cGlyeT5VTklYX1RJTUVTVEFNUCgpKzE3MjgwMC04NjQwMCIpOwogICAgJHdpPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHB9cHNfd2ViX2l2eWtpYWkiKTsgJHJbJ3dlYl9jb2xzJ109JHdpOyAkdGM9bnVsbDsgZm9yZWFjaCgkd2kgYXMgJGMpIGlmKHByZWdfbWF0Y2goJy9eKHRpcGFzfGl2eWtpc3xldmVudHxydXNpcykkLycsJGMpKSAkdGM9JGM7CiAgICBpZigkdGMpeyAkclsnd2ViX3RpcGFpXzNkJ109JHEoIlNFTEVDVCBgJHRjYCB0LENPVU5UKCopIG4gRlJPTSB7JHB9cHNfd2ViX2l2eWtpYWkgV0hFUkUgbGFpa2FzPj1OT1coKS1JTlRFUlZBTCAzIERBWSBHUk9VUCBCWSBgJHRjYCBPUkRFUiBCWSBuIERFU0MgTElNSVQgMTIiKTsgfQogICAgJGNjPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHB9cHNfY2FydHMiKTsgJHJbJ2NhcnRzX2NvbHMnXT0kY2M7CiAgICAkclsnY2FydHNfcHZ6J109JHEoIlNFTEVDVCAqIEZST00geyRwfXBzX2NhcnRzIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMyIpOwogICAgJHVjPW51bGw7IGZvcmVhY2goJGNjIGFzICRjKSBpZihwcmVnX21hdGNoKCcvdXNlcl9hZ2VudHx1YSQvaScsJGMpKSAkdWM9JGM7IGlmKCR1YykgJHJbJ2NhcnRzX3VhJ109JHEoIlNFTEVDVCBMRUZUKGAkdWNgLDcwKSB1YSxDT1VOVCgqKSBuIEZST00geyRwfXBzX2NhcnRzIFdIRVJFIGNyZWF0ZWRfYXQ+PU5PVygpLUlOVEVSVkFMIDIgREFZIEdST1VQIEJZIHVhIE9SREVSIEJZIG4gREVTQyBMSU1JVCAxMCIpOwogICAgJGVjPW51bGw7IGZvcmVhY2goJGNjIGFzICRjKSBpZihwcmVnX21hdGNoKCcvZW1haWx8cGFzdGFzL2knLCRjKSkgJGVjPSRjOyBpZigkZWMpICRyWydjYXJ0c19lbWFpbCddPSRxKCJTRUxFQ1QgU1VNKGAkZWNgPD4nJyBBTkQgYCRlY2AgSVMgTk9UIE5VTEwpIHN1X2VtYWlsLENPVU5UKCopIG4gRlJPTSB7JHB9cHNfY2FydHMgV0hFUkUgY3JlYXRlZF9hdD49Tk9XKCktSU5URVJWQUwgMiBEQVkiKTsKICAgICRpYz1udWxsOyBmb3JlYWNoKCRjYyBhcyAkYykgaWYocHJlZ19tYXRjaCgnL15pcHxpcF8vaScsJGMpKSAkaWM9JGM7IGlmKCRpYykgJHJbJ2NhcnRzX2lwJ109JHEoIlNFTEVDVCBgJGljYCBpcCxDT1VOVCgqKSBuIEZST00geyRwfXBzX2NhcnRzIFdIRVJFIGNyZWF0ZWRfYXQ+PU5PVygpLUlOVEVSVkFMIDIgREFZIEdST1VQIEJZIGlwIE9SREVSIEJZIG4gREVTQyBMSU1JVCA4Iik7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwxKTsK';
const VER='dep-141954';
const GKEY='ps_s1719d';
const PHASES=["i"];
const OUT='analize/s1719_d.json';
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
