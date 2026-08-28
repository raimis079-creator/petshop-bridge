process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEt1cmplcmlvIFp2YWxneWJhIHYxLjAgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCAoJF9HRVRbJ3BzX2t1J10gPz8gJycpICE9PSAnS1UxJyApIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJG89Wyd2Jz0+J0tVMSddOwoKIC8qIGthdGVnb3Jpam9zLCBrdXJpb3MgcnVwaSAqLwogJGthdD0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0LnRlcm1faWQsdC5uYW1lLHQuc2x1Zyx0dC5jb3VudCBGUk9NIHskd3BkYi0+dGVybXN9IHQKICAgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHR0IE9OIHR0LnRlcm1faWQ9dC50ZXJtX2lkCiAgIFdIRVJFIHR0LnRheG9ub215PSdwcm9kdWN0X2NhdCcgQU5EICgKICAgICB0LnNsdWcgTElLRSAnJXR1YWxldCUnIE9SIHQuc2x1ZyBMSUtFICcldHJhbnNwb3J0JScgT1IgdC5zbHVnIExJS0UgJyV2ZXppbSUnCiAgICAgT1IgdC5zbHVnIExJS0UgJyVuYXJ2JScgT1IgdC5zbHVnIExJS0UgJyVkZXplJScgT1IgdC5zbHVnIExJS0UgJyVrZWxpb24lJwogICAgIE9SIHQuc2x1ZyBMSUtFICclZ3VvbCUnIE9SIHQuc2x1ZyBMSUtFICclZHJhc2t5a2wlJykKICAgT1JERVIgQlkgdHQuY291bnQgREVTQyIsIEFSUkFZX0EpOwogJG9bJ2thdGVnb3Jpam9zJ109JGthdDsKCiAkaWRzPVtdOwogZm9yZWFjaCgka2F0IGFzICRrKXsKICAgJHA9Z2V0X3Bvc3RzKFsncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PlsncHVibGlzaCcsJ2RyYWZ0J10sJ251bWJlcnBvc3RzJz0+LTEsCiAgICAgJ2ZpZWxkcyc9PidpZHMnLCd0YXhfcXVlcnknPT5bWyd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2ZpZWxkJz0+J3Rlcm1faWQnLCd0ZXJtcyc9PihpbnQpJGtbJ3Rlcm1faWQnXV1dXSk7CiAgIGZvcmVhY2goJHAgYXMgJHgpICRpZHNbKGludCkkeF09dHJ1ZTsKIH0KICRpZHM9YXJyYXlfa2V5cygkaWRzKTsKICRvWydwcmVraXUnXT1jb3VudCgkaWRzKTsKCiAkZT1bXTsKIGZvcmVhY2goJGlkcyBhcyAkcGlkKXsKICAgJHA9Z2V0X3Bvc3QoJHBpZCk7CiAgICRrdD13cF9nZXRfb2JqZWN0X3Rlcm1zKCRwaWQsJ3Byb2R1Y3RfY2F0JyxbJ2ZpZWxkcyc9PiduYW1lcyddKTsKICAgJGVbXT1bJ2lkJz0+JHBpZCwncGF2Jz0+bWJfc3Vic3RyKCRwLT5wb3N0X3RpdGxlLDAsNjgpLCdzdCc9PiRwLT5wb3N0X3N0YXR1cywKICAgICAna2F0Jz0+aXNfd3BfZXJyb3IoJGt0KT9bXToka3QsCiAgICAgJ2t1cmonPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19wc190aWtfa3VyamVyaXUnLHRydWUpLAogICAgICdzdm9yaXMnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ193ZWlnaHQnLHRydWUpLAogICAgICdpbGdpcyc9PmdldF9wb3N0X21ldGEoJHBpZCwnX2xlbmd0aCcsdHJ1ZSksCiAgICAgJ3Bsb3Rpcyc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3dpZHRoJyx0cnVlKSwKICAgICAnYXVrJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfaGVpZ2h0Jyx0cnVlKSwKICAgICAna2FpbmEnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19yZWd1bGFyX3ByaWNlJyx0cnVlKV07CiB9CiB1c29ydCgkZSxmdW5jdGlvbigkYSwkYil7IHJldHVybiBzdHJjbXAoaW1wbG9kZSgnLCcsJGFbJ2thdCddKS4kYVsncGF2J10sIGltcGxvZGUoJywnLCRiWydrYXQnXSkuJGJbJ3BhdiddKTsgfSk7CiAkb1snZWlsJ109JGU7CiAkb1snamF1X3BhenltZXRhJ109Y291bnQoYXJyYXlfZmlsdGVyKCRlLGZ1bmN0aW9uKCR4KXtyZXR1cm4gJHhbJ2t1cmonXT09PSd5ZXMnO30pKTsKICRvWydzdV9tYXRtZW5pbWlzJ109Y291bnQoYXJyYXlfZmlsdGVyKCRlLGZ1bmN0aW9uKCR4KXtyZXR1cm4gKGZsb2F0KSR4WydpbGdpcyddPjA7fSkpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sOTkpOwo='; const VER='KURJ-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Kurjerio Zvalgyba v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_ku=KU1',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'ku');
  const dt=await d.text(); let J=null; try{ J=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,900); }
  if(J){ out.suma={prekiu:J.prekiu,jau:J.jau_pazymeta,su_matmenimis:J.su_matmenimis};
         out.kategorijos=J.kategorijos;
         await put('analize/kurjeris.json', Buffer.from(JSON.stringify(J,null,1)), VER); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/kurjeris_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
