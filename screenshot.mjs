process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfcmVjMyddKSB8fCAkX0dFVFsncHNfcmVjMyddIT09J1JVTicpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J1JFQzMnKTsKICRmPVdQX1BMVUdJTl9ESVIuJy93Yy12ZW5pcGFrLXNoaXBwaW5nL2luY2x1ZGVzL3ZlbmlwYWstZmV0Y2gtcGlja3Vwcy5waHAnOwogJFRbJ3NyYyddPWZpbGVfZXhpc3RzKCRmKT9maWxlX2dldF9jb250ZW50cygkZik6J05FUkEnOwogJFRbJ2Z1bmtjaWpvcyddPWFycmF5KCk7CiBmb3JlYWNoKGdldF9kZWZpbmVkX2Z1bmN0aW9ucygpWyd1c2VyJ10gYXMgJGZuKXsgaWYoc3RyaXBvcygkZm4sJ3ZlbmlwYWsnKSE9PWZhbHNlKXsKICAgJHI9bmV3IFJlZmxlY3Rpb25GdW5jdGlvbigkZm4pOwogICAkVFsnZnVua2Npam9zJ11bXT0kZm4uJygnLiRyLT5nZXROdW1iZXJPZlJlcXVpcmVkUGFyYW1ldGVycygpLicvJy4kci0+Z2V0TnVtYmVyT2ZQYXJhbWV0ZXJzKCkuJykgJy5iYXNlbmFtZSgkci0+Z2V0RmlsZU5hbWUoKSk7CiB9fQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo=';
const out={v:'REC3'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Rec Uzsakymai v3 (fetch-pickups src)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_rec3=RUN');
    const t=await d.text();
    try{ out.R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,800); }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/rec3.json', Buffer.from(JSON.stringify(out,null,1)), 'REC3');
