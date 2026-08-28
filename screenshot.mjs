process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFBvc3RzIEZvdW5kIFp2YWxneWJhIHYxLjAgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCAoJF9HRVRbJ3BzX3BmJ10gPz8gJycpICE9PSAnUEYxJyApIHJldHVybjsKICRvPVsndic9PidQRjEnXTsKICRkaXJzPVtnZXRfdGVtcGxhdGVfZGlyZWN0b3J5KCksZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCldOwogJG9bJ3RlbWEnXT1bJ3RldmluZSc9PmdldF90ZW1wbGF0ZSgpLCd2YWlrYXMnPT5nZXRfc3R5bGVzaGVldCgpXTsKICRyYXN0YT1bXTsKIGZvcmVhY2goJGRpcnMgYXMgJGQpewogICBpZighaXNfZGlyKCRkKSkgY29udGludWU7CiAgICRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGQsRmlsZXN5c3RlbUl0ZXJhdG9yOjpTS0lQX0RPVFMpKTsKICAgZm9yZWFjaCgkaXQgYXMgJGYpewogICAgIGlmKCEkZi0+aXNGaWxlKCkgfHwgJGYtPmdldEV4dGVuc2lvbigpIT09J3BocCcpIGNvbnRpbnVlOwogICAgICRjPUBmaWxlX2dldF9jb250ZW50cygkZi0+Z2V0UGF0aG5hbWUoKSk7CiAgICAgaWYoJGM9PT1mYWxzZSkgY29udGludWU7CiAgICAgaWYoc3RyaXBvcygkYywnUG9zdHMgZm91bmQnKSE9PWZhbHNlIHx8IHN0cmlwb3MoJGMsJ3Bvc3RzX2ZvdW5kJykhPT1mYWxzZSl7CiAgICAgICBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkYykgYXMgJGk9PiRsKXsKICAgICAgICAgaWYoc3RyaXBvcygkbCwnUG9zdHMgZm91bmQnKSE9PWZhbHNlKQogICAgICAgICAgICRyYXN0YVtdPVsnZmFpbGFzJz0+c3RyX3JlcGxhY2UoV1BfQ09OVEVOVF9ESVIsJycsJGYtPmdldFBhdGhuYW1lKCkpLCdlaWwnPT4kaSsxLCdrb2Rhcyc9PnRyaW0obWJfc3Vic3RyKCRsLDAsMTgwKSldOwogICAgICAgfQogICAgIH0KICAgfQogfQogJG9bJ3Jhc3RhJ109JHJhc3RhOwogLyogYXIgZWluYSBwZXIgZ2V0dGV4dCAqLwogJG9bJ2dldHRleHRfYmFuZHltYXMnXT1fXygnUG9zdHMgZm91bmQnLCdmbGF0c29tZScpOwogJG9bJ2dldHRleHRfYmVfZG9tZW5vJ109X18oJ1Bvc3RzIGZvdW5kJyk7CiAvKiBrb2tpZSB2ZXJ0aW11IGZhaWxhaSB5cmEgKi8KICRvWydrYWxiYSddPWdldF9sb2NhbGUoKTsKICRtbz1XUF9MQU5HX0RJUi4nL3RoZW1lcy8nOwogJG9bJ3RlbW9zX21vJ109aXNfZGlyKCRtbyk/YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihzY2FuZGlyKCRtbyksZnVuY3Rpb24oJHgpe3JldHVybiBzdHJwb3MoJHgsJ2ZsYXRzb21lJykhPT1mYWxzZTt9KSk6J25lcmEga2F0YWxvZ28nOwogLyogYmxvZ28gaXJhc3UgZGF0b3MgLSBpcyBla3Jhbm8gbWF0b3NpIHZpc2kgMDEgU2F1ICovCiBnbG9iYWwgJHdwZGI7CiAkb1snYmxvZ29fZGF0b3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoCiAgICJTRUxFQ1QgREFURShwb3N0X2RhdGUpIGQsIENPVU5UKCopIG4gRlJPTSB7JHdwZGItPnBvc3RzfQogICAgIFdIRVJFIHBvc3RfdHlwZT0ncG9zdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogICAgIEdST1VQIEJZIERBVEUocG9zdF9kYXRlKSBPUkRFUiBCWSBuIERFU0MgTElNSVQgOCIsIEFSUkFZX0EpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sOTkpOwo='; const VER='PF-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Posts Found Zvalgyba v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_pf=PF1',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'pf');
  const dt=await d.text(); try{ out.r=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,900); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/postsfound_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
