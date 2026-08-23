process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfcmVjNiddKSB8fCAkX0dFVFsncHNfcmVjNiddIT09J1JVTicpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J1JFQzYnKTsKIGZvcmVhY2goYXJyYXkoMzUwNjUsMzUwNjYsMzUwNTkpIGFzICRpZCl7CiAgICRvPXdjX2dldF9vcmRlcigkaWQpOyBpZighJG8pIGNvbnRpbnVlOwogICAkZT1hcnJheSgpOwogICBmb3JlYWNoKCRvLT5nZXRfaXRlbXMoKSBhcyAkaWlkPT4kaXQpewogICAgICRlW109YXJyYXkoJ2lpZCc9PiRpaWQsJ3BpZCc9PiRpdC0+Z2V0X3Byb2R1Y3RfaWQoKSwnX3BzX3NvdXJjZSc9PiRpdC0+Z2V0X21ldGEoJ19wc19zb3VyY2UnKSwKICAgICAgICdwYXYnPT5tYl9zdWJzdHIoJGl0LT5nZXRfbmFtZSgpLDAsMzApKTsKICAgfQogICAkVFsndXpzYWt5bWFpJ11bJGlkXT1hcnJheSgnZWlsdXRlcyc9PiRlLCdkc19zZW50Jz0+JG8tPmdldF9tZXRhKCdfcHNfZHJvcHNoaXBfc2VudCcpLAogICAgICdzdG9ja19yZWR1Y2VkJz0+JG8tPmdldF9tZXRhKCdfb3JkZXJfc3RvY2tfcmVkdWNlZCcpLAogICAgICdzaXVudG9zX2RhdGEnPT4kby0+Z2V0X21ldGEoJ3ZlbmlwYWtfc2hpcHBpbmdfb3JkZXJfZGF0YScpPyd5cmEnOiduZXJhJyk7CiB9CiBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfQVZfRHJvcHNoaXAnKSl7CiAgICRybT1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9BVl9Ecm9wc2hpcCcsJ2dydXB1b3RpJyk7ICRybS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICAgJGc9JHJtLT5pbnZva2UobnVsbCxhcnJheSgzNTA2NSwzNTA2NiwzNTA1OSkpOwogICAkVFsnZ3J1cHVvdGknXT1hcnJheSgpOwogICBmb3JlYWNoKCRnIGFzICRzcmM9PiR1eil7ICRUWydncnVwdW90aSddWyRzcmNdPWFycmF5X2tleXMoJHV6KTsgfQogfSBlbHNlIHsgJFRbJ2dydXB1b3RpJ109J2tsYXNlcyBuZXJhJzsgfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo=';
const out={v:'REC6'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Test Uzsakymai v8 (misraus eigos recon)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id;
    await miegok(6000);
    const d=await fetch(WP+'/?ps_rec6=RUN');
    const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
    try{ out.R=JSON.parse(await d.text()); }catch(e){ out.R='ne-json'; }
    const cookies=[];
    for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/rec6.json', Buffer.from(JSON.stringify(out,null,1)), 'REC6');
