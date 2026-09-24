process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzE2ayBrYXMgbmF1ZG9qYSBtYXRtZW5pcyByZWFkLW9ubHkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzE2ayddKSkgcmV0dXJuOwogIEBzZXRfdGltZV9saW1pdCgxNzApOyBnbG9iYWwgJHdwZGI7ICRyPVsndic9PidTMTcxNmsnXTsKICB0cnl7CiAgICAkZmlsZXM9YXJyYXlfbWVyZ2UoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpLGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtKi8qLnBocCcpLGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtKi9pbmNsdWRlcy8qLnBocCcpLGdsb2IoZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy8qLnBocCcpKTsKICAgIGZvcmVhY2goJGZpbGVzIGFzICRnKXsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGcpOyBpZihwcmVnX21hdGNoKCcjZ2V0X2xlbmd0aHxnZXRfd2lkdGh8Z2V0X2hlaWdodHxnZXRfZGltZW5zaW9uc3xfbGVuZ3RoXGJ8X3dpZHRoXGJ8X2hlaWdodFxifG1hdG1lbiNpJywkcykpeyBwcmVnX21hdGNoX2FsbCgnI1teXG5dezAsMTAwfShnZXRfbGVuZ3RofGdldF93aWR0aHxnZXRfaGVpZ2h0fGdldF9kaW1lbnNpb25zfFwnX2xlbmd0aFwnfFwnX3dpZHRoXCd8XCdfaGVpZ2h0XCd8bWF0bWVuKVteXG5dezAsMTQwfSNpJywkcywkbSk7ICRyWyduYXVkb2phJ11bc3RyX3JlcGxhY2UoQUJTUEFUSCwnJywkZyldPWFycmF5X3NsaWNlKGFycmF5X21hcCgndHJpbScsYXJyYXlfdW5pcXVlKCRtWzBdKSksMCw2KTsgfSB9CiAgICAvLyBMUCBwbHVnaW5vIGR5ZHppbyBza2FpY2lhdmltYXMg4oCUIGFyIGlzIG1hdG1lbnUKICAgIGZvcmVhY2goZ2xvYihXUF9QTFVHSU5fRElSLicvd29vLWxpdGh1YW5pYXBvc3QqLyoqLyoucGhwJykgYXMgJGcpeyAkcz1maWxlX2dldF9jb250ZW50cygkZyk7IGlmKHByZWdfbWF0Y2goJyNnZXRfbGVuZ3RofGdldF9kaW1lbnNpb25zIycsJHMpKXsgcHJlZ19tYXRjaF9hbGwoJyNbXlxuXXswLDEwMH0oZ2V0X2xlbmd0aHxnZXRfZGltZW5zaW9ucylbXlxuXXswLDE0MH0jJywkcywkbSk7ICRyWydscF9uYXVkb2phJ11bYmFzZW5hbWUoJGcpXT1hcnJheV9zbGljZShhcnJheV9tYXAoJ3RyaW0nLGFycmF5X3VuaXF1ZSgkbVswXSkpLDAsNCk7IH0gfQogICAgLy8gVmVuaXBhayBwaWNrdXAgbWV0b2RvIGNhbGN1bGF0ZV9zaGlwcGluZyAoYWRtaW4ga2xhc2UpCiAgICAkZm49V1BfUExVR0lOX0RJUi4nL3djLXZlbmlwYWstc2hpcHBpbmcvYWRtaW4vY2xhc3Mtd29vY29tbWVyY2Utc2hvcHVwLXZlbmlwYWstc2hpcHBpbmctYWRtaW4tcGlja3VwLnBocCc7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmbik7ICRwPXN0cnBvcygkcywnZnVuY3Rpb24gY2FsY3VsYXRlX3NoaXBwaW5nJyk7ICRyWydwaWNrdXBfY2FsYyddPXN1YnN0cigkcywkcCw0NTAwKTsKICAgIC8vIFdQIEFsbCBJbXBvcnQgWkIgc2FibG9uYXM6IGFyIG1hdG1lbnlzIG1hcGluYW1pCiAgICAkbz0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIG9wdGlvbnMgRlJPTSB7JHdwZGItPnByZWZpeH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQ9MSIpOyAkdT1AdW5zZXJpYWxpemUoJG8pOyBpZihpc19hcnJheSgkdSkpeyBmb3JlYWNoKFsncHJvZHVjdF9sZW5ndGgnLCdwcm9kdWN0X3dpZHRoJywncHJvZHVjdF9oZWlnaHQnLCdwcm9kdWN0X3dlaWdodCcsJ2lzX3VwZGF0ZV9kaW1lbnNpb25zJywndXBkYXRlX2FsbF9kYXRhJywnaXNfdXBkYXRlX2xlbmd0aCcsJ2lzX3VwZGF0ZV93aWR0aCddIGFzICRrKXsgaWYoaXNzZXQoJHVbJGtdKSkgJHJbJ3dwYWkxJ11bJGtdPWlzX3NjYWxhcigkdVska10pPyR1WyRrXTonYXJyJzsgfSBwcmVnX21hdGNoX2FsbCgnI1thLXpfXSoobGVuZ3RofHdpZHRofGhlaWdodClbYS16X10qIycsJG8sJG1tKTsgJHJbJ3dwYWkxX3Jha3RhaSddPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJG1tWzBdKSk7IH0KICAgIC8vIFpCIHByZWtpdSBtYXRtZW51IHBhc2lza2lyc3R5bWFzIHBhZ2FsIHN2b3JpIOKAlCBhciBkaW1zIGtvcmVsaXVvamEKICAgICRyWyd6Yl9kaW1zX3BhZ2FsX2tnJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgQ09OQ0FUKGwubWV0YV92YWx1ZSwneCcsdy5tZXRhX3ZhbHVlLCd4JyxoLm1ldGFfdmFsdWUpIGQsIFJPVU5EKE1JTihDQVNUKHd0Lm1ldGFfdmFsdWUgQVMgREVDSU1BTCg4LDIpKSksMSkga2dfbWluLCBST1VORChNQVgoQ0FTVCh3dC5tZXRhX3ZhbHVlIEFTIERFQ0lNQUwoOCwyKSkpLDEpIGtnX21heCwgQ09VTlQoKikgbiBGUk9NIHskd3BkYi0+cG9zdHN9IHAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBzIE9OIHMucG9zdF9pZD1wLklEIEFORCBzLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIEFORCBzLm1ldGFfdmFsdWU9J3piJyBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IGwgT04gbC5wb3N0X2lkPXAuSUQgQU5EIGwubWV0YV9rZXk9J19sZW5ndGgnIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gdyBPTiB3LnBvc3RfaWQ9cC5JRCBBTkQgdy5tZXRhX2tleT0nX3dpZHRoJyBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IGggT04gaC5wb3N0X2lkPXAuSUQgQU5EIGgubWV0YV9rZXk9J19oZWlnaHQnIExFRlQgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSB3dCBPTiB3dC5wb3N0X2lkPXAuSUQgQU5EIHd0Lm1ldGFfa2V5PSdfd2VpZ2h0JyBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEdST1VQIEJZIGQgT1JERVIgQlkgbiBERVNDIExJTUlUIDE1IixBUlJBWV9BKTsKICAgICRyWyd2aXJzX3JpYnVfemJfbiddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdHN9IHAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBzIE9OIHMucG9zdF9pZD1wLklEIEFORCBzLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIEFORCBzLm1ldGFfdmFsdWU9J3piJyBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IGwgT04gbC5wb3N0X2lkPXAuSUQgQU5EIGwubWV0YV9rZXk9J19sZW5ndGgnIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gdyBPTiB3LnBvc3RfaWQ9cC5JRCBBTkQgdy5tZXRhX2tleT0nX3dpZHRoJyBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IGggT04gaC5wb3N0X2lkPXAuSUQgQU5EIGgubWV0YV9rZXk9J19oZWlnaHQnIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIChHUkVBVEVTVChDQVNUKGwubWV0YV92YWx1ZSBBUyBERUNJTUFMKDgsMikpLENBU1Qody5tZXRhX3ZhbHVlIEFTIERFQ0lNQUwoOCwyKSksQ0FTVChoLm1ldGFfdmFsdWUgQVMgREVDSU1BTCg4LDIpKSk+NjEgT1IgTEVBU1QoQ0FTVChsLm1ldGFfdmFsdWUgQVMgREVDSU1BTCg4LDIpKSxDQVNUKHcubWV0YV92YWx1ZSBBUyBERUNJTUFMKDgsMikpLENBU1QoaC5tZXRhX3ZhbHVlIEFTIERFQ0lNQUwoOCwyKSkpPjM5LjUpIik7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgd3Bfc2VuZF9qc29uKCRyKTsKfSwgMSk7Cg==';
const VER='dep-210236';
const GKEY='ps_s1716k';
const PHASES=["1"];
const OUT='analize/s1716_k1.json';
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
