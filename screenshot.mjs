process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEthdGFsb2dvIERpZWdpbWFzIHYyLjEgKGthaW5hIGlyIGxpa3V0aXMgcmVpa3NtZW1zKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogJHI9JF9HRVRbJ3BzX2RpZWcnXSA/PyAnJzsgaWYoJHIhPT0nRFJZJyAmJiAkciE9PSdBUFBMWScpIHJldHVybjsKICRvPVsndic9PidESUVHMScsJ3JlemltYXMnPT4kcl07CiAka2VsaWFzID0gV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJzsKICRsYXVraWFtYXNfbWQ1ID0gJzhjMjRkMWQ4MWFkYzBlYmVkZDgxNDhlYzEzNjdlN2NiJzsKICRzZW5hc19tZDUgICAgID0gJzAxNjJhMDgxZjliMGQzZDliZTliNjU4YWFhMzY1ZWY2JzsKCiAkb1snZXNhbWFzX21kNSddID0gZmlsZV9leGlzdHMoJGtlbGlhcykgPyBtZDVfZmlsZSgka2VsaWFzKSA6IG51bGw7CiAkb1snZXNhbWFzX2JhaXR1J10gPSBmaWxlX2V4aXN0cygka2VsaWFzKSA/IGZpbGVzaXplKCRrZWxpYXMpIDogbnVsbDsKIGlmKCRvWydlc2FtYXNfbWQ1J10gIT09ICRzZW5hc19tZDUpewogICAkb1sna2xhaWRhJ109J2ZhaWxhcyBkZXYgcGFzaWtlaXRlIG51byBwYXRpa3JvcyAtIFNUT0pVJzsKICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7CiB9CiAkdXJsPSdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vcmFpbWlzMDc5LWNyZWF0b3IvcGV0c2hvcC1icmlkZ2UvbWFpbi9kZXBsb3kva2F0YWxvZ2FzX25hdWphcy5waHA/dj0nLiRsYXVraWFtYXNfbWQ1LictJy50aW1lKCk7CiAkcmVzcD13cF9yZW1vdGVfZ2V0KCR1cmwsWyd0aW1lb3V0Jz0+OTAsJ2hlYWRlcnMnPT5bJ0NhY2hlLUNvbnRyb2wnPT4nbm8tY2FjaGUnLCdQcmFnbWEnPT4nbm8tY2FjaGUnXV0pOwogaWYoaXNfd3BfZXJyb3IoJHJlc3ApKXsgJG9bJ2tsYWlkYSddPSdwYXJzaXVudGltYXM6ICcuJHJlc3AtPmdldF9lcnJvcl9tZXNzYWdlKCk7CiAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAka29kYXM9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHJlc3ApOwogJG9bJ3BhcnNpdXN0YV9iYWl0dSddPXN0cmxlbigka29kYXMpOwogJG9bJ3BhcnNpdXN0YV9tZDUnXT1tZDUoJGtvZGFzKTsKICRvWydtZDVfc3V0YW1wYV9zdV9sYXVraWFtdSddPSgkb1sncGFyc2l1c3RhX21kNSddPT09JGxhdWtpYW1hc19tZDUpOwogaWYoISRvWydtZDVfc3V0YW1wYV9zdV9sYXVraWFtdSddKXsgJG9bJ2tsYWlkYSddPSdwYXJzaXVzdG8gZmFpbG8gbWQ1IG5lc3V0YW1wYSAtIFNUT0pVJzsKICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KCiAvLyBzaW50YWtzZXMgcGF0aWtyYQogdHJ5IHsgJHQ9dG9rZW5fZ2V0X2FsbCgka29kYXMsIFRPS0VOX1BBUlNFKTsgJG9bJ3Rva2VudSddPWNvdW50KCR0KTsgJG9bJ3NpbnRha3NlJ109J29rJzsgfQogY2F0Y2ggKFxQYXJzZUVycm9yICRlKXsgJG9bJ3NpbnRha3NlJ109J0tMQUlEQTogJy4kZS0+Z2V0TWVzc2FnZSgpOwogICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQoKIGlmKCRyPT09J0RSWScpeyAkb1sndmVpa3NtYXMnXT0nQlVUVSBJUkFTWVRBJzsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsKICAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsgfQoKICR1cD13cF91cGxvYWRfZGlyKCk7ICRiZGlyPSR1cFsnYmFzZWRpciddLicvcHMtYmFja3Vwcyc7CiBpZighaXNfZGlyKCRiZGlyKSkgd3BfbWtkaXJfcCgkYmRpcik7CiAkYmtwPSRiZGlyLicvcGV0c2hvcC1rYXRhbG9nYXMuJy5nbWRhdGUoJ1ltZC1IaXMnKS4nLnBocCc7CiAkb1sna29waWphJ109IGNvcHkoJGtlbGlhcywkYmtwKSA/ICRia3AgOiAnTkVQQVZZS08nOwogaWYoJG9bJ2tvcGlqYSddPT09J05FUEFWWUtPJyl7ICRvWydrbGFpZGEnXT0na29waWphIG5lcGF2eWtvIC0gU1RPSlUnOwogICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQoKICRuPWZpbGVfcHV0X2NvbnRlbnRzKCRrZWxpYXMsJGtvZGFzKTsKIGNsZWFyc3RhdGNhY2hlKHRydWUsJGtlbGlhcyk7CiAkb1snaXJhc3l0YV9iYWl0dSddPSRuOwogJG9bJ3BvX2lyYXN5bW9fbWQ1J109bWQ1X2ZpbGUoJGtlbGlhcyk7CiAkb1sncGF2eWtvJ109KCRvWydwb19pcmFzeW1vX21kNSddPT09JGxhdWtpYW1hc19tZDUpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sOTkpOwo='; const VER='DIEG-v2.1'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Katalogo Diegimas v2.1',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_dieg=DRY',{headers:UA},'dry');
  let DJ=null; try{ DJ=JSON.parse(await d.text()); }catch(e){}
  out.dry={sintakse:DJ&&DJ.sintakse,md5:DJ&&DJ.md5_sutampa_su_laukiamu,tokenu:DJ&&DJ.tokenu,klaida:DJ&&DJ.klaida};
  if(DJ && DJ.veiksmas==='BUTU IRASYTA'){ await miegok(2500);
    const a=await fx(WP+'/?ps_dieg=APPLY',{headers:UA},'apply');
    try{ const AJ=JSON.parse(await a.text()); out.apply={pavyko:AJ.pavyko,kopija:AJ.kopija}; }catch(e){} }
  await miegok(3000);
  const h=await fx(WP+'/wp-admin/admin.php?page=ps-katalogas',{headers:UA},'lang');
  out.langas={http:h.status, fatal:/Fatal error|Parse error/.test(await h.text())};
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/dieg14_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
