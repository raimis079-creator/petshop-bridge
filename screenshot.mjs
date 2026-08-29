process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFE0IEtldHVyaXUgc2F2by1IVE1MIHNhYmxvbnUgYXB6dmFsZ2EgdjEuMCAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2JpcyddKT8kX0dFVFsncHNfYmlzJ106JycpIT09J1E0JykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUTQtdjEuMCcpOwogIHRyeXsKICAgICRkaXI9UEVUU0hPUF9DT1JFX0RJUi4ndGVtcGxhdGVzL2VtYWlscy8nOwogICAgJG1hcD1hcnJheSgnb3JkZXJfcGFpZCc9PidvcmRlci1wYWlkJywncGF5bWVudF9mYWlsZWQnPT4nZHVubmluZy0xJywnY29uc2VudF9jaGFuZ2VkJz0+J2NvbnNlbnQtY2hhbmdlZCcsJ2ZvdW5kaW5nX2FjdGl2YXRpb24nPT4nZm91bmRpbmcnKTsKICAgICRmbG93cz1QZXRzaG9wX0VtYWlsX0Rpc3BhdGNoOjpmbG93cygpOwogICAgZm9yZWFjaCgkbWFwIGFzICRmPT4kcyl7CiAgICAgICRwPSRkaXIuJHMuJy5waHAnOyAkdD1maWxlX2dldF9jb250ZW50cygkcCk7CiAgICAgICRlPWFycmF5KCdmYWlsYXMnPT4kcy4nLnBocCcsJ2JhaXRhaSc9PmZpbGVzaXplKCRwKSwna2xhc2UnPT4kZmxvd3NbJGZdWydjbGFzcyddLCdwYWtlaXN0YSc9PmdtZGF0ZSgnWS1tLWQgSDppJyxmaWxlbXRpbWUoJHApKSk7CiAgICAgIC8qIGFudHJhc3RlcyBrb21lbnRhcmFzICovCiAgICAgIGlmKHByZWdfbWF0Y2goJyMvXCpcKiguKj8pXCovI3MnLCR0LCRtKSkgJGVbJ2tvbWVudGFyYXMnXT10cmltKHByZWdfcmVwbGFjZSgnL15ccypcKlxzPy9tJywnJywkbVsxXSkpOwogICAgICAkZVsncGF0dmlydGludGEnXT0oc3RyaXBvcygkdCwnUEFUVklSVElOVEFTJykhPT1mYWxzZSk/J1RBSVAnOiduZSc7CiAgICAgICRlWyduYXVkb2phX2xheW91dCddPShzdHJwb3MoJHQsJ1BldHNob3BfRW1haWxfTGF5b3V0JykhPT1mYWxzZSk/J1RBSVAnOidORSc7CiAgICAgICRlWydhdHNpc2FreW1vX251b3JvZGEnXT0oc3RyaXBvcygkdCwndW5zdWJzY3JpYmUnKSE9PWZhbHNlfHxzdHJpcG9zKCR0LCdBdHNpc2FreXRpJykhPT1mYWxzZSk/J3lyYSc6J05FUkEnOwogICAgICAkZVsndWFiX2F2ZXNhJ109KHN0cmlwb3MoJHQsJ0F2ZXNhJykhPT1mYWxzZSk/J3lyYSc6J05FUkEnOwogICAgICAvKiByZWFsdXMgcmVuZGVyaXMgKi8KICAgICAgJHBsPWFycmF5KCk7IHByZWdfbWF0Y2hfYWxsKCcvXCRwYXlsb2FkXFtccypbXCciXShbYS16MC05X10rKVtcJyJdXHMqXF0vaScsJHQsJG1tKTsKICAgICAgZm9yZWFjaChhcnJheV91bmlxdWUoJG1tWzFdKSBhcyAkaykgJHBsWyRrXT0n4oC5Jy4kay4n4oC6JzsKICAgICAgJHI9UGV0c2hvcF9FbWFpbF9EaXNwYXRjaDo6cmVuZGVyKCRmLCRwbCxhcnJheSgnZmxvd19jbGFzcyc9PiRmbG93c1skZl1bJ2NsYXNzJ10sJ3JlY2lwaWVudF9lbWFpbCc9PidwdnpAcGV0c2hvcC5sdCcpKTsKICAgICAgJGVbJ3RlbWEnXT0kclsnc3ViamVjdCddOwogICAgICAkZVsnYmFpdGFpX2h0bWwnXT1zdHJsZW4oJHJbJ2h0bWwnXSk7CiAgICAgICR0eHQ9cHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLHRyaW0od3Bfc3RyaXBfYWxsX3RhZ3MocHJlZ19yZXBsYWNlKCcjPChzdHlsZXxoZWFkfHRpdGxlKVtePl0qPi4qPzwvXDE+I3NpJywnICcsJHJbJ2h0bWwnXSkpKSk7CiAgICAgICRlWyd0ZWtzdGFzJ109bWJfc3Vic3RyKCR0eHQsMCw3MDApOwogICAgICAkb1skZl09JGU7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAICcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='Q4-174314';
const GKEY='ps_bis';
const PHASES=["Q4"];
const OUT='analize/q4.json';
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
