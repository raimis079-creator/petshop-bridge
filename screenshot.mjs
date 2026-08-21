process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import https from 'node:https';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64B='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjE4OGInXSkgPyAkX0dFVFsncHNfcjE4OGInXSA6ICcnKSAhPT0gJ0dPJykgcmV0dXJuOwogJG8gPSBhcnJheSgndic9PidSMTg4YicpOwogJG9bJ3NpdGV1cmxfcHJpZXMnXSA9IGdldF9vcHRpb24oJ3NpdGV1cmwnKTsKICRvWydob21lX3ByaWVzJ10gICAgPSBnZXRfb3B0aW9uKCdob21lJyk7CiB1cGRhdGVfb3B0aW9uKCdzaXRldXJsJywnaHR0cHM6Ly9wZXRzaG9wLmx0Jyk7CiB1cGRhdGVfb3B0aW9uKCdob21lJywnaHR0cHM6Ly9wZXRzaG9wLmx0Jyk7CiB3cF9jYWNoZV9mbHVzaCgpOwogJG9bJ3NpdGV1cmxfcG8nXSA9IGdldF9vcHRpb24oJ3NpdGV1cmwnKTsKICRvWydob21lX3BvJ10gICAgPSBnZXRfb3B0aW9uKCdob21lJyk7CiAkb1snQUJTUEFUSCddICAgID0gQUJTUEFUSDsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK'; const IP='79.98.29.24';
const out={versija:'RUN3-R189'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
function ipReq(host, path, opt={}){
  return new Promise((resolve)=>{
    const body = opt.body || null;
    const hdr = {Host:host,'User-Agent':'ps-run3',...(opt.headers||{})};
    if(body) hdr['Content-Length'] = Buffer.byteLength(body);
    const req=https.request({host:IP, port:443, path, method:opt.method||'GET', servername:host, rejectUnauthorized:false, headers:hdr}, (res)=>{
      let d=''; res.on('data',c=>{ if(d.length<8000) d+=c; }); res.on('end',()=>resolve({s:res.statusCode, loc:res.headers.location||null, t:d}));
    });
    req.on('error',(e)=>resolve({s:0,t:String(e).slice(0,200)}));
    req.setTimeout(30000,()=>{req.destroy(); resolve({s:0,t:'timeout'});});
    if(body) req.write(body);
    req.end();
  });
}
async function ipApi(host,p,o={}){ return ipReq(host,p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); }
try{
  /* 1. R188b per dev tilta (stubu grandine) */
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  out.dev_rest = {s:ls.s, kiek:Array.isArray(sar)?sar.length:'?'};
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cB=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP R188b Site URL i petshop.lt',code:Buffer.from(B64B,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let jB=null; try{jB=JSON.parse(cB.t);}catch(e){}
  out.snippet_id = jB&&jB.id ? jB.id : ('KLAIDA '+cB.s+' '+String(cB.t).slice(0,150));
  if(!(jB&&jB.id)) throw new Error('stop');
  await miegok(8000);
  const ru=await fetch(WP+'/?ps_r188b=GO');
  try{ out.SITEURL=JSON.parse(await ru.text()); }catch(e){ out.SITEURL={s:ru.status}; }
  await api('/wp-json/code-snippets/v1/snippets/'+jB.id,{method:'POST',body:JSON.stringify({id:jB.id,active:false})});
  await miegok(3000);

  /* 2. Galutines patikros per IP prisegta petshop.lt */
  out.PATIKROS={};
  const t1=await ipReq('petshop.lt','/');
  out.PATIKROS.titulinis={s:t1.s, loc:t1.loc, title:(String(t1.t).match(/<title>[^<]{0,90}/)||[''])[0], petshop_asset:String(t1.t).includes('https://petshop.lt/wp-content')?'TAIP':'ne', dev_liekanu:String(t1.t).includes('dev.avesa.lt')?'YRA':'nera'};
  const t2=await ipReq('www.petshop.lt','/');
  out.PATIKROS.www={s:t2.s, loc:t2.loc};
  const t3=await ipReq('petshop.lt','/wp-login.php');
  out.PATIKROS.wplogin={s:t3.s};
  const t4=await ipApi('petshop.lt','/wp-json/code-snippets/v1/snippets');
  let s4=[]; try{s4=JSON.parse(t4.t);}catch(e){}
  out.PATIKROS.rest_ip={s:t4.s, kiek:Array.isArray(s4)?s4.length:String(t4.t).slice(0,100)};
  const t5=await ipReq('petshop.lt','/parduotuve/');
  out.PATIKROS.parduotuve={s:t5.s, turi_prekiu:String(t5.t).includes('product')?'TAIP':'ne'};
  const t6=await ipReq('petshop.lt','/wp-json/wp/v2/product?per_page=1');
  out.PATIKROS.wp_v2={s:t6.s, ok:String(t6.t).startsWith('[')?'TAIP':'ne'};
  /* dev stubai po siteurl pakeitimo */
  const d1=await fetch(WP+'/', {redirect:'manual'}); out.PATIKROS.dev_titulinis={s:d1.status, loc:d1.headers.get('location')};
  const d2=await fetch(WP+'/wp-load.php'); out.PATIKROS.dev_wp_load_stub={s:d2.status};
  const d3=await fetch(WP+'/wp-json/code-snippets/v1/snippets',{headers:{Authorization:AUTH}});
  let s3=[]; try{s3=JSON.parse(await d3.text());}catch(e){}
  out.PATIKROS.dev_rest_po={s:d3.status, kiek:Array.isArray(s3)?s3.length:'?'};
}catch(e){ if(String(e).indexOf('stop')<0) out.klaida=String(e).slice(0,400); }
await put('screenshots/r189.json', Buffer.from(JSON.stringify(out,null,1)), 'r189 siteurl + galutines patikros');
