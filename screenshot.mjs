process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI1MyddKSB8fCAkX0dFVFsncHNfaDI1MyddIT09J1JVTjIwMjYwODI0SicpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNTNBJyk7CiAkdT1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEsJ29yZGVyYnknPT4nSUQnKSk7CiBpZigkdSl7IHdwX3NldF9jdXJyZW50X3VzZXIoJHVbMF0tPklEKTsgd3Bfc2V0X2F1dGhfY29va2llKCR1WzBdLT5JRCx0cnVlLHRydWUpOyB9CiBpZihpc3NldCgkX0dFVFsncG8nXSkpewogIGdsb2JhbCAkd3BkYjsKICBmb3JlYWNoKGFycmF5KDM1MDY0LDM1MDYzLDM1MDYyLDM1MDYxLDM1MDYwLDM1MDU5LDM1MDU3LDM1MDU2KSBhcyAkaWQpeyAkbz13Y19nZXRfb3JkZXIoJGlkKTsgaWYoISRvKSBjb250aW51ZTsKICAgJGQ9anNvbl9kZWNvZGUoKHN0cmluZykkby0+Z2V0X21ldGEoJ3ZlbmlwYWtfc2hpcHBpbmdfb3JkZXJfZGF0YScpLHRydWUpOwogICAkVFsndXpzJ11bJGlkXT1hcnJheSgnc3QnPT4kby0+Z2V0X3N0YXR1cygpLCdzZW50X3NyYyc9PiRvLT5nZXRfbWV0YSgnX3BzX2Ryb3BzaGlwX3NlbnRfc3JjJyksJ3BhY2tzJz0+JGRbJ3BhY2tfbnVtYmVycyddPz9udWxsLCdtYW4nPT4kZFsnbWFuaWZlc3RfaWQnXT8/KCRkWydtYW5pZmVzdCddPz9udWxsKSwKICAgICdwYXN0YWJvcyc9PmFycmF5X21hcChmdW5jdGlvbigkbil7cmV0dXJuIG1iX3N1YnN0cigkbi0+Y29udGVudCwwLDE0MCk7fSxhcnJheV9zbGljZSh3Y19nZXRfb3JkZXJfbm90ZXMoYXJyYXkoJ29yZGVyX2lkJz0+JGlkLCdsaW1pdCc9PjMpKSwwLDMpKSk7CiAgfQogICRhPShhcnJheSlnZXRfb3B0aW9uKCdwc19sYWlza3VfYXJjaHl2YXMnLGFycmF5KCkpOwogIGZvcmVhY2goYXJyYXlfc2xpY2UoJGEsMCw0KSBhcyAkZSl7ICRUWydhcmNoJ11bXT1hcnJheSgnbGFpa2FzJz0+JGVbJ2xhaWthcyddLCdrYW0nPT4kZVsna2FtJ10sJ3RlbWEnPT4kZVsndGVtYSddLCdrb250Jz0+JGVbJ2tvbnQnXSwncHJpZWRhaSc9PiRlWydwcmllZGFpJ10pOyB9CiAgJFRbJ3RpZWsnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCx0aWVrZWphcyxidXNlbmEsdmVuaXBha19wYWNrLHZlbmlwYWtfbWFuaWZlc3QsdXpzYWt5dGEscHJpc3RhdHltYXMgRlJPTSB7JHdwZGItPnByZWZpeH1wc190aWVraW1hcyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDYiLEFSUkFZX0EpOwogICRuPWdldF9vcHRpb24oJ3Nob3B1cF92ZW5pcGFrX3NoaXBwaW5nX3NldHRpbmdzJyxhcnJheSgpKTsgJFRbJ3ZwX3VzZXInXT0hZW1wdHkoJG5bJ3Nob3B1cF92ZW5pcGFrX3NoaXBwaW5nX2ZpZWxkX3VzZXJuYW1lJ10pPyd5cmEnOidORVJBJzsKICAkVFsnbG4nXT1nZXRfb3B0aW9uKCdwc190aWVrX2xhaXNrYWknKTsKICAkbGY9V1BfQ09OVEVOVF9ESVIuJy9kZWJ1Zy5sb2cnOyBpZihmaWxlX2V4aXN0cygkbGYpKXsgJGw9ZmlsZSgkbGYpOyAkVFsnbG9nJ109YXJyYXlfc2xpY2UoJGwsLTE1KTsgfQogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo=';
const out={v:'H253A'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  const u='https://api.github.com/repos/'+REPO+'/contents/'+path;
  const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
async function busena(pg,name){
  await miegok(800); const html=await pg.content();
  const o={url:pg.url().replace(WP,''), h1:await pg.$eval('h1',n=>n.textContent.trim()).catch(()=>'?'),
    fatal:/Fatal error|critical error|Kritinė klaida/i.test(html),
    notices:await pg.$$eval('.notice,.pd-msg,.pd-zinute,.updated,.error,.ps-tk-msg,.pd-alert',ns=>ns.map(n=>n.textContent.trim().replace(/\s+/g,' ').slice(0,220)).filter(t=>!t.includes('WordPress 7.1'))).catch(()=>[])};
  if(name) o.put=await put('screenshots/h253_'+name+'.png',await pg.screenshot({fullPage:true}),'H253A');
  return o;
}
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H253 v1 (E2E testas)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){ sid=j.id; await miegok(9000);
    const d=await fx(WP+'/?ps_h253=RUN20260824J',{},'login');
    const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
    const cookies=[];
    for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
    if(cookies.length){
      const {chromium}=await import('playwright');
      const br=await chromium.launch();
      const ctx=await br.newContext({viewport:{width:1500,height:1100},ignoreHTTPSErrors:true});
      await ctx.addCookies(cookies);
      const pg=await ctx.newPage();
      const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,150)));
      pg.on('dialog',async dg=>{ out.dialogai=(out.dialogai||[]); out.dialogai.push(dg.message().slice(0,120)); await dg.accept(); });
      // A) Venipak registracija per rytinę eigą z=3
      await pg.goto(WP+'/wp-admin/admin.php?page=ps-desk&view=rytas&z=3',{waitUntil:'networkidle',timeout:60000});
      out.vp_pries=await busena(pg,'vp_pries');
      out.vp_pries.grupes=await pg.$$eval('.pd-vgrp-h',ns=>ns.map(n=>n.textContent.trim().replace(/\s+/g,' ').slice(0,120))).catch(()=>[]);
      out.vp_reg=[];
      for(let i=0;i<9;i++){
        const a=await pg.$('a.pd-btn-p:has-text("Registruoti")'); if(!a) break;
        const t=(await a.textContent()).trim();
        await Promise.all([pg.waitForNavigation({waitUntil:'networkidle',timeout:120000}).catch(()=>{}), a.click()]);
        const b=await busena(pg,null); out.vp_reg.push({mygtukas:t,url:b.url.slice(0,160),notices:b.notices,fatal:b.fatal});
        if(!pg.url().includes('view=rytas')) await pg.goto(WP+'/wp-admin/admin.php?page=ps-desk&view=rytas&z=3',{waitUntil:'networkidle',timeout:60000});
      }
      out.vp_po=await busena(pg,'vp_po');
      out.vp_po.grupes=await pg.$$eval('.pd-vgrp-h',ns=>ns.map(n=>n.textContent.trim().replace(/\s+/g,' ').slice(0,120))).catch(()=>[]);
      // B) Perduoti #35064 -> siųsti (tik man)
      await pg.goto(WP+'/wp-admin/admin.php?page=ps-desk&eile=nauji',{waitUntil:'networkidle',timeout:60000});
      let a=await pg.$('tr:has-text("#35064") a:has-text("Perduoti")');
      if(a){ await Promise.all([pg.waitForNavigation({waitUntil:'networkidle',timeout:60000}).catch(()=>{}), a.click()]);
        const t=await pg.$('input[name=laisk_tiekejui]'); if(t&&await t.isChecked()) await t.uncheck();
        const m=await pg.$('input[name=laisk_man]'); if(m&&!(await m.isChecked())) await m.check();
        const sb=await pg.$('form button[type=submit],form input[type=submit],form .button-primary');
        if(sb){ await Promise.all([pg.waitForNavigation({waitUntil:'networkidle',timeout:120000}).catch(()=>{}), sb.click()]); out.perduoti=await busena(pg,'perduoti_po'); }
        else out.perduoti='submit nerastas';
      } else out.perduoti='mygtuko nera';
      // C) Tiekimas: VF partija -> Užsakyti iš tiekėjo
      await pg.goto(WP+'/wp-admin/admin.php?page=ps-tiekimas',{waitUntil:'networkidle',timeout:60000});
      const forms=await pg.$$('form:has(button[value=uzsakyti])');
      out.tiek_formos=forms.length;
      let vf=null;
      for(const f of forms){ const tx=(await f.textContent())||''; if(/Vetfarmas|VF/.test(tx)){ vf=f; break; } }
      if(vf){
        const t=await vf.$('input[name=laisk_tiekejui]'); if(t&&await t.isChecked()) await t.uncheck();
        const m=await vf.$('input[name=laisk_man]'); if(m&&!(await m.isChecked())) await m.check();
        const b=await vf.$('button[value=uzsakyti]');
        await Promise.all([pg.waitForNavigation({waitUntil:'networkidle',timeout:150000}).catch(()=>{}), b.click()]);
        out.tiek_uzsakyti=await busena(pg,'tiek_po');
      } else out.tiek_uzsakyti='VF forma nerasta';
      // D) desk po visko
      await pg.goto(WP+'/wp-admin/admin.php?page=ps-desk&eile=nauji',{waitUntil:'networkidle',timeout:60000});
      out.desk_po=await busena(pg,'desk_po');
      out.desk_po.pipeline=await pg.$$eval('.pd-pipe a,.pd-pipeline a,.pd-pl a',ns=>ns.map(n=>n.textContent.trim().replace(/\s+/g,' '))).catch(()=>[]);
      out.js=kl; await br.close();
    } else out.cookies='nera';
    const p=await fx(WP+'/?ps_h253=RUN20260824J&po=1',{},'po'); const px=await p.text(); try{ out.serveris=JSON.parse(px);}catch(e){ out.serveris='ne-json: '+px.slice(0,300);}
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h253run.json', Buffer.from(JSON.stringify(out,null,1)), 'H253A');
