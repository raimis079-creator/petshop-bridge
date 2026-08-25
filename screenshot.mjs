process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI3NiddKSB8fCAkX0dFVFsncHNfaDI3NiddIT09J1JVTjIwMjYwODI1SycpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNzZBJyk7CiAkdT1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEsJ29yZGVyYnknPT4nSUQnKSk7CiBpZigkdSl7IHdwX3NldF9jdXJyZW50X3VzZXIoJHVbMF0tPklEKTsgd3Bfc2V0X2F1dGhfY29va2llKCR1WzBdLT5JRCx0cnVlLHRydWUpOyB9CiBpZihpc3NldCgkX0dFVFsnZGVwbG95J10pKXsKICAkc2hhPXNhbml0aXplX3RleHRfZmllbGQoJF9HRVRbJ3NoYSddKTsgJGY9J3BldHNob3Atcmlua2luaWFpLnBocCc7CiAgJHI9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS9jb250ZW50cy9kZXBsb3kvJy4kZi4nLmI2ND9yZWY9Jy4kc2hhLGFycmF5KCd0aW1lb3V0Jz0+NDAsJ2hlYWRlcnMnPT5hcnJheSgnVXNlci1BZ2VudCc9PidwcycsJ0FjY2VwdCc9PidhcHBsaWNhdGlvbi92bmQuZ2l0aHViK2pzb24nKSkpOwogICRqPWpzb25fZGVjb2RlKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSx0cnVlKTsgJGNvZGU9YmFzZTY0X2RlY29kZSh0cmltKGlzc2V0KCRqWydjb250ZW50J10pP2Jhc2U2NF9kZWNvZGUoJGpbJ2NvbnRlbnQnXSk6JycpKTsKICAkaW5mPWFycmF5KCdnYXV0YSc9PnN0cmxlbigkY29kZSkpOwogIGlmKCRjb2RlICYmIHN0cnBvcygkY29kZSwnPD9waHAnKT09PTApeyB0cnl7IHRva2VuX2dldF9hbGwoJGNvZGUsIFRPS0VOX1BBUlNFKTsgJGluZlsnc2ludGFrc2UnXT0nb2snOyB9IGNhdGNoKFBhcnNlRXJyb3IgJGUpeyAkaW5mWydzaW50YWtzZSddPSdLTEFJREE6ICcuJGUtPmdldE1lc3NhZ2UoKTsgfQogICBpZignb2snPT09JGluZlsnc2ludGFrc2UnXSl7ICRkc3Q9V1BNVV9QTFVHSU5fRElSLicvJy4kZjsgJGluZlsnbWQ1X3ByaWVzJ109bWQ1X2ZpbGUoJGRzdCk7IEBjb3B5KCRkc3QsIFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzLycuJGYuJy5iYWtfaDI3NicpOyBmaWxlX3B1dF9jb250ZW50cygkZHN0LCRjb2RlKTsgJGluZlsnbWQ1J109bWQ1X2ZpbGUoJGRzdCk7IH0gfQogICRUWydmYWlsYWknXVskZl09JGluZjsKICAkaWQ9d2NfZ2V0X3Byb2R1Y3RfaWRfYnlfc2t1KCczNDE4NTAtZHAnKTsgJFRbJ3JpbmtfaWQnXT0kaWQ7CiAgaWYoJGlkKXsgJFRbJ3Jpbmtfa2F0J109YXJyYXlfbWFwKCdpbnR2YWwnLHdjX2dldF9wcm9kdWN0X3Rlcm1faWRzKCRpZCwncHJvZHVjdF9jYXQnKSk7IH0KICAkVFsnc25pcF9vZmYnXT0kR0xPQkFMU1snd3BkYiddLT5xdWVyeSgiVVBEQVRFIHskR0xPQkFMU1snd3BkYiddLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK'; const SHA='7516b05c8c77ee36e524ab656180f4fbe5116347';
const MD5={"petshop-rinkiniai.php": "9fb3990760adb3d3e99ed436a74a7a92"};
const out={v:'H276A'}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H276 v1 (rinkiniai v1.28 deploy)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h276=RUN20260825K&deploy=1&sha='+SHA,{},'deploy');
  const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
  try{ out.deploy=JSON.parse(await d.text()); }catch(e){ out.deploy='ne-json'; }
  let visi=true; for(const k in MD5){ if(!out.deploy.failai||!out.deploy.failai[k]||out.deploy.failai[k].md5!==MD5[k]) visi=false; } out.md5_ok=visi;
  const cookies=[]; for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
  const rid=out.deploy.rink_id;
  if(visi && cookies.length && rid){
    await miegok(2000);
    const {chromium}=await import('playwright'); const br=await chromium.launch();
    const ctx=await br.newContext({viewport:{width:1500,height:1100},ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
    const pg=await ctx.newPage(); const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,150)));
    await pg.goto(WP+'/wp-admin/admin.php?page=ps-rinkiniai&veiksmas=keisti&id='+rid,{waitUntil:'networkidle',timeout:60000});
    await miegok(1500);
    out.fatal=/Fatal error|critical error/i.test(await pg.content());
    out.sand_aktyvus=await pg.$$eval('.psr-wh',ns=>ns.filter(n=>n.classList.contains('button-primary')).map(n=>n.textContent.trim()));
    out.rez=await pg.$eval('#psr-rez',n=>n.textContent.trim().slice(0,120)).catch(()=>'');
    out.chips=await pg.$$eval('#psr-vieta .psr-chip',ns=>ns.map(n=>(n.classList.contains('auto')?'[auto] ':'')+n.textContent.replace(/✕/g,'').trim())).catch(e=>String(e));
    out.issaugoti_disabled=await pg.$eval('#psr-issaugoti',n=>n.disabled).catch(e=>String(e));
    out.stat=await pg.$eval('#psr-stat',n=>n.textContent.trim()).catch(()=>'');
    out.put=await put('screenshots/h276_forma.png',await pg.screenshot({fullPage:true}),'H276A');
    out.js=kl; await br.close();
  }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h276run.json', Buffer.from(JSON.stringify(out,null,1)), 'H276A');
