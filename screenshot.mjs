process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEthdGFsb2dvIG1hcnphKCkgZnVua2NpamEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiBpZighaXNzZXQoJF9HRVRbJ3BzX2ttMiddKSB8fCAkX0dFVFsncHNfa20yJ10hPT0nS00yMjAyNjA4MjYnKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7CiAkVD1hcnJheSgndic9PidLTTInLCd0cyc9PmdtZGF0ZSgnYycpKTsKICRwPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCc7CiAkTD1maWxlKCRwKTsKICRUWydtZDUnXT1tZDVfZmlsZSgkcCk7ICRUWydlaWwnXT1jb3VudCgkTCk7CgogLyogcmFzdGkgZnVua2NpanUgYXBpYnJlemltdXMgKi8KICRzaz1hcnJheSgpOwogZm9yZWFjaCgkTCBhcyAkaT0+JGxuKXsKICAgaWYocHJlZ19tYXRjaCgnL2Z1bmN0aW9uXHMrKG1hcnphfG1hcnphX2V1cnxncmluZHlzfG1hcnpvc19ncmluZHlzfGFudGthaW5pcylccypcKC9pJywkbG4pKSAkc2tbXT0kaTsKIH0KICRUWydhcGlicmV6aW1haSddPWFycmF5KCk7CiBmb3JlYWNoKCRzayBhcyAkaSl7CiAgICRiPWFycmF5KCk7CiAgIGZvcigkaj1tYXgoMCwkaS0xNCk7JGo8bWluKCRpKzI2LGNvdW50KCRMKSk7JGorKykgJGJbXT0oJGorMSkuJzogJy5ydHJpbSgkTFskal0pOwogICAkVFsnYXBpYnJlemltYWknXVtdPSRiOwogfQoKIC8qIGdyaW5keXMgKi8KICRiPWFycmF5KCk7CiBmb3IoJGo9ODIwOyRqPG1pbig4NjAsY291bnQoJEwpKTskaisrKSAkYltdPSgkaisxKS4nOiAnLnJ0cmltKCRMWyRqXSk7CiAkVFsnZ3JpbmR5c184MjBfODYwJ109JGI7CiAkVFsncHNfbWFyem9zX2dyaW5keXMnXT1nZXRfb3B0aW9uKCdwc19tYXJ6b3NfZ3JpbmR5cycpOwoKIC8qIEpTIHB1c8SXIOKAlCBhciBtYXJ6YSBza2FpY2l1b2phbWEgaXIgbmFyc3lrbGVqZSAqLwogJGpzPWFycmF5KCk7CiBmb3JlYWNoKCRMIGFzICRpPT4kbG4pewogICBpZihwcmVnX21hdGNoKCcvbWFyemF8bWFyei9pJywkbG4pICYmIHByZWdfbWF0Y2goJy92YXIgfGZ1bmN0aW9uIHw9PnxcLnRvRml4ZWR8TWF0aFwuLycsJGxuKSkgJGpzW109KCRpKzEpLic6ICcudHJpbShwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsc3Vic3RyKCRsbiwwLDE1MCkpKTsKIH0KICRUWydqc19rYW5kaWRhdGFpJ109YXJyYXlfc2xpY2UoJGpzLDAsMzApOwoKIC8qIGtpZWsga2FydHUga3ZpZWNpYW1hICovCiAkVFsna3ZpZXRpbWFpJ109YXJyYXkoJ21hcnphKCc9PjAsJ21hcnphX2V1cignPT4wKTsKIGZvcmVhY2goJEwgYXMgJGxuKXsgZm9yZWFjaChhcnJheV9rZXlzKCRUWydrdmlldGltYWknXSkgYXMgJGspeyAkVFsna3ZpZXRpbWFpJ11bJGtdKz1zdWJzdHJfY291bnQoJGxuLCdzZWxmOjonLiRrKTsgfSB9CgogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LDUpOwo=';
const KEY='KM220260826'; const VER='KM2';
const out={v:VER}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Katalogo marza funkcija',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  sid=JSON.parse(await c.text()).id; out.sukurta=sid; await miegok(9000);
  const d=await fx(WP+'/?ps_km2='+KEY,{},'run'); const txt=await d.text();
  out.http=d.status; out.ilgis=txt.length;
  try{ const j=JSON.parse(txt); await put('deploy/km2.json', Buffer.from(JSON.stringify(j,null,1)), VER); out.irasyta=1; }catch(e){ out.pradzia=txt.slice(0,300); }
  
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('deploy/km2run.json', Buffer.from(JSON.stringify(out,null,1)), VER);
