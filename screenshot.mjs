process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEUyIEZpbmFsYXMKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiBpZighaXNzZXQoJF9HRVRbJ3BzX2UyZiddKSB8fCAkX0dFVFsncHNfZTJmJ10hPT0nRTJGMjAyNjA4MjYnKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7ICRJPSR3cGRiLT5wcmVmaXguJ3BzX3dlYl9pdnlraWFpJzsKICRmYXplPWlzc2V0KCRfR0VUWydmYXplJ10pPyRfR0VUWydmYXplJ106J3N0YXJ0JzsKCiBpZigkZmF6ZT09PSdzdGFydCcpewogICAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NICRJIik7CiAgICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyR3cGRiLT5wcmVmaXh9cHNfaXNsYWlkb3MgV0hFUkUgcGFzdGFiYSBMSUtFICdURVNULUUyJSciKTsKICAgLyogU2VqYW0gMTIgdW5pa2FsaXUga2FpbmEyNCBsYW5reXRvanUsIGthZCBrb250cm9sZXMgbGVudGVsZSB0dXJldHUgc2thaWNpdSAqLwogICAkbWVuPXdwX2RhdGUoJ1ktbScpOyAkZD0kbWVuLictMDUnOwogICBmb3IoJG49MDskbjwxMjskbisrKXsKICAgICAkd3BkYi0+aW5zZXJ0KCRJLGFycmF5KCdsYWlrYXMnPT4kZC4nIDEwOjAwOjAwJywnZGllbmEnPT4kZCwndGlwYXMnPT4ncGFnZXZpZXcnLCdwdXNsX3RpcGFzJz0+J2hvbWUnLAogICAgICAgJ2xhbmt5dG9qYXNfZCc9Pmhhc2goJ3NoYTI1NicsJ2syNC0nLiRuKSwnc2FsdGluaXMnPT4na2FpbmEyNCcsJ21lZGl1bSc9PidjcGMnLCdrYW5hbGFzJz0+J21va2FtYXMnLAogICAgICAgJ3Rlc3RpbmlzJz0+MCwnc2FsdGluaXNfYXBsaW5rYSc9PlBldHNob3BfQW5hbGl0aWthOjphcGxpbmthKCkpKTsKICAgfQogICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOwogICBlY2hvIGpzb25fZW5jb2RlKGFycmF5KCd2Jz0+J0UyRicsJ2ZhemUnPT4nc3RhcnQnLCdzZWpvJz0+MTIsJ21lbnVvJz0+JG1lbiwKICAgICAnaXNsYWlkb3Nfa2xhc2UnPT5jbGFzc19leGlzdHMoJ1BldHNob3BfSXNsYWlkb3MnKT9QZXRzaG9wX0lzbGFpZG9zOjpWRVJTSUpBOidORVJBJyksSlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7CiB9CgogaWYoJGZhemU9PT0nbG9naW4nKXsKICAgJHU9Z2V0X3VzZXJzKGFycmF5KCdyb2xlJz0+J2FkbWluaXN0cmF0b3InLCdudW1iZXInPT4xLCdvcmRlcmJ5Jz0+J0lEJykpOwogICBpZigkdSl7IHdwX3NldF9jdXJyZW50X3VzZXIoJHVbMF0tPklEKTsgd3Bfc2V0X2F1dGhfY29va2llKCR1WzBdLT5JRCx0cnVlLHRydWUpOyB9CiAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoYXJyYXkoJ3YnPT4nRTJGJywnZmF6ZSc9Pidsb2dpbicsJ29rJz0+MSkpOyBleGl0OwogfQoKICRvdXQ9YXJyYXkoJ3YnPT4nRTJGJywnZmF6ZSc9PidyZXonKTsKICRvdXRbJ2lzbGFpZG9zJ109Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0lzbGFpZG9zJyk/UGV0c2hvcF9Jc2xhaWRvczo6a29udHJvbGUod3BfZGF0ZSgnWS1tJykpOidORVJBJzsKICRvdXRbJ3N1dGlraW1vX2l2eWtpYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCx0aXBhcyxwdXNsX3RpcGFzLHN1dGlraW1hcyxsYW5reXRvamFzXzMwIElTIE5PVCBOVUxMIEFTIHR1cmkzMCxMRUZUKGxhbmt5dG9qYXNfZCw4KSBsZCxMRUZUKHNlc2lqYSwxMCkgc2VzIEZST00gJEkgV0hFUkUgc2FsdGluaXMgSVMgTlVMTCBPUiBzYWx0aW5pczw+J2thaW5hMjQnIE9SREVSIEJZIGlkIixBUlJBWV9BKTsKICRvdXRbJ3N1X3N1dGlraW11J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJEkgV0hFUkUgc3V0aWtpbWFzPTEiKTsKICRvdXRbJ2JlX3N1dGlraW1vJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJEkgV0hFUkUgc3V0aWtpbWFzPTAiKTsKICRvdXRbJ2xhbmszMF91enBpbGR5dGEnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkSSBXSEVSRSBsYW5reXRvamFzXzMwIElTIE5PVCBOVUxMIik7CiAkb3V0WydsYW5rMzBfYmVfc3V0aWtpbW8nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkSSBXSEVSRSBsYW5reXRvamFzXzMwIElTIE5PVCBOVUxMIEFORCBzdXRpa2ltYXM9MCIpOwogJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHdwZGItPnByZWZpeH1wc19pc2xhaWRvcyBXSEVSRSBwYXN0YWJhIExJS0UgJ1RFU1QtRTIlJyIpOwogJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSAkSSIpOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvdXQsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSw1KTsK';
const KEY='E2F20260826'; const VER='E2F';
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP E2 Finalas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  sid=JSON.parse(await c.text()).id; out.sukurta=sid; await miegok(9000);
  const s=await fx(WP+'/?ps_e2f='+KEY+'&faze=start',{},'start'); out.start=JSON.parse(await s.text());

  const {chromium}=await import('playwright'); const br=await chromium.launch();

  /* ---------- A. ADMIN: islaidu ekranas ---------- */
  const c1=await br.newContext({viewport:{width:1500,height:1300},ignoreHTTPSErrors:true,userAgent:UA});
  const p1=await c1.newPage(); const k1=[]; p1.on('pageerror',e=>k1.push(String(e).slice(0,140)));
  async function eik(pg,u,ms){ try{ await pg.goto(u,{waitUntil:'domcontentloaded',timeout:45000}); }catch(e){ (out.goto=out.goto||[]).push(String(e).slice(0,70)); } await miegok(ms||1200); }
  await eik(p1,WP+'/?ps_e2f='+KEY+'&faze=login',800);
  await eik(p1,WP+'/wp-admin/admin.php?page=ps-islaidos',1500);
  out.antraste=await p1.$eval('h1',n=>n.textContent.trim()).catch(()=>'NERA');
  out.h2=await p1.$$eval('h2',ns=>ns.map(n=>n.textContent.trim())).catch(()=>[]);
  out.put1=await put('screenshots/e2_islaidos_1.png', await p1.screenshot({fullPage:true}), VER);

  /* pakuotes irasas */
  try{
    await p1.selectOption('select[name="kategorija"]','pakuotes');
    await p1.fill('input[name="suma_eur"]','128,40');
    await p1.fill('input[name="pastaba"]','TEST-E2 pakuotes');
    await Promise.all([p1.waitForNavigation({waitUntil:'domcontentloaded',timeout:45000}),p1.click('button.button-primary')]);
    await miegok(1200);
  }catch(e){ out.forma1=String(e).slice(0,120); }
  /* kaina24 irasas — kontroles lentelei */
  try{
    await p1.selectOption('select[name="kategorija"]','kaina24');
    await p1.fill('input[name="suma_eur"]','1,20');
    await p1.fill('input[name="pastaba"]','TEST-E2 kaina24');
    await Promise.all([p1.waitForNavigation({waitUntil:'domcontentloaded',timeout:45000}),p1.click('button.button-primary')]);
    await miegok(1200);
  }catch(e){ out.forma2=String(e).slice(0,120); }

  out.lentele=await p1.$$eval('table.widefat',ts=>ts.map(t=>Array.from(t.querySelectorAll('tbody tr')).map(r=>Array.from(r.querySelectorAll('td')).map(x=>x.textContent.trim()).join(' | ')))).catch(()=>[]);
  out.pakuotes_tekstas=await p1.evaluate(()=>{const h=Array.from(document.querySelectorAll('h2')).find(x=>x.textContent.indexOf('Pakuot')>-1);return h&&h.nextElementSibling?h.nextElementSibling.textContent.replace(/\s+/g,' ').trim().slice(0,220):'?';}).catch(()=>'?');
  out.js_admin=k1;
  out.put2=await put('screenshots/e2_islaidos_2.png', await p1.screenshot({fullPage:true}), VER);
  await c1.close();

  /* ---------- B. ANONIMAS: sutikimo sluoksnis ---------- */
  const c2=await br.newContext({viewport:{width:1400,height:900},ignoreHTTPSErrors:true,userAgent:UA});
  const p2=await c2.newPage(); const k2=[]; p2.on('pageerror',e=>k2.push(String(e).slice(0,140)));
  await eik(p2,WP+'/',2000);
  out.baneris=await p2.$('#cmplz-cookiebanner-container')!==null;
  /* priimam VISKA */
  let paspausta=false;
  for(const sel of ['.cmplz-btn.cmplz-accept','button.cmplz-accept','.cmplz-accept','#cmplz-accept']){
    try{ const b=await p2.$(sel); if(b){ await b.click({timeout:5000}); paspausta=true; break; } }catch(e){}
  }
  out.sutikta=paspausta;
  await miegok(2000);
  await eik(p2,WP+'/parduotuve/',2200);
  out.cmplz_js=await p2.evaluate(()=>{try{return typeof cmplz_has_consent==='function'?cmplz_has_consent('statistics'):'nera_f';}catch(e){return 'err';}}).catch(()=>'?');
  await p2.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
  await miegok(2500);
  out.js_front=k2;
  out.put3=await put('screenshots/e2_sutikimas.png', await p2.screenshot({fullPage:false}), VER);
  await br.close();

  const r=await fx(WP+'/?ps_e2f='+KEY+'&faze=rez',{},'rez'); const txt=await r.text();
  try{ await put('deploy/e2_fin.json', Buffer.from(JSON.stringify(JSON.parse(txt),null,1)), VER); out.irasyta=1; }
  catch(e){ out.ne_json=txt.slice(0,500); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,500); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/e2_finrun.json', Buffer.from(JSON.stringify(out,null,1)), VER);
