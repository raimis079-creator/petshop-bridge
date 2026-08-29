process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEUxNyBBZG1pbiB2MS4xIGRpZWdpbWFzICsgcGF0aWtyYSB2MS4wICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICR2PWlzc2V0KCRfR0VUWydwc19iaXMnXSk/JF9HRVRbJ3BzX2JpcyddOicnOwogIGlmKCFpbl9hcnJheSgkdixhcnJheSgnRTE3JywnRTE4JyksdHJ1ZSkpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J0UxNy12MS4wJywnZmF6ZSc9PiR2KTsKICB0cnl7CiAgICBpZigkdj09PSdFMTcnKXsKICAgICAgJGZhaWxhaT1hcnJheSgKICAgICAgICAncGV0c2hvcC1sYWlza2FpLnBocCc9PidjMDJhZGU1ZDllMjVhYThhMDYyMzQyZWFmZjA0NDEzZScsCiAgICAgICAgJ3BldHNob3AtbGFuZ2FpLWFkbWluLnBocCc9PidmNzU3NGMxNjZiZjUwNWZhMzliMjQyYTA0ODk1NWE5NycsCiAgICAgICk7CiAgICAgIGZvcmVhY2goJGZhaWxhaSBhcyAkZm49PiRNRDUpewogICAgICAgICRkc3Q9V1BNVV9QTFVHSU5fRElSLicvJy4kZm47ICRlPWFycmF5KCdwcmllcyc9PmZpbGVfZXhpc3RzKCRkc3QpP21kNV9maWxlKCRkc3QpOidORVJBJyk7CiAgICAgICAgJHI9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlL21haW4vZGVwbG95LycuJGZuLicuYjY0P3Y9Jy4kTUQ1LictJy50aW1lKCksYXJyYXkoJ3RpbWVvdXQnPT4zMCwnaGVhZGVycyc9PmFycmF5KCdDYWNoZS1Db250cm9sJz0+J25vLWNhY2hlJywnUHJhZ21hJz0+J25vLWNhY2hlJykpKTsKICAgICAgICBpZihpc193cF9lcnJvcigkcikpeyAkZVsnU1RPUCddPSdmZXRjaCc7ICRvWyRmbl09JGU7IGNvbnRpbnVlOyB9CiAgICAgICAgJGs9YmFzZTY0X2RlY29kZSh0cmltKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSkpOwogICAgICAgIGlmKG1kNSgkaykhPT0kTUQ1KXsgJGVbJ1NUT1AnXT0nQ0ROIHNlbmE6ICcubWQ1KCRrKTsgJG9bJGZuXT0kZTsgY29udGludWU7IH0KICAgICAgICBpZihAdG9rZW5fZ2V0X2FsbCgkayxUT0tFTl9QQVJTRSk9PT1mYWxzZSl7ICRlWydTVE9QJ109J1NJTlRBS1NFJzsgJG9bJGZuXT0kZTsgY29udGludWU7IH0KICAgICAgICAkYj1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMtYmFja3Vwcyc7IGlmKCFpc19kaXIoJGIpKSB3cF9ta2Rpcl9wKCRiKTsKICAgICAgICBpZihmaWxlX2V4aXN0cygkZHN0KSkgY29weSgkZHN0LCRiLicvJy4kZm4uJy5iYWtfJy5nbWRhdGUoJ1ltZF9IaXMnKSk7CiAgICAgICAgZmlsZV9wdXRfY29udGVudHMoJGRzdCwkayk7CiAgICAgICAgJGVbJ3BvJ109bWQ1X2ZpbGUoJGRzdCk7ICRlWydpcmFzeXRhJ109KCRlWydwbyddPT09JE1ENSk/J09LJzonTkVQQVZZS08nOwogICAgICAgICRvWyRmbl09JGU7CiAgICAgIH0KICAgIH0KICAgIGlmKCR2PT09J0UxOCcpewogICAgICAkb1sndmVyc2lqYSddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9MYWlza2FpX1R1cmlueXMnKT9QZXRzaG9wX0xhaXNrYWlfVHVyaW55czo6VkVSU0lKQTonTkVSQSc7CiAgICAgICRvWydhZG1pbiddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9MYW5nYWlfQWRtaW4nKT8neXJhJzonTkVSQSc7CiAgICAgIGlmKCRvWydhZG1pbiddIT09J3lyYScpeyAkb1snU1RPUCddPSdhZG1pbiBrbGFzZSBuZXV6c2lrcm92ZSc7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAgICAgICRhZG09Z2V0X3VzZXJzKGFycmF5KCdyb2xlJz0+J2FkbWluaXN0cmF0b3InLCdudW1iZXInPT4xLCdmaWVsZHMnPT4nSUQnKSk7CiAgICAgIGlmKGlzc2V0KCRhZG1bMF0pKSB3cF9zZXRfY3VycmVudF91c2VyKChpbnQpJGFkbVswXSk7CiAgICAgIGdsb2JhbCAkbWVudSwkc3VibWVudTsgJG1lbnU9YXJyYXkoKTsgJHN1Ym1lbnU9YXJyYXkoKTsKICAgICAgZG9fYWN0aW9uKCdhZG1pbl9tZW51Jyk7CiAgICAgICRvWydzdWJtZW5pdSddPWlzc2V0KCRzdWJtZW51WydwZXRzaG9wLWxhbmdhaSddKT9hcnJheV9tYXAoZnVuY3Rpb24oJHMpe3JldHVybiAkc1swXS4nIHwgJy4kc1syXTt9LCRzdWJtZW51WydwZXRzaG9wLWxhbmdhaSddKTonTkVSQSc7CgogICAgICAvKiBwZXJ6aXVyYSB2aXNpZW1zIDIwIOKAlCBpciB0aWVtcywga3VyaWUgbmV0dXJpIGlyYcWhbyAqLwogICAgICAkb2s9MDsgJGJsb2dpPWFycmF5KCk7CiAgICAgIGZvcmVhY2goUGV0c2hvcF9FbWFpbF9EaXNwYXRjaDo6Zmxvd3MoKSBhcyAkZj0+JGMpewogICAgICAgICRwPVBldHNob3BfTGFpc2thaV9UdXJpbnlzOjpwZXJ6aXVyYSgkZiwwKTsKICAgICAgICBpZighZW1wdHkoJHBbJ29rJ10pICYmIHN0cmxlbigkcFsnaHRtbCddKT41MDApeyAkb2srKzsgfQogICAgICAgIGVsc2UgeyAkYmxvZ2lbJGZdPWlzc2V0KCRwWydrbGFpZGEnXSk/JHBbJ2tsYWlkYSddOid0dXNjaWEnOyB9CiAgICAgIH0KICAgICAgJG9bJ3BlcnppdXJhX3ZlaWtpYSddPSRvay4nLzIwJzsgJG9bJ3BlcnppdXJvc19rbGFpZG9zJ109JGJsb2dpOwoKICAgICAgLyogcGF2YWRpbmltYWkgKyByZWRhZ3VvamFtdW1hcyAqLwogICAgICAkb1sncHZ6X3ZhcmRhaSddPWFycmF5KCk7CiAgICAgIGZvcmVhY2goYXJyYXkoJ3JlZmlsbF9kdWUnLCdjYXJ0X2FiYW5kb25lZCcsJ29yZGVyX3BhaWQnLCd3aW5fYmFja185MCcpIGFzICRmKXsKICAgICAgICBsaXN0KCRyLCRrKT1QZXRzaG9wX0xhbmdhaV9BZG1pbjo6cmVkYWd1b2phbWFzKCRmKTsKICAgICAgICAkb1sncHZ6X3ZhcmRhaSddWyRmXT1QZXRzaG9wX0xhbmdhaV9BZG1pbjo6dmFyZGFzKCRmKS4nIHwgcmVkYWd1b2phbWFzOiAnLigkcj8ndGFpcCc6J25lICcuJGspOwogICAgICB9CiAgICAgICRvWydidXNlbmEnXT1QZXRzaG9wX0xhaXNrYWlfVHVyaW55czo6YnVzZW5hKCk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAICcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='E17-E18-172557';
const GKEY='ps_bis';
const PHASES=["E17", "E18"];
const OUT='analize/e17.json';
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
