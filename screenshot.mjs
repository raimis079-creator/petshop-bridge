process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4NDQnXSkpIHJldHVybjsKICAgICRvPVsnVkVSU0lKQSc9PidTMTU5Ni1EMSddOyAkZj0kX0dFVFsncHNfZXg0NCddOyAkdGd0PVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtbGF1a2FpLnBocCc7CiAgICBpZiAoJGY9PT0nRCcpIHsKICAgICAgICAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSh3cF9yZW1vdGVfZ2V0KCdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vcmFpbWlzMDc5LWNyZWF0b3IvcGV0c2hvcC1icmlkZ2UvZmQ1NzM1OTY2ZDFkMDcyMWE1OGQwODc2NmIxNmQ0NGUwZTM2YjI0Yy9kZXBsb3kvcGV0c2hvcC1sYXVrYWkucGhwLmI2NCcsWyd0aW1lb3V0Jz0+NjBdKSk7ICRuZXc9YmFzZTY0X2RlY29kZSh0cmltKCRiKSk7ICRvWydtZDUnXT1tZDUoJG5ldyk7CiAgICAgICAgaWYgKG1kNSgkbmV3KSE9PSc2ZmI3N2EyNGI1ZDFmN2M2MWVkNmUxYjRmYWVkMjc0MCcpIHsgJG9bJ2tsYWlkYSddPSdtZDUnOyBnb3RvIG91dDsgfQogICAgICAgICRvWyd0b2tlbnMnXT1jb3VudCh0b2tlbl9nZXRfYWxsKCRuZXcpKTsgJG9bJ29sZF9tZDUnXT1tZDVfZmlsZSgkdGd0KTsgJG9bJ3dyaXRlJ109ZmlsZV9wdXRfY29udGVudHMoJHRndCwkbmV3KTsgJG9bJ2Rpc2tfbWQ1J109bWQ1X2ZpbGUoJHRndCk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpIG9wY2FjaGVfaW52YWxpZGF0ZSgkdGd0LHRydWUpOwogICAgfQogICAgaWYgKCRmPT09J1YnKSB7CiAgICAgICAgJG9bJ3ZlcnNpamEnXT1QZXRzaG9wX0xhdWthaTo6VkVSU0lKQTsgJG1lbnU9d3BfZ2V0X25hdl9tZW51X29iamVjdCgnUGFncmluZGluaXMgbWVuaXUnKTsgJGl0ZW1zPWFwcGx5X2ZpbHRlcnMoJ3dwX25hdl9tZW51X29iamVjdHMnLHdwX2dldF9uYXZfbWVudV9pdGVtcygkbWVudS0+dGVybV9pZCksbmV3IHN0ZENsYXNzKTsKICAgICAgICBmb3JlYWNoICgkaXRlbXMgYXMgJGl0KSBpZiAocHJlZ19tYXRjaCgnL3N1c2lkL2l1JywkaXQtPnRpdGxlKSAmJiAkaXQtPnVybCE9PScjJykgeyAkcHRoPXBhcnNlX3VybCgkaXQtPnVybCxQSFBfVVJMX1BBVEgpOyAkc2x1Zz1iYXNlbmFtZSh0cmltKCRwdGgsJy8nKSk7IGdsb2JhbCAkd3BkYjsgJHBpZD0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIElEIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF9uYW1lPSVzIEFORCBwb3N0X3R5cGU9J3Byb2R1Y3QnIiwkc2x1ZykpOyAkb1snbWVuaXUnXVtdPVskaXQtPnRpdGxlLCRpdC0+dXJsLCRwaWQ/KCRwaWQuJyAnLmdldF9wb3N0X3N0YXR1cygkcGlkKS4nICcuZ2V0X3RoZV90aXRsZSgkcGlkKSk6J+KAlCddOyB9CiAgICAgICAgZm9yZWFjaCAoWydrb25zX2thdGVzJywna29uc19zdW5pbXMnLCdzdW55cycsJ2thdGVzJywna3JhbXRhbGFpJ10gYXMgJGcpICRvWydpZWppbWFzJ11bJGddPVBldHNob3BfTGF1a2FpOjppZWppbWFzKCRnKTsKICAgICAgICAvLyBmcm9udGFzOiA0MDQgcGF0aWtyYSB2aXNvbXMgbnVvcm9kb21zCiAgICAgICAgZm9yZWFjaCAoJG9bJ21lbml1J10gYXMgJG0pIHsgJHI9d3BfcmVtb3RlX2dldChzdHJfcmVwbGFjZSgnaHR0cHM6Ly9wZXRzaG9wLmx0JywnaHR0cHM6Ly9kZXYuYXZlc2EubHQnLCRtWzFdKSxbJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKTsgJG9bJ2h0dHAnXVtdPVskbVswXSx3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcildOyB9CiAgICB9CiAgICBvdXQ6CiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-120203';
const GKEY='ps_ex44';
const PHASES=["D", "V"];
const OUT='analize/s1596_deploy.json';
const DATA=[];
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
  let dq='';
  if(DATA.length){ out.data={}; for(const p of DATA){ const name=p.split('/').pop();
      const g=await fx('https://api.github.com/repos/'+REPO+'/contents/'+p,{headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github.raw+json'}},'gh_'+name);
      const buf=Buffer.from(await g.arrayBuffer());
      const m=await fx(WP+'/wp-json/wp/v2/media',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain','Content-Disposition':'attachment; filename="'+name+'"'},body:buf},'media_'+name);
      const mt=await m.text(); try{ const j=JSON.parse(mt); out.data[name]={id:j.id,status:m.status}; dq+='&d_'+name.replace(/\W/g,'_')+'='+j.id; }catch(e){ out.data[name]={status:m.status,err:mt.slice(0,200)}; } } }
  await miegok(9000);
  if(process.env.GTM_SA_JSON){ try{ const sr=await fx(WP+'/wp-json/ps-seo-temp/v1/sa',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain'},body:process.env.GTM_SA_JSON},'sa'); out.sa_push={status:sr.status,body:(await sr.text()).slice(0,200)}; }catch(e){ out.sa_push=String(e).slice(0,200);} }
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f)+dq,{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
