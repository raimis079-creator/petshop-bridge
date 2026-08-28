process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIENvbG9zc2VvIGlyIER1Y2sgUGlsbG93IEt1cmplcml1IHYxLjAgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCAoJF9HRVRbJ3BzX2NkJ10gPz8gJycpICE9PSAnQVBQTFknICkgcmV0dXJuOwogJG89Wyd2Jz0+J0NEMScsJ2VpbCc9PltdXTsKIGZvcmVhY2goWzE1OTIwLDE4Mzc1XSBhcyAkcGlkKXsKICAgJHA9Z2V0X3Bvc3QoJHBpZCk7CiAgICRlPVsnaWQnPT4kcGlkLCdwYXYnPT4kcD9tYl9zdWJzdHIoJHAtPnBvc3RfdGl0bGUsMCw2MCk6J05FUkEnLAogICAgICAgJ2J1dm8nPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19wc190aWtfa3VyamVyaXUnLHRydWUpXTsKICAgaWYoISRwIHx8ICRwLT5wb3N0X3R5cGUhPT0ncHJvZHVjdCcpeyAkZVsndmVpa3NtYXMnXT0nUFJBTEVJU1RBJzsgJG9bJ2VpbCddW109JGU7IGNvbnRpbnVlOyB9CiAgIGlmKCRlWydidXZvJ109PT0neWVzJyl7ICRlWyd2ZWlrc21hcyddPSdKQVUnOyAkb1snZWlsJ11bXT0kZTsgY29udGludWU7IH0KICAgdXBkYXRlX3Bvc3RfbWV0YSgkcGlkLCdfcHNfdGlrX2t1cmplcml1JywneWVzJyk7CiAgIHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJHBpZCk7IGNsZWFuX3Bvc3RfY2FjaGUoJHBpZCk7CiAgICRlWydwbyddPWdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3Rpa19rdXJqZXJpdScsdHJ1ZSk7CiAgICRlWyd2ZWlrc21hcyddPSgkZVsncG8nXT09PSd5ZXMnKT8nUEFaWU1FVEEnOidLTEFJREEnOwogICAkb1snZWlsJ11bXT0kZTsKIH0KIGdsb2JhbCAkd3BkYjsKICRvWydpc192aXNvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigKICAgIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIG1ldGFfa2V5PSdfcHNfdGlrX2t1cmplcml1JyBBTkQgbWV0YV92YWx1ZT0neWVzJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sOTkpOwo='; const VER='CD-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Colosseo ir Duck Pillow Kurjeriu v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_cd=APPLY',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'cd');
  try{ out.r=JSON.parse(await d.text()); }catch(e){}
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/cd_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
