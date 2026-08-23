process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfZml4MiddKSB8fCAkX0dFVFsncHNfZml4MiddIT09J1JVTjIwMjYwODIzJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkVD1hcnJheSgndic9PidGSVgyJyk7CiBhZGRfZmlsdGVyKCdwcmVfd3BfbWFpbCcsJ19fcmV0dXJuX2ZhbHNlJyw5OTkpOwogJHJtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0Rlc2snLCdrbGF1c2ltYXMnKTsgJHJtLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIG9yZGVyX2lkIEZST00geyR3cGRiLT5wcmVmaXh9d2Nfb3JkZXJzX21ldGEgV0hFUkUgbWV0YV9rZXk9J19wc190ZXN0aW5pcycgT1JERVIgQlkgb3JkZXJfaWQiKTsKCiAvKiAxLiBQcmllemFzdHlzIFBSSUVTICovCiBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJG89d2NfZ2V0X29yZGVyKCRpZCk7ICRUWydwcmllcyddWyRpZF09JHJtLT5pbnZva2UobnVsbCwkbyk7IH0KCiAvKiAyLiBUYWlzb20gdGlrIHR1b3MsIGt1cmllbXMga2xhdXNpbWFzIGRlbCBBViBsaWt1Y2l1ICovCiAkVFsndGFpc3l0YSddPWFycmF5KCk7CiBmb3JlYWNoKCRpZHMgYXMgJGlkKXsKICAgJG89d2NfZ2V0X29yZGVyKCRpZCk7ICRrPSRUWydwcmllcyddWyRpZF07CiAgIGlmKCEkaykgY29udGludWU7CiAgICRwYWs9ZmFsc2U7CiAgIGZvcmVhY2goJG8tPmdldF9pdGVtcygpIGFzICRpdCl7CiAgICAgJHBpZD0kaXQtPmdldF9wcm9kdWN0X2lkKCk7ICRxPSRpdC0+Z2V0X3F1YW50aXR5KCk7CiAgICAgJHI9UGV0c2hvcF9BVl9Tb3VyY2U6OnJlc29sdmUoJHBpZCwkcSk7CiAgICAgaWYoaXNzZXQoJHJbJ3NvdXJjZSddKSAmJiAkclsnc291cmNlJ109PT0nYXYnICYmICEkclsnYXZfdXp0ZW5rYSddKXsKICAgICAgICRuYXVqYT1tYXgoMSwoaW50KSRyWydhdl9xdHknXSk7CiAgICAgICBpZigkbmF1amE8JHEpeyAkaXQtPnNldF9xdWFudGl0eSgkbmF1amEpOyAkaXQtPnNhdmUoKTsgJHBhaz10cnVlOwogICAgICAgICAkVFsndGFpc3l0YSddW109JGlkLic6IHByZWtlICcuJHBpZC4nICcuJHEuJ+KGkicuJG5hdWphLicgKGF2X3F0eT0nLiRyWydhdl9xdHknXS4nKSc7IH0KICAgICB9CiAgIH0KICAgaWYoJHBhayl7ICRvLT5jYWxjdWxhdGVfdG90YWxzKHRydWUpOyAkby0+c2F2ZSgpOyB9CiB9CgogLyogMy4gUG8gdGFpc3ltbyAqLwogZm9yZWFjaCgkaWRzIGFzICRpZCl7CiAgICRvPXdjX2dldF9vcmRlcigkaWQpOwogICAkVFsncG8nXVskaWRdPWFycmF5KCdrbGF1c2ltYXMnPT4kcm0tPmludm9rZShudWxsLCRvKSwndmlzbyc9PiRvLT5nZXRfdG90YWwoKSwnYnVzZW5hJz0+JG8tPmdldF9zdGF0dXMoKSk7CiB9CiAvKiBBViBsaWt1Y2lhaSBuYXVkb3R1IHByZWtpdSAqLwogZm9yZWFjaChhcnJheSgxNDkyOSwxNDkzMiwxNDkzNSwxNDkzNywxNDk0MSwxNDk0NSkgYXMgJHApewogICAkcj1QZXRzaG9wX0FWX1NvdXJjZTo6cmVzb2x2ZSgkcCwxKTsgJFRbJ2F2X2xpa3VjaWFpJ11bJHBdPSRyWydhdl9xdHknXTsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK';
const out={v:'FIX2'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  const u='https://api.github.com/repos/'+REPO+'/contents/'+path;
  const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
let sid=null;
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Test Uzsakymai v3 (klausimu priezastys)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id;
    await miegok(6000);
    const d=await fetch(WP+'/?ps_fix2=RUN20260823');
    const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
    const txt=await d.text();
    try{ out.R=JSON.parse(txt); }catch(e){ out.R='ne-json: '+txt.slice(0,600); }
    const cookies=[];
    for(const s of raw){
      const p=s.split(';')[0]; const i=p.indexOf('=');
      const n=p.slice(0,i), v=p.slice(i+1);
      if(!n) continue;
      cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false});
    }
    out.slapukai=cookies.map(c=>c.name);
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/fix2.json', Buffer.from(JSON.stringify(out,null,1)), 'FIX2');
