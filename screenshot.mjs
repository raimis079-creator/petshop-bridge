process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI0OCddKSB8fCAkX0dFVFsncHNfaDI0OCddIT09J1JFQzIwMjYwODI0UycpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNDhSJyk7CiAkbj0oYXJyYXkpZ2V0X29wdGlvbignc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfc2V0dGluZ3MnLGFycmF5KCkpOwogJG91dD1hcnJheSgpOwogZm9yZWFjaCgkbiBhcyAkaz0+JHYpewogIGlmKHN0cmlwb3MoJGssJ3Bhc3MnKSE9PWZhbHNlKXsgJG91dFska109JyhzbGVwdGEpJzsgY29udGludWU7IH0KICBpZihpc19hcnJheSgkdikpIHsgJG91dFska109JyhtYXN5dmFzKSc7IGNvbnRpbnVlOyB9CiAgaWYoc3RyaXBvcygkaywnc2VuZGVyJykhPT1mYWxzZSB8fCBzdHJpcG9zKCRrLCd1c2VyaWQnKSE9PWZhbHNlIHx8IHN0cmlwb3MoJGssJ21hbmlmZXN0JykhPT1mYWxzZQogICAgIHx8IHN0cmlwb3MoJGssJ2xhYmVsJykhPT1mYWxzZSB8fCBzdHJpcG9zKCRrLCd1c2VybmFtZScpIT09ZmFsc2UpICRvdXRbJGtdPShzdHJpbmcpJHY7CiB9CiAkVFsnc2VuZGVyJ109JG91dDsKICRUWyd2aXNpX3Jha3RhaSddPWFycmF5X2tleXMoJG4pOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg==';
const out={v:'H248R'};
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
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H248 recon sender',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){ sid=j.id; await miegok(9000);
    const d=await fx(WP+'/?ps_h248=REC20260824S',{},'rec');
    const tx=await d.text(); try{ out.R=JSON.parse(tx); }catch(e){ out.R='ne-json: '+tx.slice(0,300); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h248.json', Buffer.from(JSON.stringify(out,null,1)), 'H248R');
