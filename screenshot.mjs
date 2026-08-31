process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEJyZXZv4oaSU2VuZGVyIHZlciAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX2JydiddKT8kX0dFVFsncHNfYnJ2J106JycpOyBpZigkZiE9PSdUSUtSQScpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J0JSVjUnKTsKICB0cnl7CiAgICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7CiAgICAkb1snZGJfYnJldm9fcGFnZXMnXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIENPTkNBVChJRCwnOicscG9zdF9zdGF0dXMpIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZSBJTiAoJ3BhZ2UnLCdwb3N0JykgQU5EIChwb3N0X2NvbnRlbnQgTElLRSAnJUJyZXZvJScgT1IgcG9zdF9jb250ZW50IExJS0UgJyVlbmRpbmJsdWUlJykiKTsKICAgICRwZz1nZXRfcG9zdCgzNDUyNSk7ICRodG1sPWFwcGx5X2ZpbHRlcnMoJ3RoZV9jb250ZW50JywkcGctPnBvc3RfY29udGVudCk7CiAgICAkb1sncmVuZGVyX2JyZXZvJ109c3Vic3RyX2NvdW50KHN0cnRvbG93ZXIoJGh0bWwpLCdicmV2bycpOyAkb1sncmVuZGVyX3NlbmRlciddPXN1YnN0cl9jb3VudCgkaHRtbCwnU2VuZGVyJyk7CiAgICAkaT1zdHJwb3MoJGh0bWwsJ1NlbmRlcicpOyAkb1snY3R4J109dHJpbShwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsd3Bfc3RyaXBfYWxsX3RhZ3Moc3Vic3RyKCRodG1sLG1heCgwLCRpLTE2MCksMzIwKSkpKTsKICAgICRvWydtb2RpZmllZCddPSRwZy0+cG9zdF9tb2RpZmllZF9nbXQ7CiAgICAkb1snY2FjaGVfcGx1Z2lucyddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKSxmdW5jdGlvbigkeCl7cmV0dXJuIHByZWdfbWF0Y2goJy9jYWNoZXxsaXRlc3BlZWR8cm9ja2V0fHczfGF1dG9wdGltL2knLCR4KTt9KSk7CiAgICAkb1snc2lkX2FjdGl2ZV90ZW1wJ109JHdwZGItPmdldF9jb2woIlNFTEVDVCBDT05DQVQoaWQsJzonLG5hbWUpIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0xIEFORCBuYW1lIExJS0UgJ1RFTVAlJyIpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-071921';
const GKEY='ps_brv';
const PHASES=["TIKRA"];
const OUT='analize/brevo_ver2.json';
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
