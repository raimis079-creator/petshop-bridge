process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIE1hdG1lbnlzIGlzIEFwcmFzeW11IHYxLjAgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCAoJF9HRVRbJ3BzX21tJ10gPz8gJycpICE9PSAnTU0xJyApIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJG89Wyd2Jz0+J01NMScsJ2VpbCc9PltdXTsKICRrYXRhaT1bMTA2LDEyMSwxMjIsMTI1XTsKICRpZHM9W107CiBmb3JlYWNoKCRrYXRhaSBhcyAkayl7CiAgIGZvcmVhY2goZ2V0X3Bvc3RzKFsncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PlsncHVibGlzaCcsJ2RyYWZ0J10sJ251bWJlcnBvc3RzJz0+LTEsCiAgICAgJ2ZpZWxkcyc9PidpZHMnLCd0YXhfcXVlcnknPT5bWyd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2ZpZWxkJz0+J3Rlcm1faWQnLCd0ZXJtcyc9PiRrXV1dKSBhcyAkeCkgJGlkc1soaW50KSR4XT10cnVlOwogfQogZm9yZWFjaChhcnJheV9rZXlzKCRpZHMpIGFzICRwaWQpewogICAkcD1nZXRfcG9zdCgkcGlkKTsKICAgJHQ9JHAtPnBvc3RfdGl0bGUuJyB8fCAnLndwX3N0cmlwX2FsbF90YWdzKCRwLT5wb3N0X2NvbnRlbnQpLicgfHwgJy53cF9zdHJpcF9hbGxfdGFncygkcC0+cG9zdF9leGNlcnB0KTsKICAgJHQ9c3RyX3JlcGxhY2UoJywnLCcuJywkdCk7CiAgICRyYXN0YT1bXTsKICAgLyogdHJ5cyBtYXRtZW55cyAqLwogICBpZihwcmVnX21hdGNoX2FsbCgnLyhcZHsxLDN9KD86XC5cZCspPylccypbeMOXKl1ccyooXGR7MSwzfSg/OlwuXGQrKT8pXHMqW3jDlypdXHMqKFxkezEsM30oPzpcLlxkKyk/KS91JywkdCwkbSxQUkVHX1NFVF9PUkRFUikpewogICAgIGZvcmVhY2goJG0gYXMgJGcpICRyYXN0YVtdPVsoZmxvYXQpJGdbMV0sKGZsb2F0KSRnWzJdLChmbG9hdCkkZ1szXV07CiAgIH0KICAgLyogZHUgbWF0bWVueXMgKi8KICAgaWYoISRyYXN0YSAmJiBwcmVnX21hdGNoX2FsbCgnLyhcZHsxLDN9KD86XC5cZCspPylccypbeMOXKl1ccyooXGR7MSwzfSg/OlwuXGQrKT8pL3UnLCR0LCRtLFBSRUdfU0VUX09SREVSKSl7CiAgICAgZm9yZWFjaCgkbSBhcyAkZykgJHJhc3RhW109WyhmbG9hdCkkZ1sxXSwoZmxvYXQpJGdbMl1dOwogICB9CiAgICRtYXg9bnVsbDsgJG1pbj1udWxsOyAkcmluaz1udWxsOwogICBmb3JlYWNoKCRyYXN0YSBhcyAkcil7CiAgICAgJHI9YXJyYXlfZmlsdGVyKCRyLGZ1bmN0aW9uKCR2KXtyZXR1cm4gJHY+PTUgJiYgJHY8PTI1MDt9KTsKICAgICBpZihjb3VudCgkcik8MikgY29udGludWU7CiAgICAgJG14PW1heCgkcik7CiAgICAgaWYoJG1heD09PW51bGwgfHwgJG14PiRtYXgpeyAkbWF4PSRteDsgJG1pbj1taW4oJHIpOyAkcmluaz0kcjsgfQogICB9CiAgICRrdD13cF9nZXRfb2JqZWN0X3Rlcm1zKCRwaWQsJ3Byb2R1Y3RfY2F0JyxbJ2ZpZWxkcyc9PiduYW1lcyddKTsKICAgJG9bJ2VpbCddW109WydpZCc9PiRwaWQsJ3Bhdic9Pm1iX3N1YnN0cigkcC0+cG9zdF90aXRsZSwwLDcwKSwnc3QnPT4kcC0+cG9zdF9zdGF0dXMsCiAgICAgJ2thdCc9PmlzX3dwX2Vycm9yKCRrdCk/W106JGt0LCdrdXJqJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHNfdGlrX2t1cmplcml1Jyx0cnVlKSwKICAgICAnbWF4Jz0+JG1heCwnbWluJz0+JG1pbiwnbWF0bWVueXMnPT4kcmluaywKICAgICAnYXByYXN5bW9faWxnaXMnPT5tYl9zdHJsZW4od3Bfc3RyaXBfYWxsX3RhZ3MoJHAtPnBvc3RfY29udGVudCkpXTsKIH0KICRvWyd2aXNvJ109Y291bnQoJG9bJ2VpbCddKTsKICRvWydiZV9tYXRtZW51J109Y291bnQoYXJyYXlfZmlsdGVyKCRvWydlaWwnXSxmdW5jdGlvbigkeCl7cmV0dXJuICR4WydtYXgnXT09PW51bGw7fSkpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sOTkpOwo='; const VER='MM-v1.0'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Matmenys is Aprasymu v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_mm=MM1',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'mm');
  const dt=await d.text(); let J=null; try{ J=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,800); }
  if(J){ out.viso=J.viso; out.be_matmenu=J.be_matmenu;
    await put('analize/matmenys.json', Buffer.from(JSON.stringify(J,null,1)), VER); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/matmenys_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
