process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDMwMCddKSB8fCAkX0dFVFsncHNfaDMwMCddIT09J1JVTjIwMjYwODI1QUsnKSByZXR1cm47CiAkVD1hcnJheSgndic9PidIMzAwQScpOyBnbG9iYWwgJHdwZGI7CiAkdT1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEsJ29yZGVyYnknPT4nSUQnKSk7CiBpZigkdSl7IHdwX3NldF9jdXJyZW50X3VzZXIoJHVbMF0tPklEKTsgd3Bfc2V0X2F1dGhfY29va2llKCR1WzBdLT5JRCx0cnVlLHRydWUpOyB9CiBpZihpc3NldCgkX0dFVFsnZGVwbG95J10pKXsKICAkc2hhPXNhbml0aXplX3RleHRfZmllbGQoJF9HRVRbJ3NoYSddKTsgJGY9J3BldHNob3Atcmlua2luaWFpLnBocCc7CiAgJHI9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS9jb250ZW50cy9kZXBsb3kvJy4kZi4nLmI2ND9yZWY9Jy4kc2hhLGFycmF5KCd0aW1lb3V0Jz0+NDAsJ2hlYWRlcnMnPT5hcnJheSgnVXNlci1BZ2VudCc9PidwcycsJ0FjY2VwdCc9PidhcHBsaWNhdGlvbi92bmQuZ2l0aHViK2pzb24nKSkpOwogICRqPWpzb25fZGVjb2RlKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSx0cnVlKTsgJGNvZGU9YmFzZTY0X2RlY29kZSh0cmltKGlzc2V0KCRqWydjb250ZW50J10pP2Jhc2U2NF9kZWNvZGUoJGpbJ2NvbnRlbnQnXSk6JycpKTsKICAkaW5mPWFycmF5KCdnYXV0YSc9PnN0cmxlbigkY29kZSkpOwogIGlmKCRjb2RlICYmIHN0cnBvcygkY29kZSwnPD9waHAnKT09PTApeyB0cnl7IHRva2VuX2dldF9hbGwoJGNvZGUsIFRPS0VOX1BBUlNFKTsgJGluZlsnc2ludGFrc2UnXT0nb2snOyB9IGNhdGNoKFBhcnNlRXJyb3IgJGUpeyAkaW5mWydzaW50YWtzZSddPSdLTEFJREE6ICcuJGUtPmdldE1lc3NhZ2UoKTsgfQogICBpZignb2snPT09JGluZlsnc2ludGFrc2UnXSl7ICRkc3Q9V1BNVV9QTFVHSU5fRElSLicvJy4kZjsgJGluZlsnbWQ1X3ByaWVzJ109bWQ1X2ZpbGUoJGRzdCk7IEBjb3B5KCRkc3QsIFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzLycuJGYuJy5iYWtfaDMwMCcpOyBmaWxlX3B1dF9jb250ZW50cygkZHN0LCRjb2RlKTsgJGluZlsnbWQ1J109bWQ1X2ZpbGUoJGRzdCk7IH0gfQogICRUWydmYWlsYWknXVskZl09JGluZjsKICAkVFsncmluayddPXdjX2dldF9wcm9kdWN0X2lkX2J5X3NrdSgnMzQxODUwLWRwJyk7CiAgJFRbJ2FuaW1vbmRhJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIElEIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF90aXRsZSBMSUtFICdBbmltb25kYSBHcmFuQ2Fybm8gQWR1bHQga29uc2VydiUgNiB4IDgwMCBnICMxJScgTElNSVQgMSIpOwogICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg=='; const SHA='e6c032587acf71d4168e6dafcd9661229bd9e61c'; const MD5='858e90e7b505fae0c168f15b657f2ab0';
const out={v:'H300A'}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H300 v1 (rinkiniai v1.41)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h300=RUN20260825AK&deploy=1&sha='+SHA,{},'deploy'); try{ out.deploy=JSON.parse(await d.text()); }catch(e){ out.deploy='ne-json'; }
  out.md5_ok=out.deploy.failai&&out.deploy.failai['petshop-rinkiniai.php'].md5===MD5;
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
  if(out.md5_ok){
    await miegok(2500);
    const {chromium}=await import('playwright'); const br=await chromium.launch();
    const ctx=await br.newContext({viewport:{width:1440,height:1100},ignoreHTTPSErrors:true}); const pg=await ctx.newPage(); const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,120)));
    await pg.goto(WP+'/kategorija/rinkiniai/',{waitUntil:'networkidle',timeout:60000}); await miegok(1500);
    try{ await pg.click('.cmplz-accept',{timeout:2000}); await miegok(400);}catch(e){}
    out.qv_matomi=await pg.$$eval('.product-small .quick-view',ns=>ns.filter(n=>getComputedStyle(n).display!=='none').length);
    out.qv_viso=await pg.$$eval('.product-small .quick-view',ns=>ns.length);
    out.mnm_korteles=await pg.$$eval('.product-small.product-type-mix-and-match',ns=>ns.length);
    // paspaudziam pirmos Animonda korteles paveiksla
    const u0=pg.url();
    await pg.click('.product-small.product-type-mix-and-match .box-image a, .product-small.product-type-mix-and-match img',{timeout:5000}).catch(e=>out.klik=String(e).slice(0,100));
    await miegok(2500);
    out.po_paspaudimo={url:pg.url().replace(WP,''),modalas:!!(await pg.$('.mfp-wrap.mfp-ready')),body:await pg.$eval('body',n=>n.className.includes('single-product')?'single-product':'kita')};
    if(out.po_paspaudimo.body==='single-product'){ out.vitrina=await pg.$$eval('form.cart th',ns=>ns.map(n=>n.textContent.trim()+'|'+getComputedStyle(n).display)); }
    out.js=kl; out.put=await put('screenshots/h300_po.png',await pg.screenshot({fullPage:false}),'H300A');
    await br.close();
  }
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h300run.json', Buffer.from(JSON.stringify(out,null,1)), 'H300A');
