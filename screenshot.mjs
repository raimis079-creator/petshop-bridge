process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIERyYXNreWtsaXUgWnZhbGd5YmEgdjEuMCAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoICgkX0dFVFsncHNfZHInXSA/PyAnJykgIT09ICdEUjEnICkgcmV0dXJuOwogJG89Wyd2Jz0+J0RSMScsJ2VpbCc9PltdXTsKICRwPWdldF9wb3N0cyhbJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywncG9zdF9zdGF0dXMnPT5bJ3B1Ymxpc2gnLCdkcmFmdCddLCdudW1iZXJwb3N0cyc9Pi0xLAogICAnZmllbGRzJz0+J2lkcycsJ3RheF9xdWVyeSc9PltbJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnZmllbGQnPT4ndGVybV9pZCcsJ3Rlcm1zJz0+MTI0XV1dKTsKIGZvcmVhY2goJHAgYXMgJHBpZCl7CiAgICRwbz1nZXRfcG9zdCgkcGlkKTsKICAgJHQ9JHBvLT5wb3N0X3RpdGxlLicgfHwgJy53cF9zdHJpcF9hbGxfdGFncygkcG8tPnBvc3RfY29udGVudCkuJyB8fCAnLndwX3N0cmlwX2FsbF90YWdzKCRwby0+cG9zdF9leGNlcnB0KTsKICAgJHQ9c3RyX3JlcGxhY2UoJywnLCcuJywkdCk7CiAgICRyPVtdOwogICBpZihwcmVnX21hdGNoX2FsbCgnLyhcZHsxLDN9KD86XC5cZCspPylccypbeMOXKl1ccyooXGR7MSwzfSg/OlwuXGQrKT8pXHMqW3jDlypdXHMqKFxkezEsM30oPzpcLlxkKyk/KS91JywkdCwkbSxQUkVHX1NFVF9PUkRFUikpCiAgICAgZm9yZWFjaCgkbSBhcyAkZykgJHJbXT1bKGZsb2F0KSRnWzFdLChmbG9hdCkkZ1syXSwoZmxvYXQpJGdbM11dOwogICBpZighJHIgJiYgcHJlZ19tYXRjaF9hbGwoJy8oXGR7MSwzfSg/OlwuXGQrKT8pXHMqW3jDlypdXHMqKFxkezEsM30oPzpcLlxkKyk/KS91JywkdCwkbSxQUkVHX1NFVF9PUkRFUikpCiAgICAgZm9yZWFjaCgkbSBhcyAkZykgJHJbXT1bKGZsb2F0KSRnWzFdLChmbG9hdCkkZ1syXV07CiAgIC8qIGF0c2tpcmFpOiDigJ5hdWtzdGlzIDEyMCBjbSIgYXIg4oCeMTIwIGNtIiBwYXZhZGluaW1lICovCiAgICRhdWs9bnVsbDsKICAgaWYocHJlZ19tYXRjaCgnLyhcZHsyLDN9KD86XC5cZCspPylccypjbS91JywkcG8tPnBvc3RfdGl0bGUsJG1tKSkgJGF1az0oZmxvYXQpJG1tWzFdOwogICAkbWF4PW51bGw7JG1pbj1udWxsOwogICBmb3JlYWNoKCRyIGFzICR4KXsgJHg9YXJyYXlfZmlsdGVyKCR4LGZ1bmN0aW9uKCR2KXtyZXR1cm4gJHY+PTUmJiR2PD0yNTA7fSk7CiAgICAgaWYoY291bnQoJHgpPDIpIGNvbnRpbnVlOyAkbXg9bWF4KCR4KTsgaWYoJG1heD09PW51bGx8fCRteD4kbWF4KXskbWF4PSRteDskbWluPW1pbigkeCk7fSB9CiAgICRvWydlaWwnXVtdPVsnaWQnPT4kcGlkLCdwYXYnPT5tYl9zdWJzdHIoJHBvLT5wb3N0X3RpdGxlLDAsNjYpLCdzdCc9PiRwby0+cG9zdF9zdGF0dXMsCiAgICAgJ2t1cmonPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19wc190aWtfa3VyamVyaXUnLHRydWUpLAogICAgICdtYXgnPT4kbWF4LCdtaW4nPT4kbWluLCdhdWtfcGF2Jz0+JGF1aywKICAgICAna2FpbmEnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19yZWd1bGFyX3ByaWNlJyx0cnVlKSwKICAgICAnc3ZvcmlzJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfd2VpZ2h0Jyx0cnVlKV07CiB9CiB1c29ydCgkb1snZWlsJ10sZnVuY3Rpb24oJGEsJGIpeyByZXR1cm4gKCRiWydtYXgnXT8/MCk8PT4oJGFbJ21heCddPz8wKTsgfSk7CiAkb1sndmlzbyddPWNvdW50KCRvWydlaWwnXSk7CiAkb1snYmVfbWF0bWVudSddPWNvdW50KGFycmF5X2ZpbHRlcigkb1snZWlsJ10sZnVuY3Rpb24oJHgpe3JldHVybiAkeFsnbWF4J109PT1udWxsO30pKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LDk5KTsK'; const VER='DRASK-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Draskykliu Zvalgyba v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_dr=DR1',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'dr');
  const dt=await d.text(); let J=null; try{ J=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,800); }
  if(J){ out.viso=J.viso; out.be_matmenu=J.be_matmenu;
    await put('analize/draskykles.json', Buffer.from(JSON.stringify(J,null,1)), VER); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/draskykles_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
