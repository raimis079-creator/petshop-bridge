process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEF0cmlidXR1IE1vZHVsaW8gRGllZ2ltYXMgdjEuMCAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogJHI9JF9HRVRbJ3BzX2RhJ10gPz8gJyc7IGlmKCRyIT09J0RSWScgJiYgJHIhPT0nQVBQTFknKSByZXR1cm47CiAkbz1bJ3YnPT4nREExJywncmV6aW1hcyc9PiRyXTsKICRrZWxpYXM9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1hdHJpYnV0YWkucGhwJzsKICRsYXVraWFtYXM9JzZiM2FhNWJjMzJlMDUyYWQzZDM1NjlkY2FhNDRkYTkyJzsKICRvWydqYXVfeXJhJ109ZmlsZV9leGlzdHMoJGtlbGlhcyk7CiAkcmVzcD13cF9yZW1vdGVfZ2V0KCdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vcmFpbWlzMDc5LWNyZWF0b3IvcGV0c2hvcC1icmlkZ2UvbWFpbi9kZXBsb3kvcGV0c2hvcC1hdHJpYnV0YWkucGhwJyxbJ3RpbWVvdXQnPT42MF0pOwogaWYoaXNfd3BfZXJyb3IoJHJlc3ApKXsgJG9bJ2tsYWlkYSddPSRyZXNwLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogJGs9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHJlc3ApOwogJG9bJ21kNSddPW1kNSgkayk7ICRvWydzdXRhbXBhJ109KCRvWydtZDUnXT09PSRsYXVraWFtYXMpOyAkb1snYmFpdHUnXT1zdHJsZW4oJGspOwogaWYoISRvWydzdXRhbXBhJ10peyAkb1sna2xhaWRhJ109J21kNSBuZXN1dGFtcGEnOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogdHJ5eyB0b2tlbl9nZXRfYWxsKCRrLFRPS0VOX1BBUlNFKTsgJG9bJ3NpbnRha3NlJ109J29rJzsgfQogY2F0Y2goXFBhcnNlRXJyb3IgJGUpeyAkb1snc2ludGFrc2UnXT0nS0xBSURBOiAnLiRlLT5nZXRNZXNzYWdlKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiBpZigkcj09PSdEUlknKXsgJG9bJ3ZlaWtzbWFzJ109J0JVVFUgSVJBU1lUQSc7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7IH0KIGlmKGZpbGVfZXhpc3RzKCRrZWxpYXMpKXsgJHVwPXdwX3VwbG9hZF9kaXIoKTsgJGI9JHVwWydiYXNlZGlyJ10uJy9wcy1iYWNrdXBzJzsgaWYoIWlzX2RpcigkYikpIHdwX21rZGlyX3AoJGIpOwogICBjb3B5KCRrZWxpYXMsJGIuJy9wZXRzaG9wLWF0cmlidXRhaS4nLmdtZGF0ZSgnWW1kLUhpcycpLicucGhwJyk7IH0KIGZpbGVfcHV0X2NvbnRlbnRzKCRrZWxpYXMsJGspOyBjbGVhcnN0YXRjYWNoZSh0cnVlLCRrZWxpYXMpOwogJG9bJ2lyYXN5dGFfbWQ1J109bWQ1X2ZpbGUoJGtlbGlhcyk7ICRvWydwYXZ5a28nXT0oJG9bJ2lyYXN5dGFfbWQ1J109PT0kbGF1a2lhbWFzKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LDk5KTsK'; const VER='DIEGATR-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Atributu Modulio Diegimas v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_da=DRY',{headers:UA},'dry'); const dt=await d.text();
  let DJ=null; try{ DJ=JSON.parse(dt); }catch(e){ out.dry_zalias=dt.slice(0,700); }
  out.dry=DJ;
  if(DJ && DJ.veiksmas==='BUTU IRASYTA'){ await miegok(2500);
    const a=await fx(WP+'/?ps_da=APPLY',{headers:UA},'apply'); const at=await a.text();
    try{ out.apply=JSON.parse(at); }catch(e){ out.apply_zalias=at.slice(0,700); } }
  await miegok(4000);
  const h=await fx(WP+'/wp-admin/admin.php?page=ps-atributai',{headers:UA},'lang');
  out.langas={http:h.status, fatal:/Fatal error|Parse error/.test(await h.text())};
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/diegatr_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
