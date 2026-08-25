process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI5MCddKSB8fCAkX0dFVFsncHNfaDI5MCddIT09J1JVTjIwMjYwODI1WicpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyOTBBJyk7IGdsb2JhbCAkd3BkYjsKICR1PWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSwnb3JkZXJieSc9PidJRCcpKTsKIGlmKCR1KXsgd3Bfc2V0X2N1cnJlbnRfdXNlcigkdVswXS0+SUQpOyB3cF9zZXRfYXV0aF9jb29raWUoJHVbMF0tPklELHRydWUsdHJ1ZSk7IH0KIGlmKGlzc2V0KCRfR0VUWydkZXBsb3knXSkpewogICRzaGE9c2FuaXRpemVfdGV4dF9maWVsZCgkX0dFVFsnc2hhJ10pOyAkZj0ncGV0c2hvcC1yaW5raW5pYWkucGhwJzsKICAkcj13cF9yZW1vdGVfZ2V0KCdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlL2NvbnRlbnRzL2RlcGxveS8nLiRmLicuYjY0P3JlZj0nLiRzaGEsYXJyYXkoJ3RpbWVvdXQnPT40MCwnaGVhZGVycyc9PmFycmF5KCdVc2VyLUFnZW50Jz0+J3BzJywnQWNjZXB0Jz0+J2FwcGxpY2F0aW9uL3ZuZC5naXRodWIranNvbicpKSk7CiAgJGo9anNvbl9kZWNvZGUod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpLHRydWUpOyAkY29kZT1iYXNlNjRfZGVjb2RlKHRyaW0oaXNzZXQoJGpbJ2NvbnRlbnQnXSk/YmFzZTY0X2RlY29kZSgkalsnY29udGVudCddKTonJykpOwogICRpbmY9YXJyYXkoJ2dhdXRhJz0+c3RybGVuKCRjb2RlKSk7CiAgaWYoJGNvZGUgJiYgc3RycG9zKCRjb2RlLCc8P3BocCcpPT09MCl7IHRyeXsgdG9rZW5fZ2V0X2FsbCgkY29kZSwgVE9LRU5fUEFSU0UpOyAkaW5mWydzaW50YWtzZSddPSdvayc7IH0gY2F0Y2goUGFyc2VFcnJvciAkZSl7ICRpbmZbJ3NpbnRha3NlJ109J0tMQUlEQTogJy4kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgIGlmKCdvayc9PT0kaW5mWydzaW50YWtzZSddKXsgJGRzdD1XUE1VX1BMVUdJTl9ESVIuJy8nLiRmOyAkaW5mWydtZDVfcHJpZXMnXT1tZDVfZmlsZSgkZHN0KTsgQGNvcHkoJGRzdCwgV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMvJy4kZi4nLmJha19oMjkwJyk7IGZpbGVfcHV0X2NvbnRlbnRzKCRkc3QsJGNvZGUpOyAkaW5mWydtZDUnXT1tZDVfZmlsZSgkZHN0KTsgfSB9CiAgJFRbJ2ZhaWxhaSddWyRmXT0kaW5mOwogICRUWydyaW5rJ109d2NfZ2V0X3Byb2R1Y3RfaWRfYnlfc2t1KCczNDE4NTAtZHAnKTsKICAkVFsnYW5pbW9uZGEnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3RpdGxlIExJS0UgJ0FuaW1vbmRhIEdyYW5DYXJubyBBZHVsdCBrb25zZXJ2JSA2IHggODAwIGcgIzElJyBMSU1JVCAxIik7CiAgJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK'; const SHA='f287ef53066a1a5cf394542ab46649cbe52980a4'; const MD5='b9c1e81b7ce0cedb153a7c263ac16e59';
const out={v:'H290A'}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H290 v1 (rinkiniai v1.36)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h290=RUN20260825Z&deploy=1&sha='+SHA,{},'deploy');
  const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
  try{ out.deploy=JSON.parse(await d.text()); }catch(e){ out.deploy='ne-json'; }
  out.md5_ok=out.deploy.failai&&out.deploy.failai['petshop-rinkiniai.php'].md5===MD5;
  const cookies=[]; for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
  if(out.md5_ok&&cookies.length){
    await miegok(2500);
    const {chromium}=await import('playwright'); const br=await chromium.launch();
    const ctx=await br.newContext({viewport:{width:1500,height:1100},ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
    const pg=await ctx.newPage(); const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,140)));
    // 1) 1% rinkinys — nauda ir del turi dingti
    const an=out.deploy.animonda;
    await pg.goto(WP+'/?p='+an,{waitUntil:'networkidle',timeout:60000}); await miegok(1200);
    out.animonda={id:an,url:pg.url().replace(WP,''),
      klase:await pg.$eval('body',n=>n.className.includes('ps-rink-be-naudos')),
      nauda:await pg.$$eval('.ps-rink-nauda',ns=>ns.map(n=>getComputedStyle(n).display)),
      del:await pg.$$eval('.product-info .price del',ns=>ns.map(n=>getComputedStyle(n).display))};
    // 2) 15% rinkinys — nauda turi likti
    await pg.goto(WP+'/product/rinkinys-gurmanams-skanestai-sunims/',{waitUntil:'networkidle',timeout:60000}); await miegok(1000);
    out.gurmanams={nauda:await pg.$$eval('.ps-rink-nauda',ns=>ns.map(n=>getComputedStyle(n).display)),
      del:await pg.$$eval('.product-info .price del',ns=>ns.map(n=>getComputedStyle(n).display))};
    // 3) admin: zymu nuemimas
    await pg.goto(WP+'/wp-admin/admin.php?page=ps-rinkiniai&veiksmas=keisti&id='+out.deploy.rink,{waitUntil:'networkidle',timeout:60000}); await miegok(1500);
    out.chips_pries=await pg.$$eval('#psr-vieta .psr-chip',ns=>ns.map(n=>n.textContent.replace(/✕/g,'').trim()));
    out.x_mygtukai=await pg.$$eval('#psr-vieta .psr-chip.auto button',ns=>ns.length);
    await pg.click('#psr-vieta .psr-chip.auto:last-child button').catch(e=>out.klik=String(e).slice(0,80));
    await miegok(500);
    out.chips_po=await pg.$$eval('#psr-vieta .psr-chip',ns=>ns.map(n=>n.textContent.replace(/✕/g,'').trim()));
    out.js=kl;
    out.put=await put('screenshots/h290_admin.png',await pg.screenshot({fullPage:false}),'H290A');
    await br.close();
  }
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h290run.json', Buffer.from(JSON.stringify(out,null,1)), 'H290A');
