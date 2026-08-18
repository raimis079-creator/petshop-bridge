process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c5MDAnXSk/JF9HRVRbJ3BzX2c5MDAnXTonJykgIT09ICdHOTAwJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDkwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0c5MDAnKTsKCiAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcC5JRCBGUk9NIHskUH1wb3N0bWV0YSBtIEpPSU4geyRQfXBvc3RzIHAgT04gcC5JRD1tLnBvc3RfaWQKICAgV0hFUkUgbS5tZXRhX2tleT0nX3BzX3BpbG51bWFzX2tvZGFpJyBBTkQgbS5tZXRhX3ZhbHVlIExJS0UgJyV8YXByYXN5bWFzfCUnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBPUkRFUiBCWSBwLklEIik7CiAkb1sna2llayddPWNvdW50KCRpZHMpOwogJGVpbD1hcnJheSgpOwogZm9yZWFjaCgkaWRzIGFzICRpZCl7CiAgICRpZD0oaW50KSRpZDsgJHBvc3Q9Z2V0X3Bvc3QoJGlkKTsKICAgJGFwcj10cmltKHdwX3N0cmlwX2FsbF90YWdzKGh0bWxfZW50aXR5X2RlY29kZSgoc3RyaW5nKSRwb3N0LT5wb3N0X2NvbnRlbnQsRU5UX1FVT1RFU3xFTlRfSFRNTDUsJ1VURi04JykpKTsKICAgJGt0PWdldF90aGVfdGVybXMoJGlkLCdwcm9kdWN0X2NhdCcpOyAka2F0PWFycmF5KCk7CiAgIGlmKCRrdCAmJiAhaXNfd3BfZXJyb3IoJGt0KSkgZm9yZWFjaCgka3QgYXMgJHQpICRrYXRbXT0kdC0+bmFtZTsKICAgJGF0cj1hcnJheSgpOyAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsKICAgaWYoJHByKSBmb3JlYWNoKCRwci0+Z2V0X2F0dHJpYnV0ZXMoKSBhcyAkYSl7CiAgICAgaWYoJGEtPmlzX3RheG9ub215KCkpeyAkdHQ9d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCRhLT5nZXRfbmFtZSgpLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSk7CiAgICAgICBpZigkdHQgJiYgIWlzX3dwX2Vycm9yKCR0dCkpICRhdHJbJGEtPmdldF9uYW1lKCldPWltcGxvZGUoJywgJywkdHQpOyB9CiAgIH0KICAgJGltZz0oaW50KWdldF9wb3N0X21ldGEoJGlkLCdfdGh1bWJuYWlsX2lkJyx0cnVlKTsKICAgJGVpbFtdPWFycmF5KCdpZCc9PiRpZCwncGF2Jz0+JHBvc3QtPnBvc3RfdGl0bGUsJ3NrdSc9PihzdHJpbmcpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19za3UnLHRydWUpLAogICAgICdrYXQnPT4ka2F0LCdhdHInPT4kYXRyLCdhcHInPT4kYXByLCdhcHJfaWxnaXMnPT5tYl9zdHJsZW4oJGFwciksCiAgICAgJ3NhbmQnPT4oc3RyaW5nKWdldF9wb3N0X21ldGEoJGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpLAogICAgICdpbWcnPT4kaW1nP3dwX2dldF9hdHRhY2htZW50X2ltYWdlX3VybCgkaW1nLCd3b29jb21tZXJjZV90aHVtYm5haWwnKTonJyk7CiB9CiAkb1snYjY0J109YmFzZTY0X2VuY29kZShnemVuY29kZSh3cF9qc29uX2VuY29kZSgkZWlsKSw2KSk7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'G900'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP G900 likusios 32',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g900=G900')).text();
  let d=null; try{ d=JSON.parse(t); out.d=d; }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
  if(d && d.b64){
    const zlib=await import('zlib');
    const eil=JSON.parse(zlib.gunzipSync(Buffer.from(d.b64,'base64')).toString('utf8'));
    out.nuotr={ok:0,ne:0};
    for(const r of eil){
      if(!r.img){ out.nuotr.ne++; continue; }
      try{ const ir=await fetch(r.img); if(!ir.ok){out.nuotr.ne++;continue;}
        const buf=Buffer.from(await ir.arrayBuffer());
        const ext=(r.img.split('.').pop().split('?')[0]||'jpg').toLowerCase();
        const st=await put('nuotraukos2/'+r.id+'.'+ext, buf, 'preke '+r.id);
        if(st===200||st===201) out.nuotr.ok++; else out.nuotr.ne++;
      }catch(e){ out.nuotr.ne++; }
    }
  }
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/g900.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g900');
