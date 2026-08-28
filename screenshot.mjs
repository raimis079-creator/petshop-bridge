process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEViaSBpciBDb29ja29vIEJyZW5kYWkgdjEuMCAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogJHI9JF9HRVRbJ3BzX2JybmQyJ10gPz8gJyc7IGlmKCRyIT09J0RSWScgJiYgJHIhPT0nQVBQTFknKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7CiAkbWFwPVsgJ0ViaSc9PlszNTEwMiwzNTEwNCwzNTEwOCwzNTExMF0sICdDb29ja29vJz0+WzM1MTA2XSBdOwogJGJyb2xpYWk9WzE1MzA2LDE1MzA5LDE1MzEyLDE1MzM2LDE1MzMzXTsgICAvLyBncmV0aW1vcyBzZW5vcyBwcmVrZXMgLSBpcyBqdSBtYXRvbSBrYWlwIGJyZW5kYXMgdmFkaW5hc2kKICRvPVsndic9PidCUk5EMicsJ3JlemltYXMnPT4kciwnZWlsJz0+W11dOwoKIGZvcmVhY2goJGJyb2xpYWkgYXMgJGIpewogICAkbj13cF9nZXRfb2JqZWN0X3Rlcm1zKCRiLCdwcm9kdWN0X2JyYW5kJyxbJ2ZpZWxkcyc9PiduYW1lcyddKTsKICAgJHA9Z2V0X3Bvc3QoJGIpOwogICAkb1snYnJvbGl1X2JyZW5kYWknXVtdPVsnaWQnPT4kYiwnYnJlbmRhcyc9PmlzX3dwX2Vycm9yKCRuKT9bXTokbiwncGF2Jz0+JHA/bWJfc3Vic3RyKCRwLT5wb3N0X3RpdGxlLDAsNTIpOm51bGxdOwogfQogJG9bJ3Zpc2lfcGFuYXN1cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHQudGVybV9pZCx0Lm5hbWUsdC5zbHVnLHR0LmNvdW50IEZST00geyR3cGRiLT50ZXJtc30gdAogICBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV9pZD10LnRlcm1faWQgV0hFUkUgdHQudGF4b25vbXk9J3Byb2R1Y3RfYnJhbmQnCiAgIEFORCAodC5uYW1lIExJS0UgJyViaSUnIE9SIHQubmFtZSBMSUtFICclb2Nrb28lJyBPUiB0Lm5hbWUgTElLRSAnJWFycm95JScpIE9SREVSIEJZIHQubmFtZSIsIEFSUkFZX0EpOwoKIGZvcmVhY2goJG1hcCBhcyAkdmFyZGFzPT4kaWRzKXsKICAgJHQ9Z2V0X3Rlcm1fYnkoJ25hbWUnLCR2YXJkYXMsJ3Byb2R1Y3RfYnJhbmQnKTsKICAgaWYoISR0KXsgZm9yZWFjaChbc3RydG9sb3dlcigkdmFyZGFzKV0gYXMgJHMpeyAkeD1nZXRfdGVybV9ieSgnc2x1ZycsJHMsJ3Byb2R1Y3RfYnJhbmQnKTsgaWYoJHgpeyR0PSR4O2JyZWFrO30gfSB9CiAgIGlmKCEkdCl7ICRvWydlaWwnXVtdPVsnYnJlbmRhcyc9PiR2YXJkYXMsJ3ZlaWtzbWFzJz0+J1RFUk1JTk8gTkVSQSAtIG5la3VyaXUnLCdpZHMnPT4kaWRzXTsgY29udGludWU7IH0KICAgZm9yZWFjaCgkaWRzIGFzICRwaWQpewogICAgICRwPWdldF9wb3N0KCRwaWQpOwogICAgICRlPVsnYnJlbmRhcyc9PiR2YXJkYXMsJ3Rlcm1faWQnPT4oaW50KSR0LT50ZXJtX2lkLCdpZCc9PiRwaWQsCiAgICAgICAgICdwYXYnPT4kcD9tYl9zdWJzdHIoJHAtPnBvc3RfdGl0bGUsMCw1OCk6J05FUkEnLCdzdGF0dXNhcyc9PiRwPyRwLT5wb3N0X3N0YXR1czpudWxsLAogICAgICAgICAnYnV2byc9PndwX2dldF9vYmplY3RfdGVybXMoJHBpZCwncHJvZHVjdF9icmFuZCcsWydmaWVsZHMnPT4nbmFtZXMnXSldOwogICAgIGlmKCEkcHx8JHAtPnBvc3RfdHlwZSE9PSdwcm9kdWN0Jyl7ICRlWyd2ZWlrc21hcyddPSdQUkFMRUlTVEEnOyAkb1snZWlsJ11bXT0kZTsgY29udGludWU7IH0KICAgICBpZigkcj09PSdBUFBMWScpewogICAgICAgJHJlcz13cF9zZXRfb2JqZWN0X3Rlcm1zKCRwaWQsWyhpbnQpJHQtPnRlcm1faWRdLCdwcm9kdWN0X2JyYW5kJyxmYWxzZSk7CiAgICAgICAkZVsndmVpa3NtYXMnXT1pc193cF9lcnJvcigkcmVzKT8oJ0tMQUlEQTogJy4kcmVzLT5nZXRfZXJyb3JfbWVzc2FnZSgpKTonUFJJU0tJUlRBJzsKICAgICAgIHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJHBpZCk7IGNsZWFuX3Bvc3RfY2FjaGUoJHBpZCk7CiAgICAgICAkZVsncG8nXT13cF9nZXRfb2JqZWN0X3Rlcm1zKCRwaWQsJ3Byb2R1Y3RfYnJhbmQnLFsnZmllbGRzJz0+J25hbWVzJ10pOwogICAgIH0gZWxzZSAkZVsndmVpa3NtYXMnXT0nQlVUVSBQUklTS0lSVEEnOwogICAgICRvWydlaWwnXVtdPSRlOwogICB9CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='BRND2-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Ebi ir Coockoo Brendai v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_brnd2=DRY',{headers:UA},'dry'); let DJ=null;
  const dt=await d.text(); try{ DJ=JSON.parse(dt); }catch(e){ out.dry_zalias=dt.slice(0,1200); }
  out.dry=DJ;
  const gali = DJ && DJ.eil.some(x=>x.veiksmas==='BUTU PRISKIRTA');
  if(gali){ await miegok(2500);
    const a=await fx(WP+'/?ps_brnd2=APPLY',{headers:UA},'apply');
    const at=await a.text(); try{ out.apply=JSON.parse(at); }catch(e){ out.apply_zalias=at.slice(0,1200); } }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/brendas2_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
