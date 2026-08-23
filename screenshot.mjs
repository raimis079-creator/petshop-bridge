process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfcmVjMTQnXSkgfHwgJF9HRVRbJ3BzX3JlYzE0J10hPT0nUlVOJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkVD1hcnJheSgndic9PidSRUMxNCcpOwogJHJlPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0Rlc2snLCdlaWxlJyk7ICRyZS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICRydj1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9EZXNrJywndnlrZHltYXMnKTsgJHJ2LT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogJHJzPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0Rlc2snLCdzYWx0aW5pYWknKTsgJHJzLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogJHJsPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0Rlc2snLCdlaWx1dGVzX3NhbHRpbmlzJyk7ICRybC0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKCiAvKiB2aXNpIG5lLXRlc3RpbmlhaSB1enNha3ltYWkgKi8KICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBvLmlkIEZST00geyR3cGRiLT5wcmVmaXh9d2Nfb3JkZXJzIG8KICAgV0hFUkUgby5zdGF0dXMgTk9UIElOICgndHJhc2gnLCdhdXRvLWRyYWZ0JykKICAgICBBTkQgby5pZCBOT1QgSU4gKFNFTEVDVCBvcmRlcl9pZCBGUk9NIHskd3BkYi0+cHJlZml4fXdjX29yZGVyc19tZXRhIFdIRVJFIG1ldGFfa2V5PSdfcHNfdGVzdGluaXMnKQogICBPUkRFUiBCWSBvLmlkIERFU0MgTElNSVQgNDAiKTsKICRUWydzZW5pX2tpZWsnXT1jb3VudCgkaWRzKTsKIGZvcmVhY2goJGlkcyBhcyAkaWQpewogICAkbz13Y19nZXRfb3JkZXIoJGlkKTsgaWYoISRvKSBjb250aW51ZTsKICAgJG1ldGE9MDsgJHZpc289MDsgJHNyYz1hcnJheSgpOwogICBmb3JlYWNoKCRvLT5nZXRfaXRlbXMoKSBhcyAkaXQpeyAkdmlzbysrOyBpZigkaXQtPmdldF9tZXRhKCdfcHNfc291cmNlJykpICRtZXRhKys7ICRzPSRybC0+aW52b2tlKG51bGwsJGl0KTsgaWYoJHMpICRzcmNbJHNdPTE7IH0KICAgJHNhbD0kcnMtPmludm9rZShudWxsLCRvKTsKICAgJFRbJ3NlbmknXVskaWRdPWFycmF5KAogICAgICdkYXRhJz0+JG8tPmdldF9kYXRlX2NyZWF0ZWQoKT8kby0+Z2V0X2RhdGVfY3JlYXRlZCgpLT5kYXRlKCdZLW0tZCcpOicnLAogICAgICdidXNlbmEnPT4kby0+Z2V0X3N0YXR1cygpLAogICAgICdlaWx1dGVzX3N1X21ldGEnPT4kbWV0YS4nLycuJHZpc28sCiAgICAgJ3NhbHRpbmlhaSc9PiRzYWwsCiAgICAgJ3Z5a2R5bWFzJz0+JHJ2LT5pbnZva2UobnVsbCwkbylbMF0sCiAgICAgJ2VpbGUnPT4kcmUtPmludm9rZShudWxsLCRvKSwKICAgICAnc3ByZW5kaW1hcyc9PiRvLT5nZXRfbWV0YSgnX3BzX21pc3J1c19zcHJlbmRpbWFzJyk/OifigJQnLAogICApOwogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo=';
const out={v:'REC14'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Recon H239 v1 (seni misrus)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id; await miegok(6000);
    const d=await fetch(WP+'/?ps_rec14=RUN');
    const t=await d.text();
    try{ out.R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,400); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600); }
await put('screenshots/rec14.json', Buffer.from(JSON.stringify(out,null,1)), 'REC14');
