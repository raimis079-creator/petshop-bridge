process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfZGVwMjM0J10pIHx8ICRfR0VUWydwc19kZXAyMzQnXSE9PSdSVU4yMDI2MDgyMycpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0RFUDIzNCcpOwogJGQ9V1BNVV9QTFVHSU5fRElSOwogJGJhaz0kZC4nL3BzLWJhY2t1cCc7CiBpZighaXNfZGlyKCRiYWspKXsgQG1rZGlyKCRiYWssMDc1NSx0cnVlKTsgfQogJFRbJ2Jha19kaXJfeXJhJ109aXNfZGlyKCRiYWspOwogJGZhaWxhaT1hcnJheSgncGV0c2hvcC1kZXNrLnBocCc9PidAQERFU0tAQCcsJ3BldHNob3AtYXYtZHJvcHNoaXAucGhwJz0+J0BARFJPUEBAJyk7CiBmb3JlYWNoKCRmYWlsYWkgYXMgJGY9PiRiNjQpewogICAka29kYXM9YmFzZTY0X2RlY29kZSgkYjY0KTsKICAgJHI9YXJyYXkoJ2dhdXRhX21kNSc9Pm1kNSgka29kYXMpLCdiYWl0YWknPT5zdHJsZW4oJGtvZGFzKSk7CiAgIHRyeXsgdG9rZW5fZ2V0X2FsbCgka29kYXMsIFRPS0VOX1BBUlNFKTsgJHJbJ3NpbnRha3NlJ109J29rJzsgfQogICBjYXRjaChcUGFyc2VFcnJvciAkZSl7ICRyWydzaW50YWtzZSddPSdLTEFJREE6ICcuJGUtPmdldE1lc3NhZ2UoKTsgJFRbJGZdPSRyOyBjb250aW51ZTsgfQogICAkcD0kZC4nLycuJGY7CiAgICRyWydzZW5hX21kNSddPW1kNV9maWxlKCRwKTsKICAgJHJbJ2JhY2t1cCddPWNvcHkoJHAsJGJhay4nLycuJGYuJy5iYWtfaDIzNCcpOwogICAkclsnaXJhc3l0YSddPShib29sKWZpbGVfcHV0X2NvbnRlbnRzKCRwLCRrb2Rhcyk7CiAgIGNsZWFyc3RhdGNhY2hlKHRydWUsJHApOwogICAkclsnbmF1amFfbWQ1J109bWQ1X2ZpbGUoJHApOwogICAkclsnb2snXT0oJHJbJ25hdWphX21kNSddPT09JHJbJ2dhdXRhX21kNSddKTsKICAgJFRbJGZdPSRyOwogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo=';
const out={v:'DEP234'};
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
  const drop=fs.readFileSync('deploy/petshop-av-dropship.php.b64','utf8').trim();
  out.dydziai={desk:desk.length,drop:drop.length};
  let kodas=Buffer.from(B64,'base64').toString('utf8');
  kodas=kodas.replace('@@DESK@@',desk).replace('@@DROP@@',drop);
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Deploy H234 v1 (desk 3.31 + dropship 1.8)',code:kodas,scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id;
    await miegok(8000);
    const d=await fetch(WP+'/?ps_dep234=RUN20260823');
    const t=await d.text();
    try{ out.R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,600); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/dep234.json', Buffer.from(JSON.stringify(out,null,1)), 'DEP234');
