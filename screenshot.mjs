process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzAzIG1iIOKAlCBza2FpxI1pdW9rbMSXcyBrb2RvIHJlY29uIChyZWFkLW9ubHkpOiBwcm9kdWN0LWNhbGMsIGZlZWRpbmctc2VydmljZSBjYWxjKCksIHJlbGF1bmNoIGRpZW5vcygpL3J1c2lzKCksIGNhbGMgdGVzdGFpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTcwM21iJ10pKSByZXR1cm47IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE3MDMgbWInKTsgJGY9JF9HRVRbJ3BzX3MxNzAzbWInXTsKICB0cnl7CiAgICAkc3JjPWZ1bmN0aW9uKCRmaWxlLCRmcm9tLCRsZW4peyAkcz1AZmlsZV9nZXRfY29udGVudHMoJGZpbGUpOyByZXR1cm4gJHM9PT1mYWxzZT8nTsSWUkEnOm1iX3N1YnN0cigkcywkZnJvbSwkbGVuKTsgfTsKICAgICRjb3JlPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvJzsKICAgIGlmKCRmPT09JzEnKXsKICAgICAgJG9bJ3Byb2R1Y3RfY2FsY19waHAnXT0kc3JjKCRjb3JlLidpbmNsdWRlcy9jbGFzcy1wcm9kdWN0LWNhbGMucGhwJywwLDE0ODAwKTsKICAgICAgJG9bJ3Byb2R1Y3RfY2FsY19qc19oZWFkJ109JHNyYygkY29yZS4nYXNzZXRzL3Byb2R1Y3QtY2FsYy5qcycsMCw2MDAwKTsKICAgIH0KICAgIGlmKCRmPT09JzInKXsKICAgICAgJHM9ZmlsZV9nZXRfY29udGVudHMoJGNvcmUuJ2luY2x1ZGVzL2NsYXNzLWZlZWRpbmctc2VydmljZS5waHAnKTsKICAgICAgLy8gY2FsYygpIGlyIGV2YWx1YXRlKCkgbWV0b2TFsyB0ZWtzdGFzCiAgICAgIGZvcmVhY2goYXJyYXkoJ2NhbGMnLCdldmFsdWF0ZScsJ2NhbGNfZW5hYmxlZCcpIGFzICRtKXsgaWYocHJlZ19tYXRjaCgnL3B1YmxpYyBzdGF0aWMgZnVuY3Rpb24gJy4kbS4nXHMqXCguKj9cbiAgICBcfVxuL3MnLCRzLCRtbSkpICRvWydmc18nLiRtXT1tYl9zdWJzdHIoJG1tWzBdLDAsOTAwMCk7IH0KICAgICAgJG9bJ2ZzX2hlYWQnXT1tYl9zdWJzdHIoJHMsMCwyNTAwKTsKICAgICAgJHJsPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtcmVsYXVuY2gucGhwJyk7CiAgICAgIGZvcmVhY2goYXJyYXkoJ3J1c2lzJywnZGllbm9zJywnc3ZvcmlzJywncGFzcGF1ZGltYXMnKSBhcyAkbSl7IGlmKHByZWdfbWF0Y2goJy9wdWJsaWMgc3RhdGljIGZ1bmN0aW9uICcuJG0uJ1xzKlwoLio/XG4gIFx9XG4vcycsJHJsLCRtbSkpICRvWydybF8nLiRtXT1tYl9zdWJzdHIoJG1tWzBdLDAsNDAwMCk7IH0KICAgIH0KICAgIGlmKCRmPT09JzMnKXsKICAgICAgLy8gY2FsYyB0ZXN0YWk6IDMgcHJla8SXcyDDlyAxMCBrZyDFoXVvOyBpciBrYXTElwogICAgICBmb3JlYWNoKGFycmF5KDE4NTg3PT4nZG9nJywxODA1ND0+J2RvZycsMTgwMTQ9Pidkb2cnKSBhcyAkcGlkPT4kc3ApewogICAgICAgICRwcj13Y19nZXRfcHJvZHVjdCgkcGlkKTsgJG9bJ3ByZWtlJ11bJHBpZF09JHByP2FycmF5KCduJz0+JHByLT5nZXRfbmFtZSgpLCdrYWluYSc9PiRwci0+Z2V0X3ByaWNlKCksJ3N2b3Jpcyc9PiRwci0+Z2V0X3dlaWdodCgpLCdzdCc9PiRwci0+Z2V0X3N0b2NrX3N0YXR1cygpKTpudWxsOwogICAgICAgIGZvcmVhY2goYXJyYXkoYXJyYXkoJ3Byb2R1Y3RfaWQnPT4kcGlkLCd3ZWlnaHRfa2cnPT4xMCwnc3BlY2llc19jb2RlJz0+JHNwKSxhcnJheSgncHJvZHVjdF9pZCc9PiRwaWQsJ3dlaWdodF9rZyc9PjEwLCdzcGVjaWVzX2NvZGUnPT4kc3AsJ2FjdGl2aXR5X2xldmVsJz0+J21vZGVyYXRlJyksYXJyYXkoJ3Byb2R1Y3RfaWQnPT4kcGlkLCd3ZWlnaHRfa2cnPT4xMCwnc3BlY2llc19jb2RlJz0+JHNwLCdhY3Rpdml0eSc9Pidtb2RlcmF0ZScpKSBhcyAkaT0+JGluKXsKICAgICAgICAgIHRyeXsgJHI9UGV0c2hvcF9GZWVkaW5nX1NlcnZpY2U6OmNhbGMoJGluKTsgJG9bJ2NhbGMnXVskcGlkXVskaV09aXNfYXJyYXkoJHIpP2pzb25fZGVjb2RlKGpzb25fZW5jb2RlKCRyKSx0cnVlKTokcjsgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydjYWxjJ11bJHBpZF1bJGldPSdFUlIgJy4kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgICAgICAgfQogICAgICB9CiAgICAgIC8vIGthdMSXcyBsZW50ZWzEl3MKICAgICAgJG9bJ3NwZWNpZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzcGVjaWVzLHNjb3BlLHN0YXR1cyxpc19hY3RpdmUsQ09VTlQoKikgbiBGUk9NIHskcH1wc19mZWVkaW5nX3RhYmxlcyBHUk9VUCBCWSBzcGVjaWVzLHNjb3BlLHN0YXR1cyxpc19hY3RpdmUiLEFSUkFZX0EpOwogICAgICAkb1snZGltcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHQuc3BlY2llcywgci5jb25kaXRpb25fZGltZW5zaW9ucyBkLCBDT1VOVCgqKSBuIEZST00geyRwfXBzX2ZlZWRpbmdfcm93cyByIEpPSU4geyRwfXBzX2ZlZWRpbmdfdGFibGVzIHQgT04gdC5pZD1yLmZlZWRpbmdfdGFibGVfaWQgV0hFUkUgdC5pc19hY3RpdmU9MSBHUk9VUCBCWSB0LnNwZWNpZXMsIHIuY29uZGl0aW9uX2RpbWVuc2lvbnMgT1JERVIgQlkgbiBERVNDIExJTUlUIDQwIixBUlJBWV9BKTsKICAgICAgLy8gcsWrxaFpcyBwYWdhbCBwcmVrxJk6IGthdGVnb3Jpam9zCiAgICAgICRjYXRzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHR0LnRlcm1faWQsIHQubmFtZSwgdC5zbHVnLCB0dC5wYXJlbnQsIHR0LmNvdW50IEZST00geyRwfXRlcm1fdGF4b25vbXkgdHQgSk9JTiB7JHB9dGVybXMgdCBPTiB0LnRlcm1faWQ9dHQudGVybV9pZCBXSEVSRSB0dC50YXhvbm9teT0ncHJvZHVjdF9jYXQnIEFORCB0dC5wYXJlbnQ9MCIsQVJSQVlfQSk7ICRvWyd0b3BfY2F0cyddPSRjYXRzOwogICAgICAvLyBneXbFsyBwcmVracWzIHN1IGxlbnRlbGU6IHLFq8WhaXMgcGVyIGxlbnRlbMSZLCBrYWluYS9rZywgcGFrdW90xJcKICAgICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbS5wcm9kdWN0X2lkIHBpZCwgdC5zcGVjaWVzLCB0LmJyYW5kLCB0LmxpbmUgRlJPTSB7JHB9cHNfZmVlZGluZ19tYXAgbSBKT0lOIHskcH1wc19mZWVkaW5nX3RhYmxlcyB0IE9OIHQuaWQ9bS5mZWVkaW5nX3RhYmxlX2lkIEpPSU4geyRwfXBvc3RzIHBvIE9OIHBvLklEPW0ucHJvZHVjdF9pZCBKT0lOIHskcH1wb3N0bWV0YSBwcyBPTiBwcy5wb3N0X2lkPW0ucHJvZHVjdF9pZCBBTkQgcHMubWV0YV9rZXk9J19zdG9ja19zdGF0dXMnIEFORCBwcy5tZXRhX3ZhbHVlPSdpbnN0b2NrJyBXSEVSRSBtLmlzX2FjdGl2ZT0xIEFORCB0LmlzX2FjdGl2ZT0xIEFORCBwby5wb3N0X3N0YXR1cz0ncHVibGlzaCciLEFSUkFZX0EpOwogICAgICAkc3A9YXJyYXkoKTsgJHBhaz1hcnJheSgpOyBmb3JlYWNoKCRyb3dzIGFzICRyKXsgJHNwWyRyWydzcGVjaWVzJ11dPSgkc3BbJHJbJ3NwZWNpZXMnXV0/PzApKzE7ICR3PShmbG9hdClnZXRfcG9zdF9tZXRhKChpbnQpJHJbJ3BpZCddLCdfd2VpZ2h0Jyx0cnVlKTsgJGI9JHc+PTc/JzcrJzooJHc+PTM/JzMtNyc6KCR3PjA/JzwzJzonMCcpKTsgJHBha1skclsnc3BlY2llcyddLicgJy4kYl09KCRwYWtbJHJbJ3NwZWNpZXMnXS4nICcuJGJdPz8wKSsxOyB9CiAgICAgICRvWydneXZvc19wYWdhbF9ydXNpJ109JHNwOyAkb1snZ3l2b3NfcGFnYWxfcGFrJ109JHBhazsgJG9bJ2d5dm9zX24nXT1jb3VudCgkcm93cyk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0RmlsZSgpLic6Jy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-061747';
const GKEY='ps_s1703mb';
const PHASES=["1", "2", "3"];
const OUT='analize/s1703_mb.json';
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
