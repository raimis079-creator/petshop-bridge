process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEUyIHJlY29uIHYxLjAgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19lMiddKT8kX0dFVFsncHNfZTInXTonJykhPT0nUjEnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidFMlIxJyk7CiAgdHJ5ewogICAgLy8gMS4gZGlzcGF0Y2g6IGZsb3dzIHN0cnVrdHVyYSArIHJlbmRlci9wcm9jZXNzX29uZSBwYXJhc2FpCiAgICAkcmM9bmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9FbWFpbF9EaXNwYXRjaCcpOwogICAgZm9yZWFjaChhcnJheSgncmVuZGVyJywncHJvY2Vzc19vbmUnLCdlbnF1ZXVlJywnZmxvd3MnLCdjaGVja19lbGlnaWJpbGl0eScpIGFzICRtbil7CiAgICAgIGlmKCRyYy0+aGFzTWV0aG9kKCRtbikpeyAkbT0kcmMtPmdldE1ldGhvZCgkbW4pOwogICAgICAgICRwPWFycmF5KCk7IGZvcmVhY2goJG0tPmdldFBhcmFtZXRlcnMoKSBhcyAkcHApICRwW109KCRwcC0+aXNPcHRpb25hbCgpPyc/JzonJykuJHBwLT5nZXROYW1lKCk7CiAgICAgICAgJG9bJ2Rpc3BhdGNoJ11bJG1uXT1pbXBsb2RlKCcsJywkcCk7CiAgICAgIH0KICAgIH0KICAgICRmbD1QZXRzaG9wX0VtYWlsX0Rpc3BhdGNoOjpmbG93cygpOwogICAgJG9bJ2Zsb3dfcHZ6J109YXJyYXkoJ3JlZmlsbF9kdWUnPT4kZmxbJ3JlZmlsbF9kdWUnXSwnZm91bmRpbmdfYWN0aXZhdGlvbic9PiRmbFsnZm91bmRpbmdfYWN0aXZhdGlvbiddKTsKICAgIC8vIDIuIGFyIGZsb3dzIGVpbmEgcGVyIGZpbHRyYQogICAgJHNyYz1maWxlX2dldF9jb250ZW50cygkcmMtPmdldEZpbGVOYW1lKCkpOwogICAgJG9bJ2Zsb3dzX2ZpbHRyYXMnXT1zdHJwb3MoJHNyYywicGV0c2hvcF9lbWFpbF9mbG93cyIpIT09ZmFsc2U/J1RBSVAnOidORSc7CiAgICAkb1sndGVtcGxhdGVfZmlsdHJhcyddPXN0cnBvcygkc3JjLCJwZXRzaG9wX2VtYWlsX3RlbXBsYXRlX3BhdGgiKSE9PWZhbHNlPydUQUlQJzonTkUnOwogICAgLy8gMy4gcmVuZGVyIGZyYWdtZW50YXMKICAgIGlmKHByZWdfbWF0Y2goJy9mdW5jdGlvbiByZW5kZXJcKFteKV0qXCkuezAsOTAwfS9zJywkc3JjLCRtKSkgJG9bJ3JlbmRlcl9rb2RhcyddPXN1YnN0cigkbVswXSwwLDkwMCk7CiAgICAvLyA0LiBMYXlvdXQga2xhc2UKICAgIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9FbWFpbF9MYXlvdXQnKSl7CiAgICAgICRsYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0VtYWlsX0xheW91dCcpOwogICAgICAkbW09YXJyYXkoKTsgZm9yZWFjaCgkbGMtPmdldE1ldGhvZHMoKSBhcyAkeCl7ICRwPWFycmF5KCk7IGZvcmVhY2goJHgtPmdldFBhcmFtZXRlcnMoKSBhcyAkcHApJHBbXT0kcHAtPmdldE5hbWUoKTsgJG1tWyR4LT5nZXROYW1lKCldPWltcGxvZGUoJywnLCRwKTt9CiAgICAgICRvWydsYXlvdXQnXT0kbW07CiAgICB9CiAgICAvLyA1LiBsYWlza2FpIG1vZHVsaXM6IHJlbmRlcmlvIGtlbGlhcyArIGJsb2t1IHRpcGFpCiAgICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfTGFpc2thaV9UdXJpbnlzJykpewogICAgICAkdGY9KG5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfTGFpc2thaV9UdXJpbnlzJykpLT5nZXRGaWxlTmFtZSgpOwogICAgICAkdGs9ZmlsZV9nZXRfY29udGVudHMoJHRmKTsKICAgICAgJG9bJ2xhaXNrYWlfbWQ1J109bWQ1KCR0ayk7CiAgICAgIHByZWdfbWF0Y2hfYWxsKCIvY2FzZSAnKFthLXpfXSspJzovIiwkdGssJG1iKTsKICAgICAgJG9bJ2Jsb2t1X3RpcGFpJ109YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkbWJbMV0pKTsKICAgICAgJG9bJ3JlbmRlcmlzX3lyYSddPWZpbGVfZXhpc3RzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtbGFpc2thaS9yZW5kZXJpcy5waHAnKT8nVEFJUCc6J05FJzsKICAgIH0KICAgIC8vIDYuIGthbXBhbmlqdSBsYW5nbyBiYWx0YXMgc2FyYXNhcwogICAgJGtmPShuZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0thbXBhbmlqdV9MYW5nYXMnKSktPmdldEZpbGVOYW1lKCk7CiAgICAka2s9ZmlsZV9nZXRfY29udGVudHMoJGtmKTsKICAgICRvWydrYW1wX21kNSddPW1kNSgka2spOwogICAgaWYocHJlZ19tYXRjaCgnL2FycmF5XChbXildKmZvdW5kaW5nX2FjdGl2YXRpb25bXildKlwpL3MnLCRraywkbSkpICRvWydrYW1wX3doaXRlbGlzdCddPXN1YnN0cigkbVswXSwwLDIwMCk7CiAgICAvLyA3LiBtYXJrZXRpbmcgcG9yYXN0ZSAvIHVuc3Vic2NyaWJlIHRva2VuCiAgICAkb1sndW5zdWJfcGFpZXNrYSddPWFycmF5KCk7CiAgICBmb3JlYWNoKGFycmF5KCdhdHNpc2FreW0nLCd1bnN1YnNjcmliZScsJ3Rva2VuJykgYXMgJHopCiAgICAgIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9FbWFpbF9MYXlvdXQnKSl7CiAgICAgICAgJGxrPWZpbGVfZ2V0X2NvbnRlbnRzKChuZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0VtYWlsX0xheW91dCcpKS0+Z2V0RmlsZU5hbWUoKSk7CiAgICAgICAgJG9bJ3Vuc3ViX3BhaWVza2EnXVskel09c3Vic3RyX2NvdW50KCRsaywkeik7CiAgICAgIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAgJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='e2_recon-204950';
const GKEY='ps_e2';
const PHASES=["R1"];
const OUT='analize/e2_recon.json';
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
