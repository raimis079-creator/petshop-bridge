process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI1NSddKSB8fCAkX0dFVFsncHNfaDI1NSddIT09J1JVTjIwMjYwODI0TScpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNTVBJyk7CiAkdT1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEsJ29yZGVyYnknPT4nSUQnKSk7CiBpZigkdSl7IHdwX3NldF9jdXJyZW50X3VzZXIoJHVbMF0tPklEKTsgd3Bfc2V0X2F1dGhfY29va2llKCR1WzBdLT5JRCx0cnVlLHRydWUpOyB9CiBpZihpc3NldCgkX0dFVFsnZGVwbG95J10pKXsKICAkc2hhPXNhbml0aXplX3RleHRfZmllbGQoJF9HRVRbJ3NoYSddKTsKICBmb3JlYWNoKGFycmF5KCdwZXRzaG9wLWRlc2sucGhwJywncGV0c2hvcC1hdi1kcm9wc2hpcC5waHAnKSBhcyAkZil7CiAgICRyPXdwX3JlbW90ZV9nZXQoJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvcmFpbWlzMDc5LWNyZWF0b3IvcGV0c2hvcC1icmlkZ2UvY29udGVudHMvZGVwbG95LycuJGYuJy5iNjQ/cmVmPScuJHNoYSxhcnJheSgndGltZW91dCc9PjQwLCdoZWFkZXJzJz0+YXJyYXkoJ1VzZXItQWdlbnQnPT4ncHMnLCdBY2NlcHQnPT4nYXBwbGljYXRpb24vdm5kLmdpdGh1Yitqc29uJykpKTsKICAgJGo9anNvbl9kZWNvZGUod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpLHRydWUpOwogICAkY29kZT1iYXNlNjRfZGVjb2RlKHRyaW0oaXNzZXQoJGpbJ2NvbnRlbnQnXSk/YmFzZTY0X2RlY29kZSgkalsnY29udGVudCddKTonJykpOwogICAkaW5mPWFycmF5KCdnYXV0YSc9PnN0cmxlbigkY29kZSkpOwogICBpZigkY29kZSAmJiBzdHJwb3MoJGNvZGUsJzw/cGhwJyk9PT0wKXsKICAgIHRyeXsgdG9rZW5fZ2V0X2FsbCgkY29kZSwgVE9LRU5fUEFSU0UpOyAkaW5mWydzaW50YWtzZSddPSdvayc7IH0gY2F0Y2goUGFyc2VFcnJvciAkZSl7ICRpbmZbJ3NpbnRha3NlJ109J0tMQUlEQTogJy4kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgICBpZignb2snPT09JGluZlsnc2ludGFrc2UnXSl7ICRkc3Q9V1BNVV9QTFVHSU5fRElSLicvJy4kZjsgQGNvcHkoJGRzdCwgV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMvJy4kZi4nLmJha19oMjU1Jyk7IGZpbGVfcHV0X2NvbnRlbnRzKCRkc3QsJGNvZGUpOyAkaW5mWydtZDUnXT1tZDVfZmlsZSgkZHN0KTsgfQogICB9IGVsc2UgeyAkaW5mWydzaW50YWtzZSddPSd0dXNjaWEnOyB9CiAgICRUWydmYWlsYWknXVskZl09JGluZjsKICB9CiB9CiBpZihpc3NldCgkX0dFVFsncG8nXSkpewogIGdsb2JhbCAkd3BkYjsKICBmb3JlYWNoKGFycmF5KDM1MDY0LDM1MDYzLDM1MDYxLDM1MDU3LDM1MDU2KSBhcyAkaWQpeyAkbz13Y19nZXRfb3JkZXIoJGlkKTsgaWYoISRvKSBjb250aW51ZTsKICAgJFRbJ3V6cyddWyRpZF09YXJyYXkoJ3N0Jz0+JG8tPmdldF9zdGF0dXMoKSwnc2VudF9zcmMnPT4kby0+Z2V0X21ldGEoJ19wc19kcm9wc2hpcF9zZW50X3NyYycpLAogICAgJ3Bhc3RhYm9zJz0+YXJyYXlfbWFwKGZ1bmN0aW9uKCRuKXtyZXR1cm4gbWJfc3Vic3RyKCRuLT5jb250ZW50LDAsMTIwKTt9LGFycmF5X3NsaWNlKHdjX2dldF9vcmRlcl9ub3RlcyhhcnJheSgnb3JkZXJfaWQnPT4kaWQsJ2xpbWl0Jz0+MikpLDAsMikpKTsKICB9CiAgJGE9KGFycmF5KWdldF9vcHRpb24oJ3BzX2xhaXNrdV9hcmNoeXZhcycsYXJyYXkoKSk7CiAgZm9yZWFjaChhcnJheV9zbGljZSgkYSwwLDMpIGFzICRlKXsgJFRbJ2FyY2gnXVtdPWFycmF5KCdsYWlrYXMnPT4kZVsnbGFpa2FzJ10sJ2thbSc9PiRlWydrYW0nXSwndGVtYSc9PiRlWyd0ZW1hJ10sJ2tvbnQnPT4kZVsna29udCddLCdwcmllZGFpJz0+JGVbJ3ByaWVkYWknXSk7IH0KICAkVFsndGllayddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHRpZWtlamFzLGJ1c2VuYSx2ZW5pcGFrX3BhY2ssdmVuaXBha19tYW5pZmVzdCx1enNha3l0YSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3RpZWtpbWFzIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNiIsQVJSQVlfQSk7CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK'; const SHA='8e892c3f091a5f3c5b6793ed313c22665bfa838e';
const MD5={"petshop-desk.php":"f25901270f25965a616e87c10257c256","petshop-av-dropship.php":"77a5ac81000d89a1571cedf63f078341"};
const out={v:'H255A'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
async function busena(pg,name){ await miegok(800); const html=await pg.content();
  const o={url:pg.url().replace(WP,'').slice(0,160), h1:await pg.$eval('h1',n=>n.textContent.trim()).catch(()=>'?'), fatal:/Fatal error|critical error|Kritinė klaida/i.test(html),
    notices:await pg.$$eval('.notice,.pd-msg,.updated,.error,.ps-tk-msg',ns=>ns.map(n=>n.textContent.trim().replace(/\s+/g,' ').slice(0,220)).filter(t=>!t.includes('WordPress 7.1'))).catch(()=>[])};
  if(name) o.put=await put('screenshots/h255_'+name+'.png',await pg.screenshot({fullPage:true}),'H255A'); return o; }
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H255 v1 (deploy+E2E)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h255=RUN20260824M&deploy=1&sha='+SHA,{},'deploy');
  const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
  try{ out.deploy=JSON.parse(await d.text()); }catch(e){ out.deploy='ne-json'; }
  let visi=true; for(const k in MD5){ if(!out.deploy.failai||!out.deploy.failai[k]||out.deploy.failai[k].md5!==MD5[k]) visi=false; } out.md5_ok=visi;
  const cookies=[]; for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
  if(visi && cookies.length){
    await miegok(2000);
    const {chromium}=await import('playwright'); const br=await chromium.launch();
    const ctx=await br.newContext({viewport:{width:1500,height:1100},ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
    const pg=await ctx.newPage(); const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,150)));
    pg.on('dialog',async dg=>{ out.dialogai=(out.dialogai||[]); out.dialogai.push(dg.message().slice(0,100)); await dg.accept(); });
    // 1) desk po pataisos
    await pg.goto(WP+'/wp-admin/admin.php?page=ps-desk&eile=nauji',{waitUntil:'networkidle',timeout:60000});
    out.desk1=await busena(pg,'desk1');
    out.desk1.pipeline=await pg.$$eval('.pd-pipe a,.pd-pipeline a,.pd-pl a',ns=>ns.map(n=>n.textContent.trim().replace(/\s+/g,' '))).catch(()=>[]);
    out.desk1.mygtukai=await pg.$$eval('tbody a.pd-btn',ns=>ns.map(n=>n.textContent.trim())).catch(()=>[]);
    out.desk1.rail=await pg.$$eval('.pd-rail a, .pd-nav a',ns=>ns.map(n=>n.textContent.trim().replace(/\s+/g,' ')).slice(0,14)).catch(()=>[]);
    // 2) Perduoti #35064 -> siųsti (tik man)
    let a=await pg.$('tr:has-text("#35064") a:has-text("Perduoti")');
    if(a){ await Promise.all([pg.waitForNavigation({waitUntil:'networkidle',timeout:60000}).catch(()=>{}), a.click()]);
      out.perduoti=await busena(pg,'perduoti');
      out.perduoti.vartai=await pg.$$eval('.notice-error',ns=>ns.map(n=>n.textContent.trim().replace(/\s+/g,' ').slice(0,160))).catch(()=>[]);
      const t=await pg.$('input[name=laisk_tiekejui]'); if(t&&await t.isChecked()) await t.uncheck();
      const m=await pg.$('input[name=laisk_man]'); if(m&&!(await m.isChecked())) await m.check();
      const sb=await pg.$('form.ps-siusti button.button-primary');
      if(sb){ out.perduoti.mygtukas=(await sb.textContent()).trim(); await Promise.all([pg.waitForNavigation({waitUntil:'networkidle',timeout:150000}).catch(()=>{}), sb.click()]); out.perduoti_po=await busena(pg,'perduoti_po'); }
      else out.perduoti.mygtukas='NERA primary';
    } else out.perduoti='mygtuko nera';
    // 3) desk: #35064 turi būti Paruošta siųsti su „Išsiųsta“
    await pg.goto(WP+'/wp-admin/admin.php?page=ps-desk&eile=paruosta',{waitUntil:'networkidle',timeout:60000});
    out.paruosta=await busena(pg,'paruosta');
    out.paruosta.eilutes=await pg.$$eval('tbody tr',ns=>ns.map(n=>n.textContent.trim().replace(/\s+/g,' ').slice(0,90))).catch(()=>[]);
    out.paruosta.mygtukai=await pg.$$eval('tbody a.pd-btn',ns=>ns.map(n=>n.textContent.trim())).catch(()=>[]);
    const iss=await pg.$('tr:has-text("#35064") a:has-text("Išsiųsta")');
    if(iss){ const href=await iss.getAttribute('href'); out.issiusta_href=href.slice(0,120);
      await pg.goto(href,{waitUntil:'networkidle',timeout:60000}); out.issiusta=await busena(pg,'issiusta'); } else out.issiusta='mygtuko nera';
    // 4) Tiekimas: pirma ne-rankinė partija -> Užsakyti iš tiekėjo (tik man)
    await pg.goto(WP+'/wp-admin/admin.php?page=ps-tiekimas',{waitUntil:'networkidle',timeout:60000});
    const btn=await pg.$('button[value=uzsakyti]:has-text("Užsakyti iš tiekėjo")');
    if(btn){ const f=await btn.evaluateHandle(b=>b.closest('form')); const fe=f.asElement();
      out.tiek_forma=(await fe.$eval('input[name=pid],input[name=partija],input[name=id]',n=>n.name+'='+n.value).catch(()=>'?'));
      const t=await fe.$('input[name=laisk_tiekejui]'); if(t&&await t.isChecked()) await t.uncheck();
      const m=await fe.$('input[name=laisk_man]'); if(m&&!(await m.isChecked())) await m.check();
      await Promise.all([pg.waitForNavigation({waitUntil:'networkidle',timeout:150000}).catch(()=>{}), btn.click()]);
      out.tiek_po=await busena(pg,'tiek_po');
    } else out.tiek_po='mygtuko nera';
    out.js=kl; await br.close();
  }
  const p=await fx(WP+'/?ps_h255=RUN20260824M&po=1',{},'po'); try{ out.serveris=JSON.parse(await p.text()); }catch(e){ out.serveris='ne-json'; }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h255run.json', Buffer.from(JSON.stringify(out,null,1)), 'H255A');
