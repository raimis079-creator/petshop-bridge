process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaW52OSddKSB8fCAkX0dFVFsncHNfaW52OSddIT09J1JVTicpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0lOVjknKTsKICRmPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy93Y2RuL2ludm9pY2UvSW52b2ljZSAtMzUwNTQtZDgzNzA1OWZkYmI4MzFmMGI3YjhmYzMyLnBkZic7CiAkVFsneXJhJ109ZmlsZV9leGlzdHMoJGYpOwogaWYoJFRbJ3lyYSddKXsgJFRbJ2I2NCddPWJhc2U2NF9lbmNvZGUoZmlsZV9nZXRfY29udGVudHMoJGYpKTsgJFRbJ2JhaXRhaSddPWZpbGVzaXplKCRmKTsgfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCA1KTsK';
const out={v:'INV9'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP INV Pull v1 (PDF i repo)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_inv9=RUN');
    const t=await d.text();
    let R=null; try{ R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,600); }
    if(R){ if(R.b64){ out.put=await put('screenshots/inv_test.pdf', Buffer.from(R.b64,'base64'), 'PDF testas'); delete R.b64; } out.R=R; }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/inv9.json', Buffer.from(JSON.stringify(out,null,1)), 'INV9');
