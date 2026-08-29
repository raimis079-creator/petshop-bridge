process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFdDIE1vYmlsZSBQcm9tbyBSZWNvbiB2MS4wICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfYmlzJ10pPyRfR0VUWydwc19iaXMnXTonJykhPT0nWlY4JykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nV0NNT0ItUkVDT04tdjEuMCcpOwogIHRyeXsKICAgICR3Yz1XUF9QTFVHSU5fRElSLicvd29vY29tbWVyY2UvJzsKICAgIC8qIHJhbmR1IG1vYmlsZS1tZXNzYWdpbmcgZmFpbHVzIGlyIGt2aWV0aW1vIHZpZXRhICovCiAgICAkcmFzdGE9YXJyYXkoKTsKICAgIGZvcmVhY2goYXJyYXkoJ3RlbXBsYXRlcy9lbWFpbHMvZW1haWwtbW9iaWxlLW1lc3NhZ2luZy5waHAnLCdpbmNsdWRlcy9lbWFpbHMvY2xhc3Mtd2MtZW1haWwucGhwJywndGVtcGxhdGVzL2VtYWlscy9lbWFpbC1mb290ZXIucGhwJykgYXMgJHJlbCl7CiAgICAgICRmPSR3Yy4kcmVsOwogICAgICBpZighZmlsZV9leGlzdHMoJGYpKSB7ICRyYXN0YVskcmVsXT0nTkVSQSc7IGNvbnRpbnVlOyB9CiAgICAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICAgICAgJGZyYWc9YXJyYXkoKTsKICAgICAgZm9yZWFjaChleHBsb2RlKCJcbiIsJGMpIGFzICRuPT4kbCl7CiAgICAgICAgaWYoc3RyaXBvcygkbCwnbW9iaWxlJykhPT1mYWxzZSB8fCBzdHJpcG9zKCRsLCdkZWVwbGluaycpIT09ZmFsc2UpICRmcmFnW109KCRuKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGwsMCwxNTApKTsKICAgICAgfQogICAgICAkcmFzdGFbJHJlbF09YXJyYXlfc2xpY2UoJGZyYWcsMCwxMik7CiAgICB9CiAgICAkb1snZmFpbGFpJ109JHJhc3RhOwogICAgLyogZ3JlcCB2aXNhbWUgV0MgaW5jbHVkZXMgZGVsIGZpbHRybyBwYXZhZGluaW1vICovCiAgICAkaGl0cz1hcnJheSgpOwogICAgZm9yZWFjaChnbG9iKCR3Yy4naW5jbHVkZXMvZW1haWxzLyoucGhwJykgYXMgJGYpewogICAgICAkYz1maWxlX2dldF9jb250ZW50cygkZik7CiAgICAgIGlmKHN0cmlwb3MoJGMsJ21vYmlsZV9tZXNzYWdpbmcnKSE9PWZhbHNlKXsKICAgICAgICBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkYykgYXMgJG49PiRsKXsKICAgICAgICAgIGlmKHN0cmlwb3MoJGwsJ21vYmlsZV9tZXNzYWdpbmcnKSE9PWZhbHNlIHx8IHN0cmlwb3MoJGwsJ2FwcGx5X2ZpbHRlcnMnKSE9PWZhbHNlICYmIHN0cmlwb3MoJGwsJ21vYmlsZScpIT09ZmFsc2UpCiAgICAgICAgICAgICRoaXRzW2Jhc2VuYW1lKCRmKV1bXT0oJG4rMSkuJzogJy50cmltKG1iX3N1YnN0cigkbCwwLDE2MCkpOwogICAgICAgIH0KICAgICAgfQogICAgfQogICAgJG9bJ2luY2x1ZGVzJ109JGhpdHM7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK'; const VER='WCMOB-RECON-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS BIS WC Mobile Recon v1.0 (back-in-stock zvalgyba)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  const d=await fx(WP+'/?ps_bis=ZV8',{headers:UA},'chk');
  const dt=await d.text(); try{ out.rez=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,2000); }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/wcmob.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
