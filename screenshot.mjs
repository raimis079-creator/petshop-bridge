process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c4NzAnXSk/JF9HRVRbJ3BzX2c4NzAnXTonJykgIT09ICdHODcwJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDkwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0c4NzAnKTsKCiAkaWRzPXBzX2ZlZWRzX2lkcygpOyAkZWlsPWFycmF5KCk7CiBmb3JlYWNoKGFycmF5X2NodW5rKCRpZHMsMzAwKSBhcyAkcGspewogIGZvcmVhY2goJHBrIGFzICRpZCl7CiAgICRpZD0oaW50KSRpZDsKICAgJHBvc3Q9Z2V0X3Bvc3QoJGlkKTsKICAgJGFwcj10cmltKHdwX3N0cmlwX2FsbF90YWdzKGh0bWxfZW50aXR5X2RlY29kZSgoc3RyaW5nKSRwb3N0LT5wb3N0X2NvbnRlbnQsRU5UX1FVT1RFU3xFTlRfSFRNTDUsJ1VURi04JykpKTsKICAgaWYobWJfc3RybGVuKCRhcHIpPjApIGNvbnRpbnVlOwogICAka3Q9Z2V0X3RoZV90ZXJtcygkaWQsJ3Byb2R1Y3RfY2F0Jyk7ICRrYXQ9YXJyYXkoKTsKICAgaWYoJGt0ICYmICFpc193cF9lcnJvcigka3QpKSBmb3JlYWNoKCRrdCBhcyAkdCkgJGthdFtdPSR0LT5uYW1lOwogICAkYXRyPWFycmF5KCk7CiAgICRwcj13Y19nZXRfcHJvZHVjdCgkaWQpOwogICBpZigkcHIpIGZvcmVhY2goJHByLT5nZXRfYXR0cmlidXRlcygpIGFzICRhKXsKICAgICBpZigkYS0+aXNfdGF4b25vbXkoKSl7CiAgICAgICAkdHQ9d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCRhLT5nZXRfbmFtZSgpLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSk7CiAgICAgICBpZigkdHQgJiYgIWlzX3dwX2Vycm9yKCR0dCkpICRhdHJbJGEtPmdldF9uYW1lKCldPWltcGxvZGUoJywgJywkdHQpOwogICAgIH0KICAgfQogICAkaW1nPShpbnQpZ2V0X3Bvc3RfbWV0YSgkaWQsJ190aHVtYm5haWxfaWQnLHRydWUpOwogICAkZWlsW109YXJyYXkoJ2lkJz0+JGlkLCdwYXYnPT4kcG9zdC0+cG9zdF90aXRsZSwnc2t1Jz0+KHN0cmluZylnZXRfcG9zdF9tZXRhKCRpZCwnX3NrdScsdHJ1ZSksCiAgICAgJ2thdCc9PiRrYXQsJ2F0cmlidXRhaSc9PiRhdHIsCiAgICAgJ2thaW5hJz0+KGZsb2F0KWdldF9wb3N0X21ldGEoJGlkLCdfcHJpY2UnLHRydWUpLAogICAgICd0cnVtcCc9PnRyaW0od3Bfc3RyaXBfYWxsX3RhZ3MoKHN0cmluZykkcG9zdC0+cG9zdF9leGNlcnB0KSksCiAgICAgJ2ltZyc9PiRpbWc/d3BfZ2V0X2F0dGFjaG1lbnRfaW1hZ2VfdXJsKCRpbWcsJ3dvb2NvbW1lcmNlX3RodW1ibmFpbCcpOicnLAogICAgICdpbWdfcGlsbmEnPT4kaW1nP3dwX2dldF9hdHRhY2htZW50X2ltYWdlX3VybCgkaW1nLCdmdWxsJyk6JycpOwogIH0KICB3cF9jYWNoZV9mbHVzaCgpOwogfQogJG9bJ2tpZWsnXT1jb3VudCgkZWlsKTsKICRvWydiNjQnXT1iYXNlNjRfZW5jb2RlKGd6ZW5jb2RlKHdwX2pzb25fZW5jb2RlKCRlaWwpLDYpKTsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'G870'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP G870 tusti aprasymai',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g870=G870')).text();
  let d=null; try{ d=JSON.parse(t); out.d=d; }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
  if(d && d.b64){
    const zlib=await import('zlib');
    const eil=JSON.parse(zlib.gunzipSync(Buffer.from(d.b64,'base64')).toString('utf8'));
    out.nuotrauku={ok:0,klaidos:0};
    for(const r of eil){
      if(!r.img){ out.nuotrauku.klaidos++; continue; }
      try{
        const ir=await fetch(r.img);
        if(!ir.ok){ out.nuotrauku.klaidos++; continue; }
        const buf=Buffer.from(await ir.arrayBuffer());
        const ext=(r.img.split('.').pop().split('?')[0]||'jpg').toLowerCase();
        const st=await put('nuotraukos/'+r.id+'.'+ext, buf, 'preke '+r.id);
        if(st===200||st===201) out.nuotrauku.ok++; else out.nuotrauku.klaidos++;
      }catch(e){ out.nuotrauku.klaidos++; }
    }
  }
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/g870.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g870 tusti aprasymai');
