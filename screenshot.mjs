process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI1NyddKSB8fCAkX0dFVFsncHNfaDI1NyddIT09J1JVTjIwMjYwODI0RCcpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNTdBJyk7CiAkdT1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEsJ29yZGVyYnknPT4nSUQnKSk7CiBpZigkdSl7IHdwX3NldF9jdXJyZW50X3VzZXIoJHVbMF0tPklEKTsgd3Bfc2V0X2F1dGhfY29va2llKCR1WzBdLT5JRCx0cnVlLHRydWUpOyB9CiBpZihpc3NldCgkX0dFVFsnZGVwbG95J10pKXsKICAkc2hhPXNhbml0aXplX3RleHRfZmllbGQoJF9HRVRbJ3NoYSddKTsKICBmb3JlYWNoKGFycmF5KCdwZXRzaG9wLWRlc2sucGhwJywncGV0c2hvcC1hdi1kcm9wc2hpcC5waHAnKSBhcyAkZil7CiAgICRyPXdwX3JlbW90ZV9nZXQoJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvcmFpbWlzMDc5LWNyZWF0b3IvcGV0c2hvcC1icmlkZ2UvY29udGVudHMvZGVwbG95LycuJGYuJy5iNjQ/cmVmPScuJHNoYSxhcnJheSgndGltZW91dCc9PjQwLCdoZWFkZXJzJz0+YXJyYXkoJ1VzZXItQWdlbnQnPT4ncHMnLCdBY2NlcHQnPT4nYXBwbGljYXRpb24vdm5kLmdpdGh1Yitqc29uJykpKTsKICAgJGo9anNvbl9kZWNvZGUod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpLHRydWUpOwogICAkY29kZT1iYXNlNjRfZGVjb2RlKHRyaW0oaXNzZXQoJGpbJ2NvbnRlbnQnXSk/YmFzZTY0X2RlY29kZSgkalsnY29udGVudCddKTonJykpOwogICAkaW5mPWFycmF5KCdnYXV0YSc9PnN0cmxlbigkY29kZSkpOwogICBpZigkY29kZSAmJiBzdHJwb3MoJGNvZGUsJzw/cGhwJyk9PT0wKXsKICAgIHRyeXsgdG9rZW5fZ2V0X2FsbCgkY29kZSwgVE9LRU5fUEFSU0UpOyAkaW5mWydzaW50YWtzZSddPSdvayc7IH0gY2F0Y2goUGFyc2VFcnJvciAkZSl7ICRpbmZbJ3NpbnRha3NlJ109J0tMQUlEQTogJy4kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgICBpZignb2snPT09JGluZlsnc2ludGFrc2UnXSl7ICRkc3Q9V1BNVV9QTFVHSU5fRElSLicvJy4kZjsgQGNvcHkoJGRzdCwgV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMvJy4kZi4nLmJha19oMjU3Jyk7IGZpbGVfcHV0X2NvbnRlbnRzKCRkc3QsJGNvZGUpOyAkaW5mWydtZDUnXT1tZDVfZmlsZSgkZHN0KTsgfQogICB9IGVsc2UgeyAkaW5mWydzaW50YWtzZSddPSd0dXNjaWEnOyB9CiAgICRUWydmYWlsYWknXVskZl09JGluZjsKICB9CiB9CiBpZihpc3NldCgkX0dFVFsncG8nXSkpewogIGZvcmVhY2goYXJyYXkoMzUwNjIsMzUwNjMsMzUwNjQpIGFzICRpZCl7ICRvPXdjX2dldF9vcmRlcigkaWQpOyBpZighJG8pIGNvbnRpbnVlOwogICAkVFsndXpzJ11bJGlkXT1hcnJheSgnc3QnPT4kby0+Z2V0X3N0YXR1cygpLCdzZW50X3NyYyc9PiRvLT5nZXRfbWV0YSgnX3BzX2Ryb3BzaGlwX3NlbnRfc3JjJyksCiAgICAncGFzdGFib3MnPT5hcnJheV9tYXAoZnVuY3Rpb24oJG4pe3JldHVybiBtYl9zdWJzdHIoJG4tPmNvbnRlbnQsMCwxMjApO30sYXJyYXlfc2xpY2Uod2NfZ2V0X29yZGVyX25vdGVzKGFycmF5KCdvcmRlcl9pZCc9PiRpZCwnbGltaXQnPT4yKSksMCwyKSkpOwogIH0KICAkYT0oYXJyYXkpZ2V0X29wdGlvbigncHNfbGFpc2t1X2FyY2h5dmFzJyxhcnJheSgpKTsKICBmb3JlYWNoKGFycmF5X3NsaWNlKCRhLDAsMikgYXMgJGUpeyAkVFsnYXJjaCddW109YXJyYXkoJ2xhaWthcyc9PiRlWydsYWlrYXMnXSwna2FtJz0+JGVbJ2thbSddLCd0ZW1hJz0+JGVbJ3RlbWEnXSwna29udCc9PiRlWydrb250J10pOyB9CiAgJFRbJ3RyYW5zaWVudCddPWdldF90cmFuc2llbnQoJ3BzX2Ryb3BzaGlwXycuZ2V0X2N1cnJlbnRfdXNlcl9pZCgpKTsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo='; const SHA='68a188609b50a5c525eaa3fd1bd9e52d1f9ae46d';
const MD5={"petshop-desk.php":"65e2311ee38b3591e44253f69dcf8ff5","petshop-av-dropship.php":"e76bf173f83d235a548b69c4da070448"};
const out={v:'H257A'};
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
  if(name) o.put=await put('screenshots/h257_'+name+'.png',await pg.screenshot({fullPage:true}),'H257A'); return o; }
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H257 v1 (deploy+E2E laiskai)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h257=RUN20260824D&deploy=1&sha='+SHA,{},'deploy');
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
    // 1) desk rail
    await pg.goto(WP+'/wp-admin/admin.php?page=ps-desk&eile=nauji',{waitUntil:'networkidle',timeout:60000});
    out.desk=await busena(pg,'desk');
    out.desk.rail=await pg.$$eval('.pd-rail a, .pd-nav a',ns=>ns.map(n=>n.textContent.trim().replace(/\s+/g,' ')).slice(0,14)).catch(()=>[]);
    // 2) Laiskai -> Laukia
    await pg.goto(WP+'/wp-admin/admin.php?page=ps-laiskai&b=laukia',{waitUntil:'networkidle',timeout:60000});
    out.laukia=await busena(pg,'laukia');
    out.laukia.tiekejai=await pg.$$eval('.ps-tiek-h',ns=>ns.map(n=>n.textContent.trim().replace(/\s+/g,' ').slice(0,80))).catch(()=>[]);
    out.laukia.mygtukai=await pg.$$eval('a.button-primary',ns=>ns.map(n=>n.textContent.trim())).catch(()=>[]);
    // 3) Perduoti Quattro visus vienu laisku (tik man)
    const a=await pg.$('a.button-primary:has-text("Perduoti Quattro")');
    if(a){ await Promise.all([pg.waitForNavigation({waitUntil:'networkidle',timeout:60000}).catch(()=>{}), a.click()]);
      out.perduoti=await busena(pg,'perduoti');
      out.perduoti.uzsakymai=await pg.$eval('input[name=uzsakymai]',n=>n.value).catch(()=>'?');
      out.perduoti.vartai=await pg.$$eval('.notice-error,.notice-warning',ns=>ns.map(n=>n.textContent.trim().replace(/\s+/g,' ').slice(0,160))).catch(()=>[]);
      const t=await pg.$('input[name=laisk_tiekejui]'); if(t&&await t.isChecked()) await t.uncheck();
      const m=await pg.$('input[name=laisk_man]'); if(m&&!(await m.isChecked())) await m.check();
      const sb=await pg.$('form.ps-siusti button.button-primary:not([disabled])');
      if(sb){ out.perduoti.mygtukas=(await sb.textContent()).trim(); await Promise.all([pg.waitForNavigation({waitUntil:'networkidle',timeout:150000}).catch(()=>{}), sb.click()]); out.po=await busena(pg,'po');
        out.po.tiekejai=await pg.$$eval('.ps-tiek-h',ns=>ns.map(n=>n.textContent.trim().replace(/\s+/g,' ').slice(0,80))).catch(()=>[]); }
      else out.perduoti.mygtukas='NERA aktyvaus primary';
    } else out.perduoti='mygtuko nera';
    out.js=kl; await br.close();
  }
  const p=await fx(WP+'/?ps_h257=RUN20260824D&po=1',{},'po'); try{ out.serveris=JSON.parse(await p.text()); }catch(e){ out.serveris='ne-json'; }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h257run.json', Buffer.from(JSON.stringify(out,null,1)), 'H257A');
