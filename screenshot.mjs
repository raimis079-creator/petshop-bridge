process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4NTUnXSkpIHJldHVybjsKICAgIEBzZXRfdGltZV9saW1pdCgyODApOyBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCc3NjhNJyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89WydWRVJTSUpBJz0+J1MxNTk5LUMxJ107CiAgICAvLyBlc2FtaSByaW5raW5pYWkgc3Ugc3VkZXRpbWkKICAgICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBESVNUSU5DVCB0ci5vYmplY3RfaWQgRlJPTSB7JHB9dGVybV9yZWxhdGlvbnNoaXBzIHRyIEpPSU4geyRwfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEpPSU4geyRwfXBvc3RzIHBvIE9OIHBvLklEPXRyLm9iamVjdF9pZCBBTkQgcG8ucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwby5wb3N0X3R5cGU9J3Byb2R1Y3QnIFdIRVJFIHR0LnRheG9ub215PSdwcm9kdWN0X2NhdCcgQU5EIHR0LnRlcm1faWQgSU4gKDY3OSw2ODIsNjgzLDY4NCkiKTsKICAgIGZvcmVhY2ggKCRpZHMgYXMgJGlkKSB7IGlmIChnZXRfcG9zdF9tZXRhKCRpZCwnX3BzX2xhdWthcycsdHJ1ZSk9PT0neWVzJykgY29udGludWU7ICRwcj13Y19nZXRfcHJvZHVjdCgkaWQpOyAka29tcD1bXTsgaWYgKCRwciAmJiBtZXRob2RfZXhpc3RzKCRwciwnZ2V0X2NvbnRlbnRzJykpIHsgZm9yZWFjaCAoKGFycmF5KSRwci0+Z2V0X2NvbnRlbnRzKCkgYXMgJGs9PiRjKSB7ICRjaWQ9aXNfYXJyYXkoJGMpPygkY1sncHJvZHVjdF9pZCddPz8kayk6JGs7ICRrb21wW109bWJfc3Vic3RyKGdldF90aGVfdGl0bGUoKGludCkkY2lkKSwwLDMwKS4nw5cnLihpc19hcnJheSgkYyk/KCRjWydxdWFudGl0eSddPz8kY1snZGVmYXVsdF9xdWFudGl0eSddPz8xKToxKTsgfSB9ICRvWydyaW5raW5pYWknXVtdPVskaWQsbWJfc3Vic3RyKGdldF90aGVfdGl0bGUoJGlkKSwwLDUwKSwkcHI/JHByLT5nZXRfcHJpY2UoKTonJyxnZXRfcG9zdF9tZXRhKCRpZCwnX3BzX3NhbmRlbGlzJyx0cnVlKSwka29tcF07IH0KICAgIC8vIGthdGFsb2dhczogc2FuZGVsaXMgeCBrYXRlZ29yaWphIChwdWJsaXNoLCBpbnN0b2NrKSwgdmlkLiBhbnRrYWluaXMKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBvLklEIEZST00geyRwfXBvc3RzIHBvIFdIRVJFIHBvLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIsQVJSQVlfQSk7CiAgICAkYWdnPVtdOyAkdG9wPVtdOwogICAgJGk9MDsgZm9yZWFjaCAoJHJvd3MgYXMgJHIpIHsgJGlkPShpbnQpJHJbJ0lEJ107IGlmICgrKyRpICUgMjAwID09PSAwKSB7IHdwX2NhY2hlX2ZsdXNoKCk7IH0gJHByPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcHJ8fCEkcHItPmlzX2luX3N0b2NrKCl8fCRwci0+Z2V0X3R5cGUoKT09PSdtaXgtYW5kLW1hdGNoJykgY29udGludWU7ICRzYW5kPWdldF9wb3N0X21ldGEoJGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpPzonPyc7ICRjYXRzPXdwX2dldF9wb3N0X3Rlcm1zKCRpZCwncHJvZHVjdF9jYXQnLFsnZmllbGRzJz0+J3NsdWdzJ10pOyAka2F0PScnOyBmb3JlYWNoICgkY2F0cyBhcyAkYykgaWYgKCFpbl9hcnJheSgkYyxbJ3N1bmltcycsJ2thdGVtcycsJ2dyYXV6aWthbXMnLCdwYXVrc2NpYW1zJywnenV2aW1zJywnbWFpc3Rhcy1zdW5pbXMnLCdtYWlzdGFzLWthdGVtcycsJ2RhdWdpYXUtcGlnaWF1Jywncmlua2luaWFpJ10pKSB7ICRrYXQ9JGM7IGJyZWFrOyB9CiAgICAgICRrPShmbG9hdCkkcHItPmdldF9wcmljZSgpOyAkY29zdD0oZmxvYXQpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19jb3N0X3ByaWNlJyx0cnVlKTsgZm9yZWFjaChbJ192Zl9jb3N0JywnX3piX2Nvc3QnXSBhcyAkbSl7ICR2PShmbG9hdClnZXRfcG9zdF9tZXRhKCRpZCwkbSx0cnVlKTsgaWYoJGNvc3Q8PTAmJiR2PjApJGNvc3Q9JHY7IH0gJGFudD0oJGNvc3Q+MCYmJGs+MCk/cm91bmQoKCgkay8xLjIxKS0kY29zdCkvJGNvc3QqMTAwKTpudWxsOwogICAgICAka2V5PSIkc2FuZHwka2F0IjsgJGFnZ1ska2V5XVsnbiddPSgkYWdnWyRrZXldWyduJ10/PzApKzE7IGlmKCRhbnQhPT1udWxsKXsgJGFnZ1ska2V5XVsnYW50J11bXT0kYW50OyB9CiAgICAgIGlmICgkYW50IT09bnVsbCAmJiAkYW50Pj01NSAmJiAkaz49MiAmJiAkazw9MjUgJiYgJHNhbmQhPT0nPycpICR0b3BbXT1bJHNhbmQsJGthdCwkaywkYW50LChpbnQpJHByLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSxtYl9zdWJzdHIoJHByLT5nZXRfbmFtZSgpLDAsNTUpXTsKICAgIH0KICAgIGZvcmVhY2ggKCRhZ2cgYXMgJGs9PiR2KSB7ICRhZ2dbJGtdPVsnbic9PiR2WyduJ10sJ3ZpZF9hbnQnPT5pc3NldCgkdlsnYW50J10pP3JvdW5kKGFycmF5X3N1bSgkdlsnYW50J10pL2NvdW50KCR2WydhbnQnXSkpOm51bGxdOyB9CiAgICB1YXNvcnQoJGFnZyxmbigkYSwkYik9PiRiWyduJ108PT4kYVsnbiddKTsgJG9bJ2FnZyddPWFycmF5X3NsaWNlKCRhZ2csMCw2MCx0cnVlKTsKICAgIHVzb3J0KCR0b3AsZm4oJGEsJGIpPT4kYlszXTw9PiRhWzNdKTsgJG9bJ3RvcF9tYXJ6YSddPWFycmF5X3NsaWNlKCR0b3AsMCwxMjApOwogICAgJG9bJ2JyYW5kX3ZmX3NhdXNhcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHQubmFtZSBiLCBDT1VOVCgqKSBuIEZST00geyRwfXRlcm1fcmVsYXRpb25zaGlwcyB0ciBKT0lOIHskcH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBBTkQgdHQudGF4b25vbXk9J3Byb2R1Y3RfYnJhbmQnIEpPSU4geyRwfXRlcm1zIHQgT04gdC50ZXJtX2lkPXR0LnRlcm1faWQgSk9JTiB7JHB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9dHIub2JqZWN0X2lkIEFORCBtLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIEpPSU4geyRwfXBvc3RzIHBvIE9OIHBvLklEPXRyLm9iamVjdF9pZCBBTkQgcG8ucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEdST1VQIEJZIG0ubWV0YV92YWx1ZSwgdC5uYW1lIEhBVklORyBuPj04IE9SREVSIEJZIG0ubWV0YV92YWx1ZSwgbiBERVNDIixBUlJBWV9OKTsKICAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-130618';
const GKEY='ps_ex55';
const PHASES=["R"];
const OUT='analize/s1599_c.json';
const DATA=[];
const out={v:VER};
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
  try{ const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){ out.list_praleistas=String(e).slice(0,80); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  let dq='';
  if(DATA.length){ out.data={}; for(const p of DATA){ const name=p.split('/').pop();
      const g=await fx('https://api.github.com/repos/'+REPO+'/contents/'+p,{headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github.raw+json'}},'gh_'+name);
      const buf=Buffer.from(await g.arrayBuffer());
      const m=await fx(WP+'/wp-json/wp/v2/media',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain','Content-Disposition':'attachment; filename="'+name+'"'},body:buf},'media_'+name);
      const mt=await m.text(); try{ const j=JSON.parse(mt); out.data[name]={id:j.id,status:m.status}; dq+='&d_'+name.replace(/\W/g,'_')+'='+j.id; }catch(e){ out.data[name]={status:m.status,err:mt.slice(0,200)}; } } }
  await miegok(9000);
  if(process.env.GTM_SA_JSON){ try{ const sr=await fx(WP+'/wp-json/ps-seo-temp/v1/sa',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain'},body:process.env.GTM_SA_JSON},'sa'); out.sa_push={status:sr.status,body:(await sr.text()).slice(0,200)}; }catch(e){ out.sa_push=String(e).slice(0,200);} }
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f)+dq,{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
