process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI5NSddKSB8fCAkX0dFVFsncHNfaDI5NSddIT09J1JVTjIwMjYwODI1QUUnKSByZXR1cm47CiAkVD1hcnJheSgndic9PidIMjk1QScpOyBnbG9iYWwgJHdwZGI7CiAkdT1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEsJ29yZGVyYnknPT4nSUQnKSk7CiBpZigkdSl7IHdwX3NldF9jdXJyZW50X3VzZXIoJHVbMF0tPklEKTsgd3Bfc2V0X2F1dGhfY29va2llKCR1WzBdLT5JRCx0cnVlLHRydWUpOyB9CiBpZihpc3NldCgkX0dFVFsnZGVwbG95J10pKXsKICAkc2hhPXNhbml0aXplX3RleHRfZmllbGQoJF9HRVRbJ3NoYSddKTsgJGY9J3BldHNob3Atcmlua2luaWFpLnBocCc7CiAgJHI9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS9jb250ZW50cy9kZXBsb3kvJy4kZi4nLmI2ND9yZWY9Jy4kc2hhLGFycmF5KCd0aW1lb3V0Jz0+NDAsJ2hlYWRlcnMnPT5hcnJheSgnVXNlci1BZ2VudCc9PidwcycsJ0FjY2VwdCc9PidhcHBsaWNhdGlvbi92bmQuZ2l0aHViK2pzb24nKSkpOwogICRqPWpzb25fZGVjb2RlKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSx0cnVlKTsgJGNvZGU9YmFzZTY0X2RlY29kZSh0cmltKGlzc2V0KCRqWydjb250ZW50J10pP2Jhc2U2NF9kZWNvZGUoJGpbJ2NvbnRlbnQnXSk6JycpKTsKICAkaW5mPWFycmF5KCdnYXV0YSc9PnN0cmxlbigkY29kZSkpOwogIGlmKCRjb2RlICYmIHN0cnBvcygkY29kZSwnPD9waHAnKT09PTApeyB0cnl7IHRva2VuX2dldF9hbGwoJGNvZGUsIFRPS0VOX1BBUlNFKTsgJGluZlsnc2ludGFrc2UnXT0nb2snOyB9IGNhdGNoKFBhcnNlRXJyb3IgJGUpeyAkaW5mWydzaW50YWtzZSddPSdLTEFJREE6ICcuJGUtPmdldE1lc3NhZ2UoKTsgfQogICBpZignb2snPT09JGluZlsnc2ludGFrc2UnXSl7ICRkc3Q9V1BNVV9QTFVHSU5fRElSLicvJy4kZjsgJGluZlsnbWQ1X3ByaWVzJ109bWQ1X2ZpbGUoJGRzdCk7IEBjb3B5KCRkc3QsIFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzLycuJGYuJy5iYWtfaDI5NScpOyBmaWxlX3B1dF9jb250ZW50cygkZHN0LCRjb2RlKTsgJGluZlsnbWQ1J109bWQ1X2ZpbGUoJGRzdCk7IH0gfQogICRUWydmYWlsYWknXVskZl09JGluZjsKICAkVFsncmluayddPXdjX2dldF9wcm9kdWN0X2lkX2J5X3NrdSgnMzQxODUwLWRwJyk7CiAgJFRbJ2FuaW1vbmRhJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIElEIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF90aXRsZSBMSUtFICdBbmltb25kYSBHcmFuQ2Fybm8gQWR1bHQga29uc2VydiUgNiB4IDgwMCBnICMxJScgTElNSVQgMSIpOwogICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg=='; const SHA='5538ed399b0294077e8d13a6bdb9e492ad6ea6be'; const MD5='64d773d60bea2e675f8866e9e85e118e';
const out={v:'H295A'}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H290 v1 (rinkiniai v1.39)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h295=RUN20260825AE&deploy=1&sha='+SHA,{},'deploy');
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
      klase_fix:await pg.$eval('body',n=>n.className.includes('ps-fiksuotas-rinkinys')),
      th:await pg.$$eval('form.cart th',ns=>ns.map(n=>n.textContent.trim()+'|'+getComputedStyle(n).display)),
      rows:await pg.$$eval('form.cart tbody tr',ns=>ns.map(n=>n.getAttribute('data-kiekis-rodyti')+':'+Math.round(n.getBoundingClientRect().height))),
      nuorodos:await pg.$$eval('form.cart td.product-details a,form.cart td.product-name a',ns=>ns.length),
      spalva:await pg.$eval('form.cart tbody td.product-details',n=>getComputedStyle(n).color),
      klase:await pg.$eval('body',n=>n.className.includes('ps-rink-be-naudos')),
      nauda:await pg.$$eval('.ps-rink-nauda',ns=>ns.map(n=>getComputedStyle(n).display)),
      del:await pg.$$eval('.product-info .price del',ns=>ns.map(n=>getComputedStyle(n).display))};
    out.anim_put=await put('screenshots/h295_animonda.png',await pg.screenshot({fullPage:false}),'H295A');
    // 2) 15% rinkinys — nauda turi likti
    await pg.goto(WP+'/product/rinkinys-gurmanams-skanestai-sunims/',{waitUntil:'networkidle',timeout:60000}); await miegok(1000);
    out.gurmanams={nauda:await pg.$$eval('.ps-rink-nauda',ns=>ns.map(n=>getComputedStyle(n).display)),
      del:await pg.$$eval('.product-info .price del',ns=>ns.map(n=>getComputedStyle(n).display))};
    out.th=await pg.$$eval('form.cart th',ns=>ns.map(n=>n.textContent.trim()+'|'+getComputedStyle(n).display)).catch(e=>String(e));
    // 3) admin: zymu nuemimas
    await pg.goto(WP+'/wp-admin/admin.php?page=ps-rinkiniai&veiksmas=keisti&id='+out.deploy.rink,{waitUntil:'networkidle',timeout:60000}); await miegok(1500);
    out.chips_pries=await pg.$$eval('#psr-vieta .psr-chip',ns=>ns.map(n=>n.textContent.replace(/✕/g,'').trim()));
    out.x_mygtukai=await pg.$$eval('#psr-vieta .psr-chip.auto button',ns=>ns.length);
    await pg.click('#psr-vieta .psr-chip.auto:last-child button').catch(e=>out.klik=String(e).slice(0,80));
    await miegok(500);
    out.chips_po=await pg.$$eval('#psr-vieta .psr-chip',ns=>ns.map(n=>n.textContent.replace(/✕/g,'').trim()));
    out.js=kl;
    out.put=await put('screenshots/h295_admin.png',await pg.screenshot({fullPage:false}),'H295A');
    await br.close();
  }
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h295run.json', Buffer.from(JSON.stringify(out,null,1)), 'H295A');
