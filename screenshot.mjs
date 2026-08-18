process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2gwMTAnXSk/JF9HRVRbJ3BzX2gwMTAnXTonJykgIT09ICdIMDEwJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwMTAnKTsKCiAvKiAxLiBrb2tzIFNFTyBwbHVnaW5hcyAqLwogJGFwPWdldF9vcHRpb24oJ2FjdGl2ZV9wbHVnaW5zJyxhcnJheSgpKTsKICRzZW89YXJyYXkoKTsKIGZvcmVhY2goKGFycmF5KSRhcCBhcyAkeCl7IGlmKHByZWdfbWF0Y2goJy9zZW98eW9hc3R8cmFuay1tYXRofGFpb3Nlb3xzbGltL2knLCR4KSkgJHNlb1tdPSR4OyB9CiAkb1snc2VvX3BsdWdpbmFpJ109JHNlbzsKICRvWydrbGFzZXMnXT1hcnJheSgnWW9hc3QnPT5jbGFzc19leGlzdHMoJ1dQU0VPX09wdGlvbnMnKT8xOjAsJ1JhbmtNYXRoJz0+Y2xhc3NfZXhpc3RzKCdSYW5rTWF0aCcpPzE6MCwKICAgJ0FJT1NFTyc9PmZ1bmN0aW9uX2V4aXN0cygnYWlvc2VvJyk/MTowLCdTRU9QcmVzcyc9PmRlZmluZWQoJ1NFT1BSRVNTX1ZFUlNJT04nKT8xOjApOwoKIC8qIDIuIG1ldGEgbGF1a2FpIHByZWtlc2UgKi8KICRyYWt0YWk9YXJyYXkoJ195b2FzdF93cHNlb190aXRsZScsJ195b2FzdF93cHNlb19tZXRhZGVzYycsJ195b2FzdF93cHNlb19mb2N1c2t3JywKICAgJ3JhbmtfbWF0aF90aXRsZScsJ3JhbmtfbWF0aF9kZXNjcmlwdGlvbicsJ3JhbmtfbWF0aF9mb2N1c19rZXl3b3JkJywKICAgJ19haW9zZW9fdGl0bGUnLCdfYWlvc2VvX2Rlc2NyaXB0aW9uJywnX3Nlb3ByZXNzX3RpdGxlc190aXRsZScsJ19zZW9wcmVzc190aXRsZXNfZGVzYycpOwogZm9yZWFjaCgkcmFrdGFpIGFzICRrKXsKICAgJG49KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RtZXRhIG0gSk9JTiB7JFB9cG9zdHMgcCBPTiBwLklEPW0ucG9zdF9pZAogICAgIFdIRVJFIG0ubWV0YV9rZXk9JXMgQU5EIG0ubWV0YV92YWx1ZTw+JycgQU5EIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCciLCAkaykpOwogICBpZigkbj4wKSAkb1snbWV0YSddWyRrXT0kbjsKIH0KICRvWydwdWJsaXNoJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIpOwoKIC8qIDMuIGtva2lvcyBmb3Jtb3MgbmF1ZG9qYW1vcyBzYWJsb251b3NlICovCiBmb3JlYWNoKGFycmF5KCd3cHNlb190aXRsZXMnLCdyYW5rLW1hdGgtb3B0aW9ucy10aXRsZXMnLCdhaW9zZW9fb3B0aW9ucycpIGFzICRvcCl7CiAgICR2PWdldF9vcHRpb24oJG9wKTsKICAgaWYoJHYpeyAkcz1pc19hcnJheSgkdik/d3BfanNvbl9lbmNvZGUoJHYpOihzdHJpbmcpJHY7CiAgICAgJG9bJ3NhYmxvbmFpJ11bJG9wXT1tYl9zdWJzdHIocHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCRzKSwwLDYwMCk7IH0KIH0KIC8qIDQuIGluZGVrc2F2aW1vIGJ1a2xlICovCiAkb1snYmxvZ19wdWJsaWMnXT1nZXRfb3B0aW9uKCdibG9nX3B1YmxpYycpOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H010'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
try{
  const s=await snip('TEMP H010 SEO',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_h010=H010')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
  // ka realiai mato robotas
  out.puslapiai={};
  for(const u of ['/product/eukanuba-active-small-adult-vistiena-3kg/','/']){
    const r=await fetch(WP+u); const h=await r.text();
    const t1=(h.match(/<title>([\s\S]*?)<\/title>/i)||[])[1]||'';
    const md=(h.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)||[])[1]||'';
    const og=(h.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i)||[])[1]||'';
    const can=(h.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)||[])[1]||'';
    const ld=(h.match(/application\/ld\+json/gi)||[]).length;
    out.puslapiai[u]={status:r.status,title:t1.slice(0,120),description:md.slice(0,180),og_title:og.slice(0,80),canonical:can,ldjson_blokai:ld};
  }
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h010.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h010 seo');
