process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaW52NiddKSB8fCAkX0dFVFsncHNfaW52NiddIT09J1JVTicpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0lOVjYnKTsgJE9JRD0zNTAzNTsgJFRQTD0naW52b2ljZSc7CiAkcGQ9V1BfUExVR0lOX0RJUi4nL3dvb2NvbW1lcmNlLWRlbGl2ZXJ5LW5vdGVzJzsKICRmcj1AZmlsZV9nZXRfY29udGVudHMoJHBkLicvaW5jbHVkZXMvZnJvbnRlbmQvY2xhc3MtZnJvbnRlbmQucGhwJyk7CiBwcmVnX21hdGNoX2FsbCgnL151c2VccytbXjtdKzskL20nLChzdHJpbmcpJGZyLCRtKTsKICRUWyd1c2UnXT0kbVswXTsKICRUQT1udWxsOyRUVD1udWxsOwogZm9yZWFjaCgkbVswXSBhcyAkdSl7CiAgIGlmKHByZWdfbWF0Y2goJy9edXNlXHMrKFteXHM7XSspKD86XHMrYXNccysoXHcrKSk/Oy8nLCR1LCRwKSl7CiAgICAgJGZxPSRwWzFdOyAkYWw9aXNzZXQoJHBbMl0pPyRwWzJdOnN1YnN0cihzdHJyY2hyKCdcXCcuJGZxLCdcXCcpLDEpOwogICAgIGlmKCRhbD09PSdUZW1wbGF0ZXNfQXBpJykgJFRBPSRmcTsKICAgICBpZigkYWw9PT0nVGVtcGxhdGVzJykgJFRUPSRmcTsKICAgfQogfQogJFRbJ1RlbXBsYXRlc19BcGknXT0kVEE7ICRUWydUZW1wbGF0ZXMnXT0kVFQ7CiB0cnl7CiAgICRvcmRlcj13Y19nZXRfb3JkZXIoJE9JRCk7CiAgIGlmKCEkb3JkZXIpeyAkVFsna2xhaWRhJ109J3V6c2FreW1hcyBuZXJhc3Rhcyc7IH0KICAgZWxzZXsKICAgICAkZGF0YT1hcnJheSgKICAgICAgICdvcmRlcicgICAgPT4gY2FsbF91c2VyX2Z1bmMoYXJyYXkoJFRBLCdmb3JtYXRfb3JkZXJfZGF0YScpLCAkb3JkZXIsIGZhbHNlLCAkVFBMKSwKICAgICAgICdzaG9wJyAgICAgPT4gY2FsbF91c2VyX2Z1bmMoYXJyYXkoJFRBLCdnZXRfc3RvcmVfZGF0YScpKSwKICAgICAgICdkb2N1bWVudCcgPT4gY2FsbF91c2VyX2Z1bmMoYXJyYXkoJFRBLCdnZXRfZG9jdW1lbnRfZGF0YScpKSwKICAgICAgICdzZXR0aW5ncycgPT4gY2FsbF91c2VyX2Z1bmMoYXJyYXkoJFRULCd0ZW1wbGF0ZScpLCAkVFBMKSwKICAgICAgICd0ZW1wbGF0ZScgPT4gJFRQTCwKICAgICApOwogICAgICRUWydzaG9wX2xvZ28nXT1pc3NldCgkZGF0YVsnc2hvcCddWydsb2dvJ10pPyRkYXRhWydzaG9wJ11bJ2xvZ28nXTonKG5lcmEpJzsKICAgICAkVFsnc2hvcF9sb2dvX3BhdGgnXT1pc3NldCgkZGF0YVsnc2hvcCddWydsb2dvX3BhdGgnXSk/KCRkYXRhWydzaG9wJ11bJ2xvZ29fcGF0aCddPzonKHR1c2NpYXMpJyk6JyhuZXJhIHJha3RvKSc7CiAgICAgJHN2Yz1jYWxsX3VzZXJfZnVuYyhhcnJheSgnVHljaGVcXFdDRE5cXFNlcnZpY2UnLCdwZGYnKSk7CiAgICAgJGZpbGU9JHN2Yy0+Z2VuZXJhdGUoJE9JRCwkVFBMLCRkYXRhLHRydWUpOwogICAgICRUWydmYWlsYXMnXT0kZmlsZT9iYXNlbmFtZSgkZmlsZSk6J0ZBTFNFJzsKICAgICBpZigkZmlsZSAmJiBmaWxlX2V4aXN0cygkZmlsZSkpewogICAgICAgJGJpbj1maWxlX2dldF9jb250ZW50cygkZmlsZSk7CiAgICAgICAkVFsncGRmX2JhaXRhaSddPXN0cmxlbigkYmluKTsKICAgICAgICRUWydEQ1REZWNvZGUnXT1zdWJzdHJfY291bnQoJGJpbiwnRENURGVjb2RlJyk7CiAgICAgICAkVFsnRmxhdGVEZWNvZGUnXT1zdWJzdHJfY291bnQoJGJpbiwnRmxhdGVEZWNvZGUnKTsKICAgICAgICRsZz0nL2hvbWUvZ3l2dW5haTIvZG9tYWlucy9wZXRzaG9wLmx0L3B1YmxpY19odG1sL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDI2LzA1L1BpbG5vLWxvZ290aXBvLXNwYWx2b3RhLXZlcnNpamEtMTAwLTIuanBnJzsKICAgICAgIGlmKGZpbGVfZXhpc3RzKCRsZykpewogICAgICAgICAkbD1maWxlX2dldF9jb250ZW50cygkbGcpOwogICAgICAgICAkbmVlZGxlPXN1YnN0cigkbCwyMDAsNDAwKTsKICAgICAgICAgJFRbJ2xvZ29fYmFpdGFpX3BkZl92aWR1amUnXT0oc3RycG9zKCRiaW4sJG5lZWRsZSkhPT1mYWxzZSk/J1RBSVAnOidORSc7CiAgICAgICAgICRUWydsb2dvX2R5ZGlzJ109c3RybGVuKCRsKTsKICAgICAgIH0KICAgICAgICRUWydrbGFpZG9zX3Rla3N0YXNfcGRmJ109KHN0cmlwb3MoJGJpbiwnSW1hZ2Ugbm90IGZvdW5kJykhPT1mYWxzZSk/J1JBU1RBJzonbmVyYXN0YSc7CiAgICAgfQogICB9CiB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJFRbJ2V4Y2VwdGlvbiddPWdldF9jbGFzcygkZSkuJzogJy4kZS0+Z2V0TWVzc2FnZSgpOyB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDUpOwo=';
const out={v:'INV6'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP INV Verify v1 (PDF generavimas)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_inv6=RUN');
    const t=await d.text();
    try{ out.R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,1200); }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/inv6.json', Buffer.from(JSON.stringify(out,null,1)), 'INV6 verify');
