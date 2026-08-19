process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA4MiddKSA/ICRfR0VUWydwc19oMDgyJ10gOiAnJykgIT09ICdYJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDEyMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7CiAkbyA9IGFycmF5KCd2Jz0+J0gwODInKTsKICR1cCA9IHdwX3VwbG9hZF9kaXIoKTsKICRmbGFnID0gdHJhaWxpbmdzbGFzaGl0KCR1cFsnYmFzZWRpciddKSAuICdwcy1wcmlleml1cmEuZmxhZyc7CiAkb1sndmVsaWF2YV9wcmllcyddID0gZmlsZV9leGlzdHMoJGZsYWcpOwogQHVubGluaygkZmxhZyk7CiBjbGVhcnN0YXRjYWNoZSgpOwogJG9bJ3ZlbGlhdmFfcG8nXSA9IGZpbGVfZXhpc3RzKCRmbGFnKTsKICRtdSA9IFdQTVVfUExVR0lOX0RJUiAuICcvcGV0c2hvcC1wcmlleml1cmEucGhwJzsKICRvWydtdV95cmEnXSAgPSBmaWxlX2V4aXN0cygkbXUpOwogJG9bJ211X21kNSddICA9IGZpbGVfZXhpc3RzKCRtdSkgPyBtZDVfZmlsZSgkbXUpIDogbnVsbDsKICRvWydtdV9keWRpcyddPSBmaWxlX2V4aXN0cygkbXUpID8gZmlsZXNpemUoJG11KSA6IG51bGw7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiAkb1sndmFseXRhJ109MTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H082'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:(await r.text()).slice(0,3000)};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
async function kodas(p){ try{ const r=await fetch(WP+p,{redirect:'manual'}); return {http:r.status, retry:r.headers.get('retry-after')||null}; }catch(e){ return {klaida:String(e).slice(0,120)}; } }
async function jsonas(p){ try{const r=await fetch(WP+p); const t=await r.text(); try{return JSON.parse(t);}catch(e){return {ZALIAS:t.slice(0,300),http:r.status};}}catch(e){return {klaida:String(e).slice(0,150)};} }
try{
  out.frontas_pradzioje = await kodas('/');

  /* 1 KELIAS: gal senas snippetas 3536 dar aktyvus — kviečiam per wc-api praėjimą */
  out.kelias1_senas_snippetas = await jsonas('/?wc-api=ps&ps_h081=C');
  out.frontas_po_kelio1 = await kodas('/');

  /* 2 KELIAS: REST — ar apskritai pasiekiamas su priežiūros režimu */
  const ls = await api('/wp-json/code-snippets/v1/snippets');
  out.rest_statusas = ls.s;
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  out.rest_snippetu = Array.isArray(sar) ? sar.length : 'neparsinta';

  if(out.frontas_po_kelio1.http !== 200){
    const cr = await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H082 avarinis valymas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
    let j=null; try{j=JSON.parse(cr.t);}catch(e){}
    out.kelias2_snip = j ? j.id : ('KLAIDA '+cr.s+' '+cr.t.slice(0,200));
    await miegok(9000);
    out.kelias2_vykdymas = await jsonas('/?wc-api=ps&ps_h082=X');
    out.frontas_po_kelio2 = await kodas('/');
  }

  out.frontas_pabaigoje = await kodas('/');
  out.wp_admin = await kodas('/wp-admin/');
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h082.json', Buffer.from(JSON.stringify(out,null,1)), 'h082 avarinis valymas');
