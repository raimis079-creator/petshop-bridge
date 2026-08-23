process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfZGVwMjM1J10pIHx8ICRfR0VUWydwc19kZXAyMzUnXSE9PSdSVU4yMDI2MDgyMycpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJFQ9YXJyYXkoJ3YnPT4nREVQMjM1Jyk7CiAkZD1XUE1VX1BMVUdJTl9ESVI7ICRiYWs9JGQuJy9wcy1iYWNrdXAnOwogaWYoIWlzX2RpcigkYmFrKSl7IEBta2RpcigkYmFrLDA3NTUsdHJ1ZSk7IH0KICRrb2Rhcz1iYXNlNjRfZGVjb2RlKCdAQERFU0tAQCcpOwogJHI9YXJyYXkoJ2dhdXRhX21kNSc9Pm1kNSgka29kYXMpLCdiYWl0YWknPT5zdHJsZW4oJGtvZGFzKSk7CiB0cnl7IHRva2VuX2dldF9hbGwoJGtvZGFzLCBUT0tFTl9QQVJTRSk7ICRyWydzaW50YWtzZSddPSdvayc7IH0KIGNhdGNoKFxQYXJzZUVycm9yICRlKXsgJHJbJ3NpbnRha3NlJ109J0tMQUlEQTogJy4kZS0+Z2V0TWVzc2FnZSgpOyAkVFsnZGVzayddPSRyOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRULEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OyB9CiAkcD0kZC4nL3BldHNob3AtZGVzay5waHAnOwogJHJbJ3NlbmFfbWQ1J109bWQ1X2ZpbGUoJHApOwogJHJbJ2JhY2t1cCddPWNvcHkoJHAsJGJhay4nL3BldHNob3AtZGVzay5waHAuYmFrX2gyMzUnKTsKICRyWydpcmFzeXRhJ109KGJvb2wpZmlsZV9wdXRfY29udGVudHMoJHAsJGtvZGFzKTsKIGNsZWFyc3RhdGNhY2hlKHRydWUsJHApOwogJHJbJ25hdWphX21kNSddPW1kNV9maWxlKCRwKTsKICRyWydvayddPSgkclsnbmF1amFfbWQ1J109PT0kclsnZ2F1dGFfbWQ1J10pOwogJFRbJ2Rlc2snXT0kcjsKICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICcldHJhbnNpZW50JXBzX3J5dGFzJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK';
const out={v:'DEP235'};
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
let sid=null;
try{
  const desk=fs.readFileSync('deploy/petshop-desk.php.b64','utf8').trim();
  let kodas=Buffer.from(B64,'base64').toString('utf8').replace('@@DESK@@',desk);
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Deploy H235 v1 (desk 3.32)',code:kodas,scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id;
    await miegok(8000);
    const d=await fetch(WP+'/?ps_dep235=RUN20260823');
    const t=await d.text();
    try{ out.R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,600); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/dep235.json', Buffer.from(JSON.stringify(out,null,1)), 'DEP235');
