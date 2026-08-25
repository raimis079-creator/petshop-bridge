process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI3MCddKSB8fCAkX0dFVFsncHNfaDI3MCddIT09J1JVTjIwMjYwODI1RCcpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNzBBJyk7CiBmb3JlYWNoKGFycmF5KCcvaG9tZS9neXZ1bmFpMi9iYWNrdXBzL3BzLWJhY2t1cC5waHAnLCcvaG9tZS9neXZ1bmFpMi9iYWNrdXBzL3BzLWJhY2t1cC13YXRjaC5waHAnKSBhcyAkZil7CiAgaWYoIWZpbGVfZXhpc3RzKCRmKSkgY29udGludWU7ICRzPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgJGI9YmFzZW5hbWUoJGYpOwogIGZvcmVhY2goZXhwbG9kZSgiXG4iLCRzKSBhcyAkbj0+JGwpewogICBpZihwcmVnX21hdGNoKCcvc3V2ZXN0aW58S0xBSURPU3xEQVpOSUFVU0lPU3xkZXByZWNhdGVkfGVycm9yX2xvZ3xcLmxvZ3xsb2dzfGdsb2JcKHxwcmVnX21hdGNoLipQSFAgfGZhdGFsfENST04vaScsJGwpKSAkVFskYl1bXT0oJG4rMSkuJzogJy50cmltKG1iX3N1YnN0cigkbCwwLDE2MCkpOwogIH0KICAkVFskYi4nX2VpbCddPXN1YnN0cl9jb3VudCgkcywiXG4iKTsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0sNSk7Cg=='; const SHA='61db6827a123456d4d7cfe862fd451f87716b138';
const MD5={"petshop-rinkiniai.php": "5f79ff63ffe2e57cee87129b41e0ca32"};
const out={v:'H270A'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H267 v1 (log+snippet recon)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h270=RUN20260825D',{},'recon'); const tx=await d.text(); try{ out.r=JSON.parse(tx); }catch(e){ out.r='ne-json'; out.raw=tx.slice(0,600); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h270run.json', Buffer.from(JSON.stringify(out,null,1)), 'H270A');
