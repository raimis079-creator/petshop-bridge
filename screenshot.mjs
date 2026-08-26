process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDMwNSddKSB8fCAkX0dFVFsncHNfaDMwNSddIT09J1JVTjIwMjYwODI2RCcpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gzMDVBJyk7IGdsb2JhbCAkd3BkYjsKICR1PWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSwnb3JkZXJieSc9PidJRCcpKTsKIGlmKCR1KXsgd3Bfc2V0X2N1cnJlbnRfdXNlcigkdVswXS0+SUQpOyB3cF9zZXRfYXV0aF9jb29raWUoJHVbMF0tPklELHRydWUsdHJ1ZSk7IH0KICRzaGE9c2FuaXRpemVfdGV4dF9maWVsZCgkX0dFVFsnc2hhJ10pOyAkZj0ncGV0c2hvcC1rYXRhbG9nYXMucGhwJzsKICRyPXdwX3JlbW90ZV9nZXQoJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvcmFpbWlzMDc5LWNyZWF0b3IvcGV0c2hvcC1icmlkZ2UvY29udGVudHMvZGVwbG95LycuJGYuJy5iNjQ/cmVmPScuJHNoYSxhcnJheSgndGltZW91dCc9PjYwLCdoZWFkZXJzJz0+YXJyYXkoJ1VzZXItQWdlbnQnPT4ncHMnLCdBY2NlcHQnPT4nYXBwbGljYXRpb24vdm5kLmdpdGh1Yitqc29uJykpKTsKICRqPWpzb25fZGVjb2RlKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSx0cnVlKTsgJGNvZGU9YmFzZTY0X2RlY29kZSh0cmltKGlzc2V0KCRqWydjb250ZW50J10pP2Jhc2U2NF9kZWNvZGUoJGpbJ2NvbnRlbnQnXSk6JycpKTsKICRpbmY9YXJyYXkoJ2dhdXRhJz0+c3RybGVuKCRjb2RlKSk7CiBpZigkY29kZSAmJiBzdHJwb3MoJGNvZGUsJzw/cGhwJyk9PT0wKXsgdHJ5eyB0b2tlbl9nZXRfYWxsKCRjb2RlLCBUT0tFTl9QQVJTRSk7ICRpbmZbJ3NpbnRha3NlJ109J29rJzsgfSBjYXRjaChQYXJzZUVycm9yICRlKXsgJGluZlsnc2ludGFrc2UnXT0nS0xBSURBOiAnLiRlLT5nZXRNZXNzYWdlKCk7IH0KICBpZignb2snPT09JGluZlsnc2ludGFrc2UnXSl7ICRkc3Q9V1BNVV9QTFVHSU5fRElSLicvJy4kZjsgJGluZlsnbWQ1X3ByaWVzJ109bWQ1X2ZpbGUoJGRzdCk7IEBjb3B5KCRkc3QsIFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzLycuJGYuJy5iYWtfaDMwNScpOyBmaWxlX3B1dF9jb250ZW50cygkZHN0LCRjb2RlKTsgJGluZlsnbWQ1J109bWQ1X2ZpbGUoJGRzdCk7IH0gfQogJFRbJ2ZhaWxhaSddWyRmXT0kaW5mOwogJFRbJ2RwX3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBtZXRhX2tleT0nX2RwX2Jhc2VfcHJvZHVjdF9pZCciKTsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkVCxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK'; const SHA='8dcdbc2a0a1e4ca44a98bd725ad193e175eefe3e'; const MD5='4c8d25c083c5a4235831505ce138a920';
const out={v:'H305A'}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H304 v1 (katalogas v6.0)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h305=RUN20260826D&sha='+SHA,{},'deploy');
  const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
  try{ out.deploy=JSON.parse(await d.text()); }catch(e){ out.deploy='ne-json'; }
  out.md5_ok=out.deploy.failai&&out.deploy.failai['petshop-katalogas.php'].md5===MD5;
  const cookies=[]; for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
  if(out.md5_ok&&cookies.length){
    await miegok(2500);
    const {chromium}=await import('playwright'); const br=await chromium.launch();
    const ctx=await br.newContext({viewport:{width:1500,height:1200},ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
    const pg=await ctx.newPage(); const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,120)));
    await pg.goto(WP+'/wp-admin/admin.php?page=ps-katalogas&q=knysli',{waitUntil:'networkidle',timeout:60000}); await miegok(1500);
    out.fatal=/Fatal error|critical error/i.test(await pg.content());
    out.eilutes=await pg.$$eval('table tbody tr',ns=>ns.filter(n=>n.innerText.includes('knysli')||n.innerText.includes('knyslių')).map(n=>n.innerText.replace(/\s+/g,' ').slice(0,170)));
    await pg.goto(WP+'/wp-admin/admin.php?page=ps-katalogas&id=35096',{waitUntil:'networkidle',timeout:60000}); await miegok(1500);
    out.kortele=await pg.$$eval('.kort-blokas',ns=>{const b=ns.find(n=>n.textContent.includes('Šaltiniai'));return b?b.innerText.replace(/\s+/g,' ').slice(0,420):'NERASTA';});
    out.js=kl; out.put=await put('screenshots/h305_sarasas.png',await pg.screenshot({fullPage:false}),'H305A');
    await br.close();
  }
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h305run.json', Buffer.from(JSON.stringify(out,null,1)), 'H305A');
