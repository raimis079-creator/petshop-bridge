process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIE1hdG1lbnUgU2tlbmF2aW1hcyB2MS4wICh2aXNhcyBrYXRhbG9nYXMpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiBpZiggKCRfR0VUWydwc192cyddID8/ICcnKSAhPT0gJ1ZTMScgKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7IEBzZXRfdGltZV9saW1pdCgzMDApOwogJG89Wyd2Jz0+J1ZTMScsJ2VpbCc9PltdXTsKICRlaWw9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQscG9zdF90aXRsZSxwb3N0X2NvbnRlbnQscG9zdF9leGNlcnB0CiAgIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXMgSU4gKCdwdWJsaXNoJywnZHJhZnQnKSIsIEFSUkFZX0EpOwogJG9bJ3Rpa3JpbnRhJ109Y291bnQoJGVpbCk7CiAkamF1PTA7ICRyYXN0YT0wOwogZm9yZWFjaCgkZWlsIGFzICRwKXsKICAgJHBpZD0oaW50KSRwWydJRCddOwogICAkdD0kcFsncG9zdF90aXRsZSddLicgfHwgJy53cF9zdHJpcF9hbGxfdGFncygkcFsncG9zdF9jb250ZW50J10pLicgfHwgJy53cF9zdHJpcF9hbGxfdGFncygkcFsncG9zdF9leGNlcnB0J10pOwogICAkdD1zdHJfcmVwbGFjZSgnLCcsJy4nLCR0KTsKICAgJHI9W107CiAgIGlmKHByZWdfbWF0Y2hfYWxsKCcvKFxkezEsM30oPzpcLlxkKyk/KVxzKlt4w5cqXVxzKihcZHsxLDN9KD86XC5cZCspPylccypbeMOXKl1ccyooXGR7MSwzfSg/OlwuXGQrKT8pL3UnLCR0LCRtLFBSRUdfU0VUX09SREVSKSkKICAgICBmb3JlYWNoKCRtIGFzICRnKSAkcltdPVsoZmxvYXQpJGdbMV0sKGZsb2F0KSRnWzJdLChmbG9hdCkkZ1szXV07CiAgIGlmKCEkciAmJiBwcmVnX21hdGNoX2FsbCgnLyhcZHsxLDN9KD86XC5cZCspPylccypbeMOXKl1ccyooXGR7MSwzfSg/OlwuXGQrKT8pL3UnLCR0LCRtLFBSRUdfU0VUX09SREVSKSkKICAgICBmb3JlYWNoKCRtIGFzICRnKSAkcltdPVsoZmxvYXQpJGdbMV0sKGZsb2F0KSRnWzJdXTsKICAgJG1heD1udWxsOyRtaW49bnVsbDsKICAgZm9yZWFjaCgkciBhcyAkeCl7ICR4PWFycmF5X2ZpbHRlcigkeCxmdW5jdGlvbigkdil7cmV0dXJuICR2Pj01JiYkdjw9MjUwO30pOwogICAgIGlmKGNvdW50KCR4KTwyKSBjb250aW51ZTsgJG14PW1heCgkeCk7IGlmKCRtYXg9PT1udWxsfHwkbXg+JG1heCl7JG1heD0kbXg7JG1pbj1taW4oJHgpO30gfQogICAvKiBhdWtzdGlzIHBhdmFkaW5pbWUg4oCUIGRyYXNreWtsZW1zIGlyIHN0dWxwYW1zICovCiAgICRhdWs9bnVsbDsKICAgaWYocHJlZ19tYXRjaCgnLyhcZHsyLDN9KD86XC5cZCspPylccypjbS91JywkcFsncG9zdF90aXRsZSddLCRtbSkpICRhdWs9KGZsb2F0KSRtbVsxXTsKICAgJGVmZj1tYXgoWyRtYXg/OjAsJGF1az86MF0pOwogICBpZigkZWZmPDUwKSBjb250aW51ZTsKICAgJHJhc3RhKys7CiAgICRrdXJqPWdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3Rpa19rdXJqZXJpdScsdHJ1ZSk7CiAgIGlmKCRrdXJqPT09J3llcycpeyAkamF1Kys7IGNvbnRpbnVlOyB9CiAgICRrdD13cF9nZXRfb2JqZWN0X3Rlcm1zKCRwaWQsJ3Byb2R1Y3RfY2F0JyxbJ2ZpZWxkcyc9PiduYW1lcyddKTsKICAgJG9bJ2VpbCddW109WydpZCc9PiRwaWQsJ3Bhdic9Pm1iX3N1YnN0cigkcFsncG9zdF90aXRsZSddLDAsNjYpLAogICAgICdrYXQnPT5pc193cF9lcnJvcigka3QpP1tdOiRrdCwnZWZmJz0+JGVmZiwnbWF4Jz0+JG1heCwnbWluJz0+JG1pbl07CiB9CiAkb1sndmlyc181MCddPSRyYXN0YTsgJG9bJ2phdV9wYXp5bWV0YSddPSRqYXU7ICRvWyduZXBhenltZXRhJ109Y291bnQoJG9bJ2VpbCddKTsKIHVzb3J0KCRvWydlaWwnXSxmdW5jdGlvbigkYSwkYil7IHJldHVybiAkYlsnZWZmJ108PT4kYVsnZWZmJ107IH0pOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sOTkpOwo='; const VER='VISI-v1.0'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(10000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Matmenu Skenavimas v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_vs=VS1',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'vs');
  const dt=await d.text(); let J=null; try{ J=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,900); }
  if(J){ out.tikrinta=J.tikrinta; out.virs_50=J.virs_50; out.jau=J.jau_pazymeta; out.nepazymeta=J.nepazymeta;
    await put('analize/visi_matmenys.json', Buffer.from(JSON.stringify(J,null,1)), VER); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/visi_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
