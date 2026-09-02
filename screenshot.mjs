process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MDYgcmVjb24yOiBlc2FtYSBwc19pdnlraWFpIGxlbnRlbMSXICsgUGV0c2hvcF9EZXNrOjpyaWJhIHBhcmHFoWFzICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX2UyJ10pKSByZXR1cm47CiAgJG89YXJyYXkoKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogIHRyeXsKICAgICRvWydjcmVhdGUnXT0kd3BkYi0+Z2V0X3ZhcigiU0hPVyBDUkVBVEUgVEFCTEUgeyRwfXBzX2l2eWtpYWkiLDEpOwogICAgJG9bJ24nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cHNfaXZ5a2lhaSIpOwogICAgJG9bJ3Bhdnl6ZHppYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyRwfXBzX2l2eWtpYWkgT1JERVIgQlkgMSBERVNDIExJTUlUIDUiLEFSUkFZX0EpOwogICAgJG9bJ3Zpc29zX2l2eWtpdSddPSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICd7JHB9cHNfJWl2eWslJyIpOwogICAgZm9yZWFjaChhcnJheShXUE1VX1BMVUdJTl9ESVIsV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZScsV1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sJykgYXMgJGQpewogICAgICBmb3JlYWNoKGdsb2IoJGQuJy97KiwqLyp9LnBocCcsR0xPQl9CUkFDRSkgYXMgJGYpeyAkYz1maWxlX2dldF9jb250ZW50cygkZik7IGlmKHN0cnBvcygkYywncHNfaXZ5a2lhaScpIT09ZmFsc2UpeyBwcmVnX21hdGNoX2FsbCgnLy57MCwxMjB9cHNfaXZ5a2lhaS57MCwxMjB9LycsJGMsJG0pOyAkb1sna2FzX25hdWRvamEnXVtiYXNlbmFtZSgkZildPWFycmF5X3NsaWNlKCRtWzBdLDAsNCk7fSB9CiAgICB9CiAgICAkb1snc25pcHBldF9uYXVkb2phJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgY29kZSBMSUtFICclcHNfaXZ5a2lhaSUnIixBUlJBWV9BKTsKICAgIGZvcmVhY2goYXJyYXkoJ3JpYmEnLCdyaWJvc196eW1lJywnZWlsZScsJ2tsYXVzaW1hcycsJ3NrYWljaWFpJywnZ2F1dGknKSBhcyAkbSl7ICRyPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0Rlc2snLCRtKTsgJG9bJ2Rlc2tfJy4kbV09YXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gJHgtPmdldE5hbWUoKS4oJHgtPmlzT3B0aW9uYWwoKT8nPT8nOicnKTt9LCRyLT5nZXRQYXJhbWV0ZXJzKCkpOyB9CiAgICAkcmM9bmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9EZXNrJyk7ICRvWydkZXNrX2NvbnN0J109YXJyYXlfa2V5cygkcmMtPmdldENvbnN0YW50cygpKTsgJG9bJ1JJQk9TJ109UGV0c2hvcF9EZXNrOjpSSUJPUzsgJG9bJ1NBTFRJTklBSSddPVBldHNob3BfRGVzazo6U0FMVElOSUFJOwogICAgJG9bJ2RhcmJ1b3RvamFpJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCR1KXtyZXR1cm4gJHUtPnVzZXJfbG9naW47fSxnZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4ncHNfZGFyYnVvdG9qYXMnKSkpOwogICAgJG9bJ3RpZWtfbWVuaXUnXT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXBzX3RpZWtpbWFzIFdIRVJFIGJ1c2VuYSBJTiAoJ2thdXBpYW1hJywndXpzYWt5dGEnKSIpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-215419';
const GKEY='ps_e2';
const PHASES=["R"];
const OUT='analize/e1_recon2.json';
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
