process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEUxQSBEZXBsb3kgdjEzIChmYWt0YWkgMS4zKQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfZTEzJ10pIHx8ICRfR0VUWydwc19lMTMnXSE9PSdFMUEyMDI2MDgyNlAnKSByZXR1cm47CiAkVD1hcnJheSgndic9PidFMUFENScsJ3RzJz0+ZGF0ZSgnYycpKTsgZ2xvYmFsICR3cGRiOwogJFNIQT1pc3NldCgkX0dFVFsnc2hhJ10pP3Nhbml0aXplX3RleHRfZmllbGQoJF9HRVRbJ3NoYSddKTonJzsKICRmPSdwZXRzaG9wLWZha3RhaS5waHAnOyAkbGF1a2lhbWFzPSdhMDU4N2QxZmFjNjI3MzA4MzUxNjgxNmE2MjQ2NzEwNSc7CiAkaW5mPWFycmF5KCk7CiAkdT0naHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS9jb250ZW50cy9kZXBsb3kvJy4kZi4nLmI2ND9yZWY9Jy4kU0hBOwogJHI9d3BfcmVtb3RlX2dldCgkdSxhcnJheSgndGltZW91dCc9PjQ1LCdoZWFkZXJzJz0+YXJyYXkoJ1VzZXItQWdlbnQnPT4ncHMnLCdBY2NlcHQnPT4nYXBwbGljYXRpb24vdm5kLmdpdGh1Yitqc29uJykpKTsKIGlmKGlzX3dwX2Vycm9yKCRyKSl7ICRpbmZbJ2tsYWlkYSddPSRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyB9CiBlbHNlewogICRqPWpzb25fZGVjb2RlKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSx0cnVlKTsKICAkY29kZT1pc3NldCgkalsnY29udGVudCddKT9iYXNlNjRfZGVjb2RlKHRyaW0oYmFzZTY0X2RlY29kZSgkalsnY29udGVudCddKSkpOicnOwogICRpbmZbJ2dhdXRhJ109c3RybGVuKCRjb2RlKTsgJGluZlsnbWQ1X2dhdXRvJ109bWQ1KCRjb2RlKTsKICBpZigkY29kZSAmJiBzdHJwb3MoJGNvZGUsJzw/cGhwJyk9PT0wICYmICRpbmZbJ21kNV9nYXV0byddPT09JGxhdWtpYW1hcyl7CiAgICB0cnl7IHRva2VuX2dldF9hbGwoJGNvZGUsIFRPS0VOX1BBUlNFKTsgJGluZlsnc2ludGFrc2UnXT0nb2snOyB9CiAgICBjYXRjaChQYXJzZUVycm9yICRlKXsgJGluZlsnc2ludGFrc2UnXT0nS0xBSURBOiAnLiRlLT5nZXRNZXNzYWdlKCk7IH0KICAgIGlmKCdvayc9PT0kaW5mWydzaW50YWtzZSddKXsKICAgICAgJGRzdD1XUE1VX1BMVUdJTl9ESVIuJy8nLiRmOwogICAgICAkYmQ9V1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMvJzsgaWYoIWlzX2RpcigkYmQpKSBAbWtkaXIoJGJkLDA3NTUsdHJ1ZSk7CiAgICAgICRpbmZbJ2J1dm8nXT1tZDVfZmlsZSgkZHN0KTsgQGNvcHkoJGRzdCwkYmQuJGYuJy5iYWtfZTFhMTMnKTsKICAgICAgZmlsZV9wdXRfY29udGVudHMoJGRzdCwkY29kZSk7IGNsZWFyc3RhdGNhY2hlKHRydWUsJGRzdCk7CiAgICAgICRpbmZbJ21kNV9kaXNrZSddPW1kNV9maWxlKCRkc3QpOyAkaW5mWydvayddPSgkaW5mWydtZDVfZGlza2UnXT09PSRsYXVraWFtYXMpOwogICAgfQogIH0gZWxzZSB7ICRpbmZbJ2tsYWlkYSddPSdtZDUvdHVyaW55cyBuZXRpbmthJzsgfQogfQogJFRbJ2ZhaWxhcyddPSRpbmY7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRULEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0sNSk7Cg==';
const KEY='E1A20260826P'; const VER='E1AD5';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP E1A Deploy v13 (faktai 1.3)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_e13='+KEY+'&sha=f44cd280d03d5e7b65da2d8024181da235477a9e',{},'run');
  const txt=await d.text();
  out.http=d.status; out.ilgis=txt.length;
  try{ const r=JSON.parse(txt); out.ok=(r.v===VER); await put('deploy/e1a_deploy13.json', Buffer.from(JSON.stringify(r,null,1)), VER); out.irasyta=1; }
  catch(e){ out.ne_json=txt.slice(0,600); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/e1a_deploy13run.json', Buffer.from(JSON.stringify(out,null,1)), VER);
