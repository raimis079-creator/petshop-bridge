process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRhID0gaXNzZXQoJF9HRVRbJ3BzX2gwMTInXSk/JF9HRVRbJ3BzX2gwMTInXTonJzsKIGlmKCRhIT09J1NOQVAnICYmICRhIT09J1JFQ09OJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwMTInLCdhJz0+JGEpOwoKICRvWydhY3RpdmVfcGx1Z2lucyddPWFycmF5X3ZhbHVlcygoYXJyYXkpZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKSk7CiAkb1snYmxvZ19wdWJsaWMnXT1nZXRfb3B0aW9uKCdibG9nX3B1YmxpYycpOwogJG5hbWVzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1Qgb3B0aW9uX25hbWUgRlJPTSB7JFB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdyYW5rLW1hdGglJyBPUiBvcHRpb25fbmFtZSBMSUtFICdyYW5rXFxfbWF0aCUnIik7CiAkb1sncm1fb3B0aW9uYWknXT0kbmFtZXM7CiAkb1sncm1fcmVpa3NtZXMnXT1hcnJheSgpOwogZm9yZWFjaCgoYXJyYXkpJG5hbWVzIGFzICRuKXsKICAgJHY9Z2V0X29wdGlvbigkbik7CiAgICRzPWlzX2FycmF5KCR2KXx8aXNfb2JqZWN0KCR2KSA/IHdwX2pzb25fZW5jb2RlKCR2KSA6IChzdHJpbmcpJHY7CiAgICRvWydybV9yZWlrc21lcyddWyRuXT1tYl9zdWJzdHIoKHN0cmluZykkcywwLDcwMDApOwogfQogJG9bJ2xlbnRlbGVzJ109JHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJyVyYW5rX21hdGglJyIpOwogJG9bJ3JtX3ZlcnNpamEnXT1kZWZpbmVkKCdSQU5LX01BVEhfVkVSU0lPTicpP1JBTktfTUFUSF9WRVJTSU9OOm51bGw7CiAkb1sncm1fa2xhc2UnXT1jbGFzc19leGlzdHMoJ1JhbmtNYXRoJyk/MTowOwoKIGlmKCRhPT09J1NOQVAnKXsKICAgJHBpZF9zdT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcC5JRCBGUk9NIHskUH1wb3N0cyBwCiAgICAgSk9JTiB7JFB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0ncmFua19tYXRoX3RpdGxlJyBBTkQgbS5tZXRhX3ZhbHVlPD4nJwogICAgIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgT1JERVIgQlkgcC5JRCBERVNDIExJTUlUIDEiKTsKICAgJHBpZF9iZT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcC5JRCBGUk9NIHskUH1wb3N0cyBwIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcKICAgICBBTkQgTk9UIEVYSVNUUyhTRUxFQ1QgMSBGUk9NIHskUH1wb3N0bWV0YSBtIFdIRVJFIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdyYW5rX21hdGhfdGl0bGUnIEFORCBtLm1ldGFfdmFsdWU8PicnKQogICAgIE9SREVSIEJZIHAuSUQgREVTQyBMSU1JVCAxIik7CiAgICRvWydpZF9zdSddPSRwaWRfc3U7ICRvWydpZF9iZSddPSRwaWRfYmU7CiAgICR0PWdldF90ZXJtcyhhcnJheSgndGF4b25vbXknPT4ncHJvZHVjdF9jYXQnLCdudW1iZXInPT4xLCdoaWRlX2VtcHR5Jz0+dHJ1ZSwnb3JkZXJieSc9Pidjb3VudCcsJ29yZGVyJz0+J0RFU0MnKSk7CiAgICRrYXQ9KCFpc193cF9lcnJvcigkdCkmJiFlbXB0eSgkdCkpID8gZ2V0X3Rlcm1fbGluaygkdFswXSkgOiAnJzsKICAgJG9bJ3Rlc3RhaSddPWFycmF5KAogICAgICduYW1haSc9PmhvbWVfdXJsKCcvJyksCiAgICAgJ3N1X21ldGEnPT4kcGlkX3N1P2dldF9wZXJtYWxpbmsoJHBpZF9zdSk6JycsCiAgICAgJ2JlX21ldGEnPT4kcGlkX2JlP2dldF9wZXJtYWxpbmsoJHBpZF9iZSk6JycsCiAgICAgJ2thdGVnb3JpamEnPT5pc19zdHJpbmcoJGthdCk/JGthdDonJwogICApOwogICAkb1snbWV0YV9raWVraWFpJ109YXJyYXkoKTsKICAgZm9yZWFjaChhcnJheSgncmFua19tYXRoX3RpdGxlJywncmFua19tYXRoX2Rlc2NyaXB0aW9uJywnX3lvYXN0X3dwc2VvX3RpdGxlJywnX3lvYXN0X3dwc2VvX21ldGFkZXNjJykgYXMgJGspewogICAgICRvWydtZXRhX2tpZWtpYWknXVska109KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgKICAgICAgICJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdG1ldGEgV0hFUkUgbWV0YV9rZXk9JXMgQU5EIG1ldGFfdmFsdWU8PicnIiwkaykpOwogICB9CiAgICR1cD13cF91cGxvYWRfZGlyKCk7ICRkaXI9JHVwWydiYXNlZGlyJ10uJy9wcy1iYWNrdXBzJzsKICAgaWYoIWlzX2RpcigkZGlyKSkgQG1rZGlyKCRkaXIsMDc1NSx0cnVlKTsKICAgJGY9JGRpci4nL3Nlb19wcmllc19yYW5rbWF0aF8nLmRhdGUoJ1ltZF9IaXMnKS4nLmpzb24nOwogICBAZmlsZV9wdXRfY29udGVudHMoJGYsIHdwX2pzb25fZW5jb2RlKCRvKSk7CiAgICRvWydrb3BpamEnXT1AZmlsZV9leGlzdHMoJGYpP2Jhc2VuYW1lKCRmKTonTkVQQVZZS08nOwogfQoKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H012'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
function galva(h){
  const g=(re)=>{const m=h.match(re);return m?m[1]:''};
  return {
    title:g(/<title>([\s\S]*?)<\/title>/i).slice(0,140),
    description:g(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i).slice(0,200),
    og_title:g(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i).slice(0,120),
    og_desc:g(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i).slice(0,140),
    robots:g(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i),
    canonical:g(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i),
    ldjson:(h.match(/application\/ld\+json/gi)||[]).length,
    rankmath_zyme:/Rank Math/i.test(h)?1:0
  };
}
async function galvos(urls){
  const r={};
  for(const [k,u] of Object.entries(urls)){
    if(!u) continue;
    try{ const x=await fetch(u); const h=await x.text(); r[k]={http:x.status,...galva(h)}; }
    catch(e){ r[k]={klaida:String(e).slice(0,120)}; }
  }
  return r;
}
try{
  // 0. isjungti TEMP*
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  out.temp_isjungta=[];
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
      out.temp_isjungta.push(s.id);
    }
  }
  // 1. snippetas
  const code=Buffer.from(B64,'base64').toString('utf8');
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H012 RankMath diegimas',code,scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:('KLAIDA '+cr.s+' '+cr.t.slice(0,200));
  await new Promise(r=>setTimeout(r,9000));

  // 2. SNAP pries
  const s1=await fetch(WP+'/?ps_h012=SNAP'); const t1=await s1.text();
  try{ out.pries=JSON.parse(t1); }catch(e){ out.snap_zalias=t1.slice(0,500); }

  // 3. galvos PRIES
  if(out.pries&&out.pries.testai) out.galvos_pries=await galvos(out.pries.testai);

  // 4. diegimas
  const inst=await api('/wp-json/wp/v2/plugins',{method:'POST',body:JSON.stringify({slug:'seo-by-rank-math',status:'active'})});
  out.diegimas={http:inst.s,at:inst.t.slice(0,600)};

  // 5. saugiklis: ar frontas gyvas
  await new Promise(r=>setTimeout(r,6000));
  let hs=0; try{ const h=await fetch(WP+'/'); hs=h.status; }catch(e){ hs=-1; }
  out.namai_po_diegimo=hs;
  if(hs!==200){
    const off=await api('/wp-json/wp/v2/plugins/seo-by-rank-math%2Frank-math',{method:'POST',body:JSON.stringify({status:'inactive'})});
    out.AVARINIS_ISJUNGIMAS={http:off.s,at:off.t.slice(0,300)};
  } else {
    // 6. RECON po diegimo
    const s2=await fetch(WP+'/?ps_h012=RECON'); const t2=await s2.text();
    try{ out.po=JSON.parse(t2); }catch(e){ out.recon_zalias=t2.slice(0,500); }
    if(out.pries&&out.pries.testai) out.galvos_po=await galvos(out.pries.testai);
  }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h012.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h012 rankmath diegimas');
