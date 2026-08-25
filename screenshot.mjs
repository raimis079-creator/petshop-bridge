process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI2OCddKSB8fCAkX0dFVFsncHNfaDI2OCddIT09J1JVTjIwMjYwODI1QicpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNjhBJyk7IGdsb2JhbCAkd3BkYjsKIC8vIHNhcmdvIGxvZ2FzIOKAlCBrdXIgamlzIHBhdHMgaW1hIGtsYWlkYXMKIGZvcmVhY2goZ2xvYignL2hvbWUvZ3l2dW5haTIvYmFja3Vwcy8qJykgYXMgJGYpeyAkVFsnYmFja3VwcyddW109YmFzZW5hbWUoJGYpLicgJy5maWxlc2l6ZSgkZik7IH0KIGZvcmVhY2goYXJyYXkoJy9ob21lL2d5dnVuYWkyL2RvbWFpbnMvcGV0c2hvcC5sdC9wdWJsaWNfaHRtbC93cC1jb250ZW50L2RlYnVnLmxvZycsJy9ob21lL2d5dnVuYWkyL2RvbWFpbnMvcGV0c2hvcC5sdC9wdWJsaWNfaHRtbC9lcnJvcl9sb2cnLCcvaG9tZS9neXZ1bmFpMi9kb21haW5zL3BldHNob3AubHQvbG9ncy9lcnJvci5sb2cnLCcvaG9tZS9neXZ1bmFpMi8ubG9ncy9lcnJvci5sb2cnLCcvaG9tZS9neXZ1bmFpMi9kb21haW5zL3BldHNob3AubHQvcHVibGljX2h0bWwvcGhwX2Vycm9ybG9nJykgYXMgJGMpeyBpZihmaWxlX2V4aXN0cygkYykpICRUWydyYXN0aSddW109JGMuJyAnLmZpbGVzaXplKCRjKTsgfQogZm9yZWFjaChnbG9iKCcvaG9tZS9neXZ1bmFpMi9kb21haW5zL3BldHNob3AubHQvbG9ncy8qJykgYXMgJGYpICRUWydsb2dzX2RpciddW109YmFzZW5hbWUoJGYpLicgJy5maWxlc2l6ZSgkZik7CiBmb3JlYWNoKGdsb2IoJy9ob21lL2d5dnVuYWkyLyoubG9nJykgYXMgJGYpICRUWydob21lX2xvZ3MnXVtdPWJhc2VuYW1lKCRmKS4nICcuZmlsZXNpemUoJGYpOwogJFRbJ2luaSddPWFycmF5KCdlcnJvcl9sb2cnPT5pbmlfZ2V0KCdlcnJvcl9sb2cnKSwnbG9nX2Vycm9ycyc9PmluaV9nZXQoJ2xvZ19lcnJvcnMnKSwnd3BfZGVidWdfbG9nJz0+ZGVmaW5lZCgnV1BfREVCVUdfTE9HJyk/V1BfREVCVUdfTE9HOiduZWRlZicpOwogLy8gc25pcHBldHUgZWlsdWNpdSAyMS80NS80Ni80NyB0dXJpbnlzIFZJU1VPU0UgYWt0eXZpdW9zZQogZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGNvZGUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBhY3RpdmU9MSIpIGFzICRzKXsKICAkTD1leHBsb2RlKCJcbiIsJHMtPmNvZGUpOyAkaD1hcnJheSgpOwogIGZvcmVhY2goYXJyYXkoMjEsNDUsNDYsNDcpIGFzICRuKXsgJGw9dHJpbSgkTFskbi0xXT8/JycpOyBpZigkbCE9PScnKSAkaFskbl09bWJfc3Vic3RyKCRsLDAsMTEwKTsgfQogICRUWydlaWwnXVskcy0+aWQuJyAnLm1iX3N1YnN0cigkcy0+bmFtZSwwLDQyKV09JGg7CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LDUpOwo='; const SHA='61db6827a123456d4d7cfe862fd451f87716b138';
const MD5={"petshop-rinkiniai.php": "5f79ff63ffe2e57cee87129b41e0ca32"};
const out={v:'H268A'};
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
  const d=await fx(WP+'/?ps_h268=RUN20260825B',{},'recon'); const tx=await d.text(); try{ out.r=JSON.parse(tx); }catch(e){ out.r='ne-json'; out.raw=tx.slice(0,600); }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h268run.json', Buffer.from(JSON.stringify(out,null,1)), 'H268A');
