process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEUxQSBTZXNpamEgdjEgKGthbmFsdSBwYWdhdmltYXMpCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoIWlzc2V0KCRfR0VUWydwc19lMXMnXSkgfHwgJF9HRVRbJ3BzX2UxcyddIT09J0UxQTIwMjYwODI2QycpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0UxQVMxJywndHMnPT5kYXRlKCdjJykpOyBnbG9iYWwgJHdwZGI7CiAkdD0kd3BkYi0+cHJlZml4Lid3b29jb21tZXJjZV9zZXNzaW9ucyc7CiAkVFsnc2VzaWp1X3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBgJHRgIik7CiAkcj0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzZXNzaW9uX2tleSwgc2Vzc2lvbl9leHBpcnksIHNlc3Npb25fdmFsdWUgRlJPTSBgJHRgIE9SREVSIEJZIHNlc3Npb25fZXhwaXJ5IERFU0MgTElNSVQgMjAiLCBBUlJBWV9BKTsKICRUWydyYXN0YSddPWFycmF5KCk7CiBmb3JlYWNoKCRyIGFzICRyb3cpewogICBpZihzdHJwb3MoJHJvd1snc2Vzc2lvbl92YWx1ZSddLCdwc19rYW5hbGFpJyk9PT1mYWxzZSkgY29udGludWU7CiAgICRkPW1heWJlX3Vuc2VyaWFsaXplKCRyb3dbJ3Nlc3Npb25fdmFsdWUnXSk7CiAgICR2PWlzX2FycmF5KCRkKSYmaXNzZXQoJGRbJ3BzX2thbmFsYWknXSk/bWF5YmVfdW5zZXJpYWxpemUoJGRbJ3BzX2thbmFsYWknXSk6bnVsbDsKICAgJFRbJ3Jhc3RhJ11bXT1hcnJheSgncmFrdGFzJz0+c3Vic3RyKCRyb3dbJ3Nlc3Npb25fa2V5J10sMCwxMCkuJ+KApicsJ2dhbGlvamEnPT5kYXRlKCdZLW0tZCBIOmknLCRyb3dbJ3Nlc3Npb25fZXhwaXJ5J10pLCdwc19rYW5hbGFpJz0+JHYpOwogfQogJFRbJ3N1X2thbmFsYWlzJ109Y291bnQoJFRbJ3Jhc3RhJ10pOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LDUpOwo='; const KEY='E1A20260826C'; const VER='E1AS1';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP E1A Sesija v1 (kanalu pagavimas)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  sid=JSON.parse(await c.text()).id; out.sukurta=sid; await miegok(9000);
  const {chromium}=await import('playwright'); const br=await chromium.launch();
  const ctx=await br.newContext({viewport:{width:1440,height:1000},ignoreHTTPSErrors:true});
  const pg=await ctx.newPage(); const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,140)));
  // 1) reklamos landing su UTM + isorinis referer
  await ctx.setExtraHTTPHeaders({'Referer':'https://www.kaina24.lt/'});
  await pg.goto(WP+'/?utm_source=test&utm_medium=cpc&utm_campaign=e1a',{waitUntil:'networkidle',timeout:70000});
  out.url1=pg.url().replace(WP,''); await miegok(1200);
  try{ await pg.click('.cmplz-accept',{timeout:3000}); await miegok(600); out.sutikimas='paspausta'; }catch(e){ out.sutikimas='nerasta'; }
  // 2) vidinis perejimas — pirmas prisilietimas turi ISLIKTI
  await ctx.setExtraHTTPHeaders({});
  await pg.goto(WP+'/parduotuve/',{waitUntil:'networkidle',timeout:70000}).catch(e=>out.psl2=String(e).slice(0,90));
  await miegok(1000);
  out.slapukai=(await ctx.cookies()).map(c=>c.name).filter(n=>/woocommerce|wp_wo|cmplz|ps_/.test(n));
  // 3) i krepseli — kad sesija tikrai issisaugotu
  const btn=await pg.$('a.add-to-cart-button, a.button.product_type_simple, .product-small a.add-to-cart-grid');
  if(btn){ await btn.click().catch(()=>{}); await miegok(3500); out.krepselis='paspausta'; } else { out.krepselis='mygtuko nerasta'; }
  await pg.goto(WP+'/krepselis/',{waitUntil:'networkidle',timeout:60000}).catch(()=>{});
  await miegok(1500);
  out.js=kl;
  out.put=await put('screenshots/e1a_kanalai.png', await pg.screenshot({fullPage:false}), VER);
  await br.close();
  await miegok(2000);
  const d=await fx(WP+'/?ps_e1s='+KEY,{},'dump');
  const txt=await d.text();
  try{ const j=JSON.parse(txt); out.sesijos=j; await put('deploy/e1a_sesija.json', Buffer.from(JSON.stringify(j,null,1)), VER); }
  catch(e){ out.ne_json=txt.slice(0,500); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/e1a_sesijarun.json', Buffer.from(JSON.stringify(out,null,1)), VER);
