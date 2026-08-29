process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIENyb24gQWxpYXJtdSBQYXRpa3JhIHYxLjAgKHBvIHRhaXN5bW8pICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc192ZiddKT8kX0dFVFsncHNfdmYnXTonJykhPT0nQ0hFQ0sxJykgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nRklYQ0hLLXYxLjAnKTsKCiAgJG9bJ3Nhcmdhc19tZDUnXT1tZDVfZmlsZShXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXNhcmdhcy5waHAnKTsKICAkb1sndmFseW1hc19tZDUnXT1AbWQ1X2ZpbGUoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1zaXVudHUtdmFseW1hcy5waHAnKTsKICAkb1sndmFseW1vX2tsYXNlJ109Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX1NpdW50dV9WYWx5bWFzJyk7CiAgJG9bJ2thYmxpdWthc19kZWxldGVfb3JkZXInXT1oYXNfYWN0aW9uKCd3b29jb21tZXJjZV9kZWxldGVfb3JkZXInLCBhcnJheSgnUGV0c2hvcF9TaXVudHVfVmFseW1hcycsJ2lzdHJpbnRpJykpIT09ZmFsc2U7CiAgJG9bJ2thYmxpdWthc19iZWZvcmVfZGVsZXRlJ109aGFzX2FjdGlvbignYmVmb3JlX2RlbGV0ZV9wb3N0JywgYXJyYXkoJ1BldHNob3BfU2l1bnR1X1ZhbHltYXMnLCdpc19wb3N0bycpKSE9PWZhbHNlOwoKICAvKiBzYXJnbyBpbnRlcnZhbG8gZmlsdHJhcyAqLwogIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9TYXJnYXMnKSl7CiAgICB0cnl7CiAgICAgICRtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX1NhcmdhcycsJ3JlY2lhdV9uZWlfcGFyYScpOyAkbS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICAgICAgZm9yZWFjaChhcnJheSgnb25jZV9pbl93ZWVrJywnd2Vla2x5JywnbW9udGhseScsJ2NtcGx6X3dlZWtseScsJ2NtcGx6X21vbnRobHknLCdjbXBsel9kYWlseScsJ2RhaWx5JywndHdpY2VkYWlseScsJ2hvdXJseScsJ2V2ZXJ5X21pbnV0ZScsJ25lemlub21hc19zYXZhaXRpbmlzJykgYXMgJHMpewogICAgICAgICRvWydmaWx0cmFzJ11bJHNdPSRtLT5pbnZva2UobnVsbCwkcykgPyAnUFJBTEVJRFpJQU0nIDogJ3Rpa3JpbmFtJzsKICAgICAgfQogICAgfWNhdGNoKFxUaHJvd2FibGUgJGUpeyAkb1snZmlsdHJhc19rbGFpZGEnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgfQoKICAvKiBuYXNsYWljaWFpICovCiAgJHQ9JHAuJ3BzX3NoaXBtZW50cyc7CiAgJG9bJ3NoX3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBgJHRgIik7CiAgJG9bJ25hc2xhaWNpdV9zayddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIGAkdGAgcyBXSEVSRSBOT1QgRVhJU1RTIChTRUxFQ1QgMSBGUk9NIHskcH13Y19vcmRlcnMgbyBXSEVSRSBvLmlkPXMub3JkZXJfaWQpIik7CiAgJG9bJ2tvcGlqYV95cmEnXT1pc19hcnJheShnZXRfb3B0aW9uKCdwc19zaGlwbWVudHNfbmFzbGFpY2lhaV9iYWtfMjAyNjA4MjlfMDgyMDQ0JykpID8gY291bnQoZ2V0X29wdGlvbigncHNfc2hpcG1lbnRzX25hc2xhaWNpYWlfYmFrXzIwMjYwODI5XzA4MjA0NCcpKSA6ICdORVJBJzsKCiAgLyogcmlib3MgKi8KICAkcmI9Z2V0X29wdGlvbigncHNfcnl0YXNfcmlib3MnKTsgJG9bJ3JpYm9zJ109JHJiOwoKICAvKiByeXRhcyBwYXRpa3JvcyAqLwogIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9SeXRhcycpKXsKICAgICRwaz1QZXRzaG9wX1J5dGFzOjpwYXRpa3JvcygpOyAkb1sncGF0aWtyb3MnXT1hcnJheSgpOwogICAgZm9yZWFjaCgoYXJyYXkpJHBrIGFzICR4KXsgJG9bJ3BhdGlrcm9zJ11bXT1zdHJ0b3VwcGVyKCR4WydseWdpcyddKS4nIHwgJy4keFsna29kYXMnXS4nIHwgJy4keFsndGVrc3RhcyddOyB9CiAgfSBlbHNlIHsgJG9bJ3BhdGlrcm9zJ109J1BldHNob3BfUnl0YXMga2xhc2VzIG5lcmEnOyB9CgogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgZWNobyBqc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSwgOTkpOwo='; const VER='FIXCHK-v1.0'; const out={v:VER};
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
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Cron Aliarmu Patikra v1.0 (po taisymo)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id;
  await miegok(9000);
  const d=await fx(WP+'/?ps_vf=CHECK1',{headers:UA},'chk');
  const dt=await d.text(); try{ out.rez=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,2500); }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
/* ekrano nuotrauka */
try{
  const {chromium}=await import('playwright');
  const br=await chromium.launch(); const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1200},
    httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS}});
  const pg=await ctx.newPage();
  await pg.goto(WP+'/wp-login.php',{waitUntil:'domcontentloaded',timeout:60000});
  await pg.fill('#user_login',process.env.WP_USER); await pg.fill('#user_pass',process.env.WP_APP_PASS);
  await pg.click('#wp-submit'); await pg.waitForTimeout(4000);
  await pg.goto(WP+'/wp-admin/admin.php?page=petshop-reports',{waitUntil:'networkidle',timeout:90000});
  await pg.waitForTimeout(2500);
  const buf=await pg.screenshot({fullPage:false});
  await put('screenshots/rytas_po_taisymo.png', buf, VER);
  out.ekranas='ok'; out.antraste=(await pg.title()).slice(0,120);
  await br.close();
}catch(e){ out.ekranas='KLAIDA: '+String(e).slice(0,300); }
await put('analize/cron_fix_check.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
