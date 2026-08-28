process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFRpayBLdXJqZXJpdSBaeW1lamltYXMgdjEuMCAoZHJ5K2FwcGx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogJHI9JF9HRVRbJ3BzX3RrJ10gPz8gJyc7IGlmKCRyIT09J0RSWScgJiYgJHIhPT0nQVBQTFknKSByZXR1cm47CiAkaWRzPWpzb25fZGVjb2RlKGJhc2U2NF9kZWNvZGUoJ1d6RXpNVEF6TENBeE16RXdOQ3dnTVRNeE1EVXNJREV6TVRBMkxDQXhNekV3Tnl3Z01UTXhNRGdzSURFek1URTFMQ0F4TXpFeE5pd2dNVE14TVRnc0lERXpNVEl3TENBeE16RXlNU3dnTVRNeE1qTXNJREV6TVRJMExDQXhNekV5TlN3Z01UTXhNallzSURFek1USTRMQ0F4TXpFeU9Td2dNVE14TXpBc0lERXpNVE14TENBeE16RXpNaXdnTVRNeE5qRXNJREV6TVRZeUxDQXhNelF5T1N3Z01UTTBNekFzSURFek56STBMQ0F4TXpjME55d2dNVE0zTkRnc0lERXpOelE1TENBeE16YzFNQ3dnTVRNM05URXNJREV6TnpVeUxDQXhNemswTUN3Z01UTTVOallzSURFME1UWTVMQ0F4TkRFM05Td2dNVFF6TWpZc0lERTFPRGN3TENBeE5UZzNOQ3dnTVRVNE56Z3NJREUxT0RneUxDQXhOVGc0Tml3Z01UVTRPRGtzSURFMU9URTNMQ0F4TlRreU9Dd2dNVFU1TXpJc0lERTFPVE0xTENBeE5UazNPU3dnTVRVNU9ESXNJREUxT1RnMkxDQXhOVGs1TUN3Z01UVTVPVE1zSURFMU9UazJMQ0F4TlRrNU9Td2dNVGM0TmpRc0lERTNPRGd3TENBeE56ZzRNaXdnTVRjNU1UWXNJREUzT1RJMExDQXlNREl3Tml3Z01qQXlNRGdzSURJd01qRXdMQ0F5TURJMk1Dd2dNakE0T1RJc0lESXdPRGszTENBeU1EZzVPU3dnTWpBNU1ERXNJREl3T1RBMkxDQXlNVFF4Tnl3Z01qRTBNalFzSURJeU1EQXdMQ0F5TXpjek9Td2dNalF3TWprc0lESTBNalkyTENBeU5ESTJPU3dnTWpReU56RXNJREkwTWpjekxDQXlOREkzTlN3Z01qUTROemdzSURJME9EZzFMQ0F5TkRnNU1pd2dNalE1TURVc0lESTFNREV6TENBeU5UQXlNQ3dnTWpVeE5ERXNJREkxTnpBMUxDQXlOVGN5TXl3Z01qVTNPRE1zSURJMU56a3dMQ0F5TlRjNU55d2dNall4TmpBc0lESTJNVFkyTENBeU5qRTNNaXdnTWpZMU1USXNJREkyTlRReUxDQXlOalU0Tnl3Z01qWTFPVElzSURJMk5UazNMQ0F5TmpZNU1Td2dNalkyT1Rnc0lESTJOelF4TENBeU5qZ3hPU3dnTWpZNE5Ua3NJREkyT0RZMUxDQXlOekE0Tnl3Z01qY3lNRGNzSURJM01qQTVMQ0F5TnpJME5Dd2dNamM0TmpZc0lESTNPRGN6TENBeU9ERXhNU3dnTXpJMU5UUXNJRE15Tnprd0xDQXpNekEzTlN3Z016TTRPVEFzSURNek9Ea3lMQ0F6TXpnNU5Dd2dNek00T1Rnc0lETXpPVEF3TENBek16azJObDA9JyksdHJ1ZSk7CiAkbz1bJ3YnPT4nVEsxJywncmV6aW1hcyc9PiRyLCdwcmFzbyc9PmNvdW50KCRpZHMpLCdlaWwnPT5bXV07CiBmb3JlYWNoKCRpZHMgYXMgJHBpZCl7CiAgICRwPWdldF9wb3N0KCRwaWQpOwogICAkZT1bJ2lkJz0+JHBpZCwncGF2Jz0+JHA/bWJfc3Vic3RyKCRwLT5wb3N0X3RpdGxlLDAsNTQpOidORVJBJywnYnV2byc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3Rpa19rdXJqZXJpdScsdHJ1ZSldOwogICBpZighJHAgfHwgJHAtPnBvc3RfdHlwZSE9PSdwcm9kdWN0Jyl7ICRlWyd2ZWlrc21hcyddPSdQUkFMRUlTVEEnOyAkb1snZWlsJ11bXT0kZTsgY29udGludWU7IH0KICAgaWYoJGVbJ2J1dm8nXT09PSd5ZXMnKXsgJGVbJ3ZlaWtzbWFzJ109J0pBVSBQQVpZTUVUQSc7ICRvWydlaWwnXVtdPSRlOyBjb250aW51ZTsgfQogICBpZigkcj09PSdBUFBMWScpewogICAgIHVwZGF0ZV9wb3N0X21ldGEoJHBpZCwnX3BzX3Rpa19rdXJqZXJpdScsJ3llcycpOwogICAgIHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJHBpZCk7IGNsZWFuX3Bvc3RfY2FjaGUoJHBpZCk7CiAgICAgJGVbJ3BvJ109Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHNfdGlrX2t1cmplcml1Jyx0cnVlKTsKICAgICAkZVsndmVpa3NtYXMnXT0oJGVbJ3BvJ109PT0neWVzJyk/J1BBWllNRVRBJzonS0xBSURBJzsKICAgfSBlbHNlICRlWyd2ZWlrc21hcyddPSdCVVRVIFBBWllNRVRBJzsKICAgJG9bJ2VpbCddW109JGU7CiB9CiAkb1snc3VtYSddPVsncGF6eW1ldGEnPT5jb3VudChhcnJheV9maWx0ZXIoJG9bJ2VpbCddLGZ1bmN0aW9uKCR4KXtyZXR1cm4gJHhbJ3ZlaWtzbWFzJ109PT0nUEFaWU1FVEEnO30pKSwKICAgJ2phdSc9PmNvdW50KGFycmF5X2ZpbHRlcigkb1snZWlsJ10sZnVuY3Rpb24oJHgpe3JldHVybiAkeFsndmVpa3NtYXMnXT09PSdKQVUgUEFaWU1FVEEnO30pKSwKICAgJ2tsYWlkdSc9PmNvdW50KGFycmF5X2ZpbHRlcigkb1snZWlsJ10sZnVuY3Rpb24oJHgpe3JldHVybiAkeFsndmVpa3NtYXMnXT09PSdLTEFJREEnO30pKV07CiBpZigkcj09PSdBUFBMWScpewogICBnbG9iYWwgJHdwZGI7CiAgICRvWydpc192aXNvX3N2ZXRhaW5lamUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKAogICAgICJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBtZXRhX2tleT0nX3BzX3Rpa19rdXJqZXJpdScgQU5EIG1ldGFfdmFsdWU9J3llcyciKTsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LDk5KTsK'; const VER='TIKKURJ-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Tik Kurjeriu Zymejimas v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_tk=DRY',{headers:UA},'dry');
  let DJ=null; try{ DJ=JSON.parse(await d.text()); }catch(e){}
  out.dry=DJ&&DJ.suma; out.praso=DJ&&DJ.praso;
  if(DJ){ await miegok(2500);
    const a=await fx(WP+'/?ps_tk=APPLY',{headers:UA},'apply');
    try{ const AJ=JSON.parse(await a.text());
      out.apply=AJ.suma; out.is_viso=AJ.is_viso_svetaineje;
      out.klaidos=AJ.eil.filter(x=>x.veiksmas==='KLAIDA'||x.veiksmas==='PRALEISTA'); }catch(e){} }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/tikkurj_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
