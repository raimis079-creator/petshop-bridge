process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEViaSBCcmVuZG8gU3V2aWVub2RpbmltYXMgdjEuMCAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogJHI9JF9HRVRbJ3BzX2ViaSddID8/ICcnOyBpZigkciE9PSdEUlknICYmICRyIT09J0FQUExZJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOwogJHRhaWtpbmlhaT1bMTUzMDYsMTUzMDksMTUzMTJdOyAgICAgICAgICAgLy8gVElLIHRvcywga3VyaWFzIGl2YXJkaWphdQogJG89Wyd2Jz0+J0VCSTEnLCdyZXppbWFzJz0+JHJdOwoKICR0PWdldF90ZXJtX2J5KCduYW1lJywnRWJpJywncHJvZHVjdF9icmFuZCcpOwogJG9bJ2ViaV90ZXJtaW5hcyddPSAkdCA/IFsnaWQnPT4kdC0+dGVybV9pZCwnc2x1Zyc9PiR0LT5zbHVnLCdjb3VudCc9PiR0LT5jb3VudF0gOiBudWxsOwogaWYoISR0KXsgJG9bJ2tsYWlkYSddPSdFYmkgdGVybWluYXMgbmVyYXN0YXMnOwogICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQoKIC8vIFBMQVRFU05JUyBWQUlaREFTOiB2aXNvcyBwcmVrZXMgc3Ug4oCeRWJpIiBwYXZhZGluaW1lIGlyIGp1IGRhYmFydGluaXMgYnJlbmRhcwogJHZpc29zPSR3cGRiLT5nZXRfcmVzdWx0cygKICAgIlNFTEVDVCBJRCwgcG9zdF90aXRsZSwgcG9zdF9zdGF0dXMgRlJPTSB7JHdwZGItPnBvc3RzfQogICAgIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzIElOICgncHVibGlzaCcsJ2RyYWZ0JykKICAgICAgIEFORCBwb3N0X3RpdGxlIExJS0UgJyVFYmkgJScgT1JERVIgQlkgcG9zdF90aXRsZSIsIEFSUkFZX0EpOwogZm9yZWFjaCgkdmlzb3MgYXMgJiR2KXsKICAgJGI9d3BfZ2V0X29iamVjdF90ZXJtcygkdlsnSUQnXSwncHJvZHVjdF9icmFuZCcsWydmaWVsZHMnPT4nbmFtZXMnXSk7CiAgICR2WydicmVuZGFzJ109aXNfd3BfZXJyb3IoJGIpP1tdOiRiOwogICAkdlsndGFpa2lueXMnXT1pbl9hcnJheSgoaW50KSR2WydJRCddLCR0YWlraW5pYWksdHJ1ZSk/MTowOwogfQogJG9bJ3Zpc29zX2ViaSddPSR2aXNvczsKICRvWyduZV90YWlraW5pYWlfc3Vfa2l0dV9icmVuZHUnXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKCR2aXNvcyxmdW5jdGlvbigkdil7CiAgIHJldHVybiAhJHZbJ3RhaWtpbnlzJ10gJiYgJHZbJ2JyZW5kYXMnXSAmJiAkdlsnYnJlbmRhcyddWzBdIT09J0ViaSc7IH0pKTsKCiAkb1snZWlsJ109W107CiBmb3JlYWNoKCR0YWlraW5pYWkgYXMgJHBpZCl7CiAgICRwPWdldF9wb3N0KCRwaWQpOwogICAkZT1bJ2lkJz0+JHBpZCwncGF2Jz0+JHA/bWJfc3Vic3RyKCRwLT5wb3N0X3RpdGxlLDAsNTgpOidORVJBJywKICAgICAgICdidXZvJz0+d3BfZ2V0X29iamVjdF90ZXJtcygkcGlkLCdwcm9kdWN0X2JyYW5kJyxbJ2ZpZWxkcyc9PiduYW1lcyddKV07CiAgIGlmKCEkcHx8JHAtPnBvc3RfdHlwZSE9PSdwcm9kdWN0Jyl7ICRlWyd2ZWlrc21hcyddPSdQUkFMRUlTVEEnOyAkb1snZWlsJ11bXT0kZTsgY29udGludWU7IH0KICAgaWYoJHI9PT0nQVBQTFknKXsKICAgICAkcmVzPXdwX3NldF9vYmplY3RfdGVybXMoJHBpZCxbKGludCkkdC0+dGVybV9pZF0sJ3Byb2R1Y3RfYnJhbmQnLGZhbHNlKTsKICAgICAkZVsndmVpa3NtYXMnXT1pc193cF9lcnJvcigkcmVzKT8oJ0tMQUlEQTogJy4kcmVzLT5nZXRfZXJyb3JfbWVzc2FnZSgpKTonUEFLRUlTVEEnOwogICAgIHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJHBpZCk7IGNsZWFuX3Bvc3RfY2FjaGUoJHBpZCk7CiAgICAgJGVbJ3BvJ109d3BfZ2V0X29iamVjdF90ZXJtcygkcGlkLCdwcm9kdWN0X2JyYW5kJyxbJ2ZpZWxkcyc9PiduYW1lcyddKTsKICAgfSBlbHNlICRlWyd2ZWlrc21hcyddPSdCVVRVIFBBS0VJU1RBJzsKICAgJG9bJ2VpbCddW109JGU7CiB9CiBpZigkcj09PSdBUFBMWScpewogICAkZHV2bz1nZXRfdGVybV9ieSgnbmFtZScsJ0R1dm8rJywncHJvZHVjdF9icmFuZCcpOwogICB3cF91cGRhdGVfdGVybV9jb3VudF9ub3coYXJyYXlfZmlsdGVyKFsoaW50KSR0LT50ZXJtX2lkLCAkZHV2bz8oaW50KSRkdXZvLT50ZXJtX2lkOjBdKSwncHJvZHVjdF9icmFuZCcpOwogICAkb1snZWJpX2NvdW50X3BvJ109KGludClnZXRfdGVybSgkdC0+dGVybV9pZCktPmNvdW50OwogICBpZigkZHV2bykgJG9bJ2R1dm9fY291bnRfcG8nXT0oaW50KWdldF90ZXJtKCRkdXZvLT50ZXJtX2lkKS0+Y291bnQ7CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='EBI-v1.0'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(7000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Ebi Brendo Suvienodinimas v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_ebi=DRY',{headers:UA},'dry'); const dt=await d.text();
  let DJ=null; try{ DJ=JSON.parse(dt); }catch(e){ out.dry_zalias=dt.slice(0,900); }
  out.dry=DJ;
  if(DJ && DJ.eil && DJ.eil.some(x=>x.veiksmas==='BUTU PAKEISTA')){
    await miegok(2500);
    const a=await fx(WP+'/?ps_ebi=APPLY',{headers:UA},'apply');
    const at=await a.text(); try{ out.apply=JSON.parse(at); }catch(e){ out.apply_zalias=at.slice(0,900); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/ebi_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
