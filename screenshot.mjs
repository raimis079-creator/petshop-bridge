process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI0NyddKSB8fCAkX0dFVFsncHNfaDI0NyddIT09J1JFQzIwMjYwODI0JykgcmV0dXJuOwogJFQ9YXJyYXkoJ3YnPT4nSDI0N1InKTsKICRiYXNlPVdQX1BMVUdJTl9ESVI7CiAkZGlycz1nbG9iKCRiYXNlLicvKnZlbmlwYWsqJyk7ICRUWydkaXJzJ109YXJyYXlfbWFwKCdiYXNlbmFtZScsKGFycmF5KSRkaXJzKTsKICRoaXRzPWFycmF5KCk7CiBmb3JlYWNoKChhcnJheSkkZGlycyBhcyAkZCl7CiAgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZCxGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOwogIGZvcmVhY2goJGl0IGFzICRmKXsKICAgaWYoc3Vic3RyKCRmLC00KSE9PScucGhwJykgY29udGludWU7CiAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICAgaWYoc3RycG9zKCRjLCdpbXBvcnQvc2VuZCcpIT09ZmFsc2UgfHwgc3RycG9zKCRjLCdnby52ZW5pcGFrJykhPT1mYWxzZSl7CiAgICAkaGl0c1tzdHJfcmVwbGFjZSgkYmFzZS4nLycsJycsJGYpXT1zdHJsZW4oJGMpOwogICB9CiAgfQogfQogJFRbJ2ZhaWxhaSddPSRoaXRzOwogLy8gaXN0cmF1a29zOiBwaXJtaSAyIGZhaWxhaSBzdSBpbXBvcnQvc2VuZCDigJQgaWtpIDYwMDAgc2ltYm9saXUgYXBsaW5rIHJha3RhCiAkaXN0PWFycmF5KCk7CiBmb3JlYWNoKGFycmF5X3NsaWNlKGFycmF5X2tleXMoJGhpdHMpLDAsMykgYXMgJHJlbCl7CiAgJGM9ZmlsZV9nZXRfY29udGVudHMoJGJhc2UuJy8nLiRyZWwpOwogICRwPXN0cnBvcygkYywnaW1wb3J0L3NlbmQnKTsgaWYoJHA9PT1mYWxzZSkkcD1zdHJwb3MoJGMsJ2dvLnZlbmlwYWsnKTsKICAkaXN0WyRyZWxdPXN1YnN0cigkYyxtYXgoMCwkcC00NTAwKSw5MDAwKTsKIH0KICRUWydpc3RyYXVrb3MnXT0kaXN0OwogJG49Z2V0X29wdGlvbignc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfc2V0dGluZ3MnLGFycmF5KCkpOwogJFRbJ251c3RhdHltdV9yYWt0YWknXT1hcnJheV9rZXlzKChhcnJheSkkbik7CiBmb3JlYWNoKChhcnJheSkkbiBhcyAkaz0+JHYpeyBpZihzdHJpcG9zKCRrLCdwYXNzJyk9PT1mYWxzZSAmJiAhaXNfYXJyYXkoJHYpICYmIHN0cmxlbigoc3RyaW5nKSR2KTw2MCkgJFRbJ251c3QnXVska109JHY7IH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRULEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo=';
const out={v:'H247R'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  const u='https://api.github.com/repos/'+REPO+'/contents/'+path;
  const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<4;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(6000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H247 recon',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){ sid=j.id; await miegok(9000);
    const d=await fx(WP+'/?ps_h247=REC20260824',{},'rec');
    const tx=await d.text(); try{ out.R=JSON.parse(tx); }catch(e){ out.R='ne-json: '+tx.slice(0,300); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h247.json', Buffer.from(JSON.stringify(out,null,1)), 'H247R');
