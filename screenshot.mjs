process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaW52NCddKSB8fCAkX0dFVFsncHNfaW52NCddIT09J1JVTicpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0lOVjQnKTsKICRwZD1XUF9QTFVHSU5fRElSLicvd29vY29tbWVyY2UtZGVsaXZlcnktbm90ZXMnOwogJGc9ZnVuY3Rpb24oJHJlbCkgdXNlICgkcGQsJiRUKXsKICAgJHA9JHBkLicvJy4kcmVsOwogICBpZighZmlsZV9leGlzdHMoJHApKXsgcmV0dXJuICdORVJBJzsgfQogICByZXR1cm4gZmlsZV9nZXRfY29udGVudHMoJHApOwogfTsKICRwZGY9JGcoJ2luY2x1ZGVzL3NlcnZpY2VzL2NsYXNzLXBkZi5waHAnKTsKICRUWydwZGZfZHlkaXMnXT1pc19zdHJpbmcoJHBkZik/c3RybGVuKCRwZGYpOjA7CiBpZihpc19zdHJpbmcoJHBkZikmJiRwZGYhPT0nTkVSQScpewogICBwcmVnX21hdGNoX2FsbCgnL15ccyooPzpwdWJsaWN8cHJvdGVjdGVkfHByaXZhdGV8c3RhdGljfCApKmZ1bmN0aW9uXHMrXHcrXHMqXChbXildKlwpLiokL20nLCRwZGYsJG0pOwogICAkVFsncGRmX21ldG9kYWknXT0kbVswXTsKICAgcHJlZ19tYXRjaCgnLyhuYW1lc3BhY2VbXjtdKzspLycsJHBkZiwkbnMpOyAkVFsncGRmX25zJ109aXNzZXQoJG5zWzFdKT8kbnNbMV06Jyc7CiAgIHByZWdfbWF0Y2hfYWxsKCcvXi4qKHdjZG5cL3xmaWxlX25hbWV8YmFzZW5hbWV8XCRwYXRofGlzUmVtb3RlRW5hYmxlZHxzZXRcdypDaHJvb3R8c2V0SXNSZW1vdGVFbmFibGVkfE9wdGlvbnNcKHwtPnNldFwoKS4qJC9taScsJHBkZiwkbTIpOwogICAkVFsncGRmX2thX2Rhcm8nXT1hcnJheV9zbGljZShhcnJheV91bmlxdWUoJG0yWzBdKSwwLDQwKTsKIH0KICRmcj0kZygnaW5jbHVkZXMvZnJvbnRlbmQvY2xhc3MtZnJvbnRlbmQucGhwJyk7CiBpZihpc19zdHJpbmcoJGZyKSYmJGZyIT09J05FUkEnKXsKICAgcHJlZ19tYXRjaF9hbGwoJy9eLiood3BfYWpheHxhZGRfYWN0aW9uXChccyoud3BfYWpheHxnZW5lcmF0ZXxQZGY6OnxQREY6Onw6OmdlbmVyYXRlfHBkZl9maWxlfHdwX3NlbmRfanNvbikuKiQvbWknLCRmciwkbTMpOwogICAkVFsnZnJvbnRlbmRfcGRmJ109YXJyYXlfc2xpY2UoYXJyYXlfdW5pcXVlKCRtM1swXSksMCw0MCk7CiB9CiAkdHBsPSRnKCdpbmNsdWRlcy9hcGkvY2xhc3MtdGVtcGxhdGVzLnBocCcpOwogaWYoaXNfc3RyaW5nKCR0cGwpJiYkdHBsIT09J05FUkEnKXsKICAgcHJlZ19tYXRjaF9hbGwoJy9eLioobG9nb3xzaG9wXFspLiokL21pJywkdHBsLCRtNCk7CiAgICRUWyd0ZW1wbGF0ZXNfbG9nbyddPWFycmF5X3NsaWNlKGFycmF5X3VuaXF1ZSgkbTRbMF0pLDAsMzApOwogfQogJHJlbmQ9JGcoJ2luY2x1ZGVzL3NlcnZpY2VzL3RlbXBsYXRlL2NsYXNzLXRlbXBsYXRlLXJlbmRlcmVyLnBocCcpOwogaWYoaXNfc3RyaW5nKCRyZW5kKSYmJHJlbmQhPT0nTkVSQScpewogICBwcmVnX21hdGNoX2FsbCgnL14uKihsb2dvX3BhdGh8XCRzaG9wfGxvZ28pLiokL21pJywkcmVuZCwkbTUpOwogICAkVFsncmVuZGVyZXJfbG9nbyddPWFycmF5X3NsaWNlKGFycmF5X3VuaXF1ZSgkbTVbMF0pLDAsMzApOwogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCA1KTsK';
const out={v:'INV4'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP INV Recon v2 (pdf servisas)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_inv4=RUN');
    const t=await d.text();
    try{ out.R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,800); }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/inv4.json', Buffer.from(JSON.stringify(out,null,1)), 'INV4 pdf servisas');
