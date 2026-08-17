process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c4MTInXSk/JF9HRVRbJ3BzX2c4MTInXTonJykgIT09ICdHODEyJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDkwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0c4MTInLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aScpKTsKCiAvKiBwaWxuYXMgZmVlZCd1IHBsdWdpbmFzICovCiAkbWFpbj1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1mZWVkcy9wZXRzaG9wLWZlZWRzLnBocCc7CiAkb1snc2FsdGluaXMnXT1maWxlX2V4aXN0cygkbWFpbik/YmFzZTY0X2VuY29kZShmaWxlX2dldF9jb250ZW50cygkbWFpbikpOm51bGw7CgogLyogRUFOIHBhdnl6ZHppYWkgc3Uga29udGVrc3UgKi8KIGZvcmVhY2goYXJyYXkoJ192Zl9iYXJjb2RlJywnX2VhbicsJ196Yl9lYW4nLCdfZ2xvYmFsX3VuaXF1ZV9pZCcpIGFzICRrKXsKICAgJG9bJ3B2eiddWyRrXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBtLnBvc3RfaWQsIExFRlQocC5wb3N0X3RpdGxlLDM4KSBwYXYsIG0ubWV0YV92YWx1ZSB2LAogICAgIChTRUxFQ1Qgcy5tZXRhX3ZhbHVlIEZST00geyRQfXBvc3RtZXRhIHMgV0hFUkUgcy5wb3N0X2lkPW0ucG9zdF9pZCBBTkQgcy5tZXRhX2tleT0nX3NrdScgTElNSVQgMSkgc2t1CiAgICAgRlJPTSB7JFB9cG9zdG1ldGEgbSBKT0lOIHskUH1wb3N0cyBwIE9OIHAuSUQ9bS5wb3N0X2lkCiAgICAgV0hFUkUgbS5tZXRhX2tleT0lcyBBTkQgbS5tZXRhX3ZhbHVlPD4nJyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgTElNSVQgMTQiLCAkayksIEFSUkFZX0EpOwogICAkb1snaWxnaWFpJ11bJGtdPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENIQVJfTEVOR1RIKG1ldGFfdmFsdWUpIGlsZ2lzLCBDT1VOVCgqKSBuIEZST00geyRQfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSVzIEFORCBtZXRhX3ZhbHVlPD4nJyBHUk9VUCBCWSBpbGdpcyBPUkRFUiBCWSBuIERFU0MgTElNSVQgOCIsICRrKSwgQVJSQVlfQSk7CiB9CiAvKiBhciBfZ2xvYmFsX3VuaXF1ZV9pZCA9IF92Zl9iYXJjb2RlIGtvcGlqYSAqLwogJG9bJ2d1aWRfZXFfdmYnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdG1ldGEgYSBKT0lOIHskUH1wb3N0bWV0YSBiIE9OIGIucG9zdF9pZD1hLnBvc3RfaWQgQU5EIGIubWV0YV9rZXk9J192Zl9iYXJjb2RlJwogICBXSEVSRSBhLm1ldGFfa2V5PSdfZ2xvYmFsX3VuaXF1ZV9pZCcgQU5EIGEubWV0YV92YWx1ZTw+JycgQU5EIGEubWV0YV92YWx1ZT1iLm1ldGFfdmFsdWUiKTsKICRvWydndWlkX2VxX2VhbiddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wb3N0bWV0YSBhIEpPSU4geyRQfXBvc3RtZXRhIGIgT04gYi5wb3N0X2lkPWEucG9zdF9pZCBBTkQgYi5tZXRhX2tleT0nX2VhbicKICAgV0hFUkUgYS5tZXRhX2tleT0nX2dsb2JhbF91bmlxdWVfaWQnIEFORCBhLm1ldGFfdmFsdWU8PicnIEFORCBhLm1ldGFfdmFsdWU9Yi5tZXRhX3ZhbHVlIik7CiAvKiBrb25mbGlrdHUgcGF2eXpkemlhaSAqLwogJG9bJ2tvbmZsaWt0dV9wdnonXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtLnBvc3RfaWQsIEdST1VQX0NPTkNBVChDT05DQVQobS5tZXRhX2tleSwnPScsbS5tZXRhX3ZhbHVlKSBTRVBBUkFUT1IgJyB8ICcpIGVpbAogICBGUk9NIHskUH1wb3N0bWV0YSBtIFdIRVJFIG0ubWV0YV9rZXkgSU4gKCdfZWFuJywnX3ZmX2JhcmNvZGUnLCdfemJfZWFuJykgQU5EIG0ubWV0YV92YWx1ZTw+JycKICAgR1JPVVAgQlkgbS5wb3N0X2lkIEhBVklORyBDT1VOVChESVNUSU5DVCBtLm1ldGFfdmFsdWUpPjEgTElNSVQgOCIsIEFSUkFZX0EpOwoKIC8qIGZlZWQgcmV3cml0ZSBhciBneXZhcyAqLwogJG9bJ3Jld3JpdGVfeXJhJ109YXJyYXkoKTsKICRycj1nZXRfb3B0aW9uKCdyZXdyaXRlX3J1bGVzJyk7CiBpZihpc19hcnJheSgkcnIpKSBmb3JlYWNoKCRyciBhcyAkaz0+JHYpeyBpZihzdHJwb3MoJGssJ2ZlZWQva2FpbmEnKSE9PWZhbHNlIHx8IHN0cnBvcygkdiwncGV0c2hvcF9mZWVkJykhPT1mYWxzZSkgJG9bJ3Jld3JpdGVfeXJhJ11bJGtdPSR2OyB9CiAkb1sncGVybWFsaW5rX3N0cnVrdHVyYSddPWdldF9vcHRpb24oJ3Blcm1hbGlua19zdHJ1Y3R1cmUnKTsKCiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'G812'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} out.snip_status=cr.s; return j?j.id:null; }
try{
  const s=await snip('TEMP G812 Feeds source',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g812=G812')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,600); }
  // gyvi feed endpointai
  out.endpointai={};
  for (const u of ['/feed/kaina24','/feed/kainos','/?petshop_feed=kaina24']){
    try{ const r=await fetch(WP+u,{redirect:'follow'}); const body=await r.text();
      out.endpointai[u]={status:r.status, ct:r.headers.get('content-type'), baitai:body.length,
        items:(body.match(/<item[ >]/gi)||[]).length + (body.match(/<product[ >]/gi)||[]).length + (body.match(/<offer[ >]/gi)||[]).length,
        pradzia:body.slice(0,700)};
    }catch(e){ out.endpointai[u]={klaida:String(e).slice(0,120)}; }
  }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('g812.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g812 feeds source');
