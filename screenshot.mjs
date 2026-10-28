process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODA3YXIgU2VuZGVyIEwxIOKGkiBwc19zZW5kZXJfYXJjaHl2YXMgKyDFoWFsaW5pbWFzIGnFoSBTZW5kZXIg4oCUIDEgZHJ5IMK3IDIgYXJjaHl2dW90aSvFoWFsaW50aSDCtyAzIGLFq2tsxJcgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODA3YXInXSkpIHJldHVybjsgJEY9KHN0cmluZykkX0dFVFsncHNfczE4MDdhciddOyBAc2V0X3RpbWVfbGltaXQoMTcwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4MDdhcicsJ2YnPT4kRl07ICRUMD1taWNyb3RpbWUodHJ1ZSk7CiAgJEs9JFAuJ3BzX3JlbGF1bmNoX2tvbnRha3RhaSc7ICRBPSRQLidwc19zZW5kZXJfYXJjaHl2YXMnOyAkTDE9WydhS2tsNU0nLCdkTGxtNVgnXTsKICAkdG9rPVBldHNob3BfU2VuZGVyX0FkYXB0ZXI6OmdldF9zdG9yZWRfdG9rZW4oJ21hcmtldGluZycpOwogICRhcGk9ZnVuY3Rpb24oJG0sJHAsJGI9bnVsbCkgdXNlKCR0b2speyAkYT1bJ21ldGhvZCc9PiRtLCd0aW1lb3V0Jz0+MzAsJ2hlYWRlcnMnPT5bJ0F1dGhvcml6YXRpb24nPT4nQmVhcmVyICcuJHRvaywnQWNjZXB0Jz0+J2FwcGxpY2F0aW9uL2pzb24nLCdDb250ZW50LVR5cGUnPT4nYXBwbGljYXRpb24vanNvbiddXTsgaWYoJGIhPT1udWxsKSAkYVsnYm9keSddPXdwX2pzb25fZW5jb2RlKCRiKTsgJHg9d3BfcmVtb3RlX3JlcXVlc3QoJ2h0dHBzOi8vYXBpLnNlbmRlci5uZXQvdjInLiRwLCRhKTsgaWYoaXNfd3BfZXJyb3IoJHgpKSByZXR1cm4gWydjb2RlJz0+MCwnZXJyJz0+JHgtPmdldF9lcnJvcl9tZXNzYWdlKCldOyByZXR1cm4gWydjb2RlJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpLCdib2R5Jz0+anNvbl9kZWNvZGUod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHgpLHRydWUpXTsgfTsKICAkc21hcD1mdW5jdGlvbigpIHVzZSgkYXBpKXsgJHNiPVtdOyAkcGc9MTsgZG97ICR4PSRhcGkoJ0dFVCcsJy9zdWJzY3JpYmVycz9saW1pdD0xMDAmcGFnZT0nLiRwZyk7IGZvcmVhY2goKGFycmF5KSgkeFsnYm9keSddWydkYXRhJ10/P1tdKSBhcyAkcyl7ICRncj1bXTsgZm9yZWFjaCgoYXJyYXkpKCRzWydzdWJzY3JpYmVyX3RhZ3MnXT8/W10pIGFzICR0KXsgJGdyW109aXNfYXJyYXkoJHQpPygkdFsnaWQnXT8/JycpOiR0OyB9ICRzYltzdHJ0b2xvd2VyKCRzWydlbWFpbCddPz8nJyldPVsnc3QnPT4kc1snc3RhdHVzJ11bJ2VtYWlsJ10/Pyc/JywnZ3InPT4kZ3IsJ2lkJz0+JHNbJ2lkJ10/P251bGwsJ2NyZWF0ZWQnPT4kc1snY3JlYXRlZCddPz9udWxsXTsgfSAkbGFzdD0keFsnYm9keSddWydtZXRhJ11bJ2xhc3RfcGFnZSddPz8xOyAkcGcrKzsgfSB3aGlsZSgkcGc8PSRsYXN0ICYmICRwZzw2MCk7IHJldHVybiAkc2I7IH07CiAgdHJ5ewogICAgJHNiPSRzbWFwKCk7ICRyWydzZW5kZXJfdmlzbyddPWNvdW50KCRzYik7ICRyWydha3R5dnVzJ109Y291bnQoYXJyYXlfZmlsdGVyKCRzYixmdW5jdGlvbigkeCl7cmV0dXJuICR4WydzdCddPT09J2FjdGl2ZSc7fSkpOwogICAgJGthbmQ9W107ICRwcmFsZWlzdGE9WydraXRvc19ncnVwZXMnPT4wLCduZWFrdHl2dXMnPT4wLCdzdXRpa2ltYXMnPT4wXTsKICAgIGZvcmVhY2goJHNiIGFzICRlbT0+JHMpeyBpZighYXJyYXlfaW50ZXJzZWN0KCRzWydnciddLCRMMSkpIGNvbnRpbnVlOwogICAgICBpZihhcnJheV9kaWZmKCRzWydnciddLCRMMSkpeyAkcHJhbGVpc3RhWydraXRvc19ncnVwZXMnXSsrOyBjb250aW51ZTsgfQogICAgICBpZigkc1snc3QnXSE9PSdhY3RpdmUnKXsgJHByYWxlaXN0YVsnbmVha3R5dnVzJ10rKzsgY29udGludWU7IH0KICAgICAgJGs9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCxjaWQsY29uc2VudCxrbGlrX24sYXRpZGFyZV9uIEZST00gJEsgV0hFUkUgTE9XRVIoZW1haWwpPSVzIiwkZW0pLEFSUkFZX0EpOwogICAgICBpZigkayAmJiAoaW50KSRrWydjb25zZW50J109PT0xKXsgJHByYWxlaXN0YVsnc3V0aWtpbWFzJ10rKzsgY29udGludWU7IH0KICAgICAgJGthbmRbJGVtXT1bJ3MnPT4kcywnayc9PiRrXTsgfQogICAgJHJbJ0wxX3NhbGludGknXT1jb3VudCgka2FuZCk7ICRyWydwcmFsZWlzdGEnXT0kcHJhbGVpc3RhOyAkclsncG9fc2FsaW5pbW9fYWt0eXZ1cyddPSRyWydha3R5dnVzJ10tY291bnQoJGthbmQpOwogICAgaWYoJEY9PT0nMicpewogICAgICAkd3BkYi0+cXVlcnkoIkNSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTICRBIChpZCBCSUdJTlQgVU5TSUdORUQgQVVUT19JTkNSRU1FTlQgUFJJTUFSWSBLRVksIGVtYWlsIFZBUkNIQVIoMTkxKSBOT1QgTlVMTCwgY2lkIFZBUkNIQVIoMzIpIE5VTEwsIGJhbmdhIFZBUkNIQVIoMjApIE5VTEwsIGdydXBlcyBWQVJDSEFSKDE5MSkgTlVMTCwgc2VuZGVyX2J1c2VuYSBWQVJDSEFSKDMwKSBOVUxMLCBrbGlrX24gSU5UIE5VTEwsIGlzaW10YV9hdCBEQVRFVElNRSBOT1QgTlVMTCwgcHJpZXphc3RpcyBWQVJDSEFSKDYwKSBOVUxMLCBncmF6aW50YV9hdCBEQVRFVElNRSBOVUxMLCBLRVkgZW1haWwoZW1haWwpLCBLRVkgYmFuZ2EoYmFuZ2EpKSAiLiR3cGRiLT5nZXRfY2hhcnNldF9jb2xsYXRlKCkpOwogICAgICAkc3Q9WydhcmNoeXZ1b3RhJz0+MCwnaXN0cmludGEnPT4wLCdrbGFpZGEnPT4wXTsgJGtsPVtdOyAkY2h1bms9W107CiAgICAgIGZvcmVhY2goJGthbmQgYXMgJGVtPT4keCl7IGlmKCEkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkIEZST00gJEEgV0hFUkUgZW1haWw9JXMgQU5EIGJhbmdhPScxJyBBTkQgZ3JhemludGFfYXQgSVMgTlVMTCIsJGVtKSkpeyAkd3BkYi0+aW5zZXJ0KCRBLFsnZW1haWwnPT4kZW0sJ2NpZCc9PiR4WydrJ11bJ2NpZCddPz9udWxsLCdiYW5nYSc9PicxJywnZ3J1cGVzJz0+aW1wbG9kZSgnLCcsJHhbJ3MnXVsnZ3InXSksJ3NlbmRlcl9idXNlbmEnPT4keFsncyddWydzdCddLCdrbGlrX24nPT4keFsnayddWydrbGlrX24nXT8/bnVsbCwnaXNpbXRhX2F0Jz0+Y3VycmVudF90aW1lKCdteXNxbCcsdHJ1ZSksJ3ByaWV6YXN0aXMnPT4nc2VuZGVyX2xpbWl0YXNfMTAwMCddKTsgJHN0WydhcmNoeXZ1b3RhJ10rKzsgfQogICAgICAgIGlmKCR4WydrJ10pICR3cGRiLT51cGRhdGUoJEssWydiYW5nYSc9PicxJ10sWydpZCc9PiR4WydrJ11bJ2lkJ10sJ2JhbmdhJz0+bnVsbF0pOwogICAgICAgICRjaHVua1tdPSRlbTsgaWYoY291bnQoJGNodW5rKT49NTApeyAkZD0kYXBpKCdERUxFVEUnLCcvc3Vic2NyaWJlcnMnLFsnc3Vic2NyaWJlcnMnPT4kY2h1bmtdKTsgaWYoJGRbJ2NvZGUnXT49MjAwJiYkZFsnY29kZSddPDMwMCkgJHN0Wydpc3RyaW50YSddKz1jb3VudCgkY2h1bmspOyBlbHNlIHsgJHN0WydrbGFpZGEnXSs9Y291bnQoJGNodW5rKTsgJGtsW109WyRkWydjb2RlJ10sbWJfc3Vic3RyKGpzb25fZW5jb2RlKCRkWydib2R5J10sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSksMCwyMDApXTsgfSAkY2h1bms9W107IGlmKG1pY3JvdGltZSh0cnVlKS0kVDA+MTQwKSBicmVhazsgfSB9CiAgICAgIGlmKCRjaHVuayl7ICRkPSRhcGkoJ0RFTEVURScsJy9zdWJzY3JpYmVycycsWydzdWJzY3JpYmVycyc9PiRjaHVua10pOyBpZigkZFsnY29kZSddPj0yMDAmJiRkWydjb2RlJ108MzAwKSAkc3RbJ2lzdHJpbnRhJ10rPWNvdW50KCRjaHVuayk7IGVsc2UgeyAkc3RbJ2tsYWlkYSddKz1jb3VudCgkY2h1bmspOyAka2xbXT1bJGRbJ2NvZGUnXSxtYl9zdWJzdHIoanNvbl9lbmNvZGUoJGRbJ2JvZHknXSxKU09OX1VORVNDQVBFRF9VTklDT0RFKSwwLDIwMCldOyB9IH0KICAgICAgJHJbJ3N0J109JHN0OyAkclsna2xhaWRvcyddPSRrbDsgJHJbJ2FyY2h5dmUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkQSIpOwogICAgICAkcHY9YXJyYXlfc2xpY2UoYXJyYXlfa2V5cygka2FuZCksMCwzKTsgZm9yZWFjaCgkcHYgYXMgJGUpeyAkZz0kYXBpKCdHRVQnLCcvc3Vic2NyaWJlcnMvJy5yYXd1cmxlbmNvZGUoJGUpKTsgJHJbJ3BhdGlrcmEnXVtdPSRnWydjb2RlJ107IH0KICAgICAgJHNiMj0kc21hcCgpOyAkclsncG8nXT1bJ3Zpc28nPT5jb3VudCgkc2IyKSwnYWt0eXZ1cyc9PmNvdW50KGFycmF5X2ZpbHRlcigkc2IyLGZ1bmN0aW9uKCR4KXtyZXR1cm4gJHhbJ3N0J109PT0nYWN0aXZlJzt9KSldOyB9CiAgfSBjYXRjaChUaHJvd2FibGUgJGUpeyAkclsnS0xBSURBJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sMSk7Cg==';
const VER='dep-162119';
const GKEY='ps_s1807ar';
const PHASES=["2"];
const OUT='analize/s1807_ar2.json';
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
