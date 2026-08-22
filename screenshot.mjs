process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDIwMCddKSB8fCAkX0dFVFsncHNfaDIwMCddIT09J1JVTicpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRvID0gYXJyYXkoJ3YnPT4nSDIwMCcpOwogJHNhbmRlbGlhaSA9IGFycmF5KCdhdicsJ3ZmJywnemInLCdxdWF0dHJvJywncHJpbnMnLCdiZWxjb3JfdG9mdScsJ2FtYnJvc2lhJyk7CiAkZWlsID0gYXJyYXkoKTsKIGZvcmVhY2goJHNhbmRlbGlhaSBhcyAkcyl7CiAgICRwaWQgPSAoaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKAogICAgICJTRUxFQ1QgcC5JRCBGUk9NIHskd3BkYi0+cG9zdHN9IHAKICAgICAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBtIE9OIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnIEFORCBtLm1ldGFfdmFsdWU9JXMKICAgICAgTEVGVCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHN0IE9OIHN0LnBvc3RfaWQ9cC5JRCBBTkQgc3QubWV0YV9rZXk9J19zdG9jaycKICAgICAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogICAgICBPUkRFUiBCWSAoQ0FTVChJRk5VTEwoc3QubWV0YV92YWx1ZSwwKSBBUyBERUNJTUFMKDEwLDIpKT4wKSBERVNDLCBwLklEIEFTQyBMSU1JVCAxIiwgJHMpKTsKICAgaWYoISRwaWQpeyAkZWlsWyRzXT0nTkVSQVNUQSc7IGNvbnRpbnVlOyB9CiAgICRyID0gYXJyYXkoCiAgICAgJ2lkJz0+JHBpZCwKICAgICAncGF2Jz0+bWJfc3Vic3RyKGdldF90aGVfdGl0bGUoJHBpZCksMCwzOCksCiAgICAgJ3N0b2NrJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfc3RvY2snLHRydWUpLAogICAgICdvd24nPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19vd25fc3RvY2tfcXR5Jyx0cnVlKSwKICAgKTsKICAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FWX1NvdXJjZScpKXsKICAgICB0cnl7CiAgICAgICAkcmVzID0gUGV0c2hvcF9BVl9Tb3VyY2U6OnJlc29sdmUoJHBpZCwxKTsKICAgICAgICRyWydyZXNvbHZlJ10gPSBpc19hcnJheSgkcmVzKSA/IGFycmF5X2ludGVyc2VjdF9rZXkoJHJlcywgYXJyYXlfZmxpcChhcnJheSgnc291cmNlJywnY2FycmllcicsJ3JlYXNvbicsJ2F2X3F0eScpKSkgOiAkcmVzOwogICAgIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsncmVzb2x2ZV9rbGFpZGEnXSA9IG1iX3N1YnN0cigkZS0+Z2V0TWVzc2FnZSgpLDAsMTIwKTsgfQogICB9CiAgICRlaWxbJHNdPSRyOwogfQogJG9bJ2VpbHV0ZXMnXT0kZWlsOwogLyogZ3J1cGF2aW1hcyBpcyByZXNvbHZlIHJlenVsdGF0dSAqLwogJGdydXBlcz1hcnJheSgpOwogZm9yZWFjaCgkZWlsIGFzICRzPT4kcil7IGlmKGlzX2FycmF5KCRyKSYmaXNzZXQoJHJbJ3Jlc29sdmUnXVsnc291cmNlJ10pKSAkZ3J1cGVzWyRyWydyZXNvbHZlJ11bJ3NvdXJjZSddXT0xOyB9CiAkb1snZ3J1cGVzJ109YXJyYXlfa2V5cygkZ3J1cGVzKTsKICRvWydzaXVudHUnXT1jb3VudCgkZ3J1cGVzKTsKICRvWyd0aXBhcyddPSAoY291bnQoJGdydXBlcyk9PT0xKSA/IChpc3NldCgkZ3J1cGVzWydhdiddKT8nTUFJTic6J0RTJykgOiAnTUlYRUQnOwogLyogUGV0c2hvcF9BVl9Tb3VyY2UgbWV0b2R1IHBhcmFzYWkgKi8KIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9BVl9Tb3VyY2UnKSl7CiAgICRyYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0FWX1NvdXJjZScpOyAkbXM9YXJyYXkoKTsKICAgZm9yZWFjaCgkcmMtPmdldE1ldGhvZHMoKSBhcyAkbSl7CiAgICAgJHBzPWFycmF5KCk7IGZvcmVhY2goJG0tPmdldFBhcmFtZXRlcnMoKSBhcyAkcCl7JHBzW109JyQnLiRwLT5nZXROYW1lKCk7fQogICAgICRtc1tdPSRtLT5nZXROYW1lKCkuJygnLmltcGxvZGUoJywnLCRwcykuJyknOwogICB9CiAgICRvWydhdl9zb3VyY2VfbWV0b2RhaSddPSRtczsKIH0KIC8qIGt1ciByaWJvamFtaSBwcmlzdGF0eW1vIG1ldG9kYWkgKExQIHRpayBpcyBBVikgKi8KICRyaWI9YXJyYXkoKTsKIGZvcmVhY2goZ2xvYihXUF9DT05URU5UX0RJUi4nL211LXBsdWdpbnMvKi5waHAnKSBhcyAkZil7CiAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICAgaWYoc3RycG9zKCRjLCdwYWNrYWdlX3JhdGVzJykhPT1mYWxzZSB8fCBzdHJwb3MoJGMsJ3NoaXBwaW5nX21ldGhvZHMnKSE9PWZhbHNlKXsKICAgICAkcmliW109YmFzZW5hbWUoJGYpOwogICB9CiB9CiAkb1sncHJpc3RhdHltb19yaWJvamltb19mYWlsYWknXT0kcmliOwogLyogYXIgZGVzayBtYXRvIG1pc3J1OiBwYXNrdXRpbmlzIHJlYWx1cyB1enNha3ltYXMgc3UgX3BzX29yZGVyX3R5cGUgKi8KICRvWydwdnpfdXpzYWt5bWFpJ109JHdwZGItPmdldF9yZXN1bHRzKAogICAiU0VMRUNUIG8uaWQsIG9tLm1ldGFfdmFsdWUgdGlwYXMgRlJPTSB7JHdwZGItPnByZWZpeH13Y19vcmRlcnMgbwogICAgSk9JTiB7JHdwZGItPnByZWZpeH13Y19vcmRlcnNfbWV0YSBvbSBPTiBvbS5vcmRlcl9pZD1vLmlkIEFORCBvbS5tZXRhX2tleT0nX3BzX29yZGVyX3R5cGUnCiAgICBPUkRFUiBCWSBvLmlkIERFU0MgTElNSVQgMyIsIEFSUkFZX0EpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJG8sIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOwogZXhpdDsKfSk7Cg==';
const out={v:'H200'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'QQ H200 septyni sandeliai',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_h200=RUN');
    const t=await d.text();
    try{ out.REZ=JSON.parse(t); }catch(e){ out.REZ='ne-json: '+t.slice(0,300); }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h200.json', Buffer.from(JSON.stringify(out,null,1)), 'h200 septyniu sandeliu scenarijus');
