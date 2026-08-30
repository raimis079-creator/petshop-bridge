process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTI4IG1hZ2ljLWxvZ2luIHJlY29uICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfbWwnXSl8fCRfR0VUWydwc19tbCddIT09J0dPJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE1MjgtUkVDJyk7CiAgdHJ5ewogICAgLy8gMS4gTWFnaWMgbG9naW4ga2xhc2UKICAgICRrYW5kaWRhdGFpPWFycmF5KCdQZXRzaG9wX01hZ2ljX0xvZ2luJywnUFNfTWFnaWNfTG9naW4nLCdNYWdpY19Mb2dpbicpOwogICAgZm9yZWFjaCgka2FuZGlkYXRhaSBhcyAkaykgaWYoY2xhc3NfZXhpc3RzKCRrKSl7ICRvWydrbGFzZSddPSRrOyBicmVhazsgfQogICAgaWYoaXNzZXQoJG9bJ2tsYXNlJ10pKXsKICAgICAgJHI9bmV3IFJlZmxlY3Rpb25DbGFzcygkb1sna2xhc2UnXSk7CiAgICAgICRvWydmYWlsYXMnXT0kci0+Z2V0RmlsZU5hbWUoKTsKICAgICAgJG1tPWFycmF5KCk7CiAgICAgIGZvcmVhY2goJHItPmdldE1ldGhvZHMoKSBhcyAkbSl7CiAgICAgICAgJHBzPWFycmF5X21hcChmdW5jdGlvbigkcCl7cmV0dXJuICgkcC0+aXNPcHRpb25hbCgpPyc/JzonJykuJHAtPmdldE5hbWUoKTt9LCRtLT5nZXRQYXJhbWV0ZXJzKCkpOwogICAgICAgICRtbVtdPSgkbS0+aXNTdGF0aWMoKT8nc3RhdGljICc6JycpLigkbS0+aXNQdWJsaWMoKT8ncHViICc6J3Byb3QgJykuJG0tPmdldE5hbWUoKS4nKCcuaW1wbG9kZSgnLCcsJHBzKS4nKSc7CiAgICAgIH0KICAgICAgJG9bJ21ldG9kYWknXT0kbW07CiAgICAgICRvWydrb25zdGFudG9zJ109JHItPmdldENvbnN0YW50cygpOwogICAgfSBlbHNlIHsKICAgICAgLy8gcGFpZXNrYSBmYWlsdW9zZQogICAgICAkZD1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2luY2x1ZGVzL2NsYXNzLW1hZ2ljLWxvZ2luLnBocCc7CiAgICAgICRvWydmYWlsb195cmEnXT1maWxlX2V4aXN0cygkZCk7CiAgICAgIGlmKCRvWydmYWlsb195cmEnXSl7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRkKTsKICAgICAgICBwcmVnX21hdGNoKCcvY2xhc3NccysoXHcrKS8nLCRjLCRtKTsgJG9bJ2ZhaWxvX2tsYXNlJ109aXNzZXQoJG1bMV0pPyRtWzFdOm51bGw7CiAgICAgICAgcHJlZ19tYXRjaF9hbGwoJy8oPzpwdWJsaWN8cHJvdGVjdGVkfHByaXZhdGUpXHMrKD86c3RhdGljXHMrKT9mdW5jdGlvblxzKyhcdyspXHMqXCgoW14pXSopXCkvJywkYywkbW0pOwogICAgICAgICRvWydmYWlsb19tZXRvZGFpJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCRuLCRhKXtyZXR1cm4gJG4uJygnLnByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJywkYSkuJyknO30sJG1tWzFdLCRtbVsyXSk7CiAgICAgICAgJG9bJ2R5ZGlzJ109c3RybGVuKCRjKTsKICAgICAgfQogICAgfQogICAgLy8gMi4gUGFza3lyb3MgZW5kcG9pbnQgKyBhdHNhdWtpbW8gdmVpa3NtYXMKICAgICRwZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXByZW51bWVyYXRhLXBhc2t5cmEucGhwJzsKICAgICRwYz1maWxlX2dldF9jb250ZW50cygkcGYpOwogICAgcHJlZ19tYXRjaF9hbGwoIi9hZGRfcmV3cml0ZV9lbmRwb2ludFwoXHMqJyhbXiddKyknLyIsJHBjLCRlMSk7CiAgICBwcmVnX21hdGNoX2FsbCgiL3ZhbHVlPVxcXFw/W1wiJ10oW2Etel9dKylcXFxcP1tcIiddLyIsJHBjLCRlMik7CiAgICAkb1sncGFza3lyYSddPWFycmF5KCdlbmRwb2ludGFpJz0+YXJyYXlfdW5pcXVlKCRlMVsxXSksJ3ZlaWtzbWFpJz0+YXJyYXlfc2xpY2UoYXJyYXlfdW5pcXVlKCRlMlsxXSksMCwyNSksJ2R5ZGlzJz0+c3RybGVuKCRwYyksJ21kNSc9Pm1kNSgkcGMpKTsKICAgIC8vIDMuIEthaXAgYXRyb2RvIHBhc2t5cm9zIFVSTAogICAgJG9bJ2FjY291bnRfdXJsJ109d2NfZ2V0X2FjY291bnRfZW5kcG9pbnRfdXJsKCdwcmVudW1lcmF0b3MnKTsKICAgIC8vIDQuIHQ1X3BheWxvYWQgdHVyaW55cyDigJQga29raW9zIG51b3JvZG9zIGRhYmFyCiAgICAkcm09bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfUHJlbnVtZXJhdGEnLCd0NV9wYXlsb2FkJyk7CiAgICAkb1sndDVfcGFyYW1ldHJhaSddPWFycmF5X21hcChmdW5jdGlvbigkcCl7cmV0dXJuICRwLT5nZXROYW1lKCk7fSwkcm0tPmdldFBhcmFtZXRlcnMoKSk7CiAgICAvLyA1LiBMYWlza3UgZmxvd3Mg4oCUIGt1cmllIHByZW51bWVyYXRvcwogICAgJGZsb3dzPWFwcGx5X2ZpbHRlcnMoJ3BldHNob3BfZW1haWxfZmxvd3MnLGFycmF5KCkpOwogICAgJG9bJ3ByZW5fZmxvd3MnXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKGFycmF5X2tleXMoJGZsb3dzKSxmdW5jdGlvbigkayl7cmV0dXJuIHN0cnBvcygkaywncHJlbicpIT09ZmFsc2V8fHN0cnBvcygkaywnc3ViJykhPT1mYWxzZTt9KSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-193550';
const GKEY='ps_ml';
const PHASES=["GO"];
const OUT='analize/s1528_recon.json';
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
  try{ const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){ out.list_praleistas=String(e).slice(0,80); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
