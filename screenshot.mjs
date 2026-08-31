process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGxhaXNrbyBsb2dvIDQgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19sZyddKXx8JF9HRVRbJ3BzX2xnJ10hPT0nVCcpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogdGV4dC9wbGFpbjsgY2hhcnNldD11dGYtOCcpOwogICR0PVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvdGVtcGxhdGVzL2VtYWlscy9jb25zZW50LWNoYW5nZWQucGhwJzsgZWNobyAiPT09PT1UUEwgIi5tZDUoZmlsZV9nZXRfY29udGVudHMoJHQpKS4iXG4iOyBlY2hvIGZpbGVfZ2V0X2NvbnRlbnRzKCR0KTsKICBlY2hvICJcbj09PT09UkVOREVSIFNFQVJDSD09PT09XG4iOwogIC8vIHJhc3RpIGthaXAgZGlzcGF0Y2ggcmVuZGVyaW5hOiBtZXRvZGFzIHN1ICd0ZW1wbGF0ZScvJ3JlbmRlcicKICAkcmM9bmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9FbWFpbF9EaXNwYXRjaCcpOyBmb3JlYWNoKCRyYy0+Z2V0TWV0aG9kcygpIGFzICRtKXsgaWYocHJlZ19tYXRjaCgnL3JlbmRlcnx0ZW1wbGF0ZXxidWlsZHxodG1sL2knLCRtLT5uYW1lKSkgZWNobyAkbS0+bmFtZS4nKCcuaW1wbG9kZSgnLCcsYXJyYXlfbWFwKGZ1bmN0aW9uKCRwKXtyZXR1cm4gJyQnLiRwLT5uYW1lO30sJG0tPmdldFBhcmFtZXRlcnMoKSkpLiIpIEwiLiRtLT5nZXRTdGFydExpbmUoKS4iLSIuJG0tPmdldEVuZExpbmUoKS4iICIuJG0tPmdldEZpbGVOYW1lKCkuIlxuIjsgfQogICRmPSRyYy0+Z2V0RmlsZU5hbWUoKTsgJGM9ZmlsZV9nZXRfY29udGVudHMoJGYpOyBpZihwcmVnX21hdGNoKCcvZnVuY3Rpb25ccytyZW5kZXJbXntdKlx7LnswLDE4MDB9L3MnLCRjLCRtbSkpIGVjaG8gIlxuLS0tLS1yZW5kZXIgc3JjLS0tLS1cbiIuJG1tWzBdOwogIGVjaG8gIlxuPT09PT1MQVlPVVQgb3BlbigpIE9VVD09PT09XG4iOyAkaD1QZXRzaG9wX0VtYWlsX0xheW91dDo6b3BlbignVGVzdCcsJ3ByZScpOyBlY2hvIHN1YnN0cigkaCxzdHJwb3MoJGgsJ3dpZHRoPSI2MDAiJyksNTAwKTsKICBleGl0Owp9KTsK';
const VER='dep-074627';
const GKEY='ps_lg';
const PHASES=["T"];
const OUT='analize/lg_recon4.json';
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
