process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFN0YW5kdXMgRGFpa3RhaSBLdXJqZXJpdSB2MS4wICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAkcj0kX0dFVFsncHNfc3QnXSA/PyAnJzsgaWYoJHIhPT0nQVBQTFknKSByZXR1cm47CiAkaWRzPWpzb25fZGVjb2RlKGJhc2U2NF9kZWNvZGUoJ1d6RXpNVFV5TENBeE16RTFNeXdnTVRNeE5ERXNJREV6TVRZMExDQXhNemcyTXl3Z01qQTRORFlzSURJd09EVXpMQ0F5TnpRME9Dd2dNamM0TkRKZCcpLHRydWUpOwogJG89Wyd2Jz0+J1NUMScsJ2VpbCc9PltdXTsKIGZvcmVhY2goJGlkcyBhcyAkcGlkKXsKICAgJHA9Z2V0X3Bvc3QoJHBpZCk7CiAgICRlPVsnaWQnPT4kcGlkLCdwYXYnPT4kcD9tYl9zdWJzdHIoJHAtPnBvc3RfdGl0bGUsMCw1OCk6J05FUkEnLCdidXZvJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHNfdGlrX2t1cmplcml1Jyx0cnVlKV07CiAgIGlmKCEkcCB8fCAkcC0+cG9zdF90eXBlIT09J3Byb2R1Y3QnKXsgJGVbJ3ZlaWtzbWFzJ109J1BSQUxFSVNUQSc7ICRvWydlaWwnXVtdPSRlOyBjb250aW51ZTsgfQogICBpZigkZVsnYnV2byddPT09J3llcycpeyAkZVsndmVpa3NtYXMnXT0nSkFVJzsgJG9bJ2VpbCddW109JGU7IGNvbnRpbnVlOyB9CiAgIHVwZGF0ZV9wb3N0X21ldGEoJHBpZCwnX3BzX3Rpa19rdXJqZXJpdScsJ3llcycpOwogICB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRwaWQpOyBjbGVhbl9wb3N0X2NhY2hlKCRwaWQpOwogICAkZVsncG8nXT1nZXRfcG9zdF9tZXRhKCRwaWQsJ19wc190aWtfa3VyamVyaXUnLHRydWUpOwogICAkZVsndmVpa3NtYXMnXT0oJGVbJ3BvJ109PT0neWVzJyk/J1BBWllNRVRBJzonS0xBSURBJzsKICAgJG9bJ2VpbCddW109JGU7CiB9CiAvKiBrb250cm9sZTogU29uaWMgQmlnICovCiAkb1snc29uaWNfYmlnJ109WydpZCc9PjE1OTI4LCdrdXJqJz0+Z2V0X3Bvc3RfbWV0YSgxNTkyOCwnX3BzX3Rpa19rdXJqZXJpdScsdHJ1ZSldOwogZ2xvYmFsICR3cGRiOwogJG9bJ2lzX3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBtZXRhX2tleT0nX3BzX3Rpa19rdXJqZXJpdScgQU5EIG1ldGFfdmFsdWU9J3llcyciKTsKICRvWydzdW1hJ109WydwYXp5bWV0YSc9PmNvdW50KGFycmF5X2ZpbHRlcigkb1snZWlsJ10sZnVuY3Rpb24oJHgpe3JldHVybiAkeFsndmVpa3NtYXMnXT09PSdQQVpZTUVUQSc7fSkpLAogICAnamF1Jz0+Y291bnQoYXJyYXlfZmlsdGVyKCRvWydlaWwnXSxmdW5jdGlvbigkeCl7cmV0dXJuICR4Wyd2ZWlrc21hcyddPT09J0pBVSc7fSkpLAogICAna2xhaWR1Jz0+Y291bnQoYXJyYXlfZmlsdGVyKCRvWydlaWwnXSxmdW5jdGlvbigkeCl7cmV0dXJuICR4Wyd2ZWlrc21hcyddPT09J0tMQUlEQSc7fSkpXTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LDk5KTsK'; const VER='STAND-v1.0'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Standus Daiktai Kurjeriu v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_st=APPLY',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'st');
  const dt=await d.text(); try{ out.r=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,900); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/standus_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
