process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI4MyddKSB8fCAkX0dFVFsncHNfaDI4MyddIT09J1JVTjIwMjYwODI1UycpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyODNBJyk7CiAkdT1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEsJ29yZGVyYnknPT4nSUQnKSk7CiBpZigkdSl7IHdwX3NldF9jdXJyZW50X3VzZXIoJHVbMF0tPklEKTsgd3Bfc2V0X2F1dGhfY29va2llKCR1WzBdLT5JRCx0cnVlLHRydWUpOyB9CiBpZihpc3NldCgkX0dFVFsnZGVwbG95J10pKXsKICAkc2hhPXNhbml0aXplX3RleHRfZmllbGQoJF9HRVRbJ3NoYSddKTsgJGY9J3BldHNob3Atcmlua2luaWFpLnBocCc7CiAgJHI9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS9jb250ZW50cy9kZXBsb3kvJy4kZi4nLmI2ND9yZWY9Jy4kc2hhLGFycmF5KCd0aW1lb3V0Jz0+NDAsJ2hlYWRlcnMnPT5hcnJheSgnVXNlci1BZ2VudCc9PidwcycsJ0FjY2VwdCc9PidhcHBsaWNhdGlvbi92bmQuZ2l0aHViK2pzb24nKSkpOwogICRqPWpzb25fZGVjb2RlKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSx0cnVlKTsgJGNvZGU9YmFzZTY0X2RlY29kZSh0cmltKGlzc2V0KCRqWydjb250ZW50J10pP2Jhc2U2NF9kZWNvZGUoJGpbJ2NvbnRlbnQnXSk6JycpKTsKICAkaW5mPWFycmF5KCdnYXV0YSc9PnN0cmxlbigkY29kZSkpOwogIGlmKCRjb2RlICYmIHN0cnBvcygkY29kZSwnPD9waHAnKT09PTApeyB0cnl7IHRva2VuX2dldF9hbGwoJGNvZGUsIFRPS0VOX1BBUlNFKTsgJGluZlsnc2ludGFrc2UnXT0nb2snOyB9IGNhdGNoKFBhcnNlRXJyb3IgJGUpeyAkaW5mWydzaW50YWtzZSddPSdLTEFJREE6ICcuJGUtPmdldE1lc3NhZ2UoKTsgfQogICBpZignb2snPT09JGluZlsnc2ludGFrc2UnXSl7ICRkc3Q9V1BNVV9QTFVHSU5fRElSLicvJy4kZjsgJGluZlsnbWQ1X3ByaWVzJ109bWQ1X2ZpbGUoJGRzdCk7IEBjb3B5KCRkc3QsIFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzLycuJGYuJy5iYWtfaDI4MycpOyBmaWxlX3B1dF9jb250ZW50cygkZHN0LCRjb2RlKTsgJGluZlsnbWQ1J109bWQ1X2ZpbGUoJGRzdCk7IH0gfQogICRUWydmYWlsYWknXVskZl09JGluZjsKICAkaWQ9d2NfZ2V0X3Byb2R1Y3RfaWRfYnlfc2t1KCczNDE4NTAtZHAnKTsgJFRbJ3JpbmtfaWQnXT0kaWQ7CiAgaWYoJGlkKXsgJFRbJ3Jpbmtfa2F0J109YXJyYXlfbWFwKCdpbnR2YWwnLHdjX2dldF9wcm9kdWN0X3Rlcm1faWRzKCRpZCwncHJvZHVjdF9jYXQnKSk7IH0KICAkVFsnc25pcF9vZmYnXT0kR0xPQkFMU1snd3BkYiddLT5xdWVyeSgiVVBEQVRFIHskR0xPQkFMU1snd3BkYiddLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK'; const SHA='9999df50163055fa58b43626b2980c45e163259d';
const MD5={"petshop-rinkiniai.php": "d9d3c9e59b0e149376e328ac72141797"};
const out={v:'H283A'}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H278 v1 (rinkiniai v1.34 deploy)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h283=RUN20260825S&deploy=1&sha='+SHA,{},'deploy');
  try{ out.deploy=JSON.parse(await d.text()); }catch(e){ out.deploy='ne-json'; }
  let visi=true; for(const k in MD5){ if(!out.deploy.failai||!out.deploy.failai[k]||out.deploy.failai[k].md5!==MD5[k]) visi=false; } out.md5_ok=visi;
  if(visi){ const r=await fetch(SNIP+'/524',{method:'POST',headers:A,body:JSON.stringify({id:524,active:false})}); out.s524_off=r.status; }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
  if(visi){
    await miegok(2000);
    const {chromium}=await import('playwright'); const br=await chromium.launch();
    const url=WP+'/product/rinkinys-gurmanams-skanestai-sunims/';
    async function snap(name,w){ const ctx=await br.newContext({viewport:{width:w,height:1000},ignoreHTTPSErrors:true}); const pg=await ctx.newPage(); const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,120)));
      await pg.goto(url,{waitUntil:'networkidle',timeout:60000}); await miegok(1500);
      try{ await pg.click('.cmplz-accept',{timeout:2000}); await miegok(400);}catch(e){}
      const o={js:kl};
      o.btn=await pg.$eval('.single_add_to_cart_button',n=>{const c=getComputedStyle(n);return {t:n.textContent.trim(),bg:c.backgroundColor,dis:n.disabled,cls:n.className.slice(0,60)};}).catch(e=>String(e));
      o.rows=await pg.$$eval('form.cart tbody tr',ns=>ns.map(n=>n.getAttribute('data-kiekis-rodyti')+':'+(n.querySelector('td.product-details,td.product-name')||{textContent:''}).textContent.trim().replace(/\s+/g,' ').slice(0,40)));
      o.tds=await pg.$eval('form.cart tbody tr',n=>[...n.querySelectorAll('td')].map(t=>t.className)).catch(()=>[]);
      o.price=await pg.$eval('.product-info .price ins .amount, .product-info .price .amount',n=>getComputedStyle(n).color).catch(()=>'?'); o.rowhtml=await pg.$eval('form.cart tbody tr',n=>n.innerHTML.replace(/\s+/g,' ').slice(0,900)).catch(()=>''); o.rowh=await pg.$$eval('form.cart tbody tr',ns=>ns.map(n=>Math.round(n.getBoundingClientRect().height))); o.lb=await (async()=>{const u0=pg.url(); await pg.click('form.cart td.product-thumbnail a',{timeout:3000}).catch(()=>{}); await miegok(1200); return {url_same:pg.url()===u0, lb:!!(await pg.$('.ps-lb img').catch(()=>null))};})(); o.savings_line=await pg.$$eval('.petshop-savings',ns=>ns.map(n=>getComputedStyle(n).display));
      o.nauda=await pg.$eval('.ps-rink-nauda',n=>n.textContent.replace(/\s+/g,' ').trim().slice(0,80)).catch(()=>'nera');
      o.zarnu=await pg.$eval('body',n=>n.innerText.includes('Patpgi')?'PATPGI LIKO':'ok');
      o.put=await put('screenshots/h283_'+name+'.png',await pg.screenshot({fullPage:true}),'H283A'); await ctx.close(); return o; }
    out.desktop=await snap('desktop',1440); out.mobile=await snap('mobile',390);
    await br.close();
  }
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h283run.json', Buffer.from(JSON.stringify(out,null,1)), 'H283A');
