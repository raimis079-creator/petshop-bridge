process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIFVJIDEzYgogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfdTEzJ10pKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7ICRNVT1XUE1VX1BMVUdJTl9ESVI7CiAkaz0kTVUuJy9wZXRzaG9wLWF0YXNrYWl0b3MtdWkucGhwJzsKICRUPWFycmF5KCd2Jz0+J1UxMycsJ21kNV9wcmllcyc9Pm1kNV9maWxlKCRrKSk7CiBpZigkVFsnbWQ1X3ByaWVzJ10hPT0nZWJkZThkNjQ5MjRkYWYzMTRiMzFkODFlN2Q3ZDY5ZjYnKXsgJFRbJ2tsYWlkYSddPSduZXRpa2V0YXMgbWQ1JzsgfQogZWxzZXsKICAkcj13cF9yZW1vdGVfZ2V0KCdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlL2NvbnRlbnRzL2RlcGxveS9wZXRzaG9wLWF0YXNrYWl0b3MtdWkuYjY0P3JlZj1hZjc0NTc4MmI3ZWNiYTM0ZDMyMmEyMjlkMzA2Y2JkMTNjZmVlN2JjJywKICAgICBhcnJheSgndGltZW91dCc9PjI1LCdoZWFkZXJzJz0+YXJyYXkoJ0FjY2VwdCc9PidhcHBsaWNhdGlvbi92bmQuZ2l0aHViLnJhdycsJ1VzZXItQWdlbnQnPT4ncGV0c2hvcC1icmlkZ2UnKSkpOwogIGlmKGlzX3dwX2Vycm9yKCRyKXx8d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpIT09MjAwKSAkVFsna2xhaWRhJ109J2ZldGNoJzsKICBlbHNlewogICAgJGtvZGFzPWJhc2U2NF9kZWNvZGUodHJpbSh3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcikpLHRydWUpOwogICAgdHJ5eyB0b2tlbl9nZXRfYWxsKCRrb2RhcyxUT0tFTl9QQVJTRSk7ICRUWydzaW50YWtzZSddPSdPSyc7IH0KICAgIGNhdGNoKFBhcnNlRXJyb3IgJGUpeyAkVFsna2xhaWRhJ109J1BhcnNlRXJyb3I6ICcuJGUtPmdldE1lc3NhZ2UoKTsgfQogICAgaWYoZW1wdHkoJFRbJ2tsYWlkYSddKSl7CiAgICAgIEBjb3B5KCRrLFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzL3BldHNob3AtYXRhc2thaXRvcy11aS5waHAuYmFrXzEzYl8nLmdtZGF0ZSgnWW1kX0hpcycpKTsKICAgICAgJFRbJ2lyYXN5dGEnXT1maWxlX3B1dF9jb250ZW50cygkaywka29kYXMpOyBjbGVhcnN0YXRjYWNoZSh0cnVlLCRrKTsKICAgICAgJFRbJ21kNV9wbyddPW1kNV9maWxlKCRrKTsgJFRbJ3N1dGFtcGEnXT0oJFRbJ21kNV9wbyddPT09J2U4NDA0ODFjMjg2NzVlYTJjYmQyYzZmYzIyMTUxZWIwJyk7CiAgICB9CiAgfQogfQogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRULEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo='; const VER='U13';
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const out={v:VER,zingsniai:[]}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP UI 13b',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const r=await fx(WP+'/?ps_u13=1',{},'r'); const t=await r.text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,400); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/u13.json', Buffer.from(JSON.stringify(out,null,1)), VER);
