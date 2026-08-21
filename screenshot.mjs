process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIwOSddKSA/ICRfR0VUWydwc19yMjA5J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKICRvID0gYXJyYXkoJ3YnPT4nUjIwOScpOwogJGxhdWtpYW1hcyA9ICc5OTAzODk2ZmMzYjgyYzY3NmJiMTg2ZDE3OGQ1MmM1MSc7CiAkdXJsID0gJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS81OWU2NzllNTM0Njc2Mjk4ZGM5ZjY2Njk5NjVlNDE5NjhlNDA2ZDg1L2RlcGxveS9wZXRzaG9wLXJpbmtpbmlhaS5waHAnOwogJHIgPSB3cF9yZW1vdGVfZ2V0KCR1cmwsIGFycmF5KCd0aW1lb3V0Jz0+NjApKTsKIGlmKGlzX3dwX2Vycm9yKCRyKSl7ICRvWydrbGFpZGEnXT0kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsgfQogZWxzZSB7CiAgICRrb2RhcyA9IHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKICAgJG9bJ2dhdXRhJ109c3RybGVuKCRrb2Rhcyk7ICRvWydtZDVfb2snXT0obWQ1KCRrb2Rhcyk9PT0kbGF1a2lhbWFzKTsKICAgaWYoJG9bJ21kNV9vayddKXsKICAgICAkdCA9IEB0b2tlbl9nZXRfYWxsKCRrb2RhcywgVE9LRU5fUEFSU0UpOwogICAgICRvWydzaW50YWtzZSddID0gaXNfYXJyYXkoJHQpID8gJ09LICgnLmNvdW50KCR0KS4nKScgOiAnS0xBSURBJzsKICAgICBpZihpc19hcnJheSgkdCkpewogICAgICAgJGYgPSAoZGVmaW5lZCgnV1BNVV9QTFVHSU5fRElSJyk/V1BNVV9QTFVHSU5fRElSOldQX0NPTlRFTlRfRElSLicvbXUtcGx1Z2lucycpLicvcGV0c2hvcC1yaW5raW5pYWkucGhwJzsKICAgICAgICRvWydzZW5hc19tZDUnXSA9IG1kNV9maWxlKCRmKTsKICAgICAgICRiZGlyID0gV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMnOwogICAgICAgaWYoIWlzX2RpcigkYmRpcikpIEB3cF9ta2Rpcl9wKCRiZGlyKTsKICAgICAgICRiYWsgPSAkYmRpci4nL3BldHNob3Atcmlua2luaWFpLicuZ21kYXRlKCdZbWQtSGlzJykuJy5iYWsucGhwJzsKICAgICAgICRvWydiYWsnXSA9IEBjb3B5KCRmLCRiYWspID8gYmFzZW5hbWUoJGJhaykgOiAnTkVQQVZZS08nOwogICAgICAgaWYoJG9bJ2JhayddIT09J05FUEFWWUtPJyl7CiAgICAgICAgICRvWydpcmFzeXRhJ10gPSBmaWxlX3B1dF9jb250ZW50cygkZiwka29kYXMpIT09ZmFsc2UgPyAnT0snOidORSc7CiAgICAgICAgIGNsZWFyc3RhdGNhY2hlKCk7ICRvWyduYXVqYXNfbWQ1J109bWQ1X2ZpbGUoJGYpOyAkb1snc3V0YW1wYSddPSgkb1snbmF1amFzX21kNSddPT09JGxhdWtpYW1hcyk7CiAgICAgICB9CiAgICAgfQogICB9CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'R209'};
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
  const kunas=JSON.stringify({name:'TEMP R209 Rinkiniai v1.29',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const rr=await fetch(WP+'/?ps_r209=GO'); const tt=await rr.text();
    try{ out.DEPLOY=JSON.parse(tt); }catch(e){ out.zalias=tt.slice(0,400); }
    await miegok(3000);
    /* patikra su prisijungimu: ar langas gyvas ir ar rodo siuksline */
    const d=await fetch(WP+'/wp-json/wp/v2/users/me',{headers:A}); out.auth=d.status;
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.deaktyvuota=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r209.json', Buffer.from(JSON.stringify(out,null,1)), 'r209 rinkiniai v1.29');
