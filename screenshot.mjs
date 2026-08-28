process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIExpa3VjaXUgUGF0aWtyYSB2MS4wICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiBpZiggKCRfR0VUWydwc19saWsnXSA/PyAnJykgIT09ICdMSUsxJyApIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJG89Wyd2Jz0+J0xJSzEnXTsKICRvWydrbGFzZSddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9LYXRhbG9nYXMnKTsKICRvWydtZXRvZGFzJ109bWV0aG9kX2V4aXN0cygnUGV0c2hvcF9LYXRhbG9nYXMnLCd2YXJpYWNpanVfbGlrdWNpYWknKTsKIGlmKCEkb1snbWV0b2RhcyddKXsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICRybT1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9LYXRhbG9nYXMnLCd2YXJpYWNpanVfbGlrdWNpYWknKTsKICRvWydwYXJhc2FzJ109JHJtLT5nZXROdW1iZXJPZlBhcmFtZXRlcnMoKTsKCiAkdGlrcmk9WzE1ODcwLDE1ODc0LDE1ODc4LDE1ODgyLDE1ODg2LDE1OTE0LDE1OTE3LDE1OTM1LDE1OTM4LDE1OTQyLDE2MTY4LDE2MTcyLDE2MTc1LDE2MTg1LDE3ODA1LDE3ODYyLDE3OTE2LDE3OTIwLDE4Mzc1XTsKICRuYXVqaT1bMTYxODksMTUxNjEsMTkyNDksMTc5MTJdOwogJHI9UGV0c2hvcF9LYXRhbG9nYXM6OnZhcmlhY2lqdV9saWt1Y2lhaShhcnJheV9tZXJnZSgkdGlrcmksJG5hdWppKSk7CiAkb1snZWlsJ109W107CiBmb3JlYWNoKGFycmF5X21lcmdlKCR0aWtyaSwkbmF1amkpIGFzICRwaWQpewogICAkdGV2bz1nZXRfcG9zdF9tZXRhKCRwaWQsJ19zdG9jaycsdHJ1ZSk7CiAgICRzdW1hPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKAogICAgICJTRUxFQ1QgU1VNKENBU1Qoc3QubWV0YV92YWx1ZSBBUyBTSUdORUQpKSBGUk9NIHskd3BkYi0+cG9zdHN9IHYKICAgICAgIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gbXMgT04gbXMucG9zdF9pZD12LklEIEFORCBtcy5tZXRhX2tleT0nX21hbmFnZV9zdG9jaycgQU5EIG1zLm1ldGFfdmFsdWU9J3llcycKICAgICAgIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gc3QgT04gc3QucG9zdF9pZD12LklEIEFORCBzdC5tZXRhX2tleT0nX3N0b2NrJwogICAgICBXSEVSRSB2LnBvc3RfdHlwZT0ncHJvZHVjdF92YXJpYXRpb24nIEFORCB2LnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgdi5wb3N0X3BhcmVudD0lZCIsJHBpZCkpOwogICAkcD1nZXRfcG9zdCgkcGlkKTsKICAgJG9bJ2VpbCddW109WydwaWQnPT4kcGlkLCdwYXYnPT4kcD9tYl9zdWJzdHIoJHAtPnBvc3RfdGl0bGUsMCw0NCk6Jz8nLAogICAgICd0ZXZvX3N0b2NrJz0+JHRldm8sJ2tvbnRyb2xpbmlzX3NxbCc9PiRzdW1hPT09bnVsbD9udWxsOihpbnQpJHN1bWEsCiAgICAgJ2Z1bmtjaWphX2dyYXppbm8nPT4kclskcGlkXSA/PyBudWxsLAogICAgICdzdXRhbXBhJz0+KCRzdW1hPT09bnVsbD8gKCRyWyRwaWRdPz9udWxsKT09PW51bGwgOiAoKGludCkkc3VtYT09PSgkclskcGlkXT8/bnVsbCkpKV07CiB9CiAkb1snbmVzdXRhbXBhJ109Y291bnQoYXJyYXlfZmlsdGVyKCRvWydlaWwnXSxmdW5jdGlvbigkeCl7cmV0dXJuICEkeFsnc3V0YW1wYSddO30pKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LDk5KTsK'; const VER='LIK-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Likuciu Patikra v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_lik=LIK1',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'lik');
  const dt=await d.text(); try{ out.r=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,1200); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/lik_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
