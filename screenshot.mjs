process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODE4YSBPbnRhcmlvL01pYW1vciBsaWt1xI1pYWkgKyBwYXJkYXZpbWFpIHBhZ2FsIG3El24uIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfczE4MThhJ10pPyRfR0VUWydwc19zMTgxOGEnXTonJyk7IGlmKCRmIT09J0dPJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE4MThhJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIERJU1RJTkNUIHRyLm9iamVjdF9pZCBGUk9NIHskcH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgSk9JTiB7JHB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgQU5EIHR0LnRheG9ub215PSdwcm9kdWN0X2JyYW5kJyBKT0lOIHskcH10ZXJtcyB0IE9OIHQudGVybV9pZD10dC50ZXJtX2lkIFdIRVJFIExPV0VSKHQubmFtZSkgSU4gKCdvbnRhcmlvJywnbWlhbW9yJykiKTsKICAgICRpZHMyPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgSUQgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF90eXBlIElOICgncHJvZHVjdCcsJ3Byb2R1Y3RfdmFyaWF0aW9uJykgQU5EIHBvc3Rfc3RhdHVzIElOICgncHVibGlzaCcsJ2RyYWZ0JywncHJpdmF0ZScpIEFORCAocG9zdF90aXRsZSBMSUtFICclT250YXJpbyUnIE9SIHBvc3RfdGl0bGUgTElLRSAnJU1pYW1vciUnKSIpOwogICAgJGlkcz1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKGFycmF5X21hcCgnaW50dmFsJyxhcnJheV9tZXJnZSgkaWRzLCRpZHMyKSkpKTsKICAgICRvWyduJ109Y291bnQoJGlkcyk7CiAgICAkYXY9Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FWX1NvdXJjZScpOwogICAgJHByb2Q9YXJyYXkoKTsKICAgIGZvcmVhY2goJGlkcyBhcyAkaWQpewogICAgICAkcG89Z2V0X3Bvc3QoJGlkKTsgaWYoISRwbykgY29udGludWU7CiAgICAgICRtPWZ1bmN0aW9uKCRrKSB1c2UoJGlkKXsgcmV0dXJuIGdldF9wb3N0X21ldGEoJGlkLCRrLHRydWUpOyB9OwogICAgICAkYXZxPW51bGw7IGlmKCRhdil7IHRyeXsgJHI9UGV0c2hvcF9BVl9Tb3VyY2U6OnJlc29sdmUoJGlkKTsgJGF2cT1pc19hcnJheSgkcikmJmlzc2V0KCRyWydhdl9xdHknXSk/JHJbJ2F2X3F0eSddOm51bGw7ICRzcmM9aXNfYXJyYXkoJHIpJiZpc3NldCgkclsnc291cmNlJ10pPyRyWydzb3VyY2UnXTpudWxsOyB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHNyYz0nZXJyJzsgfSB9CiAgICAgICRicj13cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfYnJhbmQnLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSk7CiAgICAgICRwcm9kWyRpZF09YXJyYXkoJ3QnPT4kcG8tPnBvc3RfdGl0bGUsJ3N0Jz0+JHBvLT5wb3N0X3N0YXR1cywndHlwZSc9PiRwby0+cG9zdF90eXBlLCdza3UnPT4kbSgnX3NrdScpLCdzYW5kJz0+JG0oJ19wc19zYW5kZWxpcycpLCdzdG9jayc9PiRtKCdfc3RvY2snKSwnb3duJz0+JG0oJ19vd25fc3RvY2tfcXR5JyksJ21uZyc9PiRtKCdfbWFuYWdlX3N0b2NrJyksJ3NzJz0+JG0oJ19zdG9ja19zdGF0dXMnKSwnYXYnPT4kYXZxLCdzcmMnPT5pc3NldCgkc3JjKT8kc3JjOm51bGwsJ2Nvc3QnPT4kbSgnX2Nvc3RfcHJpY2UnKSwncHJpY2UnPT4kbSgnX3ByaWNlJyksJ2Vhbic9PiRtKCdfZ2xvYmFsX3VuaXF1ZV9pZCcpLCdicic9PmlzX2FycmF5KCRicik/aW1wbG9kZSgnLCcsJGJyKTonJywKICAgICAgICAnc3Jjcyc9PiR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIHNvdXJjZSxzdG9ja19xdHksY29zdF9uZXQsaXNfYWN0aXZlLHN1cHBsaWVyX3NrdSBGUk9NIHskcH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQ9JWQiLCRpZCksQVJSQVlfQSkpOwogICAgICBpZigkd3BkYi0+bGFzdF9lcnJvcil7ICRwcm9kWyRpZF1bJ3NyY3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBzb3VyY2Usc3RvY2tfcXR5LGNvc3RfbmV0LGlzX2FjdGl2ZSBGUk9NIHskcH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQ9JWQiLCRpZCksQVJSQVlfQSk7IH0KICAgIH0KICAgICRvWydwcm9kJ109JHByb2Q7CiAgICAkaW49JGlkcz9pbXBsb2RlKCcsJywkaWRzKTonMCc7CiAgICAvLyBpc3RvcmluaWFpIChlU2hvcHJlbnQpCiAgICAkb1snaXN0X2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRwfXBzX2lzdF9mYWt0X2VpbHV0ZXMiLDApOwogICAgJG9bJ2lzdF9yYW5nZSddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgTUlOKGRpZW5hKSBhLCBNQVgoZGllbmEpIGIsIENPVU5UKCopIG4gRlJPTSB7JHB9cHNfaXN0X2Zha3RfZWlsdXRlcyIsQVJSQVlfQSk7CiAgICAkb1snaXN0J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcHJla2VfaWQsIERBVEVfRk9STUFUKGRpZW5hLCclWS0lbScpIG1lbiwgU1VNKGtpZWtpcykgcSBGUk9NIHskcH1wc19pc3RfZmFrdF9laWx1dGVzIFdIRVJFIHByZWtlX2lkIElOICgkaW4pIEFORCBkaWVuYT49JzIwMjUtMDctMDEnIEdST1VQIEJZIHByZWtlX2lkLCBtZW4iLEFSUkFZX0EpOwogICAgLy8gbmF1amkgKFdDKQogICAgJG9bJ2Zha3RfcmFuZ2UnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIE1JTihhcG1va2V0YV9hdCkgYSwgTUFYKGFwbW9rZXRhX2F0KSBiLCBDT1VOVCgqKSBuIEZST00geyRwfXBzX2Zha3RfZWlsdXRlcyBXSEVSRSAodGVzdGluaXM9MCBPUiB0ZXN0aW5pcyBJUyBOVUxMKSIsQVJSQVlfQSk7CiAgICAkb1snZmFrdCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElGKHZhcmlhY2lqYV9pZD4wLHZhcmlhY2lqYV9pZCxwcmVrZV9pZCkgcGlkLCBwcmVrZV9pZCwgREFURV9GT1JNQVQoYXBtb2tldGFfYXQsJyVZLSVtJykgbWVuLCBzYW5kZWxpcywgU1VNKGtpZWtpcykgcSBGUk9NIHskcH1wc19mYWt0X2VpbHV0ZXMgV0hFUkUgKHByZWtlX2lkIElOICgkaW4pIE9SIHZhcmlhY2lqYV9pZCBJTiAoJGluKSkgQU5EICh0ZXN0aW5pcz0wIE9SIHRlc3RpbmlzIElTIE5VTEwpIEdST1VQIEJZIHBpZCwgcHJla2VfaWQsIG1lbiwgc2FuZGVsaXMiLEFSUkFZX0EpOwogICAgJG9bJ2VyciddPSR3cGRiLT5sYXN0X2Vycm9yOwogICAgLy8gcGFza3V0aW7El3MgMzAgZC4gcGFnYWwgZGllbsSFICh0ZW5kZW5jaWphaSkKICAgICRvWydmYWt0MzAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRih2YXJpYWNpamFfaWQ+MCx2YXJpYWNpamFfaWQscHJla2VfaWQpIHBpZCwgU1VNKGtpZWtpcykgcSBGUk9NIHskcH1wc19mYWt0X2VpbHV0ZXMgV0hFUkUgKHByZWtlX2lkIElOICgkaW4pIE9SIHZhcmlhY2lqYV9pZCBJTiAoJGluKSkgQU5EICh0ZXN0aW5pcz0wIE9SIHRlc3RpbmlzIElTIE5VTEwpIEFORCBhcG1va2V0YV9hdD49REFURV9TVUIoTk9XKCksSU5URVJWQUwgMzAgREFZKSBHUk9VUCBCWSBwaWQiLEFSUkFZX0EpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-114014';
const GKEY='ps_s1818a';
const PHASES=["GO"];
const OUT='analize/s1818_a.json';
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
