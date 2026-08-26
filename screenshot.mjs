process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIElzbGFpZG9zIERlcGxveSArIFRlc3RhaQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaXNsJ10pIHx8ICRfR0VUWydwc19pc2wnXSE9PSdJU0wyMDI2MDgyNicpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRUPWFycmF5KCd2Jz0+J0lTTDEnLCd0cyc9PmdtZGF0ZSgnYycpKTsKICRNVT1XUE1VX1BMVUdJTl9ESVI7ICRrPSRNVS4nL3BldHNob3AtaXNsYWlkb3MucGhwJzsKICRUWydidXZvJ109ZmlsZV9leGlzdHMoJGspP21kNV9maWxlKCRrKTpudWxsOwogJHI9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS9jb250ZW50cy9kZXBsb3kvcGV0c2hvcC1pc2xhaWRvcy5iNjQ/cmVmPTk3OTk4ODVhY2FmYjMzMmIyZjNiMDcwZGE0ZmNhZWM0NWFjOGVkZDknLAogICAgYXJyYXkoJ3RpbWVvdXQnPT4yNSwnaGVhZGVycyc9PmFycmF5KCdBY2NlcHQnPT4nYXBwbGljYXRpb24vdm5kLmdpdGh1Yi5yYXcnLCdVc2VyLUFnZW50Jz0+J3BldHNob3AtYnJpZGdlJykpKTsKICRvPWFycmF5KCk7CiBpZihpc193cF9lcnJvcigkcikpICRvWydrbGFpZGEnXT0kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsKIGVsc2VpZih3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcikhPT0yMDApICRvWydrbGFpZGEnXT0nSFRUUCAnLndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKTsKIGVsc2V7CiAgICRrb2Rhcz1iYXNlNjRfZGVjb2RlKHRyaW0od3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpKSx0cnVlKTsKICAgdHJ5eyB0b2tlbl9nZXRfYWxsKCRrb2RhcyxUT0tFTl9QQVJTRSk7ICRvWydzaW50YWtzZSddPSdPSyc7IH0KICAgY2F0Y2goUGFyc2VFcnJvciAkZSl7ICRvWydrbGFpZGEnXT0nUGFyc2VFcnJvcjogJy4kZS0+Z2V0TWVzc2FnZSgpLicgZWlsLicuJGUtPmdldExpbmUoKTsgfQogICBpZihlbXB0eSgkb1sna2xhaWRhJ10pKXsKICAgICBpZihmaWxlX2V4aXN0cygkaykpIEBjb3B5KCRrLFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzL3BldHNob3AtaXNsYWlkb3MucGhwLmJha18nLmdtZGF0ZSgnWW1kX0hpcycpKTsKICAgICAkb1snaXJhc3l0YSddPWZpbGVfcHV0X2NvbnRlbnRzKCRrLCRrb2Rhcyk7IGNsZWFyc3RhdGNhY2hlKHRydWUsJGspOwogICAgICRvWydtZDVfcG8nXT1tZDVfZmlsZSgkayk7ICRvWydzdXRhbXBhJ109KCRvWydtZDVfcG8nXT09PSc4NTA1M2M3YWI2MmFiMjcyNzhjMTVhOGZhOThiYTliNCcpOwogICB9CiB9CiAkVFsnZGVwbG95J109JG87CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJFQsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg==';
const KEY='ISL20260826'; const VER='ISL1';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Islaidos Deploy',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  sid=JSON.parse(await c.text()).id; out.sukurta=sid; await miegok(9000);
  const d=await fx(WP+'/?ps_isl='+KEY,{},'run'); const txt=await d.text();
  out.http=d.status;
  try{ out.rez=JSON.parse(txt); }catch(e){ out.ne_json=txt.slice(0,600); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/isl.json', Buffer.from(JSON.stringify(out,null,1)), VER);
