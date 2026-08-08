const USER=process.env.WP_USER.trim(),PASS=process.env.WP_APP_PASS.trim();
const AUTH='Basic '+Buffer.from(USER+':'+PASS).toString('base64');
const BASE='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK=process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const A='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc19iNzA5J10/PycnKSE9PSdCNzA5eCcpIHJldHVybjsKICBpZigoJF9HRVRbJ2snXT8/JycpIT09J3BzMjAyNicpIHJldHVybjsKICBpZighaGVhZGVyc19zZW50KCkpeyBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6YXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyB9CiAgQHNldF90aW1lX2xpbWl0KDIwMCk7CiAgJHJlemltYXM9JF9HRVRbJ3JlemltYXMnXT8/J2RyeSc7CiAgJG89YXJyYXkoJ3YnPT4nQjcwOScsJ3JlemltYXMnPT4kcmV6aW1hcyk7CgogICRaWU1FID0gIlxuXHQvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4iCiAgICAgICAgLiAiXHQgKiBExJZNRVNJTyAoMjAyNi0wOC0wOCwgUzcwOSk6IMWgSVMgQkxPS0FTIE5FVkVJS0lBIElSIE5JRUtBREEgTkVWRUlLxJYuXG4iCiAgICAgICAgLiAiXHQgKiBtZXRob2RfZXhpc3RzKFwkZGF0YV9zdG9yZSwndXBkYXRlX2xvb2t1cF90YWJsZScpIFZJU0FEQSBncsSFxb5pbmEgZmFsc2UsXG4iCiAgICAgICAgLiAiXHQgKiBuZXMgV0NfRGF0YV9TdG9yZSB5cmEgYXB2YWxrYWxhcyBzdSBfX2NhbGwoKS4gTmV0IGlyIHByYcSXanVzIHTEhSBwYXRpa3LEhSxcbiIKICAgICAgICAuICJcdCAqIHBhdHMgbWV0b2RhcyB5cmEgUFJPVEVDVEVELCB0YWQga3ZpZXRpbWFzIG5lcGF2eWt0xbMuXG4iCiAgICAgICAgLiAiXHQgKiBMb29rdXAgbGVudGVsxJkgZGFiYXIgdHZhcmtvIG11LXBsdWdpbnMvcGV0c2hvcC13Yy1zeW5jLnBocCDigJQgamlzIGdhdWRvXG4iCiAgICAgICAgLiAiXHQgKiBtZXRhIHBha2VpdGltxIUgaXIgYXRuYXVqaW5hIGxvb2t1cCBwZXIgUmVmbGVjdGlvbiB1xb5rbGF1c29zIHBhYmFpZ29qZS5cbiIKICAgICAgICAuICJcdCAqIMWgaW8gYmxva28gxaFhbGludGkgbmVixat0aW5hLCBiZXQganVvIFJFTVRJUyBORUdBTElNQS5cbiIKICAgICAgICAuICJcdCAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbiI7CgogICRaWU1FX0tBSU5BID0gIlxuXHRcdFx0LyogRMSWTUVTSU8gKDIwMjYtMDgtMDgsIFM3MDkpOiDEjWlhIGthaW5hIHJhxaFvbWEgVElFU0lBSSDEryBtZXRhLFxuIgogICAgICAgIC4gIlx0XHRcdCAqIGFwZWluYW50IFdvb0NvbW1lcmNlIENSVUQg4oCUIHdjX3Byb2R1Y3RfbWV0YV9sb29rdXAgTkVBVFNJTkFVSklOQS5cbiIKICAgICAgICAuICJcdFx0XHQgKiBEYWJhciB0YWkgcGFkZW5naWEgbXUtcGx1Z2lucy9wZXRzaG9wLXdjLXN5bmMucGhwIChzYXJnYXMgZ2F1ZG9cbiIKICAgICAgICAuICJcdFx0XHQgKiBtZXRhIHBha2VpdGltxIUpLiBCZSBqbyBwYXJkdW90dXbEl3MgZmlsdHJhaSByb2R5dMWzIHNlbsSFIGthaW7EhS4gKi9cbiI7CgogICRmYWlsYWkgPSBhcnJheSgKICAgICdwbHVnaW5zL3BldHNob3AteG1sL2luY2x1ZGVzL2NsYXNzLXZmLWltcG9ydC5waHAnID0+IGFycmF5KAogICAgICBhcnJheSgnaWVza290aSc9PiJcdC8vIFBlci1wcm9kdWN0IGxvb2t1cCB0YWJsZSByZWZyZXNoIiwgJ3p5bWUnPT4kWllNRSwgJ2t1cic9PidwcmllcycpLAogICAgKSwKICAgICdwbHVnaW5zL3BldHNob3AteG1sL3BldHNob3AteG1sLnBocCcgPT4gYXJyYXkoCiAgICAgIGFycmF5KCdyZWdleCc9PicvXlsgXHRdKnVwZGF0ZV9wb3N0X21ldGFccypcKFxzKlwkcG9zdF9pZCxccypbXHgyNyJdX3ByaWNlW1x4MjciXS9tJywgJ3p5bWUnPT4kWllNRV9LQUlOQSksCiAgICApLAogICAgJ3BsdWdpbnMvcGV0c2hvcC14bWwvaW5jbHVkZXMvY2xhc3MtYWRtaW4tdWkucGhwJyA9PiBhcnJheSgKICAgICAgYXJyYXkoJ3JlZ2V4Jz0+Jy9eWyBcdF0qdXBkYXRlX3Bvc3RfbWV0YVxzKlwoXHMqXCRwaWQsXHMqW1x4MjciXV9wcmljZVtceDI3Il0vbScsICd6eW1lJz0+JFpZTUVfS0FJTkEpLAogICAgKSwKICApOwoKICBmb3JlYWNoKCRmYWlsYWkgYXMgJGY9PiR2aWV0b3MpewogICAgJGtlbGlhcz1XUF9DT05URU5UX0RJUi4nLycuJGY7CiAgICAkcj1hcnJheSgneXJhJz0+ZmlsZV9leGlzdHMoJGtlbGlhcykpOwogICAgaWYoISRyWyd5cmEnXSl7ICRvWydmYWlsYWknXVskZl09JHI7IGNvbnRpbnVlOyB9CiAgICAkYz1maWxlX2dldF9jb250ZW50cygka2VsaWFzKTsKICAgICRyWydkeWRpc19wcmllcyddPXN0cmxlbigkYyk7CiAgICAkclsnamF1X3BhenltZXRhJ109KHN0cnBvcygkYywnUzcwOScpIT09ZmFsc2UpOwogICAgJG5hdWphcz0kYzsgJHJhc3RhPTA7CiAgICBpZighJHJbJ2phdV9wYXp5bWV0YSddKXsKICAgICAgZm9yZWFjaCgkdmlldG9zIGFzICR2KXsKICAgICAgICBpZihpc3NldCgkdlsncmVnZXgnXSkpewogICAgICAgICAgLy8gdmlzb3MgYXRpdGlrbWVueXMsIGVpbmFudCBudW8gR0FMTyAoa2FkIHBvc2xpbmtpYWkgbmVzdXNpbWFpc3l0dSkKICAgICAgICAgIGlmKHByZWdfbWF0Y2hfYWxsKCR2WydyZWdleCddLCRuYXVqYXMsJG1tLFBSRUdfT0ZGU0VUX0NBUFRVUkUpKXsKICAgICAgICAgICAgJHBvej1hcnJheV9tYXAoZnVuY3Rpb24oJHgpeyByZXR1cm4gJHhbMV07IH0sICRtbVswXSk7CiAgICAgICAgICAgIHJzb3J0KCRwb3opOwogICAgICAgICAgICBmb3JlYWNoKCRwb3ogYXMgJHB6KXsgJG5hdWphcz1zdWJzdHIoJG5hdWphcywwLCRweikuJHZbJ3p5bWUnXS5zdWJzdHIoJG5hdWphcywkcHopOyAkcmFzdGErKzsgfQogICAgICAgICAgfSBlbHNlIHsgJHJbJ25lcmFzdGEnXVtdPSR2WydyZWdleCddOyB9CiAgICAgICAgICBjb250aW51ZTsKICAgICAgICB9CiAgICAgICAgJHBvej1zdHJwb3MoJG5hdWphcywkdlsnaWVza290aSddKTsKICAgICAgICBpZigkcG96PT09ZmFsc2UpeyAkclsnbmVyYXN0YSddW109bWJfc3Vic3RyKCR2WydpZXNrb3RpJ10sMCw2MCk7IGNvbnRpbnVlOyB9CiAgICAgICAgJG5hdWphcz1zdWJzdHIoJG5hdWphcywwLCRwb3opLiR2Wyd6eW1lJ10uc3Vic3RyKCRuYXVqYXMsJHB6ID8/ICRwb3opOwogICAgICAgICRyYXN0YSsrOwogICAgICB9CiAgICB9CiAgICAkclsndmlldHVfcmFzdGEnXT0kcmFzdGE7CiAgICAkclsnZHlkaXNfcG8nXT1zdHJsZW4oJG5hdWphcyk7CgogICAgLy8gU0lOVEFLU0VTIFNBUkdBUwogICAgdHJ5eyBAdG9rZW5fZ2V0X2FsbCgkbmF1amFzLFRPS0VOX1BBUlNFKTsgJHJbJ3NpbnRha3NlJ109J09LJzsgfQogICAgY2F0Y2goUGFyc2VFcnJvciAkZSl7ICRyWydzaW50YWtzZSddPSdLTEFJREE6ICcuJGUtPmdldE1lc3NhZ2UoKTsgJG9bJ2ZhaWxhaSddWyRmXT0kcjsgY29udGludWU7IH0KCiAgICBpZigkcmV6aW1hcz09PSdhcHBseScgJiYgJHJhc3RhPjAgJiYgJHJbJ3NpbnRha3NlJ109PT0nT0snKXsKICAgICAgJGI9V1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cCc7CiAgICAgIGlmKCFpc19kaXIoJGIpKSBAbWtkaXIoJGIsMDc1NSx0cnVlKTsKICAgICAgJHJbJ2JhY2t1cCddPUBjb3B5KCRrZWxpYXMsJGIuJy8nLmJhc2VuYW1lKCRmKS4nLmJha19zNzA5Jyk/J29rJzonRkFJTCc7CiAgICAgIGlmKCRyWydiYWNrdXAnXT09PSdvaycpewogICAgICAgICRyWydpcmFzeXRhJ109QGZpbGVfcHV0X2NvbnRlbnRzKCRrZWxpYXMsJG5hdWphcyk7CiAgICAgICAgJHJbJ2R5ZGlzX2Rpc2tlJ109ZmlsZXNpemUoJGtlbGlhcyk7CiAgICAgICAgJHJbJ3BhdGlrcmFfZGlza2UnXT0oc3RycG9zKGZpbGVfZ2V0X2NvbnRlbnRzKCRrZWxpYXMpLCdTNzA5JykhPT1mYWxzZSk7CiAgICAgIH0gZWxzZSB7ICRyWydOVVRSQVVLVEEnXT0nYmFja3VwIG5lcGF2eWtvJzsgfQogICAgfQogICAgJG9bJ2ZhaWxhaSddWyRmXT0kcjsKICB9CiAgZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sIDYpOwo=';
async function putResult(n,o){
  const url='https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/'+n;
  let sha;const g=await fetch(url,{headers:{Authorization:'Bearer '+TOK}});
  if(g.status===200) sha=(await g.json()).sha;
  const b={message:'r '+n,content:Buffer.from(JSON.stringify(o,null,1)).toString('base64')}; if(sha)b.sha=sha;
  const r=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(b)});
  console.log('putResult',n,r.status);
}
async function sveikata(){
  const o={};
  for(const [n,u] of [['shop','https://dev.avesa.lt/parduotuve/'],['home','https://dev.avesa.lt/'],
                      ['xml','https://dev.avesa.lt/wp-admin/admin.php?page=petshop-xml']]){
    try{const r=await fetch(u+(u.includes('?')?'&':'?')+'cb='+Date.now(),{headers:{Authorization:AUTH,'User-Agent':'Mozilla/5.0'}});
      const t=await r.text(); o[n]={http:r.status,len:t.length,fatal:/Fatal error|Parse error/i.test(t)};}catch(e){o[n]={err:String(e)};}
  }
  return o;
}
const out={version:'S710-V1',errors:[]};
out.sveikata_pries=await sveikata();
let id=null;
try{
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP Zymejimas B (S710)',code:Buffer.from(A,'base64').toString('utf8'),scope:'global',active:true,priority:11})});
  id=(await r.json()).id;
  await new Promise(x=>setTimeout(x,3000));
  out.dry=JSON.parse(await (await fetch('https://dev.avesa.lt/?ps_b709=B709x&k=ps2026&rezimas=dry&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}})).text());
  const visos_ok = out.dry && Object.values(out.dry.failai).every(f=>!f.yra || f.jau_pazymeta || (f.sintakse==='OK' && f.vietu_rasta>0));
  if(visos_ok){
    await new Promise(x=>setTimeout(x,1500));
    out.apply=JSON.parse(await (await fetch('https://dev.avesa.lt/?ps_b709=B709x&k=ps2026&rezimas=apply&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}})).text());
  } else out.APPLY_PRALEISTA='dry nesvarus';
}catch(e){out.errors.push(String(e));}
if(id) await fetch(BASE+'/'+id,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
await new Promise(x=>setTimeout(x,3000));
out.sveikata_po=await sveikata();
await putResult('s710_v1.json',out);
console.log('DONE');
