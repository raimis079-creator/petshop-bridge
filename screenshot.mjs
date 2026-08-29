process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIENyb24gQWxpYXJtdSBSZWNvbiB2My4wIChzYXJnYXMrbmFzbGFpY2lhaSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2NyJ10pPyRfR0VUWydwc19jciddOicnKSAhPT0gJ1JFQ09OMycpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCd2Jz0+J0NST04tUjMnKTsgJHA9JHdwZGItPnByZWZpeDsKCiAgJGY9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1zYXJnYXMucGhwJzsKICBpZihmaWxlX2V4aXN0cygkZikpICRvWydzYXJnYXNfYjY0J109YmFzZTY0X2VuY29kZShmaWxlX2dldF9jb250ZW50cygkZikpOwoKICAkbGF1az1nZXRfb3B0aW9uKCdwc19zYXJnYXNfY3Jvbl9sYXVraWFtJyk7ICR6aW49Z2V0X29wdGlvbigncHNfc2FyZ2FzX2Nyb25femluaW9zJyk7CiAgJG9bJ3djZG5fbGF1a2lhbSddPWlzX2FycmF5KCRsYXVrKSYmaXNzZXQoJGxhdWtbJ3djZG5fdHNfdHJhY2tlcl9zZW5kX2V2ZW50J10pPyRsYXVrWyd3Y2RuX3RzX3RyYWNrZXJfc2VuZF9ldmVudCddOm51bGw7CiAgJG9bJ3djZG5femluaWEnXT1pc19hcnJheSgkemluKSYmaXNzZXQoJHppblsnd2Nkbl90c190cmFja2VyX3NlbmRfZXZlbnQnXSk/Z21kYXRlKCdZLW0tZCBIOmk6cycsJHppblsnd2Nkbl90c190cmFja2VyX3NlbmRfZXZlbnQnXSk6bnVsbDsKICAkb1snbGF1a2lhbV9zayddPWlzX2FycmF5KCRsYXVrKT9jb3VudCgkbGF1ayk6MDsgJG9bJ3ppbmlvc19zayddPWlzX2FycmF5KCR6aW4pP2NvdW50KCR6aW4pOjA7CiAgJHNhdj1hcnJheSgpOyBpZihpc19hcnJheSgkbGF1aykpIGZvcmVhY2goJGxhdWsgYXMgJGg9PiRzKXsgaWYoc3RycG9zKCRzLCd3ZWVrJykhPT1mYWxzZXx8c3RycG9zKCRzLCdtb250aCcpIT09ZmFsc2V8fHN0cnBvcygkcywnZGFpbHknKSE9PWZhbHNlKSAkc2F2WyRoXT0kczsgfQogICRvWyduZV9kYXpuaV9ob29rYWknXT0kc2F2OwoKICAvLyBuYXNsYWljaWFpIGRldGFsaWFpCiAgJG9bJ25hc2xhaWNpYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzLmlkLHMub3JkZXJfaWQscy5jYXJyaWVyLHMuc291cmNlLHMuY3JlYXRlZF9hdCBGUk9NIHskcH1wc19zaGlwbWVudHMgcyBXSEVSRSBOT1QgRVhJU1RTIChTRUxFQ1QgMSBGUk9NIHskcH13Y19vcmRlcnMgbyBXSEVSRSBvLmlkPXMub3JkZXJfaWQpIE9SREVSIEJZIHMuaWQiLCBBUlJBWV9BKTsKICAkb1snc2hfdmlzbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1wc19zaGlwbWVudHMiKTsKICAkb1snb3JkZXJzX3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9d2Nfb3JkZXJzIik7CiAgJG9bJ29yZGVyc19pZF9yaWJvcyddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgTUlOKGlkKSBtbiwgTUFYKGlkKSBteCBGUk9NIHskcH13Y19vcmRlcnMiLCBBUlJBWV9BKTsKCiAgLy8gaW1wb3J0YWkgNSBpciA3CiAgJG9bJ2ltcDU3J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxwYXRoLGxhc3RfYWN0aXZpdHksdHJpZ2dlcmVkLHByb2Nlc3NpbmcsZXhlY3V0aW5nLGZhaWxlZCxzY2hlZHVsZWQsY3Jvbl9zY2hlZHVsZSBGUk9NIHskcH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQgSU4gKDIsMyw1LDcpIiwgQVJSQVlfQSk7CgogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgZWNobyBqc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSwgOTkpOwo='; const VER='CRONREC-v3.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Cron Aliarmu Recon v3.0 (sargas)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; out.snip_id=sid;
  await miegok(9000);
  const d=await fx(WP+'/?ps_cr=RECON3',{headers:UA},'recon2');
  const txt=await d.text(); out.http=d.status;
  try{ out.rez=JSON.parse(txt); }catch(e){ out.zalias=txt.slice(0,3000); }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/cron_recon3.json', Buffer.from(JSON.stringify(out)), VER);
console.log('ok');
