process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI1OCddKSB8fCAkX0dFVFsncHNfaDI1OCddIT09J1JVTjIwMjYwODI0RycpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNThBJyk7CiAkdT1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEsJ29yZGVyYnknPT4nSUQnKSk7CiBpZigkdSl7IHdwX3NldF9jdXJyZW50X3VzZXIoJHVbMF0tPklEKTsgd3Bfc2V0X2F1dGhfY29va2llKCR1WzBdLT5JRCx0cnVlLHRydWUpOyB9CiBpZihpc3NldCgkX0dFVFsnZGVwbG95J10pKXsKICAkc2hhPXNhbml0aXplX3RleHRfZmllbGQoJF9HRVRbJ3NoYSddKTsKICBmb3JlYWNoKGFycmF5KCdwZXRzaG9wLWRlc2sucGhwJywncGV0c2hvcC1hdi1kcm9wc2hpcC5waHAnKSBhcyAkZil7CiAgICRyPXdwX3JlbW90ZV9nZXQoJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvcmFpbWlzMDc5LWNyZWF0b3IvcGV0c2hvcC1icmlkZ2UvY29udGVudHMvZGVwbG95LycuJGYuJy5iNjQ/cmVmPScuJHNoYSxhcnJheSgndGltZW91dCc9PjQwLCdoZWFkZXJzJz0+YXJyYXkoJ1VzZXItQWdlbnQnPT4ncHMnLCdBY2NlcHQnPT4nYXBwbGljYXRpb24vdm5kLmdpdGh1Yitqc29uJykpKTsKICAgJGo9anNvbl9kZWNvZGUod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpLHRydWUpOwogICAkY29kZT1iYXNlNjRfZGVjb2RlKHRyaW0oaXNzZXQoJGpbJ2NvbnRlbnQnXSk/YmFzZTY0X2RlY29kZSgkalsnY29udGVudCddKTonJykpOwogICAkaW5mPWFycmF5KCdnYXV0YSc9PnN0cmxlbigkY29kZSkpOwogICBpZigkY29kZSAmJiBzdHJwb3MoJGNvZGUsJzw/cGhwJyk9PT0wKXsKICAgIHRyeXsgdG9rZW5fZ2V0X2FsbCgkY29kZSwgVE9LRU5fUEFSU0UpOyAkaW5mWydzaW50YWtzZSddPSdvayc7IH0gY2F0Y2goUGFyc2VFcnJvciAkZSl7ICRpbmZbJ3NpbnRha3NlJ109J0tMQUlEQTogJy4kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgICBpZignb2snPT09JGluZlsnc2ludGFrc2UnXSl7ICRkc3Q9V1BNVV9QTFVHSU5fRElSLicvJy4kZjsgQGNvcHkoJGRzdCwgV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMvJy4kZi4nLmJha19oMjU4Jyk7IGZpbGVfcHV0X2NvbnRlbnRzKCRkc3QsJGNvZGUpOyAkaW5mWydtZDUnXT1tZDVfZmlsZSgkZHN0KTsgfQogICB9IGVsc2UgeyAkaW5mWydzaW50YWtzZSddPSd0dXNjaWEnOyB9CiAgICRUWydmYWlsYWknXVskZl09JGluZjsKICB9CiB9CiBpZihpc3NldCgkX0dFVFsncG8nXSkpewogIGZvcmVhY2goYXJyYXkoMzUwNjEpIGFzICRpZCl7ICRvPXdjX2dldF9vcmRlcigkaWQpOyBpZighJG8pIGNvbnRpbnVlOwogICAkZD1qc29uX2RlY29kZSgoc3RyaW5nKSRvLT5nZXRfbWV0YSgndmVuaXBha19zaGlwcGluZ19vcmRlcl9kYXRhJyksdHJ1ZSk7CiAgICRUWyd1enMnXVskaWRdPWFycmF5KCdzdCc9PiRvLT5nZXRfc3RhdHVzKCksJ3Bha19tZXRhJz0+JG8tPmdldF9tZXRhKCdfcHNfcGFrdW9jaXUnKSwncGFja19udW1iZXJzJz0+JGRbJ3BhY2tfbnVtYmVycyddPz9udWxsLAogICAgJ3Bhc3RhYm9zJz0+YXJyYXlfbWFwKGZ1bmN0aW9uKCRuKXtyZXR1cm4gbWJfc3Vic3RyKCRuLT5jb250ZW50LDAsMTQwKTt9LGFycmF5X3NsaWNlKHdjX2dldF9vcmRlcl9ub3RlcyhhcnJheSgnb3JkZXJfaWQnPT4kaWQsJ2xpbWl0Jz0+MykpLDAsMykpKTsKICB9CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK'; const SHA='acf134590fded19457b55a474024e3ef69d3a56f';
const MD5={"petshop-desk.php": "1ea03fc40ea502aa71ea8b4eedc76d5b", "petshop-av-dropship.php": "ee77f0d0559b6981a7b15a388c67ba47"};
const out={v:'H258A'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
async function busena(pg,name){ await miegok(800); const html=await pg.content();
  const o={url:pg.url().replace(WP,'').slice(0,160), h1:await pg.$eval('h1',n=>n.textContent.trim()).catch(()=>'?'), fatal:/Fatal error|critical error|Kritinė klaida/i.test(html),
    notices:await pg.$$eval('.notice,.pd-msg,.updated,.error',ns=>ns.map(n=>n.textContent.trim().replace(/\s+/g,' ').slice(0,260)).filter(t=>!t.includes('WordPress 7.1'))).catch(()=>[])};
  if(name) o.put=await put('screenshots/h258_'+name+'.png',await pg.screenshot({fullPage:true}),'H258A'); return o; }
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H257 v1 (deploy+E2E laiskai)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h258=RUN20260824G&deploy=1&sha='+SHA,{},'deploy');
  const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
  try{ out.deploy=JSON.parse(await d.text()); }catch(e){ out.deploy='ne-json'; }
  let visi=true; for(const k in MD5){ if(!out.deploy.failai||!out.deploy.failai[k]||out.deploy.failai[k].md5!==MD5[k]) visi=false; } out.md5_ok=visi;
  const cookies=[]; for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
  if(visi && cookies.length){
    await miegok(2000);
    const {chromium}=await import('playwright'); const br=await chromium.launch();
    const ctx=await br.newContext({viewport:{width:1500,height:1100},ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
    const pg=await ctx.newPage(); const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,150)));
    pg.on('dialog',async dg=>{ (out.dialogai=out.dialogai||[]).push(dg.message().slice(0,100)); await dg.accept(); });
    await pg.goto(WP+'/wp-admin/admin.php?page=ps-laiskai&b=laukia',{waitUntil:'networkidle',timeout:60000});
    out.laukia=await busena(pg,'laukia');
    out.laukia.aktyvus=await pg.$eval('.nav-tab-active',n=>n.textContent.trim()).catch(()=>'?');
    out.laukia.tiekejai=await pg.$$eval('.ps-tiek-h',ns=>ns.map(n=>n.textContent.trim().replace(/\s+/g,' ').slice(0,60))).catch(()=>[]);
    out.laukia.textarea=await pg.$$eval('textarea[name=pastaba]',ns=>ns.length).catch(()=>-1);
    out.laukia.varneles=await pg.$$eval('input[name=laisk_tiekejui],input[name=laisk_man]',ns=>ns.map(n=>n.name+':'+n.checked)).catch(()=>[]);
    out.laukia.siusti=await pg.$$eval('form.ps-siusti button.button-primary',ns=>ns.map(n=>n.textContent.trim().slice(0,50))).catch(()=>[]);
    out.laukia.dez=await pg.$$eval('form.ps-dez-f',ns=>ns.map(n=>n.querySelector('input[name=ids]').value+':'+n.querySelector('input[name=n]').value+':'+n.querySelector('button').textContent.trim())).catch(()=>[]);
    // gyva peržiūra: įjungti VF peržiūrą ir įrašyti prierašą
    const pv=await pg.$('a.button:has-text("Peržiūrėti laišką")'); if(pv){ await Promise.all([pg.waitForNavigation({waitUntil:'networkidle',timeout:60000}).catch(()=>{}), pv.click()]); }
    const ta=await pg.$('textarea[name=pastaba]'); if(ta){ await ta.fill('TEST prierašas H258'); await miegok(300); out.gyva=await pg.$$eval('.ps-gyva',ns=>ns.map(n=>n.style.display+'|'+n.textContent.trim())).catch(()=>[]); }
    out.perziura=await busena(pg,'perziura');
    // perregistruoti #35061 su 2 dėžėmis
    const f=await pg.$('form.ps-dez-f:has(input[name=ids][value="35061"])');
    if(f){ await f.$eval('input[name=n]',n=>n.value='2'); const b=await f.$('button'); await Promise.all([pg.waitForNavigation({waitUntil:'networkidle',timeout:120000}).catch(()=>{}), b.click()]); out.perreg=await busena(pg,'perreg'); out.perreg.dez=await pg.$$eval('form.ps-dez-f',ns=>ns.map(n=>n.querySelector('input[name=ids]').value+':'+n.parentElement.querySelector('.ps-lip').textContent.trim())).catch(()=>[]); }
    else out.perreg='formos nera';
    // ps-dropship kelias (iš desk) — ta pati kortelė
    await pg.goto(WP+'/wp-admin/admin.php?page=ps-desk&eile=nauji',{waitUntil:'networkidle',timeout:60000});
    const a=await pg.$('tr:has-text("#35066") a:has-text("Perduoti")');
    if(a){ await Promise.all([pg.waitForNavigation({waitUntil:'networkidle',timeout:60000}).catch(()=>{}), a.click()]); out.dropship=await busena(pg,'dropship');
      out.dropship.textarea=await pg.$$eval('textarea[name=pastaba]',ns=>ns.length).catch(()=>-1); out.dropship.dez=await pg.$$eval('form.ps-dez-f',ns=>ns.length).catch(()=>-1); }
    else out.dropship='mygtuko nera';
    out.js=kl; await br.close();
  }
  const p=await fx(WP+'/?ps_h258=RUN20260824G&po=1',{},'po'); try{ out.serveris=JSON.parse(await p.text()); }catch(e){ out.serveris='ne-json'; }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h258run.json', Buffer.from(JSON.stringify(out,null,1)), 'H258A');
