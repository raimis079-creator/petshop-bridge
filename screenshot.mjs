process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODE2c3QgYmVzdHNlbGVyaWFpIGJlIGxpa3VjaW8gKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODE2c3QnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4MTZzdCddOwogICR0b3A9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZS5wcmVrZV9pZCBwaWQsIGUudmFyaWFjaWphX2lkIHZpZCwgTEVGVChNQVgoZS5wYXZhZGluaW1hc190dW9fbWV0dSksNzApIHAsIFNVTShlLmtpZWtpcykgaywgQ09VTlQoRElTVElOQ1QgZS51enNha3ltYXNfaWQpIHV6cywgUk9VTkQoU1VNKGUua2FpbmFfY3QtZS5zYXZpa2FpbmFfY3QpLzEwMCkgbWFyemEsIE1BWChlLnNhbmRlbGlzKSBzIEZST00geyRQfXBzX2Zha3RfZWlsdXRlcyBlIEpPSU4geyRQfXBzX2Zha3RfdXpzYWt5bWFpIHUgT04gdS51enNha3ltYXNfaWQ9ZS51enNha3ltYXNfaWQgQU5EIHUudGVzdGluaXM9MCBBTkQgdS5zdGF0dXNhc19nYWx1dGluaXMgTk9UIElOKCdjYW5jZWxsZWQnLCdmYWlsZWQnLCdyZWZ1bmRlZCcsJ3BlbmRpbmcnKSBXSEVSRSBlLmRpZW5hPj0nMjAyNi0wOS0wOScgR1JPVVAgQlkgMSwyIE9SREVSIEJZIHV6cyBERVNDIExJTUlUIDE1MCIsQVJSQVlfQSk7CiAgJG91dD1bXTsgJG49MDsgZm9yZWFjaCgkdG9wIGFzICR0KXsgJGlkPShpbnQpKCR0Wyd2aWQnXT86JHRbJ3BpZCddKTsgJHByPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcHIpIGNvbnRpbnVlOyAkbisrOwogICAgJHN0PSRwci0+Z2V0X3N0b2NrX3N0YXR1cygpOyAkcT0kcHItPmdldF9zdG9ja19xdWFudGl0eSgpOyAkdmlzPSRwci0+Z2V0X2NhdGFsb2dfdmlzaWJpbGl0eSgpOyAkcHM9Z2V0X3Bvc3Rfc3RhdHVzKCR0WydwaWQnXSk7CiAgICBpZigkc3QhPT0naW5zdG9jayd8fCRwcyE9PSdwdWJsaXNoJ3x8JHZpcz09PSdoaWRkZW4nKSAkb3V0W109WyRuLCRpZCwkdFsncCddLCR0Wyd1enMnXSwkdFsnayddLCR0WydtYXJ6YSddLCR0WydzJ10sJHN0LCRxLCRwcywkdmlzLChzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkdFsncGlkJ10sJ19wc19zYW5kZWxpcycsdHJ1ZSksKHN0cmluZylnZXRfcG9zdF9tZXRhKCR0WydwaWQnXSwnX3BzX2Ryb3BzaGlwX3Bhc2xlcHRhJyx0cnVlKV07IH0KICAkclsnZXJyJ109JHdwZGItPmxhc3RfZXJyb3I7ICRyWyd0b3BfbiddPWNvdW50KCR0b3ApOyAkclsndGlrcmludGEnXT0kbjsgJHJbJ2JlX2xpa3VjaW8nXT0kb3V0OyAkclsnbl9iZSddPWNvdW50KCRvdXQpOwogIC8vIGJlbmRyYXMgdmFpemRhczoga2llayBwdWJsaXNoIHByZWtpdSBvdXRvZnN0b2NrIHBhZ2FsIHNhbmRlbGkKICAkclsndmlzb19vb3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBDT0FMRVNDRShzLm1ldGFfdmFsdWUsJz8nKSBzYW5kLCBDT1VOVCgqKSBuIEZST00geyRQfXBvc3RzIHAgSk9JTiB7JFB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0nX3N0b2NrX3N0YXR1cycgQU5EIG0ubWV0YV92YWx1ZT0nb3V0b2ZzdG9jaycgTEVGVCBKT0lOIHskUH1wb3N0bWV0YSBzIE9OIHMucG9zdF9pZD1wLklEIEFORCBzLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgR1JPVVAgQlkgMSIsQVJSQVlfQSk7CiAgJHJbJ3Zpc29fcHVibGlzaCddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIik7CiAgLy8gYXIgeXJhIHN0b2NrX3dhdGNoIChwcmFuZXN0aSBrYWkgYnVzKSBsYXVraWFuY2l1CiAgJHJbJ2xhdWtpYV9wcmFuZXNldGknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwcm9kdWN0X2lkLCBDT1VOVCgqKSBuIEZST00geyRQfXBzX3N0b2NrX3dhdGNoIFdIRVJFIHN0YXR1cz0nd2FpdGluZycgR1JPVVAgQlkgMSBPUkRFUiBCWSAyIERFU0MgTElNSVQgMTAiLEFSUkFZX0EpOwogIC8vIHJ5dGFzOiBhciBqYXUgeXJhIGxpa3VjaXUgcGF0aWtyYQogICRzPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Atcnl0YXMucGhwJyk7ICRyWydyeXRhc19tZDUnXT1tZDUoJHMpOyAkclsncnl0YXNfbGVuJ109c3RybGVuKCRzKTsgcHJlZ19tYXRjaF9hbGwoIiNrb2Rhc1snXCJdP1xzKj0+XHMqWydcIl0oW2Etel8wLTldKykjIiwkcywkbSk7ICRyWydyeXRhc19rb2RhaSddPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJG1bMV0pKTsgcHJlZ19tYXRjaF9hbGwoJyNmdW5jdGlvblxzKyhcdyspIycsJHMsJGYpOyAkclsncnl0YXNfZnVua2Npam9zJ109JGZbMV07CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0OyB9KTsK';
const VER='dep-123949';
const GKEY='ps_s1816st';
const PHASES=["1"];
const OUT='analize/s1816_st.json';
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
