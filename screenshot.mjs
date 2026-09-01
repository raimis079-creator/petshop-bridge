process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTUwIHJlY29uMyBhbnRyYXN0ZXMgKi8KYWRkX2FjdGlvbignaW5pdCcsZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3JjJ10pfHwkX0dFVFsncHNfcmMnXSE9PSdHTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCd2Jz0+J1MxNTUwcicpOwogIHRyeXsKICAgIGZvcmVhY2goYXJyYXkoJ3BldHNob3AtaXN0b3Jpam9zLWFkYXB0ZXJpcycsJ3BldHNob3AtYXRhc2thaXRhLWF0c2FyZ29zJywncGV0c2hvcC1hdGFza2FpdGEta2xpZW50YWknLCdwZXRzaG9wLWF0YXNrYWl0YS1wcmVrZXMnLCdwZXRzaG9wLWRpbS1rbGllbnRhaScpIGFzICRmKXsKICAgICAgJGM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvJy4kZi4nLnBocCcpOyBwcmVnX21hdGNoKCcvXC9cKlwqLio/XCpcLy9zJywkYywkbSk7ICRvWydoZHInXVskZl09YXJyYXkoJ21kNSc9Pm1kNSgkYyksJ0InPT5zdHJsZW4oJGMpLCdoZHInPT5tYl9zdWJzdHIoJG1bMF0/PycnLDAsMjIwMCkpOwogICAgfQogICAgJG9bJ29wdF9zYWx0aW5pcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHVzZXJfaWQsbWV0YV92YWx1ZSBGUk9NIHskd3BkYi0+dXNlcm1ldGF9IFdIRVJFIG1ldGFfa2V5IExJS0UgJyVpc3RfYWRhcHQlJyBPUiBtZXRhX2tleSBMSUtFICclc2FsdGluaXMlJyBMSU1JVCA1IixBUlJBWV9BKTsKICAgICRvWydyaWJhJ109YXJyYXkoJ3BlcmonPT5nZXRfb3B0aW9uKCdwc19wZXJqdW5naW1vX2RhdGEnKSwnYWRhcHRfcmliYSc9PmdldF9vcHRpb24oJ3BzX2lzdF9hZGFwdF9yaWJhJykpOwogICAgJG9bJ29wdHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSxMRUZUKG9wdGlvbl92YWx1ZSw2MCkgdiBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAncHNfaXN0XyUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX2FuYWxpeiUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX3BlcmolJyIsQVJSQVlfQSk7CiAgICAkb1snY3JvbiddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoYXJyYXlfa2V5cyhhcnJheV9tZXJnZSguLi5hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKF9nZXRfY3Jvbl9hcnJheSgpLCdpc19hcnJheScpKSkpLGZ1bmN0aW9uKCRrKXtyZXR1cm4gc3RycG9zKCRrLCdwc18nKT09PTA7fSkpOwogICAgJG9bJ2NvbnNlbnRfc3luY19tZDUnXT1tZDVfZmlsZShXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtY29uc2VudC1zeW5jLnBocCcpOwogICAgJG9bJ3RwbCddPWFycmF5KCk7IGZvcmVhY2goYXJyYXkoJ29yZGVyLXBhaWQnLCdkdW5uaW5nLTEnLCdmb3VuZGluZycpIGFzICR0KXsgJGM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL3RlbXBsYXRlcy9lbWFpbHMvJy4kdC4nLnBocCcpOyAkb1sndHBsJ11bJHRdPShzdHJwb3MoJGMsJ1BldHNob3BfRW1haWxfTGF5b3V0JykhPT1mYWxzZT8nbGF5b3V0JzonU0VOQVMnKS4nICcuKHN0cnBvcygkYywncHNfc3ZlaWtpJykhPT1mYWxzZT8nc3ZlaWtpJzonLScpLicgJy5tZDUoJGMpOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-073323';
const GKEY='ps_rc';
const PHASES=["GO"];
const OUT='analize/s1550_recon.json';
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
