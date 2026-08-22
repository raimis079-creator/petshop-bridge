process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaW52OCddKSB8fCAkX0dFVFsncHNfaW52OCddIT09J1JVTicpIHJldHVybjsKIGFkZF9maWx0ZXIoJ3ByZV93cF9tYWlsJywnX19yZXR1cm5fZmFsc2UnKTsKICRUPWFycmF5KCd2Jz0+J0lOVjgnKTsgJFRQTD0naW52b2ljZSc7ICRPSUQ9MDsKIHRyeXsKICAgLyogMS4gbGFpa2luYXMgdXpzYWt5bWFzICovCiAgICRwPXdjX2dldF9wcm9kdWN0cyhhcnJheSgnbGltaXQnPT4xLCdzdGF0dXMnPT4ncHVibGlzaCcsJ3N0b2NrX3N0YXR1cyc9PidpbnN0b2NrJywnb3JkZXJieSc9PidJRCcsJ29yZGVyJz0+J0RFU0MnKSk7CiAgIGlmKGVtcHR5KCRwKSl7ICRUWydrbGFpZGEnXT0ncHJla3UgbmVyYXN0YSc7IH0KICAgZWxzZXsKICAgICAkcHJvZD0kcFswXTsKICAgICAkVFsncHJla2UnXT1hcnJheSgnaWQnPT4kcHJvZC0+Z2V0X2lkKCksJ3Bhdic9PiRwcm9kLT5nZXRfbmFtZSgpKTsKICAgICAkbz13Y19jcmVhdGVfb3JkZXIoKTsKICAgICAkby0+YWRkX3Byb2R1Y3QoJHByb2QsMSk7CiAgICAgJG8tPnNldF9hZGRyZXNzKGFycmF5KCdmaXJzdF9uYW1lJz0+J1RFU1RBUycsJ2xhc3RfbmFtZSc9PidQREYnLCdhZGRyZXNzXzEnPT4nTWlza28gZy4gMScsCiAgICAgICAnY2l0eSc9PidWaWxuaXVzJywncG9zdGNvZGUnPT4nMTIyMjInLCdjb3VudHJ5Jz0+J0xUJywnZW1haWwnPT4ndGVycmFAcGV0c2hvcC5sdCcsJ3Bob25lJz0+JyszNzA2MDAwMDAwMCcpLCdiaWxsaW5nJyk7CiAgICAgJG8tPmNhbGN1bGF0ZV90b3RhbHMoKTsKICAgICAkby0+c2F2ZSgpOwogICAgICRPSUQ9JG8tPmdldF9pZCgpOwogICAgICRUWydzdWt1cnRhc191enNha3ltYXMnXT0kT0lEOwoKICAgICAkVEE9J1R5Y2hlXFxXQ0ROXFxBcGlcXFRlbXBsYXRlcyc7ICRUVD0nVHljaGVcXFdDRE5cXEhlbHBlcnNcXFRlbXBsYXRlcyc7CiAgICAgJG9yZGVyPXdjX2dldF9vcmRlcigkT0lEKTsKICAgICAkZGF0YT1hcnJheSgKICAgICAgICdvcmRlcicgICAgPT4gY2FsbF91c2VyX2Z1bmMoYXJyYXkoJFRBLCdmb3JtYXRfb3JkZXJfZGF0YScpLCAkb3JkZXIsIGZhbHNlLCAkVFBMKSwKICAgICAgICdzaG9wJyAgICAgPT4gY2FsbF91c2VyX2Z1bmMoYXJyYXkoJFRBLCdnZXRfc3RvcmVfZGF0YScpKSwKICAgICAgICdkb2N1bWVudCcgPT4gY2FsbF91c2VyX2Z1bmMoYXJyYXkoJFRBLCdnZXRfZG9jdW1lbnRfZGF0YScpKSwKICAgICAgICdzZXR0aW5ncycgPT4gY2FsbF91c2VyX2Z1bmMoYXJyYXkoJFRULCd0ZW1wbGF0ZScpLCAkVFBMKSwKICAgICAgICd0ZW1wbGF0ZScgPT4gJFRQTCwKICAgICApOwogICAgICRUWydzaG9wX2xvZ28nXT1pc3NldCgkZGF0YVsnc2hvcCddWydsb2dvJ10pPyRkYXRhWydzaG9wJ11bJ2xvZ28nXTonKG5lcmEpJzsKICAgICAkVFsnc2hvcF9sb2dvX3BhdGgnXT1hcnJheV9rZXlfZXhpc3RzKCdsb2dvX3BhdGgnLChhcnJheSkkZGF0YVsnc2hvcCddKT8oJGRhdGFbJ3Nob3AnXVsnbG9nb19wYXRoJ10/OicoVFVTQ0lBUyknKTonKG5lcmEgcmFrdG8pJzsKICAgICAkc3ZjPWNhbGxfdXNlcl9mdW5jKGFycmF5KCdUeWNoZVxcV0NETlxcU2VydmljZScsJ3BkZicpKTsKICAgICAkZmlsZT0kc3ZjLT5nZW5lcmF0ZSgkT0lELCRUUEwsJGRhdGEsdHJ1ZSk7CiAgICAgJFRbJ2ZhaWxhcyddPSRmaWxlP2Jhc2VuYW1lKCRmaWxlKTonRkFMU0UnOwogICAgIGlmKCRmaWxlICYmIGZpbGVfZXhpc3RzKCRmaWxlKSl7CiAgICAgICAkYmluPWZpbGVfZ2V0X2NvbnRlbnRzKCRmaWxlKTsKICAgICAgICRUWydwZGZfYmFpdGFpJ109c3RybGVuKCRiaW4pOwogICAgICAgJFRbJ0RDVERlY29kZSddPXN1YnN0cl9jb3VudCgkYmluLCdEQ1REZWNvZGUnKTsKICAgICAgICRsZz1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvMjAyNi8wNS9QaWxuby1sb2dvdGlwby1zcGFsdm90YS12ZXJzaWphLTEwMC0yLmpwZyc7CiAgICAgICBpZihmaWxlX2V4aXN0cygkbGcpKXsKICAgICAgICAgJGw9ZmlsZV9nZXRfY29udGVudHMoJGxnKTsKICAgICAgICAgJFRbJ2xvZ29fZHlkaXMnXT1zdHJsZW4oJGwpOwogICAgICAgICAkVFsnbG9nb19iYWl0YWlfcGRmX3ZpZHVqZSddPShzdHJwb3MoJGJpbixzdWJzdHIoJGwsMjAwLDQwMCkpIT09ZmFsc2UpPydUQUlQJzonTkUnOwogICAgICAgfQogICAgICAgJFRbJ2tsYWlkb3NfdGVrc3Rhc19wZGYnXT0oc3RyaXBvcygkYmluLCdJbWFnZSBub3QgZm91bmQnKSE9PWZhbHNlKT8nUkFTVEEnOiduZXJhc3RhJzsKICAgICAgICRUWydwZGZfa2VsaWFzJ109JGZpbGU7CiAgICAgfQogICB9CiB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJFRbJ2V4Y2VwdGlvbiddPWdldF9jbGFzcygkZSkuJzogJy4kZS0+Z2V0TWVzc2FnZSgpLicgQCAnLmJhc2VuYW1lKCRlLT5nZXRGaWxlKCkpLic6Jy4kZS0+Z2V0TGluZSgpOyB9CiAvKiAyLiB2YWx5bWFzOiB1enNha3ltYXMgbGlla2EgVElLIGplaSBudXJvZHl0YSAqLwogaWYoJE9JRCAmJiAoIWlzc2V0KCRfR0VUWydwYWxpayddKSB8fCAkX0dFVFsncGFsaWsnXSE9PScxJykpewogICB0cnl7ICRvPXdjX2dldF9vcmRlcigkT0lEKTsgaWYoJG8peyAkby0+ZGVsZXRlKHRydWUpOyAkVFsndXpzYWt5bWFzX2lzdHJpbnRhcyddPSRPSUQ7IH0gfQogICBjYXRjaChUaHJvd2FibGUgJGUpeyAkVFsndHJ5bmltb19rbGFpZGEnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDUpOwo=';
const out={v:'INV8'};
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
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP INV Verify v3 (laikinas uzsakymas + PDF)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_inv8=RUN');
    const t=await d.text();
    try{ out.R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,1500); }
    const q=await fetch(WP+'/'); const h=await q.text();
    out.pradzia={s:q.status, fatal:/Fatal error|Parse error/i.test(h)?'TAIP':'ne'};
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/inv8.json', Buffer.from(JSON.stringify(out,null,1)), 'INV8 verify');
