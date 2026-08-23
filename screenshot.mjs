process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfcmVjMSddKSB8fCAkX0dFVFsncHNfcmVjMSddIT09J1JVTicpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJFQ9YXJyYXkoJ3YnPT4nUkVDMScpOwogJFRbJ21ldG9kYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpbnN0YW5jZV9pZCxtZXRob2RfaWQsem9uZV9pZCxpc19lbmFibGVkIEZST00geyR3cGRiLT5wcmVmaXh9d29vY29tbWVyY2Vfc2hpcHBpbmdfem9uZV9tZXRob2RzIE9SREVSIEJZIHpvbmVfaWQsaW5zdGFuY2VfaWQiLEFSUkFZX0EpOwogZm9yZWFjaCgkVFsnbWV0b2RhaSddIGFzICRpPT4kbSl7CiAgICRzPWdldF9vcHRpb24oJ3dvb2NvbW1lcmNlXycuJG1bJ21ldGhvZF9pZCddLidfJy4kbVsnaW5zdGFuY2VfaWQnXS4nX3NldHRpbmdzJyk7CiAgICRUWydtZXRvZGFpJ11bJGldWyd0aXRsZSddPShpc19hcnJheSgkcykmJmlzc2V0KCRzWyd0aXRsZSddKSk/JHNbJ3RpdGxlJ106Jyc7CiB9CiAkVFsnb3BjaWpvcyddPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1Qgb3B0aW9uX25hbWUgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyV2ZW5pcGFrJScgTElNSVQgMTAwIik7CiAkVFsnbGVudGVsZXMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAnJXZlbmlwYWslJyIpOwogJFRbJ2xlbnRlbGVzX3BpY2t1cCddPSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICclcGlja3VwJSciKTsKICRUWydwbHVnaW5haSddPWFycmF5KCk7CiBmb3JlYWNoKChhcnJheSlnbG9iKFdQX1BMVUdJTl9ESVIuJy8qZW5pcGFrKicpIGFzICRwKSAkVFsncGx1Z2luYWknXVtdPWJhc2VuYW1lKCRwKTsKICR0PSR3cGRiLT5wcmVmaXguJ3BzX3NvdXJjZXMnOwogJFRbJ3BzX3NvdXJjZXNfY29scyddPSR3cGRiLT5nZXRfY29sKCJERVNDUklCRSAkdCIsMCk7CiAkVFsnbWV0YV9xdHknXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIERJU1RJTkNUIG1ldGFfa2V5IEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgbWV0YV9rZXkgTElLRSAnJXF0eSUnIExJTUlUIDQwIik7CiAkVFsndXpzYWt5bXUnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wcmVmaXh9d2Nfb3JkZXJzIik7CiAkVFsna2xhc2VzJ109YXJyYXkoJ0FWX1NvdXJjZSc9PmNsYXNzX2V4aXN0cygnUGV0c2hvcF9BVl9Tb3VyY2UnKSwnRGVzayc9PmNsYXNzX2V4aXN0cygnUGV0c2hvcF9EZXNrJykpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo=';
const out={v:'REC1'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Rec Uzsakymai v1 (recon)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_rec1=RUN');
    const t=await d.text();
    try{ out.R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,800); }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/rec1.json', Buffer.from(JSON.stringify(out,null,1)), 'REC1');
