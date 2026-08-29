process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFByaXN0IFBhdGlrcmEgdjEuMCAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2JpcyddKT8kX0dFVFsncHNfYmlzJ106JycpIT09J1BSQ0hLJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidQUkNISy12MS4wJyk7CiAgdHJ5ewogICAgJGM9JHdwZGItPmdldF92YXIoIlNFTEVDVCBwb3N0X2NvbnRlbnQgRlJPTSB7JHB9cG9zdHMgV0hFUkUgSUQ9MTQ4OTQiKTsKICAgIC8qIGZyYWdtZW50YXMgYXBsaW5rIGJ1dnVzaWEgdmlldGE6IGllc2tvbSAna3VyamVyJyBrb250ZWtzdG8gKi8KICAgIGZvcmVhY2goYXJyYXkoJ2RhcmJvIGRpZW4nLCdrdXJqZXInLCdWZW5pcGFrJywnTFAgRXhwcmVzcycpIGFzICRyKXsKICAgICAgJHBvcz1zdHJpcG9zKCRjLCRyKTsKICAgICAgaWYoJHBvcyE9PWZhbHNlKSAkb1snZnJhZ18nLiRyXT10cmltKHN0cmlwX3RhZ3Moc3Vic3RyKCRjLG1heCgwLCRwb3MtMTYwKSwzNDApKSk7CiAgICB9CiAgICAkb1snbmFzbGFpY2lhaSddPWFycmF5KAogICAgICAnZHZpZ3ViYXNfdGFza2FzJz0+c3Vic3RyX2NvdW50KCRjLCcuIC4nKStzdWJzdHJfY291bnQoJGMsJy4uJyksCiAgICAgICd0YXJwYXNfcHJpZXNfdGFza2EnPT5zdWJzdHJfY291bnQoJGMsJyAuJyksCiAgICAgICd0dXNjaWFfcCc9PnByZWdfbWF0Y2hfYWxsKCcvPHA+XHMqPFwvcD4vJywkYyksCiAgICApOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK'; const VER='PRCHK-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS BIS Prist Patikra v1.0 (back-in-stock zvalgyba)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  const d=await fx(WP+'/?ps_bis=PRCHK',{headers:UA},'chk');
  const dt=await d.text(); try{ out.rez=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,2000); }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/prist_chk.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
