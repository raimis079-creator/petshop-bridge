process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA3MCddKT8kX0dFVFsncHNfaDA3MCddOicnKSE9PSdIMDcwJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwNzAnLCdsYWlrYXMnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpOwoKIC8qIDEuIFNBUkdPIEZBSUxBUyAqLwogJGY9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1zYXJnYXMucGhwJzsKICRvWydzYXJnYXMnXT1hcnJheSgneXJhJz0+ZmlsZV9leGlzdHMoJGYpPzE6MCwnZHlkaXMnPT5maWxlX2V4aXN0cygkZik/ZmlsZXNpemUoJGYpOjAsCiAgICdrZWlzdGFzJz0+ZmlsZV9leGlzdHMoJGYpP2RhdGUoJ1ktbS1kIEg6aScsZmlsZW10aW1lKCRmKSk6bnVsbCwKICAgJ2tsYXNlJz0+Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX1NhcmdhcycpPzE6MCk7CiBpZihmaWxlX2V4aXN0cygkZikpewogICAkaD1maWxlX2dldF9jb250ZW50cygkZixmYWxzZSxudWxsLDAsMTIwMCk7CiAgIGlmKHByZWdfbWF0Y2goJy9WZXJzaW9uOlxzKihbXGQuXSspL2knLCRoLCRtKSkgJG9bJ3NhcmdhcyddWyd2ZXJzaWphJ109JG1bMV07CiAgIGlmKHByZWdfbWF0Y2goJy9QbHVnaW4gTmFtZTpccyooLispL2knLCRoLCRtKSkgJG9bJ3NhcmdhcyddWyd2YXJkYXMnXT10cmltKCRtWzFdKTsKIH0KCiAvKiAyLiBMRU5URUxFICovCiAkdD0kUC4ncHNfc2FyZ2FzX2tsYWlkb3MnOwogJG9bJ2xlbnRlbGUnXT1hcnJheSgneXJhJz0+JHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyR0JyIpPzE6MCk7CiBpZigkb1snbGVudGVsZSddWyd5cmEnXSl7CiAgICRvWydsZW50ZWxlJ11bJ2lyYXN1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQiKTsKICAgJG9bJ2xlbnRlbGUnXVsnc3R1bHBlbGlhaSddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkdCIpOwogICAkb1snbGVudGVsZSddWydwaXJtYXMnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIE1JTihsYWlrYXMpIEZST00gJHQiKTsKICAgJG9bJ2xlbnRlbGUnXVsncGFza3V0aW5pcyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgTUFYKGxhaWthcykgRlJPTSAkdCIpOwogICAkb1sncGFnYWxfdGlwYSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHRpcGFzLCBDT1VOVCgqKSBuLCBNQVgobGFpa2FzKSBuYXVqIEZST00gJHQgR1JPVVAgQlkgdGlwYXMgT1JERVIgQlkgbiBERVNDIExJTUlUIDEyIiwgQVJSQVlfQSk7CiAgICRvWydwYWdhbF9kaWVuYSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEUobGFpa2FzKSBkLCBDT1VOVCgqKSBuIEZST00gJHQgR1JPVVAgQlkgREFURShsYWlrYXMpIE9SREVSIEJZIGQgREVTQyBMSU1JVCAxNCIsIEFSUkFZX0EpOwogICAkb1snbmF1amF1c2knXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00gJHQgT1JERVIgQlkgbGFpa2FzIERFU0MgTElNSVQgOCIsIEFSUkFZX0EpOwogfQoKIC8qIDMuIENST04gQlVLTEUgKi8KICRjPV9nZXRfY3Jvbl9hcnJheSgpOyAkdmlzbz0wOyAkdsSXbHVvamE9YXJyYXkoKTsgJGRhYmFyPXRpbWUoKTsKIGlmKGlzX2FycmF5KCRjKSkgZm9yZWFjaCgkYyBhcyAkdHM9PiRrYWJsKXsKICAgZm9yZWFjaCgka2FibCBhcyAkdmFyZGFzPT4keCl7ICR2aXNvKys7CiAgICAgaWYoJHRzIDwgJGRhYmFyLTM2MDApICR2xJdsdW9qYVtdPWFycmF5KCdrYWJsaXVrYXMnPT4kdmFyZGFzLCd2xJdsdW9qYV92YWwnPT5yb3VuZCgoJGRhYmFyLSR0cykvMzYwMCwxKSk7CiAgIH0KIH0KICRvWydjcm9uJ109YXJyYXkoJ3N1cGxhbnVvdGEnPT4kdmlzbywndsSXbHVvamEnPT5jb3VudCgkdsSXbHVvamEpLAogICAnc2FyYXNhcyc9PmFycmF5X3NsaWNlKCR2xJdsdW9qYSwwLDEwKSwnZGlzYWJsZV93cF9jcm9uJz0+ZGVmaW5lZCgnRElTQUJMRV9XUF9DUk9OJyk/KERJU0FCTEVfV1BfQ1JPTj8xOjApOjApOwoKIC8qIDQuIFNBUkdPIE5VU1RBVFlNQUkgKi8KIGZvcmVhY2goYXJyYXkoJ3BzX3Nhcmdhc19wYXN0YXMnLCdwc19zYXJnYXNfY3Jvbl9iYXplJywncHNfc2FyZ2FzX3Bhc2t1dGluaXMnLCdwc19zYXJnYXNfYnVzZW5hJykgYXMgJGspCiAgICRvWydudXN0YXR5bWFpJ11bJGtdPWdldF9vcHRpb24oJGspOwoKIC8qIDUuIFdQIERFQlVHIC8ga2xhaWR1IHp1cm5hbGFzICovCiAkb1snZGVidWcnXT1hcnJheSgnV1BfREVCVUcnPT5kZWZpbmVkKCdXUF9ERUJVRycpPyhXUF9ERUJVRz8xOjApOm51bGwsCiAgICdXUF9ERUJVR19MT0cnPT5kZWZpbmVkKCdXUF9ERUJVR19MT0cnKT8oV1BfREVCVUdfTE9HPzE6MCk6bnVsbCk7CiAkZGw9V1BfQ09OVEVOVF9ESVIuJy9kZWJ1Zy5sb2cnOwogJG9bJ2RlYnVnJ11bJ2RlYnVnX2xvZyddPWZpbGVfZXhpc3RzKCRkbCk/YXJyYXkoJ2R5ZGlzJz0+ZmlsZXNpemUoJGRsKSwna2Vpc3Rhcyc9PmRhdGUoJ1ktbS1kIEg6aScsZmlsZW10aW1lKCRkbCkpKTpudWxsOwoKIC8qIDYuIFdPT0NPTU1FUkNFIHp1cm5hbGFpICovCiAkd2w9V1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3djLWxvZ3MnOwogJG9bJ3djX2xvZ3MnXT1hcnJheSgpOwogaWYoaXNfZGlyKCR3bCkpewogICAkZmY9Z2xvYigkd2wuJy8qLmxvZycpOyByc29ydCgkZmYpOwogICBmb3JlYWNoKGFycmF5X3NsaWNlKCRmZiwwLDgpIGFzICR4KQogICAgICRvWyd3Y19sb2dzJ11bXT1hcnJheSgnZic9PmJhc2VuYW1lKCR4KSwna2InPT5yb3VuZChmaWxlc2l6ZSgkeCkvMTAyNCwxKSwna2Vpc3Rhcyc9PmRhdGUoJ1ktbS1kIEg6aScsZmlsZW10aW1lKCR4KSkpOwogICAkb1snd2NfbG9nc192aXNvJ109Y291bnQoJGZmKTsKIH0KCiAvKiA3LiA3IERJRU5VIFNFUklKQSAqLwogJG9bJ3NlcmlqYSddPWFycmF5KCdwcmFkemlhJz0+JzIwMjYtMDgtMTcnLCdkaWVudV9udW8nPT5yb3VuZCgodGltZSgpLXN0cnRvdGltZSgnMjAyNi0wOC0xNycpKS84NjQwMCwxKSk7CgogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H070'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H070 monitoringo patikra',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h070=H070'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,500); }
  /* isorinis uptime testas */
  out.atsakas=[];
  for(let i=0;i<3;i++){
    const t0=Date.now();
    try{ const x=await fetch('https://dev.avesa.lt/'); out.atsakas.push({st:x.status,ms:Date.now()-t0}); }
    catch(e){ out.atsakas.push({kl:1}); }
    await new Promise(s=>setTimeout(s,1500));
  }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h070.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h070 monitoringo patikra');
