process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIElNUDMgS2V0dXJpdSBzYWJsb251IHN1YmplY3QgZWlsdXRlcyB2MS4wIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfYmlzJ10pPyRfR0VUWydwc19iaXMnXTonJykhPT0nSU1QMycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J0lNUDMtdjEuMCcpOwogIHRyeXsKICAgICRkaXI9UEVUU0hPUF9DT1JFX0RJUi4ndGVtcGxhdGVzL2VtYWlscy8nOwogICAgZm9yZWFjaChhcnJheSgnb3JkZXItcGFpZCcsJ2R1bm5pbmctMScsJ2NvbnNlbnQtY2hhbmdlZCcsJ2ZvdW5kaW5nJykgYXMgJHMpewogICAgICAkdD1maWxlX2dldF9jb250ZW50cygkZGlyLiRzLicucGhwJyk7CiAgICAgICRlaWw9YXJyYXkoKTsKICAgICAgZm9yZWFjaChleHBsb2RlKCJcbiIsJHQpIGFzICRuPT4kbCl7CiAgICAgICAgaWYoc3RyaXBvcygkbCwnc3ViamVjdCcpIT09ZmFsc2UgfHwgc3RyaXBvcygkbCwnd3JhcCgnKSE9PWZhbHNlIHx8IHN0cmlwb3MoJGwsJ0xheW91dDo6b3BlbicpIT09ZmFsc2UpICRlaWxbXT0oJG4rMSkuJzogJy50cmltKCRsKTsKICAgICAgfQogICAgICAkb1skc109JGVpbDsKICAgIH0KICAgIC8qIGlyIHJlYWx1cyByZW5kZXJpczogc3ViamVjdCB2cyBrYXMgYW50cmFzdGVqZSAqLwogICAgJGZsb3dzPVBldHNob3BfRW1haWxfRGlzcGF0Y2g6OmZsb3dzKCk7CiAgICBmb3JlYWNoKGFycmF5KCdvcmRlcl9wYWlkJywnZm91bmRpbmdfYWN0aXZhdGlvbicpIGFzICRmKXsKICAgICAgJHI9UGV0c2hvcF9FbWFpbF9EaXNwYXRjaDo6cmVuZGVyKCRmLGFycmF5KCksYXJyYXkoJ2Zsb3dfY2xhc3MnPT4kZmxvd3NbJGZdWydjbGFzcyddLCdyZWNpcGllbnRfZW1haWwnPT4neEBwdnoubHQnKSk7CiAgICAgIHByZWdfbWF0Y2goJyNmb250LXNpemU6MjFweDtmb250LXdlaWdodDo3MDA7bGluZS1oZWlnaHQ6MVwuMzU7cGFkZGluZy1ib3R0b206MTRweDsiPiguKj8pPC90ZD4jcycsJHJbJ2h0bWwnXSwkbSk7CiAgICAgICRvWydyZW5kZXJfJy4kZl09YXJyYXkoJ3N1YmplY3QnPT4kclsnc3ViamVjdCddLCdhbnRyYXN0ZWplJz0+aXNzZXQoJG1bMV0pPyRtWzFdOidORVJBU1RBJyk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAICcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='IMP3-170720';
const GKEY='ps_bis';
const PHASES=["IMP3"];
const OUT='analize/imp3.json';
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
