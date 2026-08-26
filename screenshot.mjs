process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEJhY2t1cCBEaWZmIHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoIWlzc2V0KCRfR0VUWydwc19ia2QnXSkgfHwgJF9HRVRbJ3BzX2JrZCddIT09J0JLMjAyNjA4MjZEJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOwogJFQ9YXJyYXkoJ3YnPT4nQktEMScsJ3RzJz0+Z21kYXRlKCdjJykpOwogJEJBSz1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMtYmFja3Vwcyc7CiAkVFsnYmFja3VwYWknXT1hcnJheSgpOwogZm9yZWFjaCgoYXJyYXkpZ2xvYigkQkFLLicvcGV0c2hvcC1mYWt0LXNpdW50b3MucGhwLmJhayonKSBhcyAkZil7CiAgICRUWydiYWNrdXBhaSddW2Jhc2VuYW1lKCRmKV09YXJyYXkoKGludClmaWxlc2l6ZSgkZiksbWQ1X2ZpbGUoJGYpLGdtZGF0ZSgnWS1tLWQgSDppOnMnLGZpbGVtdGltZSgkZikpKTsKIH0KICR0PSRCQUsuJy9wZXRzaG9wLWZha3Qtc2l1bnRvcy5waHAuYmFrX2xwXzIwMjYwODI2XzEwMTI1OCc7CiBpZihmaWxlX2V4aXN0cygkdCkpeyAkcz1maWxlX2dldF9jb250ZW50cygkdCk7ICRUWydhOTBfYjY0J109YmFzZTY0X2VuY29kZSgkcyk7ICRUWydhOTBfbWQ1J109bWQ1KCRzKTsgfQogLyoga2FzIGRhciBrZWl0ZXNpOiB2aXN1IG11IGZhaWx1IG1kNSArIG10aW1lICovCiAkTVU9V1BNVV9QTFVHSU5fRElSOwogZm9yZWFjaChhcnJheSgncGV0c2hvcC1mYWt0LXNpdW50b3MucGhwJywncGV0c2hvcC1mYWt0LWdyYXppbmltYWkucGhwJywncGV0c2hvcC1hdGFza2FpdHUtYWdyZWdhdmltYXMucGhwJywncGV0c2hvcC1zaXVudHUtbGFpc2thaS5waHAnLCdwZXRzaG9wLWZha3RhaS5waHAnLCdwZXRzaG9wLWthbmFsYWkucGhwJykgYXMgJGYpewogICAkcD0kTVUuJy8nLiRmOwogICAkVFsnbXUnXVskZl09ZmlsZV9leGlzdHMoJHApP2FycmF5KChpbnQpZmlsZXNpemUoJHApLG1kNV9maWxlKCRwKSxnbWRhdGUoJ1ktbS1kIEg6aTpzJyxmaWxlbXRpbWUoJHApKSk6J05FUkEnOwogfQogLyogc25pcHBldGFpIOKAlCBhciBrYXMgbm9ycyBraXRhcyBkaXJibyAqLwogJFRbJ3NuaXBwZXRhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlLG1vZGlmaWVkIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxNSIsQVJSQVlfQSk7CiAkVFsnc2l1bnR1X2VpbCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX2Zha3Rfc2l1bnRvcyIpOwogJFRbJ3RhcmlmdV9laWwnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH1wc190YXJpZmFpIik7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRULEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0sNSk7Cg==';
const KEY='BK20260826D'; const VER='BKD1';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Backup Diff v1',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  sid=JSON.parse(await c.text()).id; out.sukurta=sid; await miegok(9000);
  const d=await fx(WP+'/?ps_bkd='+KEY,{},'run'); const txt=await d.text();
  out.http=d.status; out.ilgis=txt.length;
  try{ const r=JSON.parse(txt); out.ok=(r.v===VER); await put('deploy/bk_diff.json', Buffer.from(JSON.stringify(r,null,1)), VER); out.irasyta=1; }
  catch(e){ out.ne_json=txt.slice(0,900); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/bk_diffrun.json', Buffer.from(JSON.stringify(out,null,1)), VER);
