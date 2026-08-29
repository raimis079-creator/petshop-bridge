process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIElNUDYgSW1wb3J0dW90b2pvIHBlcmRpZWdpbWFzICsgdmFseW1hcyArIGthcnRvamltYXMgdjEuMCAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkdj1pc3NldCgkX0dFVFsncHNfYmlzJ10pPyRfR0VUWydwc19iaXMnXTonJzsKICBpZighaW5fYXJyYXkoJHYsYXJyYXkoJ0lNUDYnLCdJTVA3JyksdHJ1ZSkpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J0lNUDYtdjEuMCcsJ2ZhemUnPT4kdik7CiAgdHJ5ewogICAgaWYoJHY9PT0nSU1QNicpewogICAgICAkTUQ1PSc3ZTAxNWYyNmQ5YmU4NTBjZTQ0ZDVmNWJmNzJmZGQ0Mic7ICRmbj0ncGV0c2hvcC1sYWlza2FpLWltcG9ydGFzLnBocCc7CiAgICAgICRkc3Q9V1BNVV9QTFVHSU5fRElSLicvJy4kZm47CiAgICAgICRvWydtZDVfcHJpZXMnXT1maWxlX2V4aXN0cygkZHN0KT9tZDVfZmlsZSgkZHN0KTonTkVSQSc7CiAgICAgICRyPXdwX3JlbW90ZV9nZXQoJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS9tYWluL2RlcGxveS8nLiRmbi4nLmI2ND92PScuJE1ENS4nLScudGltZSgpLGFycmF5KCd0aW1lb3V0Jz0+MzAsJ2hlYWRlcnMnPT5hcnJheSgnQ2FjaGUtQ29udHJvbCc9Piduby1jYWNoZScsJ1ByYWdtYSc9Piduby1jYWNoZScpKSk7CiAgICAgIGlmKGlzX3dwX2Vycm9yKCRyKSl7ICRvWydTVE9QJ109J2ZldGNoOiAnLiRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogICAgICAkaz1iYXNlNjRfZGVjb2RlKHRyaW0od3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpKSk7CiAgICAgICRvWydnYXV0YV9tZDUnXT1tZDUoJGspOwogICAgICBpZihtZDUoJGspIT09JE1ENSl7ICRvWydTVE9QJ109J0NETiBkYXIgYXRpZHVvZGEgc2VuYTogJy5tZDUoJGspOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogICAgICBpZihAdG9rZW5fZ2V0X2FsbCgkayxUT0tFTl9QQVJTRSk9PT1mYWxzZSl7ICRvWydTVE9QJ109J1NJTlRBS1NFJzsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICAgICAgZmlsZV9wdXRfY29udGVudHMoJGRzdCwkayk7CiAgICAgICRvWydtZDVfcG8nXT1tZDVfZmlsZSgkZHN0KTsKICAgICAgJG9bJ2lyYXN5dGEnXT0oJG9bJ21kNV9wbyddPT09JE1ENSk/J09LJzonTkVQQVZZS08nOwogICAgfQoKICAgIGlmKCR2PT09J0lNUDcnKXsKICAgICAgZ2xvYmFsICR3cGRiOwogICAgICAkb1snbWV0b2Rhc195cmEnXT1tZXRob2RfZXhpc3RzKCdQZXRzaG9wX0xhaXNrYWlfSW1wb3J0YXMnLCdkaW5hbWluaXMnKT8nVEFJUCc6J05FJzsKICAgICAgaWYoJG9bJ21ldG9kYXNfeXJhJ10hPT0nVEFJUCcpeyAkb1snU1RPUCddPSdzYXJnYXMgdmlzIGRhciBuZXV6c2lrcm92ZSc7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CgogICAgICAvKiAxLiBrdXJpZSBzcmF1dGFpIGRpbmFtaW5pYWkgKi8KICAgICAgJGRpbj1hcnJheSgpOwogICAgICBmb3JlYWNoKFBldHNob3BfRW1haWxfRGlzcGF0Y2g6OmZsb3dzKCkgYXMgJGY9PiRjKXsKICAgICAgICAkZD1QZXRzaG9wX0xhaXNrYWlfSW1wb3J0YXM6OmRpbmFtaW5pcygkZik7CiAgICAgICAgaWYoJGQpICRkaW5bJGZdPSRkOwogICAgICB9CiAgICAgICRvWydkaW5hbWluaWFpJ109JGRpbjsKCiAgICAgIC8qIDIuIGlzdHJpbnRpIGtsYWlkaW5nYWkgaW1wb3J0dW90dXMganVvZHJhc2NpdXMgKi8KICAgICAgJFQ9UGV0c2hvcF9MYWlza2FpX1R1cmlueXM6OmxlbnRlbGUoKTsKICAgICAgJGlzdD0wOwogICAgICBmb3JlYWNoKGFycmF5X2tleXMoJGRpbikgYXMgJGYpewogICAgICAgICRpc3QgKz0gKGludCkkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NIGAkVGAgV0hFUkUgZmxvdz0lcyBBTkQgc3RhdHVzPSdkcmFmdCciLCRmKSk7CiAgICAgIH0KICAgICAgJG9bJ2lzdHJpbnRhX2tsYWlkaW5ndSddPSRpc3Q7CgogICAgICAvKiAzLiBEUlkgaXMgbmF1am8g4oCUIHBhdHZpcnRpbnRpLCBrYWQgc2FyZ2FzIGF0bWV0YSAqLwogICAgICAkZHJ5PVBldHNob3BfTGFpc2thaV9JbXBvcnRhczo6dnlrZHl0aShmYWxzZSk7CiAgICAgICRvWydkcnlfdGlua2EnXT0kZHJ5Wyd0aW5rYSddOyAkb1snZHJ5X25ldGlua2EnXT0kZHJ5WyduZXRpbmthJ107CiAgICAgICRvWydhdG1lc3RpJ109YXJyYXkoKTsKICAgICAgZm9yZWFjaCgkZHJ5WydzcmF1dGFpJ10gYXMgJGY9PiRlKXsgaWYoJGVbJ3JlenVsdGF0YXMnXT09PSdORVRJTktBJykgJG9bJ2F0bWVzdGknXVskZl09JGVbJ3ByaWV6YXN0aXMnXTsgfQoKICAgICAgLyogNC4gYnVzZW5hICovCiAgICAgICRvWydidXNlbmEnXT1QZXRzaG9wX0xhaXNrYWlfVHVyaW55czo6YnVzZW5hKCk7CiAgICAgICRvWydqdW9kcmFzY2lhaSddPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgZmxvdyBGUk9NIGAkVGAgV0hFUkUgc3RhdHVzPSdkcmFmdCcgT1JERVIgQlkgZmxvdyIpOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='IMP6-IMP7-171745';
const GKEY='ps_bis';
const PHASES=["IMP6", "IMP7"];
const OUT='analize/imp6.json';
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
