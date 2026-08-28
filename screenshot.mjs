process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFBhc3RvbWF0byBVenJhc3UgUGFpZXNrYSB2MS4wICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiBpZiggKCRfR0VUWydwc19pdSddID8/ICcnKSAhPT0gJ0lVMScgKSByZXR1cm47CiAkbz1bJ3YnPT4nSVUxJywncmFzdGEnPT5bXV07CiAkem9kemlhaT1bJ25ldGVscGEnLCdwZXIgZGlkZWwnLCduZW1va2FtbyBwcmlzdGF0eW1vJywnbmVtb2thbWFzIHByaXN0YXR5bWFzJywnaWtpIG5lbW9rYW1vJywKICAgICAgICAgICAndGlrIGt1cmplcml1JywndGlrIGt1cmplcmlzJywncGFzdG9tYXQnLCdwYcWhdG9tYXQnXTsKICRkaXJzPVtXUE1VX1BMVUdJTl9ESVIsIGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpXTsKIGZvcmVhY2goJGRpcnMgYXMgJGQpewogICBpZighaXNfZGlyKCRkKSkgY29udGludWU7CiAgICRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGQsRmlsZXN5c3RlbUl0ZXJhdG9yOjpTS0lQX0RPVFMpKTsKICAgZm9yZWFjaCgkaXQgYXMgJGYpewogICAgIGlmKCEkZi0+aXNGaWxlKCl8fCRmLT5nZXRFeHRlbnNpb24oKSE9PSdwaHAnKSBjb250aW51ZTsKICAgICAkYz1AZmlsZV9nZXRfY29udGVudHMoJGYtPmdldFBhdGhuYW1lKCkpOyBpZigkYz09PWZhbHNlKSBjb250aW51ZTsKICAgICBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkYykgYXMgJGk9PiRsKXsKICAgICAgIGZvcmVhY2goJHpvZHppYWkgYXMgJHopewogICAgICAgICBpZihtYl9zdHJpcG9zKCRsLCR6KSE9PWZhbHNlKXsKICAgICAgICAgICAkb1sncmFzdGEnXVtdPVsnZic9PnN0cl9yZXBsYWNlKFdQX0NPTlRFTlRfRElSLCcnLCRmLT5nZXRQYXRobmFtZSgpKSwnZWlsJz0+JGkrMSwKICAgICAgICAgICAgICd6b2Rpcyc9PiR6LCdrJz0+dHJpbShtYl9zdWJzdHIoJGwsMCwxNDApKV07CiAgICAgICAgICAgYnJlYWs7CiAgICAgICAgIH0KICAgICAgIH0KICAgICB9CiAgIH0KIH0KIC8qIHNuaXBwZXR1b3NlICovCiBnbG9iYWwgJHdwZGI7CiAkb1snc25pcHBldGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cwogICBXSEVSRSBjb2RlIExJS0UgJyVuZW1va2FtbyBwcmlzdGF0eW1vJScgT1IgY29kZSBMSUtFICclbmV0ZWxwYSUnIE9SIGNvZGUgTElLRSAnJWlraSBuZW1va2FtbyUnCiAgICAgIE9SIG5hbWUgTElLRSAnJWFzdG9tYXQlJyBPUiBuYW1lIExJS0UgJyVlbW9rYW0lJyIsIEFSUkFZX0EpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sOTkpOwo='; const VER='IU-v1.0'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Pastomato Uzrasu Paieska v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_iu=IU1',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'iu');
  const dt=await d.text(); try{ out.r=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,900); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/iu_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
