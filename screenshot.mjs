process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjM5eCB2ZXJ0aW1haSB2MS4xLT52MS4yIGd5dmFpICsga3JlZGl0aW5lICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfbzYnXSk/JF9HRVRbJ3BzX282J106JycpIT09J0dPJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2Mzl4Jyk7CiAgdHJ5ewogICAgJHQ9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC12ZXJ0aW1haS5waHAnOwogICAgJHM9KHN0cmluZylmaWxlX2dldF9jb250ZW50cygkdCk7CiAgICBpZihtZDUoJHMpIT09JzMwMjVjMDJhNWQwOWNhNWVmNzVjZTljZjZiMmY0NDhmJyl7IHRocm93IG5ldyBFeGNlcHRpb24oJ2d5dmFzIHBhc2lrZWl0ZTogJy5tZDUoJHMpKTsgfQogICAgJHVwPXdwX3VwbG9hZF9kaXIoKTsgJGJrPXRyYWlsaW5nc2xhc2hpdCgkdXBbJ2Jhc2VkaXInXSkuJ3BzLWJhY2t1cHMnOwogICAgJG9bJ2JhY2t1cCddPWNvcHkoJHQsJGJrLicvcGV0c2hvcC12ZXJ0aW1haS12MTEtQkFDS1VQLScuZGF0ZSgnWS1tLWQnKS4nLnBocCcpOwogICAgJGE9IiAqIFZlcnNpb246IDEuMSI7CiAgICAkYj0iICogVmVyc2lvbjogMS4yIChTMTYzOSwgMjAyNi0wOS0wODogKyBncsSFxb5pbmltbyBsYWnFoWtvIHNha2luaWFpIOKAlCBlbWFpbF9pbXByb3ZlbWVudHMgYm9keSBsdF9MVCB2ZXJ0aW1vIG7El3JhLCBtYXR5dGEgdGVzdGUgIzM1ODYzKSI7CiAgICBpZihzdWJzdHJfY291bnQoJHMsJGEpIT09MSkgdGhyb3cgbmV3IEV4Y2VwdGlvbignYW50cmFzdGVzIHp5bWUnKTsKICAgICRzPXN0cl9yZXBsYWNlKCRhLCRiLCRzKTsKICAgICRhMj0iXHRzdGF0aWMgXCRtYXAgPSBhcnJheShcbiI7CiAgICBpZihzdWJzdHJfY291bnQoJHMsJGEyKSE9PTEpIHRocm93IG5ldyBFeGNlcHRpb24oJ21hcCB6eW1lOiAnLnN1YnN0cl9jb3VudCgkcywkYTIpKTsKICAgICRpbnM9Ilx0c3RhdGljIFwkbWFwID0gYXJyYXkoXG4iCiAgICAgIC4iXHRcdC8vIHYxLjI6IGdyxIXFvmluaW1vIGxhacWha2FzIChlbWFpbF9pbXByb3ZlbWVudHMpXG4iCiAgICAgIC4iXHRcdCdZb3VyIG9yZGVyIGZyb20gJXMgaGFzIGJlZW4gcGFydGlhbGx5IHJlZnVuZGVkLicgPT4gJ0p1bXMgZ3LEhcW+aW50YSBkYWxpcyBwaW5pZ8WzIHXFviB1xb5zYWt5bcSFIHBhcmR1b3R1dsSXamUgJXMuJyxcbiIKICAgICAgLiJcdFx0J1lvdXIgb3JkZXIgZnJvbSAlcyBoYXMgYmVlbiByZWZ1bmRlZC4nID0+ICdKdW1zIGdyxIXFvmludGkgcGluaWdhaSB1xb4gdcW+c2FreW3EhSBwYXJkdW90dXbEl2plICVzLicsXG4iCiAgICAgIC4iXHRcdCdZb3VyIG9yZGVyIG9uICVzIGhhcyBiZWVuIHBhcnRpYWxseSByZWZ1bmRlZC4gVGhlcmUgYXJlIG1vcmUgZGV0YWlscyBiZWxvdyBmb3IgeW91ciByZWZlcmVuY2U6JyA9PiAnSnVtcyBncsSFxb5pbnRhIGRhbGlzIHBpbmlnxbMgdcW+IHXFvnNha3ltxIUgcGFyZHVvdHV2xJdqZSAlcy4gRGV0YWzEl3Mgxb5lbWlhdTonLFxuIgogICAgICAuIlx0XHQnWW91ciBvcmRlciBvbiAlcyBoYXMgYmVlbiByZWZ1bmRlZC4gVGhlcmUgYXJlIG1vcmUgZGV0YWlscyBiZWxvdyBmb3IgeW91ciByZWZlcmVuY2U6JyA9PiAnSnVtcyBncsSFxb5pbnRpIHBpbmlnYWkgdcW+IHXFvnNha3ltxIUgcGFyZHVvdHV2xJdqZSAlcy4gRGV0YWzEl3Mgxb5lbWlhdTonLFxuIjsKICAgICRzPXN0cl9yZXBsYWNlKCRhMiwkaW5zLCRzKTsKICAgICR0az1AdG9rZW5fZ2V0X2FsbCgkcyxUT0tFTl9QQVJTRSk7IGlmKCFpc19hcnJheSgkdGspfHxjb3VudCgkdGspPDMwKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCd0b2tlbicpOwogICAgJG9bJ3Jhc3l0YSddPWZpbGVfcHV0X2NvbnRlbnRzKCR0LCRzKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCdvcGNhY2hlX2ludmFsaWRhdGUnKSl7IEBvcGNhY2hlX2ludmFsaWRhdGUoJHQsdHJ1ZSk7IH0KICAgICRvWydwb19tZDUnXT1tZDVfZmlsZSgkdCk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7CmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpeyAvLyBhdHNraXJhIGZhemU6IHRlc3RhcyArIGtyZWRpdGluZSAocG8gcGVycmFzeW1vIG5hdWphcyByZXF1ZXN0YXMpCiAgaWYoKGlzc2V0KCRfR0VUWydwc19vNiddKT8kX0dFVFsncHNfbzYnXTonJykhPT0nQ0wnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTYzOXgtQ0wnKTsKICB0cnl7CiAgICAkb1snZ2V0dGV4dCddPV9fKCdZb3VyIG9yZGVyIGZyb20gJXMgaGFzIGJlZW4gcGFydGlhbGx5IHJlZnVuZGVkLicsJ3dvb2NvbW1lcmNlJyk7CiAgICAkcmVmdW5kPXdjX2dldF9vcmRlcigzNTg2NCk7ICRvcmQ9d2NfZ2V0X29yZGVyKDM1ODYzKTsKICAgICRybTE9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRGFyYmFsYXVraXMnLCdrcmVkaXRpbmVfbnVtZXJpcycpOyAkcm0xLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogICAgJG5yPSRybTEtPmludm9rZShudWxsLCRyZWZ1bmQpOyAkb1sna3JfbnInXT0kbnI7CiAgICAkcm0yPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0RhcmJhbGF1a2lzJywna3JlZGl0aW5lX3BkZicpOyAkcm0yLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogICAgJHJtMi0+aW52b2tlKG51bGwsd2NfZ2V0X29yZGVyKDM1ODY0KSwkb3JkKTsKICAgICRwZGY9KHN0cmluZyl3Y19nZXRfb3JkZXIoMzU4NjQpLT5nZXRfbWV0YSgnX3BldHNob3Bfa3JhdnBuX3BkZicpOwogICAgJG9bJ2tyX3BkZiddPWJhc2VuYW1lKCRwZGYpOyAkb1sncGRmX2R5ZGlzJ109ZmlsZV9leGlzdHMoJHBkZik/ZmlsZXNpemUoJHBkZik6MDsKICAgIGlmKCEkb1sncGRmX2R5ZGlzJ10pIHRocm93IG5ldyBFeGNlcHRpb24oJ1BERiBuZXN1a3VydGFzJyk7CiAgICAkbWFpbGVyPVdDKCktPm1haWxlcigpOwogICAgJGg9JzxwPlN2ZWlraSwgUmFpbXVuZGFzLDwvcD48cD5KxatzxbMgdcW+c2FreW11aSBOci4gMzU4NjMgcHJpdGFpa3l0YXMgZGFsaW5pcyBncsSFxb5pbmltYXMuIEtyZWRpdGluxJcgc8SFc2thaXRhICcuJG5yLicgcHJpc2VndGEgcHJpZSDFoWlvIGxhacWha28uPC9wPjxwPkdyYcW+aW9zIGRpZW5vcyw8YnI+cGV0c2hvcC5sdDwvcD4nOwogICAgJG9bJ2lzc2l1c3RhJ109JG1haWxlci0+c2VuZCgndGVycmFAcGV0c2hvcC5sdCcsJ0tyZWRpdGluxJcgc8SFc2thaXRhICcuJG5yLicg4oCUIHXFvnNha3ltYXMgTnIuIDM1ODYzJywKICAgICAgJG1haWxlci0+d3JhcF9tZXNzYWdlKCdLcmVkaXRpbsSXIHPEhXNrYWl0YScsJGgpLCcnLGFycmF5KCRwZGYpKT8xOjA7CiAgICAkej0oYXJyYXkpZ2V0X29wdGlvbigncHNfZGV2X3Bhc3Rhc196dXJuYWxhcycsYXJyYXkoKSk7CiAgICBmb3JlYWNoKGFycmF5X3NsaWNlKCR6LC0xKSBhcyAkeCl7ICRvWyd6J11bXT0keFsnbGFpa2FzJ10uJyB8ICcuJHhbJ3RlbWEnXS4nIHwgcHI6Jy4keFsncHJpZWRhaSddLicgJy4keFsnZmFpbGFpJ107IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-074050';
const GKEY='ps_o6';
const PHASES=["GO", "CL"];
const OUT='analize/s1639_x.json';
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
