process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEczIEdNQyBGZWVkIFZhbGlkYWNpamEgdjEuMCAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkdiA9IGlzc2V0KCRfR0VUWydwc19iaXMnXSkgPyAkX0dFVFsncHNfYmlzJ10gOiAnJzsKICBpZiAoIWluX2FycmF5KCR2LCBhcnJheSgnRzNBJyksIHRydWUpKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbyA9IGFycmF5KCd2Jz0+J0czLXYxLjAnLCdmYXplJz0+JHYpOwogIHRyeSB7CiAgICAkdXJsID0gaG9tZV91cmwoJy9mZWVkL2dvb2dsZS8nKTsKICAgICRvWyd1cmwnXSA9ICR1cmw7CiAgICAkciA9IHdwX3JlbW90ZV9nZXQoJHVybCwgYXJyYXkoJ3RpbWVvdXQnPT4xMjAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdoZWFkZXJzJz0+YXJyYXkoJ0NhY2hlLUNvbnRyb2wnPT4nbm8tY2FjaGUnKSkpOwogICAgaWYgKGlzX3dwX2Vycm9yKCRyKSkgeyAkb1snU1RPUCddID0gJ3dwX2Vycm9yOiAnLiRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogICAgJG9bJ2h0dHAnXSA9IHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKTsKICAgICRib2R5ID0gd3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOwogICAgJG9bJ2JhaXRhaSddID0gc3RybGVuKCRib2R5KTsKICAgIGlmICgkb1snaHR0cCddICE9IDIwMCB8fCAkb1snYmFpdGFpJ10gPCAxMDApIHsgJG9bJ1NUT1AnXT0nYmxvZ2FzIGF0c2FrYXMnOyAkb1sncHJhZHppYSddPXN1YnN0cigkYm9keSwwLDMwMCk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CgogICAgbGlieG1sX3VzZV9pbnRlcm5hbF9lcnJvcnModHJ1ZSk7CiAgICAkeCA9IHNpbXBsZXhtbF9sb2FkX3N0cmluZygkYm9keSk7CiAgICBpZiAoJHggPT09IGZhbHNlKSB7ICRvWydTVE9QJ109J1hNTCBuZXBhcnNpbmFtYXMnOyAkb1sncHJhZHppYSddPXN1YnN0cigkYm9keSwwLDMwMCk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CgogICAgJGl0ZW1zID0gaXNzZXQoJHgtPmNoYW5uZWwtPml0ZW0pID8gJHgtPmNoYW5uZWwtPml0ZW0gOiAoaXNzZXQoJHgtPml0ZW0pID8gJHgtPml0ZW0gOiBudWxsKTsKICAgIGlmICgkaXRlbXMgPT09IG51bGwpIHsgJG9bJ1NUT1AnXT0naXRlbSBuZXJhc3RhJzsgJG9bJ3Nha25pcyddPSR4LT5nZXROYW1lKCk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAgICAkb1sndmlzb19pdGVtJ10gPSBjb3VudCgkaXRlbXMpOwoKICAgIC8qIGthbmFsbyBseWdpbyBzaGlwcGluZyAvIG51c3RhdHltYWkgKi8KICAgICRvWydrYW5hbGFzJ10gPSBhcnJheSgpOwogICAgaWYgKGlzc2V0KCR4LT5jaGFubmVsLT50aXRsZSkpICRvWydrYW5hbGFzJ11bJ3RpdGxlJ10gPSAoc3RyaW5nKSR4LT5jaGFubmVsLT50aXRsZTsKICAgIGlmIChpc3NldCgkeC0+Y2hhbm5lbC0+bGluaykpICAkb1sna2FuYWxhcyddWydsaW5rJ10gID0gKHN0cmluZykkeC0+Y2hhbm5lbC0+bGluazsKCiAgICAkbGF1a2FpID0gYXJyYXkoJ2lkJywndGl0bGUnLCdkZXNjcmlwdGlvbicsJ2xpbmsnLCdpbWFnZV9saW5rJywnYXZhaWxhYmlsaXR5JywncHJpY2UnLCdjb25kaXRpb24nLCdicmFuZCcsJ2d0aW4nLCdtcG4nLCdpZGVudGlmaWVyX2V4aXN0cycsJ3NoaXBwaW5nJywnZ29vZ2xlX3Byb2R1Y3RfY2F0ZWdvcnknLCdwcm9kdWN0X3R5cGUnLCdzYWxlX3ByaWNlJywnaXRlbV9ncm91cF9pZCcpOwogICAgJHRydWtzdCA9IGFycmF5KCk7IGZvcmVhY2ggKCRsYXVrYWkgYXMgJEwpIHsgJHRydWtzdFskTF0gPSAwOyB9CiAgICAkTlMgPSAnaHR0cDovL2Jhc2UuZ29vZ2xlLmNvbS9ucy8xLjAnOwogICAgJGJlX2d0aW5fYmVfbXBuID0gMDsgJGJlX2d0aW5fYmVfaWUgPSAwOyAka2FpbmFfYmVfdmFsaXV0b3MgPSAwOyAkcHZ6ID0gYXJyYXkoKTsgJGkgPSAwOwoKICAgIGZvcmVhY2ggKCRpdGVtcyBhcyAkaXQpIHsKICAgICAgJGcgPSAkaXQtPmNoaWxkcmVuKCROUyk7CiAgICAgICR2YWwgPSBhcnJheSgpOwogICAgICBmb3JlYWNoICgkbGF1a2FpIGFzICRMKSB7CiAgICAgICAgJHMgPSAnJzsKICAgICAgICBpZiAoaXNzZXQoJGctPiRMKSkgICAgICAkcyA9IHRyaW0oKHN0cmluZykkZy0+JEwpOwogICAgICAgIGVsc2VpZiAoaXNzZXQoJGl0LT4kTCkpICRzID0gdHJpbSgoc3RyaW5nKSRpdC0+JEwpOwogICAgICAgIGlmICgkcyA9PT0gJycpICR0cnVrc3RbJExdKys7CiAgICAgICAgJHZhbFskTF0gPSAkczsKICAgICAgfQogICAgICBpZiAoJHZhbFsnZ3RpbiddID09PSAnJyAmJiAkdmFsWydtcG4nXSA9PT0gJycpICRiZV9ndGluX2JlX21wbisrOwogICAgICBpZiAoJHZhbFsnZ3RpbiddID09PSAnJyAmJiAkdmFsWydpZGVudGlmaWVyX2V4aXN0cyddID09PSAnJykgJGJlX2d0aW5fYmVfaWUrKzsKICAgICAgaWYgKCR2YWxbJ3ByaWNlJ10gIT09ICcnICYmICFwcmVnX21hdGNoKCcvW0EtWl17M31ccyokfF5ccypbQS1aXXszfS8nLCAkdmFsWydwcmljZSddKSkgJGthaW5hX2JlX3ZhbGl1dG9zKys7CiAgICAgIGlmICgkaSA8IDMpIHsKICAgICAgICAkdmFsWydkZXNjcmlwdGlvbiddID0gbWJfc3Vic3RyKCR2YWxbJ2Rlc2NyaXB0aW9uJ10sIDAsIDYwKTsKICAgICAgICAkdmFsWyd0aXRsZSddID0gbWJfc3Vic3RyKCR2YWxbJ3RpdGxlJ10sIDAsIDYwKTsKICAgICAgICAkcHZ6W10gPSAkdmFsOwogICAgICB9CiAgICAgICRpKys7CiAgICB9CiAgICAkb1sndHJ1a3N0YSddID0gJHRydWtzdDsKICAgICRvWydiZV9ndGluX2lyX2JlX21wbiddID0gJGJlX2d0aW5fYmVfbXBuOwogICAgJG9bJ2JlX2d0aW5faXJfYmVfaWRlbnRpZmllcl9leGlzdHMnXSA9ICRiZV9ndGluX2JlX2llOwogICAgJG9bJ2thaW5hX2JlX3ZhbGl1dG9zJ10gPSAka2FpbmFfYmVfdmFsaXV0b3M7CiAgICAkb1sncGF2eXpkemlhaSddID0gJHB2ejsKCiAgICAvKiBrb2tpZSBhcHNrcml0YWkgdGFnYWkgbmF1ZG9qYW1pIHBpcm1hbWUgaXRlbSdlICovCiAgICAkcGlybWFzID0gJGl0ZW1zWzBdOwogICAgJHRhZ2FpID0gYXJyYXkoKTsKICAgIGZvcmVhY2ggKCRwaXJtYXMtPmNoaWxkcmVuKCROUykgYXMgJGs9PiR2dikgJHRhZ2FpW10gPSAnZzonLiRrOwogICAgZm9yZWFjaCAoJHBpcm1hcy0+Y2hpbGRyZW4oKSBhcyAkaz0+JHZ2KSAkdGFnYWlbXSA9ICRrOwogICAgJG9bJ3RhZ2FpX3Bpcm1hbWUnXSA9IGFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJHRhZ2FpKSk7CgogIH0gY2F0Y2ggKFRocm93YWJsZSAkZSkgeyAkb1snRkFUQUwnXSA9ICRlLT5nZXRNZXNzYWdlKCkuJyBAICcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='G3A-132507';
const GKEY='ps_bis';
const PHASES=["G3A"];
const OUT='analize/g3.json';
const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,1500); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
