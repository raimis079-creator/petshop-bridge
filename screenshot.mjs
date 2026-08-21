process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIxMSddKSA/ICRfR0VUWydwc19yMjExJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKICRvID0gYXJyYXkoJ3YnPT4nUjIxMScpOwogJGxhdWtpYW1hcyA9ICc4N2I4ZTM1ODNmNzMxM2RlYWYxY2VhNmJjN2Q2NjQyYic7CiAkdXJsID0gJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS8wMjg3Y2VhYTU2MTJiZGU0NGVmOWQ4NjFlZDIyNWY1NzFhZmM5ZDkyL2RlcGxveS9wZXRzaG9wLXJpbmtpbmlhaS5waHAnOwogJHIgPSB3cF9yZW1vdGVfZ2V0KCR1cmwsIGFycmF5KCd0aW1lb3V0Jz0+NjApKTsKIGlmKGlzX3dwX2Vycm9yKCRyKSl7ICRvWydrbGFpZGEnXT0kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsgfQogZWxzZSB7CiAgICRrb2RhcyA9IHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKICAgJG9bJ21kNV9vayddPShtZDUoJGtvZGFzKT09PSRsYXVraWFtYXMpOwogICBpZigkb1snbWQ1X29rJ10pewogICAgICR0ID0gQHRva2VuX2dldF9hbGwoJGtvZGFzLCBUT0tFTl9QQVJTRSk7CiAgICAgJG9bJ3NpbnRha3NlJ10gPSBpc19hcnJheSgkdCkgPyAnT0snIDogJ0tMQUlEQSc7CiAgICAgaWYoaXNfYXJyYXkoJHQpKXsKICAgICAgICRmID0gKGRlZmluZWQoJ1dQTVVfUExVR0lOX0RJUicpP1dQTVVfUExVR0lOX0RJUjpXUF9DT05URU5UX0RJUi4nL211LXBsdWdpbnMnKS4nL3BldHNob3Atcmlua2luaWFpLnBocCc7CiAgICAgICAkYmRpciA9IFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzJzsKICAgICAgIGlmKCFpc19kaXIoJGJkaXIpKSBAd3BfbWtkaXJfcCgkYmRpcik7CiAgICAgICAkb1snYmFrJ10gPSBAY29weSgkZiwkYmRpci4nL3BldHNob3Atcmlua2luaWFpLicuZ21kYXRlKCdZbWQtSGlzJykuJy5iYWsucGhwJykgPyAnT0snOidORSc7CiAgICAgICAkb1snaXJhc3l0YSddID0gZmlsZV9wdXRfY29udGVudHMoJGYsJGtvZGFzKSE9PWZhbHNlID8gJ09LJzonTkUnOwogICAgICAgY2xlYXJzdGF0Y2FjaGUoKTsgJG9bJ3N1dGFtcGEnXT0obWQ1X2ZpbGUoJGYpPT09JGxhdWtpYW1hcyk7CiAgICAgfQogICB9CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSwgMTMxKTsKCi8qIEFudHJhcyByYWt0YXMg4oCUIFNLQUlDSUFWSU1BUyBwbyBkaWVnaW1vLCBqYXUgc3UgbmF1anUga29kdSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoKGlzc2V0KCRfR0VUWydwc19yMjExYiddKSA/ICRfR0VUWydwc19yMjExYiddIDogJycpICE9PSAnR08nKSByZXR1cm47CiAkbyA9IGFycmF5KCd2Jz0+J1IyMTFiJyk7CiAkb1sndmVyc2lqYSddID0gY2xhc3NfZXhpc3RzKCdQZXRzaG9wX1JpbmtpbmlhaScpID8gUGV0c2hvcF9SaW5raW5pYWk6OlZFUlNJSkEgOiAnbmVyYSc7CiBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfUmlua2luaWFpJykpewogICAkc2FyID0gUGV0c2hvcF9SaW5raW5pYWk6OnJpbmtpbmlhaSgpOwogICAkb1sna2llayddID0gY291bnQoJHNhcik7CiAgICRsYXVrYWkgPSAwOyAkc2FyYXNhcyA9IGFycmF5KCk7CiAgIGZvcmVhY2goJHNhciBhcyAkcil7CiAgICAgJGlkID0gKGludCkkclsnaWQnXTsKICAgICBpZihnZXRfcG9zdF9tZXRhKCRpZCwnX3BzX2xhdWthcycsdHJ1ZSk9PT0neWVzJykgJGxhdWthaSsrOwogICAgICRzYXJhc2FzW10gPSAkaWQuJyAnLm1iX3N1YnN0cigkclsncGF2J10sMCw0MCkuJyBbJy4oJHJbJ3RpcGFzJ10gPz8gJ21ubScpLiddJzsKICAgfQogICAkb1snc3VyZW5rYW11X2xpa28nXSA9ICRsYXVrYWk7CiAgICRvWydzYXJhc2FzJ10gPSAkc2FyYXNhczsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'R211'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
try{
  const kunas=JSON.stringify({name:'TEMP R211 Rinkiniai v1.30',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const r1=await fetch(WP+'/?ps_r211=GO'); try{ out.DEPLOY=JSON.parse(await r1.text()); }catch(e){ out.DEPLOY='klaida'; }
    await miegok(4000);
    const r2=await fetch(WP+'/?ps_r211b=GO'); try{ out.PATIKRA=JSON.parse(await r2.text()); }catch(e){ out.PATIKRA='klaida'; }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.deaktyvuota=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r211.json', Buffer.from(JSON.stringify(out,null,1)), 'r211 v1.30');
