process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaW52MSddKSB8fCAkX0dFVFsncHNfaW52MSddIT09J1JVTicpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0lOVjEnKTsKICR3PWdldF9vcHRpb24oJ3djZG5fc2V0dGluZ3MnKTsKICRUWyd3Y2RuX3NldHRpbmdzJ109JHc7CiAkVFsnZW5naW5lcyddPWFycmF5KAogICAnZG9tcGRmJz0+Y2xhc3NfZXhpc3RzKCdEb21wZGZcXERvbXBkZicpLAogICAnbXBkZic9PmNsYXNzX2V4aXN0cygnTXBkZlxcTXBkZicpLAogICAndGNwZGYnPT5jbGFzc19leGlzdHMoJ1RDUERGJyksCiAgICdodG1sMnBkZic9PmNsYXNzX2V4aXN0cygnSFRNTDJQREYnKSwKICk7CiAkVFsncGx1Z2lucyddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoKGFycmF5KWdldF9vcHRpb24oJ2FjdGl2ZV9wbHVnaW5zJyksIGZ1bmN0aW9uKCRwKXsKICAgcmV0dXJuIHByZWdfbWF0Y2goJy9wZGZ8aW52b2ljZXxwcmludHx3Y2RufGRlbGl2ZXJ5fHNhc2thaXQvaScsJHApOyB9KSk7CiAkcm9vdHM9YXJyYXkoJ3RlbWEnPT5nZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKSwnbXUnPT5XUE1VX1BMVUdJTl9ESVIsJ3BsdWcnPT5XUF9QTFVHSU5fRElSKTsKICRmb3VuZD1hcnJheSgpOyAkbG9nbz1hcnJheSgpOyAkbj0wOwogZm9yZWFjaCgkcm9vdHMgYXMgJGs9PiRyKXsKICAgaWYoIWlzX2RpcigkcikpIGNvbnRpbnVlOwogICB0cnl7CiAgICAgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkciwgRmlsZXN5c3RlbUl0ZXJhdG9yOjpTS0lQX0RPVFMpKTsKICAgICBmb3JlYWNoKCRpdCBhcyAkZil7CiAgICAgICBpZigkbj40MDAwKSBicmVhazsKICAgICAgIGlmKCEkZi0+aXNGaWxlKCkpIGNvbnRpbnVlOwogICAgICAgJHA9JGYtPmdldFBhdGhuYW1lKCk7CiAgICAgICBpZihzdWJzdHIoJHAsLTQpIT09Jy5waHAnKSBjb250aW51ZTsKICAgICAgIGlmKHN0cnBvcygkcCwnL3ZlbmRvci8nKSE9PWZhbHNlIHx8IHN0cnBvcygkcCwnL25vZGVfbW9kdWxlcy8nKSE9PWZhbHNlKSBjb250aW51ZTsKICAgICAgIGlmKCRmLT5nZXRTaXplKCk+OTAwMDAwKSBjb250aW51ZTsKICAgICAgICRuKys7CiAgICAgICAkYz1AZmlsZV9nZXRfY29udGVudHMoJHApOyBpZigkYz09PWZhbHNlKSBjb250aW51ZTsKICAgICAgIGlmKHN0cnBvcygkYywnSUFQVicpIT09ZmFsc2UgfHwgc3RycG9zKCRjLCdJc2Fua3N0aW5lJykhPT1mYWxzZSB8fCBzdHJwb3MoJGMsIlx4YzRceGFlc2Fua3N0aW4iKSE9PWZhbHNlKXsKICAgICAgICAgJGZvdW5kW109YXJyYXkoJ2YnPT5zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRwKSwna2InPT5yb3VuZCgkZi0+Z2V0U2l6ZSgpLzEwMjQpKTsKICAgICAgIH0KICAgICAgIGlmKHByZWdfbWF0Y2hfYWxsKCcvXi4qKGxvZ298bG9nb3RpcCkuKiQvbWknLCRjLCRtKSl7CiAgICAgICAgIGlmKHByZWdfbWF0Y2goJy8oaW52b2ljZXx3Y2RufHByaW50LW9yZGVyfHNhc2thaXR8cGRmKS9pJywkcCkpewogICAgICAgICAgICRsb2dvW3N0cl9yZXBsYWNlKEFCU1BBVEgsJycsJHApXT1hcnJheV9zbGljZSgkbVswXSwwLDEyKTsKICAgICAgICAgfQogICAgICAgfQogICAgIH0KICAgfWNhdGNoKEV4Y2VwdGlvbiAkZSl7ICRUWydzY2FuX2Vycl8nLiRrXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiB9CiAkVFsnZmFpbGFpX3N1X0lBUFYnXT0kZm91bmQ7CiAkVFsnbG9nb19laWx1dGVzJ109JGxvZ287CiAkVFsnc2tlbnVvdGFfcGhwJ109JG47CiAkdXA9d3BfdXBsb2FkX2RpcigpOwogJFRbJ3djZG5fZGlyJ109YXJyYXkoJ2tlbGlhcyc9PiR1cFsnYmFzZWRpciddLicvd2NkbicsICd5cmEnPT5pc19kaXIoJHVwWydiYXNlZGlyJ10uJy93Y2RuJykpOwogaWYoaXNfZGlyKCR1cFsnYmFzZWRpciddLicvd2Nkbi9pbnZvaWNlJykpewogICAkZmY9YXJyYXlfc2xpY2UoYXJyYXlfZGlmZihzY2FuZGlyKCR1cFsnYmFzZWRpciddLicvd2Nkbi9pbnZvaWNlJyksYXJyYXkoJy4nLCcuLicpKSwtNSk7CiAgICRUWyd3Y2RuX2RpciddWydwYXNrdXRpbmlhaSddPWFycmF5X3ZhbHVlcygkZmYpOwogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LCA1KTsK';
const out={v:'INV1'};
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
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP INV Recon v1 (saskaitos PDF)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_inv1=RUN');
    const t=await d.text();
    try{ out.R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,600); }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/inv1.json', Buffer.from(JSON.stringify(out,null,1)), 'INV1 recon');
