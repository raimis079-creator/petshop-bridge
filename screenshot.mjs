process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIHBhcmlua2lrbGlvIE4gZGlhZ25vc3Rpa2EgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19mMTknXSk/JF9HRVRbJ3BzX2YxOSddOicnKSE9PSdUUycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J0RCRzMtMS4wJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOwogICAgJHNldD1mdW5jdGlvbigkZmwsJHNrdXMpdXNlKCR3cGRiKXsKICAgICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJVUERBVEUgeyR3cGRiLT5vcHRpb25zfSBTRVQgb3B0aW9uX3ZhbHVlPSVzIFdIRVJFIG9wdGlvbl9uYW1lPSdwc19wcmVudW1lcmF0YV9panVuZ3RhJyIsJGZsKSk7CiAgICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiVVBEQVRFIHskd3BkYi0+b3B0aW9uc30gU0VUIG9wdGlvbl92YWx1ZT0lcyBXSEVSRSBvcHRpb25fbmFtZT0ncHNfcHJlbnVtZXJhdGFfc2t1JyIsc2VyaWFsaXplKCRza3VzKSkpOwogICAgICBkZWxldGVfdHJhbnNpZW50KCdwc19wcmVuX3NrdV9pZCcpOyB3cF9jYWNoZV9mbHVzaCgpOwogICAgfTsKICAgICRwaWQ9MzUwOTk7ICRwcj13Y19nZXRfcHJvZHVjdCgkcGlkKTsgJHNrdT1tYl9zdHJ0b3VwcGVyKHRyaW0oJHByLT5nZXRfc2t1KCkpKTsKICAgICRzZXQoJ3RhaXAnLGFycmF5KCRza3UpKTsKICAgICRlbT0nZGczJy50aW1lKCkuJ0BneXZ1bmFpLmx0JzsKICAgICR1aWQ9d3BfaW5zZXJ0X3VzZXIoYXJyYXkoJ3VzZXJfbG9naW4nPT4nZGczJy50aW1lKCksJ3VzZXJfZW1haWwnPT4kZW0sJ3VzZXJfcGFzcyc9PndwX2dlbmVyYXRlX3Bhc3N3b3JkKDIwKSkpOwogICAgJHNpZD1QZXRzaG9wX1ByZW51bWVyYXRhOjpzdWt1cnRpKGFycmF5KCdlbWFpbCc9PiRlbSwndXNlcl9pZCc9PiR1aWQsJ3Byb2R1Y3RfaWQnPT4kcGlkLAogICAgICAnbmV4dF9jeWNsZV9kYXRlJz0+Z21kYXRlKCdZLW0tZCcsdGltZSgpKzEwKjg2NDAwKSkpOwogICAgJGNrPWFycmF5KG5ldyBXUF9IdHRwX0Nvb2tpZShhcnJheSgnbmFtZSc9PkxPR0dFRF9JTl9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCx0aW1lKCkrMTgwLCdsb2dnZWRfaW4nKSkpKTsKICAgICRnPXdwX3JlbW90ZV9nZXQod2NfZ2V0X2FjY291bnRfZW5kcG9pbnRfdXJsKCdwcmVudW1lcmF0b3MnKSxhcnJheSgndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSwnY29va2llcyc9PiRjaykpOwogICAgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJGcpOwogICAgJHBvej1zdHJwb3MoJGgsJ1ByZW51bWVydW90aTwvYnV0dG9uPicpOwogICAgJG9bJ215Z3R1a2FzJ109JHBvej09PWZhbHNlPydORVJBJzonWVJBJzsKICAgIGlmKCRwb3ohPT1mYWxzZSl7CiAgICAgICRvWydrb250ZWtzdGFzJ109aHRtbF9lbnRpdHlfZGVjb2RlKHN0cmlwX3RhZ3MobWJfc3Vic3RyKCRoLG1heCgwLCRwb3otNzAwKSw3MDApKSk7CiAgICAgIC8vIGtva2lhIHByZWtlIGZvcm1vamU/CiAgICAgICRmcj1tYl9zdWJzdHIoJGgsbWF4KDAsJHBvei0xNTAwKSwxNTAwKTsKICAgICAgcHJlZ19tYXRjaCgnL25hbWU9InBpZCIgdmFsdWU9IihcZCspIi8nLCRmciwkbXApOwogICAgICAkb1snZm9ybW9zX3BpZCddPWlzc2V0KCRtcFsxXSk/KGludCkkbXBbMV06J05FUkFTVEEnOwogICAgICBpZihpc3NldCgkbXBbMV0pKXsgJHAyPXdjX2dldF9wcm9kdWN0KChpbnQpJG1wWzFdKTsgJG9bJ2Zvcm1vc19wcmVrZSddPSRwMj8kcDItPmdldF9uYW1lKCk6Jz8nOyAkb1snZm9ybW9zX3NrdSddPSRwMj8kcDItPmdldF9za3UoKTonPyc7IH0KICAgIH0KICAgICRvWyd6ZW1lbGFwaXMnXT1QZXRzaG9wX1ByZW51bWVyYXRhX0thdGFsb2dhczo6emVtZWxhcGlzKCk7CiAgICAvLyBWQUxZTUFTCiAgICAkd3BkYi0+ZGVsZXRlKFBldHNob3BfUHJlbnVtZXJhdGE6OnQoKSxhcnJheSgnaWQnPT4oaW50KSRzaWQpKTsKICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00gIi5QZXRzaG9wX1ByZW51bWVyYXRhOjp0ZSgpLiIgV0hFUkUgc3Vic2NyaXB0aW9uX2lkPSVkIiwoaW50KSRzaWQpKTsKICAgIHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy91c2VyLnBocCc7IHdwX2RlbGV0ZV91c2VyKCR1aWQpOwogICAgJHNldCgnbmUnLGFycmF5KCkpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='f19_dbg3-105055';
const GKEY='ps_f19';
const PHASES=["TS"];
const OUT='analize/f19_dbg3_1788087055.json';
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
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,1500); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
