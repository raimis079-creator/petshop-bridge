process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDAzOCddKT8kX0dFVFsncHNfaDAzOCddOicnKSE9PSdIMDM4JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwMzgnKTsKCiAkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWxlZ2FjeS0zMDEtbWFwLmpzb24nOwogJG9bJ3plbWVsYXBpc195cmEnXT1maWxlX2V4aXN0cygkZik/MTowOwogJG9bJ3plbWVsYXBpb19keWRpcyddPWZpbGVfZXhpc3RzKCRmKT9maWxlc2l6ZSgkZik6MDsKICRwbD1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWxlZ2FjeS0zMDEucGhwJzsKICRvWydwbHVnaW5hc195cmEnXT1maWxlX2V4aXN0cygkcGwpPzE6MDsKICRvWydwbHVnaW5hc19keWRpcyddPWZpbGVfZXhpc3RzKCRwbCk/ZmlsZXNpemUoJHBsKTowOwoKIGlmKGZpbGVfZXhpc3RzKCRmKSl7CiAgICRtPWpzb25fZGVjb2RlKGZpbGVfZ2V0X2NvbnRlbnRzKCRmKSwgdHJ1ZSk7CiAgICRvWydpcmFzdSddPWlzX2FycmF5KCRtKT9jb3VudCgkbSk6MDsKICAgaWYoaXNfYXJyYXkoJG0pKXsKICAgICAkaz1hcnJheV9rZXlzKCRtKTsKICAgICAvKiBhdHNpdGlrdGluZSBpbXRpcyAqLwogICAgIG10X3NyYW5kKDIwMjYwODE4KTsKICAgICBzaHVmZmxlKCRrKTsKICAgICAkaW10aXM9YXJyYXlfc2xpY2UoJGssMCw3MCk7CiAgICAgJG9bJ2ltdGlzJ109YXJyYXkoKTsKICAgICBmb3JlYWNoKCRpbXRpcyBhcyAkeCkgJG9bJ2ltdGlzJ11bJHhdPSRtWyR4XTsKICAgICAvKiB0YWlraW5pdSB0aXBhaSAqLwogICAgICR0aXA9YXJyYXkoKTsKICAgICBmb3JlYWNoKCRtIGFzICRzPT4kdCl7CiAgICAgICAkdHkgPSBzdHJwb3MoJHQsJy9wcm9kdWN0LycpIT09ZmFsc2UgPyAncHJvZHVjdCcKICAgICAgICAgICA6IChzdHJwb3MoJHQsJy9rYXRlZ29yaWphLycpIT09ZmFsc2UgPyAna2F0ZWdvcmlqYScKICAgICAgICAgICA6IChzdHJwb3MoJHQsJy9nYW1pbnRvamFzLycpIT09ZmFsc2UgPyAnZ2FtaW50b2phcycgOiAna2l0YScpKTsKICAgICAgICR0aXBbJHR5XT0oaXNzZXQoJHRpcFskdHldKT8kdGlwWyR0eV06MCkrMTsKICAgICB9CiAgICAgJG9bJ3RhaWtpbml1X3RpcGFpJ109JHRpcDsKICAgfQogfQogLyogYXIgUmFuayBNYXRoIG5lc2lraXNhICovCiAkb1sncm1fbW9kdWxpYWknXT1nZXRfb3B0aW9uKCdyYW5rX21hdGhfbW9kdWxlcycpOwogJG9bJ3JlZGlyZWN0aW9uX3BsdWdpbmFzJ109aW5fYXJyYXkoJ3JlZGlyZWN0aW9uL3JlZGlyZWN0aW9uLnBocCcsKGFycmF5KWdldF9vcHRpb24oJ2FjdGl2ZV9wbHVnaW5zJyksdHJ1ZSk/J2FrdHl2dXMnOiduZWFrdHl2dXMnOwogJG9bJ2Jsb2dfcHVibGljJ109Z2V0X29wdGlvbignYmxvZ19wdWJsaWMnKTsKCiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H038'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
/* seka redirect grandine rankiniu budu */
async function seka(u,maxHop=6){
  const kelias=[]; let cur=u;
  for(let i=0;i<maxHop;i++){
    const r=await fetch(cur,{redirect:'manual'});
    const loc=r.headers.get('location');
    kelias.push({url:cur.replace('https://dev.avesa.lt',''),st:r.status,
                 xrb:r.headers.get('x-redirect-by')||''});
    if(r.status>=300 && r.status<400 && loc){
      cur = loc.startsWith('http') ? loc : 'https://dev.avesa.lt'+loc;
      continue;
    }
    break;
  }
  return kelias;
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H038 301 patikra',code,scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:('KLAIDA '+cr.s);
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h038=H038'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }

  if(out.d && out.d.imtis){
    const rez={vienas_suolis:0,daug_suoliu:0,ne301:0,galutinis_200:0,galutinis_ne200:0,
               xrb_teisingas:0,xrb_kitas:[],blogi:[]};
    for(const [sena,taikinys] of Object.entries(out.d.imtis)){
      const u='https://dev.avesa.lt'+(sena.startsWith('/')?sena:'/'+sena);
      try{
        const k=await seka(u);
        const pirmas=k[0], pask=k[k.length-1];
        if(pirmas.st===301) { if(k.length===2) rez.vienas_suolis++; else rez.daug_suoliu++; }
        else rez.ne301++;
        if(pask.st===200) rez.galutinis_200++; else rez.galutinis_ne200++;
        if(pirmas.xrb==='Petshop-Legacy-Category') rez.xrb_teisingas++;
        else if(pirmas.xrb) rez.xrb_kitas.push(pirmas.xrb);
        if(pirmas.st!==301 || pask.st!==200 || k.length>2){
          if(rez.blogi.length<12) rez.blogi.push({sena,taikinys,kelias:k});
        }
      }catch(e){ rez.blogi.push({sena,kl:String(e).slice(0,70)}); }
      await new Promise(s=>setTimeout(s,90));
    }
    out.imties_rezultatas=rez;
  }
  /* kontrole: sitie NETURI keistis */
  out.kontrole={};
  for(const p of ['/kategorija/sunims/','/duk/','/privatumo-politika/','/sprendimai/','/jautrus-virskinimas/']){
    try{ const k=await seka('https://dev.avesa.lt'+p); out.kontrole[p]={st:k[0].st,suoliu:k.length}; }
    catch(e){ out.kontrole[p]='kl'; }
  }
  /* neatpazintas adresas */
  try{ const k=await seka('https://dev.avesa.lt/visiskai-neegzistuojantis-senas-url-12345'); out.neatpazintas=k; }catch(e){}
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h038.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h038 301 patikra');
