process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIERyYXNreWtsaXUgS3VyamVyaXMgdjEuMCAoZHJ5K2FwcGx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogJHI9JF9HRVRbJ3BzX2RrJ10gPz8gJyc7IGlmKCRyIT09J0RSWScgJiYgJHIhPT0nQVBQTFknKSByZXR1cm47CiAkaWRzPWpzb25fZGVjb2RlKGJhc2U2NF9kZWNvZGUoJ1d6RXpOVEF3TENBeE16YzJNeXdnTVRNM05qUXNJREV6TnpZMUxDQXhNemc0T0N3Z01UTTRPRGtzSURFek9Ea3dMQ0F4TXpnNU1pd2dNVFF4Tnpnc0lERTBNVGd3TENBeE5ESXhNU3dnTWpBeU56UXNJREl3TWpnd0xDQXlNREk0TlN3Z01qQXlPRGdzSURJd01qazBMQ0F5TVRrek1Dd2dNakl3TkRjc0lESXpNamcwTENBeU5ESTBPQ3dnTWpReU5UQXNJREkwTWpVMExDQXlOakUzT0N3Z01qWXhPRE1zSURJMk1UZzRMQ0F5TmpFNU5Dd2dNalkzTWpRc0lESTJOekk1TENBeU5qZzBOQ3dnTXpJMU56WXNJRE15TlRjNExDQXpNems1TUYwPScpLHRydWUpOwogJG89Wyd2Jz0+J0RLMScsJ3JlemltYXMnPT4kciwncHJhc28nPT5jb3VudCgkaWRzKSwnZWlsJz0+W11dOwogZm9yZWFjaCgkaWRzIGFzICRwaWQpewogICAkcD1nZXRfcG9zdCgkcGlkKTsKICAgJGU9WydpZCc9PiRwaWQsJ3Bhdic9PiRwP21iX3N1YnN0cigkcC0+cG9zdF90aXRsZSwwLDUyKTonTkVSQScsJ2J1dm8nPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19wc190aWtfa3VyamVyaXUnLHRydWUpXTsKICAgaWYoISRwIHx8ICRwLT5wb3N0X3R5cGUhPT0ncHJvZHVjdCcpeyAkZVsndmVpa3NtYXMnXT0nUFJBTEVJU1RBJzsgJG9bJ2VpbCddW109JGU7IGNvbnRpbnVlOyB9CiAgIGlmKCRlWydidXZvJ109PT0neWVzJyl7ICRlWyd2ZWlrc21hcyddPSdKQVUnOyAkb1snZWlsJ11bXT0kZTsgY29udGludWU7IH0KICAgaWYoJHI9PT0nQVBQTFknKXsKICAgICB1cGRhdGVfcG9zdF9tZXRhKCRwaWQsJ19wc190aWtfa3VyamVyaXUnLCd5ZXMnKTsKICAgICB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCRwaWQpOyBjbGVhbl9wb3N0X2NhY2hlKCRwaWQpOwogICAgICRlWydwbyddPWdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3Rpa19rdXJqZXJpdScsdHJ1ZSk7CiAgICAgJGVbJ3ZlaWtzbWFzJ109KCRlWydwbyddPT09J3llcycpPydQQVpZTUVUQSc6J0tMQUlEQSc7CiAgIH0gZWxzZSAkZVsndmVpa3NtYXMnXT0nQlVUVSc7CiAgICRvWydlaWwnXVtdPSRlOwogfQogJG9bJ3N1bWEnXT1bJ3BhenltZXRhJz0+Y291bnQoYXJyYXlfZmlsdGVyKCRvWydlaWwnXSxmdW5jdGlvbigkeCl7cmV0dXJuICR4Wyd2ZWlrc21hcyddPT09J1BBWllNRVRBJzt9KSksCiAgICdqYXUnPT5jb3VudChhcnJheV9maWx0ZXIoJG9bJ2VpbCddLGZ1bmN0aW9uKCR4KXtyZXR1cm4gJHhbJ3ZlaWtzbWFzJ109PT0nSkFVJzt9KSksCiAgICdrbGFpZHUnPT5jb3VudChhcnJheV9maWx0ZXIoJG9bJ2VpbCddLGZ1bmN0aW9uKCR4KXtyZXR1cm4gJHhbJ3ZlaWtzbWFzJ109PT0nS0xBSURBJzt9KSldOwogaWYoJHI9PT0nQVBQTFknKXsgZ2xvYmFsICR3cGRiOwogICAkb1snaXNfdmlzbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIG1ldGFfa2V5PSdfcHNfdGlrX2t1cmplcml1JyBBTkQgbWV0YV92YWx1ZT0neWVzJyIpOyB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSw5OSk7Cg=='; const VER='DRASKK-v1.0'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Draskykliu Kurjeris v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_dk=DRY',{headers:UA},'dry');
  let DJ=null; try{ DJ=JSON.parse(await d.text()); }catch(e){}
  out.dry=DJ&&DJ.suma; out.praso=DJ&&DJ.praso;
  if(DJ){ await miegok(2500);
    const a=await fx(WP+'/?ps_dk=APPLY',{headers:UA},'apply');
    try{ const AJ=JSON.parse(await a.text()); out.apply=AJ.suma; out.is_viso=AJ.is_viso;
      out.problemos=AJ.eil.filter(x=>x.veiksmas==='KLAIDA'||x.veiksmas==='PRALEISTA'); }catch(e){} }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/draskk_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
