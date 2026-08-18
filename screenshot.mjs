process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDAyMiddKT8kX0dFVFsncHNfaDAyMiddOicnKSE9PSdIMDIyJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwMjInKTsKICRpZHM9YXJyYXkoMTMwNDgsMTM2MTAsMTMxMjAsMTMxNTIpOwogJG9bJ3ByZWtlcyddPWFycmF5KCk7CiBmb3JlYWNoKCRpZHMgYXMgJGlkKXsKICAgJHA9Z2V0X3Bvc3QoJGlkKTsgaWYoISRwKSBjb250aW51ZTsKICAgJG9bJ3ByZWtlcyddWyRpZF09YXJyYXkoJ3VybCc9PmdldF9wZXJtYWxpbmsoJGlkKSwncGF2Jz0+bWJfc3Vic3RyKCRwLT5wb3N0X3RpdGxlLDAsNTApLAogICAgICdleGNlcnB0X3phbGlhcyc9Pm1iX3N1YnN0cigoc3RyaW5nKSRwLT5wb3N0X2V4Y2VycHQsMCwxMjApKTsKIH0KIC8qIGtpZWsgZXhjZXJwdCd1IHR1cmkgZHZpZ3ViYWkga29kdW90YSBIVE1MICovCiAkb1snZHZpZ3ViYWlfa29kdW90aSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wb3N0cwogICBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcKICAgQU5EIChwb3N0X2V4Y2VycHQgTElLRSAnJSZsdDslJyBPUiBwb3N0X2V4Y2VycHQgTElLRSAnJSZhbXA7JScpIik7CiAkb1snc3VfaHRtbF90YWdhaXMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdHMKICAgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwb3N0X2V4Y2VycHQgTElLRSAnJTxwPiUnIik7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H022'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const code=Buffer.from(B64,'base64').toString('utf8');
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H022 excerpt kodavimas',code,scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:('KLAIDA '+cr.s+' '+cr.t.slice(0,200));
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h022=H022'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.http=r.status; out.zalias=t.slice(0,600); }
  out.galvos={};
  const PR=(out.d&&out.d.prekes)?out.d.prekes:{};
  for(const [id,info] of Object.entries(PR)){
    try{
      const x=await fetch(info.url); const h=await x.text();
      const m=h.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
      const raw=m?m[1]:'';
      out.galvos[id]={http:x.status,pav:info.pav,desc:raw.slice(0,200),
        turi_lt:/&lt;|&gt;/.test(raw)?1:0, turi_amp:/&amp;/.test(raw)?1:0, ilg:raw.length};
    }catch(e){ out.galvos[id]={klaida:String(e).slice(0,100)}; }
  }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h022.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h022 excerpt kodavimas');
