process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjg1IGNoZWNrb3V0IGxvZ2FpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfYmxrJ10pPyRfR0VUWydwc19ibGsnXTonJykhPT0nUicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNjg1YicsJ3dwJz0+Y3VycmVudF90aW1lKCdteXNxbCcpKTsKICBnbG9iYWwgJHdwZGI7CiAgdHJ5ewogICAgJGQ9V1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3djLWxvZ3MnOwogICAgZm9yZWFjaChzY2FuZGlyKCRkKSBhcyAkZil7CiAgICAgIGlmKHN0cnBvcygkZiwncGxhY2Utb3JkZXItZGVidWcnKSE9PTApIGNvbnRpbnVlOwogICAgICAkbXQ9ZmlsZW10aW1lKCRkLicvJy4kZik7IGlmKCRtdDx0aW1lKCktMTQ0MDApIGNvbnRpbnVlOwogICAgICAkb1snbG9nYWknXVtkYXRlKCdIOmk6cycsJG10KV09c3Vic3RyKGZpbGVfZ2V0X2NvbnRlbnRzKCRkLicvJy4kZiksMCwyMjAwKTsKICAgIH0KICAgIC8vIFBheXNlcmEgcGx1Z2lubyBsb2cgbHlnaXMgaXIgYXIgeXJhIGpvIGZhaWx1IGFwc2tyaXRhaQogICAgJG9bJ3BheXNlcmFfbG9nYWknXT1hcnJheSgpOwogICAgZm9yZWFjaChzY2FuZGlyKCRkKSBhcyAkZil7IGlmKHN0cmlwb3MoJGYsJ3BheXNlcmEnKSE9PWZhbHNlKSAkb1sncGF5c2VyYV9sb2dhaSddWyRmXT1maWxlc2l6ZSgkZC4nLycuJGYpOyB9CiAgICAvLyBLbGllbnRvIHV6c2FreW1haQogICAgJHQ9JHdwZGItPnByZWZpeC4nd2Nfb3JkZXJzJzsKICAgICRvWydrbGllbnRvJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsc3RhdHVzLGRhdGVfY3JlYXRlZF9nbXQscGF5bWVudF9tZXRob2QsdG90YWxfYW1vdW50LGN1c3RvbWVyX2lkIEZST00gJHQgV0hFUkUgYmlsbGluZ19lbWFpbD0ncHRvbWFzODg3QGdtYWlsLmNvbScgT1JERVIgQlkgaWQiLEFSUkFZX0EpOwogICAgLy8gYXIga2xpZW50YXMgdHVyaSBwYXNreXJhCiAgICAkdT1nZXRfdXNlcl9ieSgnZW1haWwnLCdwdG9tYXM4ODdAZ21haWwuY29tJyk7CiAgICAkb1sncGFza3lyYSddPSR1P2FycmF5KCdpZCc9PiR1LT5JRCwnc3VrdXJ0YSc9PiR1LT51c2VyX3JlZ2lzdGVyZWQpOidzdmXEjWlhcyc7CiAgICAvLyBMaWt1dGlzIGRhYmFyCiAgICAkcGlkPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIG1ldGFfa2V5PSdfc2t1JyBBTkQgbWV0YV92YWx1ZT0nNzIwMDAwJyBMSU1JVCAxIik7CiAgICAkb1sncHJla2UnXT1hcnJheSgnaWQnPT4kcGlkLCdwYXYnPT5zdWJzdHIoaHRtbF9lbnRpdHlfZGVjb2RlKGdldF90aGVfdGl0bGUoJHBpZCkpLDAsNDApLAogICAgICAnc3RvY2snPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19zdG9jaycsdHJ1ZSksJ3NhbmRlbGlzJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpKTsKICAgIC8vIEhvbGQnYWkKICAgICRvWydob2xkX21ldGEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBvcmRlcl9pZCxtZXRhX2tleSxMRUZUKG1ldGFfdmFsdWUsNjApIHYgRlJPTSB7JHdwZGItPnByZWZpeH13Y19vcmRlcnNfbWV0YSBXSEVSRSBvcmRlcl9pZCBJTiAoMzU4NzMsMzU4NzQsMzU4NzUpIEFORCBtZXRhX2tleSBMSUtFICclJWhvbGQlJSciKSxBUlJBWV9BKTsKICAgIC8vIFdDIG51c3RhdHltYWkgZGVsIGxhaWt5bW8KICAgICRvWyd3YyddPWFycmF5KAogICAgICAnaG9sZF9zdG9ja19taW51dGVzJz0+Z2V0X29wdGlvbignd29vY29tbWVyY2VfaG9sZF9zdG9ja19taW51dGVzJyksCiAgICAgICdtYW5hZ2Vfc3RvY2snPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9tYW5hZ2Vfc3RvY2snKSwKICAgICAgJ2dhdGV3YXlfb3JkZXInPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9nYXRld2F5X29yZGVyJyksCiAgICApOwogICAgLy8gQXIgbGlrdXRpcyBtYXppbmFtYXMga3VyaWFudCB1enNha3ltYSAobcWrc8WzIGtvZGFzKQogICAgZm9yZWFjaChzY2FuZGlyKFdQTVVfUExVR0lOX0RJUikgYXMgJGYpeyBpZihzdWJzdHIoJGYsLTQpIT09Jy5waHAnKSBjb250aW51ZTsKICAgICAgJGM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvJy4kZik7CiAgICAgICRuPXN1YnN0cl9jb3VudCgkYywncmVkdWNlX3N0b2NrJykrc3Vic3RyX2NvdW50KCRjLCdMaWt1dGlzIHN1bWHFvmludGFzJyk7CiAgICAgIGlmKCRuKSAkb1snbGlrdWNpb19rb2RhcyddWyRmXT0kbjsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-100633';
const GKEY='ps_blk';
const PHASES=["R"];
const OUT='analize/s1685_b.json';
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
