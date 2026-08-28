process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEZ1bmtjaWpvcyBTa2FpdHltYXMgdjEuMCAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoICgkX0dFVFsncHNfZnInXSA/PyAnJykgIT09ICdGUjEnICkgcmV0dXJuOwogJG89Wyd2Jz0+J0ZSMSddOwogJGY9Z2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy9mdW5jdGlvbnMucGhwJzsKICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICRsPWV4cGxvZGUoIlxuIiwkYyk7CiAkb1snZnJhZ21lbnRhcyddPWltcGxvZGUoIlxuIixhcnJheV9zbGljZSgkbCw3MCw3MCkpOwogLyogaXIgcmlua2luaXUgc2FyZ2FzICovCiAkcm09bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfUmlua2luaWFpJywncGFzdG9tYXRvX3NhcmdhcycpOwogJG9bJ3NhcmdhcyddPVsnZmFpbGFzJz0+c3RyX3JlcGxhY2UoV1BfQ09OVEVOVF9ESVIsJycsJHJtLT5nZXRGaWxlTmFtZSgpKSwKICAgJ251byc9PiRybS0+Z2V0U3RhcnRMaW5lKCksJ2lraSc9PiRybS0+Z2V0RW5kTGluZSgpXTsKICRybD1maWxlKCRybS0+Z2V0RmlsZU5hbWUoKSk7CiAkb1snc2FyZ29fa29kYXMnXT1pbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRybCwkcm0tPmdldFN0YXJ0TGluZSgpLTEsbWluKDQ1LCRybS0+Z2V0RW5kTGluZSgpLSRybS0+Z2V0U3RhcnRMaW5lKCkrMSkpKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LDk5KTsK'; const VER='FR-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Funkcijos Skaitymas v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_fr=FR1',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'fr');
  const dt=await d.text(); try{ out.r=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,900); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/fr_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
