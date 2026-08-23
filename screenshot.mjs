process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfZml4MyddKSB8fCAkX0dFVFsncHNfZml4MyddIT09J1JVTjIwMjYwODIzJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkVD1hcnJheSgndic9PidGSVgzJyk7CiBhZGRfZmlsdGVyKCdwcmVfd3BfbWFpbCcsJ19fcmV0dXJuX2ZhbHNlJyw5OTkpOwogJHJtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0Rlc2snLCdrbGF1c2ltYXMnKTsgJHJtLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogJHQ9JHdwZGItPnByZWZpeC4ncHNfc291cmNlcyc7CgogLyogQVYga2FuZGlkYXRhaSBzdSByZWFsaXUgbGlrdWNpdSA+PTMgKi8KICRrYW5kPWFycmF5KCk7CiAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzLnByb2R1Y3RfaWQgRlJPTSAkdCBzCiAgIEpPSU4geyR3cGRiLT5wb3N0c30gcCBPTiBwLklEPXMucHJvZHVjdF9pZAogICBXSEVSRSBzLnNvdXJjZT0nYXYnIEFORCBzLmlzX3NlbGxhYmxlPTEgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwLnBvc3RfdHlwZT0ncHJvZHVjdCcKICAgICBBTkQgKFNFTEVDVCBDT1VOVCgqKSBGUk9NICR0IHMyIFdIRVJFIHMyLnByb2R1Y3RfaWQ9cy5wcm9kdWN0X2lkKT0xCiAgIE9SREVSIEJZIHMuc3RvY2tfcXR5IERFU0MgTElNSVQgNjAiLCBBUlJBWV9BKTsKIGZvcmVhY2goJHJvd3MgYXMgJHIpewogICAkcGlkPShpbnQpJHJbJ3Byb2R1Y3RfaWQnXTsgJHByPXdjX2dldF9wcm9kdWN0KCRwaWQpOwogICBpZighJHByIHx8ICEkcHItPmdldF9wcmljZSgpKSBjb250aW51ZTsKICAgJHJzPVBldHNob3BfQVZfU291cmNlOjpyZXNvbHZlKCRwaWQsMyk7CiAgIGlmKCFlbXB0eSgkcnNbJ2F2X3V6dGVua2EnXSkgJiYgJHJzWydzb3VyY2UnXT09PSdhdicpewogICAgICRrYW5kW109YXJyYXkoJ2lkJz0+JHBpZCwncGF2Jz0+bWJfc3Vic3RyKCRwci0+Z2V0X25hbWUoKSwwLDUwKSwna2FpbmEnPT4kcHItPmdldF9wcmljZSgpLCdhdic9PiRyc1snYXZfcXR5J10pOwogICB9CiAgIGlmKGNvdW50KCRrYW5kKT49NikgYnJlYWs7CiB9CiAkVFsna2FuZGlkYXRhaSddPSRrYW5kOwogaWYoY291bnQoJGthbmQpPDMpeyAkVFsnbnV0cmF1a3RhJ109J3BlciBtYXphaSBBViBrYW5kaWRhdHUnOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRULEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OyB9CgogJHBsYW5hcz1hcnJheSgKICAgMzUwNTY9PmFycmF5KGFycmF5KCRrYW5kWzBdWydpZCddLDIpLGFycmF5KCRrYW5kWzFdWydpZCddLDEpKSwKICAgMzUwNTc9PmFycmF5KGFycmF5KCRrYW5kWzJdWydpZCddLDMpKSwKICk7CiBmb3JlYWNoKCRwbGFuYXMgYXMgJGlkPT4kcHJla2VzKXsKICAgJG89d2NfZ2V0X29yZGVyKCRpZCk7IGlmKCEkbykgY29udGludWU7CiAgIGZvcmVhY2goJG8tPmdldF9pdGVtcygpIGFzICRpaWQ9PiRpdCl7ICRvLT5yZW1vdmVfaXRlbSgkaWlkKTsgfQogICBmb3JlYWNoKCRwcmVrZXMgYXMgJHApeyAkby0+YWRkX3Byb2R1Y3Qod2NfZ2V0X3Byb2R1Y3QoJHBbMF0pLCRwWzFdKTsgfQogICAkby0+Y2FsY3VsYXRlX3RvdGFscyh0cnVlKTsKICAgLyogc2l1bnRvcyBrYWluYSBwYWdhbCBudXN0YXR5bXVzICovCiAgICRpbmNsPTA7IGZvcmVhY2goJG8tPmdldF9pdGVtcygpIGFzICRpdCl7ICRpbmNsKz0oZmxvYXQpJGl0LT5nZXRfdG90YWwoKSsoZmxvYXQpJGl0LT5nZXRfdG90YWxfdGF4KCk7IH0KICAgJHNoPSRvLT5nZXRfaXRlbXMoJ3NoaXBwaW5nJyk7ICRzaT1yZXNldCgkc2gpOwogICAkbWlkPSRzaS0+Z2V0X21ldGhvZF9pZCgpOwogICAkZmVlPShmYWxzZSE9PXN0cnBvcygkbWlkLCdjb3VyaWVyJykpPzMuMzA6KCgkaW5jbD49MzApPzAuMDoxLjc4KTsKICAgJHNpLT5zZXRfdG90YWwoJGZlZT4wP3JvdW5kKCRmZWUvMS4yMSw2KTowKTsgJHNpLT5zZXRfdGF4ZXMoYXJyYXkoKSk7ICRzaS0+c2F2ZSgpOwogICAkby0+Y2FsY3VsYXRlX3RheGVzKCk7ICRvLT5jYWxjdWxhdGVfdG90YWxzKHRydWUpOyAkby0+c2F2ZSgpOwogfQoKICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBvcmRlcl9pZCBGUk9NIHskd3BkYi0+cHJlZml4fXdjX29yZGVyc19tZXRhIFdIRVJFIG1ldGFfa2V5PSdfcHNfdGVzdGluaXMnIE9SREVSIEJZIG9yZGVyX2lkIik7CiBmb3JlYWNoKCRpZHMgYXMgJGlkKXsKICAgJG89d2NfZ2V0X29yZGVyKCRpZCk7ICRwcj1hcnJheSgpOwogICBmb3JlYWNoKCRvLT5nZXRfaXRlbXMoKSBhcyAkaXQpeyAkcHJbXT0kaXQtPmdldF9wcm9kdWN0X2lkKCkuJ8OXJy4kaXQtPmdldF9xdWFudGl0eSgpOyB9CiAgICRUWydwbyddWyRpZF09YXJyYXkoJ2tsYXVzaW1hcyc9PiRybS0+aW52b2tlKG51bGwsJG8pLCd2aXNvJz0+JG8tPmdldF90b3RhbCgpLCdwcmVrZXMnPT5pbXBsb2RlKCcgJywkcHIpLCdidXNlbmEnPT4kby0+Z2V0X3N0YXR1cygpKTsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK';
const out={v:'FIX3'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Test Uzsakymai v4 (AV likuciu pakeitimas)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id;
    await miegok(6000);
    const d=await fetch(WP+'/?ps_fix3=RUN20260823');
    const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
    const txt=await d.text();
    try{ out.R=JSON.parse(txt); }catch(e){ out.R='ne-json: '+txt.slice(0,600); }
    const cookies=[];
    for(const s of raw){
      const p=s.split(';')[0]; const i=p.indexOf('=');
      const n=p.slice(0,i), v=p.slice(i+1);
      if(!n) continue;
      cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false});
    }
    out.slapukai=cookies.map(c=>c.name);
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/fix3.json', Buffer.from(JSON.stringify(out,null,1)), 'FIX3');
