process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEc0IFJlY29uIHYxLjAgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19iaXMnXSk/JF9HRVRbJ3BzX2JpcyddOicnKSE9PSdaMTAnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidHNFItdjEuMCcpOwogIHRyeXsKICAgIC8qIHJhbmR1IHdlYmhvb2sgZmFpbGEgKi8KICAgIGZvcmVhY2goYXJyYXlfbWVyZ2UoZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1lc3AvaW5jbHVkZXMvKi5waHAnKSxnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvKi5waHAnKSxnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykpIGFzICRmKXsKICAgICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJGYpOwogICAgICBpZihzdHJpcG9zKCRjLCdoYW5kbGVfc2VuZGVyX3Vuc3Vic2NyaWJlJykhPT1mYWxzZSB8fCBzdHJpcG9zKCRjLCdzZW5kZXJfd2ViaG9vaycpIT09ZmFsc2UgfHwgc3RyaXBvcygkYywndmVyaWZ5X3dlYmhvb2snKSE9PWZhbHNlICYmIHN0cmlwb3MoJGMsJ3JvdXRlJykhPT1mYWxzZSl7CiAgICAgICAgJG9bJ2ZhaWxhaSddW3N0cl9yZXBsYWNlKEFCU1BBVEgsJycsJGYpXT1hcnJheSgnZHlkaXMnPT5zdHJsZW4oJGMpLCdtZDUnPT5tZDUoJGMpLCdiNjQnPT5zdHJsZW4oJGMpPDI1MDAwP2Jhc2U2NF9lbmNvZGUoJGMpOidESURFTElTJyk7CiAgICAgIH0KICAgIH0KICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICAgICRvWyd3ZWJob29rX2xvZ19zdHVscCddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JHB9cHNfd2ViaG9va19sb2ciLDApOwogICAgJG9bJ2pvYnNfYW5hbGl0aWtvc19zdHVscCddPWFycmF5X3ZhbHVlcyhhcnJheV9pbnRlcnNlY3QoJHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskcH1wc19lbWFpbF9qb2JzIiwwKSxhcnJheSgnZGVsaXZlcmVkX2F0Jywnb3BlbmVkX2F0JywnY2xpY2tlZF9hdCcsJ3Byb3ZpZGVyX21lc3NhZ2VfaWQnKSkpOwogICAgLyogR01DIGZlZWQgcGF0aWtyYSAqLwogICAgZm9yZWFjaChhcnJheSgnZ29vZ2xlJywnbWVyY2hhbnQnLCdnbWMnKSBhcyAkayl7CiAgICAgICRyPXdwX3JlbW90ZV9oZWFkKGhvbWVfdXJsKCcvZmVlZC8nLiRrLicvJyksYXJyYXkoJ3RpbWVvdXQnPT4xMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsKICAgICAgJG9bJ2ZlZWRfJy4ka109aXNfd3BfZXJyb3IoJHIpPydFUlInOndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKTsKICAgIH0KICAgICRmZj1nbG9iKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZmVlZHMqJyk7CiAgICBpZigkZmYpeyAkYz1maWxlX2dldF9jb250ZW50cygkZmZbMF0pOyAkb1snZmVlZHNfZmFpbGFzJ109YmFzZW5hbWUoJGZmWzBdKTsgJG9bJ2ZlZWRzX21kNSddPW1kNSgkYyk7ICRvWydmZWVkc19keWRpcyddPXN0cmxlbigkYyk7CiAgICAgIHByZWdfbWF0Y2hfYWxsKCIvJyhbYS16MC05Xy1dKyknXHMqPT4vIixzdWJzdHIoJGMsMCwzMDAwKSwkbSk7ICRvWydmZWVkc19wcmFkemlhX3Jha3RhaSddPWFycmF5X3NsaWNlKCRtWzFdLDAsMTUpOwogICAgICAkb1snZmVlZHNfdHVyaV9nb29nbGUnXT1zdHJpcG9zKCRjLCdnb29nbGUnKSE9PWZhbHNlOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK'; const VER='G4R-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS BIS G4 Recon v1.0 (back-in-stock zvalgyba)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  const d=await fx(WP+'/?ps_bis=Z10',{headers:UA},'chk');
  const dt=await d.text(); try{ out.rez=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,2000); }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/g4r.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
