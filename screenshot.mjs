process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c4NDEnXSk/JF9HRVRbJ3BzX2c4NDEnXTonJykgIT09ICdHODQxJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG89YXJyYXkoJ3YnPT4nRzg0MScsJ3Jha3Rhcyc9PmZ1bmN0aW9uX2V4aXN0cygncHNfZmVlZHNfcmFrdGFzJyk/cHNfZmVlZHNfcmFrdGFzKCk6bnVsbCwKICAgJ2Z1bmtjaWpvcyc9PmFycmF5KCdnZW5lcnVvdGknPT5mdW5jdGlvbl9leGlzdHMoJ3BzX2ZlZWRzX2dlbmVydW90aScpPzE6MCwnaWRzJz0+ZnVuY3Rpb25fZXhpc3RzKCdwc19mZWVkc19pZHMnKT8xOjApLAogICAndmVyc2lqYSc9PmRlZmluZWQoJ1BTX0ZFRURTX1ZFUlNJSkEnKT9QU19GRUVEU19WRVJTSUpBOic/Jyk7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTs=';
const out={versija:'G841'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} out.snip_status=cr.s; return j?j.id:null; }
try{
  const s=await snip('TEMP G841 raktas',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g841=G841')).text();
  let d=null; try{ d=JSON.parse(t); out.d=d; }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});

  if(d && d.raktas){
    const t0=Date.now();
    const r=await fetch(WP+'/?ps_feeds_generuoti='+d.raktas+'&kanalai=all&dry=1');
    const body=await r.text();
    out.dry={status:r.status, sekundes:Math.round((Date.now()-t0)/1000), baitai:body.length};
    try{ out.dry.rezultatas=JSON.parse(body); }catch(e){ out.dry.zalias=body.slice(0,900); }
  }
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('g841.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g841 dry run');
