process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIE5MIGJsb2thcyByZWNvbiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX25sYiddKXx8JF9HRVRbJ3BzX25sYiddIT09J1InKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidOTEIxJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICAgJGtleXM9YXJyYXkoJ0dhdWtpdGUgbmF1ZGluZ3VzIHBhdGFyaW11cycsJ2p1c3VAcGFzdGFzLmx0JywnU3V0aW5rdSBnYXV0aSBQZXRzaG9wLmx0IG5hdWppZW5hcycpOwogICAgJGhpdHM9YXJyYXkoKTsKICAgIGZvcmVhY2goYXJyYXkoV1BNVV9QTFVHSU5fRElSLGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUnKSBhcyAkZCl7IGlmKCFpc19kaXIoJGQpKSBjb250aW51ZTsKICAgICAgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZCxGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICAgICBmb3JlYWNoKCRpdCBhcyAkZmkpeyBpZighcHJlZ19tYXRjaCgnL1wuKHBocHxqc3xodG1sKSQvJywkZmktPmdldEZpbGVuYW1lKCkpKSBjb250aW51ZTsgJGM9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmaS0+Z2V0UGF0aG5hbWUoKSk7IGlmKCRjPT09ZmFsc2UpIGNvbnRpbnVlOwogICAgICAgIGZvcmVhY2goJGtleXMgYXMgJGspIGlmKHN0cmlwb3MoJGMsJGspIT09ZmFsc2UpeyAkaGl0c1snZmlsZXMnXVtdPXN0cl9yZXBsYWNlKEFCU1BBVEgsJycsJGZpLT5nZXRQYXRobmFtZSgpKS4nIFsnLiRrLiddJzsgYnJlYWs7IH0gfSB9CiAgICBmb3JlYWNoKCRrZXlzIGFzICRrKXsgJHI9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUsc2NvcGUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgY29kZSBMSUtFICVzIiwnJScuJHdwZGItPmVzY19saWtlKCRrKS4nJScpLEFSUkFZX0EpOyBpZigkcikgJGhpdHNbJ3NuaXBwZXRzJ11bJGtdPSRyOyB9CiAgICBmb3JlYWNoKCRrZXlzIGFzICRrKXsgJHI9JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT05DQVQoSUQsJzonLHBvc3RfdHlwZSwnOicscG9zdF9zdGF0dXMsJzonLHBvc3RfdGl0bGUpIEZST00geyRwfXBvc3RzIFdIRVJFIHBvc3RfdHlwZTw+J3JldmlzaW9uJyBBTkQgcG9zdF9jb250ZW50IExJS0UgJXMiLCclJy4kd3BkYi0+ZXNjX2xpa2UoJGspLiclJykpOyBpZigkcikgJGhpdHNbJ3Bvc3RzJ11bJGtdPSRyOyB9CiAgICBmb3JlYWNoKCRrZXlzIGFzICRrKXsgJHI9JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl92YWx1ZSBMSUtFICVzIiwnJScuJHdwZGItPmVzY19saWtlKCRrKS4nJScpKTsgaWYoJHIpICRoaXRzWydvcHRpb25zJ11bJGtdPSRyOyB9CiAgICAkb1snaGl0cyddPSRoaXRzOwogICAgLy8gcmVuZGVyaW5nIHNvdXJjZTogacWhIHJhc3TFsyBmYWlsxbMgacWhdHJhdWt0aSBmb3Jtb3MgdmVpa3NtdXMgLyBhamF4IC8gcmVzdCAvIGhvb2tzCiAgICBpZighZW1wdHkoJGhpdHNbJ2ZpbGVzJ10pKSBmb3JlYWNoKCRoaXRzWydmaWxlcyddIGFzICRmKXsgJHBhdGg9QUJTUEFUSC5wcmVnX3JlcGxhY2UoJy8gXFsuKiQvJywnJywkZik7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRwYXRoKTsKICAgICAgcHJlZ19tYXRjaF9hbGwoJy8oYWRkX2FjdGlvbnxhZGRfZmlsdGVyfHJlZ2lzdGVyX3Jlc3Rfcm91dGV8d3BfYWpheF9bYS16X10rfGFkbWluX3Bvc3RfW2Etel9dK3xhY3Rpb249WyJcJ11bXiJcJ10rfGZldGNoXChbXildezAsMTIwfXxhamF4dXJsfHJlc3Rfcm91dGV8d3AtanNvblteIlwnKV0qfFwkX1BPU1RcW1teXF1dK1xdfHdwX25vbmNlX2ZpZWxkXChbXildKlwpfGNoZWNrX2FqYXhfcmVmZXJlclwoW14pXSpcKXx3cF92ZXJpZnlfbm9uY2VcKFteKV0qXCkpLycsJGMsJG0pOwogICAgICAkb1snc3JjJ11bJGZdPWFycmF5KCdzaXplJz0+c3RybGVuKCRjKSwndmVyJz0+KHByZWdfbWF0Y2goJy9WZXJzaW9uOlxzKihbXGQuXSspLycsJGMsJHYpPyR2WzFdOm51bGwpLCd0b2tlbnMnPT5hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtWzBdKSkpOyB9CiAgICAvLyBzbmlwcGV0IGtvZGFzIGplaSBmb3Jtb2plCiAgICBpZighZW1wdHkoJGhpdHNbJ3NuaXBwZXRzJ10pKSBmb3JlYWNoKCRoaXRzWydzbmlwcGV0cyddIGFzICRrPT4kcnMpIGZvcmVhY2goJHJzIGFzICRzKXsgJGM9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBjb2RlIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIGlkPSVkIiwkc1snaWQnXSkpOyBwcmVnX21hdGNoX2FsbCgnLyhhZGRfYWN0aW9uXChbXixdK3x3cF9hamF4X1thLXpfXSt8YWRtaW5fcG9zdF9bYS16X10rfGFjdGlvbj1bIlwnXVteIlwnXSt8ZmV0Y2hcKFteKV17MCwxMjB9fHJlc3Rfcm91dGVbXiJcJ10qfHdwLWpzb25bXiJcJyldKnxyZWdpc3Rlcl9yZXN0X3JvdXRlXChbXixdKyxbXixdKykvJywkYywkbSk7ICRvWydzbmlwX3NyYyddWyRzWydpZCddXT1hcnJheSgnc2l6ZSc9PnN0cmxlbigkYyksJ3Rva2Vucyc9PmFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJG1bMF0pKSk7IH0KICAgIC8vIGNvbnNlbnQgbG9nIGJhc2VsaW5lICsgbmV3c2xldHRlciB0YWJsZXMKICAgICRvWydjb25zZW50X24nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cHNfY29uc2VudF9sb2ciKTsgJG9bJ2NvbnNlbnRfbGFzdCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JHB9cHNfY29uc2VudF9sb2cgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAzIixBUlJBWV9BKTsKICAgICRvWyd0YWJsZXNfbmwnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyRwfXBzX24lJyIpOyAkb1sndGFibGVzX2MnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyRwfXBzXyUnIik7CiAgICAkb1snc2FyZ2FzX2tsYWlkb3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRwfXBzX3Nhcmdhc19rbGFpZG9zIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNSIsQVJSQVlfQSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-072536';
const GKEY='ps_nlb';
const PHASES=["R"];
const OUT='analize/nlb_recon.json';
const out={v:VER};
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
  try{ const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){ out.list_praleistas=String(e).slice(0,80); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
