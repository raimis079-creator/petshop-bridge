process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI2MCddKSB8fCAkX0dFVFsncHNfaDI2MCddIT09J1JVTjIwMjYwODI0TScpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNjBBJyk7IGdsb2JhbCAkd3BkYjsKICR1PWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSwnb3JkZXJieSc9PidJRCcpKTsKIGlmKCR1KXsgd3Bfc2V0X2N1cnJlbnRfdXNlcigkdVswXS0+SUQpOyB3cF9zZXRfYXV0aF9jb29raWUoJHVbMF0tPklELHRydWUsdHJ1ZSk7IH0KIGlmKGlzc2V0KCRfR0VUWydkZXBsb3knXSkpewogICRzaGE9c2FuaXRpemVfdGV4dF9maWVsZCgkX0dFVFsnc2hhJ10pOwogIGZvcmVhY2goYXJyYXkoJ3BldHNob3AtYXYtdGlla2ltYXMucGhwJywncGV0c2hvcC1hdi1kcm9wc2hpcC5waHAnKSBhcyAkZil7CiAgICRyPXdwX3JlbW90ZV9nZXQoJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvcmFpbWlzMDc5LWNyZWF0b3IvcGV0c2hvcC1icmlkZ2UvY29udGVudHMvZGVwbG95LycuJGYuJy5iNjQ/cmVmPScuJHNoYSxhcnJheSgndGltZW91dCc9PjQwLCdoZWFkZXJzJz0+YXJyYXkoJ1VzZXItQWdlbnQnPT4ncHMnLCdBY2NlcHQnPT4nYXBwbGljYXRpb24vdm5kLmdpdGh1Yitqc29uJykpKTsKICAgJGo9anNvbl9kZWNvZGUod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpLHRydWUpOwogICAkY29kZT1iYXNlNjRfZGVjb2RlKHRyaW0oaXNzZXQoJGpbJ2NvbnRlbnQnXSk/YmFzZTY0X2RlY29kZSgkalsnY29udGVudCddKTonJykpOwogICAkaW5mPWFycmF5KCdnYXV0YSc9PnN0cmxlbigkY29kZSkpOwogICBpZigkY29kZSAmJiBzdHJwb3MoJGNvZGUsJzw/cGhwJyk9PT0wKXsKICAgIHRyeXsgdG9rZW5fZ2V0X2FsbCgkY29kZSwgVE9LRU5fUEFSU0UpOyAkaW5mWydzaW50YWtzZSddPSdvayc7IH0gY2F0Y2goUGFyc2VFcnJvciAkZSl7ICRpbmZbJ3NpbnRha3NlJ109J0tMQUlEQTogJy4kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgICBpZignb2snPT09JGluZlsnc2ludGFrc2UnXSl7ICRkc3Q9V1BNVV9QTFVHSU5fRElSLicvJy4kZjsgQGNvcHkoJGRzdCwgV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMvJy4kZi4nLmJha19oMjYwJyk7IGZpbGVfcHV0X2NvbnRlbnRzKCRkc3QsJGNvZGUpOyAkaW5mWydtZDUnXT1tZDVfZmlsZSgkZHN0KTsgfQogICB9IGVsc2UgeyAkaW5mWydzaW50YWtzZSddPSd0dXNjaWEnOyB9CiAgICRUWydmYWlsYWknXVskZl09JGluZjsKICB9CiAgJFRbJ3BhcnRpam9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsdGlla2VqYXMsYnVzZW5hLHByaXN0YXR5bWFzLHZlbmlwYWtfcGFjayBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3RpZWtpbWFzIFdIRVJFIGJ1c2VuYT0na2F1cGlhbWEnIixBUlJBWV9BKTsKIH0KIGlmKGlzc2V0KCRfR0VUWydwbyddKSl7CiAgJFRbJ3BhcnRpam9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsdGlla2VqYXMsYnVzZW5hLHByaXN0YXR5bWFzLHZlbmlwYWtfcGFjayx1enNha3l0YSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3RpZWtpbWFzIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNCIsQVJSQVlfQSk7CiAgJGE9KGFycmF5KWdldF9vcHRpb24oJ3BzX2xhaXNrdV9hcmNoeXZhcycsYXJyYXkoKSk7ICRlPSRhWzBdPz9udWxsOwogIGlmKCRlKXsgJFRbJ2FyY2gnXT1hcnJheSgnbGFpa2FzJz0+JGVbJ2xhaWthcyddLCdrYW0nPT4kZVsna2FtJ10sJ3RlbWEnPT4kZVsndGVtYSddLCdrb250Jz0+JGVbJ2tvbnQnXSwncHJpZWRhaSc9PiRlWydwcmllZGFpJ10sJ2F2X2RhbGlzJz0+c3RycG9zKCRlWydodG1sJ10sJ1ByZWvEl3MgxK8gbcWrc8WzIHNhbmTEl2zErycpIT09ZmFsc2UsJ2h0bWxfaWxnaXMnPT5zdHJsZW4oJGVbJ2h0bWwnXSkpOyB9CiAgZm9yZWFjaChhcnJheSgzNTA2MSwzNTA2NykgYXMgJGlkKXsgJG89d2NfZ2V0X29yZGVyKCRpZCk7IGlmKCRvKSAkVFsndXpzJ11bJGlkXT0kby0+Z2V0X21ldGEoJ19wc19kcm9wc2hpcF9zZW50X3NyYycpOyB9CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK'; const SHA='a6c34c16fc9a3bc7e62467dfff5e9eb69d61a300';
const MD5={"petshop-av-tiekimas.php": "c8b7bf68aefd495549c5fe1e58185af4", "petshop-av-dropship.php": "263e2c2b5a0e6a6057633d638ed9604a"};
const out={v:'H260A'};
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
  if(name) o.put=await put('screenshots/h260_'+name+'.png',await pg.screenshot({fullPage:true}),'H260A'); return o; }
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H257 v1 (deploy+E2E laiskai)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h260=RUN20260824M&deploy=1&sha='+SHA,{},'deploy');
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
    out.laukia.av=await pg.$$eval('.ps-av-blokas',ns=>ns.map(n=>n.className+' | '+n.textContent.trim().replace(/\s+/g,' ').slice(0,260))).catch(()=>[]);
    out.laukia.su_partija=await pg.$$eval('input[name=su_partija]',ns=>ns.map(n=>n.value+':'+n.checked)).catch(()=>[]);
    out.laukia.eiga4=await pg.$$eval('.ps-eiga-z:nth-child(4)',ns=>ns.map(n=>n.textContent.trim().replace(/\s+/g,' ').slice(0,120))).catch(()=>[]);
    // VF kortelė: peržiūra su AV dalimi
    const vf=await pg.$('.ps-tiek:has(h2:has-text("Vetfarmas"))');
    if(vf){ const pv=await vf.$('a.button:has-text("Peržiūrėti laišką")'); if(pv){ await Promise.all([pg.waitForNavigation({waitUntil:'networkidle',timeout:60000}).catch(()=>{}), pv.click()]); }
      out.perziura=await busena(pg,'perziura'); out.perziura.av_dalis=await pg.$$eval('h3',ns=>ns.map(n=>n.textContent.trim())).catch(()=>[]);
      const vf2=await pg.$('.ps-tiek:has(h2:has-text("Vetfarmas"))');
      const sp=await vf2.$('input[name=su_partija]');
      if(sp){ const t=await vf2.$('input[name=laisk_tiekejui]'); if(t&&await t.isChecked()) await t.uncheck(); const mm=await vf2.$('input[name=laisk_man]'); if(mm&&!(await mm.isChecked())) await mm.check();
        let b=await vf2.$('form.ps-siusti button.button-primary'); if(!b) b=await vf2.$('form.ps-siusti button[name=be_lipduku]');
        if(b){ out.mygtukas=(await b.textContent()).trim(); await Promise.all([pg.waitForNavigation({waitUntil:'networkidle',timeout:150000}).catch(()=>{}), b.click()]); out.po=await busena(pg,'po'); }
        else out.po='mygtuko nera'; }
      else out.po='su_partija nera (pristatymas nepasirinktas?)';
    } else out.perziura='VF korteles nera';
    out.js=kl; await br.close();
  }
  const p=await fx(WP+'/?ps_h260=RUN20260824M&po=1',{},'po'); try{ out.serveris=JSON.parse(await p.text()); }catch(e){ out.serveris='ne-json'; }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h260run.json', Buffer.from(JSON.stringify(out,null,1)), 'H260A');
