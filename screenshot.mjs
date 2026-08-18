process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import crypto from 'crypto';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c4MzAnXSk/JF9HRVRbJ3BzX2c4MzAnXTonJykgIT09ICdHODMwJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0c4MzAnLCd0cyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSk7CgogLyogMS4gU0FSR0FTICovCiAkdD0kUC4ncHNfc2FyZ2FzX2tsYWlkb3MnOwogaWYoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyR0JyIpKXsKICAgJG9bJ3NhcmdhcyddWyd2aXNvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQiKTsKICAgJG9bJ3NhcmdhcyddWydwYXJhJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQgV0hFUkUgc3VrdXJ0YSA+PSBEQVRFX1NVQihOT1coKSwgSU5URVJWQUwgMjQgSE9VUikiKTsKICAgJG9bJ3NhcmdhcyddWydpcmFzYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00gJHQgT1JERVIgQlkgaWQgREVTQyBMSU1JVCA4IiwgQVJSQVlfQSk7CiB9IGVsc2UgeyAkb1snc2FyZ2FzJ109J2xlbnRlbGUgbmVyYXN0YSc7IH0KICRvWydzYXJnYXNfb3BjaWpvcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLCBMRUZUKG9wdGlvbl92YWx1ZSwyMDApIHYgRlJPTSB7JFB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICclc2FyZyUnIE9SREVSIEJZIG9wdGlvbl9uYW1lIExJTUlUIDI1IiwgQVJSQVlfQSk7CgogLyogMi4gQ1JPTiBCVUtMRSAqLwogJGNyPV9nZXRfY3Jvbl9hcnJheSgpOyAkYXRzPWFycmF5KCk7ICRkYWJhcj10aW1lKCk7CiBpZihpc19hcnJheSgkY3IpKSBmb3JlYWNoKCRjciBhcyAkdHM9PiRoKXsgZm9yZWFjaCgkaCBhcyAkaG9vaz0+JHgpewogICAgaWYoY291bnQoJGF0cyk8NDApICRhdHNbXT1hcnJheSgnaG9vayc9PiRob29rLCdrYWRhJz0+ZGF0ZSgnWS1tLWQgSDppJywkdHMpLCdwcmFlaXR5amUnPT4oJHRzPCRkYWJhcik/MTowKTsKIH19CiAkb1snY3Jvbl9hcnRpbWlhdXNpJ109YXJyYXlfc2xpY2UoJGF0cywwLDI1KTsKICRvWydjcm9uX3Zpc28nXT0wOyBpZihpc19hcnJheSgkY3IpKSBmb3JlYWNoKCRjciBhcyAkdHM9PiRoKSAkb1snY3Jvbl92aXNvJ10gKz0gY291bnQoJGgpOwogJG9bJ2Nyb25fdsSXbHVvamEnXT0wOyBpZihpc19hcnJheSgkY3IpKSBmb3JlYWNoKCRjciBhcyAkdHM9PiRoKXsgaWYoJHRzPCRkYWJhci0zNjAwKSAkb1snY3Jvbl92xJdsdW9qYSddICs9IGNvdW50KCRoKTsgfQogJG9bJ2RvaW5nX2Nyb24nXT1nZXRfdHJhbnNpZW50KCdkb2luZ19jcm9uJyk/MTowOwogJG9bJ3dwX2Nyb25faXNqdW5ndGFzJ109KGRlZmluZWQoJ0RJU0FCTEVfV1BfQ1JPTicpICYmIERJU0FCTEVfV1BfQ1JPTik/MTowOwoKIC8qIDMuIEJBQ0tVUCBQRURTQUtBSSAqLwogJG9bJ2JhY2t1cF9vcGNpam9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3B0aW9uX25hbWUsIExFRlQob3B0aW9uX3ZhbHVlLDE2MCkgdiBGUk9NIHskUH1vcHRpb25zCiAgIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyViYWNrdXAlJyBPUiBvcHRpb25fbmFtZSBMSUtFICclYjIlJyBPUiBvcHRpb25fbmFtZSBMSUtFICclaW5zdGFsbGF0cm9uJScgT1JERVIgQlkgb3B0aW9uX25hbWUgTElNSVQgMjUiLCBBUlJBWV9BKTsKICR1cD13cF91cGxvYWRfZGlyKCk7ICRkPXRyYWlsaW5nc2xhc2hpdCgkdXBbJ2Jhc2VkaXInXSkuJ3BzLWJhY2t1cHMnOwogJGY9YXJyYXkoKTsKIGlmKGlzX2RpcigkZCkpeyBmb3JlYWNoKHNjYW5kaXIoJGQpIGFzICR4KXsgaWYoJHg9PT0nLid8fCR4PT09Jy4uJykgY29udGludWU7ICRmWyR4XT1hcnJheSgnQic9PmZpbGVzaXplKCRkLicvJy4keCksJ2thZGEnPT5kYXRlKCdZLW0tZCBIOmknLGZpbGVtdGltZSgkZC4nLycuJHgpKSk7IH0gfQogJG9bJ3BzX2JhY2t1cHMnXT0kZjsKCiAvKiA0LiBHVElOIOKAlCBBUiBJU0xJS08gKi8KICRjaGs9ZnVuY3Rpb24oJHYpeyAkdj0oc3RyaW5nKSR2OyBpZihzdHJsZW4oJHYpIT09MTN8fCFjdHlwZV9kaWdpdCgkdikpIHJldHVybiBmYWxzZTsgJHM9MDsgZm9yKCRpPTA7JGk8MTI7JGkrKykgJHMrPSgoaW50KSR2WyRpXSkqKCgkaSUyKT8zOjEpOyByZXR1cm4gKCgxMC0kcyUxMCklMTApPT09KGludCkkdlsxMl07IH07CiAkcm93cz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIG0ubWV0YV92YWx1ZSBGUk9NIHskUH1wb3N0bWV0YSBtIEpPSU4geyRQfXBvc3RzIHAgT04gcC5JRD1tLnBvc3RfaWQKICAgV0hFUkUgbS5tZXRhX2tleT0nX2dsb2JhbF91bmlxdWVfaWQnIEFORCBtLm1ldGFfdmFsdWU8PicnIEFORCBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIik7CiAkZz0wOyBmb3JlYWNoKCRyb3dzIGFzICR2KSBpZigkY2hrKCR2KSkgJGcrKzsKICRvWydndGluJ109YXJyYXkoJ3V6cGlsZHl0YSc9PmNvdW50KCRyb3dzKSwnZ2FsaW9qYTEzJz0+JGcsCiAgICdpbGdpczEyJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RtZXRhIG0gSk9JTiB7JFB9cG9zdHMgcCBPTiBwLklEPW0ucG9zdF9pZCBXSEVSRSBtLm1ldGFfa2V5PSdfZ2xvYmFsX3VuaXF1ZV9pZCcgQU5EIENIQVJfTEVOR1RIKG0ubWV0YV92YWx1ZSk9MTIgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIikpOwogJG9bJ2d0aW4nXVsnZnVua2NpamFfeXJhJ109ZnVuY3Rpb25fZXhpc3RzKCdwZXRzaG9wX3htbF9ndGluX25vcm1hbGl6ZScpPzE6MDsKCiAvKiA1LiBBUiBWRiBJTVBPUlRBUyBTVUtPIFBFUiBOQUtUSSAqLwogJG9bJ3ZmJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBNQVgobWV0YV92YWx1ZSkgbmF1amF1c2lhcywgQ09VTlQoKikgbiBGUk9NIHskUH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3ZmX2xhc3Rfc3luYyciLCBBUlJBWV9BKTsKICR0aT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAnJXBteGlfaW1wb3J0cyUnIik7CiBpZigkdGkpICRvWydpbXBvcnRhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUscmVnaXN0ZXJlZF9vbixleGVjdXRpbmcsdHJpZ2dlcmVkLHByb2Nlc3NpbmcsaW1wb3J0ZWQsY3JlYXRlZCx1cGRhdGVkLHNraXBwZWQgRlJPTSB7JHRpWzBdfSBPUkRFUiBCWSBpZCIsIEFSUkFZX0EpOwoKIC8qIDYuIE5BS1RJRVMgUE9LWUNJQUkgKi8KICRvWydyZWRhZ3VvdGFfcGVyX25ha3RpJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3RfbW9kaWZpZWQgPj0gJzIwMjYtMDgtMTggMDA6MDA6MDAnIik7CiAkb1sndXpzYWt5bXVfbGVudGVsZSddPSR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICd7JFB9d2Nfb3JkZXJzJyIpPydIUE9TJzonbmVyYSc7CgogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'G830'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} out.snip_status=cr.s; return j?j.id:null; }

