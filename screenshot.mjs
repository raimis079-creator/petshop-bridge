process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEUyYiBEZXBsb3kKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiBpZighaXNzZXQoJF9HRVRbJ3BzX2UyYmQnXSkgfHwgJF9HRVRbJ3BzX2UyYmQnXSE9PSdFMkJEMjAyNjA4MjYnKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7CiAkVD1hcnJheSgndic9PidFMkJEJywndHMnPT5nbWRhdGUoJ2MnKSk7CiAkTVU9V1BNVV9QTFVHSU5fRElSOyAkQkFLPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzJzsKICRSPSdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlL2NvbnRlbnRzL2RlcGxveS8nOwogJE09YXJyYXkoCiAgYXJyYXkoJ3BldHNob3AtZmFrdC1hdHNhcmdvcycsJ2Q3MmNlZGRjMDMwMzU0MDc1ODVlODVjNzA1NGM2NDNmNzRlZWVkNGYnLCc2MzM4NTVmMzRjYWNhYzY3ZDY5YjNkMjk2MTdmZWM3NCcpLAogIGFycmF5KCdwZXRzaG9wLWZha3Qta2Fpbm9zJywnMGE3N2JlZDE5NGQ1YjI0M2YzZmM1Y2E5ODU4NmVmNTc4MTA1NDkwNCcsJzNkOTNhMjcwYjMwZmQ5Nzg5YjkwNGMwYTAxZTc0MGRiJyksCiAgYXJyYXkoJ3BldHNob3AtZGltLWtsaWVudGFpJywnMWNmZTlhYmMyNjM5M2IwMWY3ZjQ0OWQ5NTJhYjBhMTdmMTk1YmJlNicsJ2NmNDgzNmVkZjI1ZTIxMTdiY2FlMWE5ZDQ1OWZhNWFmJyksCiApOwogZm9yZWFjaCgkTSBhcyAkbSl7CiAgIGxpc3QoJHYsJHNoYSwkbWQpPSRtOyAkbz1hcnJheSgpOwogICAkcj13cF9yZW1vdGVfZ2V0KCRSLiR2LicuYjY0P3JlZj0nLiRzaGEsYXJyYXkoJ3RpbWVvdXQnPT4yNSwnaGVhZGVycyc9PmFycmF5KCdBY2NlcHQnPT4nYXBwbGljYXRpb24vdm5kLmdpdGh1Yi5yYXcnLCdVc2VyLUFnZW50Jz0+J3BldHNob3AtYnJpZGdlJykpKTsKICAgaWYoaXNfd3BfZXJyb3IoJHIpKXsgJG9bJ2tsYWlkYSddPSRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyAkVFsnbW9kdWxpYWknXVskdl09JG87IGNvbnRpbnVlOyB9CiAgIGlmKHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSE9PTIwMCl7ICRvWydrbGFpZGEnXT0nSFRUUCAnLndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKTsgJFRbJ21vZHVsaWFpJ11bJHZdPSRvOyBjb250aW51ZTsgfQogICAka29kYXM9YmFzZTY0X2RlY29kZSh0cmltKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSksdHJ1ZSk7CiAgIHRyeXsgdG9rZW5fZ2V0X2FsbCgka29kYXMsVE9LRU5fUEFSU0UpOyAkb1snc2ludGFrc2UnXT0nT0snOyB9CiAgIGNhdGNoKFBhcnNlRXJyb3IgJGUpeyAkb1sna2xhaWRhJ109J1BhcnNlRXJyb3I6ICcuJGUtPmdldE1lc3NhZ2UoKS4nIGVpbC4nLiRlLT5nZXRMaW5lKCk7ICRUWydtb2R1bGlhaSddWyR2XT0kbzsgY29udGludWU7IH0KICAgJGs9JE1VLicvJy4kdi4nLnBocCc7CiAgICRvWydidXZvJ109ZmlsZV9leGlzdHMoJGspP21kNV9maWxlKCRrKTpudWxsOwogICBpZihmaWxlX2V4aXN0cygkaykpIEBjb3B5KCRrLCRCQUsuJy8nLiR2LicucGhwLmJha18nLmdtZGF0ZSgnWW1kX0hpcycpKTsKICAgJG9bJ2lyYXN5dGEnXT1maWxlX3B1dF9jb250ZW50cygkaywka29kYXMpOyBjbGVhcnN0YXRjYWNoZSh0cnVlLCRrKTsKICAgJG9bJ21kNV9wbyddPW1kNV9maWxlKCRrKTsgJG9bJ3N1dGFtcGEnXT0oJG9bJ21kNV9wbyddPT09JG1kKTsKICAgJFRbJ21vZHVsaWFpJ11bJHZdPSRvOwogfQogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRULEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo=';
const KEY='E2BD20260826'; const VER='E2BD';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP E2b Deploy',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  sid=JSON.parse(await c.text()).id; out.sukurta=sid; await miegok(9000);
  const d=await fx(WP+'/?ps_e2bd='+KEY,{},'run'); const txt=await d.text();
  out.http=d.status;
  try{ const r=JSON.parse(txt); await put('deploy/e2b_dep.json', Buffer.from(JSON.stringify(r,null,1)), VER); out.irasyta=1; }
  catch(e){ out.ne_json=txt.slice(0,700); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/e2b_deprun.json', Buffer.from(JSON.stringify(out,null,1)), VER);
