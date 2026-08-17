process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3N2J10pPyRfR0VUWydwc19zdiddOicnKSE9PSdERVA4NjVCJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0RFUDg2NUInLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aTpzJykpOwogJHVybD0naHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlL21haW4vZGVwbG95L3BldHNob3Ata2F0YWxvZ2FzLnBocCc7CiAkcj13cF9yZW1vdGVfZ2V0KCR1cmwsIGFycmF5KCd0aW1lb3V0Jz0+NjApKTsKIGlmIChpc193cF9lcnJvcigkcikpIHsgJG9bJ1NUT1AnXT0nZmV0Y2g6ICcuJHItPmdldF9lcnJvcl9tZXNzYWdlKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAkTj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcik7CiAkb1snZ2F1dGEnXT1zdHJsZW4oJE4pOyAkb1snZ2F1dGFfbWQ1J109bWQ1KCROKTsKIGlmICgkb1snZ2F1dGFfbWQ1J10hPT0nZGJmNGE2YTU5MzlkZDc5NTE0NDY2N2MwNjM1MmE4YzEnKSB7ICRvWydTVE9QJ109J01ENSBuZXN1dGFtcGEnOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogdHJ5IHsgQHRva2VuX2dldF9hbGwoJE4sIFRPS0VOX1BBUlNFKTsgfSBjYXRjaCAoXFBhcnNlRXJyb3IgJGUpIHsgJG9bJ1NUT1AnXT0nU0lOVEFLU0U6ICcuJGUtPmdldE1lc3NhZ2UoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICRmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCc7ICRzZW5hPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICRvWydzZW5hX21kNSddPW1kNSgkc2VuYSk7CiBpZiAoJG9bJ3NlbmFfbWQ1J10hPT0nNmMyOTdjNzQzNWYzZmEyZmNlOTQyZjczYjc5NWZjMjQnKSB7ICRvWydTVE9QJ109J1NFTkFTIGZhaWxhcyBuZSB0YXMnOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogQHdwX21rZGlyX3AoV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMnKTsKIEBmaWxlX3B1dF9jb250ZW50cyhXUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMtYmFja3Vwcy9wZXRzaG9wLWthdGFsb2dhcy5waHAudjg2NGEuJy5nbWRhdGUoJ1ltZC1IaXMnKS4nLmJhaycsICRzZW5hKTsKIGZpbGVfcHV0X2NvbnRlbnRzKCRmLCAkTik7IGNsZWFyc3RhdGNhY2hlKHRydWUsJGYpOwogJG9bJ2lyYXN5dGEnXT0obWQ1X2ZpbGUoJGYpPT09bWQ1KCROKSk/J0lESUVHVEEnOidORVNVVEFNUEEnOwogZGVsZXRlX3RyYW5zaWVudCgncHNfa2F0X2R1b21lbnlzJyk7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'DEP865B'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s=await snip('TEMP DEP865B',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_sv=DEP865B')).text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('dep865b.json', Buffer.from(JSON.stringify(out)), 'dep865b');
console.log('ok');
