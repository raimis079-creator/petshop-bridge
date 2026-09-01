process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTY3YiBXZWJQIHNlcnZlIHRlc3RhcyArIGtsYWlkxbMgcHJpZcW+YXN0eXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9aXNzZXQoJF9HRVRbJ3BzX3NlbyddKT8kX0dFVFsncHNfc2VvJ106Jyc7IGlmKCRmIT09J1ZFUicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCd2Jz0+J1MxNTY3YicpOyBAc2V0X3RpbWVfbGltaXQoMjAwKTsKICB0cnl7CiAgICAkdXA9d3BfdXBsb2FkX2RpcigpOwogICAgLy8gc2VydmUgdGVzdDogYXR0YWNobWVudCBzdSB3ZWJwCiAgICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J2F0dGFjaG1lbnQnIEFORCBwb3N0X21pbWVfdHlwZT0naW1hZ2UvanBlZycgT1JERVIgQlkgSUQgREVTQyBMSU1JVCAzMCIpOwogICAgZm9yZWFjaCgkaWRzIGFzICRpZCl7ICRwPWdldF9hdHRhY2hlZF9maWxlKCRpZCk7ICR3PXByZWdfcmVwbGFjZSgnflwuKGpwZT9nKSR+aScsJy53ZWJwJywkcCk7IGlmKGZpbGVfZXhpc3RzKCRwKSYmZmlsZV9leGlzdHMoJHcpKXsgJHU9d3BfZ2V0X2F0dGFjaG1lbnRfdXJsKCRpZCk7ICRvWyd0ZXN0J109YXJyYXkoJ3VybCc9PiR1LCdqcGdfa2InPT5yb3VuZChmaWxlc2l6ZSgkcCkvMTAyNCksJ3dlYnBfa2InPT5yb3VuZChmaWxlc2l6ZSgkdykvMTAyNCkpOwogICAgICBmb3JlYWNoKGFycmF5KCd3ZWJwJz0+J2ltYWdlL3dlYnAsaW1hZ2UvKicsJ25vJz0+J2ltYWdlLyonLCdjaHJvbWUnPT4naW1hZ2UvYXZpZixpbWFnZS93ZWJwLGltYWdlL2FwbmcsaW1hZ2Uvc3ZnK3htbCxpbWFnZS8qLCovKjtxPTAuOCcpIGFzICRrPT4kYWNjKXsgJGc9d3BfcmVtb3RlX2dldCgkdSxhcnJheSgndGltZW91dCc9PjE1LCdzc2x2ZXJpZnknPT5mYWxzZSwnaGVhZGVycyc9PmFycmF5KCdBY2NlcHQnPT4kYWNjKSkpOyAkaD13cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVycygkZyktPmdldEFsbCgpOyAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkZyk7ICRvWydzZXJ2ZSddWyRrXT1hcnJheSh3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkZyksJGhbJ2NvbnRlbnQtdHlwZSddPz9udWxsLHN0cmxlbigkYiksc3Vic3RyKCRiLDAsNCk9PT0nUklGRic/J1JJRkYod2VicCknOmJpbjJoZXgoc3Vic3RyKCRiLDAsMykpLCRoWyd2YXJ5J10/P251bGwpOyB9IGJyZWFrOyB9IH0KICAgIC8vIGtsYWlkxbMgcHJpZcW+YXN0eXM6IHBlcmVpbmFtIDQwIGF0dGFjaG1lbnQnxbMsIGt1ciBuxJdyYSB3ZWJwIGlyIG7El3JhIC5ub3dlYnAKICAgICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBJRCBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0nYXR0YWNobWVudCcgQU5EIHBvc3RfbWltZV90eXBlIElOICgnaW1hZ2UvanBlZycsJ2ltYWdlL3BuZycpIE9SREVSIEJZIElEIEFTQyBMSU1JVCAzMDAwIik7ICRuPTA7ICR3aHk9YXJyYXkoKTsKICAgIGZvcmVhY2goJGlkcyBhcyAkaWQpeyBmb3JlYWNoKFBldHNob3BfV2ViUDo6YXR0YWNobWVudF9mYWlsYWkoJGlkKSBhcyAkZmwpeyAkdz1wcmVnX3JlcGxhY2UoJ35cLihqcGU/Z3xwbmcpJH5pJywnLndlYnAnLCRmbCk7IGlmKGZpbGVfZXhpc3RzKCR3KXx8ZmlsZV9leGlzdHMoJGZsLicubm93ZWJwJykpIGNvbnRpbnVlOyAkbisrOyBpZihjb3VudCgkd2h5KTwxMil7ICRyPSc/JzsgaWYoIWlzX2ZpbGUoJGZsKSkgJHI9J2ZhaWxvIG7El3JhJzsgZWxzZSB7ICRpPUBnZXRpbWFnZXNpemUoJGZsKTsgaWYoISRpKSAkcj0nZ2V0aW1hZ2VzaXplIGZhaWwnOyBlbHNlaWYoJGlbMF0qJGlbMV0+MjQwMDAwMDApICRyPSdwZXIgZGlkZWxpcyAnLiRpWzBdLid4Jy4kaVsxXTsgZWxzZSB7ICRpbT0kaVsyXT09PUlNQUdFVFlQRV9QTkc/QGltYWdlY3JlYXRlZnJvbXBuZygkZmwpOkBpbWFnZWNyZWF0ZWZyb21qcGVnKCRmbCk7ICRyPSRpbT8nY3JlYXRlIG9rPz8gbWltZT0nLiRpWydtaW1lJ106J2ltYWdlY3JlYXRlIGZhaWwgbWltZT0nLiRpWydtaW1lJ10uJyBzaXplPScucm91bmQoZmlsZXNpemUoJGZsKS8xMDI0KS4nS0InOyBpZigkaW0pIGltYWdlZGVzdHJveSgkaW0pOyB9IH0gJHdoeVtdPXN0cl9yZXBsYWNlKCR1cFsnYmFzZWRpciddLCcnLCRmbCkuJyDihpIgJy4kcjsgfSBpZigkbj40MDApIGJyZWFrOyB9IGlmKCRuPjQwMCkgYnJlYWs7IH0KICAgICRvWydiZV93ZWJwX25faWtpXzQwMCddPSRuOyAkb1snd2h5J109JHdoeTsgJG9bJ21lbV9wZWFrJ109cm91bmQobWVtb3J5X2dldF9wZWFrX3VzYWdlKCkvMTA0ODU3NikuJ01CJzsKICAgICRodD1maWxlX2dldF9jb250ZW50cyhBQlNQQVRILicuaHRhY2Nlc3MnKTsgcHJlZ19tYXRjaCgnfiMgQkVHSU4gUGV0c2hvcCBXZWJQLio/IyBFTkQgUGV0c2hvcCBXZWJQfnMnLCRodCwkbSk7ICRvWydodF9ibGsnXT0kbVswXT8/bnVsbDsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0pOwo=';
const VER='dep-125541';
const GKEY='ps_seo';
const PHASES=["VER"];
const OUT='analize/s1567b.json';
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
