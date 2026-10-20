process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzkweDIgcGFrYXJ0b3Rpbml1IGthbmFsYWksIGtyZXBzZWxpbyBjb25zZW50IHBhZ2FsIGRhdGEsIGNvbnNlbnRfY2hhbmdlZCBsYWlrYXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzkweDInXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDI1MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJEY9JFAuJ3BzX2Zha3RfdXpzYWt5bWFpJzsgJEVKPSRQLidwc19lbWFpbF9qb2JzJzsgJHI9Wyd2Jz0+J1MxNzkweDInXTsKICB0cnl7CiAgICAkb2s9IihmLnRlc3RpbmlzPTAgT1IgZi50ZXN0aW5pcyBJUyBOVUxMKSBBTkQgZi5zdGF0dXNhc19nYWx1dGluaXMgSU4gKCdjb21wbGV0ZWQnLCdwcm9jZXNzaW5nJywnb24taG9sZCcpIjsKICAgICRyWydwYWthcnQnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBmLmthbmFsYXNfcGFza3V0aW5pcyBrLCBJRk5VTEwoZi51dG1fc291cmNlLCcnKSBzLCBDT1VOVCgqKSBuLCBST1VORChTVU0oZi52aXNvX2N0KS8xMDAsMCkgZXVyLCBST1VORChTVU0oZi5rb250cmlidWNpamFfY3QpLzEwMCwwKSBrb250ciwgUk9VTkQoQVZHKGYuZGllbm9zX251b19hbmtzdGVzbmlvKSwwKSB2aWRfZCBGUk9NICRGIGYgSk9JTiAoU0VMRUNUIGtsaWVudGFzX2VtYWlsX2hhc2ggaCwgTUlOKHN1a3VydGFfYXQpIHQxIEZST00gJEYgeCBXSEVSRSAoeC50ZXN0aW5pcz0wIE9SIHgudGVzdGluaXMgSVMgTlVMTCkgQU5EIHguc3RhdHVzYXNfZ2FsdXRpbmlzIElOICgnY29tcGxldGVkJywncHJvY2Vzc2luZycsJ29uLWhvbGQnKSBHUk9VUCBCWSBoKSB0IE9OIHQuaD1mLmtsaWVudGFzX2VtYWlsX2hhc2ggQU5EIGYuc3VrdXJ0YV9hdD50LnQxIFdIRVJFICRvayBHUk9VUCBCWSBrLHMgT1JERVIgQlkgbiBERVNDIixBUlJBWV9BKTsKICAgICRyWydwYWthcnRfcHJla2VzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZS5icmVuZGFzX3NsdWcgYiwgQ09VTlQoKikgbiBGUk9NIHskUH1wc19mYWt0X2VpbHV0ZXMgZSBKT0lOICRGIGYgT04gZi51enNha3ltYXNfaWQ9ZS51enNha3ltYXNfaWQgSk9JTiAoU0VMRUNUIGtsaWVudGFzX2VtYWlsX2hhc2ggaCwgTUlOKHN1a3VydGFfYXQpIHQxIEZST00gJEYgeCBXSEVSRSAoeC50ZXN0aW5pcz0wIE9SIHgudGVzdGluaXMgSVMgTlVMTCkgQU5EIHguc3RhdHVzYXNfZ2FsdXRpbmlzIElOICgnY29tcGxldGVkJywncHJvY2Vzc2luZycsJ29uLWhvbGQnKSBHUk9VUCBCWSBoKSB0IE9OIHQuaD1mLmtsaWVudGFzX2VtYWlsX2hhc2ggQU5EIGYuc3VrdXJ0YV9hdD50LnQxIFdIRVJFICRvayBHUk9VUCBCWSBiIE9SREVSIEJZIG4gREVTQyBMSU1JVCAxMCIsQVJSQVlfQSk7CiAgICAkclsnc2VuaV9rYW5hbGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZi5rYW5hbGFzX3Bhc2t1dGluaXMgaywgSUZOVUxMKGYudXRtX3NvdXJjZSwnJykgcywgQ09VTlQoKikgbiBGUk9NICRGIGYgV0hFUkUgJG9rIEFORCBmLmtsaWVudGFzX25hdWphcz0wIEFORCBmLmtsaWVudGFzX3V6c2FreW1vX25yPj0yIEdST1VQIEJZIGsscyBPUkRFUiBCWSBuIERFU0MgTElNSVQgMTIiLEFSUkFZX0EpOwogICAgJHJbJ2tyZXBzZWxpc19jb25zZW50X2QnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBEQVRFKGNyZWF0ZWRfYXQpIGQsIGZsb3csIFNVTShzdGF0dXM9J3NlbnQnKSBzZW50LCBTVU0oc2tpcF9yZWFzb249J2NvbnNlbnRfbWlzc2luZycgT1IgYmxvY2tfcmVhc29uPSdjb25zZW50X21pc3NpbmcnKSBiZV9zdXRpa2ltbywgQ09VTlQoKikgbiBGUk9NICRFSiBXSEVSRSBmbG93IElOICgnY2FydF9hYmFuZG9uZWQnLCdjYXJ0X2FiYW5kb25lZF8yJywnYnJvd3NlX2FiYW5kb25lZCcpIEFORCBjcmVhdGVkX2F0Pj0nMjAyNi0xMC0wMScgR1JPVVAgQlkgZCxmbG93IE9SREVSIEJZIGQiLEFSUkFZX0EpOwogICAgLy8gY29uc2VudF9jaGFuZ2VkOiBhciB1xb5zYWt5bWFzIHTEhSBwYcSNacSFIG1pbnV0xJkgKGthc29qZSk/CiAgICAkclsnY29uc2VudF9jaCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGouc2VudF9hdCwgKFNFTEVDVCBNSU4oVElNRVNUQU1QRElGRihNSU5VVEUsby5kYXRlX2NyZWF0ZWRfZ210LGouc2VudF9hdCkpIEZST00geyRQfXdjX29yZGVycyBvIFdIRVJFIExPV0VSKG8uYmlsbGluZ19lbWFpbCk9TE9XRVIoai5yZWNpcGllbnRfZW1haWwpIEFORCBvLnR5cGU9J3Nob3Bfb3JkZXInIEFORCBBQlMoVElNRVNUQU1QRElGRihNSU5VVEUsby5kYXRlX2NyZWF0ZWRfZ210LGouc2VudF9hdCkpPD0xODApIG1pbl9za2lydCBGUk9NICRFSiBqIFdIRVJFIGouZmxvdz0nY29uc2VudF9jaGFuZ2VkJyBBTkQgai5zdGF0dXM9J3NlbnQnIE9SREVSIEJZIGouc2VudF9hdCBERVNDIExJTUlUIDQwIixBUlJBWV9BKTsKICAgIC8vIHBvc3RfcHVyY2hhc2VfMmQgZ2F2xJdqYWk6IGtpZWsgcGlya28gcGVyIDcgZC4gcG8gbGFpxaFrbyB2cyBwZXIgNyBkLiBwcmllxaE/IChiYXrElzogcGFrYXJ0b2ppbWFzIHBlciAyLTkgZC4gcG8gcGlya2ltbykKICAgICRyWydwcDJfdGlrc2x1J109JHdwZGItPmdldF9yb3coIlNFTEVDVCBDT1VOVCgqKSBuLCBTVU0oRVhJU1RTKFNFTEVDVCAxIEZST00geyRQfXdjX29yZGVycyBvIFdIRVJFIExPV0VSKG8uYmlsbGluZ19lbWFpbCk9TE9XRVIoai5yZWNpcGllbnRfZW1haWwpIEFORCBvLnR5cGU9J3Nob3Bfb3JkZXInIEFORCBvLnN0YXR1cyBJTiAoJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnKSBBTkQgby5kYXRlX2NyZWF0ZWRfZ210Pmouc2VudF9hdCBBTkQgby5kYXRlX2NyZWF0ZWRfZ210PD1EQVRFX0FERChqLnNlbnRfYXQsSU5URVJWQUwgNyBEQVkpKSkgcGlya28gRlJPTSAkRUogaiBXSEVSRSBqLmZsb3c9J3Bvc3RfcHVyY2hhc2VfMmQnIEFORCBqLnN0YXR1cz0nc2VudCciLEFSUkFZX0EpOwogICAgJHJbJ3dlYmhvb2tfbG9nJ109JHdwZGItPmdldF9yZXN1bHRzKCJTSE9XIFRBQkxFUyBMSUtFICd7JFB9cHNfd2ViaG9va19sb2cnIik/JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUZOVUxMKEpTT05fVU5RVU9URShKU09OX0VYVFJBQ1QocGF5bG9hZCwnJC50eXBlJykpLCc/JykgdCwgQ09VTlQoKikgbiwgTUFYKGNyZWF0ZWRfYXQpIHBhc2sgRlJPTSB7JFB9cHNfd2ViaG9va19sb2cgR1JPVVAgQlkgdCBPUkRFUiBCWSBuIERFU0MgTElNSVQgMTAiLEFSUkFZX0EpOm51bGw7CiAgICAkclsna3JlcF9jZmcnXT1bJ2lzanVuZ3RhJz0+Z2V0X29wdGlvbigncHNfa3JlcHNlbGlvX3ByaW1pbmltYWlfaXNqdW5ndGEnKV07CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydlcnInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7IH0pOwo=';
const VER='dep-184610';
const GKEY='ps_s1790x2';
const PHASES=["1"];
const OUT='analize/s1790_x2.json';
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
