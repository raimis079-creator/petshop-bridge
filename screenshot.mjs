process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import https from 'node:https';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const A64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjE4OGEnXSkgPyAkX0dFVFsncHNfcjE4OGEnXSA6ICcnKSAhPT0gJ0dPJykgcmV0dXJuOwogJG8gPSBhcnJheSgndic9PidSMTg4YScpOwogJGlzID0gJy9ob21lL2d5dnVuYWkyL2RvbWFpbnMvYXZlc2EubHQvcHVibGljX2h0bWwvcGVya2VsdGktcjE4Ni5waHAnOwogJGkgID0gcnRyaW0oQUJTUEFUSCwnLycpLicvcGVya2VsdGktcjE4Ni5waHAnOwogJGtvZGFzID0gQGZpbGVfZ2V0X2NvbnRlbnRzKCRpcyk7CiBpZigka29kYXMgPT09IGZhbHNlKXsgJG9bJ1NUT1AnXT0nbW92ZXIgbmVyYXN0YXMgYXZlc2EubHQgc2FrbnlqZSc7IH0KIGVsc2UgewogICAkdCA9IEB0b2tlbl9nZXRfYWxsKCRrb2RhcywgVE9LRU5fUEFSU0UpOwogICBpZighaXNfYXJyYXkoJHQpKXsgJG9bJ1NUT1AnXT0nc2ludGFrc2VzIGtsYWlkYSc7IH0KICAgZWxzZSB7CiAgICAgJG9bJ2lyYXN5dGEnXSA9IEBmaWxlX3B1dF9jb250ZW50cygkaSwka29kYXMpICE9PSBmYWxzZSA/ICdPSycgOiAnTkUnOwogICAgICRvWydtZDVfc3V0YW1wYSddID0gKG1kNV9maWxlKCRpKSA9PT0gbWQ1KCRrb2RhcykpID8gJ1RBSVAnIDogJ05FJzsKICAgICAkb1snYXZlc2Ffa29waWphX2lzdHJpbnRhJ10gPSBAdW5saW5rKCRpcykgPyAnVEFJUCcgOiAnTkUnOwogICB9CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg=='; const B64B='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjE4OGInXSkgPyAkX0dFVFsncHNfcjE4OGInXSA6ICcnKSAhPT0gJ0dPJykgcmV0dXJuOwogJG8gPSBhcnJheSgndic9PidSMTg4YicpOwogJG9bJ3NpdGV1cmxfcHJpZXMnXSA9IGdldF9vcHRpb24oJ3NpdGV1cmwnKTsKICRvWydob21lX3ByaWVzJ10gICAgPSBnZXRfb3B0aW9uKCdob21lJyk7CiB1cGRhdGVfb3B0aW9uKCdzaXRldXJsJywnaHR0cHM6Ly9wZXRzaG9wLmx0Jyk7CiB1cGRhdGVfb3B0aW9uKCdob21lJywnaHR0cHM6Ly9wZXRzaG9wLmx0Jyk7CiB3cF9jYWNoZV9mbHVzaCgpOwogJG9bJ3NpdGV1cmxfcG8nXSA9IGdldF9vcHRpb24oJ3NpdGV1cmwnKTsKICRvWydob21lX3BvJ10gICAgPSBnZXRfb3B0aW9uKCdob21lJyk7CiAkb1snQUJTUEFUSCddICAgID0gQUJTUEFUSDsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const RAKTAS='82e6f068b8e8b3fbbbecbaa230a2be67'; const IP='79.98.29.24';
const out={versija:'RUN2-R188'};
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
    const req=https.request({host:IP, port:443, path, method:opt.method||'GET', servername:host, rejectUnauthorized:false,
      headers:{Host:host,'User-Agent':'ps-run2',...(opt.headers||{})}}, (res)=>{
      let d=''; res.on('data',c=>{ if(d.length<6000) d+=c; }); res.on('end',()=>resolve({s:res.statusCode, loc:res.headers.location||null, t:d}));
    });
    req.on('error',(e)=>resolve({s:0,t:String(e).slice(0,200)}));
    req.setTimeout(30000,()=>{req.destroy(); resolve({s:0,t:'timeout'});});
    if(opt.body) req.write(opt.body);
    req.end();
  });
}
async function ipApi(host,p,o={}){ return ipReq(host,p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); }
try{
  /* 0. TEMP isjungimas + mover perkelimas i dev sakni */
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cA=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP R188a Mover i dev sakni',code:Buffer.from(A64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let jA=null; try{jA=JSON.parse(cA.t);}catch(e){}
  await miegok(8000);
  const r0=await fetch(WP+'/?ps_r188a=GO'); try{ out.MOVER_PERKELTAS=JSON.parse(await r0.text()); }catch(e){ out.MOVER_PERKELTAS={ZALIAS:'?'}; }
  if(jA&&jA.id) await api('/wp-json/code-snippets/v1/snippets/'+jA.id,{method:'POST',body:JSON.stringify({id:jA.id,active:false})});
  if(!out.MOVER_PERKELTAS || out.MOVER_PERKELTAS.md5_sutampa!=='TAIP'){ out.STOP='mover neperkeltas — perkelimas NEDAROMAS'; throw new Error('stop'); }

  /* 1. BUKLE per dev */
  const rb=await fetch(WP+'/perkelti-r186.php?raktas='+RAKTAS+'&veiksmas=BUKLE');
  try{ out.PRIES=JSON.parse(await rb.text()); }catch(e){ out.PRIES={ZALIAS:'?'}; }
  if(!out.PRIES || out.PRIES.src_yra_wp!=='TAIP' || out.PRIES.dst_yra_wp!=='NE' || out.PRIES.old_yra!=='TAIP'&&out.PRIES.old_yra!=='NE'){ }
  if(out.PRIES.src_yra_wp!=='TAIP' || out.PRIES.dst_yra_wp==='TAIP' || out.PRIES.old_yra==='TAIP'){ out.STOP='BUKLE saugikliai nepraeina'; throw new Error('stop'); }

  /* 2. PIRMYN — pats perkelimas */
  const rp=await fetch(WP+'/perkelti-r186.php?raktas='+RAKTAS+'&veiksmas=PIRMYN');
  try{ out.PERKELIMAS=JSON.parse(await rp.text()); }catch(e){ out.PERKELIMAS={ZALIAS:'nepavyko perskaityti'}; }
  if(!out.PERKELIMAS || out.PERKELIMAS.patikra_dst_wpconfig!=='TAIP'){ out.STOP='PIRMYN nepatvirtintas'; throw new Error('stop'); }
  await miegok(4000);

  /* 3. Patikra: WP gyvas naujoje vietoje (dar senas siteurl — laukiam redirect arba 200) */
  out.PO_PERKELIMO = {};
  out.PO_PERKELIMO.titulinis = await ipReq('petshop.lt','/');
  out.PO_PERKELIMO.titulinis.t = (out.PO_PERKELIMO.titulinis.t||'').slice(0,300);
  out.PO_PERKELIMO.wplogin = await ipReq('petshop.lt','/wp-login.php');
  out.PO_PERKELIMO.wplogin.t = (out.PO_PERKELIMO.wplogin.t||'').slice(0,120);

  /* 4. siteurl -> https://petshop.lt per IP prisegta REST */
  const cB=await ipApi('petshop.lt','/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP R188b Site URL i petshop.lt',code:Buffer.from(B64B,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let jB=null; try{jB=JSON.parse(cB.t);}catch(e){}
  out.SNIPPET_B = jB&&jB.id ? jB.id : ('KLAIDA '+cB.s+' '+String(cB.t).slice(0,200));
  await miegok(8000);
  const ru=await ipReq('petshop.lt','/?ps_r188b=GO');
  try{ out.SITEURL=JSON.parse(ru.t); }catch(e){ out.SITEURL={ZALIAS:String(ru.t).slice(0,300), s:ru.s, loc:ru.loc}; }
  if(jB&&jB.id) await ipApi('petshop.lt','/wp-json/code-snippets/v1/snippets/'+jB.id,{method:'POST',body:JSON.stringify({id:jB.id,active:false})});

  /* 5. Galutines patikros */
  await miegok(3000);
  out.GALUTINES = {};
  const t1 = await ipReq('petshop.lt','/');
  out.GALUTINES.titulinis = {s:t1.s, loc:t1.loc, title:(String(t1.t).match(/<title>[^<]*/)||[''])[0], turi_petshop_nuorodas: String(t1.t).includes('https://petshop.lt')?'TAIP':'ne'};
  const t2 = await ipReq('www.petshop.lt','/');
  out.GALUTINES.www = {s:t2.s, loc:t2.loc};
  const t3 = await ipReq('petshop.lt','/wp-login.php');
  out.GALUTINES.wplogin = {s:t3.s};
  const t4 = await ipApi('petshop.lt','/wp-json/code-snippets/v1/snippets');
  let s4=[]; try{s4=JSON.parse(t4.t);}catch(e){}
  out.GALUTINES.rest_snippetai = {s:t4.s, kiek:Array.isArray(s4)?s4.length:('?'+String(t4.t).slice(0,120))};
  const t5 = await ipReq('petshop.lt','/parduotuve/');
  out.GALUTINES.parduotuve = {s:t5.s, loc:t5.loc};
  /* dev stubai */
  const d1 = await fetch(WP+'/wp-load.php'); out.GALUTINES.dev_wp_load_stub = {s:d1.status};
  const d2 = await fetch(WP+'/', {redirect:'manual'}); out.GALUTINES.dev_titulinis = {s:d2.status, loc:d2.headers.get('location')};
}catch(e){ if(String(e).indexOf('stop')<0) out.klaida=String(e).slice(0,400); }
await put('screenshots/r188.json', Buffer.from(JSON.stringify(out,null,1)), 'r188 PERKELIMAS');
