process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfcmVjMTAnXSkgfHwgJF9HRVRbJ3BzX3JlYzEwJ10hPT0nUlVOJykgcmV0dXJuOwogJFQ9YXJyYXkoJ3YnPT4nUkVDMTAnKTsKICRkPVdQTVVfUExVR0lOX0RJUjsKICRUWydkaXInXT0kZDsKIGZvcmVhY2goYXJyYXkoJ3BldHNob3AtYXYtZHJvcHNoaXAucGhwJywncGV0c2hvcC1kZXNrLnBocCcpIGFzICRmKXsKICAgJHA9JGQuJy8nLiRmOwogICAkVFsnZmFpbGFpJ11bJGZdPWFycmF5KCd5cmEnPT5maWxlX2V4aXN0cygkcCksJ2R5ZGlzJz0+ZmlsZV9leGlzdHMoJHApP2ZpbGVzaXplKCRwKTowLCdtZDUnPT5maWxlX2V4aXN0cygkcCk/bWQ1X2ZpbGUoJHApOicnKTsKIH0KICRUWydiYWtfZGlyJ109YXJyYXkoKTsKIGZvcmVhY2goKGFycmF5KWdsb2IoJGQuJy9wcy1iYWNrdXAvKi5iYWtfKicpIGFzICRiKXsgJFRbJ2Jha19kaXInXVtdPWJhc2VuYW1lKCRiKTsgfQogJFRbJ2Jha19raWVrJ109Y291bnQoJFRbJ2Jha19kaXInXSk7ICRUWydiYWtfZGlyJ109YXJyYXlfc2xpY2UoJFRbJ2Jha19kaXInXSwtNSk7CiAkVFsnc3JjX2Ryb3BzaGlwJ109YmFzZTY0X2VuY29kZShmaWxlX2dldF9jb250ZW50cygkZC4nL3BldHNob3AtYXYtZHJvcHNoaXAucGhwJykpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo=';
const out={v:'REC10'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Test Uzsakymai v15 (failu recon)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id;
    await miegok(6000);
    const d=await fetch(WP+'/?ps_rec10=RUN');
    const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
    try{ out.R=JSON.parse(await d.text()); }catch(e){ out.R='ne-json'; }
    const cookies=[];
    for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/rec10.json', Buffer.from(JSON.stringify(out,null,1)), 'REC10');
