process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIElNUDUgU2FyZ28gZGlhZ25vc3Rpa2EgdjEuMCAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2JpcyddKT8kX0dFVFsncHNfYmlzJ106JycpIT09J0lNUDUnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidJTVA1LXYxLjAnKTsKICB0cnl7CiAgICAkcmM9bmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9MYWlza2FpX0ltcG9ydGFzJyk7CiAgICAkZj0kcmMtPmdldEZpbGVOYW1lKCk7CiAgICAkb1snZmFpbGFzJ109JGY7ICRvWydtZDVfZGlza2UnXT1tZDVfZmlsZSgkZik7CiAgICAkb1sndHVyaV9kaW5hbWluaXMnXT1tZXRob2RfZXhpc3RzKCdQZXRzaG9wX0xhaXNrYWlfSW1wb3J0YXMnLCdkaW5hbWluaXMnKT8nVEFJUCc6J05FJzsKICAgIGlmKG1ldGhvZF9leGlzdHMoJ1BldHNob3BfTGFpc2thaV9JbXBvcnRhcycsJ2RpbmFtaW5pcycpKXsKICAgICAgZm9yZWFjaChhcnJheSgnY2FydF9hYmFuZG9uZWQnLCdicm93c2VfYWJhbmRvbmVkJywncG9zdF9wdXJjaGFzZV8yZCcsJ3JlZmlsbF9kdWUnKSBhcyAkZmwpewogICAgICAgICRvWydkaW5hbWluaXMnXVskZmxdPXZhcl9leHBvcnQoUGV0c2hvcF9MYWlza2FpX0ltcG9ydGFzOjpkaW5hbWluaXMoJGZsKSx0cnVlKTsKICAgICAgfQogICAgfQogICAgLyogYXIgaXNza2FpZHl0aSB0aWtyYWkga3ZpZWNpYSBzYXJnYSAqLwogICAgJHJtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0xhaXNrYWlfSW1wb3J0YXMnLCdpc3NrYWlkeXRpJyk7CiAgICAkTD1maWxlKCRmKTsKICAgICRvWydpc3NrYWlkeXRpX3ByYWR6aWEnXT1pbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRMLCRybS0+Z2V0U3RhcnRMaW5lKCktMSwxMCkpOwogICAgJG9bJ29wY2FjaGUnXT1mdW5jdGlvbl9leGlzdHMoJ29wY2FjaGVfZ2V0X3N0YXR1cycpPyd5cmEnOiduZXJhJzsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAgJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='IMP5-171543';
const GKEY='ps_bis';
const PHASES=["IMP5"];
const OUT='analize/imp5.json';
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