/* GOOGLE — ar mygtukai jau paspausti */
out.google={};
try{
  const raw=(process.env.GTM_SA_JSON||'').trim();
  let sa=null; for(const f of [()=>JSON.parse(raw),()=>JSON.parse('{'+raw+'}')]){ try{ const r=f(); if(r&&r.client_email){sa=r;break;} }catch(e){} }
  if(sa){
    const now=Math.floor(Date.now()/1000);
    const hdr=Buffer.from(JSON.stringify({alg:'RS256',typ:'JWT'})).toString('base64url');
    const cl=Buffer.from(JSON.stringify({iss:sa.client_email,scope:'https://www.googleapis.com/auth/content',aud:'https://oauth2.googleapis.com/token',exp:now+3600,iat:now})).toString('base64url');
    const sig=crypto.createSign('RSA-SHA256').update(hdr+'.'+cl).sign(sa.private_key).toString('base64url');
    const tr=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion='+hdr+'.'+cl+'.'+sig});
    const tj=await tr.json();
    if(tj.access_token){
      const ai=await fetch('https://shoppingcontent.googleapis.com/content/v2.1/accounts/authinfo',{headers:{Authorization:'Bearer '+tj.access_token}});
      out.google.status=ai.status; out.google.atsakas=(await ai.text()).slice(0,500);
    } else out.google.token_klaida=JSON.stringify(tj).slice(0,200);
  }
}catch(e){ out.google.klaida=String(e).slice(0,200); }

try{
  const s=await snip('TEMP G830 rytine patikra',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g830=G830')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,600); }
  out.puslapiai={};
  for(const u of ['/','/parduotuve/','/wp-admin/']){
    const r=await fetch(WP+u); const h=await r.text();
    out.puslapiai[u]={status:r.status, baitai:h.length, fatal:h.indexOf('Fatal error')>=0};
  }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('g830.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g830 rytine patikra');
