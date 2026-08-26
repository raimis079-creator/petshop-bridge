process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEUxQiBWaXp1YWx1cyB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfZTFididdKSB8fCAkX0dFVFsncHNfZTFididdIT09J0UxQjIwMjYwODI2VicpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKCiAvKiB2YWx5bW8gcmV6aW1hcyAqLwogaWYoaXNzZXQoJF9HRVRbJ3ZhbHl0aSddKSl7CiAgICRuPSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyR3cGRiLT5wcmVmaXh9cHNfdGFyaWZhaSBXSEVSRSBwYXN0YWJhIExJS0UgJ1RFU1QtRTFCJSciKTsKICAgJGxpa289KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wcmVmaXh9cHNfdGFyaWZhaSIpOwogICAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZShhcnJheSgndic9PidFMUJWMScsJ2lzdHJpbnRhJz0+JG4sJ2xpa28nPT4kbGlrbykpOyBleGl0OwogfQoKICRUPWFycmF5KCd2Jz0+J0UxQlYxJyk7CgogLyogLS0tIDEuIGRlcGxveTogZ3JhemluaW1haSB2MS4xIC0tLSAqLwogJE1VPVdQTVVfUExVR0lOX0RJUjsgJEJBSz1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMtYmFja3Vwcyc7CiAkdXJsPSdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlL2NvbnRlbnRzL2RlcGxveS9wZXRzaG9wLWZha3QtZ3JhemluaW1haS5iNjQ/cmVmPTMwMmE2NjYyNDA2MDcwYzc0MjY5OTU1Yzc2NDA1NDk4OTEzMTY1YjYnOwogJHI9d3BfcmVtb3RlX2dldCgkdXJsLGFycmF5KCd0aW1lb3V0Jz0+MjUsJ2hlYWRlcnMnPT5hcnJheSgnQWNjZXB0Jz0+J2FwcGxpY2F0aW9uL3ZuZC5naXRodWIucmF3JywnVXNlci1BZ2VudCc9PidwZXRzaG9wLWJyaWRnZScpKSk7CiAkbz1hcnJheSgpOwogaWYoaXNfd3BfZXJyb3IoJHIpKSAkb1sna2xhaWRhJ109JHItPmdldF9lcnJvcl9tZXNzYWdlKCk7CiBlbHNlaWYod3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpIT09MjAwKSAkb1sna2xhaWRhJ109J0hUVFAgJy53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcik7CiBlbHNlewogICAka29kYXM9YmFzZTY0X2RlY29kZSh0cmltKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSksdHJ1ZSk7CiAgIGlmKCRrb2Rhcz09PWZhbHNlKSAkb1sna2xhaWRhJ109J2Jhc2U2NCc7CiAgIGVsc2V7CiAgICAgdHJ5eyB0b2tlbl9nZXRfYWxsKCRrb2RhcyxUT0tFTl9QQVJTRSk7ICRvWydzaW50YWtzZSddPSdPSyc7IH0KICAgICBjYXRjaChQYXJzZUVycm9yICRlKXsgJG9bJ3NpbnRha3NlJ109J1BhcnNlRXJyb3I6ICcuJGUtPmdldE1lc3NhZ2UoKTsgJG9bJ2tsYWlkYSddPSdzaW50YWtzZSc7IH0KICAgICBpZihlbXB0eSgkb1sna2xhaWRhJ10pKXsKICAgICAgICRrPSRNVS4nL3BldHNob3AtZmFrdC1ncmF6aW5pbWFpLnBocCc7CiAgICAgICAkb1snbWQ1X3ByaWVzJ109bWQ1X2ZpbGUoJGspOwogICAgICAgQGNvcHkoJGssJEJBSy4nL3BldHNob3AtZmFrdC1ncmF6aW5pbWFpLnBocC5iYWtfZTFiXycuZ21kYXRlKCdZbWRfSGlzJykpOwogICAgICAgJG9bJ2lyYXN5dGEnXT1maWxlX3B1dF9jb250ZW50cygkaywka29kYXMpOwogICAgICAgY2xlYXJzdGF0Y2FjaGUodHJ1ZSwkayk7ICRvWydtZDVfcG8nXT1tZDVfZmlsZSgkayk7CiAgICAgICAkb1snc3V0YW1wYSddPSgkb1snbWQ1X3BvJ109PT1tZDUoJGtvZGFzKSk7CiAgICAgfQogICB9CiB9CiAkVFsnZGVwbG95J109JG87CgogLyogLS0tIDIuIHByaXNpanVuZ2ltYXMgZWtyYW5vIGtvcGlqYWkgLS0tICovCiAkdT1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEsJ29yZGVyYnknPT4nSUQnKSk7CiBpZigkdSl7IHdwX3NldF9jdXJyZW50X3VzZXIoJHVbMF0tPklEKTsgd3Bfc2V0X2F1dGhfY29va2llKCR1WzBdLT5JRCx0cnVlLHRydWUpOyAkVFsndXNlciddPSR1WzBdLT51c2VyX2xvZ2luOyB9CgogLyogLS0tIDMuIHN2YXJvcyBwYXRpa3JhIC0tLSAqLwogJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHdwZGItPnByZWZpeH1wc190YXJpZmFpIFdIRVJFIHBhc3RhYmEgTElLRSAnVEVTVC1FMUIlJyIpOwogJFRbJ3RhcmlmdV9wcmllcyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3RhcmlmYWkiKTsKCiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRULEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo=';
const KEY='E1B20260826V'; const VER='E1BV1';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP E1B Vizualus v1',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  sid=JSON.parse(await c.text()).id; out.sukurta=sid; await miegok(9000);
  const {chromium}=await import('playwright'); const br=await chromium.launch();
  const ctx=await br.newContext({viewport:{width:1500,height:1150},ignoreHTTPSErrors:true});
  const pg=await ctx.newPage(); const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,140)));

  await pg.goto(WP+'/?ps_e1bv='+KEY,{waitUntil:'domcontentloaded',timeout:60000});
  const j=await pg.content(); out.deploy_ok=j.indexOf('E1BV1')>-1;
  try{ out.deploy=JSON.parse(await pg.$eval('pre',n=>n.textContent).catch(()=>j.replace(/<[^>]*>/g,''))); }catch(e){ out.deploy_raw=j.replace(/<[^>]*>/g,'').slice(0,500); }

  // 1) tuscias ekranas
  await pg.goto(WP+'/wp-admin/admin.php?page=ps-tarifai',{waitUntil:'networkidle',timeout:90000});
  await miegok(1200);
  out.antraste=await pg.$eval('h1',n=>n.textContent.trim()).catch(()=>'NERA H1');
  out.url=pg.url().replace(WP,'');
  out.meniu=await pg.$$eval('#adminmenu a',ns=>ns.map(n=>n.textContent.trim()).filter(t=>/tarif|Ataskait/i.test(t))).catch(()=>[]);
  out.put_tuscias=await put('screenshots/e1b_tarifai_1_tuscias.png', await pg.screenshot({fullPage:true}), VER);

  // 2) pildom forma
  await pg.selectOption('select[name="vezejas"]','venipak');
  await pg.selectOption('select[name="tipas"]','pastomatas');
  await pg.fill('input[name="svoris_nuo_g"]','0');
  await pg.fill('input[name="svoris_iki_g"]','10000');
  await pg.fill('input[name="kaina_eur"]','2,90');
  await pg.fill('input[name="kintamas_pct"]','8');
  await pg.fill('input[name="pastaba"]','TEST-E1B UI patikra');
  await Promise.all([pg.waitForNavigation({waitUntil:'networkidle',timeout:90000}), pg.click('#submit')]);
  await miegok(1200);
  out.po_irasymo_url=pg.url().replace(WP,'');
  out.lentele=await pg.$$eval('table.widefat tbody tr',rs=>rs.map(r=>Array.from(r.querySelectorAll('td')).map(t=>t.textContent.trim()).join(' | '))).catch(e=>String(e).slice(0,80));
  out.put_irasyta=await put('screenshots/e1b_tarifai_2_irasyta.png', await pg.screenshot({fullPage:true}), VER);

  // 3) uzdarymas
  const btn=await pg.$('table.widefat tbody tr button');
  if(btn){ await Promise.all([pg.waitForNavigation({waitUntil:'networkidle',timeout:90000}), btn.click()]); await miegok(1200);
    out.po_uzdarymo=await pg.$$eval('table.widefat tbody tr',rs=>rs.map(r=>Array.from(r.querySelectorAll('td')).map(t=>t.textContent.trim()).join(' | '))).catch(()=>[]);
    out.put_uzdaryta=await put('screenshots/e1b_tarifai_3_uzdaryta.png', await pg.screenshot({fullPage:true}), VER);
  } else { out.uzdarymas='mygtuko nerasta'; }

  out.js_klaidos=kl;
  // 4) valymas
  await pg.goto(WP+'/?ps_e1bv='+KEY+'&valyti=1',{waitUntil:'domcontentloaded',timeout:60000});
  out.valymas=(await pg.content()).replace(/<[^>]*>/g,'').slice(0,200);
  await br.close();
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,500); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/e1b_vis.json', Buffer.from(JSON.stringify(out,null,1)), VER);
