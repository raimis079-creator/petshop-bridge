process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIE5MIGxhaXNrYXMgMTA4ICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfbmxtJ10pfHwkX0dFVFsncHNfbmxtJ10hPT0nSicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J05MTTInLCdub3dfdXRjJz0+Z21kYXRlKCdZLW0tZCBIOmk6cycpKTsKICB0cnl7CiAgICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgICAkaj1mdW5jdGlvbigpIHVzZSgkd3BkYiwkcCl7IHJldHVybiAkd3BkYi0+Z2V0X3JvdygiU0VMRUNUIGlkLHN0YXR1cyxwcm92aWRlcixwcm92aWRlcl9tZXNzYWdlX2lkLGF0dGVtcHRzLGxhc3RfZXJyb3IsZXJyb3JfbWVzc2FnZSxza2lwX3JlYXNvbixibG9ja19yZWFzb24sc2VudF9hdCxkZWNpc2lvbl9hdCxuZXh0X2F0dGVtcHRfYXQsc3ViamVjdCBGUk9NIHskcH1wc19lbWFpbF9qb2JzIFdIRVJFIGlkPTEwOCIsQVJSQVlfQSk7IH07CiAgICAkb1sncHJpZXMnXT0kaigpOwogICAgJG9bJ2Nyb25fbmV4dCddPWdtZGF0ZSgnWS1tLWQgSDppOnMnLChpbnQpd3BfbmV4dF9zY2hlZHVsZWQoJ3BzX2VtYWlsX2Rpc3BhdGNoX2Nyb24nKSk7CiAgICBpZigkb1sncHJpZXMnXVsnc3RhdHVzJ109PT0ncGVuZGluZycpeyAkb1sndmVpa3NtYXMnXT0nZG9fYWN0aW9uIHBzX2VtYWlsX2Rpc3BhdGNoX2Nyb24nOyBkb19hY3Rpb24oJ3BzX2VtYWlsX2Rpc3BhdGNoX2Nyb24nKTsgJG9bJ3BvJ109JGooKTsgfQogICAgJG9bJ3N1cHByZXNzaW9uX3RlcnJhJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsY2hhbm5lbCxyZWFzb24sc291cmNlLHN1cHByZXNzZWRfYXQscmVsZWFzZWRfYXQgRlJPTSB7JHB9cHNfZW1haWxfc3VwcHJlc3Npb24gV0hFUkUgZW1haWw9J3RlcnJhQGd5dnVuYWkubHQnIixBUlJBWV9BKTsKICAgICRvWydldmVudF9sb2cnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRwfXBzX2V2ZW50X2xvZyBPUkRFUiBCWSAxIERFU0MgTElNSVQgMyIsQVJSQVlfQSk7CiAgICAkb1snc2FyZ2FzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbGFpa2FzLGx5Z2lzLHppbnV0ZSxmYWlsYXMsZWlsdXRlIEZST00geyRwfXBzX3Nhcmdhc19rbGFpZG9zIFdIRVJFIGxhaWthcz5VVENfVElNRVNUQU1QKCktSU5URVJWQUwgMjAgTUlOVVRFIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNSIsQVJSQVlfQSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-073759';
const GKEY='ps_nlm';
const PHASES=["J"];
const OUT='analize/nlm_108.json';
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
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
