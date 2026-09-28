process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzMyZCByZWxhdW5jaCBhdWRpdG9yaWpvcyBzZWdtZW50YWkgKHJlYWQtb25seSwgdGlrIGFncmVnYXRhaSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzMyZCddKSkgcmV0dXJuOwogICRmPSRfR0VUWydwc19zMTczMmQnXTsgQHNldF90aW1lX2xpbWl0KDI1MCk7IEBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCc3NjhNJyk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzMyZCcsJ2ZhemUnPT4kZl07ICRUMD1taWNyb3RpbWUodHJ1ZSk7CiAgdHJ5ewogIGlmKCRmPT09JzEnKXsKICAgICR0PSRQLidwc19yZWxhdW5jaF9rb250YWt0YWknOwogICAgJGNvbHM9JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NICR0Iik7ICRyWydjb2xzJ109aW1wbG9kZSgnLCcsJGNvbHMpOyAkclsnbiddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0Iik7CiAgICAkSz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBMT1dFUihUUklNKGVtYWlsKSkgZSwgc2VnbWVudGFzLCBjb25zZW50LCBDT0FMRVNDRShoZXJvX3JlYXNvbiwnJykgaHIsIENPQUxFU0NFKHJ1c2lzLCcnKSBydXNpcywgQ09BTEVTQ0UoaXN0X24sMCkgaXN0X24gRlJPTSAkdCIsQVJSQVlfQSk7CiAgICAkaXN0PVtdOyBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIExPV0VSKFRSSU0oZW1haWwpKSBlLCBNQVgoZGF0YSkgbCwgQ09VTlQoKikgbiwgU1VNKElGKGRhdGE+PScyMDI1LTA5LTA5JywxLDApKSBuMTIsIFNVTShJRihkYXRhPj0nMjAyNS0wOS0wOScsc3VtYSwwKSkgczEyLCBTVU0oc3VtYSkgcyBGUk9NIHskUH1wc19pc3RfdXpzYWt5bWFpIFdIRVJFIGl2eWtkeXRhcz0xIEdST1VQIEJZIDEiLEFSUkFZX0EpIGFzICR4KSAkaXN0WyR4WydlJ11dPSR4OwogICAgJG53PVtdOyBmb3JlYWNoKCR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgTE9XRVIoVFJJTShiaWxsaW5nX2VtYWlsKSkgRlJPTSB7JFB9d2Nfb3JkZXJzIFdIRVJFIHR5cGU9J3Nob3Bfb3JkZXInIEFORCBzdGF0dXMgSU4oJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnKSBBTkQgZGF0ZV9jcmVhdGVkX2dtdD49JzIwMjYtMDktMDggMjA6MDAnIikgYXMgJGUpICRud1skZV09MTsKICAgICR1bnM9W107IGlmKCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICd7JFB9cHNfY29uc2VudF9sb2cnIikpeyAkclsnY29uc2VudF9sb2dfbiddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wc19jb25zZW50X2xvZyIpOyB9CiAgICAkbm93PXN0cnRvdGltZSgnMjAyNi0wOS0yOCcpOyAkYWdnPVtdOyAkZG9tPVtdOyAkdmFsdWViPVtdOwogICAgZm9yZWFjaCgkSyBhcyAkayl7ICRlPSRrWydlJ107ICRpPSRpc3RbJGVdPz9udWxsOyAkZD0kaT9mbG9vcigoJG5vdy1zdHJ0b3RpbWUoJGlbJ2wnXSkpLzg2NDAwKTpudWxsOwogICAgICAkcmI9JGQ9PT1udWxsPyduZXJhX2lzdCc6KCRkPD0xODA/J2FfMC02bWVuJzooJGQ8PTM2NT8nYl82LTEybWVuJzooJGQ8PTczMD8nY18xMi0yNG1lbic6KCRkPD0xMDk1PydkXzI0LTM2bWVuJzonZV8zNittZW4nKSkpKTsKICAgICAgJGJuPWlzc2V0KCRud1skZV0pPydwaXJrb19wbyc6J25lcGlya28nOwogICAgICAka2V5PSRyYi4nfCcuJGtbJ3NlZ21lbnRhcyddLid8Jy4oJGtbJ2NvbnNlbnQnXT8nc3V0JzonYmUnKS4nfCcuJGJuOwogICAgICBpZighaXNzZXQoJGFnZ1ska2V5XSkpICRhZ2dbJGtleV09WzAsMCwwLjBdOyAkYWdnWyRrZXldWzBdKys7IGlmKCRpJiYkaVsnbiddPj0zKSAkYWdnWyRrZXldWzFdKys7ICRhZ2dbJGtleV1bMl0rPSRpPyhmbG9hdCkkaVsnczEyJ106MDsKICAgICAgJGRkPXN1YnN0cihzdHJyY2hyKCRlLCdAJyksMSk7ICRkb21bJGRkXT0oJGRvbVskZGRdPz8wKSsxOwogICAgfQogICAga3NvcnQoJGFnZyk7ICRyWydhZ2cnXT0kYWdnOyBhcnNvcnQoJGRvbSk7ICRyWydkb21fdG9wJ109YXJyYXlfc2xpY2UoJGRvbSwwLDE1LHRydWUpOyAkclsnZG9tX24nXT1jb3VudCgkZG9tKTsKICAgICRyWydzZWcnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzZWdtZW50YXMsIGNvbnNlbnQsIENPVU5UKCopIG4sIFNVTShrbGlrX24+MCkga2xpayBGUk9NICR0IEdST1VQIEJZIDEsMiIsQVJSQVlfQSk7CiAgICAkclsnaGVybyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHNlZ21lbnRhcywgQ09BTEVTQ0UoaGVyb19yZWFzb24sJycpIGhyLCBDT1VOVCgqKSBuIEZST00gJHQgR1JPVVAgQlkgMSwyIE9SREVSIEJZIDEsMyBERVNDIixBUlJBWV9BKTsKICAgIC8vIHNlbmRlciB3ZWJob29rOiBhciB5cmEgYm91bmNlL3Vuc3ViIGlzIGFua3N0ZXNuaXUgc2l1bnRpbXUKICAgIGlmKCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICd7JFB9cHNfc2VuZGVyX3dlYmhvb2tfbG9nJyIpKSAkclsnc2VuZGVyX2xvZyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIExFRlQodG9waWMsNDApIHQsIENPVU5UKCopIG4sIE1BWChjcmVhdGVkX2F0KSBteCBGUk9NIHskUH1wc19zZW5kZXJfd2ViaG9va19sb2cgR1JPVVAgQlkgMSIsQVJSQVlfQSk7CiAgICAkclsnd2NfdXNlcnNfaW1wJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT51c2VybWV0YX0gV0hFUkUgbWV0YV9rZXk9J19wc19pbXBvcnRhcyciKTsKICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgJHJbJ3RydWttZV9zJ109cm91bmQobWljcm90aW1lKHRydWUpLSRUMCwxKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSwgMSk7Cg==';
const VER='dep-185303';
const GKEY='ps_s1732d';
const PHASES=["1"];
const OUT='analize/s1732d.json';
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
