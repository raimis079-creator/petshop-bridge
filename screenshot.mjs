process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODkwcSBrdXJqZXJpcyBwYWdhbCBzdm9yaSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4OTBxJ10pKSByZXR1cm47ICRyPVsndic9PidxMSddOyBnbG9iYWwgJHdwZGI7CiAgdHJ5ewogICAgJHN1bms9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCwgQ0FTVChtLm1ldGFfdmFsdWUgQVMgREVDSU1BTCgxMCwyKSkgdyBGUk9NIHskd3BkYi0+cG9zdHN9IHAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBtIE9OIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdfd2VpZ2h0JyBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBDQVNUKG0ubWV0YV92YWx1ZSBBUyBERUNJTUFMKDEwLDIpKSBCRVRXRUVOIDExIEFORCAxNiBMSU1JVCAxIixBUlJBWV9BKTsKICAgICRoPShpbnQpJHN1bmtbMF1bJ0lEJ107ICRyWydzdW5raSddPVskaCxnZXRfdGhlX3RpdGxlKCRoKSwkc3Vua1swXVsndyddLGdldF9wb3N0X21ldGEoJGgsJ19wc190aWtfa3VyamVyaXUnLHRydWUpXTsKICAgICRtaz1mdW5jdGlvbigkaXRlbXMpeyAkYz1bXTskY29zdD0wOyBmb3JlYWNoKCRpdGVtcyBhcyAkaXQpeyAkcD13Y19nZXRfcHJvZHVjdCgkaXRbMF0pOyAkbD0oZmxvYXQpd2NfZ2V0X3ByaWNlX2V4Y2x1ZGluZ190YXgoJHAsWydxdHknPT4kaXRbMV1dKTsgJGNbXT1bJ2RhdGEnPT4kcCwncXVhbnRpdHknPT4kaXRbMV0sJ3Byb2R1Y3RfaWQnPT4kaXRbMF0sJ3ZhcmlhdGlvbl9pZCc9PjAsJ2xpbmVfdG90YWwnPT4kbCwnbGluZV90YXgnPT4wLCdsaW5lX3N1YnRvdGFsJz0+JGwsJ2xpbmVfc3VidG90YWxfdGF4Jz0+MF07ICRjb3N0Kz0kbDsgfQogICAgICByZXR1cm4gWydjb250ZW50cyc9PiRjLCdjb250ZW50c19jb3N0Jz0+JGNvc3QsJ2NhcnRfc3VidG90YWwnPT4kY29zdCoxLjIxLCdhcHBsaWVkX2NvdXBvbnMnPT5bXSwndXNlcic9PlsnSUQnPT4wXSwnZGVzdGluYXRpb24nPT5bJ2NvdW50cnknPT4nTFQnLCdzdGF0ZSc9PicnLCdwb3N0Y29kZSc9PicwMTEwMCcsJ2NpdHknPT4nVmlsbml1cycsJ2FkZHJlc3MnPT4nVGVzdG8gZy4gMScsJ2FkZHJlc3NfMSc9PidUZXN0byBnLiAxJywnYWRkcmVzc18yJz0+JyddXTsgfTsKICAgICRhdHY9WydsZW5ndmEnPT5bWzE2OTUwLDFdXSwnMTJrZyc9PltbJGgsMV1dLCcyNGtnJz0+W1skaCwyXV0sJzM2a2cnPT5bWyRoLDNdXSwnNjBrZyc9PltbJGgsNV1dXTsKICAgIGZvcmVhY2goJGF0diBhcyAkaz0+JGl0ZW1zKXsgJHBrZz0kbWsoJGl0ZW1zKTsKICAgICAgJHpvbmU9V0NfU2hpcHBpbmdfWm9uZXM6OmdldF96b25lX21hdGNoaW5nX3BhY2thZ2UoJHBrZyk7ICRyWyd6b25hJ109JHpvbmUtPmdldF96b25lX25hbWUoKTsKICAgICAgZm9yZWFjaCgkem9uZS0+Z2V0X3NoaXBwaW5nX21ldGhvZHModHJ1ZSkgYXMgJG0peyBpZigkbS0+aWQhPT0nc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfY291cmllcl9tZXRob2QnKSBjb250aW51ZTsKICAgICAgICAkcmF0ZXM9JG0tPmdldF9yYXRlc19mb3JfcGFja2FnZSgkcGtnKTsgZm9yZWFjaCgoYXJyYXkpJHJhdGVzIGFzICRydCl7ICRyWyRrXVsndGllc2lhaSddPXJvdW5kKChmbG9hdCkkcnQtPmdldF9jb3N0KCkrYXJyYXlfc3VtKChhcnJheSkkcnQtPmdldF90YXhlcygpKSwyKTsgfQogICAgICAgICRyWydtZXQnXT1bJ2NsYXNzJz0+Z2V0X2NsYXNzKCRtKSwnaW5zdCc9PiRtLT5nZXRfaW5zdGFuY2VfaWQoKSwndGl0bGUnPT4kbS0+Z2V0X3RpdGxlKCldOyB9CiAgICAgICRyZXM9V0MoKS0+c2hpcHBpbmcoKS0+Y2FsY3VsYXRlX3NoaXBwaW5nKFskcGtnXSk7IGZvcmVhY2goKGFycmF5KSgkcmVzWzBdWydyYXRlcyddPz9bXSkgYXMgJHJ0KXsgaWYoJHJ0LT5nZXRfbWV0aG9kX2lkKCk9PT0nc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfY291cmllcl9tZXRob2QnKSAkclska11bJ3N1X2ZpbHRyYWlzJ109cm91bmQoKGZsb2F0KSRydC0+Z2V0X2Nvc3QoKSthcnJheV9zdW0oKGFycmF5KSRydC0+Z2V0X3RheGVzKCkpLDIpOyB9CiAgICB9CiAgICAkaGl0cz1bXTsgZm9yZWFjaChhcnJheV9tZXJnZShnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJyksW2dldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvZnVuY3Rpb25zLnBocCddKSBhcyAkZil7ICR0PWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgaWYoc3RycG9zKCR0LCd3b29jb21tZXJjZV9wYWNrYWdlX3JhdGVzJykhPT1mYWxzZSkgJGhpdHNbXT1iYXNlbmFtZSgkZik7IH0gJHJbJ3BhY2thZ2VfcmF0ZXNfZmlsdHJhaSddPSRoaXRzOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDEpOwo=';
const VER='dep-192426';
const GKEY='ps_s1890q';
const PHASES=["GO"];
const OUT='analize/s1890_q.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
