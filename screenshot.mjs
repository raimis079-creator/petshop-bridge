process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIE5MIGJsb2thcyBkaWFnICovCmFkZF9hY3Rpb24oJ3RlbXBsYXRlX3JlZGlyZWN0JywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX25sYiddKXx8JF9HRVRbJ3BzX25sYiddIT09J0QnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidOTEIzJywndXJpJz0+JF9TRVJWRVJbJ1JFUVVFU1RfVVJJJ10sJ2lzX2Zyb250Jz0+aXNfZnJvbnRfcGFnZSgpKTsKICB0cnl7CiAgICBkb19hY3Rpb24oJ3dwX2VucXVldWVfc2NyaXB0cycpOwogICAgJHdzPXdwX3NjcmlwdHMoKTsgJG9bJ3F1ZXVlX25sJ109aW5fYXJyYXkoJ3BldHNob3AtbmV3c2xldHRlcicsJHdzLT5xdWV1ZSk7ICRvWydxdWV1ZV9uJ109Y291bnQoJHdzLT5xdWV1ZSk7CiAgICAkb1sncmVnaXN0ZXJlZF9ubCddPWlzc2V0KCR3cy0+cmVnaXN0ZXJlZFsncGV0c2hvcC1uZXdzbGV0dGVyJ10pOwogICAgJG9bJ2Zvb3Rlcl9jbGFzcyddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9OZXdzbGV0dGVyX0Zvb3RlcicpOyAkb1snaGFzX2ZpbHRlcl9mb3JjZSddPWhhc19maWx0ZXIoJ3BldHNob3BfbmV3c2xldHRlcl9mb3JjZV9hc3NldHMnKTsKICAgICRqcz1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2Fzc2V0cy9uZXdzbGV0dGVyLmpzJzsgJG9bJ2pzX2V4aXN0cyddPWZpbGVfZXhpc3RzKCRqcyk7IGlmKGZpbGVfZXhpc3RzKCRqcykpeyAkYz1maWxlX2dldF9jb250ZW50cygkanMpOyAkb1snanNfbWQ1J109bWQ1KCRjKTsgJG9bJ2pzJ109JGM7IH0KICAgICRvWydmb290ZXJfbWQ1J109bWQ1KGZpbGVfZ2V0X2NvbnRlbnRzKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtbmV3c2xldHRlci1mb290ZXIucGhwJykpOwogICAgLy8gUkVTVCBiZSBzYWx1dGluaXUgZWZla3R1CiAgICAkcj1uZXcgV1BfUkVTVF9SZXF1ZXN0KCdQT1NUJywnL3BldHNob3AvdjEvbmV3c2xldHRlci1zdWJzY3JpYmUnKTsgJHItPnNldF9oZWFkZXIoJ0NvbnRlbnQtVHlwZScsJ2FwcGxpY2F0aW9uL2pzb24nKTsgJHItPnNldF9ib2R5KGpzb25fZW5jb2RlKGFycmF5KCdlbWFpbCc9Pid4QGV4YW1wbGUuY29tJywnY29uc2VudCc9PmZhbHNlKSkpOwogICAgJHJlcz1yZXN0X2RvX3JlcXVlc3QoJHIpOyAkb1sncmVzdF9zdGF0dXMnXT0kcmVzLT5nZXRfc3RhdHVzKCk7ICRvWydyZXN0X2JvZHknXT0kcmVzLT5nZXRfZGF0YSgpOwogICAgJG9bJ2NvbnNlbnRfc3luYyddPWNsYXNzX2V4aXN0cygnUGV0c2hvcF9Db25zZW50X1N5bmMnKSYmbWV0aG9kX2V4aXN0cygnUGV0c2hvcF9Db25zZW50X1N5bmMnLCdzZXRfbWFya2V0aW5nX2NvbnNlbnQnKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-072906';
const GKEY='ps_nlb';
const PHASES=["D"];
const OUT='analize/nlb_diag.json';
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
