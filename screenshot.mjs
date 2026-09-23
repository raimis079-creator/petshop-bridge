process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcwNm0nXSkpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRyPVtdOyAkVD0ieyRwfXBzX3dlYl9pdnlraWFpIjsKICAkcT1mdW5jdGlvbigkaywkc3FsKSB1c2UoJiRyLCR3cGRiKXsgJHJbJGtdPSR3cGRiLT5nZXRfcmVzdWx0cygkc3FsLEFSUkFZX0EpOyBpZigkd3BkYi0+bGFzdF9lcnJvcikgJHJbJGsuJ19lcnInXT0kd3BkYi0+bGFzdF9lcnJvcjsgfTsKICAkVz0iZGllbmEgQkVUV0VFTiAnMjAyNi0wOS0wOScgQU5EICcyMDI2LTA5LTIyJyBBTkQgdGVzdGluaXM9MCBBTkQgc2FsdGluaXNfYXBsaW5rYT0ncHJvZCciOwogICRxKCd0b3AnLCJTRUxFQ1QgTEVGVChsYW5reXRvamFzX2QsOCkgbCwgQ09VTlQoRElTVElOQ1QgZGllbmEpIGQsIFNVTSh0aXBhcz0ncGFnZXZpZXcnKSBwdiwgU1VNKHRpcGFzPSdhZGRfdG9fY2FydCcpIGF0YywgU1VNKHRpcGFzPSdiZWdpbl9jaGVja291dCcpIGJjLCBTVU0ocHVzbF90aXBhcz0nYWNpdScpIGFjaXUsIE1BWChpcmVuZ2lueXMpIGlyLCBNQVgobmFyc19zZWltYSkgbiwgTUFYKHNhbGlzKSBzLCBNQVgoa2FuYWxhcykgaywgTUFYKHByaXNpanVuZ2VzKSBwciwgU1VNKHVybF9rZWxpYXMgTElLRSAnJXdwLWFkbWluJScgT1IgdXJsX2tlbGlhcyBMSUtFICclZGFyYmFsYXVrJScpIGFkbSBGUk9NICRUIFdIRVJFICRXIEdST1VQIEJZIGxhbmt5dG9qYXNfZCBPUkRFUiBCWSBwdiBERVNDIExJTUlUIDE1Iik7CiAgJHEoJ2xhbmtfbXVsdGknLCJTRUxFQ1QgQ09VTlQoKikgbGFuaywgU1VNKGQ+MSkgZ3Jpem8gRlJPTSAoU0VMRUNUIGxhbmt5dG9qYXNfZCwgQ09VTlQoRElTVElOQ1QgZGllbmEpIGQgRlJPTSAkVCBXSEVSRSAkVyBHUk9VUCBCWSAxKSB4Iik7CiAgJHEoJ2thbl9sYW5kaW5nJywiU0VMRUNUIGxhbmRpbmcsIENPQUxFU0NFKGthbmFsYXMsJ05VTEwnKSBrLCBDT1VOVCgqKSBuIEZST00gJFQgV0hFUkUgJFcgQU5EIHRpcGFzPSdwYWdldmlldycgR1JPVVAgQlkgMSwyIE9SREVSIEJZIDEsMyBERVNDIik7CiAgJHEoJ2thbl9sYW5rJywiU0VMRUNUIENPQUxFU0NFKGssJ05VTEwnKSBrLCBDT1VOVCgqKSBsYW5rX2QsIFNVTShwdj0xKSB2aWVuYXMsIFNVTShiYz4wKSBiYywgU1VNKGFjPjApIGFjaXUgRlJPTSAoU0VMRUNUIGRpZW5hLCBsYW5reXRvamFzX2QsIE1BWChrYW5hbGFzKSBrLCBTVU0odGlwYXM9J3BhZ2V2aWV3JykgcHYsIFNVTSh0aXBhcz0nYmVnaW5fY2hlY2tvdXQnKSBiYywgU1VNKHB1c2xfdGlwYXM9J2FjaXUnKSBhYyBGUk9NICRUIFdIRVJFICRXIEdST1VQIEJZIDEsMikgeCBHUk9VUCBCWSAxIE9SREVSIEJZIDIgREVTQyIpOwogICRxKCdkZXZfbGFuaycsIlNFTEVDVCBpciwgQ09VTlQoKikgbGFua19kLCBTVU0oYXRjPjApIGF0YywgU1VNKGJjPjApIGJjLCBTVU0oYWM+MCkgYWNpdSBGUk9NIChTRUxFQ1QgZGllbmEsIGxhbmt5dG9qYXNfZCwgTUFYKGlyZW5naW55cykgaXIsIFNVTSh0aXBhcz0nYWRkX3RvX2NhcnQnKSBhdGMsIFNVTSh0aXBhcz0nYmVnaW5fY2hlY2tvdXQnKSBiYywgU1VNKHB1c2xfdGlwYXM9J2FjaXUnKSBhYyBGUk9NICRUIFdIRVJFICRXIEdST1VQIEJZIDEsMikgeCBHUk9VUCBCWSAxIik7CiAgJHEoJ2JvdF9saWtlJywiU0VMRUNUIENPVU5UKCopIGxhbmtfZCwgU1VNKHB2KSBwdiBGUk9NIChTRUxFQ1QgZGllbmEsIGxhbmt5dG9qYXNfZCwgU1VNKHRpcGFzPSdwYWdldmlldycpIHB2LCBTVU0odGlwYXM8PidwYWdldmlldycpIGtpdGksIE1BWChzYWxpcykgcyBGUk9NICRUIFdIRVJFICRXIEdST1VQIEJZIDEsMikgeCBXSEVSRSBraXRpPTAgQU5EIHB2PTEiKTsKICAkc3JjPShzdHJpbmcpQGZpbGVfZ2V0X2NvbnRlbnRzKFdQX0NPTlRFTlRfRElSLicvbXUtcGx1Z2lucy9wZXRzaG9wLWl2eWtpYWkucGhwJyk7ICRMPWV4cGxvZGUoIlxuIiwkc3JjKTsKICAkclsnc3JjXzE5MF8yNjAnXT1hcnJheV9tYXAoZnVuY3Rpb24oJGkpdXNlKCRMKXtyZXR1cm4gKCRpKzEpLic6ICcuc3Vic3RyKCRMWyRpXT8/JycsMCwyMDApO30sIHJhbmdlKDE1MCwyNjIpKTsKICB3cF9zZW5kX2pzb24oJHIpOwp9LCAxKTsK';
const VER='dep-114724';
const GKEY='ps_s1706m';
const PHASES=["GO"];
const OUT='analize/s1706_mc.json';
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
