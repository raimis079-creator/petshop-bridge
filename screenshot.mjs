process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODY3bCBTb3VyY2VzIGtvZGFzIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTg2N2wnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE0MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxODY3bCddOwogICRjPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgaWQsbmFtZSxMRU5HVEgoY29kZSkgbGVuLG1vZGlmaWVkLGNvZGUgRlJPTSB7JFB9c25pcHBldHMgV0hFUkUgaWQ9MjUxNSIsQVJSQVlfQSk7CiAgJHJbJ21ldGEnXT1bJ25hbWUnPT4kY1snbmFtZSddLCdsZW4nPT4kY1snbGVuJ10sJ21vZGlmaWVkJz0+JGNbJ21vZGlmaWVkJ11dOyAkclsnY29kZSddPSRjWydjb2RlJ107CiAgJHJbJ21lbSddPVsnV1BfTUVNT1JZX0xJTUlUJz0+ZGVmaW5lZCgnV1BfTUVNT1JZX0xJTUlUJyk/V1BfTUVNT1JZX0xJTUlUOm51bGwsJ1dQX01BWCc9PmRlZmluZWQoJ1dQX01BWF9NRU1PUllfTElNSVQnKT9XUF9NQVhfTUVNT1JZX0xJTUlUOm51bGwsJ2luaSc9PmluaV9nZXQoJ21lbW9yeV9saW1pdCcpXTsKICAkclsnYmVfc2FuZGVsaW9fbmF1amknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLnBvc3Rfc3RhdHVzIHN0LCBDT1VOVCgqKSBuIEZST00geyRQfXBvc3RzIHAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3RfZGF0ZT49JzIwMjYtMTEtMTIgMDY6MjAnIEFORCBOT1QgRVhJU1RTKFNFTEVDVCAxIEZST00geyRQfXBvc3RtZXRhIG0gV0hFUkUgbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXk9J19wc19zYW5kZWxpcycgQU5EIG0ubWV0YV92YWx1ZTw+JycpIEdST1VQIEJZIDEiLEFSUkFZX0EpOwogICRyWydzdV9zYW5kZWxpdV9uYXVqaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAucG9zdF9zdGF0dXMgc3QsIG0ubWV0YV92YWx1ZSBzLCBDT1VOVCgqKSBuIEZST00geyRQfXBvc3RzIHAgSk9JTiB7JFB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0nX3BzX3NhbmRlbGlzJyBBTkQgbS5tZXRhX3ZhbHVlPD4nJyBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9kYXRlPj0nMjAyNi0xMS0xMiAwNjoyMCcgR1JPVVAgQlkgMSwyIixBUlJBWV9BKTsKICAkclsncHJvZF9uJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG9zdF90eXBlLCBDT1VOVCgqKSBuIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfdHlwZSBJTigncHJvZHVjdCcsJ3Byb2R1Y3RfdmFyaWF0aW9uJykgQU5EIHBvc3Rfc3RhdHVzPD4ndHJhc2gnIEdST1VQIEJZIDEiLEFSUkFZX0EpOwogICRyWydwb3N0bWV0YV9uJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wb3N0bWV0YSBwbSBKT0lOIHskUH1wb3N0cyBwIE9OIHAuSUQ9cG0ucG9zdF9pZCBXSEVSRSBwLnBvc3RfdHlwZSBJTigncHJvZHVjdCcsJ3Byb2R1Y3RfdmFyaWF0aW9uJykiKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7IH0pOwo=';
const VER='dep-092644';
const GKEY='ps_s1867l';
const PHASES=["1"];
const OUT='analize/s1867_l.json';
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
