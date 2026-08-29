process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEUxMSBFbWFpbCBMYXlvdXQgcGFyYXNhaSB2MS4wIChyZWFkLW9ubHkpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2JpcyddKT8kX0dFVFsncHNfYmlzJ106JycpICE9PSAnRTExJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nRTExLXYxLjAnKTsKICB0cnl7CiAgICBpZighY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0VtYWlsX0xheW91dCcpKXsgJG9bJ1NUT1AnXT0nUGV0c2hvcF9FbWFpbF9MYXlvdXQgTkVSQSc7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAgICAkcmM9bmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9FbWFpbF9MYXlvdXQnKTsKICAgICRvWydmYWlsYXMnXT1zdHJfcmVwbGFjZShXUF9DT05URU5UX0RJUiwnJywkcmMtPmdldEZpbGVOYW1lKCkpOwogICAgJEw9ZmlsZSgkcmMtPmdldEZpbGVOYW1lKCkpOyAkb1snZWlsdWNpdSddPWNvdW50KCRMKTsKICAgIGZvcmVhY2goJHJjLT5nZXRNZXRob2RzKCkgYXMgJG1lKXsKICAgICAgaWYoJG1lLT5jbGFzcyE9PSdQZXRzaG9wX0VtYWlsX0xheW91dCcpIGNvbnRpbnVlOwogICAgICAkcGFyPWFycmF5KCk7CiAgICAgIGZvcmVhY2goJG1lLT5nZXRQYXJhbWV0ZXJzKCkgYXMgJHApewogICAgICAgICR0PSRwLT5nZXRUeXBlKCk7ICRzPSgkdD8kdC4nICc6JycpLickJy4kcC0+Z2V0TmFtZSgpOwogICAgICAgIGlmKCRwLT5pc0RlZmF1bHRWYWx1ZUF2YWlsYWJsZSgpKXsgJGQ9JHAtPmdldERlZmF1bHRWYWx1ZSgpOyAkcy49Jz0nLihpc19hcnJheSgkZCk/J1tdJzp2YXJfZXhwb3J0KCRkLHRydWUpKTsgfQogICAgICAgICRwYXJbXT0kczsKICAgICAgfQogICAgICAkb1snbWV0b2RhaSddW109KCRtZS0+aXNTdGF0aWMoKT8nc3RhdGljICc6JycpLiRtZS0+Z2V0TmFtZSgpLicoJy5pbXBsb2RlKCcsICcsJHBhcikuJyknOwogICAgfQogICAgLyogd3JhcCgpIGlyIHNlY29uZGFyeSgpIHNhbHRpbmlzICovCiAgICBmb3JlYWNoKGFycmF5KCd3cmFwJywnc2Vjb25kYXJ5JywnYnV0dG9uJywncCcpIGFzICRtKXsKICAgICAgaWYoIW1ldGhvZF9leGlzdHMoJ1BldHNob3BfRW1haWxfTGF5b3V0JywkbSkpIGNvbnRpbnVlOwogICAgICAkcj1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9FbWFpbF9MYXlvdXQnLCRtKTsKICAgICAgJG9bJ3NyY18nLiRtXT1pbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRMLCRyLT5nZXRTdGFydExpbmUoKS0xLG1pbigkci0+Z2V0RW5kTGluZSgpLSRyLT5nZXRTdGFydExpbmUoKSsxLDcwKSkpOwogICAgfQogICAgLyogYXIgeXJhIGphdSBrb2tpYSBub3JzIHBzX2VtYWlsX2NvbnRlbnQgbGVudGVsZSAqLwogICAgZ2xvYmFsICR3cGRiOyAkVD0kd3BkYi0+cHJlZml4Lidwc19lbWFpbF9jb250ZW50JzsKICAgICRvWydsZW50ZWxlX3lyYSddPSgkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJFQnIik9PT0kVCk/J1RBSVAnOiduZSc7CiAgICAvKiBhciBlZ3ppc3R1b2phIG1lbml1IHBldHNob3AtbGFuZ2FpICovCiAgICAkb1snbWVuaXVfcGV0c2hvcCddPWFycmF5KCk7CiAgICBnbG9iYWwgJG1lbnU7IGlmKGlzX2FycmF5KCRtZW51KSkgZm9yZWFjaCgkbWVudSBhcyAkbSl7IGlmKGlzc2V0KCRtWzJdKSYmc3RycG9zKCRtWzJdLCdwZXRzaG9wJykhPT1mYWxzZSkgJG9bJ21lbml1X3BldHNob3AnXVtdPSRtWzJdOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAICcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='E11-162304';
const GKEY='ps_bis';
const PHASES=["E11"];
const OUT='analize/e11.json';
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
