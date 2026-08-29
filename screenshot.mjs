process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEExMiBBZG1pbiB2MS4yIGRpZWdpbWFzICsgcGF0aWtyYSB2MS4wICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICR2PWlzc2V0KCRfR0VUWydwc19iaXMnXSk/JF9HRVRbJ3BzX2JpcyddOicnOwogIGlmKCFpbl9hcnJheSgkdixhcnJheSgnQTEyJywnQTEzJyksdHJ1ZSkpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J0ExMi12MS4wJywnZmF6ZSc9PiR2KTsKICB0cnl7CiAgICBpZigkdj09PSdBMTInKXsKICAgICAgJE1ENT0nYmE0MzhhZTAyNGQyNDViZDljY2VmYmE1NjEzOGYzMDgnOyAkZm49J3BldHNob3AtbGFuZ2FpLWFkbWluLnBocCc7ICRkc3Q9V1BNVV9QTFVHSU5fRElSLicvJy4kZm47CiAgICAgICRvWydwcmllcyddPWZpbGVfZXhpc3RzKCRkc3QpP21kNV9maWxlKCRkc3QpOidORVJBJzsKICAgICAgJHI9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlL21haW4vZGVwbG95LycuJGZuLicuYjY0P3Y9Jy4kTUQ1LictJy50aW1lKCksYXJyYXkoJ3RpbWVvdXQnPT4zMCwnaGVhZGVycyc9PmFycmF5KCdDYWNoZS1Db250cm9sJz0+J25vLWNhY2hlJywnUHJhZ21hJz0+J25vLWNhY2hlJykpKTsKICAgICAgaWYoaXNfd3BfZXJyb3IoJHIpKXsgJG9bJ1NUT1AnXT0nZmV0Y2gnOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogICAgICAkaz1iYXNlNjRfZGVjb2RlKHRyaW0od3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpKSk7CiAgICAgIGlmKG1kNSgkaykhPT0kTUQ1KXsgJG9bJ1NUT1AnXT0nQ0ROIHNlbmE6ICcubWQ1KCRrKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICAgICAgaWYoQHRva2VuX2dldF9hbGwoJGssVE9LRU5fUEFSU0UpPT09ZmFsc2UpeyAkb1snU1RPUCddPSdTSU5UQUtTRSc7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAgICAgICRiPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzJzsgaWYoIWlzX2RpcigkYikpIHdwX21rZGlyX3AoJGIpOwogICAgICBjb3B5KCRkc3QsJGIuJy8nLiRmbi4nLmJha18nLmdtZGF0ZSgnWW1kX0hpcycpKTsKICAgICAgZmlsZV9wdXRfY29udGVudHMoJGRzdCwkayk7CiAgICAgICRvWydwbyddPW1kNV9maWxlKCRkc3QpOyAkb1snaXJhc3l0YSddPSgkb1sncG8nXT09PSRNRDUpPydPSyc6J05FUEFWWUtPJzsKICAgIH0KICAgIGlmKCR2PT09J0ExMycpewogICAgICAkYWRtPWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSwnZmllbGRzJz0+J0lEJykpOwogICAgICBpZihpc3NldCgkYWRtWzBdKSkgd3Bfc2V0X2N1cnJlbnRfdXNlcigoaW50KSRhZG1bMF0pOwoKICAgICAgLyogMS4gc2FyYXNhczoga2llayByZWRhZ3VvamFtdSAqLwogICAgICAkcj1hcnJheSgndGFpcCc9PjAsJ25lJz0+YXJyYXkoKSk7CiAgICAgIGZvcmVhY2goUGV0c2hvcF9FbWFpbF9EaXNwYXRjaDo6Zmxvd3MoKSBhcyAkZj0+JGMpewogICAgICAgIGxpc3QoJG9rLCRrb2RlbCk9UGV0c2hvcF9MYW5nYWlfQWRtaW46OnJlZGFndW9qYW1hcygkZik7CiAgICAgICAgaWYoJG9rKSAkclsndGFpcCddKys7IGVsc2UgJHJbJ25lJ11bJGZdPSRrb2RlbDsKICAgICAgfQogICAgICAkb1snMV9yZWRhZ3VvamFtaSddPSRyOwoKICAgICAgLyogMi4gYXIganVvZHJhc2NpYWkgdHVyaSBpdGVtcyBibG9rdXMgKi8KICAgICAgJG9bJzJfaXRlbXNfYmxva2FpJ109YXJyYXkoKTsKICAgICAgZm9yZWFjaChhcnJheSgnY2FydF9hYmFuZG9uZWQnLCdjYXJ0X2FiYW5kb25lZF8yJywncG9zdF9wdXJjaGFzZV8yZCcpIGFzICRmKXsKICAgICAgICAkaj1QZXRzaG9wX0xhaXNrYWlfVHVyaW55czo6anVvZHJhc3RpcygkZik7CiAgICAgICAgJHRpcGFpPWFycmF5KCk7CiAgICAgICAgZm9yZWFjaCgoJGpbJ2Jsb2NrcyddPz9hcnJheSgpKSBhcyAkYil7ICR0aXBhaVtdPSRiWyd0J10uKGlzc2V0KCRiWydzYWx0aW5pcyddKT8nOicuJGJbJ3NhbHRpbmlzJ106JycpOyB9CiAgICAgICAgJG9bJzJfaXRlbXNfYmxva2FpJ11bJGZdPWltcGxvZGUoJyDCtyAnLCR0aXBhaSk7CiAgICAgIH0KCiAgICAgIC8qIDMuIHBlcnppdXJhIHN1IHByZWtlbWlzIHJlYWxpYWkgcm9kbyBzYXJhc2EgKi8KICAgICAgJHA9UGV0c2hvcF9MYWlza2FpX1R1cmlueXM6OnBlcnppdXJhKCdjYXJ0X2FiYW5kb25lZCcsMCk7CiAgICAgICRvWyczX3BlcnppdXJhJ109YXJyYXkoJ29rJz0+JHBbJ29rJ10sJ3lyYV91bCc9PnN0cnBvcygkcFsnaHRtbCddLCc8dWwgc3R5bGU9Im1hcmdpbjowO3BhZGRpbmctbGVmdDoxOHB4OyI+JykhPT1mYWxzZT8nVEFJUCc6J05FJywKICAgICAgICAneXJhX3ByZWtlJz0+c3RycG9zKCRwWydodG1sJ10sJ0pvc2VyYScpIT09ZmFsc2U/J1RBSVAnOidORScsJ2lsZ2lzJz0+c3RybGVuKCRwWydodG1sJ10pKTsKCiAgICAgIC8qIDQuIGZvcm1vcyBwYXJzZXJpczogaXRlbXMgYmxva2FzIGlzIFBPU1QgKi8KICAgICAgJF9QT1NUPWFycmF5KCdzdWJqZWN0Jz0+J1gnLCdiJz0+YXJyYXkoCiAgICAgICAgYXJyYXkoJ3QnPT4ncCcsJ3RleHQnPT4nVGVrc3RhcycpLAogICAgICAgIGFycmF5KCd0Jz0+J2l0ZW1zJywnc2FsdGluaXMnPT4nY2FydF9pdGVtcycsJ3N0aWxpdXMnPT4nc2FyYXNhcycsJ2tpZWtpcyc9PicxJyksCiAgICAgICAgYXJyYXkoJ3QnPT4nc2Vjb25kYXJ5Jywnc2FsdGluaXMnPT4ncHJvZHVjdHMnLCdwcmFsZWlzdGknPT4nMScpLAogICAgICApKTsKICAgICAgJHJtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0xhbmdhaV9BZG1pbicsJ2lzX3Bvc3RvJyk7ICRybS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICAgICAgJGQ9JHJtLT5pbnZva2UobnVsbCk7CiAgICAgICRvWyc0X3BhcnNlcmlzJ109JGRbJ2Jsb2NrcyddOwogICAgICAkb1snNF92YWxpZGFjaWphJ109UGV0c2hvcF9MYWlza2FpX1R1cmlueXM6OnBhdGlrcmludGkoJGQpOwogICAgICAkb1snYnVzZW5hJ109UGV0c2hvcF9MYWlza2FpX1R1cmlueXM6OmJ1c2VuYSgpOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='A12-A13-184029';
const GKEY='ps_bis';
const PHASES=["A12", "A13"];
const OUT='analize/a12.json';
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
