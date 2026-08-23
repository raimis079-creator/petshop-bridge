process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfdmVyNiddKSB8fCAkX0dFVFsncHNfdmVyNiddIT09J1JVTjIwMjYwODIzJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkVD1hcnJheSgndic9PidWRVI2Jyk7CiBhZGRfZmlsdGVyKCdwcmVfd3BfbWFpbCcsJ19fcmV0dXJuX2ZhbHNlJyw5OTkpOwoKIC8qIEEuIEtvbnNvbGlkYWNpam9zIHByYWxlaWRpbWFzIOKAlCBFMkUgKi8KICR0PSR3cGRiLT5wcmVmaXguJ3BzX3RpZWtpbWFzX2VpbCc7CiAkcmc9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfQVZfRHJvcHNoaXAnLCdncnVwdW90aScpOyAkcmctPnNldEFjY2Vzc2libGUodHJ1ZSk7CiAkcHJpZXM9JHJnLT5pbnZva2UobnVsbCxhcnJheSgzNTA2NikpOwogJFRbJ0FfcHJpZXMnXT1hcnJheV9rZXlzKCRwcmllcyk7CiAkd3BkYi0+aW5zZXJ0KCR0LGFycmF5KCdwYXJ0aWphX2lkJz0+MywncHJvZHVjdF9pZCc9PjE2Nzc2LCdvcmRlcl9pZCc9PjM1MDY2LCdxdHknPT4xLCdwYXN0YWJhJz0+J1RFU1QgSDIzMycpKTsKICRlaWQ9JHdwZGItPmluc2VydF9pZDsKICRwbz0kcmctPmludm9rZShudWxsLGFycmF5KDM1MDY2KSk7CiAkVFsnQV9wbyddPWFycmF5X2tleXMoJHBvKTsKICRUWydBX3ByaW5zX2RpbmdvJ109KCFpbl9hcnJheSgncHJpbnMnLGFycmF5X2tleXMoJHBvKSx0cnVlKSAmJiBpbl9hcnJheSgncHJpbnMnLGFycmF5X2tleXMoJHByaWVzKSx0cnVlKSk7CiAkd3BkYi0+ZGVsZXRlKCR0LGFycmF5KCdpZCc9PiRlaWQpLGFycmF5KCclZCcpKTsKICRhdGdhbD0kcmctPmludm9rZShudWxsLGFycmF5KDM1MDY2KSk7CiAkVFsnQV9hdHN0YXR5dGEnXT1hcnJheV9rZXlzKCRhdGdhbCk7CiAkVFsnQV9rb25zb2xpZHVvdGFfbWV0b2RhcyddPW1ldGhvZF9leGlzdHMoJ1BldHNob3BfQVZfRHJvcHNoaXAnLCdrb25zb2xpZHVvdGEnKTsKCiAvKiBCLiBUcnluaW1vIHZlaWtzbWFzIOKAlCBhciBhdHNpcmFuZGEgdXpkYXJ5dGFtICovCiAkcnY9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRGVzaycsJ3ZlaWtzbWFpJyk7ICRydi0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICRvPXdjX2dldF9vcmRlcigzNTA1OCk7CiAkc2VuYT0kby0+Z2V0X3N0YXR1cygpOwogJGVpbGU9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRGVzaycsJ2VpbGUnKTsgJGVpbGUtPnNldEFjY2Vzc2libGUodHJ1ZSk7CiAka2w9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRGVzaycsJ2tsYXVzaW1hcycpOyAka2wtPnNldEFjY2Vzc2libGUodHJ1ZSk7CiAkcm93PWFycmF5KCdlaWxlJz0+JGVpbGUtPmludm9rZShudWxsLCRvKSwna2xhdXNpbWFzJz0+JGtsLT5pbnZva2UobnVsbCwkbykpOwogJFRbJ0JfcHJpZXMnXT1hcnJheV9jb2x1bW4oJHJ2LT5pbnZva2UobnVsbCwkbywkcm93KSwnaWQnKTsKICRvLT51cGRhdGVfc3RhdHVzKCdjYW5jZWxsZWQnLCdIMjMzIHRyeW5pbW8gbXlndHVrbyB0ZXN0YXMuJyk7CiAkbz13Y19nZXRfb3JkZXIoMzUwNTgpOwogJHJvdzI9YXJyYXkoJ2VpbGUnPT4kZWlsZS0+aW52b2tlKG51bGwsJG8pLCdrbGF1c2ltYXMnPT4ka2wtPmludm9rZShudWxsLCRvKSk7CiAkdnM9JHJ2LT5pbnZva2UobnVsbCwkbywkcm93Mik7CiAkVFsnQl9hdHNhdWt1cyddPWFycmF5X2NvbHVtbigkdnMsJ2lkJyk7CiBmb3JlYWNoKCR2cyBhcyAkeCl7IGlmKCdpc3RyaW50aSc9PT0keFsnaWQnXSkgJFRbJ0JfZGlhbG9nYXMnXT0keFsnZCddWydvayddLicgfCAnLm1iX3N1YnN0cigkeFsnZCddWyd0ZWtzdGFzJ10sMCw5MCk7IH0KICRUWydCX3RlaXNlJ109Y3VycmVudF91c2VyX2NhbignZGVsZXRlX3Nob3Bfb3JkZXJzJyk7CiAkVFsnQl9idXNlbmEnXT0kby0+Z2V0X3N0YXR1cygpOwogJFRbJ0JfZWlsZSddPSRyb3cyWydlaWxlJ107CiAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJXRyYW5zaWVudCVwc19yeXRhcyUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg==';
const out={v:'VER6'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Patikra H233 v1 (konsolidacija + trynimas)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id;
    await miegok(6000);
    const d=await fetch(WP+'/?ps_ver6=RUN20260823');
    const t=await d.text();
    try{ out.R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,800); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/ver6.json', Buffer.from(JSON.stringify(out,null,1)), 'VER6');
