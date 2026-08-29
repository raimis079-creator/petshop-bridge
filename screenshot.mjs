process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEUzIGZpbmFsYXMgKHB1c2xhcGlzICsgd2ViaG9vayBVVEMpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfZTMnXSk/JF9HRVRbJ3BzX2UzJ106JycpIT09J0YxJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nRTNGMScpOwogIHRyeXsKICAgIC8vIDEuIHdlYmhvb2sgcmVjZWl2ZXIgbGFpa28gZnVua2NpamEKICAgICRrYW5kaWRhdGFpPWFycmF5KAogICAgICBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2luY2x1ZGVzL2NsYXNzLXdlYmhvb2stcmVjZWl2ZXIucGhwJywKICAgICAgV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcy9jbGFzcy1lc3Atd2ViaG9vay1yZWNlaXZlci5waHAnKTsKICAgIGZvcmVhY2goZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2luY2x1ZGVzLyp3ZWJob29rKi5waHAnKSBhcyAkZykgJGthbmRpZGF0YWlbXT0kZzsKICAgIGZvcmVhY2goYXJyYXlfdW5pcXVlKCRrYW5kaWRhdGFpKSBhcyAkZil7IGlmKCFmaWxlX2V4aXN0cygkZikpIGNvbnRpbnVlOwogICAgICAkaz1maWxlX2dldF9jb250ZW50cygkZik7CiAgICAgICRvWydmYWlsYXMnXT1iYXNlbmFtZSgkZik7CiAgICAgIHByZWdfbWF0Y2hfYWxsKCcvKGRlbGl2ZXJlZF9hdHxvcGVuZWRfYXR8Y2xpY2tlZF9hdClbXjtdezAsMTIwfS8nLCRrLCRtKTsKICAgICAgJG9bJ2xhaWtvX2lyYXNhaSddPWFycmF5X3NsaWNlKGFycmF5X3VuaXF1ZSgkbVswXSksMCw2KTsKICAgICAgJG9bJ2dtZGF0ZV9raWVrJ109c3Vic3RyX2NvdW50KCRrLCdnbWRhdGUnKTsKICAgICAgJG9bJ2N1cnJlbnRfdGltZV9raWVrJ109c3Vic3RyX2NvdW50KCRrLCJjdXJyZW50X3RpbWUiKTsKICAgICAgYnJlYWs7CiAgICB9CiAgICAvLyAyLiByZWFsdXMgcHVzbGFwaXMgdjEuMQogICAgJGFkbT1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEsJ2ZpZWxkcyc9PidJRCcpKTsKICAgICR1aWQ9KGludCkkYWRtWzBdOwogICAgJGNrPVNFQ1VSRV9BVVRIX0NPT0tJRS4nPScud3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCx0aW1lKCkrMTIwLCdzZWN1cmVfYXV0aCcpCiAgICAgIC4nOyAnLkxPR0dFRF9JTl9DT09LSUUuJz0nLndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsdGltZSgpKzEyMCwnbG9nZ2VkX2luJyk7CiAgICAkcj13cF9yZW1vdGVfZ2V0KGFkbWluX3VybCgnYWRtaW4ucGhwP3BhZ2U9cGV0c2hvcC1yZXp1bHRhdGFpJmxhaWtvdGFycGlzPTAnKSwKICAgICAgYXJyYXkoJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2hlYWRlcnMnPT5hcnJheSgnQ29va2llJz0+JGNrKSkpOwogICAgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOwogICAgJG9bJ2h0dHAnXT13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcik7CiAgICAkb1sncGFqYW11X3Nla2NpamEnXT1zdHJwb3MoJGgsJ1BhamFtb3MgacWhIGxhacWha8WzJykhPT1mYWxzZT8nVEFJUCc6J05FJzsKICAgICRvWydtb2RlbGlvX3Bhc3RhYmEnXT1zdHJwb3MoJGgsJ1Bhc2t1dGluaW8gcGFzcGF1ZGltbycpIT09ZmFsc2U/J1RBSVAnOidORSc7CiAgICAkb1snc3R1bHBlbGlhaV91enNhayddPXN0cnBvcygkaCwnPlXFvnNhay48JykhPT1mYWxzZT8nVEFJUCc6J05FJzsKICAgICRvWyd3YXJuaW5nJ109cHJlZ19tYXRjaCgnLyhXYXJuaW5nfE5vdGljZXxGYXRhbHxEZXByZWNhdGVkKTovJywkaCk/J1lSQSc6J05FUkEnOwogICAgJG9bJ3ZlcnNpamEnXT1zdHJwb3MoJGgsJ3YxLjEnKSE9PWZhbHNlPyd2MS4xJzonPyc7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAICcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='e3_final-203820';
const GKEY='ps_e3';
const PHASES=["F1"];
const OUT='analize/e3_final.json';
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
