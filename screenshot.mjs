process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI1OCddKSB8fCAkX0dFVFsncHNfaDI1OCddIT09J1JVTjIwMjYwODI0SicpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNThDJyk7CiAkdT1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEsJ29yZGVyYnknPT4nSUQnKSk7CiBpZigkdSl7IHdwX3NldF9jdXJyZW50X3VzZXIoJHVbMF0tPklEKTsgd3Bfc2V0X2F1dGhfY29va2llKCR1WzBdLT5JRCx0cnVlLHRydWUpOyB9CiBpZihpc3NldCgkX0dFVFsnZGVwbG95J10pKXsKICAvLyAzNTA2MSBhdHN0YXR5bWFzOiBzZW5hIHNpdW50YSBpxaEgX3BzX3ZlbmlwYWtfc2VuYQogICRvPXdjX2dldF9vcmRlcigzNTA2MSk7IGlmKCRvICYmICRvLT5nZXRfbWV0YSgnX3BzX3ZlbmlwYWtfc2VuYScpKXsgJG8tPnVwZGF0ZV9tZXRhX2RhdGEoJ3ZlbmlwYWtfc2hpcHBpbmdfb3JkZXJfZGF0YScsJG8tPmdldF9tZXRhKCdfcHNfdmVuaXBha19zZW5hJykpOyAkby0+ZGVsZXRlX21ldGFfZGF0YSgnX3BzX3ZlbmlwYWtfc2VuYScpOyAkby0+dXBkYXRlX21ldGFfZGF0YSgnX3BzX3Bha3VvY2l1JywxKTsgJG8tPmFkZF9vcmRlcl9ub3RlKCdIMjU4Qzogc2VuYSBzaXVudGEgVjA3MjY3RTEwMDAwMTAgZ3LEhcW+aW50YSBwbyBuZXBhdnlrdXNpbyBwZXJyZWdpc3RyYXZpbW8gKHBhxaF0b21hdGFzKS4nLGZhbHNlLHRydWUpOyAkby0+c2F2ZSgpOyAkVFsnYXRzdGF0eXRhXzM1MDYxJ109anNvbl9kZWNvZGUoKHN0cmluZykkby0+Z2V0X21ldGEoJ3ZlbmlwYWtfc2hpcHBpbmdfb3JkZXJfZGF0YScpLHRydWUpWydwYWNrX251bWJlcnMnXTsgfQogICRzaGE9c2FuaXRpemVfdGV4dF9maWVsZCgkX0dFVFsnc2hhJ10pOwogIGZvcmVhY2goYXJyYXkoJ3BldHNob3AtZGVzay5waHAnLCdwZXRzaG9wLWF2LWRyb3BzaGlwLnBocCcpIGFzICRmKXsKICAgJHI9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS9jb250ZW50cy9kZXBsb3kvJy4kZi4nLmI2ND9yZWY9Jy4kc2hhLGFycmF5KCd0aW1lb3V0Jz0+NDAsJ2hlYWRlcnMnPT5hcnJheSgnVXNlci1BZ2VudCc9PidwcycsJ0FjY2VwdCc9PidhcHBsaWNhdGlvbi92bmQuZ2l0aHViK2pzb24nKSkpOwogICAkaj1qc29uX2RlY29kZSh3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkciksdHJ1ZSk7CiAgICRjb2RlPWJhc2U2NF9kZWNvZGUodHJpbShpc3NldCgkalsnY29udGVudCddKT9iYXNlNjRfZGVjb2RlKCRqWydjb250ZW50J10pOicnKSk7CiAgICRpbmY9YXJyYXkoJ2dhdXRhJz0+c3RybGVuKCRjb2RlKSk7CiAgIGlmKCRjb2RlICYmIHN0cnBvcygkY29kZSwnPD9waHAnKT09PTApewogICAgdHJ5eyB0b2tlbl9nZXRfYWxsKCRjb2RlLCBUT0tFTl9QQVJTRSk7ICRpbmZbJ3NpbnRha3NlJ109J29rJzsgfSBjYXRjaChQYXJzZUVycm9yICRlKXsgJGluZlsnc2ludGFrc2UnXT0nS0xBSURBOiAnLiRlLT5nZXRNZXNzYWdlKCk7IH0KICAgIGlmKCdvayc9PT0kaW5mWydzaW50YWtzZSddKXsgJGRzdD1XUE1VX1BMVUdJTl9ESVIuJy8nLiRmOyBAY29weSgkZHN0LCBXUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMtYmFja3Vwcy8nLiRmLicuYmFrX2gyNThjJyk7IGZpbGVfcHV0X2NvbnRlbnRzKCRkc3QsJGNvZGUpOyAkaW5mWydtZDUnXT1tZDVfZmlsZSgkZHN0KTsgfQogICB9IGVsc2UgeyAkaW5mWydzaW50YWtzZSddPSd0dXNjaWEnOyB9CiAgICRUWydmYWlsYWknXVskZl09JGluZjsKICB9CiB9CiBpZihpc3NldCgkX0dFVFsncG8nXSkpewogIGZvcmVhY2goYXJyYXkoMzUwNjEsMzUwNjApIGFzICRpZCl7ICRvPXdjX2dldF9vcmRlcigkaWQpOyBpZighJG8pIGNvbnRpbnVlOwogICAkZD1qc29uX2RlY29kZSgoc3RyaW5nKSRvLT5nZXRfbWV0YSgndmVuaXBha19zaGlwcGluZ19vcmRlcl9kYXRhJyksdHJ1ZSk7CiAgICRUWyd1enMnXVskaWRdPWFycmF5KCdwYWtfbWV0YSc9PiRvLT5nZXRfbWV0YSgnX3BzX3Bha3VvY2l1JyksJ3BhY2tfbnVtYmVycyc9PiRkWydwYWNrX251bWJlcnMnXT8/bnVsbCwnc3RhdHVzJz0+JGRbJ3N0YXR1cyddPz9udWxsLCdzZW5hJz0+KGJvb2wpJG8tPmdldF9tZXRhKCdfcHNfdmVuaXBha19zZW5hJyksCiAgICAncGFzdGFib3MnPT5hcnJheV9tYXAoZnVuY3Rpb24oJG4pe3JldHVybiBtYl9zdWJzdHIoJG4tPmNvbnRlbnQsMCwxMjApO30sYXJyYXlfc2xpY2Uod2NfZ2V0X29yZGVyX25vdGVzKGFycmF5KCdvcmRlcl9pZCc9PiRpZCwnbGltaXQnPT4yKSksMCwyKSkpOwogIH0KIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo='; const SHA='8aca70b9749663875657d3e4b843f9cc5364231a';
const MD5={"petshop-desk.php": "6f8c0b24c99562f1bb5812d1a2ccf03c", "petshop-av-dropship.php": "be4db6a888d81f71b1a3401001441782"};
const out={v:'H258C'};
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
  if(name) o.put=await put('screenshots/h258_'+name+'.png',await pg.screenshot({fullPage:true}),'H258C'); return o; }
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H257 v1 (deploy+E2E laiskai)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h258=RUN20260824J&deploy=1&sha='+SHA,{},'deploy');
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
    // perregistruoti #35061 su 2 dėžėmis
    const f=await pg.$('form.ps-dez-f:has(input[name=ids][value="35060"])');
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
  const p=await fx(WP+'/?ps_h258=RUN20260824J&po=1',{},'po'); try{ out.serveris=JSON.parse(await p.text()); }catch(e){ out.serveris='ne-json'; }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h258run.json', Buffer.from(JSON.stringify(out,null,1)), 'H258C');
