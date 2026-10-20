process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzkwdyBBZHMgYXRzaXBlcmthbXVtYXMgbnVvIG1pZ3JhY2lqb3MgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzkwdyddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMjUwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkRj0kUC4ncHNfZmFrdF91enNha3ltYWknOyAkcj1bJ3YnPT4nUzE3OTB3J107CiAgdHJ5ewogICAgJHJbJ3Blcmp1bmdpbWFzJ109Z2V0X29wdGlvbigncHNfcGVyanVuZ2ltb19kYXRhJyk7ICRyWydwaXJtYXNfdXpzJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBNSU4oZGllbmEpIEZST00gJEYgV0hFUkUgKHRlc3RpbmlzPTAgT1IgdGVzdGluaXMgSVMgTlVMTCkiKTsKICAgICRyWydzdGF0dXNhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1c2FzX2dhbHV0aW5pcyBzLCBDT1VOVCgqKSBuIEZST00gJEYgR1JPVVAgQlkgcyIsQVJSQVlfQSk7CiAgICAkclsncmVrbGFtYV9rYW5hbGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qga2FuYWxhcywgTUlOKGRpZW5hKSBudW8sIE1BWChkaWVuYSkgaWtpLCBDT1VOVChESVNUSU5DVCBkaWVuYSkgZCwgUk9VTkQoU1VNKGlzbGFpZG9zX2N0KS8xMDAsMikgZXVyLCBTVU0ocGFzcGF1ZGltYWkpIHBhc3AsIFJPVU5EKFNVTShrb252ZXJzaWpvcyksMSkga29udiwgUk9VTkQoU1VNKGtvbnZfdmVydGVfY3QpLzEwMCwyKSBrb252X2V1ciBGUk9NIHskUH1wc19mYWt0X3Jla2xhbWEgR1JPVVAgQlkga2FuYWxhcyIsQVJSQVlfQSk7CiAgICAkclsnYWRzX2thbXAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBrYW1wYW5pamFfaWQsIE1BWChrYW1wYW5pamEpIGssIE1JTihkaWVuYSkgbnVvLCBST1VORChTVU0oaXNsYWlkb3NfY3QpLzEwMCwyKSBldXIsIFNVTShwYXNwYXVkaW1haSkgcGFzcCwgUk9VTkQoU1VNKGtvbnZlcnNpam9zKSwxKSBrb252IEZST00geyRQfXBzX2Zha3RfcmVrbGFtYSBXSEVSRSBrYW5hbGFzIExJS0UgJyVnb29nbGUlJyBHUk9VUCBCWSBrYW1wYW5pamFfaWQiLEFSUkFZX0EpOwogICAgJHJbJ2Fkc19tZW4nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBEQVRFX0ZPUk1BVChkaWVuYSwnJVktJW0nKSBtLCBrYW5hbGFzLCBST1VORChTVU0oaXNsYWlkb3NfY3QpLzEwMCwyKSBldXIgRlJPTSB7JFB9cHNfZmFrdF9yZWtsYW1hIEdST1VQIEJZIG0sa2FuYWxhcyBPUkRFUiBCWSBtIixBUlJBWV9BKTsKICAgICRvaz0iKHRlc3RpbmlzPTAgT1IgdGVzdGluaXMgSVMgTlVMTCkgQU5EIHN0YXR1c2FzX2dhbHV0aW5pcyBOT1QgSU4gKCdjYW5jZWxsZWQnLCdmYWlsZWQnLCdyZWZ1bmRlZCcsJ3BlbmRpbmcnLCd0cmFzaCcsJ2NoZWNrb3V0LWRyYWZ0JykiOwogICAgJHNlbD0iQ09VTlQoKikgbiwgUk9VTkQoU1VNKHZpc29fY3QpLzEwMCwyKSB2aXNvLCBST1VORChTVU0ocHJla2l1X3N1bWFfY3QtbnVvbGFpZHVfY3QpLzEwMCwyKSBwcmVrZXNfYmVfcHZtLCBST1VORChTVU0obWFyemFfY3QpLzEwMCwyKSBtYXJ6YSwgUk9VTkQoU1VNKGtvbnRyaWJ1Y2lqYV9jdCkvMTAwLDIpIGtvbnRyLCBST1VORChTVU0ocHJpc3RhdHltYXNfcGFpbXRhX2N0KS8xMDAsMikgcHJpc3RfcGFpbXRhLCBST1VORChTVU0ocHJpc3RhdHltYXNfc2F2aWthaW5hX2N0KS8xMDAsMikgcHJpc3Rfc2F2LCBST1VORChTVU0obW9rZWppbW9fbW9rZXN0aXNfY3QpLzEwMCwyKSBtb2ssIFJPVU5EKFNVTShwYWt1b3Rlc19zYXZpa2FpbmFfY3QpLzEwMCwyKSBwYWssIFNVTShrbGllbnRhc19uYXVqYXMpIG5hdWppIjsKICAgICRyWydwYWdhbF9wYXNrdXRpbmknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBDQVNFIFdIRU4gdXRtX3NvdXJjZT0nZ29vZ2xlJyBBTkQgKHV0bV9tZWRpdW09J2NwYycgT1IgZ2NsaWQ8PicnKSBUSEVOIENPTkNBVCgnZ29vZ2xlfCcsSUZOVUxMKHV0bV9jYW1wYWlnbiwnJykpIFdIRU4gZ2NsaWQ8PicnIFRIRU4gJ2dvb2dsZXxnY2xpZCcgRUxTRSBrYW5hbGFzX3Bhc2t1dGluaXMgRU5EIGdycCwgJHNlbCBGUk9NICRGIFdIRVJFICRvayBHUk9VUCBCWSBncnAgT1JERVIgQlkgbiBERVNDIixBUlJBWV9BKTsKICAgICRyWydtZW5fZ29vZ2xlJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgREFURV9GT1JNQVQoZGllbmEsJyVZLSVtJykgbSwgJHNlbCBGUk9NICRGIFdIRVJFICRvayBBTkQgKGdjbGlkPD4nJyBPUiAodXRtX3NvdXJjZT0nZ29vZ2xlJyBBTkQgdXRtX21lZGl1bT0nY3BjJykpIEdST1VQIEJZIG0iLEFSUkFZX0EpOwogICAgJHJbJ3Zpc2lfbWVuJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgREFURV9GT1JNQVQoZGllbmEsJyVZLSVtJykgbSwgJHNlbCBGUk9NICRGIFdIRVJFICRvayBHUk9VUCBCWSBtIixBUlJBWV9BKTsKICAgICRyWydwaXJtYXNfZ29vZ2xlJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qga2FuYWxhc19waXJtYXMsIGthbmFsYXNfcGFza3V0aW5pcywgQ09VTlQoKikgbiwgUk9VTkQoU1VNKGtvbnRyaWJ1Y2lqYV9jdCkvMTAwLDIpIGtvbnRyIEZST00gJEYgV0hFUkUgJG9rIEFORCBrYW5hbGFzX3Bpcm1hcz0nbW9rYW1hcycgQU5EIGthbmFsYXNfcGFza3V0aW5pczw+J21va2FtYXMnIEdST1VQIEJZIDEsMiIsQVJSQVlfQSk7CiAgICAvLyBwYWthcnRvdGluaWFpOiBrbGllbnRhaSwga3VyacWzIFBJUk1BUyB1xb5zYWt5bWFzIGF0xJdqbyBpxaEgR29vZ2xlCiAgICAkclsncGFrYXJ0b3RpbmlhaSddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgZi5rbGllbnRhc19lbWFpbF9oYXNoKSBrbGllbnR1LCBDT1VOVCgqKSBwYWthcnRfdXpzLCBST1VORChTVU0oZi5rb250cmlidWNpamFfY3QpLzEwMCwyKSBrb250ciBGUk9NICRGIGYgSk9JTiAoU0VMRUNUIGtsaWVudGFzX2VtYWlsX2hhc2ggaCwgTUlOKHN1a3VydGFfYXQpIHQgRlJPTSAkRiBXSEVSRSAkb2sgR1JPVVAgQlkga2xpZW50YXNfZW1haWxfaGFzaCkgcCBPTiBwLmg9Zi5rbGllbnRhc19lbWFpbF9oYXNoIEFORCBmLnN1a3VydGFfYXQ+cC50IEpPSU4gJEYgZjEgT04gZjEua2xpZW50YXNfZW1haWxfaGFzaD1wLmggQU5EIGYxLnN1a3VydGFfYXQ9cC50IEFORCAoZjEuZ2NsaWQ8PicnIE9SIChmMS51dG1fc291cmNlPSdnb29nbGUnIEFORCBmMS51dG1fbWVkaXVtPSdjcGMnKSkgV0hFUkUgZi4kb2siLEFSUkFZX0EpOwogICAgJHJbJ2dyYXppbmltYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNIT1cgVEFCTEVTIExJS0UgJ3skUH1wc19mYWt0X2dyYXppbmltYWknIik/JHdwZGItPmdldF9yb3coIlNFTEVDVCBDT1VOVCgqKSBuLCBST1VORChTVU0oc3VtYV9jdCkvMTAwLDIpIGV1ciBGUk9NIHskUH1wc19mYWt0X2dyYXppbmltYWkiLEFSUkFZX0EpOm51bGw7CiAgICAkclsna29udHJfYXBpYnInXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIFNVTShwcmVraXVfc3VtYV9jdCkgcCwgU1VNKG51b2xhaWR1X2N0KSBudSwgU1VNKHNhdmlrYWluYV9jdCkgcywgU1VNKG1hcnphX2N0KSBtLCBTVU0obW9rZWppbW9fbW9rZXN0aXNfY3QpIG1vLCBTVU0ocGFrdW90ZXNfc2F2aWthaW5hX2N0KSBwYSwgU1VNKGRvdmFudV9zYXZpa2FpbmFfY3QpIGRvdiwgU1VNKGtvbnRyaWJ1Y2lqYV9jdCkgaywgU1VNKHByaXN0YXR5bWFzX3BhaW10YV9jdCkgcHAsIFNVTShwcmlzdGF0eW1hc19zYXZpa2FpbmFfY3QpIHBzLCBTVU0oc21hbGxfY2FydF9mZWVfY3QpIHNjZiBGUk9NICRGIFdIRVJFICRvayIsQVJSQVlfQSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydlcnInXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7IH0pOwo=';
const VER='dep-182929';
const GKEY='ps_s1790w';
const PHASES=["1"];
const OUT='analize/s1790_w.json';
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
