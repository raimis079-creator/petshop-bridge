process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEthdGFsb2dvIEZhaWxvIFBhdGlrcmEgdjEuMCAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoICgkX0dFVFsncHNfa2F0ZiddID8/ICcnKSAhPT0gJ0tBVEYxJyApIHJldHVybjsKICRvPVsndic9PidLQVRGMScsJ3JlcG9fbWQ1Jz0+JzRjOGQyNWMwODNjNWE0MjM1ODMxNTA1Y2UxMzhhOTIwJ107CiAka2FuZD1bXTsKIGlmKGRlZmluZWQoJ1dQTVVfUExVR0lOX0RJUicpKSAka2FuZFtdPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCc7CiBpZihkZWZpbmVkKCdXUF9QTFVHSU5fRElSJykpICAgeyAka2FuZFtdPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWthdGFsb2dhcy5waHAnOwogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGthbmRbXT1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMvcGV0c2hvcC1rYXRhbG9nYXMucGhwJzsgfQogZm9yZWFjaCgka2FuZCBhcyAkcCl7CiAgIGlmKCFmaWxlX2V4aXN0cygkcCkpIHsgJG9bJ3Rpa3JpbnRhJ11bXT1bJ2tlbGlhcyc9PiRwLCd5cmEnPT5mYWxzZV07IGNvbnRpbnVlOyB9CiAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsKICAgJG09bWQ1KCRjKTsKICAgJHZlcj1udWxsOyBpZihwcmVnX21hdGNoKCcvVmVyc2lvbjpccyooWzAtOS5dKykvJyxzdWJzdHIoJGMsMCwzMDAwKSwkbW0pKSAkdmVyPSRtbVsxXTsKICAgJG9bJ3Rpa3JpbnRhJ11bXT1bJ2tlbGlhcyc9PiRwLCd5cmEnPT50cnVlLCdiYWl0dSc9PnN0cmxlbigkYyksJ21kNSc9PiRtLCd2ZXJzaWphJz0+JHZlciwKICAgICAgICAgICAgICAgICAgICAgJ3N1dGFtcGFfc3VfcmVwbyc9PigkbT09PSc0YzhkMjVjMDgzYzVhNDIzNTgzMTUwNWNlMTM4YTkyMCcpXTsKICAgaWYoJG0hPT0nNGM4ZDI1YzA4M2M1YTQyMzU4MzE1MDVjZTEzOGE5MjAnKXsgJG9bJ2d5dmFzX2I2NCddPWJhc2U2NF9lbmNvZGUoJGMpOyB9CiAgICRvWydyYXN0YXMnXT0kcDsKICAgYnJlYWs7CiB9CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw5OSk7Cg==';
const VER='KATF-v1.0'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(7000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Katalogo Failo Patikra v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_katf=KATF1',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'katf');
  const dt=await d.text(); let J=null; try{ J=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,800); }
  if(J){ const gyvas=J.gyvas_b64; delete J.gyvas_b64;
         out.info=J;
         if(gyvas){ await put('deploy/katalogas_gyvas.php', Buffer.from(gyvas,'base64'), VER+' gyvas failas'); out.parsiustas=true; } }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/katf_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
