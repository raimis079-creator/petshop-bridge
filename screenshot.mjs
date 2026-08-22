process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDIzMiddKSB8fCAkX0dFVFsncHNfaDIzMiddIT09J1JVTicpIHJldHVybjsKIGFkZF9maWx0ZXIoJ3ByZV93cF9tYWlsJywnX19yZXR1cm5fZmFsc2UnKTsKIGdsb2JhbCAkd3BkYjsKICRUPWFycmF5KCd2Jz0+J0gyMzInKTsKIC8qIHRyaW5hbSBUSUsgSDIyOSB0ZXN0aW5pdXM6IDM1MDQyLTM1MDUzIHN1IHRlc3RpbmUgcGFzdGFiYSAqLwogJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00geyR3cGRiLT5wcmVmaXh9d2Nfb3JkZXJzIFdIRVJFIHR5cGU9J3Nob3Bfb3JkZXInIEFORCBpZCBCRVRXRUVOIDM1MDQyIEFORCAzNTA1MyIpOwogJGF0c2F1a3RhPTA7ICRpc3RyaW50YT0wOyAkcHJhbGVpc3RhPWFycmF5KCk7CiBmb3JlYWNoKCRpZHMgYXMgJGlkKXsKICAgJG89d2NfZ2V0X29yZGVyKCRpZCk7IGlmKCEkbykgY29udGludWU7CiAgIC8qIHNhdWdpa2xpczogdGlrIHRpZSwga3VyaWUgdGlrcmFpIG11c3Ug4oCUIGtsaWVudGFzIOKAnlRlc3RhcyAuLi4iICovCiAgIGlmKDAhPT1zdHJwb3MoKHN0cmluZykkby0+Z2V0X2JpbGxpbmdfZmlyc3RfbmFtZSgpLCdUZXN0YXMnKSl7ICRwcmFsZWlzdGFbXT0kaWQ7IGNvbnRpbnVlOyB9CiAgIGlmKCFpbl9hcnJheSgkby0+Z2V0X3N0YXR1cygpLCBhcnJheSgnY2FuY2VsbGVkJywncmVmdW5kZWQnLCdscC1jYW5jZWxsZWQnKSwgdHJ1ZSkpewogICAgICRvLT51cGRhdGVfc3RhdHVzKCdjYW5jZWxsZWQnLCcnKTsgJGF0c2F1a3RhKys7CiAgIH0KICAgJG89d2NfZ2V0X29yZGVyKCRpZCk7CiAgIGlmKCRvKXsgJG8tPmRlbGV0ZSh0cnVlKTsgJGlzdHJpbnRhKys7IH0KIH0KICRUWydhdHNhdWt0YSddPSRhdHNhdWt0YTsKICRUWydpc3RyaW50YSddPSRpc3RyaW50YTsKICRUWydwcmFsZWlzdGFfbmVfdGVzdGluaWFpJ109JHByYWxlaXN0YTsKICRUWydsaWtvX3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH13Y19vcmRlcnMgV0hFUkUgdHlwZT0nc2hvcF9vcmRlcicgQU5EIHN0YXR1czw+J3djLWNoZWNrb3V0LWRyYWZ0JyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDUpOwo=';
const out={v:'H232'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  const u='https://api.github.com/repos/'+REPO+'/contents/'+path;
  const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'QQ H232 valymas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_h232=RUN');
    try{ out.DIEGIMAS=JSON.parse(await d.text()); }catch(e){ out.DIEGIMAS='klaida'; }
    await miegok(2000);
    const d2=await fetch(WP+'/?ps_h232=TEST');
    const t2=await d2.text();
    try{ out.TESTAI=JSON.parse(t2); }catch(e){ out.TESTAI='ne-json: '+t2.slice(0,400); }
    const q=await fetch(WP+'/'); const h=await q.text();
    out.pradzia={s:q.status, fatal:/Fatal error|Parse error/i.test(h)?'TAIP':'ne'};
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h232.json', Buffer.from(JSON.stringify(out,null,1)), 'h232 testiniu valymas');
