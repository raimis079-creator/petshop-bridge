process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODQ1ZCByeXRvIHR5cmltYXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODQ1ZCddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTQwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE4NDVkJ107CiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00geyRQfXdjX29yZGVycyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBBTkQgc3RhdHVzPSd3Yy1wcm9jZXNzaW5nJyBBTkQgZGF0ZV9jcmVhdGVkX2dtdDwnMjAyNi0xMS0xMCAwNjowMCcgT1JERVIgQlkgaWQiKTsKICAkaWRzW109MzgyNTE7CiAgZm9yZWFjaChhcnJheV91bmlxdWUoJGlkcykgYXMgJGlkKXsgJG89d2NfZ2V0X29yZGVyKCRpZCk7IGlmKCEkbykgY29udGludWU7ICRubj1bXTsgZm9yZWFjaCh3Y19nZXRfb3JkZXJfbm90ZXMoWydvcmRlcl9pZCc9PiRpZCwnbGltaXQnPT43XSkgYXMgJG4peyAkbm5bXT0kbi0+ZGF0ZV9jcmVhdGVkLT5kYXRlKCdtLWQgSDppJykuJyAnLm1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkbi0+Y29udGVudCksMCwxMzApOyB9CiAgICAkaXQ9W107IGZvcmVhY2goJG8tPmdldF9pdGVtcygpIGFzICR4KXsgJHA9JHgtPmdldF9wcm9kdWN0KCk7ICRpdFtdPW1iX3N1YnN0cigkeC0+Z2V0X25hbWUoKSwwLDQwKS4nIHgnLiR4LT5nZXRfcXVhbnRpdHkoKS4nIHN0PScuKCRwPyRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKTonLScpOyB9CiAgICAkclsnbyddWyRvLT5nZXRfb3JkZXJfbnVtYmVyKCldPVsnaWQnPT4kaWQsJ3N0Jz0+JG8tPmdldF9zdGF0dXMoKSwncG0nPT4kby0+Z2V0X3BheW1lbnRfbWV0aG9kKCksJ3BhaWQnPT4kby0+Z2V0X2RhdGVfcGFpZCgpPyRvLT5nZXRfZGF0ZV9wYWlkKCktPmRhdGUoJ20tZCBIOmknKTpudWxsLCdzdWt1cnRhJz0+JG8tPmdldF9kYXRlX2NyZWF0ZWQoKS0+ZGF0ZSgnbS1kIEg6aScpLCdzaGlwJz0+JG8tPmdldF9zaGlwcGluZ19tZXRob2QoKSwnbm90ZXMnPT4kbm4sJ2l0ZW1zJz0+JGl0XTsgfQogICRyWydpbXAyX2hpc3QnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0aW1lX3J1biwgTEVGVChzdW1tYXJ5LDEyMCkgcywgZGF0ZSBGUk9NIHskUH1wbXhpX2hpc3RvcnkgV0hFUkUgaW1wb3J0X2lkPTIgQU5EIGRhdGU+PU5PVygpLUlOVEVSVkFMIDIgREFZIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMTIiLEFSUkFZX0EpOwogICRmcz1nbG9iKFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy93Yy1sb2dzL3BsYWNlLW9yZGVyLWRlYnVnLSonKT86W107IHNvcnQoJGZzKTsKICBmb3JlYWNoKCRmcyBhcyAkZil7ICRkPXN1YnN0cihiYXNlbmFtZSgkZiksMjcsMTApOyBpZigkZDwnMjAyNi0xMS0xMCcpIGNvbnRpbnVlOyAkdD1maWxlX2dldF9jb250ZW50cygkZik7ICRMPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoZXhwbG9kZSgiXG4iLCR0KSkpOyAkbz1bXTsgZm9yZWFjaCgkTCBhcyAkbG4peyAkbG49cHJlZ19yZXBsYWNlKCcvW0EtWmEtejAtOS5fJSstXStAW0EtWmEtejAtOS4tXSsvJywnW2VtYWlsXScsJGxuKTsgJGxuPXByZWdfcmVwbGFjZSgnL1wrPzM3MFxkezh9fFxiOFxkezh9XGIvJywnW3RlbF0nLCRsbik7ICRvW109bWJfc3Vic3RyKCRsbiwwLDMwMCk7IH0gJHJbJ3BvZCddW2Jhc2VuYW1lKCRmKV09WydlaWwnPT5jb3VudCgkTCksJ3Bhc2t1dGluZXMnPT5hcnJheV9zbGljZSgkbywtNCldOyB9CiAgJHJbJ2NhbmMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvLmlkLCBvLnN0YXR1cywgby5kYXRlX2NyZWF0ZWRfZ210LCBvLnRvdGFsX2Ftb3VudCwgby5wYXltZW50X21ldGhvZCBGUk9NIHskUH13Y19vcmRlcnMgbyBXSEVSRSBvLnR5cGU9J3Nob3Bfb3JkZXInIEFORCBvLmRhdGVfY3JlYXRlZF9nbXQ+PScyMDI2LTExLTA5IDIwOjAwJyBBTkQgby5zdGF0dXMgTk9UIElOKCd3Yy1wcm9jZXNzaW5nJywnd2MtY29tcGxldGVkJykgT1JERVIgQlkgaWQiLEFSUkFZX0EpOwogIGZvcmVhY2goJHJbJ2NhbmMnXSBhcyAmJGMpeyAkbm49W107IGZvcmVhY2god2NfZ2V0X29yZGVyX25vdGVzKFsnb3JkZXJfaWQnPT4kY1snaWQnXSwnbGltaXQnPT42XSkgYXMgJG4peyAkbm5bXT0kbi0+ZGF0ZV9jcmVhdGVkLT5kYXRlKCdtLWQgSDppJykuJyAnLm1iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkbi0+Y29udGVudCksMCwxMjApOyB9ICRjWydub3RlcyddPSRubjsgJGNbJ25yJ109d2NfZ2V0X29yZGVyKCRjWydpZCddKS0+Z2V0X29yZGVyX251bWJlcigpOyB9IHVuc2V0KCRjKTsKICAkbGY9Jy9ob21lL2d5dnVuYWkyL2RvbWFpbnMvcGV0c2hvcC5sdC9sb2dzL3BocF9lcnJvci5sb2cnOyAkc3o9ZmlsZXNpemUoJGxmKTsgJGZoPWZvcGVuKCRsZiwncicpOyBmc2VlaygkZmgsbWF4KDAsJHN6LTE1MDAwMDApKTsgJHR4PWZyZWFkKCRmaCwxNTAwMDAwKTsgZmNsb3NlKCRmaCk7ICRMPWV4cGxvZGUoIlxuIiwkdHgpOwogIGZvcmVhY2goWydwZXRzaG9wLXhtbC5waHAnLCdBdHRlbXB0IHRvIHJlYWQgcHJvcGVydHkgImVycm9ycyInLCdjbGFzcy1zaGlwbWVudHMucGhwJ10gYXMgJHApeyAkaGl0PVtdOyBmb3JlYWNoKCRMIGFzICRpPT4kbG4peyBpZihzdHJwb3MoJGxuLCRwKSE9PWZhbHNlKXsgJGN0eD1bXTsgZm9yKCRqPW1heCgwLCRpLTEpOyRqPD1taW4oY291bnQoJEwpLTEsJGkrMSk7JGorKykgJGN0eFtdPW1iX3N1YnN0cigkTFskal0sMCwzMDApOyAkaGl0W109JGN0eDsgfSB9ICRyWydsb2cnXVskcF09WyduJz0+Y291bnQoJGhpdCksJ3Bhc2snPT5hcnJheV9zbGljZSgkaGl0LC0yKV07IH0KICBpZihwcmVnX21hdGNoKCcvcGV0c2hvcC14bWxcLnBocCBvbiBsaW5lIChcZCspLycsJHR4LCRtKSl7ICRsbj0oaW50KSRtWzFdOyAkeD1AZmlsZShXUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwvcGV0c2hvcC14bWwucGhwJyk7ICRvPVtdOyBpZigkeCkgZm9yKCRpPSRsbi02OyRpPD0kbG4rMjskaSsrKSAkb1tdPSRpLic6ICcucnRyaW0obWJfc3Vic3RyKCR4WyRpLTFdPz8nJywwLDIwMCkpOyAkclsneG1sX3NyYyddPSRvOyB9CiAgJHJbJ3BwNyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEUoc2VudF9hdCkgZCwgc3RhdHVzLCBDT1VOVCgqKSBuIEZST00geyRQfXBzX2VtYWlsX2pvYnMgV0hFUkUgZmxvdz0ncG9zdF9wdXJjaGFzZV83ZCcgQU5EIChzZW50X2F0Pj1OT1coKS1JTlRFUlZBTCAzIERBWSBPUiBzdGF0dXM9J3BlbmRpbmcnKSBHUk9VUCBCWSAxLDIiLEFSUkFZX0EpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0OyB9KTsK';
const VER='dep-074855';
const GKEY='ps_s1845d';
const PHASES=["1"];
const OUT='analize/s1845_d.json';
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
