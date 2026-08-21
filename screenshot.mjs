process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIyMyddKSA/ICRfR0VUWydwc19yMjIzJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKICRvID0gYXJyYXkoJ3YnPT4nUjIyMycpOwogJGYgPSBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwvcGV0c2hvcC14bWwucGhwJzsKICRlaWwgPSBAZmlsZSgkZik7CiBpZigkZWlsKXsKICAgJG9bJ2tvbnRla3N0YXMnXSA9IGFycmF5KCk7CiAgIGZvcmVhY2gocmFuZ2UoMzc1LCA0NzApIGFzICRuKXsgaWYoaXNzZXQoJGVpbFskbi0xXSkpICRvWydrb250ZWtzdGFzJ11bJG5dID0gcnRyaW0oJGVpbFskbi0xXSk7IH0KICAgLyoga3VyIGRhciBuYXVkb2phbWFzIHRva3MgcGF0IChzdHJpbmcpIGNhc3QgaXMgJGRhdGEgKi8KICAgJG9bJ3BhbmFzdXMnXSA9IGFycmF5KCk7CiAgIGZvcmVhY2goJGVpbCBhcyAkaT0+JHQpewogICAgIGlmKHByZWdfbWF0Y2goJy9cKHN0cmluZ1wpXHMqXChccypcJGRhdGFcWy8nLCAkdCkpICRvWydwYW5hc3VzJ11bJGkrMV0gPSB0cmltKCR0KTsKICAgfQogfQogJG9bJ21kNSddID0gQG1kNV9maWxlKCRmKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'R223'};
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
  const kunas=JSON.stringify({name:'ZZ R223 XML eilutes',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const rr=await fetch(WP+'/?ps_r223=GO'); const tt=await rr.text();
    try{ out.DUOM=JSON.parse(tt); }catch(e){ out.zalias=tt.slice(0,400); }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r223.json', Buffer.from(JSON.stringify(out,null,1)), 'r223 xml eilutes');
