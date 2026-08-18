process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDAxOSddKT8kX0dFVFsncHNfaDAxOSddOicnKSE9PSdBUFBMWScpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCg5MDApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidIMDE5Jyk7CgogLyogc2F1Z2lrbGlzOiBrb3BpamEgcHJpdmFsbyBlZ3ppc3R1b3RpICovCiAkdXA9d3BfdXBsb2FkX2RpcigpOyAkZDI9JHVwWydiYXNlZGlyJ10uJy9wcy1iYWNrdXBzJzsKICRyYXN0YT1nbG9iKCRkMi4nL3JhbmttYXRoX3RpdGxlX2tvcGlqYV8qLmpzb24nKTsKICRvWydrb3Bpam9zJ109YXJyYXlfbWFwKCdiYXNlbmFtZScsKGFycmF5KSRyYXN0YSk7CiBpZihlbXB0eSgkcmFzdGEpKXsgJG9bJ05VVFJBVUtUQSddPSdrb3BpamEgbmVyYXN0YSc7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CgogJHByaWVzPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wb3N0bWV0YSBtIEpPSU4geyRQfXBvc3RzIHAgT04gcC5JRD1tLnBvc3RfaWQKICAgV0hFUkUgbS5tZXRhX2tleT0ncmFua19tYXRoX3RpdGxlJyBBTkQgbS5tZXRhX3ZhbHVlPD4nJyBBTkQgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIik7CgogLyogVFJZTklNQVMg4oCUIHRpayBwcmVrZXMsIHRpayB0aXRsZSAqLwogJGlzdHJpbnRhPSR3cGRiLT5xdWVyeSgiREVMRVRFIG0gRlJPTSB7JFB9cG9zdG1ldGEgbSBKT0lOIHskUH1wb3N0cyBwIE9OIHAuSUQ9bS5wb3N0X2lkCiAgIFdIRVJFIG0ubWV0YV9rZXk9J3JhbmtfbWF0aF90aXRsZScgQU5EIHAucG9zdF90eXBlPSdwcm9kdWN0JyIpOwoKICRwbz0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdG1ldGEgbSBKT0lOIHskUH1wb3N0cyBwIE9OIHAuSUQ9bS5wb3N0X2lkCiAgIFdIRVJFIG0ubWV0YV9rZXk9J3JhbmtfbWF0aF90aXRsZScgQU5EIG0ubWV0YV92YWx1ZTw+JycgQU5EIHAucG9zdF90eXBlPSdwcm9kdWN0JyIpOwoKICRvWyd0aXRsZSddPWFycmF5KCdwcmllcyc9PiRwcmllcywnaXN0cmludGEnPT4kaXN0cmludGEsJ2xpa28nPT4kcG8pOwoKIC8qIEtPTlRST0xFOiBrYXMgTkVUVVJFSk8gYnV0aSBwYWxpZXN0YSAqLwogJG9bJ2tvbnRyb2xlJ109YXJyYXkoCiAgICd0aXRsZV9uZV9wcmVrZW1zJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RtZXRhIG0gSk9JTiB7JFB9cG9zdHMgcCBPTiBwLklEPW0ucG9zdF9pZAogICAgICBXSEVSRSBtLm1ldGFfa2V5PSdyYW5rX21hdGhfdGl0bGUnIEFORCBtLm1ldGFfdmFsdWU8PicnIEFORCBwLnBvc3RfdHlwZTw+J3Byb2R1Y3QnIiksCiAgICdkZXNjcmlwdGlvbl9saWtvJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RtZXRhIG0gSk9JTiB7JFB9cG9zdHMgcCBPTiBwLklEPW0ucG9zdF9pZAogICAgICBXSEVSRSBtLm1ldGFfa2V5PSdyYW5rX21hdGhfZGVzY3JpcHRpb24nIEFORCBtLm1ldGFfdmFsdWU8PicnIEFORCBwLnBvc3RfdHlwZT0ncHJvZHVjdCciKSwKICAgJ3lvYXN0X2F0c2FyZ2EnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdG1ldGEgbSBKT0lOIHskUH1wb3N0cyBwIE9OIHAuSUQ9bS5wb3N0X2lkCiAgICAgIFdIRVJFIG0ubWV0YV9rZXk9J195b2FzdF93cHNlb190aXRsZScgQU5EIG0ubWV0YV92YWx1ZTw+JycgQU5EIHAucG9zdF90eXBlPSdwcm9kdWN0JyIpLAogKTsKCiAvKiBQQVBJTERPTUFTIFJBRElOWVM6IGFwcmFzeW1haSwgaWRlbnRpc2tpIHByZWtlcyBwYXZhZGluaW11aSAqLwogJG9bJ2Rlc2NfbHlndV9wYXZhZGluaW11aSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wb3N0bWV0YSBtIEpPSU4geyRQfXBvc3RzIHAgT04gcC5JRD1tLnBvc3RfaWQKICAgV0hFUkUgbS5tZXRhX2tleT0ncmFua19tYXRoX2Rlc2NyaXB0aW9uJyBBTkQgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogICBBTkQgVFJJTShtLm1ldGFfdmFsdWUpPVRSSU0ocC5wb3N0X3RpdGxlKSIpOwoKIC8qIHRlc3RpbmlhaSBVUkwgKi8KICRvWyd1cmwnXT1hcnJheSgKICAgJ2J1dm9fbWV0YSc9PmdldF9wZXJtYWxpbmsoMTk3ODUpLAogICAnbmVidXZvX21ldGEnPT5nZXRfcGVybWFsaW5rKDM0OTY5KQogKTsKCiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H019'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
function galva(h){
  const g=(re)=>{const m=h.match(re);return m?m[1]:''};
  const t=g(/<title>([\s\S]*?)<\/title>/i), d=g(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
  return {title:t.slice(0,170),t_ilg:t.length,description:d.slice(0,250),d_ilg:d.length,
          ldjson:(h.match(/application\/ld\+json/gi)||[]).length};
}
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const code=Buffer.from(B64,'base64').toString('utf8');
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H019 RM title apply',code,scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:('KLAIDA '+cr.s+' '+cr.t.slice(0,200));
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h019=APPLY'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.http=r.status; out.zalias=t.slice(0,600); }
  await new Promise(r=>setTimeout(r,3000));
  out.galvos={};
  const U=(out.d&&out.d.url)?out.d.url:{};
  for(const [k,u] of Object.entries(U)){
    if(!u) continue;
    try{ const x=await fetch(u); const h=await x.text(); out.galvos[k]={http:x.status,...galva(h)}; }
    catch(e){ out.galvos[k]={klaida:String(e).slice(0,120)}; }
  }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h019.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h019 rm title apply');
