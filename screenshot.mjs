process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQwazIgcmVsYXVuY2ggZ3J1cGVzIHBhZ2FsIHBzX2lzdF91enNha3ltYWkgQkUgUElJICgxIHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzQwazInXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE1MCk7IGdsb2JhbCAkd3BkYjsgJHI9Wyd2Jz0+J1MxNzQwazInXTsgJEs9JHdwZGItPnByZWZpeC4ncHNfcmVsYXVuY2hfa29udGFrdGFpJzsgJE89JHdwZGItPnByZWZpeC4nd2Nfb3JkZXJzJzsgJEk9JHdwZGItPnByZWZpeC4ncHNfaXN0X3V6c2FreW1haSc7CiAgdHJ5ewogICAgJHdwZGItPnF1ZXJ5KCJEUk9QIFRFTVBPUkFSWSBUQUJMRSBJRiBFWElTVFMgcHNfdG1wX25hdWppIik7ICR3cGRiLT5xdWVyeSgiRFJPUCBURU1QT1JBUlkgVEFCTEUgSUYgRVhJU1RTIHBzX3RtcF9pc3QiKTsKICAgICR3cGRiLT5xdWVyeSgiQ1JFQVRFIFRFTVBPUkFSWSBUQUJMRSBwc190bXBfbmF1amkgKGUgVkFSQ0hBUigxOTEpIFBSSU1BUlkgS0VZKSBTRUxFQ1QgRElTVElOQ1QgTE9XRVIoYmlsbGluZ19lbWFpbCkgZSBGUk9NICRPIFdIRVJFIHR5cGU9J3Nob3Bfb3JkZXInIEFORCBzdGF0dXMgSU4gKCd3Yy1wcm9jZXNzaW5nJywnd2MtY29tcGxldGVkJywnd2Mtb24taG9sZCcpIEFORCBkYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0wOS0wOCcgQU5EIGJpbGxpbmdfZW1haWw8PicnIik7CiAgICAkd3BkYi0+cXVlcnkoIkNSRUFURSBURU1QT1JBUlkgVEFCTEUgcHNfdG1wX2lzdCAoZSBWQVJDSEFSKDE5MSkgUFJJTUFSWSBLRVksIHBhc2sgREFURSwgbiBJTlQsIHN1bWExMiBERUNJTUFMKDEyLDIpKSBTRUxFQ1QgTE9XRVIoZW1haWwpIGUsIERBVEUoTUFYKGRhdGEpKSBwYXNrLCBDT1VOVCgqKSBuLCBTVU0oQ0FTRSBXSEVOIGRhdGE+PUNVUkRBVEUoKS1JTlRFUlZBTCAxMiBNT05USCBUSEVOIHN1bWEgRUxTRSAwIEVORCkgc3VtYTEyIEZST00gJEkgV0hFUkUgaXZ5a2R5dGFzPTEgQU5EIGVtYWlsPD4nJyBHUk9VUCBCWSBMT1dFUihlbWFpbCkiKTsKICAgICRiPSJDQVNFIFdIRU4gaS5wYXNrIElTIE5VTEwgVEhFTiAneF9uZXBpcmtvJyBXSEVOIGkucGFzaz49Q1VSREFURSgpLUlOVEVSVkFMIDYgTU9OVEggVEhFTiAnYV8wLTYnIFdIRU4gaS5wYXNrPj1DVVJEQVRFKCktSU5URVJWQUwgMTIgTU9OVEggVEhFTiAnYl82LTEyJyBXSEVOIGkucGFzaz49Q1VSREFURSgpLUlOVEVSVkFMIDI0IE1PTlRIIFRIRU4gJ2NfMTItMjQnIEVMU0UgJ2RfMjQrJyBFTkQiOwogICAgJHJbJ2dydXBlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICRiIGcsIENPVU5UKCopIG4sIFNVTShrLmNvbnNlbnQ9MSkgc3V0aWssIFNVTShrLnNlZ21lbnRhcz0nY2FsYycpIGNhbGMsIFNVTShrLnNlZ21lbnRhcz0ncHJvZHVjdCcpIHByb2QsIFNVTShrLnNlZ21lbnRhcz0nZ2VuZXJpYycpIGdlbiwgU1VNKENPQUxFU0NFKGkubiwwKT49MykgbG9qMywgUk9VTkQoU1VNKENPQUxFU0NFKGkuc3VtYTEyLDApKSkgZXVyMTIgRlJPTSAkSyBrIExFRlQgSk9JTiBwc190bXBfaXN0IGkgT04gaS5lPUxPV0VSKGsuZW1haWwpIExFRlQgSk9JTiBwc190bXBfbmF1amkgbiBPTiBuLmU9TE9XRVIoay5lbWFpbCkgV0hFUkUgbi5lIElTIE5VTEwgR1JPVVAgQlkgMSBPUkRFUiBCWSAxIixBUlJBWV9BKTsKICAgICRyWydwaXJrb19uYXVqb2plJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJEsgayBKT0lOIHBzX3RtcF9uYXVqaSBuIE9OIG4uZT1MT1dFUihrLmVtYWlsKSIpOwogICAgJHJbJ25hdWpvamVfcGlya2VfbmF1amlfa2xpZW50YWlfbmVfaXNfYmF6ZXMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBwc190bXBfbmF1amkgbiBMRUZUIEpPSU4gJEsgayBPTiBMT1dFUihrLmVtYWlsKT1uLmUgV0hFUkUgay5pZCBJUyBOVUxMIik7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-184706';
const GKEY='ps_s1740k2';
const PHASES=["1"];
const OUT='analize/s1740k2.json';
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
