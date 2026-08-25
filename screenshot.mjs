process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEUxQSBLb250cm9sZSB2MSAocmFua2luaXMgc3V0aWtyaW5pbWFzKQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfZTFrJ10pIHx8ICRfR0VUWydwc19lMWsnXSE9PSdFMUEyMDI2MDgyNkgnKSByZXR1cm47CiAkVD1hcnJheSgndic9PidFMUFLMScsJ3RzJz0+ZGF0ZSgnYycpKTsgZ2xvYmFsICR3cGRiOwogZm9yZWFjaChhcnJheSgzNTA4NywzNTA4OCkgYXMgJG9pZCl7CiAgICRUWyRvaWRdPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9GYWt0YWknKT9QZXRzaG9wX0Zha3RhaTo6a29udHJvbGUoJG9pZCk6J25lcmEga2xhc2VzJzsKIH0KIC8qIGlkZW1wb3RlbmNpam9zIHRlc3RhczogcHJvY2Vzc2luZyAtPiBjb21wbGV0ZWQgKi8KICRvPXdjX2dldF9vcmRlcigzNTA4Nyk7CiBpZigkbyl7CiAgICRwcmllcz0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH1wc19mYWt0X2VpbHV0ZXMgV0hFUkUgdXpzYWt5bWFzX2lkPTM1MDg3Iik7CiAgICRvLT51cGRhdGVfc3RhdHVzKCdjb21wbGV0ZWQnLCdFMWEgaWRlbXBvdGVuY2lqb3MgdGVzdGFzIChPcHVzKS4gJyk7CiAgIHNsZWVwKDEpOwogICAkcG89KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wcmVmaXh9cHNfZmFrdF9laWx1dGVzIFdIRVJFIHV6c2FreW1hc19pZD0zNTA4NyIpOwogICAkdT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH1wc19mYWt0X3V6c2FreW1haSBXSEVSRSB1enNha3ltYXNfaWQ9MzUwODciKTsKICAgJHN0PSR3cGRiLT5nZXRfcm93KCJTRUxFQ1Qgc3RhdHVzYXNfZ2FsdXRpbmlzLHN0YXR1c2FzX2F0IEZST00geyR3cGRiLT5wcmVmaXh9cHNfZmFrdF91enNha3ltYWkgV0hFUkUgdXpzYWt5bWFzX2lkPTM1MDg3IixBUlJBWV9BKTsKICAgJFRbJ2lkZW1wb3RlbmNpamEnXT1hcnJheSgnZWlsdWNpdV9wcmllcyc9PiRwcmllcywnZWlsdWNpdV9wbyc9PiRwbywndXpzYWt5bXUnPT4kdSwnbmVzaWtlaXRlJz0+KCRwcmllcz09PSRwbyAmJiAkdT09PTEpLCdzdGF0dXNhc19mYWt0dW9zZSc9PiRzdCk7CiB9CiAvKiBwYXN0YWJ1IHRla3N0YXMgKi8KICRUWydwYXN0YWJvcyddPWFycmF5KCk7CiBmb3JlYWNoKGFycmF5KDM1MDg3LDM1MDg4KSBhcyAkb2lkKXsKICAgZm9yZWFjaCh3Y19nZXRfb3JkZXJfbm90ZXMoYXJyYXkoJ29yZGVyX2lkJz0+JG9pZCwnbGltaXQnPT42KSkgYXMgJG4pCiAgICAgaWYoc3RycG9zKCRuLT5jb250ZW50LCdGYWt0YWknKSE9PWZhbHNlKSAkVFsncGFzdGFib3MnXVskb2lkXVtdPSRuLT5jb250ZW50OwogfQogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LDUpOwo=';
const KEY='E1A20260826H'; const VER='E1AK1';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP E1A Kontrole v1 (rankinis sutikrinimas)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_e1k='+KEY,{},'run');
  const txt=await d.text();
  out.http=d.status; out.ilgis=txt.length;
  try{ const r=JSON.parse(txt); out.ok=(r.v===VER); await put('deploy/e1a_kontrole.json', Buffer.from(JSON.stringify(r,null,1)), VER); out.irasyta=1; }
  catch(e){ out.ne_json=txt.slice(0,600); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/e1a_kontrolerun.json', Buffer.from(JSON.stringify(out,null,1)), VER);
