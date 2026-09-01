process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTQ3IHJlY29uMiBhZGFwdGVyaXMgKi8KYWRkX2FjdGlvbignaW5pdCcsZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3JjJ10pfHwkX0dFVFsncHNfcmMnXSE9PSdHTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCd2Jz0+J1MxNTQ3YicpOwogIHRyeXsKICAgICRvWydvcHRfcGVyc3RhdHl0YSddPWdldF9vcHRpb24oJ3BzX2lzdF9hZGFwdF9wZXJzdGF0eXRhJyk7ICRvWydvcHRfcm9kaW5pYWknXT1nZXRfb3B0aW9uKCdwc19pc3RfYWRhcHRfcm9kaW5pYWknKTsKICAgICRhbGw9Z2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpOyAkb1snbXVfdmlzaSddPWFycmF5X21hcCgnYmFzZW5hbWUnLCRhbGwpOwogICAgZm9yZWFjaCgkYWxsIGFzICRwKXsgJGM9ZmlsZV9nZXRfY29udGVudHMoJHApOyBpZihwcmVnX21hdGNoKCcvaXN0X2FkYXB0fFBldHNob3BfSXN0fHBzX2lzdF98c2FsdGluaXNfanVuZ2lrbGlzfGVTaG9wcmVudC9pJywkYykpeyBwcmVnX21hdGNoX2FsbCgnL14uKihpc3RfYWRhcHR8UGV0c2hvcF9Jc3R8cHNfaXN0X3xlU2hvcHJlbnQpLiokL21pJywkYywkbSk7ICRvWydncmVwJ11bYmFzZW5hbWUoJHApXT1hcnJheV9zbGljZShhcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiBtYl9zdWJzdHIodHJpbSgkeCksMCwxNjApO30sJG1bMF0pLDAsMjUpOyB9IH0KICAgICRvWyd2aWV3cyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIEZVTEwgVEFCTEVTIFdIRVJFIFRhYmxlX3R5cGU9J1ZJRVcnIik7CiAgICAkb1sndGFibGVzX2lzdCddPSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICd7JHdwZGItPnByZWZpeH1wc18laXN0JSciKTsKICAgICRvWyd0YWJsZXNfYWRhcHQnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyR3cGRiLT5wcmVmaXh9cHNfJWFkYXB0JSciKTsKICAgICRvWydzbmlwcGV0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICclYWRhcHQlJyBPUiBuYW1lIExJS0UgJyVpc3RvciUnIE9SIG5hbWUgTElLRSAnJVMxNTQlJyIsQVJSQVlfQSk7CiAgICAkb1snYmFja3VwcyddPWFycmF5X21hcCgnYmFzZW5hbWUnLGdsb2IoV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMvKlMxNTQqJykpOwogICAgJG9bJ2Jha19hbGxfcmVjZW50J109YXJyYXlfc2xpY2UoYXJyYXlfbWFwKCdiYXNlbmFtZScsYXJyYXlfZmlsdGVyKGdsb2IoV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMvKicpLGZ1bmN0aW9uKCRmKXtyZXR1cm4gZmlsZW10aW1lKCRmKT5zdHJ0b3RpbWUoJzIwMjYtMDgtMzEgMTI6MDAnKTt9KSksMCwzMCk7CiAgICBmb3JlYWNoKGFycmF5KCdwZXRzaG9wLWF0YXNrYWl0YS1hdHNhcmdvcycsJ3BldHNob3AtYXRhc2thaXRhLWtsaWVudGFpJywncGV0c2hvcC1hdGFza2FpdGEtcHJla2VzJywncGV0c2hvcC1kaW0ta2xpZW50YWknKSBhcyAkZil7ICRvWydtdGltZSddWyRmXT1kYXRlKCdZLW0tZCBIOmknLGZpbGVtdGltZShXUE1VX1BMVUdJTl9ESVIuJy8nLiRmLicucGhwJykpLicgdicuKHByZWdfbWF0Y2goJy9WZXJzaW9uOlxzKihbXGQuXSspLycsZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvJy4kZi4nLnBocCcpLCRtbSk/JG1tWzFdOic/Jyk7IH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-073107';
const GKEY='ps_rc';
const PHASES=["GO"];
const OUT='analize/s1547_recon2.json';
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
