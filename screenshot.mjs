process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGZ1bmN0aW9ucy5waHAgUGFyc2l1bnRpbWFzIHYxLjAgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCAoJF9HRVRbJ3BzX2dmJ10gPz8gJycpICE9PSAnR0YxJyApIHJldHVybjsKICRmPWdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvZnVuY3Rpb25zLnBocCc7CiAkYz1maWxlX2dldF9jb250ZW50cygkZik7CiBnbG9iYWwgJHdwZGI7CiAkbz1bJ3YnPT4nR0YxJywna2VsaWFzJz0+JGYsJ2JhaXR1Jz0+c3RybGVuKCRjKSwnbWQ1Jz0+bWQ1KCRjKSwKICAgJ2I2NCc9PmJhc2U2NF9lbmNvZGUoJGMpLAogICAnc2VuYXNfbGF1a2FzJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgbWV0YV9rZXk9J19mdWxmaWxsbWVudF9jb3VyaWVyX29ubHknIEFORCBtZXRhX3ZhbHVlPSd5ZXMnIiksCiAgICduYXVqYXNfbGF1a2FzJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgbWV0YV9rZXk9J19wc190aWtfa3VyamVyaXUnIEFORCBtZXRhX3ZhbHVlPSd5ZXMnIiksCiAgICdhYnUnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBhCiAgICAgIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gYiBPTiBiLnBvc3RfaWQ9YS5wb3N0X2lkIEFORCBiLm1ldGFfa2V5PSdfcHNfdGlrX2t1cmplcml1JyBBTkQgYi5tZXRhX3ZhbHVlPSd5ZXMnCiAgICAgIFdIRVJFIGEubWV0YV9rZXk9J19mdWxmaWxsbWVudF9jb3VyaWVyX29ubHknIEFORCBhLm1ldGFfdmFsdWU9J3llcyciKV07CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw5OSk7Cg=='; const VER='GF-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS functions.php Parsiuntimas v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_gf=GF1',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'gf');
  const J=JSON.parse(await d.text());
  out.info={kelias:J.kelias,baitu:J.baitu,md5:J.md5,senas:J.senas_laukas,naujas:J.naujas_laukas,abu:J.abu};
  await put('deploy/functions_gyvas.php', Buffer.from(J.b64,'base64'), VER);
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/gf_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
