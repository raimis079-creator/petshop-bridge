process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEthcyBTa2FpdG8gVGlrIEt1cmplcml1IHYxLjAgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCAoJF9HRVRbJ3BzX2t3J10gPz8gJycpICE9PSAnS1cxJyApIHJldHVybjsKICRvPVsndic9PidLVzEnLCdyYXN0YSc9PltdXTsKICRkaXJzPVtXUE1VX1BMVUdJTl9ESVIsIFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWZidCcsIGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLCBnZXRfdGVtcGxhdGVfZGlyZWN0b3J5KCldOwogZm9yZWFjaCgkZGlycyBhcyAkZCl7CiAgIGlmKCFpc19kaXIoJGQpKSBjb250aW51ZTsKICAgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZCxGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICBmb3JlYWNoKCRpdCBhcyAkZil7CiAgICAgaWYoISRmLT5pc0ZpbGUoKXx8JGYtPmdldEV4dGVuc2lvbigpIT09J3BocCcpIGNvbnRpbnVlOwogICAgICRjPUBmaWxlX2dldF9jb250ZW50cygkZi0+Z2V0UGF0aG5hbWUoKSk7IGlmKCRjPT09ZmFsc2UpIGNvbnRpbnVlOwogICAgIGlmKHN0cnBvcygkYywnX3BzX3Rpa19rdXJqZXJpdScpPT09ZmFsc2UgJiYgc3RycG9zKCRjLCdjb3VyaWVyX29ubHknKT09PWZhbHNlKSBjb250aW51ZTsKICAgICBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkYykgYXMgJGk9PiRsKXsKICAgICAgIGlmKHN0cnBvcygkbCwnX3BzX3Rpa19rdXJqZXJpdScpIT09ZmFsc2UgfHwgc3RycG9zKCRsLCdjb3VyaWVyX29ubHknKSE9PWZhbHNlKQogICAgICAgICAkb1sncmFzdGEnXVtdPVsnZic9PnN0cl9yZXBsYWNlKFtXUF9DT05URU5UX0RJUl0sJycsJGYtPmdldFBhdGhuYW1lKCkpLCdlaWwnPT4kaSsxLCdrJz0+dHJpbShtYl9zdWJzdHIoJGwsMCwxNTApKV07CiAgICAgfQogICB9CiB9CiAvKiBzbmlwcGV0dW9zZSAqLwogZ2xvYmFsICR3cGRiOwogJHNuPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMKICAgV0hFUkUgY29kZSBMSUtFICclX3BzX3Rpa19rdXJqZXJpdSUnIE9SIGNvZGUgTElLRSAnJWNvdXJpZXJfb25seSUnCiAgICAgIE9SIGNvZGUgTElLRSAnJXdvb2NvbW1lcmNlX3BhY2thZ2VfcmF0ZXMlJyIsIEFSUkFZX0EpOwogJG9bJ3NuaXBwZXRhaSddPSRzbjsKIC8qIGFyIGthYmluYXNpIGthcyBub3JzIGFudCB0YXJpZnUgZmlsdHJvICovCiBnbG9iYWwgJHdwX2ZpbHRlcjsKICRvWydwYWNrYWdlX3JhdGVzX2thYmxpdWthaSddPVtdOwogaWYoaXNzZXQoJHdwX2ZpbHRlclsnd29vY29tbWVyY2VfcGFja2FnZV9yYXRlcyddKSl7CiAgIGZvcmVhY2goJHdwX2ZpbHRlclsnd29vY29tbWVyY2VfcGFja2FnZV9yYXRlcyddLT5jYWxsYmFja3MgYXMgJHByPT4kY2JzKXsKICAgICBmb3JlYWNoKCRjYnMgYXMgJGlkPT4kY2IpewogICAgICAgJG49aXNfc3RyaW5nKCRjYlsnZnVuY3Rpb24nXSk/JGNiWydmdW5jdGlvbiddOihpc19hcnJheSgkY2JbJ2Z1bmN0aW9uJ10pCiAgICAgICAgICA/IChpc19vYmplY3QoJGNiWydmdW5jdGlvbiddWzBdKT9nZXRfY2xhc3MoJGNiWydmdW5jdGlvbiddWzBdKTokY2JbJ2Z1bmN0aW9uJ11bMF0pLic6OicuJGNiWydmdW5jdGlvbiddWzFdCiAgICAgICAgICA6ICdjbG9zdXJlJyk7CiAgICAgICAkb1sncGFja2FnZV9yYXRlc19rYWJsaXVrYWknXVtdPVsncHJpb3JpdGV0YXMnPT4kcHIsJ2YnPT4kbl07CiAgICAgfQogICB9CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSw5OSk7Cg=='; const VER='KW-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Kas Skaito Tik Kurjeriu v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_kw=KW1',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'kw');
  const dt=await d.text(); try{ out.r=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,900); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/kw_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
