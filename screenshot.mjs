process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFNBQiBSZWNvbiB2MS4wIChzY2hlbW9zK3NhYmxvbmFpKSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2JpcyddKT8kX0dFVFsncHNfYmlzJ106JycpIT09J1pWNCcpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1NBQi1SRUNPTi12MS4wJyk7CiAgdHJ5ewogICAgJHNkPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvc2NoZW1hcy9ldmVudHMnOwogICAgZm9yZWFjaChnbG9iKCRzZC4nLyonKSBhcyAkZil7ICRvWydzY2hlbW9zJ11bYmFzZW5hbWUoJGYpXT1maWxlc2l6ZSgkZik8NDAwMD9maWxlX2dldF9jb250ZW50cygkZik6J0RJREVMSVMgJy5maWxlc2l6ZSgkZik7IH0KICAgIGZvcmVhY2goYXJyYXkoJ3BwMmQnPT4ndGVtcGxhdGVzL2VtYWlscy9wb3N0LXB1cmNoYXNlLTJkLnBocCcsJ2ZvdW5kaW5nJz0+J3RlbXBsYXRlcy9lbWFpbHMvZm91bmRpbmcucGhwJykgYXMgJGs9PiRyZWwpewogICAgICAkZj1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlLycuJHJlbDsKICAgICAgJG9bJGtdPWZpbGVfZXhpc3RzKCRmKT9iYXNlNjRfZW5jb2RlKGZpbGVfZ2V0X2NvbnRlbnRzKCRmKSk6J05FUkEnOwogICAgfQogICAgLyogcmVtaW5kZXJzIHBheWxvYWQgYnVpbGRlciBmcmFnbWVudGFzICovCiAgICAkcmY9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcy9jbGFzcy1yZW1pbmRlcnMucGhwJzsKICAgICRvWydyZW1pbmRlcnNfYjY0J109ZmlsZV9leGlzdHMoJHJmKT9iYXNlNjRfZW5jb2RlKGZpbGVfZ2V0X2NvbnRlbnRzKCRyZikpOidORVJBJzsKICAgICRzZj1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2luY2x1ZGVzL2NsYXNzLXNoaXBtZW50cy5waHAnOwogICAgJG9bJ3NoaXBtZW50c19keWRpcyddPWZpbGVfZXhpc3RzKCRzZik/ZmlsZXNpemUoJHNmKTonTkVSQSc7CiAgICAkb1snc2hpcG1lbnRzX3JldHVybmVkX2ZyYWdtZW50YWknXT1hcnJheSgpOwogICAgaWYoZmlsZV9leGlzdHMoJHNmKSl7IGZvcmVhY2goZXhwbG9kZSgiXG4iLGZpbGVfZ2V0X2NvbnRlbnRzKCRzZikpIGFzICRuPT4kbCl7IGlmKHN0cmlwb3MoJGwsJ3JldHVybicpIT09ZmFsc2UmJnN0cmlwb3MoJGwsJ3NoaXBtZW50X3JldHVybmVkJykhPT1mYWxzZSkgJG9bJ3NoaXBtZW50c19yZXR1cm5lZF9mcmFnbWVudGFpJ11bXT0oJG4rMSkuJzogJy50cmltKCRsKTsgfSB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK'; const VER='SAB-RECON-v1.0'; const out={v:VER};
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
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS BIS SAB Recon v1.0 (back-in-stock zvalgyba)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  const d=await fx(WP+'/?ps_bis=ZV4',{headers:UA},'chk');
  const dt=await d.text(); try{ out.rez=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,2000); }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/sab_recon.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
