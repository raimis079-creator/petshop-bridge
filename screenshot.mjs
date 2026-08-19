process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA2MSddKT8kX0dFVFsncHNfaDA2MSddOicnKSE9PSdIMDYxJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwNjEnKTsKCiAvKiBtb2ppYmFrZSBzZWtvczogVVRGLTggYmFpdGFpIHBlcnNrYWl0eXRpIGthaXAgTGF0aW4tMSAqLwogJHNla29zPWFycmF5KCfDhOKApicsJ8OEJywnw4TigJQnLCfDhMKvJywnw4XCoScsJ8OFwrMnLCfDhcKrJywnw4XCvicsJ8OEJywnw4PigKYnLCfDg+KAnicsJ8ODwqEnLCfDg8KpJyk7CiAkcmV6PWFycmF5KCk7ICR2aXNvPTA7CiAkZWlsPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfdHlwZSxwb3N0X25hbWUscG9zdF90aXRsZSxwb3N0X2NvbnRlbnQscG9zdF9leGNlcnB0CiAgIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3Rfc3RhdHVzIElOICgncHVibGlzaCcsJ2RyYWZ0JykKICAgQU5EIHBvc3RfdHlwZSBJTiAoJ3BhZ2UnLCdwb3N0JywncHJvZHVjdCcpIiwgQVJSQVlfQSk7CiAkb1sndGlrcmludGEnXT1jb3VudCgkZWlsKTsKIGZvcmVhY2goJGVpbCBhcyAkcil7CiAgICRuPTA7ICRrdXI9YXJyYXkoKTsKICAgZm9yZWFjaChhcnJheSgncG9zdF90aXRsZSc9PiRyWydwb3N0X3RpdGxlJ10sJ3Bvc3RfY29udGVudCc9PiRyWydwb3N0X2NvbnRlbnQnXSwncG9zdF9leGNlcnB0Jz0+JHJbJ3Bvc3RfZXhjZXJwdCddKSBhcyAkbGF1az0+JHYpewogICAgICRrPTA7CiAgICAgZm9yZWFjaCgkc2Vrb3MgYXMgJHMpICRrKz1zdWJzdHJfY291bnQoKHN0cmluZykkdiwkcyk7CiAgICAgaWYoJGspeyAkbis9JGs7ICRrdXJbXT0kbGF1ay4nOicuJGs7IH0KICAgfQogICBpZigkbil7CiAgICAgJHZpc28rPSRuOwogICAgICRwPW51bGw7CiAgICAgZm9yZWFjaCgkc2Vrb3MgYXMgJHMpeyAkaT1zdHJwb3MoJHJbJ3Bvc3RfY29udGVudCddLCRzKTsgaWYoJGkhPT1mYWxzZSl7ICRwPXN1YnN0cigkclsncG9zdF9jb250ZW50J10sbWF4KDAsJGktNjApLDE0MCk7IGJyZWFrOyB9IH0KICAgICBpZigkcD09PW51bGwpeyAkaT0wOyBmb3JlYWNoKCRzZWtvcyBhcyAkcyl7ICRpPXN0cnBvcygkclsncG9zdF90aXRsZSddLCRzKTsgaWYoJGkhPT1mYWxzZSl7ICRwPSRyWydwb3N0X3RpdGxlJ107IGJyZWFrOyB9IH0gfQogICAgICRyZXpbXT1hcnJheSgnaWQnPT4oaW50KSRyWydJRCddLCd0aXBhcyc9PiRyWydwb3N0X3R5cGUnXSwnc2x1Zyc9PiRyWydwb3N0X25hbWUnXSwKICAgICAgICdwYXYnPT5tYl9zdWJzdHIoJHJbJ3Bvc3RfdGl0bGUnXSwwLDUwKSwna2llayc9PiRuLCdrdXInPT5pbXBsb2RlKCcgJywka3VyKSwKICAgICAgICdwdnonPT5tYl9zdWJzdHIodHJpbShwcmVnX3JlcGxhY2UoJy9ccysvdScsJyAnLHdwX3N0cmlwX2FsbF90YWdzKChzdHJpbmcpJHApKSksMCwxMTApKTsKICAgfQogfQogdXNvcnQoJHJleixmdW5jdGlvbigkYSwkYil7IHJldHVybiAkYlsna2llayddLSRhWydraWVrJ107IH0pOwogJG9bJ3BhbGllc3RhX2lyYXN1J109Y291bnQoJHJleik7ICRvWydzZWvFs192aXNvJ109JHZpc287CiAkb1sncGFnYWxfdGlwYSddPWFycmF5KCk7CiBmb3JlYWNoKCRyZXogYXMgJHgpeyAkdD0keFsndGlwYXMnXTsgJG9bJ3BhZ2FsX3RpcGEnXVskdF09KGlzc2V0KCRvWydwYWdhbF90aXBhJ11bJHRdKT8kb1sncGFnYWxfdGlwYSddWyR0XTowKSsxOyB9CiAkb1snc2FyYXNhcyddPWFycmF5X3NsaWNlKCRyZXosMCw0MCk7CgogLyogdGVybWluYWkgaXIga2F0ZWdvcmlqb3MgKi8KICR0dD0wOyAkdHNhcj1hcnJheSgpOwogZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB0ZXJtX2lkLG5hbWUsZGVzY3JpcHRpb24gRlJPTSB7JFB9dGVybXMgdAogICAgSk9JTiB7JFB9dGVybV90YXhvbm9teSB0eCBVU0lORyh0ZXJtX2lkKSBXSEVSRSB0eC50YXhvbm9teSBJTiAoJ3Byb2R1Y3RfY2F0JywncHJvZHVjdF9icmFuZCcpIixBUlJBWV9BKSBhcyAkeCl7CiAgICRrPTA7IGZvcmVhY2goJHNla29zIGFzICRzKSAkays9c3Vic3RyX2NvdW50KCR4WyduYW1lJ10uJHhbJ2Rlc2NyaXB0aW9uJ10sJHMpOwogICBpZigkayl7ICR0dCs9JGs7ICR0c2FyW109YXJyYXkoJ2lkJz0+KGludCkkeFsndGVybV9pZCddLCd2Jz0+JHhbJ25hbWUnXSwna2llayc9PiRrKTsgfQogfQogJG9bJ3Rlcm1pbnVvc2UnXT0kdHQ7ICRvWyd0ZXJtaW51X3NhcmFzYXMnXT1hcnJheV9zbGljZSgkdHNhciwwLDEwKTsKCiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H061'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H061 rasmenu patikra',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h061=H061'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h061.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h061 rasmenu patikra');
