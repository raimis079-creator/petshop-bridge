process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA5MSddKSA/ICRfR0VUWydwc19oMDkxJ10gOiAnJykgIT09ICdCQycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxMjApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG8gPSBhcnJheSgndic9PidIMDkxJyk7CiAkcGlkID0gKGludCkgJHdwZGItPmdldF92YXIoIlNFTEVDVCBJRCBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgT1JERVIgQlkgSUQgREVTQyBMSU1JVCAxIik7CiAkb1sncHJla2VfaWQnXSAgPSAkcGlkOwogJG9bJ3ByZWtlX3VybCddID0gJHBpZCA/IGdldF9wZXJtYWxpbmsoJHBpZCkgOiBudWxsOwogJHQgPSBnZXRfdGVybXMoYXJyYXkoJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnaGlkZV9lbXB0eSc9PnRydWUsJ251bWJlcic9PjEpKTsKICRvWydrYXRlZ29yaWphX3VybCddID0gKCFpc193cF9lcnJvcigkdCkgJiYgIWVtcHR5KCR0KSkgPyBnZXRfdGVybV9saW5rKCR0WzBdKSA6IG51bGw7CiAkc3QgPSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIElEIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncG9zdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBPUkRFUiBCWSBJRCBERVNDIExJTUlUIDEiKTsKICRvWydzdHJhaXBzbmlzX3VybCddID0gJHN0ID8gZ2V0X3Blcm1hbGluaygkc3QpIDogbnVsbDsKCiAkZyA9IGdldF9vcHRpb24oJ3JhbmstbWF0aC1vcHRpb25zLWdlbmVyYWwnKTsKICRvWydybV9icmVhZGNydW1icyddID0gaXNfYXJyYXkoJGcpID8gKGlzc2V0KCRnWydicmVhZGNydW1icyddKSA/ICRnWydicmVhZGNydW1icyddIDogJ05FTlVTVEFUWVRBJykgOiAnb3BjaWpvcyBuZXJhJzsKICRvWydybV9tb2R1bGlhaSddID0gaW1wbG9kZSgnLCcsIChhcnJheSkgZ2V0X29wdGlvbigncmFua19tYXRoX21vZHVsZXMnKSk7CiAkb1sndGVtYSddID0gZ2V0X3N0eWxlc2hlZXQoKTsKICRvWyd3b29fYnJlYWRjcnVtYl9ob29rJ10gPSBoYXNfYWN0aW9uKCd3b29jb21tZXJjZV9iZWZvcmVfbWFpbl9jb250ZW50JykgPyAneXJhJyA6ICduZXJhJzsKCiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H091'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
function schema(html){
  const ld=[...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
  const tipai=[];
  for(const b of ld){ try{ const j=JSON.parse(b); const g=j['@graph']||[j]; for(const x of g) if(x['@type']) tipai.push(Array.isArray(x['@type'])?x['@type'].join('/'):x['@type']); }catch(e){ tipai.push('NEPARSINTA'); } }
  return {blokai:ld.length, tipai};
}
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H091 breadcrumb recon',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h091=BC'); const tt=await rr.text();
  try{ out.D=JSON.parse(tt); }catch(e){ out.D={ZALIAS:tt.slice(0,400)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});

  for(const [k,u] of Object.entries({preke:out.D.preke_url, kategorija:out.D.kategorija_url, straipsnis:out.D.straipsnis_url, pradinis:WP+'/'})){
    if(!u){ out[k]='nera URL'; continue; }
    try{ const r=await fetch(u); const h=await r.text();
      const s=schema(h);
      out[k]={url:String(u).replace(WP,''), http:r.status, blokai:s.blokai, tipai:s.tipai,
              breadcrumb_html: /woocommerce-breadcrumb|rank-math-breadcrumb|breadcrumbs/i.test(h) ? 'yra' : 'nera',
              canonical: (h.match(/<link rel="canonical"[^>]*href="([^"]+)"/i)||[null,'nera'])[1]};
    }catch(e){ out[k]={klaida:String(e).slice(0,100)}; }
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h091.json', Buffer.from(JSON.stringify(out,null,1)), 'h091 breadcrumb recon');
